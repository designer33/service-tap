import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ArrowRight, ArrowLeft, ShieldCheck, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Welcome = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] aspect-square bg-primary-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] aspect-square bg-secondary-50 rounded-full blur-[120px] opacity-60" />

      {/* Top Section: Logo & Language */}
      <div className="relative z-10 flex flex-col items-center pt-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <img
            src={language === 'ur' ? "/logo-service-knock-urdu.png" : "/logo-service-knock.png"}
            alt="Service Knock"
            className="h-24 w-auto object-contain mb-6 drop-shadow-xl"
          />
          
          <div className="h-1 w-12 bg-primary-500 rounded-full mb-8" />
        </motion.div>

        {/* Language Selection */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mb-12"
        >
          <button
            onClick={() => language !== 'en' && toggleLanguage()}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all ${
              language === 'en' 
                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-100' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-primary-200'
            }`}
          >
            <Globe size={18} className={language === 'ur' ? 'mt-1' : ''} />
            <span className="font-bold">English</span>
          </button>
          <button
            onClick={() => language !== 'ur' && toggleLanguage()}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all ${
              language === 'ur' 
                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-100' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-primary-200 font-urdu'
            }`}
          >
            <Globe size={18} className={language === 'ur' ? 'mt-1' : ''} />
            <span className="font-bold">اردو</span>
          </button>
        </motion.div>
      </div>

      {/* Middle Section: Features */}
      <div className="relative z-10 flex-1 px-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6 max-w-sm mx-auto"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-primary-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-dark">{t('verifiedWorkersShort') || 'CNIC Verified Workers'}</h3>
              <p className="text-slate-500 text-sm leading-snug">{language === 'ur' ? 'تمام ورکرز کی مکمل تصدیق کی جاتی ہے' : 'Every professional is identity-verified for your safety.'}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Zap className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-dark">{t('fastResponse') || 'Fast Response'}</h3>
              <p className="text-slate-500 text-sm leading-snug">{language === 'ur' ? 'فوری بکنگ اور تیز ترین سروس' : 'Get help at your doorstep within minutes.'}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center shrink-0">
              <Users className="text-secondary-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-dark">{language === 'ur' ? 'بہترین سروسز' : 'Trusted Services'}</h3>
              <p className="text-slate-500 text-sm leading-snug">{language === 'ur' ? 'ہزاروں مطمئن صارفین کا اعتماد' : 'Join thousands of happy customers today.'}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 p-8 pt-0 flex flex-col gap-4"
      >
        <Link 
          to="/register" 
          className="w-full py-5 bg-primary-600 text-white rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {language === 'ur' && <ArrowLeft size={22} />}
          <span>{t('getStarted')}</span>
          {language !== 'ur' && <ArrowRight size={22} />}
        </Link>
        
        <Link 
          to="/login" 
          className="w-full py-4 text-primary-700 font-bold text-center hover:bg-primary-50 rounded-2xl transition-colors"
        >
          {t('alreadyHaveAccount') || 'Already have an account? Sign In'}
        </Link>

        <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed px-6">
          {language === 'ur' 
            ? 'جاری رکھ کر آپ ہماری شرائط و ضوابط اور رازداری کی پالیسی سے اتفاق کرتے ہیں۔' 
            : 'By continuing, you agree to our Terms of Service and Privacy Policy.'}
        </p>
      </motion.div>
    </div>
  );
};

export default Welcome;
