import React, { useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import NewTranscription from './pages/NewTranscription';
import TranscriptResult from './pages/TranscriptResult';
import History from './pages/History';
import Settings from './pages/Settings';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedTranscriptId, setSelectedTranscriptId] = useState('tr-101');

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      {activePage === 'dashboard' && (
        <Dashboard
          setActivePage={setActivePage}
          setSelectedTranscriptId={setSelectedTranscriptId}
        />
      )}
      {activePage === 'new' && (
        <NewTranscription
          setActivePage={setActivePage}
          setSelectedTranscriptId={setSelectedTranscriptId}
        />
      )}
      {activePage === 'result' && (
        <TranscriptResult
          selectedTranscriptId={selectedTranscriptId}
          setActivePage={setActivePage}
        />
      )}
      {activePage === 'history' && (
        <History
          setActivePage={setActivePage}
          setSelectedTranscriptId={setSelectedTranscriptId}
        />
      )}
      {activePage === 'settings' && (
        <Settings />
      )}
    </DashboardLayout>
  );
}
