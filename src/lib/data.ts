export type Language = 'fr' | 'en' | 'ar';

export interface Room {
  id: string;
  slug: string;
  name: { fr: string; en: string; ar: string };
  description: { fr: string; en: string; ar: string };
  shortDesc: { fr: string; en: string; ar: string };
  capacity: number;
  bedType: { fr: string; en: string; ar: string };
  size: number;
  pricePerNight: number;
  images: string[];
  amenities: { fr: string; en: string; ar: string }[];
  /** Équipements affichés avec une icône (clés du catalogue, voir src/lib/amenities.ts). */
  amenityKeys?: string[];
  /** Tarifs selon le nombre de personnes (ex. chambre Patio : 2, 3 et 4 personnes). Vide = tarif unique. */
  occupancyPrices?: OccupancyPrice[];
  available: boolean;
  tag?: { fr: string; en: string; ar: string };
}

export interface OccupancyPrice {
  guests: number;
  /** Tarif par nuit, tout compris (MAD). 0 = non renseigné. */
  price: number;
}

export interface Service {
  id: string;
  icon: string;
  name: { fr: string; en: string; ar: string };
  description: { fr: string; en: string; ar: string };
  available: boolean;
  colSpan?: number;
  /** Photos téléversées depuis l'admin (la première est la photo principale). */
  images?: string[];
}

export interface ContactInfo {
  address: { fr: string; en: string; ar: string };
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  instagram: string;
  facebook: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: { fr: string; en: string; ar: string };
  rating: number;
  text: { fr: string; en: string; ar: string };
  date: string;
}

export const SITE_CONFIG = {
  name: 'Riad Dar Soufa',
  tagline: {
    fr: 'Une expérience authentique au cœur de la médina de Rabat',
    en: 'An authentic experience in the heart of Rabat\'s medina',
    ar: 'تجربة أصيلة في قلب مدينة الرباط العتيقة',
  },
  whatsappNumber: '+212600000000',
  phone: '+212537000000',
  email: 'contact@riaddarsofa.ma',
  address: {
    fr: '7 impasse Souaf, Legza, Av. Mohamed V, Médina, 10000 Rabat, Maroc',
    en: '7 Impasse Souaf, Legza, Av. Mohamed V, Medina, 10000 Rabat, Morocco',
    ar: '7 زنقة سواف، الكزة، شارع محمد الخامس، المدينة العتيقة، 10000 الرباط، المغرب',
  },
  googleMapsUrl: 'https://maps.google.com/?q=7+impasse+Souaf+Legza+Medina+10000+Rabat+Maroc',
  instagram: 'https://instagram.com/riaddarsofa',
  facebook: 'https://facebook.com/riaddarsofa',
};

