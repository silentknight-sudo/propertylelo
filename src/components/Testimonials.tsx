import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck, UserCheck } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/mockData';

export const Testimonials: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = TESTIMONIALS_DATA.length;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % total);
  };

  const activeReview = TESTIMONIALS_DATA[currentIdx];

  return (
    <section className="py-16 sm:py-20 bg-[#F8F9FB] border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Customer Stories
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
            Loved by Over 10 Million Home Seekers
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Real experiences from families, first-time homebuyers, NRI investors, and owners who found their ideal properties on PropertyLelo.
          </p>
        </div>

        {/* Testimonial Box */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-100 relative"
        >
          {/* Quote Icon */}
          <div className="absolute top-6 right-8 text-[#FF6B35]/15 hidden sm:block">
            <Quote className="w-20 h-20" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(activeReview.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-base sm:text-xl text-slate-800 font-medium leading-relaxed italic">
                "{activeReview.review}"
              </p>

              {/* User Profile Info */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={activeReview.avatar}
                    alt={activeReview.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#FF6B35] shadow-xs"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-heading">
                      {activeReview.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {activeReview.role} • {activeReview.location}
                    </p>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{activeReview.propertyPurchased}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2.5 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white transition-colors cursor-pointer shadow-xs"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS_DATA.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIdx ? 'w-8 bg-[#FF6B35]' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
