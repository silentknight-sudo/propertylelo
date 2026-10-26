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
  ChevronDown,
  LogOut,
  Phone
} from 'lucide-react';
import { Logo } from './Logo';
import { ListingCategory, CmsSettings } from '../types/property';
import { useAuth } from '../context/AuthContext';
import { getAllCities } from '../lib/cities';

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
  const { currentUser, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  const popularCities = ['All Cities', ...getAllCities()];

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
              <span className="truncate hidden sm:inline">{announcementBar.text}</span>
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
            <a href="#" aria-label="PropertyLelo home" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] rounded-lg">
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

            {/* Login / User Account Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden sm:flex items-center gap-2 p-1.5 pr-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-[#002869] text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in">
                      <div className="pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          {currentUser.photoURL ? (
                            <img
                              src={currentUser.photoURL}
                              alt={currentUser.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#002869] text-white flex items-center justify-center font-bold text-sm">
                              {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 text-xs truncate">
                              {currentUser.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>

                        {/* Phone Number Display */}
                        {currentUser.phone && (
                          <div className="mt-2.5 flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-600 font-semibold truncate">
                              <Phone className="w-3 h-3 text-[#002869]" />
                              <span className="truncate">{currentUser.phone}</span>
                            </div>
                            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Verified
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="py-2 space-y-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenSavedDrawer();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#002869] font-semibold text-left cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 text-slate-400" />
                          <span>Saved Properties ({savedCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenPostProperty();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#002869] font-semibold text-left cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-[#FF6B35]" />
                          <span>Post Free Property</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={async () => {
                            await signOut();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-red-600 hover:bg-red-50 font-bold text-xs cursor-pointer transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#002869] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Login</span>
              </button>
            )}

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
              <span className="whitespace-nowrap">Post<span className="hidden sm:inline"> Property</span></span>
              <span className="hidden sm:inline bg-white/20 text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded tracking-wide ml-0.5">
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
                {currentUser ? (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#002869] text-white flex items-center justify-center font-bold text-sm">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-xs truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    {currentUser.phone && (
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-100 text-xs">
                        <span className="font-semibold text-slate-700">{currentUser.phone}</span>
                        <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        await signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAuth();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span>Sign In with Google</span>
                  </button>
                )}
                
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
