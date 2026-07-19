/*
  Smart Driver Fatigue Detection System
  ESP32 based drowsy driving detection
  Sensors: IR Eye Blink Sensor, Steering Vibration Sensor (SW-420)
*/

#include <WiFi.h>

// ---------- Pin Definitions ----------
#define IR_EYE_SENSOR_PIN     34   // IR blink sensor (digital/analog)
#define STEERING_VIB_PIN      35   // Steering vibration sensor
#define BUZZER_PIN            25
#define LED_OK_PIN            26
#define LED_WARNING_PIN       27
#define LED_CRITICAL_PIN      14
#define VIBRATION_MOTOR_PIN   33   // Seat/steering haptic alert

// ---------- Thresholds ----------
const unsigned long EYE_CLOSED_WARNING_MS  = 1500;  // eyes closed too long
const unsigned long EYE_CLOSED_CRITICAL_MS = 3000;
const int BLINK_RATE_LOW_THRESHOLD  = 5;   // blinks per minute (too low = drowsy)
const int BLINK_RATE_HIGH_THRESHOLD = 30;  // too high = strain/fatigue
const unsigned long STEERING_INACTIVITY_MS = 8000; // no micro-corrections = drowsy

// ---------- WiFi ----------
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ---------- Variables ----------
bool eyeClosed = false;
unsigned long eyeCloseStartTime = 0;
unsigned long lastBlinkTime = 0;
int blinkCount = 0;
unsigned long blinkWindowStart = 0;
int currentBlinkRate = 0;

int steeringVibrationValue = 0;
unsigned long lastSteeringActivityTime = 0;

unsigned long lastReadTime = 0;
const unsigned long readInterval = 100; // fast polling for eye/steering

enum FatigueStatus { ALERT_OK, DROWSY_WARNING, FATIGUE_CRITICAL };
FatigueStatus fatigueStatus = ALERT_OK;

void setup() {
  Serial.begin(115200);

  pinMode(IR_EYE_SENSOR_PIN, INPUT);
  pinMode(STEERING_VIB_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_OK_PIN, OUTPUT);
  pinMode(LED_WARNING_PIN, OUTPUT);
  pinMode(LED_CRITICAL_PIN, OUTPUT);
  pinMode(VIBRATION_MOTOR_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(VIBRATION_MOTOR_PIN, LOW);

  connectWiFi();

  blinkWindowStart = millis();
  lastSteeringActivityTime = millis();

  Serial.println("Smart Driver Fatigue Detection System Initialized");
}

void loop() {
  unsigned long now = millis();

  if (now - lastReadTime >= readInterval) {
    lastReadTime = now;

    readEyeSensor(now);
    readSteeringSensor(now);
    calculateBlinkRate(now);
    evaluateFatigueStatus(now);
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

// ---------- Eye Blink Sensor ----------
void readEyeSensor(unsigned long now) {
  int eyeState = digitalRead(IR_EYE_SENSOR_PIN); // HIGH = closed, LOW = open (depends on sensor wiring)

  if (eyeState == HIGH) {
    if (!eyeClosed) {
      eyeClosed = true;
      eyeCloseStartTime = now;
    }
  } else {
    if (eyeClosed) {
      // Eye just opened -> count as a blink
      eyeClosed = false;
      blinkCount++;
      lastBlinkTime = now;
    }
  }
}

// ---------- Blink Rate Calculation ----------
void calculateBlinkRate(unsigned long now) {
  unsigned long windowElapsed = now - blinkWindowStart;
  if (windowElapsed >= 60000) { // every 1 minute
    currentBlinkRate = blinkCount;
    blinkCount = 0;
    blinkWindowStart = now;
  }
}

// ---------- Steering Vibration Sensor ----------
void readSteeringSensor(unsigned long now) {
  steeringVibrationValue = analogRead(STEERING_VIB_PIN);

  // Any meaningful steering correction resets inactivity timer
  if (steeringVibrationValue > 500) {
    lastSteeringActivityTime = now;
  }
}

// ---------- Fatigue Evaluation ----------
void evaluateFatigueStatus(unsigned long now) {
  unsigned long eyeClosedDuration = eyeClosed ? (now - eyeCloseStartTime) : 0;
  unsigned long steeringInactivity = now - lastSteeringActivityTime;

  bool eyeCritical = eyeClosedDuration >= EYE_CLOSED_CRITICAL_MS;
  bool eyeWarning  = eyeClosedDuration >= EYE_CLOSED_WARNING_MS;

  bool blinkAbnormal = (currentBlinkRate > 0 &&
                        (currentBlinkRate < BLINK_RATE_LOW_THRESHOLD ||
                         currentBlinkRate > BLINK_RATE_HIGH_THRESHOLD));

  bool steeringInactive = steeringInactivity >= STEERING_INACTIVITY_MS;

  if (eyeCritical || (eyeWarning && steeringInactive)) {
    fatigueStatus = FATIGUE_CRITICAL;
  } else if (eyeWarning || blinkAbnormal || steeringInactive) {
    fatigueStatus = DROWSY_WARNING;
  } else {
    fatigueStatus = ALERT_OK;
  }
}

// ---------- Indicators ----------
void updateIndicators() {
  digitalWrite(LED_OK_PIN, fatigueStatus == ALERT_OK ? HIGH : LOW);
  digitalWrite(LED_WARNING_PIN, fatigueStatus == DROWSY_WARNING ? HIGH : LOW);
  digitalWrite(LED_CRITICAL_PIN, fatigueStatus == FATIGUE_CRITICAL ? HIGH : LOW);

  if (fatigueStatus == FATIGUE_CRITICAL) {
    tone(BUZZER_PIN, 2500);
    digitalWrite(VIBRATION_MOTOR_PIN, HIGH);
  } else if (fatigueStatus == DROWSY_WARNING) {
    tone(BUZZER_PIN, 1200, 300);
    digitalWrite(VIBRATION_MOTOR_PIN, LOW);
  } else {
    noTone(BUZZER_PIN);
    digitalWrite(VIBRATION_MOTOR_PIN, LOW);
  }
}

// ---------- Status Output ----------
void printStatus() {
  Serial.println("----------------------------------");
  Serial.print("Eye State: ");
  Serial.println(eyeClosed ? "CLOSED" : "OPEN");

  Serial.print("Blink Rate (per min): ");
  Serial.println(currentBlinkRate);

  Serial.print("Steering Vibration: ");
  Serial.println(steeringVibrationValue);

  Serial.print("Fatigue Status: ");
  switch (fatigueStatus) {
    case ALERT_OK:        Serial.println("ALERT / NORMAL ✅"); break;
    case DROWSY_WARNING:  Serial.println("DROWSY WARNING ⚠️"); break;
    case FATIGUE_CRITICAL:Serial.println("CRITICAL FATIGUE 🔴"); break;
  }
  Serial.println("----------------------------------");
}
