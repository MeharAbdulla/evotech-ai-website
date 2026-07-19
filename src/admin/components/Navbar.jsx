import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

export default function Navbar() {
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 flex items-center justify-between px-6 w-full">
      {/* Search Input Container */}
      <div className="relative w-64 md:w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="w-4 h-4 text-slate-500" />
        </span>
        <input
          type="text"
         placeholder="Search Projects, Developers..."
          className="w-full h-9 pl-9 pr-4 bg-slate-900/50 text-slate-200 text-xs rounded-lg border border-slate-800 placeholder-slate-500 focus:outline-none focus:border-slate-700 focus:bg-slate-900 transition-all duration-200"
        />
      </div>

      {/* Quick Status Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Indicator */}
        <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg border border-transparent hover:bg-slate-900 transition-all duration-200">
          <FiBell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full ring-2 ring-slate-950"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-800"></div>

        {/* Profile / Admin Settings Identity */}
        <div className="flex items-center gap-3 pl-1">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-semibold text-slate-200 uppercase tracking-wider">
            EA
          </div>
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="text-xs font-medium text-slate-200">Administrator</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}