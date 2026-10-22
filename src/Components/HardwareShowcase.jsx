import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCpu, FiRadio, FiBox, FiWifi, FiLayers, FiZap } from "react-icons/fi";

/**
 * Front-page hardware groups — each card uses a real preview from /public/pcb.
 */
const hardwareGroups = [
  {
    name: "STM32 Flight Control",
    subtitle: "High-performance STM32H750 flight controller PCB prototype.",
    image: "/pcb/stm32h750-fc/board.png",
    to: "/projects/pcb-stm32h750-fc",
    Icon: FiCpu,
    tag: "STM32",
  },
  {
    name: "ESP32 XIAO FC",
    subtitle: "Compact Wi-Fi flight controller for micro drones.",
    image: "/pcb/esp32-xiao-fc/board.png",
    to: "/projects/pcb-esp32-xiao-fc",
    Icon: FiRadio,
    tag: "ESP32",
  },
  {
    name: "Simon ESP32 Game",
    subtitle: "ESP32 memory-game PCB with full product layout.",
    image: "/pcb/simon-esp32/board.png",
    to: "/projects/pcb-simon-esp32",
    Icon: FiZap,
    tag: "ESP32",
  },
  {
    name: "RoboCup Mainboard",
    subtitle: "Competition main control board with interactive 3D OBJ.",
    image: "/pcb/robocup/board.png",
    to: "/projects/pcb-robocup-main",
    Icon: FiBox,
    tag: "Robotics",
  },
  {
    name: "4G IoT Remote",
    subtitle: "Cellular IoT control board for remote industrial actuation.",
    image: "/pcb/4g-iot/board.jpg",
    to: "/projects/pcb-4g-iot-remote",
    Icon: FiWifi,
    tag: "IoT",
  },
  {
    name: "Pool Monitor PCB",
    subtitle: "Smart swimming-pool sensing and control board.",
    image: "/pcb/pool-monitor/board.png",
    to: "/projects/pcb-pool-monitor",
    Icon: FiLayers,
    tag: "Sensors",
  },
  {
    name: "TortuBot ESP32",
    subtitle: "Educational mobile robot platform PCB (Single V2).",
    image: "/pcb/tortubot/board.png",
    to: "/projects/pcb-tortubot",
    Icon: FiBox,
    tag: "Education",
  },
  {
    name: "PCB 3D Showcase",
    subtitle: "Motion preview of proprietary board geometry.",
    image: "/pcb/stm32h750-fc/board.png",
    video: "/pcb/pcb-showcase/preview.mp4",
    to: "/projects/pcb-3d-showcase",
    Icon: FiLayers,
    tag: "3D",
  },
];

export default function HardwareShowcase() {
  return (
    <section className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 bg-black">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-sky-400">
              PCB Portfolio
            </p>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Real boards from our PCB lab
            </h2>
            <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Every group below uses actual design previews from our proprietary PCB folders —
              STM32, ESP32, IoT, robotics, and educational platforms.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 self-start lg:self-auto text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Browse all projects <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {hardwareGroups.map((card, index) => {
            const Icon = card.Icon;
            return (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <Link
                  to={card.to}
                  className="group block h-full rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0a0a0a] hover:border-sky-400/40 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-all duration-400 hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-[#060a12] overflow-hidden">
                    {card.video ? (
                      <video
                        src={card.video}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        muted
                        loop
                        playsInline
                        preload="none"
                        ref={(node) => {
                          if (!node || node.dataset.observed) return;
                          node.dataset.observed = "1";
                          const io = new IntersectionObserver(
                            ([entry]) => {
                              if (entry.isIntersecting) {
                                node.play().catch(() => {});
                              } else {
                                node.pause();
                              }
                            },
                            { threshold: 0.25 }
                          );
                          io.observe(node);
                        }}
                      />
                    ) : (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1018] via-transparent to-transparent opacity-80 pointer-events-none" />
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-sky-200 bg-black/55 border border-sky-500/30 rounded-md backdrop-blur-sm">
                      {card.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                          {card.name}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
