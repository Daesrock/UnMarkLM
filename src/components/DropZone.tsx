'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

export default function DropZone({ onFiles, accept = '.pdf,.png,.jpg,.jpeg', maxSize = 50 * 1024 * 1024, disabled = false }: DropZoneProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const acceptedExts = accept.split(',').map(e => e.trim().toLowerCase());

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Check extension
      const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
      const typeMatch = file.type === 'application/pdf' || file.type.startsWith('image/');
      const extMatch = acceptedExts.some(ae => ext === ae || ae === file.type);

      if (!typeMatch && !extMatch) {
        setError(t('error.unsupported'));
        continue;
      }

      if (file.size > maxSize) {
        setError(t('error.tooLarge'));
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFiles(validFiles);
    }
  }, [accept, maxSize, onFiles, t]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  }, [disabled, handleFiles]);

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset so same file can be selected again
    if (inputRef.current) inputRef.current.value = '';
  }, [handleFiles]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          w-full min-h-[320px] md:min-h-[400px]
          rounded-2xl border-2 border-dashed
          cursor-pointer transition-all duration-200 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Upload Icon */}
        <div className={`mb-4 transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`}>
          <svg
            className="w-16 h-16 md:w-20 md:h-20 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        {/* Title */}
        <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1">
          {t('dropzone.title')}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('dropzone.subtitle')}
        </p>

        {/* Upload button */}
        <button
          type="button"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors mb-4"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {t('dropzone.button')}
        </button>

        {/* Format info */}
        <div className="flex flex-col items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <span>{t('dropzone.formats')}</span>
          <span>{t('dropzone.maxsize')}</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
