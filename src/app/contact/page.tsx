import React from 'react';
import { Metadata } from 'next';
import ContactClient from './components/ContactClient';

export const metadata: Metadata = {
  title: 'Contact — Riad Dar Soufa Rabat',
  description: 'Contactez le Riad Dar Soufa à Rabat. Adresse dans la médina, téléphone, WhatsApp, email et formulaire de contact.',
};

export default function ContactPage() {
  return <ContactClient />;
}