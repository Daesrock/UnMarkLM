'use client';

import React from 'react';
import { useI18n } from '@/hooks/useI18n';

export interface ProcessedFile {
  original: File;
  originalPreview: HTMLCanvasElement | null;
  smartFillResult: Blob | null;
  smartFillPreview: HTMLCanvasElement | null;
  cropResult: Blob | null;
  cropPreview: HTMLCanvasElement | null;
  selectedMethod: 'smartfill' | 'crop';
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
  progress: number;
}

interface FileResultsProps {
  files: ProcessedFile[];
  onDownload: (index: number) => void;
  onDownloadAll: () => void;
  onReset: () => void;
}

export default function FileResults({ files, onDownload, onDownloadAll, onReset }: FileResultsProps) {
  const { t } = useI18n();

  const allDone = files.every((f) => f.status === 'done');
  const anyProcessing = files.some((f) => f.status === 'processing');
  const anyError = files.some((f) => f.status === 'error');
  const showOverallProgress = anyProcessing && files.length > 1;

  return (
    <div className="w-full space-y-4">
      {/* Overall progress */}
      {showOverallProgress && (
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full" />
            <span className="text-sm text-blue-700 dark:text-blue-300">{t('processing.title')}</span>
          </div>
          <div className="mt-3 h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{
                width: `${(files.filter((f) => f.status === 'done').length / files.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
            {files.filter((f) => f.status === 'done').length} / {files.length}
          </p>
        </div>
      )}

      {/* File cards */}
      {files.map((file, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4">
            {/* File header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileIcon type={file.original.type} />
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.original.name}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  ({(file.original.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <StatusBadge status={file.status} />
            </div>

            {/* Processing progress */}
            {file.status === 'processing' && (
              <div className="mb-3">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {file.status === 'error' && file.error && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{file.error}</p>
            )}

            {/* Download button (when done) */}
            {file.status === 'done' && (
              <div className="flex items-center justify-end gap-2">
                <a
                  href="https://ko-fi.com/daesrock"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buy me a coffee on Ko-fi"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/95">
                    <svg className="w-3.5 h-3.5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 7h11a1 1 0 011 1v4a4 4 0 01-4 4H8a4 4 0 01-4-4V8a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 9h2a2 2 0 010 4h-2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Buy me a coffee
                </a>
                <button
                  onClick={() => onDownload(idx)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t('preview.download')}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Action buttons */}
      {(allDone || anyError) && files.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {files.length > 1 && (
            <button
              onClick={onDownloadAll}
              disabled={!allDone}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('preview.downloadAll')}
            </button>
          )}
          <button
            onClick={onReset}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-xl transition-colors"
          >
            {anyError ? t('preview.retry') : t('preview.reset')}
          </button>
        </div>
      )}
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  const isPdf = type === 'application/pdf';
  return (
    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isPdf ? 'bg-red-50 dark:bg-red-950/30' : 'bg-green-50 dark:bg-green-950/30'}`}>
      {isPdf ? (
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'done':
      return (
        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done
        </span>
      );
    case 'processing':
      return (
        <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-full">
          <div className="animate-spin w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full" />
          Processing
        </span>
      );
    case 'error':
      return (
        <span className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-full">
          Error
        </span>
      );
    default:
      return (
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          Pending
        </span>
      );
  }
}
