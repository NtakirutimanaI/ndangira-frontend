import { useEffect, useState } from 'react';
import { Megaphone, ExternalLink, Calendar, Sparkles, PlayCircle } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

const API_BASE = 'http://localhost:5000';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url}`;
};

const toEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host.includes('youtu.be')) {
      const id = u.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (host.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith('/embed/')) return url;
      if (u.pathname.startsWith('/shorts/')) return `https://www.youtube.com/embed/${u.pathname.split('/')[2] || ''}`;
    }
  } catch (_) {}
  return '';
};

const Advertise = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const res = await api.get('/ads'); setAds(res.data?.data || []); }
      catch { setError('Failed to load advertisements'); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium mb-3"><Sparkles className="h-3.5 w-3.5" /> Partner Spotlight</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3"><Megaphone className="h-9 w-9 text-amber-600" /> Featured Advertisements</h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Discover businesses and partners promoting homes, vehicles, plots, and machinery on Ndangira.</p>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">{error}</div>}

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : ads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-amber-200 bg-white p-12 text-center text-gray-500">No active advertisements right now. Check back soon for partner offers.</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {ads.map((ad) => {
              const images = (ad.images && ad.images.length ? ad.images : (ad.imageUrl ? [ad.imageUrl] : [])).map(resolveMediaUrl).filter(Boolean);
              const cover = images[0];
              const videos = (ad.videoLinks || []).filter(Boolean);
              return (
                <article key={ad._id} className="block break-inside-avoid rounded-2xl border border-amber-100 bg-white shadow-sm hover:shadow-lg transition overflow-hidden group">
                  {cover ? (
                    <div className="relative h-44 bg-amber-50">
                      <img src={cover} alt={ad.title} className="h-full w-full object-cover" />
                      <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded bg-white/90 text-amber-700">{ad.plan}</span>
                      {images.length > 1 && <span className="absolute bottom-3 right-3 text-[11px] font-medium px-2 py-1 rounded bg-black/60 text-white">+{images.length - 1} photos</span>}
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center relative">
                      <Megaphone className="h-10 w-10 text-amber-500/60" />
                      <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded bg-white/90 text-amber-700">{ad.plan}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs font-medium text-amber-700 mb-1">{ad.companyName}</p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition">{ad.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">{ad.description}</p>

                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                        {images.slice(1, 6).map((src, i) => (
                          <img key={i} src={src} alt="" className="h-16 w-20 object-cover rounded border border-amber-100 shrink-0" />
                        ))}
                      </div>
                    )}

                    {videos.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {videos.slice(0, 2).map((link, i) => {
                          const embed = toEmbedUrl(link);
                          if (embed) {
                            return (
                              <div key={i} className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                                <iframe src={embed} title={`Ad video ${i + 1}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                              </div>
                            );
                          }
                          return (
                            <a key={i} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium">
                              <PlayCircle className="h-4 w-4" /> Watch video {videos.length > 1 ? i + 1 : ''} <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          );
                        })}
                        {videos.length > 2 && <p className="text-xs text-gray-500">+{videos.length - 2} more video link(s)</p>}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {ad.expiresAt ? `Until ${new Date(ad.expiresAt).toLocaleDateString()}` : 'Active'}</span>
                      {ad.targetUrl && <a href={ad.targetUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-700 font-medium hover:text-amber-800">Visit <ExternalLink className="h-3.5 w-3.5" /></a>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Advertise;
