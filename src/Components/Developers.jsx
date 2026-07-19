import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiUsers, FiAlertCircle, FiUserPlus } from "react-icons/fi";
import developerService from "../services/developerService";
import { API_BASE_URL } from "../services/apiClient";

const resolveImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return "";
  const trimmed = imagePath.trim();
  if (/^(data:|blob:|https?:\/\/)/i.test(trimmed)) return trimmed;
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${cleanPath}`;
};

const statusClass = (status) => {
  if (status === "Busy") return "text-rose-400";
  if (status === "Available" || status === "Active") return "text-emerald-400";
  return "text-slate-400";
};

const Developers = ({ hideIntro = false }) => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await developerService.getDevelopers();
        const list = Array.isArray(data) ? data : [];
        setDevelopers(list.filter((d) => d.status !== "Inactive"));
      } catch (err) {
        setError(err.message || "Failed to load team");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section
      id="developers"
      className={`relative bg-[#0b0f19] text-white px-6 overflow-hidden font-sans antialiased ${
        hideIntro ? "min-h-0 py-12 pb-28" : "min-h-screen py-28"
      }`}
    >
      <div className="absolute top-1/3 -left-20 w-[480px] h-[480px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[480px] h-[480px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {!hideIntro && (
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex flex-col items-center"
          >
            <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-cyan-400 block">
              OUR TEAM
            </span>
            <div className="h-[3px] w-12 bg-cyan-400 mt-2 rounded-full" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white pb-3"
          >
            Engineers Behind the Build
          </motion.h2>
          <p className="text-slate-400 mt-5 text-sm sm:text-base leading-relaxed">
            Meet the specialists shipping AI, robotics, embedded, and IoT solutions.
          </p>
        </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center gap-2 text-rose-400 text-xs mb-8">
            <FiAlertCircle /> {error}
          </div>
        )}

        {!loading && !error && developers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
            <FiUsers className="w-8 h-8" />
            <p className="text-xs font-mono uppercase tracking-widest">Team roster coming soon</p>
          </div>
        )}

        {!loading && developers.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev, index) => {
              const imageSrc = resolveImageUrl(dev.profile_image);
              const hireMessage = `Hi EVO Technology, I want to hire ${dev.name}${dev.role ? ` (${dev.role})` : ""} for a project.`;
              const hireTo = `https://wa.me/923217691508?text=${encodeURIComponent(hireMessage)}`;

              return (
                <motion.article
                  key={dev.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-2xl border border-cyan-500/10 bg-slate-900/40 overflow-hidden hover:border-cyan-400/40 transition-all flex flex-col"
                >
                  <div className="relative h-52 bg-slate-950 border-b border-white/5 flex items-center justify-center overflow-hidden">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={dev.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-5xl font-black text-cyan-400/80">
                        {(dev.name || "?").charAt(0)}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70 pointer-events-none" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {dev.name}
                    </h3>
                    <p className="text-xs text-cyan-400/90 uppercase tracking-wider mt-0.5">
                      {dev.role}
                    </p>
                    {dev.experience && (
                      <p className="text-[11px] text-slate-500 mt-1">{dev.experience}</p>
                    )}
                    <p className="text-sm text-slate-400 leading-relaxed mt-4 mb-4 line-clamp-3 flex-1">
                      {dev.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(dev.skills || []).slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/5 mb-4">
                      {dev.github_url && (
                        <a
                          href={dev.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <FiGithub className="w-4 h-4" />
                        </a>
                      )}
                      {dev.linkedin_url && (
                        <a
                          href={dev.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <FiLinkedin className="w-4 h-4" />
                        </a>
                      )}
                      <span className={`ml-auto text-[10px] uppercase tracking-wider ${statusClass(dev.status)}`}>
                        {dev.status}
                      </span>
                    </div>
                    <a
                      href={hireTo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                    >
                      <FiUserPlus className="w-3.5 h-3.5" />
                      Hire on WhatsApp
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Developers;
