'use client';

import React, { useState } from 'react';
import { BiField } from './RiadAdmin';
import type { HomeContent } from '@/lib/home';

/** Onglet « Accueil » : phrase d'accroche et les 4 cartes « Réservation directe ». */
export default function HomeAdmin({ initial, onSave }: { initial: HomeContent; onSave: (v: HomeContent) => Promise<void> }) {
  const [home, setHome] = useState<HomeContent>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const setDirect = (patch: Partial<HomeContent['direct']>) => setHome((h) => ({ ...h, direct: { ...h.direct, ...patch } }));
  const setPoint = (i: number, patch: Partial<HomeContent['direct']['points'][number]>) =>
    setDirect({ points: home.direct.points.map((p, k) => (k === i ? { ...p, ...patch } : p)) });

  const save = async () => {
    setSaving(true); setMsg('');
    try { await onSave(home); setMsg('Accueil enregistré. Le site est à jour.'); }
    catch (e) { setMsg('Échec de l’enregistrement : ' + (e as Error).message); }
    setSaving(false);
  };

  return (
    <div>
      <p className="text-sm text-foreground/60 mb-4">
        Textes de la page d’accueil. Le texte « Le Riad » et sa photo se modifient dans l’onglet « Le Riad ». Anglais vide = le français s’affiche.
      </p>

      <details className="mb-4 rounded-xl border border-foreground/15 p-4" open>
        <summary className="cursor-pointer font-semibold text-foreground">Phrase d’accroche (sous « Riad Dar Soufa »)</summary>
        <div className="mt-4">
          <BiField label="Phrase" value={home.heroSubtitle} onChange={(v) => setHome((h) => ({ ...h, heroSubtitle: v }))} />
        </div>
      </details>

      <details className="mb-4 rounded-xl border border-foreground/15 p-4" open>
        <summary className="cursor-pointer font-semibold text-foreground">Bandeau « Réservation directe »</summary>
        <div className="mt-4">
          <BiField label="Petit titre" value={home.direct.label} onChange={(v) => setDirect({ label: v })} />
          <BiField label="Titre" value={home.direct.title} onChange={(v) => setDirect({ title: v })} />
          <BiField label="Texte" multiline value={home.direct.text} onChange={(v) => setDirect({ text: v })} />
          <BiField label="Bouton" value={home.direct.cta} onChange={(v) => setDirect({ cta: v })} />
        </div>
      </details>

      {home.direct.points.map((p, i) => (
        <details key={i} className="mb-4 rounded-xl border border-foreground/15 p-4">
          <summary className="cursor-pointer font-semibold text-foreground">Carte {i + 1} : {p.title.fr}</summary>
          <div className="mt-4">
            <BiField label="Titre de la carte" value={p.title} onChange={(v) => setPoint(i, { title: v })} />
            <BiField label="Texte de la carte" multiline value={p.text} onChange={(v) => setPoint(i, { text: v })} />
          </div>
        </details>
      ))}

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer l’accueil'}</button>
        {msg && <span className="text-sm" role="status">{msg}</span>}
      </div>
    </div>
  );
}
