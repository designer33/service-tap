import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Phone, Mail, MapPin, Loader2, Download, MonitorSmartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';
import usePWAInstall from '../hooks/usePWAInstall';
import toast from 'react-hot-toast';

const Footer = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { canInstall, install } = usePWAInstall();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/contact/newsletter', { email });
      toast.success(t('newsletterSuccess') || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || t('newsletterError') || 'Subscription failed.');
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { key: 'electrician', label: t('electrician') },
    { key: 'plumber', label: t('plumber') },
    { key: 'ac_fridge_repair', label: t('ac_fridge_repair') },
    { key: 'carpenter', label: t('carpenter') },
    { key: 'painter', label: t('painter') },
    { key: 'mason', label: t('mason') },
    { key: 'steel_fixer', label: t('steel_fixer') },
    { key: 'labour', label: t('labour') },
    { key: 'tile_fixer', label: t('tile_fixer') }
  ];

  const supportLinks = [
    { label: t('aboutUs'), to: '/about' },
    { label: t('contactUs'), to: '/contact' },
    { label: t('faqs'), to: '/faqs' },
    { label: t('ourBlog'), to: '/blog' },
    { label: t('privacyPolicy'), to: '/privacy' },
    { label: t('termsConditions'), to: '/terms' },
  ];

  return (
    <footer className="bg-dark text-slate-300">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <img 
                src={language === 'ur' ? "/logo-service-knock-white-urdu.png" : "/logo-service-knock-white.png"} 
                alt="Service Knock" 
                className="h-10 w-auto object-contain" 
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {[
                { name: 'Facebook',  href: 'https://www.facebook.com/serviceknock/', color: 'hover:bg-blue-600', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { name: 'X',         href: 'https://x.com/serviceknock1', color: 'hover:bg-black', path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z' },
                { name: 'Instagram', href: 'https://www.instagram.com/serviceknock1/', color: 'hover:bg-pink-600', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259 0 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.163 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { name: 'TikTok',    href: 'https://www.tiktok.com/@serviceknock', color: 'hover:bg-slate-900', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.28-2.26.74-4.63 2.58-5.91 1.64-1.15 3.7-1.49 5.66-1.01v4.28c-1.19-.38-2.55-.13-3.5.62-.83.62-1.31 1.71-1.19 2.73.11 1.27 1.25 2.37 2.53 2.39 1.28.02 2.4-.73 2.85-1.93.17-.47.22-.97.22-1.47V.02z' },
                { name: 'LinkedIn',  href: 'https://www.linkedin.com/company/service-knock/', color: 'hover:bg-blue-700', path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.025-3.062-1.865-3.062-1.867 0-2.153 1.459-2.153 2.966v5.7h-3v-11h2.88v1.503h.04c.401-.759 1.381-1.56 2.839-1.56 3.039 0 3.596 1.999 3.596 4.599v6.458z' },

              ].map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className={`w-9 h-9 bg-slate-800 ${social.color} rounded-full flex items-center justify-center transition-colors`} aria-label={social.name}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>

            {/* App download buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {/* Android APK */}
              <a
                href="/Service-Knock.apk"
                download="Service-Knock.apk"
                className="inline-flex items-center gap-3 bg-slate-800 hover:bg-primary-600 border border-slate-700 hover:border-primary-500 rounded-xl px-4 py-3 transition-all group"
              >
                <div className="bg-primary-500 group-hover:bg-white rounded-lg p-1.5 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white group-hover:fill-primary-600 transition-colors">
                    <path d="M17.523 15.341 13 9.454V3h-2v6.454l-4.523 5.887A2 2 0 0 0 8.059 18h7.882a2 2 0 0 0 1.582-3.659zM6 20h12v2H6z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 group-hover:text-sky-100 leading-none mb-0.5 transition-colors">Download for</div>
                  <div className="text-sm font-bold text-white leading-none">Android App</div>
                </div>
                <Download size={14} className="text-slate-500 group-hover:text-white ml-1 transition-colors" />
              </a>

              {/* PWA install */}
              {canInstall && (
                <button
                  onClick={install}
                  className="inline-flex items-center gap-3 bg-slate-800 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 rounded-xl px-4 py-3 transition-all group"
                >
                  <div className="bg-emerald-500 group-hover:bg-white rounded-lg p-1.5 transition-colors">
                    <MonitorSmartphone size={20} className="text-white group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 leading-none mb-0.5 transition-colors">Install as</div>
                    <div className="text-sm font-bold text-white leading-none">Web App</div>
                  </div>
                  <Download size={14} className="text-slate-500 group-hover:text-white ml-1 transition-colors" />
                </button>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-4">{t('services')}</h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.key}>
                  <Link to="/services" className="hover:text-primary-400 transition-colors">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-primary-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="text-white font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className={`text-primary-400 shrink-0 ${language === 'ur' ? 'mt-[10px]' : 'mt-0.5'}`} />
                <span>{t('addressFull')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className={`text-primary-400 shrink-0 ${language === 'ur' ? 'mt-[10px]' : ''}`} />
                <a href="tel:03438485818" className="hover:text-primary-400 transition-colors" dir="ltr">03438485818</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className={`text-primary-400 shrink-0 ${language === 'ur' ? 'mt-[10px]' : ''}`} />
                <a href="mailto:support@serviceknock.com" className="hover:text-primary-400 transition-colors">support@serviceknock.com</a>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">{t('newsletter')}</h4>
              <form className="flex gap-2" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletterPlaceholder')} 
                  className="bg-slate-800 border-none rounded-lg px-3 py-2 text-xs w-full focus:ring-1 focus:ring-primary-500 text-white outline-none"
                />
                <button 
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Service Knock. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
