import React, { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import {
  IconSearch,
  IconCopy,
  IconDownload,
  IconEdit,
  IconCheck,
  IconFileVideo,
  IconSparkles,
  IconInfo,
} from '../components/Icons';

export default function TranscriptResult({ setActivePage }) {
  const [transcriptData, setTranscriptData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load the real transcription returned by the backend
  useEffect(() => {
    const savedResult = localStorage.getItem('transcriptionResult');

    if (savedResult) {
      try {
        const result = JSON.parse(savedResult);

        setTranscriptData(result);
        setEditableText(result.transcriptText || '');
      } catch (error) {
        console.error(
          'Failed to load transcription result:',
          error
        );
      }
    }
  }, []);

  // Show loading / no-result state
  if (!transcriptData) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm text-center">

          <IconInfo className="w-8 h-8 text-violet-500 mx-auto mb-3" />

          <h2 className="text-lg font-bold text-slate-900">
            No transcription found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Please upload an audio or video file first.
          </p>

          <button
            onClick={() => setActivePage('new')}
            className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition"
          >
            Create New Transcription
          </button>

        </div>
      </div>
    );
  }

  // Complete transcript returned by Whisper
  const transcriptText =
    transcriptData.transcriptText || '';

  // Check whether the search text exists
  const hasSearchMatch =
    !searchQuery.trim() ||
    transcriptText
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

  // Highlight searched words while keeping the transcript
  // as one continuous passage
  const renderHighlightedTranscript = () => {
    if (!searchQuery.trim()) {
      return transcriptText;
    }

    if (!hasSearchMatch) {
      return null;
    }

    const escapedQuery = searchQuery.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const parts = transcriptText.split(
      new RegExp(`(${escapedQuery})`, 'gi')
    );

    return parts.map((part, index) =>
      part.toLowerCase() ===
      searchQuery.toLowerCase() ? (
        <mark
          key={index}
          className="bg-amber-200 text-amber-900 rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Copy complete transcript
  const handleCopy = async () => {
    const textToCopy = isEditing
      ? editableText
      : transcriptText;

    try {
      await navigator.clipboard.writeText(textToCopy);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Download complete transcript as TXT
  const handleDownloadTxt = () => {
    const textContent = `AI Media Transcriber - Transcript Export

File: ${transcriptData.fileName || 'Unknown'}
Media Type: ${transcriptData.mediaType || 'Unknown'}
Language: ${transcriptData.language || 'Unknown'}
Status: ${transcriptData.status || 'Unknown'}
Model: Whisper

----------------------------------------
TRANSCRIPT
----------------------------------------

${isEditing ? editableText : transcriptText}
`;

    const blob = new Blob(
      [textContent],
      {
        type: 'text/plain;charset=utf-8',
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    const fileName =
      transcriptData.fileName || 'transcription';

    link.download =
      `${fileName.replace(/\.[^/.]+$/, '')}_transcript.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Save edited transcript
  const handleSaveEdits = () => {
    const updatedResult = {
      ...transcriptData,
      transcriptText: editableText,
    };

    setTranscriptData(updatedResult);

    localStorage.setItem(
      'transcriptionResult',
      JSON.stringify(updatedResult)
    );

    setIsEditing(false);

    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* =========================================
          TOP INFORMATION / ACTION BAR
      ========================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="space-y-1">

          {/* Status */}
          <div className="flex items-center gap-2 flex-wrap">

            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Real Whisper Result
            </span>

            <StatusBadge
              status={
                transcriptData.status ||
                'COMPLETED'
              }
            />

          </div>

          {/* File name */}
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">

            <IconFileVideo className="w-5 h-5 text-violet-600 shrink-0" />

            <span>
              {transcriptData.fileName ||
                'Transcription'}
            </span>

          </h2>

          {/* File information */}
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">

            <span>
              Media Type:{' '}
              <strong className="text-slate-700">
                {transcriptData.mediaType ||
                  'Unknown'}
              </strong>
            </span>

            <span>&bull;</span>

            <span>
              Language:{' '}
              <strong className="text-slate-700">
                {transcriptData.language ||
                  'Unknown'}
              </strong>
            </span>

            <span>&bull;</span>

            <span>
              Model:{' '}
              <strong className="text-slate-700">
                Whisper
              </strong>
            </span>

          </div>

        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">

          {/* Edit */}
          <button
            onClick={() =>
              setIsEditing(!isEditing)
            }
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isEditing
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >

            <IconEdit className="w-3.5 h-3.5" />

            <span>
              {isEditing
                ? 'Editing Mode'
                : 'Edit Text'}
            </span>

          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all"
          >

            {copied ? (
              <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <IconCopy className="w-3.5 h-3.5" />
            )}

            <span>
              {copied
                ? 'Copied!'
                : 'Copy Transcript'}
            </span>

          </button>

          {/* Download */}
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-700/30 transition-all"
          >

            <IconDownload className="w-3.5 h-3.5" />

            <span>
              Download TXT
            </span>

          </button>

        </div>

      </div>


      {/* =========================================
          SAVE SUCCESS MESSAGE
      ========================================== */}
      {savedSuccess && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">

          <IconCheck className="w-4 h-4 text-emerald-600" />

          <span>
            Edits saved successfully!
          </span>

        </div>
      )}


      {/* =========================================
          AI INFORMATION
      ========================================== */}
      <div className="bg-gradient-to-r from-violet-50/70 via-indigo-50/50 to-slate-50 border border-violet-100 rounded-2xl p-5 shadow-xs">

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-800 mb-1.5">

          <IconSparkles className="w-4 h-4 text-violet-600" />

          <span>
            AI Transcription
          </span>

        </div>

        <p className="text-xs text-slate-700 leading-relaxed">

          This transcript was generated using the
          Whisper AI speech recognition model.
          The detected language is{' '}

          <strong>
            {transcriptData.language ||
              'unknown'}
          </strong>.

        </p>

      </div>


      {/* =========================================
          COMPLETE TRANSCRIPT
      ========================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">

          <div className="relative flex-1 max-w-md">

            <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search words in transcript..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />

          </div>

          {/* Search status */}
          <div className="text-xs text-slate-400 whitespace-nowrap">

            {searchQuery.trim()
              ? hasSearchMatch
                ? 'Match found'
                : 'No match found'
              : 'Full transcript'}

          </div>

        </div>


        {/* =========================================
            TRANSCRIPT CONTENT
        ========================================== */}
        <div className="p-6">

          {isEditing ? (

            /* =====================================
               EDIT MODE
            ====================================== */
            <div className="space-y-4">

              <div className="flex items-center justify-between text-xs text-slate-500">

                <span>
                  Edit the complete transcript below:
                </span>

                <span className="text-violet-600 font-medium">
                  Editing Active
                </span>

              </div>

              <textarea
                rows={18}
                value={editableText}
                onChange={(e) =>
                  setEditableText(e.target.value)
                }
                className="w-full p-4 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 leading-relaxed text-slate-800"
              />

              <div className="flex items-center justify-end gap-2.5">

                {/* Cancel */}
                <button
                  onClick={() => {

                    setEditableText(
                      transcriptData.transcriptText ||
                      ''
                    );

                    setIsEditing(false);

                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                >
                  Cancel
                </button>

                {/* Save */}
                <button
                  onClick={handleSaveEdits}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition"
                >
                  Save Edits
                </button>

              </div>

            </div>

          ) : (

            /* =====================================
               NORMAL VIEW
            ====================================== */
            <div>

              {!hasSearchMatch ? (

                <div className="text-center py-12 text-slate-400 text-xs">

                  No matching transcript text found
                  for "{searchQuery}".

                </div>

              ) : (

                <div className="p-6 rounded-xl border border-slate-100 bg-white">

                  {/* Transcript heading */}
                  <div className="flex items-center gap-2 mb-4">

                    <span className="font-bold text-violet-700 text-xs">
                      Whisper Transcript
                    </span>

                  </div>

                  {/* Complete passage */}
                  <p className="text-sm text-slate-700 leading-7 whitespace-pre-wrap font-sans">

                    {renderHighlightedTranscript()}

                  </p>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}