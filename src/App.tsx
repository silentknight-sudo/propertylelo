import React, { useState, useEffect, useCallback } from 'react';
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

// Admin & Team RBAC System
import { AdminPortal } from './components/admin/AdminPortal';

// Firebase Services & Defaults
import { 
  fetchPropertiesFromDb, 
  savePropertyToDb, 
  updatePropertyInDb, 
  deletePropertyFromDb,
  fetchLeadsFromDb,
  createLeadInDb,
  updateLeadInDb,
  deleteLeadFromDb,
  fetchTeamMembersFromDb,
  createTeamMemberInDb,
  updateTeamMemberInDb,
  deleteTeamMemberFromDb,
  fetchBlogsFromDb,
  saveBlogToDb,
  updateBlogInDb,
  deleteBlogFromDb,
  fetchCmsSettingsFromDb,
  saveCmsSettingsToDb,
  DEFAULT_ADMIN,
  INITIAL_TEAM_MEMBERS,
  INITIAL_LEADS,
  DEFAULT_CMS_SETTINGS
} from './lib/firebase';
import { PROPERTIES_DATA, BLOG_ARTICLES_DATA } from './data/mockData';
import { 
  Property, 
  ListingCategory, 
  NewProject, 
  Lead, 
  TeamMember, 
  BlogArticle, 
  CmsSettings, 
  LeadStatus 
} from './types/property';

