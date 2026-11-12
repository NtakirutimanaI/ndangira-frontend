import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import api from '../services/api';
import SearchFilters from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';

const Search = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleSearch = (filters) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filters.area) params.append('area', filters.area);
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    api.get(`/search/properties?${params.toString()}`)
      .then((res) => setProperties(res.data.data))
      .catch(() => setError('Search failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <SearchIcon className="h-5 w-5 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Search Properties</h1>
        </div>
        <SearchFilters onSearch={handleSearch} />
        {error && <Alert message={error} />}
        <div className="mt-8">
          <h2 className="font-bold text-gray-900 mb-4">Results</h2>
          {loading ? (
            <LoadingSpinner />
          ) : properties.length === 0 ? (
            <p className="text-gray-500 text-center">No properties match your search.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {properties.map((p) => (
                <div key={p._id} className="w-[211px] sm:w-[227px]">
                  <PropertyCard property={p} onView={setSelected} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && <PropertyDetailsModal property={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Search;
