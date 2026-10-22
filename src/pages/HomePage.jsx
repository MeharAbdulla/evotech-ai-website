import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiEye, FiCpu, FiBox, FiWifi } from "react-icons/fi";
import Hero from "../Components/Hero";
import Seo from "../Components/Seo";
import VisionShowcase from "../Components/VisionShowcase";
import RcPlanesShowcase from "../Components/RcPlanesShowcase";
import LabVideoSection from "../Components/LabVideoSection";
import HardwareShowcase from "../Components/HardwareShowcase";
import DronesShowcase from "../Components/DronesShowcase";
import CTAContactSection from "../Components/CTAContactSection";
import { cvProjects } from "../data/cvProjects";

const Projects = lazy(() => import("../Components/Projects"));
const FEATURED_CV_IDS = cvProjects.slice(0, 3).map((p) => p.id);

const focusAreas = [
  {
    icon: FiEye,
    title: "Warehouse Collision Avoidance",
    desc: "Forklift and pedestrian camera AI for distribution centers — live alerts instead of after-the-fact footage.",
    to: "/services/workplace-object-detection",
  },
  {
    icon: FiCpu,
    title: "Textile Machine Vision",
    desc: "Fabric defect detection and line inspection with industrial cameras for manufacturing QA.",
    to: "/services/industrial-inspection",
  },
  {
    icon: FiBox,
    title: "Drone Building Inspection",
    desc: "UAV systems for commercial roof and property inspection — airframes, flight control, and camera payloads.",
    to: "/services/drone-systems",
  },
  {
    icon: FiWifi,
    title: "Workplace Computer Vision",
    desc: "YOLO object detection, CCTV AI, and edge cameras for factories, warehouses, and industrial sites.",
    to: "/services/computer-vision",
  },
];

export default function HomePage() {
  return (
    <>
      <Seo
        title="Industrial Computer Vision & AI Engineering"
        description="Industrial computer vision, object detection, and AI camera systems for factories and warehouses — plus embedded, IoT, and PCB when your project needs the full stack."
        path="/"
      />
      <Hero />

      <section className="cv-section relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 bg-black">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-sky-400">
              Who we help
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-black text-white tracking-tight">
              Camera AI for industrial operations teams
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed px-1">
              Plant, warehouse, and site teams use Aeromek for workplace computer vision —
              object detection, inspection, and safety monitoring on cameras you already own or plan to deploy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {focusAreas.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                  transition={{ delay: Math.min(index * 0.04, 0.16), duration: 0.35 }}
                >
                  <Link
                    to={item.to}
                    className="block h-full p-7 rounded-2xl border border-white/10 bg-[#0a0a0a] hover:border-sky-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-400 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-5 group-hover:bg-sky-400 group-hover:text-black transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-5">{item.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                      Learn more{" "}
                      <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <VisionShowcase />
      <LabVideoSection />
      <HardwareShowcase />
      <DronesShowcase />
      <Suspense
        fallback={
          <div className="min-h-[40vh] flex items-center justify-center bg-black">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
          </div>
        }
      >
        <Projects excludeIds={FEATURED_CV_IDS} />
      </Suspense>
      <RcPlanesShowcase />
      <CTAContactSection />
    </>
  );
}
