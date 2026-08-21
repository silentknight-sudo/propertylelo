import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCities } from './components/FeaturedCities';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PropertyGrid } from './components/PropertyGrid';
import { NewProjectsCarousel } from './components/NewProjectsCarousel';
import { ToolsSuite } from './components/ToolsSuite';
import { InsightsBlog } from './components/InsightsBlog';
import { Testimonials } from './components/Testimonials';
import { CtaBanner } from './components/CtaBanner';
import { AppDownloadBanner } from './components/AppDownloadBanner';
import { Footer } from './components/Footer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { 
  ScheduleVisitModal, 
  ContactOwnerModal, 
  VipProjectModal 
} from './components/Modals';
import { SavedPropertiesDrawer } from './components/SavedPropertiesDrawer';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';

import { PROPERTIES_DATA } from './data/mockData';
import { Property, ListingCategory, NewProject } from './types/property';

export function App() {
  // --- Core State ---
  const [properties, setProperties] = useState<Property[]>(PROPERTIES_DATA);
  const [activeCategory, setActiveCategory] = useState<ListingCategory>('Buy');
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('propertylelo_saved');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-3'];
    } catch {
      return ['prop-1', 'prop-3'];
    }
  });

  // --- Modal & Drawer States ---
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState<Property | null>(null);
  const [contactProperty, setContactProperty] = useState<Property | null>(null);
  const [scheduleVisitProperty, setScheduleVisitProperty] = useState<Property | null>(null);
  const [vipProject, setVipProject] = useState<NewProject | null>(null);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Saved Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('propertylelo_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Toggle Save Property
  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from your saved shortlist');
        return prev.filter((item) => item !== id);
      } else {
        showToast('❤️ Saved to your shortlist!');
        return [...prev, id];
      }
    });
  };

  // Add newly posted property to state
  const handleAddProperty = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);
    showToast(`Property "${newProperty.title}" is now live!`);
    const gridEl = document.getElementById('properties-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Search from Hero
  const handleHeroSearch = (filters: { category: ListingCategory; city: string; query: string }) => {
    setActiveCategory(filters.category);
    if (filters.city) {
      setSelectedCity(filters.city);
    }
    const gridEl = document.getElementById('properties-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Filtering ${filters.category} properties in ${filters.city || 'India'}`);
  };

  // Saved Properties List
  const savedPropertiesList = properties.filter((p) => savedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#1A1A2E] font-sans antialiased flex flex-col selection:bg-[#FF6B35] selection:text-white">
      {/* 1. Header (Sticky) */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <Hero
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          onSearch={handleHeroSearch}
          onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        />

        {/* 3. Featured Cities Grid */}
        <FeaturedCities
          selectedCity={selectedCity}
          onSelectCity={(cityName) => {
            setSelectedCity(cityName);
            showToast(cityName ? `Viewing properties in ${cityName}` : 'Viewing all cities');
          }}
        />

        {/* 4. Why Choose Us (Trust Badges & Value Pillars) */}
        <WhyChooseUs
          onOpenEmiCalculator={() => {
            const el = document.getElementById('tools-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        />

        {/* 5. Main Verified Property Grid / Browser */}
        <PropertyGrid
          properties={properties}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onSelectProperty={(prop) => setSelectedPropertyDetail(prop)}
          onContactClick={(prop) => setContactProperty(prop)}
          onScheduleVisitClick={(prop) => setScheduleVisitProperty(prop)}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />

        {/* 6. New Projects & Township Developments Carousel */}
        <NewProjectsCarousel
          onBrochureDownload={(projName) => {
            showToast(`Downloading official RERA Brochure & Floor Plan for ${projName}...`);
          }}
          onVipEnquiry={(proj) => setVipProject(proj)}
        />

        {/* 7. Tools Suite (EMI Calculator, Price Trends, Land Converter) */}
        <ToolsSuite
          onApplyLoan={(amount, emi) => {
            showToast(`Loan application initiated for ₹${amount.toLocaleString('en-IN')}. SBI/HDFC advisor will call shortly.`);
          }}
        />

        {/* 8. Market Insights & Legal Guides */}
        <InsightsBlog />

        {/* 9. Testimonials Carousel */}
        <Testimonials />

        {/* 10. CTA Banner ("Post Property for FREE") */}
        <CtaBanner onOpenPostProperty={() => setIsPostPropertyOpen(true)} />

        {/* 11. Mobile App Download Banner */}
        <AppDownloadBanner onNotify={showToast} />
      </main>

      {/* 12. 5-Column Indian Real Estate Footer */}
      <Footer
        onSelectCity={(city) => {
          setSelectedCity(city);
          showToast(`Viewing properties in ${city}`);
        }}
        onOpenEmi={() => {
          const el = document.getElementById('tools-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
      />

      {/* --- Interactive Modals & Drawers --- */}

      {/* Property Full Details Modal */}
      <PropertyDetailModal
        property={selectedPropertyDetail}
        isOpen={Boolean(selectedPropertyDetail)}
        onClose={() => setSelectedPropertyDetail(null)}
        isSaved={selectedPropertyDetail ? savedIds.includes(selectedPropertyDetail.id) : false}
        onToggleSave={handleToggleSave}
        onContactClick={(prop) => setContactProperty(prop)}
        onScheduleVisitClick={(prop) => setScheduleVisitProperty(prop)}
        onNotify={showToast}
      />

      {/* Post Property Free Wizard Modal */}
      <PostPropertyModal
        isOpen={isPostPropertyOpen}
        onClose={() => setIsPostPropertyOpen(false)}
        onAddProperty={handleAddProperty}
        onNotify={showToast}
      />

      {/* Schedule Site Visit Modal */}
      <ScheduleVisitModal
        property={scheduleVisitProperty}
        isOpen={Boolean(scheduleVisitProperty)}
        onClose={() => setScheduleVisitProperty(null)}
        onSuccess={showToast}
      />

      {/* Direct Contact Seller Modal */}
      <ContactOwnerModal
        property={contactProperty}
        isOpen={Boolean(contactProperty)}
        onClose={() => setContactProperty(null)}
        onSuccess={showToast}
      />

      {/* VIP Builder Launch Modal */}
      <VipProjectModal
        project={vipProject}
        isOpen={Boolean(vipProject)}
        onClose={() => setVipProject(null)}
        onSuccess={showToast}
      />

      {/* Saved Properties Drawer */}
      <SavedPropertiesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedPropertiesList}
        onRemove={handleToggleSave}
        onSelectProperty={(prop) => setSelectedPropertyDetail(prop)}
        onContactClick={(prop) => setContactProperty(prop)}
      />

      {/* Auth Login / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={showToast}
      />

      {/* Global Action Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default App;
