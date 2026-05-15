import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

const FAQs = () => {
  const { t, direction } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { question: t('faqQ1'), answer: t('faqA1') },
    { question: t('faqQ2'), answer: t('faqA2') },
    { question: t('faqQ3'), answer: t('faqA3') },
    { question: t('faqQ4'), answer: t('faqA4') },
    { question: t('faqQ5'), answer: t('faqA5') },
    { question: t('faqQ6'), answer: t('faqA6') },
    { question: t('faqQ7'), answer: t('faqA7') },
    { question: t('faqQ8'), answer: t('faqA8') },
  ];

  return (
    <div className="animate-fade-in">
      <SEO
        title="Frequently Asked Questions — How Service Knock Works"
        description="Got questions about booking home services in Pakistan? Find answers about how Service Knock works, pricing, CNIC verification, cancellations, and how to hire verified workers."
        keywords="Service Knock FAQ, how to book home services Pakistan, CNIC verification, home service pricing Pakistan, cancel booking, verified workers FAQ"
        canonical="/faqs"
      />
      {/* Hero */}
      <section className="hero-gradient text-white py-16">
        <div className="page-container text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">{t('faqs')}</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">{t('faqSubtitle')}</p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="page-container max-w-3xl mx-auto">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left gap-4"
                >
                  <span className="font-bold text-dark text-sm sm:text-base">{faq.question}</span>
                  <span className="shrink-0">
                    {openIndex === index ? <ChevronUp size={20} className="text-primary-500" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-5 text-slate-600 border-t border-slate-100 pt-4 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center p-8 bg-primary-600 rounded-3xl text-white">
            <h3 className="text-xl font-bold mb-2">{t('stillHaveQuestions')}</h3>
            <p className="text-primary-100 mb-6 text-sm">{t('supportDesc')}</p>
            <a href="/contact" className="inline-block bg-white text-primary-600 hover:bg-primary-50 font-bold px-6 py-3 rounded-xl transition-colors">
              {t('contactSupport')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
