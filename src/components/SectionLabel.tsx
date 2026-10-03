import React from 'react';

/** Étiquette de section numérotée : « 01 — Le riad » */
export default function SectionLabel({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`font-serif text-lg ${light ? 'text-accent-foreground' : 'text-accent'}`}>{number}</span>
      <span aria-hidden="true" className={`h-px w-10 ${light ? 'bg-white/40' : 'bg-accent'}`} />
      <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${light ? 'text-white/80' : 'text-muted-foreground'}`}>{children}</span>
    </div>
  );
}
