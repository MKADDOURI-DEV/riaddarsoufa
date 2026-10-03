'use client';
import React from 'react';
import BookingBar from '@/components/BookingBar';
import { useSite } from '@/context/SiteContext';

export default function BookingBarSection() {
  const { t, dir } = useSite();

  return (
    <section dir={dir} className="relative z-20 pt-14 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl text-foreground">{t?.booking?.title}</h2>
        </div>
        <BookingBar />
      </div>
    </section>
  );
}