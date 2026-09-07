import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Check, 
  PlusCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Property, ListingCategory, PropertyType, PostedByType } from '../types/property';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProp: Property) => void;
  onNotify: (msg: string) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  onNotify
}) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ListingCategory>('Buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState(3);
  const [area, setArea] = useState(1350);
  const [price, setPrice] = useState(9500000);
  const [furnishing, setFurnishing] = useState<'Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Semi-Furnished');
  const [postedBy, setPostedBy] = useState<PostedByType>('Owner');
  const [posterName, setPosterName] = useState('');
  const [posterPhone, setPosterPhone] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Clubhouse',
    'Swimming Pool',
    '24/7 Power Backup',
    'Security CCTV'
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

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
    'Tennis Court'
  ];

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
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

    const newProperty: Property = {
      id: newId,
      title: title || `${bhk} BHK Luxury ${propertyType} in ${locality}`,
      tagline: 'Direct listing by ' + postedBy,
      type: propertyType,
      category: category,
      bhk: propertyType === 'Plot' || propertyType === 'Commercial Office' ? 0 : bhk,
      price: price,
      priceFormatted: formattedPrice,
      pricePerSqft: Math.round(price / (area || 1000)),
      area: area || 1200,
      locality: locality,
      city: city,
      state: 'India',
      pincode: '110001',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
      ],
      verified: true,
      postedBy: postedBy,
      posterName: posterName,
      posterPhone: posterPhone,
      postedDate: 'Just now',
      furnishing: furnishing,
      possession: 'Ready to Move',
      facing: 'North-East',
      floor: 'Middle Floor',
      bathrooms: bhk > 1 ? bhk : 1,
      balconies: bhk > 1 ? 2 : 1,
      parking: '1 Covered Car Park',
      amenities: selectedAmenities,
      description: `Newly listed verified ${bhk} BHK ${propertyType} located at prime ${locality}, ${city}. Features prime connectivity, natural light, and premium fixtures.`,
      featured: true
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

    onNotify('🎉 Property published successfully on PropertyLelo!');
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
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#002869] font-heading">
              Your Property is Live on PropertyLelo!
            </h3>

            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your listing (ID: <span className="font-bold text-[#002869]">{generatedId}</span>) is now active and indexed for millions of potential buyers and tenants across India.
            </p>

            <div className="bg-blue-50 rounded-2xl p-4 max-w-sm mx-auto text-xs text-[#002869] font-semibold border border-blue-200">
              ⚡ Free RERA & title badge applied • 0% Brokerage activated
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#002869] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#071f49] transition-colors"
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
                Zero Brokerage Listing
              </div>
              <h3 className="text-2xl font-extrabold text-[#002869] font-heading">
                Post Property for Free
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Reach genuine verified buyers in under 2 minutes.
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

            {/* Step 1: Basic Type & Category */}
            {step === 1 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-2">I want to:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Buy', 'Commercial', 'Plot'] as ListingCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2.5 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                          category === cat
                            ? 'bg-[#002869] text-white border-[#002869]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat === 'Buy' ? 'Sell Residential' : cat === 'Commercial' ? 'Sell Commercial' : 'Sell Plot / Land'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">Property Type:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial Office', 'Studio Flat'] as PropertyType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPropertyType(type)}
                        className={`py-2.5 px-3 rounded-xl font-semibold border transition-all text-xs cursor-pointer ${
                          propertyType === type
                            ? 'bg-blue-50 text-[#002869] border-[#002869] font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">You are the:</label>
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
                    <span>Next: Location Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Location & Size */}
            {step === 2 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
                  >
                    {['Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Locality / Sector / Area *</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Sector 150 or Whitefield or Baner"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Bedrooms (BHK)</label>
                    <select
                      value={bhk}
                      onChange={(e) => setBhk(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                    >
                      <option value={1}>1 BHK</option>
                      <option value={2}>2 BHK</option>
                      <option value={3}>3 BHK</option>
                      <option value={4}>4 BHK</option>
                      <option value={5}>5+ BHK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Built-up Area (Sq.Ft)</label>
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      placeholder="e.g. 1450"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Expected Price (₹ in INR) *
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                    <span className="font-bold text-slate-500 mr-2">₹</span>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-[#FF6B35] font-semibold mt-1 block">
                    {price >= 10000000 ? `Approx ₹${(price / 10000000).toFixed(2)} Cr` : `Approx ₹${(price / 100000).toFixed(1)} Lakh`}
                  </span>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 bg-[#002869] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#071f49] transition-colors"
                  >
                    <span>Next: Amenities & Contact</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Amenities & Contact */}
            {step === 3 && (
              <form onSubmit={handleFinish} className="space-y-4 text-xs sm:text-sm">
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
                              ? 'bg-blue-50 text-[#002869] border border-[#002869] font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {a} {isSel && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={posterName}
                      onChange={(e) => setPosterName(e.target.value)}
                      placeholder="e.g. Alok Verma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={posterPhone}
                      onChange={(e) => setPosterPhone(e.target.value)}
                      placeholder="e.g. 98123 45678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span>Your number is masked to prevent spam calls until you approve verified buyers.</span>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#E85520] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-[#FF6B35]/30 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Listing FREE</span>
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
