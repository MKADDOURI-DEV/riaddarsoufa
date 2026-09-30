import React from 'react';
import { Metadata } from 'next';
import ServicesClient from './components/ServicesClient';

export const metadata: Metadata = {
  title: 'Nos Services — Riad Dar Soufa Rabat',
  description: 'Découvrez tous les services proposés au Riad Dar Soufa : petit-déjeuner marocain, terrasse panoramique, transfert aéroport, restauration et bien plus.',
};

export default function ServicesPage() {
  return <ServicesClient />;
}