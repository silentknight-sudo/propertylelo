import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Home, 
  IndianRupee, 
  SlidersHorizontal, 
  Building, 
  Layers, 
  ShieldCheck, 
  Users, 
  Globe2,
  ChevronDown,
  Check
} from 'lucide-react';
import { ListingCategory, PropertyType } from '../types/property';
import { getAllCities } from '../lib/cities';

interface HeroProps {
  activeCategory: ListingCategory;
  onSelectCategory: (category: ListingCategory) => void;
  onSearch: (filters: {
    category: ListingCategory;
    city: string;
    propertyType: string;
    bhk: string;
    budget: string;
  }) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  activeCategory,
  onSelectCategory,
  onSearch,
  selectedCity,
  onSelectCity
}) => {
  const [cityInput, setCityInput] = useState(selectedCity || '');
  const [propertyType, setPropertyType] = useState('All Types');
  const [bhk, setBhk] = useState('Any BHK');
  const [budget, setBudget] = useState('Any Budget');
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showBudgetMenu, setShowBudgetMenu] = useState(false);
  const [showBhkMenu, setShowBhkMenu] = useState(false);

  // Sync cityInput when external selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      setCityInput(selectedCity);
    }
  }, [selectedCity]);

  const searchCategories: ListingCategory[] = [
    'Buy',
    'Commercial',
    'New Projects',
    'Plot'
  ];

  const popularCities = getAllCities();

  const propertyTypes = [
    'All Types',
    'Apartment',
    'Villa',
    'Independent House',
    'Plot',
    'Commercial Office',
    'Penthouse',
    'Studio Flat'
  ];

  const bhkOptions = ['Any BHK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

  const budgetOptionsBuy = [
    'Any Budget',
    'Under ₹50 Lakh',
    '₹50 Lakh - ₹1 Cr',
    '₹1 Cr - ₹2 Cr',
    '₹2 Cr - ₹5 Cr',
    'Above ₹5 Cr'
  ];

  const activeBudgetOptions = budgetOptionsBuy;

  const handleExecuteSearch = () => {
    onSearch({
      category: activeCategory,
      city: cityInput,
      propertyType,
      bhk,
      budget
    });

    const listingsSection = document.getElementById('properties-section');
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-16 lg:pb-24 overflow-hidden bg-slate-900">
      {/* Background Image with Dark Blue Tint & Ken Burns Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=85')`,
            animation: 'pulseSubtle 20s infinite alternate'
          }}
        />
        {/* Deep Blue Gradient Layer (Matches Image 1 design) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#002869]/85 via-[#002869]/75 to-[#001947]/95 backdrop-blur-[2px]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto pt-6 sm:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold mb-6 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FF6B35] animate-ping" />
            <span className="text-blue-100">#1 Real Estate Portal in India</span>
            <span className="text-white/40">|</span>
            <span className="text-orange-300 font-medium">Zero Brokerage Options</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight"
          >
            Find Your Perfect Property <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-orange-200">
              Across India
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed"
          >
            Explore 50 Lakh+ verified residential & commercial listings in 200+ cities with India's most trusted marketplace.
          </motion.p>
        </div>

        {/* Tabbed Search Box (Centerpiece from Image 1) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 max-w-5xl mx-auto"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/40">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 pb-4 border-b border-slate-100 overflow-x-auto no-scrollbar">
              {searchCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      setBudget('Any Budget');
                    }}
                    className={`relative px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-[#002869] bg-blue-50/80 shadow-xs'
                        : 'text-slate-600 hover:text-[#002869] hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                    {isActive && (
                      <motion.div
                        layoutId="activeHeroTab"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#FF6B35] rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Controls Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* City / Locality Search */}
              <div className="relative lg:col-span-4">
                <div className="flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl px-3.5 py-3 transition-colors focus-within:ring-2 focus-within:ring-[#002869] focus-within:border-transparent">
                  <MapPin className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => {
                      setCityInput(e.target.value);
                      setShowCityMenu(true);
                    }}
                    onFocus={() => setShowCityMenu(true)}
                    placeholder="City, Locality or Landmark"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  {cityInput && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setCityInput('');
                        onSelectCity('');
                      }} 
                      className="text-xs text-slate-400 hover:text-slate-600 px-1"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Popular Cities Dropdown */}
                {showCityMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowCityMenu(false)} 
                    />
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-30 max-h-64 overflow-y-auto">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Top Indian Cities
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {popularCities
                          .filter((c) => c.toLowerCase().includes(cityInput.toLowerCase()))
                          .map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setCityInput(city);
                                onSelectCity(city);
                                setShowCityMenu(false);
                              }}
                              className={`flex items-center justify-between text-left px-3 py-2 text-xs rounded-lg transition-colors hover:bg-slate-100 ${
                                cityInput === city ? 'bg-blue-50 text-[#002869] font-bold' : 'text-slate-700'
                              }`}
                            >
                              <span>{city}</span>
                              {cityInput === city && <Check className="w-3.5 h-3.5 text-[#FF6B35]" />}
                            </button>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Property Type Dropdown */}
              <div className="relative lg:col-span-3">
                <button
                  type="button"
                  onClick={() => setShowTypeMenu(!showTypeMenu)}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl px-3.5 py-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center truncate">
                    <Building className="w-5 h-5 text-slate-500 mr-2.5 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-800 truncate">
                      {propertyType}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
                </button>

                {showTypeMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowTypeMenu(false)} />
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-30">
                      {propertyTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setPropertyType(type);
                            setShowTypeMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between hover:bg-slate-50 ${
                            propertyType === type ? 'bg-blue-50 text-[#002869] font-bold' : 'text-slate-700'
                          }`}
                        >
                          <span>{type}</span>
                          {propertyType === type && <Check className="w-3.5 h-3.5 text-[#FF6B35]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Budget Range Dropdown */}
              <div className="relative lg:col-span-3">
                <button
                  type="button"
                  onClick={() => setShowBudgetMenu(!showBudgetMenu)}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl px-3.5 py-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center truncate">
                    <IndianRupee className="w-5 h-5 text-slate-500 mr-2.5 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-800 truncate">
                      {budget}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
                </button>

                {showBudgetMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowBudgetMenu(false)} />
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-30">
                      {activeBudgetOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setBudget(opt);
                            setShowBudgetMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between hover:bg-slate-50 ${
                            budget === opt ? 'bg-blue-50 text-[#002869] font-bold' : 'text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {budget === opt && <Check className="w-3.5 h-3.5 text-[#FF6B35]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Big Search CTA Button (Coral) */}
              <div className="lg:col-span-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleExecuteSearch}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#E85520] text-white font-bold py-3.5 px-5 rounded-xl shadow-lg shadow-[#FF6B35]/30 transition-all cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-sm font-bold">Search</span>
                </motion.button>
              </div>
            </div>

            {/* Quick BHK filter pills */}
            <div className="mt-3.5 pt-3 border-t border-slate-100/80 flex items-center gap-2 flex-wrap text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Quick BHK:</span>
              {bhkOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBhk(opt)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    bhk === opt
                      ? 'bg-[#002869] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Live Counters & Trust Strip (Directly matching Image 1 specs) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 max-w-4xl mx-auto grid grid-cols-3 gap-4 sm:gap-8 text-center text-white"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              50 Lakh+
            </span>
            <span className="text-xs sm:text-sm text-blue-200 font-medium mt-1">
              Active Listings
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-white/15">
            <span className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              200+
            </span>
            <span className="text-xs sm:text-sm text-blue-200 font-medium mt-1">
              Cities Covered
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              1 Cr+
            </span>
            <span className="text-xs sm:text-sm text-blue-200 font-medium mt-1">
              Monthly Users
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
