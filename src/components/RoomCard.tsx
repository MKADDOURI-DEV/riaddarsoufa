'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { Room } from '@/lib/data';
import { useSite } from '@/context/SiteContext';
import { UserIcon, Squares2X2Icon, HomeModernIcon } from '@heroicons/react/24/outline';

interface RoomCardProps {
  room: Room;
  featured?: boolean;
}

export default function RoomCard({ room, featured = false }: RoomCardProps) {
  const { t, lang, dir } = useSite();

  return (
    <div
      dir={dir}
      className={`room-card-hover bg-card rounded-2xl overflow-hidden border border-border group ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Image */}
      <div className={`img-hover relative overflow-hidden ${featured ? 'h-72 lg:h-80' : 'h-56'}`}>
        <AppImage
          src={room.images[0]}
          alt={`${room.name[lang]} — chambre du Riad Dar Soufa, Rabat`}
          fill
          className="object-cover"
          sizes={featured ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        {/* Tag */}
        {room.tag && (
          <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
            {room.tag[lang]}
          </span>
        )}
        {/* Availability */}
        {!room.available && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="bg-card text-foreground text-sm font-bold px-4 py-2 rounded-full">
              {t.rooms.unavailable}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg text-foreground leading-tight">{room.name[lang]}</h3>
          <div className="text-right flex-shrink-0">
            <span className="text-accent font-bold text-lg">{room.pricePerNight.toLocaleString()}</span>
            <span className="text-muted-foreground text-xs"> {t.common.mad}{t.rooms.perNight}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{room.shortDesc[lang]}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" aria-hidden="true" /> {room.capacity} {t.rooms.persons}
          </span>
          <span className="flex items-center gap-1">
            <Squares2X2Icon className="h-4 w-4" aria-hidden="true" /> {room.size} {t.rooms.sqm}
          </span>
          <span className="flex items-center gap-1">
            <HomeModernIcon className="h-4 w-4" aria-hidden="true" /> {room.bedType[lang]}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href={`/room-detail?slug=${room.slug}`}
            className="btn-secondary flex-1 text-sm py-2.5"
          >
            {t.rooms.viewRoom}
          </Link>
          {room.available && (
            <Link
              href={`/booking?room=${room.slug}`}
              className="btn-primary flex-1 text-sm py-2.5"
            >
              {t.rooms.bookRoom}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}