'use client';
import React from 'react';
import Link from 'next/link';
import BookingBar from '@/components/BookingBar';
import AppImage from '@/components/ui/AppImage';
import { DirectRatesBadge } from '@/components/DirectRates';
import { useSite } from '@/context/SiteContext';

export default function HeroSection() {
  const { t, dir, rooms, lang, home } = useSite();
  const L = lang === 'ar'
    ? { overline: 'الرباط · المدينة العتيقة', rooms: 'غرف وأجنحة', place: 'مدينة الرباط العتيقة', direct: 'حجز مباشر', scroll: 'اكتشف' }
    : lang === 'en'
    ? { overline: 'Rabat · Medina', rooms: 'Rooms & suites', place: 'Rabat Medina', direct: 'Direct booking', scroll: 'Discover' }
    : { overline: 'Rabat · Médina', rooms: 'Chambres & suites', place: 'Médina de Rabat', direct: 'Réservation directe', scroll: 'Découvrir' };

  const stats = [
    { value: String(rooms.length), label: L.rooms },
    { value: 'Rabat', label: L.place },
    { value: '100 %', label: L.direct },
  ];

  return (
    <section dir={dir} className="relative flex min-h-screen flex-col" aria-label="Hero">
      {/* Image plein écran */}
      <div className="absolute inset-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_11c05f051-1772250211690.png"
          alt="Cour intérieure du Riad Dar Soufa avec fontaine et zellige"
          fill
          priority
          className="object-cover"
          sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(22,29,37,0.72) 0%, rgba(22,29,37,0.35) 40%, rgba(22,29,37,0.82) 100%)' }} />
      </div>

      {/* Contenu */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-32 pt-32 sm:px-6 lg:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-white/80 animate-fade-up">{L.overline}</p>
        <h1 className="font-serif text-hero max-w-4xl text-white animate-fade-up leading-[0.95]">Riad Dar Soufa</h1>
        <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-white/85 sm:text-lg animate-fade-up delay-200">
          {home.heroSubtitle[lang === 'en' ? 'en' : 'fr'] || home.heroSubtitle.fr}
        </p>
        <div className="mt-4 animate-fade-up delay-200">
          <Link href="/riad" className="text-sm font-semibold text-white/90 underline underline-offset-4 hover:text-white">{t?.hero?.cta2}</Link>
        </div>

        {/* Barre de réservation visible dès l'arrivée sur le site */}
        <div id="reserver" className="mt-8 scroll-mt-24 animate-fade-up delay-300">
          <DirectRatesBadge light className="mb-3" />
          <BookingBar className="max-w-6xl" />
        </div>
      </div>

      {/* Bandeau d'informations (faits vérifiables) */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/20" style={{ background: 'rgba(22,29,37,0.55)', backdropFilter: 'blur(6px)' }}>
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/20 px-4 sm:px-6 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="px-3 py-5 text-center sm:px-6">
              <div className="font-serif text-2xl text-white sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/70 sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>);
}
