import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  FileText, 
  Sliders, 
  ShieldCheck, 
  LogOut, 
  Home, 
  CheckCircle2, 
  Bell, 
  RefreshCw,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Logo } from '../Logo';
import { 
  TeamMember, 
  Lead, 
  Property, 
  BlogArticle, 
  CmsSettings, 
  LeadStatus 
} from '../../types/property';
import { AdminLogin } from './AdminLogin';
import { AdminCrmLeads } from './AdminCrmLeads';
import { AdminProperties } from './AdminProperties';
import { AdminTeamRbac } from './AdminTeamRbac';
import { AdminBlogEditor } from './AdminBlogEditor';
import { AdminCmsSettings } from './AdminCmsSettings';
import { TeamAgentPortal } from './TeamAgentPortal';

interface AdminPortalProps {
  teamMembers: TeamMember[];
  leads: Lead[];
  properties: Property[];
  blogs: BlogArticle[];
  cmsSettings: CmsSettings;
  onBackToHome: () => void;
  // Firestore Mutation Callbacks
  onAssignLead: (leadId: string, memberId: string, memberName: string) => Promise<void>;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  onAddLeadNote: (leadId: string, noteText: string) => Promise<void>;
  onCreateManualLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteLead: (leadId: string) => Promise<void>;
  onApproveProperty: (id: string) => Promise<void>;
  onRejectProperty: (id: string, reason?: string) => Promise<void>;
  onSaveProperty: (property: Property) => Promise<void>;
  onDeleteProperty: (id: string) => Promise<void>;
  onTogglePropertyFeatured: (id: string, current: boolean) => Promise<void>;
  onCreateTeamMember: (member: TeamMember) => Promise<void>;
  onUpdateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  onDeleteTeamMember: (id: string) => Promise<void>;
  onSaveBlog: (blog: BlogArticle) => Promise<void>;
  onApproveBlog: (id: string) => Promise<void>;
  onRejectBlog: (id: string, reason?: string) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
  onSaveCmsSettings: (settings: CmsSettings) => Promise<void>;
  onRefreshAllData: () => Promise<void>;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  teamMembers,
  leads,
  properties,
  blogs,
  cmsSettings,
  onBackToHome,
  onAssignLead,
  onUpdateLeadStatus,
  onAddLeadNote,
  onCreateManualLead,
  onDeleteLead,
  onApproveProperty,
  onRejectProperty,
  onSaveProperty,
  onDeleteProperty,
  onTogglePropertyFeatured,
  onCreateTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
  onSaveBlog,
  onApproveBlog,
  onRejectBlog,
  onDeleteBlog,
  onSaveCmsSettings,
  onRefreshAllData
}) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(() => {
    try {
      const saved = localStorage.getItem('propertylelo_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'crm' | 'properties' | 'rbac' | 'blogs' | 'cms'>('crm');
  const [notification, setNotification] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLoginSuccess = (member: TeamMember) => {
    setCurrentUser(member);
    localStorage.setItem('propertylelo_auth_user', JSON.stringify(member));
    showNotification(`Signed in as ${member.name} (${member.role.toUpperCase()})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('propertylelo_auth_user');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshAllData();
    setIsRefreshing(false);
    showNotification('Synced all records with Firebase Firestore');
  };

  // If not logged in, show secure login
  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        teamMembers={teamMembers}
        onBackToHome={onBackToHome}
      />
    );
  }

  // Count notification badges
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const pendingPropsCount = properties.filter(p => p.status === 'pending_approval').length;
  const pendingBlogsCount = blogs.filter(b => b.status === 'pending_approval').length;

  const isSuperAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Enterprise Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Portal Identifier */}
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="h-6 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-bold font-heading text-sm text-white">
                {isSuperAdmin ? 'Enterprise Admin & CRM' : 'Team Agent Workspace'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isSuperAdmin 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {currentUser.role}
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Sync status */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Refresh from Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Firestore Live</span>
            </button>

            {/* Back to website button */}
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span className="hidden md:inline">View Consumer Site</span>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-white leading-none">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{currentUser.username}</div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Super Admin Nav Tabs */}
        {isSuperAdmin && (
          <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
              {/* Tab 1: CRM Leads */}
              <button
                type="button"
                onClick={() => setActiveTab('crm')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'crm' 
                    ? 'bg-[#FF6B35] text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>CRM & Leads Manager</span>
                {newLeadsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-white text-[#FF6B35] rounded-full text-[10px] font-black">
                    {newLeadsCount}
                  </span>
                )}
              </button>

              {/* Tab 2: Properties & Approvals */}
              <button
                type="button"
                onClick={() => setActiveTab('properties')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'properties' 
                    ? 'bg-[#FF6B35] text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Property Approvals & DB</span>
                {pendingPropsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black animate-pulse">
                    {pendingPropsCount}
                  </span>
                )}
              </button>

              {/* Tab 3: RBAC Team */}
              <button
                type="button"
                onClick={() => setActiveTab('rbac')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'rbac' 
                    ? 'bg-[#FF6B35] text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RBAC Team Management ({teamMembers.length})</span>
              </button>

              {/* Tab 4: Blog SEO Studio */}
              <button
                type="button"
                onClick={() => setActiveTab('blogs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'blogs' 
                    ? 'bg-[#FF6B35] text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>SEO Blog Studio</span>
                {pendingBlogsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black">
                    {pendingBlogsCount}
                  </span>
                )}
              </button>

              {/* Tab 5: CMS Controls */}
              <button
                type="button"
                onClick={() => setActiveTab('cms')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'cms' 
                    ? 'bg-[#FF6B35] text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Website CMS Controls</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isSuperAdmin ? (
          <>
            {activeTab === 'crm' && (
              <AdminCrmLeads
                leads={leads}
                teamMembers={teamMembers}
                onAssignLead={onAssignLead}
                onUpdateStatus={onUpdateLeadStatus}
                onAddNote={onAddLeadNote}
                onCreateManualLead={onCreateManualLead}
                onDeleteLead={onDeleteLead}
                onNotify={showNotification}
              />
            )}

            {activeTab === 'properties' && (
              <AdminProperties
                properties={properties}
                onApproveProperty={onApproveProperty}
                onRejectProperty={onRejectProperty}
                onSaveProperty={onSaveProperty}
                onDeleteProperty={onDeleteProperty}
                onToggleFeatured={onTogglePropertyFeatured}
                onNotify={showNotification}
              />
            )}

            {activeTab === 'rbac' && (
              <AdminTeamRbac
                teamMembers={teamMembers}
                onCreateMember={onCreateTeamMember}
                onUpdateMember={onUpdateTeamMember}
                onDeleteMember={onDeleteTeamMember}
                onNotify={showNotification}
              />
            )}

            {activeTab === 'blogs' && (
              <AdminBlogEditor
                blogs={blogs}
                currentUser={currentUser}
                onSaveBlog={onSaveBlog}
                onApproveBlog={onApproveBlog}
                onRejectBlog={onRejectBlog}
                onDeleteBlog={onDeleteBlog}
                onNotify={showNotification}
              />
            )}

            {activeTab === 'cms' && (
              <AdminCmsSettings
                settings={cmsSettings}
                onSaveSettings={onSaveCmsSettings}
                onNotify={showNotification}
              />
            )}
          </>
        ) : (
          /* Agent / Team Member Dedicated Workspace */
          <TeamAgentPortal
            currentUser={currentUser}
            leads={leads}
            properties={properties}
            blogs={blogs}
            onUpdateLeadStatus={onUpdateLeadStatus}
            onAddLeadNote={onAddLeadNote}
            onSubmitPropertyForApproval={onSaveProperty}
            onSubmitBlogForApproval={onSaveBlog}
            onNotify={showNotification}
          />
        )}
      </main>
    </div>
  );
};
