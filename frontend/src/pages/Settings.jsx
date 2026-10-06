import React, { useState } from 'react';
import {
  IconSettings,
  IconCheck,
  IconAlertCircle,
  IconInfo,
  IconSparkles,
} from '../components/Icons';

export default function Settings() {
  const [backendUrl, setBackendUrl] = useState('http://localhost:8080/api');
  const [whisperUrl, setWhisperUrl] = useState('http://localhost:8000/transcribe');
  const [defaultLanguage, setDefaultLanguage] = useState('auto');
  const [modelPreset, setModelPreset] = useState('base');
  const [autoDownloadTxt, setAutoDownloadTxt] = useState(false);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Application Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure microservice endpoints, model defaults, and transcription behavior.
        </p>
      </div>

      {isSaved && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
          <IconCheck className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully in browser memory!</span>
        </div>
      )}

      {/* Backend & Whisper Connection Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <IconSparkles className="w-4 h-4 text-violet-600" />
          <span>Service Connection Status (Day 1 Roadmap)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Spring Boot Backend</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Postponed to Day 2
              </span>
            </div>
            <p className="text-slate-500">
              Handles multi-part file streaming, FFmpeg audio extraction, and MySQL transcript persistence.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">OpenAI Whisper Engine</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Postponed to Day 3
              </span>
            </div>
            <p className="text-slate-500">
              Python FastAPI microservice executing local speech-to-text inference with timestamps.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Service Endpoints
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Spring Boot REST API Base URL
            </label>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Target port for the Java backend service when launched on Day 2.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Whisper Service Direct URL (Optional)
            </label>
            <input
              type="text"
              value={whisperUrl}
              onChange={(e) => setWhisperUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Target for direct speech-to-text inference microservice.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Transcription Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Default Source Language
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              >
                <option value="auto">Auto-Detect</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Default Whisper Model
              </label>
              <select
                value={modelPreset}
                onChange={(e) => setModelPreset(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              >
                <option value="tiny">Tiny (Quick notes)</option>
                <option value="base">Base (Recommended)</option>
                <option value="small">Small (High precision)</option>
                <option value="medium">Medium (Professional audio)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTimestamps}
                onChange={(e) => setIncludeTimestamps(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
              />
              <span className="text-xs text-slate-700 font-medium">
                Include timestamps with segment exports by default ([MM:SS - MM:SS])
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDownloadTxt}
                onChange={(e) => setAutoDownloadTxt(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
              />
              <span className="text-xs text-slate-700 font-medium">
                Automatically prompt for .txt download upon transcription completion
              </span>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
