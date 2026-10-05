'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-1';

/** Réduit l'image (max 1600 px) avant l'envoi : plus rapide depuis un téléphone. */
async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Image illisible.'))), 'image/jpeg', 0.85));
}

/** Envoie une image dans Supabase Storage et renvoie son adresse publique. */
export async function uploadImage(file: File, bucket: 'guide-images' | 'site-images'): Promise<string> {
  const blob = await resizeImage(file);
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(bucket).upload(path, blob, { contentType: 'image/jpeg' });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Une seule image : téléversement uniquement (aucun lien à saisir). */
export function ImageField({
  value, onChange, bucket, label = 'Image',
}: { value: string; onChange: (url: string) => void; bucket: 'guide-images' | 'site-images'; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setErr('');
    try { onChange(await uploadImage(file, bucket)); }
    catch (e) { setErr((e as Error).message); }
    setBusy(false);
  };

  return (
    <div className="mb-4">
      <span className={labelCls}>{label}</span>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mb-2 h-32 w-full max-w-xs rounded-lg object-cover border border-foreground/15" />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-lg border border-foreground/20 px-3 py-2 text-sm">
          {busy ? 'Envoi…' : value ? 'Changer l’image' : 'Téléverser une image'}
          <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ''; }} />
        </label>
        {value && <button type="button" onClick={() => onChange('')} className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600">Retirer</button>}
      </div>
      {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
    </div>
  );
}

/** Plusieurs images (galerie d'une chambre) : ajout par téléversement, ordre modifiable. */
export function MultiImageField({
  value, onChange, bucket, label = 'Photos',
}: { value: string[]; onChange: (urls: string[]) => void; bucket: 'guide-images' | 'site-images'; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true); setErr('');
    const added: string[] = [];
    const failed: string[] = [];
    for (const f of Array.from(files)) {
      try { added.push(await uploadImage(f, bucket)); }
      catch (e) { failed.push(`${f.name} : ${(e as Error).message}`); }
    }
    if (added.length) onChange([...value, ...added]);
    if (failed.length) setErr(failed.join(' · '));
    setBusy(false);
  };

  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= value.length) return;
    const c = [...value]; [c[i], c[j]] = [c[j], c[i]]; onChange(c);
  };

  return (
    <div className="mb-4">
      <span className={labelCls}>{label} (la première est la photo principale)</span>
      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, i) => (
            <div key={`${url}-${i}`} className="rounded-lg border border-foreground/15 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-24 w-full rounded object-cover" />
              <p className="mt-1 text-center text-[11px] text-foreground/60">{i === 0 ? 'Photo principale' : `Photo ${i + 1}`}</p>
              <div className="mt-1 flex justify-center gap-1">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Avancer" className="rounded border border-foreground/20 px-2 py-0.5 text-xs disabled:opacity-30">←</button>
                <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Reculer" className="rounded border border-foreground/20 px-2 py-0.5 text-xs disabled:opacity-30">→</button>
                <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Retirer" className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-600">Retirer</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <label className="inline-block cursor-pointer rounded-lg border border-foreground/20 px-4 py-2 text-sm">
        {busy ? 'Envoi en cours…' : '+ Ajouter des photos'}
        <input type="file" accept="image/*" multiple className="hidden" disabled={busy} onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
      </label>
      {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
    </div>
  );
}
