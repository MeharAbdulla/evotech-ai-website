import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiSave } from "react-icons/fi";
import siteService from "../services/siteService";

const empty = {
  company_name: "",
  tagline: "",
  email: "",
  phone: "",
  address: "",
  about: "",
  website: "",
};

export default function CompanyInfo() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteService
      .getCompany()
      .then((data) => setForm({ ...empty, ...data }))
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = await siteService.updateCompany(form);
      setForm({ ...empty, ...data });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
      </div>
    );
  }

  const fields = [
    ["company_name", "Company name"],
    ["tagline", "Tagline"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["website", "Website"],
    ["address", "Address"],
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">
          Company Information
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Firm contact details and branding copy used across the platform.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-xs">
          <FiAlertCircle /> {String(error)}
        </div>
      )}
      {saved && <p className="text-xs text-emerald-400">Saved successfully.</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map(([name, label]) => (
          <div key={name} className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-500">
              {label}
            </label>
            <input
              name={name}
              value={form[name] || ""}
              onChange={onChange}
              className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200"
            />
          </div>
        ))}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-slate-500">
            About
          </label>
          <textarea
            name="about"
            rows={4}
            value={form.about || ""}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white disabled:opacity-50"
        >
          <FiSave /> {saving ? "Saving..." : "Save company info"}
        </button>
      </form>
    </div>
  );
}
