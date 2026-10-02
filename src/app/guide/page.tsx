import React from 'react';
import { Metadata } from 'next';
import GuideClient from './GuideClient';

export const metadata: Metadata = {
  title: 'Guide d’accueil — Riad Dar Soufa',
  description: 'Informations pratiques, services et bonnes adresses pour votre séjour au Riad Dar Soufa, Rabat.',
  robots: { index: false, follow: false },
};

export default function GuidePage() {
  return <GuideClient />;
}
