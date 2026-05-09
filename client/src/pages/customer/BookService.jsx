import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Zap, Wrench, Wind, MapPin, FileText, Calendar, 
  ArrowRight, Hammer, Paintbrush, Building, Construction, 
  Users, Grid, Camera, Image as ImageIcon, Search, Mic, Trash2 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { resizeImage } from '../../utils/imageUtils';
import ImageCropModal from '../../components/ImageCropModal';

const BookService = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const services = [
    { value: 'electrician', label: t('electrician'), icon: Zap, color: 'border-amber-200 bg-amber-50 text-amber-600', selected: 'border-amber-400 bg-amber-100 ring-2 ring-amber-300' },
    { value: 'plumber', label: t('plumber'), icon: Wrench, color: 'border-blue-200 bg-blue-50 text-blue-600', selected: 'border-blue-400 bg-blue-100 ring-2 ring-blue-300' },
    { value: 'ac_fridge_repair', label: t('ac_fridge_repair'), icon: Wind, color: 'border-primary-200 bg-primary-50 text-primary-600', selected: 'border-primary-400 bg-primary-100 ring-2 ring-primary-300' },
    { value: 'carpenter', label: t('carpenter'), icon: Hammer, color: 'border-orange-200 bg-orange-50 text-orange-600', selected: 'border-orange-400 bg-orange-100 ring-2 ring-orange-300' },
    { value: 'painter', label: t('painter'), icon: Paintbrush, color: 'border-pink-200 bg-pink-50 text-pink-600', selected: 'border-pink-400 bg-pink-100 ring-2 ring-pink-300' },
    { value: 'mason', label: t('mason'), icon: Building, color: 'border-slate-200 bg-slate-50 text-slate-600', selected: 'border-slate-400 bg-slate-100 ring-2 ring-slate-300' },
    { value: 'steel_fixer', label: t('steel_fixer'), icon: Construction, color: 'border-gray-200 bg-gray-50 text-gray-700', selected: 'border-gray-400 bg-gray-100 ring-2 gray-slate-300' },
    { value: 'labour', label: t('labour'), icon: Users, color: 'border-teal-200 bg-teal-50 text-teal-600', selected: 'border-teal-400 bg-teal-100 ring-2 ring-teal-300' },
    { value: 'tile_fixer', label: t('tile_fixer'), icon: Grid, color: 'border-indigo-200 bg-indigo-50 text-indigo-600', selected: 'border-indigo-400 bg-indigo-100 ring-2 ring-indigo-300' },
  ];

  const [form, setForm] = useState({ 
    title: '', 
    serviceType: '', 
    issueDescription: '', 
    address: '', 
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    scheduledAt: '', 
    priceEstimate: '',
    mediaBase64: '',
    location: { lat: 30.3753, lng: 69.3451 } 
  });
  const [loading, setLoading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  
  // Audio & Speech States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Pre-load voices for better reliability
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = (text, englishFallback) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
    
    const voices = window.speechSynthesis.getVoices();
    const urduVoice = voices.find(v => v.lang.startsWith('ur'));
    
    let textToSpeak = text;
    let langToUse = language === 'ur' ? 'ur' : 'en-US';
    let selectedVoice = null;

    if (language === 'ur') {
      if (urduVoice) {
        selectedVoice = urduVoice;
        langToUse = 'ur';
      } else {
        // Fallback: If no Urdu voice, speak the English name with an English voice
        textToSpeak = englishFallback || text;
        langToUse = 'en-US';
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langToUse;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.85;
    
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBase64(reader.result);
          // If description is empty, set a placeholder
          if (!form.issueDescription.trim()) {
            setForm(prev => ({ 
              ...prev, 
              issueDescription: language === 'ur' ? 'وائس میسج منسلک ہے۔' : 'Voice message attached.' 
            }));
          }
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success(t('recordingStarted') || 'Recording started...');
    } catch (err) {
      console.error('Error starting recording:', err);
      toast.error(t('micError') || 'Microphone access denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    toast.success(t('recordingStopped') || 'Recording stopped.');
  };

  const handleServiceSelect = (value, label) => {
    setForm({ ...form, serviceType: value });
    // Replace underscores with spaces for clearer English speech (e.g. ac_fridge_repair -> ac fridge repair)
    const cleanEnglish = value.replace(/_/g, ' ');
    speak(label, cleanEnglish);
  };

  const handleAddressChange = (e) => {
    setForm({ ...form, address: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage) => {
    setForm({ ...form, mediaBase64: croppedImage });
    setImageToCrop(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceType) { toast.error(t('selectServiceType')); return; }
    setLoading(true);
    try {
      const payload = { ...form };
      payload.media = [];
      if (form.mediaBase64) {
        payload.media.push({ url: form.mediaBase64, type: 'image' });
      }
      if (audioBase64) {
        payload.media.push({ url: audioBase64, type: 'audio' });
      }
      delete payload.mediaBase64;
      await api.post('/bookings', payload);
      toast.success(t('bookingSubmittedToast'));
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || t('submitBookingError') || 'Failed to submit booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen py-10 animate-fade-in">
      <div className="page-container max-w-2xl">
        <div className={`mb-8 text-center sm:text-left ${language === 'ur' ? 'sm:text-right' : ''}`}>
          <h1 className="section-title">{t('bookService')}</h1>
          <p className="section-subtitle">{t('bookServiceSubtitle')}</p>
        </div>

        <div className="card shadow-sm relative overflow-visible">
          <form onSubmit={handleSubmit} className={`flex flex-col gap-6 ${language === 'ur' ? 'text-right' : ''}`}>
            <div>
              <label className="form-label" htmlFor="book-title">{t('jobTitle')} *</label>
              <input id="book-title" type="text" name="title" value={form.title}
                onChange={handleChange} required minLength={3} maxLength={100}
                placeholder={t('jobTitlePlaceholder')}
                className="form-input" />
            </div>

            <div>
              <label className="form-label">{t('selectService')} *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                {services.map(({ value, label, icon: Icon, color, selected }) => (
                  <button key={value} type="button" onClick={() => handleServiceSelect(value, label)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${form.serviceType === value ? selected : color + ' hover:opacity-90'}`}>
                    <Icon size={26} />
                    <span className="text-xs sm:text-sm font-semibold text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="book-desc">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <FileText size={14} /> {t('describeIssue')} *
                  </span>
                  <button 
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}
                  >
                    <Mic size={14} />
                    {isRecording ? t('stopRecording') : t('speakIssue')}
                  </button>
                </div>
              </label>
              <textarea id="book-desc" name="issueDescription" value={form.issueDescription}
                onChange={handleChange} rows={4} required minLength={10}
                placeholder={t('issuePlaceholder')}
                className="form-input resize-none" />
              
              {audioURL && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <audio src={audioURL} controls className="h-8 flex-1" />
                  <button 
                    type="button" 
                    onClick={() => { setAudioURL(''); setAudioBase64(''); }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin size={13} /> {t('serviceAddress')} *
              </p>
              
              <div>
                <label className="form-label text-[11px] uppercase tracking-wide" htmlFor="book-address">{language === 'ur' ? 'گھر کا پتہ' : 'Street Address'}</label>
                <input id="book-address" type="text" name="address" value={form.address} onChange={handleChange}
                  placeholder={language === 'ur' ? 'گھر کا نمبر، گلی، علاقہ' : "House #, Street, Area"} required
                  className="form-input" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-[11px] uppercase tracking-wide" htmlFor="book-city">{language === 'ur' ? 'شہر' : 'City'}</label>
                  <input id="book-city" type="text" name="city" value={form.city} onChange={handleChange}
                    placeholder="e.g. Islamabad" required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label text-[11px] uppercase tracking-wide" htmlFor="book-state">{language === 'ur' ? 'صوبہ' : 'State'}</label>
                  <select id="book-state" name="state" value={form.state} onChange={handleChange} required
                    className="form-select">
                    <option value="">{language === 'ur' ? 'منتخب کریں' : 'Select'}</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="AJK">AJK</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-[11px] uppercase tracking-wide" htmlFor="book-zip">{language === 'ur' ? 'زپ کوڈ' : 'Zip Code'}</label>
                  <input id="book-zip" type="text" name="zipCode" value={form.zipCode} onChange={handleChange}
                    placeholder="44000" required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label text-[11px] uppercase tracking-wide" htmlFor="book-country">{language === 'ur' ? 'ملک' : 'Country'}</label>
                  <input id="book-country" type="text" name="country" value={form.country} disabled
                    className="form-input bg-slate-100 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">
                <span className="flex items-center gap-1.5"><Camera size={14} /> {t('jobPhotosOptional')}</span>
              </label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200">
                  {form.mediaBase64 ? <img src={form.mediaBase64} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-300" />}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="job-photo" />
                  <label htmlFor="job-photo" className="btn-outline py-2 px-4 text-xs cursor-pointer inline-block">{t('uploadPhoto')}</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">💰 {t('priceEstimateLabel')}</label>
                <input type="number" name="priceEstimate" value={form.priceEstimate} onChange={handleChange} className={`form-input ${language === 'ur' ? 'text-right' : ''}`} />
              </div>
              <div>
                <label className="form-label">📅 {t('preferredDateTime')}</label>
                <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange} className={`form-input ${language === 'ur' ? 'text-right' : ''}`} />
              </div>
            </div>

            <button type="submit" disabled={loading || !form.serviceType} className="btn-primary w-full py-4 text-base font-bold">
              {loading ? t('submitting') : t('submitBooking')}
            </button>
          </form>
        </div>
      </div>
      {imageToCrop && (
        <ImageCropModal 
          image={imageToCrop} 
          onCrop={handleCropComplete} 
          onCancel={() => setImageToCrop(null)} 
          circular={false}
        />
      )}
    </div>
  );
};

export default BookService;
