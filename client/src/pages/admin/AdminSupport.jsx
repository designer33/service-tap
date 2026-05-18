import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../api/axios';
import { FiMessageSquare, FiSend, FiUser, FiSearch, FiClock, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { playBeep } from '../../utils/beep';

const AdminSupport = () => {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingConvs, setFetchingConvs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false); // mobile: false=list, true=chat

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevMsgCountRef = useRef(0);
  const prevTotalUnreadRef = useRef(0);
  const isInitialLoad = useRef(true);
  const selectedConvRef = useRef(null);

  selectedConvRef.current = selectedConv;

  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      if (!data.success) return;

      const convs = data.conversations;
      const totalUnread = convs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

      if (totalUnread > prevTotalUnreadRef.current) {
        playBeep();
        const newConvs = convs.filter(c => {
          const isSelected = selectedConvRef.current?._id === c._id;
          return !isSelected && c.unreadCount > 0;
        });
        if (newConvs.length > 0) {
          const first = newConvs[0];
          toast(`New message from ${first.user?.name || 'a user'}`, { icon: '💬' });
        }
      }

      prevTotalUnreadRef.current = totalUnread;
      setConversations(convs);
    } catch (_) {
    } finally {
      setFetchingConvs(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    const id = setInterval(fetchConversations, 5000);
    return () => clearInterval(id);
  }, [fetchConversations]);

  const fetchMessages = useCallback(async (userId) => {
    try {
      const { data } = await api.get(`/chat/messages?userId=${userId}`);
      if (!data.success) return;

      const msgs = data.messages;

      if (msgs.length > prevMsgCountRef.current) {
        const newMsgs = msgs.slice(prevMsgCountRef.current);
        const hasNewUserMsg = newMsgs.some(m => !m.isAdmin && !m.isBot);
        if (hasNewUserMsg) playBeep();
      }

      prevMsgCountRef.current = msgs.length;
      setMessages(msgs);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!selectedConv) return;
    isInitialLoad.current = true;
    prevMsgCountRef.current = 0;
    fetchMessages(selectedConv._id);
    const id = setInterval(() => fetchMessages(selectedConv._id), 5000);
    return () => clearInterval(id);
  }, [selectedConv, fetchMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    if (isInitialLoad.current || isNearBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: isInitialLoad.current ? 'auto' : 'smooth',
      });
      isInitialLoad.current = false;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || loading) return;

    setLoading(true);
    try {
      await api.post('/chat/messages', {
        content: newMessage,
        receiver: selectedConv._id,
        isAdmin: true,
      });
      setNewMessage('');
      fetchMessages(selectedConv._id);
      const container = messagesContainerRef.current;
      if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    } catch (_) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = (conv) => {
    setSelectedConv(conv);
    setShowChat(true);
    prevTotalUnreadRef.current = Math.max(0, prevTotalUnreadRef.current - (conv.unreadCount || 0));
  };

  const filteredConvs = conversations.filter(conv =>
    !searchQuery || conv.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Sidebar (conversation list) ──────────────────────────────────────────
  const Sidebar = (
    <div className={`
      w-full md:w-80 bg-white border-r border-slate-200 flex flex-col
      ${showChat ? 'hidden md:flex' : 'flex'}
    `}>
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg md:text-xl font-bold text-slate-800">{t('supportChats')}</h2>
        <div className="mt-3 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={t('searchUsers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-lg text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {fetchingConvs ? (
          <div className="p-10 text-center text-slate-400 text-sm">Loading...</div>
        ) : filteredConvs.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No active chats</div>
        ) : (
          filteredConvs.map((conv) => (
            <button
              key={conv._id}
              onClick={() => selectConversation(conv)}
              className={`w-full p-3 md:p-4 flex gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100 ${
                selectedConv?._id === conv._id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                {conv.user?.profilePic ? (
                  <img src={conv.user.profilePic} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-sm">
                    {conv.user?.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-semibold text-slate-800 truncate text-sm">{conv.user?.name || 'Unknown User'}</h4>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                {conv.unreadCount > 0 && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-primary-500 text-white text-[10px] rounded-full">
                    {conv.unreadCount} new
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  // ── Chat panel ───────────────────────────────────────────────────────────
  const ChatPanel = (
    <div className={`
      flex-1 flex flex-col bg-white min-w-0
      ${!showChat ? 'hidden md:flex' : 'flex'}
    `}>
      {selectedConv ? (
        <>
          {/* Chat header */}
          <div className="p-3 md:p-4 border-b border-slate-200 flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              onClick={() => setShowChat(false)}
            >
              <FiArrowLeft size={20} />
            </button>
            <div className="w-9 h-9 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
              {selectedConv.user?.profilePic ? (
                <img src={selectedConv.user.profilePic} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-sm">
                  {selectedConv.user?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">{selectedConv.user?.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                selectedConv.user?.role === 'worker' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedConv.user?.role}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 bg-slate-50/30"
          >
            {messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] px-3 py-2.5 md:p-4 rounded-2xl ${
                  msg.isAdmin
                    ? 'bg-slate-800 text-white rounded-tr-none'
                    : msg.isBot
                    ? 'bg-amber-50 text-amber-900 border border-amber-100'
                    : 'bg-white shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] opacity-50 mt-1.5 block">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('typeAResponse')}
              className="flex-1 px-3 md:px-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className="btn-primary px-4 md:px-6 h-12 flex-shrink-0"
            >
              <FiSend size={18} />
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
          <FiMessageSquare size={56} className="mb-4 opacity-20" />
          <p className="text-sm text-center">{t('selectConversation')}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-slate-50 h-[calc(100vh-64px)] flex overflow-hidden">
      {Sidebar}
      {ChatPanel}
    </div>
  );
};

export default AdminSupport;
