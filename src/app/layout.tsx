import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';

// Typographie inspirée de Dar Amastan : titres en Cormorant Garamond, texte en Montserrat.
// Chargées via <link> (et non next/font/google) pour ne pas dépendre du réseau pendant le build.
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Riad Dar Soufa — Maison d\'hôtes à Rabat, Maroc',
  description: 'Riad Dar Soufa, maison d\'hôtes traditionnelle au cœur de la médina de Rabat. Chambres authentiques, hospitalité marocaine, réservation directe.',
  keywords: ['riad', 'rabat', 'maroc', 'maison hôtes', 'médina', 'hébergement', 'boutique hotel'],
  openGraph: {
    title: 'Riad Dar Soufa — Médina de Rabat',
    description: 'Une expérience authentique au cœur de la médina de Rabat, Maroc.',
    type: 'website',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body style={{ fontFamily: "var(--font-sans)" }}>
        {children}

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Friaddarsou4308back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.3" /></body>
    </html>
  );
}