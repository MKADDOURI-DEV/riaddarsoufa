'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Room, ContactInfo } from '@/lib/data';
import GuideAdmin from './GuideAdmin';
import HomeAdmin from './HomeAdmin';
import type { HomeContent } from '@/lib/home';
import RiadAdmin from './RiadAdmin';
import { AMENITIES } from '@/lib/amenities';
import { TAXES } from '@/lib/pricing';
import type { OccupancyPrice } from '@/lib/data';
import type { RiadContent } from '@/lib/riad';
import { MultiImageField } from './ImageUpload';
import { DEFAULT_CONTENT, ROOMS_KEY, SERVICES_KEY, wrapItems, SiteContent, StoredService, loadContentRows, mergeContent } from '@/lib/content';

type Tab = 'rooms' | 'home' | 'riad' | 'services' | 'contact' | 'guide' | 'accounts';

const ICON_CHOICES: { value: string; label: string }[] = [
  { value: 'SparklesIcon', label: 'Étoiles' }, { value: 'StarIcon', label: 'Étoile' },
  { value: 'HeartIcon', label: 'Cœur' }, { value: 'GiftIcon', label: 'Cadeau' },
  { value: 'SunIcon', label: 'Soleil' }, { value: 'WifiIcon', label: 'Wi-Fi' },
  { value: 'TruckIcon', label: 'Transport' }, { value: 'CakeIcon', label: 'Repas / gâteau' },
  { value: 'MapIcon', label: 'Visites' }, { value: 'PhoneIcon', label: 'Téléphone' },
  { value: 'HomeModernIcon', label: 'Maison' }, { value: 'MusicalNoteIcon', label: 'Musique' },
  { value: 'BuildingStorefrontIcon', label: 'Boutique' }, { value: 'KeyIcon', label: 'Clé' },
  { value: 'ClockIcon', label: 'Horaires' }, { value: 'UserGroupIcon', label: 'Groupe' },
  { value: 'FireIcon', label: 'Feu' }, { value: 'ShieldCheckIcon', label: 'Sécurité' },
];

