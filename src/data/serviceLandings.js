/**
 * Commercial SEO service landing pages.
 * Keep slugs in sync with backend/app/routes/seo.py SERVICE_SLUGS.
 */

export const serviceLandings = [
  {
    slug: "computer-vision",
    related: ["yolo", "opencv", "workplace-object-detection", "cctv-ai"],
    icon: "FiEye",
    h1: "Workplace Computer Vision for Factories & Warehouses",
    metaTitle: "Workplace Computer Vision & Industrial Camera AI",
    metaDescription:
      "Computer vision for warehouses, textile lines, and industrial sites — object detection, CCTV AI, and edge cameras that alert operators in real time.",
    summary:
      "We design and deploy production computer vision on your cameras — warehouse safety, textile inspection, line QA, and plant-floor rollouts that operators actually use.",
    problems: [
      "Manual visual checks that miss defects or safety events",
      "CCTV that records everything but alerts on nothing",
      "Vision pilots that never leave the lab",
    ],
    industries: ["Manufacturing", "Warehousing", "Textiles", "Agriculture", "Construction"],
    technologies: ["YOLO", "OpenCV", "PyTorch", "ONNX", "Edge GPUs", "RTSP / IP cameras"],
    benefits: [
      "Real-time detection on live camera feeds",
      "Custom classes trained for your site",
      "Dashboards and alerts operators can use",
    ],
    faq: [
      {
        q: "Do you work with existing CCTV?",
        a: "Yes. Most projects start from your current IP cameras and RTSP streams, then we add detection, alerts, and dashboards.",
      },
      {
        q: "Can models run on-site?",
        a: "Yes. We deploy to edge devices or on-prem GPUs when cloud latency or privacy is a concern.",
      },
    ],
    cta: "Talk about your camera AI project",
  },
  {
    slug: "yolo",
    related: ["computer-vision", "opencv", "workplace-object-detection"],
    icon: "FiEye",
    h1: "YOLO Development Services",
    metaTitle: "YOLO Object Detection Development Services",
    metaDescription:
      "Custom YOLO training and deployment for factories and sites — people, PPE, parts, vehicles, and assets on live cameras.",
    summary:
      "Aeromek builds YOLO-based object detection pipelines tuned for workplace lighting, camera angles, and operational alerts.",
    problems: [
      "Off-the-shelf models that fail in your environment",
      "No path from labeled data to a stable production detector",
      "Alerts that flood operators with false positives",
    ],
    industries: ["Factories", "Warehouses", "Yards", "Farms", "Industrial sites"],
    technologies: ["YOLOv8 / YOLO11", "Ultralytics", "Roboflow", "OpenCV", "TensorRT"],
    benefits: [
      "Custom class training for your assets",
      "Latency-aware edge or server deployment",
      "Integration with alarms and MES/SCADA hooks",
    ],
    faq: [
      {
        q: "Which YOLO versions do you use?",
        a: "We select the YOLO family that fits accuracy and latency targets — commonly Ultralytics YOLO variants for industrial cameras.",
      },
      {
        q: "Do you help with dataset labeling?",
        a: "Yes. We can define labeling guidelines, review samples, and set up training pipelines.",
      },
    ],
    cta: "Start a YOLO detection project",
  },
  {
    slug: "opencv",
    related: ["computer-vision", "yolo", "industrial-inspection"],
    icon: "FiCamera",
    h1: "OpenCV Development Services",
    metaTitle: "OpenCV Development Services",
    metaDescription:
      "OpenCV engineering for industrial vision — preprocessing, classical CV, hybrid YOLO + OpenCV pipelines, and camera calibration.",
    summary:
      "We use OpenCV for robust image pipelines: calibration, preprocessing, measurement, and hybrid detection systems.",
    problems: [
      "Poor lighting and camera geometry breaking detectors",
      "Need for measurement/counting without a full deep model",
      "Glue code between cameras, models, and plant systems",
    ],
    industries: ["Manufacturing QA", "Packaging", "Agriculture", "Labs"],
    technologies: ["OpenCV", "NumPy", "Python / C++", "GStreamer", "Camera SDKs"],
    benefits: [
      "Stable preprocessing before ML inference",
      "Classical CV where deep learning is overkill",
      "Faster debugging on real camera streams",
    ],
    faq: [
      {
        q: "Is OpenCV enough without deep learning?",
        a: "For some counting, alignment, and measurement tasks, yes. Many production systems combine OpenCV with YOLO for best results.",
      },
    ],
    cta: "Discuss an OpenCV pipeline",
  },
  {
    slug: "ai-development",
    related: ["computer-vision", "iot", "full-product-builds"],
    icon: "FiCpu",
    h1: "AI Development Services",
    metaTitle: "AI Development Services | Custom AI Software",
    metaDescription:
      "Custom AI development — computer vision, LLM/RAG agents, automation, and production ML systems from Aeromek.",
    summary:
      "From vision models to AI agents and automation, we build AI that ships into real operations — not demos that die in a slide deck.",
    problems: [
      "Proof-of-concepts with no production path",
      "Scattered tools with no operator workflow",
      "Need for domain-specific models and integrations",
    ],
    industries: ["Industrial ops", "AgriTech", "Security", "Product teams"],
    technologies: ["PyTorch", "LLMs / RAG", "Python APIs", "MLOps", "Cloud & edge"],
    benefits: [
      "Clear architecture from data to deployment",
      "Human-in-the-loop workflows where needed",
      "Handover docs and maintainable code",
    ],
    faq: [
      {
        q: "Do you only do computer vision?",
        a: "Vision is our lead offering, but we also build RAG agents, automation bots, and full product AI features.",
      },
    ],
    cta: "Plan your AI build",
  },
  {
    slug: "embedded-systems",
    related: ["esp32", "stm32", "raspberry-pi", "iot", "pcb-design"],
    icon: "FiZap",
    h1: "Embedded Systems Development Services",
    metaTitle: "Embedded Systems Development Services",
    metaDescription:
      "Embedded systems engineering — firmware, sensors, ESP32, STM32, Raspberry Pi, and hardware bring-up for IoT and industrial devices.",
    summary:
      "Aeromek designs firmware and hardware interfaces for reliable field devices that stream data and control actuators safely.",
    problems: [
      "Unreliable firmware in harsh environments",
      "Boards that work on the bench but fail in the field",
      "Missing OTA, logging, or secure device identity",
    ],
    industries: ["IoT products", "Industrial monitoring", "Robotics", "Agriculture"],
    technologies: ["C / C++", "FreeRTOS", "ESP-IDF", "STM32 HAL", "Linux SBCs"],
    benefits: [
      "Stable firmware with clear interfaces",
      "Hardware–software co-design",
      "Prototype to pilot support",
    ],
    faq: [
      {
        q: "Do you design the PCB as well?",
        a: "Yes. Embedded projects often include schematic/PCB layout and bring-up alongside firmware.",
      },
    ],
    cta: "Start an embedded project",
  },
  {
    slug: "iot",
    related: ["embedded-systems", "esp32", "raspberry-pi", "pcb-design"],
    icon: "FiCloud",
    h1: "IoT Development Services",
    metaTitle: "IoT Development Services",
    metaDescription:
      "End-to-end IoT development — sensors, gateways, firmware, cloud dashboards, and secure device connectivity from Aeromek.",
    summary:
      "We build IoT stacks from the sensor to the dashboard: devices, connectivity, APIs, and operator-facing views.",
    problems: [
      "Devices that drop offline without recovery",
      "No secure onboarding or OTA strategy",
      "Dashboards that do not match field reality",
    ],
    industries: ["Smart facilities", "AgriTech", "Industrial monitoring", "Consumer IoT"],
    technologies: ["MQTT", "HTTP APIs", "ESP32", "LoRa / Wi-Fi / LTE", "Cloud backends"],
    benefits: [
      "Reliable telemetry pipelines",
      "Secure device identity patterns",
      "Operator dashboards that match workflows",
    ],
    faq: [
      {
        q: "Can you integrate with our existing cloud?",
        a: "Yes. We commonly integrate with existing APIs, MQTT brokers, and cloud IoT platforms.",
      },
    ],
    cta: "Build your IoT system",
  },
  {
    slug: "esp32",
    related: ["embedded-systems", "iot", "stm32", "pcb-design"],
    icon: "FiZap",
    h1: "ESP32 Development Services",
    metaTitle: "ESP32 Development Services | Firmware & IoT",
    metaDescription:
      "ESP32 firmware and product development — Wi-Fi/BLE devices, sensors, gateways, and production-ready ESP-IDF applications.",
    summary:
      "We ship ESP32 firmware for connected products: sensors, gateways, and edge nodes with stable connectivity and OTA paths.",
    problems: [
      "Arduino sketches that do not scale to production",
      "Wi-Fi instability and power issues",
      "Need for BLE + Wi-Fi dual-mode products",
    ],
    industries: ["IoT hardware", "Industrial sensors", "Smart agriculture"],
    technologies: ["ESP-IDF", "Arduino (when needed)", "FreeRTOS", "MQTT", "OTA"],
    benefits: [
      "Production-minded firmware structure",
      "Power and connectivity tuning",
      "PCB + firmware co-development",
    ],
    faq: [
      {
        q: "ESP-IDF or Arduino?",
        a: "Prototypes may start in Arduino; production devices usually move to ESP-IDF for control and reliability.",
      },
    ],
    cta: "Hire ESP32 developers",
  },
  {
    slug: "stm32",
    related: ["embedded-systems", "esp32", "pcb-design", "robotics"],
    icon: "FiCpu",
    h1: "STM32 Firmware Development Services",
    metaTitle: "STM32 Firmware Development Services",
    metaDescription:
      "STM32 firmware engineering for control systems, sensors, motor drivers, and industrial embedded products.",
    summary:
      "Aeromek develops STM32 firmware for real-time control, sensing, and communication in industrial and robotics products.",
    problems: [
      "Hard real-time constraints on MCUs",
      "Driver and peripheral integration risk",
      "Need for robust bootloaders and diagnostics",
    ],
    industries: ["Robotics", "Industrial controls", "Custom electronics"],
    technologies: ["STM32Cube", "HAL / LL", "FreeRTOS", "CAN / UART / SPI / I2C"],
    benefits: [
      "Deterministic control loops",
      "Clean peripheral drivers",
      "Hardware bring-up support",
    ],
    faq: [
      {
        q: "Do you support custom boards?",
        a: "Yes. We frequently bring up firmware on custom STM32 PCBs designed in-house or by your team.",
      },
    ],
    cta: "Start STM32 firmware work",
  },
  {
    slug: "raspberry-pi",
    related: ["embedded-systems", "iot", "computer-vision", "edge-camera-deployment"],
    icon: "FiBox",
    h1: "Raspberry Pi Development Services",
    metaTitle: "Raspberry Pi Development Services",
    metaDescription:
      "Raspberry Pi engineering for edge vision, gateways, kiosks, and Linux-based IoT prototypes and pilots.",
    summary:
      "We use Raspberry Pi as a fast path to edge computers — vision nodes, gateways, and operator interfaces.",
    problems: [
      "Need a Linux edge box without a full custom SBC yet",
      "Camera + ML prototypes for site trials",
      "Local dashboards and offline buffering",
    ],
    industries: ["Edge AI pilots", "Facilities", "AgriTech", "Education labs"],
    technologies: ["Raspberry Pi OS", "Python", "Docker", "Camera modules", "MQTT"],
    benefits: [
      "Fast pilots with production lessons learned",
      "Easy camera and peripheral access",
      "Path to hardened hardware later",
    ],
    faq: [
      {
        q: "Is Pi suitable for production?",
        a: "For many pilots and low-volume edge nodes, yes. For harsh or high-volume products we may migrate to custom hardware.",
      },
    ],
    cta: "Build on Raspberry Pi",
  },
  {
    slug: "pcb-design",
    related: ["embedded-systems", "esp32", "stm32", "iot"],
    icon: "FiLayers",
    h1: "PCB Design Services",
    metaTitle: "PCB Design Services | Schematic & Layout",
    metaDescription:
      "Professional PCB design — schematic capture, multi-layer layout, DFM review, and prototype bring-up for IoT and embedded products.",
    summary:
      "Aeromek designs schematics and PCBs for IoT, flight controllers, and industrial electronics — ready for fab and assembly.",
    problems: [
      "Layouts that fail EMC or DFM checks",
      "Schematics without a clear bring-up plan",
      "Need for rapid prototype iterations",
    ],
    industries: ["IoT hardware", "Drones", "Industrial electronics", "Robotics"],
    technologies: ["Altium / KiCad", "Multi-layer PCB", "DFM / DFA", "Bring-up tooling"],
    benefits: [
      "Manufacturable layouts",
      "Firmware-aware design",
      "Prototype assembly support",
    ],
    faq: [
      {
        q: "Do you handle assembly?",
        a: "We prepare fab/assembly packages and can coordinate prototype builds with your preferred CM.",
      },
    ],
    cta: "Request PCB design help",
  },
  {
    slug: "workplace-object-detection",
    related: ["yolo", "computer-vision", "cctv-ai"],
    icon: "FiEye",
    h1: "Warehouse Collision Avoidance & Workplace Object Detection",
    metaTitle: "Warehouse Collision Avoidance Camera Systems",
    metaDescription:
      "Warehouse collision avoidance systems with camera AI — forklift and pedestrian detection, PPE alerts, and live object detection for US distribution centers.",
    summary:
      "Camera AI that detects forklifts, pedestrians, PPE, and zone breaches in real time — built for warehouse collision avoidance and floor safety teams.",
    problems: [
      "Forklift–pedestrian near misses without camera coverage",
      "No visibility into vehicle/person flow in aisles",
      "Manual spot-checks that do not scale across shifts",
    ],
    industries: ["Warehouses", "Distribution centers", "Factories", "Yards"],
    technologies: ["YOLO", "OpenCV", "Edge inference", "Alerting"],
    benefits: [
      "Warehouse collision avoidance alerts",
      "Forklift and pedestrian detection",
      "Custom classes and alert pipelines",
    ],
    faq: [
      {
        q: "How long to a pilot?",
        a: "Many sites start with a 2–6 week pilot on a few cameras, then expand after accuracy review.",
      },
      {
        q: "Can this support warehouse collision avoidance?",
        a: "Yes. We train detectors for forklifts, pedestrians, and restricted zones, then wire alerts to operators or existing safety systems.",
      },
    ],
    cta: "Pilot warehouse camera AI",
  },
  {
    slug: "cctv-ai",
    related: ["computer-vision", "workplace-object-detection", "yolo"],
    icon: "FiCamera",
    h1: "CCTV & Surveillance AI Services",
    metaTitle: "CCTV AI & Surveillance Computer Vision",
    metaDescription:
      "Turn existing CCTV into smart monitors — fire/smoke, intrusion, activity, and safety events with Aeromek camera AI.",
    summary:
      "Add intelligence to cameras you already own — without ripping out the surveillance stack.",
    problems: [
      "Hours of video with no automated review",
      "Late discovery of fire, intrusion, or unsafe activity",
      "Staff overloaded watching monitors",
    ],
    industries: ["Industrial security", "Facilities", "Warehousing"],
    technologies: ["CCTV / NVR integration", "YOLO", "Event alerts", "Dashboards"],
    benefits: ["Works with existing cameras", "Fire & safety alerts", "24/7 monitoring AI"],
    faq: [
      {
        q: "Will this replace our NVR?",
        a: "Usually no — we analyze streams and send events while recording stays on your existing system.",
      },
    ],
    cta: "Upgrade your CCTV with AI",
  },
  {
    slug: "industrial-inspection",
    related: ["computer-vision", "opencv", "yolo"],
    icon: "FiLayers",
    h1: "Textile Machine Vision & Industrial Inspection",
    metaTitle: "Textile Machine Vision & Industrial Inspection",
    metaDescription:
      "Textile machine vision and industrial inspection — fabric defect detection, line counting, and camera QA for manufacturing floors.",
    summary:
      "Line-side and overhead cameras for textile fabric defects, packaging QA, and automated counting — without slowing the line.",
    problems: [
      "Missed fabric and surface defects on fast textile lines",
      "Inconsistent manual QA across shifts",
      "Counting errors with no digital visual record",
    ],
    industries: ["Textiles", "Manufacturing", "Packaging", "Food processing"],
    technologies: ["Industrial cameras", "YOLO", "OpenCV", "PLC/MES hooks"],
    benefits: [
      "Textile fabric defect detection",
      "Live counting and reject signals",
      "Traceable visual events",
    ],
    faq: [
      {
        q: "Can you integrate with PLCs?",
        a: "Yes. We commonly expose events via APIs, MQTT, or digital I/O for line control.",
      },
      {
        q: "Do you support textile machine vision?",
        a: "Yes. We build defect and anomaly detection for fabric and related manufacturing lines using industrial cameras and custom models.",
      },
    ],
    cta: "Improve line inspection",
  },
  {
    slug: "edge-camera-deployment",
    related: ["computer-vision", "raspberry-pi", "yolo"],
    icon: "FiZap",
    h1: "Edge Camera Deployment",
    metaTitle: "Edge Camera AI Deployment Services",
    metaDescription:
      "Deploy vision models on edge devices or cloud GPUs with operator dashboards for real industrial sites.",
    summary:
      "We package models, hardware, and dashboards so site teams can run camera AI day-to-day.",
    problems: [
      "Models stuck on a data scientist laptop",
      "Unclear hardware and network requirements",
      "No operator UI after a successful demo",
    ],
    industries: ["Multi-site factories", "Remote facilities", "Agri sites"],
    technologies: ["Edge GPUs", "Jetson / x86", "Docker", "Monitoring"],
    benefits: ["Edge / cloud inference", "Operator dashboards", "Site rollout support"],
    faq: [
      {
        q: "Edge or cloud?",
        a: "We recommend based on bandwidth, privacy, and latency — many sites use a hybrid.",
      },
    ],
    cta: "Plan an edge vision rollout",
  },
  {
    slug: "robotics",
    related: ["embedded-systems", "computer-vision", "stm32"],
    icon: "FiBox",
    h1: "Robotics Engineering Services",
    metaTitle: "Robotics Engineering Services",
    metaDescription:
      "Robotics engineering — perception, control, and automation for mobile robots, arms, and custom mechatronic systems.",
    summary:
      "Perception, control, and integration for robots that must work outside the lab.",
    problems: [
      "Perception that fails in real lighting",
      "Control stacks that are hard to maintain",
      "Missing sensor fusion for reliable autonomy",
    ],
    industries: ["Warehousing", "Inspection", "Research labs", "Custom machines"],
    technologies: ["ROS / ROS2", "Motion control", "Vision", "Sensor fusion"],
    benefits: ["Integrated perception + control", "Field-ready prototypes", "Clear docs"],
    faq: [
      {
        q: "Do you work with ROS2?",
        a: "Yes. ROS2 is a common backbone for our mobile and manipulation projects.",
      },
    ],
    cta: "Discuss a robotics build",
  },
  {
    slug: "drone-systems",
    related: ["pcb-design", "embedded-systems", "computer-vision"],
    icon: "FiGlobe",
    h1: "Drone Building & Roof Inspection Systems",
    metaTitle: "Drone Building Inspection & UAV Systems",
    metaDescription:
      "Drone building inspection for commercial roofs and property — UAV airframes, flight control, and camera payloads for US inspection teams.",
    summary:
      "UAV systems for commercial building, roof, and property inspection — airframes, flight controllers, mission software, and camera payloads that ship as products.",
    problems: [
      "Slow, risky manual roof and facade surveys",
      "Airframe and avionics mismatch on inspection UAVs",
      "Payload cameras without a clean mission interface",
    ],
    industries: ["Commercial property inspection", "Roof survey", "Agriculture", "Mapping"],
    technologies: ["Flight controllers", "Autopilot stacks", "PCB", "Inspection cameras"],
    benefits: [
      "Drone roof and building inspection workflows",
      "Flight control and autonomous missions",
      "Payload and camera integration",
    ],
    faq: [
      {
        q: "Do you design custom flight controller PCBs?",
        a: "Yes. Several of our hardware projects include custom FC boards and firmware bring-up.",
      },
      {
        q: "Can you support commercial building drone inspection?",
        a: "Yes. We build UAV platforms and camera payloads suited to roof, facade, and commercial property inspection missions.",
      },
    ],
    cta: "Plan a drone inspection system",
  },
  {
    slug: "cad-3d-design",
    related: ["pcb-design", "drone-systems", "robotics"],
    icon: "FiBox",
    h1: "3D Design & CAD Services",
    metaTitle: "3D CAD & Mechanical Design Services",
    metaDescription:
      "Mechanical CAD, enclosures, drone frames, and 3D-printable parts ready for manufacturing.",
    summary:
      "Enclosures and mechanical parts designed to fit electronics, assembly, and real manufacturing constraints.",
    problems: [
      "Electronics that do not fit the enclosure",
      "Parts that are not print- or mold-ready",
      "Slow iteration between hardware and CAD",
    ],
    industries: ["Hardware products", "Drones", "Robotics", "IoT devices"],
    technologies: ["SolidWorks / Fusion", "3D printing", "DFM"],
    benefits: ["Enclosure design", "Print-ready files", "Assembly-aware CAD"],
    faq: [
      {
        q: "Do you design around our PCB?",
        a: "Yes — we routinely design mechanicals around Aeromek or customer PCBs.",
      },
    ],
    cta: "Start a CAD project",
  },
  {
    slug: "full-product-builds",
    related: ["ai-development", "pcb-design", "embedded-systems", "iot"],
    icon: "FiCode",
    h1: "Full Product Builds",
    metaTitle: "Full Hardware + Software Product Builds",
    metaDescription:
      "Hardware + software delivery from concept to working prototype: electronics, firmware, AI, and UI.",
    summary:
      "One team for electronics, firmware, AI features, and interfaces — from concept to a working prototype you can pilot.",
    problems: [
      "Too many vendors with no system owner",
      "Integration risk at the end of the project",
      "Need for a single accountable delivery partner",
    ],
    industries: ["Startups", "Industrial innovation teams", "R&D labs"],
    technologies: ["System architecture", "PCB", "Firmware", "AI / UI"],
    benefits: ["End-to-end ownership", "Rapid prototyping", "Handover & docs"],
    faq: [
      {
        q: "What does a typical engagement look like?",
        a: "Discovery and architecture, prototype sprint(s), pilot hardening, then handover or ongoing support.",
      },
    ],
    cta: "Scope a full product build",
  },
];

