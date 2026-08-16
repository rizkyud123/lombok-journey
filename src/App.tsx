import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { DestinationsGallery } from './components/DestinationsGallery';
import { TripEstimator } from './components/TripEstimator';
import { ActivityGallery } from './components/ActivityGallery';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F5F5F5] font-sans antialiased text-slate-800 selection:bg-[#D4AF37] selection:text-[#112D4E]">
        {/* Sticky Top Navbar */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* About Us Section */}
        <AboutSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Iconic Destinations Gallery */}
        <DestinationsGallery />

        {/* Interactive Trip Estimator & Inquiry Calculator */}
        <TripEstimator />

        {/* Real Tour Activities & Photos with Automatic Watermark */}
        <ActivityGallery />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQs */}
        <FaqSection />

        {/* Pre-Footer Call to Action Banner */}
        <CtaBanner />

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp Action */}
        <FloatingWhatsApp />

        {/* Admin Dashboard Modal */}
        <AdminDashboard />
      </div>
    </AppProvider>
  );
}

