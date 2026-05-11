import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { FiMessageSquare, FiSend, FiUser, FiSearch, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const AdminSupport = () => {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingConvs, setFetchingConvs] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3'));
  const prevMsgCount = useRef(0);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      setMessages([]); 
      prevMsgCount.current = 0;
      isInitialLoad.current = true;
      fetchMessages(selectedConv._id);
      const interval = setInterval(() => fetchMessages(selectedConv._id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConv]);

  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        
        if (isInitialLoad.current || isNearBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: isInitialLoad.current ? 'auto' : 'smooth' });
          isInitialLoad.current = false;
        }
      }
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (err) {
      toast.error('Failed to load conversations');
    } finally {
      setFetchingConvs(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await api.get(`/chat/messages?userId=${userId}`);
      if (data.success) {
        // Trigger sound if new messages from customer arrived
        if (data.messages.length > prevMsgCount.current) {
          const lastMsg = data.messages[data.messages.length - 1];
          if (lastMsg && !lastMsg.isAdmin && !lastMsg.isBot) {
            audioRef.current.play().catch(() => {});
          }
        }
        setMessages(data.messages);
        prevMsgCount.current = data.messages.length;
      }
    } catch (err) {
      console.error('Failed to fetch messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || loading) return;

    setLoading(true);
    try {
      // Need to adjust sendMessage to support admin sending to a specific user
      await api.post('/chat/messages', { 
        content: newMessage, 
        receiver: selectedConv._id, 
        isAdmin: true 
      });
      setNewMessage('');
      isInitialLoad.current = true; // Force scroll to bottom for our own message
      fetchMessages(selectedConv._id);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] flex">
      {/* Sidebar - Conversation List */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{t('supportChats')}</h2>
          <div className="mt-4 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('searchUsers')} 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {fetchingConvs ? (
            <div className="p-10 text-center text-slate-400">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No active chats</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setSelectedConv(conv)}
                className={`w-full p-4 flex gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${
                  selectedConv?._id === conv._id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                  {conv.user?.profilePic ? (
                    <img src={conv.user.profilePic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                      {conv.user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-800 truncate">{conv.user?.name || 'Unknown User'}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-1">{conv.lastMessage}</p>
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-800">{selectedConv.user?.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                  selectedConv.user?.role === 'worker' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedConv.user?.role}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost p-2 text-slate-400 hover:text-slate-600"><FiClock /></button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30"
            >
              {messages.map((msg) => {
                const isFromAdmin = msg.isAdmin;
                return (
                  <div key={msg._id} className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl ${
                      isFromAdmin 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : msg.isBot 
                        ? 'bg-amber-50 text-amber-900 border border-amber-100'
                        : 'bg-white shadow-sm border border-slate-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-[10px] opacity-50 mt-2 block">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('typeAResponse')}
                className="flex-1 px-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading}
                className="btn-primary px-6 h-12"
              >
                <FiSend />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <FiMessageSquare size={64} className="mb-4 opacity-20" />
            <p>{t('selectConversation')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
