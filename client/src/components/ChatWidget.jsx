import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiInfo } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch (_) {}
}

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
  const prevUnreadRef = useRef(0);
  const isOpenRef = useRef(false);

  // Keep ref in sync so interval callbacks always see current value
  isOpenRef.current = isOpen;

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/chat/messages');
      if (!data.success) return;

      const msgs = data.messages;
      const unreadFromSupport = msgs.filter(m => !m.isRead && (m.isAdmin || m.isBot));
      const currentUnread = unreadFromSupport.length;

      // Beep + badge when NEW admin/bot messages arrive (regardless of open state)
      if (msgs.length > prevMsgCountRef.current) {
        const newMsgs = msgs.slice(prevMsgCountRef.current);
        const hasNewAdminMsg = newMsgs.some(m => m.isAdmin || m.isBot);
        if (hasNewAdminMsg) {
          playBeep();
          if (!isOpenRef.current) {
            setHasNew(true);
          }
        }
      }

      setUnreadCount(currentUnread);
      prevMsgCountRef.current = msgs.length;
      prevUnreadRef.current = currentUnread;
      setMessages(msgs);
    } catch (_) {}
  }, [user]);

  // Always-on background polling — slow when closed, fast when open
  useEffect(() => {
    if (!user) return;
    fetchMessages();
    const delay = isOpen ? 5000 : 10000;
    const id = setInterval(fetchMessages, delay);
    return () => clearInterval(id);
  }, [isOpen, user, fetchMessages]);

  // Scroll to bottom when messages change and chat is open
  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // Scroll to bottom instantly when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom('auto'), 50);
    }
  }, [isOpen, scrollToBottom]);

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
      fetchMessages();
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
            {/* Header */}
            <div className="bg-primary-600 p-4 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <FiMessageCircle className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{t('supportChat')}</h3>
                  <p className="text-xs text-white/80">{t('onlineBotAgents')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Messages */}
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

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('typeYourMessage')}
                className="flex-1 px-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading}
                className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(prev => !prev);
          setHasNew(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow relative bg-primary-600 ${
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
    </div>
  );
};

export default ChatWidget;
