import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User, Wrench, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MobileNav = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
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
      { action: 'logout', label: t('signOut'), icon: LogOut, danger: true },
    ]
  };

  const currentTabs = tabs[user.role] || tabs.customer;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 pt-2 flex justify-around items-center z-[1000] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {currentTabs.map((tab) => {
        const Icon = tab.icon;

        // Action tab (e.g. Sign Out) — renders as a button, not a Link
        if (tab.action === 'logout') {
          return (
            <button
              key="logout"
              onClick={logout}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] transition-all"
            >
              <Icon size={22} strokeWidth={1.8} className="text-red-400" />
              <span className="text-[10px] mt-1 font-medium text-red-400">{tab.label}</span>
            </button>
          );
        }

        const active = isActive(tab.path);

        if (tab.primary) {
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center justify-center -mt-8"
            >
              <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-300 border-4 border-white">
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-semibold mt-1 text-primary-600">{tab.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] relative transition-all"
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary-500 rounded-full" />
            )}
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.8}
              className={`transition-colors ${active ? 'text-primary-600' : 'text-slate-400'}`}
            />
            <span className={`text-[10px] mt-1 font-medium transition-colors ${active ? 'text-primary-600' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileNav;
