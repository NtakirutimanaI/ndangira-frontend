import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from './icons';
import { useLanguage } from '../context/LanguageContext';

const PropertyDetailsModal = ({ property, onClose }) => {
  const images = property?.images || [];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    setIdx(0);
    setZoom(false);
  }, [property?._id]);

  if (!property) return null;

  const title = (lang === 'rw' && property.titleRw) ? property.titleRw : property.title;
  const description = (lang === 'rw' && property.descriptionRw) ? property.descriptionRw : property.description;
  const locationText = (lang === 'rw' && property.locationRw) ? property.locationRw : [property.area, property.city].filter(Boolean).join(', ');
  const imgUrl = (img) => (img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : null);
  const current = imgUrl(images[idx]);
  const hasMulti = images.length > 1;
  const prev = () => { setIdx((i) => (i - 1 + images.length) % images.length); setZoom(false); };
  const next = () => { setIdx((i) => (i + 1) % images.length); setZoom(false); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/50 overflow-y-auto">
      <div className="bg-white border border-gray-200 shadow-xl w-full max-w-xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
          <button onClick={onClose} className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> {t('property.back')}
          </button>
          <h3 className="text-base font-bold text-gray-900 truncate">{title}</h3>
        </div>
        <div className="p-4 text-sm space-y-3">
          <div className="relative h-48 bg-gray-100 overflow-hidden group">
            {current ? (
              <img
                src={current}
                alt={title}
                onClick={() => setZoom((z) => !z)}
                className={`w-full h-full ${zoom ? 'object-contain scale-150 cursor-zoom-out' : 'object-cover cursor-zoom-in'} transition-transform duration-200 origin-center`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{t('property.noImage')}</div>
            )}
            {hasMulti && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 hover:bg-black/70" aria-label={t('property.prevImage')}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 hover:bg-black/70" aria-label={t('property.nextImage')}>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5">
                  {idx + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          <p className="text-[11px] text-gray-500">{current ? t('property.clickZoom') : ''}{hasMulti ? t('property.useArrows') : ''}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 font-medium capitalize">{({ house: t('search.house'), car: t('search.car'), plot: t('search.plot'), material: t('search.material') }[property.type] || property.type)} · {(property.category === 'rent' ? t('admin.rent') : property.category === 'sale' ? t('admin.sale') : property.category)}</span>
            <span className="text-gray-600">{locationText}</span>
          </div>
          <p className="text-gray-700">{description || t('property.noDescription')}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-gray-500 text-xs">{t('property.price')}</p><p className="font-semibold text-green-700">{property.price != null ? Number(property.price).toLocaleString() : '-'} {property.currency || 'RWF'}</p></div>
            <div><p className="text-gray-500 text-xs">{t('property.address')}</p><p className="font-medium text-gray-900">{property.address || '—'}</p></div>
            <div><p className="text-gray-500 text-xs">{t('property.phone')}</p><p className="font-medium text-gray-900">{property.contactPhone || '—'}</p></div>
            <div><p className="text-gray-500 text-xs">{t('property.email')}</p><p className="font-medium text-gray-900 break-all">{property.contactEmail || '—'}</p></div>
            <div className="col-span-2"><p className="text-gray-500 text-xs">{t('property.upi')}</p><p className="font-medium text-gray-900">{property.upi || '—'}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
