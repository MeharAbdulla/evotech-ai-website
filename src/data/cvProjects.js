/**
 * Workplace / industrial computer-vision projects (object detection & camera systems).
 * Demo videos sourced from E:\\Computer vision.
 */
const makeCvProject = ({
  id,
  title,
  short_description,
  full_description,
  technologies,
  thumbnail_image,
  preview_video,
  pdf_document = null,
  features = [],
  category = "Computer Vision",
}) => ({
  id,
  title,
  short_description,
  full_description,
  technologies,
  category,
  status: "Demo available",
  featured: true,
  origin: "public",
  open_source: false,
  proprietary: true,
  thumbnail_image,
  gallery_images: [thumbnail_image],
  model_3d: null,
  preview_video,
  zip_file: null,
  source_url: null,
  download_url: null,
  github_url: null,
  pdf_document,
  features,
  hardware_components: [],
  created_at: "2026-09-03T00:00:00.000Z",
  updated_at: "2026-09-03T00:00:00.000Z",
});

export const cvProjects = [
  makeCvProject({
    id: "cv-industrial-yolo",
    title: "Industrial Object Detection (YOLOv8)",
    short_description:
      "Camera-based YOLO detection for smart manufacturing lines — parts, PPE, and process anomalies on the factory floor.",
    full_description:
      "A workplace computer-vision system using YOLOv8 for industrial object detection. Cameras watch production areas to localize parts, tools, and safety gear in real time so operators and supervisors get live alerts instead of manual checks. Built for smart manufacturing floors where uptime and safety both matter.",
    technologies: ["YOLOv8", "Object Detection", "Industrial AI", "Python"],
    thumbnail_image: "/cv-projects/industrial-yolo/poster.jpg",
    preview_video: "/cv-projects/industrial-yolo/demo.mp4",
    features: [
      "Real-time factory-floor object detection",
      "YOLOv8 pipeline for industrial cameras",
      "Supports PPE and parts localization",
      "Designed for smart manufacturing workflows",
    ],
  }),
  makeCvProject({
    id: "cv-fire-surveillance",
    title: "Fire Detection from Surveillance Cameras",
    short_description:
      "AI fire and smoke detection on existing CCTV feeds for warehouses, plants, and workplace safety monitoring.",
    full_description:
      "Surveillance-camera AI that detects fire and smoke in live video without new hardware. The model runs on standard CCTV streams used in warehouses and industrial sites, flagging early incidents so teams can respond faster than visual patrol alone.",
    technologies: ["Computer Vision", "Surveillance AI", "Object Detection", "Safety"],
    thumbnail_image: "/cv-projects/fire-surveillance/poster.jpg",
    preview_video: "/cv-projects/fire-surveillance/demo.mp4",
    features: [
      "Works with existing CCTV cameras",
      "Early fire and smoke alerts",
      "Workplace and warehouse safety focus",
      "Real-time inference on camera streams",
    ],
  }),
  makeCvProject({
    id: "cv-workplace-cameras",
    title: "Workplace Camera Detection System",
    short_description:
      "Multi-camera object and activity detection for offices, shops, and industrial workplaces — live overlays and alerts.",
    full_description:
      "An end-to-end camera detection stack for workplaces: connect CCTV or IP cameras, run object detection, and surface live bounding boxes plus event alerts. Built for sites that need continuous visual monitoring without hiring more security staff.",
    technologies: ["Object Detection", "CCTV / IP Cameras", "Deep Learning", "Python"],
    thumbnail_image: "/cv-projects/workplace-cameras/poster.jpg",
    preview_video: "/cv-projects/workplace-cameras/demo.mp4",
    features: [
      "Multi-camera workplace monitoring",
      "Live object detection overlays",
      "Alert-ready event pipeline",
      "Fits offices, retail, and industrial sites",
    ],
  }),
  makeCvProject({
    id: "cv-yolo-detection",
    title: "YOLO Object Detection Pipeline",
    short_description:
      "Production-style Ultralytics YOLO pipeline for detecting people, vehicles, and assets in workplace camera footage.",
    full_description:
      "A reusable YOLO object-detection pipeline based on Ultralytics models. Train or fine-tune on your site’s cameras, then deploy for people counting, vehicle tracking, and asset detection across entrances, yards, and production areas.",
    technologies: ["YOLO", "Ultralytics", "Object Detection", "PyTorch"],
    thumbnail_image: "/cv-projects/yolo-detection/poster.jpg",
    preview_video: "/cv-projects/yolo-detection/demo.mp4",
    features: [
      "Ultralytics YOLO training & inference",
      "People, vehicle, and asset detection",
      "Workplace camera deployment path",
      "Extensible class list for site needs",
    ],
  }),
  makeCvProject({
    id: "cv-vision-overview",
    title: "Camera AI for Site Awareness",
    short_description:
      "Practical computer vision that turns workplace cameras into sensors — detection, tracking, and operator-ready dashboards.",
    full_description:
      "A practical overview of how computer vision turns ordinary workplace cameras into always-on sensors. Covers detection, tracking, and how results reach operators through simple dashboards and alerts for day-to-day site awareness.",
    technologies: ["Computer Vision", "Tracking", "Edge / Cloud Inference", "Dashboards"],
    thumbnail_image: "/cv-projects/vision-overview/poster.jpg",
    preview_video: "/cv-projects/vision-overview/demo.mp4",
    features: [
      "Camera-as-sensor architecture",
      "Detection + tracking workflows",
      "Operator dashboards and alerts",
      "Clear path from demo to deployment",
    ],
  }),
  makeCvProject({
    id: "cv-smart-farming",
    title: "Agri Object Detection (Smart Farming)",
    short_description:
      "Field and greenhouse camera detection for crops and livestock — object detection tuned for outdoor farm conditions.",
    full_description:
      "Object detection for smart farming: cameras in fields or barns detect and count crops, animals, or equipment. Built to handle outdoor lighting and motion so farms get reliable counts and early issue flags without walking every row.",
    technologies: ["Object Detection", "Smart Farming", "Computer Vision", "Python"],
    thumbnail_image: "/cv-projects/smart-farming/poster.jpg",
    preview_video: "/cv-projects/smart-farming/demo.mp4",
    features: [
      "Outdoor-ready object detection",
      "Crop and livestock monitoring",
      "Camera-based farm automation",
      "Counts and alerts for operators",
    ],
  }),
  makeCvProject({
    id: "cv-poultry-segmentation",
    title: "Poultry Behavior Segmentation",
    short_description:
      "Instance segmentation for poultry behavior analysis — track birds and activity zones from overhead farm cameras.",
    full_description:
      "YOLO-based instance segmentation for poultry houses. Overhead cameras segment individual birds and behavior regions so farms can monitor welfare, density, and unusual activity without constant human observation.",
    technologies: ["Instance Segmentation", "YOLO", "Behavior Analysis", "Agri Vision"],
    thumbnail_image: "/cv-projects/poultry-segmentation/poster.jpg",
    preview_video: "/cv-projects/poultry-segmentation/demo.mp4",
    features: [
      "Instance masks per bird",
      "Behavior and density insights",
      "Overhead farm camera support",
      "Welfare-focused monitoring",
    ],
  }),
  makeCvProject({
    id: "cv-wildlife-conservation",
    title: "Wildlife Camera Detection",
    short_description:
      "Conservation-grade computer vision for camera traps and remote sites — detect animals automatically in field footage.",
    full_description:
      "Machine-learning detection for conservation camera traps. Models flag animals in remote footage so researchers spend less time scrubbing video and more time acting on sightings — the same detection stack adapts to remote workplace perimeter cameras.",
    technologies: ["Computer Vision", "Camera Traps", "Machine Learning", "Object Detection"],
    thumbnail_image: "/cv-projects/wildlife-conservation/poster.jpg",
    preview_video: "/cv-projects/wildlife-conservation/demo.mp4",
    features: [
      "Automated animal detection in footage",
      "Camera-trap and remote-site ready",
      "Reduces manual video review",
      "Transferable to perimeter monitoring",
    ],
  }),
];
