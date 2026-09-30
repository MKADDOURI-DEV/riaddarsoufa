'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';

export default function PresentationSection() {
  const { t, dir } = useSite();

  return (
    <section dir={dir} className="section-padding px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="img-hover rounded-2xl overflow-hidden aspect-[4/3] relative">
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1f01e49fd-1772210725810.png"
                alt="Patio central du Riad Dar Soufa avec fontaine en zellige, orangers et architecture marocaine traditionnelle, lumière naturelle douce"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw" />
              
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 right-6 lg:-right-6 bg-card border border-border rounded-2xl p-5 shadow-xl animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">5.0 / 5</div>
                  <div className="text-xs text-muted-foreground">+50 avis vérifiés</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-6 pt-8 lg:pt-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent">{t?.presentation?.label}</span>
              <h2 className="font-serif text-display text-foreground mt-3 leading-tight">
                {t?.presentation?.title}
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{t?.presentation?.text1}</p>
              <p className="text-muted-foreground leading-relaxed">{t?.presentation?.text2}</p>
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

            <Link href="/rooms" className="btn-primary inline-flex">
              {t?.presentation?.cta}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>);

}