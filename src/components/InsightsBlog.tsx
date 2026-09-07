import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, Calendar, ArrowRight, User, Sparkles, X, Share2, Tag } from 'lucide-react';
import { ARTICLES_DATA, BLOG_ARTICLES_DATA } from '../data/mockData';
import { Article, BlogArticle } from '../types/property';

interface InsightsBlogProps {
  blogs?: BlogArticle[];
  onNotify?: (msg: string) => void;
}

export const InsightsBlog: React.FC<InsightsBlogProps> = ({ blogs, onNotify }) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | Article | null>(null);
  const [copied, setCopied] = useState(false);

  // Use Firestore approved published blogs if available, otherwise mock data
  const publishedBlogs = blogs && blogs.length > 0 
    ? blogs.filter(b => b.status === 'published' || !b.status)
    : BLOG_ARTICLES_DATA;

  return (
    <section id="insights" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002869] text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#FF6B35]" />
              Market Intelligence & Guides
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
              Real Estate News & Expert Insights
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Stay ahead with data-backed reports on property appreciation, legal mandates, tax savings, and infrastructure growth.
            </p>
          </div>

          <a
            href="#insights"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF6B35] hover:text-[#E85520] transition-colors"
          >
            <span>Read All ({publishedBlogs.length}) Articles</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedBlogs.slice(0, 6).map((article: any, idx: number) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedArticle(article)}
              className="bg-[#F8F9FB] rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
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
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-[#002869] text-white text-[11px] font-bold shadow-md">
                      {article.category}
                    </span>
                  </div>
                  {article.seo?.focusKeyword && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-medium flex items-center gap-1">
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

              {/* Author Footer */}
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
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Article Full Reader Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="fixed inset-0" onClick={() => setSelectedArticle(null)} />
            <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 z-10 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#002869] text-xs font-bold uppercase tracking-wider">
                {selectedArticle.category}
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-[#002869] font-heading mt-3 mb-2 leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-500 mb-5 pb-4 border-b border-slate-100">
                <span>By <strong>{('authorName' in selectedArticle ? selectedArticle.authorName : (selectedArticle as any).author) || 'PropertyLelo Research'}</strong></span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
                <img
                  src={'coverImage' in selectedArticle ? selectedArticle.coverImage : (selectedArticle as any).image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
                <p className="text-base font-medium text-slate-800 leading-relaxed italic bg-slate-50 p-4 rounded-xl border-l-4 border-[#FF6B35]">
                  {selectedArticle.excerpt}
                </p>
                <div className="whitespace-pre-line">
                  {selectedArticle.content}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Published by PropertyLelo Market Research Desk
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
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
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
