'use client';
import React from 'react';
import { SiteProvider } from '@/context/SiteContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import HeroSection from './HeroSection';
import PresentationSection from './PresentationSection';
import RoomsPreviewSection from './RoomsPreviewSection';
import TestimonialsSection from './TestimonialsSection';
import DirectRates from '@/components/DirectRates';

export default function HomepageClient() {
  return (
    <SiteProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <DirectRates />
          <PresentationSection />
          <RoomsPreviewSection />
          <TestimonialsSection />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </SiteProvider>
  );
}