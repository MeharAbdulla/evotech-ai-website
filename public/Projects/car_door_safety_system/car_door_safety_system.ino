/*
  Smart Car Door Safety System
  ESP32 based context-aware door safety logic
  Sensors: Magnetic Door Sensors (Reed Switch) per door, GPS (NEO-6M, optional, for speed)
*/
    
#include <WiFi.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>

// ---------- Door Configuration ----------
#define NUM_DOORS 4
const char* doorNames[NUM_DOORS] = {"Front-Left", "Front-Right", "Rear-Left", "Rear-Right"};
const int doorSensorPins[NUM_DOORS] = {32, 33, 25, 26};

// ---------- Pin Definitions ----------
#define BUZZER_PIN          27
#define LED_SAFE_PIN        14
#define LED_WARNING_PIN     12
#define LED_CRITICAL_PIN    13
#define DASH_ALERT_PIN      15   // signal to dashboard / central alert system

#define GPS_RX_PIN          16
#define GPS_TX_PIN          17
#define USE_GPS             true

// ---------- Thresholds ----------
const float SPEED_MOVING_THRESHOLD_KMPH   = 5.0;   // vehicle considered moving
const float SPEED_HIGHWAY_THRESHOLD_KMPH  = 60.0;  // high-speed = critical if door opens

// ---------- WiFi ----------
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ---------- Objects ----------
HardwareSerial gpsSerial(1);
TinyGPSPlus gps;

// ---------- Variables ----------
bool doorOpen[NUM_DOORS];
bool anyDoorOpen = false;

double vehicleSpeedKmph = 0.0;
bool gpsFixValid = false;

unsigned long lastReadTime = 0;
const unsigned long readInterval = 200;

enum SafetyStatus { SAFE, WARNING, CRITICAL };
SafetyStatus safetyStatus = SAFE;

void setup() {
  Serial.begin(115200);

  for (int i = 0; i < NUM_DOORS; i++) {
    pinMode(doorSensorPins[i], INPUT_PULLUP);
    doorOpen[i] = false;
  }

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_SAFE_PIN, OUTPUT);
  pinMode(LED_WARNING_PIN, OUTPUT);
  pinMode(LED_CRITICAL_PIN, OUTPUT);
  pinMode(DASH_ALERT_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(DASH_ALERT_PIN, LOW);

  if (USE_GPS) {
    gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  }

  connectWiFi();

  Serial.println("Smart Car Door Safety System Initialized");
}

void loop() {
  unsigned long now = millis();

  if (USE_GPS) readGPS();

  if (now - lastReadTime >= readInterval) {
    lastReadTime = now;
    readDoorSensors();
    evaluateSafetyStatus();
    updateIndicators();
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

// ---------- GPS Reading (for speed) ----------
void readGPS() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }
  if (gps.speed.isValid()) {
    vehicleSpeedKmph = gps.speed.kmph();
    gpsFixValid = true;
  } else {
    gpsFixValid = false;
  }
}

// ---------- Door Sensor Reading ----------
void readDoorSensors() {
  anyDoorOpen = false;
  for (int i = 0; i < NUM_DOORS; i++) {
    doorOpen[i] = (digitalRead(doorSensorPins[i]) == HIGH); // HIGH = open (depends on wiring)
    if (doorOpen[i]) anyDoorOpen = true;
  }
}

// ---------- Context-Aware Safety Logic ----------
void evaluateSafetyStatus() {
  bool vehicleMoving = vehicleSpeedKmph >= SPEED_MOVING_THRESHOLD_KMPH;
  bool highSpeed = vehicleSpeedKmph >= SPEED_HIGHWAY_THRESHOLD_KMPH;

  if (anyDoorOpen && highSpeed) {
    safetyStatus = CRITICAL;
  } else if (anyDoorOpen && vehicleMoving) {
    safetyStatus = WARNING;
  } else if (anyDoorOpen && !vehicleMoving) {
    // Parked/stationary with door open = informational, not dangerous
    safetyStatus = SAFE;
  } else {
    safetyStatus = SAFE;
  }
}

// ---------- Indicators ----------
void updateIndicators() {
  digitalWrite(LED_SAFE_PIN, safetyStatus == SAFE ? HIGH : LOW);
  digitalWrite(LED_WARNING_PIN, safetyStatus == WARNING ? HIGH : LOW);
  digitalWrite(LED_CRITICAL_PIN, safetyStatus == CRITICAL ? HIGH : LOW);

  if (safetyStatus == CRITICAL) {
    tone(BUZZER_PIN, 2500);
    digitalWrite(DASH_ALERT_PIN, HIGH);
  } else if (safetyStatus == WARNING) {
    tone(BUZZER_PIN, 1200, 300);
    digitalWrite(DASH_ALERT_PIN, HIGH);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(DASH_ALERT_PIN, LOW);
  }
}

// ---------- Status Output ----------
void printStatus() {
  Serial.println("----------------------------------");
  for (int i = 0; i < NUM_DOORS; i++) {
    Serial.print(doorNames[i]);
    Serial.print(" Door: ");
    Serial.println(doorOpen[i] ? "OPEN" : "CLOSED");
  }

  Serial.print("Vehicle Speed: ");
  Serial.print(vehicleSpeedKmph, 1);
  Serial.println(" km/h");

  Serial.print("Safety Status: ");
  switch (safetyStatus) {
    case SAFE:     Serial.println("SAFE ✅"); break;
    case WARNING:  Serial.println("WARNING ⚠️ - Door open while moving"); break;
    case CRITICAL: Serial.println("CRITICAL 🔴 - Door open at high speed!"); break;
  }
  Serial.println("----------------------------------");
}
