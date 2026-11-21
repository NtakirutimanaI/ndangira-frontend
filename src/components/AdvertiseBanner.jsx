import { useEffect, useState, useRef } from 'react';
import api from '../services/api';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');
  return `${apiUrl}${url}`;
};

const fetchBrandVideo = async () => {
  try {
    const res = await api.get('/settings');
    if (res.data?.data?.brandVideoUrl) {
      return resolveMediaUrl(res.data.data.brandVideoUrl);
    }
  } catch (_) {}
  return null;
};

const AdvertiseBanner = () => {
  const [brandVideo, setBrandVideo] = useState(null);
  const videoRef = useRef(null);

  const loadBrandVideo = async () => {
    const videoUrl = await fetchBrandVideo();
    setBrandVideo(videoUrl);
  };

  useEffect(() => {
    loadBrandVideo();
    
    // Listen for settings updates from AdminDashboard
    const handleSettingsUpdate = () => {
      loadBrandVideo();
    };
    
    window.addEventListener('settings-updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate);
    };
  }, []);

  // Handle video ended - loop the brand video
  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Handle video error
  const handleVideoError = () => {
    console.warn('Brand video failed to load');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-12 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white overflow-hidden border-b border-amber-700/30">
      <div className="h-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          <img src="/adds.png" alt="" className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 object-contain banner-text-animate" />
          <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide banner-text-animate whitespace-nowrap drop-shadow-sm truncate">Advertise Here</span>
        </div>
        <div className="flex-1 h-full py-1 flex items-center justify-end gap-2 overflow-hidden min-w-0">
          {/* Brand Video Card - ONLY from Settings page */}
          {brandVideo && (
            <div className="h-[34px] w-[58px] sm:w-[82px] rounded overflow-hidden bg-white/20 border border-white/20 shadow-sm shrink-0 flex-shrink-0" title="Brand Video">
              <video
                ref={videoRef}
                src={brandVideo}
                type="video/mp4"
                className="h-full w-full object-cover"
                autoPlay
                muted
                playsInline
                preload="metadata"
                onEnded={handleVideoEnded}
                onError={handleVideoError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertiseBanner;