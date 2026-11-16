import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const SidebarTopPosts = ({ accent = 'green' }) => {
  const { t, lang } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/properties').then((res) => {
      const list = res.data?.data || [];
      setProperties(list.slice(0, 5));
    }).catch(() => {});
  }, []);

  const accentBtn = accent === 'amber' ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
  const accentRing = accent === 'amber' ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-green-500 focus:border-green-500';
  const accentTitle = accent === 'amber' ? 'text-amber-700' : accent === 'slate' ? 'text-green-400' : 'text-green-700';
  const cardBg = accent === 'slate' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const textMain = accent === 'slate' ? 'text-white' : 'text-gray-900';
  const textSub = accent === 'slate' ? 'text-slate-400' : 'text-gray-600';
  const inputCls = accent === 'slate' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-gray-900';

  const onSubscribe = async (e) => {
    e.preventDefault();
    const val = email.trim();
    if (!val) return;
    setSubError('');
    setSubmitting(true);
    try {
      await api.post('/subscribers', { email: val });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setSubError(err.response?.data?.error || 'Subscription failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="w-full space-y-4 lg:sticky lg:top-32">
      <div className={`rounded-xl border ${cardBg} p-4 shadow-sm`}>
        <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${accentTitle}`}>Subscribe</h3>
        {subscribed ? (
          <p className={`text-sm font-medium ${textSub}`}>You subscribed!</p>
        ) : (
          <form onSubmit={onSubscribe} className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border ${inputCls} ${accentRing} focus:outline-none focus:ring-2`}
            />
            {subError && <p className="text-xs text-red-500">{subError}</p>}
            <button type="submit" disabled={submitting} className={`w-full px-3 py-2.5 text-sm font-medium text-white rounded-lg ${accentBtn} focus:outline-none focus:ring-2 disabled:opacity-60`}>
              {submitting ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>

      <div className={`rounded-xl border ${cardBg} p-4 shadow-sm`}>
        <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${accentTitle}`}>{t('sidebar.topPosts')}</h3>
        {properties.length === 0 ? (
          <p className={`text-sm ${textSub}`}>{t('sidebar.noPosts')}</p>
        ) : (
          <ul className="space-y-3">
            {properties.map((p) => {
              const title = (lang === 'rw' && p.titleRw) ? p.titleRw : p.title;
              const img = p.images?.[0];
              const imgUrl = img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : null;
              return (
                <li key={p._id}>
                  <Link to={`/listings/${p._id}`} className="flex items-center gap-3 group">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      {imgUrl ? <img src={imgUrl} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-200" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium line-clamp-2 sm:truncate group-hover:underline ${textMain}`}>{title}</p>
                      <p className={`text-xs truncate ${textSub}`}>{[p.area, p.city].filter(Boolean).join(', ')}</p>
                      {p.price != null && <p className="text-xs font-semibold text-green-600">{Number(p.price).toLocaleString()} {p.currency || 'RWF'}</p>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default SidebarTopPosts;
