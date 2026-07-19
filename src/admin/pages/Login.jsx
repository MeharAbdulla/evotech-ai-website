import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  
  // Controlled form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // UI Status Management States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form submission runtime orchestrator
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      if (response && response.success) {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 antialiased selection:bg-indigo-500/30">
      {/* Centered Minimal Authentication Blueprint */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-slate-950/50">
        
        {/* Core Header Identity */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase block mb-1">
            Secure Terminal
          </span>
          <h1 className="text-lg font-bold tracking-wider text-slate-100 uppercase">
            EVOTECH AI
          </h1>
        </div>

        {/* Static Controlled Form Structural Layout */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Identity String Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">
              Username
            </label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value.trimStart())}
              disabled={loading}
              required
              autoComplete="username"
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-600 focus:outline-none focus:border-slate-700 focus:bg-slate-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Secure Sequence Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-600 focus:outline-none focus:border-slate-700 focus:bg-slate-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Contextual Failure Alert Response Display */}
          {error && (
            <div className="text-xs text-rose-500 font-medium leading-normal">
              {error}
            </div>
          )}

          {/* Activation Control Interface */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-indigo-600/10 transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}