async function callAdmins(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('manage-admins', { body });
  if (error) {
    let msg = error.message;
    try {
      const j = await (error as unknown as { context: Response }).context.json();
      if (j?.error) msg = j.error;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}
type Tri = { fr: string; en: string; ar: string };

const inputCls =
  'w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent';
const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-1';

function TriField({
  label, value, onChange, multiline = false,
}: { label: string; value: Tri; onChange: (v: Tri) => void; multiline?: boolean }) {
  // Site bilingue : un champ français et un champ anglais (vide en anglais = le français s'affiche)
  const langs: { k: keyof Tri; flag: string; dir?: 'rtl' }[] = [{ k: 'fr', flag: 'FR' }, { k: 'en', flag: 'EN' }];
  return (
    <div className="mb-4">
      <span className={labelCls}>{label}</span>
      <div className="space-y-2">
        {langs.map(({ k, flag, dir }) => (
          <div key={k} className="flex items-start gap-2">
            {flag && <span className="mt-2 w-7 text-xs font-bold text-accent">{flag}</span>}
            {multiline ? (
              <textarea rows={4} dir={dir} className={inputCls} value={value?.[k] ?? ''}
                onChange={(e) => onChange({ ...value, [k]: e.target.value })} />
            ) : (
              <input dir={dir} className={inputCls} value={value?.[k] ?? ''}
                onChange={(e) => onChange({ ...value, [k]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `chambre-${Date.now()}`;
}

/* ------------------------------ Login ------------------------------ */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError('Email ou mot de passe incorrect.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-foreground/15 p-8 shadow-sm">
        <h1 className="font-serif text-2xl text-foreground mb-1">Espace propriétaire</h1>
        <p className="text-sm text-foreground/60 mb-6">Riad Dar Soufa — connexion</p>
        <label className={labelCls} htmlFor="email">Email</label>
        <input id="email" type="email" required autoComplete="username" className={`${inputCls} mb-4`}
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className={labelCls} htmlFor="password">Mot de passe</label>
        <input id="password" type="password" required autoComplete="current-password" className={`${inputCls} mb-4`}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600 mb-3" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

/* ---------------------------- Rooms editor ---------------------------- */
function RoomsEditor({ initial, onSave }: { initial: Room[]; onSave: (v: Room[]) => Promise<void> }) {
  const [rooms, setRooms] = useState<Room[]>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const update = (i: number, patch: Partial<Room>) =>
    setRooms((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const move = (i: number, d: -1 | 1) =>
    setRooms((rs) => {
      const j = i + d; if (j < 0 || j >= rs.length) return rs;
      const c = [...rs]; [c[i], c[j]] = [c[j], c[i]]; return c;
    });
  const clean = (list: Room[]) => list.map((r) => ({
    ...r,
    slug: slugify(r.slug || r.name.fr),
    pricePerNight: Number(r.pricePerNight) || 0,
    capacity: Number(r.capacity) || 1,
    size: Number(r.size) || 0,
    occupancyPrices: (r.occupancyPrices || []).map((p) => ({ guests: Number(p.guests) || 1, price: Number(p.price) || 0 })),
    amenityKeys: r.amenityKeys || [],
  }));

  /** Lignes de tarifs par nombre de personnes : de 2 personnes à la capacité de la chambre. */
  const occupancyRows = (capacity: number, current: OccupancyPrice[] = []): OccupancyPrice[] => {
    const rows: OccupancyPrice[] = [];
    for (let g = 2; g <= Math.max(2, Number(capacity) || 2); g++) {
      rows.push({ guests: g, price: current.find((p) => p.guests === g)?.price ?? 0 });
    }
    return rows;
  };
  const toggleAmenity = (i: number, key: string) =>
    setRooms((rs) => rs.map((r, idx) => {
      if (idx !== i) return r;
      const set = new Set(r.amenityKeys || []);
      if (set.has(key)) set.delete(key); else set.add(key);
      return { ...r, amenityKeys: AMENITIES.map((a) => a.key).filter((k) => set.has(k)) };
    }));

  // La suppression est enregistrée immédiatement (plus besoin de cliquer ensuite sur « Enregistrer »).
  const remove = async (i: number) => {
    if (rooms.length <= 1) { setMsg('Le site doit garder au moins une chambre.'); return; }
    if (!confirm(`Supprimer définitivement « ${rooms[i].name.fr} » du site ?`)) return;
    const next = clean(rooms.filter((_, idx) => idx !== i));
    setSaving(true); setMsg('');
    try { await onSave(next); setRooms(next); setMsg('Chambre supprimée. Le site est à jour.'); }
    catch (e) { setMsg('Échec de la suppression : ' + (e as Error).message); }
    setSaving(false);
  };
  const add = () =>
    setRooms((rs) => [...rs, {
      id: String(Date.now()), slug: `nouvelle-chambre-${rs.length + 1}`,
      name: { fr: 'Nouvelle chambre', en: 'Nouvelle chambre', ar: 'Nouvelle chambre' },
      shortDesc: { fr: '', en: '', ar: '' }, description: { fr: '', en: '', ar: '' },
      capacity: 2, bedType: { fr: 'Lit double', en: 'Lit double', ar: 'Lit double' },
      size: 0, pricePerNight: 0, images: rs[0]?.images?.slice(0, 1) ?? [],
      amenities: [], amenityKeys: rs[0]?.amenityKeys ?? [], occupancyPrices: [], available: true,
    }]);

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      const cleaned = clean(rooms);
      await onSave(cleaned); setRooms(cleaned); setMsg('Chambres enregistrées. Le site est à jour.');
    } catch (e) { setMsg('Échec de l’enregistrement : ' + (e as Error).message); }
    setSaving(false);
  };

  return (
    <div>
      {msg && <p className="mb-4 rounded-lg border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm" role="status">{msg}</p>}
      {rooms.map((r, i) => (
        <details key={r.id} className="mb-4 rounded-xl border border-foreground/15 p-4" open={i === 0}>
          <summary className="cursor-pointer font-semibold text-foreground">
            {i + 1}. {r.name.fr}{(r.occupancyPrices?.length ?? 0) > 0
              ? ` — ${r.occupancyPrices!.map((p) => `${p.guests} pers. : ${Number(p.price) > 0 ? Number(p.price).toLocaleString('fr-FR') + ' MAD' : 'à saisir'}`).join(' · ')}`
              : Number(r.pricePerNight) > 0 ? ` — ${Number(r.pricePerNight).toLocaleString('fr-FR')} MAD` : ''} {r.available ? '' : '(indisponible)'}
          </summary>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <button type="button" onClick={() => move(i, -1)} className="rounded border border-foreground/20 px-3 py-1 text-xs">Monter</button>
              <button type="button" onClick={() => move(i, 1)} className="rounded border border-foreground/20 px-3 py-1 text-xs">Descendre</button>
              <button type="button" disabled={saving} onClick={() => remove(i)} className="rounded border border-red-300 px-3 py-1 text-xs text-red-600 disabled:opacity-50">Supprimer cette chambre</button>
            </div>
            <TriField label="Nom" value={r.name} onChange={(v) => update(i, { name: v })} />
            <TriField label="Description courte" value={r.shortDesc} onChange={(v) => update(i, { shortDesc: v })} />
            <TriField label="Description complète" multiline value={r.description} onChange={(v) => update(i, { description: v })} />
            <TriField label="Type de lit" value={r.bedType} onChange={(v) => update(i, { bedType: v })} />
            <p className="mb-3 rounded-lg bg-foreground/5 px-3 py-2 text-xs text-foreground/70">
              Saisissez des <b>tarifs finaux tout compris</b> : petit-déjeuner, TVA {TAXES.tvaPercent} %, taxe communale ({TAXES.communale} MAD/pers./nuit) et taxe de promotion touristique ({TAXES.promotion} MAD/pers./nuit). Le site affiche ce prix sans aucun supplément.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div><label className={labelCls}>{(r.occupancyPrices?.length ?? 0) > 0 ? 'Prix / nuit (non utilisé : tarifs par personnes)' : 'Prix / nuit, 1 ou 2 pers. (MAD, 0 = non affiché)'}</label>
                <input type="number" min={0} disabled={(r.occupancyPrices?.length ?? 0) > 0} className={`${inputCls} disabled:opacity-50`} value={r.pricePerNight} onChange={(e) => update(i, { pricePerNight: Number(e.target.value) })} /></div>
              <div><label className={labelCls}>Capacité (personnes)</label>
                <input type="number" min={1} className={inputCls} value={r.capacity} onChange={(e) => {
                  const capacity = Number(e.target.value);
                  update(i, (r.occupancyPrices?.length ?? 0) > 0 ? { capacity, occupancyPrices: occupancyRows(capacity, r.occupancyPrices) } : { capacity });
                }} /></div>
              <div><label className={labelCls}>Surface (m², 0 = non affichée)</label>
                <input type="number" min={0} className={inputCls} value={r.size} onChange={(e) => update(i, { size: Number(e.target.value) })} /></div>
            </div>
            {/* Tarifs selon le nombre de personnes (chambre Patio : 2, 3 et 4 personnes) */}
            <div className="mb-4 rounded-xl border border-foreground/15 p-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <input type="checkbox" checked={(r.occupancyPrices?.length ?? 0) > 0}
                  onChange={(e) => update(i, { occupancyPrices: e.target.checked ? occupancyRows(r.capacity, r.occupancyPrices) : [] })} />
                Tarifs différents selon le nombre de personnes
              </label>
              {(r.occupancyPrices?.length ?? 0) > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {r.occupancyPrices!.map((p, k) => (
                    <div key={p.guests}>
                      <label className={labelCls}>{p.guests} personnes (MAD / nuit)</label>
                      <input type="number" min={0} className={inputCls} value={p.price}
                        onChange={(e) => update(i, { occupancyPrices: r.occupancyPrices!.map((x, j) => (j === k ? { ...x, price: Number(e.target.value) } : x)) })} />
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-foreground/60">Le site affiche « À partir de » le plus petit tarif, et le détail par nombre de personnes sur la fiche de la chambre. Pensez à paramétrer les mêmes tarifs dans Nozoul.</p>
            </div>

            {/* Équipements avec icônes */}
            <div className="mb-4">
              <span className={labelCls}>Équipements (affichés avec une icône)</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {AMENITIES.map((a) => {
                  const Icon = a.icon;
                  const on = (r.amenityKeys || []).includes(a.key);
                  return (
                    <label key={a.key} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${on ? 'border-primary bg-primary/5' : 'border-foreground/15'}`}>
                      <input type="checkbox" checked={on} onChange={() => toggleAmenity(i, a.key)} />
                      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {a.fr}
                    </label>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2 mb-4 text-sm text-foreground">
              <input type="checkbox" checked={r.available} onChange={(e) => update(i, { available: e.target.checked })} />
              Chambre disponible à la réservation
            </label>
            <MultiImageField bucket="site-images" label="Photos de la chambre" value={r.images} onChange={(images) => update(i, { images })} />
          </div>
        </details>
      ))}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button type="button" onClick={add} className="rounded-lg border border-foreground/20 px-4 py-2 text-sm">+ Ajouter une chambre</button>
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer les chambres'}</button>
      </div>
    </div>
  );
}

/* --------------------------- Services editor --------------------------- */
function ServicesEditor({ initial, onSave }: { initial: StoredService[]; onSave: (v: StoredService[]) => Promise<void> }) {
  const [items, setItems] = useState<StoredService[]>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const update = (i: number, patch: Partial<StoredService>) =>
    setItems((xs) => xs.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const add = () =>
    setItems((xs) => [...xs, {
      id: `svc-${Date.now()}`, icon: 'SparklesIcon', available: true,
      name: { fr: 'Nouveau service', en: 'Nouveau service', ar: 'Nouveau service' },
      description: { fr: '', en: '', ar: '' }, images: [],
    }]);
  const remove = (i: number) => {
    if (!confirm('Supprimer ce service ?')) return;
    setItems((xs) => xs.filter((_, idx) => idx !== i));
  };

  const save = async () => {
    setSaving(true); setMsg('');
    try { await onSave(items); setMsg('Services enregistrés. Le site est à jour.'); }
    catch (e) { setMsg('Échec de l’enregistrement : ' + (e as Error).message); }
    setSaving(false);
  };

  return (
    <div>
      <p className="text-sm text-foreground/60 mb-4">
        Modifiez, ajoutez ou supprimez vos services. N’oubliez pas d’enregistrer.
      </p>
      {items.map((s, i) => {
        return (
          <details key={s.id} className="mb-4 rounded-xl border border-foreground/15 p-4" open={i === 0}>
            <summary className="cursor-pointer font-semibold text-foreground">
              {s.name.fr}{!s.available ? ' — masqué' : ''}
            </summary>
            <div className="mt-4">
              <TriField label="Nom" value={s.name} onChange={(v) => update(i, { name: v })} />
              <TriField label="Description" multiline value={s.description} onChange={(v) => update(i, { description: v })} />
              {(
                <div className="mb-4">
                  <label className={labelCls}>Icône</label>
                  <select className={inputCls} value={s.icon === 'HomeIcon' ? 'HomeModernIcon' : (s.icon || 'SparklesIcon')} onChange={(e) => update(i, { icon: e.target.value })}>
                    {ICON_CHOICES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              )}
              <MultiImageField bucket="site-images" label="Photos du service" value={s.images || []}
                onChange={(images) => update(i, { images, image: undefined })} />
              <p className="-mt-2 mb-4 text-xs text-foreground/60">Les photos d’exemple de départ peuvent être retirées (bouton « Retirer ») et remplacées par les vôtres. Sans photo, le service s’affiche avec son icône. Avec plusieurs photos, les visiteurs peuvent les faire défiler. Pensez à « Enregistrer les services ».</p>
              <label className="flex items-center gap-2 text-sm text-foreground mb-3">
                <input type="checkbox" checked={s.available} onChange={(e) => update(i, { available: e.target.checked })} />
                Afficher ce service sur le site
              </label>
              {(
                <button type="button" onClick={() => remove(i)} className="rounded border border-red-300 px-3 py-1 text-xs text-red-600">Supprimer ce service</button>
              )}
            </div>
          </details>
        );
      })}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button type="button" onClick={add} className="rounded-lg border border-foreground/20 px-4 py-2 text-sm">+ Ajouter un service</button>
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer les services'}</button>
        {msg && <span className="text-sm" role="status">{msg}</span>}
      </div>
    </div>
  );
}

/* ---------------------------- Accounts editor ---------------------------- */
interface AdminAccount { id: string; email: string; last_sign_in_at: string | null }

function AccountsEditor() {
  const [accounts, setAccounts] = useState<AdminAccount[] | null>(null);
  const [me, setMe] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [myEmail, setMyEmail] = useState('');
  const [myPassword, setMyPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [edits, setEdits] = useState<Record<string, { email: string; password: string }>>({});

  const load = useCallback(async () => {
    try {
      const d = await callAdmins({ action: 'list' });
      setAccounts(d.admins); setMe(d.me);
      const mine = (d.admins as AdminAccount[]).find((a) => a.id === d.me);
      if (mine) setMyEmail(mine.email);
    } catch (e) { setMsg('Erreur : ' + (e as Error).message); setAccounts([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setMsg('');
    try { await fn(); } catch (e) { setMsg('Erreur : ' + (e as Error).message); }
    setBusy(false);
  };

  const mine = accounts?.find((a) => a.id === me);
  const others = (accounts || []).filter((a) => a.id !== me);

  // Mon compte : l'email actuel est pré-rempli ; on modifie puis on enregistre
  const saveMine = () => run(async () => {
    if (!mine) return;
    const emailChanged = myEmail.trim().toLowerCase() !== mine.email.toLowerCase();
    if (!emailChanged && !myPassword) { setMsg('Rien à modifier.'); return; }
    await callAdmins({
      action: 'update', id: mine.id,
      email: emailChanged ? myEmail.trim() : '',
      password: myPassword,
    });
    alert('Vos identifiants ont été modifiés. Vous allez être déconnecté : reconnectez-vous avec votre nouvel email et mot de passe.');
    await supabase.auth.signOut();
  });

  const removeMine = () => run(async () => {
    if (!mine) return;
    if (!confirm('Supprimer votre propre compte ? Vous serez déconnecté et ne pourrez plus vous connecter avec cet email.')) return;
    await callAdmins({ action: 'delete', id: mine.id });
    alert('Votre compte a été supprimé.');
    await supabase.auth.signOut();
  });

  const create = () => run(async () => {
    await callAdmins({ action: 'create', email: newEmail, password: newPassword });
    setNewEmail(''); setNewPassword(''); setMsg('Compte créé. Il peut se connecter immédiatement.'); await load();
  });

  const update = (a: AdminAccount) => run(async () => {
    const e = edits[a.id] || { email: '', password: '' };
    await callAdmins({ action: 'update', id: a.id, email: e.email.trim(), password: e.password });
    setEdits((x) => ({ ...x, [a.id]: { email: '', password: '' } }));
    setMsg('Compte modifié.'); await load();
  });

  const remove = (a: AdminAccount) => run(async () => {
    if (!confirm(`Supprimer le compte ${a.email} ?`)) return;
    await callAdmins({ action: 'delete', id: a.id });
    setMsg('Compte supprimé.'); await load();
  });

  if (!accounts) return <p className="text-sm">Chargement…</p>;

  return (
    <div>
      {/* ---- Mon compte ---- */}
      <section className="rounded-xl border border-foreground/15 p-4 mb-8">
        <h3 className="font-semibold text-foreground mb-1">Mon compte (email et mot de passe de connexion)</h3>
        <p className="text-xs text-foreground/60 mb-4">
          Modifiez l’email et/ou le mot de passe, puis cliquez sur « Enregistrer ». Vous serez déconnecté et devrez vous reconnecter avec les nouveaux identifiants.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelCls}>Email de connexion</label>
            <input type="email" autoComplete="off" className={inputCls} value={myEmail} onChange={(e) => setMyEmail(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Mot de passe</label>
            <div className="flex gap-2">
              <input type={showPwd ? 'text' : 'password'} autoComplete="new-password" className={inputCls}
                placeholder="•••••••• (inchangé)" value={myPassword} onChange={(e) => setMyPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="rounded-lg border border-foreground/20 px-3 text-sm">{showPwd ? 'Cacher' : 'Voir'}</button>
            </div>
            <p className="text-xs text-foreground/50 mt-1">« Voir » affiche ce que vous tapez. Le mot de passe actuel est chiffré et ne peut jamais être affiché : pour le changer, saisissez-en un nouveau (8 caractères minimum).</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy || !mine} onClick={saveMine} className="btn-primary text-sm disabled:opacity-50">Enregistrer</button>
          {accounts.length > 1 && (
            <button type="button" disabled={busy} onClick={removeMine} className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600">Supprimer mon compte</button>
          )}
        </div>
        {accounts.length <= 1 && (
          <p className="text-xs text-foreground/50 mt-3">C’est le seul compte admin : il ne peut pas être supprimé (au moins un compte doit rester).</p>
        )}
        {mine && <p className="text-xs text-foreground/50 mt-3">Dernière connexion : {mine.last_sign_in_at ? new Date(mine.last_sign_in_at).toLocaleString('fr-FR') : 'jamais'}</p>}
      </section>

      {/* ---- Autres comptes ---- */}
      <details className="rounded-xl border border-foreground/15 p-4">
        <summary className="cursor-pointer font-semibold text-foreground">
          Autres comptes admin ({others.length}) — ajouter ou gérer d’autres utilisateurs
        </summary>
        <div className="mt-4">
          {others.map((a) => {
            const e = edits[a.id] || { email: '', password: '' };
            const set = (patch: Partial<{ email: string; password: string }>) => setEdits((x) => ({ ...x, [a.id]: { ...e, ...patch } }));
            return (
              <div key={a.id} className="mb-4 rounded-xl border border-foreground/15 p-4">
                <p className="font-semibold text-foreground">{a.email}</p>
                <p className="text-xs text-foreground/50 mb-3">
                  Dernière connexion : {a.last_sign_in_at ? new Date(a.last_sign_in_at).toLocaleString('fr-FR') : 'jamais'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div><label className={labelCls}>Nouvel email</label>
                    <input type="email" autoComplete="off" className={inputCls} value={e.email} onChange={(ev) => set({ email: ev.target.value })} /></div>
                  <div><label className={labelCls}>Nouveau mot de passe</label>
                    <input type="password" autoComplete="new-password" className={inputCls} value={e.password} onChange={(ev) => set({ password: ev.target.value })} /></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy || (!e.email && !e.password)} onClick={() => update(a)} className="btn-primary text-sm disabled:opacity-50">Enregistrer</button>
                  <button type="button" disabled={busy} onClick={() => remove(a)} className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600">Supprimer ce compte</button>
                </div>
              </div>
            );
          })}

          <div className="rounded-xl border border-dashed border-foreground/25 p-4">
            <h3 className="font-semibold text-foreground mb-3">Ajouter un compte admin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div><label className={labelCls}>Email</label>
                <input type="email" autoComplete="off" className={inputCls} value={newEmail} onChange={(ev) => setNewEmail(ev.target.value)} /></div>
              <div><label className={labelCls}>Mot de passe</label>
                <input type="password" autoComplete="new-password" className={inputCls} value={newPassword} onChange={(ev) => setNewPassword(ev.target.value)} /></div>
            </div>
            <button type="button" disabled={busy || !newEmail || !newPassword} onClick={create} className="btn-primary text-sm disabled:opacity-50">Créer le compte</button>
          </div>
        </div>
      </details>
      {msg && <p className="mt-4 text-sm" role="status">{msg}</p>}
    </div>
  );
}

/* --------------------------- Contact editor --------------------------- */
function ContactEditor({ initial, onSave }: { initial: ContactInfo; onSave: (v: ContactInfo) => Promise<void> }) {
  const [c, setC] = useState<ContactInfo>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const set = (patch: Partial<ContactInfo>) => setC((x) => ({ ...x, ...patch }));

  const save = async () => {
    setSaving(true); setMsg('');
    try { await onSave(c); setMsg('Coordonnées enregistrées. Le site est à jour.'); }
    catch (e) { setMsg('Échec de l’enregistrement : ' + (e as Error).message); }
    setSaving(false);
  };

  const field = (label: string, key: keyof Omit<ContactInfo, 'address'>, hint?: string) => (
    <div className="mb-4">
      <label className={labelCls}>{label}</label>
      <input className={inputCls} value={c[key]} onChange={(e) => set({ [key]: e.target.value } as Partial<ContactInfo>)} />
      {hint && <p className="text-xs text-foreground/50 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div>
      {field('Téléphone', 'phone', 'Format international, ex : +212537000000')}
      {field('WhatsApp', 'whatsapp', 'Format international, ex : +212600000000')}
      {field('Email', 'email')}
      <TriField label="Adresse" value={c.address} onChange={(v) => set({ address: v })} />
      {field('Lien Google Maps', 'googleMapsUrl')}
      {field('Instagram (lien)', 'instagram')}
      {field('Facebook (lien)', 'facebook')}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer les coordonnées'}</button>
        {msg && <span className="text-sm" role="status">{msg}</span>}
      </div>
    </div>
  );
}

/* ------------------------------- Dashboard ------------------------------- */
function Dashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>('rooms');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadError, setLoadError] = useState('');

  const reload = useCallback(async () => {
    const rows = await loadContentRows();
    if (!rows) { setLoadError('Impossible de charger le contenu.'); setContent(DEFAULT_CONTENT); return; }
    setContent(mergeContent(rows));
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const saveKey = async (key: typeof ROOMS_KEY | typeof SERVICES_KEY | 'contact', value: unknown) => {
    let stored = key === 'contact' ? value : wrapItems(value as unknown[]);
    if (key === 'contact') {
      // La ligne « contact » contient aussi la page « Le Riad » (champ riad) :
      // on repart de la version en base pour ne jamais écraser l'autre partie.
      const { data: cur } = await supabase.from('site_content').select('value').eq('key', 'contact').maybeSingle();
      const base = cur?.value && typeof cur.value === 'object' ? cur.value as Record<string, unknown> : {};
      stored = { ...base, ...(value as Record<string, unknown>) };
    }
    const { error } = await supabase.from('site_content').upsert({ key, value: stored, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  };
  /** Enregistre la page « Le Riad » dans la ligne « contact » (champ riad). */
  const saveRiad = async (riad: RiadContent) => {
    await saveKey('contact', { riad });
    setContent((c) => (c ? { ...c, riad } : c));
  };

  /** Enregistre les textes de l'accueil dans la ligne « contact » (champ home). */
  const saveHome = async (home: HomeContent) => {
    await saveKey('contact', { home });
    setContent((c) => (c ? { ...c, home } : c));
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'rooms', label: 'Chambres & prix' },
    { id: 'home', label: 'Accueil' },
    { id: 'riad', label: 'Le Riad' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
    { id: 'guide', label: 'Guide d’accueil' },
    { id: 'accounts', label: 'Mon compte' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-foreground/15 px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-xl">Espace propriétaire — Riad Dar Soufa</h1>
            <p className="text-xs text-foreground/60">{session.user.email}</p>
          </div>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-foreground/20 px-3 py-2 text-sm">Voir le site</a>
            <button type="button" onClick={() => supabase.auth.signOut()} className="rounded-lg border border-foreground/20 px-3 py-2 text-sm">Se déconnecter</button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border ${tab === t.id ? 'bg-primary text-primary-foreground border-primary' : 'border-foreground/20'}`}>
              {t.label}
            </button>
          ))}
        </div>
        {loadError && <p className="text-sm text-red-600 mb-4">{loadError}</p>}
        {!content ? <p className="text-sm">Chargement…</p> : (
          <>
            {tab === 'rooms' && <RoomsEditor key="r" initial={content.rooms} onSave={(v) => saveKey(ROOMS_KEY, v)} />}
            {tab === 'services' && (
              <ServicesEditor key="s"
                initial={content.services.map(({ id, name, description, available, icon, images }) => ({ id, name, description, available, icon, images: images || [] }))}
                onSave={(v) => saveKey(SERVICES_KEY, v)} />
            )}
            {tab === 'home' && <HomeAdmin key="home" initial={content.home} onSave={saveHome} />}
            {tab === 'riad' && <RiadAdmin key="riad" initial={content.riad} onSave={saveRiad} />}
            {tab === 'guide' && <GuideAdmin key="g" />}
            {tab === 'accounts' && <AccountsEditor key="a" />}
            {tab === 'contact' && <ContactEditor key="c" initial={content.contact} onSave={(v) => saveKey('contact', v)} />}
          </>
        )}
      </main>
    </div>
  );
}

/* -------------------------------- Root -------------------------------- */
export default function AdminClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.rpc('is_admin').then(({ data, error }) => setIsAdmin(!error && data === true));
  }, [session]);

  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!session) return <Login />;
  if (isAdmin === null) return <div className="min-h-screen bg-background flex items-center justify-center text-sm">Vérification…</div>;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-foreground">Ce compte n’a pas accès à l’administration.</p>
        <button type="button" onClick={() => supabase.auth.signOut()} className="rounded-lg border border-foreground/20 px-4 py-2 text-sm">Se déconnecter</button>
      </div>
    );
  }
  return <Dashboard session={session} />;
}
