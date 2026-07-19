import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../services/authService';import { 
  FiGrid, FiBriefcase, FiUsers, FiCpu, FiLayers,
  FiInfo, FiMail, FiShield, FiSettings, FiLogOut 
} from 'react-icons/fi';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
  { name: 'Projects', path: '/admin/projects', icon: FiBriefcase },
  { name: 'Team', path: '/admin/developers', icon: FiUsers },
  { name: 'Services', path: '/admin/services', icon: FiCpu },
  { name: 'Gigs', path: '/admin/gigs', icon: FiLayers },
  { name: 'Company Info', path: '/admin/company-info', icon: FiInfo },
  { name: 'Messages', path: '/admin/messages', icon: FiMail },
  { name: 'Users', path: '/admin/users', icon: FiShield },
  { name: 'Settings', path: '/admin/settings', icon: FiSettings },
];

export default function Sidebar() {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    if (loading) return;

    setLoading(true);
    authService.logout();

    setTimeout(() => setLoading(false), 300);
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-400 flex flex-col h-screen fixed left-0 top-0 z-30">

      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-sm font-bold text-slate-100 uppercase">
          EVOTECH AI
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  isActive
                    ? 'bg-slate-900 text-indigo-400'
                    : 'hover:bg-slate-900/60'
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
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-500 hover:text-rose-400"
        >
          <FiLogOut />
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

    </aside>
  );
}