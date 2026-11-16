import { useEffect, useState } from 'react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';
import SidebarTopPosts from '../components/SidebarTopPosts';

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    api.get('/properties').then((res) => setProperties(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 pt-32 px-4"><LoadingSpinner /></div>;

  const rows = chunk(properties, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t('listings.title')}</h1>
          {properties.length === 0 ? (
            <p className="text-gray-500">{t('listings.none')}</p>
          ) : (
            <div className="space-y-4">
              {rows.map((row, i) => (
                <div key={i}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {row.map((p) => (
                      <div key={p._id} className="w-full min-w-0">
                        <PropertyCard property={p} onView={setSelected} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <SidebarTopPosts accent="green" />
        </div>
      </div>

      {selected && <PropertyDetailsModal property={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Listings;
