import React from 'react';

export default function Messages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">Client Messages</h1>
        <p className="text-xs text-slate-500 mt-1">Review inbound client messages and global enterprise inquiries.</p>
      </div>
      <div className="w-full h-64 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 flex items-center justify-center p-6 text-center">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          This module will be implemented in the next phase.
        </p>
      </div>
    </div>
  );
}