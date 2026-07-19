import React from 'react';
import * as Icons from 'react-icons/fi';

export default function DashboardCard({ title, value, icon, color = 'indigo' }) {
  // Dynamically resolve icon string to standard feather instance
  const IconComponent = Icons[icon] || Icons.FiTrendingUp;

  // Configuration mapping to maintain consistent modern badge themes
  const colorMap = {
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'hover:border-indigo-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'hover:border-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'hover:border-amber-500/20' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'hover:border-rose-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'hover:border-blue-500/20' },
  };

  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-6 bg-slate-900 border border-slate-800/80 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-slate-950/50 ${theme.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${theme.bg} ${theme.text}`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-slate-100">
          {value}
        </span>
      </div>
    </div>
  );
}