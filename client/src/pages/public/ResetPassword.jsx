import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(language === 'ur' ? 'پاس ورڈ مماثل نہیں ہیں۔' : 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error(language === 'ur' ? 'پاس ورڈ کم از کم 6 ہندسوں کا ہونا چاہیے۔' : 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success(language === 'ur' ? 'پاس ورڈ کامیابی سے تبدیل ہو گیا!' : 'Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || (language === 'ur' ? 'ٹکن غلط ہے یا اس کی میعاد ختم ہو چکی ہے۔' : 'Link is invalid or has expired.'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center animate-fade-in">
          <div className="card shadow-xl p-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={40} className="text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-4">
              {language === 'ur' ? 'پاس ورڈ تبدیل ہو گیا!' : 'Password Updated!'}
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              {language === 'ur' 
                ? 'آپ کا پاس ورڈ کامیابی سے ری سیٹ کر دیا گیا ہے۔ اب آپ نئے پاس ورڈ کے ساتھ لاگ ان کر سکتے ہیں۔' 
                : 'Your password has been reset successfully. You can now log in with your new password.'}
            </p>
            <Link to="/login" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {language === 'ur' ? 'لاگ ان کریں' : 'Login Now'} <ArrowRight size={18} />
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
            {language === 'ur' ? 'نیا پاس ورڈ سیٹ کریں' : 'Set New Password'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {language === 'ur' 
              ? 'اپنے اکاؤنٹ کے لیے ایک نیا اور محفوظ پاس ورڈ منتخب کریں۔' 
              : "Choose a new, secure password for your account."}
          </p>
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="form-label">{language === 'ur' ? 'نیا پاس ورڈ' : 'New Password'}</label>
              <div className="relative">
                <Lock size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input 
                  type={showPass ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  className={`form-input ${language === 'ur' ? 'pr-10 pl-10' : 'pl-10 pr-10'}`} 
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute ${language === 'ur' ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">{language === 'ur' ? 'پاس ورڈ کی تصدیق کریں' : 'Confirm Password'}</label>
              <div className="relative">
                <Lock size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input 
                  type={showPass ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  className={`form-input ${language === 'ur' ? 'pr-10 pl-10' : 'pl-10 pr-10'}`} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (language === 'ur' ? 'اپ ڈیٹ ہو رہا ہے...' : 'Updating...') : (language === 'ur' ? 'پاس ورڈ ری سیٹ کریں' : 'Reset Password')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
