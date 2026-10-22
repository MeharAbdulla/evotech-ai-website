import React from "react";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";
import CTAContactSection from "../Components/CTAContactSection";

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact Aeromek AI"
        description="Contact Aeromek AI to discuss computer vision, YOLO, embedded systems, IoT, ESP32, STM32, Raspberry Pi, or PCB design projects."
        path="/contact"
      />
      <PageHero
        eyebrow="Contact"
        title="Tell us what you want to build"
        description="Share your idea, problem, or deadline. We reply with a clear next step — usually a short call to confirm scope, timeline, and fit."
      />
      <CTAContactSection />
    </>
  );
}
