'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useSite } from '@/context/SiteContext';
import SocialIcons from '@/components/SocialIcons';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { formatPhone, telHref, waDigits } from '@/lib/content';

export default function Footer() {
  const { t, lang, dir, contact } = useSite();

  return (
    <footer dir={dir} className="bg-[var(--footer)] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/20">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AppLogo size={80} src="/assets/images/app_logo_light.png" />
              <span className="sr-only">Riad Dar Soufa</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-xs">
              {t?.footer?.tagline}
            </p>
            <SocialIcons tone="light" size={40} className="pt-2" />
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">{t?.footer?.links}</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: t?.nav?.home },
                { href: '/riad', label: t?.nav?.riad },
                { href: '/rooms', label: t?.nav?.rooms },
                { href: '/services', label: t?.nav?.services },
                { href: '/contact', label: t?.nav?.contact },
                { href: '/booking', label: t?.nav?.book },
              ]?.map(link => (
                <li key={link?.href}>
                  <Link
                    href={link?.href}
                    className="text-sm text-white/80 hover:text-white hover:underline transition-colors duration-200"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">{t?.footer?.contactUs}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/80">
                <MapPinIcon className="h-4 w-4 text-white mt-0.5 shrink-0" aria-hidden="true" />
                <span>{contact.address[lang]}</span>
              </li>
              <li>
                <a href={telHref(contact.phone)} className="flex items-center gap-2 text-sm text-white/80 hover:text-white hover:underline transition-colors">
                  <PhoneIcon className="h-4 w-4 text-white shrink-0" aria-hidden="true" />
                  {formatPhone(contact.phone)}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white hover:underline transition-colors">
                  <EnvelopeIcon className="h-4 w-4 text-white shrink-0" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${waDigits(contact.whatsapp)}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white hover:underline transition-colors">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-white shrink-0" aria-hidden="true" />
                  {formatPhone(contact.whatsapp)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/60">{t?.footer?.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-white/60 hover:text-white hover:underline transition-colors">{t?.footer?.legal}</Link>
            <Link href="#" className="text-xs text-white/60 hover:text-white hover:underline transition-colors">{t?.footer?.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}