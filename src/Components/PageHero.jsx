import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PageHero({ eyebrow, title, description, ctaLabel, ctaTo }) {
  return (
    <section className="relative pt-28 pb-16 px-6 overflow-hidden bg-[#0b0f19]">
      <div className="absolute top-20 right-0 w-[420px] h-[420px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <span className="text-sm font-black tracking-[0.35em] uppercase text-cyan-400 block mb-4">
              {eyebrow}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
          {ctaLabel && ctaTo && (
            <Link
              to={ctaTo}
              className="inline-flex mt-8 items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              {ctaLabel}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
