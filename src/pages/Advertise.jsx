import { useEffect, useMemo, useState } from 'react';
import { Megaphone, ExternalLink, Calendar, PlayCircle, ChevronLeft, ChevronRight } from '../components/icons';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');
  return `${apiUrl}${url}`;
};

const toEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }
    if (host.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith('/embed/')) return url;
      if (u.pathname.startsWith('/shorts/')) return `https://www.youtube.com/embed/${u.pathname.split('/')[2] || ''}`;
    }
    if (host.includes('linkedin.com')) {
      return '';
    }
    if (host.includes('tiktok.com')) {
      const parts = u.pathname.split('/').filter(Boolean);
      const vidIdx = parts.indexOf('video');
      if (vidIdx >= 0 && parts[vidIdx + 1]) return `https://www.tiktok.com/embed/v2/${parts[vidIdx + 1]}`;
      return '';
    }
    if (host.includes('instagram.com')) {
      const m = u.pathname.match(/\/(p|reel|tv)\/([^/]+)/);
      if (m) return `https://www.instagram.com/${m[1]}/${m[2]}/embed`;
      return '';
    }
  } catch (_) {}
  return '';
};

const getYoutubeId = (src) => {
  if (!src) return '';
  const m = src.match(/\/embed\/([^?]+)/);
  return m ? m[1] : '';
};

const VideoThumb = ({ slide, active }) => {
  const ytId = slide.type === 'embed' ? getYoutubeId(slide.src) : '';
  const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : '';
  const title = slide.ad?.title || 'Video';
  const company = slide.ad?.companyName || '';

  return (
    <div className={`w-full flex gap-2 p-1.5 rounded-lg transition text-left ${active ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
      <div className="relative w-28 sm:w-32 aspect-video bg-gray-800 rounded overflow-hidden shrink-0 border border-gray-700">
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : slide.type === 'file' ? (
          <video src={slide.src} className="w-full h-full object-cover" muted preload="metadata" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <PlayCircle className="h-6 w-6 text-amber-400" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <PlayCircle className="h-5 w-5 text-white drop-shadow" />
        </div>
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className={`text-xs sm:text-sm font-medium leading-snug line-clamp-2 ${active ? 'text-amber-400' : 'text-white'}`}>{title}</p>
        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{company}</p>
      </div>
    </div>
  );
};

const Advertise = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const res = await api.get('/ads'); setAds(res.data?.data || []); }
      catch { setError(t('ads.failed')); }
      finally { setLoading(false); }
    })();
  }, [t]);

  const slides = useMemo(() => {
    const out = [];
    ads.forEach((ad) => {
      (ad.videos || []).forEach((v, i) => out.push({ type: 'file', src: resolveMediaUrl(v), ad, key: `${ad._id}-vf${i}` }));
      (ad.videoLinks || []).forEach((link, i) => {
        const embed = toEmbedUrl(link);
        if (embed) out.push({ type: 'embed', src: embed, ad, key: `${ad._id}-ve${i}` });
        else out.push({ type: 'link', src: link, ad, key: `${ad._id}-vl${i}` });
      });
    });
    return out;
  }, [ads]);

  useEffect(() => { setIdx(0); }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const cur = slides[idx % slides.length];
    const delay = cur?.type === 'file' ? 15000 : 10000;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % slides.length);
        setVisible(true);
      }, 350);
    }, delay);
    return () => clearInterval(id);
  }, [slides.length, idx]);

  const go = (dir) => {
    if (slides.length <= 1) return;
    setVisible(false);
    setTimeout(() => {
      setIdx((i) => (i + dir + slides.length) % slides.length);
      setVisible(true);
    }, 250);
  };

  const select = (i) => {
    if (i === idx) return;
    setVisible(false);
    setTimeout(() => { setIdx(i); setVisible(true); }, 200);
  };

  const current = slides[idx % (slides.length || 1)];

  return (
    <div className="min-h-screen bg-gray-950 pt-32 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-white mb-4">
          <Megaphone className="h-5 w-5 text-amber-400" />
          <h1 className="text-lg sm:text-xl font-bold">{t('ads.featured')}</h1>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : slides.length === 0 ? (
          <div className="py-20 flex items-center justify-center">
            <div className="text-center text-gray-400 max-w-md">
              <Megaphone className="h-14 w-14 mx-auto mb-3 text-amber-500/50" />
              <p className="font-medium text-white mb-1">{t('ads.none')}</p>
              <p className="text-sm">No ad videos available yet. Add YouTube, TikTok, Instagram, LinkedIn links or upload short videos from the Dashboard.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="relative w-full max-w-2xl mx-auto aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 shadow-xl">
                <div className={`absolute inset-0 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                  {current?.type === 'file' ? (
                    <video key={current.key} src={current.src} className="w-full h-full object-contain bg-black" controls autoPlay muted playsInline />
                  ) : current?.type === 'embed' ? (
                    <iframe key={current.key} src={current.src} title={current.ad?.title || 'Ad video'} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  ) : current?.type === 'link' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-center p-6">
                      <PlayCircle className="h-14 w-14 text-amber-400 mb-3" />
                      <p className="text-white font-semibold mb-3">{current.ad?.title || 'Video'}</p>
                      <a href={current.src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-semibold">Open Video <ExternalLink className="h-4 w-4" /></a>
                    </div>
                  ) : null}
                </div>
                {slides.length > 1 && (
                  <>
                    <button onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center border border-white/20" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
                    <button onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center border border-white/20" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
                  </>
                )}
              </div>

              <div className="max-w-2xl mx-auto mt-3">
                <h2 className="text-white text-base sm:text-lg font-bold leading-tight">{current?.ad?.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {current?.ad?.targetUrl && (
                    <a href={current.ad.targetUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black px-3 py-1.5 rounded text-xs font-semibold">
                      {t('ads.visit')} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <aside className="w-full lg:w-80 xl:w-96 shrink-0">
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Videos</h3>
                  <span className="text-xs text-gray-400">{idx + 1}/{slides.length}</span>
                </div>
                <div className="max-h-[70vh] overflow-y-auto p-1.5 space-y-1">
                  {slides.map((s, i) => (
                    <button key={s.key} type="button" onClick={() => select(i)} className="w-full">
                      <VideoThumb slide={s} active={i === idx} />
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advertise;
