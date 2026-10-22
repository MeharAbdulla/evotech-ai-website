/**
 * Proprietary PCB project catalog.
 * Card thumbnails use real board PNG/JPG only — never PDF page renders.
 */
const makePcbProject = ({
  id,
  title,
  short_description,
  full_description,
  technologies,
  category = "PCB",
  status = "Completed",
  thumbnail_image,
  gallery_images = [],
  model_3d = null,
  preview_video = null,
  features = [],
  hardware_components = [],
}) => ({
  id,
  title,
  short_description,
  full_description,
  technologies,
  category,
  status,
  featured: true,
  origin: "public",
  open_source: false,
  proprietary: true,
  thumbnail_image,
  gallery_images,
  model_3d,
  preview_video,
  zip_file: null,
  source_url: null,
  download_url: null,
  github_url: null,
  pdf_document: null,
  features,
  hardware_components,
  created_at: "2026-07-29T00:00:00.000Z",
  updated_at: "2026-07-29T00:00:00.000Z",
});

export const pcbProjects = [
  makePcbProject({
    id: "pcb-4g-iot-remote",
    title: "4G IoT Remote Control System",
    short_description:
      "Cellular IoT control board for remote industrial actuation over 4G LTE — proprietary PCB design.",
    full_description:
      "A production-oriented 4G IoT remote control PCB for field devices. The board integrates cellular connectivity with local IO for remote monitoring and command. Schematic, Gerber, and firmware remain proprietary to Aeromek and are not distributed as open source.",
    technologies: ["4G LTE", "IoT", "PCB Design", "Embedded"],
    thumbnail_image: "/pcb/4g-iot/board.jpg",
    gallery_images: ["/pcb/4g-iot/board.jpg", "/pcb/4g-iot/preview.jpeg"],
    features: [
      "4G cellular remote control path",
      "Industrial IoT form factor",
      "Closed-source PCB & firmware",
    ],
    hardware_components: ["4G modem interface", "MCU control domain", "Power regulation"],
  }),

  makePcbProject({
    id: "pcb-esp32-xiao-fc",
    title: "ESP32 XIAO Wi-Fi Flight Controller",
    short_description:
      "Compact Wi-Fi flight controller PCB built around Seeed XIAO ESP32 for micro drones.",
    full_description:
      "A micro-drone flight controller PCB centered on the ESP32 XIAO module. Layout focuses on tight form factor, radio performance, and motor drive interfaces. Design files and firmware are proprietary — visual preview only on this site.",
    technologies: ["ESP32", "XIAO", "Flight Controller", "Wi-Fi", "PCB"],
    thumbnail_image: "/pcb/esp32-xiao-fc/board.png",
    gallery_images: ["/pcb/esp32-xiao-fc/board.png"],
    features: [
      "XIAO ESP32-based FC layout",
      "Wi-Fi capable micro-drone stack",
      "Proprietary Gerber & firmware",
    ],
    hardware_components: ["Seeed XIAO ESP32", "IMU footprint", "ESC / motor headers"],
  }),

  makePcbProject({
    id: "pcb-robocup-main",
    title: "RoboCup 2023 Main Control Board",
    short_description:
      "Main control PCB prototype for RoboCup competition robots — interactive 3D OBJ model.",
    full_description:
      "Competition-grade main control board designed for RoboCup 2023 robot platforms. Explore the interactive 3D PCB model below. Manufacturing files and firmware are proprietary and not open source.",
    technologies: ["RoboCup", "Robotics", "Mainboard", "PCB", "3D"],
    thumbnail_image: "/pcb/robocup/board.png",
    gallery_images: ["/pcb/robocup/board.png"],
    model_3d: "/pcb/robocup/model.obj",
    features: [
      "Interactive 3D PCB viewer (real OBJ)",
      "Competition main-control architecture",
      "Closed-source manufacturing package",
    ],
    hardware_components: ["MCU domain", "Sensor buses", "Actuator interfaces"],
  }),

  makePcbProject({
    id: "pcb-simon-esp32",
    title: "Simon Memory Game Using ESP32",
    short_description:
      "ESP32-based Simon memory game PCB with full 3D mechanical design (proprietary STEP).",
    full_description:
      "An ESP32 educational / product PCB implementing the classic Simon memory game. A full 3D STEP model exists for manufacturing review; source CAD, Gerbers, and firmware are not published. Preview assets only are shown here.",
    technologies: ["ESP32", "PCB", "3D CAD", "Embedded Game"],
    thumbnail_image: "/pcb/simon-esp32/board.png",
    gallery_images: ["/pcb/simon-esp32/board.png"],
    features: [
      "ESP32 game controller PCB",
      "3D CAD design completed",
      "Proprietary STEP / Gerber package",
    ],
    hardware_components: ["ESP32 module", "LED / button matrix", "Power stage"],
  }),

  makePcbProject({
    id: "pcb-pool-monitor",
    title: "Smart Swimming Pool Monitoring PCB",
    short_description:
      "Sensor and control PCB for smart swimming pool monitoring and automation.",
    full_description:
      "PCB for swimming-pool water quality / equipment monitoring and control. Sensing, actuation, and connectivity domains are laid out for wet-environment products. Design files remain Aeromek proprietary.",
    technologies: ["IoT", "Sensors", "PCB", "Automation"],
    thumbnail_image: "/pcb/pool-monitor/board.png",
    gallery_images: ["/pcb/pool-monitor/board.png"],
    features: [
      "Pool monitoring sensor interfaces",
      "Control outputs for equipment",
      "Closed-source board design",
    ],
    hardware_components: ["Sensor inputs", "Relay / driver stage", "MCU + connectivity"],
  }),

  makePcbProject({
    id: "pcb-stm32h750-fc",
    title: "STM32H750 Flight Controller Prototype",
    short_description:
      "High-performance STM32H750 flight controller PCB — interactive 3D OBJ model.",
    full_description:
      "Flight-controller PCB prototype based on STM32H750 for high-rate control loops and rich sensor suites. Interactive 3D model from the real EasyEDA OBJ export. Gerbers and firmware are not open source.",
    technologies: ["STM32H750", "Flight Controller", "Drone", "PCB", "3D"],
    category: "Drone",
    thumbnail_image: "/pcb/stm32h750-fc/board.png",
    gallery_images: ["/pcb/stm32h750-fc/board.png"],
    model_3d: "/pcb/stm32h750-fc/model.obj",
    features: [
      "Interactive 3D PCB viewer (real OBJ)",
      "STM32H7-class FC layout",
      "Proprietary design package",
    ],
    hardware_components: ["STM32H750", "IMU / baro footprints", "ESC connectors"],
  }),

  makePcbProject({
    id: "pcb-tortubot",
    title: "TortuBot — ESP32 Educational Robot Platform",
    short_description:
      "ESP32 educational mobile robot PCB (TortuBot Single V2) — interactive 3D OBJ model.",
    full_description:
      "Educational mobile-robot mainboard for TortuBot, built around ESP32. Interactive 3D model from the real EasyEDA OBJ export. Gerber and firmware packages are proprietary.",
    technologies: ["ESP32", "Robotics", "Education", "PCB", "3D"],
    category: "Robotics",
    thumbnail_image: "/pcb/tortubot/board.png",
    gallery_images: ["/pcb/tortubot/board.png", "/pcb/tortubot/preview.jpeg"],
    model_3d: "/pcb/tortubot/model.obj",
    features: [
      "Interactive 3D PCB viewer (real OBJ)",
      "ESP32 educational robot PCB",
      "Not open source",
    ],
    hardware_components: ["ESP32", "Motor drivers", "Sensor headers"],
  }),

  makePcbProject({
    id: "pcb-3d-showcase",
    title: "Interactive PCB 3D Design Showcase",
    short_description:
      "Motion preview of a proprietary PCB design — visual showcase only, files not published.",
    full_description:
      "A 3D motion showcase of an Aeromek PCB design. Use this clip to review board geometry and component placement. Manufacturing files and source projects are private and not available for download.",
    technologies: ["PCB", "3D Visualization", "Hardware"],
    thumbnail_image: "/pcb/stm32h750-fc/board.png",
    gallery_images: ["/pcb/stm32h750-fc/board.png"],
    preview_video: "/pcb/pcb-showcase/preview.mp4",
    features: [
      "3D motion preview of PCB",
      "Visual review only",
      "No source / Gerber download",
    ],
    hardware_components: ["Custom multilayer PCB"],
  }),
];

export default pcbProjects;
