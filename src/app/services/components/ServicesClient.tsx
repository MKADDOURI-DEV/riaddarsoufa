'use client';
import React from 'react';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { formatPhone, telHref } from '@/lib/content';
import Icon from '@/components/ui/AppIcon';

function ServicesContent() {
  const { t, lang, dir, services: SERVICES, contact } = useSite();

  const visible = SERVICES.filter((s) => s.available);

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

        {/* Services (liste gérée depuis l'admin) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {visible.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((s) =>
              <div key={s.id} className="bg-card border border-border rounded-2xl p-8 group hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon name={s.icon === 'HomeIcon' ? 'HomeModernIcon' : s.icon} size={24} className="text-accent" />
                  </div>
                  <h2 className="font-serif text-xl text-foreground mb-3">{s.name[lang]}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description[lang]}</p>
                </div>
              )}
            </div>
          )}

          {/* Contact réception */}
          <div className="mt-10 rounded-2xl bg-foreground text-background p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-serif text-xl">{lang === 'ar' ? 'هل لديك سؤال؟ اتصل بنا' : lang === 'en' ? 'Any question? Call our reception' : 'Une question ? Appelez notre réception'}</p>
            <a href={telHref(contact.phone)} className="btn-accent text-sm px-6 py-3">
              📞 {formatPhone(contact.phone)}
            </a>
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