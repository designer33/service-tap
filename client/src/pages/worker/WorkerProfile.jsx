import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import { Star, ToggleLeft, ToggleRight, Loader2, Save } from 'lucide-react';

const SERVICE_LABELS = {
  electrician: 'Electrician',
  plumber: 'Plumber',
  ac_fridge_repair: 'AC / Fridge Repair',
  carpenter: 'Carpenter',
  painter: 'Painter',
  mason: 'Mason',
  steel_fixer: 'Steel Fixer',
  labour: 'Labour',
  tile_fixer: 'Tile Fixer'
};

const WorkerProfile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [form, setForm] = useState({ bio: '', experience: '' });

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/workers/profile');
      setWorker(data.worker);
      setForm({ bio: data.worker.bio || '', experience: data.worker.experience || 0 });
    } catch {
      toast.error(t('loadingError') || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const { data } = await api.patch('/workers/availability');
      setWorker((w) => ({ ...w, isAvailable: data.isAvailable }));
      toast.success(data.message);
    } catch {
      toast.error(t('actionFailed') || 'Failed to update availability.');
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/workers/profile', form);
      setWorker(data.worker);
      toast.success(t('profileUpdatedToast') || 'Profile updated!');
    } catch {
      toast.error(t('updateError') || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
  );

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container max-w-2xl">
        <h1 className={`section-title mb-8 ${language === 'ur' ? 'text-right' : ''}`}>{t('myProfile')}</h1>

        {/* Profile Header */}
        <div className="card mb-6">
          <div className={`flex items-start gap-5 ${language === 'ur' ? 'flex-row-reverse text-right' : ''}`}>
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0 overflow-hidden shadow-md">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-dark">
                {language === 'ur' ? (
                  user.urduName || 
                  (() => {
                    const trans = t(user.name);
                    if (trans !== user.name) return trans;
                    const key = (user.name || '').split(' ').map((s, i) => i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
                    const transKey = t(key);
                    return transKey !== key ? transKey : user.name;
                  })()
                ) : user.name}
              </h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <p className="text-slate-500 text-sm">{user?.phone}</p>
              <div className={`flex flex-wrap items-center gap-3 mt-3 ${language === 'ur' ? 'justify-end' : ''}`}>
                <span className="badge-assigned capitalize">{t(worker?.serviceType)}</span>
                {worker?.verified ? (
                  <span className="badge-verified">✓ {t('verified')}</span>
                ) : (
                  <span className="badge-unverified">{t('unverified')}</span>
                )}
                {worker?.rating > 0 && (
                  <span className="flex items-center gap-1 text-sm text-slate-600">
                    <Star size={14} className={`text-accent-500 fill-accent-500 ${language === 'ur' ? 'mt-[7px]' : ''}`} />
                    {worker.rating} ({worker.totalRatings} {t('reviews')})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="card mb-6">
          <div className={`flex items-center justify-between ${language === 'ur' ? 'flex-row-reverse text-right' : ''}`}>
            <div>
              <h3 className="font-semibold text-dark">{t('availability')}</h3>
              <p className="text-slate-500 text-sm mt-0.5">
                {worker?.isAvailable ? t('availableDescription') : t('unavailableDescription')}
              </p>
            </div>
            <button onClick={handleToggle} disabled={toggling}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${worker?.isAvailable ? 'bg-secondary-500 hover:bg-secondary-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
              {worker?.isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              {toggling ? t('updating') : (worker?.isAvailable ? t('available') : t('unavailable'))}
            </button>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="card">
          <h3 className={`font-semibold text-dark mb-4 ${language === 'ur' ? 'text-right' : ''}`}>{t('editProfile')}</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className={language === 'ur' ? 'text-right' : ''}>
              <label className="form-label" htmlFor="wp-exp">{t('yearsExperience')}</label>
              <input id="wp-exp" type="number" min="0" value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className={`form-input ${language === 'ur' ? 'text-right' : ''}`} />
            </div>
            <div className={language === 'ur' ? 'text-right' : ''}>
              <label className="form-label" htmlFor="wp-bio">{t('bio')}</label>
              <textarea id="wp-bio" rows={4} value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder={t('bioPlaceholder')}
                className={`form-input resize-none ${language === 'ur' ? 'text-right' : ''}`} maxLength={500} />
              <p className={`text-xs text-slate-400 mt-1 ${language === 'ur' ? 'text-left' : ''}`}>{form.bio.length}/500</p>
            </div>
            <button type="submit" disabled={saving} className={`btn-primary flex items-center gap-2 ${language === 'ur' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <Save size={15} /> {saving ? t('saving') : t('saveChanges')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
