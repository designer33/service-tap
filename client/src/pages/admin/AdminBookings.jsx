import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { X, DollarSign, UserCheck, Ban, Loader2, RefreshCw, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const SERVICE_LABELS = {
  electrician: '⚡ Electrician',
  plumber: '🔧 Plumber',
  ac_fridge_repair: '❄️ AC/Fridge',
  carpenter: '🔨 Carpenter',
  painter: '🎨 Painter',
  mason: '🧱 Mason',
  steel_fixer: '🏗️ Steel Fixer',
  labour: '👷 Labour',
  tile_fixer: '🟦 Tile Fixer'
};
const STATUS_CLASSES = {
  pending: 'badge-pending', assigned: 'badge-assigned',
  accepted: 'badge-accepted', completed: 'badge-completed', cancelled: 'badge-cancelled',
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, wRes] = await Promise.all([
        api.get(`/admin/bookings${filter !== 'all' ? `?status=${filter}` : ''}`),
        api.get('/admin/workers/available'),
      ]);
      setBookings(bRes.data.bookings);
      setWorkers(wRes.data.workers);
    } catch { toast.error('Failed to load data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleAssign = async () => {
    if (!selectedWorker) { toast.error('Select a worker'); return; }
    setActionLoading(true);
    try {
      await api.patch(`/admin/bookings/${assignModal}/assign`, { workerId: selectedWorker });
      toast.success('Worker assigned!');
      setAssignModal(null); setSelectedWorker('');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setActionLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/admin/bookings/${id}/cancel`);
      toast.success('Booking cancelled.');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const statuses = ['all', 'pending', 'assigned', 'accepted', 'completed', 'cancelled'];

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Bookings Management</h1>
            <p className="text-slate-500 mt-1">{bookings.length} bookings</p>
          </div>
          <button onClick={fetchData} className="btn-ghost"><RefreshCw size={16} /> Refresh</button>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all border ${filter === s ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
            <table className="w-full bg-white text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Date', 'Customer', 'Service', 'Address', 'Status', 'Worker', 'Price', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark">{b.customerId?.name}</p>
                      <p className="text-xs text-slate-400">{b.customerId?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{SERVICE_LABELS[b.serviceType] || b.serviceType}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[160px]">
                      <p className="truncate text-xs">{b.address}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={STATUS_CLASSES[b.status] || 'badge-pending'}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {b.workerId?.userId?.name || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {b.priceEstimate ? `Rs.${b.priceEstimate}` : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {['pending', 'assigned'].includes(b.status) && (
                          <button onClick={() => setAssignModal(b._id)}
                            className="p-1.5 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors" title="Assign Worker">
                            <UserCheck size={14} />
                          </button>
                        )}
                        {!['cancelled', 'completed'].includes(b.status) && (
                          <button onClick={() => handleCancel(b._id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Cancel">
                            <Ban size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Worker Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-dark">Assign Worker</h2>
              <button onClick={() => setAssignModal(null)}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="form-label">Select Available Worker</label>
                <select className="form-select" value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)}>
                  <option value="">Choose a worker...</option>
                  {workers.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.userId?.name} — {SERVICE_LABELS[w.serviceType]} ({w.rating > 0 ? `★ ${w.rating}` : 'No ratings'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAssignModal(null)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={handleAssign} disabled={actionLoading} className="btn-primary flex-1">
                  {actionLoading ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
