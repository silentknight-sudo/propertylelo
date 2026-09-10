import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  FileText, 
  Plus, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Eye, 
  Search,
  ExternalLink
} from 'lucide-react';
import { 
  TeamMember, 
  Lead, 
  Property, 
  BlogArticle, 
  LeadStatus, 
  PropertyType, 
  ListingCategory, 
  FurnishingStatus, 
  PossessionStatus 
} from '../../types/property';
import { ImageUploadField } from './ImageUploadField';
import { CitySelector } from '../CitySelector';
import { formatIndianCurrency } from '../../lib/cities';
import { Sparkles, Check, DollarSign, Layers } from 'lucide-react';
import { AdminBlogEditor } from './AdminBlogEditor';

interface TeamAgentPortalProps {
  currentUser: TeamMember;
  leads: Lead[];
  properties: Property[];
  blogs: BlogArticle[];
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  onAddLeadNote: (leadId: string, noteText: string) => Promise<void>;
  onSubmitPropertyForApproval: (property: Property) => Promise<void>;
  onSubmitBlogForApproval: (blog: BlogArticle) => Promise<void>;
  onNotify: (msg: string) => void;
}

export const TeamAgentPortal: React.FC<TeamAgentPortalProps> = ({
  currentUser,
  leads,
  properties,
  blogs,
  onUpdateLeadStatus,
  onAddLeadNote,
  onSubmitPropertyForApproval,
  onSubmitBlogForApproval,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'properties' | 'blogs'>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitPropModalOpen, setIsSubmitPropModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Agent property form state
  const [propForm, setPropForm] = useState<Partial<Property>>({
    title: '',
    category: 'Buy',
    type: 'Apartment',
    bhk: 3,
    price: 12500000,
    area: 1650,
    locality: '',
    city: currentUser?.assignedCity || 'Delhi NCR',
    state: 'India',
    pincode: '110001',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
    reraId: '',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    description: '',
    amenities: ['24x7 Security', 'Power Backup', 'Car Parking']
  });

  // Filter items specifically assigned to or created by this agent
  const myLeads = leads.filter(l => 
    (currentUser?.id && l.assignedTo === currentUser.id) || 
    (l.assignedToName && currentUser?.name && l.assignedToName.toLowerCase() === currentUser.name.toLowerCase())
  );

  const myProperties = properties.filter(p => 
    (currentUser?.name && p.posterName === currentUser.name) || 
    (currentUser?.phone && p.posterPhone === currentUser.phone)
  );

  const myBlogs = blogs.filter(b => (currentUser?.id && b.authorId === currentUser.id) || (currentUser?.name && b.authorName === currentUser.name));

  // Metrics
  const pendingProps = myProperties.filter(p => p.status === 'pending_approval').length;
  const publishedProps = myProperties.filter(p => p.status === 'published' || !p.status).length;
  const newLeadsCount = myLeads.filter(l => l.status === 'New').length;

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.title || !propForm.price || !propForm.locality) {
      onNotify('Title, price, and locality are required');
      return;
    }

    const priceNum = Number(propForm.price);
    const areaNum = Number(propForm.area) || 1200;
    let formatted = `₹${(priceNum / 10000000).toFixed(2)} Cr`;
    if (priceNum < 10000000) {
      formatted = `₹${(priceNum / 100000).toFixed(1)} Lakh`;
    }

    const newProp: Property = {
      id: `prop-agent-${Date.now()}`,
      title: propForm.title || '',
      type: propForm.type as PropertyType || 'Apartment',
      category: propForm.category as ListingCategory || 'Buy',
      bhk: Number(propForm.bhk) || 3,
      price: priceNum,
      priceFormatted: formatted,
      pricePerSqft: Math.round(priceNum / areaNum),
      area: areaNum,
      locality: propForm.locality || '',
      city: propForm.city || 'Delhi NCR',
      state: propForm.state || 'India',
      pincode: propForm.pincode || '110001',
      developerName: propForm.developerName || '',
      priceRange: propForm.priceRange || '',
      leaseGuarantee: propForm.leaseGuarantee || '',
      totalLandArea: propForm.totalLandArea || '',
      totalTowers: propForm.totalTowers || '',
      totalUnits: propForm.totalUnits || '',
      possessionDate: propForm.possessionDate || '',
      brochureUrl: propForm.brochureUrl || '',
      highlights: propForm.highlights || [],
      images: propForm.images && propForm.images.length > 0 ? propForm.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
      verified: false,
      reraId: propForm.reraId || 'SUBMITTED-AGENT-REVIEW',
      postedBy: 'Verified Agent',
      posterName: currentUser?.name || 'Verified Agent',
      posterPhone: currentUser?.phone || '+91 98000 00000',
      postedDate: 'Just now',
      furnishing: propForm.furnishing as FurnishingStatus || 'Semi-Furnished',
      possession: propForm.possession as PossessionStatus || 'Ready to Move',
      facing: 'North-East',
      floor: 'Middle Floor',
      bathrooms: Number(propForm.bhk) || 2,
      balconies: 2,
      parking: '1 Covered Car Parking',
      amenities: propForm.amenities || ['Security', 'Parking'],
      description: propForm.description || 'Listing submitted by authorized team agent.',
      status: 'pending_approval' // Stays in pending approval until Super Admin approves!
    };

    await onSubmitPropertyForApproval(newProp);
    setIsSubmitPropModalOpen(false);
    onNotify('Property submitted! Super Admin will review and approve for live marketplace.');
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    await onAddLeadNote(selectedLead.id, `[${currentUser.name}]: ${newNoteText.trim()}`);
    setNewNoteText('');
    onNotify('Call note saved to lead history in Firestore!');
  };

  return (
    <div className="space-y-6">
      {/* 1. Agent Welcome & Territory Banner */}
      <div className="bg-[#002869] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B35] uppercase tracking-wider mb-1">
            <span>Verified Team Agent Desk</span>
            <span>•</span>
            <span className="text-white bg-white/10 px-2 py-0.5 rounded-md">{currentUser.assignedCity || 'Delhi NCR Territory'}</span>
          </div>
          <h2 className="text-2xl font-bold font-heading">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Manage your assigned buyer leads, track site visit requests, and submit new property listings for Admin verification.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => setIsSubmitPropModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Property for Approval</span>
          </button>
        </div>
      </div>

      {/* 2. Personal KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">My Assigned Leads</div>
          <div className="text-2xl font-black text-[#002869] mt-1 font-heading">{myLeads.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">{newLeadsCount} Pending Action</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">My Live Listings</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-heading">{publishedProps}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active on marketplace</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Awaiting Admin Approval</div>
          <div className="text-2xl font-black text-amber-600 mt-1 font-heading">{pendingProps}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">In review pipeline</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Articles / SEO Guides</div>
          <div className="text-2xl font-black text-purple-600 mt-1 font-heading">{myBlogs.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Research submissions</div>
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'leads' ? 'bg-[#002869] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Assigned Buyer Leads ({myLeads.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'properties' ? 'bg-[#002869] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>My Property Submissions ({myProperties.length})</span>
          {pendingProps > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('blogs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'blogs' ? 'bg-[#002869] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>SEO Blog Editor</span>
        </button>
      </div>

      {/* 4. TAB CONTENT */}

      {/* TAB A: MY ASSIGNED LEADS */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                Buyer & Investor Inquiries Assigned by Super Admin
              </h3>
              <span className="text-xs text-slate-500">{myLeads.length} Total Leads</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Client Name & Phone</th>
                    <th className="py-3 px-4">Inquiry / Property</th>
                    <th className="py-3 px-4">Type & Slot</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Quick Contact & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-bold text-slate-700">No leads currently assigned to you.</p>
                        <p className="text-xs text-slate-400 mt-1">Super Admin assigns incoming visitor leads to territory agents.</p>
                      </td>
                    </tr>
                  ) : (
                    myLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{lead.clientName}</div>
                          <div className="flex items-center gap-1 text-slate-600 font-medium mt-0.5">
                            <Phone className="w-3 h-3 text-[#FF6B35]" />
                            <span>{lead.clientPhone}</span>
                          </div>
                          {lead.clientEmail && (
                            <div className="text-[11px] text-slate-400">{lead.clientEmail}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800 line-clamp-1">
                            {lead.propertyTitle || 'General Territory Inquiry'}
                          </div>
                          {lead.city && (
                            <div className="text-[11px] text-slate-500">
                              {lead.city} {lead.budget ? `• Budget: ${lead.budget}` : ''}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[11px] text-slate-700">
                            {lead.type.replace('_', ' ')}
                          </span>
                          {lead.preferredDate && (
                            <div className="text-[11px] text-slate-500 mt-1">
                              Slot: {lead.preferredDate} ({lead.preferredTime || 'Morning'})
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-[#002869] cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Site Visit Fixed">Site Visit Fixed</option>
                            <option value="Deal Closed">Deal Closed</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`https://wa.me/${lead.clientPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.clientName)},%20I%20am%20${encodeURIComponent(currentUser.name)}%20from%20PropertyLelo%20regarding%20your%20property%20request.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                              title="WhatsApp Client"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            <a
                              href={`tel:${lead.clientPhone}`}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                              title="Call Client"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={() => setSelectedLead(lead)}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Notes ({lead.notes?.length || 0})
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: MY PROPERTY SUBMISSIONS */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Properties Submitted by You ({myProperties.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsSubmitPropModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Another Property</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProperties.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-700">No properties submitted yet.</p>
                <p className="text-xs text-slate-400 mt-1">Submit your first property listing to request Super Admin approval.</p>
              </div>
            ) : (
              myProperties.map((p) => {
                const isPending = p.status === 'pending_approval';

                return (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="relative h-40 w-full bg-slate-100">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 left-2.5">
                        {isPending ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                            <Clock className="w-3 h-3" /> Awaiting Admin Approval
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                            <CheckCircle2 className="w-3 h-3" /> Live on Marketplace
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</div>
                      <div className="text-xs text-slate-500">{p.locality}, {p.city}</div>
                      <div className="text-sm font-black text-[#002869]">{p.priceFormatted}</div>
                      <p className="text-[11px] text-slate-400">
                        {isPending 
                          ? 'This listing is in the Super Admin review queue. Once approved, it appears in public search.' 
                          : 'This listing is live and receiving visitor inquiries.'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB C: SEO BLOG EDITOR */}
      {activeTab === 'blogs' && (
        <AdminBlogEditor
          blogs={blogs}
          currentUser={currentUser}
          onSaveBlog={onSubmitBlogForApproval}
          onApproveBlog={async () => {}}
          onRejectBlog={async () => {}}
          onDeleteBlog={async () => {}}
          onNotify={onNotify}
        />
      )}

      {/* 5. Lead Notes Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 z-10 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900">
                  Lead Notes: {selectedLead.clientName}
                </h3>
                <div className="text-xs text-slate-500">{selectedLead.clientPhone}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-2 text-xs">
              <div className="max-h-48 overflow-y-auto space-y-2">
                {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                  <p className="text-slate-400 italic text-center py-4">No follow-up notes recorded yet.</p>
                ) : (
                  selectedLead.notes.map((n) => (
                    <div key={n.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-[#002869]">{n.author}</span>
                        <span>{new Date(n.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700">{n.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record client visit outcome, budget negotiation, or visit feedback..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002869]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#002869] hover:bg-[#071f49] text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Note to Firestore
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 6. Submit Property Modal */}
      {isSubmitPropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsSubmitPropModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 z-10 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900">
                  Submit Property for Admin Approval
                </h3>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Listing will enter the Super Admin approval queue before going live.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitPropModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePropertySubmit} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
              {/* Quick Auto-Fill Title Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Property Title *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const bhkText = propForm.type === 'Plot' || propForm.type === 'Commercial Office' ? '' : `${propForm.bhk || 3} BHK `;
                      const loc = propForm.locality ? propForm.locality : 'Prime Location';
                      const cit = propForm.city || currentUser?.assignedCity || 'Delhi NCR';
                      const autoTitle = `${bhkText}Premium ${propForm.type || 'Apartment'} in ${loc}, ${cit}`;
                      setPropForm(prev => ({ ...prev, title: autoTitle }));
                    }}
                    className="text-[11px] font-bold text-[#FF6B35] hover:text-[#E85520] flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Suggest Title</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={propForm.title}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  placeholder="e.g. 3 BHK Luxury Apartment in Godrej Woods, Sector 43"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869] focus:outline-none"
                />
              </div>

              {/* Category and Property Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listing Type *</label>
                  <select
                    value={propForm.category || 'Buy'}
                    onChange={(e) => setPropForm({ ...propForm, category: e.target.value as ListingCategory })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
                  >
                    <option value="Buy">For Sale / Buy</option>
                    <option value="Commercial">Commercial Property</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Property Type *</label>
                  <select
                    value={propForm.type || 'Apartment'}
                    onChange={(e) => setPropForm({ ...propForm, type: e.target.value as PropertyType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869]"
                  >
                    <option value="Apartment">Apartment / High-rise Flat</option>
                    <option value="Independent House">Independent House / Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Plot">Residential Plot / Land</option>
                    <option value="Commercial Office">Commercial Office</option>
                  </select>
                </div>
              </div>

              {/* City Selection (Supports Any City + Adding New Cities!) */}
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 space-y-3">
                <CitySelector
                  value={propForm.city || currentUser.assignedCity || 'Delhi NCR'}
                  onChange={(newCity) => setPropForm({ ...propForm, city: newCity })}
                  label="Target City / Territory *"
                  helperText="Choose your assigned region or any city in India. Click '+ Add New City' to list in unlisted markets."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Locality / Sector *</label>
                    <input
                      type="text"
                      required
                      value={propForm.locality}
                      onChange={(e) => setPropForm({ ...propForm, locality: e.target.value })}
                      placeholder="e.g. Sector 150, Golf Course Ext Road"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={propForm.pincode || '110001'}
                      onChange={(e) => setPropForm({ ...propForm, pincode: e.target.value })}
                      placeholder="e.g. 201310"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing with Live Currency Preview & Presets */}
              <div className="bg-orange-50/40 p-3 rounded-2xl border border-orange-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800">
                    Total Price in INR *
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#002869] text-white font-extrabold text-xs">
                    {formatIndianCurrency(Number(propForm.price) || 0)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <input
                      type="number"
                      required
                      min={100000}
                      step={50000}
                      value={propForm.price || ''}
                      onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                      placeholder="e.g. 12500000"
                      className="w-full p-2 bg-white border border-orange-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF6B35]"
                    />
                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-500 font-bold">Quick:</span>
                      {[
                        { label: '₹65 L', val: 6500000 },
                        { label: '₹95 L', val: 9500000 },
                        { label: '₹1.5 Cr', val: 15000000 },
                        { label: '₹2.5 Cr', val: 25000000 },
                        { label: '₹4.0 Cr', val: 40000000 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setPropForm({ ...propForm, price: preset.val })}
                          className="px-1.5 py-0.5 rounded bg-white hover:bg-orange-100 text-slate-700 border border-orange-200 text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Super Area (Sq.Ft) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={propForm.area || ''}
                      onChange={(e) => setPropForm({ ...propForm, area: Number(e.target.value) })}
                      placeholder="e.g. 1650"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                    />
                    {Number(propForm.price) > 0 && Number(propForm.area) > 0 && (
                      <p className="text-[11px] text-[#002869] font-bold mt-1">
                        ≈ ₹{Math.round(Number(propForm.price) / Number(propForm.area)).toLocaleString('en-IN')}/sq.ft
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Specifications: BHK, Furnishing, Possession */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bedrooms / BHK *</label>
                  <select
                    value={propForm.bhk}
                    onChange={(e) => setPropForm({ ...propForm, bhk: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                    <option value={5}>5+ BHK / Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Furnishing</label>
                  <select
                    value={propForm.furnishing || 'Semi-Furnished'}
                    onChange={(e) => setPropForm({ ...propForm, furnishing: e.target.value as FurnishingStatus })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Possession</label>
                  <select
                    value={propForm.possession || 'Ready to Move'}
                    onChange={(e) => setPropForm({ ...propForm, possession: e.target.value as PossessionStatus })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>
              </div>

              {/* RERA and Facing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">RERA Registration ID</label>
                  <input
                    type="text"
                    value={propForm.reraId || ''}
                    onChange={(e) => setPropForm({ ...propForm, reraId: e.target.value })}
                    placeholder="e.g. UPRERAAGT12456"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Facing Direction</label>
                  <select
                    value={propForm.facing || 'North-East'}
                    onChange={(e) => setPropForm({ ...propForm, facing: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="North-East">North-East (Vastu Compliant)</option>
                    <option value="East">East Facing</option>
                    <option value="North">North Facing</option>
                    <option value="West">West Facing</option>
                    <option value="South">South Facing</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Component */}
              <div>
                <ImageUploadField
                  label="Primary Property Photo *"
                  value={propForm.images?.[0] || ''}
                  onChange={(newUrl) => setPropForm({ ...propForm, images: [newUrl] })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Upload a photo from your computer/phone or select a curated architectural preset."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Highlights & Description</label>
                <textarea
                  rows={2}
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  placeholder="Mention floor height, tower view, builder reputation, club amenities, metro proximity..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitPropModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white font-bold transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Submit for Super Admin Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
