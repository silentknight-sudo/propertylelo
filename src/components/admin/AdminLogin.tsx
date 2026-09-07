import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle,
  Home,
  Eye,
  EyeOff
} from 'lucide-react';
import { Logo } from '../Logo';
import { TeamMember } from '../../types/property';

interface AdminLoginProps {
  onLoginSuccess: (member: TeamMember) => void;
  teamMembers: TeamMember[];
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  teamMembers,
  onBackToHome
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check for super admin credentials:
    // ID: shivam@9063, Password: shivam @9063 (or shivam@9063)
    const isSuperAdminMatch = 
      (cleanUser === 'shivam@9063' || cleanUser === 'shivam@propertylelo.com') && 
      (cleanPass === 'shivam @9063' || cleanPass === 'shivam@9063' || cleanPass.replace(/\s+/g, '') === 'shivam@9063');

    if (isSuperAdminMatch) {
      setTimeout(() => {
        setIsLoading(false);
        const adminObj: TeamMember = {
          id: 'admin-shivam-9063',
          username: 'shivam@9063',
          name: 'Shivam (Super Admin)',
          email: 'shivam@propertylelo.com',
          phone: '+91 98765 43210',
          role: 'admin',
          active: true,
          createdAt: new Date().toISOString()
        };
        onLoginSuccess(adminObj);
      }, 350);
      return;
    }

    // Check team members registered in the database
    const matchedMember = teamMembers.find(
      m => m.username.toLowerCase() === cleanUser || m.email.toLowerCase() === cleanUser
    );

    if (matchedMember && matchedMember.active) {
      if (matchedMember.password && matchedMember.password === cleanPass) {
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(matchedMember);
        }, 350);
        return;
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setError('Invalid username or password. Please verify your credentials or contact the administrator.');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#002869]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar back link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur transition-colors cursor-pointer shadow-lg"
        >
          <Home className="w-4 h-4 text-[#FF6B35]" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 my-8"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex justify-center p-3 bg-slate-950/70 rounded-2xl border border-slate-800 shadow-inner">
              <Logo size="md" />
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h1 className="text-2xl font-extrabold font-heading text-white tracking-tight">
                Admin & CRM Portal
              </h1>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Authorized access only. Enter your administrative or staff credentials to proceed.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Secure Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Username or Staff Email
              </label>
              <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:border-transparent transition-all">
                <User className="w-4 h-4 text-slate-500 mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter staff ID or email"
                  autoComplete="username"
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-[#FF6B35] focus-within:border-transparent transition-all">
                <Lock className="w-4 h-4 text-slate-500 mr-2.5 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer transition-colors ml-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#002869] hover:bg-[#001f54] text-white font-bold text-sm shadow-lg shadow-[#002869]/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-xl mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#FF6B35]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              Protected by Enterprise Role-Based Access Control (RBAC) & Audit Logging.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