export function App() {
  // --- Routing & Admin View State ---
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return window.location.hash.includes('admin') || 
           window.location.hash.includes('crm') || 
           window.location.hash.includes('team');
  });

  // Listen to hash changes (e.g. user enters /#admin or presses back button)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      setIsAdminView(hash.includes('admin') || hash.includes('crm') || hash.includes('team'));
    };

    // Secret shortcut: Alt + A or Ctrl + Shift + A toggles the admin desk
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        setIsAdminView((prev) => {
          if (!prev) window.location.hash = '#admin';
          else window.location.hash = '';
          return !prev;
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openAdminPortal = () => {
    window.location.hash = '#admin';
    setIsAdminView(true);
  };

  const closeAdminPortal = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  // --- Real-Time Database Collections State ---
  const [properties, setProperties] = useState<Property[]>(PROPERTIES_DATA);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [blogs, setBlogs] = useState<BlogArticle[]>(BLOG_ARTICLES_DATA);
  const [cmsSettings, setCmsSettings] = useState<CmsSettings>(DEFAULT_CMS_SETTINGS);
  const [isDbLoading, setIsDbLoading] = useState<boolean>(true);

  // --- Consumer Website Filter State ---
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

  // --- Modals & Drawers ---
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState<Property | null>(null);
  const [contactProperty, setContactProperty] = useState<Property | null>(null);
  const [scheduleVisitProperty, setScheduleVisitProperty] = useState<Property | null>(null);
  const [vipProject, setVipProject] = useState<NewProject | null>(null);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // --- Load all collections from Firebase on Mount ---
  const loadDatabaseData = useCallback(async () => {
    setIsDbLoading(true);
    try {
      const [fetchedProps, fetchedLeads, fetchedTeam, fetchedBlogs, fetchedCms] = await Promise.all([
        fetchPropertiesFromDb(),
        fetchLeadsFromDb(),
        fetchTeamMembersFromDb(),
        fetchBlogsFromDb(),
        fetchCmsSettingsFromDb()
      ]);

      if (fetchedProps && fetchedProps.length > 0) setProperties(fetchedProps);
      if (fetchedLeads && fetchedLeads.length > 0) setLeads(fetchedLeads);
      if (fetchedTeam && fetchedTeam.length > 0) setTeamMembers(fetchedTeam);
      if (fetchedBlogs && fetchedBlogs.length > 0) setBlogs(fetchedBlogs);
      if (fetchedCms) setCmsSettings(fetchedCms);
    } catch (err) {
      console.error('Error fetching database collections', err);
    } finally {
      setIsDbLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // Sync Saved Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('propertylelo_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedIds]);

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

  // ----------------------------------------------------
  // FIRESTORE CRUD OPERATIONS & CRM INTEGRATION
  // ----------------------------------------------------

  // 1. LEAD MANAGEMENT
  const handleAssignLead = async (leadId: string, memberId: string, memberName: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, assignedToId: memberId, assignedToName: memberName, status: l.status === 'New' ? 'Contacted' : l.status }
          : l
      )
    );
    await updateLeadInDb(leadId, {
      assignedToId: memberId,
      assignedToName: memberName,
      status: 'Contacted'
    });
  };

  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    await updateLeadInDb(leadId, { status });
  };

  const handleAddLeadNote = async (leadId: string, noteText: string) => {
    const target = leads.find((l) => l.id === leadId);
    if (!target) return;
    const currentNotes = target.notes || [];
    const newNotes = [...currentNotes, `${new Date().toLocaleDateString('en-IN')}: ${noteText}`];

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, notes: newNotes } : l))
    );
    await updateLeadInDb(leadId, { notes: newNotes });
  };

  const handleCreateManualLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-manual-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setLeads((prev) => [newLead, ...prev]);
    await createLeadInDb(newLead);
  };

  const handleDeleteLead = async (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    await deleteLeadFromDb(leadId);
  };

  // 2. PROPERTY MANAGEMENT
  const handleApproveProperty = async (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'published' } : p))
    );
    await updatePropertyInDb(id, { status: 'published' });
  };

  const handleRejectProperty = async (id: string, reason?: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected', rejectionReason: reason } : p))
    );
    await updatePropertyInDb(id, { status: 'rejected', rejectionReason: reason });
  };

  const handleSaveProperty = async (property: Property) => {
    setProperties((prev) => {
      const idx = prev.findIndex((p) => p.id === property.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = property;
        return copy;
      }
      return [property, ...prev];
    });
    await savePropertyToDb(property);
  };

  const handleDeleteProperty = async (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    await deletePropertyFromDb(id);
  };

  const handleTogglePropertyFeatured = async (id: string, current: boolean) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
    );
    await updatePropertyInDb(id, { featured: !current });
  };

  // Consumer site: user submits "Post Property"
  const handleAddPropertyFromConsumer = async (newProperty: Property) => {
    const propWithStatus: Property = {
      ...newProperty,
      status: 'published' // Instant live or pending based on CMS setting
    };
    await handleSaveProperty(propWithStatus);

    // Also auto-generate a new CRM lead for team follow-up
    const sellerLead: Lead = {
      id: `lead-seller-${Date.now()}`,
      clientName: newProperty.posterName,
      clientPhone: newProperty.posterPhone,
      clientEmail: `${newProperty.posterName.toLowerCase().replace(/\s+/g, '')}@propertylelo.client`,
      propertyId: newProperty.id,
      propertyTitle: newProperty.title,
      propertyLocation: `${newProperty.locality}, ${newProperty.city}`,
      budget: `₹${(newProperty.price / 100000).toFixed(1)} Lakhs`,
      status: 'New',
      category: 'Direct Seller Contact',
      source: 'Website Seller Listing',
      city: newProperty.city,
      createdAt: new Date().toISOString(),
      notes: [`Newly posted property: ${newProperty.bhk} BHK ${newProperty.propertyType}`]
    };
    setLeads((prev) => [sellerLead, ...prev]);
    await createLeadInDb(sellerLead);

    showToast(`Property "${newProperty.title}" is now active on PropertyLelo!`);
    const gridEl = document.getElementById('properties-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 3. RBAC TEAM MANAGEMENT
  const handleCreateTeamMember = async (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member]);
    await createTeamMemberInDb(member);
  };

  const handleUpdateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    await updateTeamMemberInDb(id, updates);
  };

  const handleDeleteTeamMember = async (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    await deleteTeamMemberFromDb(id);
  };

  // 4. BLOG & SEO MANAGEMENT
  const handleSaveBlog = async (blog: BlogArticle) => {
    setBlogs((prev) => {
      const idx = prev.findIndex((b) => b.id === blog.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = blog;
        return copy;
      }
      return [blog, ...prev];
    });
    await saveBlogToDb(blog);
  };

  const handleApproveBlog = async (id: string) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'published' } : b))
    );
    await updateBlogInDb(id, { status: 'published' });
  };

  const handleRejectBlog = async (id: string, reason?: string) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'rejected', rejectionReason: reason } : b))
    );
    await updateBlogInDb(id, { status: 'rejected', rejectionReason: reason });
  };

  const handleDeleteBlog = async (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    await deleteBlogFromDb(id);
  };

  // 5. CMS SETTINGS MANAGEMENT
  const handleSaveCmsSettings = async (settings: CmsSettings) => {
    setCmsSettings(settings);
    await saveCmsSettingsToDb(settings);
  };

  // --- Consumer Site Inbound Lead Handlers ---
  const handleScheduleVisitSubmit = async (property: Property, details?: { name?: string; phone?: string; date?: string; timeSlot?: string }) => {
    const clientName = details?.name || 'Interested Buyer';
    const clientPhone = details?.phone || '+91 98xxx xxxxx';
    const visitDate = details?.date || new Date().toISOString().split('T')[0];
    const visitTime = details?.timeSlot || '11:00 AM - 01:00 PM';

    const newLead: Lead = {
      id: `lead-visit-${Date.now()}`,
      clientName,
      clientPhone,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: `${property.locality}, ${property.city}`,
      budget: `₹${(property.price / 100000).toFixed(1)} Lakhs`,
      status: 'New',
      category: 'Site Visit',
      source: 'Website Schedule Tour',
      city: property.city,
      createdAt: new Date().toISOString(),
      notes: [`Scheduled tour on ${visitDate} during ${visitTime}`]
    };
    setLeads((prev) => [newLead, ...prev]);
    await createLeadInDb(newLead);
    showToast(`Site visit booked for ${visitDate}! An SMS confirmation has been sent.`);
  };

  const handleContactOwnerSubmit = async (property: Property, details?: { name?: string; phone?: string; message?: string }) => {
    const clientName = details?.name || 'Verified Buyer';
    const clientPhone = details?.phone || '+91 98xxx xxxxx';
    const clientMsg = details?.message || 'Interested in this property, please share details';

    const newLead: Lead = {
      id: `lead-contact-${Date.now()}`,
      clientName,
      clientPhone,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: `${property.locality}, ${property.city}`,
      budget: `₹${(property.price / 100000).toFixed(1)} Lakhs`,
      status: 'New',
      category: 'Direct Seller Contact',
      source: 'Website Seller Inquiry',
      city: property.city,
      createdAt: new Date().toISOString(),
      notes: [clientMsg]
    };
    setLeads((prev) => [newLead, ...prev]);
    await createLeadInDb(newLead);
    showToast(`Contact request sent! You can now speak directly with ${property.posterName}.`);
  };

  const handleVipEnquirySubmit = async (project: NewProject, details?: { name?: string; phone?: string; budget?: string }) => {
    const clientName = details?.name || 'VIP Investor';
    const clientPhone = details?.phone || '+91 98xxx xxxxx';

    const newLead: Lead = {
      id: `lead-vip-${Date.now()}`,
      clientName,
      clientPhone,
      propertyTitle: project.name,
      propertyLocation: `${project.locality}, ${project.city}`,
      budget: details?.budget || project.priceRange,
      status: 'New',
      category: 'VIP Builder Launch',
      source: 'VIP Launch Enquiry',
      city: project.city,
      createdAt: new Date().toISOString(),
      notes: [`Requested VIP pre-launch pricing & RERA floor plan. Selected budget: ${details?.budget || project.priceRange}`]
    };
    setLeads((prev) => [newLead, ...prev]);
    await createLeadInDb(newLead);
    showToast(`VIP Pre-Launch access granted for ${project.name}! Brochure sent.`);
  };

  const handleLoanApplicationSubmit = async (amount: number, emi: number) => {
    const newLead: Lead = {
      id: `lead-loan-${Date.now()}`,
      clientName: 'Home Loan Applicant',
      clientPhone: '+91 98xxx xxxxx',
      budget: `₹${(amount / 100000).toFixed(1)} Lakhs`,
      status: 'New',
      category: 'Home Loan Application',
      source: 'EMI Calculator Tool',
      city: selectedCity,
      createdAt: new Date().toISOString(),
      notes: [`Requested loan amount: ₹${amount.toLocaleString('en-IN')}, Estimated EMI: ₹${emi.toLocaleString('en-IN')}`]
    };
    setLeads((prev) => [newLead, ...prev]);
    await createLeadInDb(newLead);
    showToast(`Loan application initiated for ₹${amount.toLocaleString('en-IN')}. SBI/HDFC advisor will call shortly.`);
  };

  // Search Filter Handler
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

  // Only show published properties on the public site
  const publishedProperties = properties.filter((p) => p.status === 'published' || !p.status);
  const savedPropertiesList = publishedProperties.filter((p) => savedIds.includes(p.id));

  // ==========================================
  // VIEW: FULL ENTERPRISE ADMIN / TEAM CRM
  // ==========================================
  if (isAdminView) {
    return (
      <AdminPortal
        teamMembers={teamMembers}
        leads={leads}
        properties={properties}
        blogs={blogs}
        cmsSettings={cmsSettings}
        onBackToHome={closeAdminPortal}
        onAssignLead={handleAssignLead}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onAddLeadNote={handleAddLeadNote}
        onCreateManualLead={handleCreateManualLead}
        onDeleteLead={handleDeleteLead}
        onApproveProperty={handleApproveProperty}
        onRejectProperty={handleRejectProperty}
        onSaveProperty={handleSaveProperty}
        onDeleteProperty={handleDeleteProperty}
        onTogglePropertyFeatured={handleTogglePropertyFeatured}
        onCreateTeamMember={handleCreateTeamMember}
        onUpdateTeamMember={handleUpdateTeamMember}
        onDeleteTeamMember={handleDeleteTeamMember}
        onSaveBlog={handleSaveBlog}
        onApproveBlog={handleApproveBlog}
        onRejectBlog={handleRejectBlog}
        onDeleteBlog={handleDeleteBlog}
        onSaveCmsSettings={handleSaveCmsSettings}
        onRefreshAllData={loadDatabaseData}
      />
    );
  }

  // ==========================================
  // VIEW: PUBLIC REAL ESTATE MARKETPLACE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#1A1A2E] font-sans antialiased flex flex-col selection:bg-[#FF6B35] selection:text-white">
      {/* 1. Header (Sticky with Announcement Bar + Admin Link) */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        savedCount={savedIds.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenEmiCalculator={() => {
          const el = document.getElementById('tools-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        announcementBar={cmsSettings.announcementBar}
        onOpenAdmin={openAdminPortal}
      />

      <main className="flex-grow pt-20">
        {/* 2. Hero Section (Controlled by CMS) */}
        {(cmsSettings.features.heroSearch ?? true) && (
          <Hero
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onSearch={handleHeroSearch}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
          />
        )}

        {/* 3. Featured Cities Grid */}
        {(cmsSettings.features.featuredCities ?? cmsSettings.features.cityPills ?? true) && (
          <FeaturedCities
            selectedCity={selectedCity}
            onSelectCity={(cityName) => {
              setSelectedCity(cityName);
              showToast(cityName ? `Viewing properties in ${cityName}` : 'Viewing all cities');
            }}
          />
        )}

        {/* 4. Why Choose Us (Trust Badges & Value Pillars) */}
        {(cmsSettings.features.whyChooseUs ?? true) && (
          <WhyChooseUs
            onOpenEmiCalculator={() => {
              const el = document.getElementById('tools-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
          />
        )}

        {/* 5. Main Verified Property Grid / Browser */}
        {(cmsSettings.features.propertyListings ?? cmsSettings.features.verifiedProperties ?? true) && (
          <PropertyGrid
            properties={publishedProperties}
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
        )}

        {/* 6. New Projects & Township Developments Carousel */}
        {(cmsSettings.features.newProjects ?? cmsSettings.features.featuredProjects ?? true) && (
          <NewProjectsCarousel
            onBrochureDownload={(projName) => {
              showToast(`Downloading official RERA Brochure & Floor Plan for ${projName}...`);
            }}
            onVipEnquiry={(proj) => setVipProject(proj)}
          />
        )}

        {/* 7. Tools Suite (EMI Calculator, Price Trends, Land Converter) */}
        {(cmsSettings.features.toolsSuite ?? cmsSettings.features.financialTools ?? true) && (
          <ToolsSuite
            onApplyLoan={handleLoanApplicationSubmit}
          />
        )}

        {/* 8. Market Insights & Legal Guides (Connected to Approved Blogs) */}
        {(cmsSettings.features.insightsBlog ?? cmsSettings.features.blogSection ?? true) && (
          <InsightsBlog blogs={blogs} onNotify={showToast} />
        )}

        {/* 9. Testimonials Carousel */}
        {(cmsSettings.features.testimonials ?? true) && (
          <Testimonials />
        )}

        {/* 10. CTA Banner ("Post Property for FREE") */}
        {(cmsSettings.features.postPropertyCta ?? cmsSettings.features.ctaBanner ?? true) && (
          <CtaBanner onOpenPostProperty={() => setIsPostPropertyOpen(true)} />
        )}

        {/* 11. Mobile App Download Banner */}
        {(cmsSettings.features.appDownloadBanner ?? true) && (
          <AppDownloadBanner onNotify={showToast} />
        )}
      </main>

      {/* 12. 5-Column Indian Real Estate Footer (with Admin Portal Link) */}
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
        onOpenAdmin={openAdminPortal}
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
        onAddProperty={handleAddPropertyFromConsumer}
        onNotify={showToast}
      />

      {/* Schedule Site Visit Modal */}
      <ScheduleVisitModal
        property={scheduleVisitProperty}
        isOpen={Boolean(scheduleVisitProperty)}
        onClose={() => setScheduleVisitProperty(null)}
        onSuccess={(msg, details) => {
          if (scheduleVisitProperty) {
            handleScheduleVisitSubmit(scheduleVisitProperty, details);
          }
          showToast(msg);
        }}
      />

      {/* Direct Contact Seller Modal */}
      <ContactOwnerModal
        property={contactProperty}
        isOpen={Boolean(contactProperty)}
        onClose={() => setContactProperty(null)}
        onSuccess={(msg, details) => {
          if (contactProperty) {
            handleContactOwnerSubmit(contactProperty, details);
          }
          showToast(msg);
        }}
      />

      {/* VIP Builder Launch Modal */}
      <VipProjectModal
        project={vipProject}
        isOpen={Boolean(vipProject)}
        onClose={() => setVipProject(null)}
        onSuccess={(msg, details) => {
          if (vipProject) {
            handleVipEnquirySubmit(vipProject, details);
          }
          showToast(msg);
        }}
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
