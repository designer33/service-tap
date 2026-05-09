import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact/contact', formData);
      toast.success(t('messageSentSuccess') || 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || t('messageSentError') || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in bg-surface min-h-screen py-16">
      <div className="page-container max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark mb-3">{t('contact')}</h1>
          <p className="text-slate-500 max-w-xl mx-auto">{t('contactHeroSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className={`card p-6 flex items-start gap-4 ${language === 'ur' ? 'text-right' : ''}`}>
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark mb-1">{t('callUs')}</h3>
                <p className="text-sm text-slate-500" dir="ltr">+1 (234) 567-890</p>
                <p className="text-xs text-slate-400">{t('monFri')}</p>
              </div>
            </div>

            <div className={`card p-6 flex items-start gap-4 ${language === 'ur' ? 'text-right' : ''}`}>
              <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center text-secondary-600 shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark mb-1">{t('emailUs')}</h3>
                <p className="text-sm text-slate-500">support@serviceknock.com</p>
                <p className="text-xs text-slate-400">{t('replyWithin24')}</p>
              </div>
            </div>

            <div className={`card p-6 flex items-start gap-4 ${language === 'ur' ? 'text-right' : ''}`}>
              <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark mb-1">{t('visitUs')}</h3>
                <p className="text-sm text-slate-500">{t('addressFull')}</p>
                <p className="text-xs text-slate-400">{t('headquarters')}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 card p-8 shadow-lg">
            <form onSubmit={handleSubmit} className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${language === 'ur' ? 'text-right' : ''}`}>
              <div>
                <label className="form-label">{t('name')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="John Doe" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">{t('email')}</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john@example.com" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">{t('subject')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={t('howCanWeHelp')} 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">{t('message')}</label>
                <textarea 
                  rows={5} 
                  className="form-input resize-none" 
                  placeholder={t('yourMessageHere')}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <div className="sm:col-span-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    language === 'ur' ? null : <Send size={18} />
                  )}
                  {loading ? t('submitting') : t('sendMessage')}
                  {!loading && language === 'ur' && <Send size={18} style={{ transform: 'rotate(180deg)' }} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
