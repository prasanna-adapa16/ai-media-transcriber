import React from 'react';
import {
  IconDashboard,
  IconUpload,
  IconFileText,
  IconHistory,
  IconSettings,
  IconSparkles,
} from './Icons';

export default function Sidebar({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard, desc: 'Overview & metrics' },
    { id: 'new', label: 'New Transcription', icon: IconUpload, desc: 'Upload audio & video' },
    { id: 'result', label: 'Transcript Result', icon: IconFileText, desc: 'Interactive viewer' },
    { id: 'history', label: 'History', icon: IconHistory, desc: 'All recordings' },
    { id: 'settings', label: 'Settings', icon: IconSettings, desc: 'Config & preferences' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0b1329] border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-violet-500 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
            <IconSparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              AI Transcriber
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-violet-400">
              SaaS Edition
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group text-left ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Day 1 Milestone Card */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span>Day 1 Milestone</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800">
                UI Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Frontend layout & mock data loaded. Spring Boot & Whisper arrive in Day 2 & 3.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
