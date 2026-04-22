'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalization } from '@/lib/localization-context'
import React from 'react';

export function NavBar() {
  const { language, setLanguage, t } = useLocalization()

  return (
    <div id="navbar" className="z-50 w-full h-14 lg:h-20 absolute top-0 py-1 px-20  flex flex-row items-center bg-slate-900 text-slate-100 shadow-[0px_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="flex-1">
        <a className="text-2xl pl-4 font-bold">{t('navbar.brand')}</a>
      </div>
      <div className="flex-none">
        <div id='language-selector' className="flex flex-col">
          <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ar')} name="Language">
            <SelectTrigger className="w-full max-w-48">
              <SelectValue />
                </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('navbar.language')}</SelectLabel>
                      <SelectItem value='en'>{t('language_options.english')}</SelectItem>
                      <SelectItem value='ru'>{t('language_options.russian')}</SelectItem>
                      <SelectItem value='ar'>{t('language_options.arabic')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
            </Select>
        </div>
      </div>
    </div>
  )
}
