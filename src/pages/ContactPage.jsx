import React from "react";
import PageHero from "../Components/PageHero";
import CTAContactSection from "../Components/CTAContactSection";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you want to build"
        description="Share your idea, problem, or deadline. We reply with a clear next step — usually a short call to confirm scope, timeline, and fit."
      />
      <CTAContactSection />
    </>
  );
}
