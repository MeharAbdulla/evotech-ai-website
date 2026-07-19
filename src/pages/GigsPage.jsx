import React from "react";
import PageHero from "../Components/PageHero";
import Gigs from "../Components/Gigs";

export default function GigsPage() {
  return (
    <>
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
