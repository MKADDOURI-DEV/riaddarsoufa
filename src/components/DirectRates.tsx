'use client';
import React from 'react';
import Link from 'next/link';
import { TagIcon, SunIcon, ReceiptPercentIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useSite } from '@/context/SiteContext';

const TXT = {
  fr: {
    label: 'Réservation directe',
    title: 'Meilleurs tarifs en réservant en direct',
    text: 'Réservez sur notre site : vous payez le tarif le plus avantageux, sans intermédiaire.',
    points: [
      { icon: TagIcon, title: 'Tarif direct le plus bas', text: 'Plus avantageux que sur les plateformes de réservation.' },
      { icon: SunIcon, title: 'Petit-déjeuner inclus', text: 'Servi chaque matin au riad, compris dans le prix.' },
      { icon: ReceiptPercentIcon, title: 'Prix final tout compris', text: 'TVA et taxes de séjour incluses, aucun supplément à la réservation.' },
      { icon: ChatBubbleLeftRightIcon, title: 'Contact direct avec le riad', text: 'Une question ? Notre équipe vous répond directement.' },
    ],
    cta: 'Réserver au meilleur tarif',
    badge: 'Meilleurs tarifs en réservant en direct',
  },
  en: {
    label: 'Direct booking',
    title: 'Best rates when booking directly',
    text: 'Book on our website: you get the most favourable rate, with no middleman.',
    points: [
      { icon: TagIcon, title: 'Lowest direct rate', text: 'Better value than on booking platforms.' },
      { icon: SunIcon, title: 'Breakfast included', text: 'Served every morning at the riad, included in the price.' },
      { icon: ReceiptPercentIcon, title: 'Final all-inclusive price', text: 'VAT and tourist taxes included, no extra charge at booking.' },
      { icon: ChatBubbleLeftRightIcon, title: 'Direct contact with the riad', text: 'Any question? Our team answers you directly.' },
    ],
    cta: 'Book at the best rate',
    badge: 'Best rates when booking directly',
  },
};

export function directRatesText(lang: string) {
  return lang === 'en' ? TXT.en : TXT.fr;
}

/** Petit badge « Meilleurs tarifs en réservant en direct » (au-dessus de la barre de réservation). */
export function DirectRatesBadge({ light = false, className = '' }: { light?: boolean; className?: string }) {
  const { lang } = useSite();
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] ${
      light ? 'bg-white/15 text-white ring-1 ring-white/30 backdrop-blur' : 'bg-accent/10 text-accent'} ${className}`}>
      <TagIcon className="h-4 w-4" aria-hidden="true" />
      {directRatesText(lang).badge}
    </span>
  );
}

/** Section de la page d'accueil mettant en avant l'intérêt de réserver en direct. */
export default function DirectRates() {
  const { lang, dir, home } = useSite();
  const h = home.direct;
  const L = lang === 'en' ? 'en' : 'fr';
  const ICONS = [TagIcon, SunIcon, ReceiptPercentIcon, ChatBubbleLeftRightIcon];
  const t = { label: h.label[L] || h.label.fr, title: h.title[L] || h.title.fr, text: h.text[L] || h.text.fr, cta: h.cta[L] || h.cta.fr,
    points: h.points.map((p, i) => ({ icon: ICONS[i], title: p.title[L] || p.title.fr, text: p.text[L] || p.text.fr })) };
  return (
    <section dir={dir} className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 lg:px-8" aria-labelledby="direct-rates-title">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.4em] text-primary-foreground/70">{t.label}</span>
            <h2 id="direct-rates-title" className="font-serif text-3xl leading-tight sm:text-4xl">{t.title}</h2>
            <p className="mt-3 text-sm text-primary-foreground/80 sm:text-base">{t.text}</p>
          </div>
          <Link href="/booking" className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
            {t.cta}
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5">
              <Icon className="mb-3 h-6 w-6 text-primary-foreground" aria-hidden="true" />
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-primary-foreground/75">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
