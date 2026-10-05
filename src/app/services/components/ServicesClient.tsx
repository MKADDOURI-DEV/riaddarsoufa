'use client';
import React from 'react';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { formatPhone, telHref } from '@/lib/content';
import Icon from '@/components/ui/AppIcon';
import { exampleServicePhoto } from '@/lib/guide';

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
          {/* Mise en page alternée comme la référence : service 1 photo à gauche, service 2 photo à droite, etc. */}
          {visible.length > 0 && (
            <div className="space-y-20 lg:space-y-28">
              {visible.map((s, i) => {
                const photoRight = i % 2 === 1;
                const img = s.image || exampleServicePhoto(s.name.fr || s.name.en, i);
                return (
                  <article key={s.id} className={`grid grid-cols-1 items-center gap-8 lg:gap-16 ${photoRight ? 'md:grid-cols-[2fr_3fr]' : 'md:grid-cols-[3fr_2fr]'}`}>
                    <div className={`img-hover relative aspect-[4/3] overflow-hidden ${photoRight ? 'md:order-2' : 'md:order-1'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={s.name[lang]} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute bottom-3 right-3 text-xs font-semibold text-white/90">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={`max-w-md ${photoRight ? 'md:order-1 md:justify-self-end' : 'md:order-2'}`}>
                      <div className="mb-4 flex items-center gap-3 text-accent">
                        <Icon name={s.icon === 'HomeIcon' ? 'HomeModernIcon' : s.icon} size={18} className="text-accent" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">{(lang === 'ar' ? 'خدمة' : 'Service') + ' ' + String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">{s.name[lang]}</h2>
                      <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{s.description[lang]}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Contact réception */}
          <div className="mt-24 rounded-2xl bg-foreground text-background p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-serif text-xl">{lang === 'ar' ? 'هل لديك سؤال؟ اتصل بنا' : lang === 'en' ? 'Any question? Call our reception' : 'Une question ? Appelez notre réception'}</p>
            <a href={telHref(contact.phone)} className="btn-accent text-sm px-6 py-3">
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />{formatPhone(contact.phone)}
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