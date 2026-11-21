import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');
  return `${apiUrl}${url}`;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  const [properties, setProperties] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [ads, setAds] = useState([]);
  const [brandVideo, setBrandVideo] = useState(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const loadInitialData = async () => {
    let mounted = true;
    try {
      const [pRes, jRes, aRes, sRes] = await Promise.allSettled([
        api.get('/properties'),
        api.get('/jobs'),
        api.get('/ads'),
        api.get('/settings'),
      ]);
      if (!mounted) return;
      if (pRes.status === 'fulfilled') setProperties(pRes.value.data?.data || []);
      if (jRes.status === 'fulfilled') setJobs(jRes.value.data?.data || []);
      if (aRes.status === 'fulfilled') setAds(aRes.value.data?.data || []);
      if (sRes.status === 'fulfilled' && sRes.value.data?.data?.brandVideoUrl) {
        setBrandVideo(resolveMediaUrl(sRes.value.data.data.brandVideoUrl));
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadInitialData();
    
    // Listen for settings updates from AdminDashboard
    const handleSettingsUpdate = async () => {
      const videoUrl = await fetchBrandVideo();
      setBrandVideo(videoUrl);
    };
    
    window.addEventListener('settings-updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate);
    };
  }, []);

  const items = useMemo(() => {
    const propItems = properties.flatMap((p) => {
      const imgs = (p.images && p.images.length ? p.images : []).map(resolveMediaUrl).filter(Boolean);
      if (imgs.length) return imgs.map((img, i) => ({ key: `p-${p._id}-${i}`, image: img, label: p.title || 'Property', type: 'image' }));
      return [{ key: `p-${p._id}`, image: '', label: p.title || 'Property', type: 'none' }];
    });
    const jobItems = jobs.map((j) => ({ key: `j-${j._id}`, image: '', label: j.title || j.company || 'Job', type: 'none' }));
    const adItems = ads.flatMap((a) => {
      const imgs = (a.images && a.images.length ? a.images : (a.imageUrl ? [a.imageUrl] : [])).map(resolveMediaUrl).filter(Boolean);
      if (imgs.length) return imgs.map((img, i) => ({ key: `a-${a._id}-${i}`, image: img, label: a.title || a.companyName || 'Ad', type: 'image' }));
      return [{ key: `a-${a._id}`, image: '', label: a.title || a.companyName || 'Ad', type: 'none' }];
    });
    const mixed = shuffle([...propItems, ...adItems, ...jobItems]);
    if (mixed.length === 0) {
      return [
        { key: 'f1', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=60', label: 'Homes', type: 'image' },
        { key: 'f2', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=60', label: 'Cars', type: 'image' },
        { key: 'f3', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=60', label: 'Plots', type: 'image' },
        { key: 'f4', image: '', label: 'Jobs', type: 'none' },
        { key: 'f5', image: '', label: 'Ads', type: 'none' },
      ];
    }
    return mixed;
  }, [properties, jobs, ads]);

  // Filter items with images for rotation
  const displayItems = useMemo(() => items.filter(item => item.image), [items]);

  useEffect(() => { setIndex(0); }, [displayItems.length]);

  useEffect(() => {
    if (displayItems.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % displayItems.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(id);
  }, [displayItems.length]);

  const current = displayItems[index % displayItems.length];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-12 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white overflow-hidden border-b border-amber-700/30">
      <div className="h-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          <img src="/adds.png" alt="" className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 object-contain banner-text-animate" />
          <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide banner-text-animate whitespace-nowrap drop-shadow-sm truncate">Advertise Here</span>
        </div>
        <div className="flex-1 h-full py-1 flex items-center justify-end gap-2 overflow-hidden min-w-0">
          {/* Permanent Brand Video Card */}
          {brandVideo && (
            <div className="h-[34px] w-[58px] sm:w-[82px] rounded overflow-hidden bg-white/20 border border-white/20 shadow-sm shrink-0 flex-shrink-0" title="Brand Video">
              <video
                src={brandVideo}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          )}
          {/* Rotating Images Card */}
          {current && (
            <div className={`h-[34px] w-[58px] sm:w-[82px] rounded overflow-hidden bg-white/20 border border-white/20 shadow-sm shrink-0 transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}>
              {current.image ? (
                <img src={current.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[9px] sm:text-[10px] font-semibold text-white/95 bg-black/10 px-1 text-center leading-tight truncate">
                  {current.label}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertiseBanner;