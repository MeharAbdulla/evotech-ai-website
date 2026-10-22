import React from "react";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import authService from "../services/authService";

export default function Navbar() {
  const payload = authService.decodeToken(authService.getToken()) || {};
  const username = payload.username || "Admin";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 flex items-center justify-between pl-14 pr-4 md:px-6 w-full">
      <div className="text-xs text-slate-500 truncate">
        Aeromek Admin · <span className="text-slate-300">{username}</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/admin/messages"
          className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 transition-all"
          title="Messages"
        >
          <FiBell className="w-4 h-4" />
        </Link>

        <div className="w-px h-5 bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-3 pl-1">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200 uppercase tracking-wider">
            {initials}
          </div>
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="text-xs font-medium text-slate-200">{username}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {payload.role || "admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
