import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Integrated for single-page routing
import { FiArrowRight, FiDownload, FiAlertCircle } from "react-icons/fi";
import { FiCpu } from "react-icons/fi"; // Fallback icon component for API driven objects
import projectService from "../services/projectService";
import { API_BASE_URL } from "../services/apiClient";

const categories = ["All", "AI", "Robotics", "IoT", "Embedded", "Drone"];

const resolveAssetUrl = (assetPath, project) => {
  if (!assetPath) return "";
  if (/^(data:|https?:\/\/)/i.test(assetPath) || project.origin === "public") {
    return assetPath;
  }
  return `${API_BASE_URL}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Projects = ({ hideIntro = false }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch projects from the FastAPI system backend service
  useEffect(() => {
    const fetchProjectsData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await projectService.getProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.detail || 
          err.message || 
          "Failed to establish telemetry connection with data repository clusters."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  // Filter projects by runtime category selections
  const filteredProjects = projects.filter((project) =>
    activeFilter === "All" ? true : project.category === activeFilter
  );

  return (
    <section id="projects" className="relative min-h-screen bg-[#0b0f19] text-white py-28 px-6 overflow-hidden font-sans antialiased">
      
      {/* Aurora Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Floating AI Particles */}
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
        
        {/* Section Heading Block */}
        {!hideIntro && (
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col items-center"
          >
            <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-cyan-400 block drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              FEATURED PROJECTS
            </span>
            <div className="h-[3px] w-12 bg-cyan-400 mt-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent pb-2"
          >
            Real projects. Clear results.
          </motion.h2>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <div className="h-0.5 w-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-slate-400 mt-6 text-sm sm:text-base leading-relaxed"
          >
            Browse work across AI, robotics, IoT, embedded systems, and drones — or filter by category.
          </motion.p>
        </div>
        )}

        {/* Filter Navigation Control Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`flex flex-wrap justify-center items-center gap-2 max-w-3xl mx-auto relative z-20 ${hideIntro ? "mb-10" : "mb-16"}`}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`relative px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all duration-300 border focus:outline-none ${
                activeFilter === category
                  ? "border-[#38bdf8] text-slate-950 font-bold z-10"
                  : "border-white/5 bg-slate-900/40 text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {activeFilter === category && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-[#38bdf8] rounded-xl -z-10 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {category}
            </button>
          ))}
        </motion.div>

        {/* Dynamic Loading Overlay State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-slate-400 space-y-4">
            <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Loading projects...</p>
          </div>
        )}

        {/* Error panel */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/50 rounded-2xl text-rose-400 max-w-xl mx-auto my-12">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold uppercase tracking-wider">Could not load projects</h5>
              <p className="text-xs text-rose-400/80 leading-normal font-medium">
               {Array.isArray(error)
                ? error.map((err, index) => (
                <span key={index} className="block">
                {err.msg}
           </span>
      ))
    : error}
</p>
            </div>
          </div>
        )}

        {/* Project Cards Layout Engine with AnimatePresence Mode */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500"
                >
                  <p className="text-sm font-mono uppercase tracking-widest">
                    No projects in this category yet
                  </p>
                </motion.div>
              ) : (
              filteredProjects.map((project) => {
                // Runtime mapping checks or defaults for schema values
                const projectImage = project.thumbnail_image
                  ? resolveAssetUrl(project.thumbnail_image, project)
                  : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe";
                const downloadUrl = project.download_url
                  ? resolveAssetUrl(project.download_url, project)
                  : resolveAssetUrl(project.zip_file, project);
                const techList = Array.isArray(project.technologies) ? project.technologies : [];
                
                return (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 15 }}
                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    whileHover={{ y: -10, scale: 1.015 }}
                    className="group relative flex flex-col bg-slate-900/30 backdrop-blur-xl border border-cyan-500/10 hover:border-cyan-400/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500"
                  >
                    {/* Micro Ambient Card Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                    {/* Media/Image Window with Zoom effect */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent z-10 opacity-80" />
                      <motion.img
                        src={projectImage}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      
                      {/* Industry tag absolute placement */}
                      <span className="absolute top-4 left-4 z-20 px-3 py-1 text-[10px] font-semibold tracking-wider text-cyan-300 uppercase bg-slate-950/80 backdrop-blur-md rounded-full border border-cyan-500/30 shadow-md">
                        {project.category || "General"}
                      </span>

                      {/* Icon floating layer */}
                      <div className="absolute bottom-4 right-4 z-20 w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-cyan-400 group-hover:text-white transition-colors duration-300">
                        <FiCpu className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" />
                      </div>
                    </div>

                    {/* Content Details Block */}
                    <div className="p-6 flex flex-col flex-1 relative z-10">
                      <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
                        {project.title || "Untitled Project"}
                      </h3>
                      
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 flex-1">
                        {project.short_description || "No runtime description configured for this project structure entry."}
                      </p>

                      {/* Technology badging layout */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {techList.length > 0 ? (
                          techList.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-slate-300 hover:bg-cyan-500/20 transition-colors duration-300"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">No technologies defined</span>
                        )}
                      </div>

                      {/* Result Metric Area */}
                      <div className="border-t border-white/5 pt-4 mt-auto flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Metric Result</span>
                          <span className="text-xs font-semibold text-emerald-400 tracking-wide mt-0.5">
                            ✓ {project.status || "Active Pipeline"}
                          </span>
                        </div>

                        {/* Twin Action Trigger Button Configuration Layout */}
                        <div className="grid grid-cols-2 gap-2 w-full pt-1">
                          <Link 
                            to={`/projects/${project.id}`}
                            className="inline-flex items-center justify-center gap-1 text-[11px] font-bold py-2 px-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 text-center"
                          >
                            View & Use
                            <FiArrowRight className="w-3 h-3" />
                          </Link>
                          
                          {downloadUrl ? (
                            <a 
                              href={downloadUrl}
                              download
                              className="inline-flex items-center justify-center gap-1 text-[11px] font-bold py-2 px-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all duration-300 text-center"
                            >
                              Download Code
                              <FiDownload className="w-3 h-3" />
                            </a>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center justify-center gap-1 text-[11px] font-medium py-2 px-2 rounded-lg bg-slate-950/40 border border-white/5 text-slate-600 cursor-not-allowed text-center"
                            >
                              Unavailable
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Center Bottom CTA Segment */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-28 relative max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-slate-900/80 to-slate-950/40 backdrop-blur-xl border border-cyan-500/10 overflow-hidden shadow-2xl"
        >
          {/* Internal ambient glow background inside CTA block */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide mb-3">
            Want to Build Something Extraordinary?
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm sm:leading-relaxed mb-8">
            Let's discuss your next AI, Robotics, Embedded Systems, or Industrial IoT project.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(34,211,238,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20"
            >
              Schedule a Free Consultation
            </motion.button>
            
            <motion.button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-white bg-white/5 border border-white/10 rounded-xl transition-all duration-300"
            >
              View Full Portfolio
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;