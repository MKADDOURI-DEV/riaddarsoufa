'use client';
import React from 'react';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useSite } from '@/context/SiteContext';
import { priceNote } from '@/lib/pricing';

/**
 * Mention « tarif tout compris » (petit-déjeuner, TVA 10 %, taxe communale, taxe de promotion touristique).
 * - variant="short" : une ligne sous un prix
 * - variant="full"  : encadré détaillé (fiche chambre, page réservation)
 */
export default function PriceNote({ variant = 'short', className = '' }: { variant?: 'short' | 'full'; className?: string }) {
  const { lang } = useSite();
  const n = priceNote(lang);

  if (variant === 'short') {
    return (
      <p className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
        <CheckCircleIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        {n.short}
      </p>
    );
  }

  return (
    <div className={`rounded-xl border border-border bg-muted/50 p-4 ${className}`}>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <InformationCircleIcon className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        {n.title}
      </p>
      <ul className="space-y-1.5">
        {n.lines.map((l) => (
          <li key={l} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircleIcon className="mt-px h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {l}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">{n.noExtra}</p>
    </div>
  );
}
