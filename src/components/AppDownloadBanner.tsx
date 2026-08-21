import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  Download, 
  Send, 
  Check, 
  Star, 
  Bell, 
  Sparkles,
  ShieldCheck,
  QrCode,
  ArrowRight
} from 'lucide-react';

interface AppDownloadBannerProps {
  onNotify: (msg: string) => void;
}

export const AppDownloadBanner: React.FC<AppDownloadBannerProps> = ({ onNotify }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      onNotify('Please enter a valid 10-digit mobile number');
      return;
    }
    setSent(true);
    onNotify(`Download link sent via SMS to +91 ${phoneNumber}!`);
    setTimeout(() => {
      setSent(false);
      setPhoneNumber('');
    }, 4000);
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002869] text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-[#FF6B35]" />
              Mobile App Experience
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
              Download the PropertyLelo App <br />
              <span className="text-[#FF6B35]">Property Search in Your Pocket</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Get real-time price drop notifications, instant owner chat, saved shortlist sync, and immersive 3D walkthroughs on iOS & Android.
            </p>

            {/* App Rating & Features */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">4.8 / 5.0 (120k+ Reviews)</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-xs font-bold text-slate-700">
                50 Lakh+ Downloads
              </div>
            </div>

            {/* SMS Link Form */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Get download link on your phone:
              </span>
              <form onSubmit={handleSendLink} className="flex items-center gap-2 max-w-md">
                <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#002869]">
                  <span className="text-xs font-bold text-slate-500 mr-2">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit Mobile"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sent}
                  className="py-2.5 px-5 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:bg-emerald-600"
                >
                  {sent ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <span>Send Link</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Store Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              {/* Google Play */}
              <button
                type="button"
                onClick={() => onNotify('Redirecting to Google Play Store...')}
                className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Get it on</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </button>

              {/* App Store */}
              <button
                type="button"
                onClick={() => onNotify('Redirecting to Apple App Store...')}
                className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.09,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.13,16.69C20.11,16.76 19.72,18.11 18.71,19.5M15.97,4.69C16.6,3.93 17.03,2.87 16.91,1.81C16,1.85 14.86,2.42 14.24,3.16C13.68,3.8 13.2,4.89 13.34,5.92C14.37,6 15.34,5.45 15.97,4.69Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Download on the</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Smartphone Graphic Simulation (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Phone Mockup Frame */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative w-64 sm:w-72 bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800"
            >
              {/* Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20" />

              {/* Screen Area */}
              <div className="bg-[#002869] rounded-[32px] overflow-hidden p-4 pt-8 text-white aspect-[9/18] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-blue-200 mb-4">
                    <span className="font-bold">PropertyLelo Mobile</span>
                    <span>5G</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 mb-3">
                    <div className="text-[10px] text-orange-300 font-bold uppercase">Trending Nearby</div>
                    <div className="text-xs font-bold text-white truncate">3 BHK Luxury Apt</div>
                    <div className="text-[11px] text-blue-200">Sector 150, Noida • ₹1.20 Cr</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">Loan Status</div>
                    <div className="text-xs font-bold text-white">Pre-Approved ₹80 Lakh</div>
                    <div className="text-[10px] text-blue-200">SBI Home Loan @ 8.35%</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 text-slate-900 text-center">
                  <div className="text-xs font-extrabold text-[#002869]">Search Anywhere</div>
                  <div className="text-[10px] text-slate-500">Tap to explore 50L+ properties</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Tag 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
              className="absolute -top-4 -left-4 sm:left-4 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2.5 z-20"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-800">Price Drop Alert!</div>
                <div className="text-[10px] text-emerald-600 font-semibold">-₹5 Lakh in Whitefield</div>
              </div>
            </motion.div>

            {/* Floating Tag 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, delay: 1 }}
              className="absolute -bottom-4 -right-4 sm:right-4 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2.5 z-20"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-800">Direct Owner Chat</div>
                <div className="text-[10px] text-slate-500 font-medium">Instant WhatsApp Connect</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
