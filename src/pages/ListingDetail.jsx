import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';

const ListingDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then((res) => setProperty(res.data.data))
      .catch(() => setError('Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert message={error} />;
  if (!property) return null;

  const imgUrl = (img) => (img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : null);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative h-48 md:h-56 overflow-hidden border border-gray-200 mb-4 bg-gray-100">
          {property.images && property.images[0] ? (
            <img src={imgUrl(property.images[0])} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
          )}
        </div>

        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{property.title}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">{property.type} · {property.category}</span>
            <span>{property.area}, {property.city}, {property.country}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">{property.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-white p-3 border border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Price</h3>
              <p className="text-lg font-bold text-green-600">{property.price != null ? Number(property.price).toLocaleString() : '-'} {property.currency || 'RWF'}</p>
            </div>
            <div className="bg-white p-3 border border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Address</h3>
              <p className="text-sm text-gray-600">{property.address || '—'}</p>
            </div>
          </div>

          <div className="bg-white p-3 border border-gray-200 mb-4">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Contact Owner</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 011 1.146l1.195.976c.348.284.719.405 1.045.405a1 1 0 011 1 1 1 0 01-1 1c-.298 0-.638-.101-1.01-.26l-1.5-.93c-.67-.426-1.016-1.088-1.016-1.946V7a1 1 0 011-1h3.28a2 2 0 012 2v12.18a4 4 0 01-.562 2M5 9V5l3 3-3 3v-4z" /></svg>
                <p className="text-gray-700">{property.contactPhone || '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <p className="text-gray-700 break-all">{property.contactEmail || '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h0a2 2 0 012 2v2" /></svg>
                <p className="text-gray-700">{property.upi || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {property.images && property.images.length > 1 && (
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-2">More Images</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {property.images.slice(1).map((img, i) => (
                <img key={i} src={imgUrl(img)} alt="" className="aspect-square w-full h-full object-cover border border-gray-200" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;
