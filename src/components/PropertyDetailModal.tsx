import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';
import { Property } from '../types/property';

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

  if (!isOpen || !property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onNotify('Property link copied to clipboard!');
    }
  };

  // Estimated stamp duty & registration (approx 6% in India)
  const estimatedGovtCharges = Math.round(property.price * 0.06);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto z-10 shadow-2xl border border-slate-100"
      >
        {/* Sticky Header inside Modal */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#002869]">
              ID: {property.id}
            </span>
            <span className="text-sm font-bold text-slate-800 truncate">
              {property.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
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

        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Gallery */}
          <div>
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={images[activePhotoIdx]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {property.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                    RERA Verified ({property.reraId || 'Approved'})
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-[#002869] text-white text-xs font-bold">
                  {property.possession}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto no-scrollbar pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === idx ? 'border-[#FF6B35] scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Info & Price Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#002869] font-heading">
                {property.priceFormatted}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft • Maintenance: {property.maintenanceCharges || '₹2,500/mo'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                <span className="font-semibold">{property.locality}, {property.city}, {property.state} - {property.pincode}</span>
              </div>
            </div>

            {/* Fast Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onContactClick(property);
                }}
                className="py-3 px-5 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF6B35]" />
                <span>Contact {property.postedBy}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onScheduleVisitClick(property);
                }}
                className="py-3 px-5 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Site Visit</span>
              </button>
            </div>
          </div>

          {/* Key Property Specs Grid */}
          <div>
            <h4 className="text-base font-bold text-slate-900 font-heading mb-3">
              Overview & Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Super Built-up Area</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <Maximize2 className="w-4 h-4 text-[#002869]" />
                  {property.area} sq.ft
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Bedrooms & Baths</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <BedDouble className="w-4 h-4 text-[#002869]" />
                  {property.bhk > 0 ? `${property.bhk} BHK (${property.bathrooms} Baths)` : property.type}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Facing & Floor</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <Compass className="w-4 h-4 text-[#002869]" />
                  {property.facing} ({property.floor})
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Furnishing & Parking</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <Car className="w-4 h-4 text-[#002869]" />
                  {property.furnishing}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-base font-bold text-slate-900 font-heading mb-2">
              Property Description
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-base font-bold text-slate-900 font-heading mb-3">
              Society Features & Amenities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 p-3 bg-blue-50/40 rounded-xl border border-blue-100/60 text-xs font-semibold text-slate-700"
                >
                  <Check className="w-4 h-4 text-[#FF6B35]" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Estimate Breakup Box */}
          <div className="bg-gradient-to-br from-slate-900 to-[#002869] rounded-2xl p-6 text-white space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-orange-300 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Estimated Total Outflow Calculation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs border-t border-white/15">
              <div>
                <span className="text-blue-200 block">Base Property Price:</span>
                <span className="font-bold text-white text-sm">{property.priceFormatted}</span>
              </div>
              <div>
                <span className="text-blue-200 block">Estimated Stamp Duty & Reg (6%):</span>
                <span className="font-bold text-white text-sm">₹{estimatedGovtCharges.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-blue-200 block">Estimated Total Cost:</span>
                <span className="font-extrabold text-orange-300 text-base">
                  ₹{(property.price + estimatedGovtCharges).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
