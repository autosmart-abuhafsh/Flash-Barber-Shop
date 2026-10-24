/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { DEFAULT_SITE_CONFIG, SiteConfig } from './config/siteConfig';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PhilosophySection } from './components/PhilosophySection';
import { ServicesSection } from './components/ServicesSection';
import { InteractiveStudio3D } from './components/InteractiveStudio3D';
import { GallerySection } from './components/GallerySection';
import { BookingSection } from './components/BookingSection';
import { TestimonialAndLocationSection } from './components/TestimonialAndLocationSection';
import { FooterSection } from './components/FooterSection';
import { BusinessConfigModal } from './components/BusinessConfigModal';

export default function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [preselectedNote, setPreselectedNote] = useState<string>('');
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);

  useEffect(() => {
    document.title = `${siteConfig.brandName} — Modern 3D Barbershop Kota Malang`;
  }, [siteConfig.brandName]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectServiceForBooking = useCallback(
    (serviceName: string) => {
      setPreselectedService(serviceName);
      scrollToSection('booking');
    },
    [scrollToSection]
  );

  const handleBookStyleFromGallery = useCallback(
    (styleTitle: string) => {
      setPreselectedNote(styleTitle);
      if (!preselectedService) {
        setPreselectedService('Haircut & Styling');
      }
      scrollToSection('booking');
    },
    [preselectedService, scrollToSection]
  );

  return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col selection:bg-[#0B1F3A] selection:text-white overflow-x-hidden">
      {/* 1. Premium Floating Navigation */}
      <Navbar
        brandName={siteConfig.brandName}
        onNavigate={scrollToSection}
      />

      <main className="flex-1">
        {/* 2. Hero Section — Wow Effect Sejak Detik Pertama */}
        <HeroSection
          brandName={siteConfig.brandName}
          tagline={siteConfig.tagline}
          city={siteConfig.city}
          onBookClick={() => scrollToSection('booking')}
          onExploreClick={() => scrollToSection('our-work')}
        />

        {/* 3. Section Our Philosophy — Brand Story */}
        <PhilosophySection
          brandName={siteConfig.brandName}
          headline={siteConfig.philosophyHeadline}
          body={siteConfig.philosophyBody}
          mainImage={siteConfig.philosophyMainImage}
          detailImage={siteConfig.philosophyDetailImage}
          values={siteConfig.philosophyValues}
        />

        {/* 4. Section Services — Interaktif dan Elegan */}
        <ServicesSection
          services={siteConfig.services}
          onSelectServiceForBooking={handleSelectServiceForBooking}
        />

        {/* 5. Section 3D Interactive Experience — Step Inside The Craft */}
        <InteractiveStudio3D />

        {/* 6. Section Our Work — Haircut Gallery */}
        <GallerySection
          brandName={siteConfig.brandName}
          items={siteConfig.gallery}
          onBookStyle={handleBookStyleFromGallery}
        />

        {/* 7. Section Booking — Konversi Menjadi Pelanggan via WhatsApp */}
        <BookingSection
          brandName={siteConfig.brandName}
          whatsappInternational={siteConfig.whatsappInternational}
          services={siteConfig.services}
          barbers={siteConfig.barbers}
          preselectedService={preselectedService}
          preselectedNote={preselectedNote}
          onOpenConfigModal={() => setConfigModalOpen(true)}
        />

        {/* 8 & 9. Section Testimonial & Location Malang */}
        <TestimonialAndLocationSection
          brandName={siteConfig.brandName}
          address={siteConfig.address}
          operatingHours={siteConfig.operatingHours}
          whatsappInternational={siteConfig.whatsappInternational}
          googleMapsUrl={siteConfig.googleMapsUrl}
          facilitiesNote={siteConfig.facilitiesNote}
        />
      </main>

      {/* 10. Footer & Brand Signature */}
      <FooterSection
        config={siteConfig}
        onNavigate={scrollToSection}
        onOpenConfigModal={() => setConfigModalOpen(true)}
      />

      {/* Optional Live Placeholder Customizer Modal for Business Owner */}
      <BusinessConfigModal
        isOpen={configModalOpen}
        config={siteConfig}
        onClose={() => setConfigModalOpen(false)}
        onSave={(updated) => setSiteConfig(updated)}
      />
    </div>
  );
}
