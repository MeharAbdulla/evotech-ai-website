import React from "react";
import PageHero from "../Components/PageHero";
import Projects from "../Components/Projects";

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Work we have built"
        description="Browse real engineering work across AI, robotics, IoT, embedded systems, and drones. Open a project for specs, downloads, and technical details."
        ctaLabel="Need something similar?"
        ctaTo="/contact"
      />
      <Projects hideIntro />
    </>
  );
}
