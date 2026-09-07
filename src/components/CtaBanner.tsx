import React from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface CtaBannerProps {
  onOpenPostProperty: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenPostProperty }) => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#002869] via-[#071f49] to-[#001947] text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-blue-900/50">
          {/* Animated Background Decorative Blobs */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-orange-300 text-xs font-bold uppercase tracking-wider border border-white/20">
                <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
                Sell Properties 2x Faster
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Are You a Property Owner or Builder? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-orange-300">
                  Post Your Property for Free!
                </span>
              </h2>

              <p className="text-blue-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
                Reach over 1 Crore active verified buyers and investors every month. Zero commission, instant WhatsApp lead alerts, and dedicated relationship manager assistance.
              </p>

              {/* 3 Value bullets */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold text-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                  <span>100% Free Listing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                  <span>Zero Brokerage Payout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                  <span>Direct Buyer Verification</span>
                </div>
              </div>
            </div>

            {/* Right Action Button with Pulse */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onOpenPostProperty}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-extrabold text-base shadow-xl shadow-[#FF6B35]/40 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>Post Property FREE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
              
              <span className="text-[11px] text-blue-300/80 mt-3 font-medium text-center">
                Takes less than 2 minutes • Verified leads guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
