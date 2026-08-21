import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Phone, Mail, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileOrEmail) return;
    setOtpSent(true);
    onSuccess(`OTP sent to ${mobileOrEmail}. Use code: 7421 (demo).`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(`Welcome back! Successfully logged into PropertyLelo.`);
    onClose();
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

        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <p className="text-xs text-slate-500">
            {authMode === 'login' ? 'Login to manage your saved properties and inquiries' : 'Create your free account on India\'s trusted marketplace'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setOtpSent(false);
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              authMode === 'login' ? 'bg-white text-[#002869] shadow-xs' : 'text-slate-600'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setOtpSent(false);
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              authMode === 'register' ? 'bg-white text-[#002869] shadow-xs' : 'text-slate-600'
            }`}
          >
            Register
          </button>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Mobile Number or Email
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#002869]">
                <Phone className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={mobileOrEmail}
                  onChange={(e) => setMobileOrEmail(e.target.value)}
                  placeholder="Enter 10-digit mobile or email"
                  className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white font-bold shadow-md transition-colors cursor-pointer text-center"
            >
              Continue with OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Enter 4-Digit OTP (Use: 7421)
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="7 4 2 1"
                className="w-full text-center tracking-[1em] text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-[#002869]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-bold shadow-md transition-colors cursor-pointer text-center"
            >
              Verify & Sign In
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-xs text-slate-500 hover:text-[#002869] underline font-semibold"
              >
                Change mobile number
              </button>
            </div>
          </form>
        )}

        {/* Security assurance */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>100% Secure & encrypted authentication</span>
        </div>
      </motion.div>
    </div>
  );
};
