'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, TRANSLATIONS, Room, Service, ContactInfo } from '@/lib/data';
import { DEFAULT_CONTENT, loadContentRows, mergeContent } from '@/lib/content';
import type { RiadContent } from '@/lib/riad';
import type { HomeContent } from '@/lib/home';
import { DEFAULT_LANG, detectLang, isSiteLang, storeLang, withFallback } from '@/lib/lang';

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
  riad: RiadContent;
  home: HomeContent;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  // Site bilingue FR / EN : français au premier affichage, puis langue du visiteur
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG);
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
    setLangState(detectLang());
    const savedDark = localStorage.getItem('rds-dark');
    document.documentElement.dir = 'ltr';
    if (savedDark === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    if (!isSiteLang(newLang)) return;
    setLangState(newLang);
    storeLang(newLang);
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
  // Champs anglais laissés vides dans l'admin : le texte français s'affiche à la place
  const shown = useMemo(() => withFallback(content), [content]);
  const dir: 'ltr' | 'rtl' = 'ltr';

  return (
    <SiteContext.Provider value={{ lang, setLang, t, isDark, toggleDark, dir, rooms: shown.rooms, services: shown.services, contact: shown.contact, riad: shown.riad, home: shown.home }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}