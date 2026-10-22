/** Core services — AI vision first, then supporting engineering. */
import { coreServiceSlugMap } from "./serviceLandings";

export const coreServices = [
  {
    id: "svc-workplace-detection",
    slug: "workplace-object-detection",
    icon: "FiEye",
    title: "Workplace Object Detection",
    short_description:
      "YOLO-based detection for factories and sites — people, PPE, parts, vehicles, and assets on live camera feeds.",
    features: ["Real-time bounding boxes", "Custom class training", "Alert pipelines"],
  },
  {
    id: "svc-cctv-ai",
    slug: "cctv-ai",
    icon: "FiCamera",
    title: "CCTV & Surveillance AI",
    short_description:
      "Turn existing CCTV into smart monitors — fire/smoke, intrusion, activity, and safety events without new hardware.",
    features: ["Works with existing cameras", "Fire & safety alerts", "24/7 monitoring AI"],
  },
  {
    id: "svc-industrial-inspect",
    slug: "industrial-inspection",
    icon: "FiLayers",
    title: "Industrial Inspection & Counting",
    short_description:
      "Line-side and overhead cameras for quality inspection, defect flags, and automated counting on the floor.",
    features: ["Defect detection", "Live counting", "Smart manufacturing"],
  },
  {
    id: "svc-edge-cameras",
    slug: "edge-camera-deployment",
    icon: "FiZap",
    title: "Edge Camera Deployment",
    short_description:
      "Deploy vision models on edge devices or cloud GPUs with dashboards operators can actually use.",
    features: ["Edge / cloud inference", "Operator dashboards", "Site rollout support"],
  },
  {
    id: "svc-ai-ml",
    slug: "ai-development",
    icon: "FiCpu",
    title: "AI & Machine Learning",
    short_description:
      "Custom models, RAG systems, and AI agents for automation, insights, and product features.",
    features: ["LLM & RAG apps", "Model fine-tuning", "Production MLOps"],
  },
  {
    id: "svc-robotics",
    slug: "robotics",
    icon: "FiBox",
    title: "Robotics Engineering",
    short_description:
      "Perception, control, and automation for mobile robots, arms, and custom mechatronic systems.",
    features: ["ROS / ROS2", "Motion control", "Sensor fusion"],
  },
  {
    id: "svc-drones",
    slug: "drone-systems",
    icon: "FiGlobe",
    title: "Drone Systems",
    short_description:
      "UAV airframes, flight controllers, autonomy stacks, and mission software for aerial platforms.",
    features: ["Flight control", "Autonomous missions", "Payload integration"],
  },
  {
    id: "svc-pcb",
    slug: "pcb-design",
    icon: "FiLayers",
    title: "PCB Design",
    short_description:
      "Schematic capture, multi-layer PCB layout, DFM review, and bring-up for IoT and embedded boards.",
    features: ["Schematic & layout", "DFM / DFA", "Prototype bring-up"],
  },
  {
    id: "svc-3d",
    slug: "cad-3d-design",
    icon: "FiBox",
    title: "3D Design & CAD",
    short_description:
      "Mechanical CAD, enclosures, drone frames, and 3D-printable parts ready for manufacturing.",
    features: ["SolidWorks / Fusion", "Enclosure design", "3D print-ready files"],
  },
  {
    id: "svc-iot",
    slug: "iot",
    icon: "FiZap",
    title: "IoT & Embedded",
    short_description:
      "Firmware, sensors, and secure gateways that stream reliable field data into your cloud or dashboard.",
    features: ["ESP32 / STM32", "Wireless protocols", "Cloud dashboards"],
  },
  {
    id: "svc-product",
    slug: "full-product-builds",
    icon: "FiCode",
    title: "Full Product Builds",
    short_description:
      "Hardware + software delivery from concept to working prototype: electronics, firmware, and UI.",
    features: ["System architecture", "Rapid prototyping", "Handover & docs"],
  },
].map((s) => ({
  ...s,
  slug: s.slug || coreServiceSlugMap[s.id],
}));
