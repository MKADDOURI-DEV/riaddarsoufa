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
  available: boolean;
  tag?: { fr: string; en: string; ar: string };
}

export interface Service {
  id: string;
  icon: string;
  name: { fr: string; en: string; ar: string };
  description: { fr: string; en: string; ar: string };
  available: boolean;
  colSpan?: number;
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

export const ROOMS: Room[] = [
  {
    id: '1',
    slug: 'chambre-andalouse',
    name: { fr: 'Chambre Andalouse', en: 'Andalusian Room', ar: 'غرفة الأندلس' },
    shortDesc: {
      fr: 'Élégance et tradition dans un écrin de zellige authentique.',
      en: 'Elegance and tradition in an authentic zellige setting.',
      ar: 'أناقة وتراث في إطار من الزليج الأصيل.',
    },
    description: {
      fr: 'La Chambre Andalouse vous transporte dans l\'âge d\'or de l\'architecture marocaine. Ornée de zellige traditionnel, de plâtre sculpté et de bois de cèdre gravé, cette chambre offre un cadre authentique et raffiné. Les textiles soigneusement sélectionnés et les lampes en laiton ciselé complètent une atmosphère où le passé et le présent se rencontrent harmonieusement.',
      en: 'The Andalusian Room transports you to the golden age of Moroccan architecture. Adorned with traditional zellige, sculpted plaster and engraved cedar wood, this room offers an authentic and refined setting. Carefully selected textiles and chiseled brass lamps complete an atmosphere where past and present meet harmoniously.',
      ar: 'تنقلك غرفة الأندلس إلى العصر الذهبي للعمارة المغربية. مزينة بالزليج التقليدي والجبس المنقوش وخشب الأرز المحفور، توفر هذه الغرفة إطاراً أصيلاً ومصقولاً. تكمل الأقمشة المختارة بعناية والمصابيح النحاسية المزخرفة أجواءً تلتقي فيها الماضي والحاضر بانسجام.',
    },
    capacity: 2,
    bedType: { fr: 'Lit double', en: 'Double bed', ar: 'سرير مزدوج' },
    size: 28,
    pricePerNight: 850,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    ],
    amenities: [
      { fr: 'Climatisation', en: 'Air conditioning', ar: 'تكييف الهواء' },
      { fr: 'Salle de bain privée', en: 'Private bathroom', ar: 'حمام خاص' },
      { fr: 'Wi-Fi gratuit', en: 'Free Wi-Fi', ar: 'واي فاي مجاني' },
      { fr: 'Petit-déjeuner inclus', en: 'Breakfast included', ar: 'الفطور مشمول' },
      { fr: 'Service de ménage quotidien', en: 'Daily housekeeping', ar: 'خدمة تنظيف يومية' },
      { fr: 'Coffre-fort', en: 'Safe', ar: 'خزنة أمان' },
    ],
    available: true,
    tag: { fr: 'Populaire', en: 'Popular', ar: 'الأكثر طلباً' },
  },
  {
    id: '2',
    slug: 'suite-royale',
    name: { fr: 'Suite Royale', en: 'Royal Suite', ar: 'الجناح الملكي' },
    shortDesc: {
      fr: 'Notre suite la plus spacieuse, un voyage dans le luxe marocain.',
      en: 'Our most spacious suite, a journey into Moroccan luxury.',
      ar: 'جناحنا الأكثر اتساعاً، رحلة في الفخامة المغربية.',
    },
    description: {
      fr: 'La Suite Royale représente l\'apogée du luxe marocain traditionnel. Avec son salon séparé, sa salle de bain en marbre et sa terrasse privée donnant sur les toits de la médina, cette suite vous offre une expérience incomparable. Les détails architecturaux — arche en stuc, fontaine intérieure, mobilier artisanal — font de ce séjour un moment inoubliable.',
      en: 'The Royal Suite represents the pinnacle of traditional Moroccan luxury. With its separate lounge, marble bathroom and private terrace overlooking the medina rooftops, this suite offers you an incomparable experience. The architectural details — stucco arch, interior fountain, artisan furniture — make this stay an unforgettable moment.',
      ar: 'يمثل الجناح الملكي ذروة الفخامة المغربية التقليدية. مع صالة جلوس منفصلة وحمام رخامي وتراس خاص يطل على أسطح المدينة العتيقة، يقدم لك هذا الجناح تجربة لا مثيل لها. التفاصيل المعمارية — قوس الجبس، النافورة الداخلية، الأثاث الحرفي — تجعل هذه الإقامة لحظة لا تُنسى.',
    },
    capacity: 2,
    bedType: { fr: 'Lit King Size', en: 'King Size bed', ar: 'سرير كينج سايز' },
    size: 55,
    pricePerNight: 1650,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop',
    ],
    amenities: [
      { fr: 'Salon séparé', en: 'Separate lounge', ar: 'صالة جلوس منفصلة' },
      { fr: 'Terrasse privée', en: 'Private terrace', ar: 'تراس خاص' },
      { fr: 'Salle de bain en marbre', en: 'Marble bathroom', ar: 'حمام رخامي' },
      { fr: 'Climatisation', en: 'Air conditioning', ar: 'تكييف الهواء' },
      { fr: 'Wi-Fi gratuit', en: 'Free Wi-Fi', ar: 'واي فاي مجاني' },
      { fr: 'Petit-déjeuner inclus', en: 'Breakfast included', ar: 'الفطور مشمول' },
      { fr: 'Bain à remous', en: 'Jacuzzi', ar: 'جاكوزي' },
      { fr: 'Service en chambre', en: 'Room service', ar: 'خدمة الغرف' },
    ],
    available: true,
    tag: { fr: 'Suite Premium', en: 'Premium Suite', ar: 'جناح مميز' },
  },
  {
    id: '3',
    slug: 'chambre-jardin',
    name: { fr: 'Chambre Jardin', en: 'Garden Room', ar: 'غرفة الحديقة' },
    shortDesc: {
      fr: 'Un havre de paix avec vue sur le patio fleuri.',
      en: 'A peaceful haven with views over the flowering patio.',
      ar: 'ملاذ هادئ مع إطلالة على الفناء المزهر.',
    },
    description: {
      fr: 'La Chambre Jardin offre une vue directe sur le patio central du riad, avec ses orangers et sa fontaine murmurante. Décorée dans des tons naturels de terre cuite et d\'ocre, cette chambre respire la sérénité. Idéale pour les voyageurs qui recherchent le calme et l\'authenticité, elle propose un espace confortable et joliment agencé.',
      en: 'The Garden Room offers a direct view over the central patio of the riad, with its orange trees and murmuring fountain. Decorated in natural tones of terracotta and ochre, this room breathes serenity. Ideal for travelers seeking calm and authenticity, it offers a comfortable and beautifully arranged space.',
      ar: 'تطل غرفة الحديقة مباشرة على الفناء المركزي للرياض، مع أشجار البرتقال ونافورته المتدفقة. مزينة بألوان طبيعية من الطين والأوكر، تنبض هذه الغرفة بالهدوء. مثالية للمسافرين الباحثين عن السكينة والأصالة، توفر مساحة مريحة ومرتبة بشكل جميل.',
    },
    capacity: 2,
    bedType: { fr: 'Lit Queen Size', en: 'Queen Size bed', ar: 'سرير كوين سايز' },
    size: 32,
    pricePerNight: 950,
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200&auto=format&fit=crop',
    ],
    amenities: [
      { fr: 'Vue sur patio', en: 'Patio view', ar: 'إطلالة على الفناء' },
      { fr: 'Climatisation', en: 'Air conditioning', ar: 'تكييف الهواء' },
      { fr: 'Salle de bain privée', en: 'Private bathroom', ar: 'حمام خاص' },
      { fr: 'Wi-Fi gratuit', en: 'Free Wi-Fi', ar: 'واي فاي مجاني' },
      { fr: 'Petit-déjeuner inclus', en: 'Breakfast included', ar: 'الفطور مشمول' },
    ],
    available: true,
  },
  {
    id: '4',
    slug: 'suite-familiale',
    name: { fr: 'Suite Familiale', en: 'Family Suite', ar: 'الجناح العائلي' },
    shortDesc: {
      fr: 'Espace généreux et confort pour toute la famille.',
      en: 'Generous space and comfort for the whole family.',
      ar: 'مساحة كبيرة وراحة للعائلة بأكملها.',
    },
    description: {
      fr: 'La Suite Familiale est conçue pour accueillir les familles dans tout le confort et l\'authenticité du riad. Avec sa chambre principale et sa chambre communicante, son grand salon marocain et sa salle de bain spacieuse, cette suite offre tout l\'espace nécessaire pour un séjour mémorable. Les enfants seront enchantés par le mobilier aux couleurs vives et les contes marocains gravés sur les murs.',
      en: 'The Family Suite is designed to welcome families in all the comfort and authenticity of the riad. With its main bedroom and communicating room, large Moroccan lounge and spacious bathroom, this suite offers all the space needed for a memorable stay. Children will be enchanted by the brightly colored furniture and Moroccan tales engraved on the walls.',
      ar: 'صُمم الجناح العائلي لاستقبال العائلات بكل راحة وأصالة الرياض. مع غرفة نوم رئيسية وغرفة متصلة وصالة مغربية كبيرة وحمام واسع، يوفر هذا الجناح كل المساحة اللازمة لإقامة لا تُنسى. سيُفتتن الأطفال بالأثاث متعدد الألوان والحكايات المغربية المنقوشة على الجدران.',
    },
    capacity: 4,
    bedType: { fr: '1 lit double + 2 lits simples', en: '1 double + 2 single beds', ar: 'سرير مزدوج + سريران فرديان' },
    size: 70,
    pricePerNight: 1950,
    images: [
      'https://images.unsplash.com/photo-1596701062351-8ac031d7a7b4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
    ],
    amenities: [
      { fr: '2 chambres communicantes', en: '2 connecting rooms', ar: 'غرفتان متصلتان' },
      { fr: 'Grand salon marocain', en: 'Large Moroccan lounge', ar: 'صالة مغربية كبيرة' },
      { fr: 'Climatisation', en: 'Air conditioning', ar: 'تكييف الهواء' },
      { fr: 'Salle de bain spacieuse', en: 'Spacious bathroom', ar: 'حمام واسع' },
      { fr: 'Wi-Fi gratuit', en: 'Free Wi-Fi', ar: 'واي فاي مجاني' },
      { fr: 'Petit-déjeuner inclus', en: 'Breakfast included', ar: 'الفطور مشمول' },
    ],
    available: false,
    tag: { fr: 'Idéal Famille', en: 'Family Ideal', ar: 'مثالي للعائلات' },
  },
];

