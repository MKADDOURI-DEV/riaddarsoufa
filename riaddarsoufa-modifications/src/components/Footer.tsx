'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useSite } from '@/context/SiteContext';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { formatPhone, telHref, waDigits } from '@/lib/content';

export default function Footer() {
  const { t, lang, dir, contact } = useSite();

  return (
    <footer dir={dir} className="bg-primary text-primary-foreground pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-primary-foreground/10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AppLogo size={80} src="/assets/images/app_logo_light.png" />
              <span className="sr-only">Riad Dar Soufa</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              {t?.footer?.tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/60 hover:text-accent hover:border-accent transition-all text-sm"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/60 hover:text-accent hover:border-accent transition-all text-sm"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href={`https://wa.me/${waDigits(contact.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/60 hover:text-accent hover:border-accent transition-all text-sm"
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent">{t?.footer?.links}</h3>
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
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors duration-200"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent">{t?.footer?.contactUs}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/60">
                <MapPinIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                <span>{contact.address[lang]}</span>
              </li>
              <li>
                <a href={telHref(contact.phone)} className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  <PhoneIcon className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                  {formatPhone(contact.phone)}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  <EnvelopeIcon className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${waDigits(contact.whatsapp)}`} className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                  {formatPhone(contact.whatsapp)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-primary-foreground/40">{t?.footer?.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-primary-foreground/40 hover:text-accent transition-colors">{t?.footer?.legal}</Link>
            <Link href="#" className="text-xs text-primary-foreground/40 hover:text-accent transition-colors">{t?.footer?.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}