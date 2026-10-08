import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Building2, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Award,
  Layers,
  FileText,
  Clock
} from 'lucide-react';
import { 
  Property, 
  ListingCategory, 
  PropertyType, 
  FurnishingStatus, 
  PossessionStatus, 
  PostedByType 
} from '../types/property';
import { CitySelector } from './CitySelector';
import { ImageUploadField } from './admin/ImageUploadField';
import confetti from 'canvas-confetti';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (property: Property) => void;
  onNotify: (msg: string) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  onNotify
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generatedId, setGeneratedId] = useState<string>('');

  // Step 1: Project / Property Basics
  const [title, setTitle] = useState('');
  const [developerName, setDeveloperName] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [postedBy, setPostedBy] = useState<PostedByType>('Owner');

  // Step 2: Location & Project Scale
  const [city, setCity] = useState('Delhi NCR');
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState<number>(3);
  const [area, setArea] = useState<number>(1450);
  const [price, setPrice] = useState<number>(12500000);
  const [priceRange, setPriceRange] = useState('');
  const [totalLandArea, setTotalLandArea] = useState('10 Acres');
  const [totalTowers, setTotalTowers] = useState('3 Towers');
  const [totalUnits, setTotalUnits] = useState('703 Units');
  const [leaseGuarantee, setLeaseGuarantee] = useState('29-Year Lease Guarantee • 12% Assured Returns');

  // Step 3: Project Highlights, Amenities, Media & Contact
  const [reraId, setReraId] = useState('UPRERAPRJ960554');
  const [possession, setPossession] = useState<PossessionStatus>('Under Construction');
  const [possessionDate, setPossessionDate] = useState('December 2026');
  const [highlightsInput, setHighlightsInput] = useState(
    "India's 1st Freeport Outlet Mall, 3-Acre Courtyard with 5 Beaches, 12% Assured Returns, LEED Gold Rated Complex"
  );
  const [brochureUrl, setBrochureUrl] = useState('');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi-Furnished');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Clubhouse',
    'Swimming Pool',
    '24/7 Power Backup',
    'Security CCTV',
    'Covered Car Parking'
  ]);
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  );
  const [posterName, setPosterName] = useState('Authorized Listing Desk');
  const [posterPhone, setPosterPhone] = useState('+91 98110 44210');
  const [description, setDescription] = useState(
    'Prime project with world-class amenities, premium layout design, and guaranteed appreciation.'
  );

  if (!isOpen) return null;

  const popularAmenities = [
    'Clubhouse',
    'Swimming Pool',
    '24/7 Power Backup',
    'Security CCTV',
    'Gymnasium',
    'Children Play Area',
    'EV Charging Station',
    'Covered Car Parking',
    'Vastu Compliant',
    'Tennis Court',
    'Food Court & Retail Promenade',
    'High-Speed Elevators'
  ];

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const formatIndianCurrency = (num: number) => {
    if (!num) return '₹0';
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!locality || !posterName || !posterPhone) {
      onNotify('Please complete all required fields');
      return;
    }

    const newId = 'prop-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedId(newId);

    // Calculate formatted price
    let formattedPrice = '';
    if (price >= 10000000) {
      formattedPrice = `₹${(price / 10000000).toFixed(2)} Cr`;
    } else {
      formattedPrice = `₹${(price / 100000).toFixed(0)} Lakh`;
    }

    // Split highlights by comma
    const parsedHighlights = highlightsInput
      ? highlightsInput.split(',').map((h) => h.trim()).filter(Boolean)
      : [
          `Prime location in ${locality}, ${city}`,
          `RERA Approved Project (${reraId}) with transparent approvals`,
          `Possession by ${possessionDate}`,
          `Super Built-up Area: ${area} sq.ft with modern architecture`
        ];

    const projectTitle = title || (
      developerName 
        ? `${developerName} ${locality}` 
        : `${bhk > 0 ? `${bhk} BHK ` : ''}${propertyType} in ${locality}`
    );

    const newProperty: Property = {
      id: newId,
      title: projectTitle,
      developerName: developerName || 'Reputed Real Estate Group',
      tagline: 'Verified Project • Zero Brokerage',
      type: propertyType,
      category: category,
      bhk: propertyType === 'Plot' || propertyType === 'Commercial Office' ? 0 : bhk,
      price: price,
      priceFormatted: formattedPrice,
      priceRange: priceRange || `${formattedPrice} Onwards*`,
      pricePerSqft: Math.round(price / (area || 1000)),
      area: area || 1200,
      totalLandArea: totalLandArea || '10 Acres',
      totalTowers: totalTowers || '3 Towers',
      totalUnits: totalUnits || '703 Units',
      leaseGuarantee: leaseGuarantee,
      reraId: reraId || 'UPRERAPRJ960554',
      locality: locality,
      city: city,
      state: 'Uttar Pradesh',
      pincode: '201310',
      images: imageUrl ? [imageUrl] : [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
      ],
      brochureUrl: brochureUrl || '',
      highlights: parsedHighlights,
      verified: true,
      postedBy: postedBy,
      posterName: posterName,
      posterPhone: posterPhone,
      postedDate: 'Just now',
      furnishing: furnishing,
      possession: possession,
      possessionDate: possessionDate,
      projectStatus: possession,
      projectArchitecture: 'European Contemporary • LEED Gold Complex',
      facing: 'North-East',
      floor: 'Middle / Upper Floors',
      bathrooms: bhk > 1 ? bhk : 1,
      balconies: bhk > 1 ? 2 : 1,
      parking: 'Covered Multi-Level Parking',
      amenities: selectedAmenities,
      description: description || `Newly listed verified project ${projectTitle} located at prime ${locality}, ${city}. Features prime connectivity, natural light, and premium fixtures.`,
      featured: true,
      status: 'published'
    };

    onAddProperty(newProperty);
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B35', '#002869', '#10B981', '#F59E0B']
      });
    } catch (e) {
      // Confetti fallback
    }

    onNotify('🎉 Property published successfully with comprehensive project specifications!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 shadow-2xl border border-slate-100 p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#002869] font-heading">
              Your Property is Live!
            </h3>

            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your listing (ID: <span className="font-bold text-[#002869]">{generatedId}</span>) is now active with complete project specifications, overview, configurations, and RERA verification.
            </p>

            <div className="bg-blue-50 rounded-2xl p-4 max-w-sm mx-auto text-xs text-[#002869] font-semibold border border-blue-200">
              ⚡ RERA Verified • Zero Brokerage • Direct Buyer Connect
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#002869] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#071f49] transition-colors cursor-pointer"
              >
                View in Property Browser
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header & Steps Indicator */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B35] text-xs font-bold uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Project Format
              </div>
              <h3 className="text-2xl font-extrabold text-[#002869] font-heading">
                List Verified Property / Project
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Reach genuine buyers & high-net-worth investors across India with rich project specs.
              </p>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      s <= step ? 'bg-[#FF6B35]' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Project / Property Basics */}
            {step === 1 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Project / Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Orion One 32 or Godrej Woods or DLF One Midtown"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-[#002869]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Developer / Builder Name
                    </label>
                    <input
                      type="text"
                      value={developerName}
                      onChange={(e) => setDeveloperName(e.target.value)}
                      placeholder="e.g. Wellgrow Infotech / Orion Group"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Listing Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ListingCategory)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                    >
                      <option value="Commercial">Commercial Project / Retail</option>
                      <option value="Buy">Residential Luxury Sale</option>
                      <option value="New Projects">New Projects / Fresh Launch</option>
                      <option value="Plot">Plot / Commercial Land</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">Property Type:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Commercial Office',
                      'Retail Shop',
                      'Food Court',
                      'Apartment',
                      'Villa',
                      'Studio Flat',
                      'Penthouse',
                      'Plot'
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPropertyType(type as PropertyType)}
                        className={`py-2 px-2.5 rounded-xl font-semibold border transition-all text-xs cursor-pointer ${
                          propertyType === type
                            ? 'bg-blue-50 text-[#002869] border-[#002869] font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">You are listing as:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Owner', 'Builder', 'Verified Agent'] as PostedByType[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPostedBy(p)}
                        className={`py-2 px-3 rounded-xl font-semibold border transition-all text-xs cursor-pointer ${
                          postedBy === p
                            ? 'bg-orange-50 text-[#FF6B35] border-[#FF6B35] font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 bg-[#002869] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#071f49] transition-colors cursor-pointer"
                  >
                    <span>Next: Location & Pricing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Location, Scale & Pricing */}
            {step === 2 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <CitySelector
                    value={city}
                    onChange={setCity}
                    label="City / Territory *"
                    helperText="Select from top metro hubs or click '+ Add New City' to list in any city in India."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Locality / Sector / Address *</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Sector 132, Noida Expressway"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Land Parcel</label>
                    <input
                      type="text"
                      value={totalLandArea}
                      onChange={(e) => setTotalLandArea(e.target.value)}
                      placeholder="e.g. 10 Acres"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Towers</label>
                    <input
                      type="text"
                      value={totalTowers}
                      onChange={(e) => setTotalTowers(e.target.value)}
                      placeholder="e.g. 3 Towers"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Units</label>
                    <input
                      type="text"
                      value={totalUnits}
                      onChange={(e) => setTotalUnits(e.target.value)}
                      placeholder="e.g. 703 Units"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Bedrooms / BHK</label>
                    <select
                      value={bhk}
                      onChange={(e) => setBhk(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                    >
                      <option value={0}>Commercial / Studio / Retail</option>
                      <option value={1}>1 BHK</option>
                      <option value={2}>2 BHK</option>
                      <option value={3}>3 BHK</option>
                      <option value={4}>4 BHK</option>
                      <option value={5}>5+ BHK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Super Built-up Area (Sq.Ft)</label>
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      placeholder="e.g. 1450"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Price Box with presets */}
                <div className="bg-orange-50/50 p-3.5 rounded-2xl border border-orange-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800">
                      Starting Investment Price in INR *
                    </label>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#002869] text-white font-extrabold text-xs">
                      {formatIndianCurrency(price)}
                    </span>
                  </div>

                  <div className="flex items-center bg-white border border-orange-200 rounded-xl px-3 py-2">
                    <span className="font-bold text-slate-500 mr-2">₹</span>
                    <input
                      type="number"
                      required
                      min={100000}
                      step={50000}
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-bold">Presets:</span>
                    {[
                      { label: '₹82.8 L', val: 8280000 },
                      { label: '₹1.2 Cr', val: 12000000 },
                      { label: '₹1.8 Cr', val: 18000000 },
                      { label: '₹2.5 Cr', val: 25000000 },
                      { label: '₹4.5 Cr', val: 45000000 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setPrice(p.val)}
                        className="px-2 py-0.5 rounded bg-white hover:bg-orange-100 text-slate-700 border border-orange-200 text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Price Range Display
                      </label>
                      <input
                        type="text"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        placeholder="e.g. ₹82.80 Lakh - ₹2.50 Cr*"
                        className="w-full bg-white border border-orange-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Lease Guarantee / Returns
                      </label>
                      <input
                        type="text"
                        value={leaseGuarantee}
                        onChange={(e) => setLeaseGuarantee(e.target.value)}
                        placeholder="e.g. 29-Year Lease Guarantee • 12% Returns"
                        className="w-full bg-white border border-orange-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 bg-[#002869] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#071f49] transition-colors cursor-pointer"
                  >
                    <span>Next: RERA, Photos & Contact</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: RERA, Highlights, Media & Contact */}
            {step === 3 && (
              <form onSubmit={handleFinish} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">RERA Number *</label>
                    <input
                      type="text"
                      required
                      value={reraId}
                      onChange={(e) => setReraId(e.target.value)}
                      placeholder="e.g. UPRERAPRJ960554"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Possession Status</label>
                    <select
                      value={possession}
                      onChange={(e) => setPossession(e.target.value as PossessionStatus)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800"
                    >
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready to Move">Ready to Move</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Possession Date</label>
                    <input
                      type="text"
                      value={possessionDate}
                      onChange={(e) => setPossessionDate(e.target.value)}
                      placeholder="e.g. December 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Key Highlights & USPs (Comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="India's 1st Freeport Outlet Mall, 3-Acre Courtyard with 5 Beaches, 12% Assured Returns, LEED Gold Rated"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <ImageUploadField
                    label="Project Cover / Elevation Photo"
                    value={imageUrl}
                    onChange={setImageUrl}
                    placeholder="https://images.unsplash.com/..."
                    helperText="Upload an elevation or facade photo, or choose from curated presets."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">Select Key Amenities:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {popularAmenities.map((a) => {
                      const isSel = selectedAmenities.includes(a);
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleAmenity(a)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#002869] text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={posterName}
                      onChange={(e) => setPosterName(e.target.value)}
                      placeholder="e.g. Authorized Listing Desk"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Mobile (+91) *</label>
                    <input
                      type="tel"
                      required
                      value={posterPhone}
                      onChange={(e) => setPosterPhone(e.target.value)}
                      placeholder="e.g. 98110 44210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e0531e] text-white px-7 py-3 rounded-xl font-bold shadow-lg transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Verified Project Listing</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
