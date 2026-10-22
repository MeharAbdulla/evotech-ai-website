import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiBookOpen,
  FiExternalLink,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import blogService from "../services/blogService";

function formatError(err) {
  const detail = err.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(", ");
  return detail || err.message || "Request failed";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

export default function Blog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await blogService.getAll();
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

  const handleGenerate = async (single = true) => {
    setGenerating(true);
    setError("");
    setMessage("");
    try {
      const result = await blogService.generate(true, !single);
      if (result.skipped) {
        setMessage(result.reason || "Generation skipped.");
      } else if (result.created) {
        const n = result.created_count || 1;
        setMessage(
          result.reason ||
            `Published ${n} post(s): ${result.post?.title || "new post"}`
        );
      }
      await fetchItems();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setGenerating(false);
    }
  };

  const toggleStatus = async (item) => {
    const next = item.status === "Published" ? "Draft" : "Published";
    setBusyId(item.id);
    setError("");
    try {
      const updated = await blogService.update(item.id, { status: next });
      setItems((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
    } catch (err) {
      setError(formatError(err));
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog post permanently?")) return;
    setBusyId(id);
    setError("");
    try {
      await blogService.remove(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(formatError(err));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Blog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Auto-publishes up to 3 SEO posts per day (06:00 / 14:00 / 22:00 UTC) on workplace vision topics.
            Auto: 1 post every 2 hours (up to 12/day UTC). Use Generate now for one post, or Fill today for the full daily batch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchItems}
            disabled={loading || generating}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-900 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => handleGenerate(false)}
            disabled={generating}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-indigo-500/40 text-indigo-200 text-sm hover:bg-slate-900 disabled:opacity-50"
          >
            Fill today (3)
          </button>
          <button
            type="button"
            onClick={() => handleGenerate(true)}
            disabled={generating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-400 disabled:opacity-50"
          >
            <FiBookOpen className="w-4 h-4" />
            {generating ? "Generating…" : "Generate now"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      {message && (
        <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-emerald-300 text-xs">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading posts…</p>
      ) : items.length === 0 ? (
        <div className="w-full h-48 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center gap-2 text-slate-500">
          <FiBookOpen className="w-6 h-6" />
          <p className="text-xs uppercase tracking-wider">No blog posts yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="bg-slate-950/40 hover:bg-slate-900/50">
                  <td className="px-4 py-3">
                    <div className="text-slate-100 font-medium max-w-xs truncate">{item.title}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">/{item.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{item.category || "—"}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs uppercase">{item.provider || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs border ${
                        item.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {item.status === "Published" && (
                        <Link
                          to={`/blog/${item.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-900"
                          title="View public post"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => toggleStatus(item)}
                        className="px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-300 hover:bg-slate-900 disabled:opacity-50"
                      >
                        {item.status === "Published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 disabled:opacity-50"
                        title="Delete"
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
      )}
    </div>
  );
}
