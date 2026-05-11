import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [jobRequestCount, setJobRequestCount] = useState(0);
  const [supportUnreadCount, setSupportUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));
  const prevUnreadRef = useRef(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/notifications');
      const unreadOnly = data.notifications.filter(n => !n.isRead);
      const newUnreadCount = unreadOnly.length;
      
      // Specifically count support messages for admin
      if (user.role === 'admin') {
        const supportNotifs = unreadOnly.filter(n => n.link === '/admin/support' || n.title.toLowerCase().includes('support'));
        setSupportUnreadCount(supportNotifs.length);
      }

      // Specifically count job requests for workers
      if (user.role === 'worker') {
        const jobNotifications = unreadOnly.filter(n => 
          n.type === 'new_job' || n.title.toLowerCase().includes('job') || n.title.toLowerCase().includes('booking')
        );
        setJobRequestCount(jobNotifications.length);
      }

      // Play sound and show toast if unread count increased
      if (newUnreadCount > prevUnreadRef.current) {
        const latest = unreadOnly[0];
        if (latest) {
          toast.success(latest.title + ': ' + latest.message, {
            icon: '🔔',
            duration: 5000
          });
        }
        
        audioRef.current.play().catch(() => {});
        setRefreshTrigger(prev => prev + 1);
      }
      
      setNotifications(data.notifications);
      setUnreadCount(newUnreadCount);
      prevUnreadRef.current = newUnreadCount;
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  }, [user]);

  useEffect(() => {
    let timeoutId;
    
    const poll = async () => {
      if (user) {
        await fetchNotifications();
        timeoutId = setTimeout(poll, 8000); // Increased polling frequency to 8s
      }
    };

    if (user) {
      poll();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      // Re-fetch to sync counts accurately
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      setJobRequestCount(0);
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      jobRequestCount, 
      supportUnreadCount,
      refreshTrigger,
      fetchNotifications, 
      markAsRead, 
      markAllRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
