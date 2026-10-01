'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { waDigits } from '@/lib/content';

function RoomDetailContent() {
  const { t, lang, dir, rooms: ROOMS, contact } = useSite();
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug') || ROOMS?.[0]?.slug;
  const room = ROOMS?.find(r => r?.slug === slug) || ROOMS?.[0];
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main className="pt-20">
        {/* Back link */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
            ← {t?.rooms?.backToRooms}
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Images + Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Main Image */}
              <div className="img-hover rounded-2xl overflow-hidden aspect-[16/10] relative">
                <AppImage
                  src={room?.images?.[activeImage]}
                  alt={`${room?.name?.[lang]} — vue principale de la chambre au Riad Dar Soufa, Rabat`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {room?.tag && (
                  <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {room?.tag?.[lang]}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {room?.images?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`${t?.rooms?.gallery} ${i + 1}`}
                  >
                    <AppImage
                      src={img}
                      alt={`${room?.name?.[lang]} photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground">{room?.name?.[lang]}</h2>
                <p className="text-muted-foreground leading-relaxed">{room?.description?.[lang]}</p>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{t?.rooms?.amenities}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room?.amenities?.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                      <span className="text-accent text-xs">✓</span>
                      {amenity?.[lang]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking Card */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xl">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-accent italic">{room?.pricePerNight?.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">{t?.common?.mad} {t?.rooms?.perNight}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                    room?.available ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${room?.available ? 'bg-green-500' : 'bg-red-500'}`} />
                    {room?.available ? t?.rooms?.available : t?.rooms?.unavailable}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="space-y-3 border-y border-border py-4">
                  {[
                    { label: t?.rooms?.capacity, value: `${room?.capacity} ${t?.rooms?.persons}` },
                    { label: t?.rooms?.bedType, value: room?.bedType?.[lang] },
                    { label: t?.rooms?.size, value: `${room?.size} ${t?.rooms?.sqm}` },
                  ]?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item?.label}</span>
                      <span className="font-medium text-foreground">{item?.value}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {room?.available ? (
                  <Link href={`/booking?room=${room?.slug}`} className="btn-primary w-full text-base py-4">
                    {t?.rooms?.bookRoom}
                  </Link>
                ) : (
                  <button disabled className="w-full py-4 rounded-full bg-muted text-muted-foreground text-base font-semibold cursor-not-allowed">
                    {t?.rooms?.unavailable}
                  </button>
                )}

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${waDigits(contact.whatsapp)}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par la ${room?.name?.fr}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-sm"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function RoomDetailClient() {
  return (
    <SiteProvider>
      <RoomDetailContent />
    </SiteProvider>
  );
}