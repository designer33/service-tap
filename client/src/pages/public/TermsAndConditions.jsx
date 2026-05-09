import { useLanguage } from '../../context/LanguageContext';

const TermsAndConditions = () => {
  const { t, language } = useLanguage();

  return (
    <div className="animate-fade-in bg-surface min-h-screen py-16">
      <div className="page-container max-w-4xl">
        <div className={`card p-10 shadow-sm ${language === 'ur' ? 'text-right' : ''}`}>
          <h1 className="text-3xl font-bold text-dark mb-2">{t('termsTitle')}</h1>
          <p className="text-slate-500 text-sm mb-8">{t('lastUpdated')}</p>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('acceptanceTerms')}</h2>
              <p>
                {t('acceptanceTermsDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('userAccounts')}</h2>
              <p>
                {t('userAccountsDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('bookingPayments')}</h2>
              <p>
                {t('bookingPaymentsDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('cancellationsTerms')}</h2>
              <p>
                {t('cancellationsTermsDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('proVerification')}</h2>
              <p>
                {t('proVerificationDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-4">{t('liabilityLimitation')}</h2>
              <p>
                {t('liabilityLimitationDesc')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
