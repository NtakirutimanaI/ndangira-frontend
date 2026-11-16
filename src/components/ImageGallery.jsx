import { Image, PlayCircle } from './icons';
import { useLanguage } from '../context/LanguageContext';

const ImageGallery = ({ images, videos }) => {
  const { t } = useLanguage();
  const media = [...(images || []).map((src) => ({ type: 'image', src })), ...(videos || []).map((src) => ({ type: 'video', src }))];
  if (media.length === 0) {
    return <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400"><Image className="h-12 w-12 mx-auto mb-2" /> {t('property.noImage')}</div>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {media.map((item, index) => (
        <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden relative">
          {item.type === 'image' ? (
            <img src={item.src} alt="" className="w-full h-full object-cover" />
          ) : (
            <>
              <video src={item.src} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><PlayCircle className="h-10 w-10 text-white" /></div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
