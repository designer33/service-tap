import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ShieldCheck, ShieldX, Star, Loader2, RefreshCw } from 'lucide-react';

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

const AdminWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/workers');
      setWorkers(data.workers);
    } catch { toast.error('Failed to load workers.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const filtered = workers.filter((w) =>
    w.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    w.serviceType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Workers Management</h1>
            <p className="text-slate-500 mt-1">{workers.length} total workers</p>
          </div>
          <button onClick={fetchWorkers} className="btn-ghost self-start"><RefreshCw size={16} /> Refresh</button>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input type="text" placeholder="Search by name or service type..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="form-input max-w-sm" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">No workers found.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
            <table className="w-full bg-white text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Worker', 'Service', 'Experience', 'Rating', 'Status', 'Availability'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {w.userId?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-dark">{w.userId?.name}</p>
                          <p className="text-xs text-slate-400">{w.userId?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{SERVICE_LABELS[w.serviceType]}</td>
                    <td className="px-4 py-3 text-slate-600">{w.experience} yr{w.experience !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3">
                      {w.rating > 0 ? (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Star size={13} className="text-accent-500 fill-accent-500" /> {w.rating}
                          <span className="text-xs text-slate-400">({w.totalRatings})</span>
                        </span>
                      ) : <span className="text-slate-400 text-xs">No ratings</span>}
                    </td>
                    <td className="px-4 py-3">
                      {w.verified
                        ? <span className="badge-verified">✓ Verified</span>
                        : <span className="badge-unverified">Unverified</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${w.isAvailable ? 'bg-secondary-100 text-secondary-700' : 'bg-slate-100 text-slate-500'}`}>
                        {w.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorkers;
