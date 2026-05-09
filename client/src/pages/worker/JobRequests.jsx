import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import BookingCard from '../../components/BookingCard';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { CheckCircle, Loader2, Inbox, Briefcase, Clock, Star, X } from 'lucide-react';

const JobRequests = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { refreshTrigger } = useNotifications();
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [editablePrices, setEditablePrices] = useState({});
  const [tab, setTab] = useState(new URLSearchParams(window.location.search).get('tab') || 'available'); // 'available', 'offers', 'active', 'completed'
  const [tabCounts, setTabCounts] = useState({ available: 0, offers: 0, active: 0, completed: 0 });
  const [earnings, setEarnings] = useState(0);
  const [customerReviewModal, setCustomerReviewModal] = useState(null); // bookingId
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const fetchJobs = async () => {
    if (user?.isBlocked) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let endpoint = '/bookings/available';
      if (tab === 'active') endpoint = '/bookings/active';
      if (tab === 'completed') endpoint = '/bookings/completed';
      if (tab === 'offers') endpoint = '/bookings/my-offers';
      
      const { data } = await api.get(endpoint);
      if (data.counts) setTabCounts(data.counts);
      if (data.stats) setEarnings(data.stats.totalEarnings);
      
      if (tab === 'offers') {
        const normalized = data.offers.map(o => ({
          ...o.bookingId,
          myOfferPrice: o.priceOffer,
          offerStatus: o.status
        }));
        setBookings(normalized);
      } else {
        setBookings(data.bookings);
      }
      
      if (tab === 'available') {
        const prices = {};
        data.bookings.forEach(b => {
          prices[b._id] = b.priceEstimate || '';
        });
        setEditablePrices(prices);
      }
    } catch (err) {
      // Don't show toast if account is blocked (handled by global banner)
      if (err.response?.status !== 403) {
        toast.error(t('loadingJobsError') || 'Failed to load jobs.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [tab, refreshTrigger]);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      if (action === 'offer') {
        await api.post(`/bookings/${id}/offer`, { priceOffer: editablePrices[id] });
        toast.success(t('offerSentToast'));
      } else if (action === 'accept-instant') {
        await api.post(`/bookings/${id}/instant-accept`);
        toast.success(t('jobAcceptedToast'));
      } else if (action === 'complete') {
        await api.patch(`/bookings/${id}/complete`);
        toast.success(t('jobCompletedToast'));
      }
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || t('actionFailed') || 'Action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/bookings/${customerReviewModal}/customer-review`, reviewForm);
      toast.success(t('customerReviewToast'));
      setCustomerReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || t('submitReviewError') || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">{t('workerDashboard')}</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500">{t('dashboardSubtitle')}</p>
              <div className="h-4 w-px bg-slate-300"></div>
              <p className="text-sm font-bold text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded">
                {t('totalEarnings')}: Rs.{formatCurrency(earnings)}
              </p>
            </div>
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start overflow-x-auto max-w-full">
            <button 
              onClick={() => setTab('available')}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${tab === 'available' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Briefcase size={16} className={language === 'ur' ? 'mt-[5px]' : ''} /> {t('available')} <span className={`text-[10px] px-1.5 rounded-full ${tab === 'available' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{tabCounts.available}</span>
            </button>
            <button 
              onClick={() => setTab('offers')}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${tab === 'offers' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Star size={16} className={language === 'ur' ? 'mt-[5px]' : ''} /> {t('offersSent')} <span className={`text-[10px] px-1.5 rounded-full ${tab === 'offers' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{tabCounts.offers}</span>
            </button>
            <button 
              onClick={() => setTab('active')}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${tab === 'active' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Clock size={16} className={language === 'ur' ? 'mt-[5px]' : ''} /> {t('active')} <span className={`text-[10px] px-1.5 rounded-full ${tab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{tabCounts.active}</span>
            </button>
            <button 
              onClick={() => setTab('completed')}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${tab === 'completed' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <CheckCircle size={16} className={language === 'ur' ? 'mt-[5px]' : ''} /> {t('completed')} <span className={`text-[10px] px-1.5 rounded-full ${tab === 'completed' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{tabCounts.completed}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary-400" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-16">
            <Inbox size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-dark text-lg mb-1">{t('noJobsFound')}</p>
            <p className="text-slate-500 text-sm">
              {tab === 'available' ? t('noPendingJobsDesc') : 
               tab === 'offers' ? t('noOffersSentDesc') :
               tab === 'active' ? t('noActiveJobsDesc') : t('noCompletedJobsDesc')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookings.map((booking) => {
              const hasWorkerReview = booking.reviews?.some(r => r.reviewerRole === 'worker');
              return (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onImageClick={setZoomedImage}
                  actions={
                    tab === 'available' ? (
                      <div className="flex flex-col gap-3 w-full">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(booking._id, 'accept-instant')}
                            disabled={!!actionLoading}
                            className="btn-primary text-sm py-1.5 flex-1"
                          >
                            {t('acceptOffer')}
                          </button>
                        </div>
                        <div className="relative flex items-center gap-2 py-1">
                          <div className="flex-1 border-t border-slate-200"></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('orCounterOffer')}</span>
                          <div className="flex-1 border-t border-slate-200"></div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">{t('yourPrice')}</label>
                          <input 
                            type="number" 
                            value={editablePrices[booking._id] || ''} 
                            onChange={(e) => setEditablePrices({...editablePrices, [booking._id]: e.target.value})}
                            className="form-input text-sm py-1.5"
                            placeholder={t('customPrice')}
                          />
                        </div>
                        <button
                          onClick={() => handleAction(booking._id, 'offer')}
                          disabled={!!actionLoading}
                          className="btn-outline text-sm py-1.5 w-full border-primary-200 text-primary-600 hover:bg-primary-50 flex items-center justify-center gap-2"
                        >
                          <Star size={14} />
                          {actionLoading === booking._id + 'offer' ? t('sending') : t('sendCustomOffer')}
                        </button>
                      </div>
                    ) : tab === 'offers' ? (
                      <div className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">{t('yourBid')}</span>
                          <span className="text-sm font-bold text-primary-600">Rs.{booking.myOfferPrice}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-accent-600">
                          <Clock size={12} /> {t('waitingForCustomer')}
                        </div>
                      </div>
                    ) : tab === 'active' ? (
                      <button
                        onClick={() => handleAction(booking._id, 'complete')}
                        disabled={!!actionLoading}
                        className="btn-secondary text-sm py-1.5 w-full flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={14} />
                        {actionLoading === booking._id + 'complete' ? t('completing') : t('markCompleted')}
                      </button>
                    ) : (
                      <>
                        {!hasWorkerReview ? (
                          <button
                            onClick={() => setCustomerReviewModal(booking._id)}
                            className="btn-outline text-sm py-1.5 w-full flex items-center justify-center gap-2"
                          >
                            <Star size={14} /> {t('rateCustomer')}
                          </button>
                        ) : (
                          <div className="bg-primary-50 text-primary-700 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 border border-primary-100 w-full">
                            <CheckCircle size={12} /> {t('ratedCustomer')}
                          </div>
                        )}
                      </>
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in" onClick={() => setZoomedImage(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-up" />
        </div>
      )}

      {/* Customer Review Modal */}
      {customerReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-dark text-lg">{t('rateCustomer')}</h2>
              <button onClick={() => setCustomerReviewModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="form-label">{t('rating')}</label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                      className={`text-2xl transition-transform hover:scale-110 ${n <= reviewForm.rating ? 'text-accent-500' : 'text-slate-300'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="review-comment">{t('commentOptional')}</label>
                <textarea id="review-comment" rows={3} value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder={t('howWasExperienceWithCustomer')}
                  className="form-input resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setCustomerReviewModal(null)} className="btn-ghost flex-1">{t('cancel')}</button>
                <button type="submit" disabled={submittingReview} className="btn-primary flex-1">
                  {submittingReview ? t('submitting') : t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRequests;
