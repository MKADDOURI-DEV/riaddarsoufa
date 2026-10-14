'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import SectionLabel from '@/components/SectionLabel';

export default function PresentationSection() {
  const { t, dir, lang, contact, riad } = useSite();
  const L = lang === 'en' ? 'en' : 'fr';
  const title = riad.intro.title[L] || riad.intro.title.fr;
  const text = riad.intro.text[L] || riad.intro.text.fr;
  const photo = riad.intro.image || 'https://img.rocket.new/generatedImages/rocket_gen_img_1f01e49fd-1772210725810.png';

  return (
    <section dir={dir} className="section-padding px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="img-hover rounded-2xl overflow-hidden aspect-[4/3] relative">
              <AppImage
                src={photo}
                alt="Patio central du Riad Dar Soufa avec fontaine en zellige, orangers et architecture marocaine traditionnelle, lumière naturelle douce"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw" />
              
            </div>
            {/* Adresse */}
            <div className="absolute -bottom-6 right-6 lg:-right-6 bg-card border border-border rounded-xl p-5 shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{contact.address[lang].split(',').slice(-3, -1).join(',').trim() || 'Rabat'}</div>
              <div className="mt-1 font-serif text-lg text-foreground">Riad Dar Soufa</div>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-6 pt-8 lg:pt-0">
            <div>
              <SectionLabel number="01">{t?.presentation?.label}</SectionLabel>
              <h2 className="font-serif text-display text-foreground mt-3 leading-tight">
                {title}
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{text}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
              {[
              t?.presentation?.stat1,
              t?.presentation?.stat2,
              t?.presentation?.stat3]?.
              map((stat, i) =>
              <div key={i} className="text-center">
                  <div className="font-serif text-3xl text-accent italic">{stat?.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat?.label}</div>
                </div>
              )}
            </div>

            <Link href="/riad" className="btn-primary inline-flex">
              {t?.presentation?.cta}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>);

}