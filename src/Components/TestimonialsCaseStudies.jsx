import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiArrowRight, FiCheckCircle, FiActivity, FiTrendingUp, FiCpu } from "react-icons/fi";

// Authentic, business-focused enterprise testimonials matrix
const testimonials = [
  {
    id: 1,
    name: "Dr. Elena Rostova",
    role: "VP of Robotics Infrastructure",
    company: "LogixMove Automation",
    location: "Germany",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    text: "The customized ROS2 migration and low-level firmware optimizations executed by the engineering team eliminated a multi-year critical navigation lag in our AMR fleets. Absolute domain experts in hardware-software integration.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Chief Technology Officer",
    company: "AeroSpec Defense Systems",
    location: "USA",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80",
    text: "Engineering an edge-computing drone payload that complies with stringent security architectures seemed near-impossible on our tight timeline. Their deep mastery of custom multilayer PCB design and encrypted telemetry made it seamless.",
    rating: 5
  },
  {
    id: 3,
    name: "Faisal Al-Saud",
    role: "Director of Smart Infrastructure",
    company: "NeoGrid Utilities",
    location: "UAE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    text: "Our industrial sensory telemetry layer required severe power optimization and ultra-low latency mesh networking. The custom STM32 and LoRaWAN framework built for us has continuously operated flawlessly without data dropped.",
    rating: 5
  },
  {
    id: 4,
    name: "Tariq Mahmood",
    role: "Head of Automation Engineering",
    company: "IndusVanguard Systems",
    location: "Pakistan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    text: "We contracted the team to overhaul our manufacturing pipeline using an integrated industrial IoT array and edge vision models. The intelligence they built directly prevented massive line faults while scaling visibility across our enterprise dashboards.",
    rating: 5
  }
];

// Technical engineering case studies matrix
const caseStudies = [
  {
    id: 1,
    title: "Predictive Vision-AI Factory Core",
    industry: "Manufacturing & Heavy Industrial Automation",
    challenge: "High unexpected downtime caused by tooling deterioration lines failing unannounced during structural shifts.",
    solution: "Deployed localized high-frequency sensory nodes paired with an edge convolutional model mapping acoustic metrics.",
    technologies: ["TensorFlow", "STM32H7", "Python", "MQTT"],
    metric: "94% Failure Warning Margin",
    metricLabel: "Downtime Reduced"
  },
  {
    id: 2,
    title: "Autonomous Distribution Hub Fleet",
    industry: "Logistics & Supply Chain Intelligence",
    challenge: "Deadlocks and sub-optimal corridor navigation pathways slowing localized fulfillment timelines across 3 distribution grids.",
    solution: "Designed custom ARM-based computing nodes utilizing high-accuracy LiDAR map stacks alongside fleet arbitration code.",
    technologies: ["ROS2", "NVIDIA Jetson", "C++", "LiDAR"],
    metric: "42% Throughput Increase",
    metricLabel: "Fulfillment Scaling"
  },
  {
    id: 3,
    title: "Distributed Urban Micro-Grid Mesh",
    industry: "Energy Infrastructure & Utilities",
    challenge: "Tamper protection issues and data packet drops within multi-tier high-density consumer environment grids.",
    solution: "Built localized ultra-low-power metering nodes backed by automated hardware cryptographic validation routines.",
    technologies: ["ESP32", "LoRaWAN", "AWS IoT Core", "ECDSA"],
    metric: "-30% Power Leakage",
    metricLabel: "Resource Reclamation"
  }
];

// Layout Animation Orchestrators
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
  }
};

const TestimonialsCaseStudies = () => {
  return (
    <section id="testimonials" className="relative min-h-screen bg-[#0b0f19] text-white py-32 px-6 overflow-hidden font-sans antialiased">
      
      {/* Absolute Cohesive Aurora Accent Backing Nodes */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />

      {/* Lightweight Shared Particle Matrix System */}
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
        
        {/* Section Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col items-center"
          >
            <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-cyan-400 block drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              PROVEN OUTCOMES
            </span>
            <div className="h-[3px] w-12 bg-cyan-400 mt-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white pb-3"
          >
            Trusted by Innovative Businesses Worldwide
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 mt-5 text-sm sm:text-base leading-relaxed"
          >
            Real client experiences and real engineering solutions delivering measurable business outcomes across global technology domains.
          </motion.p>
        </div>

        {/* Master Column Dashboard Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SUBSECTION — Testimonials Hub (5 Columns) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="pl-2 mb-2 flex items-center gap-2">
              <FiActivity className="text-cyan-400 w-4 h-4" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Client Operations Feedback</h3>
            </div>

            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative bg-slate-900/30 backdrop-blur-xl border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-400 shadow-xl"
              >
                {/* Micro Ambient Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                
                {/* Rating Score Layer */}
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="fill-current w-3.5 h-3.5" />
                  ))}
                </div>

                {/* Testimonial Quote Frame */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal italic">
                  "{testimonial.text}"
                </p>

                {/* Identity Metadata Header Block */}
                <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-xl object-cover border border-white/10 filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">{testimonial.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {testimonial.role} — <span className="text-cyan-400 font-semibold">{testimonial.company}</span> ({testimonial.location})
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT SUBSECTION — Featured Case Studies Hub (7 Columns) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="pl-2 mb-2 flex items-center gap-2">
              <FiCpu className="text-blue-400 w-4 h-4" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Deployed Field Engineering Summaries</h3>
            </div>

            {caseStudies.map((study) => (
              <motion.div
                key={study.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative bg-slate-900/30 backdrop-blur-xl border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 sm:p-8 transition-all duration-400 shadow-xl"
              >
                {/* Active Hover Glow Accent Mask */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                {/* Top Data Metric Row Integration */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                      {study.industry}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-3 tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
                      {study.title}
                    </h3>
                  </div>
                  
                  {/* Dynamic High Contrast Metric Result Box */}
                  <div className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 flex flex-col min-w-[140px] text-left sm:text-right shrink-0">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500">{study.metricLabel}</span>
                    <span className="text-sm font-black text-emerald-400 tracking-wide mt-0.5 flex items-center gap-1 sm:justify-end">
                      <FiTrendingUp className="w-3.5 h-3.5 shrink-0" />
                      {study.metric}
                    </span>
                  </div>
                </div>

                {/* Challenge & Solution Core Details Stack */}
                <div className="space-y-3.5 border-t border-white/5 pt-4 mb-6 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-mono text-[11px] uppercase tracking-wider mt-0.5 shrink-0 select-none">[Challenge]</span>
                    <p className="text-slate-400 font-normal leading-relaxed">{study.challenge}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-mono text-[11px] uppercase tracking-wider mt-0.5 shrink-0 select-none">[Solution]</span>
                    <p className="text-slate-300 font-medium leading-relaxed">{study.solution}</p>
                  </div>
                </div>

                {/* Technology Badges Layout and Call-To-Action Element */}
                <div className="border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {study.technologies.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-white transition-colors duration-300">
                    Technical Specifications
                    <FiArrowRight className="w-3.5 h-3.5 transition-transform duration-300 transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialsCaseStudies;