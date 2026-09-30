'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';

export default function HeroSection() {
  const { t, dir } = useSite();

  return (
    <section dir={dir} className="relative min-h-screen flex flex-col" aria-label="Hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_11c05f051-1772250211690.png"
          alt="Cour intérieure d'un riad marocain traditionnel avec fontaine et zellige, atmosphère sombre et luxueuse, lumières chaudes tamisées"
          fill
          priority
          className="object-cover"
          sizes="100vw" />
        
        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 justify-center items-center text-center px-4 pt-32 pb-40">
        {/* Ornament */}
        <div className="moroccan-divider w-32 mb-8">
          <span className="text-accent text-xs font-bold tracking-[0.5em] uppercase px-4 text-white/70">
            Rabat, Maroc
          </span>
        </div>

        <h1 className="font-serif text-hero text-white mb-6 animate-fade-up leading-none">
          Riad Dar Soufa
        </h1>

        <p className="text-base sm:text-lg text-white/80 max-w-2xl mb-10 leading-relaxed animate-fade-up delay-200 font-light">
          {t?.hero?.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up delay-300">
          <Link href="/booking" className="btn-accent text-base px-8 py-4">
            {t?.hero?.cta1}
          </Link>
          <Link href="/rooms" className="btn-secondary text-base px-8 py-4 border-white/40 text-white hover:border-accent hover:text-accent">
            {t?.hero?.cta2}
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-up delay-400">
          {[
          { value: '4', label: dir === 'rtl' ? 'غرف فاخرة' : 'Chambres d\'exception' },
          { value: '5★', label: dir === 'rtl' ? 'تقييم الضيوف' : 'Note de nos hôtes' },
          { value: '2026', label: dir === 'rtl' ? 'تأسيس' : 'Établi en' }]?.
          map((stat, i) =>
          <div key={i} className="text-center">
              <div className="font-serif text-3xl text-accent italic">{stat?.value}</div>
              <div className="text-xs text-white/60 uppercase tracking-widest mt-1">{stat?.label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-float">
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>);

}