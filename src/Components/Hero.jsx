import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCompass } from "react-icons/fi";

const Hero = () => {
  // SVG grid pattern used as a data URI background
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(56, 189, 248, 0.04)' stroke-width='1'/%3E%3C/svg%3E")`;

  return (
    <div
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0f19] text-white font-sans antialiased pt-20 px-6"
    >
      {/* Subtle Digital Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: gridSvg }}
      />

      {/* Futuristic Ambient Glow Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
        
        {/* Decorative Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 bg-slate-950/60 backdrop-blur-md border border-cyan-500/20 px-3.5 py-1.5 rounded-full mb-6 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#38bdf8]">
            AI · Robotics · Embedded · IoT
          </span>
        </motion.div>

        {/* Primary Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
        >
          We build{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-cyan-400 to-blue-500">
            intelligent machines
          </span>{" "}
          for real industry
        </motion.h1>

        {/* Technical Subheading Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-normal"
        >
          EVO Tech AI designs and delivers AI systems, robots, firmware, and IoT products —
          from concept and prototype to a system you can run in production.
        </motion.p>

        {/* Dual CTA Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
        >
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#38bdf8] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm px-7 py-4 rounded-xl shadow-[0_4px_25px_rgba(56,189,248,0.25)] hover:shadow-[0_4px_35px_rgba(56,189,248,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            Start a project
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-white font-semibold text-sm px-7 py-4 rounded-xl transition-all duration-300 group"
          >
            <FiCompass className="w-4 h-4 text-[#38bdf8] group-hover:rotate-45 transition-transform duration-300" />
            See our projects
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 font-mono tracking-widest uppercase"
        >
          <span>AI Vision</span>
          <span>Robotics</span>
          <span>Firmware</span>
          <span>IoT</span>
          <span>Drones</span>
        </motion.div>
        
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
};

export default Hero;