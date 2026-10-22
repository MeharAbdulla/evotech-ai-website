import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { getFeaturedRcPlanes } from "../data/rcPlanes";

function formatUsd(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Homepage product showcase — Aeromek RC airplanes (matches AI Projects card style).
 */
export default function RcPlanesShowcase() {
  const featured = getFeaturedRcPlanes(3);

  return (
    <section className="cv-section relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 bg-black">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-sky-400">
              Our Products
            </p>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Aeromek RC airplanes ready to order
            </h2>
            <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Aerobatic, sport scale, and EDF jet airframes — priced in USD with specs and
              photos. Built for pilots who want clear product details and fast ordering.
            </p>
          </div>
          <Link
            to="/rc-planes"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            Browse all RC planes <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {featured.map((plane, index) => (
            <motion.div
              key={plane.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.12) }}
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
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {plane.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400 line-clamp-2">
                    {plane.short_description}
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
