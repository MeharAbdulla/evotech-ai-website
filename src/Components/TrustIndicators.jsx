import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { Briefcase, Factory, ShieldCheck, Handshake } from "lucide-react";

// Stat configuration with targeted values for enterprise trust
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

// Reusable Counter Engine utilizing spring physics for an Apple/SaaS level smooth rolling effect
const AnimatedCounter = ({ value, direction = "up" }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 120,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
};

// Orchestration Variants for scroll trigger layout layout initialization
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

const TrustIndicators = () => {
  return (
    <section id="trust-metrics" className="relative min-h-screen bg-[#0b0f19] text-white py-32 px-6 overflow-hidden font-sans antialiased">
      
      {/* Reused Aurora Glow Effects matching previous sections */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Reused Floating AI Particle Engine Component Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4"
          >
            <span className="text-xs sm:text-sm font-black tracking-[0.35em] uppercase text-blue-400 block">
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

        {/* Responsive Grid System */}
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
                className="group relative flex flex-col bg-slate-900/30 backdrop-blur-xl border border-white/[0.04] hover:border-blue-500/30 rounded-2xl p-8 shadow-2xl transition-all duration-500 overflow-hidden min-h-[260px]"
              >
                {/* Micro Hover Soft Blue Shadow Accent Mask */}
                <div className="absolute -inset-px bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />

                {/* Card Icon Header with Subtle Floating Hover */}
                <div className="mb-8 text-slate-500 group-hover:text-blue-400 transition-colors duration-300">
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

                {/* Animated Stat Value Field */}
                <div className="text-4xl sm:text-5xl font-black text-blue-500 tracking-tight flex items-baseline gap-0.5 mb-3 font-sans select-none">
                  <AnimatedCounter value={stat.targetNumber} />
                  <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 opacity-95">
                    {stat.suffix}
                  </span>
                </div>

                {/* Label metadata tracking */}
                <h3 className="text-sm font-bold text-white mb-2 tracking-wide font-sans group-hover:text-blue-200 transition-colors duration-300">
                  {stat.title}
                </h3>
                
                <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed font-normal">
                  {stat.description}
                </p>

                {/* Refined clean bottom baseline indicator */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-blue-500/40 group-hover:to-transparent transition-all duration-700" />
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default TrustIndicators;