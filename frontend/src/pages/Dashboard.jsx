import React from 'react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import {
  IconUpload,
  IconFileText,
  IconClock,
  IconCheck,
  IconFileAudio,
  IconFileVideo,
  IconChevronRight,
  IconSparkles,
  IconInfo,
} from '../components/Icons';
import { mockStats, mockRecentTranscriptions } from '../services/mockData';

export default function Dashboard({ setActivePage, setSelectedTranscriptId }) {
  return (
    <div className="space-y-8">
      {/* Welcome & Call-to-action Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0b1329] via-[#151c38] to-[#1e1b4b] rounded-2xl p-6 md:p-8 text-white shadow-md border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            <IconSparkles className="w-3.5 h-3.5" />
            <span>AI Speech-to-Text Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Convert Lectures, Meetings & Media into Accurate Text
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Upload your audio or video recordings to automatically generate timestamped transcripts,
            search spoken dialog, and export subtitles with Whisper AI.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('new')}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-700/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <IconUpload className="w-4 h-4" />
              <span>Start New Transcription</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-violet-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Files Processed"
          value={mockStats.totalFiles}
          subtitle="↑ 12% from last week"
          icon={IconFileText}
          accent="violet"
        />
        <MetricCard
          title="Hours Transcribed"
          value={`${mockStats.totalHours} hrs`}
          subtitle="Across audio & video"
          icon={IconClock}
          accent="indigo"
        />
        <MetricCard
          title="Completed Transcripts"
          value={mockStats.completedTranscripts}
          subtitle="Ready for download"
          icon={IconCheck}
          accent="emerald"
        />
        <MetricCard
          title="Word Accuracy Rate"
          value={`${mockStats.accuracyRate}%`}
          subtitle="Whisper model precision"
          icon={IconSparkles}
          accent="amber"
        />
      </div>

      {/* Day 1 Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-50/80 border border-violet-200/80 text-violet-900 text-sm">
        <IconInfo className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Day 1 Milestone: Frontend Foundation & Mock Mode.</span>{' '}
          All pages, navigation, and mock data workflows are active. Real Spring Boot backend processing,
          FFmpeg extraction, and Python Whisper AI inference will be connected in Day 2 & Day 3.
        </div>
      </div>

      {/* Recent Transcriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Transcriptions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Recently processed media files and sample results</p>
          </div>
          <button
            onClick={() => setActivePage('history')}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors"
          >
            <span>View All History</span>
            <IconChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Media File</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRecentTranscriptions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        {item.mediaType === 'video' ? (
                          <IconFileVideo className="w-4 h-4 text-violet-600" />
                        ) : (
                          <IconFileAudio className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-800 hover:text-violet-600 cursor-pointer text-sm">
                          {item.fileName}
                        </div>
                        <div className="text-xs text-slate-400">{item.fileSize}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium text-xs">{item.duration}</td>
                  <td className="py-4 px-4 text-slate-600 text-xs">{item.language}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => {
                        if (setSelectedTranscriptId) setSelectedTranscriptId(item.id);
                        setActivePage('result');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                    >
                      View Transcript
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
