import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import SEO from '../../components/SEO';

const blogPosts = [
  {
    id: 1,
    title: "10 Tips to Maintain Your AC During Summer in Pakistan",
    excerpt: "Keep your cooling system efficient and save on electricity bills during Pakistan's intense summer months. Learn how to clean filters, check refrigerant, and when to call a professional AC technician.",
    image: "https://images.unsplash.com/photo-1599939575322-780fcf2f42d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Technical Team",
    date: "May 10, 2026",
    category: "Maintenance",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "5 Signs You Need to Call a Professional Plumber Immediately",
    excerpt: "Some plumbing issues can wait — others cannot. Discover the 5 warning signs that mean you should never attempt a DIY fix and must call a certified plumber in Pakistan right away.",
    image: "https://images.unsplash.com/photo-1581244276891-83393a6b2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Master Plumber",
    date: "May 05, 2026",
    category: "Guides",
    readTime: "4 min",
  },
  {
    id: 3,
    title: "Electrical Safety Guide for Pakistani Homes — Protect Your Family",
    excerpt: "Electrical faults are the leading cause of home fires in Pakistan. Follow these essential safety protocols, learn what overloaded circuits look like, and know when to call a certified electrician.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Safety Expert",
    date: "April 28, 2026",
    category: "Safety",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Choosing the Right Paint for Your Home in Pakistan's Climate",
    excerpt: "Pakistan's humid summers and cold winters demand specific paint types. Learn how to choose washable, heat-resistant interior and exterior paints that last longer and look better.",
    image: "https://images.unsplash.com/photo-1589939705384-5185138a04b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Interior Designer",
    date: "April 20, 2026",
    category: "Interior",
    readTime: "5 min",
  },
  {
    id: 5,
    title: "How to Book a Verified Home Service Worker in Pakistan",
    excerpt: "Hiring unverified workers at home is risky. Learn how Service Knock's CNIC verification process works, why it matters, and how to book a trusted electrician, plumber, or carpenter online in minutes.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Service Knock Team",
    date: "April 15, 2026",
    category: "How-To",
    readTime: "3 min",
  },
  {
    id: 6,
    title: "Monsoon Home Maintenance Checklist — Protect Your House This Season",
    excerpt: "Pakistan's monsoon season brings heavy rains, flooding, and wall dampness. Use this complete checklist to waterproof your roof, fix leaking pipes, seal walls, and prevent costly water damage.",
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Home Expert",
    date: "April 08, 2026",
    category: "Seasonal",
    readTime: "7 min",
  },
  {
    id: 7,
    title: "Wood Furniture Care — Carpenter Tips for Long-Lasting Furniture",
    excerpt: "Pakistani homes use a lot of wood furniture, but humidity and heat cause warping and cracking. Professional carpenters share their top tips for treating, polishing, and repairing wooden furniture.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Master Carpenter",
    date: "March 30, 2026",
    category: "Guides",
    readTime: "5 min",
  },
  {
    id: 8,
    title: "AC Installation in Pakistan — Split AC vs Window AC: Which Is Better?",
    excerpt: "Thinking of installing an AC in your home? Compare split AC and window AC costs, electricity usage, installation requirements, and suitability for different rooms in Pakistani homes.",
    image: "https://images.unsplash.com/photo-1631745554725-b7dc4012cc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "AC Technician",
    date: "March 22, 2026",
    category: "Guides",
    readTime: "6 min",
  },
  {
    id: 9,
    title: "How Much Does It Cost to Hire an Electrician in Lahore, Karachi & Islamabad?",
    excerpt: "Wondering about electrician rates in Pakistan? We break down typical costs for rewiring, fan installation, circuit breaker repair, and other common jobs across major Pakistani cities.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Service Knock Team",
    date: "March 15, 2026",
    category: "Pricing",
    readTime: "4 min",
  },
  {
    id: 10,
    title: "Tile & Flooring Installation Guide — What to Expect When Hiring a Mason",
    excerpt: "Planning new tile flooring or wall tiles in your home? Learn what preparation is needed, how long installation takes, what materials cost in Pakistan, and how to hire a reliable mason.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Mason Pro",
    date: "March 05, 2026",
    category: "Guides",
    readTime: "5 min",
  },
];

const categoryColors = {
  Maintenance: 'text-amber-600 bg-amber-50',
  Guides:      'text-blue-600 bg-blue-50',
  Safety:      'text-red-600 bg-red-50',
  Interior:    'text-pink-600 bg-pink-50',
  'How-To':    'text-green-600 bg-green-50',
  Seasonal:    'text-cyan-600 bg-cyan-50',
  Pricing:     'text-violet-600 bg-violet-50',
};

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
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${categoryColors[post.category] || 'text-primary-600 bg-primary-50'}`}>
                    {post.category}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto">{post.readTime} read</span>
                </div>
                <h2 className="text-lg font-bold text-dark mb-3 group-hover:text-primary-600 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={12} /> {post.date}
                  </div>
                  <button className="flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:gap-2.5 transition-all">
                    Read More <ArrowRight size={16} />
                  </button>
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
