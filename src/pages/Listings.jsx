import { useEffect, useState } from 'react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';
import SidebarTopPosts from '../components/SidebarTopPosts';

const defaultTransactionTypes = [
  { slug: 'sale', name: 'For Sale' },
  { slug: 'rent', name: 'For Rent' },
];

const defaultConditions = [
  { slug: 'new', name: 'New' },
  { slug: 'used', name: 'Used' },
];

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [area, setArea] = useState('');
  const [type, setType] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [condition, setCondition] = useState('');
  const [transactionTypes, setTransactionTypes] = useState(defaultTransactionTypes);
  const [conditions, setConditions] = useState(defaultConditions);
  const { t } = useLanguage();

  useEffect(() => {
    api.get('/categories').then((res) => {
      const list = res.data?.data || [];
      if (list.length) {
        const apiCats = list.map((c) => ({ slug: c.slug || c.name, name: c.name }));
        const mergedTypes = [...defaultTransactionTypes];
        apiCats.forEach((ac) => {
          if (['sale', 'rent'].includes(ac.slug) && !mergedTypes.some((dc) => dc.slug === ac.slug)) mergedTypes.push(ac);
        });
        setTransactionTypes(mergedTypes);
        const mergedConditions = [...defaultConditions];
        apiCats.forEach((ac) => {
          if (['new', 'used'].includes(ac.slug) && !mergedConditions.some((dc) => dc.slug === ac.slug)) mergedConditions.push(ac);
        });
        setConditions(mergedConditions);
      }
    }).catch(() => {});
  }, []);

  const fetchProperties = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (area) params.append('area', area);
    if (type) params.append('type', type);
    if (transactionType) params.append('transactionType', transactionType);
    if (condition) params.append('condition', condition);
    api.get(`/properties/search?${params.toString()}`)
      .then((res) => setProperties(res.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, [area, type, transactionType, condition]);

  if (loading) return <div className="min-h-screen bg-gray-50 pt-32 px-4"><LoadingSpinner /></div>;

  const rows = chunk(properties, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t('listings.title')}</h1>
          
          <div className="bg-white p-4 shadow border border-gray-200 mb-6">
            <form onSubmit={(e) => { e.preventDefault(); fetchProperties(); }} className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('search.transactionType')}</label>
                <select className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                  <option value="">{t('search.all')}</option>
                  {transactionTypes.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('search.condition')}</label>
                <select className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="">{t('search.all')}</option>
                  {conditions.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700">Search</button>
              </div>
            </form>
          </div>

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
