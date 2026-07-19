import React from "react";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiCloud,
  FiEye,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";

const techStack = [
  {
    category: "Artificial Intelligence",
    icon: FiActivity,
    items: ["OpenAI", "TensorFlow", "PyTorch"],
  },
  {
    category: "Embedded Systems",
    icon: FiCpu,
    items: ["STM32", "ESP32", "Arduino", "Raspberry Pi"],
  },
  {
    category: "Robotics & Vision",
    icon: FiEye,
    items: ["ROS2", "OpenCV", "NVIDIA Jetson"],
  },
  {
    category: "Cloud & IoT",
    icon: FiCloud,
    items: ["AWS IoT", "Microsoft Azure", "Google Cloud"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const Technology = () => {
  return (
    <section
      id="technology"
      className="relative min-h-screen bg-[#0b0f19] text-white py-24 px-6 overflow-hidden font-sans antialiased"
    >
      {/* 8. Better Background Glow */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* 9. Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-cyan-400 font-semibold tracking-[0.2em] uppercase text-xs mb-3">
            Our Engineering Stack
          </p>
          
          {/* 1. Gradient Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Technology Expertise
          </h2>

          {/* 10. Better Section Divider */}
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          </div>

          <p className="text-slate-400 mt-6 text-sm sm:text-base leading-relaxed">
            We combine Artificial Intelligence, Embedded Systems, Robotics, and
            Cloud technologies to build next-generation intelligent solutions.
          </p>
        </motion.div>

        {/* Categories Grid System */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {techStack.map((tech) => {
            const Icon = tech.icon;

            return (
              <motion.div
                key={tech.category}
                variants={cardVariants}
                /* 7. Better Hover Animation */
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(34,211,238,0.05)",
                }}
                /* 2. Premium Card Border */
                className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-cyan-500/10 hover:border-cyan-400/40 rounded-2xl p-6 flex flex-col transition-all duration-500"
              >
                {/* 3. Card Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl" />

                {/* Category Header Section */}
                <div className="flex items-center gap-3.5 mb-6 relative z-10">
                  {/* 5. Better Icon Box */}
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 p-3 rounded-xl border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/10 transition-all duration-300 group-hover:shadow-cyan-400/30">
                    {/* 4. Animated Icon */}
                    <Icon className="w-5 h-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6" />
                  </div>
                  <h3 className="font-bold text-base text-white tracking-wide">
                    {tech.category}
                  </h3>
                </div>

                {/* 6. Technology Badges (Flex wrap pills configuration) */}
                <div className="flex flex-wrap gap-2 flex-1 items-start content-start relative z-10">
                  {tech.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm text-slate-300 hover:bg-cyan-500/20 transition duration-300"
                    >
                      <FiCheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Technology;