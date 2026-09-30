import React from 'react';
import { Metadata } from 'next';
import HomepageClient from './components/HomepageClient';

export const metadata: Metadata = {
  title: 'Riad Dar Soufa — Maison d\'hôtes Authentique à Rabat, Maroc',
  description: 'Découvrez Riad Dar Soufa, maison d\'hôtes traditionnelle au cœur de la médina de Rabat. Réservez directement vos chambres et vivez l\'expérience marocaine.',
  openGraph: {
    title: 'Riad Dar Soufa — Médina de Rabat',
    description: 'Une expérience authentique au cœur de la médina de Rabat, Maroc.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return <HomepageClient />;
}