import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Home, Search, LogOut, Shield, Building2, Menu, X, Briefcase, Megaphone, Languages, Play } from './icons';
import api from '../services/api';
import { resolveMediaUrl } from '../utils/media';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adVideos, setAdVideos] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);

  const isOwnerOrAdmin = user && (user.role === 'owner' || user.role === 'admin');
  const close = () => setMenuOpen(false);

  const navLink = (to, label) => (
    <Link to={to} onClick={close} className={location.pathname === to ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-gray-900'}>
      {label}
    </Link>
  );

  useEffect(() => {
    const fetchAdVideos = async () => {
      try {
        const res = await api.get('/ads');
        const ads = res.data?.data || [];
        const videos = ads.flatMap(ad => [
          ...(ad.videos || []).map(v => ({ src: resolveMediaUrl(v), title: ad.title || ad.companyName || 'Advertisement' })),
          ...(ad.videoLinks || []).map(v => ({ src: v, title: ad.title || ad.companyName || 'Advertisement', external: true }))
        ]);
        setAdVideos(videos);
      } catch (_) {}
    };
    fetchAdVideos();
  }, []);

  useEffect(() => {
    if (adVideos.length <= 1) return;
    const id = setInterval(() => setVideoIndex(i => (i + 1) % adVideos.length), 5000);
    return () => clearInterval(id);
  }, [adVideos.length]);

  const currentVideo = adVideos[videoIndex];

  return (
    <nav className="fixed top-12 w-full z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={close} className="flex items-center gap-2 py-1">
            <img src="/isangeLogo.png" alt="Isange - Aho ibyo ukeneye bihurira" className="h-12 sm:h-14 w-auto max-w-[180px] object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLink('/', t('nav.home'))}
            {navLink('/listings', t('nav.listings'))}
            {navLink('/search', t('nav.search'))}
            {navLink('/jobs', t('nav.jobs'))}
            <Link to="/advertise" onClick={close} className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-700">{t('nav.advertise')}</Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Video section - displays admin uploaded ad videos */}
            {adVideos.length > 0 && (
              <div className="relative w-32 sm:w-40 aspect-video bg-black rounded overflow-hidden border border-gray-200 shrink-0">
                {currentVideo.external ? (
                  <iframe
                    src={currentVideo.src}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                ) : (
                  <video
                    className="w-full h-full object-cover"
                    src={currentVideo.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-1.5">
                  <span className="text-white text-[10px] font-medium px-1.5 py-0.5 bg-black/60 rounded">{currentVideo.title}</span>
                  <Play className="w-4 h-4 text-white/80" />
                </div>
              </div>
            )}
            {user ? (
              <>
                {isOwnerOrAdmin && (
                  <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <Building2 className="h-4 w-4" /> {t('nav.myProperties')}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <Shield className="h-4 w-4" /> {t('nav.admin')}
                  </Link>
                )}
                {/* Language button near logout */}
                <button
                  type="button"
                  onClick={toggleLang}
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-green-700"
                  title={lang === 'en' ? t('nav.switchToRw') : t('nav.switchToEn')}
                  aria-label={lang === 'en' ? t('nav.switchToRw') : t('nav.switchToEn')}
                >
                  <Languages className="h-5 w-5" />
                </button>
                <button onClick={logout} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                  <LogOut className="h-4 w-4" /> {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                {/* Language button near login/register */}
                <button
                  type="button"
                  onClick={toggleLang}
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-green-700"
                  title={lang === 'en' ? t('nav.switchToRw') : t('nav.switchToEn')}
                  aria-label={lang === 'en' ? t('nav.switchToRw') : t('nav.switchToEn')}
                >
                  <Languages className="h-5 w-5" />
                </button>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">{t('nav.login')}</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700">{t('nav.join')}</Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              aria-label={t('nav.toggleMenu')}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
            <div className="flex flex-col gap-2 pb-3 border-b border-gray-100">
              <Link to="/" onClick={close} className={`flex items-center gap-2 py-1 ${location.pathname === '/' ? 'text-green-600 font-medium' : 'text-gray-700'}`}><Home className="h-4 w-4" /> {t('nav.home')}</Link>
              <Link to="/listings" onClick={close} className={`flex items-center gap-2 py-1 ${location.pathname === '/listings' ? 'text-green-600 font-medium' : 'text-gray-700'}`}><Building2 className="h-4 w-4" /> {t('nav.listings')}</Link>
              <Link to="/search" onClick={close} className={`flex items-center gap-2 py-1 ${location.pathname === '/search' ? 'text-green-600 font-medium' : 'text-gray-700'}`}><Search className="h-4 w-4" /> {t('nav.search')}</Link>
              <Link to="/jobs" onClick={close} className={`flex items-center gap-2 py-1 ${location.pathname === '/jobs' ? 'text-green-600 font-medium' : 'text-gray-700'}`}><Briefcase className="h-4 w-4" /> {t('nav.jobs')}</Link>
              <Link to="/advertise" onClick={close} className="inline-flex items-center gap-2 py-2 px-3 rounded bg-green-600 text-white font-medium hover:bg-green-700"><Megaphone className="h-4 w-4" /> {t('nav.advertise')}</Link>
            </div>
            {user ? (
              <div className="flex flex-col gap-2">
                {isOwnerOrAdmin && (
                  <Link to="/dashboard" onClick={close} className="flex items-center gap-2 py-1 text-gray-700 hover:text-gray-900">
                    <Building2 className="h-4 w-4" /> {t('nav.myProperties')}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={close} className="flex items-center gap-2 py-1 text-gray-700 hover:text-gray-900">
                    <Shield className="h-4 w-4" /> {t('nav.admin')}
                  </Link>
                )}
                <button onClick={() => { logout(); close(); }} className="flex items-center gap-2 py-1 text-left text-gray-700 hover:text-gray-900">
                  <LogOut className="h-4 w-4" /> {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={close} className="py-1 text-gray-700">{t('nav.login')}</Link>
                <Link to="/register" onClick={close} className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">{t('nav.join')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
