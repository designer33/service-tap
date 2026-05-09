import { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ImageCropModal = ({ image, onCrop, onCancel, circular = true }) => {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set final size (e.g., 400x400 for profile pic)
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const img = imageRef.current;
    
    // Calculate scaling
    const container = containerRef.current;
    const containerSize = container.offsetWidth;
    
    // We want to capture what's in the center square of the container
    // The container is a square (e.g., 300x300)
    // The image is scaled by 'zoom' and moved by 'position'
    
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    
    // Draw image relative to its center, adjusted by position
    // We need to map position from container coords to final canvas coords
    const scaleFactor = size / containerSize;
    ctx.drawImage(
      img, 
      (position.x * scaleFactor) - (size / 2), 
      (position.y * scaleFactor) - (size / 2),
      img.naturalWidth * (containerSize / img.naturalWidth) * scaleFactor,
      img.naturalHeight * (containerSize / img.naturalHeight) * scaleFactor
    );
    
    ctx.restore();

    // Compression logic to ensure < 100KB
    let quality = 0.8;
    let croppedImage = canvas.toDataURL('image/jpeg', quality);
    
    // If over 100KB, reduce quality until it fits (max 5 attempts)
    // 100KB in base64 is roughly 137,000 characters
    while (croppedImage.length > 135000 && quality > 0.1) {
      quality -= 0.15;
      croppedImage = canvas.toDataURL('image/jpeg', quality);
    }
    
    onCrop(croppedImage);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-dark text-lg">{t('cropProfilePicture') || 'Crop Profile Picture'}</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Crop Area */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden cursor-move touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={image}
              alt="Crop"
              className="absolute pointer-events-none select-none max-w-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                left: '50%',
                top: '50%',
                marginLeft: '-50%',
                marginTop: '-50%',
                width: '100%',
                height: 'auto'
              }}
            />
            {/* Overlay */}
            <div className={`absolute inset-0 pointer-events-none border-4 border-primary-500/50 ${circular ? 'rounded-full' : 'rounded-2xl'} shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]`}></div>
          </div>

          {/* Controls */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <ZoomOut size={18} className="text-slate-400" />
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-primary-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
              <ZoomIn size={18} className="text-slate-400" />
            </div>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setRotation(r => (r - 90) % 360)}
                className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <RotateCw size={20} className="rotate-[-90deg]" />
              </button>
              <button 
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <RotateCw size={20} />
              </button>
              <button 
                onClick={() => { setPosition({ x: 0, y: 0 }); setZoom(1); setRotation(0); }}
                className="text-xs font-bold text-primary-600 hover:underline"
              >
                {t('reset') || 'Reset'}
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={onCancel}
              className="btn-ghost flex-1 py-3"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={handleCrop}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              <Check size={18} /> {t('apply') || 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
