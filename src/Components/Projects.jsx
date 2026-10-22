import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiDownload, FiAlertCircle, FiBox, FiMaximize2 } from "react-icons/fi";
import projectService from "../services/projectService";
import { API_BASE_URL } from "../services/apiClient";
import EngineeringBackdrop from "./EngineeringBackdrop";

const PcbFullscreenViewer = lazy(() => import("./PcbFullscreenViewer"));

const categories = ["All", "AI", "PCB", "Robotics", "IoT", "Embedded", "Drone"];

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
      staggerChildren: 0.1,
    },
  },
};

const Projects = ({ hideIntro = false, excludeIds = [] }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [open3d, setOpen3d] = useState(null);
  const excludeSet = new Set(excludeIds);

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
            "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (excludeSet.has(project.id)) return false;
    return activeFilter === "All" ? true : project.category === activeFilter;
  });

  return (
    <section
      id="projects"
      className="relative min-h-screen bg-black text-slate-100 py-16 sm:py-24 md:py-28 px-4 sm:px-6 overflow-hidden font-sans antialiased"
    >
      <EngineeringBackdrop density="light" />

      {open3d ? (
        <Suspense fallback={null}>
          <PcbFullscreenViewer
            open
            onClose={() => setOpen3d(null)}
            modelUrl={open3d.modelUrl}
            mtlUrl={open3d.mtlUrl}
            title={open3d.title || "PCB 3D View"}
          />
        </Suspense>
      ) : null}

      <div className="max-w-7xl mx-auto relative z-10">
        {!hideIntro && (
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex flex-col items-center"
            >
              <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-sky-400 block">
                FEATURED PROJECTS
              </span>
              <div className="h-[3px] w-12 bg-sky-500 mt-2 rounded-full" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-5xl font-black tracking-tight text-slate-50 pb-2"
            >
              Agents, boards, and field systems.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-slate-400 mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed px-1"
            >
              Browse AI agents, PCB hardware, and robotics work. Use{" "}
              <span className="text-sky-300 font-semibold">Open 3D</span> on boards
              with an OBJ model.
            </motion.p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`flex flex-nowrap sm:flex-wrap justify-start sm:justify-center items-center gap-2 max-w-4xl mx-auto relative z-20 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin ${hideIntro ? "mb-8 sm:mb-10" : "mb-10 sm:mb-16"}`}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`relative shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider rounded-xl transition-all duration-300 border focus:outline-none ${
                activeFilter === category
                  ? "border-sky-400 text-[#05070d] font-bold z-10"
                  : "border-white/5 bg-[#0a0a0a]/70 text-slate-400 hover:text-white hover:border-sky-500/30"
              }`}
            >
              {activeFilter === category && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-sky-400 rounded-xl -z-10 shadow-[0_0_20px_rgba(232,164,90,0.35)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {category}
            </button>
          ))}
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-slate-400 space-y-4">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
              Loading projects...
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/50 rounded-2xl text-rose-400 max-w-xl mx-auto my-12">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
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

        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 min-h-[280px] sm:min-h-[400px]"
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
                  const projectImage = project.thumbnail_image
                    ? resolveAssetUrl(project.thumbnail_image, project)
                    : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe";
                  const isProprietary =
                    project.proprietary || project.open_source === false;
                  const model3d = project.model_3d
                    ? resolveAssetUrl(project.model_3d, project)
                    : "";
                  const mtlUrl = model3d.endsWith(".obj")
                    ? model3d.replace(/\.obj$/i, ".mtl")
                    : "";
                  const hasRealObj = Boolean(model3d);
                  const isAgent = project.category === "AI Agents";
                  const isVision = Boolean(project.preview_video) && !hasRealObj;
                  const mediaBadge = hasRealObj
                    ? "3D OBJ"
                    : isVision
                      ? "Demo"
                      : isAgent
                        ? "Agent"
                        : project.category === "PCB"
                          ? "Board"
                          : "Project";
                  const downloadUrl = isProprietary
                    ? ""
                    : project.download_url
                      ? resolveAssetUrl(project.download_url, project)
                      : resolveAssetUrl(project.zip_file, project);
                  const techList = Array.isArray(project.technologies)
                    ? project.technologies
                    : [];

                  const openFullscreen3d = (e) => {
                    e?.preventDefault?.();
                    e?.stopPropagation?.();
                    if (!hasRealObj) return;
                    setOpen3d({
                      modelUrl: model3d,
                      mtlUrl: mtlUrl || undefined,
                      title: project.title || "PCB 3D",
                    });
                  };

                  return (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.96, y: 24 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 12 }}
                      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                      className="group relative flex flex-col bg-[#0a0a0a]/85 backdrop-blur-xl border border-sky-500/15 hover:border-sky-400/40 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 md:hover:-translate-y-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black">
                        <Link to={`/projects/${project.id}`} className="absolute inset-0 block">
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60 pointer-events-none" />
                          <motion.img
                            src={projectImage}
                            alt={project.title}
                            className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                              isVision || isAgent
                                ? "object-cover object-center"
                                : "object-contain object-center p-2"
                            }`}
                            loading="lazy"
                          />
                        </Link>

                        {hasRealObj && (
                          <button
                            type="button"
                            onClick={openFullscreen3d}
                            className="absolute bottom-3 left-3 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-400 text-[#05070d] text-[10px] font-black uppercase tracking-wider shadow-lg hover:bg-sky-300 transition-colors"
                          >
                            <FiMaximize2 className="w-3.5 h-3.5" /> Open 3D
                          </button>
                        )}

                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-40 px-2.5 sm:px-3 py-1 text-[10px] font-semibold tracking-wider text-sky-100 uppercase bg-black/85 backdrop-blur-md rounded-full border border-sky-500/30 shadow-md pointer-events-none">
                          {project.category || "General"}
                        </span>

                        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-sky-200 bg-black/85 border border-sky-500/35 rounded-md pointer-events-none">
                          {mediaBadge}
                        </span>
                      </div>

                      <div className="p-4 sm:p-6 flex flex-col flex-1 relative z-10">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-50 mb-2 tracking-wide group-hover:text-sky-300 transition-colors duration-300">
                          {project.title || "Untitled Project"}
                        </h3>

                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 flex-1">
                          {project.short_description || "No description available."}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-5">
                          {techList.length > 0 ? (
                            techList.map((tech, i) => (
                              <span
                                key={i}
                                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-slate-300"
                              >
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-600 italic">
                              No technologies defined
                            </span>
                          )}
                        </div>

                        <div className="border-t border-white/5 pt-4 mt-auto flex flex-col gap-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                              Status
                            </span>
                            <span className="text-xs font-semibold text-emerald-400 tracking-wide mt-0.5">
                              ✓ {project.status || "Active"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 w-full pt-1">
                            {hasRealObj ? (
                              <button
                                type="button"
                                onClick={openFullscreen3d}
                                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold py-2.5 px-2 rounded-lg bg-sky-400 text-[#05070d] hover:bg-sky-300 transition-all duration-300"
                              >
                                <FiBox className="w-3.5 h-3.5" />
                                Open 3D
                              </button>
                            ) : (
                              <Link
                                to={`/projects/${project.id}`}
                                className="inline-flex items-center justify-center gap-1 text-[11px] font-bold py-2.5 px-2 rounded-lg border border-sky-400/30 bg-sky-500/10 text-sky-200 hover:bg-sky-400 hover:text-[#05070d] transition-all duration-300 text-center"
                              >
                                View design
                                <FiArrowRight className="w-3 h-3" />
                              </Link>
                            )}

                            <Link
                              to={`/projects/${project.id}`}
                              className="inline-flex items-center justify-center gap-1 text-[11px] font-bold py-2.5 px-2 rounded-lg bg-black border border-white/10 text-slate-300 hover:text-white hover:border-sky-500/40 transition-all duration-300 text-center"
                            >
                              Details
                              <FiArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          {downloadUrl ? (
                            <a
                              href={downloadUrl}
                              download
                              className="inline-flex items-center justify-center gap-1 text-[11px] font-bold py-2 px-2 rounded-lg bg-black border border-white/10 text-slate-400 hover:text-white transition-all"
                            >
                              Download Code <FiDownload className="w-3 h-3" />
                            </a>
                          ) : isProprietary ? (
                            <span className="text-center text-[10px] font-mono uppercase tracking-wider text-sky-500/70 border border-sky-500/20 rounded-lg py-2">
                              Closed source
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-28 relative max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-[#0a1018]/90 to-black/60 backdrop-blur-xl border border-sky-500/15 overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-900/20 blur-3xl pointer-events-none" />

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-wide mb-3">
            Want to build something extraordinary?
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm sm:leading-relaxed mb-8">
            Let&apos;s discuss your next AI, robotics, embedded, or IoT project.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-[#05070d] bg-sky-400 hover:bg-sky-300 rounded-xl transition-all duration-300 shadow-lg shadow-sky-900/30"
            >
              Schedule a Free Consultation
            </motion.button>

            <motion.button
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }
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
