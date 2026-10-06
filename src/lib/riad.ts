/**
 * Contenu de la page « Le Riad » : présentation de la maison et des espaces communs.
 *
 * Modifiable depuis l'admin (onglet « Le Riad »). Le contenu est enregistré dans la ligne
 * « contact » de la table site_content (champ riad), la base n'acceptant que les clés existantes.
 */
export type Bi = { fr: string; en: string };

export interface RiadSection {
  id: string;
  title: Bi;
  text: Bi;
  /** Photos téléversées depuis l'admin (la première est la photo principale). */
  images: string[];
}

export interface RiadContent {
  intro: { title: Bi; text: Bi; image: string };
  sections: RiadSection[];
}

export const DEFAULT_RIAD: RiadContent = {
  intro: {
    title: {
      fr: 'Une maison traditionnelle au cœur de la médina',
      en: 'A traditional house in the heart of the medina',
    },
    text: {
      fr: 'Le Riad Dar Soufa est une demeure traditionnelle de la médina de Rabat. Au-delà des chambres, nos hôtes profitent de toute la maison : le patio, les salons et les terrasses, dans un cadre où l’architecture marocaine est préservée.',
      en: 'Riad Dar Soufa is a traditional house in the medina of Rabat. Beyond the rooms, our guests enjoy the whole house: the patio, the lounges and the terraces, in a setting where Moroccan architecture has been preserved.',
    },
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_11c05f051-1772250211690.png',
  },
  sections: [
    {
      id: 'patio',
      title: { fr: 'Le patio', en: 'The patio' },
      text: {
        fr: 'Cœur de la maison, le patio distribue les pièces autour d’un espace ouvert sur le ciel. Un lieu de calme et de lumière, où l’on aime se poser au retour de la médina.',
        en: 'The heart of the house, the patio gathers the rooms around a space open to the sky. A place of calm and light, perfect for unwinding after a day in the medina.',
      },
      images: [],
    },
    {
      id: 'salons',
      title: { fr: 'Les salons', en: 'The lounges' },
      text: {
        fr: 'Des salons marocains pour lire, se reposer ou partager un moment, à toute heure de la journée.',
        en: 'Moroccan lounges to read, rest or share a moment, at any time of the day.',
      },
      images: [],
    },
    {
      id: 'terrasses',
      title: { fr: 'Les terrasses', en: 'The terraces' },
      text: {
        fr: 'Les terrasses offrent un espace en plein air au-dessus de la médina, idéal en fin de journée.',
        en: 'The terraces offer an open-air space above the medina, ideal at the end of the day.',
      },
      images: [],
    },
    {
      id: 'details',
      title: { fr: 'L’artisanat marocain', en: 'Moroccan craftsmanship' },
      text: {
        fr: 'Zellige, bois de cèdre et détails architecturaux traditionnels : chaque élément témoigne du savoir-faire des artisans marocains.',
        en: 'Zellige tilework, cedar wood and traditional architectural details: each element reflects the skill of Moroccan craftsmen.',
      },
      images: [],
    },
  ],
};

function bi(v: unknown, def: Bi): Bi {
  if (v && typeof v === 'object') {
    const o = v as Partial<Bi>;
    return { fr: typeof o.fr === 'string' ? o.fr : def.fr, en: typeof o.en === 'string' ? o.en : def.en };
  }
  return def;
}
const EMPTY: Bi = { fr: '', en: '' };

/** Fusionne le contenu enregistré avec les valeurs par défaut. */
export function mergeRiad(stored: unknown): RiadContent {
  if (!stored || typeof stored !== 'object') return DEFAULT_RIAD;
  const s = stored as Partial<RiadContent>;
  const intro = s.intro && typeof s.intro === 'object' ? s.intro : DEFAULT_RIAD.intro;
  const sections = Array.isArray(s.sections) ? s.sections : DEFAULT_RIAD.sections;
  return {
    intro: {
      title: bi(intro.title, DEFAULT_RIAD.intro.title),
      text: bi(intro.text, DEFAULT_RIAD.intro.text),
      image: typeof intro.image === 'string' ? intro.image : DEFAULT_RIAD.intro.image,
    },
    sections: sections.map((x, i) => {
      const def = DEFAULT_RIAD.sections.find((d) => d.id === x?.id);
      return {
        id: String(x?.id || `section-${i}`),
        title: bi(x?.title, def?.title || EMPTY),
        text: bi(x?.text, def?.text || EMPTY),
        images: Array.isArray(x?.images) ? x.images.filter((u): u is string => typeof u === 'string' && !!u) : [],
      };
    }),
  };
}

export function biText(v: Bi, lang: string): string {
  return lang === 'en' ? v.en || v.fr : v.fr;
}
