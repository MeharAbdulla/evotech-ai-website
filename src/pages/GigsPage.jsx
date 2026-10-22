import React from "react";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";
import Gigs from "../Components/Gigs";

export default function GigsPage() {
  return (
    <>
      <Seo
        title="Open Engineering Gigs"
        description="Short- and mid-term engineering gigs for AI, computer vision, embedded systems, and hardware projects."
        path="/gigs"
      />
      <PageHero
        eyebrow="Gigs"
        title="Open work opportunities"
        description="Short- and mid-term engineering gigs currently available. Check scope, budget range, skills needed, and status."
        ctaLabel="Propose a custom gig"
        ctaTo="/contact"
      />
      <Gigs hideIntro />
    </>
  );
}
