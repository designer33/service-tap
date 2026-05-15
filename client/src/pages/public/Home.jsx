import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SEO from '../../components/SEO';
import {
  Zap, Wrench, Wind, Star, Shield, Clock, ChevronRight,
  CheckCircle, ArrowRight, Users, Briefcase, TrendingUp,
  Hammer, MapPin, Paintbrush, Building2, HardHat, Layers
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const Home = () => {
  const { t, language } = useLanguage();
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    api.get('/bookings/recent-completed')
      .then(({ data }) => setRecentJobs(data.bookings))
      .catch(() => {});
  }, []);

  const services = [
    { emoji: '⚡', icon: Zap,       label: t('electrician'),    color: 'from-amber-400 to-orange-500',  bg: 'bg-amber-50',   text: 'text-amber-600',  border: 'border-amber-100' },
    { emoji: '🔧', icon: Wrench,    label: t('plumber'),        color: 'from-blue-400 to-blue-600',     bg: 'bg-blue-50',    text: 'text-blue-600',   border: 'border-blue-100' },
    { emoji: '❄️', icon: Wind,      label: t('ac_fridge_repair'),color: 'from-cyan-400 to-sky-600',    bg: 'bg-cyan-50',    text: 'text-cyan-600',   border: 'border-cyan-100' },
    { emoji: '🔨', icon: Hammer,    label: t('carpenter'),      color: 'from-orange-400 to-red-500',    bg: 'bg-orange-50',  text: 'text-orange-600', border: 'border-orange-100' },
    { emoji: '🎨', icon: Paintbrush,label: t('painter'),        color: 'from-pink-400 to-rose-500',     bg: 'bg-pink-50',    text: 'text-pink-600',   border: 'border-pink-100' },
    { emoji: '🧱', icon: Building2, label: t('mason'),          color: 'from-slate-400 to-slate-600',   bg: 'bg-slate-50',   text: 'text-slate-600',  border: 'border-slate-200' },
  ];

  const steps = [
    { step: '01', emoji: '📋', title: t('pickAService'),   desc: t('pickAServiceDesc') },
    { step: '02', emoji: '📝', title: t('submitRequest'),  desc: t('submitRequestDesc') },
    { step: '03', emoji: '✅', title: t('jobDone'),        desc: t('jobDoneDesc') },
  ];

  const stats = [
    { icon: Users,      value: '10,000+', label: t('happyCustomersLabel'),  color: 'text-primary-600',   bg: 'bg-primary-50' },
    { icon: Briefcase,  value: '25,000+', label: t('jobsCompletedLabel'),   color: 'text-secondary-600', bg: 'bg-secondary-50' },
    { icon: Star,       value: '4.8 / 5', label: t('avgRatingLabel'),       color: 'text-accent-600',    bg: 'bg-accent-50' },
    { icon: TrendingUp, value: '99%',     label: t('satisfactionRateLabel'),color: 'text-pink-600',      bg: 'bg-pink-50' },
  ];

  const testimonials = [
    { name: t('saraKhan'),      role: t('homeowner'),       rating: 5, text: t('saraTestimonial'),  avatar: 'bg-pink-500' },
    { name: t('aliHaider'),     role: t('businessOwner'),   rating: 5, text: t('aliTestimonial'),   avatar: 'bg-primary-500' },
    { name: t('asimIqbal'),     role: t('apartmentTenant'), rating: 5, text: t('asimTestimonial'),  avatar: 'bg-teal-500' },
    { name: t('bilalSiddiqui'), role: t('interiorDesigner'),rating: 5, text: t('bilalTestimonial'), avatar: 'bg-orange-500' },
    { name: t('maryamJaved'),   role: t('doctor'),          rating: 5, text: t('maryamTestimonial'),avatar: 'bg-violet-500' },
    { name: t('zainabRaza'),    role: t('teacher'),         rating: 5, text: t('zainabTestimonial'),avatar: 'bg-secondary-500' },
  ];

  return (
    <div className="animate-fade-in">
      <SEO
        title="Book Trusted Home Services in Pakistan — Electrician, Plumber, AC Repair"
        description="Service Knock is Pakistan's #1 home services platform. Book CNIC-verified electricians, plumbers, AC technicians, carpenters, painters and more in Lahore, Karachi, Islamabad, Rawalpindi, and across Pakistan. Fast, safe, affordable."
        keywords="home services Pakistan, electrician Lahore, plumber Karachi, AC repair Islamabad, carpenter Pakistan, painter near me, home repair Pakistan, book electrician online, verified workers Pakistan, Service Knock"
        canonical="/"
      />

      {/* ── Hero ── */}
      <section className="hero-gradient text-white relative overflow-hidden min-h-[600px]">
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl translate-y-1/2" />

        <div className="page-container py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Left: Text Content ── */}
            <div className={language === 'ur' ? 'text-right order-2 lg:order-2' : 'order-1'}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-8 shadow-lg">
                <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
                {t('fastBooking')}
              </div>

              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 tracking-tight ${language === 'ur' ? 'hero-h1' : 'leading-[1.1]'}`}>
                {t('heroTitleMain')}<br />
                <span className="text-yellow-300 drop-shadow-sm block mt-2">
                  {t('heroTitleSub')}
                </span>
              </h1>

              <p className="text-lg text-blue-100 mb-8 max-w-lg leading-relaxed">
                {t('heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 text-base">
                  {language === 'ur' && <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />}
                  {t('bookService')}
                  {language !== 'ur' && <ArrowRight size={18} />}
                </Link>
                <Link to="/services"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/70 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm">
                  {language === 'ur' && <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />}
                  {t('services')}
                  {language !== 'ur' && <ChevronRight size={18} />}
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-5 mt-10 text-sm text-blue-200">
                {[t('verifiedWorkersShort'), t('ratedReviewed'), t('fastResponse')].map(label => (
                  <span key={label} className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-secondary-400" /> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right: Worker Image + Floating Cards ── */}
            <div className={`relative ${language === 'ur' ? 'order-1 lg:order-1' : 'order-2'}`}>
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/hero.jpg"
                  alt="Professional home service worker"
                  className="w-full h-[420px] object-cover object-center"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />

                {/* Bottom label inside image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3">
                  <div className="w-9 h-9 bg-secondary-500 rounded-xl flex items-center justify-center text-white text-lg shrink-0">✅</div>
                  <div>
                    <p className="text-white text-xs font-bold">
                      {language === 'ur' ? 'تصدیق شدہ پیشہ ور' : 'CNIC-Verified Professional'}
                    </p>
                    <p className="text-blue-200 text-[11px]">
                      {language === 'ur' ? 'ہر ورکر شناختی کارڈ سے تصدیق شدہ ہے' : 'Every worker is identity-verified before joining'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating card — top left */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-2xl p-3.5 flex items-center gap-3 border border-slate-100 min-w-[160px]">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl shrink-0">⚡</div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">{language === 'ur' ? 'فعال ورکرز' : 'Active Workers'}</p>
                  <p className="font-extrabold text-dark text-sm">500+</p>
                </div>
              </div>

              {/* Floating card — right side */}
              <div className="absolute -right-4 top-1/3 bg-white rounded-2xl shadow-2xl p-3.5 flex items-center gap-3 border border-slate-100 min-w-[160px]">
                <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center text-xl shrink-0">⭐</div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">{language === 'ur' ? 'اوسط ریٹنگ' : 'Avg. Rating'}</p>
                  <p className="font-extrabold text-dark text-sm">4.8 / 5</p>
                </div>
              </div>

              {/* Floating card — bottom right */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-2xl p-3.5 flex items-center gap-3 border border-slate-100 min-w-[160px]">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-xl shrink-0">🏠</div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">{language === 'ur' ? 'مکمل کام' : 'Jobs Done'}</p>
                  <p className="font-extrabold text-dark text-sm">25,000+</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-slate-100 shadow-sm">
        <div className="page-container py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label, color, bg }) => (
              <div key={label} className="flex flex-col items-center text-center group">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={color} />
                </div>
                <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                <p className="text-sm text-slate-500 mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Services ── */}
      <section className="bg-surface py-24">
        <div className="page-container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mb-3">
              {language === 'ur' ? 'ہماری خدمات' : 'What We Offer'}
            </span>
            <h2 className="section-title">{t('ourServices')}</h2>
            <p className="section-subtitle max-w-xl mx-auto">{t('servicesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {services.map(({ emoji, icon: Icon, label, color, bg, text, border }) => (
              <Link to="/register" key={label}
                className={`group card border ${border} flex flex-col items-center text-center py-6 px-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                {/* Gradient icon circle */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{emoji}</span>
                </div>
                <h3 className={`font-bold text-dark text-xs leading-tight`}>{label}</h3>
                <span className={`mt-2 text-[10px] font-semibold ${text} group-hover:underline`}>
                  {t('bookNow')}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm">
              {language === 'ur' && <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />}
              {language === 'ur' ? 'تمام خدمات دیکھیں' : 'View all services in detail'}
              {language !== 'ur' && <ChevronRight size={16} />}
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-secondary-600 bg-secondary-50 px-4 py-1.5 rounded-full mb-3">
              {language === 'ur' ? 'عمل' : 'The Process'}
            </span>
            <h2 className="section-title">{t('howItWorks')}</h2>
            <p className="section-subtitle">{t('threeSteps')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-200 via-secondary-300 to-primary-200" />

            {steps.map(({ step, emoji, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center relative group">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex flex-col items-center justify-center shadow-xl mb-5 z-10 group-hover:scale-105 transition-transform">
                  <span className="text-2xl mb-0.5">{emoji}</span>
                  <span className="text-[10px] font-black tracking-widest opacity-70">{step}</span>
                </div>
                <h3 className="font-bold text-dark mb-2 text-lg">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recently Completed Jobs ── */}
      {recentJobs.length > 0 && (
        <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -ml-48 -mb-48" />

          <div className="page-container relative z-10">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-400 bg-white/10 px-4 py-1.5 rounded-full mb-3">
                {language === 'ur' ? 'حالیہ کام' : 'Live Activity'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {language === 'ur' ? 'حالیہ مکمل شدہ کام' : 'Recently Completed Jobs'}
              </h2>
              <p className="text-primary-100/70 max-w-xl mx-auto">
                {language === 'ur'
                  ? 'ہمارے ماہرین کے ذریعے کامیابی سے مکمل کیے گئے کچھ کام'
                  : 'Real jobs from real customers — see what our verified professionals are delivering every day.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentJobs.map((job) => (
                <div key={job._id}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80 bg-primary-500/30 px-3 py-1 rounded-full border border-white/10">
                      {t(job.serviceType)}
                    </span>
                    <div className="flex items-center gap-1 text-accent-400">
                      <Star size={13} className="fill-accent-400" />
                      <span className="text-xs font-bold">{job.workerId?.rating || 5.0}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2 line-clamp-1 group-hover:text-secondary-300 transition-colors">{job.title}</h3>
                  <p className="text-xs text-primary-100/60 mb-4 line-clamp-2 leading-relaxed">{job.issueDescription}</p>
                  <div className="flex items-center gap-1.5 text-primary-300/50 text-[10px] mb-5">
                    <MapPin size={11} className="text-primary-400 shrink-0" />
                    <span className="truncate">{job.address}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-primary-800 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">C</div>
                      <div className="w-8 h-8 rounded-full border-2 border-primary-800 bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white">W</div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-secondary-400">Rs. {formatCurrency(job.priceEstimate)}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-wide">{formatDate(job.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/register"
                className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-8 py-3.5 rounded-full font-bold transition-all border border-white/20 group">
                {language === 'ur' ? 'ابھی شروع کریں' : 'Join the Community'}
                {language !== 'ur' && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section className="bg-slate-50 py-24">
        <div className="page-container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              {language === 'ur' ? 'آراء' : 'Customer Stories'}
            </span>
            <h2 className="section-title">{t('whatCustomersSay')}</h2>
            <p className="section-subtitle">{t('trustedHomeowners')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text, avatar }) => (
              <div key={name} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                {/* Quote mark decoration */}
                <div className="absolute top-4 right-5 text-6xl font-serif text-slate-100 leading-none select-none">"</div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-accent-500 fill-accent-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic relative z-10">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className={`w-10 h-10 ${avatar} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-white py-20">
        <div className="page-container">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { emoji: '🛡️', icon: Shield, title: t('trustSafety'),    desc: t('trustSafetyDesc'),    color: 'text-primary-600', bg: 'bg-primary-50' },
              { emoji: '⚡', icon: Zap,    title: t('fastResponse'),    desc: t('fastResponseDesc'),   color: 'text-amber-600',   bg: 'bg-amber-50' },
              { emoji: '⭐', icon: Star,   title: t('ratedReviewed'),   desc: t('ratedReviewedDesc'), color: 'text-accent-600',  bg: 'bg-accent-50' },
            ].map(({ emoji, icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="flex flex-col items-center group">
                <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{emoji}</span>
                </div>
                <h3 className={`font-bold ${color} mb-2`}>{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="page-container text-center text-white relative z-10">
          <div className="text-5xl mb-5">🏠</div>
          <h2 className="text-4xl font-extrabold mb-4">{t('readyToStart')}</h2>
          <p className="text-blue-100 mb-10 max-w-lg mx-auto text-lg">{t('ctaBannerDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-blue-50 font-bold px-10 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5 text-base">
              {language === 'ur' && <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />}
              {t('getStarted')}
              {language !== 'ur' && <ArrowRight size={18} />}
            </Link>
            <Link to="/services"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-10 py-4 rounded-2xl transition-all text-base">
              {language !== 'ur' && <Clock size={18} />}
              {language === 'ur' ? 'خدمات دیکھیں' : 'Explore Services'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
