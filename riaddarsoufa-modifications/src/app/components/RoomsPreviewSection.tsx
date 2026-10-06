'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { fromPrice, hasOccupancyPricing, formatMad } from '@/lib/pricing';
import SectionLabel from '@/components/SectionLabel';

// Grille en mosaïque : largeurs 1-2 / 2-1 répétées, quel que soit le nombre de chambres.
const SPANS = ['md:col-span-1', 'md:col-span-2', 'md:col-span-2', 'md:col-span-1'];

export default function RoomsPreviewSection() {
  const { t, lang, dir, rooms } = useSite();
  const shown = rooms.slice(0, 4);
  // Nombre impair de cartes : la dernière prend toute la largeur
  const spanFor = (i: number) => (i === shown.length - 1 && shown.length % 2 === 1 ? 'md:col-span-3' : SPANS[i % 4]);

  return (
    <section dir={dir} className="section-padding px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionLabel number="02">{t?.rooms?.allRooms}</SectionLabel>
            <h2 className="font-serif text-display text-foreground mt-4">{t?.rooms?.title}</h2>
            <p className="text-muted-foreground mt-2 max-w-md">{t?.rooms?.subtitle}</p>
          </div>
          <Link href="/rooms" className="btn-secondary flex-shrink-0">
            {t?.rooms?.allRooms} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shown.map((room, i) => {
            const wide = spanFor(i) !== 'md:col-span-1';
            return (
              <div key={room.id} className={`${spanFor(i)} room-card-hover bg-card rounded-2xl overflow-hidden border border-border group`}>
                <div className="img-hover relative h-52 overflow-hidden">
                  <AppImage
                    src={room.images?.[0]}
                    alt={`${room.name?.[lang]} — chambre du Riad Dar Soufa`}
                    fill
                    className="object-cover"
                    sizes={wide ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                  />
                  {room.tag?.[lang] && (
                    <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                      {room.tag[lang]}
                    </span>
                  )}
                  {!room.available && (
                    <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                      <span className="bg-card text-foreground text-xs font-bold px-3 py-1.5 rounded-full">{t?.rooms?.unavailable}</span>
                    </div>
                  )}
                </div>
                {wide ? (
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl text-foreground mb-1">{room.name?.[lang]}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{room.shortDesc?.[lang]}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                      {fromPrice(room) > 0 && (
                        <div className="text-right">
                          {hasOccupancyPricing(room) && <span className="block text-[11px] text-muted-foreground">{t?.rooms?.from}</span>}
                          <span className="text-accent font-bold text-xl">{formatMad(fromPrice(room), lang)}</span>
                          <span className="text-muted-foreground text-xs"> {t?.common?.mad}{t?.rooms?.perNight}</span>
                        </div>
                      )}
                      <Link href={`/room-detail?slug=${room.slug}`} className="btn-primary text-sm py-2.5 px-5">{t?.rooms?.viewRoom}</Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-foreground mb-1">{room.name?.[lang]}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{room.shortDesc?.[lang]}</p>
                    <div className="flex items-center justify-between">
                      {fromPrice(room) > 0 ? (
                        <span className="text-accent font-bold">{hasOccupancyPricing(room) && <span className="text-muted-foreground text-xs font-normal">{t?.rooms?.from} </span>}{formatMad(fromPrice(room), lang)} {t?.common?.mad}<span className="text-muted-foreground text-xs font-normal">{t?.rooms?.perNight}</span></span>
                      ) : <span className="text-xs text-muted-foreground">{room.capacity} {t?.rooms?.persons}</span>}
                      <Link href={`/room-detail?slug=${room.slug}`} className="text-xs font-semibold text-primary hover:text-accent transition-colors">
                        {t?.rooms?.viewRoom} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
