import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "10 Tips to Maintain Your AC During Summer",
    excerpt: "Learn how to keep your cooling system efficient and save on electricity bills during the peak summer months.",
    image: "https://images.unsplash.com/photo-1599939575322-780fcf2f42d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Technical Team",
    date: "May 10, 2026",
    category: "Maintenance"
  },
  {
    id: 2,
    title: "When to Call a Professional Plumber?",
    excerpt: "Some issues are simple, but others need experts. Here are 5 signs you should never DIY your plumbing.",
    image: "https://images.unsplash.com/photo-1581244276891-83393a6b2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Professional Plumber",
    date: "May 05, 2026",
    category: "Guides"
  },
  {
    id: 3,
    title: "Safety First: Basic Electrical Safety for Homes",
    excerpt: "Electrical faults are the leading cause of home fires. Follow these safety protocols to protect your family.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Safety Expert",
    date: "April 28, 2026",
    category: "Safety"
  },
  {
    id: 4,
    title: "Choosing the Right Paint for Your Living Room",
    excerpt: "Color psychology and durability matter. Our guide helps you pick the perfect finish for your interior walls.",
    image: "https://images.unsplash.com/photo-1589939705384-5185138a04b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    author: "Interior Designer",
    date: "April 20, 2026",
    category: "Interior"
  }
];

const Blog = () => {
  return (
    <div className="animate-fade-in bg-surface min-h-screen py-16">
      <div className="page-container">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-dark mb-3">Our Blog</h1>
          <p className="text-slate-500 max-w-xl mx-auto">Expert tips, home maintenance guides, and company news.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="card group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-dark mb-3 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
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
      </div>
    </div>
  );
};

export default Blog;
