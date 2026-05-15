import { Shield, Zap, Star, Users, CheckCircle, ArrowRight, MapPin, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

const AboutUs = () => {
  const { t, language } = useLanguage();

  const stats = [
    { emoji: '👷', value: '500+',  label: t('verifiedWorkers'),  color: 'text-primary-600',   bg: 'bg-primary-50' },
    { emoji: '😊', value: '10k+', label: t('happyCustomers'),    color: 'text-secondary-600', bg: 'bg-secondary-50' },
    { emoji: '🛠️', value: '9',    label: t('servicesOffered'),   color: 'text-accent-600',    bg: 'bg-accent-50' },
    { emoji: '🏙️', value: '12',   label: t('citiesCovered'),     color: 'text-pink-600',      bg: 'bg-pink-50' },
  ];

  const values = [
    {
      emoji: '🛡️', icon: Shield,
      title: t('trustSafety'),
      desc: t('trustSafetyDesc'),
      color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100',
    },
    {
      emoji: '⭐', icon: Zap,
      title: t('qualityService'),
      desc: t('qualityServiceDesc'),
      color: 'text-secondary-600', bg: 'bg-secondary-50', border: 'border-secondary-100',
    },
    {
      emoji: '💡', icon: Star,
      title: t('transparency'),
      desc: t('transparencyDesc'),
      color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-100',
    },
  ];

  const milestones = [
    { year: '2024', emoji: '🚀', title: language === 'ur' ? 'پلیٹ فارم لانچ' : 'Platform Launch', desc: language === 'ur' ? 'سروس ناک نے پاکستان میں اپنی خدمات شروع کیں' : 'Service Knock launched its operations across Pakistan.' },
    { year: '2024', emoji: '✅', title: language === 'ur' ? 'پہلے 100 ورکرز تصدیق شدہ' : 'First 100 Workers Verified', desc: language === 'ur' ? 'شناختی کارڈ تصدیق کا لازمی نظام نافذ کیا' : 'Mandatory CNIC verification system implemented for all workers.' },
    { year: '2025', emoji: '🏆', title: language === 'ur' ? '1000+ مکمل کام' : '1,000+ Jobs Completed', desc: language === 'ur' ? 'صارفین نے ہمارے پلیٹ فارم پر بھروسہ کیا' : 'Customers across Pakistan trusted us to deliver quality services.' },
    { year: '2025', emoji: '🌐', title: language === 'ur' ? '12 شہروں میں توسیع' : 'Expanded to 12 Cities', desc: language === 'ur' ? 'کراچی، لاہور، اسلام آباد سمیت بڑے شہروں میں دستیاب' : 'Now serving Karachi, Lahore, Islamabad, and 9 more major cities.' },
  ];

  return (
    <div className={`animate-fade-in bg-white min-h-screen ${language === 'ur' ? 'text-right' : ''}`}>
      <SEO
        title="About Us — Pakistan's Trusted Home Services Platform"
        description="Learn about Service Knock — Pakistan's leading platform connecting homeowners with CNIC-verified electricians, plumbers, AC technicians, carpenters and painters. Our mission is safe, affordable, and reliable home services."
        keywords="about Service Knock, Pakistan home services company, trusted workers Pakistan, verified electricians Pakistan, home services platform Pakistan"
        canonical="/about"
      />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-8">
            <MapPin size={14} className="text-accent-400" />
            {language === 'ur' ? 'پاکستان کا بھروسہ مند سروس پلیٹ فارم' : 'Pakistan\'s Trusted Home Service Platform'}
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight">
            {t('aboutHeroTitle')}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('aboutHeroSubtitle')}
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 bg-white border-b border-slate-100 shadow-sm">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ emoji, value, label, color, bg }) => (
              <div key={label} className="flex flex-col items-center text-center group">
                <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                  {emoji}
                </div>
                <p className={`text-3xl font-extrabold ${color} mb-1`}>{value}</p>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-24 bg-surface">
        <div className="page-container">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-16">

            {/* Left: Story text */}
            <div className="flex-1 space-y-6">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full">
                {language === 'ur' ? 'ہماری کہانی' : 'Our Story'}
              </span>
              <h2 className="text-3xl font-extrabold text-dark leading-snug">{t('builtModernHome')}</h2>
              <p className="text-slate-600 leading-relaxed">{t('modernHomeDesc')}</p>
              <p className="text-slate-600 leading-relaxed">
                {language === 'ur'
                  ? 'ہم نے محسوس کیا کہ پاکستان میں گھریلو کاریگر تلاش کرنا بہت مشکل کام ہے — لوگ دوستوں اور فون نمبروں پر انحصار کرتے ہیں جن پر بھروسہ نہیں ہوتا۔ سروس ناک اس مسئلے کا حل ہے۔'
                  : 'We saw that finding reliable home service workers in Pakistan was unnecessarily hard — people relied on word-of-mouth referrals with no accountability. Service Knock is the solution: a verified, reviewed, and trusted marketplace that puts skilled professionals one tap away.'}
              </p>
              <ul className="space-y-4 pt-2">
                {[t('support247'), t('qualityGuarantee'), language === 'ur' ? 'شناختی کارڈ سے تصدیق شدہ ورکرز' : 'Mandatory CNIC-verified professionals'].map(item => (
                  <li key={item} className="flex items-center gap-3 font-semibold text-dark">
                    <CheckCircle className="text-secondary-500 shrink-0" size={20} /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/register"
                className="inline-flex items-center gap-2 btn-primary mt-4">
                {language === 'ur' && <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />}
                {language === 'ur' ? 'ابھی شامل ہوں' : 'Join Service Knock Today'}
                {language !== 'ur' && <ArrowRight size={16} />}
              </Link>
            </div>

            {/* Right: Image */}
            <div className="flex-1">
              <div className="relative">
                <img
                  src="/about-us.jpg"
                  alt="Professional home service worker"
                  className="rounded-3xl shadow-2xl w-full object-cover"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100">
                  <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center text-white">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{language === 'ur' ? 'اوسط ریٹنگ' : 'Avg. Rating'}</p>
                    <p className="font-extrabold text-dark flex items-center gap-1">
                      4.8 <Star size={12} className="text-accent-500 fill-accent-500" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-600 bg-accent-50 px-4 py-1.5 rounded-full mb-3">
              {language === 'ur' ? 'ہماری اقدار' : 'What We Stand For'}
            </span>
            <h2 className="text-3xl font-extrabold text-dark mb-4">{t('ourCoreValues')}</h2>
            <p className="text-slate-500 max-w-xl mx-auto">{t('coreValuesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map(({ emoji, icon: Icon, title, desc, color, bg, border }) => (
              <div key={title} className={`card border ${border} p-8 hover:shadow-xl transition-all duration-300 group text-center`}>
                <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                  {emoji}
                </div>
                <h3 className={`text-xl font-extrabold ${color} mb-3`}>{title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Milestones / Timeline ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="page-container relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-400 bg-white/10 px-4 py-1.5 rounded-full mb-3">
              {language === 'ur' ? 'ہمارا سفر' : 'Our Journey'}
            </span>
            <h2 className="text-3xl font-extrabold text-white mb-3">
              {language === 'ur' ? 'سروس ناک کا سفر' : 'Building Trust, One Job at a Time'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {milestones.map(({ year, emoji, title, desc }) => (
              <div key={title} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">{emoji}</div>
                <p className="text-xs font-bold text-accent-400 uppercase tracking-widest mb-1">{year}</p>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="page-container text-center max-w-2xl mx-auto">
          <Heart size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-dark mb-3">
            {language === 'ur' ? 'ہمارے ساتھ سفر شروع کریں' : 'Be Part of Our Mission'}
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {language === 'ur'
              ? 'چاہے آپ گھر کے مالک ہوں یا ماہر کاریگر — سروس ناک آپ کو صحیح جگہ پہنچاتا ہے۔'
              : 'Whether you\'re a homeowner looking for reliable help or a skilled professional looking for work — Service Knock connects you with the right people.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 btn-primary py-3.5 px-8 text-base">
              {language === 'ur' && <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />}
              {language === 'ur' ? 'گاہک کے طور پر شامل ہوں' : 'Book a Service'}
              {language !== 'ur' && <ArrowRight size={18} />}
            </Link>
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 btn-outline py-3.5 px-8 text-base">
              <Users size={18} />
              {language === 'ur' ? 'ورکر کے طور پر شامل ہوں' : 'Join as a Worker'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
