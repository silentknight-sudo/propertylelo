import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  BedDouble, 
  Maximize2, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Calendar, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactClick: (property: Property) => void;
  onScheduleVisitClick: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onSelectProperty,
  onContactClick,
  onScheduleVisitClick
}) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group"
    >
      <div>
        {/* Image Container & Carousel */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectProperty(property)}>
          <img
            src={images[currentImageIdx]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

          {/* Top Badges: Category & Verified */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-1.5">
              {property.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md shadow-emerald-500/20 backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
              {property.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#002869] text-white text-[11px] font-bold shadow-md">
                  <Sparkles className="w-3 h-3 text-[#FF6B35]" />
                  Featured
                </span>
              )}
            </div>

            {/* Save / Heart Button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(property.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 text-rose-500 shadow-md'
                  : 'bg-black/30 hover:bg-black/50 text-white'
              }`}
              aria-label={isSaved ? 'Remove from saved' : 'Save property'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </motion.button>
          </div>

          {/* Navigation Arrows for Carousel */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIdx ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Posted by badge at bottom-left */}
          <div className="absolute bottom-2.5 left-3 text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
            By {property.postedBy}: {property.posterName.split(' ')[0]}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Price and Price per sqft */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-[#002869] font-heading">
              {property.priceFormatted}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#002869] transition-colors cursor-pointer"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Locality & City */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B35] flex-shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>

          {/* Property Specs Grid (BHK, Area, Furnishing) */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-3.5">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <BedDouble className="w-4 h-4 text-[#002869]" />
              <span className="truncate">{property.bhk > 0 ? `${property.bhk} BHK` : property.type}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium border-x border-slate-200 px-1 text-center justify-center">
              <Maximize2 className="w-3.5 h-3.5 text-[#002869]" />
              <span>{property.area} sqft</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium justify-end">
              <Layers className="w-3.5 h-3.5 text-[#002869]" />
              <span className="truncate">{property.possession === 'Ready to Move' ? 'Ready' : 'Under Const.'}</span>
            </div>
          </div>

          {/* Amenities Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {property.amenities.slice(0, 2).map((amenity) => (
              <span
                key={amenity}
                className="text-[11px] font-medium bg-blue-50/70 text-[#002869] px-2 py-0.5 rounded-md"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 2 && (
              <span className="text-[11px] font-medium text-slate-400">
                +{property.amenities.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 sm:p-5 sm:pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onContactClick(property)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#002869] text-[#002869] hover:bg-blue-50 text-xs font-bold transition-colors cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>Contact</span>
        </button>

        <button
          type="button"
          onClick={() => onScheduleVisitClick(property)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>Book Visit</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectProperty(property)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Full Details"
          aria-label="View property details"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
