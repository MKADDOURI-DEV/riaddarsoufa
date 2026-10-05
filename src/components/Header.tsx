'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { useSite } from '@/context/SiteContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { t, isDark, toggleDark, dir } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const overHero = pathname === '/' && !scrolled;
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


  return (
    <header
      dir={dir}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        overHero
          ? 'bg-transparent'
          : 'bg-card/95 backdrop-blur-md shadow-sm border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <AppLogo size={56} src={overHero ? '/assets/images/app_logo_light.png' : undefined} />
            <span className="sr-only">Riad Dar Soufa</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-underline text-sm font-medium transition-colors duration-300 pb-0.5 ${overHero ? 'text-white/85 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className={`hidden lg:flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? <SunIcon className="h-5 w-5" aria-hidden="true" /> : <MoonIcon className="h-5 w-5" aria-hidden="true" />}
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
              {isDark ? <SunIcon className="h-5 w-5" aria-hidden="true" /> : <MoonIcon className="h-5 w-5" aria-hidden="true" />}
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