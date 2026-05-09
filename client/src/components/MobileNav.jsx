import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Bell, User, Wrench, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MobileNav = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const tabs = {
    customer: [
      { path: '/', label: t('home'), icon: Home },
      { path: '/my-bookings', label: t('bookings'), icon: ClipboardList },
      { path: '/book', label: t('book'), icon: PlusCircle, primary: true },
      { path: '/profile/' + (user.slug || user._id), label: t('profile'), icon: User },
    ],
    worker: [
      { path: '/job-requests', label: t('jobs'), icon: Wrench },
      { path: '/active-jobs', label: t('active'), icon: ClipboardList },
      { path: '/', label: t('home'), icon: Home },
      { path: '/profile/' + (user.slug || user._id), label: t('profile'), icon: User },
    ],
    admin: [
      { path: '/admin', label: 'Dashboard', icon: Home },
      { path: '/admin/bookings', label: 'Bookings', icon: ClipboardList },
      { path: '/admin/verifications', label: 'ID Check', icon: Wrench },
    ]
  };

  const currentTabs = tabs[user.role] || tabs.customer;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 pb-safe pt-2 flex justify-around items-center z-[1000] shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {currentTabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.path);
        
        if (tab.primary) {
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center justify-center -mt-8"
            >
              <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-200 border-4 border-white">
                <Icon size={24} className={language === 'ur' ? 'mt-[5px]' : ''} />
              </div>
              <span className="text-[10px] font-medium mt-1 text-primary-600">{tab.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              active ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} className={language === 'ur' ? 'mt-[5px]' : ''} />
            <span className={`text-[10px] mt-1 font-medium ${active ? 'opacity-100' : 'opacity-80'}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileNav;
