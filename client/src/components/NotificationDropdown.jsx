import { useState, useEffect, useRef } from 'react';
import { Bell, Clock, CheckCircle, Info, AlertTriangle, MessageSquare, Briefcase, Zap, X, Check, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { formatDateTime } from '../utils/formatDate';
import { Link } from 'react-router-dom';

import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[60] animate-slide-up">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-dark">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                  onClick={() => {
                    if (!n.isRead) markAsRead(n._id);
                    setOpen(false);
                  }}
                >
                  <Link to={n.link || '#'} className="block">
                    <p className={`text-sm ${!n.isRead ? 'font-bold text-dark' : 'text-slate-600'}`}>{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                      <Clock size={10} /> {formatDateTime(n.createdAt)}
                    </div>
                  </Link>
                  {!n.isRead && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell size={20} className="text-slate-300" />
                </div>
                <p className="text-sm text-slate-500">No notifications yet</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 bg-slate-50 text-center">
              <button className="text-xs font-bold text-slate-500 hover:text-dark">
                View all history
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
