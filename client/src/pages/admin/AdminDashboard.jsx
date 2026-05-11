import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Briefcase, Users, CheckCircle, Clock, TrendingUp, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-dark">{value ?? '—'}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(() => toast.error('Failed to load stats.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
  );

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of Service Knock platform activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <StatCard icon={Briefcase} label="Total Bookings" value={stats?.totalBookings} color="bg-primary-500" />
          <StatCard icon={Clock} label="Pending Bookings" value={stats?.pendingBookings} color="bg-amber-500" sub="Need worker assignment" />
          <StatCard icon={CheckCircle} label="Completed Jobs" value={stats?.completedBookings} color="bg-secondary-500" />
          <StatCard icon={Users} label="Total Workers" value={stats?.totalWorkers} color="bg-slate-600" />
          <StatCard icon={TrendingUp} label="Verified Workers" value={stats?.verifiedWorkers} color="bg-indigo-500" sub={`of ${stats?.totalWorkers} total`} />
          <StatCard icon={Users} label="Customers" value={stats?.totalCustomers} color="bg-rose-500" />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link to="/admin/bookings" className="card-hover flex items-center justify-between group">
            <div>
              <h3 className="font-bold text-dark mb-1">Manage Bookings</h3>
              <p className="text-slate-500 text-sm">Assign workers, set prices, and cancel bookings.</p>
            </div>
            <ArrowRight size={20} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/admin/workers" className="card-hover flex items-center justify-between group">
            <div>
              <h3 className="font-bold text-dark mb-1">Manage Workers</h3>
              <p className="text-slate-500 text-sm">Verify workers and review their profiles.</p>
            </div>
            <ArrowRight size={20} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/admin/users" className="card-hover flex items-center justify-between group">
            <div>
              <h3 className="font-bold text-dark mb-1">Manage Users</h3>
              <p className="text-slate-500 text-sm">Block, unblock, and delete customer or worker accounts.</p>
            </div>
            <ArrowRight size={20} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/admin/verifications" className="card-hover flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-dark mb-1">ID Verifications</h3>
                <p className="text-slate-500 text-sm">Review CNIC submissions and verify user identities.</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/admin/support" className="card-hover flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-dark mb-1">{t('supportChats')}</h3>
                <p className="text-slate-500 text-sm">{t('respondToQueries')}</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
