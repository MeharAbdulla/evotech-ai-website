import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const drones = [
  {
    src: "/drones/drone-4.jpg",
    title: "Hexacopter Platform",
    desc: "Multi-rotor airframes for inspection, mapping, and research payloads.",
  },
  {
    src: "/drones/drone-1.jpg",
    title: "Flight Systems",
    desc: "Controllers, sensing, and radio stacks tuned for stable flight.",
  },
  {
    src: "/drones/drone-2.jpg",
    title: "Aerial Robotics",
    desc: "Custom frames and electronics for industrial drone use cases.",
  },
  {
    src: "/drones/drone-3.jpg",
    title: "Field Testing",
    desc: "Outdoor validation of propulsion, autonomy, and payload integration.",
  },
];

export default function DronesShowcase() {
  return (
    <section className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 bg-black">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-sky-400">
              Aerial Systems
            </p>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Drones we design and fly
            </h2>
            <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Flight controllers, airframes, and onboard electronics — from micro drones
              to multi-rotor research platforms.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            See drone projects <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {drones.map((item, index) => (
            <motion.article
              key={item.src}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="group rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-sky-400/35 transition-all duration-400"
            >
              <div className="relative h-52 overflow-hidden bg-black">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
