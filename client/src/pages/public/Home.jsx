import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SEO from '../../components/SEO';
import {
  Zap, Wrench, Wind, Star, Shield, Clock, ChevronRight,
  CheckCircle, ArrowRight, Users, Briefcase, TrendingUp,
  Hammer, MapPin, Paintbrush, Building2
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
    { emoji: '⚡', icon: Zap,       label: t('electrician'),     color: 'from-amber-400 to-orange-500',  bg: 'bg-amber-50',   text: 'text-amber-600',  border: 'border-amber-100' },
    { emoji: '🔧', icon: Wrench,    label: t('plumber'),         color: 'from-blue-400 to-blue-600',     bg: 'bg-blue-50',    text: 'text-blue-600',   border: 'border-blue-100' },
    { emoji: '❄️', icon: Wind,      label: t('ac_fridge_repair'), color: 'from-cyan-400 to-sky-600',    bg: 'bg-cyan-50',    text: 'text-cyan-600',   border: 'border-cyan-100' },
    { emoji: '🔨', icon: Hammer,    label: t('carpenter'),       color: 'from-orange-400 to-red-500',    bg: 'bg-orange-50',  text: 'text-orange-600', border: 'border-orange-100' },
    { emoji: '🎨', icon: Paintbrush,label: t('painter'),         color: 'from-pink-400 to-rose-500',     bg: 'bg-pink-50',    text: 'text-pink-600',   border: 'border-pink-100' },
    { emoji: '🧱', icon: Building2, label: t('mason'),           color: 'from-slate-400 to-slate-600',   bg: 'bg-slate-50',   text: 'text-slate-600',  border: 'border-slate-200' },
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

      {/* ── Google Reviews ── */}
      <section className="bg-slate-50 py-24">
        <div className="page-container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              {language === 'ur' ? 'آراء' : 'Customer Stories'}
            </span>
            <h2 className="section-title">{t('whatCustomersSay')}</h2>
            <p className="section-subtitle">{t('trustedHomeowners')}</p>
          </div>

          {/* Rating summary bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4">
              {/* Google G logo */}
              <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm font-bold text-dark mt-0.5">4.8 <span className="font-normal text-slate-500">on Google</span></p>
              </div>
            </div>
            <a href="https://g.page/r/CXx_qOJJIYItEAI/review" target="_blank" rel="noopener noreferrer"
              className="text-sm text-primary-600 font-semibold hover:underline">
              Leave a Review ↗
            </a>
          </div>

          {/* 4 Review cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Muhammad Asif',
                initial: 'MA',
                color: 'bg-blue-500',
                date: '2 weeks ago',
                text: 'Booked an electrician through Service Knock and he arrived within 40 minutes. Very professional, fixed the wiring issue and explained everything clearly. CNIC verification gave me full confidence. Highly recommended!',
                stars: 5,
              },
              {
                name: 'Ayesha Tariq',
                initial: 'AT',
                color: 'bg-pink-500',
                date: '1 month ago',
                text: 'Excellent service! The AC technician was on time, polite, and very skilled. He topped up the gas and cleaned the unit thoroughly. The price was exactly what was quoted — no hidden charges at all.',
                stars: 5,
              },
              {
                name: 'Usman Farooq',
                initial: 'UF',
                color: 'bg-green-500',
                date: '1 month ago',
                text: 'Got a plumber booked in under 10 minutes. The app is very easy to use. Worker was verified and did a great job fixing a burst pipe. Service Knock is the best platform for home services in Lahore.',
                stars: 5,
              },
              {
                name: 'Sadia Noor',
                initial: 'SN',
                color: 'bg-purple-500',
                date: '3 weeks ago',
                text: 'I have used Service Knock twice now — once for a carpenter and once for a painter. Both times the workers were professional and the work quality was excellent. Will definitely keep using this service!',
                stars: 5,
              },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${r.color} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {r.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm leading-tight">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.date}</p>
                    </div>
                  </div>
                  {/* Google icon */}
                  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </div>
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(r.stars)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                {/* Review text */}
                <p className="text-sm text-slate-600 leading-relaxed flex-1">"{r.text}"</p>
                {/* Posted on Google */}
                <p className="text-xs text-slate-400 font-medium">Posted on Google</p>
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
