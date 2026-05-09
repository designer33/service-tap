import { Shield, Zap, Star, Users, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 blur-[120px] -rotate-12 translate-x-1/2"></div>
        <div className="page-container relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('aboutHeroTitle')}</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('aboutHeroSubtitle')}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-surface border-b border-slate-100">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: t('verifiedWorkers'), value: '500+' },
              { label: t('happyCustomers'), value: '10k+' },
              { label: t('servicesOffered'), value: '25+' },
              { label: t('citiesCovered'), value: '12' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary-600 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t('ourCoreValues')}</h2>
            <p className="text-slate-500 max-w-xl mx-auto">{t('coreValuesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: Shield, 
                title: t('trustSafety'), 
                desc: t('trustSafetyDesc'),
                color: 'text-primary-600',
                bg: 'bg-primary-50'
              },
              { 
                icon: Zap, 
                title: t('qualityService'), 
                desc: t('qualityServiceDesc'),
                color: 'text-secondary-600',
                bg: 'bg-secondary-50'
              },
              { 
                icon: Star, 
                title: t('transparency'), 
                desc: t('transparencyDesc'),
                color: 'text-accent-600',
                bg: 'bg-accent-50'
              },
            ].map((val) => (
              <div key={val.title} className="card p-8 hover:shadow-xl transition-all duration-300 group">
                <div className={`w-14 h-14 ${val.bg} ${val.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <val.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Mission */}
      <section className="py-20 bg-slate-50">
        <div className="page-container flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Our Team" className="rounded-3xl shadow-2xl" />
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-dark">{t('builtModernHome')}</h2>
            <p className="text-slate-600 leading-relaxed">
              {t('modernHomeDesc')}
            </p>
            <ul className="space-y-4">
              {[t('support247'), t('securePayments'), t('qualityGuarantee')].map(item => (
                <li key={item} className="flex items-center gap-3 font-semibold text-dark">
                  <CheckCircle className="text-secondary-500" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
