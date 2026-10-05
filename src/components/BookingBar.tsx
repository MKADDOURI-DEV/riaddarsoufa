'use client';
import React, { useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useSite } from '@/context/SiteContext';
import {
  MAX_ADULTS, MAX_CHILDREN, MAX_CHILD_AGE, StaySearch, buildNozoulUrl, isoDate,
} from '@/lib/nozoul';

const L = {
  fr: {
    checkIn: 'Arrivée', checkOut: 'Départ', adults: 'Adultes', children: 'Enfants',
    childAge: 'Âge enfant', years: 'ans', lessThanOne: 'Moins de 1 an', search: 'Réserver',
    agesTitle: 'Âge des enfants à la date du séjour',
    errorIn: 'Choisissez une date d’arrivée.', errorOut: 'Choisissez une date de départ après la date d’arrivée.',
    errorAge: 'Indiquez l’âge de chaque enfant.',
  },
  en: {
    checkIn: 'Check-in', checkOut: 'Check-out', adults: 'Adults', children: 'Children',
    childAge: 'Child age', years: 'yrs', lessThanOne: 'Under 1', search: 'Book now',
    agesTitle: 'Children’s age on the day of the stay',
    errorIn: 'Please choose a check-in date.', errorOut: 'Please choose a check-out date after the check-in date.',
    errorAge: 'Please enter the age of each child.',
  },
  ar: {
    checkIn: 'الوصول', checkOut: 'المغادرة', adults: 'البالغون', children: 'الأطفال',
    childAge: 'عمر الطفل', years: 'سنة', lessThanOne: 'أقل من سنة', search: 'احجز',
    agesTitle: 'عمر الأطفال يوم الإقامة',
    errorIn: 'يرجى اختيار تاريخ الوصول.', errorOut: 'يرجى اختيار تاريخ مغادرة بعد تاريخ الوصول.',
    errorAge: 'يرجى تحديد عمر كل طفل.',
  },
};

export interface BookingFormState extends StaySearch {
  childrenAges: number[]; // -1 = âge non renseigné
}

export function useBookingForm(initial?: Partial<StaySearch>) {
  const [form, setForm] = useState<BookingFormState>({
    checkIn: initial?.checkIn || '',
    checkOut: initial?.checkOut || '',
    adults: initial?.adults || 2,
    children: initial?.children || 0,
    childrenAges: initial?.childrenAges?.length ? initial.childrenAges : [],
  });
  const [error, setError] = useState('');
  return { form, setForm, error, setError };
}

/** Vérifie la saisie puis envoie le client sur le moteur Nozoul. Renvoie false en cas d'erreur. */
export function goToNozoul(
  form: BookingFormState,
  setError: (e: string) => void,
  lang: 'fr' | 'en' | 'ar',
): boolean {
  const t = L[lang];
  if (!form.checkIn) { setError(t.errorIn); return false; }
  if (!form.checkOut || form.checkOut <= form.checkIn) { setError(t.errorOut); return false; }
  const ages = form.childrenAges.slice(0, form.children);
  if (ages.length < form.children || ages.some((a) => a < 0)) { setError(t.errorAge); return false; }
  setError('');
  window.location.href = buildNozoulUrl({ ...form, childrenAges: ages, lang });
  return true;
}

function Stepper({
  label, value, min, max, onChange,
}: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">{label}</span>
      <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card h-[46px]">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-11 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30"
          aria-label={`${label} -1`}>
          <MinusIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="flex-1 text-center text-base font-semibold text-foreground" aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="w-11 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30"
          aria-label={`${label} +1`}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

interface BookingBarProps {
  /** Formulaire partagé (page Réservation). Sinon la barre gère son propre état. */
  state?: ReturnType<typeof useBookingForm>;
  className?: string;
}

export default function BookingBar({ state, className = '' }: BookingBarProps) {
  const { lang, dir } = useSite();
  const own = useBookingForm();
  const { form, setForm, error, setError } = state || own;
  const t = L[lang];
  const today = isoDate(0);

  const set = (patch: Partial<BookingFormState>) => { setError(''); setForm((f) => ({ ...f, ...patch })); };

  const setChildren = (n: number) => {
    const ages = [...form.childrenAges];
    while (ages.length < n) ages.push(-1);
    set({ children: n, childrenAges: ages.slice(0, n) });
  };
  const setAge = (i: number, age: number) => {
    const ages = [...form.childrenAges]; ages[i] = age; set({ childrenAges: ages });
  };
  const setCheckIn = (v: string) => {
    const patch: Partial<BookingFormState> = { checkIn: v };
    if (v && (!form.checkOut || form.checkOut <= v)) patch.checkOut = isoDate(1, v);
    set(patch);
  };

  const submit = (e: React.FormEvent) => { e.preventDefault(); goToNozoul(form, setError, lang); };

  return (
    <form dir={dir} onSubmit={submit} className={`w-full ${className}`} aria-label={t.search}>
      <div className="bg-card booking-bar-shadow rounded-2xl p-4 sm:p-5 border border-border">
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_0.85fr_0.85fr_auto] gap-3 lg:gap-4 items-end">
          <label className="space-y-1 block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">{t.checkIn}</span>
            <input type="date" required value={form.checkIn} min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className="form-input h-[46px] w-full font-medium text-foreground" />
          </label>
          <label className="space-y-1 block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">{t.checkOut}</span>
            <input type="date" required value={form.checkOut} min={form.checkIn ? isoDate(1, form.checkIn) : isoDate(1)}
              onChange={(e) => set({ checkOut: e.target.value })}
              className="form-input h-[46px] w-full font-medium text-foreground" />
          </label>
          <Stepper label={t.adults} value={form.adults} min={1} max={MAX_ADULTS} onChange={(v) => set({ adults: v })} />
          <Stepper label={t.children} value={form.children} min={0} max={MAX_CHILDREN} onChange={setChildren} />
          <button type="submit" className="btn-primary col-span-2 lg:col-span-1 h-[46px] px-8 text-sm font-bold tracking-wide">
            {t.search}
          </button>
        </div>

        {form.children > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{t.agesTitle}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: form.children }).map((_, i) => (
                <label key={i} className="space-y-1 block">
                  <span className="text-xs text-muted-foreground block">{t.childAge} {i + 1}</span>
                  <select required value={form.childrenAges[i] ?? -1}
                    onChange={(e) => setAge(i, Number(e.target.value))}
                    className="form-input h-[42px] w-full text-sm text-foreground">
                    <option value={-1} disabled>--</option>
                    {Array.from({ length: MAX_CHILD_AGE + 1 }).map((__, a) => (
                      <option key={a} value={a}>{a === 0 ? t.lessThanOne : `${a} ${t.years}`}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mt-3 font-medium" role="alert">{error}</p>}
      </div>
    </form>
  );
}
