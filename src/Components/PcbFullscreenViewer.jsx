import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiMaximize2 } from "react-icons/fi";
import PcbModelViewer from "./PcbModelViewer";

/**
 * Full-viewport open 3D PCB viewer — click to explore.
 */
const PcbFullscreenViewer = ({ open, onClose, modelUrl, mtlUrl, title = "PCB 3D View" }) => {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !modelUrl) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0e0c0a]/96 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-sky-500/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <FiMaximize2 className="w-4 h-4 text-sky-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate">{title}</h2>
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider text-sky-300/90 border border-sky-500/30 bg-sky-500/10 px-2 py-1 rounded-md">
            Open 3D · drag · zoom
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-400/40 px-3 py-2 rounded-xl transition-colors"
        >
          <FiX className="w-4 h-4" /> Close
        </button>
      </div>
      <div className="flex-1 min-h-0 p-3 sm:p-5">
        <div className="h-full min-h-[70vh] rounded-2xl overflow-hidden border border-sky-500/25 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <PcbModelViewer modelUrl={modelUrl} mtlUrl={mtlUrl} title={title} fill />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PcbFullscreenViewer;
