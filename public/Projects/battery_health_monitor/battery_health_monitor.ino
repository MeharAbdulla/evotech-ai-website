/*
  Smart Battery Health Monitoring System
  ESP32 based car battery monitor with life prediction
  Sensors: Voltage Divider (Battery Voltage), ACS712 (Current)
*/

#include <WiFi.h>

// ---------- Pin Definitions ----------
#define VOLTAGE_SENSOR_PIN   34   // Analog pin - voltage divider output
#define CURRENT_SENSOR_PIN   35   // Analog pin - ACS712 output
#define BUZZER_PIN           25
#define LED_OK_PIN           26
#define LED_WARNING_PIN      27
#define LED_CRITICAL_PIN     14

// ---------- Voltage Divider Calibration ----------
// Example: R1 = 30k, R2 = 7.5k  => ratio = (R1+R2)/R2
const float VOLTAGE_DIVIDER_RATIO = 5.0;
const float ADC_REF_VOLTAGE = 3.3;
const int ADC_RESOLUTION = 4095;

// ---------- ACS712 Calibration ----------
// ACS712-30A: sensitivity = 66 mV/A, ACS712-20A: 100 mV/A, ACS712-5A: 185 mV/A
const float ACS712_SENSITIVITY = 0.066; // V per A (30A variant)
const float ACS712_ZERO_VOLTAGE = 2.5;  // Vcc/2 at 0A

// ---------- Thresholds ----------
const float VOLTAGE_FULL        = 12.6;
const float VOLTAGE_GOOD_MIN    = 12.2;
const float VOLTAGE_WARNING_MIN = 11.8;
const float VOLTAGE_CRITICAL_MIN= 11.5;

const float CURRENT_DISCHARGE_WARNING = 15.0; // Amps drawn
const float CURRENT_DISCHARGE_CRITICAL = 25.0;

// ---------- WiFi ----------
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ---------- Variables ----------
float batteryVoltage = 0.0;
float batteryCurrent = 0.0;
unsigned long lastReadTime = 0;
const unsigned long readInterval = 2000;

#define HISTORY_SIZE 20
float voltageHistory[HISTORY_SIZE];
int historyIndex = 0;
bool historyFilled = false;

float estimatedSOC = 100.0;       // State of Charge %
float estimatedSOH = 100.0;       // State of Health %
unsigned long monitorStartTime = 0;
float voltageDropRate = 0.0;      // V per hour

enum HealthStatus { OK, WARNING, CRITICAL };
HealthStatus batteryStatus = OK;

void setup() {
  Serial.begin(115200);

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_OK_PIN, OUTPUT);
  pinMode(LED_WARNING_PIN, OUTPUT);
  pinMode(LED_CRITICAL_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  connectWiFi();

  monitorStartTime = millis();
  Serial.println("Smart Battery Health Monitoring System Initialized");
}

