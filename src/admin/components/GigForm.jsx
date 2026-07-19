import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../services/apiClient";

const inputClass =
  "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50";

const resolveImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return "";
  const trimmed = imagePath.trim();
  if (/^(data:|blob:|https?:\/\/)/i.test(trimmed)) return trimmed;
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export default function GigForm({ mode = "create", initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    full_description: "",
    category: "",
    budget: "",
    duration: "",
    skills: "",
    status: "Open",
    featured: false,
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        short_description: initialData.short_description || "",
        full_description: initialData.full_description || "",
        category: initialData.category || "",
        budget: initialData.budget || "",
        duration: initialData.duration || "",
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(", ") : "",
        status: initialData.status || "Open",
        featured: !!initialData.featured,
      });
      setPreviewUrl(resolveImageUrl(initialData.image));
      setImage(null);
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (!image) return undefined;
    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const imageHint = useMemo(() => {
    if (image) return image.name;
    if (mode === "edit" && initialData?.image) return "Current image kept unless you choose a new file";
    return "Optional cover image for the public gig card";
  }, [image, mode, initialData]);

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
    payload.append("category", formData.category);
    payload.append("budget", formData.budget);
    payload.append("duration", formData.duration);
    payload.append("status", formData.status);
    payload.append("featured", formData.featured);
    formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((skill) => payload.append("skills", skill));
    if (image) payload.append("image", image);
    onSubmit(payload);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 max-w-3xl mx-auto">
      <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-1">
        {mode === "edit" ? "Edit Gig" : "Add Gig"}
      </h2>
      <p className="text-xs text-slate-500 mb-6">Gigs are open opportunities shown on the public site.</p>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Title *</label>
            <input name="title" required value={formData.title} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Category *</label>
            <input name="category" required value={formData.category} onChange={handleChange} className={inputClass} placeholder="AI, Robotics, Embedded..." />
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              {["Open", "In Progress", "Closed", "Featured"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Budget</label>
            <input name="budget" value={formData.budget} onChange={handleChange} className={inputClass} placeholder="$2,000 – $5,000" />
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Duration</label>
            <input name="duration" value={formData.duration} onChange={handleChange} className={inputClass} placeholder="2–4 weeks" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} id="gig-featured" />
          <label htmlFor="gig-featured" className="text-slate-300">Featured gig</label>
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
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Skills (comma separated)</label>
          <input name="skills" value={formData.skills} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Cover Image</label>
          <p className="text-[11px] text-slate-500 mb-2">{imageHint}</p>
          {previewUrl && (
            <div className="mb-3 w-full h-40 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img src={previewUrl} alt="Gig preview" className="w-full h-full object-cover" />
            </div>
          )}
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-slate-400" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-400">
            {mode === "edit" ? "Save Changes" : "Create Gig"}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
