import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";
import About from "../Components/About";
import Technology from "../Components/Technology";
import IndustriesServed from "../Components/IndustriesServed";
import TestimonialsCaseStudies from "../Components/TestimonialsCaseStudies";

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Aeromek AI — Vision & Embedded Engineering"
        description="Aeromek is an engineering team focused on workplace computer vision, object detection, embedded systems, IoT, and PCB design."
        path="/about"
      />
      <PageHero
        eyebrow="About"
        title="Who we are and how we work"
        description="Aeromek is an engineering team focused on workplace computer vision — object detection and camera AI for industry — with robotics, embedded systems, and IoT when you need the full product."
        ctaLabel="Contact the team"
        ctaTo="/contact"
      />

      <section className="px-6 pb-8 bg-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            {
              title: "What we build",
              text: "Workplace vision systems, CCTV AI, industrial detection, robots, firmware, and connected devices.",
            },
            {
              title: "How we deliver",
              text: "Clear requirements, regular demos, documented handoff, and support after launch.",
            },
            {
              title: "Who we help",
              text: "Factories, warehouses, agritech, logistics, and product companies that need reliable camera AI.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-2xl border border-sky-500/15 bg-[#0a0a0a]/80"
            >
              <h3 className="text-base font-bold text-slate-50 mb-2">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-8">
          <Link to="/team" className="text-sm font-semibold text-sky-400 hover:text-sky-300">
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
