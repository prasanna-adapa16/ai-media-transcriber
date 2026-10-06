import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ activePage, setActivePage, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Deep navy sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main content column with light background */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          setIsMobileOpen={setIsMobileOpen}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <footer className="py-4 px-8 border-t border-slate-200/80 text-center text-xs text-slate-500 bg-white">
          AI Media Transcriber &bull; Day 1 Frontend Milestone &bull; React + Vite + Tailwind CSS
        </footer>
      </div>
    </div>
  );
}
