import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiCpu } from "react-icons/fi";
import serviceService from "../services/serviceService";
import ServiceForm from "../components/ServiceForm";

function formatError(err) {
  const detail = err.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return detail || err.message || "Request failed";
}

export default function Services() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await serviceService.getServices();
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
      await serviceService.createService(formData);
      setShowCreate(false);
      await fetchItems();
    } catch (err) {
      setError(formatError(err));
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await serviceService.updateService(editing.id, formData);
      setEditing(null);
      await fetchItems();
    } catch (err) {
      setError(formatError(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await serviceService.deleteService(id);
      await fetchItems();
    } catch (err) {
      setError(formatError(err));
    }
  };

  if (showCreate) {
    return (
      <div className="space-y-4">
        {error && <ErrorBanner error={error} />}
        <ServiceForm mode="create" onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-4">
        {error && <ErrorBanner error={error} />}
        <ServiceForm mode="edit" initialData={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Services</h1>
          <p className="text-xs text-slate-500 mt-1">Offerings shown in the public services section.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-400"
        >
          <FiPlus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {error && <ErrorBanner error={error} />}

      {loading ? (
        <p className="text-sm text-slate-500">Loading services...</p>
      ) : items.length === 0 ? (
        <EmptyState icon={FiCpu} label="No services yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Icon</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="bg-slate-950/40 hover:bg-slate-900/50">
                  <td className="px-4 py-3">
                    <div className="text-slate-100 font-medium">{item.title}</div>
                    <div className="text-xs text-slate-500 truncate max-w-md">{item.short_description}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">{item.icon}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs border ${
                      item.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{item.featured ? "Yes" : "No"}</td>
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
              ))}
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
