import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ShieldCheck, ShieldX, Loader2, User, CheckCircle, XCircle, Clock, Eye, X } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const statusConfig = {
  pending:  { label: 'Pending Review', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Approved',       color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  rejected: { label: 'Rejected',       color: 'bg-red-100 text-red-700',      icon: XCircle },
};

const AdminVerifications = () => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('pending');
  const [viewImage, setViewImage] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [processing, setProcessing] = useState(null);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/verifications');
      setUsers(data.users);
    } catch { toast.error('Failed to load verifications.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVerifications(); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this identity verification?')) return;
    setProcessing(id);
    try {
      const { data } = await api.patch(`/admin/verifications/${id}/approve`);
      toast.success(data.message);
      setUsers(u => u.map(x => x._id === id ? { ...x, verificationStatus: 'approved', isVerified: true, cnicImage: null } : x));
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
    finally { setProcessing(null); }
  };

  const handleRejectSubmit = async () => {
    if (!rejectTarget) return;
    setProcessing(rejectTarget);
    try {
      const { data } = await api.patch(`/admin/verifications/${rejectTarget}/reject`, { note: rejectNote });
      toast.success(data.message);
      setUsers(u => u.map(x => x._id === rejectTarget ? { ...x, verificationStatus: 'rejected', cnicImage: null } : x));
      setRejectTarget(null);
      setRejectNote('');
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
    finally { setProcessing(null); }
  };

  const filtered = users.filter(u => filter === 'all' || u.verificationStatus === filter);
  const counts = { all: users.length, pending: users.filter(u=>u.verificationStatus==='pending').length, approved: users.filter(u=>u.verificationStatus==='approved').length, rejected: users.filter(u=>u.verificationStatus==='rejected').length };

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="section-title">ID Verifications</h1>
          <p className="text-slate-500 mt-1">Review CNIC submissions and verify user identities.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all','pending','approved','rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all flex items-center gap-2 ${filter===s ? 'bg-primary-500 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'}`}>
              {s} <span className={`text-[10px] px-1.5 rounded-full ${filter===s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{counts[s]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck size={30} className="text-slate-300" /></div>
            <p className="text-slate-500 font-medium">No {filter} verification requests.</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CNIC</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CNIC Image</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(u => {
                    const cfg = statusConfig[u.verificationStatus] || statusConfig.pending;
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border-2 border-slate-100 shadow-sm shrink-0 ${u.role==='worker' ? 'bg-slate-100' : 'bg-primary-50'}`}>
                              {u.profilePic ? (
                                <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover" />
                              ) : (
                                <User size={20} className="text-slate-300" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-dark leading-tight">{u.name}</p>
                              <p className="text-[11px] text-slate-400 mb-1">{u.email}</p>
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${u.role==='worker' ? 'bg-slate-100 text-slate-600' : 'bg-primary-50 text-primary-600'}`}>{u.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-mono font-bold text-dark tracking-wider">{u.cnic}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(u.createdAt)}</td>
                        <td className="px-6 py-4">
                          {u.cnicImage ? (
                            <button onClick={() => setViewImage({ profilePic: u.profilePic, cnicImage: u.cnicImage })}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-xl text-xs font-bold hover:bg-primary-100 transition-colors">
                              <Eye size={14} /> View & Compare
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">{u.verificationStatus === 'approved' ? 'Removed after approval' : 'No image'}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
                            <StatusIcon size={12} /> {cfg.label}
                          </span>
                          {u.verificationNote && (
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[160px] truncate" title={u.verificationNote}>{u.verificationNote}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {u.verificationStatus === 'pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleApprove(u._id)} disabled={processing === u._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold transition-colors disabled:opacity-50">
                                {processing === u._id ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />} Approve
                              </button>
                              <button onClick={() => { setRejectTarget(u._id); setRejectNote(''); }} disabled={processing === u._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors disabled:opacity-50">
                                <ShieldX size={14} /> Reject
                              </button>
                            </div>
                          )}
                          {u.verificationStatus !== 'pending' && (
                            <span className="text-xs text-slate-400 italic">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Image Comparison Viewer Modal */}
      {viewImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setViewImage(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewImage(null)} className="absolute -top-12 right-0 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-all">
              <X size={28} />
            </button>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Profile Photo */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <User size={16} className="text-primary-500" />
                  <span className="font-bold text-sm text-dark">Profile Photo</span>
                </div>
                <div className="p-6 flex items-center justify-center bg-slate-50/50">
                  <img src={viewImage.profilePic} alt="Profile" className="max-w-full h-auto max-h-[60vh] rounded-2xl shadow-lg border-4 border-white object-contain" />
                </div>
              </div>
              
              {/* CNIC Document */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="font-bold text-sm text-dark">CNIC Document</span>
                </div>
                <div className="p-6 flex items-center justify-center">
                  <img src={viewImage.cnicImage} alt="CNIC Document" className="max-w-full h-auto max-h-[60vh] rounded-xl shadow-lg object-contain" />
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-white/60 text-xs font-medium">Click outside to close • Compare faces to verify identity</p>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-lg font-bold text-dark mb-1">Reject Verification</h2>
            <p className="text-sm text-slate-500 mb-4">Provide a reason so the user knows what to fix and resubmit.</p>
            <textarea
              rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)}
              placeholder="e.g. Image is blurry, CNIC number does not match, photo unclear..."
              className="form-input resize-none text-sm mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectTarget(null)} className="flex-1 btn-ghost">Cancel</button>
              <button onClick={handleRejectSubmit} disabled={processing === rejectTarget}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {processing === rejectTarget ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerifications;
