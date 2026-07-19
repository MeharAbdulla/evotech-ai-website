import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCpu, FiBox, FiWifi, FiLayers } from "react-icons/fi";
import Hero from "../Components/Hero";
import Projects from "../Components/Projects";
import CTAContactSection from "../Components/CTAContactSection";

const focusAreas = [
  {
    icon: FiCpu,
    title: "AI & Computer Vision",
    desc: "Detect defects, classify objects, and run models on edge devices — not only in the cloud.",
    to: "/services",
  },
  {
    icon: FiBox,
    title: "Robotics",
    desc: "Navigation, sensing, and automation for warehouses, factories, and custom robots.",
    to: "/services",
  },
  {
    icon: FiWifi,
    title: "IoT & Embedded",
    desc: "Sensors, firmware, and secure gateways that collect reliable data from the field.",
    to: "/services",
  },
  {
    icon: FiLayers,
    title: "Full Project Delivery",
    desc: "Hardware + software together: design, build, test, and hand over a working system.",
    to: "/projects",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="relative py-24 px-6 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sm font-black tracking-[0.35em] uppercase text-cyan-400">
              What we do
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-white tracking-tight">
              Clear engineering. Real delivery.
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              EVO Tech AI helps companies build intelligent machines and connected products.
              We keep scope clear, timelines realistic, and results testable.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {focusAreas.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.to}
                    className="block h-full p-6 rounded-2xl border border-cyan-500/10 bg-slate-900/40 hover:border-cyan-400/40 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400">
                      Learn more <FiArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/team"
              className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-slate-300 hover:border-cyan-400/40 hover:text-white transition-all"
            >
              Meet the team
            </Link>
            <Link
              to="/gigs"
              className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-slate-300 hover:border-cyan-400/40 hover:text-white transition-all"
            >
              Browse open gigs
            </Link>
            <Link
              to="/about"
              className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-slate-300 hover:border-cyan-400/40 hover:text-white transition-all"
            >
              About the company
            </Link>
          </div>
        </div>
      </section>

      <Projects />
      <CTAContactSection />
    </>
  );
}
