import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  FiEye,
  FiCamera,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import serviceService from "../services/serviceService";
import { coreServices } from "../data/coreServices";
import { agentServices } from "../data/agentServices";
import { coreServiceSlugMap } from "../data/serviceLandings";

const ICON_MAP = {
  FiCode,
  FiCpu,
  FiCloud,
  FiGlobe,
  FiSmartphone,
  FiLayers,
  FiZap,
  FiBox,
  FiEye,
  FiCamera,
};

const staticServices = [...coreServices, ...agentServices];

function servicePath(service) {
  if (service.slug) return `/services/${service.slug}`;
  if (service.id && coreServiceSlugMap[service.id]) {
    return `/services/${coreServiceSlugMap[service.id]}`;
  }
  return "/services";
}

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
        const apiList = Array.isArray(data) ? data : [];
        const apiExtra = apiList.filter(
          (s) => !staticServices.some((a) => a.title === s.title)
        );
        setServices([...staticServices, ...apiExtra]);
      } catch (err) {
        setError(err.message || "Failed to load services");
        setServices(staticServices);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section
      id="services"
      className={`relative bg-black text-slate-100 px-4 sm:px-6 overflow-hidden font-sans antialiased ${
        hideIntro ? "min-h-0 py-10 sm:py-12 pb-20 sm:pb-28" : "min-h-screen py-20 sm:py-32"
      }`}
    >
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-sky-500/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-blue-900/12 blur-[150px] pointer-events-none" />

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
              <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-sky-400 block">
                OUR OFFERINGS
              </span>
              <div className="h-[3px] w-12 bg-sky-400 mt-2 rounded-full" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black tracking-tight text-slate-50 pb-3"
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
              Workplace computer vision first — object detection, CCTV AI, and edge cameras —
              plus robotics, agents, PCB, IoT, and full product builds.
            </motion.p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 justify-center text-rose-400 text-xs mb-8">
            <FiAlertCircle /> Showing default services ({error})
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => {
              const Icon = ICON_MAP[service.icon] || FiLayers;
              const to = servicePath(service);
              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <Link
                    to={to}
                    className="group relative block h-full p-6 rounded-2xl bg-[#0a0a0a]/85 border border-sky-500/15 hover:border-sky-400/40 transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-5 group-hover:bg-sky-400 group-hover:text-[#05070d] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-50 mb-2 group-hover:text-sky-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {service.short_description}
                    </p>
                    {Array.isArray(service.features) && service.features.length > 0 && (
                      <ul className="space-y-1 mb-4">
                        {service.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-sky-400" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:gap-2 transition-all">
                      Learn more <FiArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
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
