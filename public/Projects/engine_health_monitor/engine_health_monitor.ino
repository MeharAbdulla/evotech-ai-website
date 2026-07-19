/*
  Smart Car Engine Health Monitor
  ESP32 based predictive maintenance system
  Sensors: Temperature (DS18B20/Thermistor), Vibration (SW-420/MPU6050)
  Optional: OBD-II via ELM327 (Bluetooth/UART)
*/

#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------- Pin Definitions ----------
#define TEMP_SENSOR_PIN   4      // DS18B20 data pin
#define VIBRATION_PIN     34     // SW-420 vibration sensor (analog/digital)
#define BUZZER_PIN        25     // Alert buzzer
#define LED_OK_PIN        26     // Green LED
#define LED_WARNING_PIN   27     // Yellow LED
#define LED_CRITICAL_PIN  14     // Red LED

// ---------- Thresholds ----------
#define TEMP_WARNING_C      100.0
#define TEMP_CRITICAL_C     115.0
#define VIBRATION_WARNING   2500
#define VIBRATION_CRITICAL  3500

// ---------- WiFi (optional cloud logging) ----------
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ---------- Objects ----------
OneWire oneWire(TEMP_SENSOR_PIN);
DallasTemperature tempSensor(&oneWire);

// ---------- Variables ----------
float currentTemp = 0.0;
int vibrationValue = 0;
unsigned long lastReadTime = 0;
const unsigned long readInterval = 2000; // 2 sec

// Rolling average for predictive trend
#define HISTORY_SIZE 10
float tempHistory[HISTORY_SIZE];
int vibHistory[HISTORY_SIZE];
int historyIndex = 0;
bool historyFilled = false;

enum HealthStatus { OK, WARNING, CRITICAL };
HealthStatus engineStatus = OK;

void setup() {
  Serial.begin(115200);

  pinMode(VIBRATION_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_OK_PIN, OUTPUT);
  pinMode(LED_WARNING_PIN, OUTPUT);
  pinMode(LED_CRITICAL_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);

  tempSensor.begin();

  connectWiFi();

  Serial.println("Smart Car Engine Health Monitor Initialized");
}

void loop() {
  unsigned long now = millis();

  if (now - lastReadTime >= readInterval) {
    lastReadTime = now;

    readSensors();
    updateHistory();
    evaluateEngineHealth();
    updateIndicators();
    printStatus();
    predictMaintenance();
  }
}

// ---------- WiFi Connection ----------
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
  tempSensor.requestTemperatures();
  currentTemp = tempSensor.getTempCByIndex(0);

  if (currentTemp == DEVICE_DISCONNECTED_C) {
    Serial.println("Error: Temperature sensor disconnected!");
    currentTemp = -127.0;
  }

  vibrationValue = analogRead(VIBRATION_PIN);
}

// ---------- History for Predictive Logic ----------
void updateHistory() {
  tempHistory[historyIndex] = currentTemp;
  vibHistory[historyIndex] = vibrationValue;

  historyIndex = (historyIndex + 1) % HISTORY_SIZE;
  if (historyIndex == 0) historyFilled = true;
}

float getAverageTemp() {
  int count = historyFilled ? HISTORY_SIZE : historyIndex;
  if (count == 0) return currentTemp;
  float sum = 0;
  for (int i = 0; i < count; i++) sum += tempHistory[i];
  return sum / count;
}

int getAverageVibration() {
  int count = historyFilled ? HISTORY_SIZE : historyIndex;
  if (count == 0) return vibrationValue;
  long sum = 0;
  for (int i = 0; i < count; i++) sum += vibHistory[i];
  return sum / count;
}

// ---------- Health Evaluation ----------
void evaluateEngineHealth() {
  if (currentTemp >= TEMP_CRITICAL_C || vibrationValue >= VIBRATION_CRITICAL) {
    engineStatus = CRITICAL;
  } else if (currentTemp >= TEMP_WARNING_C || vibrationValue >= VIBRATION_WARNING) {
    engineStatus = WARNING;
  } else {
    engineStatus = OK;
  }
}

// ---------- Indicators ----------
void updateIndicators() {
  digitalWrite(LED_OK_PIN, engineStatus == OK ? HIGH : LOW);
  digitalWrite(LED_WARNING_PIN, engineStatus == WARNING ? HIGH : LOW);
  digitalWrite(LED_CRITICAL_PIN, engineStatus == CRITICAL ? HIGH : LOW);

  if (engineStatus == CRITICAL) {
    tone(BUZZER_PIN, 2000);
  } else if (engineStatus == WARNING) {
    tone(BUZZER_PIN, 1000, 200);
  } else {
    noTone(BUZZER_PIN);
  }
}

// ---------- Predictive Maintenance Logic ----------
void predictMaintenance() {
  float avgTemp = getAverageTemp();
  int avgVib = getAverageVibration();

  bool tempTrendRising = currentTemp > avgTemp + 3.0;
  bool vibTrendRising = vibrationValue > avgVib + 300;

  if (tempTrendRising && vibTrendRising) {
    Serial.println("⚠ PREDICTIVE ALERT: Rising temperature + vibration trend detected.");
    Serial.println("→ Recommend inspection: possible bearing wear, coolant issue, or misfire.");
  } else if (tempTrendRising) {
    Serial.println("⚠ PREDICTIVE ALERT: Temperature trending upward.");
    Serial.println("→ Check coolant level / radiator / thermostat.");
  } else if (vibTrendRising) {
    Serial.println("⚠ PREDICTIVE ALERT: Vibration trending upward.");
    Serial.println("→ Check engine mounts / belt tension / alignment.");
  }
}

// ---------- Status Output ----------
void printStatus() {
  Serial.println("----------------------------------");
  Serial.print("Temperature: ");
  Serial.print(currentTemp);
  Serial.println(" °C");

  Serial.print("Vibration Level: ");
  Serial.println(vibrationValue);

  Serial.print("Engine Status: ");
  switch (engineStatus) {
    case OK:       Serial.println("NORMAL ✅"); break;
    case WARNING:  Serial.println("WARNING ⚠️"); break;
    case CRITICAL: Serial.println("CRITICAL 🔴"); break;
  }
  Serial.println("----------------------------------");
}
