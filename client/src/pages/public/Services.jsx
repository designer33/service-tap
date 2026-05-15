import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, Star, Clock, Shield, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

const Services = () => {
  const { t, language } = useLanguage();

  const services = [
    {
      emoji: '⚡', slug: 'electrician',
      label: t('electrician'),
      desc: t('electricianDesc'),
      gradient: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700',
      features: [t('faultDiagnosis'), t('wiringRewiring'), t('panelUpgrades'), t('lightFixtures'), t('safetyInspections')],
      avgTime: language === 'ur' ? '2 گھنٹے سے کم' : '< 2 hrs', rating: '4.9',
    },
    {
      emoji: '🔧', slug: 'plumber',
      label: t('plumber'),
      desc: t('plumberDesc'),
      gradient: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700',
      features: [t('leakRepairs'), t('drainCleaning'), t('pipeInstallation'), t('waterHeater'), t('tapReplacement')],
      avgTime: language === 'ur' ? '3 گھنٹے سے کم' : '< 3 hrs', rating: '4.8',
    },
    {
      emoji: '❄️', slug: 'ac_fridge_repair',
      label: t('ac_fridge_repair'),
      desc: t('acFridgeDesc'),
      gradient: 'from-cyan-400 to-sky-600',
      bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700',
      features: [t('deepCleaning'), t('gasRefilling'), t('installation'), t('fridgeRepair'), t('annualService')],
      avgTime: language === 'ur' ? '4 گھنٹے سے کم' : '< 4 hrs', rating: '4.7',
    },
    {
      emoji: '🔨', slug: 'carpenter',
      label: t('carpenter'),
      desc: t('carpenterDesc'),
      gradient: 'from-orange-400 to-red-500',
      bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700',
      features: [t('furnitureRepair'), t('doorWindowFix'), t('customWoodwork'), t('lockInstallation'), t('assembly')],
      avgTime: language === 'ur' ? '5 گھنٹے سے کم' : '< 5 hrs', rating: '4.8',
    },
    {
      emoji: '🎨', slug: 'painter',
      label: t('painter'),
      desc: t('painterDesc'),
      gradient: 'from-pink-400 to-rose-500',
      bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', badge: 'bg-pink-100 text-pink-700',
      features: [t('interiorPainting'), t('exteriorPainting'), t('wallPutty'), t('waterproofing'), t('stencilWork')],
      avgTime: language === 'ur' ? '1-2 دن' : '1–2 days', rating: '4.9',
    },
    {
      emoji: '🧱', slug: 'mason',
      label: t('mason'),
      desc: t('masonDesc'),
      gradient: 'from-slate-400 to-slate-600',
      bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-700',
      features: [t('brickwork'), t('plastering'), t('wallRepair'), t('concreteWork'), t('demolition')],
      avgTime: language === 'ur' ? 'مختلف' : 'Varies', rating: '4.6',
    },
    {
      emoji: '🏗️', slug: 'steel_fixer',
      label: t('steel_fixer'),
      desc: t('steelFixerDesc'),
      gradient: 'from-gray-500 to-gray-700',
      bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-700',
      features: [t('steelBending'), t('rebarFixing'), t('slabReinforcement'), t('meshWork'), t('welding')],
      avgTime: language === 'ur' ? 'مختلف' : 'Varies', rating: '4.7',
    },
    {
      emoji: '👷', slug: 'labour',
      label: t('labour'),
      desc: t('labourDesc'),
      gradient: 'from-teal-400 to-teal-600',
      bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-700',
      features: [t('generalHelp'), t('loadingUnloading'), t('debrisRemoval'), t('siteCleaning'), t('packing')],
      avgTime: language === 'ur' ? '1 دن سے کم' : '< 1 day', rating: '4.5',
    },
    {
      emoji: '🟦', slug: 'tile_fixer',
      label: t('tile_fixer'),
      desc: t('tileFixerDesc'),
      gradient: 'from-indigo-400 to-violet-600',
      bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700',
      features: [t('floorTiling'), t('wallTiling'), t('grouting'), t('tileReplacement'), t('graniteWork')],
      avgTime: language === 'ur' ? '1-2 دن' : '1–2 days', rating: '4.8',
    },
  ];

  return (
    <div className="animate-fade-in">
      <SEO
        title="Home Services in Pakistan — Electrician, Plumber, AC, Carpenter, Painter"
        description="Browse all home services available on Service Knock. Book verified electricians, plumbers, AC & fridge technicians, carpenters, painters, masons, tile fixers and more across Pakistan."
        keywords="electrician service Pakistan, plumber service Pakistan, AC repair Pakistan, carpenter Pakistan, painter Pakistan, mason Pakistan, tile fixing Pakistan, home services booking Pakistan"
        canonical="/services"
      />

      {/* ── Hero Header ── */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-6">
            🛠️ {language === 'ur' ? 'پاکستان بھر میں دستیاب' : 'Available Across Pakistan'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            {t('services')}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('servicesHeader')}
          </p>

          {/* Quick-jump pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {services.map(s => (
              <a key={s.slug} href={`#${s.slug}`}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white transition-all">
                {s.emoji} {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="page-container py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '🛡️', icon: Shield, title: t('verifiedPros'),  desc: t('verifiedProsDesc'),  color: 'text-primary-600',   bg: 'bg-primary-50' },
              { emoji: '⚡', icon: Clock,  title: t('fastResponse'),   desc: t('fastResponseDesc'),  color: 'text-amber-600',     bg: 'bg-amber-50' },
              { emoji: '⭐', icon: Star,   title: t('ratedReviewed'),  desc: t('ratedReviewedDesc'), color: 'text-secondary-600', bg: 'bg-secondary-50' },
            ].map(({ emoji, title, desc, color, bg }) => (
              <div key={title} className="flex items-start gap-4 p-4">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>
                  {emoji}
                </div>
                <div>
                  <h3 className={`font-bold ${color} mb-1`}>{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section className="bg-surface py-16">
        <div className="page-container">
          <div className="flex flex-col gap-6">
            {services.map(({ emoji, label, slug, bg, border, text, badge, desc, features, avgTime, rating, gradient }) => (
              <div key={slug} id={slug}
                className={`card border ${border} overflow-hidden group hover:shadow-xl transition-all duration-300`}>
                <div className="flex flex-col md:flex-row">

                  {/* Left: Category identity panel */}
                  <div className={`bg-gradient-to-br ${gradient} p-6 flex flex-col items-center justify-center text-white md:w-44 shrink-0`}>
                    <span className="text-5xl mb-2 drop-shadow-lg">{emoji}</span>
                    <h2 className="text-sm font-extrabold text-center uppercase tracking-wide leading-tight">{label}</h2>
                    <div className="flex items-center gap-1 mt-2 bg-white/20 rounded-full px-2 py-0.5">
                      <Star size={11} className="fill-white text-white" />
                      <span className="text-xs font-bold">{rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-xs font-bold ${badge} px-2.5 py-1 rounded-full flex items-center gap-1`}>
                        <Clock size={11} /> {avgTime}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                        {language === 'ur' ? 'تصدیق شدہ' : 'CNIC Verified Workers'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed max-w-2xl">{desc}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {features.map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-sm text-slate-600">
                          <CheckCircle size={13} className="text-secondary-500 shrink-0" /> {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex md:flex-col items-center justify-center p-6 border-t md:border-t-0 md:border-l border-slate-100 shrink-0">
                    <Link to="/register"
                      className="btn-primary whitespace-nowrap group-hover:shadow-lg transition-shadow">
                      {language === 'ur' && <ChevronRight size={16} style={{ marginTop: '10px', transform: 'rotate(180deg)' }} />}
                      {t('bookNow')}
                      {language !== 'ur' && <ChevronRight size={16} />}
                    </Link>
                    <p className="text-xs text-slate-400 mt-2 text-center hidden md:block">
                      {language === 'ur' ? 'فوری دستیاب' : 'Quick booking'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-to-br from-slate-900 to-primary-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="page-container text-center relative z-10">
          <div className="text-5xl mb-5">🤝</div>
          <h2 className="text-3xl font-extrabold text-white mb-3">{t('notSureHeader')}</h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">{t('notSureDesc')}</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5">
            {language === 'ur' && <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />}
            {t('getStarted')}
            {language !== 'ur' && <ArrowRight size={18} />}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
