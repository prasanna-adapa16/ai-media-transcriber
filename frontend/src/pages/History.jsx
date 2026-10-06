import React, { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import {
  IconSearch,
  IconFileAudio,
  IconFileVideo,
  IconChevronRight,
} from '../components/Icons';

const API_BASE_URL = 'http://localhost:8080/api';

export default function History({
  setActivePage,
  setSelectedTranscriptId,
}) {
  const [transcriptions, setTranscriptions] = useState([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openingId, setOpeningId] = useState(null);

  // =========================================================
  // LOAD HISTORY
  // =========================================================

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API_BASE_URL}/media`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch history (${response.status})`
        );
      }

      const data = await response.json();

      console.log('History API response:', data);

      const formattedData = data.map((item) => {

        const preview =
          item.transcriptPreview || '';

        return {
          id: item.id,

          fileName:
            item.fileName || 'Unknown file',

          preview:
            preview
              ? preview
              : item.status === 'PROCESSING'
                ? 'Transcription is still processing...'
                : item.status === 'FAILED'
                  ? 'Transcription failed.'
                  : 'No transcript available.',

          mediaType:
            item.mediaType
              ? item.mediaType.toLowerCase()
              : 'audio',

          language:
            item.language || 'Unknown',

          status:
            item.status || 'UNKNOWN',

          createdAt:
            item.createdAt || null,

          transcriptionId:
            item.transcriptionId || null,

          transcriptPreview:
            preview,
        };
      });

      setTranscriptions(formattedData);

    } catch (error) {

      console.error(
        'History loading error:',
        error
      );

      setError(
        error.message ||
        'Unable to load transcription history'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredTranscriptions =
    transcriptions.filter((item) => {

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        item.fileName
          .toLowerCase()
          .includes(searchText) ||

        item.preview
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.status === statusFilter;

      const matchesType =
        typeFilter === 'ALL' ||
        item.mediaType === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });

  // =========================================================
  // OPEN FULL TRANSCRIPT
  // =========================================================

  const handleOpenTranscript = async (item) => {

    if (
      item.status !== 'COMPLETED' ||
      !item.transcriptionId
    ) {
      return;
    }

    try {

      setOpeningId(item.id);

      /*
       * Fetch the complete transcript only when
       * the user clicks Open.
       */
      const response = await fetch(
        `${API_BASE_URL}/media/${item.id}`
      );

      if (!response.ok) {
        throw new Error(
          'Failed to load transcript'
        );
      }

      const fullData =
        await response.json();

      console.log(
        'Full transcript response:',
        fullData
      );

      /*
       * Build the same structure expected
       * by TranscriptResult.jsx.
       */
      const result = {

        id:
          fullData.transcriptionId ||
          item.transcriptionId,

        mediaFileId:
          fullData.id ||
          item.id,

        fileName:
          fullData.fileName ||
          item.fileName,

        mediaType:
          fullData.mediaType ||
          item.mediaType.toUpperCase(),

        status:
          fullData.status ||
          item.status,

        transcriptText:
          fullData.transcriptText ||
          '',

        language:
          fullData.language ||
          item.language,

        createdAt:
          fullData.createdAt ||
          item.createdAt,

        updatedAt:
          fullData.updatedAt ||
          null,
      };

      localStorage.setItem(
        'transcriptionResult',
        JSON.stringify(result)
      );

      if (setSelectedTranscriptId) {
        setSelectedTranscriptId(
          item.transcriptionId
        );
      }

      setActivePage('result');

    } catch (error) {

      console.error(
        'Transcript loading error:',
        error
      );

      alert(
        error.message ||
        'Unable to open transcript'
      );

    } finally {

      setOpeningId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="space-y-6 max-w-6xl mx-auto">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Transcription History
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Search, filter, inspect, and export your previous
            audio and video transcriptions.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="text-center py-16">

            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />

            <p className="text-xs text-slate-500 mt-4">
              Loading transcription history...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="space-y-6 max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Transcription History
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Search, filter, inspect, and export your previous
              audio and video transcriptions.
            </p>

          </div>

          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Retry
          </button>

        </div>

        <div className="bg-white rounded-2xl border border-red-200 shadow-sm">

          <div className="text-center py-16">

            <p className="text-sm font-semibold text-red-600">
              Unable to load history
            </p>

            <p className="text-xs text-slate-500 mt-2">
              {error}
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Title */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Transcription History
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Search, filter, inspect, and export your previous
            audio and video transcriptions.
          </p>

        </div>

        <button
          onClick={() => setActivePage('new')}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          + New Transcription
        </button>

      </div>

      {/* Search + Filters */}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">

        {/* Search */}

        <div className="relative w-full md:w-80">

          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search by file name or keywords..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />

        </div>

        {/* Filters */}

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">

          {/* Status */}

          <div className="flex items-center gap-1.5 text-xs text-slate-500">

            <span>Status:</span>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-violet-500"
            >

              <option value="ALL">
                All Statuses
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="PROCESSING">
                Processing
              </option>

              <option value="FAILED">
                Failed
              </option>

            </select>

          </div>

          {/* Type */}

          <div className="flex items-center gap-1.5 text-xs text-slate-500">

            <span>Type:</span>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-violet-500"
            >

              <option value="ALL">
                All Media
              </option>

              <option value="audio">
                Audio Only
              </option>

              <option value="video">
                Video Only
              </option>

            </select>

          </div>

          {/* Refresh */}

          <button
            onClick={fetchHistory}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600"
          >
            Refresh
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {filteredTranscriptions.length === 0 ? (

          <div className="text-center py-16">

            <p className="text-slate-500 text-xs">
              No transcription records found matching
              your filters.
            </p>

            {transcriptions.length === 0 && (

              <button
                onClick={() => setActivePage('new')}
                className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold"
              >
                Create Your First Transcription
              </button>

            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm text-slate-600">

              <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">

                <tr>

                  <th className="py-3.5 px-6">
                    File Name & Preview
                  </th>

                  <th className="py-3.5 px-4">
                    Language
                  </th>

                  <th className="py-3.5 px-4">
                    Status
                  </th>

                  <th className="py-3.5 px-4">
                    Uploaded
                  </th>

                  <th className="py-3.5 px-6 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredTranscriptions.map((t) => (

                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >

                    {/* File */}

                    <td className="py-4 px-6 font-medium text-slate-900 max-w-sm">

                      <div className="flex items-start gap-3">

                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">

                          {t.mediaType === 'video' ? (

                            <IconFileVideo className="w-4 h-4 text-violet-600" />

                          ) : (

                            <IconFileAudio className="w-4 h-4 text-indigo-600" />

                          )}

                        </div>

                        <div className="min-w-0">

                          <div className="font-semibold text-slate-800 text-sm truncate">

                            {t.fileName}

                          </div>

                          <div className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-normal">

                            {t.preview}

                          </div>

                        </div>

                      </div>

                    </td>

                    {/* Language */}

                    <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">

                      {t.language}

                    </td>

                    {/* Status */}

                    <td className="py-4 px-4 whitespace-nowrap">

                      <StatusBadge
                        status={t.status}
                      />

                    </td>

                    {/* Date */}

                    <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">

                      {t.createdAt
                        ? new Date(
                            t.createdAt
                          ).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )
                        : 'Unknown'}

                    </td>

                    {/* Action */}

                    <td className="py-4 px-6 text-right whitespace-nowrap">

                      {t.status === 'COMPLETED' &&
                      t.transcriptionId ? (

                        <button
                          onClick={() =>
                            handleOpenTranscript(t)
                          }
                          disabled={
                            openingId === t.id
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                          <span>
                            {openingId === t.id
                              ? 'Opening...'
                              : 'Open'}
                          </span>

                          {openingId !== t.id && (
                            <IconChevronRight className="w-3 h-3" />
                          )}

                        </button>

                      ) : (

                        <span className="text-[11px] text-slate-400">
                          Not available
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}