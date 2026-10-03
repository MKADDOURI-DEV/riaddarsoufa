'use client';
import React from 'react';
import { useSite } from '@/context/SiteContext';
import SectionLabel from '@/components/SectionLabel';
import { TESTIMONIALS } from '@/lib/data';

export default function TestimonialsSection() {
  const { t, lang, dir } = useSite();

  return (
    <section dir={dir} className="section-padding px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background ornament */}
      <div className="absolute top-0 right-0 font-serif text-[20vw] italic opacity-[0.04] leading-none pointer-events-none select-none text-primary-foreground">
        {lang === 'ar' ? 'ضيوف' : 'Hôtes'}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-14">
          <SectionLabel number="03" light>{t?.testimonials?.subtitle}</SectionLabel>
          <h2 className="font-serif text-display text-primary-foreground mt-3">{t?.testimonials?.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS?.map((testimonial) => (
            <div
              key={testimonial?.id}
              className="glass-card rounded-2xl p-7 space-y-5 hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial?.rating })?.map((_, i) => (
                  <span key={i} className="text-accent text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-primary-foreground/80 text-sm leading-relaxed italic">
                &ldquo;{testimonial?.text?.[lang]}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-primary-foreground/10">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                  {testimonial?.name?.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-foreground">{testimonial?.name}</div>
                  <div className="text-xs text-primary-foreground/50">{testimonial?.location?.[lang]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}