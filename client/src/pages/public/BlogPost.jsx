import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import SEO from '../../components/SEO';
import { blogPosts, categoryColors } from '../../data/blogData';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl">📄</div>
        <h1 className="text-2xl font-bold text-dark">Article Not Found</h1>
        <p className="text-slate-500">This article doesn't exist or has been moved.</p>
        <Link to="/blog" className="btn-primary px-6 py-3 mt-2">Back to Blog</Link>
      </div>
    );
  }

  const related = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.id % 3 === post.id % 3))
    .slice(0, 3);

  return (
    <div className="animate-fade-in bg-surface min-h-screen">
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        keywords={post.keywords}
        canonical={`/blog/${post.slug}`}
      />

      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded mb-3 ${categoryColors[post.category] || 'text-primary-600 bg-primary-50'}`}>
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <button onClick={() => navigate('/blog')} className="flex items-center gap-1.5 text-primary-600 font-semibold hover:gap-2.5 transition-all">
            <ArrowLeft size={16} /> All Articles
          </button>
          <span className="hidden sm:block text-slate-200">|</span>
          <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime} read</span>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

          {/* Content */}
          <article>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-primary-400 pl-5 italic">
              {post.excerpt}
            </p>

            <div
              className="
                prose-content
                [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-dark [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-slate-100
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-dark [&_h3]:mt-7 [&_h3]:mb-3
                [&_p]:text-slate-600 [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-base
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
                [&_ul_li]:text-slate-600 [&_ul_li]:leading-relaxed
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
                [&_ol_li]:text-slate-600 [&_ol_li]:leading-relaxed
                [&_strong]:font-bold [&_strong]:text-dark
                [&_a]:text-primary-600 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary-700
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA */}
            <div className="mt-12 p-6 bg-primary-50 border border-primary-100 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-dark mb-2">Need a Verified Professional?</h3>
              <p className="text-slate-600 text-sm mb-5">Book a CNIC-verified electrician, plumber, AC technician, carpenter, painter or mason anywhere in Pakistan.</p>
              <Link to="/register" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
                Book a Service Worker <ArrowRight size={16} />
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Related posts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-dark mb-4 text-base">Related Articles</h3>
              <div className="space-y-4">
                {related.map(p => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=60'; }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                        {p.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{p.readTime} read</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* All categories */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-dark mb-4 text-base">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(blogPosts.map(p => p.category))].map(cat => (
                  <Link
                    key={cat}
                    to="/blog"
                    className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[cat] || 'text-primary-600 bg-primary-50'}`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white text-center">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="font-bold mb-2 text-base">Book a Home Service</h3>
              <p className="text-primary-100 text-xs mb-4 leading-relaxed">Verified workers across Pakistan. Fast booking, transparent pricing.</p>
              <Link to="/register" className="block w-full bg-white text-primary-700 font-bold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                Get Started Free
              </Link>
            </div>
          </aside>
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-10">
          {blogPosts[post.id - 2] && (
            <Link
              to={`/blog/${blogPosts[post.id - 2].slug}`}
              className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-shadow group"
            >
              <ArrowLeft size={18} className="text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-primary-600 transition-colors" />
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Previous Article</p>
                <p className="text-sm font-semibold text-dark group-hover:text-primary-600 transition-colors line-clamp-2">
                  {blogPosts[post.id - 2].title}
                </p>
              </div>
            </Link>
          )}
          {blogPosts[post.id] && (
            <Link
              to={`/blog/${blogPosts[post.id].slug}`}
              className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-shadow group sm:flex-row-reverse sm:text-right"
            >
              <ArrowRight size={18} className="text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-primary-600 transition-colors" />
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Next Article</p>
                <p className="text-sm font-semibold text-dark group-hover:text-primary-600 transition-colors line-clamp-2">
                  {blogPosts[post.id].title}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
