'use client';

import React, { useEffect, useState } from 'react';

/**
 * Champ numérique qu'on peut effacer : « 0 » ne reste plus collé devant ce qu'on tape.
 * Vide = 0 (ou `min` si le minimum est supérieur à 0). N'accepte que des chiffres.
 */
export default function NumInput({
  value, onChange, min = 0, className = '', disabled = false,
}: { value: number; onChange: (n: number) => void; min?: number; className?: string; disabled?: boolean }) {
  const show = (n: number) => (n ? String(n) : '');
  const [text, setText] = useState(show(value));

  // Valeur modifiée de l'extérieur (changement de chambre, annulation…)
  useEffect(() => {
    setText((t) => ((Number(t) || 0) === value ? t : show(value)));
  }, [value]);

  return (
    <input
      type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" disabled={disabled}
      className={className} value={text}
      onChange={(e) => {
        const t = e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
        setText(t);
        const n = t === '' ? 0 : Number(t);
        if (n >= min) onChange(n);
      }}
      onBlur={() => setText(show(value))}
    />
  );
}
