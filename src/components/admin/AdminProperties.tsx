import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Property, PropertyType, ListingCategory, FurnishingStatus, PossessionStatus, ApprovalStatus } from '../../types/property';
import { ImageUploadField } from './ImageUploadField';
import { CitySelector } from '../CitySelector';
import { formatIndianCurrency, getAllCities } from '../../lib/cities';

interface AdminPropertiesProps {
  properties: Property[];
  onApproveProperty: (id: string) => Promise<void>;
  onRejectProperty: (id: string, reason?: string) => Promise<void>;
  onSaveProperty: (property: Property) => Promise<void>;
  onDeleteProperty: (id: string) => Promise<void>;
  onToggleFeatured: (id: string, current: boolean) => Promise<void>;
  onNotify: (msg: string) => void;
}

export const AdminProperties: React.FC<AdminPropertiesProps> = ({
  properties,
  onApproveProperty,
  onRejectProperty,
  onSaveProperty,
  onDeleteProperty,
  onToggleFeatured,
  onNotify
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'pending_approval' | 'published' | 'rejected'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Dynamic list of available cities from properties + custom cities
  const availableCities = React.useMemo(() => {
    const list = getAllCities();
    properties.forEach((p) => {
      if (p.city && !list.includes(p.city)) {
        list.push(p.city);
      }
    });
    return Array.from(new Set(list));
  }, [properties]);

  // New property form state
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    category: 'Buy',
    type: 'Apartment',
    bhk: 3,
    price: 15000000,
    priceFormatted: '₹1.50 Cr',
    pricePerSqft: 8500,
    area: 1750,
    locality: 'Sector 150',
    city: 'Delhi NCR',
    state: 'Uttar Pradesh',
    pincode: '201310',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
    verified: true,
    reraId: 'UPRERAAGT12456',
    postedBy: 'Verified Agent',
    posterName: 'PropertyLelo Verified Desk',
    posterPhone: '+91 98765 43210',
    postedDate: 'Just now',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    facing: 'North-East',
    floor: '8th of 24 Floors',
    bathrooms: 3,
    balconies: 2,
    parking: '1 Covered Stilt',
    amenities: ['Clubhouse', 'Swimming Pool', 'Gymnasium', '24x7 Security', 'Power Backup'],
    description: 'Ultra luxurious high-rise apartment with panoramic skyline views, premium Italian marble flooring, and modular kitchen.',
    featured: true,
    status: 'published'
  });

  const pendingCount = properties.filter(p => p.status === 'pending_approval').length;
  const publishedCount = properties.filter(p => p.status === 'published' || !p.status).length;

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.reraId && p.reraId.toLowerCase().includes(searchTerm.toLowerCase()));

    const currentStatus = p.status || 'published';
    const matchesStatus = statusTab === 'all' || currentStatus === statusTab;
    const matchesCity = cityFilter === 'all' || p.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.city) {
      onNotify('Please fill in required fields');
      return;
    }

    const priceNum = Number(formData.price);
    const areaNum = Number(formData.area) || 1000;
    let formatted = formData.priceFormatted;
    if (!formatted) {
      if (priceNum >= 10000000) {
        formatted = `₹${(priceNum / 10000000).toFixed(2)} Cr`;
      } else if (priceNum >= 100000) {
        formatted = `₹${(priceNum / 100000).toFixed(1)} Lakh`;
      } else {
        formatted = `₹${priceNum.toLocaleString('en-IN')}`;
      }
    }

    const fullProp: Property = {
      id: editingProperty ? editingProperty.id : `prop-${Date.now()}`,
      title: formData.title || '',
      tagline: formData.tagline || '',
      type: formData.type as PropertyType || 'Apartment',
      category: formData.category as ListingCategory || 'Buy',
      bhk: Number(formData.bhk) || 3,
      price: priceNum,
      priceFormatted: formatted,
      pricePerSqft: Math.round(priceNum / areaNum),
      area: areaNum,
      locality: formData.locality || '',
      city: formData.city || 'Delhi NCR',
      state: formData.state || 'India',
      pincode: formData.pincode || '110001',
      developerName: formData.developerName || '',
      priceRange: formData.priceRange || '',
      leaseGuarantee: formData.leaseGuarantee || '',
      totalLandArea: formData.totalLandArea || '',
      totalTowers: formData.totalTowers || '',
      totalUnits: formData.totalUnits || '',
      possessionDate: formData.possessionDate || '',
      brochureUrl: formData.brochureUrl || '',
      projectArchitecture: formData.projectArchitecture || '',
      aboutDeveloper: formData.aboutDeveloper || '',
      highlights: formData.highlights || [],
      images: formData.images && formData.images.length > 0 
        ? formData.images 
        : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
      verified: Boolean(formData.verified),
      reraId: formData.reraId || 'RERA-VERIFIED-2026',
      postedBy: formData.postedBy || 'Verified Agent',
      posterName: formData.posterName || 'PropertyLelo Desk',
      posterPhone: formData.posterPhone || '+91 98765 43210',
      postedDate: formData.postedDate || 'Today',
      furnishing: formData.furnishing as FurnishingStatus || 'Semi-Furnished',
      possession: formData.possession as PossessionStatus || 'Ready to Move',
      facing: formData.facing as any || 'North-East',
      floor: formData.floor || '5th of 20 Floors',
      bathrooms: Number(formData.bathrooms) || 2,
      balconies: Number(formData.balconies) || 2,
      parking: formData.parking || '1 Covered',
      amenities: formData.amenities || ['Clubhouse', 'Gym', 'Security'],
      description: formData.description || 'Verified property in prime location.',
      featured: Boolean(formData.featured),
      status: formData.status as ApprovalStatus || 'published'
    };

    await onSaveProperty(fullProp);
    setIsNewModalOpen(false);
    setEditingProperty(null);
    onNotify(`Property "${fullProp.title}" saved & synced in Firestore!`);
  };

  const startEdit = (p: Property) => {
    setEditingProperty(p);
    setFormData({ ...p });
    setIsNewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <span>Property Inventory & Approvals</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-[#002869] font-bold">
              {properties.length} Total in DB
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review submissions, approve team agent listings, edit prices, or publish new properties.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProperty(null);
            setIsNewModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* 2. Status Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setStatusTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            statusTab === 'all' 
              ? 'bg-[#002869] text-white shadow-xs' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Listings ({properties.length})
        </button>

        <button
          type="button"
          onClick={() => setStatusTab('pending_approval')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusTab === 'pending_approval' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approval ({pendingCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusTab('published')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            statusTab === 'published' 
              ? 'bg-emerald-600 text-white shadow-xs' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Live Published ({publishedCount})
        </button>

        <button
          type="button"
          onClick={() => setStatusTab('rejected')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            statusTab === 'rejected' 
              ? 'bg-red-600 text-white shadow-xs' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Rejected / Drafts
        </button>
      </div>

      {/* 3. Search & City Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search property by title, locality, RERA ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002869] focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-[#002869] focus:outline-none"
          >
            <option value="all">All Cities ({properties.length})</option>
            {availableCities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700">No properties found in this view.</p>
            <p className="text-xs text-slate-400 mt-1">Switch status tabs or create a new property listing.</p>
          </div>
        ) : (
          filteredProperties.map((p) => {
            const isPending = p.status === 'pending_approval';
            const isRejected = p.status === 'rejected';

            return (
              <div 
                key={p.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col ${
                  isPending ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                }`}
              >
                {/* Image & Status Badge */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Status pill */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {isPending && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Approval
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold shadow-xs">
                        Rejected
                      </span>
                    )}
                    {(!p.status || p.status === 'published') && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live on Marketplace
                      </span>
                    )}
                  </div>

                  {/* Price overlay */}
                  <div className="absolute bottom-2.5 left-2.5 text-white">
                    <div className="text-lg font-black font-heading leading-none">
                      {p.priceFormatted}
                    </div>
                    <div className="text-[10px] text-slate-200 font-medium mt-0.5">
                      ₹{p.pricePerSqft?.toLocaleString('en-IN')}/sq.ft • {p.area} sq.ft
                    </div>
                  </div>

                  {/* Featured toggle badge */}
                  <button
                    type="button"
                    onClick={() => onToggleFeatured(p.id, Boolean(p.featured))}
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                      p.featured ? 'bg-[#FF6B35] text-white' : 'bg-black/60 text-white/80 hover:bg-black'
                    }`}
                  >
                    {p.featured ? '★ Featured' : '☆ Make Featured'}
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-[#FF6B35]" />
                      <span>{p.locality}, {p.city}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">
                      {p.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600 font-medium">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-bold">{p.bhk} BHK</span>
                      <span>•</span>
                      <span>{p.type}</span>
                      <span>•</span>
                      <span>{p.furnishing}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Posted by: <strong className="text-slate-800">{p.posterName}</strong></span>
                    {p.reraId && <span className="text-emerald-600 font-bold">RERA Reg.</span>}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    {isPending ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => onApproveProperty(p.id)}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectProperty(p.id, 'Does not meet photo or RERA guidelines')}
                          className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onDeleteProperty(p.id);
                            onNotify(`Property "${p.title}" deleted.`);
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Add / Edit Property Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsNewModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 z-10 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold font-heading text-slate-900">
                {editingProperty ? `Edit Property: ${editingProperty.title}` : 'Add New Property to Database'}
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-3.5 text-xs overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. DLF Magnolias 4 BHK Ultra Luxury Penthouse"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-[#002869] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ListingCategory })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Buy">Buy (Residential)</option>
                    <option value="Commercial">Commercial</option>
                    <option value="New Projects">New Projects</option>
                    <option value="Plot">Plot / Land</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">BHK</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">Price in INR *</label>
                    <span className="text-[11px] font-extrabold text-[#002869] bg-blue-50 px-2 py-0.5 rounded">
                      {formatIndianCurrency(Number(formData.price) || 0)}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="15000000"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Super Area (Sq.Ft) *</label>
                  <input
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                    placeholder="1850"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <CitySelector
                    value={formData.city || 'Delhi NCR'}
                    onChange={(newCity) => setFormData({ ...formData, city: newCity })}
                    label="City *"
                    helperText="Select or click '+ Add New City'"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Locality / Sector *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Golf Course Road"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">RERA Registration ID</label>
                  <input
                    type="text"
                    value={formData.reraId}
                    onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
                    placeholder="e.g. HRERA-PKL-GGM-1122"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              {/* Detailed Project Specifications */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="text-[11px] font-bold text-[#002869] uppercase tracking-wider">
                  Detailed Project Specifications
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Developer / Builder Name</label>
                    <input
                      type="text"
                      value={formData.developerName || ''}
                      onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                      placeholder="e.g. Wellgrow Infotech / Orion Group"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price Range Display</label>
                    <input
                      type="text"
                      value={formData.priceRange || ''}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                      placeholder="e.g. ₹82.80 Lakh - ₹2.50 Cr*"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Total Land Parcel</label>
                    <input
                      type="text"
                      value={formData.totalLandArea || ''}
                      onChange={(e) => setFormData({ ...formData, totalLandArea: e.target.value })}
                      placeholder="e.g. 10 Acres"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Towers / Units</label>
                    <input
                      type="text"
                      value={formData.totalTowers || ''}
                      onChange={(e) => setFormData({ ...formData, totalTowers: e.target.value })}
                      placeholder="e.g. 3 Towers (703 Units)"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Possession Date</label>
                    <input
                      type="text"
                      value={formData.possessionDate || ''}
                      onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                      placeholder="e.g. December 2026"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lease Guarantee / Assured Returns</label>
                    <input
                      type="text"
                      value={formData.leaseGuarantee || ''}
                      onChange={(e) => setFormData({ ...formData, leaseGuarantee: e.target.value })}
                      placeholder="e.g. 29-Year Lease Guarantee • 12% Assured Returns"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brochure PDF URL</label>
                    <input
                      type="url"
                      value={formData.brochureUrl || ''}
                      onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Property Cover Image"
                  value={formData.images?.[0] || ''}
                  onChange={(newUrl) => setFormData({ ...formData, images: [newUrl] })}
                  placeholder="https://images.unsplash.com/photo-..."
                  helperText="Upload high-resolution property exterior or living room photo, or paste a web URL."
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed property specifications, view, club access..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 rounded text-[#002869]"
                  />
                  <span className="font-bold text-slate-700">RERA Verified Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FF6B35]"
                  />
                  <span className="font-bold text-slate-700">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer ml-auto">
                  <span className="text-slate-500 font-semibold">Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ApprovalStatus })}
                    className="p-1 font-bold bg-slate-100 rounded-lg"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white font-bold transition-colors cursor-pointer shadow-md"
                >
                  Save Property to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
