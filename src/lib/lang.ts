/**
 * Langues du site : français et anglais.
 *
 * Choix de la langue, dans l'ordre : ?lang=en dans l'adresse, puis le dernier
 * choix du visiteur (mémorisé dans le navigateur), puis la langue du
 * navigateur, sinon le français.
 */
export type SiteLang = 'fr' | 'en';

export const SITE_LANGS: SiteLang[] = ['fr', 'en'];
export const DEFAULT_LANG: SiteLang = 'fr';
const STORAGE_KEY = 'rds-lang';

export function isSiteLang(v: unknown): v is SiteLang {
  return typeof v === 'string' && (SITE_LANGS as string[]).includes(v);
}

export function detectLang(): SiteLang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isSiteLang(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isSiteLang(saved)) return saved;
  } catch {
    /* navigation privée */
  }
  const nav = (navigator.language || '').slice(0, 2).toLowerCase();
  // Visiteurs francophones et arabophones : français ; les autres : anglais
  return nav === 'fr' || nav === 'ar' ? 'fr' : 'en';
}

export function storeLang(lang: SiteLang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* navigation privée */
  }
  // Garde ?lang= à jour quand il figure dans l'adresse (liens partagés)
  const url = new URL(window.location.href);
  if (url.searchParams.has('lang')) {
    url.searchParams.set('lang', lang);
    window.history.replaceState(window.history.state, '', url);
  }
}

/** Texte vide en anglais (contenu saisi seulement en français dans l'admin) : on affiche le français. */
export function withFallback<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => withFallback(v)) as unknown as T;
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if (typeof o.fr === 'string' && 'en' in o) {
      const en = typeof o.en === 'string' ? o.en.trim() : '';
      return (en ? value : { ...o, en: o.fr }) as T;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) out[k] = withFallback(v);
    return out as T;
  }
  return value;
}
