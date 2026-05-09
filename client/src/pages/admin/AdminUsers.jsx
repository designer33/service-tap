import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { User, Shield, ShieldOff, Trash2, Loader2, Search, Filter, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id, isBlocked) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/block`);
      toast.success(data.message);
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully.');
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      toast.error('Failed to delete user.');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesFilter = filter === 'all' || u.role === filter;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase()) ||
                         u.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="section-title">Manage Users</h1>
            <p className="text-slate-500 mt-1">Block, unblock, or delete customer and worker accounts.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email, phone..." 
                className="form-input pl-10 py-2 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
              <Filter size={14} className="text-slate-400" />
              <select 
                className="bg-transparent text-sm font-semibold text-slate-600 outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="worker">Workers</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
        ) : filteredUsers.length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={30} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reports</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className={`hover:bg-slate-50/50 transition-colors ${u.isBlocked ? 'bg-red-50/30' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${u.role === 'admin' ? 'bg-indigo-500' : u.role === 'worker' ? 'bg-slate-600' : 'bg-primary-500'}`}>
                            {u.profilePic ? (
                              <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              u.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-dark">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                            <p className="text-[11px] text-slate-400">{u.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'worker' ? 'bg-slate-100 text-slate-600' : 'bg-primary-50 text-primary-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.reportedBy?.length >= 3 ? 'bg-red-100 text-red-600' : u.reportedBy?.length > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                          {u.reportedBy?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.isBlocked ? (
                          <span className="flex items-center gap-1.5 text-red-600 text-xs font-bold">
                            <ShieldOff size={14} /> Blocked
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-secondary-600 text-xs font-bold">
                            <CheckCircle size={14} className="text-secondary-500" /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                            className={`p-2 rounded-xl transition-all ${u.isBlocked ? 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                            title={u.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {u.isBlocked ? <Shield size={18} /> : <ShieldOff size={18} />}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
