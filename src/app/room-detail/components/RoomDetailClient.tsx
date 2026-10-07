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
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { waDigits } from '@/lib/content';
import { fromPrice, filledOccupancyPrices, formatMad } from '@/lib/pricing';
import PriceNote from '@/components/PriceNote';
import AmenityList from '@/components/AmenityList';
import { roomAmenities } from '@/lib/amenities';
import { DirectRatesBadge } from '@/components/DirectRates';

function RoomDetailContent() {
  const { t, lang, dir, rooms: ROOMS, contact } = useSite();
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug') || ROOMS?.[0]?.slug;
  const room = ROOMS?.find(r => r?.slug === slug) || ROOMS?.[0];
  const [activeImage, setActiveImage] = useState(0);
  const price = room ? fromPrice(room) : 0;
  const occ = room ? filledOccupancyPrices(room) : [];
  // Toutes les lignes de tarif (2 / 3 / 4 pers.) : une ligne sans prix s'affiche « Sur demande »
  const occRows = (room?.occupancyPrices || []).filter((p) => Number(p.guests) > 0).sort((a, b) => a.guests - b.guests);
  const hasAmenities = !!room && (roomAmenities(room.amenityKeys).length > 0 || (room.amenities?.length ?? 0) > 0);

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
              {room && hasAmenities && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{t?.rooms?.amenities}</h3>
                <AmenityList room={room} />
              </div>
              )}
            </div>

            {/* Right: Booking Card */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xl">
                {/* Price */}
                <div>
                  <DirectRatesBadge className="mb-4" />
                  {price > 0 ? (
                    <div>
                      {occ.length > 0 && <span className="block text-xs text-muted-foreground">{t?.rooms?.from}</span>}
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-4xl text-accent italic">{formatMad(price, lang)}</span>
                        <span className="text-muted-foreground text-sm">{t?.common?.mad} {t?.rooms?.perNight}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="font-serif text-2xl text-foreground">{t?.rooms?.byDates}</p>
                  )}
                  {/* Tarifs selon le nombre de personnes (ex. chambre Patio) */}
                  {occRows.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t?.rooms?.ratesByGuests}</p>
                      <ul className="divide-y divide-border rounded-xl border border-border">
                        {occRows.map((p) => (
                          <li key={p.guests} className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="text-foreground">{t?.rooms?.guestsCount(p.guests)}</span>
                            {Number(p.price) > 0 ? (
                              <span className="font-semibold text-accent">{formatMad(Number(p.price), lang)} {t?.common?.mad}<span className="font-normal text-muted-foreground"> {t?.rooms?.perNight}</span></span>
                            ) : (
                              <span className="text-muted-foreground">{lang === 'en' ? 'On request' : 'Sur demande'}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                    room?.available ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${room?.available ? 'bg-green-500' : 'bg-red-500'}`} />
                    {room?.available ? t?.rooms?.available : t?.rooms?.unavailable}
                  </div>
                </div>

                {price > 0 && <PriceNote variant="full" />}

                {/* Meta Info */}
                <div className="space-y-3 border-y border-border py-4">
                  {[
                    { label: t?.rooms?.capacity, value: `${room?.capacity} ${t?.rooms?.persons}` },
                    { label: t?.rooms?.bedType, value: room?.bedType?.[lang] },
                    { label: t?.rooms?.size, value: room && room.size > 0 ? `${room.size} ${t?.rooms?.sqm}` : '' },
                  ]?.filter((x) => x.value)?.map((item, i) => (
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
                  href={`https://wa.me/${waDigits(contact.whatsapp)}?text=${encodeURIComponent(lang === 'en' ? `Hello, I am interested in the ${room?.name?.en || room?.name?.fr}` : `Bonjour, je suis intéressé(e) par la ${room?.name?.fr}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-sm"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />WhatsApp
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