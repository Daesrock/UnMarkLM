'use client';

import React, { useState, useEffect } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { removeWatermark } from '@/lib/watermark-remover';
import { useI18n } from '@/hooks/useI18n';

const DEMO_IMAGE = '/demo/demo-1.png';

export default function DemoSection() {
  const { t } = useI18n();
  const [beforeCanvas, setBeforeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [afterCanvas, setAfterCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;

      const before = document.createElement('canvas');
      before.width = img.naturalWidth;
      before.height = img.naturalHeight;
      before.getContext('2d')!.drawImage(img, 0, 0);

      const result = removeWatermark(img, 'smartfill');

      setBeforeCanvas(before);
      setAfterCanvas(result.canvas);
    };
    img.src = DEMO_IMAGE;

    return () => {
      cancelled = true;
    };
  }, []);

  if (!beforeCanvas || !afterCanvas) {
    return null;
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
        {t('demo.title')}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        {t('demo.subtitle')}
      </p>
      <BeforeAfterSlider
        before={beforeCanvas}
        after={afterCanvas}
        beforeLabel={t('preview.before')}
        afterLabel={t('preview.after')}
      />
    </section>
  );
}
