import React, { useState, useEffect } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';

/**
 * Modern Premium Minimalist Toast System Notification Provider.
 * Custom built specifically to align with Stripe, Vercel, and Linear UI design languages.
 */
export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleLogoutToast = () => {
        console.log("Toast event received");
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: 'You have been logged out' }]);
      
      // Enforce auto-clearing parameters for the specific instance log
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    };

    window.addEventListener('evotech_auth_logout', handleLogoutToast);
    return () => window.removeEventListener('evotech_auth_logout', handleLogoutToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-slate-900 border border-slate-800 shadow-xl shadow-slate-950/80 rounded-xl transition-all duration-300 ease-out transform translate-y-0 opacity-100"
        >
          <div className="flex items-center gap-2.5">
            <FiInfo className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-200 tracking-wide">
              {toast.message}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}