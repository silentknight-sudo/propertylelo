import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, Calendar, ArrowRight, User, Sparkles, X } from 'lucide-react';
import { ARTICLES_DATA } from '../data/mockData';
import { Article } from '../types/property';

export const InsightsBlog: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES_DATA.map((article, idx) => (
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
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-[#002869] text-white text-[11px] font-bold shadow-md">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#002869] transition-colors line-clamp-2 mb-2 font-heading">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Read CTA */}
              <div className="p-5 pt-0 border-t border-slate-200/60 mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 truncate max-w-[170px]">
                  {article.author.split('(')[0]}
                </span>
                <span className="font-bold text-[#FF6B35] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Article Full Preview Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div 
              className="fixed inset-0" 
              onClick={() => setSelectedArticle(null)} 
            />
            <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 z-10 shadow-2xl border border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#002869] text-xs font-bold mb-3">
                {selectedArticle.category}
              </span>

              <h3 className="text-2xl font-extrabold text-[#002869] font-heading mb-3">
                {selectedArticle.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <span>Published on {selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-2xl mb-6 shadow-sm"
              />

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p className="font-semibold text-base text-slate-900">
                  {selectedArticle.excerpt}
                </p>
                <p>
                  As urban infrastructure and metro expansion accelerate across tier-1 and tier-2 corridors in India, capital appreciation in peripheral growth hubs has outpaced central business districts. Investors and homebuyers are increasingly prioritizing multimodal transit connectivity, RERA adherence, and integrated master planning.
                </p>
                <p>
                  Key indicators for 2026 suggest steady appreciation driven by IT/pharma hiring corridors, green building standards, and competitive repo-linked home loan rates. Always conduct independent title deed verification through licensed real estate legal counsel before executing sale agreements.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="bg-[#002869] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#071f49] transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
