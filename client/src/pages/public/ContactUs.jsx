import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Clock, MessageSquare, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      toast.success(language === 'ur' ? 'پیغام بھیج دیا گیا! ہم جلد رابطہ کریں گے۔' : 'Message sent! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || (language === 'ur' ? 'پیغام بھیجنے میں خرابی ہوئی۔' : 'Failed to send message. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      emoji: '📞', icon: Phone,
      title: t('callUs'),
      line1: '03438485818',
      link: 'tel:03438485818',
      line2: t('monFri'),
      color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100',
    },
    {
      emoji: '✉️', icon: Mail,
      title: t('emailUs'),
      line1: 'irfanrashidkhan@gmail.com',
      link: 'mailto:irfanrashidkhan@gmail.com',
      line2: t('replyWithin24'),
      color: 'text-secondary-600', bg: 'bg-secondary-50', border: 'border-secondary-100',
    },
    {
      emoji: '📍', icon: MapPin,
      title: t('visitUs'),
      line1: '6th Road, Rawalpindi',
      line2: language === 'ur' ? 'پاکستان بھر میں دستیاب' : 'Available across Pakistan',
      color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-100',
    },
  ];

  const quickLinks = [
    { emoji: '❓', label: language === 'ur' ? 'عام سوالات' : 'FAQs', to: '/faqs' },
    { emoji: '📋', label: language === 'ur' ? 'شرائط و ضوابط' : 'Terms & Conditions', to: '/terms' },
    { emoji: '🔒', label: language === 'ur' ? 'پرائیویسی پالیسی' : 'Privacy Policy', to: '/privacy' },
  ];

  return (
    <div className={`animate-fade-in bg-surface min-h-screen ${language === 'ur' ? 'text-right' : ''}`}>

      {/* ── Hero ── */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-6">
            💬 {language === 'ur' ? 'ہم آپ کی مدد کے لیے حاضر ہیں' : 'We\'re here to help'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{t('contactUs')}</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">{t('contactHeroSubtitle')}</p>
        </div>
      </section>

      <div className="page-container max-w-6xl py-16">

        {/* ── Contact Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactCards.map(({ emoji, title, line1, line2, color, bg, border, link }) => (
            link ? (
              <a key={title} href={link} className={`card border ${border} p-6 flex items-start gap-4 hover:shadow-lg transition-all group cursor-pointer active:scale-95`}>
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                  {emoji}
                </div>
                <div>
                  <h3 className={`font-extrabold ${color} mb-1`}>{title}</h3>
                  <p className="text-sm font-black text-dark" dir="ltr">{line1}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{line2}</p>
                </div>
              </a>
            ) : (
              <div key={title} className={`card border ${border} p-6 flex items-start gap-4 hover:shadow-lg transition-all group`}>
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                  {emoji}
                </div>
                <div>
                  <h3 className={`font-extrabold ${color} mb-1`}>{title}</h3>
                  <p className="text-sm font-semibold text-dark" dir="ltr">{line1}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{line2}</p>
                </div>
              </div>
            )
          ))}
        </div>

        {/* ── Main Grid: Form + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Form */}
          <div className="lg:col-span-2 card shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-xl">📝</div>
              <div>
                <h2 className="text-xl font-extrabold text-dark">
                  {language === 'ur' ? 'پیغام بھیجیں' : 'Send Us a Message'}
                </h2>
                <p className="text-sm text-slate-400">
                  {language === 'ur' ? 'ہم 24 گھنٹوں میں جواب دیں گے' : 'We respond within 24 hours'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label">{t('name')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={language === 'ur' ? 'آپ کا نام' : 'Ali Ahmed'}
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
                  placeholder={language === 'ur' ? 'ای میل ایڈریس' : 'ali@example.com'}
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
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {loading ? t('submitting') : t('sendMessage')}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">

            {/* Response time */}
            <div className="card p-6 border border-secondary-100 bg-gradient-to-br from-secondary-50 to-white">
              <div className="flex items-center gap-3 mb-3">
                <Clock size={20} className="text-secondary-600" />
                <h3 className="font-extrabold text-dark">
                  {language === 'ur' ? 'رسپانس ٹائم' : 'Response Time'}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ur' ? 'ای میل' : 'Email'}</span>
                  <span className="font-semibold text-secondary-600">{'< 24 hrs'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ur' ? 'فون' : 'Phone'}</span>
                  <span className="font-semibold text-secondary-600">
                    {language === 'ur' ? 'فوری' : 'Instant'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ur' ? 'شکایت' : 'Disputes'}</span>
                  <span className="font-semibold text-secondary-600">{'< 48 hrs'}</span>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="card p-6 border border-primary-100">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle size={20} className="text-primary-600" />
                <h3 className="font-extrabold text-dark">
                  {language === 'ur' ? 'فوری مدد' : 'Quick Help'}
                </h3>
              </div>
              <div className="space-y-2">
                {quickLinks.map(({ emoji, label, to }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600 hover:text-primary-600">
                    <span>{emoji}</span> {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support hours */}
            <div className="card p-6 border border-accent-100 bg-gradient-to-br from-accent-50 to-white">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare size={20} className="text-accent-600" />
                <h3 className="font-extrabold text-dark">
                  {language === 'ur' ? 'سپورٹ کے اوقات' : 'Support Hours'}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'ur'
                  ? 'پیر سے جمعہ، صبح 9 بجے سے شام 6 بجے تک۔ ہفتہ اور اتوار: صبح 10 بجے سے دوپہر 2 بجے تک۔'
                  : 'Mon–Fri: 9 AM – 6 PM\nSaturday: 10 AM – 2 PM\nSunday: Closed'}
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-secondary-600">
                  {language === 'ur' ? 'ابھی دستیاب' : 'Currently Available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
