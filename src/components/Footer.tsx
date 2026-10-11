import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Heart, 
  ArrowUp,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onSelectCity: (city: string) => void;
  onOpenEmi: () => void;
  onOpenPostProperty: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCity,
  onOpenEmi,
  onOpenPostProperty,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#001947] text-white pt-16 pb-12 border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-xs">
          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-blue-200/80 leading-relaxed max-w-sm">
              PropertyLelo is India's most trusted real estate ecosystem connecting millions of buyers, tenants, and property owners with verified listings, zero brokerage, and transparent market intelligence.
            </p>

            <div className="space-y-2 pt-2 text-blue-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B35]" />
                <span>Toll-Free Helpline: 1800-419-7421 (Mon-Sat, 9AM - 8PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B35]" />
                <span>support@propertylelo.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                <span>DLF Cyber City, Tower B, Sector 25, Gurugram, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
              Top Metro Cities
            </h4>
            <ul className="space-y-2 text-blue-200/80">
              {['Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'].map((city) => (
                <li key={city}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      const el = document.getElementById('properties-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                  >
                    Properties in {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tools & Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
              Calculators & Tools
            </h4>
            <ul className="space-y-2 text-blue-200/80">
              <li>
                <button type="button" onClick={onOpenEmi} className="hover:text-orange-400 transition-colors cursor-pointer">
                  Home Loan EMI Calculator
                </button>
              </li>
              <li>
                <a href="#tools-section" className="hover:text-orange-400 transition-colors">
                  City Price Trends 2026
                </a>
              </li>
              <li>
                <a href="#tools-section" className="hover:text-orange-400 transition-colors">
                  Indian Land Area Converter
                </a>
              </li>
              <li>
                <button type="button" onClick={onOpenPostProperty} className="hover:text-orange-400 transition-colors cursor-pointer font-bold text-orange-300">
                  Post Free Property Ad
                </button>
              </li>
              <li>
                <a href="#new-projects" className="hover:text-orange-400 transition-colors">
                  RERA Registered Projects
                </a>
              </li>
              <li>
                <a href="#insights" className="hover:text-orange-400 transition-colors">
                  Real Estate Legal Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-blue-200/80">
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  About PropertyLelo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  RERA Compliance Audit
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Zero Brokerage Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Privacy Policy & GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Delhi NCR Real Estate SEO Keywords Hub */}
        <div className="py-8 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35]"></span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Real Estate Searches in Delhi NCR
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 text-blue-200/80">
            {[
              'Flats in Noida Expressway',
              'Apartments in Dwarka Expressway Gurgaon',
              '2 BHK Flats in Noida Sector 150',
              'Luxury Villas on Golf Course Road',
              'Commercial Shops in Sector 132 Noida',
              'Plots near Jewar International Airport',
              '3 BHK Flats in Greater Noida West',
              'Builder Floors in South Delhi',
              'Zero Brokerage Properties in Delhi NCR',
              'RERA Approved Projects in Gurugram',
              'Ready to Move Flats in Indirapuram Ghaziabad',
              'High Return Commercial Real Estate Noida'
            ].map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => {
                  onSelectCity('Delhi NCR');
                  const el = document.getElementById('properties-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-blue-200 hover:text-white transition-all text-[11px] cursor-pointer border border-white/10"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-300/70">
          <p className="text-center md:text-left leading-relaxed">
            © {new Date().getFullYear()} PropertyLelo Technologies Pvt. Ltd. All rights reserved. <br />
            Disclaimer: PropertyLelo is an online marketplace facilitating direct connections between buyers, sellers, and certified builders. All property data is verified via public state RERA portals.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4 text-[#FF6B35]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
