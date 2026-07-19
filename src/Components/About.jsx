  import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useInView, animate } from "framer-motion";
import { FiCpu, FiCheckCircle, FiShield, FiGlobe, FiLayers } from "react-icons/fi";
import { Briefcase, Factory, ShieldCheck, Handshake } from "lucide-react";

const highlights = [
  {
    icon: FiCpu,
    title: "Advanced AI & Robotics Engineering",
    desc: "Deploying sophisticated neural network models directly onto edge devices and dynamic robotic platforms for realtime autonomous decision making."
  },
  {
    icon: FiLayers,
    title: "Industrial-Grade Embedded Systems",
    desc: "Architecting microarchitectures and fault-tolerant firmware that endure intense physical operational environments with 99.99% uptime guarantees."
  },
  {
    icon: FiShield,
    title: "Scalable IoT Solutions",
    desc: "End-to-end telemetry pipeline frameworks built to process multi-million packet streams securely while preserving power profiles on node metrics."
  },
  {
    icon: FiGlobe,
    title: "Global Engineering Standards",
    desc: "Strict adherence to safety compliance models, modular ROS 2 protocols, and ISO certifications required by Tier 1 international partners."
  }
];

const statsData = [
  {
    id: 1,
    icon: Briefcase,
    targetNumber: 150,
    suffix: "+",
    title: "Projects Completed",
    description: "Successfully delivered intelligent engineering solutions across multiple industries."
  },
  {
    id: 2,
    icon: Factory,
    targetNumber: 10,
    suffix: "+",
    title: "Industries Served",
    description: "Serving automation, healthcare, manufacturing, defense, agriculture, energy, and more."
  },
  {
    id: 3,
    icon: ShieldCheck,
    targetNumber: 8,
    suffix: "+",
    title: "Years of Engineering Excellence",
    description: "Deep expertise in embedded systems, robotics, AI, firmware, and electronics."
  },
  {
    id: 4,
    icon: Handshake,
    targetNumber: 98,
    suffix: "%",
    title: "Client Satisfaction",
    description: "Focused on quality, reliability, communication, and long-term partnerships."
  }
];

const AnimatedCounter = ({ value, direction = "up" }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  useEffect(() => {
    if (isInView) {
      // Using linear-to-easeOut tween layout to eliminate the spring tail-end delay
      const controls = animate(motionValue, value, {
        duration: 1.5,
        ease: [0.25, 1, 0.5, 1], // Clean, predictable easeOut cubic curve
      });
      return () => controls.stop();
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      if (ref.current) {
        // Use Math.round instead of Math.floor to prevent lingering numbers
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
    return () => unsubscribe();
  }, [motionValue]);

  return <span ref={ref}>0</span>;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
  }
};

const About = () => {
  return (
    <section id="about" className="relative min-h-screen bg-[#0b0f19] text-white py-24 px-6 overflow-hidden font-sans antialiased">
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#38bdf8] mb-3">
              Corporate Capability
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Why Choose EVO Tech AI
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              We bridge the gap between advanced algorithmic abstract thinking and real-world industrial deployments. Our engineering groups architect deterministic hardware configurations capable of operating in dense environments without single points of failure.
            </p>

            <div className="space-y-6">
              {highlights.map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-[#38bdf8]/40">
                    <Icon className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide mb-1 group-hover:text-[#38bdf8] transition-colors duration-200">
                      {title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:pl-6 w-full flex justify-center"
          >
            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8]/40 to-transparent" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono text-slate-440 tracking-widest uppercase">
                    SYSTEM_ORCHESTRATION_CORE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">v4.0.21</span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 flex flex-col gap-2 relative">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>KINEMATIC_EFFICIENCY</span>
                    <span className="text-[#38bdf8] font-bold">98.4%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "98.4%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-[#38bdf8] rounded-full"
                    />
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>EDGE_INFERENCE_LATENCY</span>
                    <span className="text-cyan-400 font-bold">1.82 ms</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mb-0.5">MTBF RATE</p>
                    <p className="text-base font-bold text-white font-mono">&gt;12,000h</p>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mb-0.5">COMPLIANCE</p>
                    <p className="text-base font-bold text-[#38bdf8] font-mono">SIL-3</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <div className="flex gap-2">
                    <span>[SECURE_TUNNEL]</span>
                    <span>[TLS_1.3]</span>
                  </div>
                  <FiCheckCircle className="text-[#38bdf8] w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div id="trust-metrics" className="pt-16 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-4"
            >
              <span className="text-xs sm:text-sm font-black tracking-[0.35em] uppercase text-[#38bdf8] block">
                Trusted Engineering Partner
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-3xl sm:text-5xl font-black tracking-tight text-white pb-3"
            >
              Delivering Innovation with Proven Results
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-slate-400 mt-5 text-sm sm:text-base leading-relaxed font-normal max-w-2xl"
            >
              Empowering enterprise tech ecosystems across the USA, Europe, UAE, Saudi Arabia, and Pakistan with world-class architecture across AI deployment, custom multi-layer PCB design, field robotics, and industrial IoT solutions.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {statsData.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  className="group relative flex flex-col bg-slate-900/30 backdrop-blur-xl border border-white/[0.04] hover:border-[#38bdf8]/30 rounded-2xl p-8 shadow-2xl transition-all duration-500 overflow-hidden min-h-[260px]"
                >
                  <div className="absolute -inset-px bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />

                  <div className="mb-8 text-slate-500 group-hover:text-[#38bdf8] transition-colors duration-300">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: stat.id * 0.5
                      }}
                    >
                      <IconComponent className="w-6 h-6 stroke-[1.5]" />
                    </motion.div>
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-[#38bdf8] tracking-tight flex items-baseline gap-0.5 mb-3 font-sans select-none">
                    <AnimatedCounter value={stat.targetNumber} />
                    <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 opacity-95">
                      {stat.suffix}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 tracking-wide font-sans group-hover:text-cyan-200 transition-colors duration-300">
                    {stat.title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed font-normal">
                    {stat.description}
                  </p>

                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-[#38bdf8]/40 group-hover:to-transparent transition-all duration-700" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;