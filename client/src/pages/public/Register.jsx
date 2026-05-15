import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Eye, EyeOff, Wrench, Fingerprint, Camera, AlertCircle, ShieldAlert, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ImageCropModal from '../../components/ImageCropModal';
import { pickImage } from '../../utils/imagePicker';
import { Capacitor } from '@capacitor/core';
import { PROVINCES, getCities } from '../../utils/pakistanCities';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [form, setForm] = useState({
    name: '', phone: '', cnic: '', email: '', password: '',
    role: 'customer', serviceTypes: [], experience: '',
    profilePic: '',
    address: '', city: '', state: '', zipCode: '', country: 'Pakistan',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('fileTooLarge'));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImageToCrop(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCapturePhoto = async (target) => {
    const photo = await pickImage('PROMPT');
    if (photo) {
      if (target === 'profile') {
        setImageToCrop(photo);
      } else if (target === 'cnic') {
        setCnicPreview(photo);
      }
    }
  };

  const handleCropComplete = (croppedImage) => {
    setForm({ ...form, profilePic: croppedImage });
    setImageToCrop(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.role === 'worker') {
        if (form.serviceTypes.length === 0) {
          toast.error(language === 'ur' ? 'براہ کرم کم از کم ایک سروس منتخب کریں۔' : 'Please select at least 1 service.');
          setLoading(false);
          return;
        }
        if (form.serviceTypes.length > 2) {
          toast.error(language === 'ur' ? 'آپ زیادہ سے زیادہ 2 سروسز منتخب کر سکتے ہیں۔' : 'You can select a maximum of 2 services.');
          setLoading(false);
          return;
        }
      } else {
        delete payload.serviceTypes;
        delete payload.experience;
      }
      const { data } = await api.post('/auth/register', payload);
      login(data.user, data.token);
      toast.success(language === 'ur' ? `اکاؤنٹ بن گیا! خوش آمدید، ${data.user.name}!` : `Account created! Welcome, ${data.user.name}!`);
      const redirectMap = { worker: '/job-requests', customer: '/my-bookings' };
      navigate(redirectMap[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || (language === 'ur' ? 'رجسٹریشن ناکام رہی۔' : 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <img
              src="/favicon.png"
              alt="Service Knock"
              className="h-16 w-16 object-contain drop-shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-bold text-dark">{t('getStarted')}</h1>
          <p className="text-slate-500 mt-1 text-sm">{language === 'ur' ? 'آج ہی سروس ناک میں شامل ہوں' : "Join Service Knock today — it's free"}</p>
        </div>

        <div className="card shadow-md">
          {/* Role Tabs */}
          <div className="flex gap-2 mb-6 bg-slate-100 rounded-xl p-1">
            {['customer', 'worker'].map((r) => (
              <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${form.role === r ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {r === 'worker' ? (language === 'ur' ? '🔧 بطور ورکر شامل ہوں' : '🔧 Join as Worker') : (language === 'ur' ? '👤 سروسز بک کریں' : '👤 Book Services')}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Identity Matching Instruction */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 items-start animate-pulse">
              <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                {language === 'ur' 
                  ? 'اہم: آپ کا نام اور پروفائل تصویر آپ کے شناختی کارڈ (CNIC) کے عین مطابق ہونی چاہیے۔ بصورتِ دیگر آپ کی تصدیق مسترد کر دی جائے گی۔' 
                  : 'IMPORTANT: Your Name and Profile Photo must exactly match your official ID (CNIC). Mismatched profiles will be rejected during verification.'}
              </p>
            </div>

            {/* Profile Pic Upload */}
            <div className="mb-2">
              <label className={`form-label ${language === 'en' ? 'uppercase tracking-wide text-[11px]' : ''}`}>{t('profilePicture')}</label>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-200 shadow-sm shrink-0">
                  {form.profilePic ? (
                    <img src={form.profilePic} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={24} className="text-slate-300" />
                  )}
                </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleCapturePhoto('profile')}
                      className="btn-outline py-2.5 text-xs font-bold flex items-center justify-center gap-2 bg-white"
                    >
                      <Camera size={14} /> {language === 'ur' ? 'تصویر لیں یا منتخب کریں' : 'Take or Choose Photo'}
                    </button>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profile-upload-reg"
                    />
                    <p className="text-[10px] text-slate-400 leading-tight italic">
                      {language === 'ur' ? 'اپنی اصل تصویر اپ لوڈ کریں' : 'Upload a clear, real photo of yourself'}
                    </p>
                  </div>
              </div>
            </div>

            <div>
              <label className={`form-label ${language === 'en' ? 'uppercase tracking-wide text-[11px]' : ''}`} htmlFor="reg-name">{t('fullName')}</label>
              <div className="relative">
                <User size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input id="reg-name" type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder={language === 'ur' ? 'نام جیسا کہ شناختی کارڈ پر ہے' : "Name as on CNIC"} required
                  className={`form-input ${language === 'ur' ? 'pr-10' : 'pl-10'}`} />
              </div>
            </div>

            <div>
              <label className={`form-label ${language === 'en' ? 'uppercase tracking-wide text-[11px]' : ''}`} htmlFor="reg-phone">{t('phone')}</label>
              <div className="relative">
                <Phone size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input id="reg-phone" type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="03001234567" required minLength={11} maxLength={11} pattern="0\d{10}"
                  className={`form-input ${language === 'ur' ? 'pr-10' : 'pl-10'}`} />
              </div>
            </div>

            <div>
              <label className={`form-label ${language === 'en' ? 'uppercase tracking-wide text-[11px]' : ''}`} htmlFor="reg-cnic">{t('cnic')} (13 {language === 'ur' ? 'ہندسے' : 'digits'})</label>
              <div className="relative">
                <Fingerprint size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input id="reg-cnic" type="text" name="cnic" value={form.cnic} onChange={handleChange}
                  placeholder="1234567890123" required minLength={13} maxLength={13} pattern="\d{13}"
                  className={`form-input ${language === 'ur' ? 'pr-10' : 'pl-10'}`} />
              </div>
            </div>

            <div>
              <label className={`form-label ${language === 'en' ? 'uppercase tracking-wide text-[11px]' : ''}`} htmlFor="reg-email">{t('email')}</label>
              <div className="relative">
                <Mail size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required className={`form-input ${language === 'ur' ? 'pr-10' : 'pl-10'}`} autoComplete="email" />
              </div>
            </div>

            <div>
              <label className={`form-label ${language === 'en' ? 'uppercase tracking-wide text-[11px]' : ''}`} htmlFor="reg-password">{t('password')}</label>
              <div className="relative">
                <Lock size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input id="reg-password" type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder={language === 'ur' ? 'کم از کم 6 ہندسے' : "Min. 6 characters"}
                  required className={`form-input ${language === 'ur' ? 'pr-10 pl-10' : 'pl-10 pr-10'}`} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                   className={`absolute ${language === 'ur' ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Address Fields */}
            <div className="flex flex-col gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin size={13} /> {language === 'ur' ? 'پتہ کی تفصیلات' : 'Address Details'}
              </p>
              
              <div>
                <label className="form-label text-[11px] uppercase tracking-wide" htmlFor="reg-address">{language === 'ur' ? 'گھر کا پتہ' : 'Street Address'}</label>
                <input id="reg-address" type="text" name="address" value={form.address} onChange={handleChange}
                  placeholder={language === 'ur' ? 'گھر کا نمبر، گلی، علاقہ' : "House #, Street, Area"} required
                  className="form-input" />
              </div>

              <div>
                <label className="form-label text-[11px] uppercase tracking-wide" htmlFor="reg-state">{language === 'ur' ? 'صوبہ / علاقہ' : 'Province / Region'}</label>
                <select id="reg-state" name="state" value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value, city: '' })}
                  required className="form-select">
                  <option value="">{language === 'ur' ? 'صوبہ منتخب کریں' : 'Select Province'}</option>
                  {PROVINCES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label text-[11px] uppercase tracking-wide" htmlFor="reg-city">{language === 'ur' ? 'شہر' : 'City'}</label>
                <select id="reg-city" name="city" value={form.city} onChange={handleChange}
                  required disabled={!form.state} className="form-select disabled:opacity-50">
                  <option value="">{form.state ? (language === 'ur' ? 'شہر منتخب کریں' : 'Select City') : (language === 'ur' ? 'پہلے صوبہ منتخب کریں' : 'Select province first')}</option>
                  {getCities(form.state).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Worker-only fields */}
            {form.role === 'worker' && (
              <div className="flex flex-col gap-4 p-4 bg-secondary-50 border border-secondary-100 rounded-xl">
                <p className="text-xs font-semibold text-secondary-700 flex items-center gap-1.5">
                  <Wrench size={13} /> {language === 'ur' ? 'ورکر کی تفصیلات' : 'Worker Details'}
                </p>
                <div className="space-y-3">
                  <label className={`form-label ${language === 'en' ? 'uppercase tracking-wide text-[11px]' : ''}`}>
                    {language === 'ur' ? 'سروسز منتخب کریں (زیادہ سے زیادہ 2)' : 'Select Services (Max 2)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'electrician', label: t('electrician') },
                      { id: 'plumber', label: t('plumber') },
                      { id: 'ac_fridge_repair', label: t('ac_fridge_repair') },
                      { id: 'carpenter', label: t('carpenter') },
                      { id: 'painter', label: t('painter') },
                      { id: 'mason', label: t('mason') },
                      { id: 'steel_fixer', label: t('steel_fixer') },
                      { id: 'labour', label: t('labour') },
                      { id: 'tile_fixer', label: t('tile_fixer') },
                    ].map((service) => {
                      const isSelected = form.serviceTypes.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setForm({ ...form, serviceTypes: form.serviceTypes.filter(s => s !== service.id) });
                            } else if (form.serviceTypes.length < 2) {
                              setForm({ ...form, serviceTypes: [...form.serviceTypes, service.id] });
                            } else {
                              toast.error(language === 'ur' ? 'آپ صرف 2 سروسز منتخب کر سکتے ہیں۔' : 'You can only select up to 2 services.');
                            }
                          }}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-xs font-bold text-left ${
                            isSelected 
                              ? 'border-secondary-500 bg-secondary-50 text-secondary-700' 
                              : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-secondary-500 bg-secondary-500' : 'border-slate-300'}`}>
                            {isSelected && <CheckCircle size={10} className="text-white" />}
                          </div>
                          {service.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className={`form-label ${language === 'en' ? 'uppercase tracking-wide text-[11px]' : ''}`} htmlFor="reg-exp">{language === 'ur' ? 'تجربہ (سال)' : 'Years of Experience'}</label>
                  <input id="reg-exp" type="number" name="experience" value={form.experience}
                    onChange={handleChange} min="0" placeholder="e.g. 3"
                    className="form-input" />
                </div>
              </div>
            )}

            <button id="register-submit" type="submit" disabled={loading}
              className={`btn-secondary w-full py-4 text-lg mt-2 flex items-center justify-center gap-3 shadow-lg shadow-secondary-100 hover:shadow-secondary-200 transition-all active:scale-[0.98] ${language === 'ur' ? 'flex-row-reverse' : ''}`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'ur' ? 'اکاؤنٹ بن رہا ہے...' : 'Creating account...'}</span>
                </div>
              ) : (
                <>
                  <span className={language === 'ur' ? 'font-urdu text-xl' : 'font-bold'}>{t('getStarted')}</span>
                  <div className={`bg-white/20 p-1 rounded-lg ${language === 'ur' ? 'rotate-180' : ''}`}>
                    <ArrowRight size={20} />
                  </div>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            {language === 'ur' ? 'پہلے سے اکاؤنٹ ہے؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">{t('login')}</Link>
          </p>
        </div>
      </div>
      {imageToCrop && (
        <ImageCropModal 
          image={imageToCrop} 
          onCrop={handleCropComplete} 
          onCancel={() => setImageToCrop(null)} 
        />
      )}
    </div>
  );
};

export default Register;
