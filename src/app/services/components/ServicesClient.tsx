'use client';
import React, { useState } from 'react';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { formatPhone, telHref } from '@/lib/content';
import Icon from '@/components/ui/AppIcon';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/** Photos d'un service : une seule, ou plusieurs avec flèches pour défiler. Sans photo : l'icône du service. */
function ServicePhotos({ images, alt, icon, n }: { images: string[]; alt: string; icon: string; n: number }) {
  const { lang } = useSite();
  const [i, setI] = useState(0);
  const count = images.length;
  if (count === 0) {
    return (
      <div className="relative flex aspect-[4/3] items-center justify-center bg-[color-mix(in_srgb,var(--accent)_10%,var(--card))]">
        <Icon name={icon === 'HomeIcon' ? 'HomeModernIcon' : icon} size={56} className="text-accent/60" />
      </div>
    );
  }
  const cur = Math.min(i, count - 1);
  return (
    <div className="img-hover relative aspect-[4/3] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[cur]} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      {count > 1 && (
        <>
          <button type="button" onClick={() => setI((cur - 1 + count) % count)} aria-label={lang === 'en' ? 'Previous photo' : 'Photo précédente'}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white hover:bg-black/60">
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setI((cur + 1) % count)} aria-label={lang === 'en' ? 'Next photo' : 'Photo suivante'}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 text-white hover:bg-black/60">
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      )}
      <span className="absolute bottom-3 right-3 text-xs font-semibold text-white/90">
        {count > 1 ? `${cur + 1} / ${count}` : String(n).padStart(2, '0')}
      </span>
    </div>
  );
}

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
                return (
                  <article key={s.id} className={`grid grid-cols-1 items-center gap-8 lg:gap-16 ${photoRight ? 'md:grid-cols-[2fr_3fr]' : 'md:grid-cols-[3fr_2fr]'}`}>
                    <div className={photoRight ? 'md:order-2' : 'md:order-1'}>
                      <ServicePhotos images={s.images || []} alt={s.name[lang]} icon={s.icon} n={i + 1} />
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