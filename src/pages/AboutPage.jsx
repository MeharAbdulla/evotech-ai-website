import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../Components/PageHero";
import About from "../Components/About";
import Technology from "../Components/Technology";
import IndustriesServed from "../Components/IndustriesServed";
import TestimonialsCaseStudies from "../Components/TestimonialsCaseStudies";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Who we are and how we work"
        description="EVO Tech AI is an engineering team focused on intelligent hardware and software for industry. We combine AI, robotics, embedded systems, and IoT into products that work in the field — not just demos."
        ctaLabel="Contact the team"
        ctaTo="/contact"
      />

      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            {
              title: "What we build",
              text: "AI vision systems, robots, firmware, drone stacks, and connected industrial devices.",
            },
            {
              title: "How we deliver",
              text: "Clear requirements, regular demos, documented handoff, and support after launch.",
            },
            {
              title: "Who we help",
              text: "Factories, agritech, logistics, energy, and product companies that need reliable automation.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-2xl border border-cyan-500/10 bg-slate-900/40"
            >
              <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-8">
          <Link to="/team" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
            See the engineering team →
          </Link>
        </div>
      </section>

      <About />
      <Technology />
      <IndustriesServed />
      <TestimonialsCaseStudies />
    </>
  );
}
