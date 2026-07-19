import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { 
  FiPlus, 
  FiCheckCircle, 
  FiUserPlus, 
  FiRefreshCw, 
  FiBriefcase, 
  FiUsers, 
  FiCpu, 
  FiLayers, 
  FiMail 
} from 'react-icons/fi';

export default function Dashboard() {
  const stats = [
    { title: 'Total Projects', value: '25', icon: 'FiBriefcase', color: 'indigo' },
    { title: 'Developers', value: '8', icon: 'FiUsers', color: 'blue' },
    { title: 'Services', value: '12', icon: 'FiCpu', color: 'emerald' },
    { title: 'Gigs', value: '20', icon: 'FiLayers', color: 'amber' },
    { title: 'Pending Messages', value: '7', icon: 'FiMail', color: 'rose' },
  ];

  const activities = [
    { text: 'New project "Autonomous UAV Firmware" added', time: '2 hrs ago', icon: FiCheckCircle, color: 'text-emerald-400' },
    { text: 'New developer joined the Embedded Systems team', time: '5 hrs ago', icon: FiUserPlus, color: 'text-blue-400' },
    { text: 'Service configuration "Computer Vision API" updated', time: '1 day ago', icon: FiRefreshCw, color: 'text-indigo-400' },
  ];

  const quickActions = [
    { label: 'Add Project', icon: FiPlus },
    { label: 'Add Developer', icon: FiPlus },
    { label: 'Add Service', icon: FiPlus },
    { label: 'Add Gig', icon: FiPlus },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">Welcome to EVOTECH AI Admin Panel</h1>
        <p className="text-xs text-slate-500 mt-1">Monitor projects, developers, services, gigs, and client activity.</p>
      </div>

      {/* Reusable Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <DashboardCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Split Interactive Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Recent Activity Logs */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800/80 rounded-xl p-6">
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((act, idx) => {
              const LogIcon = act.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/40 border border-slate-800/40 text-xs">
                  <LogIcon className={`w-4 h-4 mt-0.5 ${act.color}`} />
                  <div className="flex-1">
                    <p className="text-slate-300 font-medium leading-relaxed">{act.text}</p>
                    <span className="text-[10px] text-slate-500 block mt-1">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Quick System Actions */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800/80 rounded-xl p-6">
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-xs font-medium text-slate-300 transition-all duration-200 group"
                >
                  <span>{action.label}</span>
                  <ActionIcon className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}