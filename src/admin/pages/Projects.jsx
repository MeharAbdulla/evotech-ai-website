import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiBox, FiAlertCircle } from "react-icons/fi";
import projectService from "../services/projectService";
import ProjectForm from "../components/ProjectForm";
import ProjectDetails from "../components/ProjectDetails";

export default function Projects() {
  // Data and UI Core States
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Interaction and Overlay Trigger States
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  // Memoized Lifecycle Initialization Vector
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await projectService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to fetch projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Operational Creation Dispatch Handler
  const handleCreateSubmit = async (formData) => {
    setError("");
    try {
      const createdProject = await projectService.createProject(formData);
      console.log("Created Project:", createdProject);
      await fetchProjects();
      setShowCreateForm(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to initialize and append project data record parameters."
      );
    }
  };

  // Operational Update Dispatch Handler
  const handleUpdateSubmit = async (formData) => {
    setError("");
    try {
      await projectService.updateProject(editingProject.id, formData);
      setEditingProject(null);
      await fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to synchronize and commit project structural amendments."
      );
    }
  };

  // Operational Destruction Dispatch Handler
  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    setError("");
    try {
      await projectService.deleteProject(projectId);
      await fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to purge and eliminate the target project record parameters."
      );
    }
  };

  // Status Badge Formatting Matrix
  const getStatusBadge = (status) => {
    const normalize = status?.toLowerCase() || "";
    if (normalize === "completed" || normalize === "active") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{status}</span>;
    }
    if (
  normalize === "in progress" ||
  normalize === "development"
) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{status}</span>;
    }
    if (normalize === "planning") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">{status}</span>;
    }
    if (normalize === "cancelled") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">{status}</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">{status || "Unknown"}</span>;
  };

  // Timestamp Formatting Pipeline
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  // Intercept interface view execution loop if Detailed View layout is triggered
  if (viewingProject) {
    return (
      <ProjectDetails
        project={viewingProject}
        onClose={() => setViewingProject(null)}
      />
    );
  }

  // Intercept interface view execution loop if Creation form workflow is triggered
  if (showCreateForm) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 antialiased">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400 max-w-4xl mx-auto">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-sm font-semibold tracking-wide">Data Persist Exception</h5>
              <p className="text-xs text-rose-400/80 leading-normal">{error}</p>
            </div>
          </div>
        )}
        <ProjectForm
          mode="create"
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setShowCreateForm(false);
            setError("");
          }}
        />
      </div>
    );
  }

  // Intercept interface view execution loop if Editing form workflow is triggered
  if (editingProject) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 antialiased">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400 max-w-4xl mx-auto">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-sm font-semibold tracking-wide">Data Mutate Exception</h5>
              <p className="text-xs text-rose-400/80 leading-normal">{error}</p>
            </div>
          </div>
        )}
        <ProjectForm
          mode="edit"
          initialData={editingProject}
          onSubmit={handleUpdateSubmit}
          onCancel={() => {
            setEditingProject(null);
            setError("");
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-slate-200 antialiased">
      {/* Module Header Identity Terminal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-slate-100 uppercase">
            Project Engineering Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor, deploy, and configure continuous system project structures within the cluster environment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow-lg shadow-indigo-600/10 transition-all duration-200 uppercase tracking-wider font-semibold self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Exception Error Telemetry Display */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-sm font-semibold tracking-wide">Data Fetch Exception</h5>
            <p className="text-xs text-rose-400/80 leading-normal">{error}</p>
          </div>
        </div>
      )}

      {/* Conditional UI Workspace Layout */}
      {loading ? (
        /* Asynchronous Structural Skeletal Loading Blocks */
        <div className="space-y-4">
          <div className="w-full h-12 bg-slate-900/40 border border-slate-800/60 rounded-xl animate-pulse" />
          <div className="w-full h-64 bg-slate-900/20 border border-slate-800/40 rounded-xl animate-pulse" />
        </div>
      ) : projects.length === 0 ? (
        /* Minimalist Empty Telemetry Cluster State Display */
        <div className="flex flex-col items-center justify-center text-center p-16 bg-slate-900/30 border border-slate-900 border-dashed rounded-2xl max-w-xl mx-auto mt-12">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-slate-600 mb-4">
            <FiBox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">No Active Project Structures</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
            The cluster database returned zero records. Initialize a brand new software engineering project entity to populate this matrix.
          </p>
        </div>
      ) : (
        /* Responsive Data Frame View Grid */
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4 max-w-[280px]">Technologies</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 font-medium">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-950/30 transition-colors duration-150 group">
                    {/* Title and Identification Meta */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors duration-150 truncate max-w-[200px]">
                        {project.title || "Untitled Project"}
                      </div>
                    </td>

                    {/* Category Label */}
                    <td className="px-6 py-4 text-slate-400">
                      {project.category || "—"}
                    </td>

                    {/* Operational Status Mapping */}
                    <td className="px-6 py-4">
                      {getStatusBadge(project.status)}
                    </td>

                    {/* Featured Cluster Sequence */}
                    <td className="px-6 py-4 text-center">
                      {project.featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Yes</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950 text-slate-600 border border-slate-800 uppercase tracking-wider">No</span>
                      )}
                    </td>

                    {/* Architectural Array Tags */}
                    <td className="px-6 py-4 max-w-[280px]">
                      <div className="flex flex-wrap gap-1.5 max-h-[38px] overflow-hidden">
                        {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                          project.technologies.map((tech, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono border border-slate-800">
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 font-normal italic">None configured</span>
                        )}
                      </div>
                    </td>

                    {/* Local Timeline Timestamp */}
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(project.created_at || project.createdAt)}
                    </td>

                    {/* Modular Action Interfaces */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingProject(project)}
                          title="View Project Details"
                          className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg border border-transparent transition-all duration-150"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProject(project)}
                          title="Edit Blueprint"
                          className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/60 rounded-lg border border-transparent transition-all duration-150"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          title="Purge Record"
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent transition-all duration-150"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}