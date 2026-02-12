'use client';

import React, { useState, useEffect } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { removeWatermark } from '@/lib/watermark-remover';
import { useI18n } from '@/hooks/useI18n';

const DEMO_IMAGE = '/demo/demo-1.png';
const DEMO_ASPECT_RATIO = 1536 / 500;

export default function DemoSection() {
  const { t } = useI18n();
  const [beforeCanvas, setBeforeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [afterCanvas, setAfterCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const runWhenIdle = (fn: () => void) => {
      const g = globalThis as typeof globalThis & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };
      if (typeof g.requestIdleCallback === 'function') {
        g.requestIdleCallback(fn, { timeout: 1500 });
        return;
      }
      setTimeout(fn, 0);
    };

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;

      // Draw the "before" canvas quickly, then defer the heavier watermark
      // removal work so we don't block initial rendering / inflate TBT.
      const before = document.createElement('canvas');
      before.width = img.naturalWidth;
      before.height = img.naturalHeight;
      before.getContext('2d')!.drawImage(img, 0, 0);
      setBeforeCanvas(before);

      runWhenIdle(() => {
        if (cancelled) return;
        const result = removeWatermark(img, 'smartfill');
        setAfterCanvas(result.canvas);
      });
    };
    img.src = DEMO_IMAGE;

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
        {t('demo.title')}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        {t('demo.subtitle')}
      </p>
      {beforeCanvas && afterCanvas ? (
        <BeforeAfterSlider
          before={beforeCanvas}
          after={afterCanvas}
          beforeLabel={t('preview.before')}
          afterLabel={t('preview.after')}
        />
      ) : (
        <div
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
          style={{ aspectRatio: String(DEMO_ASPECT_RATIO) }}
          aria-hidden="true"
        />
      )}
    </section>
  );
}
