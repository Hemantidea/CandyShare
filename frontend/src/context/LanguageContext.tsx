'use client';
import React, { createContext, useContext, useState } from 'react';
import en from '../translations/en.json';
import hi from '../translations/hi.json';

type Language = 'en' | 'hi';
type Dictionary = typeof en;

interface LanguageContextType {
  lang: Language;
  t: Dictionary;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = lang === 'en' ? en : hi;

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};