import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

const PrivacyPolicy = () => {
  const { t, language } = useLanguage();

  return (
    <div className="animate-fade-in bg-surface min-h-screen py-16">
      <SEO
        title="Privacy Policy — How We Protect Your Data"
        description="Read Service Knock's Privacy Policy to understand how we collect, use, and protect your personal data when using our home services platform in Pakistan."
        keywords="Service Knock privacy policy, data protection Pakistan, user data policy home services"
        canonical="/privacy"
        noIndex={false}
      />
      <div className="page-container max-w-4xl">
        <div className={`card p-10 shadow-sm ${language === 'ur' ? 'text-right' : ''}`}>
          <h1 className="text-3xl font-bold text-dark mb-2">{t('privacyTitle')}</h1>
          <p className="text-slate-500 text-sm mb-8">{t('lastUpdated')}</p>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('infoCollect')}</h2>
              <p className="mb-4">
                {t('infoCollectDesc')}
              </p>
              <ul className={`list-disc space-y-2 ${language === 'ur' ? 'pr-6 pl-0' : 'pl-6'}`}>
                <li>{t('accountInfo')}</li>
                <li>{t('bookingData')}</li>
                <li>{t('paymentData')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('howWeUse')}</h2>
              <p>
                {t('howWeUseDesc')}
              </p>
              <ul className={`list-disc space-y-2 mt-4 ${language === 'ur' ? 'pr-6 pl-0' : 'pl-6'}`}>
                <li>{t('connectCustomers')}</li>
                <li>{t('sendNotifications')}</li>
                <li>{t('customerSupport')}</li>
                <li>{t('platformAnalytics')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('dataSecurity')}</h2>
              <p>
                {t('dataSecurityDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('sharingThirdParties')}</h2>
              <p>
                {t('sharingThirdPartiesDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('yourRights')}</h2>
              <p>
                {t('yourRightsDesc')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
