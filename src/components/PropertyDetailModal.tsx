import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  MapPin, 
  BedDouble, 
  Maximize2, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  Share2, 
  Check, 
  Compass, 
  Building2, 
  Layers, 
  Car, 
  Bath, 
  Sparkles,
  IndianRupee,
  Calculator,
  Download,
  MessageCircle,
  ExternalLink,
  Clock,
  Award,
  ChevronDown,
  ChevronRight,
  FileText,
  Info,
  CheckCircle2,
  TreePine,
  Zap,
  ShoppingBag,
  Briefcase,
  Utensils,
  Plane,
  GraduationCap,
  Hospital
} from 'lucide-react';
import { Property, ProjectConfiguration, FloorPlanItem, LandmarkDistance } from '../types/property';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onContactClick: (property: Property) => void;
  onScheduleVisitClick: (property: Property) => void;
  onNotify: (msg: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onContactClick,
  onScheduleVisitClick,
  onNotify
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeNavTab, setActiveNavTab] = useState<'overview' | 'highlights' | 'pricing' | 'floorplans' | 'amenities' | 'location' | 'developer' | 'faq'>('overview');
  const [activeFloorPlanIdx, setActiveFloorPlanIdx] = useState(0);
  const [selectedUnitCategory, setSelectedUnitCategory] = useState<string>('all');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Enquiry Sidebar Form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadUnitInterest, setLeadUnitInterest] = useState('');
  const [leadBudget, setLeadBudget] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Section Refs for smooth scrolling
  const overviewRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const floorplansRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const developerRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80'
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onNotify('Property link copied to clipboard!');
    }
  };

  const scrollToSection = (tab: typeof activeNavTab) => {
    setActiveNavTab(tab);
    const refMap = {
      overview: overviewRef,
      highlights: highlightsRef,
      pricing: pricingRef,
      floorplans: floorplansRef,
      amenities: amenitiesRef,
      location: locationRef,
      developer: developerRef,
      faq: faqRef
    };
    const targetRef = refMap[tab];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSidebarEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim()) {
      onNotify('Please provide your mobile number for callback.');
      return;
    }
    setIsSubmittingLead(true);
    setTimeout(() => {
      setIsSubmittingLead(false);
      setLeadSubmitted(true);
      onNotify('Thank you! A verified property advisor will contact you within 15 minutes.');
    }, 600);
  };

  const handleDownloadBrochure = () => {
    onNotify('Downloading Official Project Brochure PDF...');
    // Trigger download or mock PDF link
    const link = document.createElement('a');
    link.href = property.brochureUrl || 'https://wealth-clinic.com/properties-in-noida/orion-one-32';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  // Generate configurations if not present (fallback for existing properties)
  const configurations: ProjectConfiguration[] = property.configurations && property.configurations.length > 0
    ? property.configurations
    : [
        {
          id: 'c1',
          unitType: property.bhk > 0 ? `${property.bhk} BHK Luxury Residence` : `${property.type} Unit`,
          carpetArea: `${Math.round(property.area * 0.75)} sq.ft`,
          superArea: `${property.area} sq.ft`,
          price: property.priceFormatted,
          priceNumeric: property.price,
          pricePerSqft: `₹${property.pricePerSqft.toLocaleString('en-IN')}/sq.ft`,
          floor: property.floor || 'All Typical Floors'
        },
        {
          id: 'c2',
          unitType: property.bhk > 0 ? `${property.bhk + 1} BHK Executive Suite` : `Premium Corner ${property.type}`,
          carpetArea: `${Math.round(property.area * 1.15)} sq.ft`,
          superArea: `${Math.round(property.area * 1.35)} sq.ft`,
          price: `₹${(Math.round((property.price * 1.3) / 100000) * 100000 / 10000000).toFixed(2)} Cr*`,
          priceNumeric: Math.round(property.price * 1.3),
          pricePerSqft: `₹${property.pricePerSqft.toLocaleString('en-IN')}/sq.ft`,
          floor: 'Upper Premium Floors'
        }
      ];

  // Filtered configurations
  const filteredConfigurations = selectedUnitCategory === 'all'
    ? configurations
    : configurations.filter((c) => c.unitType.toLowerCase().includes(selectedUnitCategory.toLowerCase()));

  // Floor Plans
  const floorPlans: FloorPlanItem[] = property.floorPlans && property.floorPlans.length > 0
    ? property.floorPlans
    : [
        {
          id: 'fp-1',
          title: 'Master Campus Site Layout Plan',
          type: 'Master Plan',
          size: property.totalLandArea || `${property.area} sq.ft Site`,
          image: images[0],
          description: 'Comprehensive campus circulation plan showing entrances, landscaping, parking and tower footprint.'
        },
        {
          id: 'fp-2',
          title: property.bhk > 0 ? `Typical ${property.bhk} BHK Floor Blueprint` : 'Typical Commercial Floor Plate',
          type: 'Floor Plate',
          size: `${property.area} sq.ft Super Built-up`,
          image: images[1] || images[0],
          description: 'Engineered layout with maximum carpet efficiency, wide corridors, and optimal natural lighting.'
        }
      ];

  // Highlights
  const highlights = property.highlights && property.highlights.length > 0
    ? property.highlights
    : [
        `Prime location in ${property.locality}, ${property.city} with direct arterial highway connectivity`,
        `RERA Approved Project (${property.reraId || 'Verified & Compliant'}) with transparent title deeds`,
        `${property.possession} with on-schedule construction progress and clear builder milestones`,
        `Super Built-up Area: ${property.area} sq.ft with spacious ventilated layouts and modern finishes`,
        `Equipped with 24x7 security, 100% power backup, high-speed elevators, and dedicated parking`,
        `Expected rental yield of 8-12% with high tenant demand in surrounding corporate catchment`
      ];

  // Location Advantages
  const locationAdvantages: LandmarkDistance[] = property.locationAdvantages && property.locationAdvantages.length > 0
    ? property.locationAdvantages
    : [
        { landmark: 'Main Highway / Expressway Corridor', time: '0 Mins (Direct)', category: 'Connectivity' },
        { landmark: 'Nearest Metro Station / Transit Station', time: '4 Mins', category: 'Connectivity' },
        { landmark: 'Top Multi-Specialty Hospital & Trauma Center', time: '3 Mins', category: 'Healthcare' },
        { landmark: 'Prominent Universities & International Schools', time: '5 Mins', category: 'Education' },
        { landmark: 'Major IT Tech Park & MNC Corporate Hub', time: '5 Mins', category: 'Corporate' },
        { landmark: 'International Airport Connectivity', time: '35 Mins', category: 'Airport' }
      ];

  // FAQs
  const faqs = property.faqs && property.faqs.length > 0
    ? property.faqs
    : [
        {
          question: `Is ${property.title} approved under State RERA?`,
          answer: `Yes, this property is strictly compliant and registered under RERA (${property.reraId || 'Registered & Verified'}). All architectural drawings, land approvals, and statutory sanctions are officially validated.`
        },
        {
          question: `What are the financial and bank loan approvals available?`,
          answer: `The project is approved for home loans and commercial loans with attractive interest rates by leading nationalized and private banks including SBI, HDFC Bank, ICICI Bank, Axis Bank, and Punjab National Bank.`
        },
        {
          question: `What is the possession timeline and construction stage?`,
          answer: `Current status is ${property.possession}. Expected formal handover is ${property.possessionDate || 'on schedule as per RERA commitments'}.`
        },
        {
          question: `Are there any brokerage fees when purchasing through this portal?`,
          answer: `No. We offer a strict Zero Brokerage Guarantee for new builder bookings and verified developer inventory.`
        }
      ];

  // Estimated stamp duty & registration (approx 6% in India)
  const estimatedGovtCharges = Math.round(property.price * 0.06);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 25 }}
        className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] overflow-y-auto z-10 shadow-2xl border border-slate-200/80"
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 border-b border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 truncate pr-4">
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-[#002869] text-white tracking-wider uppercase">
              {property.reraId ? 'RERA Approved' : 'Verified'}
            </span>
            <div className="flex items-center text-xs text-slate-500 font-medium truncate">
              <span>Home</span>
              <ChevronRight className="w-3 h-3 mx-1 text-slate-400 shrink-0" />
              <span className="truncate">{property.city}</span>
              <ChevronRight className="w-3 h-3 mx-1 text-slate-400 shrink-0" />
              <span className="font-bold text-slate-800 truncate">{property.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Share Property"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer ${
                isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
              }`}
              title="Save Property"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wealth Clinic Style Top Hero Title Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-[#002869] to-slate-900 text-white px-4 sm:px-8 py-6 sm:py-8 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#FF6B35] text-white text-xs font-extrabold tracking-wide uppercase shadow-xs">
                  {property.category}
                </span>
                {property.reraId && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    RERA: {property.reraId}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium border border-white/15">
                  {property.possession} • {property.possessionDate || 'Dec 2026'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300">
                <span className="font-semibold text-amber-300">
                  By {property.developerName || property.posterName || 'Premier Developer'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
                  {property.locality}, {property.city}, {property.state} - {property.pincode}
                </span>
              </div>

              {property.projectArchitecture && (
                <p className="text-xs text-blue-200/90 font-medium">
                  {property.projectArchitecture}
                </p>
              )}
            </div>

            {/* Price Tag & Quick CTAs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col sm:flex-row lg:flex-col justify-between gap-4 shrink-0 lg:min-w-[320px]">
              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Investment & Price
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                  {property.priceRange || property.priceFormatted}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft • EMI starts ₹48,500/mo*
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadBrochure}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>Brochure</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onScheduleVisitClick(property);
                  }}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#e0531e] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Site Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wealth Clinic Sticky Sub-Navigation Bar */}
        <div className="sticky top-[57px] z-20 bg-slate-50 border-b border-slate-200 px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-3 text-xs font-bold text-slate-600">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'highlights', label: 'Highlights & USPs' },
            { id: 'pricing', label: 'Price & Configurations' },
            { id: 'floorplans', label: 'Floor Plans' },
            { id: 'amenities', label: 'Amenities' },
            { id: 'location', label: 'Location Advantage' },
            { id: 'developer', label: 'About Developer' },
            { id: 'faq', label: 'FAQs' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeNavTab === tab.id
                  ? 'bg-[#002869] text-white shadow-xs'
                  : 'hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Media & Gallery Showcase */}
        <div className="px-4 sm:px-8 pt-6 pb-2">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={images[activePhotoIdx]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Badges on Gallery Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                Photo {activePhotoIdx + 1} of {images.length}
              </span>
              {property.leaseGuarantee && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-xs font-extrabold shadow-md">
                  ★ {property.leaseGuarantee}
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-semibold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg">
                {property.title} • {property.locality}
              </span>
              <span className="hidden sm:inline bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg">
                Click thumbnails below to explore spaces
              </span>
            </div>
          </div>

          {/* Thumbnail Carousel */}
          {images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto no-scrollbar pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx ? 'border-[#FF6B35] scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Key Stat Bar below Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Land Parcel</span>
              <span className="text-sm font-extrabold text-[#002869]">
                {property.totalLandArea || `${property.area} sq.ft`}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Towers & Units</span>
              <span className="text-sm font-extrabold text-[#002869]">
                {property.totalTowers || '3 Towers'} • {property.totalUnits || '700+ Units'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Project Status</span>
              <span className="text-sm font-extrabold text-emerald-600">
                {property.projectStatus || property.possession}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Possession</span>
              <span className="text-sm font-extrabold text-[#FF6B35]">
                {property.possessionDate || 'December 2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Responsive Body */}
        <div className="px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT CONTENT COLUMN (68%) */}
          <div className="lg:col-span-8 space-y-10">

            {/* SECTION 1: OVERVIEW */}
            <div ref={overviewRef} id="overview" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Building2 className="w-5 h-5 text-[#002869]" />
                <h2 className="text-xl font-extrabold text-[#002869] font-heading">
                  Project Overview & Quick Facts
                </h2>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
                {property.description}
              </p>

              {/* Facts Grid Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Key Project Specifications
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-xs">
                  <div className="divide-y divide-slate-100">
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Project Name</span>
                      <span className="font-bold text-slate-900">{property.title}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Developer</span>
                      <span className="font-bold text-slate-900">{property.developerName || property.posterName}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Location</span>
                      <span className="font-bold text-slate-900">{property.locality}, {property.city}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Property Type</span>
                      <span className="font-bold text-slate-900">{property.type} ({property.category})</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Total Land Parcel</span>
                      <span className="font-bold text-slate-900">{property.totalLandArea || '10 Acres'}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">RERA Registration</span>
                      <span className="font-bold text-emerald-600 font-mono">{property.reraId || 'UPRERAPRJ960554'}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Towers & Units</span>
                      <span className="font-bold text-slate-900">{property.totalTowers || '3 Towers'} ({property.totalUnits || '703 Units'})</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Possession Timeline</span>
                      <span className="font-bold text-[#FF6B35]">{property.possessionDate || 'December 2026'}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Super Built-up Area</span>
                      <span className="font-bold text-slate-900">{property.area} sq.ft</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-4">
                      <span className="text-slate-500">Furnishing & Parking</span>
                      <span className="font-bold text-slate-900">{property.furnishing} • {property.parking}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: HIGHLIGHTS & USPS (Wealth Clinic Signature) */}
            <div ref={highlightsRef} id="highlights" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Sparkles className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="text-xl font-extrabold text-[#002869] font-heading">
                  Key Highlights & Project USPs
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 transition-all flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-blue-100/70 text-[#002869] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: PRICING & CONFIGURATIONS (Interactive Table) */}
            <div ref={pricingRef} id="pricing" className="scroll-mt-32 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-[#002869]" />
                  <h2 className="text-xl font-extrabold text-[#002869] font-heading">
                    Price List & Available Configurations
                  </h2>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedUnitCategory('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedUnitCategory === 'all'
                        ? 'bg-[#002869] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUnitCategory('retail')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedUnitCategory === 'retail'
                        ? 'bg-[#002869] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Retail
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUnitCategory('office')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedUnitCategory === 'office'
                        ? 'bg-[#002869] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Office
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUnitCategory('court')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedUnitCategory === 'court'
                        ? 'bg-[#002869] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Food Court
                  </button>
                </div>
              </div>

              {/* Configurations Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#002869] text-white font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Unit Type</th>
                      <th className="py-3 px-4">Carpet / Super Area</th>
                      <th className="py-3 px-4">Starting Price</th>
                      <th className="py-3 px-4">Price / sq.ft</th>
                      <th className="py-3 px-4">Level / Floor</th>
                      <th className="py-3 px-4 text-right">Cost Sheet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredConfigurations.map((cfg, i) => (
                      <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {cfg.unitType}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="font-semibold text-slate-800">{cfg.carpetArea}</span>
                          {cfg.superArea && (
                            <span className="text-slate-400 block text-[11px]">(Super: {cfg.superArea})</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-[#002869] text-sm">
                          {cfg.price}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {cfg.pricePerSqft || `₹${property.pricePerSqft.toLocaleString('en-IN')}/sq.ft`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {cfg.floor || 'Multiple Levels'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onContactClick(property);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#FF6B35] hover:bg-[#e0531e] text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
                          >
                            Price Breakup
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Outflow Calculation Card */}
              <div className="bg-gradient-to-br from-slate-900 to-[#002869] rounded-2xl p-5 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" />
                    Estimated Total Acquisition Cost
                  </h4>
                  <span className="text-[11px] text-blue-200">Approximate Govt. Charges</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-white/15">
                  <div>
                    <span className="text-blue-200 block text-[11px]">Base Asset Cost:</span>
                    <span className="font-bold text-white text-sm">{property.priceFormatted}</span>
                  </div>
                  <div>
                    <span className="text-blue-200 block text-[11px]">Est. Stamp Duty & Reg. (6%):</span>
                    <span className="font-bold text-white text-sm">₹{estimatedGovtCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-blue-200 block text-[11px]">Total Estimated Outflow:</span>
                    <span className="font-extrabold text-amber-300 text-base">
                      ₹{(property.price + estimatedGovtCharges).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: FLOOR PLANS & MASTER LAYOUT */}
            <div ref={floorplansRef} id="floorplans" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Layers className="w-5 h-5 text-[#002869]" />
                <h2 className="text-xl font-extrabold text-[#002869] font-heading">
                  Floor Plans & Master Layout
                </h2>
              </div>

              {/* Floor plan tabs */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {floorPlans.map((plan, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveFloorPlanIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      activeFloorPlanIdx === idx
                        ? 'bg-[#002869] text-white border-[#002869] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {plan.title}
                  </button>
                ))}
              </div>

              {/* Active Floor Plan Card */}
              {floorPlans[activeFloorPlanIdx] && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {floorPlans[activeFloorPlanIdx].title}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        Unit Size / Area: {floorPlans[activeFloorPlanIdx].size} • Category: {floorPlans[activeFloorPlanIdx].type}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadBrochure}
                      className="py-2 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#002869] border border-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>Download Plan PDF</span>
                    </button>
                  </div>

                  <div className="aspect-[16/10] sm:aspect-[2/1] rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-4">
                    <img
                      src={floorPlans[activeFloorPlanIdx].image}
                      alt={floorPlans[activeFloorPlanIdx].title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {floorPlans[activeFloorPlanIdx].description && (
                    <p className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200/80">
                      {floorPlans[activeFloorPlanIdx].description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* SECTION 5: WORLD-CLASS AMENITIES */}
            <div ref={amenitiesRef} id="amenities" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Sparkles className="w-5 h-5 text-[#002869]" />
                <h2 className="text-xl font-extrabold text-[#002869] font-heading">
                  World-Class Amenities & Facilities
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {property.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 font-semibold text-slate-800 transition-colors"
                  >
                    <Check className="w-4 h-4 text-[#FF6B35] shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: LOCATION ADVANTAGE & CONNECTIVITY */}
            <div ref={locationRef} id="location" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <MapPin className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="text-xl font-extrabold text-[#002869] font-heading">
                  Location Advantage & Connectivity
                </h2>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-[#FF6B35]" />
                    <span>{property.locality}, {property.city}</span>
                  </div>
                  <span className="text-slate-500 font-medium">
                    State: {property.state} • PIN: {property.pincode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {locationAdvantages.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {item.category === 'Education' ? (
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                        ) : item.category === 'Healthcare' ? (
                          <Hospital className="w-4 h-4 text-rose-500" />
                        ) : item.category === 'Airport' ? (
                          <Plane className="w-4 h-4 text-amber-500" />
                        ) : item.category === 'Corporate' ? (
                          <Briefcase className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <MapPin className="w-4 h-4 text-[#FF6B35]" />
                        )}
                        <span className="font-semibold text-slate-800">{item.landmark}</span>
                      </div>
                      <span className="font-extrabold text-[#002869] bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Google Maps link CTA */}
                <div className="pt-2 flex justify-end">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.title + ' ' + property.locality + ' ' + property.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002869] hover:underline"
                  >
                    <span>Open Location in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* SECTION 7: ABOUT DEVELOPER */}
            <div ref={developerRef} id="developer" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Award className="w-5 h-5 text-[#002869]" />
                <h2 className="text-xl font-extrabold text-[#002869] font-heading">
                  About the Developer
                </h2>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">
                    {property.developerName || property.posterName || 'Reputed Real Estate Developer'}
                  </h4>
                  <span className="text-xs font-bold text-[#002869] bg-blue-100/70 px-2.5 py-1 rounded-full">
                    {property.developerExperience || '15+ Years Track Record'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {property.aboutDeveloper ||
                    `${property.developerName || property.posterName} is a distinguished real estate group dedicated to crafting sustainable, high-value infrastructure across North India. With timely handovers and transparent RERA compliance, the group continues to set benchmarks in residential and commercial luxury.`}
                </p>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-200">
                  <span>Delivered: <strong className="text-slate-800">{property.developerDeliveredProjects || '10+ Projects'}</strong></span>
                  <span>•</span>
                  <span>Active Landbank: <strong className="text-slate-800">Delhi NCR, Noida, Greater Noida</strong></span>
                </div>
              </div>
            </div>

            {/* SECTION 8: FAQS ACCORDION */}
            <div ref={faqRef} id="faq" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Info className="w-5 h-5 text-[#002869]" />
                <h2 className="text-xl font-extrabold text-[#002869] font-heading">
                  Frequently Asked Questions (FAQs)
                </h2>
              </div>

              <div className="space-y-2.5">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="font-bold text-xs sm:text-sm text-slate-800">
                          {faq.question}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (32% - WEALTH CLINIC STICKY SIDEBAR ENQUIRY BOX) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">

              {/* Wealth Clinic Style Lead Card */}
              <div className="bg-white rounded-3xl p-6 border-2 border-[#002869]/10 shadow-xl space-y-5">
                
                {/* Header */}
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-extrabold text-[#FF6B35] tracking-widest uppercase block">
                    Zero Brokerage Guaranteed
                  </span>
                  <h3 className="text-lg font-extrabold text-[#002869] font-heading mt-0.5">
                    Schedule Free Consultation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect with a certified investment advisor for genuine inventory & bulk discount pricing.
                  </p>
                </div>

                {leadSubmitted ? (
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-900 text-sm">Enquiry Registered!</h4>
                    <p className="text-xs text-emerald-700">
                      Our Senior Advisor for {property.title} will reach out to your number within 15 minutes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setLeadSubmitted(false)}
                      className="mt-2 text-xs font-bold text-emerald-800 underline cursor-pointer"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSidebarEnquiry} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#002869] bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Mobile Phone (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="e.g. 98110 44210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#002869] bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#002869] bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Interested Space / Configuration
                      </label>
                      <select
                        value={leadUnitInterest}
                        onChange={(e) => setLeadUnitInterest(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#002869] bg-slate-50/50 text-slate-800"
                      >
                        <option value="">Select Configuration</option>
                        <option value="Retail Shop">Retail Shop (Ground / 1st Floor)</option>
                        <option value="Commercial Office">Commercial Office Suite</option>
                        <option value="Food Court">Gourmet Food Court Unit</option>
                        <option value="Studio Apartment">Serviced Studio Suite</option>
                        <option value="Residential">Residential Luxury Flat</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-3 px-4 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Phone className="w-4 h-4 text-[#FF6B35]" />
                      <span>{isSubmittingLead ? 'Submitting...' : 'Request Instant Call Back'}</span>
                    </button>
                  </form>
                )}

                {/* Instant Actions & Direct Phone */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                  <button
                    type="button"
                    onClick={handleDownloadBrochure}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-amber-200"
                  >
                    <Download className="w-4 h-4 text-[#FF6B35]" />
                    <span>Download Project Brochure (PDF)</span>
                  </button>

                  <a
                    href={`https://wa.me/919811044210?text=${encodeURIComponent(`Hello, I am interested in ${property.title} located at ${property.locality}, ${property.city}. Please share price list and floor plans.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-slate-400 block">Direct Helpline Number:</span>
                    <a
                      href="tel:+919811044210"
                      className="text-sm font-extrabold text-[#002869] hover:underline flex items-center justify-center gap-1.5 mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>+91 98110 44210</span>
                    </a>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% RERA Verified Inventory</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Zero Brokerage on Direct Builder Booking</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>50,000+ Satisfied Property Investors</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
