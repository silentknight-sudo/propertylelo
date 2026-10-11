import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  User, 
  Sparkles, 
  X, 
  Share2, 
  Tag, 
  Search, 
  CheckCircle2, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  MapPin 
} from 'lucide-react';
import { BLOG_ARTICLES_DATA } from '../data/mockData';
import { Article, BlogArticle } from '../types/property';

interface InsightsBlogProps {
  blogs?: BlogArticle[];
  onNotify?: (msg: string) => void;
  onSelectCity?: (city: string) => void;
}

export const InsightsBlog: React.FC<InsightsBlogProps> = ({ 
  blogs, 
  onNotify,
  onSelectCity 
}) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Use Firestore approved published blogs if available, otherwise mock data
  const publishedBlogs = useMemo(() => {
    return blogs && blogs.length > 0 
      ? blogs.filter(b => b.status === 'published' || !b.status)
      : BLOG_ARTICLES_DATA;
  }, [blogs]);

  // Categories list with count
  const categories = useMemo(() => {
    const cats = ['All', 'Delhi NCR Special', 'Market Trends', 'Buyer Guides', 'Legal Guide', 'Tax & Finance'];
    return cats;
  }, []);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter(article => {
      const matchesCategory = 
        selectedCategory === 'All' || 
        article.category === selectedCategory ||
        (selectedCategory === 'Delhi NCR Special' && (article.category === 'Delhi NCR Special' || article.title.toLowerCase().includes('delhi ncr') || article.title.toLowerCase().includes('noida')));
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        (article.seo?.focusKeyword && article.seo.focusKeyword.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [publishedBlogs, selectedCategory, searchQuery]);

  // Inject or update Schema.org Article metadata when modal is opened for top SEO scoring
  useEffect(() => {
    if (selectedArticle && 'seo' in selectedArticle && selectedArticle.seo) {
      const scriptId = 'jsonld-active-article';
      let existingScript = document.getElementById(scriptId);
      if (!existingScript) {
        existingScript = document.createElement('script');
        existingScript.id = scriptId;
        existingScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(existingScript);
      }
      
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": selectedArticle.title,
        "description": selectedArticle.excerpt,
        "image": ('coverImage' in selectedArticle ? selectedArticle.coverImage : (selectedArticle as any).image) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        "datePublished": selectedArticle.date,
        "dateModified": selectedArticle.date,
        "author": {
          "@type": "Person",
          "name": ('authorName' in selectedArticle ? selectedArticle.authorName : (selectedArticle as any).author) || 'PropertyLelo Research Desk',
          "jobTitle": ('authorRole' in selectedArticle ? selectedArticle.authorRole : 'Senior Real Estate Analyst')
        },
        "publisher": {
          "@type": "Organization",
          "name": "PropertyLelo",
          "logo": {
            "@type": "ImageObject",
            "url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": ('seo' in selectedArticle && selectedArticle.seo?.canonicalUrl) ? selectedArticle.seo.canonicalUrl : window.location.href
        },
        "keywords": selectedArticle.seo?.focusKeyword || "real estate ncr, property in noida, flats in gurgaon"
      };

      existingScript.textContent = JSON.stringify(articleSchema);
    }
  }, [selectedArticle]);

  // Render markdown line by line
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-3.5 text-slate-700 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-black text-[#002869] pt-4 pb-1 border-b border-slate-100 font-heading">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg sm:text-xl font-bold text-[#002869] pt-3 pb-0.5 font-heading">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-base font-bold text-slate-800 pt-2 text-[#FF6B35]">
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('---')) {
            return <hr key={idx} className="my-4 border-slate-200" />;
          }
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            // Simple markdown table line
            const cells = trimmed.split('|').filter(c => c.trim().length > 0);
            const isSeparator = cells.every(c => c.includes('---'));
            if (isSeparator) return null;
            return (
              <div key={idx} className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-medium">
                {cells.map((cell, cIdx) => (
                  <div key={cIdx} className={cIdx === 0 ? 'font-bold text-[#002869]' : 'text-slate-600'}>
                    {cell.trim().replace(/\*\*/g, '')}
                  </div>
                ))}
              </div>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-2 flex-shrink-0" />
                <span className="text-sm text-slate-700">
                  {renderInlineFormatting(trimmed.replace(/^[-*]\s+/, ''))}
                </span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^(\d+)\.\s/)?.[1] || '1';
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-[#002869] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-200">
                  {num}
                </span>
                <span className="text-sm text-slate-700">
                  {renderInlineFormatting(trimmed.replace(/^\d+\.\s+/, ''))}
                </span>
              </div>
            );
          }
          if (trimmed === '') {
            return <div key={idx} className="h-1.5" />;
          }
          return (
            <p key={idx} className="text-sm leading-relaxed text-slate-700">
              {renderInlineFormatting(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="font-bold text-[#002869]">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleExploreNcr = () => {
    setSelectedArticle(null);
    if (onSelectCity) {
      onSelectCity('Delhi NCR');
    }
    const propSection = document.getElementById('properties-section');
    if (propSection) {
      propSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="insights" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002869] text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#FF6B35]" />
              Market Intelligence & Delhi NCR Real Estate SEO Hub
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
              Real Estate News & Expert NCR Guides
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Data-backed research reports on Delhi NCR property investment, Noida vs. Gurgaon price trends, zero-brokerage blueprints, and RERA compliance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              Showing {filteredBlogs.length} of {publishedBlogs.length} Guides
            </span>
          </div>
        </div>

        {/* Search & Category Pills Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#002869] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat === 'Delhi NCR Special' ? '📍 Delhi NCR Special' : cat}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NCR, Noida, RERA, 0% brokerage..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No articles found matching your criteria</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-3 text-xs text-[#FF6B35] font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((article: any, idx: number) => {
              const isNcrSpecial = article.category === 'Delhi NCR Special' || article.id.includes('ncr');
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedArticle(article)}
                  className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                    isNcrSpecial 
                      ? 'bg-gradient-to-b from-blue-50/40 via-white to-white border-blue-200 ring-1 ring-blue-100'
                      : 'bg-[#F8F9FB] border-slate-100'
                  }`}
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                      <img
                        src={article.coverImage || article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-md ${
                          isNcrSpecial 
                            ? 'bg-[#FF6B35] text-white flex items-center gap-1' 
                            : 'bg-[#002869] text-white'
                        }`}>
                          {isNcrSpecial && <Sparkles className="w-3 h-3" />}
                          {article.category}
                        </span>
                      </div>

                      {article.seo?.focusKeyword && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur text-white text-[10px] font-medium flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5 text-[#FF6B35]" />
                            <span>{article.seo.focusKeyword}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{article.date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Author & Footer */}
                  <div className="px-6 py-4 bg-white/70 border-t border-slate-100/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-[#002869] flex items-center justify-center font-bold text-xs">
                        {(article.authorName || article.author || 'PL')[0]}
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-slate-800">{article.authorName || article.author}</div>
                        <div className="text-[10px] text-slate-400">{article.authorRole || 'Editorial Desk'}</div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#002869] group-hover:text-[#FF6B35] flex items-center gap-1 transition-colors">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Article Full Reader Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
              <div className="fixed inset-0" onClick={() => setSelectedArticle(null)} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 z-10 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#002869] text-xs font-bold uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  {(selectedArticle as any).seo?.focusKeyword && (
                    <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B35] text-xs font-semibold flex items-center gap-1 border border-orange-200">
                      <Tag className="w-3 h-3" />
                      {(selectedArticle as any).seo.focusKeyword}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#002869] font-heading mt-2 mb-3 leading-tight">
                  {selectedArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <User className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>{('authorName' in selectedArticle ? selectedArticle.authorName : (selectedArticle as any).author) || 'PropertyLelo Research'}</span>
                    {('authorRole' in selectedArticle && selectedArticle.authorRole) && (
                      <span className="text-slate-400 font-normal">({selectedArticle.authorRole})</span>
                    )}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedArticle.date}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedArticle.readTime}</span>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video max-h-72 w-full bg-slate-100 shadow-sm">
                  <img
                    src={'coverImage' in selectedArticle ? selectedArticle.coverImage : (selectedArticle as any).image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Lead Excerpt Callout */}
                <div className="bg-blue-50/60 p-4 rounded-2xl border-l-4 border-[#002869] mb-6">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed italic">
                    "{selectedArticle.excerpt}"
                  </p>
                </div>

                {/* Article Body */}
                <div className="prose prose-slate max-w-none">
                  {renderFormattedContent(selectedArticle.content)}
                </div>

                {/* Action Box: Explore Delhi NCR Properties */}
                <div className="mt-8 p-5 bg-gradient-to-r from-[#002869] to-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#FF6B35]" />
                      Explore Verified Delhi NCR Properties
                    </h4>
                    <p className="text-xs text-blue-200 mt-1">
                      Browse 100% verified flats, villas & commercial projects in Noida & Gurgaon with 0% brokerage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExploreNcr}
                    className="px-5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#e0531e] text-white font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span>View NCR Listings</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Footer Controls */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Published by PropertyLelo Market Research Desk • Delhi NCR
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = window.location.origin + window.location.pathname;
                      navigator.clipboard.writeText(shareUrl);
                      setCopied(true);
                      if (onNotify) {
                        onNotify('Article link copied to clipboard!');
                      }
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>{copied ? 'Copied!' : 'Share Guide'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
