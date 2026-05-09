import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ForgotPassword = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success(language === 'ur' ? 'ای میل بھیج دی گئی ہے!' : 'Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || (language === 'ur' ? 'خرابی پیش آگئی۔' : 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center animate-fade-in">
          <div className="card shadow-xl p-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-4">
              {language === 'ur' ? 'ای میل چیک کریں' : 'Check your email'}
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              {language === 'ur' 
                ? `ہم نے ${email} پر پاس ورڈ ری سیٹ کرنے کی ہدایات بھیج دی ہیں۔` 
                : `We've sent a password reset link to ${email}. Please check your inbox (and spam folder).`}
            </p>
            <Link to="/login" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <ArrowLeft size={18} /> {language === 'ur' ? 'واپس لاگ ان پر' : 'Back to Login'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark">
            {language === 'ur' ? 'پاس ورڈ بھول گئے؟' : 'Forgot Password?'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {language === 'ur' 
              ? 'اپنا رجسٹرڈ ای میل درج کریں اور ہم آپ کو ری سیٹ لنک بھیجیں گے۔' 
              : "Enter your registered email and we'll send you a link to reset your password."}
          </p>
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="form-label" htmlFor="forgot-email">{t('email')}</label>
              <div className="relative">
                <Mail size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input 
                  id="forgot-email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@example.com" 
                  required 
                  className={`form-input ${language === 'ur' ? 'pr-10' : 'pl-10'}`} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (language === 'ur' ? 'بھیج رہا ہے...' : 'Sending Link...') : (language === 'ur' ? 'ری سیٹ لنک بھیجیں' : 'Send Reset Link')}
            </button>

            <Link to="/login" className="text-center text-sm font-semibold text-slate-500 hover:text-primary-600 flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> {language === 'ur' ? 'واپس لاگ ان پر' : 'Back to Login'}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
