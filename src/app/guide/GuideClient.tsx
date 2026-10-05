'use client';

import React, { useEffect, useState } from 'react';
import {
  ClockIcon, WifiIcon, SparklesIcon, MapPinIcon, TruckIcon, ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import AppLogo from '@/components/ui/AppLogo';
import { ROOMS } from '@/lib/data';
import { loadContentRows, mergeContent } from '@/lib/content';
import {
  EMPTY_GUIDE, GLang, GuideData, loadGuide, mapsLink, pick, whatsappHref,
} from '@/lib/guide';

const UI = {
  fr: {
    hours: 'Horaires', hoursNote: 'Horaires généraux du riad',
    checkin: 'Arrivée (check-in)', checkinSub: 'à partir de', checkout: 'Départ (check-out)', checkoutSub: 'avant',
    wifi: 'Wi-Fi', network: 'Réseau', password: 'Mot de passe', copy: 'Copier', copied: 'Copié',
    services: 'Nos Services', rabat: 'À découvrir à Rabat', access: 'Accès & Parking',
    accessTitle: 'Comment venir', parking: 'Parking', instructions: 'Instructions',
    maps: 'Voir sur Google Maps', openMaps: 'Ouvrir dans Google Maps',
    whatsapp: 'Contacter le Riad sur WhatsApp', loading: 'Chargement…', error: 'Impossible de charger les dernières informations. Réessayez dans un instant.',
    currency: 'MAD', onRequest: 'Sur demande', footer: 'Riad Dar Soufa — Médina de Rabat',
    askReception: 'Demandez les informations à la réception du riad.', parkingAsk: 'Pour le stationnement, merci de nous contacter avant votre arrivée.',
  },
  en: {
    hours: 'Opening hours', hoursNote: 'General riad hours',
    checkin: 'Arrival (check-in)', checkinSub: 'from', checkout: 'Departure (check-out)', checkoutSub: 'before',
    wifi: 'Wi-Fi', network: 'Network', password: 'Password', copy: 'Copy', copied: 'Copied',
    services: 'Our Services', rabat: 'Discover Rabat', access: 'Access & Parking',
    accessTitle: 'How to get here', parking: 'Parking', instructions: 'Instructions',
    maps: 'View on Google Maps', openMaps: 'Open in Google Maps',
    whatsapp: 'Contact the Riad on WhatsApp', loading: 'Loading…', error: 'Could not load the latest information. Please try again shortly.',
    currency: 'MAD', onRequest: 'On request', footer: 'Riad Dar Soufa — Rabat Medina',
    askReception: 'Please ask the riad reception for this information.', parkingAsk: 'For parking, please contact us before your arrival.',
  },
} as const;

type IconCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function SectionTitle({ icon: Icon, children, id }: { icon: IconCmp; children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="scroll-mt-20 flex items-center gap-3 font-serif text-2xl text-foreground mb-4">
      <Icon className="h-6 w-6 text-accent" aria-hidden="true" />{children}
    </h2>
  );
}

/** Carte du guide : photo d'un côté, détails de l'autre (même principe que les cartes de réservation).
 *  Sans photo (ou photo introuvable), un visuel de remplacement garde la mise en page moitié / moitié. */
function SplitCard({
  image, alt, title, badge, children, footer, placeholder: Placeholder,
}: { image?: string; alt: string; title: string; badge?: string; children?: React.ReactNode; footer?: React.ReactNode; placeholder: IconCmp }) {
  const [broken, setBroken] = useState(false);
  const showImg = !!image && !broken;
  return (
    <article className="overflow-hidden rounded-[24px] border border-border bg-card">
      <div className="grid grid-cols-2 sm:grid-cols-[2fr_3fr]">
        <div className="relative min-h-[200px] bg-[color-mix(in_srgb,var(--accent)_12%,var(--card))]">
          {showImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={alt} loading="lazy" onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Placeholder className="h-10 w-10 text-accent/60" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-serif text-lg leading-snug text-foreground sm:text-2xl">{title}</h3>
            {badge && (
              <span className="shrink-0 rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2.5 py-1 text-xs font-semibold text-accent sm:px-3 sm:text-sm">{badge}</span>
            )}
          </div>
          {children}
          {footer && <div className="mt-auto pt-4"><div className="border-t border-border pt-3 sm:pt-4">{footer}</div></div>}
        </div>
      </div>
    </article>
  );
}

function CopyButton({ text, label, done }: { text: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); } catch { /* ignore */ }
      }}
      className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground active:scale-95 transition"
    >
      {ok ? done : label}
    </button>
  );
}

function MapsButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold active:scale-95 transition">
      <MapPinIcon className="h-4 w-4" aria-hidden="true" />{label}
    </a>
  );
}

export default function GuideClient() {
  const [lang, setLang] = useState<GLang>('fr');
  const [data, setData] = useState<GuideData>(EMPTY_GUIDE);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [fallbackWa, setFallbackWa] = useState('');
  const t = UI[lang];

  // Langue : choix mémorisé, sinon langue du téléphone
  useEffect(() => {
    try {
      const saved = localStorage.getItem('guide-lang');
      if (saved === 'fr' || saved === 'en') { setLang(saved); return; }
    } catch { /* ignore */ }
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en')) setLang('en');
  }, []);
  const changeLang = (l: GLang) => {
    setLang(l);
    try { localStorage.setItem('guide-lang', l); } catch { /* ignore */ }
  };

  // Données en direct depuis la base (admin -> base -> /guide)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [g, rows] = await Promise.all([loadGuide(), loadContentRows()]);
      if (cancelled) return;
      if (g) { setData(g); setStatus('ready'); } else { setStatus('error'); }
      const c = mergeContent(rows).contact;
      setFallbackWa(c.whatsapp);
    })();
    return () => { cancelled = true; };
  }, []);

  const { welcome, practical, whatsapp } = data;
  const services = data.services.filter((s) => s.available);
  const places = data.places.filter((p) => p.active);
  const heroImg = welcome.image_url || ROOMS[0]?.images?.[0] || '';

  // Numéro WhatsApp : celui du guide, sinon celui des coordonnées du site (hors valeur par défaut)
  const waNumber = (whatsapp.number || fallbackWa || '').trim();
  const waDigits = waNumber.replace(/\D/g, '');
  const waOk = waDigits.length >= 8 && waDigits !== '212600000000';
  const waHref = waOk ? whatsappHref(waNumber, pick(whatsapp.message_fr, whatsapp.message_en, lang)) : '';

  const hasWifi = !!(practical.wifi_name || practical.wifi_password);
  const accessText = pick(practical.access.description_fr, practical.access.description_en, lang);
  const parkingText = pick(practical.parking.description_fr, practical.parking.description_en, lang);
  const parkingInstr = pick(practical.parking.instructions_fr, practical.parking.instructions_en, lang);

  const nav = [
    { id: 'horaires', label: t.hours, show: true },
    { id: 'wifi', label: t.wifi, show: true },
    { id: 'services', label: t.services, show: services.length > 0 },
    { id: 'rabat', label: t.rabat, show: places.length > 0 },
    { id: 'acces', label: t.access, show: true },
  ].filter((n) => n.show);

  return (
    <div className="min-h-screen bg-background text-foreground pb-28" style={{ scrollBehavior: 'smooth' }}>
      {/* Barre du haut */}
      <header className="sticky top-0 z-30 bg-[color-mix(in_srgb,var(--background)_94%,transparent)] backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <AppLogo size={44} />
          <div className="flex rounded-full border border-border p-0.5 text-sm font-semibold" role="group" aria-label="Langue / Language">
            {(['fr', 'en'] as GLang[]).map((l) => (
              <button key={l} type="button" onClick={() => changeLang(l)} aria-pressed={lang === l}
                className={`px-3.5 py-1.5 rounded-full transition ${lang === l ? 'bg-primary text-primary-foreground' : 'text-foreground/70'}`}>
                {l === 'fr' ? 'FR' : 'EN'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4">
        {/* Bienvenue */}
        <section className="relative mt-4 overflow-hidden rounded-3xl bg-foreground text-background">
          {heroImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImg} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 h-full w-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="relative flex min-h-[300px] flex-col justify-end p-6">
            <h1 className="font-serif text-3xl leading-tight text-white">{pick(welcome.title_fr, welcome.title_en, lang)}</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{pick(welcome.subtitle_fr, welcome.subtitle_en, lang)}</p>
          </div>
        </section>

        {/* Navigation rapide */}
        <nav className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Sections">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">
              {n.label}
            </a>
          ))}
        </nav>

        {status === 'error' && (
          <p className="mt-4 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground" role="alert">{t.error}</p>
        )}

        {/* Horaires */}
        <section className="mt-10">
          <SectionTitle icon={ClockIcon} id="horaires">{t.hours}</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {[{ l: t.checkin, s: t.checkinSub, v: practical.checkin }, { l: t.checkout, s: t.checkoutSub, v: practical.checkout }].map((x) => (
              <div key={x.l} className="rounded-2xl border border-border bg-card p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{x.l}</p>
                <p className="mt-3 text-xs text-muted-foreground">{x.s}</p>
                <p className="font-serif text-3xl text-foreground">{x.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">{t.hoursNote}</p>
        </section>

        {/* Wi-Fi */}
        <section className="mt-10">
          <SectionTitle icon={WifiIcon} id="wifi">{t.wifi}</SectionTitle>
          {hasWifi ? (
            <div className="divide-y divide-border rounded-2xl border border-border bg-card">
              {practical.wifi_name && (
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.network}</p>
                    <p className="mt-1 truncate font-mono text-base text-foreground">{practical.wifi_name}</p>
                  </div>
                  <CopyButton text={practical.wifi_name} label={t.copy} done={t.copied} />
                </div>
              )}
              {practical.wifi_password && (
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.password}</p>
                    <p className="mt-1 break-all font-mono text-base text-foreground">{practical.wifi_password}</p>
                  </div>
                  <CopyButton text={practical.wifi_password} label={t.copy} done={t.copied} />
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">{t.askReception}</p>
          )}
        </section>

        {/* Services */}
        {services.length > 0 && (
          <section className="mt-10">
            <SectionTitle icon={SparklesIcon} id="services">{t.services}</SectionTitle>
            <div className="space-y-4">
              {services.map((s) => {
                const note = pick(s.price_note_fr, s.price_note_en, lang);
                const desc = pick(s.description_fr, s.description_en, lang);
                const hasPrice = s.price !== null && s.price !== undefined;
                const name = pick(s.name_fr, s.name_en, lang);
                return (
                  <SplitCard key={s.id} image={s.image_url} alt={name} title={name} placeholder={SparklesIcon}
                    footer={hasPrice ? (
                      <div>
                        <span className="text-2xl font-bold text-accent">{Number(s.price).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</span>
                        <span className="text-sm text-muted-foreground"> {t.currency}</span>
                        {note && <p className="text-xs text-muted-foreground">{note}</p>}
                      </div>
                    ) : undefined}>
                    {desc && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>}
                    {!hasPrice && note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
                  </SplitCard>
                );
              })}
            </div>
          </section>
        )}

        {/* Guide de Rabat */}
        {places.length > 0 && (
          <section className="mt-10">
            <SectionTitle icon={MapPinIcon} id="rabat">{t.rabat}</SectionTitle>
            <div className="space-y-4">
              {places.map((p) => {
                const name = pick(p.name_fr, p.name_en, lang);
                const cat = pick(p.category_fr, p.category_en, lang);
                const desc = pick(p.description_fr, p.description_en, lang);
                return (
                  <SplitCard key={p.id} image={p.image_url} alt={name} title={name} badge={cat || undefined} placeholder={MapPinIcon}
                    footer={<MapsButton href={mapsLink(p.maps_url, `${name} Rabat`)} label={t.maps} />}>
                    {desc && <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-4">{desc}</p>}
                    {p.address && <p className="mt-2 text-xs text-muted-foreground">{p.address}</p>}
                  </SplitCard>
                );
              })}
            </div>
          </section>
        )}

        {/* Accès & Parking */}
        <section className="mt-10">
          <SectionTitle icon={TruckIcon} id="acces">{t.access}</SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-serif text-xl text-foreground">{t.accessTitle}</h3>
              {accessText && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{accessText}</p>}
              {practical.access.address && <p className="mt-2 text-sm text-foreground">{practical.access.address}</p>}
              <div className="mt-4">
                <MapsButton href={mapsLink(practical.access.maps_url, practical.access.address || 'Riad Dar Soufa Rabat')} label={t.openMaps} />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-serif text-xl text-foreground">{t.parking}</h3>
              {parkingText || parkingInstr ? (
                <>
                  {parkingText && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{parkingText}</p>}
                  {parkingInstr && (
                    <div className="mt-3 rounded-xl bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{t.instructions}</p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">{parkingInstr}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.parkingAsk}</p>
              )}
            </div>
          </div>
        </section>

        {status === 'loading' && <p className="mt-10 text-center text-sm text-muted-foreground">{t.loading}</p>}

        <footer className="mt-12 text-center text-xs text-muted-foreground">{t.footer}</footer>
      </main>

      {/* WhatsApp */}
      {waOk && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color-mix(in_srgb,var(--background)_96%,transparent)] backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <a href={waHref} target="_blank" rel="noopener noreferrer"
            className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-lg active:scale-[0.98] transition">
            <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />{t.whatsapp}
          </a>
        </div>
      )}
    </div>
  );
}
