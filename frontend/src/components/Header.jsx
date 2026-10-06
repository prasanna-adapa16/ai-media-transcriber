import React from 'react';
import { IconUpload, IconSparkles } from './Icons';

export default function Header({ activePage, setActivePage, setIsMobileOpen }) {
  const pageTitles = {
    dashboard: { title: 'Dashboard', desc: 'Overview of transcription usage, recent files, and performance' },
    new: { title: 'New Transcription', desc: 'Upload audio or video media to transcribe with Whisper AI' },
    result: { title: 'Transcript Result', desc: 'Inspect, search, edit, and export your generated transcripts' },
    history: { title: 'Transcription History', desc: 'Archive of past transcripts with search and status filters' },
    settings: { title: 'Settings', desc: 'Configure Whisper engine, backend URLs, and transcription defaults' },
  };

  const current = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {current.title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {current.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Demo Mode Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
          <IconSparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>Day 1 UI Preview (Mock Data)</span>
        </div>

        {/* Quick action button */}
        {activePage !== 'new' && (
          <button
            onClick={() => setActivePage('new')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <IconUpload className="w-4 h-4" />
            <span className="hidden sm:inline">New Upload</span>
          </button>
        )}

        {/* Workspace avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-violet-500/20">
          AM
        </div>
      </div>
    </header>
  );
}
