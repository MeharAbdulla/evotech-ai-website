import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiMail, FiTrash2, FiRefreshCw } from "react-icons/fi";
import consultationService from "../services/consultationService";

const STATUSES = ["New", "Read", "Replied", "Closed"];

export default function Messages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = filter === "All" ? {} : { status: filter };
      const data = await consultationService.getConsultations(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const updateStatus = async (id, status) => {
    setBusy(true);
    try {
      const updated = await consultationService.updateStatus(id, status);
      setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
      if (selected?.id === id) setSelected(updated);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    setBusy(true);
    try {
      await consultationService.deleteConsultation(id);
      setItems((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">
            Client Messages
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consultation leads from the website contact form.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
        >
          <FiRefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border ${
              filter === s
                ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                : "border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-xs">
          <FiAlertCircle /> {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 space-y-2 max-h-[70vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center text-xs text-slate-500">
                No messages found.
              </div>
            ) : (
              items.map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => setSelected(msg)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selected?.id === msg.id
                      ? "border-indigo-500/40 bg-indigo-500/5"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {msg.full_name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {msg.service}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] px-2 py-0.5 rounded-md border ${
                        msg.status === "New"
                          ? "border-rose-500/30 text-rose-300 bg-rose-500/10"
                          : "border-slate-700 text-slate-400"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/40 p-5 min-h-[320px]">
            {!selected ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2 py-16">
                <FiMail className="w-6 h-6 opacity-40" />
                Select a message to view details
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selected.full_name}</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {selected.company_name} · {selected.country}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => remove(selected.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Email</span>
                    <a href={`mailto:${selected.email}`} className="text-indigo-300">
                      {selected.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Phone</span>
                    <a href={`tel:${selected.phone_number}`} className="text-slate-200">
                      {selected.phone_number}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Service</span>
                    <span className="text-slate-200">{selected.service}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Budget</span>
                    <span className="text-slate-200">{selected.budget || "—"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                    Description
                  </span>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selected.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={busy || selected.status === s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] border ${
                        selected.status === s
                          ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                          : "border-slate-700 text-slate-400 hover:text-white disabled:opacity-50"
                      }`}
                    >
                      Mark {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
