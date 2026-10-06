import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, accent = 'violet' }) {
  const accentStyles = {
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  const style = accentStyles[accent] || accentStyles.violet;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${style}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
