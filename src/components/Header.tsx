import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Heart, 
  User, 
  PlusCircle, 
  Building2, 
  Calculator, 
  Sparkles,
  PhoneCall,
  Search,
  MapPin,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Logo } from './Logo';
import { ListingCategory, CmsSettings } from '../types/property';

interface HeaderProps {
  activeCategory: ListingCategory;
  onSelectCategory: (category: ListingCategory) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onOpenPostProperty: () => void;
  onOpenAuth: () => void;
  onOpenEmiCalculator: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  announcementBar?: CmsSettings['announcementBar'];
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  savedCount,
  onOpenSavedDrawer,
  onOpenPostProperty,
  onOpenAuth,
  onOpenEmiCalculator,
  selectedCity,
  onSelectCity,
  announcementBar,
  onOpenAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; category?: ListingCategory; href?: string; action?: () => void }[] = [
    { label: 'Buy', category: 'Buy' },
    { label: 'Commercial', category: 'Commercial' },
    { label: 'New Projects', category: 'New Projects' },
    { label: 'Plots', category: 'Plot' },
    { label: 'Sell', action: onOpenPostProperty },
    { label: 'Home Loans', action: onOpenEmiCalculator },
    { label: 'Insights', href: '#insights' }
  ];

  const popularCities = [
    'All Cities',
    'Delhi NCR',
    'Mumbai',
    'Bangalore',
    'Pune',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Gurgaon',
    'Noida'
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-100'
          : 'bg-white py-3.5 border-b border-slate-100/80 shadow-xs'
      }`}
    >
      {/* Dynamic Top Announcement Ticker (from Admin CMS settings) */}
      {announcementBar && announcementBar.enabled && (
        <div className="bg-[#002869] text-white py-1.5 px-4 text-xs font-medium border-b border-blue-900/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              {announcementBar.badge && (
                <span className="px-2 py-0.5 rounded-full bg-[#FF6B35] text-[10px] font-extrabold uppercase tracking-wider text-white shrink-0">
                  {announcementBar.badge}
                </span>
              )}
              <span className="truncate">{announcementBar.text}</span>
            </div>
            {announcementBar.linkText && (
              <a
                href={announcementBar.linkUrl || '#'}
                className="shrink-0 text-[#FF6B35] hover:text-white font-bold text-xs underline transition-colors"
              >
                {announcementBar.linkText} →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Quick City Switcher */}
          <div className="flex items-center gap-6">
            <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] rounded-lg">
              <Logo size={isScrolled ? 'sm' : 'md'} />
            </a>

            {/* Quick City Dropdown */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span className="truncate max-w-[100px]">{selectedCity || 'All India'}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {cityDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setCityDropdownOpen(false)} 
                  />
                  <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Cities
                    </div>
                    {popularCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          onSelectCity(city === 'All Cities' ? '' : city);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between hover:bg-slate-50 ${
                          (selectedCity === city || (!selectedCity && city === 'All Cities'))
                            ? 'text-[#002869] font-bold bg-blue-50/50'
                            : 'text-slate-600'
                        }`}
                      >
                        {city}
                        {(selectedCity === city || (!selectedCity && city === 'All Cities')) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Middle: Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const isActive = item.category ? activeCategory === item.category : false;
              
              if (item.action) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-[#002869] hover:bg-slate-100/70 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                );
              }

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-[#002869] hover:bg-slate-100/70 transition-all whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => item.category && onSelectCategory(item.category)}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#002869] bg-blue-50/80 font-bold'
                      : 'text-slate-700 hover:text-[#002869] hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF6B35] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={onOpenSavedDrawer}
              className="relative p-2 rounded-xl text-slate-600 hover:text-[#002869] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Saved Properties"
              aria-label="View Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Login / User Account */}
            <button
              type="button"
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#002869] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Login</span>
            </button>

            {/* Post Property FREE Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenPostProperty}
              className="relative group flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#E85520] text-white px-3.5 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-[#FF6B35]/25 transition-all cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="whitespace-nowrap">Post Property</span>
              <span className="bg-white/20 text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded tracking-wide ml-0.5">
                Free
              </span>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="space-y-1.5 pt-2">
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Explore Categories
              </div>
              {navItems.map((item) => {
                const isActive = item.category ? activeCategory === item.category : false;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.action) item.action();
                      else if (item.category) onSelectCategory(item.category);
                      else if (item.href) {
                        window.location.hash = item.href;
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-[#002869]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#FF6B35]"></span>}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span>Login / Register Account</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    onOpenEmiCalculator();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 text-sm font-semibold text-[#002869] hover:bg-blue-100"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Home Loan EMI Calculator</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
