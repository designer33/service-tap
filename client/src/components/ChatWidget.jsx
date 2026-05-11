import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser, FiInfo } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const ChatWidget = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      scrollToBottom();
      // Start polling every 5 seconds
      pollingRef.current = setInterval(fetchMessages, 5000);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isOpen]);

  useEffect(scrollToBottom, [messages]);

  const [hasNew, setHasNew] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef(new Audio('https://www.soundjay.com/button/sounds/button-3.mp3'));
  const prevMsgCount = useRef(0);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/chat/messages');
      if (data.success) {
        // Find unread messages from admin or bot
        const unreadFromSupport = data.messages.filter(m => !m.isRead && (m.isAdmin || m.isBot));
        setUnreadCount(unreadFromSupport.length);

        if (unreadFromSupport.length > 0 && data.messages.length > prevMsgCount.current) {
          if (!isOpen) {
            setHasNew(true);
            audioRef.current.play().catch(() => {});
          }
        }
        setMessages(data.messages);
        prevMsgCount.current = data.messages.length;
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    const content = newMessage;
    setNewMessage('');

    // Optimistic update
    const tempMessage = {
      _id: Date.now().toString(),
      content,
      sender: user._id,
      createdAt: new Date().toISOString(),
      isTemp: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      await api.post('/chat/messages', { content });
      fetchMessages(); // Refresh to get bot response
    } catch (err) {
      console.error('Failed to send message:', err);
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
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-60">
                  <FiInfo className="mx-auto text-3xl mb-2" />
                  <p className="text-sm">Hi {user.name.split(' ')[0]}! 👋</p>
                  <p className="text-xs">{t('howCanWeHelpYou')}</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMine = msg.sender === user._id && !msg.isBot && !msg.isAdmin;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
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

            {/* Input Area */}
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNew(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow relative ${
          hasNew && !isOpen ? 'bg-primary-600 animate-pulse ring-4 ring-primary-500/30' : 'bg-primary-600'
        }`}
      >
        {isOpen ? <FiX className="text-2xl" /> : <FiMessageCircle className="text-2xl" />}
        {(!isOpen && (hasNew || unreadCount > 0)) && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 0 ? unreadCount : '!'}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
