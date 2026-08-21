import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Percent, Landmark, Scale, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface WhyChooseUsProps {
  onOpenEmiCalculator: () => void;
  onOpenPostProperty: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({
  onOpenEmiCalculator,
  onOpenPostProperty
}) => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Verified Listings',
      description: 'Every listed property undergoes strict physical site verification, title deed audit, and RERA registration compliance.',
      stats: '99.4% Accuracy Rate',
      badge: 'RERA Compliant',
      iconBg: 'bg-emerald-50 text-emerald-600',
      action: 'Learn Verification Process'
    },
    {
      icon: Percent,
      title: 'Zero Brokerage Direct Deals',
      description: 'Connect directly with verified owners, developers, and premium builders. Save lakhs on unnecessary brokerage commissions.',
      stats: '₹140 Cr+ Brokerage Saved',
      badge: 'Direct Connect',
      iconBg: 'bg-orange-50 text-[#FF6B35]',
      action: 'Post Free Listing',
      onClick: onOpenPostProperty
    },
    {
      icon: Landmark,
      title: 'Instant Home Loan Assistance',
      description: 'Partnered with SBI, HDFC, ICICI, and Axis Bank for fastest 48-hour sanctions at competitive repo-linked interest rates.',
      stats: 'Starting at 8.35% p.a.',
      badge: 'Pre-Approved',
      iconBg: 'bg-blue-50 text-[#002869]',
      action: 'Calculate Monthly EMI',
      onClick: onOpenEmiCalculator
    },
    {
      icon: Scale,
      title: 'Legal & Title Guarantee',
      description: 'Comprehensive 45-point legal check covering Encumbrance, Khata transfer, OC/CC clearance, and lawyer consultation.',
      stats: 'Certified Legal Team',
      badge: 'Safe Purchase',
      iconBg: 'bg-indigo-50 text-indigo-600',
      action: 'Book Legal Consultation'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F8F9FB] border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/60 text-[#002869] text-xs font-bold uppercase tracking-wider mb-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35]" />
            The PropertyLelo Advantage
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
            Why Millions of Indians Trust Us
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            We are redefining Indian real estate through complete price transparency, verified titles, and zero middleman friction.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${pillar.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#002869] transition-colors">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#002869]">
                    {pillar.stats}
                  </span>
                  {pillar.onClick ? (
                    <button
                      type="button"
                      onClick={pillar.onClick}
                      className="font-bold text-[#FF6B35] hover:text-[#E85520] flex items-center gap-0.5 cursor-pointer group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Action</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="font-bold text-[#FF6B35] flex items-center gap-0.5">
                      Verified <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
