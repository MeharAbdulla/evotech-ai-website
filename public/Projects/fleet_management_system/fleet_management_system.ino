/*
  Smart Fleet Management System
  ESP32 based real-time fleet intelligence dashboard data unit (per-vehicle)
  Sensors: GPS (NEO-6M), Fuel Level Sensor (analog), OBD-II interface (ELM327 via UART/Bluetooth)
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>

// ---------- Vehicle Identification ----------
const char* VEHICLE_ID = "FLEET-VEH-001"; // unique per vehicle, change per unit

// ---------- Pin Definitions ----------
#define GPS_RX_PIN          16
#define GPS_TX_PIN          17

#define FUEL_LEVEL_PIN      34   // Analog fuel sender input (via voltage divider/conditioning)

#define OBD_RX_PIN          18   // ELM327 UART RX
#define OBD_TX_PIN          19   // ELM327 UART TX
#define USE_OBD             true

#define LED_OK_PIN          26
#define LED_WARNING_PIN     27
#define BUZZER_PIN          25

// ---------- Calibration ----------
const int ADC_RESOLUTION = 4095;
const float ADC_REF_VOLTAGE = 3.3;
const float FUEL_TANK_EMPTY_VOLTAGE = 0.5;
const float FUEL_TANK_FULL_VOLTAGE  = 3.0;

// ---------- Thresholds ----------
const float FUEL_LOW_PERCENT = 15.0;
const float ENGINE_TEMP_WARNING_C = 105.0;
const int   RPM_REDLINE_WARNING = 5500;

// ---------- WiFi ----------
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ---------- Fleet Server Endpoint ----------
const char* serverURL = "http://your-fleet-server.com/api/vehicle-data"; // replace with your endpoint

// ---------- Objects ----------
HardwareSerial gpsSerial(1);
HardwareSerial obdSerial(2);
TinyGPSPlus gps;

// ---------- Variables ----------
double latitude = 0.0;
double longitude = 0.0;
double speedKmph = 0.0;
bool gpsFixValid = false;

float fuelLevelPercent = 0.0;
float totalDistanceKm = 0.0;
double lastLat = 0.0, lastLng = 0.0;
bool firstFix = true;

// OBD-II derived data (placeholders, parsed from ELM327 responses)
int engineRPM = 0;
float engineTempC = 0.0;
float fuelConsumptionLPer100Km = 0.0;

unsigned long lastGPSCalcTime = 0;
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 10000; // send fleet data every 10 sec

unsigned long lastOBDPollTime = 0;
const unsigned long obdPollInterval = 2000;

bool warningActive = false;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  pinMode(LED_OK_PIN, OUTPUT);
  pinMode(LED_WARNING_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  if (USE_OBD) {
    obdSerial.begin(38400, SERIAL_8N1, OBD_RX_PIN, OBD_TX_PIN);
    initOBD();
  }

  connectWiFi();

  Serial.println("Smart Fleet Management System Initialized");
  Serial.print("Vehicle ID: ");
  Serial.println(VEHICLE_ID);
}

void loop() {
  unsigned long now = millis();

  readGPS();
  readFuelLevel();

  if (USE_OBD && (now - lastOBDPollTime >= obdPollInterval)) {
    lastOBDPollTime = now;
    pollOBDData();
  }

  evaluateWarnings();
  updateIndicators();

  if (now - lastSendTime >= sendInterval) {
    lastSendTime = now;
    sendFleetData();
    printStatus();
  }
}

// ---------- WiFi ----------
void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 15) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi connection failed. Will retry on next send.");
  }
}

// ---------- OBD-II Init ----------
void initOBD() {
  Serial.println("Initializing OBD-II (ELM327)...");
  obdSerial.println("ATZ");   // reset
  delay(1000);
  obdSerial.println("ATE0");  // echo off
  delay(500);
  obdSerial.println("ATSP0"); // auto protocol
  delay(500);
  Serial.println("OBD-II ready.");
}

// ---------- OBD-II Polling ----------
void pollOBDData() {
  // Request Engine RPM (PID 0C)
  obdSerial.println("010C");
  delay(100);
  String rpmResponse = readOBDResponse();
  engineRPM = parseOBDValue(rpmResponse, 2) ; // simplified parse placeholder

  // Request Coolant Temp (PID 05)
  obdSerial.println("0105");
  delay(100);
  String tempResponse = readOBDResponse();
  engineTempC = parseOBDValue(tempResponse, 1) - 40.0; // OBD temp offset

  // Request Fuel consumption rate if supported (PID 5E) - vehicle dependent
  obdSerial.println("015E");
  delay(100);
  String fuelResponse = readOBDResponse();
  fuelConsumptionLPer100Km = parseOBDValue(fuelResponse, 2) * 0.1; // placeholder scaling
}

String readOBDResponse() {
  String response = "";
  unsigned long start = millis();
  while (millis() - start < 200) {
    while (obdSerial.available()) {
      char c = obdSerial.read();
      response += c;
    }
  }
  return response;
}

// Simplified placeholder parser - in production, parse hex bytes per PID spec
int parseOBDValue(String response, int byteCount) {
  // NOTE: Replace with proper hex parsing logic based on ELM327 response format.
  // This is a structural placeholder so the sketch compiles and runs.
  return 0;
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

    if (!firstFix) {
      totalDistanceKm += calculateDistanceKm(lastLat, lastLng, latitude, longitude);
    }
    lastLat = latitude;
    lastLng = longitude;
    firstFix = false;
  } else {
    gpsFixValid = false;
  }

  if (gps.speed.isValid()) {
    speedKmph = gps.speed.kmph();
  }
}

double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
  const double R = 6371.0;
  double dLat = radians(lat2 - lat1);
  double dLon = radians(lon2 - lon1);
  double a = sin(dLat / 2) * sin(dLat / 2) +
             cos(radians(lat1)) * cos(radians(lat2)) *
             sin(dLon / 2) * sin(dLon / 2);
  double c = 2 * atan2(sqrt(a), sqrt(1 - a));
  return R * c;
}

// ---------- Fuel Level Reading ----------
void readFuelLevel() {
  int raw = analogRead(FUEL_LEVEL_PIN);
  float voltage = (raw / (float)ADC_RESOLUTION) * ADC_REF_VOLTAGE;
  fuelLevelPercent = ((voltage - FUEL_TANK_EMPTY_VOLTAGE) /
                      (FUEL_TANK_FULL_VOLTAGE - FUEL_TANK_EMPTY_VOLTAGE)) * 100.0;
  fuelLevelPercent = constrain(fuelLevelPercent, 0, 100);
}

// ---------- Warning Evaluation ----------
void evaluateWarnings() {
  warningActive = (fuelLevelPercent <= FUEL_LOW_PERCENT) ||
                  (engineTempC >= ENGINE_TEMP_WARNING_C) ||
                  (engineRPM >= RPM_REDLINE_WARNING);
}

// ---------- Indicators ----------
void updateIndicators() {
  digitalWrite(LED_OK_PIN, !warningActive ? HIGH : LOW);
  digitalWrite(LED_WARNING_PIN, warningActive ? HIGH : LOW);

  if (warningActive) {
    tone(BUZZER_PIN, 1200, 200);
  } else {
    noTone(BUZZER_PIN);
  }
}

// ---------- Send Fleet Data ----------
void sendFleetData() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    return;
  }

  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"vehicle_id\":\"" + String(VEHICLE_ID) + "\",";
  payload += "\"latitude\":" + String(latitude, 6) + ",";
  payload += "\"longitude\":" + String(longitude, 6) + ",";
  payload += "\"speed_kmph\":" + String(speedKmph, 2) + ",";
  payload += "\"total_distance_km\":" + String(totalDistanceKm, 2) + ",";
  payload += "\"fuel_percent\":" + String(fuelLevelPercent, 1) + ",";
  payload += "\"engine_rpm\":" + String(engineRPM) + ",";
  payload += "\"engine_temp_c\":" + String(engineTempC, 1) + ",";
  payload += "\"fuel_consumption_l_per_100km\":" + String(fuelConsumptionLPer100Km, 2) + ",";
  payload += "\"warning_active\":" + String(warningActive ? "true" : "false");
  payload += "}";

  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    Serial.println("Fleet data sent. HTTP code: " + String(httpCode));
  } else {
    Serial.println("Failed to send fleet data. Error: " + http.errorToString(httpCode));
  }
  http.end();
}

// ---------- Status Output ----------
void printStatus() {
  Serial.println("==================================");
  Serial.print("Vehicle ID: "); Serial.println(VEHICLE_ID);
  Serial.print("Location: "); Serial.print(latitude, 6); Serial.print(", "); Serial.println(longitude, 6);
  Serial.print("Speed: "); Serial.print(speedKmph, 1); Serial.println(" km/h");
  Serial.print("Total Distance: "); Serial.print(totalDistanceKm, 2); Serial.println(" km");
  Serial.print("Fuel Level: "); Serial.print(fuelLevelPercent, 1); Serial.println(" %");
  Serial.print("Engine RPM: "); Serial.println(engineRPM);
  Serial.print("Engine Temp: "); Serial.print(engineTempC, 1); Serial.println(" °C");
  Serial.print("Fuel Consumption: "); Serial.print(fuelConsumptionLPer100Km, 2); Serial.println(" L/100km");
  Serial.print("Warning: "); Serial.println(warningActive ? "ACTIVE ⚠️" : "NONE ✅");
  Serial.println("==================================");
}
