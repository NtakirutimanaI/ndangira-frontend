import { useEffect, useState } from 'react';
import { Search } from './icons';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const defaultCategories = [
  { slug: 'sale', name: 'For Sale' },
  { slug: 'rent', name: 'For Rent' },
  { slug: 'new', name: 'New' },
  { slug: 'used', name: 'Used' },
];

const SearchFilters = ({ onSearch }) => {
  const [area, setArea] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const { t } = useLanguage();

  useEffect(() => {
    api.get('/categories').then((res) => {
      const list = res.data?.data || [];
      if (list.length) {
        const apiCats = list.map((c) => ({ slug: c.slug || c.name, name: c.name }));
        // Merge with defaults to ensure all 4 always visible
        const merged = [...defaultCategories];
        apiCats.forEach((ac) => {
          if (!merged.some((dc) => dc.slug === ac.slug)) merged.push(ac);
        });
        setCategories(merged);
      }
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
          <label className="block text-xs font-medium text-gray-700 mb-1">{t('search.area')}</label>
          <input className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={t('search.areaPlaceholder')} value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t('search.type')}</label>
          <select className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">{t('search.all')}</option>
            <option value="house">{t('search.house')}</option>
            <option value="car">{t('search.car')}</option>
            <option value="plot">{t('search.plot')}</option>
            <option value="material">{t('search.material')}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">{t('search.category')}</label>
          <select className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">{t('search.all')}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2">
            <Search className="h-4 w-4" /> {t('search.button')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchFilters;
