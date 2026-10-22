import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiTrash2, FiUserPlus } from "react-icons/fi";
import userService from "../services/userService";
import authService from "../services/authService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const currentUser = authService.decodeToken(authService.getToken())?.username;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await userService.createUser({ username, password, role: "admin" });
      setUsername("");
      setPassword("");
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    setBusy(true);
    try {
      await userService.deleteUser(name);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">
          User Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Admin accounts that can access this panel.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-xs">
          <FiAlertCircle /> {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      <form
        onSubmit={create}
        className="grid sm:grid-cols-3 gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/40"
      >
        <input
          required
          minLength={3}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="New username"
          className="h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200"
        />
        <input
          required
          minLength={6}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white disabled:opacity-50"
        >
          <FiUserPlus /> Add Admin
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-4 py-3">Username</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-800/80">
                  <td className="px-4 py-3 text-slate-200">
                    {u.username}
                    {u.username === currentUser && (
                      <span className="ml-2 text-[10px] text-indigo-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.role}</td>
                  <td className="px-4 py-3 text-right">
                    {u.username !== currentUser && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => remove(u.username)}
                        className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    )}
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
