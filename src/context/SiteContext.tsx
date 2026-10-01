'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TRANSLATIONS, Room, Service, ContactInfo } from '@/lib/data';
import { DEFAULT_CONTENT, loadContentRows, mergeContent } from '@/lib/content';

interface SiteContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof TRANSLATIONS['fr'];
  isDark: boolean;
  toggleDark: () => void;
  dir: 'ltr' | 'rtl';
  rooms: Room[];
  services: Service[];
  contact: ContactInfo;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr');
  const [isDark, setIsDark] = useState(false);
  const [content, setContent] = useState(DEFAULT_CONTENT);

  // Contenu géré depuis l'admin (chambres, services, contact)
  useEffect(() => {
    let cancelled = false;
    loadContentRows().then((rows) => {
      if (!cancelled && rows) setContent(mergeContent(rows));
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('rds-lang') as Language | null;
    const savedDark = localStorage.getItem('rds-dark');
    if (savedLang && ['fr', 'en', 'ar'].includes(savedLang)) setLangState(savedLang);
    if (savedDark === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('rds-lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('rds-dark', String(next));
      return next;
    });
  }, []);

  const t = TRANSLATIONS[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <SiteContext.Provider value={{ lang, setLang, t, isDark, toggleDark, dir, rooms: content.rooms, services: content.services, contact: content.contact }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}