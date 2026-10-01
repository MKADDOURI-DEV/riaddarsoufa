'use client';
import React, { useState } from 'react';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { formatPhone, telHref, waDigits } from '@/lib/content';

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  message?: string;
}

function ContactContent() {
  const { t, lang, dir, contact } = useSite();
  const [formData, setFormData] = useState<FormData>({
    nom: '', prenom: '', email: '', telephone: '', sujet: '', message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nom.trim()) newErrors.nom = '* Requis';
    if (!formData.prenom.trim()) newErrors.prenom = '* Requis';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '* Email invalide';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = '* Message trop court (min. 10 caractères)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const contactItems = [
  {
    icon: '📍',
    label: t.contact.address,
    value: contact.address[lang],
    href: contact.googleMapsUrl
  },
  {
    icon: '📞',
    label: t.contact.phone,
    value: formatPhone(contact.phone),
    href: telHref(contact.phone)
  },
  {
    icon: '💬',
    label: t.contact.whatsapp,
    value: formatPhone(contact.whatsapp),
    href: `https://wa.me/${waDigits(contact.whatsapp)}`
  },
  {
    icon: '✉️',
    label: t.contact.email,
    value: contact.email,
    href: `mailto:${contact.email}`
  }];


  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main>
        {/* Page Hero */}
        <section className="relative h-64 sm:h-72 flex items-end pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_16a2fea2e-1777571622535.png"
              alt="Porte en bois sculptée d'un riad marocain traditionnel dans la médina, détails architecturaux, lumière dorée tamisée, tons sombres"
              fill
              priority
              className="object-cover"
              sizes="100vw" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent mb-3 block">Riad Dar Soufa</span>
            <h1 className="font-serif text-display text-white">{t.contact.title}</h1>
            <p className="text-white/70 mt-2">{t.contact.subtitle}</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Left: Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Info Cards */}
              <div className="space-y-4">
                {contactItems.map((item, i) =>
                <a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-accent hover:-translate-y-0.5 transition-all duration-200 group">
                  
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-lg group-hover:bg-accent/20 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{item.label}</div>
                      <div className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{item.value}</div>
                    </div>
                  </a>
                )}
              </div>

              {/* Map Section */}
              <div className="space-y-4">
                <h2 className="font-serif text-xl text-foreground">{t.contact.location}</h2>
                <div className="rounded-2xl overflow-hidden border border-border relative h-48 bg-muted">
                  <AppImage
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_1e44a46b4-1772901751465.png"
                    alt="Vue aérienne de la médina de Rabat, Maroc, avec ses ruelles et architecture traditionnelle, lumière naturelle du jour"
                    fill
                    className="object-cover opacity-70"
                    sizes="(max-width: 1024px) 100vw, 40vw" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-card/90 backdrop-blur-sm rounded-xl px-4 py-3 text-center shadow-lg border border-border">
                      <div className="text-lg mb-1">📍</div>
                      <div className="font-semibold text-sm text-foreground">Riad Dar Soufa</div>
                      <div className="text-xs text-muted-foreground">Médina de Rabat</div>
                    </div>
                  </div>
                </div>
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-sm">
                  
                  🗺️ {t.contact.openMaps}
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                {submitted ?
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl">
                      ✅
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">Message envoyé !</h3>
                    <p className="text-muted-foreground max-w-sm leading-relaxed">{t.contact.formSuccess}</p>
                    <button
                    onClick={() => {setSubmitted(false);setFormData({ nom: '', prenom: '', email: '', telephone: '', sujet: '', message: '' });}}
                    className="btn-primary mt-4">
                    
                      Nouveau message
                    </button>
                  </div> :

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nom */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                          {t.contact.formName} <span className="text-red-400">*</span>
                        </label>
                        <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className={`form-input ${errors.nom ? 'border-red-400' : ''}`}
                        placeholder="Benali"
                        aria-label={t.contact.formName} />
                      
                        {errors.nom && <p className="text-red-400 text-xs">{errors.nom}</p>}
                      </div>

                      {/* Prénom */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                          {t.contact.formFirstname} <span className="text-red-400">*</span>
                        </label>
                        <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className={`form-input ${errors.prenom ? 'border-red-400' : ''}`}
                        placeholder="Youssef"
                        aria-label={t.contact.formFirstname} />
                      
                        {errors.prenom && <p className="text-red-400 text-xs">{errors.prenom}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        {t.contact.formEmail} <span className="text-red-400">*</span>
                      </label>
                      <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                      placeholder="youssef@email.com"
                      aria-label={t.contact.formEmail} />
                    
                      {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        {t.contact.formPhone}
                      </label>
                      <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+212 6XX XXX XXX"
                      aria-label={t.contact.formPhone} />
                    
                    </div>

                    {/* Sujet */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        {t.contact.formSubject}
                      </label>
                      <select
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleChange}
                      className="form-input"
                      aria-label={t.contact.formSubject}>
                      
                        <option value="">— Sélectionner —</option>
                        <option value="reservation">Réservation</option>
                        <option value="information">Demande d&apos;information</option>
                        <option value="tarifs">Tarifs et disponibilités</option>
                        <option value="evenement">Événement privé</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        {t.contact.formMessage} <span className="text-red-400">*</span>
                      </label>
                      <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`form-input resize-none ${errors.message ? 'border-red-400' : ''}`}
                      placeholder={dir === 'rtl' ? 'اكتب رسالتك هنا...' : 'Écrivez votre message ici...'}
                      aria-label={t.contact.formMessage} />
                    
                      {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed">
                    
                      {loading ?
                    <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t.common.loading}
                        </span> :
                    t.contact.formSend}
                    </button>
                  </form>
                }
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>);

}

export default function ContactClient() {
  return (
    <SiteProvider>
      <ContactContent />
    </SiteProvider>);

}