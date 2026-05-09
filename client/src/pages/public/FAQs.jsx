import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  ];

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen py-20">
      <div className="page-container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="section-title">{t('faqs')}</h1>
          <p className="text-slate-500">{t('faqSubtitle')}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-dark">{faq.question}</span>
                {openIndex === index ? <ChevronUp size={20} className="text-primary-500" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 text-slate-600 border-t border-slate-50 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-primary-600 rounded-3xl text-white">
          <h3 className="text-xl font-bold mb-2">{t('stillHaveQuestions')}</h3>
          <p className="text-primary-100 mb-6 text-sm">{t('supportDesc')}</p>
          <a href="/contact" className="btn-primary bg-white text-primary-600 hover:bg-primary-50 border-none">
            {t('contactSupport')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
