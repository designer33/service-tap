import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const VerificationPopup = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show for customers/workers who are flagged for verification
  // AND hide it if they are already on the profile page so they can actually verify
  if (!user || user.role === 'admin' || location.pathname.startsWith('/profile')) return null;
  
  const showPopup = user.requiresProfilePic || user.requiresVerification;
  if (!showPopup) return null;

  const isProfilePicStep = user.requiresProfilePic;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className={`p-1 ${isProfilePicStep ? 'bg-primary-500' : 'bg-red-500'}`}></div>
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`w-20 h-20 ${isProfilePicStep ? 'bg-primary-50' : 'bg-red-50'} rounded-full flex items-center justify-center mb-6`}>
            <ShieldAlert size={40} className={isProfilePicStep ? 'text-primary-500' : 'text-red-500'} />
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-2">
            {isProfilePicStep
              ? (language === 'ur' ? 'پروفائل تصویر درکار ہے' : 'Profile Photo Required')
              : (user.verificationStatus === 'pending' 
                  ? (language === 'ur' ? 'تصدیق زیرِ غور ہے' : 'Verification Under Review')
                  : (language === 'ur' ? 'شناختی تصدیق درکار ہے' : 'ID Verification Required'))
            }
          </h2>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            {isProfilePicStep
              ? (language === 'ur'
                  ? 'شناختی تصدیق سے پہلے آپ کو اپنی پروفائل تصویر اپ لوڈ کرنی ہوگی۔ یہ تصویر آپ کے شناختی کارڈ (CNIC) کے مطابق ہونی چاہیے۔'
                  : 'Before identity verification, you must upload a clear profile photo. This photo must match the face on your CNIC document.')
              : (user.verificationStatus === 'pending'
                  ? (language === 'ur' 
                      ? 'آپ کی شناختی دستاویز موصول ہو گئی ہے۔ براہ کرم منظوری کے لیے 24 سے 48 گھنٹے انتظار کریں۔' 
                      : 'Your ID has been submitted and is currently under review. Please allow 24 to 48 hours for our team to approve your profile.')
                  : (language === 'ur' 
                      ? 'سروس ٹیپ استعمال کرنے کے لیے آپ کو اپنی شناختی دستاویز (CNIC) کی تصویر اپ لوڈ کرنی ہوگی۔ یہ تمام صارفین کے لیے لازمی ہے۔' 
                      : 'To use Service Knock, you must verify your identity by uploading your CNIC. This is mandatory for all users to ensure safety and trust.'))
            }
          </p>

          <div className="flex flex-col gap-3 w-full">
            {user.verificationStatus !== 'pending' && (
              <button 
                onClick={() => navigate(`/profile/${user.slug || user._id}`)}
                className={`w-full py-3.5 flex items-center justify-center gap-2 group rounded-xl font-bold transition-all ${isProfilePicStep ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-100' : 'btn-primary'}`}
              >
                {isProfilePicStep
                  ? (language === 'ur' ? 'پروفائل تصویر اپ لوڈ کریں' : 'Upload Profile Photo')
                  : (language === 'ur' ? 'ابھی تصدیق کریں' : 'Verify Identity Now')
                }
                <ArrowRight size={18} className={`${language === 'ur' ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
              </button>
            )}
            
            <p className="text-[11px] text-slate-400 mt-2 italic">
              {isProfilePicStep
                ? (language === 'ur' 
                    ? 'آپ کی تصویر آپ کے شناختی کارڈ سے میچ ہونی چاہیے۔' 
                    : 'Your photo must match your official ID document.')
                : (user.verificationStatus === 'pending'
                    ? (language === 'ur' 
                        ? 'منظوری کے بعد آپ کی تمام سہولیات بحال کر دی جائیں گی۔' 
                        : 'All features will be unlocked once your verification is approved.')
                    : (language === 'ur' 
                        ? 'تصدیق کے بغیر آپ درخواستیں پوسٹ یا قبول نہیں کر سکتے۔' 
                        : 'You will not be able to post new requests or accept offers until verified.'))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;