// Chambres par défaut : tout est modifiable depuis l'admin (noms, textes, prix, photos).
// Prix et surface à 0 = non affichés (« Tarif selon les dates ») tant qu'ils ne sont pas renseignés dans l'admin.
export const ROOMS: Room[] = [
  {
    id: 'ch-soufa',
    slug: 'chambre-soufa',
    name: { fr: 'Chambre double Soufa', en: 'Soufa Double Room', ar: 'Chambre double Soufa' },
    shortDesc: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    description: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    capacity: 2,
    bedType: { fr: 'Lit double', en: 'Double bed', ar: 'Lit double' },
    size: 0,
    pricePerNight: 0,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop'],
    amenities: [],
    available: true,
  },
  {
    id: 'ch-patio',
    slug: 'chambre-patio',
    name: { fr: 'Chambre quadruple Patio', en: 'Patio Quadruple Room', ar: 'Chambre quadruple Patio' },
    shortDesc: { fr: 'Chambre quadruple pour quatre personnes, au cœur du riad.', en: 'Quadruple room for four guests, at the heart of the riad.', ar: 'Chambre quadruple pour quatre personnes, au cœur du riad.' },
    description: { fr: 'Chambre quadruple pour quatre personnes, au cœur du riad.', en: 'Quadruple room for four guests, at the heart of the riad.', ar: 'Chambre quadruple pour quatre personnes, au cœur du riad.' },
    capacity: 4,
    bedType: { fr: '4 personnes', en: '4 guests', ar: '4 personnes' },
    size: 0,
    pricePerNight: 0,
    occupancyPrices: [{ guests: 2, price: 0 }, { guests: 3, price: 0 }, { guests: 4, price: 0 }],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop'],
    amenities: [],
    available: true,
  },
  {
    id: 'ch-zellige',
    slug: 'chambre-zellige',
    name: { fr: 'Chambre double Zellige', en: 'Zellige Double Room', ar: 'Chambre double Zellige' },
    shortDesc: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    description: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    capacity: 2,
    bedType: { fr: 'Lit double', en: 'Double bed', ar: 'Lit double' },
    size: 0,
    pricePerNight: 0,
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop'],
    amenities: [],
    available: true,
  },
  {
    id: 'ch-hadid',
    slug: 'chambre-hadid',
    name: { fr: 'Chambre double Hadid', en: 'Hadid Double Room', ar: 'Chambre double Hadid' },
    shortDesc: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    description: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    capacity: 2,
    bedType: { fr: 'Lit double', en: 'Double bed', ar: 'Lit double' },
    size: 0,
    pricePerNight: 0,
    images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop'],
    amenities: [],
    available: true,
  },
  {
    id: 'ch-zerka',
    slug: 'chambre-zerka',
    name: { fr: 'Chambre double Zerka', en: 'Zerka Double Room', ar: 'Chambre double Zerka' },
    shortDesc: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    description: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    capacity: 2,
    bedType: { fr: 'Lit double', en: 'Double bed', ar: 'Lit double' },
    size: 0,
    pricePerNight: 0,
    images: ['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1596701062351-8ac031d7a7b4?q=80&w=1200&auto=format&fit=crop'],
    amenities: [],
    available: true,
  },
  {
    id: 'ch-terrasse',
    slug: 'chambre-terrasse',
    name: { fr: 'Chambre double Terrasse', en: 'Terrace Double Room', ar: 'Chambre double Terrasse' },
    shortDesc: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    description: { fr: 'Chambre double au cœur du riad.', en: 'Double room at the heart of the riad.', ar: 'Chambre double au cœur du riad.' },
    capacity: 2,
    bedType: { fr: 'Lit double', en: 'Double bed', ar: 'Lit double' },
    size: 0,
    pricePerNight: 0,
    images: ['https://images.unsplash.com/photo-1631049421450-348ccd7f8949?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop'],
    amenities: [],
    available: true,
  },
];

