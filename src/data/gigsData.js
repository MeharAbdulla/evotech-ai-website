/** Default open gigs for /gigs (engineering work matching Aeromek services). */
export const defaultGigs = [
  {
    id: "gig-ai-agent",
    title: "Build a Custom AI Agent",
    short_description:
      "Design and ship a production AI agent with RAG knowledge base, tool use, and WhatsApp or web chat.",
    category: "AI & ML",
    budget: "$800 – $2,500",
    duration: "2–4 weeks",
    status: "Open",
    skills: ["Python", "LLMs", "RAG", "APIs"],
    image: "/gigs/ai-ml.jpg",
  },
  {
    id: "gig-robotics",
    title: "Mobile Robot Navigation Stack",
    short_description:
      "ROS2 navigation, localization, and obstacle avoidance for an indoor or warehouse robot platform.",
    category: "Robotics",
    budget: "$1,200 – $4,000",
    duration: "3–6 weeks",
    status: "Open",
    skills: ["ROS2", "SLAM", "C++", "Python"],
    image: "/gigs/robotics.jpg",
  },
  {
    id: "gig-drone",
    title: "Custom Drone Frame & Flight Setup",
    short_description:
      "Design a lightweight UAV frame, integrate flight controller, and tune for stable autonomous flights.",
    category: "Drones",
    budget: "$900 – $3,000",
    duration: "2–5 weeks",
    status: "Open",
    skills: ["CAD", "PX4 / ArduPilot", "Composites"],
    image: "/gigs/drone.jpg",
  },
  {
    id: "gig-pcb",
    title: "IoT PCB Schematic & Layout",
    short_description:
      "Full schematic + multi-layer PCB for ESP32/STM32 IoT devices, with DFM notes and Gerbers.",
    category: "PCB Design",
    budget: "$500 – $1,800",
    duration: "1–3 weeks",
    status: "Open",
    skills: ["KiCad", "Altium", "DFM", "Bring-up"],
    image: "/gigs/pcb.jpg",
  },
  {
    id: "gig-3d",
    title: "3D Enclosure & Product CAD",
    short_description:
      "Mechanical enclosure and assembly CAD for electronics products — print-ready and manufacture-ready files.",
    category: "3D Design",
    budget: "$400 – $1,500",
    duration: "1–3 weeks",
    status: "Open",
    skills: ["Fusion 360", "SolidWorks", "3D Print"],
    image: "/gigs/cad-3d.jpg",
  },
  {
    id: "gig-iot",
    title: "Sensor Firmware & Cloud Dashboard",
    short_description:
      "Embedded firmware for sensors plus a live dashboard for monitoring, alerts, and device management.",
    category: "IoT & Embedded",
    budget: "$700 – $2,200",
    duration: "2–4 weeks",
    status: "Open",
    skills: ["ESP32", "MQTT", "React", "Firmware"],
    image: "/gigs/iot.jpg",
  },
  {
    id: "gig-vision",
    title: "Computer Vision Detection Pipeline",
    short_description:
      "Train and deploy a vision model for counting, defect detection, or object tracking on camera feeds.",
    category: "Computer Vision",
    budget: "$1,000 – $3,500",
    duration: "3–5 weeks",
    status: "Open",
    skills: ["YOLO", "OpenCV", "PyTorch", "Edge AI"],
    image: "/gigs/vision.jpg",
  },
  {
    id: "gig-prototype",
    title: "End-to-End Hardware Prototype",
    short_description:
      "Concept to working prototype: electronics, firmware, enclosure, and a simple app or web UI.",
    category: "Full Product",
    budget: "$2,000 – $6,000",
    duration: "4–8 weeks",
    status: "Open",
    skills: ["PCB", "Firmware", "CAD", "Full stack"],
    image: "/gigs/prototype.jpg",
  },
];
