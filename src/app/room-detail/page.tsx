import React, { Suspense } from 'react';
import { Metadata } from 'next';
import RoomDetailClient from './components/RoomDetailClient';

export const metadata: Metadata = {
  title: 'Détail Chambre — Riad Dar Soufa Rabat',
  description: 'Découvrez en détail nos chambres et suites au Riad Dar Soufa, Rabat. Photos, équipements, tarifs et réservation directe.',
};

export default function RoomDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Chargement...</div></div>}>
      <RoomDetailClient />
    </Suspense>
  );
}