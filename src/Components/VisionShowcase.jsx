import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { cvProjects } from "../data/cvProjects";

/** Featured only — full CV catalog lives in Projects below (avoids duplicate posters). */
const FEATURED_CV = cvProjects.slice(0, 3);

/**
 * Homepage showcase — workplace computer vision / object detection only.
 */
export default function VisionShowcase() {
  return (
    <section className="cv-section relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 bg-black">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-sky-400">
              AI Projects
            </p>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Workplace vision systems that ship
            </h2>
            <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Object detection and camera AI for factories, warehouses, farms, and sites —
              fire alerts, PPE/parts detection, CCTV monitoring, and live counting.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
              <Link
                to="/services/workplace-object-detection"
                className="text-sky-400 hover:text-sky-300 font-semibold"
              >
                Warehouse collision avoidance
              </Link>
              <Link
                to="/services/industrial-inspection"
                className="text-sky-400 hover:text-sky-300 font-semibold"
              >
                Textile machine vision
              </Link>
              <Link
                to="/services/drone-systems"
                className="text-sky-400 hover:text-sky-300 font-semibold"
              >
                Drone building inspection
              </Link>
            </div>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            Browse all projects <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURED_CV.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.12) }}
            >
              <Link
                to={`/projects/${project.id}`}
                className="group block h-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-sky-400/40 transition-all duration-300"
              >
                <div className="relative h-44 sm:h-48 overflow-hidden bg-black">
                  <img
                    src={project.thumbnail_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-sky-200 bg-black/70 border border-sky-500/30 rounded-md">
                    AI Vision
                  </span>
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-400 text-[#05070d] text-[10px] font-black uppercase tracking-wider">
                    <FiPlay className="w-3 h-3" /> Watch demo
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400 line-clamp-2">
                    {project.short_description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
