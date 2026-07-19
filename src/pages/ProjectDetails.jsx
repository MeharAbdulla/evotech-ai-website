import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiCpu, FiCheckCircle, FiFileText, FiLayers, FiAlertCircle, FiImage, FiCode, FiExternalLink } from "react-icons/fi";
import projectService from "../services/projectService";

import { API_BASE_URL } from "../services/apiClient";

/**
 * Normalizes asset URLs by verifying if paths are absolute or relative vectors.
 * Prepend API base target coordinates for all localized storage objects.
 */
const normalizeAssetUrl = (urlPath, origin) => {
  if (!urlPath || typeof urlPath !== "string" || !urlPath.trim()) return "";
  const trimmedPath = urlPath.trim();
  if (/^(data:|blob:|https?:\/\/)/i.test(trimmedPath)) {
    return trimmedPath;
  }
  const cleanPath = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
  if (origin === "public" || cleanPath.startsWith("/Projects/")) {
    return cleanPath;
  }
  return `${API_BASE_URL}${cleanPath}`;
};

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [circuitFailed, setCircuitFailed] = useState(false);
  const [sourceCode, setSourceCode] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setThumbnailFailed(false);
    setCircuitFailed(false);

    const fetchProject = async () => {
      setLoading(true);
      setError("");
      try {
        if (!id) {
          throw new Error("Missing project ID.");
        }
        const data = await projectService.getProjectById(id);
        if (!data) {
          throw new Error("Project not found.");
        }
        setProject(data);
      } catch (err) {
        console.error("Project load error:", err);
        setError(
          err.response?.data?.detail || 
          err.message || 
          "Failed to establish network connection with project telemetry clusters."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!project?.source_url) {
      setSourceCode("");
      return undefined;
    }

    let active = true;
    fetch(project.source_url)
      .then((response) => {
        if (!response.ok) throw new Error("Source file could not be loaded.");
        return response.text();
      })
      .then((code) => {
        if (active) setSourceCode(code);
      })
      .catch(() => {
        if (active) setSourceCode("");
      });

    return () => {
      active = false;
    };
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center font-sans space-y-4 pt-20">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center font-sans px-6 pt-20">
        <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/50 rounded-2xl text-rose-400 max-w-xl mx-auto mb-6">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <div className="space-y-1">
            <h5 className="text-xs font-bold uppercase tracking-wider">Could not load project</h5>
            <p className="text-xs text-rose-400/80 leading-normal font-medium">{error}</p>
          </div>
        </div>
        <Link to="/projects" className="text-cyan-400 hover:underline flex items-center gap-2 text-sm">
          <FiArrowLeft /> Back to projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center font-sans pt-20">
        <h2 className="text-2xl font-bold text-slate-400 mb-4">Project not found</h2>
        <Link to="/projects" className="text-cyan-400 hover:underline flex items-center gap-2 text-sm">
          <FiArrowLeft /> Back to projects
        </Link>
      </div>
    );
  }

  // Dual Naming Convention Resolution Pipelines
  const rawThumbnail = project.thumbnail_image || project.image || "";
  const rawCircuit =
    project.circuit_diagram ||
    project.circuitDiagram ||
    (Array.isArray(project.gallery_images) && project.gallery_images.length > 0
      ? project.gallery_images[0]
      : "");
  const rawZip = project.zip_file || project.zipFile || "";
  const rawDownload = project.download_url || rawZip;
  const rawSource = project.source_url || "";
  
  const thumbnailImage = normalizeAssetUrl(rawThumbnail, project.origin);
  const circuitDiagram = normalizeAssetUrl(rawCircuit, project.origin);
  const downloadFile = normalizeAssetUrl(rawDownload, project.origin);
  const sourceFile = normalizeAssetUrl(rawSource, project.origin);
  
  // Display full_description as the main working principle/detailed documentation if available
  const workingPrinciple = project.full_description || project.working_principle || project.workingPrinciple || "";
  const hardwareComponents = project.hardware_components || project.hardwareComponents || [];
  const softwareStack = project.software_stack || project.softwareStack || [];
  
  // Safe array coercion primitives
  const objectivesList = Array.isArray(project.objectives) ? project.objectives : [];
  const featuresList = Array.isArray(project.features) ? project.features : [];
  const technologiesList = Array.isArray(project.technologies) ? project.technologies : [];
  const hardwareList = Array.isArray(hardwareComponents) ? hardwareComponents : [];
  const softwareList = Array.isArray(softwareStack) ? softwareStack : [];
  const applicationsList = Array.isArray(project.applications) ? project.applications : [];
  const benefitsList = Array.isArray(project.benefits) ? project.benefits : [];
  const usageSteps = Array.isArray(project.usage_steps) ? project.usage_steps : [];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white py-24 px-6 relative font-sans antialiased overflow-hidden">
      {/* Structural Decorative Background Lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Navigation Action Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors duration-200 bg-slate-900/60 border border-white/5 py-2.5 px-4 rounded-xl self-start"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
          <div className="flex flex-wrap gap-3">
          {sourceFile && (
            <a
              href={sourceFile}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-300 border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all duration-300 py-2.5 px-5 rounded-xl"
            >
              <FiExternalLink className="w-4 h-4" /> Open Source
            </a>
          )}
          {downloadFile && (
            <a 
              href={downloadFile}
              download
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-950 font-bold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 py-2.5 px-5 rounded-xl self-start sm:self-auto"
            >
              <FiDownload className="w-4 h-4" /> {project.download_url ? "Download .ino Code" : "Download ZIP Archive"}
            </a>
          )}
          </div>
        </div>

        {/* Master Project Header Grid */}
        <div className="grid lg:grid-cols-3 gap-12 items-start mb-16">
          <div className="lg:col-span-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase bg-cyan-400/5 border border-cyan-500/20 px-3 py-1 rounded-full shadow-sm">
              {project.category || "General"} Systems Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 text-white leading-tight">
              {project.title || "Untitled Project"}
            </h1>
            <p className="text-slate-400 mt-6 text-base sm:text-lg leading-relaxed font-normal">
              {project.short_description || project.overview || "No runtime overview parameters configured for this entity link."}
            </p>
          </div>

          {/* Infrastructure Context Side Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl w-full">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">
              Project Parameters
            </h4>
            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block mb-1">Project Category</span>
                <span className="text-white font-sans font-bold text-sm">{project.category || "Not Available"}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Status</span>
                <span className="text-emerald-400 font-sans font-bold text-sm capitalize">{project.status || project.result || "Active Pipeline"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Asset Box */}
        <div className="relative w-full h-[320px] sm:h-[480px] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 mb-16 shadow-2xl flex items-center justify-center">
          {thumbnailImage && !thumbnailFailed ? (
            <img 
              src={thumbnailImage} 
              alt={project.title || "Project Asset Image"} 
              className="w-full h-full object-cover object-center"
              onError={() => {
                console.error(`Asset Engine Failure: Unable to fetch thumbnail buffer source -> ${thumbnailImage}`);
                setThumbnailFailed(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-600 font-mono text-xs">
              <FiImage className="w-8 h-8 opacity-40" />
              <span>Image Asset Unavailable</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-60" />
        </div>

        {/* Deep Detailed Technical Architecture Sheets */}
        <div className="space-y-16 border-t border-white/5 pt-16">
          
          {/* Section: Objectives & Features */}
          {(objectivesList.length > 0 || featuresList.length > 0) && (
            <div className="grid md:grid-cols-2 gap-12">
              {objectivesList.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
                    <FiFileText className="text-cyan-400 w-5 h-5" /> Project Objectives
                  </h3>
                  <ul className="space-y-3.5">
                    {objectivesList.map((obj, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                        <FiCheckCircle className="text-cyan-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {featuresList.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
                    <FiCpu className="text-cyan-400 w-5 h-5" /> Execution Metrics
                  </h3>
                  <ul className="space-y-3.5">
                    {featuresList.map((feat, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                        <FiCheckCircle className="text-blue-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Section: Technology & Components Matrix */}
          <div className="grid md:grid-cols-3 gap-8 bg-slate-950/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-500 mb-4">Technologies Implemented</h4>
              <div className="flex flex-wrap gap-2">
                {technologiesList.length > 0 ? (
                  technologiesList.map((tech, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/10 text-cyan-300">{tech}</span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic font-normal">No custom framework extensions cataloged.</span>
                )}
              </div>
            </div>
            
            {hardwareList.length > 0 && (
              <div>
                <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-500 mb-4">Hardware Component Layer</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-sans">
                  {hardwareList.map((hw, i) => (
                    <li key={i} className="flex items-center gap-2">• {hw}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {softwareList.length > 0 && (
              <div>
                <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-500 mb-4">Software Framework Stack</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-sans">
                  {softwareList.map((sw, i) => (
                    <li key={i} className="flex items-center gap-2">• {sw}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section: Operational Principle */}
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2.5">
              <FiLayers className="text-cyan-400 w-5 h-5" /> Project Documentation
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              {workingPrinciple || "Detailed project documentation will be available in a future update."}
            </p>
          </div>

          {usageSteps.length > 0 && (
            <div className="max-w-3xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
                <FiCheckCircle className="text-cyan-400 w-5 h-5" /> How to Use
              </h3>
              <ol className="space-y-4">
                {usageSteps.map((step, index) => (
                  <li key={step} className="flex gap-4 text-sm text-slate-400 leading-relaxed">
                    <span className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {sourceFile && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <FiCode className="text-cyan-400 w-5 h-5" /> Arduino Source Code
                </h3>
                <a href={downloadFile || sourceFile} download className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">
                  <FiDownload /> Download source
                </a>
              </div>
              <div className="bg-[#050911] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-5 py-3 border-b border-white/5 text-[11px] font-mono text-slate-500">
                  {project.id}.ino
                </div>
                <pre className="p-5 overflow-x-auto max-h-[520px] text-xs leading-6 text-slate-300 font-mono">
                  <code>{sourceCode || "Open or download the source file using the buttons above."}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Section: Circuit Schematic View */}
          {circuitDiagram && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Hardware Circuit Schematics</h3>
            <div className="bg-slate-950 border border-white/10 rounded-2xl p-4 sm:p-8 flex items-center justify-center shadow-xl min-h-[160px]">
              {circuitDiagram && !circuitFailed ? (
                <img 
                  src={circuitDiagram} 
                  alt="System Electrical Schematics Diagram" 
                  className="max-w-full h-auto rounded-lg border border-white/5 opacity-90 hover:opacity-100 transition-opacity duration-300"
                  onError={() => {
                    console.error(`Asset Engine Failure: Unable to fetch schematic layer data -> ${circuitDiagram}`);
                    setCircuitFailed(true);
                  }}
                />
              ) : (
                <span className="text-xs text-slate-500 font-mono italic">Circuit diagram unavailable.</span>
              )}
            </div>
          </div>
          )}

          {/* Section: Applications & Core Commercial Value */}
          {(applicationsList.length > 0 || benefitsList.length > 0) && (
            <div className="grid md:grid-cols-2 gap-12 pb-12">
              {applicationsList.length > 0 && (
                <div>
                  <h4 className="text-sm font-mono font-bold tracking-wider uppercase text-cyan-400 mb-4">Industrial Deployment Applications</h4>
                  <ul className="space-y-2.5 text-sm text-slate-400">
                    {applicationsList.map((app, i) => (
                      <li key={i} className="flex items-baseline gap-2">
                        <span className="text-cyan-400 font-mono">▸</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {benefitsList.length > 0 && (
                <div>
                  <h4 className="text-sm font-mono font-bold tracking-wider uppercase text-blue-400 mb-4">Enterprise Commercial Benefits</h4>
                  <ul className="space-y-2.5 text-sm text-slate-400">
                    {benefitsList.map((ben, i) => (
                      <li key={i} className="flex items-baseline gap-2">
                        <span className="text-blue-400 font-mono">▸</span>
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default ProjectDetails;