import React, { Suspense } from 'react';
import { Metadata } from 'next';
import BookingClient from './components/BookingClient';

export const metadata: Metadata = {
  title: 'Réservation — Riad Dar Soufa Rabat',
  description: 'Réservez directement votre chambre au Riad Dar Soufa à Rabat. Meilleur tarif garanti, confirmation instantanée.',
};

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Chargement...</div></div>}>
      <BookingClient />
    </Suspense>
  );
}