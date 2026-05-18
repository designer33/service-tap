import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const GOOGLE_PROFILE_URL =
  'https://www.google.com.pk/search?trk=https://c.gle/AOExmq3k_kAmQvxExEJDMrW4OjwAxt772B44jAo7Xn61qMOLsDjIH4GMjWl7L_GFguIS2_LK_VS1MBGiT7ShqxXAVGCOQfCEDaeLEK_URMOFnZziJShre1_tXq-GZlW65vDO&q=Service+Knock&ludocid=13049355235583222140&lsig=AB86z5Vqh-Jc0Ya3j-FYvtaUC7Rr';

const REVIEWS = [
  {
    name: 'Muhammad Usman',
    initials: 'MU',
    color: 'bg-blue-500',
    rating: 5,
    date: '2 weeks ago',
    text: 'Excellent service! The electrician arrived on time and fixed all the wiring issues in my house. Very professional and CNIC-verified as promised. Highly recommend Service Knock to everyone.',
  },
  {
    name: 'Ayesha Siddiqui',
    initials: 'AS',
    color: 'bg-pink-500',
    rating: 5,
    date: '1 month ago',
    text: 'Booked a plumber through Service Knock and I was really impressed. The worker was verified, polite, and did a clean job fixing our bathroom pipes. Will definitely use again!',
  },
  {
    name: 'Bilal Ahmed',
    initials: 'BA',
    color: 'bg-green-500',
    rating: 5,
    date: '3 weeks ago',
    text: 'Got my AC serviced and refrigerator repaired in one visit. The technician was skilled and explained everything clearly. Service Knock makes it so easy to find trusted workers in Lahore.',
  },
  {
    name: 'Sana Malik',
    initials: 'SM',
    color: 'bg-purple-500',
    rating: 5,
    date: '2 months ago',
    text: 'Amazing platform! I needed a carpenter urgently and found one within hours. The work quality was top-notch and the pricing was fair. Customer support was also very responsive.',
  },
  {
    name: 'Tariq Mehmood',
    initials: 'TM',
    color: 'bg-orange-500',
    rating: 5,
    date: '1 month ago',
    text: 'Very reliable service. The painter they sent did a fantastic job on our entire house. Neat, professional, and finished ahead of schedule. Service Knock is Pakistan\'s best home services app!',
  },
  {
    name: 'Farrukh Iqbal',
    initials: 'FI',
    color: 'bg-teal-500',
    rating: 5,
    date: '3 months ago',
    text: 'I\'ve used Service Knock multiple times now for different services. Each time the workers are verified and professional. It\'s great to have a trustworthy platform like this in Pakistan.',
  },
  {
    name: 'Nadia Rashid',
    initials: 'NR',
    color: 'bg-rose-500',
    rating: 5,
    date: '5 weeks ago',
    text: 'The mason they sent for our renovation was excellent — skilled, honest, and completed the work on time. Booking was simple and the app is very easy to use. Highly recommended!',
  },
  {
    name: 'Kamran Hussain',
    initials: 'KH',
    color: 'bg-indigo-500',
    rating: 5,
    date: '6 weeks ago',
    text: 'Called for a labour job and the workers showed up quickly and worked hard all day. Service Knock saved us so much time finding reliable help. Great concept for Pakistan!',
  },
];

const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const VISIBLE = { sm: 1, md: 2, lg: 3 };

const GoogleReviewsSlider = ({ language }) => {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const maxIndex = REVIEWS.length - visibleCount;

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setIndex((prev) => Math.min(prev, REVIEWS.length - visibleCount));
  }, [visibleCount]);

  const next = useCallback(() => {
    setIndex((prev) => (prev >= REVIEWS.length - visibleCount ? 0 : prev + 1));
  }, [visibleCount]);

  const prev = useCallback(() => {
    setIndex((prev) => (prev <= 0 ? REVIEWS.length - visibleCount : prev - 1));
  }, [visibleCount]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next, isPaused]);

  const visibleReviews = REVIEWS.slice(index, index + visibleCount);

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
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <StarIcon key={i} filled />)}
            </div>
            <span className="font-extrabold text-dark text-lg">4.8</span>
            <span className="text-slate-400 text-sm">/ 5 &mdash; {language === 'ur' ? 'گوگل ریویوز پر' : 'on Google Reviews'}</span>
          </div>
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Prev */}
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4">
            {visibleReviews.map((review, i) => (
              <div
                key={index + i}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                {/* Top row: avatar + name + Google logo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${review.color} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="font-bold text-dark text-sm leading-tight">{review.name}</p>
                      <p className="text-[11px] text-slate-400">{review.date}</p>
                    </div>
                  </div>
                  <GoogleLogo />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => <StarIcon key={i} filled />)}
                </div>

                {/* Text */}
                <p className="text-slate-600 text-sm leading-relaxed flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: REVIEWS.length - visibleCount + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all ${i === index ? 'w-6 h-2 bg-primary-500' : 'w-2 h-2 bg-slate-300'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
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
      </div>
    </section>
  );
};

export default GoogleReviewsSlider;
