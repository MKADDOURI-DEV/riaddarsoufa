'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useSite } from '@/context/SiteContext';
import { Language } from '@/lib/data';

export default function Header() {
  const { t, lang, setLang, isDark, toggleDark, dir } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/rooms', label: t.nav.rooms },
    { href: '/services', label: t.nav.services },
    { href: '/contact', label: t.nav.contact },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'ar', label: 'ع', flag: '🇲🇦' },
  ];

  return (
    <header
      dir={dir}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <AppLogo size={56} />
            <span className="sr-only">Riad Dar Soufa</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-underline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 pb-0.5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className={`hidden lg:flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-1">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full transition-all duration-200 ${
                    lang === l.code
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label={`Switch to ${l.label}`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Book CTA */}
            <Link href="/booking" className="btn-primary text-sm">
              {t.nav.book}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm"
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-muted"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } bg-card/98 backdrop-blur-md border-t border-border`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-base font-medium text-foreground hover:text-accent transition-colors py-2 border-b border-border last:border-0"
            >
              {link.label}
            </Link>
          ))}
          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-2 pt-2">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setMenuOpen(false); }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  lang === l.code
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-accent'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          <Link
            href="/booking"
            onClick={() => setMenuOpen(false)}
            className="btn-primary w-full mt-2"
          >
            {t.nav.book}
          </Link>
        </div>
      </div>
    </header>
  );
}