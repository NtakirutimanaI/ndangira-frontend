import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, MapPin, ChevronLeft, ChevronRight } from './icons';
import { useLanguage } from '../context/LanguageContext';
import { resolveMediaUrl } from '../utils/media';

const PropertyCard = ({ property, onView }) => {
  const { t, lang } = useLanguage();
  const images = property.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentImgUrl = images.length > 0 ? resolveMediaUrl(images[currentIndex]) : null;

  const typeLabel = { house: t('search.house'), car: t('search.car'), plot: t('search.plot'), material: t('search.material') }[property.type] || property.type;
  const transactionTypeText = property.transactionType === 'sale' ? t('dash.propForSale') : t('dash.propForRent');
  const conditionText = property.condition === 'new' ? t('dash.propNew') : t('dash.propUsed');
  const title = property.title;
  const description = property.description;
  const locationText = [property.area, property.city].filter(Boolean).join(', ');

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  };
  const goNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % images.length);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition text-center">
      <div className="relative h-32">
        {currentImgUrl ? (
          <img src={currentImgUrl} alt={`${title} ${currentIndex + 1}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Image className="h-6 w-6" />
          </div>
        )}
        {images.length > 1 && (
          <>
            <button onClick={goPrev} className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded hover:bg-black/70" aria-label={t('property.prevImage')}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={goNext} className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded hover:bg-black/70" aria-label={t('property.nextImage')}>
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
        <span className="absolute top-1 right-1 bg-green-600 text-white text-[11px] font-medium px-1.5 py-0.5">
          {typeLabel} · {transactionTypeText} · {conditionText}
        </span>
      </div>
      <div className="p-2.5 flex flex-col items-center">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 w-full">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 w-full">{description || t('property.noDescription')}</p>
        <div className="mt-1.5 flex items-center justify-center gap-1 text-xs text-gray-600 w-full">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{locationText}</span>
        </div>
        <div className="mt-1 flex items-center justify-center gap-1">
          <span className="font-bold text-sm text-green-600">{property.price != null ? Number(property.price).toLocaleString() : '-'}</span>
          <span className="text-xs text-gray-500">{property.currency || 'RWF'}</span>
        </div>
        {onView ? (
          <button onClick={() => onView(property)} className="mt-1.5 block w-full text-center bg-green-600 text-white text-xs px-3 py-1.5 hover:bg-green-700">
            {t('property.viewDetails')}
          </button>
        ) : (
          <Link to={`/listings/${property._id}`} className="mt-1.5 block w-full text-center bg-green-600 text-white text-xs px-3 py-1.5 hover:bg-green-700">
            {t('property.viewDetails')}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
