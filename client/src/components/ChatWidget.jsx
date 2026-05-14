import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiInfo } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { playBeep } from '../utils/beep';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

const ChatWidget = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const prevMsgCountRef = useRef(0);
  const isOpenRef = useRef(false);
  const initialLoadRef = useRef(true);

  isOpenRef.current = isOpen;

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // bg=1 → background poll, do NOT mark as read on server
  // no param  → chat is open, mark as read
  const fetchMessages = useCallback(async (background = false) => {
    if (!user) return;
    try {
      const url = background ? '/chat/messages?bg=1' : '/chat/messages';
      const { data } = await api.get(url);
      if (!data.success) return;

      const msgs = data.messages;

      // On background poll: detect new admin/bot messages and beep+badge
      if (background) {
        const unreadAdminMsgs = msgs.filter(m => !m.isRead && (m.isAdmin || m.isBot));
        const newUnread = unreadAdminMsgs.length;

        // Beep when unread count grows (new message arrived since last check)
        if (!initialLoadRef.current && newUnread > unreadCount) {
          playBeep();
          setHasNew(true);
        }

        setUnreadCount(newUnread);
        initialLoadRef.current = false;
      }

      prevMsgCountRef.current = msgs.length;
      setMessages(msgs);
    } catch (_) {}
  }, [user, unreadCount]);

  // Background poll — always active when closed (every 5s)
  useEffect(() => {
    if (!user || isOpen) return;
    const id = setInterval(() => fetchMessages(true), 5000);
    return () => clearInterval(id);
  }, [user, isOpen, fetchMessages]);

  // Fast poll when chat is open (every 3s, marks as read)
  useEffect(() => {
    if (!user || !isOpen) return;
    fetchMessages(false); // immediate fetch + mark as read
    const id = setInterval(() => fetchMessages(false), 3000);
    return () => clearInterval(id);
  }, [user, isOpen]); // eslint-disable-line

  // Reset initial load flag when user changes
  useEffect(() => {
    initialLoadRef.current = true;
  }, [user]);

  // Scroll to bottom when messages change and chat is open
  useEffect(() => {
    if (isOpen && messages.length > 0) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNew(false);
    setUnreadCount(0);
    // Fetch immediately (marks messages as read)
    fetchMessages(false);
    setTimeout(() => scrollToBottom('auto'), 80);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    const content = newMessage;
    setNewMessage('');

    const tempMessage = {
      _id: Date.now().toString(),
      content,
      sender: user._id,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      await api.post('/chat/messages', { content });
      fetchMessages(false);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role === 'admin') return null;

  const chatHeader = (
    <div className="bg-primary-600 p-4 text-white flex items-center justify-between shadow-lg shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <FiMessageCircle className="text-xl" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{t('supportChat')}</h3>
          <p className="text-xs text-white/80">{t('onlineBotAgents')}</p>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(false)}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <FiX className="text-xl" />
      </button>
    </div>
  );

  const chatMessages = (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
      {messages.length === 0 && (
        <div className="text-center py-10 opacity-60">
          <FiInfo className="mx-auto text-3xl mb-2" />
          <p className="text-sm">Hi {user.name.split(' ')[0]}!</p>
          <p className="text-xs">{t('howCanWeHelpYou')}</p>
        </div>
      )}
      {messages.map((msg) => {
        const isMine = msg.sender === user._id && !msg.isBot && !msg.isAdmin;
        return (
          <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                isMine
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : msg.isBot
                  ? 'bg-amber-100 text-amber-900 rounded-tl-none border border-amber-200'
                  : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
              }`}
            >
              {msg.content}
              <div className={`text-[10px] mt-1 opacity-60 ${isMine ? 'text-right' : 'text-left'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );

  const chatInput = (
    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder={t('typeYourMessage')}
        className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
      />
      <button
        type="submit"
        disabled={!newMessage.trim() || loading}
        className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        <FiSend />
      </button>
    </form>
  );

  const toggleBtn = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={isOpen ? () => setIsOpen(false) : handleOpen}
      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-shadow relative bg-primary-600 ${
        hasNew && !isOpen ? 'animate-pulse ring-4 ring-primary-500/30' : ''
      }`}
    >
      {isOpen ? <FiX className="text-white text-2xl" /> : <FiMessageCircle className="text-white text-2xl" />}
      {!isOpen && (hasNew || unreadCount > 0) && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          {unreadCount > 0 ? unreadCount : '!'}
        </span>
      )}
    </motion.button>
  );

  if (isNative) {
    return (
      <>
        {/* Full-screen chat overlay on native */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-x-0 bg-white flex flex-col z-[1050]"
              style={{
                top: 'env(safe-area-inset-top)',
                bottom: 'calc(4.5rem + env(safe-area-inset-bottom))',
              }}
            >
              {chatHeader}
              {chatMessages}
              {chatInput}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB positioned above MobileNav */}
        <div
          className="fixed right-4 z-[1100]"
          style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom) + 12px)' }}
        >
          {toggleBtn}
        </div>
      </>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {chatHeader}
            {chatMessages}
            {chatInput}
          </motion.div>
        )}
      </AnimatePresence>
      {toggleBtn}
    </div>
  );
};

export default ChatWidget;
