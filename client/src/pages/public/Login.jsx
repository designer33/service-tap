import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(language === 'ur' ? `خوش آمدید، ${data.user.name}!` : `Welcome back, ${data.user.name}!`);
      const redirectMap = { admin: '/admin', worker: '/job-requests', customer: '/my-bookings' };
      navigate(redirectMap[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || (language === 'ur' ? 'لاگ ان ناکام رہا۔ براہ کرم دوبارہ کوشش کریں۔' : 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl shadow-lg mb-4">
            <Zap size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark">{t('welcomeBack')}</h1>
          <p className="text-slate-500 mt-1 text-sm">{language === 'ur' ? 'اپنے سروس ٹیپ اکاؤنٹ میں لاگ ان کریں' : 'Sign in to your Service Knock account'}</p>
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="form-label" htmlFor="login-email">{t('email')}</label>
              <div className="relative">
                <Mail size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input id="login-email" type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder={language === 'ur' ? 'ای میل درج کریں' : "you@example.com"} required
                  className={`form-input ${language === 'ur' ? 'pr-10' : 'pl-10'}`} autoComplete="email" />
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
            </div>

            <button id="login-submit" type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (language === 'ur' ? 'لاگ ان ہو رہا ہے...' : 'Signing in...') : t('login')}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">{t('getStarted')}</Link>
          </p>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
            <strong>{language === 'ur' ? 'ایڈمن ڈیمو:' : 'Admin demo:'}</strong> admin@servicetap.com / Admin@1234
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
