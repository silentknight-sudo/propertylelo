import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Clock3, 
  MapPin, 
  UserCheck, 
  Plus, 
  Trash2, 
  MessageSquare, 
  ExternalLink,
  DollarSign,
  Download,
  AlertCircle
} from 'lucide-react';
import { Lead, LeadStatus, LeadType, TeamMember } from '../../types/property';

interface AdminCrmLeadsProps {
  leads: Lead[];
  teamMembers: TeamMember[];
  onAssignLead: (leadId: string, memberId: string, memberName: string) => Promise<void>;
  onUpdateStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  onAddNote: (leadId: string, noteText: string) => Promise<void>;
  onCreateManualLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteLead: (leadId: string) => Promise<void>;
  onNotify: (msg: string) => void;
}

export const AdminCrmLeads: React.FC<AdminCrmLeadsProps> = ({
  leads,
  teamMembers,
  onAssignLead,
  onUpdateStatus,
  onAddNote,
  onCreateManualLead,
  onDeleteLead,
  onNotify
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual lead form state
  const [manualForm, setManualForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    type: 'contact_owner' as LeadType,
    city: 'Delhi NCR',
    propertyTitle: '',
    budget: '',
    message: '',
    status: 'New' as LeadStatus,
    assignedTo: ''
  });

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.clientPhone.includes(searchTerm) ||
      (lead.clientEmail && lead.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.propertyTitle && lead.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesType = typeFilter === 'all' || lead.type === typeFilter;
    const matchesAgent = 
      agentFilter === 'all' || 
      (agentFilter === 'unassigned' ? !lead.assignedTo : lead.assignedTo === agentFilter);

    return matchesSearch && matchesStatus && matchesType && matchesAgent;
  });

  // Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const siteVisits = leads.filter(l => l.status === 'Site Visit Fixed').length;
  const closedDeals = leads.filter(l => l.status === 'Deal Closed').length;

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.clientName || !manualForm.clientPhone) {
      onNotify('Client name and phone are required');
      return;
    }

    const assignedMember = teamMembers.find(m => m.id === manualForm.assignedTo);

    await onCreateManualLead({
      ...manualForm,
      assignedToName: assignedMember ? assignedMember.name : undefined,
      assignedAt: assignedMember ? new Date().toISOString() : undefined,
      notes: [
        {
          id: `n-${Date.now()}`,
          author: 'Admin',
          text: 'Manual lead registered via CRM Admin Desk',
          date: new Date().toISOString()
        }
      ]
    });

    setIsManualModalOpen(false);
    setManualForm({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      type: 'contact_owner',
      city: 'Delhi NCR',
      propertyTitle: '',
      budget: '',
      message: '',
      status: 'New',
      assignedTo: ''
    });
    onNotify('Manual lead created and synced with Firestore!');
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    await onAddNote(selectedLead.id, newNoteText.trim());
    setNewNoteText('');
    onNotify('Follow-up note added to lead record');
  };

  const exportLeadsCsv = () => {
    const headers = ['ID,Client Name,Phone,Email,Type,Property,City,Status,Assigned Agent,Created At'];
    const rows = leads.map(l => 
      `"${l.id}","${l.clientName}","${l.clientPhone}","${l.clientEmail || ''}","${l.type}","${(l.propertyTitle || '').replace(/"/g, '""')}","${l.city || ''}","${l.status}","${l.assignedToName || 'Unassigned'}","${l.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PropertyLelo_CRM_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('Exported leads CSV successfully');
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-1 bg-amber-500/15 text-amber-600 rounded-full text-xs font-bold">New</span>;
      case 'Contacted':
        return <span className="px-2.5 py-1 bg-blue-500/15 text-blue-600 rounded-full text-xs font-bold">Contacted</span>;
      case 'Site Visit Fixed':
        return <span className="px-2.5 py-1 bg-purple-500/15 text-purple-600 rounded-full text-xs font-bold">Site Visit Fixed</span>;
      case 'Deal Closed':
        return <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-600 rounded-full text-xs font-bold">Deal Closed</span>;
      case 'Lost':
        return <span className="px-2.5 py-1 bg-slate-500/15 text-slate-600 rounded-full text-xs font-bold">Lost</span>;
    }
  };

  const getTypeLabel = (type: LeadType) => {
    switch (type) {
      case 'schedule_visit': return 'Site Visit Request';
      case 'contact_owner': return 'Seller Inbound Callback';
      case 'vip_project': return 'VIP Builder Launch';
      case 'home_loan': return 'Home Loan Pre-Approval';
      case 'post_property': return 'Property Seller Listing';
      default: return 'General Enquiry';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <span>CRM & Lead Distribution Engine</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Live Firestore Sync
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time inquiries from public visitors. Assign incoming buyers to verified territory agents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportLeadsCsv}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Lead</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Leads</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-heading">{totalLeads}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct from portal</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
          <div className="text-xs font-semibold text-amber-700">New / Unassigned</div>
          <div className="text-2xl font-black text-amber-600 mt-1 font-heading">{newLeads}</div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Needs action</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-xs">
          <div className="text-xs font-semibold text-blue-700">In Contact</div>
          <div className="text-2xl font-black text-blue-600 mt-1 font-heading">{contactedLeads}</div>
          <div className="text-[11px] text-blue-600/80 mt-0.5">Agent follow-up</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200/80 bg-purple-50/20 shadow-xs">
          <div className="text-xs font-semibold text-purple-700">Site Visits Fixed</div>
          <div className="text-2xl font-black text-purple-600 mt-1 font-heading">{siteVisits}</div>
          <div className="text-[11px] text-purple-600/80 mt-0.5">Physical tours</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-emerald-700">Closed Conversions</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-heading">{closedDeals}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Successful sales</div>
        </div>
      </div>

      {/* 3. Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search lead by client name, mobile, email, or property..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002869] focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-[#002869] focus:outline-none"
            >
              <option value="all">All Statuses ({leads.length})</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Site Visit Fixed">Site Visit Fixed</option>
              <option value="Deal Closed">Deal Closed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Agent Filter */}
          <div>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-[#002869] focus:outline-none"
            >
              <option value="all">All Assigned Staff</option>
              <option value="unassigned">Unassigned (Action needed)</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lead Type Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold pt-1">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Type:
          </span>
          {['all', 'schedule_visit', 'contact_owner', 'vip_project', 'home_loan', 'post_property'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                typeFilter === t 
                  ? 'bg-[#002869] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All Types' : getTypeLabel(t as LeadType)}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Leads Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Client Details</th>
                <th className="py-3 px-4">Inquiry / Property</th>
                <th className="py-3 px-4">Type & Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Agent (RBAC)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No leads found matching criteria.</p>
                    <p className="text-[11px] mt-0.5">Try adjusting your filters or create a manual lead.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Client details */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{lead.clientName}</div>
                      <div className="flex items-center gap-1 text-slate-500 font-medium mt-0.5">
                        <Phone className="w-3 h-3 text-[#FF6B35]" />
                        <span>{lead.clientPhone}</span>
                      </div>
                      {lead.clientEmail && (
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{lead.clientEmail}</span>
                        </div>
                      )}
                    </td>

                    {/* Property / Interest */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {lead.propertyTitle ? (
                        <div className="font-semibold text-slate-800 line-clamp-2">
                          {lead.propertyTitle}
                        </div>
                      ) : (
                        <div className="font-semibold text-slate-600 italic">
                          General Portfolio Inquiry
                        </div>
                      )}
                      {lead.city && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{lead.city}</span>
                          {lead.budget && <span className="font-bold text-slate-700">• Budget: {lead.budget}</span>}
                          {lead.loanAmount && <span className="font-bold text-emerald-700">• Loan: ₹{(lead.loanAmount/100000).toFixed(1)}L</span>}
                        </div>
                      )}
                    </td>

                    {/* Type & Schedule */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {getTypeLabel(lead.type)}
                      </span>
                      {lead.preferredDate && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 font-medium">
                          <Calendar className="w-3 h-3 text-[#002869]" />
                          <span>{lead.preferredDate} ({lead.preferredTime || 'Anytime'})</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Status Select */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-[#002869] cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Site Visit Fixed">Site Visit Fixed</option>
                        <option value="Deal Closed">Deal Closed</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    {/* Assign Agent */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.assignedTo || ''}
                        onChange={(e) => {
                          const targetId = e.target.value;
                          const found = teamMembers.find(m => m.id === targetId);
                          onAssignLead(lead.id, targetId, found ? found.name : '');
                        }}
                        className={`text-xs font-bold rounded-lg p-1.5 border cursor-pointer ${
                          lead.assignedTo 
                            ? 'bg-blue-50/70 border-blue-200 text-[#002869]' 
                            : 'bg-amber-50 border-amber-300 text-amber-800'
                        }`}
                      >
                        <option value="">-- Unassigned --</option>
                        {teamMembers.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.assignedCity || m.role})
                          </option>
                        ))}
                      </select>
                      {lead.assignedToName && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Assigned to: {lead.assignedToName}
                        </div>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp link */}
                        <a
                          href={`https://wa.me/${lead.clientPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.clientName)},%20this%20is%20PropertyLelo%20regarding%20your%20inquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                          title="WhatsApp Client"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        {/* Direct Call */}
                        <a
                          href={`tel:${lead.clientPhone}`}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                          title="Call Client"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        {/* View & Add Note */}
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Notes ({lead.notes?.length || 0})
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteLead(lead.id);
                            onNotify(`Lead for "${lead.clientName}" removed.`);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* 5. Lead Detail & Follow-up Notes Drawer/Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 z-10 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                  Lead Dossier • {selectedLead.id}
                </span>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  {selectedLead.clientName}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>{selectedLead.clientPhone}</span>
                  {selectedLead.clientEmail && <span>• {selectedLead.clientEmail}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Inquiry summary */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Inquiry Type:</span>
                  <span className="font-bold text-slate-800">{getTypeLabel(selectedLead.type)}</span>
                </div>
                {selectedLead.propertyTitle && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Property:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedLead.propertyTitle}</span>
                  </div>
                )}
                {selectedLead.city && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">City / Market:</span>
                    <span className="font-bold text-slate-800">{selectedLead.city}</span>
                  </div>
                )}
                {selectedLead.budget && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Budget Range:</span>
                    <span className="font-bold text-emerald-700">{selectedLead.budget}</span>
                  </div>
                )}
                {selectedLead.preferredDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Site Visit Slot:</span>
                    <span className="font-bold text-[#002869]">
                      {selectedLead.preferredDate} at {selectedLead.preferredTime || '10:00 AM'}
                    </span>
                  </div>
                )}
                {selectedLead.message && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-1">Client Message:</span>
                    <p className="text-slate-700 italic bg-white p-2 rounded-lg border border-slate-100">
                      "{selectedLead.message}"
                    </p>
                  </div>
                )}
              </div>

              {/* Notes history */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>CRM Follow-Up Notes ({selectedLead.notes?.length || 0})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Stored in Firestore</span>
                </h4>

                <div className="space-y-2 mb-3">
                  {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                    <div className="text-slate-400 text-center py-3 italic bg-slate-50 rounded-xl">
                      No follow-up notes yet. Add first interaction note below.
                    </div>
                  ) : (
                    selectedLead.notes.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-[#002869]">{n.author}</span>
                          <span className="text-slate-400">
                            {new Date(n.date).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new note form */}
                <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter call outcome, negotiation details, or site visit feedback..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002869] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#002869] hover:bg-[#071f49] text-white rounded-xl font-bold transition-colors cursor-pointer text-center"
                  >
                    Save Note to Firestore
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Add Manual Lead Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsManualModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 z-10 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold font-heading text-slate-900">
                Register Manual Walk-in / Phone Lead
              </h3>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.clientName}
                  onChange={(e) => setManualForm({ ...manualForm, clientName: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002869] focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.clientPhone}
                    onChange={(e) => setManualForm({ ...manualForm, clientPhone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002869] focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={manualForm.clientEmail}
                    onChange={(e) => setManualForm({ ...manualForm, clientEmail: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002869] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inquiry Type</label>
                  <select
                    value={manualForm.type}
                    onChange={(e) => setManualForm({ ...manualForm, type: e.target.value as LeadType })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="schedule_visit">Site Visit Request</option>
                    <option value="contact_owner">Callback Request</option>
                    <option value="vip_project">VIP Builder Launch</option>
                    <option value="home_loan">Home Loan Query</option>
                    <option value="general">General Query</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target City</label>
                  <select
                    value={manualForm.city}
                    onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Property Title / Interest</label>
                <input
                  type="text"
                  value={manualForm.propertyTitle}
                  onChange={(e) => setManualForm({ ...manualForm, propertyTitle: e.target.value })}
                  placeholder="e.g. 3 BHK in Sector 150 Noida"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002869] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Budget Range</label>
                  <input
                    type="text"
                    value={manualForm.budget}
                    onChange={(e) => setManualForm({ ...manualForm, budget: e.target.value })}
                    placeholder="e.g. ₹1.5 Cr - ₹2 Cr"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002869] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Agent Immediately</label>
                  <select
                    value={manualForm.assignedTo}
                    onChange={(e) => setManualForm({ ...manualForm, assignedTo: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#002869]"
                  >
                    <option value="">Leave Unassigned</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.assignedCity || m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-[#FF6B35] hover:bg-[#E85520] text-white font-bold rounded-xl transition-colors cursor-pointer text-center"
              >
                Create Lead in Firestore
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
