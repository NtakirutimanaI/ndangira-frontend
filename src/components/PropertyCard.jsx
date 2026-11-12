import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';

const PropertyCard = ({ property, onView }) => {
  const img = property.images?.[0];
  const imgUrl = img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : null;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition text-center">
      <div className="relative h-32">
        {imgUrl ? (
          <img src={imgUrl} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Image className="h-6 w-6" />
          </div>
        )}
        <span className="absolute top-1 right-1 bg-green-600 text-white text-[11px] font-medium px-1.5 py-0.5">
          {property.type} · {property.category}
        </span>
      </div>
      <div className="p-2.5 flex flex-col items-center">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 w-full">{property.title}</h3>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 w-full">{property.description}</p>
        <div className="mt-1.5 flex items-center justify-center gap-1 text-xs text-gray-600 w-full">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="truncate">{property.area}, {property.city}</span>
        </div>
        <div className="mt-1 flex items-center justify-center gap-1">
          <span className="font-bold text-sm text-green-600">{property.price != null ? Number(property.price).toLocaleString() : '-'}</span>
          <span className="text-xs text-gray-500">{property.currency || 'RWF'}</span>
        </div>
        {onView ? (
          <button onClick={() => onView(property)} className="mt-1.5 block w-full text-center bg-green-600 text-white text-xs px-3 py-1.5 hover:bg-green-700">
            View Details
          </button>
        ) : (
          <Link to={`/listings/${property._id}`} className="mt-1.5 block w-full text-center bg-green-600 text-white text-xs px-3 py-1.5 hover:bg-green-700">
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
