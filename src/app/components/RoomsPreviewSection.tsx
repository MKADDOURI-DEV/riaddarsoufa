'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { ROOMS } from '@/lib/data';

export default function RoomsPreviewSection() {
  const { t, lang, dir } = useSite();
  // BENTO GRID AUDIT:
  // Array has 4 cards: [Chambre Andalouse, Suite Royale, Chambre Jardin, Suite Familiale]
  // Row 1: [col-1: Chambre Andalouse cs-1] [col-2: Suite Royale cs-2]
  // Row 2: [col-1: Chambre Jardin cs-2] [col-3: Suite Familiale cs-1]
  // Placed 4/4 cards ✓

  return (
    <section dir={dir} className="section-padding px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent">{t?.rooms?.allRooms}</span>
            <h2 className="font-serif text-display text-foreground mt-3">{t?.rooms?.title}</h2>
            <p className="text-muted-foreground mt-2 max-w-md">{t?.rooms?.subtitle}</p>
          </div>
          <Link href="/rooms" className="btn-secondary flex-shrink-0">
            {t?.rooms?.allRooms} →
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Row 1: Card 1 (col-span-1) */}
          <div className="md:col-span-1 room-card-hover bg-card rounded-2xl overflow-hidden border border-border group">
            <div className="img-hover relative h-52 overflow-hidden">
              <AppImage
                src={ROOMS?.[0]?.images?.[0]}
                alt={`${ROOMS?.[0]?.name?.[lang]} — chambre du Riad Dar Soufa avec zellige et décor marocain traditionnel`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                {ROOMS?.[0]?.tag?.[lang]}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-serif text-lg text-foreground mb-1">{ROOMS?.[0]?.name?.[lang]}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ROOMS?.[0]?.shortDesc?.[lang]}</p>
              <div className="flex items-center justify-between">
                <span className="text-accent font-bold">{ROOMS?.[0]?.pricePerNight?.toLocaleString()} {t?.common?.mad}<span className="text-muted-foreground text-xs font-normal">{t?.rooms?.perNight}</span></span>
                <Link href={`/room-detail?slug=${ROOMS?.[0]?.slug}`} className="text-xs font-semibold text-primary hover:text-accent transition-colors">
                  {t?.rooms?.viewRoom} →
                </Link>
              </div>
            </div>
          </div>

          {/* Row 1: Card 2 (col-span-2) */}
          <div className="md:col-span-2 room-card-hover bg-card rounded-2xl overflow-hidden border border-border group">
            <div className="img-hover relative h-52 overflow-hidden">
              <AppImage
                src={ROOMS?.[1]?.images?.[0]}
                alt={`${ROOMS?.[1]?.name?.[lang]} — suite luxueuse du Riad Dar Soufa avec terrasse et décor marocain haut de gamme`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                {ROOMS?.[1]?.tag?.[lang]}
              </span>
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl text-foreground mb-1">{ROOMS?.[1]?.name?.[lang]}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{ROOMS?.[1]?.shortDesc?.[lang]}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-4">
                <div className="text-right">
                  <span className="text-accent font-bold text-xl">{ROOMS?.[1]?.pricePerNight?.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs"> {t?.common?.mad}{t?.rooms?.perNight}</span>
                </div>
                <Link href={`/room-detail?slug=${ROOMS?.[1]?.slug}`} className="btn-primary text-sm py-2.5 px-5">
                  {t?.rooms?.viewRoom}
                </Link>
              </div>
            </div>
          </div>

          {/* Row 2: Card 3 (col-span-2) */}
          <div className="md:col-span-2 room-card-hover bg-card rounded-2xl overflow-hidden border border-border group">
            <div className="img-hover relative h-52 overflow-hidden">
              <AppImage
                src={ROOMS?.[2]?.images?.[0]}
                alt={`${ROOMS?.[2]?.name?.[lang]} — chambre avec vue sur patio fleuri du Riad Dar Soufa, Rabat`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl text-foreground mb-1">{ROOMS?.[2]?.name?.[lang]}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{ROOMS?.[2]?.shortDesc?.[lang]}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-4">
                <div className="text-right">
                  <span className="text-accent font-bold text-xl">{ROOMS?.[2]?.pricePerNight?.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs"> {t?.common?.mad}{t?.rooms?.perNight}</span>
                </div>
                <Link href={`/room-detail?slug=${ROOMS?.[2]?.slug}`} className="btn-primary text-sm py-2.5 px-5">
                  {t?.rooms?.viewRoom}
                </Link>
              </div>
            </div>
          </div>

          {/* Row 2: Card 4 (col-span-1) */}
          <div className="md:col-span-1 room-card-hover bg-card rounded-2xl overflow-hidden border border-border group">
            <div className="img-hover relative h-52 overflow-hidden">
              <AppImage
                src={ROOMS?.[3]?.images?.[0]}
                alt={`${ROOMS?.[3]?.name?.[lang]} — suite familiale spacieuse du Riad Dar Soufa avec salon marocain`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                {ROOMS?.[3]?.tag?.[lang]}
              </span>
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <span className="bg-card text-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                  {t?.rooms?.unavailable}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-serif text-lg text-foreground mb-1">{ROOMS?.[3]?.name?.[lang]}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ROOMS?.[3]?.shortDesc?.[lang]}</p>
              <div className="flex items-center justify-between">
                <span className="text-accent font-bold">{ROOMS?.[3]?.pricePerNight?.toLocaleString()} {t?.common?.mad}<span className="text-muted-foreground text-xs font-normal">{t?.rooms?.perNight}</span></span>
                <Link href={`/room-detail?slug=${ROOMS?.[3]?.slug}`} className="text-xs font-semibold text-primary hover:text-accent transition-colors">
                  {t?.rooms?.viewRoom} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}