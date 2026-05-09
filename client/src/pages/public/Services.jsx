import { Link } from 'react-router-dom';
import { 
  Zap, Wrench, Wind, ChevronRight, CheckCircle, Clock, 
  Shield, Star, Hammer, Paintbrush, Building, Construction, 
  Users, Grid 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Services = () => {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: Zap,
      label: t('electrician'),
      slug: 'electrician',
      color: 'from-amber-400 to-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      iconColor: 'text-amber-600',
      desc: t('electricianDesc'),
      features: [t('faultDiagnosis'), t('wiringRewiring'), t('panelUpgrades'), t('lightFixtures'), t('safetyInspections')],
      avgTime: language === 'ur' ? '2 گھنٹے سے کم' : '< 2 hrs',
      rating: '4.9',
    },
    {
      icon: Wrench,
      label: t('plumber'),
      slug: 'plumber',
      color: 'from-blue-400 to-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      iconColor: 'text-blue-600',
      desc: t('plumberDesc'),
      features: [t('leakRepairs'), t('drainCleaning'), t('pipeInstallation'), t('waterHeater'), t('tapReplacement')],
      avgTime: language === 'ur' ? '3 گھنٹے سے کم' : '< 3 hrs',
      rating: '4.8',
    },
    {
      icon: Wind,
      label: t('ac_fridge_repair'),
      slug: 'ac_fridge_repair',
      color: 'from-primary-400 to-primary-700',
      bg: 'bg-primary-50',
      border: 'border-primary-100',
      iconColor: 'text-primary-600',
      desc: t('acFridgeDesc'),
      features: [t('deepCleaning'), t('gasRefilling'), t('installation'), t('fridgeRepair'), t('annualService')],
      avgTime: language === 'ur' ? '4 گھنٹے سے کم' : '< 4 hrs',
      rating: '4.7',
    },
    {
      icon: Hammer,
      label: t('carpenter'),
      slug: 'carpenter',
      color: 'from-orange-400 to-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      iconColor: 'text-orange-600',
      desc: t('carpenterDesc'),
      features: [t('furnitureRepair'), t('doorWindowFix'), t('customWoodwork'), t('lockInstallation'), t('assembly')],
      avgTime: language === 'ur' ? '5 گھنٹے سے کم' : '< 5 hrs',
      rating: '4.8',
    },
    {
      icon: Paintbrush,
      label: t('painter'),
      slug: 'painter',
      color: 'from-pink-400 to-pink-700',
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      iconColor: 'text-pink-600',
      desc: t('painterDesc'),
      features: [t('interiorPainting'), t('exteriorPainting'), t('wallPutty'), t('waterproofing'), t('stencilWork')],
      avgTime: language === 'ur' ? '1-2 دن' : '1-2 days',
      rating: '4.9',
    },
    {
      icon: Building,
      label: t('mason'),
      slug: 'mason',
      color: 'from-slate-400 to-slate-700',
      bg: 'bg-slate-50',
      border: 'border-slate-100',
      iconColor: 'text-slate-600',
      desc: t('masonDesc'),
      features: [t('brickwork'), t('plastering'), t('wallRepair'), t('concreteWork'), t('demolition')],
      avgTime: language === 'ur' ? 'مختلف' : 'Varied',
      rating: '4.6',
    },
    {
      icon: Construction,
      label: t('steel_fixer'),
      slug: 'steel_fixer',
      color: 'from-gray-500 to-gray-800',
      bg: 'bg-gray-50',
      border: 'border-gray-100',
      iconColor: 'text-gray-700',
      desc: t('steelFixerDesc'),
      features: [t('steelBending'), t('rebarFixing'), t('slabReinforcement'), t('meshWork'), t('welding')],
      avgTime: language === 'ur' ? 'مختلف' : 'Varied',
      rating: '4.7',
    },
    {
      icon: Users,
      label: t('labour'),
      slug: 'labour',
      color: 'from-teal-400 to-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      iconColor: 'text-teal-600',
      desc: t('labourDesc'),
      features: [t('generalHelp'), t('loadingUnloading'), t('debrisRemoval'), t('siteCleaning'), t('packing')],
      avgTime: language === 'ur' ? '1 دن سے کم' : '< 1 day',
      rating: '4.5',
    },
    {
      icon: Grid,
      label: t('tile_fixer'),
      slug: 'tile_fixer',
      color: 'from-indigo-400 to-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      iconColor: 'text-indigo-600',
      desc: t('tileFixerDesc'),
      features: [t('floorTiling'), t('wallTiling'), t('grouting'), t('tileReplacement'), t('graniteWork')],
      avgTime: language === 'ur' ? '1-2 دن' : '1-2 days',
      rating: '4.8',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="hero-gradient text-white py-16">
        <div className="page-container text-center">
          <h1 className="text-4xl font-bold mb-3">{t('services')}</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            {t('servicesHeader')}
          </p>
        </div>
      </section>

      {/* Why trust us */}
      <section className="bg-white border-b border-slate-100">
        <div className="page-container py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Shield, title: t('verifiedPros'), desc: t('verifiedProsDesc') },
              { icon: Clock, title: t('fastResponse'), desc: t('fastResponseDesc') },
              { icon: Star, title: t('ratedReviewed'), desc: t('ratedReviewedDesc') },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={22} className="text-primary-500" />
                </div>
                <h3 className="font-bold text-dark mb-1">{title}</h3>
                <p className="text-slate-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-surface py-16">
        <div className="page-container">
          <div className="flex flex-col gap-8">
            {services.map(({ icon: Icon, label, slug, bg, border, iconColor, desc, features, avgTime, rating }) => (
              <div key={slug} className={`card border ${border} flex flex-col md:flex-row gap-6`}>
                {/* Left */}
                <div className="flex-shrink-0">
                  <div className={`w-20 h-20 rounded-2xl ${bg} ${iconColor} flex items-center justify-center`}>
                    <Icon size={38} />
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-dark">{label}</h2>
                    <span className="flex items-center gap-1 text-xs font-semibold bg-secondary-100 text-secondary-700 px-2.5 py-0.5 rounded-full">
                      <Star size={11} className="fill-secondary-500 text-secondary-500" /> {rating}
                    </span>
                    <span className="text-xs font-semibold bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full">
                      {avgTime}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{desc}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-sm text-slate-600">
                        <CheckCircle size={13} className="text-secondary-500 shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
                {/* CTA */}
                <div className="flex items-center md:items-start">
                  <Link to="/register" className="btn-primary whitespace-nowrap">
                    {language === 'ur' && <ChevronRight size={16} style={{ marginTop: '10px', transform: 'rotate(180deg)' }} />}
                    {t('bookNow')}
                    {language !== 'ur' && <ChevronRight size={16} />}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-14">
        <div className="page-container text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">{t('notSureHeader')}</h2>
          <p className="text-slate-500 mb-6">{t('notSureDesc')}</p>
          <Link to="/register" className="btn-primary">
            {language === 'ur' && <ChevronRight size={16} style={{ marginTop: '10px', transform: 'rotate(180deg)' }} />}
            {t('getStarted')}
            {language !== 'ur' && <ChevronRight size={16} />}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
