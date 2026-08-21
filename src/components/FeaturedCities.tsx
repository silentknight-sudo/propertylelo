import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, Building, TrendingUp } from 'lucide-react';
import { CITIES_DATA } from '../data/mockData';
import { CityData } from '../types/property';

interface FeaturedCitiesProps {
  onSelectCity: (cityName: string) => void;
  selectedCity: string;
}

export const FeaturedCities: React.FC<FeaturedCitiesProps> = ({
  onSelectCity,
  selectedCity
}) => {
  const handleCityClick = (cityName: string) => {
    onSelectCity(cityName);
    const propertiesSection = document.getElementById('properties-section');
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Primary 4 cities for the top featured layout (matching Image 1)
  const primaryHeroCity = CITIES_DATA.find((c) => c.name === 'Mumbai') || CITIES_DATA[1];
  const gridCities = CITIES_DATA.filter((c) => ['Delhi NCR', 'Bangalore', 'Pune'].includes(c.name));
  const remainingCities = CITIES_DATA.filter((c) => !['Mumbai', 'Delhi NCR', 'Bangalore', 'Pune'].includes(c.name));

  return (
    <section id="cities-section" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002869] text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
              Major Hubs
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
              Explore Real Estate in Popular Indian Cities
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Discover residential and commercial properties with price trends, top localities, and verified RERA builders.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => onSelectCity('')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-[#FF6B35] hover:text-[#E85520] transition-colors cursor-pointer group"
          >
            <span>View All Properties in India</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Featured Cities Layout (recreating Image 1 composition) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Large Hero City Card (Mumbai) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => handleCityClick(primaryHeroCity.name)}
            className="lg:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 min-h-[280px] sm:min-h-[360px]"
          >
            <img
              src={primaryHeroCity.image}
              alt={primaryHeroCity.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001947]/90 via-[#001947]/40 to-transparent" />
            
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
                <TrendingUp className="w-3.5 h-3.5 text-[#FF6B35]" />
                Top Investment Market
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
                {primaryHeroCity.name}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 line-clamp-1">
                {primaryHeroCity.tagline}
              </p>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/20">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span>{primaryHeroCity.propertyCount} Properties</span>
                  <span>•</span>
                  <span>Avg {primaryHeroCity.avgPriceSqft}</span>
                </div>
                <span className="text-xs font-bold text-orange-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* 3 Medium City Cards Grid (Delhi NCR, Bangalore, Pune + Explore All) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gridCities.map((city, idx) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => handleCityClick(city.name)}
                className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 min-h-[170px]"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001947]/90 via-[#001947]/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="text-lg sm:text-xl font-bold font-heading">
                    {city.name}
                  </h4>
                  <p className="text-xs text-blue-200 mt-0.5 font-medium">
                    {city.propertyCount} Properties
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Explore All Cities Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => onSelectCity('')}
              className="bg-blue-50/80 hover:bg-blue-100/90 border border-blue-100 rounded-2xl p-6 flex flex-col justify-center items-center text-center group cursor-pointer transition-all duration-300 min-h-[170px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#002869] text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <span className="text-base font-bold text-[#002869] flex items-center gap-1.5">
                Explore All Cities <ArrowRight className="w-4 h-4 text-[#FF6B35] group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-xs text-slate-500 mt-1">
                200+ Cities across 28 states
              </span>
            </motion.div>
          </div>
        </div>

        {/* Extended Pill Carousel for Other Major Cities */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
              More Top Markets:
            </span>
            {remainingCities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCityClick(city.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCity === city.name
                    ? 'bg-[#002869] text-white border-[#002869] shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{city.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  selectedCity === city.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {city.propertyCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
