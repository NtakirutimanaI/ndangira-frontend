import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const PropertyDetailsModal = ({ property, onClose }) => {
  const images = property?.images || [];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setIdx(0);
    setZoom(false);
  }, [property?._id]);

  if (!property) return null;

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
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h3 className="text-base font-bold text-gray-900 truncate">{property.title}</h3>
        </div>
        <div className="p-4 text-sm space-y-3">
          <div className="relative h-48 bg-gray-100 overflow-hidden group">
            {current ? (
              <img
                src={current}
                alt={property.title}
                onClick={() => setZoom((z) => !z)}
                className={`w-full h-full ${zoom ? 'object-contain scale-150 cursor-zoom-out' : 'object-cover cursor-zoom-in'} transition-transform duration-200 origin-center`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
            )}
            {hasMulti && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 hover:bg-black/70" aria-label="Previous image">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 hover:bg-black/70" aria-label="Next image">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5">
                  {idx + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          <p className="text-[11px] text-gray-500">{current ? 'Click image to zoom in/out.' : ''}{hasMulti ? ' Use arrows to view more images.' : ''}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 font-medium capitalize">{property.type} · {property.category}</span>
            <span className="text-gray-600">{property.area}, {property.city}</span>
          </div>
          <p className="text-gray-700">{property.description || '—'}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-gray-500 text-xs">Price</p><p className="font-semibold text-green-700">{property.price != null ? Number(property.price).toLocaleString() : '-'} {property.currency || 'RWF'}</p></div>
            <div><p className="text-gray-500 text-xs">Address</p><p className="font-medium text-gray-900">{property.address || '—'}</p></div>
            <div><p className="text-gray-500 text-xs">Phone</p><p className="font-medium text-gray-900">{property.contactPhone || '—'}</p></div>
            <div><p className="text-gray-500 text-xs">Email</p><p className="font-medium text-gray-900 break-all">{property.contactEmail || '—'}</p></div>
            <div className="col-span-2"><p className="text-gray-500 text-xs">UPI / ID</p><p className="font-medium text-gray-900">{property.upi || '—'}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
