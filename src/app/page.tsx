'use client';

import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DropZone from '@/components/DropZone';
import DemoSection from '@/components/DemoSection';
import FileResults, { type ProcessedFile } from '@/components/FileResults';
import { useI18n } from '@/hooks/useI18n';
import { processImage, getFileType } from '@/lib/image-processor';
import { processPdf } from '@/lib/pdf-processor';
import { canvasToBlob } from '@/lib/watermark-remover';
import JSZip from 'jszip';

type AppState = 'idle' | 'processing' | 'done';

export default function HomePage() {
  const { t, ready } = useI18n();
  const [state, setState] = useState<AppState>('idle');
  const [files, setFiles] = useState<ProcessedFile[]>([]);

  const handleFiles = useCallback(async (selectedFiles: File[]) => {
    // Process all files — always uses Smart Fill (gradient interpolation)
    setState('processing');
    const processedFiles: ProcessedFile[] = selectedFiles.map((f) => ({
      original: f,
      originalPreview: null,
      smartFillResult: null,
      smartFillPreview: null,
      cropResult: null,
      cropPreview: null,
      selectedMethod: 'smartfill' as const,
      status: 'pending' as const,
      progress: 0,
    }));
    setFiles([...processedFiles]);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      processedFiles[i].status = 'processing';
      setFiles([...processedFiles]);

      try {
        const fileType = getFileType(file);

        if (fileType === 'image') {
          const sfResult = await processImage(file, 'smartfill');

          const origCanvas = document.createElement('canvas');
          origCanvas.width = sfResult.original.naturalWidth;
          origCanvas.height = sfResult.original.naturalHeight;
          origCanvas.getContext('2d')!.drawImage(sfResult.original, 0, 0);

          processedFiles[i] = {
            ...processedFiles[i],
            originalPreview: origCanvas,
            smartFillResult: sfResult.blob,
            smartFillPreview: sfResult.result.canvas,
            cropResult: null,
            cropPreview: null,
            selectedMethod: 'smartfill',
            status: 'done',
            progress: 100,
          };
        } else if (fileType === 'pdf') {
          const sfResult = await processPdf(file, 'smartfill', undefined, (p) => {
            processedFiles[i].progress = (p.currentPage / p.totalPages) * 100;
            setFiles([...processedFiles]);
          });

          processedFiles[i] = {
            ...processedFiles[i],
            smartFillResult: sfResult.blob,
            cropResult: null,
            selectedMethod: 'smartfill',
            status: 'done',
            progress: 100,
          };
        }
      } catch (err) {
        processedFiles[i].status = 'error';
        processedFiles[i].error = err instanceof Error ? err.message : 'Unknown error';
      }

      setFiles([...processedFiles]);
    }

    setState('done');
  }, []);

  const handleDownload = useCallback((index: number) => {
    const file = files[index];
    if (!file || !file.smartFillResult) return;

    const baseName = file.original.name.replace(/\.[^.]+$/, '');
    const ext = file.original.type === 'application/pdf' ? '.pdf' : file.original.name.match(/\.png$/i) ? '.png' : '.jpg';
    const url = URL.createObjectURL(file.smartFillResult);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_clean${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [files]);

  const handleDownloadAll = useCallback(async () => {
    if (files.length <= 1) {
      handleDownload(0);
      return;
    }

    const zip = new JSZip();
    files.forEach((file) => {
      const blob = file.smartFillResult;
      if (!blob) return;
      const baseName = file.original.name.replace(/\.[^.]+$/, '');
      const ext = file.original.type === 'application/pdf' ? '.pdf' : file.original.name.match(/\.png$/i) ? '.png' : '.jpg';
      zip.file(`${baseName}_clean${ext}`, blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unmarklm_clean.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [files, handleDownload]);

  const handleReset = useCallback(() => {
    setState('idle');
    setFiles([]);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 pt-16 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </section>

        {/* Main Tool Area */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          {state === 'idle' && (
            <DropZone onFiles={handleFiles} />
          )}

          {(state === 'processing' || state === 'done') && (
            <FileResults
              files={files}
              onDownload={handleDownload}
              onDownloadAll={handleDownloadAll}
              onReset={handleReset}
            />
          )}
        </section>

        {/* Features Section */}
        {state === 'idle' && (
          <>
            {/* Demo Before/After */}
            <DemoSection />

            <section className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
              {t('features.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                title={t('features.privacy.title')}
                desc={t('features.privacy.desc')}
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                title={t('features.free.title')}
                desc={t('features.free.desc')}
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                title={t('features.smart.title')}
                desc={t('features.smart.desc')}
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                title={t('features.formats.title')}
                desc={t('features.formats.desc')}
              />
            </div>
          </section>
          </>
        )}

        {/* Disclaimer */}
        <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {t('disclaimer')}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t('disclaimer.user')}
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
