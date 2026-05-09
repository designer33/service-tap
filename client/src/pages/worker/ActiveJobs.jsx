import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import BookingCard from '../../components/BookingCard';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle, Loader2, Briefcase } from 'lucide-react';

const ActiveJobs = () => {
  const { t, language } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/bookings/active');
      setBookings(data.bookings);
    } catch {
      toast.error(t('loadingJobsError') || 'Failed to load active jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleComplete = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/bookings/${id}/complete`);
      toast.success(t('jobCompletedToast') || 'Job marked as completed!');
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || t('actionFailed') || 'Failed to complete job.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container">
        <div className={`mb-8 ${language === 'ur' ? 'text-right' : ''}`}>
          <h1 className="section-title">{t('activeJobs')}</h1>
          <p className="text-slate-500 mt-1">{t('activeJobsDesc')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary-400" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-16">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-dark text-lg mb-1">{t('noActiveJobs')}</p>
            <p className="text-slate-500 text-sm">{t('noActiveJobsDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                actions={
                  <button
                    onClick={() => handleComplete(booking._id)}
                    disabled={actionLoading === booking._id}
                    className={`btn-secondary text-sm py-1.5 px-4 w-full flex items-center justify-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}
                  >
                    <CheckCircle size={14} />
                    {actionLoading === booking._id ? t('completing') : t('markCompleted')}
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveJobs;
