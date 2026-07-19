import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiUsers } from "react-icons/fi";
import developerService from "../services/developerService";
import DeveloperForm from "../components/DeveloperForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

function resolveImageUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return "";
  const trimmed = imagePath.trim();
  if (/^(data:|blob:|https?:\/\/)/i.test(trimmed)) return trimmed;
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_BASE}${cleanPath}`;
}

function formatError(err) {
  const detail = err.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return detail || err.message || "Request failed";
}

export default function Developers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await developerService.getDevelopers();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (formData) => {
    try {
      await developerService.createDeveloper(formData);
      setShowCreate(false);
      await fetchItems();
    } catch (err) {
      setError(formatError(err));
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await developerService.updateDeveloper(editing.id, formData);
      setEditing(null);
      await fetchItems();
    } catch (err) {
      setError(formatError(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    try {
      await developerService.deleteDeveloper(id);
      await fetchItems();
    } catch (err) {
      setError(formatError(err));
    }
  };

  if (showCreate) {
    return (
      <div className="space-y-4">
        {error && <ErrorBanner error={error} />}
        <DeveloperForm mode="create" onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-4">
        {error && <ErrorBanner error={error} />}
        <DeveloperForm mode="edit" initialData={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Team</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage team member photos and details shown on the public Team page.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-400"
        >
          <FiPlus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {error && <ErrorBanner error={error} />}

      {loading ? (
        <p className="text-sm text-slate-500">Loading team...</p>
      ) : items.length === 0 ? (
        <EmptyState icon={FiUsers} label="No team members yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => {
                const photo = resolveImageUrl(item.profile_image);
                return (
                  <tr key={item.id} className="bg-slate-950/40 hover:bg-slate-900/50">
                    <td className="px-4 py-3">
                      {photo ? (
                        <img
                          src={photo}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-bold text-cyan-400">
                          {(item.name || "?").charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-100 font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{item.bio}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.role}</td>
                    <td className="px-4 py-3 text-slate-400">{item.experience || "—"}</td>
                    <td className="px-4 py-3"><StatusPill status={item.status} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">
                      {(item.skills || []).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(item)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ErrorBanner({ error }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400">
      <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-xs">{typeof error === "string" ? error : JSON.stringify(error)}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, label }) {
  return (
    <div className="w-full h-48 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center gap-2 text-slate-500">
      <Icon className="w-6 h-6" />
      <p className="text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const tone =
    status === "Active" || status === "Available"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : status === "Busy"
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
      : "bg-slate-800 text-slate-400 border-slate-700";
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs border ${tone}`}>
      {status || "—"}
    </span>
  );
}
