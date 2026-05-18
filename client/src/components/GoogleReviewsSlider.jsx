import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import api from '../api/axios';

const GOOGLE_PROFILE_URL =
  'https://www.google.com.pk/search?trk=https://c.gle/AOExmq3k_kAmQvxExEJDMrW4OjwAxt772B44jAo7Xn61qMOLsDjIH4GMjWl7L_GFguIS2_LK_VS1MBGiT7ShqxXAVGCOQfCEDaeLEK_URMOFnZziJShre1_tXq-GZlW65vDO&q=Service+Knock&ludocid=13049355235583222140&lsig=AB86z5Vqh-Jc0Ya3j-FYvtaUC7Rr';

const AVATAR_COLORS = [
  'bg-blue-500','bg-pink-500','bg-green-500','bg-purple-500',
  'bg-orange-500','bg-teal-500','bg-rose-500','bg-indigo-500',
];

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} viewBox="0 0 24 24" className={`w-4 h-4 ${i <= rating ? 'text-amber-400' : 'text-slate-200'} fill-current`}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({ review, colorClass }) => {
  const [imgError, setImgError] = useState(false);
  const initials = review.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {review.photo && !imgError ? (
            <img
              src={review.photo}
              alt={review.name}
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {initials}
            </div>
          )}
          <div>
            <p className="font-bold text-dark text-sm leading-tight">{review.name}</p>
            <p className="text-[11px] text-slate-400">{review.date}</p>
          </div>
        </div>
        <GoogleLogo />
      </div>

      <Stars rating={review.rating} />

      <p className="text-slate-600 text-sm leading-relaxed flex-1 line-clamp-5">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
};

const GoogleReviewsSlider = ({ language }) => {
  const [reviews, setReviews]           = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [index, setIndex]               = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused]         = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get('/contact/google-reviews')
      .then(({ data }) => {
        if (data.success && data.reviews?.length) {
          setReviews(data.reviews);
          setOverallRating(data.rating);
          setTotalRatings(data.total);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640)       setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else                               setVisibleCount(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setIndex(prev => Math.min(prev, Math.max(0, reviews.length - visibleCount)));
  }, [visibleCount, reviews.length]);

  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const next = useCallback(() => {
    setIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  }, [maxIndex]);

  const prev = useCallback(() => {
    setIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused || reviews.length === 0) return;
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [next, isPaused, reviews.length]);

  if (error) return null;

  return (
    <section className="bg-white py-20">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full mb-4">
            <GoogleLogo />
            {language === 'ur' ? 'گوگل ریویوز' : 'Google Reviews'}
          </span>
          <h2 className="section-title">
            {language === 'ur' ? 'گوگل پر ہمارے گاہکوں کی رائے' : 'What Customers Say on Google'}
          </h2>
          {overallRating && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <Stars rating={Math.round(overallRating)} />
              <span className="font-extrabold text-dark text-lg">{overallRating.toFixed(1)}</span>
              <span className="text-slate-400 text-sm">
                / 5
                {totalRatings ? ` · ${totalRatings.toLocaleString()} ${language === 'ur' ? 'ریویوز' : 'reviews'}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 h-48 animate-pulse" />
            ))}
          </div>
        )}

        {/* Slider */}
        {!loading && reviews.length > 0 && (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Prev */}
            {reviews.length > visibleCount && (
              <button
                onClick={prev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Cards */}
            <div className={`grid gap-5 px-2 ${
              visibleCount === 1 ? 'grid-cols-1' :
              visibleCount === 2 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}>
              {reviews.slice(index, index + visibleCount).map((review, i) => (
                <ReviewCard
                  key={`${index}-${i}`}
                  review={review}
                  colorClass={AVATAR_COLORS[(index + i) % AVATAR_COLORS.length]}
                />
              ))}
            </div>

            {/* Next */}
            {reviews.length > visibleCount && (
              <button
                onClick={next}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        {/* Dots */}
        {!loading && reviews.length > visibleCount && (
          <div className="flex justify-center gap-1.5 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === index ? 'w-6 h-2 bg-primary-500' : 'w-2 h-2 bg-slate-300'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && (
          <div className="text-center mt-8">
            <a
              href={GOOGLE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800 font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
            >
              <GoogleLogo />
              {language === 'ur' ? 'گوگل پر تمام ریویوز دیکھیں' : 'Read all reviews on Google'}
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleReviewsSlider;
