import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Phone, 
  Calendar, 
  User, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  Landmark, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { Property, NewProject } from '../types/property';

// 1. SCHEDULE SITE VISIT MODAL
export interface VisitDetails {
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  visitType: 'Physical' | 'Video Call';
  cabAssistance: boolean;
}

interface ScheduleVisitModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string, details: VisitDetails) => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [visitType, setVisitType] = useState<'Physical' | 'Video Call'>('Physical');
  const [cabAssistance, setCabAssistance] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) return;
    onSuccess(
      `Site visit for "${property.title}" scheduled for ${date} (${timeSlot}). Free cab details sent via SMS!`,
      { name, phone, date, timeSlot, visitType, cabAssistance }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 z-10 shadow-2xl border border-slate-100"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Zero-Cost Site Visit</span>
        </div>

        <h3 className="text-xl font-extrabold text-[#002869] font-heading mb-1">
          Book Property Tour
        </h3>
        <p className="text-xs text-slate-500 mb-5 truncate">
          {property.title} • {property.locality}, {property.city}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          {/* Visit Type Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVisitType('Physical')}
              className={`py-2 px-3 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                visitType === 'Physical'
                  ? 'bg-[#002869] text-white border-[#002869]'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              🚗 In-Person Physical Visit
            </button>
            <button
              type="button"
              onClick={() => setVisitType('Video Call')}
              className={`py-2 px-3 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                visitType === 'Video Call'
                  ? 'bg-[#002869] text-white border-[#002869]'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              📹 Live 3D Video Tour
            </button>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rohini Gupta"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 text-xs"
              >
                <option>09:00 AM - 11:00 AM</option>
                <option>11:00 AM - 01:00 PM</option>
                <option>02:00 PM - 04:00 PM</option>
                <option>04:00 PM - 06:30 PM</option>
              </select>
            </div>
          </div>

          {/* Complimentary Cab Checkbox */}
          <label className="flex items-center gap-2 p-3 bg-orange-50/70 border border-orange-200 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={cabAssistance}
              onChange={(e) => setCabAssistance(e.target.checked)}
              className="accent-[#FF6B35] w-4 h-4 rounded"
            />
            <span className="text-xs font-semibold text-slate-800">
              Need free Uber pick & drop for physical site visit? (Complimentary)
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white font-bold shadow-md transition-colors cursor-pointer text-center"
          >
            Confirm Site Visit Booking
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// 2. CONTACT OWNER / BUILDER MODAL
export interface ContactDetails {
  name: string;
  phone: string;
  message: string;
}

interface ContactOwnerModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string, details: ContactDetails) => void;
}

export const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('Hi, I am interested in your property. Please share full details and floor plans.');
  const [showDirectContact, setShowDirectContact] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setShowDirectContact(true);
    onSuccess(
      `Contact request sent! You can now call ${property.posterName} directly.`,
      { name, phone, message }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 z-10 shadow-2xl border border-slate-100"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-1">
          <Phone className="w-3.5 h-3.5" />
          <span>Direct Contact ({property.postedBy})</span>
        </div>

        <h3 className="text-xl font-extrabold text-[#002869] font-heading mb-1">
          Connect with {property.posterName}
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Zero brokerage guarantee. Connect with verified seller.
        </p>

        {showDirectContact ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Direct Verified Phone:</div>
              <div className="text-2xl font-extrabold text-[#002869] mt-1 font-heading">
                {property.posterPhone}
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <a
                href={`tel:${property.posterPhone}`}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Seth"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Mobile Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98110 12345"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-bold shadow-lg shadow-[#FF6B35]/25 transition-all cursor-pointer text-center"
            >
              Get Verified Seller Contact
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// 3. VIP NEW PROJECT ENQUIRY MODAL
export interface VipEnquiryDetails {
  name: string;
  phone: string;
  budget: string;
}

interface VipProjectModalProps {
  project: NewProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string, details: VipEnquiryDetails) => void;
}

export const VipProjectModal: React.FC<VipProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('₹1 Cr - ₹2.5 Cr');

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSuccess(
      `VIP Callback registered for ${project.name}! Relationship manager will call in 15 mins.`,
      { name, phone, budget }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-[#001947] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 z-10 shadow-2xl border border-blue-900"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B35] text-white text-[10px] font-bold uppercase">
          Exclusive VIP Access
        </span>

        <h3 className="text-xl font-extrabold font-heading text-white mt-2 mb-1">
          {project.name}
        </h3>
        <p className="text-xs text-blue-200 mb-5">
          By {project.builder} • {project.locality}, {project.city}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-blue-100 mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-white placeholder-blue-300/50"
              placeholder="e.g. Anish Kapoor"
            />
          </div>

          <div>
            <label className="block font-semibold text-blue-100 mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-white placeholder-blue-300/50"
              placeholder="e.g. +91 98200 88776"
            />
          </div>

          <div>
            <label className="block font-semibold text-blue-100 mb-1">Target Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-white text-xs"
            >
              <option className="text-slate-900">Under ₹1.5 Cr</option>
              <option className="text-slate-900">₹1.5 Cr - ₹3 Cr</option>
              <option className="text-slate-900">₹3 Cr - ₹6 Cr</option>
              <option className="text-slate-900">₹6 Cr+</option>
            </select>
          </div>

          <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 text-[11px] text-orange-200">
            🎁 Guaranteed launch discount voucher locked with this enquiry.
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-bold shadow-lg shadow-[#FF6B35]/30 transition-all cursor-pointer text-center"
          >
            Claim VIP Launch Privilege
          </button>
        </form>
      </motion.div>
    </div>
  );
};
