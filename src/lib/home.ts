/**
 * Textes de la page d'accueil modifiables depuis l'admin (onglet « Accueil »).
 * Enregistrés dans la ligne « contact » de site_content (champ home), la base n'acceptant que les clés existantes.
 */
import type { Bi } from '@/lib/riad';

export interface HomePoint { title: Bi; text: Bi }
export interface HomeContent {
  heroSubtitle: Bi;
  direct: { label: Bi; title: Bi; text: Bi; cta: Bi; points: HomePoint[] };
}

export const DEFAULT_HOME: HomeContent = {
  heroSubtitle: {
    fr: 'Une expérience authentique au cœur de la médina de Rabat',
    en: 'An authentic experience in the heart of Rabat’s medina',
  },
  direct: {
    label: { fr: 'Réservation directe', en: 'Direct booking' },
    title: { fr: 'Meilleurs tarifs en réservant en direct', en: 'Best rates when booking directly' },
    text: {
      fr: 'Réservez sur notre site : vous payez le tarif le plus avantageux, sans intermédiaire.',
      en: 'Book on our website: you get the most favourable rate, with no middleman.',
    },
    cta: { fr: 'Réserver au meilleur tarif', en: 'Book at the best rate' },
    points: [
      { title: { fr: 'Tarif direct le plus bas', en: 'Lowest direct rate' }, text: { fr: 'Plus avantageux que sur les plateformes de réservation.', en: 'Better value than on booking platforms.' } },
      { title: { fr: 'Petit-déjeuner inclus', en: 'Breakfast included' }, text: { fr: 'Servi chaque matin au riad, compris dans le prix.', en: 'Served every morning at the riad, included in the price.' } },
      { title: { fr: 'Prix final tout compris', en: 'Final all-inclusive price' }, text: { fr: 'TVA et taxes de séjour incluses, aucun supplément à la réservation.', en: 'VAT and tourist taxes included, no extra charge at booking.' } },
      { title: { fr: 'Contact direct avec le riad', en: 'Direct contact with the riad' }, text: { fr: 'Une question ? Notre équipe vous répond directement.', en: 'Any question? Our team answers you directly.' } },
    ],
  },
};

function bi(v: unknown, def: Bi): Bi {
  if (v && typeof v === 'object') {
    const o = v as Partial<Bi>;
    return { fr: typeof o.fr === 'string' ? o.fr : def.fr, en: typeof o.en === 'string' ? o.en : def.en };
  }
  return def;
}

/** Fusionne le contenu enregistré avec les valeurs par défaut (les 4 cartes gardent toujours leur nombre). */
export function mergeHome(stored: unknown): HomeContent {
  if (!stored || typeof stored !== 'object') return DEFAULT_HOME;
  const s = stored as { heroSubtitle?: unknown; direct?: Record<string, unknown> };
  const d = s.direct && typeof s.direct === 'object' ? s.direct : {};
  const pts = Array.isArray(d.points) ? (d.points as Partial<HomePoint>[]) : [];
  const D = DEFAULT_HOME.direct;
  return {
    heroSubtitle: bi(s.heroSubtitle, DEFAULT_HOME.heroSubtitle),
    direct: {
      label: bi(d.label, D.label),
      title: bi(d.title, D.title),
      text: bi(d.text, D.text),
      cta: bi(d.cta, D.cta),
      points: D.points.map((p, i) => ({ title: bi(pts[i]?.title, p.title), text: bi(pts[i]?.text, p.text) })),
    },
  };
}
