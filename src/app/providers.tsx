'use client';

import { I18nProvider } from '@/hooks/useI18n';
import { ThemeProvider } from '@/hooks/useTheme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
