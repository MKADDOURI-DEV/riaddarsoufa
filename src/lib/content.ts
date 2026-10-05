import { supabase } from '@/lib/supabase';
import { ROOMS, SERVICES, SITE_CONFIG, Room, Service, ContactInfo } from '@/lib/data';
import { exampleServicePhoto } from '@/lib/guide';

export const DEFAULT_CONTACT: ContactInfo = {
  address: SITE_CONFIG.address,
  phone: SITE_CONFIG.phone,
  whatsapp: SITE_CONFIG.whatsappNumber,
  email: SITE_CONFIG.email,
  googleMapsUrl: SITE_CONFIG.googleMapsUrl,
  instagram: SITE_CONFIG.instagram,
  facebook: SITE_CONFIG.facebook,
};

/** Clés de stockage existantes dans la base (la base n'accepte que ces clés). */
export const ROOMS_KEY = 'rooms';
export const SERVICES_KEY = 'services';
/** Version du contenu : l'ancienne liste (chambres et services d'avant octobre 2026) est ignorée. */
export const CONTENT_VERSION = 2;

/** Format enregistré : { version: 2, items: [...] }. */
export function wrapItems(items: unknown[]) {
  return { version: CONTENT_VERSION, items };
}
function unwrapItems(value: unknown): unknown[] | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const v = value as { version?: number; items?: unknown };
    if (v.version === CONTENT_VERSION && Array.isArray(v.items)) return v.items;
  }
  return null; // ancien format (simple liste) : ignoré, les valeurs par défaut s'appliquent
}

export type StoredService = Pick<Service, 'id' | 'name' | 'description' | 'available'> & { icon?: string; images?: string[]; /** ancien champ (une seule photo) */ image?: string };

/** Services de base (mise en page fixe) : ils ne peuvent pas être supprimés, seulement modifiés. */
export const BASE_SERVICE_IDS = new Set(SERVICES.map((s) => s.id));

export interface SiteContent {
  rooms: Room[];
  services: Service[];
  contact: ContactInfo;
}

/** Photos de départ d'un service : photo d'exemple tant que l'admin n'a jamais enregistré de photos pour lui.
 *  Elles apparaissent dans l'admin comme des photos normales : on peut les retirer ou en ajouter d'autres. */
function startPhotos(images: unknown, legacy: string | undefined, name: string, index: number): string[] {
  if (Array.isArray(images)) return images.filter((x): x is string => typeof x === 'string' && !!x);
  if (legacy) return [legacy];
  return [exampleServicePhoto(name, index)];
}

export const DEFAULT_CONTENT: SiteContent = {
  rooms: ROOMS,
  services: SERVICES.map((s, i) => ({ ...s, images: startPhotos(s.images, undefined, s.name.fr, i) })),
  contact: DEFAULT_CONTACT,
};

/** Fusionne le contenu stocké (base de données) avec les valeurs par défaut du code. */
export function mergeContent(rows: { key: string; value: unknown }[] | null): SiteContent {
  const result: SiteContent = {
    rooms: DEFAULT_CONTENT.rooms,
    services: DEFAULT_CONTENT.services,
    contact: DEFAULT_CONTENT.contact,
  };
  if (!rows) return result;

  for (const row of rows) {
    const items = row.key === ROOMS_KEY || row.key === SERVICES_KEY ? unwrapItems(row.value) : null;
    if (row.key === ROOMS_KEY && items && items.length > 0) {
      result.rooms = items as Room[];
    }
    if (row.key === SERVICES_KEY && items) {
      const stored = items as StoredService[];
      result.services = stored.map((x, idx) => {
        const def = DEFAULT_CONTENT.services.find((d) => d.id === x.id);
        return {
          id: x.id,
          icon: x.icon || def?.icon || 'SparklesIcon',
          name: x.name,
          description: x.description,
          available: x.available,
          images: startPhotos(x.images, x.image, x.name?.fr || x.name?.en || '', idx),
        } as Service;
      });
    }
    if (row.key === 'contact' && row.value && typeof row.value === 'object') {
      const c = row.value as Partial<ContactInfo>;
      result.contact = {
        ...DEFAULT_CONTENT.contact,
        ...c,
        address: { ...DEFAULT_CONTENT.contact.address, ...(c.address || {}) },
      };
    }
  }
  return result;
}

export async function loadContentRows() {
  const { data, error } = await supabase.from('site_content').select('key, value');
  if (error) return null;
  return data as { key: string; value: unknown }[];
}

/** "+212537000000" -> "+212 537 000 000" */
export function formatPhone(raw: string): string {
  const d = (raw || '').replace(/\D/g, '');
  if (d.startsWith('212') && d.length === 12) {
    return `+212 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
  }
  return raw;
}

/** Numéro pour wa.me : chiffres uniquement */
export function waDigits(raw: string): string {
  return (raw || '').replace(/\D/g, '');
}

export function telHref(raw: string): string {
  return `tel:+${waDigits(raw)}`;
}
