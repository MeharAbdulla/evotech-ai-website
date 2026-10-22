import React from "react";
import PageHero from "../Components/PageHero";
import Services from "../Components/Services";
import Seo from "../Components/Seo";
import { Link } from "react-router-dom";
import { serviceLandings } from "../data/serviceLandings";

const hubLinks = [
  "computer-vision",
  "workplace-object-detection",
  "industrial-inspection",
  "cctv-ai",
  "yolo",
  "edge-camera-deployment",
  "embedded-systems",
  "iot",
  "pcb-design",
  "drone-systems",
];

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Industrial Computer Vision & Engineering Services"
        description="Industrial computer vision, object detection, AI cameras, YOLO, edge deployment, embedded systems, IoT, and PCB design services from Aeromek."
        path="/services"
      />
      <PageHero
        eyebrow="Services"
        title="Industrial computer vision and engineering services"
        description="Workplace object detection, CCTV AI, and industrial camera systems — plus embedded, IoT, robotics, and PCB when your project needs more than vision."
        ctaLabel="Discuss Your Computer Vision Project"
        ctaTo="/contact"
      />
      <div className="bg-black px-4 sm:px-6 pb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {hubLinks.map((slug) => {
            const s = serviceLandings.find((x) => x.slug === slug);
            if (!s) return null;
            return (
              <Link
                key={slug}
                to={`/services/${slug}`}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-sky-300 hover:border-sky-400/40 transition-colors"
              >
                {s.h1.replace(" Services", "").replace(" Development", "")}
              </Link>
            );
          })}
        </div>
      </div>
      <Services hideIntro />
    </>
  );
}
