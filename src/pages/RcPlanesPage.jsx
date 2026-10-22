import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPackage, FiShoppingBag } from "react-icons/fi";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";
import {
  getRcPlanesByCategory,
  rcPlaneCategories,
  rcPlanes,
} from "../data/rcPlanes";

function formatUsd(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function PlaneCard({ plane, index }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ delay: Math.min(index * 0.03, 0.18), duration: 0.3 }}
    >
      <Link
        to={`/rc-planes/${plane.slug}`}
        className="group block h-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-sky-400/40 transition-all duration-300"
      >
        <div className="relative h-44 sm:h-48 overflow-hidden bg-black">
          <img
            src={plane.thumbnail}
            alt={plane.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-sky-200 bg-black/70 border border-sky-500/30 rounded-md">
            {plane.categories[0] || "RC Plane"}
          </span>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-400 text-[#05070d] text-[10px] font-black uppercase tracking-wider">
            <FiShoppingBag className="w-3 h-3" /> {formatUsd(plane.price_usd)}
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
            {plane.name}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400 line-clamp-2">
            {plane.short_description}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400">
            View product{" "}
            <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function RcPlanesPage() {
  const [category, setCategory] = useState("All");
  const grouped = useMemo(() => getRcPlanesByCategory(), []);

  const sections = useMemo(() => {
    if (category === "All") return grouped;
    return grouped.filter((g) => g.category === category);
  }, [category, grouped]);

  const visibleCount = sections.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <Seo
        title="RC Airplanes for Sale — Aeromek Products"
        description="Shop Aeromek RC airplane products: aerobatic, sport scale, and EDF jets. Clear USD pricing, photos, and specs. Order via WhatsApp or contact."
        path="/rc-planes"
      />
      <PageHero
        eyebrow="Our Products"
        title="Aeromek RC airplane collection"
        description="Organized by type — aerobatic, sport scale, EDF jets, and 3D airframes. Every product shows USD pricing so you can compare and order quickly."
        ctaLabel="Ask about a plane"
        ctaTo="/contact"
      />

      <section className="cv-section relative bg-black text-slate-100 px-4 sm:px-6 pb-24 sm:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-sky-500/8 blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {["All", ...rcPlaneCategories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  category === cat
                    ? "bg-sky-400 text-[#05070d] border-sky-400"
                    : "bg-white/5 text-slate-300 border-white/10 hover:border-sky-400/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500 mb-10 font-mono uppercase tracking-wider">
            {visibleCount} products · {rcPlanes.length} total · prices in USD
          </p>

          {sections.map((group) => (
            <div key={group.category} className="mb-14 sm:mb-16 last:mb-0">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
                <div>
                  <p className="text-xs font-bold tracking-[0.35em] uppercase text-sky-400">
                    Category
                  </p>
                  <h2 className="mt-2 text-xl sm:text-3xl font-black text-white tracking-tight">
                    {group.category}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {group.items.length} Aeromek product{group.items.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {group.items.map((plane, index) => (
                  <PlaneCard key={plane.id} plane={plane} index={index} />
                ))}
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
              <FiPackage className="w-8 h-8" />
              <p className="text-xs font-mono uppercase tracking-widest">No planes in this category</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
