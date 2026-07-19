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

export default function DeveloperForm({ mode = "create", initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    skills: "",
    experience: "",
    github_url: "",
    linkedin_url: "",
    status: "Available",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        role: initialData.role || "",
        bio: initialData.bio || "",
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(", ") : "",
        experience: initialData.experience || "",
        github_url: initialData.github_url || "",
        linkedin_url: initialData.linkedin_url || "",
        status: initialData.status || "Available",
      });
      setPreviewUrl(resolveImageUrl(initialData.profile_image));
      setProfileImage(null);
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (!profileImage) return undefined;
    const objectUrl = URL.createObjectURL(profileImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

  const imageHint = useMemo(() => {
    if (profileImage) return profileImage.name;
    if (mode === "edit" && initialData?.profile_image) {
      return "Current photo kept unless you choose a new file";
    }
    return "Upload a square photo for the public Team page";
  }, [profileImage, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("role", formData.role);
    payload.append("bio", formData.bio);
    payload.append("experience", formData.experience);
    payload.append("github_url", formData.github_url);
    payload.append("linkedin_url", formData.linkedin_url);
    payload.append("status", formData.status);
    formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((skill) => payload.append("skills", skill));
    if (profileImage) payload.append("profile_image", profileImage);
    onSubmit(payload);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 max-w-3xl mx-auto">
      <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-1">
        {mode === "edit" ? "Edit Team Member" : "Add Team Member"}
      </h2>
      <p className="text-xs text-slate-500 mb-6">
        Name, role, photo, bio, skills, and status appear on the public Team page.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Name *</label>
            <input name="name" required value={formData.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Role *</label>
            <input name="role" required value={formData.role} onChange={handleChange} className={inputClass} placeholder="AI Engineer" />
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              {["Available", "Active", "Busy", "Inactive"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">Experience</label>
            <input name="experience" value={formData.experience} onChange={handleChange} className={inputClass} placeholder="e.g. 5+ years" />
          </div>
        </div>
        <div>
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Bio *</label>
          <textarea name="bio" required rows={3} value={formData.bio} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Skills * (comma separated)</label>
          <input name="skills" required value={formData.skills} onChange={handleChange} className={inputClass} placeholder="Python, React, ROS2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">GitHub URL</label>
            <input name="github_url" value={formData.github_url} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="text-[11px] uppercase text-slate-500 block mb-1">LinkedIn URL</label>
            <input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-[11px] uppercase text-slate-500 block mb-1">Profile Photo</label>
          <p className="text-[11px] text-slate-500 mb-2">{imageHint}</p>
          {previewUrl && (
            <div className="mb-3 w-28 h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img src={previewUrl} alt="Team member preview" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="text-slate-400"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-400">
            {mode === "edit" ? "Save Changes" : "Add Team Member"}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
