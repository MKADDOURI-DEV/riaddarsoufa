'use client';

import React, { useState } from 'react';
import { ImageField, MultiImageField } from './ImageUpload';
import { Bi, RiadContent, RiadSection } from '@/lib/riad';

const inputCls =
  'w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent';
const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-1';

/** Champ bilingue FR / EN (anglais vide = le français s'affiche). */
function BiField({ label, value, onChange, multiline = false }: { label: string; value: Bi; onChange: (v: Bi) => void; multiline?: boolean }) {
  return (
    <div className="mb-4">
      <span className={labelCls}>{label}</span>
      <div className="space-y-2">
        {(['fr', 'en'] as const).map((k) => (
          <div key={k} className="flex items-start gap-2">
            <span className="mt-2 w-7 text-xs font-bold text-accent">{k.toUpperCase()}</span>
            {multiline ? (
              <textarea rows={4} className={inputCls} value={value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.value })} />
            ) : (
              <input className={inputCls} value={value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Onglet « Le Riad » : présentation de la maison et des espaces communs (patio, salons, terrasses, détails). */
export default function RiadAdmin({ initial, onSave }: { initial: RiadContent; onSave: (v: RiadContent) => Promise<void> }) {
  const [riad, setRiad] = useState<RiadContent>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const setIntro = (patch: Partial<RiadContent['intro']>) => setRiad((r) => ({ ...r, intro: { ...r.intro, ...patch } }));
  const setSection = (i: number, patch: Partial<RiadSection>) =>
    setRiad((r) => ({ ...r, sections: r.sections.map((s, k) => (k === i ? { ...s, ...patch } : s)) }));
  const move = (i: number, d: -1 | 1) =>
    setRiad((r) => {
      const j = i + d; if (j < 0 || j >= r.sections.length) return r;
      const c = [...r.sections]; [c[i], c[j]] = [c[j], c[i]]; return { ...r, sections: c };
    });
  const remove = (i: number) => {
    if (!confirm(`Supprimer la section « ${riad.sections[i].title.fr} » ?`)) return;
    setRiad((r) => ({ ...r, sections: r.sections.filter((_, k) => k !== i) }));
  };
  const add = () =>
    setRiad((r) => ({
      ...r,
      sections: [...r.sections, { id: `section-${Date.now()}`, title: { fr: 'Nouvel espace', en: '' }, text: { fr: '', en: '' }, images: [] }],
    }));

  const save = async () => {
    setSaving(true); setMsg('');
    try { await onSave(riad); setMsg('Page « Le Riad » enregistrée. Le site est à jour.'); }
    catch (e) { setMsg('Échec de l’enregistrement : ' + (e as Error).message); }
    setSaving(false);
  };

  return (
    <div>
      <p className="text-sm text-foreground/60 mb-4">
        Présentez la maison et ses espaces communs. Ajoutez de belles photos pour chaque espace : sans photo, un motif décoratif s’affiche à la place.
      </p>

      <details className="mb-4 rounded-xl border border-foreground/15 p-4" open>
        <summary className="cursor-pointer font-semibold text-foreground">Présentation du riad</summary>
        <div className="mt-4">
          <BiField label="Titre" value={riad.intro.title} onChange={(v) => setIntro({ title: v })} />
          <BiField label="Texte de présentation" multiline value={riad.intro.text} onChange={(v) => setIntro({ text: v })} />
          <ImageField bucket="site-images" label="Photo du bandeau" value={riad.intro.image} onChange={(image) => setIntro({ image })} />
        </div>
      </details>

      {riad.sections.map((s, i) => (
        <details key={s.id} className="mb-4 rounded-xl border border-foreground/15 p-4">
          <summary className="cursor-pointer font-semibold text-foreground">
            {i + 1}. {s.title.fr || 'Sans titre'} {s.images.length ? `(${s.images.length} photo${s.images.length > 1 ? 's' : ''})` : '(aucune photo)'}
          </summary>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <button type="button" onClick={() => move(i, -1)} className="rounded border border-foreground/20 px-3 py-1 text-xs">Monter</button>
              <button type="button" onClick={() => move(i, 1)} className="rounded border border-foreground/20 px-3 py-1 text-xs">Descendre</button>
              <button type="button" onClick={() => remove(i)} className="rounded border border-red-300 px-3 py-1 text-xs text-red-600">Supprimer cette section</button>
            </div>
            <BiField label="Titre" value={s.title} onChange={(v) => setSection(i, { title: v })} />
            <BiField label="Texte" multiline value={s.text} onChange={(v) => setSection(i, { text: v })} />
            <MultiImageField bucket="site-images" label="Photos" value={s.images} onChange={(images) => setSection(i, { images })} />
          </div>
        </details>
      ))}

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button type="button" onClick={add} className="rounded-lg border border-foreground/20 px-4 py-2 text-sm">+ Ajouter un espace</button>
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer la page Le Riad'}</button>
        {msg && <span className="text-sm" role="status">{msg}</span>}
      </div>
    </div>
  );
}
