/**
 * Connexion au moteur de réservation Nozoul du Riad Dar Soufa.
 *
 * Le client saisit ses dates et ses voyageurs sur le site, puis il est envoyé
 * sur le moteur Nozoul avec ces informations dans l'adresse, pour ne pas avoir
 * à les ressaisir.
 *
 * NOMS DES PARAMÈTRES : si le moteur Nozoul attend d'autres noms
 * (ex. « arrival » au lieu de « checkIn »), il suffit de les changer ici.
 */
export const NOZOUL_BOOKING_URL =
  'https://dar-soufa.nozoul.ma/#/be/0dc0d11c-96e3-4523-aa45-2307da0abfc6/book';

export const NOZOUL_PARAMS = {
  checkIn: 'checkIn',
  checkOut: 'checkOut',
  adults: 'adults',
  children: 'children',
  childrenAges: 'childrenAges',
} as const;

export const MAX_ADULTS = 8;
export const MAX_CHILDREN = 6;
export const MAX_CHILD_AGE = 17;

export interface StaySearch {
  checkIn: string; // AAAA-MM-JJ
  checkOut: string; // AAAA-MM-JJ
  adults: number;
  children: number;
  childrenAges: number[];
}

/** Adresse du moteur Nozoul avec les informations du client pré-remplies. */
export function buildNozoulUrl(s: StaySearch): string {
  const q = new URLSearchParams();
  if (s.checkIn) q.set(NOZOUL_PARAMS.checkIn, s.checkIn);
  if (s.checkOut) q.set(NOZOUL_PARAMS.checkOut, s.checkOut);
  q.set(NOZOUL_PARAMS.adults, String(s.adults));
  q.set(NOZOUL_PARAMS.children, String(s.children));
  if (s.children > 0) {
    q.set(NOZOUL_PARAMS.childrenAges, s.childrenAges.slice(0, s.children).join(','));
  }
  // Route « hash » : les paramètres se placent après la route du moteur.
  return `${NOZOUL_BOOKING_URL}?${q.toString()}`;
}

/** Date du jour + n jours, au format AAAA-MM-JJ (heure locale). */
export function isoDate(offsetDays = 0, from?: string): string {
  const d = from ? new Date(`${from}T12:00:00`) : new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function nightsBetween(a: string, b: string): number {
  if (!a || !b) return 0;
  const diff = new Date(`${b}T12:00:00`).getTime() - new Date(`${a}T12:00:00`).getTime();
  return Math.max(0, Math.round(diff / 86400000));
}
