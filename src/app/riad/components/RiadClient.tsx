'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { SiteProvider, useSite } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import { biText, RiadSection } from '@/lib/riad';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const TXT = {
  fr: { label: 'Le Riad', title: 'Dar Soufa, une maison de la médina', rooms: 'Découvrir les chambres', book: 'Réserver votre séjour', prev: 'Photo précédente', next: 'Photo suivante', outro: 'Séjourner au Riad Dar Soufa, c’est vivre dans une véritable maison traditionnelle de la médina de Rabat.' },
  en: { label: 'The Riad', title: 'Dar Soufa, a house in the medina', rooms: 'Discover the rooms', book: 'Book your stay', prev: 'Previous photo', next: 'Next photo', outro: 'Staying at Riad Dar Soufa means living in a genuine traditional house in the medina of Rabat.' },
};

/** Visuel d'une section : photos (avec défilement) ou motif inspiré du zellige tant qu'aucune photo n'est ajoutée. */
function SectionVisual({ section, alt }: { section: RiadSection; alt: string }) {
  const { lang } = useSite();
  const t = lang === 'en' ? TXT.en : TXT.fr;
  const [i, setI] = useState(0);
  const imgs = section.images;

  if (!imgs.length) {
    return (
      <div className="riad-pattern relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border" aria-hidden="true">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-3xl italic text-primary/70">{biText(section.title, lang)}</span>
        </div>
      </div>
    );
  }

  const go = (d: number) => setI((x) => (x + d + imgs.length) % imgs.length);
  return (
    <div className="img-hover relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
      <AppImage src={imgs[i]} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      {imgs.length > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label={t.prev}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/85 text-foreground shadow hover:bg-card">
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t.next}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/85 text-foreground shadow hover:bg-card">
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {imgs.map((_, k) => (
              <span key={k} className={`h-1.5 w-1.5 rounded-full ${k === i ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RiadContentPage() {
  const { lang, dir, riad } = useSite();
  const t = lang === 'en' ? TXT.en : TXT.fr;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main>
        {/* Bandeau */}
        <section className="relative flex h-72 items-end overflow-hidden px-4 pb-12 sm:h-96">
          <div className="absolute inset-0">
            {riad.intro.image ? (
              <AppImage src={riad.intro.image} alt="Riad Dar Soufa, médina de Rabat" fill priority className="object-cover" sizes="100vw" />
            ) : (
              <div className="riad-pattern h-full w-full" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.4em] text-white/80">{t.label}</span>
            <h1 className="font-serif text-display text-white">{t.title}</h1>
          </div>
        </section>

        {/* Présentation */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl">{biText(riad.intro.title, lang)}</h2>
          <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{biText(riad.intro.text, lang)}</p>
        </section>

        {/* Espaces communs */}
        <div className="mx-auto max-w-7xl space-y-16 px-4 pb-20 sm:px-6 lg:space-y-24 lg:px-8">
          {riad.sections.map((s, i) => (
            <section key={s.id} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14" aria-labelledby={`riad-${s.id}`}>
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <SectionVisual section={s} alt={`${biText(s.title, lang)}, Riad Dar Soufa`} />
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.4em] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h2 id={`riad-${s.id}`} className="font-serif text-3xl text-foreground">{biText(s.title, lang)}</h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">{biText(s.text, lang)}</p>
              </div>
            </section>
          ))}
        </div>

        {/* Appel à l'action */}
        <section className="bg-primary px-4 py-16 text-center text-primary-foreground">
          <p className="mx-auto max-w-2xl font-serif text-2xl leading-snug sm:text-3xl">{t.outro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/booking" className="inline-flex items-center rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary hover:opacity-90">{t.book}</Link>
            <Link href="/rooms" className="inline-flex items-center rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10">{t.rooms}</Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function RiadClient() {
  return (
    <SiteProvider>
      <RiadContentPage />
    </SiteProvider>
  );
}
