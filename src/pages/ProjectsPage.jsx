import React from "react";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";
import Projects from "../Components/Projects";

export default function ProjectsPage() {
  return (
    <>
      <Seo
        title="Projects — Computer Vision, Robotics & Hardware"
        description="Aeromek portfolio: workplace computer vision, YOLO demos, robotics, PCB, and IoT product builds."
        path="/projects"
      />
      <PageHero
        eyebrow="Engineering Portfolio"
        title="Workplace vision, robotics & hardware"
        description="Computer vision and camera AI for industry first — object detection demos, plus robotics, PCB, and product builds reviewed as portfolio pieces."
        ctaLabel="Need a vision system?"
        ctaTo="/contact"
      />
      <Projects hideIntro />
    </>
  );
}
