import { useEffect, useMemo, useState, useRef } from 'react';
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
  const [videoPlaylist, setVideoPlaylist] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

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

  // Build video playlist from all sources
  const buildVideoPlaylist = useMemo(() => {
    const videos = [];
    
    // Add brand video first
    if (brandVideo) {
      videos.push({ 
        key: 'brand-video', 
        src: brandVideo, 
        label: 'Brand Video',
        type: 'video'
      });
    }
    
    // Add property videos
    properties.forEach(p => {
      if (p.videos && p.videos.length) {
        p.videos.forEach((v, i) => {
          videos.push({
            key: `p-${p._id}-v${i}`,
            src: resolveMediaUrl(v),
            label: p.title || 'Property',
            type: 'video'
          });
        });
      }
    });
    
    // Add job videos
    jobs.forEach(j => {
      if (j.videos && j.videos.length) {
        j.videos.forEach((v, i) => {
          videos.push({
            key: `j-${j._id}-v${i}`,
            src: resolveMediaUrl(v),
            label: j.title || j.company || 'Job',
            type: 'video'
          });
        });
      }
    });
    
    // Add ad videos
    ads.forEach(a => {
      if (a.videos && a.videos.length) {
        a.videos.forEach((v, i) => {
          videos.push({
            key: `a-${a._id}-v${i}`,
            src: resolveMediaUrl(v),
            label: a.title || a.companyName || 'Ad',
            type: 'video'
          });
        });
      }
    });
    
    return shuffle(videos);
  }, [properties, jobs, ads, brandVideo]);

  // Initialize video playlist when data loads
  useEffect(() => {
    if (buildVideoPlaylist.length > 0) {
      setVideoPlaylist(buildVideoPlaylist);
      setCurrentVideoIndex(0);
    }
  }, [buildVideoPlaylist]);

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

  // Handle video ended - play next
  const handleVideoEnded = () => {
    if (videoPlaylist.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % videoPlaylist.length);
    }
  };

  // Handle video error - skip to next
  const handleVideoError = () => {
    console.warn('Video failed to load, skipping:', videoPlaylist[currentVideoIndex]?.src);
    handleVideoEnded();
  };

  const currentVideo = videoPlaylist[currentVideoIndex];

  // Build rotating images from properties/jobs/ads (fallback)
  const items = useMemo(() => {
    const propItems = properties.flatMap((p) => {
      const imgs = (p.images && p.images.length ? p.images : []).map(resolveMediaUrl).filter(Boolean);
      if (imgs.length) return imgs.map((img, i) => ({ key: `p-${p._id}-${i}`, image: img, label: p.title || 'Property', type: 'image' }));
      return [];
    });
    const jobItems = jobs.flatMap((j) => {
      const imgs = (j.images && j.images.length ? j.images : []).map(resolveMediaUrl).filter(Boolean);
      if (imgs.length) return imgs.map((img, i) => ({ key: `j-${j._id}-${i}`, image: img, label: j.title || j.company || 'Job', type: 'image' }));
      return [];
    });
    const adItems = ads.flatMap((a) => {
      const imgs = (a.images && a.images.length ? a.images : (a.imageUrl ? [a.imageUrl] : [])).map(resolveMediaUrl).filter(Boolean);
      if (imgs.length) return imgs.map((img, i) => ({ key: `a-${a._id}-${i}`, image: img, label: a.title || a.companyName || 'Ad', type: 'image' }));
      return [];
    });
    const mixed = shuffle([...propItems, ...adItems, ...jobItems]);
    if (mixed.length === 0) {
      return [
        { key: 'f1', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=60', label: 'Homes', type: 'image' },
        { key: 'f2', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=60', label: 'Cars', type: 'image' },
        { key: 'f3', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=60', label: 'Plots', type: 'image' },
      ];
    }
    return mixed;
  }, [properties, jobs, ads]);

  const displayItems = useMemo(() => items.filter(item => item.image), [items]);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageVisible, setImageVisible] = useState(true);
  const currentImage = displayItems[imageIndex % displayItems.length];

  // Rotate images every 3 seconds
  useEffect(() => {
    if (displayItems.length <= 1) return;
    const id = setInterval(() => {
      setImageVisible(false);
      setTimeout(() => {
        setImageIndex((i) => (i + 1) % displayItems.length);
        setImageVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(id);
  }, [displayItems.length]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-12 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white overflow-hidden border-b border-amber-700/30">
      <div className="h-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          <img src="/adds.png" alt="" className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 object-contain banner-text-animate" />
          <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide banner-text-animate whitespace-nowrap drop-shadow-sm truncate">Advertise Here</span>
        </div>
        <div className="flex-1 h-full py-1 flex items-center justify-end gap-2 overflow-hidden min-w-0">
          {/* Video Playlist - plays one after another, muted */}
          {videoPlaylist.length > 0 && currentVideo && (
            <div className="h-[34px] w-[58px] sm:w-[82px] rounded overflow-hidden bg-white/20 border border-white/20 shadow-sm shrink-0 flex-shrink-0" title={currentVideo.label}>
              <video
                ref={videoRef}
                src={currentVideo.src}
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
          {/* Rotating Images Card (fallback when no videos) */}
          {videoPlaylist.length === 0 && currentImage && (
            <div className={`h-[34px] w-[58px] sm:w-[82px] rounded overflow-hidden bg-white/20 border border-white/20 shadow-sm shrink-0 transition-opacity duration-400 ${imageVisible ? 'opacity-100' : 'opacity-0'}`}>
              {currentImage.image ? (
                <img src={currentImage.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[9px] sm:text-[10px] font-semibold text-white/95 bg-black/10 px-1 text-center leading-tight truncate">
                  {currentImage.label}
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