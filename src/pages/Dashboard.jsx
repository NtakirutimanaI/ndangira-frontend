import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Plus, Building2, MapPin, Phone, Mail, Tag, User, CreditCard, CheckCircle2, CheckCircle, Clock, Home, X, Menu, Briefcase, Megaphone, Smartphone, Landmark } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const emptyForm = {
    title: '', description: '', type: 'house', transactionType: 'sale', condition: 'new',
    area: '', location: '', city: 'Kigali', address: '', contactPhone: '', contactEmail: '',
    upi: '', ownerPrice: '', images: [], videos: []
  };

const Dashboard = () => {
  const { t, lang: userLang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [myProperties, setMyProperties] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [categories, setCategories] = useState([{ slug: 'rent', name: 'Rent' }, { slug: 'sale', name: 'Sale' }]);
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', type: 'Full-time', category: '', description: '', applyEmail: '', applyUrl: '', employerAmount: '', image: null });
  const [editingJobId, setEditingJobId] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [showMyJobs, setShowMyJobs] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [adForm, setAdForm] = useState({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', title: '', description: '', imageUrl: '', targetUrl: '', plan: 'monthly', images: [], videoLinks: '', videos: [] });
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [jobMsg, setJobMsg] = useState(null);
  const [adMsg, setAdMsg] = useState(null);
  const [paymentItem, setPaymentItem] = useState(null); // { type: 'job'|'ad', id, title, amount, plan }
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const paymentMethods = [
    { value: 'momo', label: t('subscribe.momo'), icon: Smartphone, hint: t('subscribe.momoHint') },
    { value: 'airtel', label: t('subscribe.airtel'), icon: Smartphone, hint: t('subscribe.airtelHint') },
    { value: 'bank', label: t('subscribe.bank'), icon: Landmark, hint: t('subscribe.bankHint') },
    { value: 'card', label: t('subscribe.card'), icon: CreditCard, hint: t('subscribe.cardHint') },
  ];

  const loadMyJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await api.get('/jobs/mine');
      setMyJobs(res.data?.data || []);
    } catch (_) {}
    finally { setJobsLoading(false); }
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadMyProperties();
    loadMyJobs();
    api.get('/categories').then((res) => {
      const list = res.data?.data || [];
      if (list.length) setCategories(list.map((c) => ({ slug: c.slug || c.name, name: c.name })));
    }).catch(() => {});
  }, [user, navigate]);

  const loadMyProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties/mine');
      setMyProperties(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else setError(t('dash.failedLoadProps'));
    } finally {
      setLoading(false);
    }
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, contactPhone: user?.phone || '', contactEmail: user?.email || '' });
    setError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm, contactPhone: user?.phone || '', contactEmail: user?.email || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!editingId && (!form.images || form.images.length < 3)) {
      setError(t('dash.uploadMin3'));
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        const payload = {
          title: form.title, description: form.description,
          type: form.type, category: form.category,
          area: form.area, location: form.location, city: form.city, address: form.address,
          contactPhone: form.contactPhone, contactEmail: form.contactEmail, upi: form.upi,
        };
        await api.put(`/properties/${editingId}`, payload);
        setSuccess(t('dash.propUpdated'));
        closeForm();
        loadMyProperties();
} else {
        const formData = new FormData();
        ['title', 'description', 'type', 'transactionType', 'condition', 'area', 'location', 'city', 'address', 'contactPhone', 'contactEmail', 'upi', 'ownerPrice', 'images', 'videos'].forEach((k) => {
          if (form[k]) formData.append(k, form[k]);
        });
        (form.images || []).forEach((f) => formData.append('images', f));
        (form.videos || []).forEach((f) => formData.append('videos', f));
        await api.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        closeForm();
        loadMyProperties();
        setShowProperties(true);
        const goPay = window.confirm(t('dash.propSubmittedPay'));
        if (goPay) navigate('/subscribe');
        else setSuccess(t('dash.propSubmitted'));
      }
    } catch (err) {
      setError(err.response?.data?.error || t('dash.failedSaveProp'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('dash.confirmDeleteProp'))) return;
    try {
      await api.delete(`/properties/${id}`);
      setSuccess(t('dash.propDeleted'));
      loadMyProperties();
    } catch {
      setError(t('dash.failedDeleteProp'));
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || '', description: p.description || '',
      type: p.type || 'house', transactionType: p.transactionType || 'sale', condition: p.condition || 'new',
      area: p.area || '', location: p.location || '', city: p.city || 'Kigali', address: p.address || '',
      contactPhone: p.contactPhone || '', contactEmail: p.contactEmail || '', upi: p.upi || '',
      ownerPrice: p.ownerPrice || '',
      images: [], videos: [],
    });
    setShowForm(true);
  };

  const openJobForm = (job = null) => {
    setJobMsg(null); setError(null);
    if (job) {
      setEditingJobId(job._id);
      setJobForm({ title: job.title || '', company: job.company || '', location: job.location || '', type: job.type || 'Full-time', category: job.category || '', description: job.description || '', applyEmail: job.applyEmail || '', applyUrl: job.applyUrl || '', employerAmount: job.employerAmount || '', image: null });
    } else {
      setEditingJobId(null);
      setJobForm({ title: '', company: '', location: '', type: 'Full-time', category: '', description: '', applyEmail: '', applyUrl: '', employerAmount: '', image: null });
    }
    setShowJobForm(true);
  };
  const closeJobForm = () => {
    setShowJobForm(false);
    setEditingJobId(null);
    setJobForm({ title: '', company: '', location: '', type: 'Full-time', category: '', description: '', applyEmail: '', applyUrl: '', employerAmount: '', image: null });
  };
  const submitJobRequest = async (e) => {
    e.preventDefault();
    setJobMsg(null); setError(null); setJobSubmitting(true);
    try {
      const fd = new FormData();
      ['title','company','location','type','category','description','applyEmail','applyUrl','employerAmount'].forEach((k) => { if (jobForm[k]) fd.append(k, jobForm[k]); });
      if (jobForm.image instanceof File) fd.append('image', jobForm.image);
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, fd);
        setJobMsg({ type: 'success', text: 'Job updated and submitted for admin review.' });
        closeJobForm();
        loadMyJobs();
        setShowMyJobs(true);
      } else {
        const res = await api.post('/jobs/request', fd);
        const created = res.data?.data;
        const amount = created?.amount || 5000;
        closeJobForm();
        loadMyJobs();
        setShowMyJobs(true);
        setPaymentMethod('momo');
        setPaymentItem({ type: 'job', id: created?._id, title: created?.title || 'Job posting', amount, plan: null });
      }
    } catch (err) {
      setJobMsg({ type: 'error', text: err.response?.data?.error || t('dash.failedJob') });
    } finally {
      setJobSubmitting(false);
    }
  };
  const payMyJob = (job) => {
    setPaymentMethod('momo');
    setPaymentItem({ type: 'job', id: job._id, title: job.title || 'Job posting', amount: job.amount || 5000, plan: null });
  };

  const submitAdRequest = async (e) => {
    e.preventDefault();
    setAdMsg(null); setError(null); setAdSubmitting(true);
    try {
      const formData = new FormData();
      ['companyName','contactName','contactEmail','contactPhone','title','description','imageUrl','targetUrl','plan','videoLinks'].forEach((k) => {
        if (adForm[k]) formData.append(k, adForm[k]);
      });
      (adForm.images || []).forEach((f) => formData.append('images', f));
      (adForm.videos || []).forEach((f) => formData.append('videos', f));
      const res = await api.post('/ads/request', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const created = res.data?.data;
      const amount = created?.amount || (adForm.plan === 'yearly' ? 500000 : 50000);
      const plan = created?.plan || adForm.plan;
      setAdForm({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', title: '', description: '', imageUrl: '', targetUrl: '', plan: 'monthly', images: [], videoLinks: '', videos: [] });
      setShowAdForm(false);
      setPaymentMethod('momo');
      setPaymentItem({ type: 'ad', id: created?._id, title: created?.title || 'Advertisement', amount, plan });
    } catch (err) {
      setAdMsg({ type: 'error', text: err.response?.data?.error || t('dash.failedAd') });
    } finally {
      setAdSubmitting(false);
    }
  };

  const confirmPayment = async () => {
    if (!paymentItem?.id) return;
    setPaymentProcessing(true);
    try {
      if (paymentItem.type === 'job') {
        await api.put(`/jobs/${paymentItem.id}/pay`);
        setJobMsg({ type: 'success', text: `Payment of ${Number(paymentItem.amount).toLocaleString()} RWF submitted via ${paymentMethods.find(m => m.value === paymentMethod)?.label || 'selected method'}. Job will be visible on Jobs after admin approval.` });
      } else {
        await api.put(`/ads/${paymentItem.id}/pay`);
        setAdMsg({ type: 'success', text: `Payment of ${Number(paymentItem.amount).toLocaleString()} RWF submitted via ${paymentMethods.find(m => m.value === paymentMethod)?.label || 'selected method'}. Advertisement will be visible after admin approval.` });
      }
      setPaymentItem(null);
    } catch (err) {
      const msg = err.response?.data?.error || 'Payment submission failed';
      if (paymentItem.type === 'job') setJobMsg({ type: 'error', text: msg });
      else setAdMsg({ type: 'error', text: msg });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const closePaymentModal = () => {
    if (!paymentItem) return;
    if (paymentItem.type === 'job') {
      setJobMsg({ type: 'success', text: t('dash.jobCreatedUnpaid') });
    } else {
      setAdMsg({ type: 'success', text: t('dash.adCreatedUnpaid') });
    }
    setPaymentItem(null);
  };

  const statusBadge = (p) => {
    if (p.isPublished) return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700"><CheckCircle2 className="h-3.5 w-3.5" />{t('dash.published')}</span>;
    if (p.paymentStatus === 'completed') return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700"><Clock className="h-3.5 w-3.5" />{t('dash.pendingApproval')}</span>;
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"><Clock className="h-3.5 w-3.5" />{t('dash.awaitingPayment')}</span>;
  };

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        contactPhone: f.contactPhone || user.phone || '',
        contactEmail: f.contactEmail || user.email || '',
      }));
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-28 pb-24"><LoadingSpinner /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 pb-24">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('dash.pleaseLogin')}</h2>
          <p className="text-gray-600 mb-6">{t('dash.mustLogin')}</p>
          <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">{t('dash.goLogin')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('dash.title')}</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{t('dash.subtitle')}</p>
            </div>
            <button onClick={() => setMenuOpen((v) => !v)} className="sm:hidden shrink-0 p-2 border border-gray-300 bg-white rounded-lg text-gray-700 hover:bg-gray-50" aria-label={t('dash.toggleMenu')}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <div className={`${menuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row flex-wrap gap-3`}>
            <button onClick={() => { openNewForm(); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
              <Plus className="h-4 w-4" /> {t('dash.submitProperty')}
            </button>
            <button onClick={() => { openJobForm(null); setShowAdForm(false); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-50">
              <Briefcase className="h-4 w-4 text-green-600" /> {t('dash.createJob')}
            </button>
            <button onClick={() => { setAdMsg(null); setShowAdForm(true); setShowJobForm(false); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-50">
              <Megaphone className="h-4 w-4 text-green-600" /> {t('dash.createAd')}
            </button>
            <button onClick={() => { setShowProperties((v) => !v); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-50">
              <Home className="h-4 w-4 text-green-600" /> {t('dash.myProperties', { n: myProperties.length })}
            </button>
            <button onClick={() => { setShowMyJobs((v) => !v); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-50">
              <Briefcase className="h-4 w-4 text-green-600" /> My Jobs ({myJobs.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="h-5 w-5 text-green-600" />{t('dash.account')}</h2>
            <div className="space-y-3 text-sm">
              <div><p className="text-gray-500">{t('dash.name')}</p><p className="font-medium text-gray-900">{user.name}</p></div>
              <div><p className="text-gray-500">{t('auth.email')}</p><p className="font-medium text-gray-900 break-all">{user.email}</p></div>
              <div><p className="text-gray-500">{t('register.phone')}</p><p className="font-medium text-gray-900">{user.phone || t('dash.phoneNotProvided')}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="h-5 w-5 text-green-600" />{t('dash.publishing')}</h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /><span dangerouslySetInnerHTML={{ __html: t('dash.pub.properties') }} /></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /><span dangerouslySetInnerHTML={{ __html: t('dash.pub.jobs') }} /></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /><span dangerouslySetInnerHTML={{ __html: t('dash.pub.ads') }} /></li>
            </ul>
          </div>
        </div>

        {error && !showForm && <div className="mb-6"><Alert message={error} /></div>}
        {success && <div className="mb-6"><Alert type="success" message={success} /></div>}
        {(jobMsg || adMsg) && (
          <div className="mb-6 space-y-3">
            {jobMsg && <Alert type={jobMsg.type} message={jobMsg.text} />}
            {adMsg && <Alert type={adMsg.type} message={adMsg.text} />}
          </div>
        )}

        {showProperties && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Home className="h-5 w-5 text-green-600" />{t('dash.myProperties', { n: myProperties.length })}</h2>
            {myProperties.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">{t('dash.noProperties')}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {myProperties.map((p) => {
                  const imgSrc = p.images?.[0];
                  const imgUrl = imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `http://localhost:5000${imgSrc}`) : null;
                  return (
                    <div key={p._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="h-32 bg-gray-100 shrink-0">
                        {imgUrl ? <img src={imgUrl} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{t('property.noImage')}</div>}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-1">{(userLang === 'rw' && p.titleRw) ? p.titleRw : p.title}</h3>
                        <p className="text-xs text-gray-600 capitalize mb-1">{({ house: t('search.house'), car: t('search.car'), plot: t('search.plot'), material: t('search.material') }[p.type] || p.type)} · {({ rent: 'For Rent', sale: 'For Sale', new: 'New', used: 'Used' }[p.category] || p.category)}</p>
                        <div className="mb-2">{statusBadge(p)}</div>
                        <div className="text-xs text-gray-700 space-y-1 mb-2">
                          <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-400" /><span className="truncate">{(userLang === 'rw' && p.locationRw) ? p.locationRw : [p.area, p.city].filter(Boolean).join(', ')}</span></div>
                          <div className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-green-600" /><span className="truncate">{p.contactPhone || user.phone || 'ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â'}</span></div>
                          <div className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-green-600" /><span className="truncate">{p.contactEmail || user.email || 'ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â'}</span></div>
                          {p.price != null && <div className="font-semibold text-green-700">{Number(p.price).toLocaleString()} {p.currency || 'RWF'}</div>}
                        </div>
                        <p className="text-[11px] text-gray-500 mb-2 mt-auto">{p.isPublished ? 'Visible on website' : 'Hidden until admin verifies payment & approves'}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p)} className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md border border-green-200 text-green-700 hover:bg-green-50">{t('common.edit')}</button>
                          <button onClick={() => handleDelete(p._id)} className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-600 hover:bg-red-50">{t('common.delete')}</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {showMyJobs && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase className="h-5 w-5 text-green-600" />My Jobs ({myJobs.length})</h2>
            {jobsLoading ? <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Loading...</div> : myJobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">No jobs created yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myJobs.map((j) => {
                  const imgUrl = j.image ? (j.image.startsWith('http') ? j.image : `http://localhost:5000${j.image}`) : null;
                  return (
                    <div key={j._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="h-32 bg-gray-100 shrink-0">
                        {imgUrl ? <img src={imgUrl} alt={j.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Briefcase className="h-8 w-8" /></div>}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{j.title}</h3>
                        <p className="text-xs text-gray-600 mb-1">{j.company} · {j.location}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${j.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{j.paymentStatus || 'unpaid'}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${j.status === 'approved' && j.isPublished ? 'bg-green-100 text-green-700' : j.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{j.status}{j.isPublished ? ' (published)' : ''}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-2 mt-auto">{j.isPublished ? 'Visible on Jobs page' : 'Not public (awaiting payment/approval or under review)'}</p>
                        <div className="flex gap-2">
                          <button onClick={() => openJobForm(j)} className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md border border-green-200 text-green-700 hover:bg-green-50">{t('common.edit')}</button>
                          {j.paymentStatus !== 'paid' && <button onClick={() => payMyJob(j)} className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50">Pay</button>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showJobForm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-[117px] bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="h-5 w-5 text-green-600" />{editingJobId ? 'Edit Job' : t('dash.createJob')}</h2>
              <button onClick={closeJobForm} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label={t('common.close')}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={submitJobRequest} className="p-6 space-y-4">
              <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: t('dash.jobFee') }} />
              {jobMsg && <Alert type={jobMsg.type} message={jobMsg.text} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.jobTitle')}</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder={t('dash.ph.jobTitle')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.company')}</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} placeholder={t('dash.ph.company')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.location')}</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder={t('dash.ph.location')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.type')}</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.type} onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}><option value="Full-time">{t('dash.job.fulltime')}</option><option value="Part-time">{t('dash.job.parttime')}</option><option value="Contract">{t('dash.job.contract')}</option><option value="Internship">{t('dash.job.internship')}</option></select></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.category')}</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.category} onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })} placeholder={t('dash.ph.category')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.applyEmail')}</label><input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.applyEmail} onChange={(e) => setJobForm({ ...jobForm, applyEmail: e.target.value })} placeholder={t('dash.ph.applyEmail')} /></div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.applyUrl')}</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.applyUrl} onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })} placeholder={t('dash.ph.url')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.jobEmployerAmount')}</label><input type="number" min="1000" step="1000" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={jobForm.employerAmount} onChange={(e) => setJobForm({ ...jobForm, employerAmount: e.target.value })} /><p className="text-xs text-gray-500 mt-1">{t('dash.jobEmployerAmountHint')}</p></div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Job Image <span className="text-xs font-normal text-gray-500">(optional)</span></label>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700"
                    onChange={(e) => setJobForm({ ...jobForm, image: e.target.files?.[0] || null })}
                  />
                  {jobForm.image instanceof File && <p className="text-xs text-gray-500 mt-1">{jobForm.image.name}</p>}
                </div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.description')}</label><textarea required rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} placeholder={t('dash.ph.jobDesc')} /></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={jobSubmitting} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60">{jobSubmitting ? t('common.processing') : (editingJobId ? 'Save Changes' : t('dash.createPay5k'))}</button>
                <button type="button" onClick={closeJobForm} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">{t('common.cancel')}</button>
              </div>
              <p className="text-xs text-gray-500">{t('dash.adminApprovesPayment')}</p>
            </form>
          </div>
        </div>
      )}

      {showAdForm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-[117px] bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Megaphone className="h-5 w-5 text-green-600" />{t('dash.createAd')}</h2>
              <button onClick={() => setShowAdForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label={t('common.close')}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={submitAdRequest} className="p-6 space-y-4">
              <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: t('dash.adPlans') }} />
              {adMsg && <Alert type={adMsg.type} message={adMsg.text} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adCompany')}</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.companyName} onChange={(e) => setAdForm({ ...adForm, companyName: e.target.value })} placeholder={t('dash.ph.company')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adContact')}</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.contactName} onChange={(e) => setAdForm({ ...adForm, contactName: e.target.value })} placeholder={t('dash.ph.fullName')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adEmail')}</label><input required type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.contactEmail} onChange={(e) => setAdForm({ ...adForm, contactEmail: e.target.value })} placeholder={t('dash.ph.contactEmail')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adPhone')}</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.contactPhone} onChange={(e) => setAdForm({ ...adForm, contactPhone: e.target.value })} placeholder={t('dash.ph.phone')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adTitle')}</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.title} onChange={(e) => setAdForm({ ...adForm, title: e.target.value })} placeholder={t('dash.ph.adTitle')} /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adPlan')}</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.plan} onChange={(e) => setAdForm({ ...adForm, plan: e.target.value })}><option value="monthly">{t('dash.adMonthly')}</option><option value="yearly">{t('dash.adYearly')}</option></select></div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adTarget')}</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.targetUrl} onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })} placeholder={t('dash.ph.website')} /></div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adImages')} <span className="text-xs font-normal text-gray-500">{t('dash.adImagesHint')}</span></label>
                  <input type="file" multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length) setAdForm((f) => ({ ...f, images: [...(f.images || []), ...files] }));
                      e.target.value = '';
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">{adForm.images?.length ? `${adForm.images.length} image(s) selected.` : 'Optional. Upload images to show on your ad.'}</p>
                  {adForm.images?.length > 0 && (
                    <ul className="mt-2 space-y-1 max-h-28 overflow-y-auto">
                      {adForm.images.map((file, idx) => (
                        <li key={`${file.name}-${file.size}-${idx}`} className="flex items-center justify-between gap-2 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5">
                          <span className="truncate">{file.name}</span>
                          <button type="button" onClick={() => setAdForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} className="text-red-600 hover:text-red-700 font-medium shrink-0">{t('common.remove')}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adImageUrl')} <span className="text-xs font-normal text-gray-500">{t('dash.adImageUrlHint')}</span></label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.imageUrl} onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })} placeholder={t('dash.ph.url')} /></div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adVideoLinks')} <span className="text-xs font-normal text-gray-500">(YouTube, TikTok, Instagram, LinkedIn - one per line)</span></label>
                  <textarea rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.videoLinks} onChange={(e) => setAdForm({ ...adForm, videoLinks: e.target.value })} placeholder="https://youtube.com/...\nhttps://tiktok.com/...\nhttps://instagram.com/...\nhttps://linkedin.com/..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Upload Short Videos <span className="text-xs font-normal text-gray-500">(optional)</span></label>
                  <input type="file" multiple accept="video/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length) setAdForm((f) => ({ ...f, videos: [...(f.videos || []), ...files] }));
                      e.target.value = '';
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">{adForm.videos?.length ? `${adForm.videos.length} video(s) selected.` : 'Upload short ad videos to display on the Advertise page.'}</p>
                  {adForm.videos?.length > 0 && (
                    <ul className="mt-2 space-y-1 max-h-28 overflow-y-auto">
                      {adForm.videos.map((file, idx) => (
                        <li key={`${file.name}-${file.size}-${idx}`} className="flex items-center justify-between gap-2 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5">
                          <span className="truncate">{file.name}</span>
                          <button type="button" onClick={() => setAdForm((f) => ({ ...f, videos: f.videos.filter((_, i) => i !== idx) }))} className="text-red-600 hover:text-red-700 font-medium shrink-0">{t('common.remove')}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t('dash.adDesc')}</label><textarea required rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.description} onChange={(e) => setAdForm({ ...adForm, description: e.target.value })} placeholder={t('dash.ph.adDesc')} /></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={adSubmitting} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60">{adSubmitting ? t('common.processing') : (adForm.plan === 'yearly' ? t('dash.createPayYearly') : t('dash.createPayMonthly'))}</button>
                <button type="button" onClick={() => setShowAdForm(false)} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">{t('common.cancel')}</button>
              </div>
              <p className="text-xs text-gray-500">{t('dash.adAdminApprove')}</p>
            </form>
          </div>
        </div>
      )}

      {paymentItem && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-[117px] bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CreditCard className="h-5 w-5 text-green-600" />{t('common.payment')}</h2>
              <button onClick={closePaymentModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label={t('common.close')}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">{paymentItem.type === 'job' ? 'Job posting' : 'Advertisement'}{paymentItem.plan ? ` (${paymentItem.plan})` : ''}</p>
                <p className="font-semibold text-gray-900">{paymentItem.title}</p>
                <p className="text-lg font-bold text-green-700 mt-1">{Number(paymentItem.amount).toLocaleString()} RWF</p>
              </div>
              <p className="text-sm text-gray-600">{t('dash.paymentChoose')}</p>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">{t('common.paymentMethod')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button key={m.value} type="button" onClick={() => setPaymentMethod(m.value)} className={`p-3 rounded-lg border text-left flex items-start gap-3 transition ${paymentMethod === m.value ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                        <Icon className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{m.label}</p>
                          <p className="text-xs text-gray-500">{m.hint}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={confirmPayment} disabled={paymentProcessing} className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60">
                  <CheckCircle className="h-4 w-4" /> {paymentProcessing ? t('common.processing') : t('common.completedPayment')}
                </button>
                <button type="button" onClick={closePaymentModal} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">{t('common.payLater')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-[117px] bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Building2 className="h-5 w-5 text-green-600" />{editingId ? t('dash.editProperty') : t('dash.submitPropertyTitle')}</h2>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label={t('common.close')}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <p className="text-sm text-gray-600">{t('dash.propSubmitNote')}</p>
              {error && <Alert message={error} />}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propTitle')}</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t('dash.ph.propTitle')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propType')}</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="house">{t('search.house')}</option><option value="car">{t('search.car')}</option><option value="plot">{t('search.plot')}</option><option value="material">{t('search.material')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propTransactionType')}</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.transactionType} onChange={(e) => setForm({ ...form, transactionType: e.target.value })}>
                    <option value="sale">{t('dash.propForSale')}</option>
                    <option value="rent">{t('dash.propForRent')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propCondition')}</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                    <option value="new">{t('dash.propNew')}</option>
                    <option value="used">{t('dash.propUsed')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('search.area')}</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder={t('dash.ph.area')} />
                </div>
                <div className="xl:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propDescription')}</label>
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" rows="4" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propCity')}</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="xl:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propAddress')}</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="xl:col-span-3 pt-2 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Phone className="h-4 w-4 text-green-600" />{t('dash.propOwnerContact')}</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propContactPhone')}</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propContactEmail')}</label>
                  <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
                </div>
<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propUpi')}</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={form.upi} onChange={(e) => setForm(f => ({ ...f, upi: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propOwnerPrice')}</label>
                  <input type="number" min="0" step="1000" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={form.ownerPrice} onChange={(e) => setForm(f => ({ ...f, ownerPrice: e.target.value }))} />
                  <p className="text-xs text-gray-500 mt-1">{t('dash.propOwnerPriceHint')}</p>
                </div>
                {!editingId && (
                  <>
                    <div className="xl:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propImages')} <span className="text-xs font-normal text-gray-500">{t('dash.propImagesHint')}</span></label>
                      <input type="file" multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length) setForm((f) => ({ ...f, images: [...(f.images || []), ...files] }));
                          e.target.value = '';
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">{form.images?.length ? `${form.images.length} image(s) selected (minimum 3).` : 'Add images one by one or select multiple at once (minimum 3).'}</p>
                      {form.images?.length > 0 && (
                        <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                          {form.images.map((file, idx) => (
                            <li key={`${file.name}-${file.size}-${idx}`} className="flex items-center justify-between gap-2 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5">
                              <span className="truncate">{file.name}</span>
                              <button type="button" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} className="text-red-600 hover:text-red-700 font-medium shrink-0">{t('common.remove')}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('dash.propVideos')} <span className="text-xs font-normal text-gray-500">{t('dash.propVideosHint')}</span></label>
                      <input type="file" multiple accept="video/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700" onChange={(e) => setForm({ ...form, videos: Array.from(e.target.files || []) })} />
                      <p className="text-xs text-gray-500 mt-1">{form.videos?.length ? `${form.videos.length} video(s) selected` : 'Optional'}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> {submitting ? t('common.saving') : editingId ? t('dash.updateProperty') : t('dash.submitProperty')}
                </button>
                <button type="button" onClick={closeForm} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-12 pt-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Isange by MAKE IT SOLUTIONS Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;