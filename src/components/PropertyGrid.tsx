import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SlidersHorizontal, 
  Search, 
  RotateCcw, 
  Check, 
  Grid, 
  List, 
  ShieldCheck, 
  Building2, 
  IndianRupee, 
  BedDouble, 
  ArrowUpDown,
  Filter,
  X
} from 'lucide-react';
import { Property, ListingCategory, FilterState } from '../types/property';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactClick: (property: Property) => void;
  onScheduleVisitClick: (property: Property) => void;
  activeCategory: ListingCategory;
  onSelectCategory: (cat: ListingCategory) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  initialFilters?: Partial<FilterState>;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  savedIds,
  onToggleSave,
  onSelectProperty,
  onContactClick,
  onScheduleVisitClick,
  activeCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  initialFilters
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedBhk, setSelectedBhk] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [postedBy, setPostedBy] = useState<string>('All');
  const [furnishing, setFurnishing] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'area-desc' | 'newest'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate smooth async loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeCategory, selectedCity]);

  const propertyTypes = ['All', 'Apartment', 'Villa', 'Commercial Office', 'Plot', 'Penthouse', 'Studio Flat'];
  const bhkList = ['All', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
  const postedByList = ['All', 'Owner', 'Builder', 'Verified Agent'];
  const furnishingList = ['All', 'Furnished', 'Semi-Furnished', 'Unfurnished'];

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedBhk('All');
    setPriceRange([0, 50000000]);
    setVerifiedOnly(false);
    setPostedBy('All');
    setFurnishing('All');
    onSelectCity('');
  };

  // Filtered & Sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Category check
        if (activeCategory === 'Rent' && p.category !== 'Rent' && p.category !== 'PG-Coliving') return false;
        if (activeCategory === 'Buy' && p.category !== 'Buy') return false;
        if (activeCategory === 'Commercial' && p.category !== 'Commercial') return false;
        if (activeCategory === 'PG-Coliving' && p.category !== 'PG-Coliving') return false;

        // City check
        if (selectedCity && selectedCity !== 'All' && !p.city.toLowerCase().includes(selectedCity.toLowerCase()) && !p.locality.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }

        // Search text query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.title.toLowerCase().includes(q) ||
            p.locality.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.posterName.toLowerCase().includes(q) ||
            p.type.toLowerCase().includes(q) ||
            p.amenities.some((a) => a.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Property Type
        if (selectedType !== 'All' && p.type !== selectedType) {
          return false;
        }

        // BHK
        if (selectedBhk !== 'All') {
          if (selectedBhk === '1 BHK' && p.bhk !== 1) return false;
          if (selectedBhk === '2 BHK' && p.bhk !== 2) return false;
          if (selectedBhk === '3 BHK' && p.bhk !== 3) return false;
          if (selectedBhk === '4+ BHK' && p.bhk < 4) return false;
        }

        // Price range
        if (p.price < priceRange[0] || p.price > priceRange[1]) {
          return false;
        }

        // Verified
        if (verifiedOnly && !p.verified) {
          return false;
        }

        // Posted By
        if (postedBy !== 'All' && p.postedBy !== postedBy) {
          return false;
        }

        // Furnishing
        if (furnishing !== 'All' && p.furnishing !== furnishing) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'area-desc') return b.area - a.area;
        if (sortBy === 'newest') return a.id.localeCompare(b.id);
        // Default featured: verified and featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    properties,
    activeCategory,
    selectedCity,
    searchQuery,
    selectedType,
    selectedBhk,
    priceRange,
    verifiedOnly,
    postedBy,
    furnishing,
    sortBy
  ]);

  const activeFilterCount =
    (selectedCity ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0) +
    (selectedBhk !== 'All' ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (postedBy !== 'All' ? 1 : 0) +
    (furnishing !== 'All' ? 1 : 0) +
    (priceRange[1] < 50000000 || priceRange[0] > 0 ? 1 : 0);

  return (
    <section id="properties-section" className="py-16 sm:py-20 bg-[#F8F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#002869] text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5 text-[#FF6B35]" />
              Verified Inventory
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
              Featured Properties for {activeCategory === 'Rent' ? 'Rent' : 'Sale'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {selectedCity ? `Showing verified listings in ${selectedCity}` : 'Handpicked residential & commercial spaces across major metro corridors'}
            </p>
          </div>

          {/* Category Switcher Pills */}
          <div className="mt-4 md:mt-0 flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto no-scrollbar">
            {(['Buy', 'Rent', 'Commercial', 'PG-Coliving'] as ListingCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#002869] text-white shadow-xs'
                    : 'text-slate-700 hover:text-[#002869]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Master Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#002869] focus-within:border-transparent">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locality, society, builder, or amenities..."
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002869] cursor-pointer"
              >
                <option value="All">All Types</option>
                {propertyTypes.filter((t) => t !== 'All').map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* BHK Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedBhk}
                onChange={(e) => setSelectedBhk(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002869] cursor-pointer"
              >
                <option value="All">Any BHK</option>
                {bhkList.filter((b) => b !== 'All').map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002869] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Area: Largest First</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>

            {/* Advanced Filters Button */}
            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilterCount > 0
                    ? 'bg-blue-50 border-[#002869] text-[#002869]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Filter className="w-4 h-4 text-[#FF6B35]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#FF6B35] text-white text-[10px] flex items-center justify-center font-extrabold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Active Filter Badges & Toggle Row */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Verified Only Toggle */}
              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer border ${
                  verifiedOnly
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>RERA Verified Only</span>
              </button>

              {/* Posted By Pills */}
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-slate-400 font-medium mr-1">Posted by:</span>
                {postedByList.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPostedBy(p)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      postedBy === p
                        ? 'bg-[#002869] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {selectedCity && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#002869] font-bold border border-blue-200">
                  City: {selectedCity}
                  <button type="button" onClick={() => onSelectCity('')} className="hover:text-red-500 ml-1">×</button>
                </span>
              )}
            </div>

            {/* Results count text */}
            <div className="text-slate-500 font-semibold">
              Showing <span className="text-[#002869] font-extrabold">{filteredProperties.length}</span> properties
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        <AnimatePresence>
          {isFilterDrawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-5 mb-8 border border-slate-200 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF6B35]" />
                  Advanced Filter Options
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Furnishing */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Furnishing Status</label>
                  <div className="flex flex-wrap gap-1.5">
                    {furnishingList.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFurnishing(f)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          furnishing === f ? 'bg-[#002869] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div>
                  <div className="flex items-center justify-between font-bold text-slate-700 mb-1.5">
                    <span>Max Price Cap</span>
                    <span className="text-[#FF6B35]">
                      {priceRange[1] >= 50000000 ? '₹5 Cr+' : `₹${(priceRange[1] / 10000000).toFixed(2)} Cr`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="50000000"
                    step="1000000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-[#FF6B35] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹10 Lakh</span>
                    <span>₹2.5 Cr</span>
                    <span>₹5 Cr+</span>
                  </div>
                </div>

                {/* Reset or Apply */}
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-full py-2 px-3 rounded-xl bg-[#002869] text-white font-bold hover:bg-[#071f49] transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden border border-slate-100 p-4 animate-pulse">
                <div className="bg-slate-200 aspect-[16/10] rounded-xl mb-4" />
                <div className="h-6 bg-slate-200 rounded-md w-1/3 mb-2" />
                <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-4" />
                <div className="h-10 bg-slate-100 rounded-xl mb-4" />
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          /* Real Property Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedIds.includes(property.id)}
                onToggleSave={onToggleSave}
                onSelectProperty={onSelectProperty}
                onContactClick={onContactClick}
                onScheduleVisitClick={onScheduleVisitClick}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              No matching properties found
            </h3>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              We couldn't find any property matching your current filter combinations in {selectedCity || 'the selected criteria'}.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-[#002869] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#071f49] transition-colors cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
