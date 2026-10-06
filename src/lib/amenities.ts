import {
  BedDouble, Bed, Snowflake, Heater, Fan, Wifi, Bath, ShowerHead, Wind, Sparkles, Shirt,
  Tv, Lock, Coffee, Refrigerator, Flower2, Sun, Armchair, Baby, type LucideIcon,
} from 'lucide-react';

/**
 * Catalogue des équipements des chambres.
 * Dans l'admin, le propriétaire coche les équipements de chaque chambre ;
 * le site les affiche avec leur icône, en français et en anglais.
 */
export interface Amenity {
  key: string;
  icon: LucideIcon;
  fr: string;
  en: string;
}

export const AMENITIES: Amenity[] = [
  { key: 'lit-double', icon: BedDouble, fr: 'Lit double', en: 'Double bed' },
  { key: 'lits-simples', icon: Bed, fr: 'Lits simples', en: 'Single beds' },
  { key: 'climatisation', icon: Snowflake, fr: 'Climatisation', en: 'Air conditioning' },
  { key: 'chauffage', icon: Heater, fr: 'Chauffage', en: 'Heating' },
  { key: 'ventilateur', icon: Fan, fr: 'Ventilateur', en: 'Fan' },
  { key: 'wifi', icon: Wifi, fr: 'Wi-Fi gratuit', en: 'Free Wi-Fi' },
  { key: 'salle-de-bain', icon: Bath, fr: 'Salle de bain privée', en: 'Private bathroom' },
  { key: 'douche', icon: ShowerHead, fr: 'Douche', en: 'Shower' },
  { key: 'seche-cheveux', icon: Wind, fr: 'Sèche-cheveux', en: 'Hair dryer' },
  { key: 'produits-accueil', icon: Sparkles, fr: 'Produits d’accueil', en: 'Toiletries' },
  { key: 'linge', icon: Shirt, fr: 'Linge de toilette et peignoirs', en: 'Towels and bathrobes' },
  { key: 'television', icon: Tv, fr: 'Télévision', en: 'Television' },
  { key: 'coffre-fort', icon: Lock, fr: 'Coffre-fort', en: 'Safe' },
  { key: 'the-cafe', icon: Coffee, fr: 'Plateau thé et café', en: 'Tea and coffee tray' },
  { key: 'mini-refrigerateur', icon: Refrigerator, fr: 'Mini-réfrigérateur', en: 'Mini fridge' },
  { key: 'vue-patio', icon: Flower2, fr: 'Vue sur le patio', en: 'Patio view' },
  { key: 'acces-terrasse', icon: Sun, fr: 'Accès à la terrasse', en: 'Terrace access' },
  { key: 'coin-salon', icon: Armchair, fr: 'Coin salon', en: 'Seating area' },
  { key: 'lit-bebe', icon: Baby, fr: 'Lit bébé sur demande', en: 'Baby cot on request' },
];

const BY_KEY = new Map(AMENITIES.map((a) => [a.key, a]));

/** Équipements cochés pour une chambre, dans l'ordre du catalogue. */
export function roomAmenities(keys: string[] | undefined): Amenity[] {
  if (!keys?.length) return [];
  const set = new Set(keys);
  return AMENITIES.filter((a) => set.has(a.key) && BY_KEY.has(a.key));
}
