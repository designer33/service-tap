import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const VerificationBanner = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || user.isVerified || user.role === 'admin') return null;
  
  const isProfilePage = location.pathname.startsWith('/profile');

  return (
    <div className={`bg-amber-50 border-b border-amber-200 py-3 px-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 sticky ${user?.isBlocked ? 'top-[118px]' : 'top-[74px]'} z-40 shadow-sm ${language === 'ur' ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex items-center gap-2 text-amber-600">
        <ShieldAlert size={18} className="animate-pulse" />
        <span className="font-bold text-sm">
          {user.verificationStatus === 'pending'
            ? (language === 'ur' ? 'تصدیق زیرِ غور ہے' : 'Verification Pending')
            : (language === 'ur' ? 'شناختی تصدیق درکار ہے' : 'Verify Your Identity')
          }
        </span>
      </div>
      
      <p className="text-amber-800 text-[13px] text-center md:text-left leading-tight max-w-2xl">
        {user.verificationStatus === 'pending'
          ? (language === 'ur' 
              ? 'آپ کی شناختی دستاویز موصول ہو گئی ہے۔ براہ کرم منظوری کے لیے 24 سے 48 گھنٹے انتظار کریں۔' 
              : 'Your ID has been submitted and is currently under review. Please allow 24 to 48 hours for approval.')
          : user.requiresProfilePic 
            ? (language === 'ur' 
                ? 'شناختی تصدیق سے پہلے آپ کو اپنی پروفائل تصویر اپ لوڈ کرنی ہوگی۔' 
                : 'Please upload a profile photo first to start identity verification.')
            : (language === 'ur' 
                ? 'سروس ٹیپ استعمال کرنے اور اعتماد بڑھانے کے لیے اپنی شناختی دستاویز (CNIC) اپ لوڈ کریں۔' 
                : 'To enjoy full platform features and build trust, please upload your identity document (CNIC).')
        }
        {!isProfilePage && !user.verificationStatus && (
          <span className="ms-1 font-bold">
            {language === 'ur' ? ' تصدیق کے لیے اپنے پروفائل پر جائیں۔' : ' Go to your profile to upload.'}
          </span>
        )}
        {isProfilePage && !user.verificationStatus && (
          <span className="ms-1 font-bold underline">
            {language === 'ur' ? ' نیچے دیے گئے "شناختی تصدیق" کارڈ پر جائیں۔' : ' Scroll down to the "Identity Verification" section below.'}
          </span>
        )}
      </p>

      {!isProfilePage && user.verificationStatus !== 'pending' && (
        <button 
          onClick={() => navigate(`/profile/${user.slug || user._id}`)}
          className="bg-amber-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-amber-700 transition-colors flex items-center gap-1.5 shrink-0"
        >
          {language === 'ur' ? 'پروفائل پر جائیں' : 'Go to Profile'}
          <ArrowRight size={14} className={language === 'ur' ? 'rotate-180' : ''} />
        </button>
      )}
    </div>
  );
};

export default VerificationBanner;
