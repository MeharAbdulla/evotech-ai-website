import { FiCpu, FiBox, FiMonitor, FiFeather, FiZap, FiActivity } from "react-icons/fi";

export const projectsData = [
  {
    id: "smart-irrigation-system",
    title: "Smart Soil Moisture Precision Irrigation System",
    category: "Embedded",
    description: "Automated precision irrigation matrix utilizing ESP32 edge processing, real-time sensory telemetry pipelines, and an integrated localized web server control dashboard.",
    industry: "AgTech & Automation",
    technologies: ["Embedded C++", "Arduino Framework", "ESP32", "HTML", "WiFi & WebServer Libraries", "DHT Library"],
    result: "Automated operational runtime optimization",
    image: "/project-images/irrigation-system.jpg",
    icon: FiZap,
    
    // Extended Detailed Specifications for Single Page View
    downloadUrl: "/projects-files/Smart-Soil-Moisture-Irrigation-System.zip",
    circuitDiagram: "/circuit-diagrams/irrigation-system-circuit.png",
    overview: "This enterprise-grade embedded engineering solution automates agricultural resource distribution by matching real-time microclimate metrics against configurable soil hydration thresholds. Operating directly at the edge, the system mitigates soil erosion and excessive water usage while delivering standalone local network monitoring without external cloud dependencies.",
    objectives: [
      "Implement real-time analytical monitoring of soil volumetric water content.",
      "Architect a non-blocking, localized web management server on dual-core microcontrollers.",
      "Engineer fail-safe automated relays preventing pump burnout via runtime timeouts.",
      "Provide secure, local administrative control for manual network overrides."
    ],
    features: [
      "Automated closed-loop irrigation algorithms based on sensory feedback loops.",
      "Manual software pump overrides accessible via a localized browser UI dashboard.",
      "Asynchronous telemetry acquisition across temperature, relative humidity, and capacitive ground resistance indices.",
      "Strict hardware watchdogs and software execution timeouts for infrastructure asset protection.",
      "Real-time low-latency diagnostic logging streamed over high-baud UART serial interfaces."
    ],
    hardwareComponents: [
      "ESP32 dual-core Xtensa LX6 microprocessor module",
      "Capacitive Soil Moisture Sensor v1.2 (Corrosion-resistant topology)",
      "DHT22 high-accuracy thermodynamic sensor probe",
      "Optocoupler-isolated 5V SPDT electromagnetic relay unit",
      "Submersible 5V/12V DC brush-less hydraulic water pump assembly",
      "Regulated multi-rail continuous power supply matrix"
    ],
    softwareStack: [
      "Arduino IDE core build toolchain",
      "Embedded C++ standard library compilation layer",
      "Native ESP32 core networking stack libraries",
      "Asynchronous localized HTML5/CSS3 rendering layer"
    ],
    workingPrinciple: "The ESP32 platform initializes a dual-task monitoring sequence inside its non-volatile memory environment. The capacitive sensor samples the dielectric permittivity of the soil, while the DHT22 maps environment profiles. If the parsed moisture falls below an arbitrary hard-coded threshold value, the microcontroller changes the pin state of the optocoupler-isolated relay, closing the circuit to trigger the fluid pump. Concurrently, a lightweight HTTP web server processes client-side incoming GET/POST requests, rendering an interactive dashboard on local devices connected to the generated Wi-Fi access point or local network route.",
    applications: [
      "Automated commercial greenhouse environments and precise botanical propagation maps.",
      "Sub-surface agricultural setups tracking localized hydration variables.",
      "Zero-downtime remote telemetry nodes deployed in commercial landscaping grids."
    ],
    benefits: [
      "Drastic reduction in baseline water consumption profiles through automated allocation.",
      "Asset longevity protection via robust validation boundaries and thermal tracking.",
      "Zero external server or SaaS infrastructure overhead requirements; fully decentralized."
    ]
  }
];