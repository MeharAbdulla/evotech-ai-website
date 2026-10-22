import React from "react";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";
import Developers from "../Components/Developers";

export default function TeamPage() {
  return (
    <>
      <Seo
        title="Team — AI, Embedded & Robotics Engineers"
        description="Meet the Aeromek engineers specializing in AI, computer vision, embedded systems, robotics, and IoT."
        path="/team"
      />
      <PageHero
        eyebrow="Team"
        title="People who build the systems"
        description="Engineers specializing in AI, embedded systems, robotics, and IoT — the team behind Aeromek projects."
        ctaLabel="Work with us"
        ctaTo="/contact"
      />
      <Developers hideIntro />
    </>
  );
}
