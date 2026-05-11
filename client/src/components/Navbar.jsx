import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, Menu, X, Zap, User, Briefcase, LayoutDashboard, Bell, ChevronDown, Globe, ShieldOff, MessageSquare } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { jobRequestCount, supportUnreadCount, unreadCount } = useNotifications();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = {
    customer: [
      { to: '/book', label: t('bookService'), icon: Zap },
      { to: '/my-bookings', label: t('myBookings'), icon: Briefcase },
    ],
    worker: [
      { to: '/job-requests', label: t('jobRequests'), icon: Briefcase },
    ],
    admin: [
      { to: '/admin', label: t('dashboard'), icon: LayoutDashboard },
      { to: '/admin/bookings', label: t('myBookings'), icon: Briefcase },
      { to: '/admin/workers', label: t('workers'), icon: User },
      { to: '/admin/support', label: t('support'), icon: MessageSquare },
    ],
  };

  const links = user ? [
    ...(navLinks[user.role] || []),
    { to: `/profile/${user.slug || user._id}`, label: t('myProfile'), icon: User }
  ] : [];

  return (
    <>
      {user?.isBlocked && (
        <div className="bg-red-600 text-white py-2.5 px-4 text-center text-sm font-bold animate-pulse sticky top-0 z-[60] shadow-lg">
          <div className="page-container flex items-center justify-center gap-2">
            <ShieldOff size={18} />
            {t('blockedAccountAlert')}
          </div>
        </div>
      )}
      <nav className={`sticky ${user?.isBlocked ? 'top-[44px]' : 'top-0'} z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-[74px]">
            {/* Logo */}
            <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0">
              <img
                src={language === 'ur' ? "/logo-service-knock-urdu.png" : "/logo-service-knock.png"}
                alt="Service Knock"
                className="w-auto object-contain"
                style={{ height: '3rem' }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {!user && (
                <>
                  <NavLink to="/" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`
                  }>{t('home')}</NavLink>
                  <NavLink to="/services" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`
                  }>{t('services')}</NavLink>
                  <NavLink to="/about" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`
                  }>{t('about')}</NavLink>
                  <NavLink to="/contact" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`
                  }>{t('contact')}</NavLink>
                </>
              )}
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`
                }>
                  <Icon size={15} />
                  {label}
                  {to === '/job-requests' && jobRequestCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                      {jobRequestCount}
                    </span>
                  )}
                  {to === '/admin/support' && supportUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                      {supportUnreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-xs font-bold text-slate-600"
              >
                <Globe size={14} className="text-primary-500" />
                <span className={language === 'ur' ? '-mt-1' : ''}>{language === 'en' ? 'اردو' : 'English'}</span>
              </button>

              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <NotificationDropdown />

                    {/* Profile Dropdown */}
                    <div className="relative group">
                      <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-primary-700 font-bold">
                          {user.profilePic ? (
                            <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{(user.name || '?').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="hidden lg:block">
                          <p className="text-sm font-bold text-dark leading-tight">
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
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            {user.role === 'worker' ? (t(user.serviceType) || t('worker')) : t('customer')}
                          </p>
                        </div>
                        <ChevronDown size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute inset-inline-end-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-[100]">

                        <Link to={`/profile/${user.slug || user._id}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          <User size={16} /> {t('myProfile')}
                        </Link>

                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                            <LayoutDashboard size={16} /> {t('adminPanel')}
                          </Link>
                        )}

                        <div className="border-t border-slate-50 mt-1 pt-1">
                          <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors font-medium">
                            <LogOut size={16} /> {t('signOut')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="btn-outline py-2 px-5 text-sm font-semibold rounded-xl">{t('login')}</Link>
                    <Link to="/register" className="btn-primary py-2 px-5 text-sm font-semibold rounded-xl">{t('getStarted')}</Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in">
            <div className="page-container py-4 flex flex-col gap-1">
              {user && (
                <Link
                  to={`/profile/${user.slug || user._id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 mb-2 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      (user.name || '?').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-lg">
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
                    </p>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide">
                      {user.role === 'worker' ? (t(user.serviceType) || t('worker')) : t('customer')}
                    </p>
                  </div>
                </Link>
              )}
              {!user && (
                <>
                  <NavLink to="/" onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">{t('home')}</NavLink>
                  <NavLink to="/services" onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">{t('services')}</NavLink>
                  <NavLink to="/about" onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">{t('about')}</NavLink>
                  <NavLink to="/contact" onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">{t('contact')}</NavLink>
                </>
              )}
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    {label}
                  </div>
                  {to === '/job-requests' && jobRequestCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {jobRequestCount}
                    </span>
                  )}
                </NavLink>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-3">
                {user ? (
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl">
                    <LogOut size={16} /> {t('signOut')}
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 px-1">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm text-center">{t('login')}</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center">{t('getStarted')}</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

