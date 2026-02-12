'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <p className="font-bold text-lg text-gray-900 dark:text-white">UnMarkLM</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              {t('hero.subtitle')}
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t('nav.faq')}</Link>
            <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t('nav.privacy')}</Link>
            <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t('nav.terms')}</Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t('nav.contact')}</Link>
            <a
              href="https://github.com/UnMarkLM/UnMarkLM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              GitHub
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-2">
            {t('disclaimer')}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            {t('footer.rights', { year: String(year) })}
          </p>
        </div>
      </div>
    </footer>
  );
}
