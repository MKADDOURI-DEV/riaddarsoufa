'use client';
import React, { useState } from 'react';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import RoomCard from '@/components/RoomCard';
import { useSite } from '@/context/SiteContext';
import AppImage from '@/components/ui/AppImage';

function RoomsContent() {
  const { t, dir, rooms: ROOMS } = useSite();
  const [filter, setFilter] = useState<'all' | '2' | '4'>('all');

  const filtered = ROOMS.filter((r) => {
    if (filter === 'all') return true;
    return r.capacity === Number(filter);
  });

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main>
        {/* Page Hero */}
        <section className="relative h-64 sm:h-80 flex items-end pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <AppImage
              src="https://images.unsplash.com/photo-1718266138024-f66fa8adabe1"
              alt="Vue aérienne d'un riad marocain avec cours intérieures, toits en terrasse et architecture traditionnelle, tons sombres et chaleureux"
              fill
              priority
              className="object-cover"
              sizes="100vw" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent mb-3 block">Riad Dar Soufa</span>
            <h1 className="font-serif text-display text-white">{t.rooms.title}</h1>
            <p className="text-white/70 mt-2">{t.rooms.subtitle}</p>
          </div>
        </section>

        {/* Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {[
            { key: 'all', label: dir === 'rtl' ? 'الكل' : 'Toutes' },
            { key: '2', label: dir === 'rtl' ? '2 أشخاص' : '2 personnes' },
            { key: '4', label: dir === 'rtl' ? '4 أشخاص' : '4 personnes' }].
            map((f) =>
            <button
              key={f.key}
              onClick={() => setFilter(f.key as 'all' | '2' | '4')}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
              filter === f.key ?
              'bg-primary text-primary-foreground border-primary' :
              'border-border text-muted-foreground hover:border-accent hover:text-accent'}`
              }>
              
                {f.label}
              </button>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((room) =>
            <RoomCard key={room.id} room={room} />
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>);

}

export default function RoomsClient() {
  return (
    <SiteProvider>
      <RoomsContent />
    </SiteProvider>);

}