// Services par défaut : modifiables depuis l'admin (textes, prix, photos).
export const SERVICES: Service[] = [
  {
    id: 'petit-dejeuner',
    icon: 'SunIcon',
    name: { fr: 'Petit-déjeuner', en: 'Breakfast', ar: 'Petit-déjeuner' },
    description: { fr: 'Petit-déjeuner servi au riad.', en: 'Breakfast served at the riad.', ar: 'Petit-déjeuner servi au riad.' },
    available: true,
  },
  {
    id: 'diner',
    icon: 'CakeIcon',
    name: { fr: 'Dîner maison d’hôtes', en: 'Home-cooked dinner', ar: 'Dîner maison d’hôtes' },
    description: { fr: '220 MAD par personne.', en: '220 MAD per person.', ar: '220 MAD par personne.' },
    available: true,
  },
  {
    id: 'lit-supplementaire',
    icon: 'HomeModernIcon',
    name: { fr: 'Lit supplémentaire', en: 'Extra bed', ar: 'Lit supplémentaire' },
    description: { fr: '250 MAD.', en: '250 MAD.', ar: '250 MAD.' },
    available: true,
  },
  {
    id: 'lit-bebe',
    icon: 'HeartIcon',
    name: { fr: 'Lit bébé', en: 'Baby cot', ar: 'Lit bébé' },
    description: { fr: 'Gratuit jusqu’à 3 ans.', en: 'Free for children under 3.', ar: 'Gratuit jusqu’à 3 ans.' },
    available: true,
  },
  {
    id: 'transfert-arrivee',
    icon: 'TruckIcon',
    name: { fr: 'Transfert aéroport Salé → Riad', en: 'Transfer Rabat-Salé airport → Riad', ar: 'Transfert aéroport Salé → Riad' },
    description: { fr: '200 MAD.', en: '200 MAD.', ar: '200 MAD.' },
    available: true,
  },
  {
    id: 'transfert-depart',
    icon: 'TruckIcon',
    name: { fr: 'Transfert Riad → aéroport Salé', en: 'Transfer Riad → Rabat-Salé airport', ar: 'Transfert Riad → aéroport Salé' },
    description: { fr: '200 MAD.', en: '200 MAD.', ar: '200 MAD.' },
    available: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sophie Marchand',
    location: { fr: 'Paris, France', en: 'Paris, France', ar: 'باريس، فرنسا' },
    rating: 5,
    text: {
      fr: 'Un séjour absolument magique. Le riad est d\'une beauté rare, l\'accueil chaleureux et le petit-déjeuner sur le patio parmi les orangers était une expérience inoubliable. Je recommande vivement.',
      en: 'An absolutely magical stay. The riad is of rare beauty, the welcome is warm and breakfast on the patio among the orange trees was an unforgettable experience. Highly recommended.',
      ar: 'إقامة ساحرة تماماً. الرياض ذو جمال نادر، الاستقبال دافئ والفطور على الفناء بين أشجار البرتقال كان تجربة لا تُنسى. أوصي به بشدة.',
    },
    date: '2026-08-15',
  },
  {
    id: '2',
    name: 'James & Emily Carter',
    location: { fr: 'Londres, Royaume-Uni', en: 'London, United Kingdom', ar: 'لندن، المملكة المتحدة' },
    rating: 5,
    text: {
      fr: 'La Suite Royale était au-delà de nos attentes. La terrasse avec vue sur la médina au coucher du soleil est simplement époustouflante. Le personnel est aux petits soins.',
      en: 'The Royal Suite was beyond our expectations. The terrace with views over the medina at sunset is simply breathtaking. The staff is incredibly attentive.',
      ar: 'كان الجناح الملكي يفوق توقعاتنا. التراس مع إطلالة على المدينة العتيقة عند غروب الشمس ببساطة مذهل. الموظفون يبذلون قصارى جهدهم.',
    },
    date: '2026-07-22',
  },
  {
    id: '3',
    name: 'Karim Bensouda',
    location: { fr: 'Casablanca, Maroc', en: 'Casablanca, Morocco', ar: 'الدار البيضاء، المغرب' },
    rating: 5,
    text: {
      fr: 'En tant que Marocain, j\'ai été profondément touché par le soin apporté à la préservation de l\'architecture traditionnelle. Un endroit où l\'âme marocaine est bien vivante.',
      en: 'As a Moroccan, I was deeply moved by the care taken to preserve traditional architecture. A place where the Moroccan soul is very much alive.',
      ar: 'كمغربي، تأثرت بعمق بالاهتمام المبذول في الحفاظ على العمارة التقليدية. مكان تعيش فيه الروح المغربية بكل حيوية.',
    },
    date: '2026-09-01',
  },
];

