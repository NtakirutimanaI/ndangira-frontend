import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Plus, Building2, MapPin, Phone, Mail, Tag, User, CreditCard, CheckCircle2, Clock, Home, X, Menu, Briefcase, Megaphone } from 'lucide-react';

const emptyForm = {
  title: '', description: '', type: 'house', category: 'rent',
  area: '', city: 'Kigali', address: '', contactPhone: '', contactEmail: '',
  upi: '', images: [], videos: []
};

const Dashboard = () => {
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
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', type: 'Full-time', category: '', description: '', applyEmail: '', applyUrl: '' });
  const [adForm, setAdForm] = useState({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', title: '', description: '', imageUrl: '', targetUrl: '', plan: 'monthly', images: [], videoLinks: '' });
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [jobMsg, setJobMsg] = useState(null);
  const [adMsg, setAdMsg] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadMyProperties();
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
      else setError('Failed to load properties');
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
      setError('Please upload at least 3 property images.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        const payload = {
          title: form.title, description: form.description, type: form.type, category: form.category,
          area: form.area, city: form.city, address: form.address,
          contactPhone: form.contactPhone, contactEmail: form.contactEmail, upi: form.upi,
        };
        await api.put(`/properties/${editingId}`, payload);
        setSuccess('Property updated successfully.');
        closeForm();
        loadMyProperties();
      } else {
        const formData = new FormData();
        ['title', 'description', 'type', 'category', 'area', 'city', 'address', 'contactPhone', 'contactEmail', 'upi'].forEach((k) => {
          if (form[k]) formData.append(k, form[k]);
        });
        (form.images || []).forEach((f) => formData.append('images', f));
        (form.videos || []).forEach((f) => formData.append('videos', f));
        await api.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        closeForm();
        loadMyProperties();
        setShowProperties(true);
        const goPay = window.confirm('Property submitted successfully. It will be visible only after admin verifies payment and approves it.\n\nWould you like to go to the payment page now?');
        if (goPay) navigate('/subscribe');
        else setSuccess('Property submitted. It will be visible on the website after admin verifies payment and approves it.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setSuccess('Property deleted');
      loadMyProperties();
    } catch {
      setError('Failed to delete property');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || '', description: p.description || '', type: p.type || 'house', category: p.category || 'rent',
      area: p.area || '', city: p.city || 'Kigali', address: p.address || '',
      contactPhone: p.contactPhone || '', contactEmail: p.contactEmail || '', upi: p.upi || '',
      images: [], videos: [],
    });
    setShowForm(true);
  };

  const submitJobRequest = async (e) => {
    e.preventDefault();
    setJobMsg(null); setError(null); setJobSubmitting(true);
    try {
      const res = await api.post('/jobs/request', jobForm);
      const created = res.data?.data;
      const amount = created?.amount || 5000;
      const payNow = window.confirm(`Job created. Pay ${Number(amount).toLocaleString()} RWF now to submit for admin approval?`);
      if (payNow && created?._id) {
        await api.put(`/jobs/${created._id}/pay`);
        setJobMsg({ type: 'success', text: `Payment of ${Number(amount).toLocaleString()} RWF submitted. Job will be visible on Jobs after admin approval.` });
      } else {
        setJobMsg({ type: 'success', text: 'Job created (unpaid). Complete payment before admin can approve and publish it.' });
      }
      setJobForm({ title: '', company: '', location: '', type: 'Full-time', category: '', description: '', applyEmail: '', applyUrl: '' });
      setShowJobForm(false);
    } catch (err) {
      setJobMsg({ type: 'error', text: err.response?.data?.error || 'Failed to submit job request' });
    } finally {
      setJobSubmitting(false);
    }
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
      const res = await api.post('/ads/request', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const created = res.data?.data;
      const amount = created?.amount || (adForm.plan === 'yearly' ? 500000 : 50000);
      const payNow = window.confirm(`Advertisement request created. Pay ${Number(amount).toLocaleString()} RWF now (${adForm.plan}) to submit for admin approval?`);
      if (payNow && created?._id) {
        await api.put(`/ads/${created._id}/pay`);
        setAdMsg({ type: 'success', text: `Payment of ${Number(amount).toLocaleString()} RWF submitted. Advertisement will be visible after admin approval.` });
      } else {
        setAdMsg({ type: 'success', text: 'Advertisement request created (unpaid). Complete payment before admin can approve and publish it.' });
      }
      setAdForm({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', title: '', description: '', imageUrl: '', targetUrl: '', plan: 'monthly', images: [], videoLinks: '' });
      setShowAdForm(false);
    } catch (err) {
      setAdMsg({ type: 'error', text: err.response?.data?.error || 'Failed to submit advertisement request' });
    } finally {
      setAdSubmitting(false);
    }
  };

  const statusBadge = (p) => {
    if (p.isPublished) return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700"><CheckCircle2 className="h-3.5 w-3.5" />Published</span>;
    if (p.paymentStatus === 'completed') return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700"><Clock className="h-3.5 w-3.5" />Pending admin approval</span>;
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"><Clock className="h-3.5 w-3.5" />Awaiting payment verification</span>;
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
    return <div className="min-h-screen flex items-center justify-center pt-24 pb-24"><LoadingSpinner /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-24">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-6">You must be logged in to access the dashboard.</p>
          <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage properties, jobs, and advertisements</p>
            </div>
            <button onClick={() => setMenuOpen((v) => !v)} className="sm:hidden shrink-0 p-2 border border-gray-300 bg-white rounded-lg text-gray-700 hover:bg-gray-50" aria-label="Toggle menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <div className={`${menuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row flex-wrap gap-3`}>
            <button onClick={() => { openNewForm(); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
              <Plus className="h-4 w-4" /> Submit Property
            </button>
            <button onClick={() => { setJobMsg(null); setShowJobForm(true); setShowAdForm(false); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-50">
              <Briefcase className="h-4 w-4 text-green-600" /> Create Job
            </button>
            <button onClick={() => { setAdMsg(null); setShowAdForm(true); setShowJobForm(false); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-50">
              <Megaphone className="h-4 w-4 text-green-600" /> Create Advertisement
            </button>
            <button onClick={() => { setShowProperties((v) => !v); setMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-50">
              <Home className="h-4 w-4 text-green-600" /> My Properties ({myProperties.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="h-5 w-5 text-green-600" />Account</h2>
            <div className="space-y-3 text-sm">
              <div><p className="text-gray-500">Name</p><p className="font-medium text-gray-900">{user.name}</p></div>
              <div><p className="text-gray-500">Email</p><p className="font-medium text-gray-900 break-all">{user.email}</p></div>
              <div><p className="text-gray-500">Phone</p><p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="h-5 w-5 text-green-600" />Publishing & Payment</h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /><span><strong>Properties:</strong> submit and pay per listing/subscription; admin verifies and approves.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /><span><strong>Jobs:</strong> create and pay <strong>5,000 RWF</strong> per posting; admin approves before it appears on Jobs.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /><span><strong>Advertisements:</strong> create and pay <strong>50,000 RWF/month</strong> or <strong>500,000 RWF/year</strong>; admin approves before publishing.</span></li>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Home className="h-5 w-5 text-green-600" />My Properties ({myProperties.length})</h2>
            {myProperties.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">No properties submitted yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {myProperties.map((p) => {
                  const imgSrc = p.images?.[0];
                  const imgUrl = imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `http://localhost:5000${imgSrc}`) : null;
                  return (
                    <div key={p._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="h-32 bg-gray-100 shrink-0">
                        {imgUrl ? <img src={imgUrl} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-1">{p.title}</h3>
                        <p className="text-xs text-gray-600 capitalize mb-1">{p.type} · {p.category}</p>
                        <div className="mb-2">{statusBadge(p)}</div>
                        <div className="text-xs text-gray-700 space-y-1 mb-2">
                          <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-400" /><span className="truncate">{p.area}{p.city ? `, ${p.city}` : ''}</span></div>
                          <div className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-green-600" /><span className="truncate">{p.contactPhone || user.phone || '—'}</span></div>
                          <div className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-green-600" /><span className="truncate">{p.contactEmail || user.email || '—'}</span></div>
                          {p.price != null && <div className="font-semibold text-green-700">{Number(p.price).toLocaleString()} {p.currency || 'RWF'}</div>}
                        </div>
                        <p className="text-[11px] text-gray-500 mb-2 mt-auto">{p.isPublished ? 'Visible on website' : 'Hidden until admin verifies payment & approves'}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p)} className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md border border-green-200 text-green-700 hover:bg-green-50">Edit</button>
                          <button onClick={() => handleDelete(p._id)} className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="h-5 w-5 text-green-600" />Create Job</h2>
              <button onClick={() => setShowJobForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={submitJobRequest} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Posting fee: <strong>5,000 RWF</strong>. Create and pay, then admin approval publishes it on Jobs.</p>
              {jobMsg && <Alert type={jobMsg.type} message={jobMsg.text} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Job Title *</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Sales Agent" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Company *</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} placeholder="Company name" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Location *</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="Kigali, Rwanda" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Type</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.type} onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.category} onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })} placeholder="e.g. Sales" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Apply Email</label><input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.applyEmail} onChange={(e) => setJobForm({ ...jobForm, applyEmail: e.target.value })} placeholder="hr@company.com" /></div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Apply URL</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.applyUrl} onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })} placeholder="https://..." /></div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Description *</label><textarea required rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Describe the role..." /></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={jobSubmitting} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60">{jobSubmitting ? 'Processing...' : 'Create & Pay 5,000 RWF'}</button>
                <button type="button" onClick={() => setShowJobForm(false)} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
              </div>
              <p className="text-xs text-gray-500">Admin approves after payment.</p>
            </form>
          </div>
        </div>
      )}

      {showAdForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Megaphone className="h-5 w-5 text-green-600" />Create Advertisement</h2>
              <button onClick={() => setShowAdForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={submitAdRequest} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Plans: <strong>50,000 RWF/month</strong> or <strong>500,000 RWF/year</strong>. Create and pay, then admin approves to publish. Add images, text, and video links (YouTube, TikTok, Instagram, etc.) to make your ad visible on the platform.</p>
              {adMsg && <Alert type={adMsg.type} message={adMsg.text} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Company *</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.companyName} onChange={(e) => setAdForm({ ...adForm, companyName: e.target.value })} placeholder="Company name" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Contact Person *</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.contactName} onChange={(e) => setAdForm({ ...adForm, contactName: e.target.value })} placeholder="Full name" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Contact Email *</label><input required type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.contactEmail} onChange={(e) => setAdForm({ ...adForm, contactEmail: e.target.value })} placeholder="you@company.com" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Phone</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.contactPhone} onChange={(e) => setAdForm({ ...adForm, contactPhone: e.target.value })} placeholder="+250..." /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Ad Title *</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.title} onChange={(e) => setAdForm({ ...adForm, title: e.target.value })} placeholder="Advert title" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Plan *</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.plan} onChange={(e) => setAdForm({ ...adForm, plan: e.target.value })}><option value="monthly">Monthly — 50,000 RWF</option><option value="yearly">Yearly — 500,000 RWF</option></select></div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Target / Website URL</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.targetUrl} onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })} placeholder="https://your-website.com" /></div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Advertisement Images <span className="text-xs font-normal text-gray-500">(upload one or more)</span></label>
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
                          <button type="button" onClick={() => setAdForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} className="text-red-600 hover:text-red-700 font-medium shrink-0">Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Image URL <span className="text-xs font-normal text-gray-500">(optional, if hosted externally)</span></label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.imageUrl} onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })} placeholder="https://..." /></div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Video Links <span className="text-xs font-normal text-gray-500">(YouTube, TikTok, Instagram, Facebook, or other)</span></label>
                  <textarea rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.videoLinks} onChange={(e) => setAdForm({ ...adForm, videoLinks: e.target.value })} placeholder={"Paste one link per line, e.g.\nhttps://www.youtube.com/watch?v=...\nhttps://www.tiktok.com/@user/video/...\nhttps://www.instagram.com/reel/..."} />
                  <p className="text-xs text-gray-500 mt-1">One URL per line (or comma-separated). Videos will be shown on your ad after admin approval.</p>
                </div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Description / Text *</label><textarea required rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={adForm.description} onChange={(e) => setAdForm({ ...adForm, description: e.target.value })} placeholder="Describe your advertisement..." /></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={adSubmitting} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60">{adSubmitting ? 'Processing...' : (adForm.plan === 'yearly' ? 'Create & Pay 500,000 RWF' : 'Create & Pay 50,000 RWF')}</button>
                <button type="button" onClick={() => setShowAdForm(false)} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
              </div>
              <p className="text-xs text-gray-500">Admin approves after payment is verified. Approved ads appear on the Advertise page.</p>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Building2 className="h-5 w-5 text-green-600" />{editingId ? 'Edit Property' : 'Submit a Property'}</h2>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <p className="text-sm text-gray-600">Provide property details and owner contact. Submission stays hidden until admin verifies payment and approves.</p>
              {error && <Alert message={error} />}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. 3 Bedroom House in Kicukiro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="house">House</option><option value="car">Car</option><option value="plot">Plot</option><option value="material">Material</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area / Location *</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. Kicukiro" />
                </div>
                <div className="xl:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Description *</label>
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" rows="4" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="xl:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="xl:col-span-3 pt-2 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Phone className="h-4 w-4 text-green-600" />Owner Contact for this Property</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plot UPI / Plate / Property ID</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.upi} onChange={(e) => setForm({ ...form, upi: e.target.value })} />
                </div>
                {!editingId && (
                  <>
                    <div className="xl:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Images * <span className="text-xs font-normal text-gray-500">(at least 3)</span></label>
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
                              <button type="button" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} className="text-red-600 hover:text-red-700 font-medium shrink-0">Remove</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Videos <span className="text-xs font-normal text-gray-500">(optional)</span></label>
                      <input type="file" multiple accept="video/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700" onChange={(e) => setForm({ ...form, videos: Array.from(e.target.files || []) })} />
                      <p className="text-xs text-gray-500 mt-1">{form.videos?.length ? `${form.videos.length} video(s) selected` : 'Optional'}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> {submitting ? 'Saving...' : editingId ? 'Update Property' : 'Submit Property'}
                </button>
                <button type="button" onClick={closeForm} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-12 pt-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Ndangira by MAKE IT SOLUTIONS Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
