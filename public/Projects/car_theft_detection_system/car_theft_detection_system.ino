/*
  Smart Car Theft Detection System
  ESP32 based silent intelligent theft detection + instant mobile alert
  Sensors: Vibration Sensor (SW-420), Door Magnetic Sensor (Reed Switch), GPS (NEO-6M, optional)
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>

// ---------- Pin Definitions ----------
#define VIBRATION_PIN        34   // Vibration sensor (analog/digital)
#define DOOR_SENSOR_PIN      32   // Magnetic reed switch (digital)
#define BUZZER_PIN           25
#define LED_ARMED_PIN        26
#define LED_ALERT_PIN        27
#define SIREN_RELAY_PIN      33   // External siren/horn relay

#define GPS_RX_PIN           16
#define GPS_TX_PIN           17
#define USE_GPS              true

// ---------- Thresholds ----------
const int VIBRATION_THRESHOLD = 2500; // analog threshold for tamper detection
const unsigned long ARM_DELAY_MS = 5000;     // delay after arming before active
const unsigned long ALERT_COOLDOWN_MS = 15000; // avoid alert spam

// ---------- WiFi ----------
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ---------- Notification Endpoint (e.g. Telegram Bot / Push API / Server) ----------
const char* alertServerURL = "http://your-server.com/api/theft-alert"; // replace with your endpoint

// ---------- Objects ----------
HardwareSerial gpsSerial(1);
TinyGPSPlus gps;

// ---------- Variables ----------
bool systemArmed = false;
unsigned long armTime = 0;
bool systemActive = false; // true after arm delay passes

int vibrationValue = 0;
bool doorOpen = false;
bool tamperDetected = false;

unsigned long lastAlertTime = 0;

double latitude = 0.0;
double longitude = 0.0;
bool gpsFixValid = false;

unsigned long lastReadTime = 0;
const unsigned long readInterval = 200;

enum SystemStatus { DISARMED, ARMING, ARMED, ALERT };
SystemStatus systemStatus = DISARMED;

void setup() {
  Serial.begin(115200);

  pinMode(DOOR_SENSOR_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_ARMED_PIN, OUTPUT);
  pinMode(LED_ALERT_PIN, OUTPUT);
  pinMode(SIREN_RELAY_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(SIREN_RELAY_PIN, LOW);

  if (USE_GPS) {
    gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  }

  connectWiFi();

  Serial.println("Smart Car Theft Detection System Initialized");
  Serial.println("Send 'ARM' or 'DISARM' via Serial to control system (replace with app/RF remote in production).");
}

void loop() {
  unsigned long now = millis();

  handleSerialCommands(); // placeholder for remote arm/disarm trigger

  if (USE_GPS) readGPS();

  if (now - lastReadTime >= readInterval) {
    lastReadTime = now;
    readSensors();
    updateSystemState(now);
    evaluateTamper(now);
    updateIndicators();
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

// ---------- Remote Control (placeholder - replace with app/RF/Bluetooth) ----------
void handleSerialCommands() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.equalsIgnoreCase("ARM")) {
      armSystem();
    } else if (cmd.equalsIgnoreCase("DISARM")) {
      disarmSystem();
    }
  }
}

void armSystem() {
  systemArmed = true;
  systemActive = false;
  armTime = millis();
  systemStatus = ARMING;
  Serial.println("System ARMING... (exit delay active)");
}

void disarmSystem() {
  systemArmed = false;
  systemActive = false;
  systemStatus = DISARMED;
  digitalWrite(SIREN_RELAY_PIN, LOW);
  noTone(BUZZER_PIN);
  Serial.println("System DISARMED.");
}

// ---------- Sensor Reading ----------
void readSensors() {
  vibrationValue = analogRead(VIBRATION_PIN);
  doorOpen = (digitalRead(DOOR_SENSOR_PIN) == HIGH); // HIGH = door open (depends on wiring)
}

// ---------- GPS Reading ----------
void readGPS() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }
  if (gps.location.isValid()) {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
    gpsFixValid = true;
  } else {
    gpsFixValid = false;
  }
}

// ---------- System State Management ----------
void updateSystemState(unsigned long now) {
  if (systemArmed && !systemActive) {
    if (now - armTime >= ARM_DELAY_MS) {
      systemActive = true;
      systemStatus = ARMED;
      Serial.println("System ARMED and active.");
    }
  }
}

// ---------- Tamper Evaluation ----------
void evaluateTamper(unsigned long now) {
  if (!systemActive) {
    tamperDetected = false;
    return;
  }

  bool vibrationTamper = vibrationValue >= VIBRATION_THRESHOLD;
  bool doorTamper = doorOpen;

  if (vibrationTamper || doorTamper) {
    tamperDetected = true;
    systemStatus = ALERT;

    if (now - lastAlertTime >= ALERT_COOLDOWN_MS) {
      lastAlertTime = now;
      triggerAlert(vibrationTamper, doorTamper);
    }
  } else {
    tamperDetected = false;
    if (systemStatus == ALERT) {
      systemStatus = ARMED; // reset to armed once tamper clears (siren can be made latching if desired)
    }
  }
}

// ---------- Alert Trigger ----------
void triggerAlert(bool vibration, bool door) {
  Serial.println("🚨 THEFT ALERT TRIGGERED 🚨");
  if (vibration) Serial.println("→ Vibration/tamper detected.");
  if (door) Serial.println("→ Door opened without authorization.");

  digitalWrite(SIREN_RELAY_PIN, HIGH);
  tone(BUZZER_PIN, 2500);

  sendMobileAlert(vibration, door);
}

// ---------- Send Alert to Server/Mobile ----------
void sendMobileAlert(bool vibration, bool door) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Cannot send remote alert.");
    return;
  }

  HTTPClient http;
  http.begin(alertServerURL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"event\":\"theft_alert\",";
  payload += "\"vibration\":" + String(vibration ? "true" : "false") + ",";
  payload += "\"door_open\":" + String(door ? "true" : "false") + ",";
  if (gpsFixValid) {
    payload += "\"latitude\":" + String(latitude, 6) + ",";
    payload += "\"longitude\":" + String(longitude, 6);
  } else {
    payload += "\"latitude\":null,\"longitude\":null";
  }
  payload += "}";

  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    Serial.println("Alert sent. HTTP code: " + String(httpCode));
  } else {
    Serial.println("Failed to send alert. Error: " + http.errorToString(httpCode));
  }
  http.end();
}

// ---------- Indicators ----------
void updateIndicators() {
  digitalWrite(LED_ARMED_PIN, (systemStatus == ARMED || systemStatus == ARMING) ? HIGH : LOW);
  digitalWrite(LED_ALERT_PIN, systemStatus == ALERT ? HIGH : LOW);

  if (systemStatus != ALERT) {
    digitalWrite(SIREN_RELAY_PIN, LOW);
    noTone(BUZZER_PIN);
  }
}
