import { useEffect, useState } from 'react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { LoadingSpinner } from '../components/LoadingSpinner';

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/properties').then((res) => setProperties(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const rows = chunk(properties, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">Available Listings</h1>
        {properties.length === 0 ? (
          <p className="text-gray-500 text-center">No listings found.</p>
        ) : (
          <div className="space-y-0">
            {rows.map((row, i) => (
              <div key={i}>
                <div className="flex flex-wrap justify-center gap-0">
                  {row.map((p) => (
                    <div key={p._id} className="w-full max-w-[227px] sm:w-[227px]">
                      <PropertyCard property={p} onView={setSelected} />
                    </div>
                  ))}
                </div>
                <hr className="mt-0 border-t border-gray-300 w-full" />
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <PropertyDetailsModal property={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Listings;
