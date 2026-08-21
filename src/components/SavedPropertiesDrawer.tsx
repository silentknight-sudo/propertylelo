import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Trash2, MapPin, BedDouble, Phone, ArrowRight, Building2 } from 'lucide-react';
import { Property } from '../types/property';

interface SavedPropertiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemove: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactClick: (property: Property) => void;
}

export const SavedPropertiesDrawer: React.FC<SavedPropertiesDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemove,
  onSelectProperty,
  onContactClick
}) => {
  if (!isOpen) return null;

  const totalValue = savedProperties.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 font-heading text-base">
                  Saved Shortlist
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {savedProperties.length} Properties Bookmarked
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Listings */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {savedProperties.length > 0 ? (
              savedProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200 hover:border-[#002869] transition-all shadow-xs flex gap-3 group"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onSelectProperty(property);
                      onClose();
                    }}
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-sm font-extrabold text-[#002869] font-heading">
                          {property.priceFormatted}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemove(property.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4
                        onClick={() => {
                          onSelectProperty(property);
                          onClose();
                        }}
                        className="text-xs font-bold text-slate-800 truncate cursor-pointer hover:text-[#002869]"
                      >
                        {property.title}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#FF6B35] flex-shrink-0" />
                        <span className="truncate">{property.locality}, {property.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="font-semibold text-slate-600">
                        {property.bhk > 0 ? `${property.bhk} BHK` : property.type} • {property.area} sqft
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onContactClick(property);
                          onClose();
                        }}
                        className="text-[#FF6B35] font-bold hover:underline"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <Heart className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                <p className="text-sm font-semibold text-slate-600">No properties bookmarked yet</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click the heart icon on any property card to save it for quick comparison.
                </p>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {savedProperties.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Total Shortlist Value:</span>
                <span className="text-base font-extrabold text-[#002869]">
                  {totalValue >= 10000000
                    ? `₹${(totalValue / 10000000).toFixed(2)} Cr`
                    : `₹${(totalValue / 100000).toFixed(1)} Lakh`}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs font-bold text-center shadow-md transition-colors cursor-pointer"
              >
                Continue Exploring Properties
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
