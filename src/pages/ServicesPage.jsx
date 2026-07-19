import React from "react";
import PageHero from "../Components/PageHero";
import Services from "../Components/Services";

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Engineering services you can hire"
        description="From AI models and robots to firmware and IoT gateways — we design, build, and deliver working systems your team can operate."
        ctaLabel="Talk about your project"
        ctaTo="/contact"
      />
      <Services hideIntro />
    </>
  );
}