export const TRANSLATIONS = {
  fr: {
    nav: {
      home: 'Accueil',
      riad: 'Le Riad',
      rooms: 'Chambres',
      services: 'Services',
      contact: 'Contact',
      book: 'Réserver',
    },
    hero: {
      title: 'Riad Dar Soufa',
      subtitle: 'Une expérience authentique au cœur de la médina de Rabat',
      cta1: 'Réserver votre séjour',
      cta2: 'Découvrir le Riad',
    },
    booking: {
      title: 'Réserver votre séjour',
      arrival: 'Arrivée',
      departure: 'Départ',
      adults: 'Adultes',
      children: 'Enfants',
      rooms: 'Chambres',
      search: 'Rechercher',
      results: 'Résultats disponibles',
      perNight: 'par nuit',
      bookNow: 'Réserver',
      noResults: 'Aucune chambre disponible pour ces dates.',
      yourStay: 'Votre séjour',
      nights: 'nuit(s)',
      guests: 'voyageur(s)',
      errorDates: 'La date de départ doit être après la date d\'arrivée.',
      errorArrival: 'Veuillez sélectionner une date d\'arrivée.',
    },
    presentation: {
      label: 'Le Riad',
      title: 'Bienvenue au Riad Dar Soufa',
      text1: 'Niché au cœur de la médina historique de Rabat, le Riad Dar Soufa est bien plus qu\'un simple hébergement : c\'est une invitation à vivre l\'art de vivre marocain dans toute sa splendeur.',
      text2: 'Ses cours intérieures ornées de zellige, ses fontaines murmurantes, ses arches finement sculptées et ses terrasses fleuries composent un décor d\'exception où chaque détail raconte l\'histoire de l\'artisanat marocain.',
      cta: 'Découvrir nos chambres',
      stat1: { value: '6', label: 'Chambres' },
      stat2: { value: '8', label: 'Services premium' },
      stat3: { value: '5/5', label: 'Note de nos hôtes' },
    },
    rooms: {
      title: 'Nos Chambres',
      subtitle: 'Chaque chambre est une œuvre d\'art, un voyage dans le temps.',
      viewRoom: 'Voir la chambre',
      bookRoom: 'Réserver',
      perNight: '/nuit',
      capacity: 'Capacité',
      bedType: 'Type de lit',
      size: 'Superficie',
      amenities: 'Équipements',
      available: 'Disponible',
      unavailable: 'Indisponible',
      persons: 'pers.',
      sqm: 'm²',
      allRooms: 'Toutes nos chambres',
      gallery: 'Galerie',
      backToRooms: 'Retour aux chambres',
      from: 'À partir de',
      perNightFull: 'par nuit',
      ratesByGuests: 'Tarifs selon le nombre de personnes',
      guestsCount: (n: number) => `${n} personne${n > 1 ? 's' : ''}`,
      onePerson: '1 ou 2 personnes',
      byDates: 'Tarif selon les dates',
    },
    services: {
      title: 'Nos Services',
      subtitle: 'Tout ce dont vous avez besoin pour un séjour parfait.',
      available: 'Disponible',
      onRequest: 'Sur demande',
    },
    contact: {
      title: 'Contactez-nous',
      subtitle: 'Notre équipe est à votre disposition pour toute demande.',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      whatsapp: 'WhatsApp',
      formName: 'Nom',
      formFirstname: 'Prénom',
      formEmail: 'Email',
      formPhone: 'Téléphone',
      formSubject: 'Sujet',
      formMessage: 'Message',
      formSend: 'Envoyer le message',
      formSuccess: 'Votre message est prêt dans WhatsApp : appuyez sur « Envoyer » pour le transmettre au riad. Nous vous répondrons dans les plus brefs délais.',
      location: 'Notre localisation',
      openMaps: 'Ouvrir dans Google Maps',
    },
    footer: {
      tagline: 'Maison d\'hôtes traditionnelle au cœur de la médina de Rabat.',
      links: 'Liens',
      contactUs: 'Contact',
      legal: 'Mentions légales',
      privacy: 'Politique de confidentialité',
      copyright: '© 2026 Riad Dar Soufa. Tous droits réservés.',
    },
    testimonials: {
      title: 'Ce que disent nos hôtes',
      subtitle: 'Des expériences authentiques partagées par nos voyageurs.',
    },
    common: {
      loading: 'Chargement...',
      close: 'Fermer',
      next: 'Suivant',
      prev: 'Précédent',
      mad: 'MAD',
    },
  },
  en: {
    nav: {
      home: 'Home',
      riad: 'The Riad',
      rooms: 'Rooms',
      services: 'Services',
      contact: 'Contact',
      book: 'Book Now',
    },
    hero: {
      title: 'Riad Dar Soufa',
      subtitle: 'An authentic experience in the heart of Rabat\'s medina',
      cta1: 'Book your stay',
      cta2: 'Discover the Riad',
    },
    booking: {
      title: 'Book your stay',
      arrival: 'Arrival',
      departure: 'Departure',
      adults: 'Adults',
      children: 'Children',
      rooms: 'Rooms',
      search: 'Search',
      results: 'Available results',
      perNight: 'per night',
      bookNow: 'Book',
      noResults: 'No rooms available for these dates.',
      yourStay: 'Your stay',
      nights: 'night(s)',
      guests: 'guest(s)',
      errorDates: 'Departure date must be after arrival date.',
      errorArrival: 'Please select an arrival date.',
    },
    presentation: {
      label: 'The Riad',
      title: 'Welcome to Riad Dar Soufa',
      text1: 'Nestled in the heart of the historic medina of Rabat, Riad Dar Soufa is much more than a simple accommodation: it is an invitation to experience the Moroccan art of living in all its splendor.',
      text2: 'Its inner courtyards adorned with zellige, its murmuring fountains, its finely sculpted arches and its flowering terraces compose an exceptional setting where every detail tells the story of Moroccan craftsmanship.',
      cta: 'Discover our rooms',
      stat1: { value: '4', label: 'Exceptional rooms' },
      stat2: { value: '8', label: 'Premium services' },
      stat3: { value: '5/5', label: 'Guest rating' },
    },
    rooms: {
      title: 'Our Rooms',
      subtitle: 'Each room is a work of art, a journey through time.',
      viewRoom: 'View room',
      bookRoom: 'Book',
      perNight: '/night',
      capacity: 'Capacity',
      bedType: 'Bed type',
      size: 'Size',
      amenities: 'Amenities',
      available: 'Available',
      unavailable: 'Unavailable',
      persons: 'pers.',
      sqm: 'm²',
      allRooms: 'All our rooms',
      gallery: 'Gallery',
      backToRooms: 'Back to rooms',
      from: 'From',
      perNightFull: 'per night',
      ratesByGuests: 'Rates by number of guests',
      guestsCount: (n: number) => `${n} guest${n > 1 ? 's' : ''}`,
      onePerson: '1 or 2 guests',
      byDates: 'Rate depends on your dates',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Everything you need for a perfect stay.',
      available: 'Available',
      onRequest: 'On request',
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Our team is at your disposal for any request.',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      whatsapp: 'WhatsApp',
      formName: 'Last name',
      formFirstname: 'First name',
      formEmail: 'Email',
      formPhone: 'Phone',
      formSubject: 'Subject',
      formMessage: 'Message',
      formSend: 'Send message',
      formSuccess: 'Your message is ready in WhatsApp: tap “Send” to deliver it to the riad. We will reply as soon as possible.',
      location: 'Our location',
      openMaps: 'Open in Google Maps',
    },
    footer: {
      tagline: 'Traditional guesthouse in the heart of Rabat\'s medina.',
      links: 'Links',
      contactUs: 'Contact',
      legal: 'Legal notice',
      privacy: 'Privacy policy',
      copyright: '© 2026 Riad Dar Soufa. All rights reserved.',
    },
    testimonials: {
      title: 'What our guests say',
      subtitle: 'Authentic experiences shared by our travelers.',
    },
    common: {
      loading: 'Loading...',
      close: 'Close',
      next: 'Next',
      prev: 'Previous',
      mad: 'MAD',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      riad: 'الرياض',
      rooms: 'الغرف',
      services: 'الخدمات',
      contact: 'اتصل بنا',
      book: 'احجز الآن',
    },
    hero: {
      title: 'رياض دار صوفة',
      subtitle: 'تجربة أصيلة في قلب مدينة الرباط العتيقة',
      cta1: 'احجز إقامتك',
      cta2: 'اكتشف الرياض',
    },
    booking: {
      title: 'احجز إقامتك',
      arrival: 'الوصول',
      departure: 'المغادرة',
      adults: 'البالغون',
      children: 'الأطفال',
      rooms: 'الغرف',
      search: 'بحث',
      results: 'النتائج المتاحة',
      perNight: 'في الليلة',
      bookNow: 'احجز',
      noResults: 'لا توجد غرف متاحة لهذه التواريخ.',
      yourStay: 'إقامتك',
      nights: 'ليلة',
      guests: 'ضيف',
      errorDates: 'يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول.',
      errorArrival: 'يرجى تحديد تاريخ الوصول.',
    },
    presentation: {
      label: 'الرياض',
      title: 'مرحباً بكم في رياض دار صوفة',
      text1: 'يقع رياض دار صوفة في قلب المدينة العتيقة التاريخية بالرباط، وهو أكثر من مجرد إقامة: إنه دعوة لتجربة فن العيش المغربي في كل روعته.',
      text2: 'أفنيتها الداخلية المزينة بالزليج، ونوافيرها المتدفقة، وأقواسها المنحوتة بدقة وتراساتها المزهرة تشكل ديكوراً استثنائياً حيث تحكي كل تفصيلة قصة الحرف المغربية.',
      cta: 'اكتشف غرفنا',
      stat1: { value: '4', label: 'غرف استثنائية' },
      stat2: { value: '8', label: 'خدمات مميزة' },
      stat3: { value: '5/5', label: 'تقييم ضيوفنا' },
    },
    rooms: {
      title: 'غرفنا',
      subtitle: 'كل غرفة تحفة فنية، رحلة عبر الزمن.',
      viewRoom: 'عرض الغرفة',
      bookRoom: 'احجز',
      perNight: '/ليلة',
      capacity: 'السعة',
      bedType: 'نوع السرير',
      size: 'المساحة',
      amenities: 'المرافق',
      available: 'متاح',
      unavailable: 'غير متاح',
      persons: 'أشخاص',
      sqm: 'م²',
      allRooms: 'جميع غرفنا',
      gallery: 'معرض الصور',
      backToRooms: 'العودة إلى الغرف',
      from: 'ابتداءً من',
      perNightFull: 'لليلة',
      ratesByGuests: 'Rates by number of guests',
      guestsCount: (n: number) => `${n} guest${n > 1 ? 's' : ''}`,
      onePerson: '1 or 2 guests',
      byDates: 'Rate depends on your dates',
    },
    services: {
      title: 'خدماتنا',
      subtitle: 'كل ما تحتاجه لإقامة مثالية.',
      available: 'متاح',
      onRequest: 'عند الطلب',
    },
    contact: {
      title: 'اتصل بنا',
      subtitle: 'فريقنا في خدمتك لأي استفسار.',
      address: 'العنوان',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      whatsapp: 'واتساب',
      formName: 'الاسم',
      formFirstname: 'الاسم الأول',
      formEmail: 'البريد الإلكتروني',
      formPhone: 'الهاتف',
      formSubject: 'الموضوع',
      formMessage: 'الرسالة',
      formSend: 'إرسال الرسالة',
      formSuccess: 'رسالتك جاهزة في واتساب: اضغط «إرسال» لإيصالها إلى الرياض. سنرد عليك في أقرب وقت ممكن.',
      location: 'موقعنا',
      openMaps: 'فتح في خرائط جوجل',
    },
    footer: {
      tagline: 'بيت ضيافة تقليدي في قلب المدينة العتيقة بالرباط.',
      links: 'روابط',
      contactUs: 'اتصل بنا',
      legal: 'إشعار قانوني',
      privacy: 'سياسة الخصوصية',
      copyright: '© 2026 رياض دار صوفة. جميع الحقوق محفوظة.',
    },
    testimonials: {
      title: 'ما يقوله ضيوفنا',
      subtitle: 'تجارب أصيلة يشاركها مسافرونا.',
    },
    common: {
      loading: 'جار التحميل...',
      close: 'إغلاق',
      next: 'التالي',
      prev: 'السابق',
      mad: 'درهم',
    },
  },
};