import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Globe, 
  Share2, 
  Code, 
  Eye, 
  Smartphone, 
  Monitor, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Link,
  BookOpen
} from 'lucide-react';
import { BlogArticle, BlogSeo, ApprovalStatus, TeamMember } from '../../types/property';
import { ImageUploadField } from './ImageUploadField';

interface AdminBlogEditorProps {
  blogs: BlogArticle[];
  currentUser: TeamMember;
  onSaveBlog: (blog: BlogArticle) => Promise<void>;
  onApproveBlog: (id: string) => Promise<void>;
  onRejectBlog: (id: string, reason?: string) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
  onNotify: (msg: string) => void;
}

export const AdminBlogEditor: React.FC<AdminBlogEditorProps> = ({
  blogs,
  currentUser,
  onSaveBlog,
  onApproveBlog,
  onRejectBlog,
  onDeleteBlog,
  onNotify
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'pending_approval' | 'published' | 'draft'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogArticle | null>(null);
  const [editorTab, setEditorTab] = useState<'content' | 'seo' | 'preview'>('content');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');

  const isAdmin = currentUser.role === 'admin';

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Market Trends');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<ApprovalStatus>('published');

  // SEO State
  const [seo, setSeo] = useState<BlogSeo>({
    focusKeyword: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    robotsIndex: true,
    robotsFollow: true,
    schemaType: 'Article'
  });

  const pendingCount = blogs.filter(b => b.status === 'pending_approval').length;

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.seo.focusKeyword?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusTab === 'all' || b.status === statusTab;
    return matchesSearch && matchesStatus;
  });

  const generateSlug = (t: string) => {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!editingBlog) {
      const generated = generateSlug(newTitle);
      setSlug(generated);
      setSeo(prev => ({
        ...prev,
        metaTitle: `${newTitle} | PropertyLelo`,
        canonicalUrl: `https://propertylelo.com/insights/${generated}`
      }));
    }
  };

  const handleOpenNew = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setCategory('Market Trends');
    setReadTime('6 min read');
    setCoverImage('https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80');
    setExcerpt('');
    setContent(`## Overview of the Development\n\nProvide comprehensive analysis of micro-market trends, upcoming infrastructure projects, and capital appreciation forecasts.\n\n### Key Highlights\n- Point 1: RERA registered developments\n- Point 2: Metro connectivity\n\n### Investment Outlook\nTarget properties with 2-year possession horizon for optimal capital appreciation.`);
    setStatus(isAdmin ? 'published' : 'pending_approval');
    setSeo({
      focusKeyword: 'real estate investment india 2026',
      metaTitle: 'Real Estate Market Insights | PropertyLelo',
      metaDescription: 'Expert real estate market reports, infrastructure tracking, and legal buyer guides across India.',
      canonicalUrl: 'https://propertylelo.com/insights/real-estate-guide',
      robotsIndex: true,
      robotsFollow: true,
      schemaType: 'Article'
    });
    setEditorTab('content');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (b: BlogArticle) => {
    setEditingBlog(b);
    setTitle(b.title);
    setSlug(b.slug);
    setCategory(b.category);
    setReadTime(b.readTime);
    setCoverImage(b.coverImage);
    setExcerpt(b.excerpt);
    setContent(b.content);
    setStatus(b.status);
    setSeo(b.seo || {
      focusKeyword: '',
      metaTitle: b.title,
      metaDescription: b.excerpt,
      canonicalUrl: `https://propertylelo.com/insights/${b.slug}`,
      robotsIndex: true,
      robotsFollow: true,
      schemaType: 'Article'
    });
    setEditorTab('content');
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      onNotify('Title and slug are required');
      return;
    }

    const blogObj: BlogArticle = {
      id: editingBlog ? editingBlog.id : `blog-${Date.now()}`,
      title,
      slug,
      excerpt: excerpt || title,
      content,
      category,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      readTime: readTime || '5 min read',
      date: editingBlog ? editingBlog.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      authorId: editingBlog ? editingBlog.authorId : currentUser.id,
      authorName: editingBlog ? editingBlog.authorName : currentUser.name,
      authorRole: editingBlog ? editingBlog.authorRole : (currentUser.role === 'admin' ? 'Chief Editor' : 'Research Analyst'),
      status: isAdmin ? status : 'pending_approval',
      seo: {
        ...seo,
        metaTitle: seo.metaTitle || `${title} | PropertyLelo`,
        metaDescription: seo.metaDescription || excerpt,
        canonicalUrl: seo.canonicalUrl || `https://propertylelo.com/insights/${slug}`
      }
    };

    await onSaveBlog(blogObj);
    setIsEditorOpen(false);
    onNotify(
      isAdmin 
        ? `Article "${blogObj.title}" saved successfully!` 
        : `Article submitted for Super Admin review!`
    );
  };

  // Focus keyword checker
  const kw = seo.focusKeyword.toLowerCase().trim();
  const kwInTitle = kw && title.toLowerCase().includes(kw);
  const kwInSlug = kw && slug.toLowerCase().includes(kw);
  const kwInMetaDesc = kw && seo.metaDescription.toLowerCase().includes(kw);
  const kwInContent = kw && content.toLowerCase().includes(kw);

  return (
    <div className="space-y-6">
      {/* 1. Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <span>Market Insights CMS & Professional SEO Studio</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {blogs.length} Articles
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish high-ranking real estate guides with Google SERP previews, schema markup, and keyword density audits.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* 2. Status Filter Tabs */}
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
          All Articles ({blogs.length})
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
          <span>Pending Admin Approval ({pendingCount})</span>
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
          Live Published
        </button>

        <button
          type="button"
          onClick={() => setStatusTab('draft')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            statusTab === 'draft' 
              ? 'bg-slate-700 text-white shadow-xs' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles by title, category, focus keyword..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002869] focus:outline-none"
        />
      </div>

      {/* 4. Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlogs.map((b) => {
          const isPending = b.status === 'pending_approval';

          return (
            <div 
              key={b.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                isPending ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur text-[#002869] text-[10px] font-bold shadow-xs">
                      {b.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    {isPending ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <Clock className="w-3 h-3" /> Needs Approval
                      </span>
                    ) : b.status === 'published' ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-700 text-white text-[10px] font-bold">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{b.date} • {b.readTime}</span>
                    <span>By: <strong className="text-slate-700">{b.authorName}</strong></span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {b.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {b.excerpt}
                  </p>

                  {b.seo?.focusKeyword && (
                    <div className="pt-2 text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Search className="w-3 h-3 text-[#FF6B35]" />
                      <span>SEO Keyword: <strong className="text-slate-700">{b.seo.focusKeyword}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {isPending && isAdmin ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() => onApproveBlog(b.id)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectBlog(b.id, 'Needs additional data source or citations')}
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
                      onClick={() => handleOpenEdit(b)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit & SEO</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteBlog(b.id);
                          onNotify(`Article "${b.title}" deleted.`);
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Comprehensive Article & Advanced SEO Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsEditorOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-4xl w-full p-6 z-10 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#002869]" />
                <h3 className="text-base font-bold font-heading text-slate-900">
                  {editingBlog ? `Edit Article: ${editingBlog.title}` : 'Compose Article with SEO Studio'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Editor Sub-Tabs: Content / SEO Suite / SERP Preview */}
            <div className="flex items-center gap-2 pt-3 pb-2 border-b border-slate-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`py-1.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  editorTab === 'content' ? 'bg-[#002869] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Article Content</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('seo')}
                className={`py-1.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  editorTab === 'seo' ? 'bg-[#FF6B35] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>2. Professional SEO Settings</span>
                {kw && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('preview')}
                className={`py-1.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  editorTab === 'preview' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3. Google SERP & Social Preview</span>
              </button>
            </div>

            {/* Main Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
              {/* TAB 1: ARTICLE CONTENT */}
              {editorTab === 'content' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Article Headline / H1 *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Top 5 Infrastructure Corridors in India Driving Real Estate 2026"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#002869] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">URL Slug (SEO friendly) *</label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                        <span className="text-slate-400 mr-1 font-mono text-[11px]">/insights/</span>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          className="w-full bg-transparent font-mono font-semibold text-slate-800 focus:outline-none text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      >
                        <option value="Market Trends">Market Trends</option>
                        <option value="Legal Guide">Legal Guide</option>
                        <option value="Tax & Finance">Tax & Finance</option>
                        <option value="Home Buying Tips">Home Buying Tips</option>
                        <option value="Infrastructure">Infrastructure</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <ImageUploadField
                      label="Article Cover Image"
                      value={coverImage}
                      onChange={(newUrl) => setCoverImage(newUrl)}
                      placeholder="https://images.unsplash.com/photo-..."
                      helperText="Upload feature header banner or paste image link (optimized for Google Discover & SEO preview)."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Read Time Estimate</label>
                      <input
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        placeholder="e.g. 6 min read"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Short Excerpt / Teaser (for cards)</label>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Catchy 1-2 sentence executive summary of the article..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Article Body (Markdown Supported) *</span>
                      <span className="text-[10px] text-slate-400 font-normal">Use ## for H2, ### for H3, - for bullets</span>
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your in-depth real estate guide here..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#002869] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PROFESSIONAL SEO SETTINGS */}
              {editorTab === 'seo' && (
                <div className="space-y-4">
                  {/* Focus Keyword with Live Density Audit */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-[#FF6B35]" />
                        <span>Target Focus Keyword</span>
                      </label>
                      <span className="text-[10px] text-slate-500">Search intent matching</span>
                    </div>

                    <input
                      type="text"
                      value={seo.focusKeyword}
                      onChange={(e) => setSeo({ ...seo, focusKeyword: e.target.value })}
                      placeholder="e.g. dwarka expressway flat price 2026"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-900"
                    />

                    {seo.focusKeyword && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                        <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                          kwInTitle ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
                        }`}>
                          {kwInTitle ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          <span>In Title H1</span>
                        </div>
                        <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                          kwInSlug ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
                        }`}>
                          {kwInSlug ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          <span>In URL Slug</span>
                        </div>
                        <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                          kwInMetaDesc ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
                        }`}>
                          {kwInMetaDesc ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          <span>In Meta Desc</span>
                        </div>
                        <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                          kwInContent ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
                        }`}>
                          {kwInContent ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          <span>In Body Content</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Meta Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">Meta Title Tag (Google Title)</label>
                      <span className={`text-[10px] font-bold ${
                        seo.metaTitle.length >= 45 && seo.metaTitle.length <= 60 
                          ? 'text-emerald-600' 
                          : 'text-amber-600'
                      }`}>
                        {seo.metaTitle.length}/60 chars (Recommended: 50-60)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={seo.metaTitle}
                      onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                      placeholder="Title displayed in Google search results..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">Meta Description</label>
                      <span className={`text-[10px] font-bold ${
                        seo.metaDescription.length >= 120 && seo.metaDescription.length <= 160 
                          ? 'text-emerald-600' 
                          : 'text-amber-600'
                      }`}>
                        {seo.metaDescription.length}/160 chars (Recommended: 140-160)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={seo.metaDescription}
                      onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                      placeholder="Compelling snippet that drives search clicks on Google..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  {/* Canonical URL & Schema Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Canonical URL</label>
                      <input
                        type="url"
                        value={seo.canonicalUrl}
                        onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                        placeholder="https://propertylelo.com/insights/..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Structured Schema Type (JSON-LD)</label>
                      <select
                        value={seo.schemaType}
                        onChange={(e) => setSeo({ ...seo, schemaType: e.target.value as any })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      >
                        <option value="Article">Article (Standard Blog)</option>
                        <option value="NewsArticle">NewsArticle (Real Estate News)</option>
                        <option value="BlogPosting">BlogPosting</option>
                        <option value="RealEstateListing">RealEstateListing</option>
                      </select>
                    </div>
                  </div>

                  {/* Robots Directives */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Search Engine Indexing (Robots)</div>
                      <div className="text-[10px] text-slate-400">Allow Googlebot and Bingbot to crawl and rank this URL</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={seo.robotsIndex}
                          onChange={(e) => setSeo({ ...seo, robotsIndex: e.target.checked })}
                          className="w-4 h-4 rounded text-[#002869]"
                        />
                        <span className="font-bold text-slate-700 text-xs">Index</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={seo.robotsFollow}
                          onChange={(e) => setSeo({ ...seo, robotsFollow: e.target.checked })}
                          className="w-4 h-4 rounded text-[#002869]"
                        />
                        <span className="font-bold text-slate-700 text-xs">Follow Links</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE GOOGLE SERP & SOCIAL PREVIEW */}
              {editorTab === 'preview' && (
                <div className="space-y-5">
                  {/* Google SERP Preview Box */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs">Google SERP Snippet Preview</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-[10px]">Desktop & Mobile</span>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setSerpDevice('desktop')}
                          className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                            serpDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          <Monitor className="w-3 h-3" />
                          <span>Desktop</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSerpDevice('mobile')}
                          className={`px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                            serpDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>Mobile</span>
                        </button>
                      </div>
                    </div>

                    {/* Google result mock card */}
                    <div className={`p-4 rounded-xl bg-[#F8F9FA] border border-slate-200/80 ${
                      serpDevice === 'mobile' ? 'max-w-xs mx-auto shadow-md' : 'w-full'
                    }`}>
                      {/* URL Breadcrumb */}
                      <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
                        <div className="w-4 h-4 rounded-full bg-[#002869] text-white flex items-center justify-center text-[9px] font-bold">
                          PL
                        </div>
                        <span className="font-medium">PropertyLelo India</span>
                        <span className="text-slate-400">›</span>
                        <span className="text-slate-500 truncate max-w-[200px]">insights › {slug || 'guide'}</span>
                      </div>

                      {/* Clickable Title Link */}
                      <div className="text-[#1a0dab] hover:underline text-base sm:text-lg font-medium leading-snug mt-1 cursor-pointer font-sans">
                        {seo.metaTitle || `${title || 'Article Title'} | PropertyLelo`}
                      </div>

                      {/* Description Snippet */}
                      <p className="text-[#4d5156] text-xs leading-relaxed mt-1 line-clamp-2">
                        {seo.metaDescription || excerpt || 'Detailed real estate insights, RERA compliance updates, and micro-market analysis published by PropertyLelo research desk.'}
                      </p>
                    </div>
                  </div>

                  {/* Schema JSON-LD Code Preview */}
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-emerald-400" />
                        <span>Structured JSON-LD Schema (Auto-Generated)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">Validated</span>
                    </div>

                    <pre className="overflow-x-auto text-[10px] text-emerald-300">
{`{
  "@context": "https://schema.org",
  "@type": "${seo.schemaType || 'Article'}",
  "headline": "${(title || 'Property Guide').replace(/"/g, '\\"')}",
  "image": "${coverImage || 'https://propertylelo.com/og-image.jpg'}",
  "author": {
    "@type": "Person",
    "name": "${currentUser.name}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PropertyLelo India",
    "logo": {
      "@type": "ImageObject",
      "url": "https://propertylelo.com/logo.png"
    }
  },
  "datePublished": "${new Date().toISOString()}",
  "mainEntityOfPage": "${seo.canonicalUrl || 'https://propertylelo.com/insights'}"
}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* Bottom Submit Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                      <span>Status:</span>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ApprovalStatus)}
                        className="p-1 font-bold bg-slate-100 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="published">Publish Live Immediately</option>
                        <option value="draft">Save as Draft</option>
                        <option value="pending_approval">Leave in Pending Approval</option>
                      </select>
                    </label>
                  ) : (
                    <div className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg font-bold border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Submits to Super Admin for approval</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white font-bold transition-colors cursor-pointer shadow-md"
                  >
                    {isAdmin ? 'Save & Sync Article' : 'Submit for Admin Approval'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
