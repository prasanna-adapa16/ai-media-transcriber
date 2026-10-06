import React, { useState, useRef } from 'react';

import {
  IconUpload,
  IconFileAudio,
  IconFileVideo,
  IconCheck,
  IconAlertCircle,
  IconInfo,
  IconSparkles,
  IconClose,
} from '../components/Icons';

import { uploadMedia } from '../services/api';

export default function NewTranscription({
  setActivePage,
  setSelectedTranscriptId
}) {

  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const [language, setLanguage] = useState('auto');
  const [modelQuality, setModelQuality] = useState('base');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const [demoNotice, setDemoNotice] = useState(null);

  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_MB = 500;

  // --------------------------------------------------
  // FILE VALIDATION
  // --------------------------------------------------

  const handleValidateAndSelect = (selectedFile) => {

    setValidationError(null);
    setDemoNotice(null);

    if (!selectedFile) return;

    const fileSizeMB =
      selectedFile.size / (1024 * 1024);

    if (fileSizeMB > MAX_FILE_SIZE_MB) {

      setValidationError(
        `File is too large (${fileSizeMB.toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`
      );

      return;
    }

    const fileName =
      selectedFile.name.toLowerCase();

    const validExtensions = [
      '.mp3',
      '.wav',
      '.m4a',
      '.aac',
      '.flac',
      '.mp4',
      '.mov',
      '.mkv',
      '.webm'
    ];

    const hasValidExt =
      validExtensions.some(
        (ext) => fileName.endsWith(ext)
      );

    if (!hasValidExt) {

      setValidationError(
        'Unsupported format. Please upload an audio (MP3, WAV, M4A, FLAC) or video (MP4, MKV, MOV, WebM) file.'
      );

      return;
    }

    setFile(selectedFile);

    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }

    const previewUrl =
      URL.createObjectURL(selectedFile);

    setFilePreviewUrl(previewUrl);
  };

  // --------------------------------------------------
  // DRAG & DROP
  // --------------------------------------------------

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {

    e.preventDefault();
    setIsDragOver(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      handleValidateAndSelect(
        e.dataTransfer.files[0]
      );
    }
  };

  // --------------------------------------------------
  // REMOVE FILE
  // --------------------------------------------------

  const handleRemoveFile = () => {

    setFile(null);

    if (filePreviewUrl) {

      URL.revokeObjectURL(
        filePreviewUrl
      );

      setFilePreviewUrl(null);
    }

    setValidationError(null);
    setDemoNotice(null);
    setProgressPercent(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --------------------------------------------------
  // REAL BACKEND TRANSCRIPTION
  // --------------------------------------------------

  const handleStartTranscription = async (e) => {

    e.preventDefault();

    if (!file) {

      setValidationError(
        'Please select a media file first.'
      );

      return;
    }

    setValidationError(null);
    setDemoNotice(null);

    setIsProcessing(true);
    setProgressPercent(15);

    try {

      // Upload file to Spring Boot
      setProgressPercent(30);

      const result =
        await uploadMedia(file);

      console.log(
        'Backend transcription response:',
        result
      );

      setProgressPercent(100);

      /*
       * Save the complete backend response.
       *
       * Backend now returns:
       * id
       * mediaFileId
       * fileName
       * mediaType
       * status
       * transcriptText
       * language
       * createdAt
       * updatedAt
       */

      localStorage.setItem(
        'transcriptionResult',
        JSON.stringify(result)
      );

      // Save transcription ID
      if (result.id) {

        setSelectedTranscriptId(
          result.id
        );
      }

      setDemoNotice(
        `Transcription completed successfully for "${result.fileName}".`
      );

    } catch (error) {

      console.error(
        'Transcription error:',
        error
      );

      setValidationError(
        error.message ||
        'Something went wrong while processing the media file.'
      );

      setProgressPercent(0);

    } finally {

      setIsProcessing(false);
    }
  };

  // --------------------------------------------------
  // MEDIA TYPE
  // --------------------------------------------------

  const isVideo =
    file &&
    (
      file.type.startsWith('video') ||
      file.name.match(
        /\.(mp4|mov|mkv|webm)$/i
      )
    );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="max-w-4xl mx-auto space-y-6">

      {/* TITLE */}

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          New Media Transcription
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Upload audio or video lectures, interviews,
          and meetings to convert into searchable text
          transcripts.
        </p>

      </div>


      {/* VALIDATION ERROR */}

      {validationError && (

        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-fadeIn">

          <IconAlertCircle
            className="w-5 h-5 text-rose-600 shrink-0"
          />

          <span>
            {validationError}
          </span>

        </div>
      )}


      {/* SUCCESS NOTICE */}

      {demoNotice && (

        <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-violet-900 text-xs space-y-2">

          <div className="flex items-center gap-2 font-bold text-violet-800">

            <IconCheck
              className="w-4 h-4 text-violet-600"
            />

            <span>
              Transcription Complete
            </span>

          </div>

          <p>
            {demoNotice}
          </p>

          <div className="pt-2 flex items-center gap-3">

            <button
              onClick={() => setActivePage('result')}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              View Transcript Result &rarr;
            </button>

            <button
              onClick={handleRemoveFile}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium"
            >
              Upload Another
            </button>

          </div>

        </div>
      )}


      {/* MAIN UPLOAD CARD */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">


        {/* DRAG AND DROP */}

        {!file ? (

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              fileInputRef.current &&
              fileInputRef.current.click()
            }
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? 'border-violet-500 bg-violet-50/60 scale-[1.01]'
                : 'border-slate-300 hover:border-violet-400 hover:bg-slate-50/80 bg-slate-50/40'
            }`}
          >

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {

                if (
                  e.target.files &&
                  e.target.files.length > 0
                ) {

                  handleValidateAndSelect(
                    e.target.files[0]
                  );
                }

              }}
              accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.mp4,.mov,.mkv,.webm"
              className="hidden"
            />

            <div className="mx-auto w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4 shadow-sm">

              <IconUpload className="w-7 h-7" />

            </div>

            <div className="text-base font-bold text-slate-800">

              Drop your audio or video file here,
              or{" "}

              <span className="text-violet-600 underline">
                browse
              </span>

            </div>

            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">

              Supports MP3, WAV, M4A, FLAC, MP4,
              MKV, MOV, WebM. Maximum file size
              500 MB.

            </p>

          </div>

        ) : (

          /* FILE PREVIEW */

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 space-y-4">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">

                  {isVideo ? (
                    <IconFileVideo className="w-6 h-6" />
                  ) : (
                    <IconFileAudio className="w-6 h-6" />
                  )}

                </div>

                <div>

                  <div className="font-bold text-slate-900 text-sm">
                    {file.name}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">

                    <span>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>

                    <span>&bull;</span>

                    <span className="uppercase text-[10px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                      {file.type || 'Media File'}
                    </span>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isProcessing}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                title="Remove file"
              >

                <IconClose className="w-4 h-4" />

              </button>

            </div>


            {/* MEDIA PLAYER */}

            <div className="pt-2 border-t border-slate-200">

              <div className="text-xs font-semibold text-slate-600 mb-2">
                Media Preview:
              </div>

              {isVideo ? (

                <div className="rounded-xl overflow-hidden bg-black max-h-64 flex items-center justify-center">

                  <video
                    src={filePreviewUrl}
                    controls
                    className="w-full max-h-64 object-contain"
                  />

                </div>

              ) : (

                <audio
                  src={filePreviewUrl}
                  controls
                  className="w-full rounded-lg"
                />

              )}

            </div>

          </div>

        )}


        {/* CONFIGURATION */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">

          {/* LANGUAGE */}

          <div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">

              Audio Spoken Language

            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              disabled={isProcessing}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            >

              <option value="auto">
                Auto-Detect Language
              </option>

              <option value="en">
                English (US / UK / Global)
              </option>

              <option value="es">
                Spanish (Español)
              </option>

              <option value="fr">
                French (Français)
              </option>

              <option value="de">
                German (Deutsch)
              </option>

              <option value="ta">
                Tamil (தமிழ்)
              </option>

              <option value="hi">
                Hindi (हिन्दी)
              </option>

              <option value="ja">
                Japanese (日本語)
              </option>

              <option value="zh">
                Chinese (Mandarin)
              </option>

            </select>

            <p className="text-[11px] text-slate-400 mt-1">
              Whisper automatically detects the spoken language.
            </p>

          </div>


          {/* MODEL */}

          <div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">

              Whisper AI Model

            </label>

            <select
              value={modelQuality}
              onChange={(e) =>
                setModelQuality(e.target.value)
              }
              disabled={isProcessing}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            >

              <option value="base">
                Whisper Base (Recommended • Fast & Balanced)
              </option>

              <option value="tiny">
                Whisper Tiny (Ultra-fast • Lower Accuracy)
              </option>

              <option value="small">
                Whisper Small (High Precision)
              </option>

              <option value="medium">
                Whisper Medium (Best for heavy accents & technical terms)
              </option>

            </select>

            <p className="text-[11px] text-slate-400 mt-1">
              Model running on Python FastAPI service.
            </p>

          </div>

        </div>


        {/* PROCESSING PROGRESS */}

        {isProcessing && (

          <div className="space-y-2 p-4 rounded-xl bg-violet-50/70 border border-violet-100">

            <div className="flex items-center justify-between text-xs font-semibold text-violet-900">

              <span className="flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-violet-600 animate-ping" />

                Uploading and processing with Whisper AI...

              </span>

              <span>
                {progressPercent}%
              </span>

            </div>

            <div className="w-full h-2 rounded-full bg-violet-200 overflow-hidden">

              <div
                className="h-full bg-violet-600 transition-all duration-300 rounded-full"
                style={{
                  width: `${progressPercent}%`
                }}
              />

            </div>

          </div>

        )}


        {/* SUBMIT BUTTON */}

        <button
          onClick={handleStartTranscription}
          disabled={!file || isProcessing}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
            !file || isProcessing
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-violet-600 hover:bg-violet-700 shadow-violet-700/30'
          }`}
        >

          {isProcessing ? (

            <>

              <svg
                className="animate-spin w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >

                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />

              </svg>

              <span>
                Processing Media...
              </span>

            </>

          ) : (

            <>

              <IconSparkles className="w-4 h-4" />

              <span>
                Transcribe Media File
              </span>

            </>

          )}

        </button>

      </div>


      {/* SUPPORTED FORMATS */}

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">

        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">

          <IconInfo className="w-4 h-4 text-violet-600" />

          <span>
            Supported File Formats & Processing Info
          </span>

        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">

          {/* AUDIO */}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">

            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">

              <IconFileAudio className="w-4 h-4 text-indigo-600" />

              <span>
                Audio Formats
              </span>

            </div>

            <p className="text-slate-500">
              MP3, WAV, M4A, AAC, FLAC.
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              Directly fed to Whisper acoustic model.
            </p>

          </div>


          {/* VIDEO */}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">

            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">

              <IconFileVideo className="w-4 h-4 text-violet-600" />

              <span>
                Video Formats
              </span>

            </div>

            <p className="text-slate-500">
              MP4, MKV, MOV, WebM.
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              FFmpeg extracts audio before Whisper processing.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}