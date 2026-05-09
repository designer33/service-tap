import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Loader2, Star, Calendar, MapPin, CheckCircle, User as UserIcon, Briefcase, Edit, Camera, X, Phone, AlertTriangle, ShieldCheck, ShieldAlert, Upload, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatCurrency';
import ImageCropModal from '../../components/ImageCropModal';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const { t, language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', profilePic: '', urduName: '' });
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cnicPreview, setCnicPreview] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const reviewsPerPage = 5;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit for source
      toast.error(t('fileTooLarge'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage) => {
    setEditForm({ ...editForm, profilePic: croppedImage });
    setImageToCrop(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/auth/profile', editForm);
      updateUser(data.user);
      setData(prev => ({ ...prev, user: { ...prev.user, ...data.user } }));
      toast.success(t('profileUpdatedToast'));
      setEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || t('updateError') || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleReport = async () => {
    if (!currentUser) {
      toast.error(t('loginRequired'));
      return;
    }
    if (!window.confirm(t('confirmReport'))) return;

    try {
      const { data: respData } = await api.post(`/auth/${data?.user?._id}/report`);
      toast.success(respData.message);
      setData(prev => ({ ...prev, user: respData.user || prev.user }));
      // Trigger a re-fetch to update reported state
      setData(null);
      setLoading(true);
      const { data: fresh } = await api.get(`/bookings/profile/${id}`);
      setData(fresh);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || t('actionFailed'));
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!cnicPreview) return;
    setVerifying(true);
    try {
      const { data } = await api.post('/auth/verify-identity', { cnicImage: cnicPreview });
      toast.success(data.message);
      
      // Update local state instead of reload
      setData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          verificationStatus: 'pending'
        }
      }));
      setCnicPreview('');
    } catch (err) {
      toast.error(err.response?.data?.message || t('actionFailed'));
    } finally {
      setVerifying(false);
    }
  };

  const handleCnicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const resized = await resizeImage(reader.result, 1200, 1200, 0.7);
        setCnicPreview(resized);
      } catch (err) {
        console.error('CNIC resize failed:', err);
        setCnicPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    let cancelled = false;

    const doFetch = async () => {
      setLoading(true);
      setData(null);
      try {
        const { data: profileData } = await api.get(`/bookings/profile/${id}`);
        if (cancelled) return;
        setData(profileData);
        if (currentUser?._id === profileData.user._id || currentUser?.slug === id) {
          setEditForm({
            name: profileData.user.name,
            phone: profileData.user.phone || '',
            profilePic: profileData.user.profilePic || '',
            urduName: profileData.user.urduName || ''
          });
        }
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status !== 403) {
          toast.error(t('loadingError') || 'Failed to load profile.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    doFetch();

    return () => { cancelled = true; };
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-40">
      <Loader2 size={40} className="animate-spin text-primary-500" />
    </div>
  );

  if (!data) return (
    <div className="text-center py-20">
      <p className="text-slate-500">{t('profileNotFound')}</p>
    </div>
  );

  const { user, bookings, reviewsReceived = [], stats = {} } = data;

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewsReceived.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviewsReceived.length / reviewsPerPage);

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container max-w-4xl">
        {/* Profile Header Card */}
        <div className="card mb-8 overflow-hidden">
          <div className="h-32 sm:h-48 bg-gradient-to-r from-primary-500 to-primary-700"></div>
          <div className="px-4 sm:px-8 pb-8">
            <div className="relative -mt-12 sm:-mt-16 mb-4 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl shadow-xl border-4 border-white flex items-center justify-center text-primary-600 overflow-hidden shrink-0">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={48} />
                )}
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end gap-2 mb-2">
                {(currentUser?._id === data?.user?._id || currentUser?.slug === id) && (
                  <button 
                    onClick={() => setEditModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                  >
                    <Edit size={14} /> {t('editProfile')}
                  </button>
                )}
                {currentUser && currentUser._id !== user._id && (
                  <button 
                    onClick={handleReport}
                    disabled={user.reportedBy?.includes(currentUser._id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95 ${user.reportedBy?.includes(currentUser._id) ? 'bg-red-50 text-red-400 cursor-not-allowed' : 'bg-white border border-red-100 text-red-500 hover:bg-red-50'}`}
                  >
                    <AlertTriangle size={14} /> {user.reportedBy?.includes(currentUser._id) ? t('reported') : t('reportProfile')}
                  </button>
                )}
                <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center">
                  {user.role === 'worker' ? (t(user.serviceType) || t('worker')) : t(user.role)}
                </div>
              </div>
            </div>
            
            <div className={`${language === 'ur' ? 'text-center sm:text-right' : 'text-center sm:text-left'}`}>
              <h1 className={`text-2xl sm:text-3xl font-black text-dark mb-2 flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse justify-center sm:justify-end' : 'justify-center sm:justify-start'}`}>
                <span className={language === 'ur' ? 'font-urdu' : ''}>
                  {language === 'ur' ? (
                    user.urduName || 
                    (() => {
                      const trans = t(user.name);
                      if (trans !== user.name) return trans;
                      const key = (user.name || '').split(' ').map((s, i) => i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
                      const transKey = t(key);
                      return transKey !== key ? transKey : user.name;
                    })()
                  ) : user.name}
                </span>
                {user.isVerified && (
                  <ShieldCheck size={20} className="text-emerald-500 shrink-0" title={t('verified')} />
                )}
              </h1>
              <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-3 text-slate-500 text-sm mb-4 ${language === 'ur' ? 'sm:flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-1.5">
                  <Star size={18} className={`text-accent-500 fill-accent-500 ${language === 'ur' ? 'mt-1' : ''}`} />
                  <span className="font-black text-dark text-base">{user.rating || '0'}</span>
                  <span className="text-slate-400">({user.totalRatings || 0} {t('reviews')})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={18} className={language === 'ur' ? 'mt-1' : 'text-primary-400'} />
                  <span className="whitespace-nowrap">{t('joined')} {formatDate(user.createdAt)}</span>
                </div>
                {user.role === 'customer' ? (
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={18} className={`text-secondary-500 ${language === 'ur' ? 'mt-1' : ''}`} />
                    <span className="font-bold text-dark whitespace-nowrap">
                      {t('spendingTotal')}: <span className="text-primary-600">Rs.{formatCurrency(stats.totalSpending)}</span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={18} className={`text-secondary-500 ${language === 'ur' ? 'mt-1' : ''}`} />
                    <span className="font-bold text-dark whitespace-nowrap">
                      {t('earningsTotal')}: <span className="text-secondary-600">Rs.{formatCurrency(stats.totalEarnings)}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Guidance Alert */}
        {currentUser?._id === user._id && !user.isVerified && (
          <div className={`bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${language === 'ur' ? 'sm:flex-row-reverse' : ''}`}>
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg animate-bounce sm:animate-none">
              <ShieldAlert size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className={`flex-1 text-center sm:text-left ${language === 'ur' ? 'sm:text-right' : ''}`}>
              <h3 className="text-lg sm:text-xl font-bold text-amber-800 mb-1">
                {language === 'ur' ? 'شناختی تصدیق مکمل کریں' : 'Verify Your Identity'}
              </h3>
              <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                {language === 'ur' 
                  ? 'اپنے اکاؤنٹ کی مکمل سہولیات استعمال کرنے اور اعتماد بڑھانے کے لیے اپنی شناختی دستاویز (CNIC) اپ لوڈ کریں۔ نیچے دیے گئے "شناختی تصدیق" کارڈ پر جائیں اور اپنی تصویر اپ لوڈ کریں۔' 
                  : 'To enjoy full platform features and build trust, please upload your identity document (CNIC). Scroll down to the "Identity Verification" section below to upload your photo.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Reviews */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
              <Star className="text-accent-500" /> {t('userReviews')}
            </h2>

            {reviewsReceived.length === 0 ? (
              <div className="card text-center py-12 bg-slate-50 border-dashed border-2">
                <p className="text-slate-400 italic">{t('noReviewsYet')}</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {currentReviews.map((rev) => (
                  <div key={rev._id} className="card p-4 sm:p-6 border-l-4 border-l-primary-500 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col xs:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden border border-slate-200 shadow-sm">
                          {(() => {
                            const reviewer = rev.reviewerRole === 'customer' ? rev.customerId : rev.workerId?.userId;
                            return reviewer?.profilePic ? (
                              <img src={reviewer.profilePic} alt={reviewer.name} className="w-full h-full object-cover" />
                            ) : (
                              reviewer?.name?.charAt(0).toUpperCase() || '?'
                            );
                          })()}
                        </div>
                        <div>
                          <h3 className="font-bold text-dark group-hover:text-primary-600 transition-colors">
                            {rev.bookingId?.title || t('untitledService')}
                          </h3>
                          <p className="text-[10px] font-medium text-slate-400">
                            {t('by')}{' '}
                            <Link 
                              to={`/profile/${(rev.reviewerRole === 'customer' ? rev.customerId?.slug : rev.workerId?.userId?.slug) || (rev.reviewerRole === 'customer' ? rev.customerId?._id : rev.workerId?.userId?._id)}`}
                              className="text-primary-600 hover:underline"
                            >
                              {(() => {
                                const reviewer = rev.reviewerRole === 'customer' ? rev.customerId : rev.workerId?.userId;
                                if (!reviewer) return t('anonymous');
                                if (language === 'ur') {
                                  if (reviewer.urduName) return reviewer.urduName;
                                  const trans = t(reviewer.name);
                                  if (trans !== reviewer.name) return trans;
                                  const key = (reviewer.name || '').split(' ').map((s, i) => i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
                                  const transKey = t(key);
                                  return transKey !== key ? transKey : reviewer.name;
                                }
                                return reviewer.name || t('anonymous');
                              })()}
                            </Link>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row xs:flex-col items-center xs:items-end justify-between xs:justify-start w-full xs:w-auto gap-2">
                        <div className="flex gap-0.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} size={10} className={`sm:w-[12px] sm:h-[12px] ${n <= rev.rating ? 'text-accent-500 fill-accent-500' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 tracking-tighter uppercase">{formatDate(rev.createdAt)}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-slate-700 text-sm italic leading-relaxed">"{rev.comment || t('noCommentProvided')}"</p>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn-outline text-xs py-1.5 px-4 disabled:opacity-50"
                    >
                      {t('previous')}
                    </button>
                    <span className="text-sm font-medium text-slate-500">{t('page')} {currentPage} {t('of')} {totalPages}</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn-outline text-xs py-1.5 px-4 disabled:opacity-50"
                    >
                      {t('next')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Mini History & Verification */}
          <div className={`space-y-8 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <section>
              <h2 className={`text-xl font-bold text-dark mb-6 flex items-center gap-2 ${language === 'ur' ? 'justify-start' : ''}`}>
                <CheckCircle className={`text-secondary-500 ${language === 'ur' ? 'mt-1' : ''}`} /> {t('recentJobs')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {bookings.slice(0, 5).map((job) => (
                  <div key={job._id} className="card p-4 border-l-4 border-l-secondary-500 text-sm hover:bg-slate-50 transition-colors shadow-sm">
                    <h3 className="font-bold text-dark mb-1 truncate">{job.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <Calendar size={12} /> {formatDate(job.completedAt)}
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">{t('noJobHistory')}</p>
                )}
              </div>
            </section>

            {/* Identity Verification Section (Only for own profile) */}
            {(currentUser?._id === user._id || currentUser?.slug === id) && (
              <section className={language === 'ur' ? 'text-right' : 'text-left'}>
                <h2 className={`text-xl font-bold text-dark mb-6 flex items-center gap-2 ${language === 'ur' ? 'justify-start' : ''}`}>
                  <ShieldCheck className={`text-emerald-500 ${language === 'ur' ? 'mt-1' : ''}`} /> {t('identityVerification')}
                </h2>
                <div className={`card p-5 sm:p-6 border-t-4 shadow-md ${currentUser?.requiresVerification ? 'border-t-red-500 bg-red-50/10' : 'border-t-emerald-500'}`}>
                  {currentUser?.requiresVerification && !user.isVerified && (
                    <div className="flex items-center gap-2 text-red-600 font-black text-xs sm:text-sm mb-4 bg-red-50 p-2 rounded-lg border border-red-100">
                      <ShieldAlert size={18} />
                      {language === 'ur' ? 'کاروائی جاری رکھنے کے لیے تصدیق ضروری ہے' : 'VERIFICATION MANDATORY'}
                    </div>
                  )}
                  {user.isVerified ? (
                    <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <CheckCircle size={28} />
                      <span className="font-black text-lg">{t('verified')}</span>
                    </div>
                  ) : user.verificationStatus === 'pending' ? (
                    <div className="space-y-3 bg-amber-50 p-5 rounded-2xl border border-amber-100">
                      <div className="flex items-center gap-3 text-amber-600">
                        <Clock size={28} className="animate-pulse" />
                        <span className="font-bold text-lg">
                          {language === 'ur' ? 'شناختی تصدیق جاری ہے' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
                        {language === 'ur' 
                          ? 'آپ کی شناختی دستاویز (CNIC) جمع کرانے کے لیے شکریہ۔ براہ کرم منظوری کے لیے 24 سے 48 گھنٹے انتظار کریں۔' 
                          : 'Thank you for submitting your ID. Please wait 24 to 48 hours for approval. Our team is reviewing your submission.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.verificationStatus === 'rejected' && (
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-4">
                          <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-1">
                            <ShieldAlert size={16} /> {t('verificationRejected')}
                          </div>
                          <p className="text-xs text-red-500 leading-relaxed font-medium">{t('verificationRejectedReason')} {user.verificationNote}</p>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{t('verifyIdentityDesc')}</p>
                      
                      <form onSubmit={handleVerificationSubmit} className="space-y-4">
                        <div className="space-y-4">
                          <div className="w-full">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleCnicChange}
                              className="hidden" 
                              id="cnic-upload" 
                            />
                            <label htmlFor="cnic-upload" className="w-full btn-outline py-4 text-xs sm:text-sm cursor-pointer flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-primary-400 hover:bg-primary-50 transition-all rounded-2xl">
                              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                                <Upload size={20} className="text-primary-500" />
                              </div>
                              <span className="font-bold">{t('uploadCNIC')}</span>
                            </label>
                          </div>
                          
                          {cnicPreview && (
                            <div className="space-y-2 animate-fade-in">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('preview')}</p>
                              <div className="w-full h-48 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-200 shadow-inner relative group">
                                <img src={cnicPreview} alt="CNIC Preview" className="w-full h-full object-contain" />
                                <button 
                                  type="button" 
                                  onClick={() => setCnicPreview('')}
                                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {cnicPreview && (
                          <button 
                            type="submit" 
                            disabled={verifying}
                            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-primary-100"
                          >
                            {verifying ? <Loader2 size={20} className="animate-spin" /> : <><ShieldCheck size={20}/> {t('submitForVerification')}</>}
                          </button>
                        )}
                      </form>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark">{t('editProfile')}</h2>
              <button onClick={() => setEditModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              <div>
                <label className="form-label">{t('name')}</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t('urduNameLabel')}</label>
                <input 
                  type="text" 
                  value={editForm.urduName}
                  onChange={(e) => setEditForm({ ...editForm, urduName: e.target.value })}
                  className="form-input text-right"
                  dir="rtl"
                  placeholder="اپنا نام اردو میں لکھیں"
                />
              </div>
              <div>
                <label className="form-label">{t('phone')}</label>
                <div className="relative">
                  <Phone size={16} className={`absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                  <input 
                    type="tel" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    required
                    placeholder="03001234567"
                    minLength={11}
                    maxLength={11}
                    pattern="0\d{10}"
                    title="Phone number must be exactly 11 digits starting with 0"
                    className={`form-input ${language === 'ur' ? 'pr-10' : 'pl-10'}`}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">{t('profilePicture')}</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                    {editForm.profilePic ? (
                      <img src={editForm.profilePic} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label htmlFor="profile-upload" className="btn-outline py-2 text-xs cursor-pointer inline-flex items-center gap-2">
                      <Camera size={14} /> {t('choosePhoto')}
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1">{t('fileTypeLimit')}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditModal(false)}
                  className="flex-1 btn-outline py-2.5"
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 btn-primary py-2.5"
                >
                  {saving ? t('saving') : t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {imageToCrop && (
        <ImageCropModal 
          image={imageToCrop} 
          onCrop={handleCropComplete} 
          onCancel={() => setImageToCrop(null)} 
        />
      )}
    </div>
  );
};

export default Profile;
