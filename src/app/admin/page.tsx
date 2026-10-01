import React from 'react';
import { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Administration — Riad Dar Soufa',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
