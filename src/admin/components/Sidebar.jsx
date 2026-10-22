import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiCpu,
  FiLayers,
  FiBookOpen,
  FiInfo,
  FiMail,
  FiShield,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: FiGrid },
  { name: "Projects", path: "/admin/projects", icon: FiBriefcase },
  { name: "Team", path: "/admin/developers", icon: FiUsers },
  { name: "Services", path: "/admin/services", icon: FiCpu },
  { name: "Gigs", path: "/admin/gigs", icon: FiLayers },
  { name: "Blog", path: "/admin/blog", icon: FiBookOpen },
  { name: "Company Info", path: "/admin/company-info", icon: FiInfo },
  { name: "Messages", path: "/admin/messages", icon: FiMail },
  { name: "Users", path: "/admin/users", icon: FiShield },
  { name: "Settings", path: "/admin/settings", icon: FiSettings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (loading) return;
    setLoading(true);
    authService.logout();
    navigate("/admin/login", { replace: true });
    setLoading(false);
  };

  const nav = (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <span className="text-sm font-bold text-slate-100 uppercase">AEROMEK</span>
        <button
          type="button"
          className="md:hidden p-1 text-slate-400 hover:text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  isActive
                    ? "bg-slate-900 text-indigo-400"
                    : "hover:bg-slate-900/60"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-500 hover:text-rose-400"
        >
          <FiLogOut />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="md:hidden fixed top-3 left-3 z-40 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-slate-950 border-r border-slate-800 text-slate-400 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:z-30`}
      >
        {nav}
      </aside>
    </>
  );
}
