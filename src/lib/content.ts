import { supabase } from '@/lib/supabase';
import { ROOMS, SERVICES, SITE_CONFIG, Room, Service, ContactInfo } from '@/lib/data';

export const DEFAULT_CONTACT: ContactInfo = {
  address: SITE_CONFIG.address,
  phone: SITE_CONFIG.phone,
  whatsapp: SITE_CONFIG.whatsappNumber,
  email: SITE_CONFIG.email,
  googleMapsUrl: SITE_CONFIG.googleMapsUrl,
  instagram: SITE_CONFIG.instagram,
  facebook: SITE_CONFIG.facebook,
};

export type StoredService = Pick<Service, 'id' | 'name' | 'description' | 'available'> & { icon?: string };

/** Services de base (mise en page fixe) : ils ne peuvent pas être supprimés, seulement modifiés. */
export const BASE_SERVICE_IDS = new Set(SERVICES.map((s) => s.id));

export interface SiteContent {
  rooms: Room[];
  services: Service[];
  contact: ContactInfo;
}

export const DEFAULT_CONTENT: SiteContent = {
  rooms: ROOMS,
  services: SERVICES,
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
    if (row.key === 'rooms' && Array.isArray(row.value) && row.value.length > 0) {
      result.rooms = row.value as Room[];
    }
    if (row.key === 'services' && Array.isArray(row.value)) {
      const stored = row.value as StoredService[];
      const base = DEFAULT_CONTENT.services.map((def) => {
        const s = stored.find((x) => x.id === def.id);
        return s ? { ...def, name: s.name, description: s.description, available: s.available } : def;
      });
      // Services ajoutés par le propriétaire (affichés après les services de base)
      const extras: Service[] = stored
        .filter((x) => !BASE_SERVICE_IDS.has(x.id))
        .map((x) => ({ id: x.id, icon: x.icon || 'SparklesIcon', name: x.name, description: x.description, available: x.available }));
      result.services = [...base, ...extras];
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
