/*
  Smart Crop Storage Monitoring System
  ESP32 based post-harvest protection system
  Sensors: Temperature + Humidity (DHT22), Air Quality (MQ135)
*/

#include <WiFi.h>
#include <DHT.h>

// ---------- Pin Definitions ----------
#define DHT_PIN              4
#define DHT_TYPE          DHT22
#define AIR_QUALITY_PIN      34   // MQ135 analog output

#define BUZZER_PIN           25
#define LED_OK_PIN           26
#define LED_WARNING_PIN      27
#define LED_CRITICAL_PIN     14
#define VENT_FAN_RELAY_PIN   33   // controls ventilation fan/exhaust

// ---------- Crop Storage Thresholds (general grain/produce storage) ----------
const float TEMP_SAFE_MAX_C        = 25.0;
const float TEMP_WARNING_MAX_C     = 30.0;
const float TEMP_CRITICAL_MAX_C    = 35.0;

const float HUMIDITY_SAFE_MAX      = 60.0;
const float HUMIDITY_WARNING_MAX   = 70.0;
const float HUMIDITY_CRITICAL_MAX  = 80.0;

const int AIR_QUALITY_WARNING      = 1500; // MQ135 raw value (spoilage gases/CO2 rising)
const int AIR_QUALITY_CRITICAL     = 2500;

// ---------- WiFi ----------
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ---------- Objects ----------
DHT dht(DHT_PIN, DHT_TYPE);

// ---------- Variables ----------
float temperature = 0.0;
float humidity = 0.0;
int airQualityValue = 0;

bool ventilationActive = false;

unsigned long lastReadTime = 0;
const unsigned long readInterval = 3000;

// Spoilage risk trend tracking
#define HISTORY_SIZE 10
float humidityHistory[HISTORY_SIZE];
int historyIndex = 0;
bool historyFilled = false;

enum StorageStatus { OK, WARNING, CRITICAL };
StorageStatus storageStatus = OK;

void setup() {
  Serial.begin(115200);

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_OK_PIN, OUTPUT);
  pinMode(LED_WARNING_PIN, OUTPUT);
  pinMode(LED_CRITICAL_PIN, OUTPUT);
  pinMode(VENT_FAN_RELAY_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(VENT_FAN_RELAY_PIN, LOW);

  dht.begin();
  connectWiFi();

  Serial.println("Smart Crop Storage Monitoring System Initialized");
}

void loop() {
  unsigned long now = millis();

  if (now - lastReadTime >= readInterval) {
    lastReadTime = now;

    readSensors();
    updateHistory();
    evaluateStorageStatus();
    controlVentilation();
    updateIndicators();
    predictSpoilageRisk();
    printStatus();
  }
}

// ---------- WiFi ----------
void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 10) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi connection failed. Continuing offline.");
  }
}

// ---------- Sensor Reading ----------
void readSensors() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (!isnan(t)) temperature = t;
  else Serial.println("Error: Failed to read temperature.");

  if (!isnan(h)) humidity = h;
  else Serial.println("Error: Failed to read humidity.");

  airQualityValue = analogRead(AIR_QUALITY_PIN);
}

// ---------- History for Trend Prediction ----------
void updateHistory() {
  humidityHistory[historyIndex] = humidity;
  historyIndex = (historyIndex + 1) % HISTORY_SIZE;
  if (historyIndex == 0) historyFilled = true;
}

float getAverageHumidity() {
  int count = historyFilled ? HISTORY_SIZE : historyIndex;
  if (count == 0) return humidity;
  float sum = 0;
  for (int i = 0; i < count; i++) sum += humidityHistory[i];
  return sum / count;
}

// ---------- Status Evaluation ----------
void evaluateStorageStatus() {
  bool tempCritical = temperature >= TEMP_CRITICAL_MAX_C;
  bool humidityCritical = humidity >= HUMIDITY_CRITICAL_MAX;
  bool airCritical = airQualityValue >= AIR_QUALITY_CRITICAL;

  bool tempWarning = temperature >= TEMP_WARNING_MAX_C;
  bool humidityWarning = humidity >= HUMIDITY_WARNING_MAX;
  bool airWarning = airQualityValue >= AIR_QUALITY_WARNING;

  if (tempCritical || humidityCritical || airCritical) {
    storageStatus = CRITICAL;
  } else if (tempWarning || humidityWarning || airWarning) {
    storageStatus = WARNING;
  } else {
    storageStatus = OK;
  }
}

// ---------- Ventilation Control ----------
void controlVentilation() {
  if (humidity >= HUMIDITY_WARNING_MAX || temperature >= TEMP_WARNING_MAX_C ||
      airQualityValue >= AIR_QUALITY_WARNING) {
    digitalWrite(VENT_FAN_RELAY_PIN, HIGH);
    ventilationActive = true;
  } else if (humidity < HUMIDITY_SAFE_MAX && temperature < TEMP_SAFE_MAX_C &&
             airQualityValue < AIR_QUALITY_WARNING) {
    digitalWrite(VENT_FAN_RELAY_PIN, LOW);
    ventilationActive = false;
  }
}

// ---------- Indicators ----------
void updateIndicators() {
  digitalWrite(LED_OK_PIN, storageStatus == OK ? HIGH : LOW);
  digitalWrite(LED_WARNING_PIN, storageStatus == WARNING ? HIGH : LOW);
  digitalWrite(LED_CRITICAL_PIN, storageStatus == CRITICAL ? HIGH : LOW);

  if (storageStatus == CRITICAL) {
    tone(BUZZER_PIN, 2200, 400);
  } else if (storageStatus == WARNING) {
    tone(BUZZER_PIN, 1000, 200);
  } else {
    noTone(BUZZER_PIN);
  }
}

// ---------- Spoilage Risk Prediction ----------
void predictSpoilageRisk() {
  float avgHumidity = getAverageHumidity();
  bool humidityRising = humidity > avgHumidity + 3.0;

  if (humidityRising && temperature >= TEMP_WARNING_MAX_C) {
    Serial.println("⚠ PREDICTIVE ALERT: Rising humidity + heat detected.");
    Serial.println("→ High risk of mold growth and spoilage. Increase ventilation.");
  } else if (humidityRising) {
    Serial.println("⚠ PREDICTIVE ALERT: Humidity trending upward.");
    Serial.println("→ Monitor closely for condensation risk.");
  }

  if (airQualityValue >= AIR_QUALITY_WARNING) {
    Serial.println("⚠ PREDICTIVE ALERT: Elevated gas levels detected.");
    Serial.println("→ Possible early-stage spoilage or fermentation occurring.");
  }
}

// ---------- Status Output ----------
void printStatus() {
  Serial.println("----------------------------------");
  Serial.print("Temperature: ");
  Serial.print(temperature, 1);
  Serial.println(" °C");

  Serial.print("Humidity: ");
  Serial.print(humidity, 1);
  Serial.println(" %");

  Serial.print("Air Quality (raw): ");
  Serial.println(airQualityValue);

  Serial.print("Ventilation Fan: ");
  Serial.println(ventilationActive ? "ON" : "OFF");

  Serial.print("Storage Status: ");
  switch (storageStatus) {
    case OK:       Serial.println("SAFE ✅"); break;
    case WARNING:  Serial.println("WARNING ⚠️"); break;
    case CRITICAL: Serial.println("CRITICAL 🔴"); break;
  }
  Serial.println("----------------------------------");
}
