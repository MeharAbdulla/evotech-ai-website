import React from 'react';
import { FiArrowLeft, FiGithub, FiExternalLink, FiLayers, FiInfo, FiImage, FiFileText } from 'react-icons/fi';

export default function ProjectDetails({ project, onClose }) {
  // Status Badge Formatting Matrix
  const getStatusBadge = (status) => {
    const normalize = status?.toLowerCase() || "";
    if (normalize === "completed" || normalize === "active") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{status}</span>;
    }
    if (normalize === "in_progress" || normalize === "development") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{status}</span>;
    }
    if (normalize === "planning") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">{status}</span>;
    }
    if (normalize === "cancelled") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">{status}</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">{status || "Not Available"}</span>;
  };

  // Timestamp Formatting Pipeline
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    try {
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6 text-slate-200 antialiased">
      {/* Structural Workspace Header Navigation */}
      <div className="flex items-center border-b border-slate-900 pb-5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 h-10 px-4 border border-slate-800 bg-transparent hover:bg-slate-950 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors duration-150"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Functional Spec Workspace Layout */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content Node */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-slate-950/50 space-y-6">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20 rounded">
                {project.category || "General"}
              </span>
              <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase mt-3">
                {project.title || "Untitled Project"}
              </h1>
              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                {project.short_description || "Not Available"}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FiFileText className="w-3.5 h-3.5" /> Functional Architectural Specifications
              </h3>
              <div className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/40 p-4 border border-slate-800/60 rounded-xl min-h-[120px] whitespace-pre-wrap">
                {project.full_description || "Not Available"}
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FiLayers className="w-3.5 h-3.5" /> Architectural Matrix Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                  project.technologies.map((tech, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-1 rounded bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-600 font-normal italic">Not Available</span>
                )}
              </div>
            </div>
          </div>

          {/* Media Telemetry Arrays */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-slate-950/50 space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-800/60 pb-3">
              <FiImage className="w-3.5 h-3.5" /> Media Infrastructure Grid
            </h3>
            
            <div className="space-y-6">
              {/* Spotlight Thumbnail Segment */}
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block mb-3">Spotlight Thumbnail</span>
                {project.thumbnail_image ? (
                  <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-3 max-w-sm space-y-2.5">
                    <div className="overflow-hidden rounded-lg border border-slate-800/80 h-52 bg-slate-900/40">
                      <img 
                        src={project.thumbnail_image} 
                        alt={`${project.title || 'Project'} Thumbnail`} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => { e.target.onerror = null;
                        e.target.src = "/placeholder-image.png"; }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800/50">
                      {project.thumbnail_image}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-600 font-normal italic">Not Available</span>
                )}
              </div>

              {/* Gallery Asset Grid Segment */}
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block mb-3">Gallery Asset References</span>
                {Array.isArray(project.gallery_images) && project.gallery_images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 border border-slate-800/60 p-4 rounded-xl">
                    {project.gallery_images.map((img, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800/60 rounded-xl p-3 space-y-2.5">
                        <div className="overflow-hidden rounded-lg border border-slate-800/80 h-52 bg-slate-900/40">
                          <img 
                            src={img} 
                            alt={`${project.title || 'Project'} Gallery ${idx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => { e.target.onerror = null;
                            e.target.src = "/placeholder-image.png"; }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800/50">
                          {img}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-600 font-normal italic">Not Available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Meta Parameter Sidebar */}
        <div className="space-y-6">
          {/* Metadata Grid */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-slate-950/50 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-800/60 pb-3">
              <FiInfo className="w-3.5 h-3.5" /> Environment Variables
            </h3>
            
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block mb-1">Operational State</span>
                {getStatusBadge(project.status)}
              </div>

              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block mb-1">Cluster Spotlight Position</span>
                {project.featured ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Yes</span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950 text-slate-600 border border-slate-800 uppercase tracking-wider">No</span>
                )}
              </div>

              <div className="border-t border-slate-800/60 pt-3">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block">Genesis Log Time</span>
                <span className="text-xs text-slate-300 font-mono">{formatDate(project.created_at || project.createdAt)}</span>
              </div>

              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block">Latest Mutation Log Time</span>
                <span className="text-xs text-slate-300 font-mono">{formatDate(project.updated_at || project.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Core System Distribution Targets */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-slate-950/50 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-800/60 pb-3">
              External Pipeline Gateways
            </h3>

            <div className="space-y-3">
              {project.github_url ? (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-indigo-400 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <FiGithub className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Version Control Terminal</span>
                  </div>
                  <FiExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              ) : (
                <div className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl flex items-center gap-2 text-slate-600">
                  <FiGithub className="w-4 h-4" />
                  <span className="text-xs font-normal italic">VCS Link Not Configured</span>
                </div>
              )}

              {project.live_demo_url ? (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-indigo-400 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <FiExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Deployment Runtime URI</span>
                  </div>
                  <FiExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              ) : (
                <div className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl flex items-center gap-2 text-slate-600">
                  <FiExternalLink className="w-4 h-4" />
                  <span className="text-xs font-normal italic">Runtime Link Not Configured</span>
                </div>
              )}
            </div>
          </div>

          {/* Storage Distribution Artifact References */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-slate-950/50 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-800/60 pb-3">
              Distribution Packages
            </h3>

            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block mb-1">Source Archive (ZIP)</span>
                {project.zip_file ? (
                  <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 border border-slate-800 rounded-lg truncate">
                    {project.zip_file}
                  </div>
                ) : (
                  <span className="text-slate-600 font-normal italic">Not Available</span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block mb-1">Blueprint Specifications (PDF)</span>
                {project.pdf_document ? (
                  <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 border border-slate-800 rounded-lg truncate">
                    {project.pdf_document}
                  </div>
                ) : (
                  <span className="text-slate-600 font-normal italic">Not Available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}