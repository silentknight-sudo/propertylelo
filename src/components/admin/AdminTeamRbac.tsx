import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Key, 
  Phone, 
  Mail, 
  MapPin, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { TeamMember, UserRole } from '../../types/property';

interface AdminTeamRbacProps {
  teamMembers: TeamMember[];
  onCreateMember: (member: TeamMember) => Promise<void>;
  onUpdateMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  onNotify: (msg: string) => void;
}

export const AdminTeamRbac: React.FC<AdminTeamRbacProps> = ({
  teamMembers,
  onCreateMember,
  onUpdateMember,
  onDeleteMember,
  onNotify
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'agent' as UserRole,
    assignedCity: 'Delhi NCR',
    active: true
  });

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenNewModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      username: '',
      password: `lelo@${Math.floor(1000 + Math.random() * 9000)}`,
      email: '',
      phone: '',
      role: 'agent',
      assignedCity: 'Delhi NCR',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (m: TeamMember) => {
    setEditingMember(m);
    setFormData({
      name: m?.name || '',
      username: m?.username || '',
      password: m?.password || '',
      email: m?.email || '',
      phone: m?.phone || '',
      role: m?.role || 'agent',
      assignedCity: m?.assignedCity || 'Delhi NCR',
      active: m?.active ?? true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) {
      onNotify('Name, ID/username, and password are required');
      return;
    }

    if (editingMember) {
      await onUpdateMember(editingMember.id, {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        assignedCity: formData.assignedCity,
        active: formData.active
      });
      onNotify(`Updated credentials for ${formData.name}`);
    } else {
      const newMember: TeamMember = {
        id: `team-${Date.now()}`,
        name: formData.name,
        username: formData.username.trim(),
        password: formData.password.trim(),
        email: formData.email || `${formData.username.split('@')[0]}@propertylelo.com`,
        phone: formData.phone || '+91 98000 00000',
        role: formData.role,
        assignedCity: formData.assignedCity,
        active: formData.active,
        createdAt: new Date().toISOString(),
        leadsAssignedCount: 0,
        propertiesCount: 0
      };
      await onCreateMember(newMember);
      onNotify(`Created new team staff account: ${newMember.username}`);
    }

    setIsModalOpen(false);
  };

  const copyCredentials = (username: string, pass: string) => {
    navigator.clipboard.writeText(`PropertyLelo Staff Login:\nUsername: ${username}\nPassword: ${pass}\nPortal: ${window.location.origin}/#admin`);
    onNotify('Login credentials copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <span>Role-Based Access Control (RBAC) & Team Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
              {teamMembers.length} Staff Accounts
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Super Admin can issue secure logins for agents and content editors. Staff access their own workspace to handle assigned leads and submit listings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewModal}
          className="px-4 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Staff Account</span>
        </button>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Super Admin</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Full system authority. Controls CRM lead routing, website CMS feature switches, staff user generation, and final listing approvals.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Field Agent / Sales Exec</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Manages assigned buyer leads, updates follow-up notes, schedules site tours, and lists properties which enter the approval pipeline.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Content Writer & SEO Editor</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Writes real estate guides using the Advanced SEO Editor (Google SERP previews & schema markup), submitting drafts for admin publication.
          </p>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Staff Name & Role</th>
                <th className="py-3 px-4">Login ID / Username</th>
                <th className="py-3 px-4">Assigned Password</th>
                <th className="py-3 px-4">Territory / Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Credentials & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map((m) => {
                const isSuperAdmin = m.role === 'admin';
                const isPassVisible = Boolean(showPasswords[m.id]);

                return (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Role */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{m.name}</span>
                        {isSuperAdmin && (
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded font-bold">
                            Root
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : m.role === 'agent' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {m.role}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Joined {new Date(m.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-3.5 px-4">
                      <code className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                        {m.username}
                      </code>
                    </td>

                    {/* Password */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">
                          {isPassVisible ? (m.password || '••••••••') : '••••••••'}
                        </code>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(m.id)}
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                          title="Toggle view"
                        >
                          {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Territory */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-700 font-semibold">
                        <MapPin className="w-3 h-3 text-[#FF6B35]" />
                        <span>{m.assignedCity || 'All India Metro'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {m.phone}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        m.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {m.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => copyCredentials(m.username, m.password || '')}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Copy Staff Credentials"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(m)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {!isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteMember(m.id);
                              onNotify(`Staff member "${m.name}" removed.`);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 z-10 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold font-heading text-slate-900">
                {editingMember ? `Edit Staff Account: ${editingMember.name}` : 'Provision Staff Account (RBAC)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-[#002869] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff ID / Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="vikram.agent"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-[#002869] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="password123"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-[#002869] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#002869]"
                  >
                    <option value="agent">Field Agent (Leads & Listings)</option>
                    <option value="editor">Content Writer (SEO Blogs)</option>
                    <option value="admin">Super Admin (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Territory / City</label>
                  <select
                    value={formData.assignedCity}
                    onChange={(e) => setFormData({ ...formData, assignedCity: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@propertylelo.com"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002869] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002869] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#002869]"
                  />
                  <span className="font-bold text-slate-700">Account Active (Permit login)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white font-bold transition-colors cursor-pointer shadow-md"
                >
                  Save to Firestore Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
