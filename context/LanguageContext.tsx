
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKeys } from '../services/translations';

type Locale = 'pt' | 'en';

interface LanguageContextType {
  locale: Locale;
  toggleLanguage: () => void;
  setLanguage: (lang: Locale) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('fa-locale');
    return (saved as Locale) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('fa-locale', locale);
  }, [locale]);

  const toggleLanguage = () => setLocale(prev => prev === 'pt' ? 'en' : 'pt');
  const setLanguage = (lang: Locale) => setLocale(lang);
  
  const t = (key: TranslationKeys): string => {
    return translations[locale][key] || translations['pt'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

