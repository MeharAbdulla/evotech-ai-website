import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiCpu,
  FiCloud,
  FiGlobe,
  FiSmartphone,
  FiLayers,
  FiZap,
  FiBox,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import serviceService from "../services/serviceService";

const ICON_MAP = {
  FiCode,
  FiCpu,
  FiCloud,
  FiGlobe,
  FiSmartphone,
  FiLayers,
  FiZap,
  FiBox,
};

const FALLBACK_SERVICES = [
  {
    id: "fallback-1",
    icon: "FiCode",
    title: "Custom Software Development",
    short_description:
      "Tailored enterprise solutions built to scale with reliable, high-performance architectures.",
  },
  {
    id: "fallback-2",
    icon: "FiCpu",
    title: "AI & Machine Learning",
    short_description:
      "Intelligent automation, predictive analytics, and computer vision for data-driven operations.",
  },
  {
    id: "fallback-3",
    icon: "FiCloud",
    title: "Cloud Solutions",
    short_description:
      "Secure cloud migration and infrastructure design maximizing uptime and cost efficiency.",
  },
  {
    id: "fallback-4",
    icon: "FiGlobe",
    title: "Web Development",
    short_description:
      "Next-generation web applications with speed, responsive design, and interactive UX.",
  },
  {
    id: "fallback-5",
    icon: "FiSmartphone",
    title: "Mobile App Development",
    short_description:
      "Cross-platform and native apps with smooth performance and offline capability.",
  },
  {
    id: "fallback-6",
    icon: "FiLayers",
    title: "UI/UX Design",
    short_description:
      "User-centric interfaces with premium visual frameworks and modern interaction design.",
  },
];

const Services = ({ hideIntro = false }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await serviceService.getServices({ status: "Active" });
        const list = Array.isArray(data) ? data : [];
        setServices(list.length > 0 ? list : FALLBACK_SERVICES);
      } catch (err) {
        setError(err.message || "Failed to load services");
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section
      id="services"
      className={`relative bg-[#0b0f19] text-white px-6 overflow-hidden font-sans antialiased ${
        hideIntro ? "min-h-0 py-12 pb-28" : "min-h-screen py-32"
      }`}
    >
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {!hideIntro && (
        <div className="text-center max-w-3xl mx-auto mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col items-center"
          >
            <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-cyan-400 block drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              OUR OFFERINGS
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
            Services we deliver
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 mt-5 text-sm sm:text-base leading-relaxed"
          >
            Practical engineering help — AI, robotics, IoT, embedded systems, and full product builds.
          </motion.p>
        </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 justify-center text-rose-400 text-xs mb-8">
            <FiAlertCircle /> Showing default services ({error})
          </div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = ICON_MAP[service.icon] || FiLayers;
              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="group relative p-6 rounded-2xl bg-slate-900/40 border border-cyan-500/10 hover:border-cyan-400/40 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {service.short_description}
                  </p>
                  {Array.isArray(service.features) && service.features.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {service.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <FiArrowRight className="w-3 h-3" />
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
