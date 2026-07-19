import React from "react";
import PageHero from "../Components/PageHero";
import Developers from "../Components/Developers";

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Team"
        title="People who build the systems"
        description="Engineers specializing in AI, embedded systems, robotics, and IoT — the team behind EVO Tech AI projects."
        ctaLabel="Work with us"
        ctaTo="/contact"
      />
      <Developers hideIntro />
    </>
  );
}
