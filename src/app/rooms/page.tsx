import React from 'react';
import { Metadata } from 'next';
import RoomsClient from './components/RoomsClient';

export const metadata: Metadata = {
  title: 'Nos Chambres — Riad Dar Soufa Rabat',
  description: 'Découvrez nos 4 chambres et suites d\'exception au Riad Dar Soufa. Architecture traditionnelle marocaine, zellige et confort moderne.',
};

export default function RoomsPage() {
  return <RoomsClient />;
}