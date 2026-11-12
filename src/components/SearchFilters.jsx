import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api';

const defaultCategories = [
  { slug: 'rent', name: 'Rent' },
  { slug: 'sale', name: 'Sale' },
];

const SearchFilters = ({ onSearch }) => {
  const [area, setArea] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    api.get('/categories').then((res) => {
      const list = res.data?.data || [];
      if (list.length) setCategories(list.map((c) => ({ slug: c.slug || c.name, name: c.name })));
    }).catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ area, type, category });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Area / Location</label>
          <input className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Kigali, Gisenyi" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
          <select className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            <option value="house">House</option>
            <option value="car">Car</option>
            <option value="plot">Plot</option>
            <option value="material">Material</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2">
            <Search className="h-4 w-4" /> Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchFilters;
