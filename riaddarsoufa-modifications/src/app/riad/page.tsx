import React from 'react';
import { Metadata } from 'next';
import RiadClient from './components/RiadClient';

export const metadata: Metadata = {
  title: 'Le Riad — Riad Dar Soufa, médina de Rabat',
  description: 'Découvrez le Riad Dar Soufa, maison traditionnelle de la médina de Rabat : patio, salons, terrasses et artisanat marocain (zellige, bois de cèdre).',
};

export default function RiadPage() {
  return <RiadClient />;
}
