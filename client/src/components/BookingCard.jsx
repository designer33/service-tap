import { Clock, MapPin, Wrench, CheckCircle, XCircle, Star, Phone, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { useLanguage } from '../context/LanguageContext';

const StatusBadge = ({ status }) => {
  const { t } = useLanguage();
  const map = {
    pending: 'badge-pending',
    assigned: 'badge-assigned',
    accepted: 'badge-accepted',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  };
  return (
    <span className={map[status] || 'badge-pending'}>
      {t(status)}
    </span>
  );
};

const BookingCard = ({ booking, actions, onImageClick }) => {
  const { t } = useLanguage();
  const worker = booking.workerId;
  const workerUser = worker?.userId;
  const customer = booking.customerId;

  return (
    <div className="card-hover animate-fade-in flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-dark truncate block">
              {booking.title || t(booking.serviceType)}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
            {t(booking.serviceType)} • {formatDate(booking.createdAt)}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Media Preview (Images) */}
      {(() => {
        const images = booking.media?.filter(m => m.type === 'image') || [];
        if (images.length === 0) return null;
        return (
          <div 
            className="mb-4 aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group relative cursor-zoom-in"
            onClick={() => onImageClick && onImageClick(images[0].url)}
          >
            <img src={images[0].url} alt="Job" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">{t('viewImage')}</span>
            </div>
          </div>
        );
      })()}

      {/* Media Preview (Audio) */}
      {(() => {
        const audio = booking.media?.find(m => m.type === 'audio');
        if (!audio) return null;
        return (
          <div className="mb-4 p-3 bg-primary-50 rounded-xl border border-primary-100 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{t('voiceDescription')}</span>
            <audio src={audio.url} controls className="h-8 w-full" />
          </div>
        );
      })()}

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed flex-grow">
        {booking.issueDescription}
      </p>

      <div className="space-y-2 mb-4">
        {/* Address */}
        <div className="flex items-start gap-1.5 text-sm text-slate-500">
          <MapPin size={14} className="mt-0.5 shrink-0 text-primary-500" />
          <span>{booking.address}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100">
          <span className="text-xs font-medium text-slate-500">{t('jobPrice')}</span>
          <span className="text-sm font-bold text-secondary-600">Rs.{booking.priceEstimate || t('pending')}</span>
        </div>
      </div>

      {/* Party Info (Worker or Customer) */}
      {workerUser ? (
        <div className="flex items-center justify-between bg-primary-50 rounded-xl px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
              {workerUser.profilePic ? (
                <img src={workerUser.profilePic} alt={workerUser.name} className="w-full h-full object-cover" />
              ) : (
                workerUser.name?.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <Link to={`/profile/${workerUser.slug || workerUser._id || worker.userId}`} className="text-xs font-bold text-dark hover:text-primary-600 truncate block">
                {language === 'ur' ? (
                  workerUser.urduName || 
                  (() => {
                    const trans = t(workerUser.name);
                    if (trans !== workerUser.name) return trans;
                    const key = workerUser.name?.split(' ').map((s, i) => i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
                    const transKey = t(key);
                    return transKey !== key ? transKey : workerUser.name;
                  })()
                ) : workerUser.name} ({t('worker')})
              </Link>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  <Star size={10} className={`${worker.rating > 0 ? 'text-accent-500 fill-accent-500' : 'text-slate-300'} ${language === 'ur' ? 'mt-[7px]' : ''}`} />
                  <span className="text-[10px] font-bold text-slate-600">{worker.rating || 0}</span>
                </div>
                <span className="text-[10px] text-slate-400">({worker.totalRatings || 0} {t('reviews')})</span>
              </div>
            </div>
          </div>
          {workerUser.phone && (
            <a href={`tel:${workerUser.phone}`} className="w-8 h-8 bg-white border border-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-500 hover:text-white transition-colors">
              <Phone size={14} />
            </a>
          )}
        </div>
      ) : customer?.name ? (
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold shrink-0 overflow-hidden border border-slate-300">
              {customer.profilePic ? (
                <img src={customer.profilePic} alt={customer.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={14} />
              )}
            </div>
            <div className="min-w-0">
              <Link to={`/profile/${customer.slug || customer._id}`} className="text-xs font-bold text-dark hover:text-primary-600 truncate block">
                {language === 'ur' ? (
                  customer.urduName || 
                  (() => {
                    const trans = t(customer.name);
                    if (trans !== customer.name) return trans;
                    const key = customer.name?.split(' ').map((s, i) => i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
                    const transKey = t(key);
                    return transKey !== key ? transKey : customer.name;
                  })()
                ) : customer.name} ({t('customer')})
              </Link>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  <Star size={10} className={`${customer.rating > 0 ? 'text-accent-500 fill-accent-500' : 'text-slate-300'} ${language === 'ur' ? 'mt-[7px]' : ''}`} />
                  <span className="text-[10px] font-bold text-slate-600">{customer.rating || 0}</span>
                </div>
                <span className="text-[10px] text-slate-400">({customer.totalRatings || 0} {t('reviews')})</span>
              </div>
            </div>
          </div>
          {customer.phone && (
            <a href={`tel:${customer.phone}`} className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <Phone size={14} />
            </a>
          )}
        </div>
      ) : null}

      {/* Actions */}
      {actions && <div className="mt-4 pt-4 border-t border-slate-100">{actions}</div>}
    </div>
  );
};

export default BookingCard;