export const SERVICES: Service[] = [
  {
    id: 'breakfast',
    icon: 'SunIcon',
    name: { fr: 'Petit-déjeuner Marocain', en: 'Moroccan Breakfast', ar: 'الفطور المغربي' },
    description: {
      fr: 'Chaque matin, savourez un petit-déjeuner traditionnel marocain servi dans le patio : msemen, harcha, miel du Moyen Atlas, olives et thé à la menthe fraîche.',
      en: 'Each morning, enjoy a traditional Moroccan breakfast served in the patio: msemen, harcha, honey from the Middle Atlas, olives and fresh mint tea.',
      ar: 'كل صباح، استمتع بفطور مغربي تقليدي يُقدَّم في الفناء: المسمن، الهرشة، عسل الأطلس المتوسط، الزيتون وشاي النعناع الطازج.',
    },
    available: true,
    colSpan: 2,
  },
  {
    id: 'wifi',
    icon: 'WifiIcon',
    name: { fr: 'Wi-Fi Haut Débit', en: 'High-Speed Wi-Fi', ar: 'واي فاي عالي السرعة' },
    description: {
      fr: 'Connexion Wi-Fi gratuite et performante dans toutes les zones du riad.',
      en: 'Free and high-performance Wi-Fi throughout the riad.',
      ar: 'اتصال واي فاي مجاني وعالي الأداء في جميع مناطق الرياض.',
    },
    available: true,
  },
  {
    id: 'housekeeping',
    icon: 'SparklesIcon',
    name: { fr: 'Service de Ménage', en: 'Housekeeping', ar: 'خدمة التنظيف' },
    description: {
      fr: 'Service de ménage quotidien pour assurer la propreté et le confort de votre chambre.',
      en: 'Daily housekeeping service to ensure the cleanliness and comfort of your room.',
      ar: 'خدمة تنظيف يومية لضمان نظافة وراحة غرفتك.',
    },
    available: true,
  },
  {
    id: 'terrace',
    icon: 'HomeIcon',
    name: { fr: 'Terrasse Panoramique', en: 'Panoramic Terrace', ar: 'التراس البانورامي' },
    description: {
      fr: 'Profitez de notre terrasse avec vue sur les toits de la médina et les minarets. Espace détente avec transats et service de boissons.',
      en: 'Enjoy our terrace with views over the medina rooftops and minarets. Relaxation space with sun loungers and drinks service.',
      ar: 'استمتع بتراسنا المطل على أسطح المدينة العتيقة والمآذن. مساحة استرخاء مع كراسي الشمس وخدمة المشروبات.',
    },
    available: true,
    colSpan: 2,
  },
  {
    id: 'transfer',
    icon: 'TruckIcon',
    name: { fr: 'Transfert Aéroport', en: 'Airport Transfer', ar: 'نقل المطار' },
    description: {
      fr: 'Service de transfert depuis et vers l\'aéroport de Rabat-Salé sur réservation.',
      en: 'Transfer service to and from Rabat-Salé airport on request.',
      ar: 'خدمة نقل من وإلى مطار الرباط-سلا عند الطلب.',
    },
    available: true,
  },
  {
    id: 'dining',
    icon: 'CakeIcon',
    name: { fr: 'Restauration', en: 'Dining', ar: 'المطعم' },
    description: {
      fr: 'Dîners marocains traditionnels préparés à la demande. Tagines, couscous et pâtisseries maison.',
      en: 'Traditional Moroccan dinners prepared on request. Tagines, couscous and homemade pastries.',
      ar: 'عشاء مغربي تقليدي يُعدّ عند الطلب. طاجين، كسكس وحلويات منزلية.',
    },
    available: true,
  },
  {
    id: 'tourism',
    icon: 'MapIcon',
    name: { fr: 'Assistance Touristique', en: 'Tourist Assistance', ar: 'المساعدة السياحية' },
    description: {
      fr: 'Notre équipe vous aide à organiser vos visites : médina, Kasbah des Oudayas, Tour Hassan, musées et excursions.',
      en: 'Our team helps you organize your visits: medina, Kasbah of the Udayas, Hassan Tower, museums and excursions.',
      ar: 'يساعدك فريقنا في تنظيم زياراتك: المدينة العتيقة، قصبة الوداية، برج حسان، المتاحف والرحلات.',
    },
    available: true,
  },
  {
    id: 'reception',
    icon: 'PhoneIcon',
    name: { fr: 'Réception 24h/24', en: '24/7 Reception', ar: 'استقبال على مدار الساعة' },
    description: {
      fr: 'Notre équipe est disponible 24h/24 pour répondre à toutes vos demandes et vous assister tout au long de votre séjour.',
      en: 'Our team is available 24/7 to respond to all your requests and assist you throughout your stay.',
      ar: 'فريقنا متاح على مدار الساعة طوال أيام الأسبوع للرد على جميع طلباتك ومساعدتك طوال فترة إقامتك.',
    },
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
      stat1: { value: '4', label: 'Chambres d\'exception' },
      stat2: { value: '8', label: 'Services premium' },
      stat3: { value: '5★', label: 'Note de nos hôtes' },
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
      formSuccess: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
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
      stat3: { value: '5★', label: 'Guest rating' },
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
      formSuccess: 'Your message has been sent successfully. We will reply as soon as possible.',
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
      stat3: { value: '5★', label: 'تقييم ضيوفنا' },
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
      formSuccess: 'تم إرسال رسالتك بنجاح. سنرد عليك في أقرب وقت ممكن.',
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