import { useState, useEffect } from 'react';
import { Search as SearchIcon } from '../components/icons';
import api from '../services/api';
import SearchFilters from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { useLanguage } from '../context/LanguageContext';
import SidebarTopPosts from '../components/SidebarTopPosts';

const Search = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

const handleSearch = (filters) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filters.area) params.append('area', filters.area);
    if (filters.type) params.append('type', filters.type);
    if (filters.transactionType) params.append('transactionType', filters.transactionType);
    if (filters.condition) params.append('condition', filters.condition);
    api.get(`/search/properties?${params.toString()}`)
      .then((res) => setProperties(res.data.data))
      .catch(() => setError(t('search.failed')))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-6">
            <SearchIcon className="h-5 w-5 text-green-600 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('search.title')}</h1>
          </div>
          <SearchFilters onSearch={handleSearch} />
          {error && <Alert message={error} />}
          <div className="mt-8">
            <h2 className="font-bold text-gray-900 mb-4">{t('search.results')}</h2>
            {loading ? (
              <LoadingSpinner />
            ) : properties.length === 0 ? (
              <p className="text-gray-500">{t('search.none')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {properties.map((p) => (
                  <div key={p._id} className="w-full min-w-0">
                    <PropertyCard property={p} onView={setSelected} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <SidebarTopPosts accent="green" />
        </div>
      </div>

      {selected && <PropertyDetailsModal property={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Search;