export function getServiceBySlug(slug) {
  return serviceLandings.find((s) => s.slug === slug) || null;
}

export function getRelatedServices(slug, limit = 4) {
  const current = getServiceBySlug(slug);
  if (!current) return serviceLandings.slice(0, limit);
  const related = (current.related || [])
    .map((s) => getServiceBySlug(s))
    .filter(Boolean);
  return related.slice(0, limit);
}

/** Map legacy core service ids → landing slugs */
export const coreServiceSlugMap = {
  "svc-workplace-detection": "workplace-object-detection",
  "svc-cctv-ai": "cctv-ai",
  "svc-industrial-inspect": "industrial-inspection",
  "svc-edge-cameras": "edge-camera-deployment",
  "svc-ai-ml": "ai-development",
  "svc-robotics": "robotics",
  "svc-drones": "drone-systems",
  "svc-pcb": "pcb-design",
  "svc-3d": "cad-3d-design",
  "svc-iot": "iot",
  "svc-product": "full-product-builds",
};

export const categoryToServiceSlugs = {
  "Computer Vision": ["computer-vision", "yolo", "opencv"],
  "Workplace Safety": ["workplace-object-detection", "cctv-ai"],
  "Industrial AI": ["industrial-inspection", "computer-vision"],
  "CCTV AI": ["cctv-ai", "computer-vision"],
  "Edge AI": ["edge-camera-deployment", "raspberry-pi"],
  Robotics: ["robotics", "embedded-systems"],
  "AI Agents": ["ai-development"],
  IoT: ["iot", "esp32", "embedded-systems"],
};
