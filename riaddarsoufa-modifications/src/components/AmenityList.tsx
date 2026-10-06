'use client';
import React from 'react';
import { useSite } from '@/context/SiteContext';
import { roomAmenities } from '@/lib/amenities';
import type { Room } from '@/lib/data';
import { CheckIcon } from '@heroicons/react/24/outline';

/**
 * Équipements d'une chambre avec icônes.
 * - compact : rangée d'icônes (cartes chambres), le nom apparaît au survol
 * - sinon  : grille icône + libellé (fiche chambre)
 * Les anciens équipements saisis en texte libre restent affichés (coche).
 */
export default function AmenityList({ room, compact = false, max = 6 }: { room: Room; compact?: boolean; max?: number }) {
  const { lang } = useSite();
  const items = roomAmenities(room.amenityKeys);
  const legacy = room.amenities || [];
  const label = (a: { fr: string; en: string }) => (lang === 'en' ? a.en || a.fr : a.fr);

  if (compact) {
    if (!items.length) return null;
    const shown = items.slice(0, max);
    const rest = items.length - shown.length;
    return (
      <ul className="flex flex-wrap items-center gap-2" aria-label={lang === 'en' ? 'Amenities' : 'Équipements'}>
        {shown.map((a) => {
          const Icon = a.icon;
          return (
            <li key={a.key} title={label(a)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.6} />
              <span className="sr-only">{label(a)}</span>
            </li>
          );
        })}
        {rest > 0 && <li className="text-xs font-semibold text-muted-foreground">+{rest}</li>}
      </ul>
    );
  }

  if (!items.length && !legacy.length) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => {
        const Icon = a.icon;
        return (
          <div key={a.key} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-foreground">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.6} />
            </span>
            {label(a)}
          </div>
        );
      })}
      {legacy.filter((a) => a?.fr || a?.en).map((a, i) => (
        <div key={`l${i}`} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-foreground">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-primary">
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          {label(a)}
        </div>
      ))}
    </div>
  );
}
