import { supabase } from '@/lib/supabase';

export type GLang = 'fr' | 'en';

export interface GuideWelcome {
  title_fr: string; title_en: string;
  subtitle_fr: string; subtitle_en: string;
  image_url: string;
}
export interface GuidePractical {
  checkin: string;
  checkout: string;
  wifi_name: string;
  wifi_password: string;
  access: { description_fr: string; description_en: string; address: string; maps_url: string };
  parking: { description_fr: string; description_en: string; instructions_fr: string; instructions_en: string };
}
export interface GuideWhatsapp { number: string; message_fr: string; message_en: string }

export interface GuideService {
  id: string;
  name_fr: string; name_en: string;
  description_fr: string; description_en: string;
  price: number | null;
  price_note_fr: string; price_note_en: string;
  image_url: string;
  available: boolean;
  sort_order: number;
}
export interface GuidePlace {
  id: string;
  name_fr: string; name_en: string;
  description_fr: string; description_en: string;
  category_fr: string; category_en: string;
  image_url: string;
  address: string;
  maps_url: string;
  active: boolean;
  sort_order: number;
}

export interface GuideData {
  welcome: GuideWelcome;
  practical: GuidePractical;
  whatsapp: GuideWhatsapp;
  services: GuideService[];
  places: GuidePlace[];
}

export const DEFAULT_WELCOME: GuideWelcome = {
  title_fr: 'Bienvenue au Riad Dar Soufa',
  title_en: 'Welcome to Riad Dar Soufa',
  subtitle_fr: 'Nous sommes ravis de vous accueillir. Retrouvez ici toutes les informations utiles pour votre séjour.',
  subtitle_en: 'We are delighted to welcome you. Find all the useful information for your stay here.',
  image_url: '',
};
export const DEFAULT_PRACTICAL: GuidePractical = {
  checkin: '15:00',
  checkout: '12:00',
  wifi_name: '',
  wifi_password: '',
  access: { description_fr: '', description_en: '', address: '', maps_url: '' },
  parking: { description_fr: '', description_en: '', instructions_fr: '', instructions_en: '' },
};
export const DEFAULT_WHATSAPP: GuideWhatsapp = {
  number: '',
  message_fr: 'Bonjour, je suis client(e) du Riad Dar Soufa et j’ai une question.',
  message_en: 'Hello, I am a guest at Riad Dar Soufa and I have a question.',
};

export const EMPTY_GUIDE: GuideData = {
  welcome: DEFAULT_WELCOME, practical: DEFAULT_PRACTICAL, whatsapp: DEFAULT_WHATSAPP, services: [], places: [],
};

/** Texte dans la langue demandée, avec repli sur l'autre langue si vide. */
export function pick(fr: string, en: string, lang: GLang): string {
  const a = lang === 'fr' ? fr : en;
  const b = lang === 'fr' ? en : fr;
  return (a && a.trim()) || (b && b.trim()) || '';
}

export function mapsLink(url: string, fallbackQuery: string): string {
  if (url && url.trim()) return url.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
}

export function mergeSettings(rows: { key: string; value: unknown }[] | null) {
  const out = { welcome: DEFAULT_WELCOME, practical: DEFAULT_PRACTICAL, whatsapp: DEFAULT_WHATSAPP };
  for (const r of rows || []) {
    const v = (r.value || {}) as Record<string, unknown>;
    if (r.key === 'welcome') out.welcome = { ...DEFAULT_WELCOME, ...(v as Partial<GuideWelcome>) };
    if (r.key === 'whatsapp') out.whatsapp = { ...DEFAULT_WHATSAPP, ...(v as Partial<GuideWhatsapp>) };
    if (r.key === 'practical') {
      const p = v as Partial<GuidePractical>;
      out.practical = {
        ...DEFAULT_PRACTICAL, ...p,
        access: { ...DEFAULT_PRACTICAL.access, ...(p.access || {}) },
        parking: { ...DEFAULT_PRACTICAL.parking, ...(p.parking || {}) },
      };
    }
  }
  return out;
}

export async function loadGuide(): Promise<GuideData | null> {
  const [s, sv, pl] = await Promise.all([
    supabase.from('guide_settings').select('key, value'),
    supabase.from('guide_services').select('*').order('sort_order').order('created_at'),
    supabase.from('guide_places').select('*').order('sort_order').order('created_at'),
  ]);
  if (s.error || sv.error || pl.error) return null;
  return {
    ...mergeSettings(s.data),
    services: (sv.data || []) as GuideService[],
    places: (pl.data || []) as GuidePlace[],
  };
}

export function whatsappHref(number: string, message: string): string {
  const digits = (number || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/* ------------------------------------------------------------------
 * Photos d'exemple (Unsplash, licence gratuite : usage commercial autorisé,
 * sans paiement ni mention obligatoire). Elles s'affichent uniquement tant
 * qu'aucune photo n'a été téléversée depuis l'admin.
 * ------------------------------------------------------------------ */
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;

const PLACE_PHOTOS = {
  hassan: U('1669413558136-eb4de5f4dabc'), // Tour Hassan, Rabat
  kasbah: U('1514911612757-11b536d60be0'), // arche blanche, Rabat
  medina: U('1702840628874-97ed05f0725b'), // rue et remparts, Rabat
  mer: U('1588609715324-78072fc77cee'), // bord de l'eau, Rabat
  monument: U('1597081315272-a8b558ca4e86'), // monument en pierre, Rabat
};
const SERVICE_PHOTOS = {
  patio: U('1539020140153-e479b8c22e70'), // patio avec fontaine
  spa: U('1559925523-10de9e23cf90'), // fontaine intérieure
  souk: U('1580746738099-1cb74f972feb'), // épices du souk
  terrasse: U('1624805098931-098c0d918b34'), // table en terrasse
};

const norm = (s: string) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function examplePlacePhoto(name: string, category: string, index: number): string {
  const t = norm(`${name} ${category}`);
  if (/hassan|mausolee|mohammed v/.test(t)) return PLACE_PHOTOS.hassan;
  if (/oudaya|oudaia|udaya|kasbah/.test(t)) return PLACE_PHOTOS.kasbah;
  if (/medina|souk|marche|market/.test(t)) return PLACE_PHOTOS.medina;
  if (/plage|beach|corniche|mer|ocean|marina|bou regreg|fleuve/.test(t)) return PLACE_PHOTOS.mer;
  if (/chellah|musee|museum|monument|patrimoine|heritage/.test(t)) return PLACE_PHOTOS.monument;
  const all = Object.values(PLACE_PHOTOS);
  return all[index % all.length];
}

export function exampleServicePhoto(name: string, index: number): string {
  const t = norm(name);
  if (/hammam|spa|massage|soin/.test(t)) return SERVICE_PHOTOS.spa;
  if (/transfert|aeroport|airport|navette|taxi/.test(t)) return PLACE_PHOTOS.medina;
  if (/lit |lit$|bebe|chambre/.test(t)) return SERVICE_PHOTOS.patio;
  if (/excursion|visite|tour|guide|shopping|souk/.test(t)) return SERVICE_PHOTOS.souk;
  if (/petit|dejeuner|breakfast|diner|dinner|repas|cuisine|terrasse|the|tea/.test(t)) return SERVICE_PHOTOS.terrasse;
  const all = Object.values(SERVICE_PHOTOS);
  return all[index % all.length];
}
