'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import en from '@/lib/localization/en.json'
import ar from '@/lib/localization/ar.json'

type Language = 'en' | 'ar'

interface LocalizationContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

const translations: Record<Language, any> = {
  en,
  ar
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language | null
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        return savedLanguage
      }
    }
    return 'en'
  })

  // Update DOM when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    }
  }, [language])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
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
    // Return a default context for SSR compatibility
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    }
  }
  return context
}
