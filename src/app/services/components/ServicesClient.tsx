'use client';
import React from 'react';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { SERVICES } from '@/lib/data';
import Icon from '@/components/ui/AppIcon';

function ServicesContent() {
  const { t, lang, dir } = useSite();

  const iconMap: Record<string, string> = {
    SunIcon: 'SunIcon',
    WifiIcon: 'WifiIcon',
    SparklesIcon: 'SparklesIcon',
    HomeIcon: 'HomeModernIcon',
    TruckIcon: 'TruckIcon',
    CakeIcon: 'CakeIcon',
    MapIcon: 'MapIcon',
    PhoneIcon: 'PhoneIcon'
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main>
        {/* Page Hero */}
        <section className="relative h-64 sm:h-80 flex items-end pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1f54e7b35-1785433439979.png"
              alt="Terrasse d'un riad marocain avec vue panoramique sur les toits de la médina au coucher du soleil, tons sombres et chaleureux"
              fill
              priority
              className="object-cover"
              sizes="100vw" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent mb-3 block">Riad Dar Soufa</span>
            <h1 className="font-serif text-display text-white">{t.services.title}</h1>
            <p className="text-white/70 mt-2">{t.services.subtitle}</p>
          </div>
        </section>

        {/* Services Bento Grid */}
        {/* BENTO AUDIT:
             Array 8 cards: [Breakfast, WiFi, Housekeeping, Terrace, Transfer, Dining, Tourism, Reception]
             Row 1: [col-1,2: Breakfast cs-2] [col-3: WiFi cs-1]
             Row 2: [col-1: Housekeeping cs-1] [col-2,3: Terrace cs-2]
             Row 3: [col-1: Transfer cs-1] [col-2: Dining cs-1] [col-3: Tourism cs-1]
             Row 4: [col-1,2,3: Reception cs-3]
             Placed 8/8 ✓
          */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Breakfast — col-span-2 */}
            <div className="md:col-span-2 bg-card border border-border rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Icon name="SunIcon" size={24} className="text-accent" />
                    </div>
                    <h2 className="font-serif text-xl text-foreground mb-3">{SERVICES[0].name[lang]}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{SERVICES[0].description[lang]}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-green-600 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {t.services.available}
                  </span>
                </div>
                <div className="img-hover relative h-48 sm:h-full overflow-hidden">
                  <AppImage
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_1471bf1c1-1783595372807.png"
                    alt="Plateau de petit-déjeuner marocain traditionnel avec msemen, miel, olives et thé à la menthe, présentation élégante"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw" />
                  
                </div>
              </div>
            </div>

            {/* WiFi — col-span-1 */}
            <div className="md:col-span-1 bg-primary text-primary-foreground rounded-2xl p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="WifiIcon" size={24} className="text-primary-foreground" />
                </div>
                <h2 className="font-serif text-xl text-primary-foreground mb-3">{SERVICES[1].name[lang]}</h2>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">{SERVICES[1].description[lang]}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {t.services.available}
              </span>
            </div>

            {/* Housekeeping — col-span-1 */}
            <div className="md:col-span-1 bg-card border border-border rounded-2xl p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="SparklesIcon" size={24} className="text-accent" />
                </div>
                <h2 className="font-serif text-xl text-foreground mb-3">{SERVICES[2].name[lang]}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{SERVICES[2].description[lang]}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-green-600 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {t.services.available}
              </span>
            </div>

            {/* Terrace — col-span-2 */}
            <div className="md:col-span-2 bg-card border border-border rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                <div className="img-hover relative h-48 sm:h-full overflow-hidden">
                  <AppImage
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_1f54e7b35-1785433439979.png"
                    alt="Terrasse panoramique d'un riad marocain avec vue sur les toits de la médina et les minarets au coucher du soleil, ciel orangé"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw" />
                  
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Icon name="HomeModernIcon" size={24} className="text-accent" />
                    </div>
                    <h2 className="font-serif text-xl text-foreground mb-3">{SERVICES[3].name[lang]}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{SERVICES[3].description[lang]}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-green-600 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {t.services.available}
                  </span>
                </div>
              </div>
            </div>

            {/* Transfer — col-span-1 */}
            <div className="md:col-span-1 bg-secondary/50 border border-border rounded-2xl p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="TruckIcon" size={24} className="text-primary" />
                </div>
                <h2 className="font-serif text-xl text-foreground mb-3">{SERVICES[4].name[lang]}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{SERVICES[4].description[lang]}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {t.services.onRequest}
              </span>
            </div>

            {/* Dining — col-span-1 */}
            <div className="md:col-span-1 bg-secondary/50 border border-border rounded-2xl p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="CakeIcon" size={24} className="text-primary" />
                </div>
                <h2 className="font-serif text-xl text-foreground mb-3">{SERVICES[5].name[lang]}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{SERVICES[5].description[lang]}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {t.services.onRequest}
              </span>
            </div>

            {/* Tourism — col-span-1 */}
            <div className="md:col-span-1 bg-secondary/50 border border-border rounded-2xl p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="MapIcon" size={24} className="text-primary" />
                </div>
                <h2 className="font-serif text-xl text-foreground mb-3">{SERVICES[6].name[lang]}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{SERVICES[6].description[lang]}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-green-600 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {t.services.available}
              </span>
            </div>

            {/* Reception — col-span-3 */}
            <div className="md:col-span-3 bg-foreground text-background rounded-2xl p-8 group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon name="PhoneIcon" size={24} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-background mb-2">{SERVICES[7].name[lang]}</h2>
                    <p className="text-sm text-background/60 leading-relaxed max-w-xl">{SERVICES[7].description[lang]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <a href="tel:+212537000000" className="btn-accent text-sm px-6 py-3">
                    📞 +212 537 000 000
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>);

}

export default function ServicesClient() {
  return (
    <SiteProvider>
      <ServicesContent />
    </SiteProvider>);

}