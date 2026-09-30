'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AppImage from '@/components/ui/AppImage';
import { useSite } from '@/context/SiteContext';
import { ROOMS, Room } from '@/lib/data';

type BookingStep = 'search' | 'results' | 'form' | 'confirmation';

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

function BookingContent() {
  const { t, lang, dir } = useSite();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<BookingStep>('search');
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [dateError, setDateError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '', lastName: '', email: '', phone: '', specialRequests: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<BookingFormData>>({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmationRef, setConfirmationRef] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const arrivalParam = searchParams.get('arrival');
    const departureParam = searchParams.get('departure');
    const adultsParam = searchParams.get('adults');
    const childrenParam = searchParams.get('children');
    const roomsParam = searchParams.get('rooms');
    const roomSlug = searchParams.get('room');

    if (arrivalParam) setArrival(arrivalParam);
    if (departureParam) setDeparture(departureParam);
    if (adultsParam) setAdults(parseInt(adultsParam));
    if (childrenParam) setChildren(parseInt(childrenParam));
    if (roomsParam) setRooms(parseInt(roomsParam));

    if (roomSlug) {
      const found = ROOMS.find(r => r.slug === roomSlug);
      if (found) {
        setSelectedRoom(found);
        if (arrivalParam) setStep('form');
        else setStep('search');
      }
    } else if (arrivalParam && departureParam) {
      setStep('results');
    }
  }, [searchParams]);

  const getNights = (): number => {
    if (!arrival || !departure) return 1;
    const a = new Date(arrival);
    const d = new Date(departure);
    const diff = Math.ceil((d.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const handleSearch = () => {
    setDateError('');
    if (!arrival) { setDateError(t.booking.errorArrival); return; }
    if (departure && departure <= arrival) { setDateError(t.booking.errorDates); return; }
    setStep('results');
  };

  const availableRooms = ROOMS.filter(r => r.available);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setStep('form');
  };

  const validateForm = (): boolean => {
    const errors: Partial<BookingFormData> = {};
    if (!formData.firstName.trim()) errors.firstName = '* Requis';
    if (!formData.lastName.trim()) errors.lastName = '* Requis';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '* Email invalide';
    }
    if (!formData.phone.trim()) errors.phone = '* Requis';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setBookingLoading(true);
    setTimeout(() => {
      const ref = `RDS-${Date.now().toString(36).toUpperCase().slice(-8)}`;
      setConfirmationRef(ref);
      setBookingLoading(false);
      setStep('confirmation');
    }, 1500);
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-GB' : 'fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-primary text-primary-foreground py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent/80 block mb-3">Riad Dar Soufa</span>
            <h1 className="font-serif text-display text-primary-foreground">{t.booking.title}</h1>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-card border-b border-border px-4 py-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { key: 'search', label: dir === 'rtl' ? 'البحث' : 'Recherche' },
                { key: 'results', label: dir === 'rtl' ? 'النتائج' : 'Résultats' },
                { key: 'form', label: dir === 'rtl' ? 'التفاصيل' : 'Vos détails' },
                { key: 'confirmation', label: dir === 'rtl' ? 'تأكيد' : 'Confirmation' },
              ].map((s, i, arr) => {
                const steps: BookingStep[] = ['search', 'results', 'form', 'confirmation'];
                const currentIdx = steps.indexOf(step);
                const stepIdx = steps.indexOf(s.key as BookingStep);
                const isActive = s.key === step;
                const isDone = stepIdx < currentIdx;
                return (
                  <React.Fragment key={s.key}>
                    <div className={`flex items-center gap-2 flex-shrink-0 ${isActive ? 'text-primary' : isDone ? 'text-accent' : 'text-muted-foreground'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isActive ? 'bg-primary text-primary-foreground border-primary' :
                        isDone ? 'bg-accent text-accent-foreground border-accent': 'border-border'
                      }`}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      <span className="text-xs font-semibold whitespace-nowrap">{s.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`flex-1 h-px min-w-4 ${stepIdx < currentIdx ? 'bg-accent' : 'bg-border'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* STEP 1: Search */}
          {step === 'search' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
                <h2 className="font-serif text-2xl text-foreground">{dir === 'rtl' ? 'اختر تواريخ إقامتك' : 'Choisissez vos dates'}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">{t.booking.arrival}</label>
                    <input
                      type="date"
                      value={arrival}
                      min={today}
                      onChange={e => setArrival(e.target.value)}
                      className="form-input"
                      aria-label={t.booking.arrival}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">{t.booking.departure}</label>
                    <input
                      type="date"
                      value={departure}
                      min={arrival || today}
                      onChange={e => setDeparture(e.target.value)}
                      className="form-input"
                      aria-label={t.booking.departure}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: t.booking.adults, value: adults, set: setAdults, min: 1, max: 8 },
                    { label: t.booking.children, value: children, set: setChildren, min: 0, max: 6 },
                    { label: t.booking.rooms, value: rooms, set: setRooms, min: 1, max: 4 },
                  ].map((field, i) => (
                    <div key={i} className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">{field.label}</label>
                      <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card h-10">
                        <button onClick={() => field.set(Math.max(field.min, field.value - 1))} className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-bold">−</button>
                        <span className="flex-1 text-center text-sm font-semibold text-foreground">{field.value}</span>
                        <button onClick={() => field.set(Math.min(field.max, field.value + 1))} className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-bold">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {dateError && <p className="text-red-500 text-sm">{dateError}</p>}

                <button onClick={handleSearch} className="btn-primary w-full text-base py-4">
                  {t.booking.search} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Results */}
          {step === 'results' && (
            <div className="space-y-8">
              {/* Stay Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-wrap gap-6 items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{t.booking.yourStay}</div>
                  <div className="font-serif text-lg text-foreground">
                    {formatDate(arrival)} → {formatDate(departure)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {getNights()} {t.booking.nights} · {adults + children} {t.booking.guests} · {rooms} {t.booking.rooms.toLowerCase()}
                  </div>
                </div>
                <button
                  onClick={() => setStep('search')}
                  className="btn-secondary text-sm"
                >
                  ← {dir === 'rtl' ? 'تعديل' : 'Modifier'}
                </button>
              </div>

              {/* Available Rooms */}
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">{t.booking.results}</h2>
                {availableRooms.length === 0 ? (
                  <p className="text-muted-foreground text-center py-12">{t.booking.noResults}</p>
                ) : (
                  <div className="space-y-6">
                    {availableRooms.map(room => (
                      <div key={room.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-accent transition-all duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                          <div className="img-hover relative h-48 sm:h-full overflow-hidden">
                            <AppImage
                              src={room.images[0]}
                              alt={`${room.name[lang]} — photo de la chambre disponible au Riad Dar Soufa`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                          </div>
                          <div className="sm:col-span-2 p-6 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <h3 className="font-serif text-xl text-foreground">{room.name[lang]}</h3>
                                {room.tag && (
                                  <span className="text-xs bg-accent/10 text-accent font-semibold px-2 py-1 rounded-full flex-shrink-0">
                                    {room.tag[lang]}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{room.shortDesc[lang]}</p>
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>👤 {room.capacity} {t.rooms.persons}</span>
                                <span>🛏️ {room.bedType[lang]}</span>
                                <span>📐 {room.size} {t.rooms.sqm}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.slice(0, 4).map((a, i) => (
                                  <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                    {a[lang]}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-border">
                              <div>
                                <span className="font-bold text-2xl text-accent">{(room.pricePerNight * getNights()).toLocaleString()}</span>
                                <span className="text-muted-foreground text-sm"> {t.common.mad}</span>
                                <div className="text-xs text-muted-foreground">{room.pricePerNight.toLocaleString()} {t.common.mad} × {getNights()} {t.booking.nights}</div>
                              </div>
                              <button
                                onClick={() => handleSelectRoom(room)}
                                className="btn-primary"
                              >
                                {t.booking.bookNow}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Booking Form */}
          {step === 'form' && selectedRoom && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Form */}
              <div className="lg:col-span-3">
                <h2 className="font-serif text-2xl text-foreground mb-6">
                  {dir === 'rtl' ? 'معلوماتك الشخصية' : 'Vos informations'}
                </h2>
                <form onSubmit={handleBookingSubmit} className="space-y-5 bg-card border border-border rounded-2xl p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        {t.contact.formFirstname} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                        className={`form-input ${formErrors.firstName ? 'border-red-400' : ''}`}
                        placeholder="Youssef"
                        aria-label={t.contact.formFirstname}
                      />
                      {formErrors.firstName && <p className="text-red-400 text-xs">{formErrors.firstName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        {t.contact.formName} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                        className={`form-input ${formErrors.lastName ? 'border-red-400' : ''}`}
                        placeholder="Benali"
                        aria-label={t.contact.formName}
                      />
                      {formErrors.lastName && <p className="text-red-400 text-xs">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      {t.contact.formEmail} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className={`form-input ${formErrors.email ? 'border-red-400' : ''}`}
                      placeholder="youssef@email.com"
                      aria-label={t.contact.formEmail}
                    />
                    {formErrors.email && <p className="text-red-400 text-xs">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      {t.contact.formPhone} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className={`form-input ${formErrors.phone ? 'border-red-400' : ''}`}
                      placeholder="+212 6XX XXX XXX"
                      aria-label={t.contact.formPhone}
                    />
                    {formErrors.phone && <p className="text-red-400 text-xs">{formErrors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      {dir === 'rtl' ? 'طلبات خاصة' : 'Demandes spéciales'}
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={e => setFormData(p => ({ ...p, specialRequests: e.target.value }))}
                      rows={3}
                      className="form-input resize-none"
                      placeholder={dir === 'rtl' ? 'أي طلبات خاصة...' : 'Allergies, préférences, heure d\'arrivée...'}
                      aria-label="Demandes spéciales"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('results')}
                      className="btn-secondary flex-1"
                    >
                      ← {dir === 'rtl' ? 'رجوع' : 'Retour'}
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="btn-primary flex-1 disabled:opacity-60"
                    >
                      {bookingLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          {t.common.loading}
                        </span>
                      ) : (dir === 'rtl' ? 'تأكيد الحجز' : 'Confirmer la réservation')}
                    </button>
                  </div>
                </form>
              </div>

              {/* Summary */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                  <div className="img-hover relative h-40 overflow-hidden">
                    <AppImage
                      src={selectedRoom.images[0]}
                      alt={`${selectedRoom.name[lang]} — résumé de réservation`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                  <div className="p-5 space-y-4">
                    <h3 className="font-serif text-lg text-foreground">{selectedRoom.name[lang]}</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.booking.arrival}</span>
                        <span className="font-medium text-foreground">{formatDate(arrival)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.booking.departure}</span>
                        <span className="font-medium text-foreground">{formatDate(departure)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.booking.nights}</span>
                        <span className="font-medium text-foreground">{getNights()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.booking.guests}</span>
                        <span className="font-medium text-foreground">{adults + children}</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">
                          {selectedRoom.pricePerNight.toLocaleString()} × {getNights()} {t.booking.nights}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mt-2">
                        <span className="font-bold text-foreground">{dir === 'rtl' ? 'المجموع' : 'Total'}</span>
                        <span className="font-bold text-2xl text-accent">
                          {(selectedRoom.pricePerNight * getNights()).toLocaleString()} {t.common.mad}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{dir === 'rtl' ? 'الفطور مشمول' : 'Petit-déjeuner inclus'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 'confirmation' && selectedRoom && (
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-4xl mx-auto">
                  ✅
                </div>
                <div>
                  <h2 className="font-serif text-3xl text-foreground mb-2">
                    {dir === 'rtl' ? 'تم تأكيد حجزك!' : 'Réservation confirmée !'}
                  </h2>
                  <p className="text-muted-foreground">
                    {dir === 'rtl' ? 'شكراً لاختيارك رياض دار صوفة' : 'Merci pour votre confiance, nous avons hâte de vous accueillir.'}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-5 text-left space-y-3">
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      {dir === 'rtl' ? 'رقم الحجز' : 'Référence de réservation'}
                    </div>
                    <div className="font-mono text-2xl font-bold text-accent">{confirmationRef}</div>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{dir === 'rtl' ? 'الغرفة' : 'Chambre'}</span>
                      <span className="font-semibold text-foreground">{selectedRoom.name[lang]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.booking.arrival}</span>
                      <span className="font-semibold text-foreground">{formatDate(arrival)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.booking.departure}</span>
                      <span className="font-semibold text-foreground">{formatDate(departure)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{dir === 'rtl' ? 'المجموع' : 'Total'}</span>
                      <span className="font-bold text-accent">{(selectedRoom.pricePerNight * getNights()).toLocaleString()} {t.common.mad}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {dir === 'rtl'
                    ? `سيتم إرسال تأكيد إلى ${formData.email}`
                    : `Un email de confirmation sera envoyé à ${formData.email}`}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/" className="btn-secondary flex-1">
                    {dir === 'rtl' ? 'الرئيسية' : 'Retour à l\'accueil'}
                  </Link>
                  <a
                    href={`https://wa.me/212600000000?text=${encodeURIComponent(`Bonjour, j'ai une réservation confirmée ${confirmationRef}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent flex-1"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function BookingClient() {
  return (
    <SiteProvider>
      <BookingContent />
    </SiteProvider>
  );
}