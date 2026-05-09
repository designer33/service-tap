import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { isBiometricAvailable, hasBiometricCredentials, getBiometricCredentials, saveBiometricCredentials } from '../../utils/biometricHelper';
import { Capacitor } from '@capacitor/core';
import { useEffect } from 'react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canBiometric, setCanBiometric] = useState(false);
  const [hasStored, setHasStored] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      const available = await isBiometricAvailable();
      const stored = await hasBiometricCredentials();
      setCanBiometric(available);
      setHasStored(stored);
    };
    checkBiometrics();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: form.identifier,
        password: form.password
      });
      login(data.user, data.token);
      
      // Check for biometric enrollment
      if (Capacitor.isNativePlatform()) {
        await checkEnableBiometrics(form.identifier, form.password);
      }

      toast.success(language === 'ur' ? `خوش آمدید، ${data.user.name}!` : `Welcome back, ${data.user.name}!`);
      const redirectMap = { admin: '/admin', worker: '/job-requests', customer: '/my-bookings' };
      navigate(redirectMap[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || (language === 'ur' ? 'لاگ ان ناکام رہا۔ براہ کرم دوبارہ کوشش کریں۔' : 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    try {
      const credentials = await getBiometricCredentials();
      if (credentials) {
        const { data } = await api.post('/auth/login', credentials);
        login(data.user, data.token);
        toast.success(language === 'ur' ? `خوش آمدید، ${data.user.name}!` : `Welcome back, ${data.user.name}!`);
        const redirectMap = { admin: '/admin', worker: '/job-requests', customer: '/my-bookings' };
        navigate(redirectMap[data.user.role] || '/');
      }
    } catch (err) {
      toast.error(language === 'ur' ? 'بائیومیٹرک لاگ ان ناکام رہا۔' : 'Biometric login failed.');
    } finally {
      setLoading(false);
    }
  };

  const checkEnableBiometrics = async (email, password) => {
    if (canBiometric && !hasStored) {
      if (window.confirm(language === 'ur' ? 'کیا آپ اگلی بار کے لیے فیس آئی ڈی/فنگر پرنٹ فعال کرنا چاہتے ہیں؟' : 'Enable Face ID/Fingerprint for next time?')) {
        await saveBiometricCredentials(email, password);
        setHasStored(true);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <img
              src="/favicon.png"
              alt="Service Knock"
              className="h-16 w-16 object-contain drop-shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-bold text-dark">{t('welcomeBack')}</h1>
          <p className="text-slate-500 mt-1 text-sm">{language === 'ur' ? 'اپنے سروس ناک اکاؤنٹ میں لاگ ان کریں' : 'Sign in to your Service Knock account'}</p>
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="form-label" htmlFor="login-email">{language === 'ur' ? 'ای میل یا فون نمبر' : 'Email or Phone Number'}</label>
              <div className="relative">
                <Mail size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input id="login-email" type="text" name="identifier" value={form.identifier}
                  onChange={handleChange} placeholder={language === 'ur' ? 'ای میل یا فون درج کریں' : "you@example.com / 03001234567"} required
                  className={`form-input ${language === 'ur' ? 'pr-10' : 'pl-10'}`} autoComplete="username" />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="login-password">{t('password')}</label>
              <div className="relative">
                <Lock size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input id="login-password" type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder="••••••••" required
                  className={`form-input ${language === 'ur' ? 'pr-10 pl-10' : 'pl-10 pr-10'}`} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute ${language === 'ur' ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className={`mt-2 ${language === 'ur' ? 'text-right' : 'text-right'}`}>
                <Link to="/forgot-password" title="reset password"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                  {language === 'ur' ? 'پاس ورڈ بھول گئے؟' : 'Forgot Password?'}
                </Link>
              </div>
            </div>

            <button id="login-submit" type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (language === 'ur' ? 'لاگ ان ہو رہا ہے...' : 'Signing in...') : t('login')}
            </button>

            {canBiometric && hasStored && (
              <button 
                type="button" 
                onClick={handleBiometricLogin}
                className="flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-dark font-bold hover:bg-slate-100 transition-all"
              >
                <Fingerprint size={20} className="text-primary-500" />
                {language === 'ur' ? 'بائیومیٹرک لاگ ان' : 'Biometric Login'}
              </button>
            )}
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">{t('getStarted')}</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
