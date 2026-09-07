import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle2, 
  Save, 
  AlertTriangle, 
  Megaphone, 
  Phone, 
  Mail, 
  MapPin, 
  Eye, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CmsSettings } from '../../types/property';

const DEFAULT_CONTACT_INFO = {
  helpline: '1800-419-7421',
  email: 'support@propertylelo.com',
  address: 'DLF Cyber City, Tower B, Sector 25, Gurugram, Haryana 122002',
  workingHours: 'Monday - Saturday: 9:00 AM - 8:00 PM'
};

interface AdminCmsSettingsProps {
  settings: CmsSettings;
  onSaveSettings: (settings: CmsSettings) => Promise<void>;
  onNotify: (msg: string) => void;
}

export const AdminCmsSettings: React.FC<AdminCmsSettingsProps> = ({
  settings,
  onSaveSettings,
  onNotify
}) => {
  const [formData, setFormData] = useState<CmsSettings>(() => ({
    ...settings,
    contactInfo: settings?.contactInfo || DEFAULT_CONTACT_INFO
  }));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        ...settings,
        contactInfo: settings.contactInfo || DEFAULT_CONTACT_INFO
      });
    }
  }, [settings]);

  const toggleFeature = (key: keyof CmsSettings['features']) => {
    setFormData(prev => {
      const currentVal = Boolean(prev.features[key]);
      const nextVal = !currentVal;
      const updated = { ...prev.features, [key]: nextVal };
      if (key === 'cityPills' || key === 'featuredCities') {
        updated.cityPills = nextVal;
        updated.featuredCities = nextVal;
      }
      if (key === 'verifiedProperties' || key === 'propertyListings') {
        updated.verifiedProperties = nextVal;
        updated.propertyListings = nextVal;
      }
      if (key === 'featuredProjects' || key === 'newProjects') {
        updated.featuredProjects = nextVal;
        updated.newProjects = nextVal;
      }
      if (key === 'financialTools' || key === 'toolsSuite') {
        updated.financialTools = nextVal;
        updated.toolsSuite = nextVal;
      }
      if (key === 'blogSection' || key === 'insightsBlog') {
        updated.blogSection = nextVal;
        updated.insightsBlog = nextVal;
      }
      if (key === 'postPropertyCta' || key === 'ctaBanner') {
        updated.postPropertyCta = nextVal;
        updated.ctaBanner = nextVal;
      }
      return {
        ...prev,
        features: updated
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveSettings(formData);
    setIsSaving(false);
    onNotify('Website CMS Settings updated and pushed live to Firestore!');
  };

  const featureLabels: { key: keyof CmsSettings['features']; title: string; desc: string }[] = [
    {
      key: 'heroSearch',
      title: 'Hero Search & City Selector',
      desc: 'Top animated search bar with Buy / Commercial / New Projects category tabs'
    },
    {
      key: 'cityPills',
      title: 'Top Cities Carousel Bar',
      desc: 'Quick navigation pills for Delhi NCR, Mumbai, Bangalore, Pune, etc.'
    },
    {
      key: 'whyChooseUs',
      title: 'Why Choose PropertyLelo Trust Pillars',
      desc: '0% Brokerage, 100% RERA Verified, AI Valuation, and 48hr Visits'
    },
    {
      key: 'verifiedProperties',
      title: 'Verified Properties Showcase Grid',
      desc: 'Primary property listing cards with image galleries, price filters & tags'
    },
    {
      key: 'featuredProjects',
      title: 'VIP Builder Launches & New Projects',
      desc: 'Carousel of premium upcoming residential towers from DLF, Godrej, Prestige'
    },
    {
      key: 'financialTools',
      title: 'Financial Tools Suite (EMI & Price Trends)',
      desc: 'Interactive home loan EMI calculator and 5-year locality growth chart'
    },
    {
      key: 'blogSection',
      title: 'Market Insights & SEO Blog Grid',
      desc: 'Displays approved educational articles and micro-market analysis reports'
    },
    {
      key: 'testimonials',
      title: 'Verified Buyer Testimonials',
      desc: 'Customer reviews, ratings, and video success testimonials'
    },
    {
      key: 'postPropertyCta',
      title: 'Free Post Property Banner CTA',
      desc: 'Full-width banner prompting sellers and landlords to list properties free'
    },
    {
      key: 'appDownloadBanner',
      title: 'Mobile App Store Download Banner',
      desc: 'Banner promoting the PropertyLelo Android and iOS applications'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <span>Website CMS & Dynamic Section Controller</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Real-time Live Sync
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Super Admin can enable, disable, or modify every section and announcement bar on the live consumer website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#FF6B35]/20 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing to Live...' : 'Publish CMS Changes Live'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 2. Top Announcement Bar Config */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#FF6B35]" />
              <h3 className="font-bold text-sm text-slate-900">
                Top Announcement Ticker Banner
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                announcementBar: {
                  ...prev.announcementBar,
                  enabled: !prev.announcementBar.enabled
                }
              }))}
              className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                formData.announcementBar.enabled 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {formData.announcementBar.enabled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Banner is Visible on Live Site</span>
                </>
              ) : (
                <span>Banner is Hidden</span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
              <input
                type="text"
                value={formData.announcementBar.badge}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  announcementBar: { ...prev.announcementBar, badge: e.target.value }
                }))}
                placeholder="e.g. FESTIVE LAUNCH 2026"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#FF6B35]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Announcement Message Text</label>
              <input
                type="text"
                value={formData.announcementBar.text}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  announcementBar: { ...prev.announcementBar, text: e.target.value }
                }))}
                placeholder="e.g. Zero Brokerage on all verified direct owner listings this week."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Call-to-Action Link Text</label>
              <input
                type="text"
                value={formData.announcementBar.linkText}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  announcementBar: { ...prev.announcementBar, linkText: e.target.value }
                }))}
                placeholder="e.g. Claim Offer Now"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Section Link URL</label>
              <input
                type="text"
                value={formData.announcementBar.linkUrl}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  announcementBar: { ...prev.announcementBar, linkUrl: e.target.value }
                }))}
                placeholder="e.g. #listings or #projects"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 3. Feature Section Granular Toggles */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#002869]" />
              <h3 className="font-bold text-sm text-slate-900">
                Front-End Website Section Visibility (10 Dynamic Modules)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Toggle any module on or off. Disabled sections instantly vanish from the consumer facing website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {featureLabels.map(({ key, title, desc }) => {
              const isEnabled = formData.features[key];

              return (
                <div 
                  key={key}
                  onClick={() => toggleFeature(key)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isEnabled 
                      ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300' 
                      : 'bg-slate-100/50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span>{title}</span>
                      {isEnabled && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {desc}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isEnabled ? 'bg-[#002869]' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        isEnabled ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Company Helpline & Contact Details */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#002869]" />
            <h3 className="font-bold text-sm text-slate-900">
              Helpline & Corporate Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Toll-Free Helpline</label>
              <input
                type="text"
                value={formData.contactInfo?.helpline || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: {
                    helpline: e.target.value,
                    email: prev.contactInfo?.email || DEFAULT_CONTACT_INFO.email,
                    workingHours: prev.contactInfo?.workingHours || DEFAULT_CONTACT_INFO.workingHours,
                    address: prev.contactInfo?.address || DEFAULT_CONTACT_INFO.address
                  }
                }))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Support Email</label>
              <input
                type="email"
                value={formData.contactInfo?.email || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: {
                    helpline: prev.contactInfo?.helpline || DEFAULT_CONTACT_INFO.helpline,
                    email: e.target.value,
                    workingHours: prev.contactInfo?.workingHours || DEFAULT_CONTACT_INFO.workingHours,
                    address: prev.contactInfo?.address || DEFAULT_CONTACT_INFO.address
                  }
                }))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Working Hours</label>
              <input
                type="text"
                value={formData.contactInfo?.workingHours || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: {
                    helpline: prev.contactInfo?.helpline || DEFAULT_CONTACT_INFO.helpline,
                    email: prev.contactInfo?.email || DEFAULT_CONTACT_INFO.email,
                    workingHours: e.target.value,
                    address: prev.contactInfo?.address || DEFAULT_CONTACT_INFO.address
                  }
                }))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">Headquarters Physical Address</label>
            <input
              type="text"
              value={formData.contactInfo?.address || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactInfo: {
                  helpline: prev.contactInfo?.helpline || DEFAULT_CONTACT_INFO.helpline,
                  email: prev.contactInfo?.email || DEFAULT_CONTACT_INFO.email,
                  workingHours: prev.contactInfo?.workingHours || DEFAULT_CONTACT_INFO.workingHours,
                  address: e.target.value
                }
              }))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-[#FF6B35] hover:bg-[#E85520] text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FF6B35]/25"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Firestore...' : 'Save & Publish All CMS Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
