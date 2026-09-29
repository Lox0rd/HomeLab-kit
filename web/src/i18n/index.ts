import en from './en.json'
import ru from './ru.json'

export type Language = 'en' | 'ru'

const translations = {
  en,
  ru
}

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${string & K}.${string & DeepKeyOf<T[K]>}`
        : `${string & K}`
    }[keyof T]
  : never

export type TranslationKey = DeepKeyOf<typeof en>

class I18n {
  private currentLanguage: Language = 'en'

  constructor() {
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru')) {
      this.currentLanguage = savedLanguage
    } else {
      const browserLang = navigator.language.split('-')[0]
      this.currentLanguage = browserLang === 'ru' ? 'ru' : 'en'
      localStorage.setItem('language', this.currentLanguage)
    }
  }

  setLanguage(lang: Language) {
    this.currentLanguage = lang
    localStorage.setItem('language', lang)
  }

  getLanguage(): Language {
    return this.currentLanguage
  }

  t(key: TranslationKey, defaultValue?: string): string {
    const keys = key.split('.')
    let value: any = translations[this.currentLanguage]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue || key
      }
    }

    return typeof value === 'string' ? value : (defaultValue || key)
  }
}

export const i18n = new I18n()
