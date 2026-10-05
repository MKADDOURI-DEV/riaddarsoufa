'use client';
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserIcon, Squares2X2Icon, HomeModernIcon } from '@heroicons/react/24/outline';
import { SiteProvider, useSite } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import BookingBar, { goToNozoul, useBookingForm } from '@/components/BookingBar';
import { nightsBetween } from '@/lib/nozoul';

function BookingContent() {
  const { t, lang, dir, rooms: ROOMS } = useSite();
  const searchParams = useSearchParams();
  const booking = useBookingForm();
  const { form, setForm, setError } = booking;
  const barRef = useRef<HTMLDivElement>(null);
  const roomSlug = searchParams.get('room');

  // Reprise des informations transmises par une autre page (?checkIn=…&adults=…)
  useEffect(() => {
    const n = (k: string) => { const v = parseInt(searchParams.get(k) || '', 10); return Number.isFinite(v) ? v : undefined; };
    const ages = (searchParams.get('childrenAges') || '').split(',').filter(Boolean).map(Number).filter((a) => a >= 0);
    setForm((f) => ({
      ...f,
      checkIn: searchParams.get('checkIn') || f.checkIn,
      checkOut: searchParams.get('checkOut') || f.checkOut,
      adults: n('adults') ?? f.adults,
      children: n('children') ?? f.children,
      childrenAges: ages.length ? ages : f.childrenAges,
    }));
  }, [searchParams, setForm]);

  const nights = nightsBetween(form.checkIn, form.checkOut);
  const available = ROOMS.filter((r) => r.available);
  // La chambre choisie depuis sa fiche apparaît en premier
  const list = roomSlug ? [...available].sort((a, b) => (a.slug === roomSlug ? -1 : b.slug === roomSlug ? 1 : 0)) : available;

  const book = () => {
    if (!goToNozoul(form, setError, lang)) barRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const L = lang === 'ar'
    ? { intro: 'اختر تواريخك وعدد المسافرين، ثم أكمل الحجز في محرك الحجز الآمن.', from: 'ابتداءً من' }
    : lang === 'en'
    ? { intro: 'Choose your dates and guests, then complete your booking on our secure booking engine.', from: 'From' }
    : { intro: 'Choisissez vos dates et vos voyageurs, puis finalisez votre réservation sur notre moteur de réservation sécurisé.', from: 'À partir de' };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main className="pt-20">
        <div className="bg-primary text-primary-foreground py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent/80 block mb-3">Riad Dar Soufa</span>
            <h1 className="font-serif text-display text-primary-foreground">{t.booking.title}</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/75">{L.intro}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div ref={barRef} className="-mt-20 relative z-10">
            <BookingBar state={booking} />
          </div>

          <div className="space-y-6">
            {list.map((room) => (
              <article key={room.id}
                className={`overflow-hidden rounded-[28px] border bg-card transition-colors ${room.slug === roomSlug ? 'border-accent' : 'border-border hover:border-accent'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <div className="img-hover relative h-56 sm:h-auto sm:min-h-[260px]">
                    <AppImage src={room.images[0]} alt={`${room.name[lang]} — Riad Dar Soufa`} fill className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw" />
                  </div>
                  <div className="flex flex-col justify-between p-6 sm:p-8">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="font-serif text-2xl text-foreground">{room.name[lang]}</h2>
                        {room.tag && (
                          <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">{room.tag[lang]}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{room.shortDesc[lang]}</p>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><UserIcon className="h-4 w-4" aria-hidden="true" />{room.capacity} {t.rooms.persons}</span>
                        <span className="inline-flex items-center gap-1.5"><HomeModernIcon className="h-4 w-4" aria-hidden="true" />{room.bedType[lang]}</span>
                        <span className="inline-flex items-center gap-1.5"><Squares2X2Icon className="h-4 w-4" aria-hidden="true" />{room.size} {t.rooms.sqm}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 4).map((a, i) => (
                          <span key={i} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{a[lang]}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
                      <div>
                        {nights > 0 ? (
                          <>
                            <span className="text-3xl font-bold text-accent">{(room.pricePerNight * nights).toLocaleString('fr-FR')}</span>
                            <span className="text-muted-foreground"> {t.common.mad}</span>
                            <div className="text-sm text-muted-foreground">{room.pricePerNight.toLocaleString('fr-FR')} {t.common.mad} × {nights} {t.booking.nights}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-muted-foreground">{L.from}</div>
                            <span className="text-3xl font-bold text-accent">{room.pricePerNight.toLocaleString('fr-FR')}</span>
                            <span className="text-muted-foreground"> {t.common.mad}{t.rooms.perNight}</span>
                          </>
                        )}
                      </div>
                      <button type="button" onClick={book} className="btn-primary px-8 py-3.5 text-base">{t.booking.bookNow}</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            {list.length === 0 && <p className="text-muted-foreground text-center py-12">{t.booking.noResults}</p>}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function BookingClient() {
  return (
    <SiteProvider>
      <BookingContent />
    </SiteProvider>
  );
}
