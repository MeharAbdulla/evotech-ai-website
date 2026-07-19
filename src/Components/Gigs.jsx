import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLayers, FiClock, FiDollarSign, FiAlertCircle, FiUserPlus, FiImage } from "react-icons/fi";
import gigService from "../services/gigService";
import { API_BASE_URL } from "../services/apiClient";

const resolveImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return "";
  const trimmed = imagePath.trim();
  if (/^(data:|blob:|https?:\/\/)/i.test(trimmed)) return trimmed;
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${cleanPath}`;
};

const Gigs = ({ hideIntro = false }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await gigService.getGigs();
        const list = Array.isArray(data) ? data : [];
        setGigs(list.filter((g) => g.status !== "Closed"));
      } catch (err) {
        setError(err.message || "Failed to load gigs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section
      id="gigs"
      className={`relative bg-[#0b0f19] text-white px-6 overflow-hidden font-sans antialiased ${
        hideIntro ? "min-h-0 py-12 pb-28" : "min-h-[70vh] py-28"
      }`}
    >
      <div className="absolute top-1/4 right-0 w-[420px] h-[420px] rounded-full bg-blue-600/5 blur-[140px] pointer-events-none" />

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
              OPEN GIGS
            </span>
            <div className="h-[3px] w-12 bg-cyan-400 mt-2 rounded-full" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white pb-3"
          >
            Opportunities Ready to Build
          </motion.h2>
          <p className="text-slate-400 mt-5 text-sm sm:text-base leading-relaxed">
            Browse open engineering gigs across AI, robotics, IoT, and embedded systems.
          </p>
        </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center gap-2 text-rose-400 text-xs mb-8">
            <FiAlertCircle /> {error}
          </div>
        )}

        {!loading && !error && gigs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
            <FiLayers className="w-8 h-8" />
            <p className="text-xs font-mono uppercase tracking-widest">No open gigs right now</p>
          </div>
        )}

        {!loading && gigs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig, index) => {
              const imageUrl = resolveImageUrl(gig.image);
              const hireMessage = `Hi EVO Technology, I want to hire for "${gig.title}"${gig.budget ? ` (${gig.budget})` : ""}.`;
              const hireTo = `https://wa.me/923217691508?text=${encodeURIComponent(hireMessage)}`;

              return (
              <motion.article
                key={gig.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-cyan-500/10 bg-slate-900/40 overflow-hidden hover:border-cyan-400/40 transition-all flex flex-col"
              >
                <div className="relative h-44 bg-slate-950 border-b border-white/5 flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={gig.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <FiImage className="w-7 h-7 opacity-50" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-cyan-500/20 text-cyan-300">
                      {gig.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-emerald-500/20 text-emerald-400">
                      {gig.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{gig.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-4">
                    {gig.short_description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(gig.skills || []).slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-white/5 pt-4 mb-4">
                    {gig.budget && (
                      <span className="inline-flex items-center gap-1">
                        <FiDollarSign className="w-3 h-3 text-cyan-400" /> {gig.budget}
                      </span>
                    )}
                    {gig.duration && (
                      <span className="inline-flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-cyan-400" /> {gig.duration}
                      </span>
                    )}
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

export default Gigs;
