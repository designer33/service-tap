import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';
import { blogPosts, categoryColors } from '../../data/blogData';

const Blog = () => {
  return (
    <div className="animate-fade-in bg-surface min-h-screen">
      <SEO
        title="Home Services Blog — Tips, Guides & Advice for Pakistani Homeowners"
        description="Expert home maintenance tips, seasonal guides, pricing breakdowns, and how-to articles for Pakistani homeowners. Learn about electricians, plumbers, AC repair, carpentry, painting and more."
        keywords="home services blog Pakistan, electrician tips Pakistan, plumber guide Pakistan, AC maintenance Pakistan, home maintenance Lahore Karachi Islamabad, carpenter tips, painter guide Pakistan"
        canonical="/blog"
      />

      {/* Hero */}
      <section className="hero-gradient text-white py-16">
        <div className="page-container text-center">
          <h1 className="text-4xl font-bold mb-3">Home Services Blog</h1>
          <p className="text-sky-100 max-w-2xl mx-auto text-lg">
            Expert tips, seasonal guides, and home maintenance advice tailored for Pakistani homeowners.
          </p>
        </div>
      </section>

      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="card group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              <Link to={`/blog/${post.slug}`} className="aspect-video overflow-hidden block">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=70'; }}
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${categoryColors[post.category] || 'text-primary-600 bg-primary-50'}`}>
                    {post.category}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto">{post.readTime} read</span>
                </div>
                <h2 className="text-lg font-bold text-dark mb-3 group-hover:text-primary-600 transition-colors leading-snug">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={12} /> {post.date}
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:gap-2.5 transition-all"
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SEO-rich footer blurb */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-dark mb-3">Pakistan's Home Services Experts</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Service Knock connects homeowners across Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan and beyond with CNIC-verified electricians, plumbers, AC technicians, carpenters, painters, masons and labourers. Our blog is your guide to smarter home maintenance in Pakistan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
