import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import BookingCard from '../../components/BookingCard';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Star, X, Loader2, CheckCircle } from 'lucide-react';

const MyBookings = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [spending, setSpending] = useState(0);
  const [reviewModal, setReviewModal] = useState(null); // bookingId
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const [editModal, setEditModal] = useState(null); // booking object
  const [editForm, setEditForm] = useState({ title: '', issueDescription: '', priceEstimate: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  const [offersModal, setOffersModal] = useState(null); // bookingId
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [acceptingOffer, setAcceptingOffer] = useState(null);

  const fetchBookings = async () => {
    if (user?.isBlocked) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data.bookings);
      if (data.stats) setSpending(data.stats.totalSpending);
    } catch (err) {
      if (err.response?.status !== 403) {
        toast.error(t('loadingError') || 'Failed to load bookings.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const fetchOffers = async (id) => {
    setLoadingOffers(true);
    try {
      const { data } = await api.get(`/bookings/${id}/offers`);
      setOffers(data.offers);
    } catch {
      toast.error(t('loadingOffersError') || 'Failed to load offers.');
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    setAcceptingOffer(offerId);
    try {
      await api.patch(`/bookings/offers/${offerId}/accept`);
      toast.success(t('offerAcceptedToast'));
      setOffersModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || t('acceptOfferError') || 'Failed to accept offer.');
    } finally {
      setAcceptingOffer(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const handleDelete = async (id) => {
    if (!confirm(t('confirmDelete') || 'Are you sure you want to delete this job post?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success(t('jobDeletedToast'));
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || t('deleteError') || 'Failed to delete.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await api.patch(`/bookings/${editModal._id}`, editForm);
      toast.success(t('jobUpdatedToast'));
      setEditModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || t('updateError') || 'Failed to update.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/bookings/${reviewModal}/review`, reviewForm);
      toast.success(t('reviewSubmittedToast'));
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || t('submitReviewError') || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const statuses = ['all', 'pending', 'assigned', 'accepted', 'completed', 'cancelled'];

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">{t('myBookingsTitle')}</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500">{bookings.length} {t('all')}</p>
              <div className="h-4 w-px bg-slate-300"></div>
              <p className="text-sm font-bold text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded">{t('totalSpending')}: Rs.{spending}</p>
            </div>
          </div>
          <Link to="/book" className="btn-primary self-start flex items-center gap-2">
            <Plus size={16} /> {t('bookService')}
          </Link>
        </div>

        {/* Filter tabs with counters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map((s) => {
            const count = s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length;
            return (
              <button key={s} 
                onClick={() => setFilter(s)}
                disabled={loading}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all border flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${filter === s ? 'bg-primary-500 text-white border-primary-500 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}>
                {t(s)} <span className={`text-[10px] px-1.5 rounded-full ${filter === s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold text-dark text-lg mb-1">{t('noBookings')}</p>
            <p className="text-slate-500 text-sm mb-5">
              {filter === 'all' ? t('noBookingsYet') : t('noFilteredBookings').replace('{status}', t(filter))}
            </p>
            <Link to="/book" className="btn-primary">{t('bookService')}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((booking) => {
              const hasCustomerReview = booking.reviews?.some(r => r.reviewerRole === 'customer');
              return (
                <BookingCard key={booking._id} booking={booking} onImageClick={setZoomedImage}
                  actions={
                    <div className="flex flex-col gap-2 w-full">
                      {booking.status === 'pending' && (
                        <div className="flex flex-col gap-2">
                          <button onClick={() => { setOffersModal(booking._id); fetchOffers(booking._id); }}
                            className="btn-primary text-sm py-1.5 w-full">
                            {t('viewOffers')}
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => { 
                              setEditModal(booking); 
                              setEditForm({ 
                                title: booking.title || '', 
                                issueDescription: booking.issueDescription,
                                priceEstimate: booking.priceEstimate || ''
                              }); 
                            }}
                              className="btn-outline text-xs py-1.5 px-3 flex-1">
                              {t('edit')}
                            </button>
                            <button onClick={() => handleDelete(booking._id)}
                              className="btn-danger text-xs py-1.5 px-3 flex-1">
                              {t('delete')}
                            </button>
                          </div>
                        </div>
                      )}
                      {booking.status === 'completed' && !hasCustomerReview && (
                        <button onClick={() => setReviewModal(booking._id)}
                          className="btn-outline text-sm py-1.5 px-3 w-full flex items-center justify-center gap-2">
                          <Star size={14} /> {t('leaveReview')}
                        </button>
                      )}
                      {booking.status === 'completed' && hasCustomerReview && (
                        <div className="bg-secondary-50 text-secondary-700 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 border border-secondary-100">
                          <CheckCircle size={12} /> {t('reviewSubmitted')}
                        </div>
                      )}
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Offers Modal */}
      {offersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <h2 className="font-bold text-dark text-lg">{t('workerOffers')}</h2>
              <button onClick={() => setOffersModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-grow">
              {loadingOffers ? (
                <div className="flex justify-center py-10"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
              ) : offers.length === 0 ? (
                <div className="text-center py-10 text-slate-500 italic">{t('noOffersYet')}</div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => {
                    const worker = offer.workerId;
                    const user = worker.userId;
                    return (
                      <div key={offer._id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                            {user.profilePic ? (
                                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <Link to={`/profile/${user._id}`} className="font-bold text-dark hover:text-primary-600 transition-colors block">
                              {language === 'ur' ? (
                                user.urduName || 
                                (() => {
                                  const trans = t(user.name);
                                  if (trans !== user.name) return trans;
                                  const key = user.name?.split(' ').map((s, i) => i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
                                  const transKey = t(key);
                                  return transKey !== key ? transKey : user.name;
                                })()
                              ) : user.name}
                            </Link>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star size={12} className="text-accent-500 fill-accent-500" />
                              <span className="text-xs font-bold text-slate-600">{user.rating || '0'}</span>
                              <span className="text-xs text-slate-400">({user.totalRatings || 0})</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <p className="text-lg font-bold text-secondary-600 mb-2">Rs.{offer.priceOffer}</p>
                          <button 
                            onClick={() => handleAcceptOffer(offer._id)}
                            disabled={!!acceptingOffer}
                            className="btn-primary text-xs py-1.5 px-4"
                          >
                            {acceptingOffer === offer._id ? t('accepting') : t('acceptOffer')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-dark text-lg">{t('editJobPost')}</h2>
              <button onClick={() => setEditModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="form-label" htmlFor="edit-title">{t('jobTitle')}</label>
                <input id="edit-title" type="text" value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required minLength={3} className="form-input" />
              </div>
              <div>
                <label className="form-label" htmlFor="edit-desc">{t('description')}</label>
                <textarea id="edit-desc" rows={4} value={editForm.issueDescription}
                  onChange={(e) => setEditForm({ ...editForm, issueDescription: e.target.value })}
                  required minLength={10} className="form-input resize-none" />
              </div>
              <div>
                <label className="form-label" htmlFor="edit-price">{t('jobPrice')} (Rs.)</label>
                <input id="edit-price" type="number" value={editForm.priceEstimate}
                  onChange={(e) => setEditForm({ ...editForm, priceEstimate: e.target.value })}
                  min="0" className="form-input" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setEditModal(null)} className="btn-ghost flex-1">{t('cancel')}</button>
                <button type="submit" disabled={savingEdit} className="btn-primary flex-1">
                  {savingEdit ? t('saving') : t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-dark text-lg">{t('leaveAReview')}</h2>
              <button onClick={() => setReviewModal(null)} className="text-slate-400 hover:text-slate-600">
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
                  placeholder={t('tellUsAboutExperience')}
                  className="form-input resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReviewModal(null)} className="btn-ghost flex-1">{t('cancel')}</button>
                <button type="submit" disabled={submittingReview} className="btn-primary flex-1">
                  {submittingReview ? t('submitting') : t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in" onClick={() => setZoomedImage(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-up" />
        </div>
      )}
    </div>
  );
};

export default MyBookings;
