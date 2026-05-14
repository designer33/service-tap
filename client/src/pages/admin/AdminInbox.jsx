import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Mail, Bell, Trash2, Loader2, Eye, EyeOff, Search, Users } from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleString('en-PK', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

const AdminInbox = () => {
  const [tab, setTab] = useState('contact');
  const [submissions, setSubmissions] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchContact = async () => {
    const { data } = await api.get('/admin/contact-submissions');
    setSubmissions(data.submissions);
  };

  const fetchNewsletter = async () => {
    const { data } = await api.get('/admin/newsletter');
    setSubscribers(data.subscribers);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchContact(), fetchNewsletter()])
      .catch(() => toast.error('Failed to load inbox.'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/admin/contact-submissions/${id}/read`);
      setSubmissions(prev => prev.map(s => s._id === id ? { ...s, isRead: true } : s));
    } catch {
      toast.error('Failed to mark as read.');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    try {
      await api.delete(`/admin/contact-submissions/${id}`);
      setSubmissions(prev => prev.filter(s => s._id !== id));
      toast.success('Deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await api.delete(`/admin/newsletter/${id}`);
      setSubscribers(prev => prev.filter(s => s._id !== id));
      toast.success('Subscriber removed.');
    } catch {
      toast.error('Failed to remove.');
    }
  };

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
    const sub = submissions.find(s => s._id === id);
    if (sub && !sub.isRead) handleMarkRead(id);
  };

  const unreadCount = submissions.filter(s => !s.isRead).length;

  const filteredSubmissions = submissions.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.subject || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={32} className="animate-spin text-primary-400" />
    </div>
  );

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">Inbox</h1>
          <p className="text-slate-500 mt-1">Contact form submissions and newsletter subscribers.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-100 rounded-2xl p-1.5 mb-6 w-fit">
          <button
            onClick={() => { setTab('contact'); setSearch(''); setExpanded(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'contact' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Mail size={15} />
            Contact Forms
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setTab('newsletter'); setSearch(''); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'newsletter' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={15} />
            Newsletter
            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
              {subscribers.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={tab === 'contact' ? 'Search by name, email, or subject…' : 'Search by email…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>

        {/* ── Contact Submissions ── */}
        {tab === 'contact' && (
          <>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Mail size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No contact submissions yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredSubmissions.map(sub => (
                  <div
                    key={sub._id}
                    className={`bg-white rounded-2xl border transition-all ${sub.isRead ? 'border-slate-100' : 'border-primary-200 shadow-sm'}`}
                  >
                    {/* Row */}
                    <button
                      onClick={() => handleExpand(sub._id)}
                      className="w-full text-left px-5 py-4 flex items-start gap-4"
                    >
                      {/* Unread dot */}
                      <div className="mt-1.5 shrink-0">
                        {sub.isRead
                          ? <EyeOff size={15} className="text-slate-300" />
                          : <div className="w-2.5 h-2.5 rounded-full bg-primary-500 mt-0.5" />
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className={`font-bold text-sm ${sub.isRead ? 'text-slate-600' : 'text-dark'}`}>
                            {sub.name}
                          </span>
                          <span className="text-xs text-slate-400">{sub.email}</span>
                          {!sub.isRead && (
                            <span className="text-[10px] bg-primary-100 text-primary-600 font-bold px-2 py-0.5 rounded-full">NEW</span>
                          )}
                        </div>
                        <p className={`text-sm truncate ${sub.isRead ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                          {sub.subject || '(No subject)'} — {sub.message}
                        </p>
                      </div>

                      <span className="text-xs text-slate-400 shrink-0 mt-0.5">{formatDate(sub.createdAt)}</span>
                    </button>

                    {/* Expanded message */}
                    {expanded === sub._id && (
                      <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</p>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span><strong>From:</strong> {sub.name}</span>
                          <span>·</span>
                          <a href={`mailto:${sub.email}`} className="text-primary-600 hover:underline font-medium">{sub.email}</a>
                          {sub.subject && <><span>·</span><span><strong>Subject:</strong> {sub.subject}</span></>}
                        </div>
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={() => handleDeleteContact(sub._id)}
                            className="flex items-center gap-1.5 text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Newsletter Subscribers ── */}
        {tab === 'newsletter' && (
          <>
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Bell size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No newsletter subscribers yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider grid grid-cols-[1fr_auto_auto]">
                  <span>Email</span>
                  <span className="text-right pr-8">Subscribed</span>
                  <span />
                </div>
                {filteredSubscribers.map((sub, i) => (
                  <div
                    key={sub._id}
                    className={`grid grid-cols-[1fr_auto_auto] items-center px-5 py-3.5 gap-4 ${i !== filteredSubscribers.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-slate-50 transition-colors`}
                  >
                    <span className="text-sm font-medium text-slate-700">{sub.email}</span>
                    <span className="text-xs text-slate-400">{formatDate(sub.createdAt)}</span>
                    <button
                      onClick={() => handleDeleteSubscriber(sub._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;