void loop() {
  unsigned long now = millis();

  if (now - lastReadTime >= readInterval) {
    lastReadTime = now;

    readSensors();
    updateHistory();
    calculateSOC();
    calculateSOH();
    evaluateBatteryHealth();
    updateIndicators();
    predictBatteryLife();
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
  int rawVoltage = analogRead(VOLTAGE_SENSOR_PIN);
  float adcVoltage = (rawVoltage / (float)ADC_RESOLUTION) * ADC_REF_VOLTAGE;
  batteryVoltage = adcVoltage * VOLTAGE_DIVIDER_RATIO;

  int rawCurrent = analogRead(CURRENT_SENSOR_PIN);
  float sensorVoltage = (rawCurrent / (float)ADC_RESOLUTION) * ADC_REF_VOLTAGE;
  batteryCurrent = (sensorVoltage - ACS712_ZERO_VOLTAGE) / ACS712_SENSITIVITY;
}

// ---------- History ----------
void updateHistory() {
  voltageHistory[historyIndex] = batteryVoltage;
  historyIndex = (historyIndex + 1) % HISTORY_SIZE;
  if (historyIndex == 0) historyFilled = true;
}

float getAverageVoltage() {
  int count = historyFilled ? HISTORY_SIZE : historyIndex;
  if (count == 0) return batteryVoltage;
  float sum = 0;
  for (int i = 0; i < count; i++) sum += voltageHistory[i];
  return sum / count;
}

// ---------- State of Charge Estimation ----------
void calculateSOC() {
  // Simple linear approximation between critical and full voltage
  estimatedSOC = ((batteryVoltage - VOLTAGE_CRITICAL_MIN) /
                  (VOLTAGE_FULL - VOLTAGE_CRITICAL_MIN)) * 100.0;
  estimatedSOC = constrain(estimatedSOC, 0, 100);
}

// ---------- State of Health Estimation ----------
void calculateSOH() {
  float avgVoltage = getAverageVoltage();
  float elapsedHours = (millis() - monitorStartTime) / 3600000.0;

  if (elapsedHours > 0.01) {
    voltageDropRate = (VOLTAGE_FULL - avgVoltage) / elapsedHours;
  }

  // Penalize SOH based on excessive voltage drop rate under load
  float degradationFactor = constrain(voltageDropRate * 2.0, 0, 40);
  estimatedSOH = 100.0 - degradationFactor;
  estimatedSOH = constrain(estimatedSOH, 0, 100);
}

// ---------- Health Evaluation ----------
void evaluateBatteryHealth() {
  if (batteryVoltage <= VOLTAGE_CRITICAL_MIN ||
      batteryCurrent >= CURRENT_DISCHARGE_CRITICAL) {
    batteryStatus = CRITICAL;
  } else if (batteryVoltage <= VOLTAGE_WARNING_MIN ||
             batteryCurrent >= CURRENT_DISCHARGE_WARNING) {
    batteryStatus = WARNING;
  } else {
    batteryStatus = OK;
  }
}

// ---------- Indicators ----------
void updateIndicators() {
  digitalWrite(LED_OK_PIN, batteryStatus == OK ? HIGH : LOW);
  digitalWrite(LED_WARNING_PIN, batteryStatus == WARNING ? HIGH : LOW);
  digitalWrite(LED_CRITICAL_PIN, batteryStatus == CRITICAL ? HIGH : LOW);

  if (batteryStatus == CRITICAL) {
    tone(BUZZER_PIN, 2000);
  } else if (batteryStatus == WARNING) {
    tone(BUZZER_PIN, 1000, 200);
  } else {
    noTone(BUZZER_PIN);
  }
}

// ---------- Predictive Battery Life ----------
void predictBatteryLife() {
  if (voltageDropRate > 0.05) {
    float hoursRemaining = (batteryVoltage - VOLTAGE_CRITICAL_MIN) / voltageDropRate;
    if (hoursRemaining < 24 && hoursRemaining > 0) {
      Serial.print("⚠ PREDICTIVE ALERT: Estimated time to critical voltage: ");
      Serial.print(hoursRemaining, 1);
      Serial.println(" hours.");
      Serial.println("→ Recommend battery inspection or replacement soon.");
    }
  }

  if (estimatedSOH < 60) {
    Serial.println("⚠ PREDICTIVE ALERT: Battery health degraded significantly.");
    Serial.println("→ Battery replacement recommended.");
  }
}

// ---------- Status Output ----------
void printStatus() {
  Serial.println("----------------------------------");
  Serial.print("Battery Voltage: ");
  Serial.print(batteryVoltage, 2);
  Serial.println(" V");

  Serial.print("Battery Current: ");
  Serial.print(batteryCurrent, 2);
  Serial.println(" A");

  Serial.print("Estimated SOC: ");
  Serial.print(estimatedSOC, 1);
  Serial.println(" %");

  Serial.print("Estimated SOH: ");
  Serial.print(estimatedSOH, 1);
  Serial.println(" %");

  Serial.print("Battery Status: ");
  switch (batteryStatus) {
    case OK:       Serial.println("NORMAL ✅"); break;
    case WARNING:  Serial.println("WARNING ⚠️"); break;
    case CRITICAL: Serial.println("CRITICAL 🔴"); break;
  }
  Serial.println("----------------------------------");
}
