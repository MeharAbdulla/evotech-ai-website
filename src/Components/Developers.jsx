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
        setDevelopers(
          list
            .filter((d) => d.status !== "Inactive")
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        );
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
      className={`relative bg-black text-slate-100 px-6 overflow-hidden font-sans antialiased ${
        hideIntro ? "min-h-0 py-12 pb-28" : "min-h-screen py-28"
      }`}
    >
      <div className="absolute top-1/3 -left-20 w-[480px] h-[480px] rounded-full bg-sky-500/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[480px] h-[480px] rounded-full bg-blue-900/12 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {!hideIntro && (
          <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 flex flex-col items-center"
            >
              <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-sky-400 block">
                OUR TEAM
              </span>
              <div className="h-[3px] w-12 bg-sky-400 mt-2 rounded-full" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-black tracking-tight text-slate-50"
            >
              Engineers Behind the Build
            </motion.h2>
            <p className="text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
              AI, robotics, and full-stack specialists ready to ship.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {developers.map((dev, index) => {
              const imageSrc = resolveImageUrl(dev.profile_image);
              const skills = (dev.skills || []).slice(0, 4);
              const hireMessage = `Hi Aeromek, I want to hire ${dev.name}${dev.role ? ` (${dev.role})` : ""} for a project.`;
              const hireTo = `https://wa.me/923217691508?text=${encodeURIComponent(hireMessage)}`;

              return (
                <motion.article
                  key={dev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col h-full rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden hover:border-sky-400/35 transition-colors"
                >
                  <div className="relative h-72 sm:h-80 bg-[#080808] border-b border-white/5 flex items-center justify-center p-3 overflow-hidden">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={dev.name}
                        className="w-full h-full object-contain object-center"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-black text-sky-400/70">
                        {(dev.name || "?").charAt(0)}
                      </div>
                    )}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-black/70 border border-white/10 ${statusClass(
                        dev.status
                      )}`}
                    >
                      {dev.status}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1 min-h-0">
                    <div className="min-h-[4.5rem]">
                      <h3 className="text-lg font-bold text-slate-50 leading-snug">
                        {dev.name}
                      </h3>
                      <p className="text-[11px] text-sky-400 uppercase tracking-[0.14em] font-semibold mt-1">
                        {dev.role}
                      </p>
                      {dev.experience ? (
                        <p className="text-[11px] text-slate-500 mt-1">{dev.experience}</p>
                      ) : null}
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed mt-3 line-clamp-2 min-h-[2.75rem]">
                      {dev.bio}
                    </p>

                    <div className="mt-4 min-h-[3.25rem] flex flex-wrap content-start gap-1.5">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 flex items-center gap-3 border-t border-white/5">
                      <div className="flex items-center gap-2 min-h-[1.25rem]">
                        {dev.github_url ? (
                          <a
                            href={dev.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-white transition-colors"
                            aria-label={`${dev.name} on GitHub`}
                          >
                            <FiGithub className="w-4 h-4" />
                          </a>
                        ) : null}
                        {dev.linkedin_url ? (
                          <a
                            href={dev.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-white transition-colors"
                            aria-label={`${dev.name} on LinkedIn`}
                          >
                            <FiLinkedin className="w-4 h-4" />
                          </a>
                        ) : null}
                      </div>
                      <a
                        href={hireTo}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-[#05070d] bg-sky-400 hover:bg-sky-300 transition-colors"
                      >
                        <FiUserPlus className="w-3.5 h-3.5" />
                        Hire
                      </a>
                    </div>
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
