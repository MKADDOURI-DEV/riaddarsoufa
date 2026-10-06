'use client';
import React from 'react';
import { useSite } from '@/context/SiteContext';
import { waDigits } from '@/lib/content';

const PATHS = {
  instagram: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.3-2.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z',
  facebook: 'M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.8c-.3 0-1.3-.2-2.4-.2-2.5 0-4.1 1.5-4.1 4.2v2.7H7.6v3.3h2.8V22h3.1Z',
  whatsapp: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.3 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.2 4.3c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.7-.4l-1.7-.8c-.3-.1-.5-.1-.7.2l-.8 1c-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5.3-.4c.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4Z',
};

/** Icônes Instagram / Facebook / WhatsApp (liens modifiables depuis l'admin, onglet Contact). */
export default function SocialIcons({ tone = 'dark', size = 36, className = '' }: { tone?: 'light' | 'dark'; size?: number; className?: string }) {
  const { contact } = useSite();
  const items = [
    { key: 'instagram', label: 'Instagram', href: contact.instagram },
    { key: 'facebook', label: 'Facebook', href: contact.facebook },
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${waDigits(contact.whatsapp)}` },
  ] as const;
  const color = tone === 'light'
    ? 'border-white/60 text-white hover:bg-white hover:text-primary'
    : 'border-accent/70 text-accent hover:bg-accent hover:text-accent-foreground';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.filter((i) => i.href).map((i) => (
        <a key={i.key} href={i.href} target="_blank" rel="noopener noreferrer" aria-label={i.label}
          style={{ width: size, height: size }}
          className={`flex items-center justify-center rounded-full border transition-colors duration-200 ${color}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" width={size * 0.5} height={size * 0.5} aria-hidden="true"><path d={PATHS[i.key]} /></svg>
        </a>
      ))}
    </div>
  );
}
