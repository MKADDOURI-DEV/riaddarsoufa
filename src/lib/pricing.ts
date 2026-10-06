import type { Room, OccupancyPrice } from '@/lib/data';

/**
 * Tarifs directs du Riad Dar Soufa.
 *
 * Les prix saisis dans l'admin sont des prix FINAUX, tout compris :
 * petit-déjeuner, TVA 10 %, taxe communale de séjour et taxe de promotion touristique.
 * Aucun supplément n'est ajouté au moment de la réservation.
 * La ventilation (hébergement HT, TVA, taxes) figure uniquement sur la facture, côté Nozoul.
 */
export const TAXES = {
  /** Taxe communale de séjour, en MAD par personne et par nuit */
  communale: 30,
  /** Taxe de promotion touristique, en MAD par personne et par nuit */
  promotion: 8,
  /** TVA appliquée à l'hébergement */
  tvaPercent: 10,
};

/** Tarifs par nombre de personnes réellement renseignés (prix > 0), triés. */
export function filledOccupancyPrices(room: Room): OccupancyPrice[] {
  return (room.occupancyPrices || [])
    .filter((p) => Number(p.price) > 0 && Number(p.guests) > 0)
    .map((p) => ({ guests: Number(p.guests), price: Number(p.price) }))
    .sort((a, b) => a.guests - b.guests);
}

/** La chambre a-t-elle plusieurs tarifs selon le nombre de personnes ? */
export function hasOccupancyPricing(room: Room): boolean {
  return filledOccupancyPrices(room).length > 0;
}

/** Prix le plus bas affiché (« à partir de »). 0 = aucun prix renseigné. */
export function fromPrice(room: Room): number {
  const occ = filledOccupancyPrices(room);
  if (occ.length) return Math.min(...occ.map((p) => p.price));
  return Number(room.pricePerNight) || 0;
}

/** Prix par nuit pour un nombre de personnes donné. */
export function priceForGuests(room: Room, guests: number): number {
  const occ = filledOccupancyPrices(room);
  if (!occ.length) return Number(room.pricePerNight) || 0;
  // Tarif correspondant exactement, sinon le palier supérieur le plus proche, sinon le plus haut
  const exact = occ.find((p) => p.guests === guests);
  if (exact) return exact.price;
  const above = occ.find((p) => p.guests > guests);
  return (above || occ[occ.length - 1]).price;
}

export function formatMad(n: number, lang: string): string {
  return n.toLocaleString(lang === 'en' ? 'en-GB' : 'fr-FR');
}

/** Textes de la mention « tarif tout compris ». */
export const PRICE_NOTE = {
  fr: {
    short: 'Tout compris : petit-déjeuner, TVA et taxes',
    title: 'Tarif final tout compris',
    lines: [
      'Petit-déjeuner inclus',
      `TVA ${TAXES.tvaPercent} % incluse`,
      `Taxe communale de séjour incluse (${TAXES.communale} MAD / personne / nuit)`,
      `Taxe de promotion touristique incluse (${TAXES.promotion} MAD / personne / nuit)`,
    ],
    noExtra: 'Aucun supplément ajouté lors de la réservation. Le détail des taxes figure sur votre facture.',
  },
  en: {
    short: 'All inclusive: breakfast, VAT and taxes',
    title: 'Final all-inclusive rate',
    lines: [
      'Breakfast included',
      `${TAXES.tvaPercent}% VAT included`,
      `City tourist tax included (MAD ${TAXES.communale} / person / night)`,
      `Tourism promotion tax included (MAD ${TAXES.promotion} / person / night)`,
    ],
    noExtra: 'No extra charge added at booking. The tax breakdown appears on your invoice.',
  },
};

export function priceNote(lang: string) {
  return lang === 'en' ? PRICE_NOTE.en : PRICE_NOTE.fr;
}
