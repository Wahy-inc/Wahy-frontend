'use client';

import { useLocalization } from '@/lib/localization-context';

export function Footer() {
  const { t } = useLocalization();

  return (
    <footer className="w-full bg-slate-950 text-slate-100 text-md p-8">
      <p className="text-slate-100 pt-12 pb-2 text-5xl font-bold">{t('footer.brand_name')}.</p>
      <p className="w-[300px] opacity-70 pb-15">{t('footer.description')}</p>
      <p className="text-sm text-gray-500 mt-4">
        &copy; {new Date().getFullYear()} {t('footer.brand_name')}. {t('footer.copyright')}
      </p>
    </footer>
  );
}
