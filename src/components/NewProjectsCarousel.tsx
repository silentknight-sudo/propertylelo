import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Gift,
  CheckCircle
} from 'lucide-react';
import { NEW_PROJECTS_DATA } from '../data/mockData';
import { NewProject } from '../types/property';

interface NewProjectsCarouselProps {
  onBrochureDownload: (projectName: string) => void;
  onVipEnquiry: (project: NewProject) => void;
}

export const NewProjectsCarousel: React.FC<NewProjectsCarouselProps> = ({
  onBrochureDownload,
  onVipEnquiry
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = NEW_PROJECTS_DATA.length;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const currentProject = NEW_PROJECTS_DATA[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % total);
  };

  return (
    <section id="new-projects" className="py-16 sm:py-20 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
              Premier Builder Launches
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
              New Projects & Township Developments
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              100% RERA Registered luxury condominiums, gated villas, and integrated townships with inaugural launch pricing.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white transition-colors cursor-pointer shadow-xs"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Project Showcase Hero Slider */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-3xl overflow-hidden shadow-xl bg-[#001947] text-white border border-slate-800 grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Left / Top Image with zoom */}
          <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] overflow-hidden">
            <img
              src={currentProject.image}
              alt={currentProject.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001947] via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#001947]/30 lg:to-[#001947]" />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FF6B35] text-white text-xs font-bold shadow-md">
                {currentProject.badge}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                RERA: {currentProject.reraId}
              </span>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#001947]">
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                By {currentProject.builder}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">
                {currentProject.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-blue-200/90 mb-4">
                <MapPin className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                <span>{currentProject.locality}, {currentProject.city}</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-blue-200">Price Range:</span>
                  <span className="text-lg sm:text-xl font-extrabold text-orange-400 font-heading">
                    {currentProject.priceRange}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-200">Configurations:</span>
                  <span className="text-white font-semibold">{currentProject.units}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-200">Possession:</span>
                  <span className="text-emerald-400 font-semibold">{currentProject.possessionDate}</span>
                </div>
              </div>

              {/* Special Launch Offer */}
              <div className="bg-orange-500/20 border border-orange-500/40 rounded-xl p-3 mb-6 flex items-start gap-2.5">
                <Gift className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-300 block">
                    Limited Period Launch Incentive:
                  </span>
                  <p className="text-xs text-orange-100 font-medium">
                    {currentProject.launchOffer}
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 mb-6">
                {currentProject.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-blue-100">
                    <CheckCircle className="w-3.5 h-3.5 text-[#FF6B35] flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={() => onVipEnquiry(currentProject)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#FF6B35]/25 transition-all text-center cursor-pointer"
              >
                Request VIP Callback
              </button>
              <button
                type="button"
                onClick={() => onBrochureDownload(currentProject.name)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Brochure & Floorplan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Project Selector Mini Pills */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {NEW_PROJECTS_DATA.map((proj, idx) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIdx ? 'w-8 bg-[#FF6B35]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to ${proj.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
