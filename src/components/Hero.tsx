import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useInView, animate } from 'motion/react';
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

const HeroScene = lazy(() => import('./three/HeroScene'));

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

const AnimatedCounter: React.FC<{ to: number; suffix: string; decimals?: number }> = ({ to, suffix, decimals = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${v.toFixed(decimals)}${suffix}`;
      }
    });
    return () => controls.stop();
  }, [inView, to, suffix, decimals]);
  return <span ref={ref}>{`${to}${suffix}`}</span>;
};

const HEADLINE_TOP = ['Buy', 'Verified', 'Homes', '&', 'Commercial', 'Property'];
const HEADLINE_BOTTOM = ['in', 'Delhi', 'NCR', '&', 'Across', 'India'];

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

  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [show3d, setShow3d] = useState(false);
  useEffect(() => {
    setShow3d(!reduceMotion && canUseWebGL());
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduceMotion ? 1 : 0.15]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.12]);

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
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative pt-24 sm:pt-28 pb-16 lg:pb-24 overflow-hidden bg-[#001233] min-h-[92vh] flex items-center"
    >
      {/* Background: static photo fallback, live 3D skyline on capable devices */}
      <motion.div className="absolute inset-0 z-0 overflow-hidden" style={{ scale: sceneScale }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=85')`,
            opacity: show3d ? 0.18 : 1
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001233] via-[#002869]/70 to-[#001233]" />
        {show3d && (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        )}
        {/* Readability vignette over the scene */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,18,51,0.62)_0%,rgba(0,18,51,0.45)_45%,rgba(0,18,51,0.9)_100%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#001233] pointer-events-none" />
      </motion.div>

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#FF6B35]/20 blur-3xl animate-orb" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full bg-[#2563eb]/25 blur-3xl animate-orb [animation-delay:-6s]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Headline & Subtitle */}
        <div className="text-center max-w-5xl mx-auto pt-6 sm:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold mb-6 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FF6B35] animate-ping" />
            <span className="text-blue-100">RERA-Verified Listings</span>
            <span className="text-white/40">|</span>
            <span className="text-orange-300 font-medium">0% Brokerage • Direct Owners & Builders</span>
          </motion.div>

          <h1
            id="hero-heading"
            className="text-3xl sm:text-5xl lg:text-[4.25rem] font-extrabold text-white tracking-tight font-heading leading-[1.08] [perspective:900px]"
          >
            <span className="block">
              {HEADLINE_TOP.map((word, i) => (
                <motion.span
                  key={`t-${i}`}
                  className="inline-block mr-[0.25em] origin-bottom"
                  initial={reduceMotion ? false : { opacity: 0, rotateX: -90, y: 30 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {HEADLINE_BOTTOM.map((word, i) => (
                <motion.span
                  key={`b-${i}`}
                  className="inline-block mr-[0.25em] origin-bottom text-transparent bg-clip-text bg-gradient-to-r from-[#ffd0b8] via-[#FF6B35] to-[#ffb38a] animate-shimmer bg-[length:200%_auto]"
                  initial={reduceMotion ? false : { opacity: 0, rotateX: -90, y: 30 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-5 text-base sm:text-lg text-blue-100/90 max-w-3xl mx-auto leading-relaxed"
          >
            Flats in Noida Sector 150, luxury apartments on Golf Course Road Gurgaon, assured-return shops on Noida Expressway,
            villas in Pune & Hyderabad — search RERA-approved projects and deal directly with owners and builders.
          </motion.p>
        </div>

        {/* Tabbed Search Box (Centerpiece from Image 1) */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-5xl mx-auto relative z-20"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] p-4 sm:p-6 border border-white/40 ring-1 ring-[#FF6B35]/10">
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
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-14 max-w-4xl mx-auto grid grid-cols-3 gap-4 sm:gap-8 text-center text-white"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              <AnimatedCounter to={50} suffix=" Lakh+" />
            </span>
            <span className="text-xs sm:text-sm text-blue-200 font-medium mt-1">
              Active Listings
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-white/15">
            <span className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              <AnimatedCounter to={200} suffix="+" />
            </span>
            <span className="text-xs sm:text-sm text-blue-200 font-medium mt-1">
              Cities Covered
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              <AnimatedCounter to={1} suffix=" Cr+" />
            </span>
            <span className="text-xs sm:text-sm text-blue-200 font-medium mt-1">
              Monthly Users
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
