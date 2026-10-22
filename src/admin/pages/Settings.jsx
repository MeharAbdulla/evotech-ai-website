import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiSave } from "react-icons/fi";
import siteService from "../services/siteService";

const empty = {
  whatsapp_number: "",
  support_email: "",
  maintenance_mode: false,
  notify_new_leads: true,
  default_timezone: "Asia/Karachi",
};

export default function Settings() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    siteService
      .getSettings()
      .then((data) => setForm({ ...empty, ...data }))
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = await siteService.updateSettings(form);
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

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">
          System Configurations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Workspace contact channels and operational toggles.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-xs">
          <FiAlertCircle /> {String(error)}
        </div>
      )}
      {saved && <p className="text-xs text-emerald-400">Settings saved.</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-slate-500">
            WhatsApp number
          </label>
          <input
            name="whatsapp_number"
            value={form.whatsapp_number || ""}
            onChange={onChange}
            className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-slate-500">
            Support email
          </label>
          <input
            name="support_email"
            type="email"
            value={form.support_email || ""}
            onChange={onChange}
            className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-slate-500">
            Default timezone
          </label>
          <input
            name="default_timezone"
            value={form.default_timezone || ""}
            onChange={onChange}
            className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200"
          />
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            name="notify_new_leads"
            checked={Boolean(form.notify_new_leads)}
            onChange={onChange}
            className="rounded border-slate-700"
          />
          Notify on new consultation leads
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            name="maintenance_mode"
            checked={Boolean(form.maintenance_mode)}
            onChange={onChange}
            className="rounded border-slate-700"
          />
          Maintenance mode flag
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white disabled:opacity-50"
        >
          <FiSave /> {saving ? "Saving..." : "Save settings"}
        </button>
      </form>
    </div>
  );
}
