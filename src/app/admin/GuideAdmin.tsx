'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ImageField as UploadField } from './ImageUpload';
import {
  DEFAULT_PRACTICAL, DEFAULT_WELCOME, DEFAULT_WHATSAPP, GuidePlace, GuideService, GuidePractical,
  GuideWelcome, GuideWhatsapp, mergeSettings, whatsappHref,
} from '@/lib/guide';

const inputCls =
  'w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent';
const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-1';

type Sub = 'practical' | 'services' | 'places' | 'whatsapp' | 'settings';

/* ------------------------------ helpers ------------------------------ */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-xs text-foreground/50 mt-1">{hint}</p>}
    </div>
  );
}

function BiField({
  label, fr, en, onChange, multiline = false,
}: { label: string; fr: string; en: string; onChange: (v: { fr: string; en: string }) => void; multiline?: boolean }) {
  // Guide en français uniquement : seul le champ FR est affiché.
  const rows: { k: 'fr' | 'en'; flag: string; v: string }[] = [{ k: 'fr', flag: '', v: fr }];
  return (
    <div className="mb-4">
      <span className={labelCls}>{label}</span>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.k} className="flex items-start gap-2">
            {r.flag && <span className="mt-2 w-7 text-xs font-bold text-accent">{r.flag}</span>}
            {multiline ? (
              <textarea rows={3} className={inputCls} value={r.v} onChange={(e) => onChange({ fr, en, [r.k]: e.target.value })} />
            ) : (
              <input className={inputCls} value={r.v} onChange={(e) => onChange({ fr, en, [r.k]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SaveBar({ onSave, saving, msg, label = 'Enregistrer' }: { onSave: () => void; saving: boolean; msg: string; label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      <button type="button" onClick={onSave} disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Enregistrement…' : label}
      </button>
      {msg && <span className="text-sm" role="status">{msg}</span>}
    </div>
  );
}

async function saveSetting(key: 'welcome' | 'practical' | 'whatsapp', value: unknown) {
  const { error } = await supabase.from('guide_settings').upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

function useSettings() {
  const [s, setS] = useState<{ welcome: GuideWelcome; practical: GuidePractical; whatsapp: GuideWhatsapp } | null>(null);
  useEffect(() => {
    supabase.from('guide_settings').select('key, value').then(({ data }) => setS(mergeSettings(data)));
  }, []);
  return [s, setS] as const;
}

/* --------------------------- Infos pratiques --------------------------- */
function PracticalEditor() {
  const [all, setAll] = useSettings();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  if (!all) return <p className="text-sm">Chargement…</p>;
  const p = all.practical;
  const set = (patch: Partial<GuidePractical>) => setAll({ ...all, practical: { ...p, ...patch } });

  const save = async () => {
    setSaving(true); setMsg('');
    try { await saveSetting('practical', p); setMsg('Enregistré. Visible tout de suite sur /guide.'); }
    catch (e) { setMsg('Erreur : ' + (e as Error).message); }
    setSaving(false);
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Horaires généraux du riad</h3>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Check-in (à partir de)"><input type="time" className={inputCls} value={p.checkin} onChange={(e) => set({ checkin: e.target.value })} /></Field>
        <Field label="Check-out (avant)"><input type="time" className={inputCls} value={p.checkout} onChange={(e) => set({ checkout: e.target.value })} /></Field>
      </div>

      <h3 className="font-semibold mt-6 mb-3">Wi-Fi</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nom du réseau"><input className={inputCls} value={p.wifi_name} onChange={(e) => set({ wifi_name: e.target.value })} /></Field>
        <Field label="Mot de passe Wi-Fi"><input className={inputCls} value={p.wifi_password} onChange={(e) => set({ wifi_password: e.target.value })} /></Field>
      </div>

      <h3 className="font-semibold mt-6 mb-3">Accès</h3>
      <BiField label="Description (comment venir)" multiline fr={p.access.description_fr} en={p.access.description_en}
        onChange={(v) => set({ access: { ...p.access, description_fr: v.fr, description_en: v.en } })} />
      <Field label="Adresse"><input className={inputCls} value={p.access.address} onChange={(e) => set({ access: { ...p.access, address: e.target.value } })} /></Field>
      <Field label="Lien Google Maps" hint="Laissez vide pour utiliser l’adresse.">
        <input className={inputCls} value={p.access.maps_url} onChange={(e) => set({ access: { ...p.access, maps_url: e.target.value } })} />
      </Field>

      <h3 className="font-semibold mt-6 mb-3">Parking</h3>
      <BiField label="Description" multiline fr={p.parking.description_fr} en={p.parking.description_en}
        onChange={(v) => set({ parking: { ...p.parking, description_fr: v.fr, description_en: v.en } })} />
      <BiField label="Instructions" multiline fr={p.parking.instructions_fr} en={p.parking.instructions_en}
        onChange={(v) => set({ parking: { ...p.parking, instructions_fr: v.fr, instructions_en: v.en } })} />

      <SaveBar onSave={save} saving={saving} msg={msg} />
    </div>
  );
}

/* ------------------------------ Lignes (services / lieux) ------------------------------ */
type Row = { id: string; _new?: boolean } & Record<string, unknown>;

function useRows<T extends { id: string }>(table: 'guide_services' | 'guide_places') {
  const [rows, setRows] = useState<(T & { _new?: boolean })[] | null>(null);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(table).select('*').order('sort_order').order('created_at');
    if (error) { setErr(error.message); setRows([]); return; }
    setRows(data as T[]); setDeleted([]);
  }, [table]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!rows) return;
    if (deleted.length) {
      const { error } = await supabase.from(table).delete().in('id', deleted);
      if (error) throw new Error(error.message);
    }
    const clean = (r: Row, i: number) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _new, created_at, ...rest } = r as Row & { created_at?: string };
      return { ...rest, sort_order: i + 1 };
    };
    const existing = rows.map((r, i) => ({ r: r as unknown as Row, i })).filter((x) => !x.r._new).map((x) => clean(x.r, x.i));
    const fresh = rows.map((r, i) => ({ r: r as unknown as Row, i })).filter((x) => x.r._new).map((x) => {
      const { id, ...rest } = clean(x.r, x.i); void id; return rest;
    });
    if (existing.length) {
      const { error } = await supabase.from(table).upsert(existing);
      if (error) throw new Error(error.message);
    }
    if (fresh.length) {
      const { error } = await supabase.from(table).insert(fresh);
      if (error) throw new Error(error.message);
    }
    await load();
  };

  const update = (i: number, patch: Partial<T>) => setRows((rs) => rs && rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const move = (i: number, d: -1 | 1) => setRows((rs) => {
    if (!rs) return rs; const j = i + d; if (j < 0 || j >= rs.length) return rs;
    const c = [...rs]; [c[i], c[j]] = [c[j], c[i]]; return c;
  });
  const remove = (i: number) => setRows((rs) => {
    if (!rs) return rs;
    const r = rs[i];
    if (!r._new) setDeleted((d) => [...d, r.id]);
    return rs.filter((_, idx) => idx !== i);
  });
  const add = (item: T & { _new?: boolean }) => setRows((rs) => [...(rs || []), { ...item, _new: true }]);

  return { rows, err, update, move, remove, add, save };
}

function RowActions({ i, n, onMove, onRemove }: { i: number; n: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button type="button" disabled={i === 0} onClick={() => onMove(-1)} className="rounded border border-foreground/20 px-3 py-1 text-xs disabled:opacity-40">Monter</button>
      <button type="button" disabled={i === n - 1} onClick={() => onMove(1)} className="rounded border border-foreground/20 px-3 py-1 text-xs disabled:opacity-40">Descendre</button>
      <button type="button" onClick={() => { if (confirm('Supprimer définitivement ?')) onRemove(); }} className="rounded border border-red-300 px-3 py-1 text-xs text-red-600">Supprimer</button>
    </div>
  );
}

/* --------------------------------- Services --------------------------------- */
function ServicesEditor() {
  const { rows, err, update, move, remove, add, save } = useRows<GuideService>('guide_services');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  if (!rows) return <p className="text-sm">Chargement…</p>;

  const doSave = async () => {
    setSaving(true); setMsg('');
    try { await save(); setMsg('Services enregistrés. Visibles sur /guide.'); }
    catch (e) { setMsg('Erreur : ' + (e as Error).message); }
    setSaving(false);
  };

  return (
    <div>
      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
      {rows.map((s, i) => (
        <details key={s.id} className="mb-4 rounded-xl border border-foreground/15 p-4" open={!!s._new || i === 0}>
          <summary className="cursor-pointer font-semibold">
            {s.name_fr || s.name_en || 'Nouveau service'}{!s.available ? ' — désactivé' : ''}
            {s.price !== null && s.price !== undefined && s.price !== ('' as unknown) ? ` · ${s.price} MAD` : ''}
          </summary>
          <div className="mt-4">
            <RowActions i={i} n={rows.length} onMove={(d) => move(i, d)} onRemove={() => remove(i)} />
            <BiField label="Nom" fr={s.name_fr} en={s.name_en} onChange={(v) => update(i, { name_fr: v.fr, name_en: v.en })} />
            <BiField label="Description" multiline fr={s.description_fr} en={s.description_en} onChange={(v) => update(i, { description_fr: v.fr, description_en: v.en })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Prix (MAD)" hint="Laissez vide si pas de prix.">
                <input type="number" min={0} step="0.01" className={inputCls} value={s.price ?? ''}
                  onChange={(e) => update(i, { price: e.target.value === '' ? null : Number(e.target.value) })} />
              </Field>
              <div className="sm:col-span-2">
                <BiField label="Précision sur le prix (ex : par personne)" fr={s.price_note_fr} en={s.price_note_en} onChange={(v) => update(i, { price_note_fr: v.fr, price_note_en: v.en })} />
              </div>
            </div>
            <UploadField bucket="guide-images" emptyHint="Aucune photo téléversée : une photo d’exemple est affichée sur /guide. Téléversez la vôtre pour la remplacer." value={s.image_url} onChange={(url) => update(i, { image_url: url })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={s.available} onChange={(e) => update(i, { available: e.target.checked })} />
              Service disponible (affiché sur /guide)
            </label>
          </div>
        </details>
      ))}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button type="button" className="rounded-lg border border-foreground/20 px-4 py-2 text-sm"
          onClick={() => add({ id: `new-${Date.now()}`, name_fr: 'Nouveau service', name_en: 'New service', description_fr: '', description_en: '', price: null, price_note_fr: '', price_note_en: '', image_url: '', available: true, sort_order: rows.length + 1 })}>
          + Ajouter un service
        </button>
        <button type="button" onClick={doSave} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer les services'}</button>
        {msg && <span className="text-sm" role="status">{msg}</span>}
      </div>
    </div>
  );
}

/* ------------------------------- Guide de Rabat ------------------------------- */
function PlacesEditor() {
  const { rows, err, update, move, remove, add, save } = useRows<GuidePlace>('guide_places');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  if (!rows) return <p className="text-sm">Chargement…</p>;

  const doSave = async () => {
    setSaving(true); setMsg('');
    try { await save(); setMsg('Lieux enregistrés. Visibles sur /guide.'); }
    catch (e) { setMsg('Erreur : ' + (e as Error).message); }
    setSaving(false);
  };

  return (
    <div>
      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
      {rows.map((p, i) => (
        <details key={p.id} className="mb-4 rounded-xl border border-foreground/15 p-4" open={!!p._new}>
          <summary className="cursor-pointer font-semibold">{p.name_fr || p.name_en || 'Nouveau lieu'}{!p.active ? ' — désactivé' : ''}</summary>
          <div className="mt-4">
            <RowActions i={i} n={rows.length} onMove={(d) => move(i, d)} onRemove={() => remove(i)} />
            <BiField label="Nom" fr={p.name_fr} en={p.name_en} onChange={(v) => update(i, { name_fr: v.fr, name_en: v.en })} />
            <BiField label="Description" multiline fr={p.description_fr} en={p.description_en} onChange={(v) => update(i, { description_fr: v.fr, description_en: v.en })} />
            <BiField label="Catégorie (ex : Patrimoine, Restaurant…)" fr={p.category_fr} en={p.category_en} onChange={(v) => update(i, { category_fr: v.fr, category_en: v.en })} />
            <Field label="Adresse"><input className={inputCls} value={p.address} onChange={(e) => update(i, { address: e.target.value })} /></Field>
            <Field label="Lien Google Maps" hint="Laissez vide : un lien de recherche Google Maps sera créé avec le nom du lieu.">
              <input className={inputCls} value={p.maps_url} onChange={(e) => update(i, { maps_url: e.target.value })} />
            </Field>
            <UploadField bucket="guide-images" emptyHint="Aucune photo téléversée : une photo d’exemple est affichée sur /guide. Téléversez la vôtre pour la remplacer." value={p.image_url} onChange={(url) => update(i, { image_url: url })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={p.active} onChange={(e) => update(i, { active: e.target.checked })} />
              Lieu actif (affiché sur /guide)
            </label>
          </div>
        </details>
      ))}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button type="button" className="rounded-lg border border-foreground/20 px-4 py-2 text-sm"
          onClick={() => add({ id: `new-${Date.now()}`, name_fr: 'Nouveau lieu', name_en: 'New place', description_fr: '', description_en: '', category_fr: '', category_en: '', image_url: '', address: '', maps_url: '', active: true, sort_order: rows.length + 1 })}>
          + Ajouter un lieu
        </button>
        <button type="button" onClick={doSave} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer les lieux'}</button>
        {msg && <span className="text-sm" role="status">{msg}</span>}
      </div>
    </div>
  );
}

/* --------------------------------- WhatsApp --------------------------------- */
function WhatsappEditor() {
  const [all, setAll] = useSettings();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  if (!all) return <p className="text-sm">Chargement…</p>;
  const w = all.whatsapp;
  const set = (patch: Partial<GuideWhatsapp>) => setAll({ ...all, whatsapp: { ...w, ...patch } });
  const save = async () => {
    setSaving(true); setMsg('');
    try { await saveSetting('whatsapp', w); setMsg('Enregistré. Visible tout de suite sur /guide.'); }
    catch (e) { setMsg('Erreur : ' + (e as Error).message); }
    setSaving(false);
  };
  const digits = w.number.replace(/\D/g, '');
  return (
    <div>
      <Field label="Numéro WhatsApp" hint="Format international, ex : +212612345678. Si vide, le numéro WhatsApp de l’onglet Contact est utilisé. Sans numéro valide, le bouton est masqué.">
        <input className={inputCls} value={w.number} onChange={(e) => set({ number: e.target.value })} />
      </Field>
      <BiField label="Message WhatsApp par défaut" multiline fr={w.message_fr} en={w.message_en} onChange={(v) => set({ message_fr: v.fr, message_en: v.en })} />
      {digits.length >= 8 && (
        <a href={whatsappHref(w.number, w.message_fr)} target="_blank" rel="noopener noreferrer" className="text-sm underline">Tester le lien WhatsApp (message FR)</a>
      )}
      <SaveBar onSave={save} saving={saving} msg={msg} />
    </div>
  );
}

/* --------------------------------- Paramètres --------------------------------- */
function SettingsEditor() {
  const [all, setAll] = useSettings();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);
  if (!all) return <p className="text-sm">Chargement…</p>;
  const w = all.welcome;
  const set = (patch: Partial<GuideWelcome>) => setAll({ ...all, welcome: { ...w, ...patch } });
  const link = typeof window !== 'undefined' ? `${window.location.origin}/guide` : '/guide';
  const save = async () => {
    setSaving(true); setMsg('');
    try { await saveSetting('welcome', w); setMsg('Enregistré. Visible tout de suite sur /guide.'); }
    catch (e) { setMsg('Erreur : ' + (e as Error).message); }
    setSaving(false);
  };
  return (
    <div>
      <div className="rounded-xl border border-foreground/15 p-4 mb-6">
        <h3 className="font-semibold mb-1">Lien du guide (pour le QR code des chambres)</h3>
        <p className="text-xs text-foreground/60 mb-3">Ce lien ne change jamais : modifier le contenu ne demande pas de refaire le QR code.</p>
        <p className="break-all rounded-lg bg-foreground/5 px-3 py-2 text-sm">{link}</p>
        <div className="flex gap-2 mt-3">
          <button type="button" className="rounded-lg border border-foreground/20 px-3 py-2 text-sm"
            onClick={async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ } }}>
            {copied ? 'Copié' : 'Copier le lien'}
          </button>
          <a href="/guide" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-foreground/20 px-3 py-2 text-sm">Ouvrir le guide</a>
        </div>
      </div>

      <h3 className="font-semibold mb-3">Message de bienvenue</h3>
      <BiField label="Titre" fr={w.title_fr} en={w.title_en} onChange={(v) => set({ title_fr: v.fr, title_en: v.en })} />
      <BiField label="Texte d’accueil" multiline fr={w.subtitle_fr} en={w.subtitle_en} onChange={(v) => set({ subtitle_fr: v.fr, subtitle_en: v.en })} />
      <UploadField bucket="guide-images" label="Image de bienvenue" value={w.image_url} onChange={(url) => set({ image_url: url })} />
      <SaveBar onSave={save} saving={saving} msg={msg} />
    </div>
  );
}

/* ------------------------------ À compléter ------------------------------ */
function Checklist() {
  const [todo, setTodo] = useState<string[] | null>(null);
  useEffect(() => {
    (async () => {
      const [s, sv, pl] = await Promise.all([
        supabase.from('guide_settings').select('key, value'),
        supabase.from('guide_services').select('id, price, available'),
        supabase.from('guide_places').select('id, image_url, active'),
      ]);
      const m = mergeSettings(s.data);
      const t: string[] = [];
      if (!m.whatsapp.number.replace(/\D/g, '')) t.push('Numéro WhatsApp (sans lui, le bouton WhatsApp est masqué sur /guide)');
      if (!m.practical.wifi_name || !m.practical.wifi_password) t.push('Nom et mot de passe du Wi-Fi');
      if (!m.practical.parking.description_fr && !m.practical.parking.instructions_fr) t.push('Infos parking');
      if (!m.practical.access.description_fr) t.push('Description « comment venir »');
      if (!m.welcome.image_url) t.push('Image de bienvenue (Paramètres)');
      if ((sv.data || []).some((x: { price: number | null; available: boolean }) => x.available && x.price === null)) t.push('Prix des services (laissez vide si sans prix)');
      if ((pl.data || []).some((x: { image_url: string; active: boolean }) => x.active && !x.image_url)) t.push('Photos des lieux de Rabat');
      setTodo(t);
    })();
  }, []);
  if (!todo || todo.length === 0) return null;
  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold mb-1">À compléter pour un guide prêt à l’emploi :</p>
      <ul className="list-disc pl-5 space-y-0.5">{todo.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  );
}

/* ----------------------------------- Root ----------------------------------- */
export default function GuideAdmin() {
  const [sub, setSub] = useState<Sub>('practical');
  const subs: { id: Sub; label: string }[] = [
    { id: 'practical', label: 'Informations pratiques' },
    { id: 'services', label: 'Services' },
    { id: 'places', label: 'Guide de Rabat' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'settings', label: 'Paramètres' },
  ];
  void DEFAULT_PRACTICAL; void DEFAULT_WELCOME; void DEFAULT_WHATSAPP;
  return (
    <div>
      <p className="text-sm text-foreground/60 mb-4">
        Contenu de la page <a href="/guide" target="_blank" rel="noopener noreferrer" className="underline">/guide</a> (accessible par QR code). Les modifications sont visibles immédiatement après « Enregistrer ».
      </p>
      <Checklist />
      <div className="flex flex-wrap gap-2 mb-6" role="tablist">
        {subs.map((s) => (
          <button key={s.id} role="tab" aria-selected={sub === s.id} onClick={() => setSub(s.id)}
            className={`rounded-lg px-3 py-1.5 text-sm border ${sub === s.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20'}`}>
            {s.label}
          </button>
        ))}
      </div>
      {sub === 'practical' && <PracticalEditor key="p" />}
      {sub === 'services' && <ServicesEditor key="s" />}
      {sub === 'places' && <PlacesEditor key="l" />}
      {sub === 'whatsapp' && <WhatsappEditor key="w" />}
      {sub === 'settings' && <SettingsEditor key="t" />}
    </div>
  );
}
