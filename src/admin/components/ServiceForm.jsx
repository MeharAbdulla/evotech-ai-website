import React, { useEffect, useState } from "react";

const inputClass =
  "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50";

const ICON_OPTIONS = ["FiCode", "FiCpu", "FiCloud", "FiGlobe", "FiSmartphone", "FiLayers", "FiZap", "FiBox"];

export default function ServiceForm({ mode = "create", initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    full_description: "",
    icon: "FiLayers",
    features: "",
    status: "Active",
    featured: false,
    sort_order: 0,
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        short_description: initialData.short_description || "",
        full_description: initialData.full_description || "",
        icon: initialData.icon || "FiLayers",
        features: Array.isArray(initialData.features) ? initialData.features.join(", ") : "",
        status: initialData.status || "Active",
        featured: !!initialData.featured,
        sort_order: initialData.sort_order ?? 0,
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("short_description", formData.short_description);
    payload.append("full_description", formData.full_description);
    payload.append("icon", formData.icon);
    payload.append("status", formData.status);
    payload.append("featured", formData.featured);
    payload.append("sort_order", String(formData.sort_order || 0));
    formData.features
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((f) => payload.append("features", f));
    if (image) payload.append("image", image);
    onSubmit(payload);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 max-w-3xl mx-auto">
      <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-1">
        {mode === "edit" ? "Edit Service" : "Add Service"}
      </h2>
      <p className="text-xs text-slate-500 mb-6">Services appear in the public offerings section.</p>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Title *</label>
            <input name="title" required value={formData.title} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Icon</label>
            <select name="icon" value={formData.icon} onChange={handleChange} className={inputClass}>
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Sort Order</label>
            <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} id="svc-featured" />
            <label htmlFor="svc-featured" className="text-slate-300">Featured on homepage</label>
          </div>
        </div>
        <div>
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Short Description *</label>
          <textarea name="short_description" required rows={2} value={formData.short_description} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Full Description</label>
          <textarea name="full_description" rows={3} value={formData.full_description} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Features (comma separated)</label>
          <input name="features" value={formData.features} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-slate-400" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-400">
            {mode === "edit" ? "Save Changes" : "Create Service"}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
