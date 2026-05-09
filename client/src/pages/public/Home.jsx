import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Zap, Wrench, Wind, Star, Shield, Clock, ChevronRight,
  CheckCircle, ArrowRight, Users, Briefcase, TrendingUp, Hammer, MapPin
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
      .catch(err => console.error('Failed to load recent jobs:', err));
  }, []);

  const services = [
    { icon: Zap, label: t('electrician'), color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    { icon: Wrench, label: t('plumber'), color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { icon: Wind, label: t('ac_repair'), color: 'bg-primary-50 text-primary-600', border: 'border-primary-100' },
    { icon: Hammer, label: t('carpenter'), color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
  ];

  const steps = [
    { step: '01', title: t('pickAService'), desc: t('pickAServiceDesc') },
    { step: '02', title: t('submitRequest'), desc: t('submitRequestDesc') },
    { step: '03', title: t('jobDone'), desc: t('jobDoneDesc') },
  ];

  const stats = [
    { icon: Users, value: '5,000+', label: t('happyCustomersLabel') },
    { icon: Briefcase, value: '1,200+', label: t('jobsCompletedLabel') },
    { icon: Star, value: '4.8/5', label: t('avgRatingLabel') },
    { icon: TrendingUp, value: '99%', label: t('satisfactionRateLabel') },
  ];

  const testimonials = [
    { name: t('saraKhan'), role: t('homeowner'), rating: 5, text: t('saraTestimonial') },
    { name: t('aliHaider'), role: t('businessOwner'), rating: 5, text: t('aliTestimonial') },
    { name: t('asimIqbal'), role: t('apartmentTenant'), rating: 5, text: t('asimTestimonial') },
    { name: t('bilalSiddiqui'), role: t('interiorDesigner'), rating: 5, text: t('bilalTestimonial') },
    { name: t('maryamJaved'), role: t('doctor'), rating: 5, text: t('maryamTestimonial') },
    { name: t('zainabRaza'), role: t('teacher'), rating: 5, text: t('zainabTestimonial') },
  ];

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="page-container py-24 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap size={14} className="text-accent-400" />
              {t('fastBooking')}
            </div>
            <h1 
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${language === 'ur' ? 'hero-h1' : 'leading-tight'}`}
            >
              {language === 'ur' ? (
                <>{t('heroTitleMain')}<br /><span className="text-accent-400">{t('heroTitleSub')}</span></>
              ) : (
                <>{t('heroTitleMain')}<br /><span className="text-accent-400">{t('heroTitleSub')}</span></>
              )}
            </h1>
            <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary py-3.5 px-8 bg-white text-primary-700 hover:bg-blue-50 shadow-lg">
                {language === 'ur' && <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />}
                {t('bookService')}
                {language !== 'ur' && <ArrowRight size={18} />}
              </Link>
              <Link to="/services" className="btn-outline border-white/40 hover:border-white text-white hover:bg-white/10 py-3.5 px-8">
                {language === 'ur' && <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />}
                {t('services')}
                {language !== 'ur' && <ChevronRight size={18} />}
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-blue-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className={`text-secondary-400 ${language === 'ur' ? 'mt-2' : ''}`} /> 
                {t('verifiedWorkersShort')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className={`text-secondary-400 ${language === 'ur' ? 'mt-2' : ''}`} /> 
                {t('ratedReviewed')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className={`text-secondary-400 ${language === 'ur' ? 'mt-2' : ''}`} /> 
                {t('fastResponse')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="page-container py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl mb-3">
                  <Icon size={22} className="text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-dark">{value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="bg-surface py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('ourServices')}</h2>
            <p className="section-subtitle">{t('servicesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map(({ icon: Icon, label, color, border }) => (
              <Link to="/register" key={label}
                className={`card-hover border ${border} flex flex-col items-center text-center group`}>
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={30} />
                </div>
                <h3 className="font-bold text-dark text-lg mb-1">{label}</h3>
                <span className="mt-4 inline-flex items-center gap-1 text-primary-600 text-sm font-semibold group-hover:gap-2 transition-all">
                  {t('bookNow')} 
                  <ChevronRight 
                    size={15} 
                    style={language === 'ur' ? { marginTop: '10px', transform: 'rotate(180deg)' } : {}} 
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-20">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="section-title">{t('howItWorks')}</h2>
            <p className="section-subtitle">{t('threeSteps')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-secondary-300" />
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xl flex items-center justify-center shadow-lg mb-4 z-10">
                  {step}
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recently Completed Jobs ── */}
      {recentJobs.length > 0 && (
        <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 py-24 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -ml-48 -mb-48" />
          
          <div className="page-container relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {language === 'ur' ? 'حالیہ مکمل شدہ کام' : 'Recently Completed Jobs'}
              </h2>
              <div className="w-20 h-1.5 bg-accent-400 mx-auto rounded-full mb-6" />
              <p className="text-primary-100 max-w-2xl mx-auto">
                {language === 'ur' ? 'ہمارے ماہرین کے ذریعے کامیابی سے مکمل کیے گئے کچھ کام' : 'Real success stories from our platform — see what our experts are delivering right now.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentJobs.map((job) => (
                <div key={job._id} className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col h-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-primary-500/40 px-3 py-1.5 rounded-full shadow-inner backdrop-blur-sm border border-white/10">
                      {t(job.serviceType)}
                    </span>
                    <div className="flex items-center gap-1 text-accent-400">
                      <Star size={14} className="fill-accent-400" />
                      <span className="text-xs font-bold">{job.workerId?.rating || 5.0}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-white text-base mb-2 line-clamp-1 group-hover:text-secondary-300 transition-colors">{job.title}</h3>
                  <p className="text-[11px] text-primary-100/70 mb-4 line-clamp-2 leading-relaxed h-8">
                    {job.issueDescription}
                  </p>
                  
                  <div className="flex items-center gap-2 text-primary-200/50 text-[10px] mb-6">
                    <MapPin size={12} className="shrink-0 text-primary-400" />
                    <span className="truncate">{job.address}</span>
                  </div>

                  <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-3">
                      <div className="w-9 h-9 rounded-full border-2 border-primary-800 bg-slate-800 overflow-hidden shadow-lg" title={job.customerId?.name}>
                        {job.customerId?.profilePic ? (
                          <img src={job.customerId.profilePic} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-100">C</div>
                        )}
                      </div>
                      <div className="w-9 h-9 rounded-full border-2 border-primary-800 bg-primary-500 overflow-hidden shadow-lg" title={job.workerId?.userId?.name}>
                        {job.workerId?.userId?.profilePic ? (
                          <img src={job.workerId.userId.profilePic} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white">W</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-secondary-400">Rs.{formatCurrency(job.priceEstimate)}</p>
                      <p className="text-[10px] text-white/70 font-medium uppercase tracking-tighter">{formatDate(job.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/register" className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-8 py-3.5 rounded-full font-bold transition-all border border-white/10 group">
                {language === 'ur' ? 'ابھی شروع کریں' : 'Join the Community'} 
                {language === 'ur' && <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />}
                {language !== 'ur' && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="bg-slate-50 py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('whatCustomersSay')}</h2>
            <p className="section-subtitle">{t('trustedHomeowners')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="card">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={15} className="text-accent-500 fill-accent-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="hero-gradient py-16">
        <div className="page-container text-center text-white">
          <Shield size={40} className="mx-auto mb-4 text-accent-400" />
          <h2 className="text-3xl font-bold mb-3">{t('readyToStart')}</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">{t('ctaBannerDesc')}</p>
          <Link to="/register"
            className="btn-primary py-3.5 px-8 bg-white text-primary-700 hover:bg-blue-50 shadow-lg">
            {language === 'ur' && <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />}
            {t('getStarted')}
            {language !== 'ur' && <ArrowRight size={18} />}
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
