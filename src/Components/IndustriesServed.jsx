import React from "react";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiSettings,
  FiFeather,
  FiShield,
  FiTruck,
  FiZap,
  FiCpu,
  FiBookOpen,
  FiCompass,
  FiGlobe,
  FiActivity,
  FiLayers
} from "react-icons/fi";

// Comprehensive high-tier industries configuration matrix
const industriesData = [
  {
    id: 1,
    title: "Healthcare & Medical Devices",
    description: "AI-powered diagnostics, safety-critical medical embedded systems, certified remote patient monitoring, and intelligent healthcare automation hardware.",
    icon: FiHeart,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: 2,
    title: "Manufacturing & Automation",
    description: "Next-gen industrial robotics, automated assembly lines, deep-edge vision tracking infrastructure, and smart machinery optimization.",
    icon: FiSettings,
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    id: 3,
    title: "Aerospace & Defense",
    description: "Autonomous drone guidance frameworks, secure military-grade telemetry, customized avionics, and ruggedized edge computing modules.",
    icon: FiShield,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    title: "Automotive & Smart Mobility",
    description: "Connected vehicle telematics, advanced ADAS sensor integration frameworks, firmware for powertrain units, and custom EV subsystem tracking.",
    icon: FiCompass,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 5,
    title: "Logistics & Supply Chain",
    description: "Autonomous warehouse mobile robots (AMRs), automated inventory sortation nodes, real-time asset telemetry tracking, and localized cold-chain IoT arrays.",
    icon: FiTruck,
    gradient: "from-amber-500 to-orange-500"
  },
  {
    id: 6,
    title: "Energy & Utilities",
    description: "Cryptographically verified smart grid metering infrastructure, automated predictive power management models, and ultra-rugged sensory systems for harsh fields.",
    icon: FiZap,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    id: 7,
    title: "Agriculture & Smart Farming",
    description: "Precision mapping hexacopters with multispectral image analytics, edge irrigation networks, and low-power autonomous agricultural pathfinding.",
    icon: FiFeather,
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    id: 8,
    title: "Smart Cities & Infrastructure",
    description: "Distributed mesh node networks for environmental monitoring, smart traffic optimization sensors, and centralized urban facility telemetry controllers.",
    icon: FiGlobe,
    gradient: "from-sky-500 to-indigo-500"
  },
  {
    id: 9,
    title: "Consumer Electronics",
    description: "Ultra-low-power high-performance wearable microcontrollers, custom multilayer PCB layout engineering, and responsive Bluetooth/Wi-Fi smart consumer products.",
    icon: FiCpu,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 10,
    title: "Education & Research",
    description: "Industrial-grade hardware simulation benches, specialized AI evaluation units, algorithmic robotics reference frames, and sandbox control platforms.",
    icon: FiBookOpen,
    gradient: "from-purple-500 to-cyan-500"
  }
];

// Layout orchestrator configurations
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 35 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] }
  }
};

const IndustriesServed = () => {
  return (
    <section id="industries" className="relative min-h-screen bg-[#0b0f19] text-white py-28 px-6 overflow-hidden font-sans antialiased">
      
      {/* Aurora Ambient Background Enhancements */}
      <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-blue-500/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Floating Network Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 bg-sky-400 rounded-full opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.15, 0.5, 0.15]
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col items-center"
          >
            <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-cyan-400 block drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              INDUSTRIES WE SERVE
            </span>
            <div className="h-[3px] w-12 bg-cyan-400 mt-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent pb-3"
          >
            Engineering Solutions Across Diverse Industries
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 mt-6 text-sm sm:text-base leading-relaxed"
          >
            We deliver intelligent hardware and software solutions for organizations across multiple industries, helping businesses innovate, automate, and scale with confidence.
          </motion.p>
        </div>

        {/* Responsive Grid System: 5 cols desktop, 2 cols tablet, 1 col mobile */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {industriesData.map((industry) => {
            const IconComponent = industry.icon;
            return (
              <motion.div
                key={industry.id}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative flex flex-col bg-slate-900/30 backdrop-blur-xl border border-white/5 hover:border-cyan-400/40 rounded-2xl p-6 shadow-2xl transition-all duration-500 overflow-hidden min-h-[280px]"
              >
                {/* Active Hover Ambient Glow Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                {/* Micro Icon Context Layer */}
                <div className="mb-6 relative">
                  <div className={`absolute -inset-2 rounded-xl bg-gradient-to-r ${industry.gradient} opacity-0 group-hover:opacity-20 blur-md transition duration-500`} />
                  <div className="relative w-12 h-12 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:text-white transition-colors duration-300 shadow-inner">
                    <IconComponent className="w-5 h-5 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110" />
                  </div>
                </div>

                {/* Text Data Block */}
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
                  {industry.title}
                </h3>
                
                <p className="text-slate-400 text-xs sm:text-xs leading-relaxed flex-1">
                  {industry.description}
                </p>

                {/* Subtle bottom design flourish accent line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-400 transition-all duration-700" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Highlight Call To Action Segment */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-20 relative max-w-5xl mx-auto rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-br from-slate-900/60 to-slate-950/20 backdrop-blur-2xl border border-white/5 overflow-hidden shadow-2xl flex flex-col items-center justify-center"
        >
          {/* Accent lighting rings */}
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          {/* Central Animated Node Icon */}
          <div className="mb-5 w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse">
            <FiLayers className="w-5 h-5" />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide mb-3">
            Building Technology That Powers Every Industry
          </h3>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm sm:leading-relaxed">
            From agile startups to massive global enterprises across the United States, Europe, UAE, Saudi Arabia, and Pakistan, we engineer reliable, scalable, and highly intelligent custom solutions engineered to tackle the unique computing and automation hurdles of your target ecosystem.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default IndustriesServed;