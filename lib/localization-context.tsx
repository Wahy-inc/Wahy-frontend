'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import en from '@/lib/localization/en.json'
import ar from '@/lib/localization/ar.json'
import ru from '@/lib/localization/ru.json'
import fr from '@/lib/localization/fr.json'
import de from '@/lib/localization/de.json'
import es from '@/lib/localization/es.json'

type Language = 'en' | 'ar' | 'ru' | 'fr' | 'de' | 'es'

interface LocalizationContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

const translations: Record<Language, Record<string, unknown>> = {
  en,
  ar,
  ru,
  fr,
  de,
  es
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language | null
      if (savedLanguage && (['en', 'ar', 'ru', 'fr', 'de', 'es'] as const).includes(savedLanguage)) {
        return savedLanguage
      }
    }
    return 'en'
  })

  // Update DOM when language changes
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  )
}

export function useLocalization() {
  const context = useContext(LocalizationContext)
  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    }
  }
  return context
}

export type { LocalizationContextType };
