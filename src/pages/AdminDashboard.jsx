import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Alert } from '../components/Alert';
import {
  LayoutDashboard, Users, Building2, Shield, CheckCircle2, XCircle,
  Home, CreditCard, FileText, Settings, Plus, Search, Phone, Mail, LogOut,
  ChevronRight, ArrowLeft, Eye, Trash2, X, Download, Calendar, Menu, Briefcase, Megaphone
} from 'lucide-react';

const sidebarLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'categories', label: 'Categories', icon: Settings },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'ads', label: 'Advertisements', icon: Megaphone },
  { id: 'reports', label: 'Reports', icon: FileText },
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [propLoading, setPropLoading] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  const [propPage, setPropPage] = useState(1);
  const [propPageSize, setPropPageSize] = useState(10);
  const [viewItem, setViewItem] = useState(null); // { type: 'user'|'property', data }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catName, setCatName] = useState('');
  const [catPublished, setCatPublished] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);

  const [reportFrom, setReportFrom] = useState('');
  const [reportTo, setReportTo] = useState('');
  const [reportType, setReportType] = useState('summary');
  const [reportSummary, setReportSummary] = useState(null);
  const [reportAppliedType, setReportAppliedType] = useState(null);
  const [reportAppliedRange, setReportAppliedRange] = useState({ from: '', to: '' });
  const [reportLoading, setReportLoading] = useState(false);
  const [reportDownloading, setReportDownloading] = useState(false);

  const loadJobs = async () => {
    setJobsLoading(true);
    try { const res = await api.get('/admin/jobs'); setJobs(res.data?.data || []); }
    catch (err) { setError(err.response?.data?.error || 'Failed to load jobs'); }
    finally { setJobsLoading(false); }
  };

  const loadAds = async () => {
    setAdsLoading(true);
    try { const res = await api.get('/admin/ads'); setAds(res.data?.data || []); }
    catch (err) { setError(err.response?.data?.error || 'Failed to load advertisements'); }
    finally { setAdsLoading(false); }
  };

  const loadCategories = async () => {
    setCatLoading(true);
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load categories');
    } finally {
      setCatLoading(false);
    }
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/admin/users'), api.get('/admin/properties'), api.get('/admin/categories'), api.get('/admin/jobs'), api.get('/admin/ads')])
      .then(([u, p, c, j, a]) => {
        setUsers(u.data.data || []);
        setProperties(p.data.data || []);
        setCategories(c.data?.data || []);
        setJobs(j.data?.data || []);
        setAds(a.data?.data || []);
        setUserPage(1); setPropPage(1);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load admin data'); setLoading(false); });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'jobs') loadJobs();
    if (activeTab === 'ads') loadAds();
  }, [activeTab]);

  const approveJob = async (id) => { setJobsLoading(true); setError(null); try { const res = await api.put(`/admin/jobs/${id}/approve`); setJobs(jobs.map(j => j._id === id ? (res.data?.data || j) : j)); } catch (err) { setError(err.response?.data?.error || 'Failed to approve job'); } finally { setJobsLoading(false); } };
  const rejectJob = async (id) => { setJobsLoading(true); setError(null); try { const res = await api.put(`/admin/jobs/${id}/reject`); setJobs(jobs.map(j => j._id === id ? (res.data?.data || j) : j)); } catch (err) { setError(err.response?.data?.error || 'Failed to reject job'); } finally { setJobsLoading(false); } };
  const unpublishJob = async (id) => { setJobsLoading(true); setError(null); try { const res = await api.put(`/admin/jobs/${id}/unpublish`); setJobs(jobs.map(j => j._id === id ? (res.data?.data || j) : j)); } catch (err) { setError(err.response?.data?.error || 'Failed to update job'); } finally { setJobsLoading(false); } };
  const deleteJob = async (id) => { if (!window.confirm('Delete this job?')) return; setJobsLoading(true); setError(null); try { await api.delete(`/admin/jobs/${id}`); setJobs(jobs.filter(j => j._id !== id)); } catch (err) { setError(err.response?.data?.error || 'Failed to delete job'); } finally { setJobsLoading(false); } };

  const markAdPaid = async (id) => { setAdsLoading(true); setError(null); try { const res = await api.put(`/admin/ads/${id}/mark-paid`); setAds(ads.map(a => a._id === id ? (res.data?.data || a) : a)); } catch (err) { setError(err.response?.data?.error || 'Failed to mark ad paid'); } finally { setAdsLoading(false); } };
  const approveAd = async (id) => { setAdsLoading(true); setError(null); try { const res = await api.put(`/admin/ads/${id}/approve`); setAds(ads.map(a => a._id === id ? (res.data?.data || a) : a)); } catch (err) { setError(err.response?.data?.error || 'Failed to approve ad'); } finally { setAdsLoading(false); } };
  const rejectAd = async (id) => { setAdsLoading(true); setError(null); try { const res = await api.put(`/admin/ads/${id}/reject`); setAds(ads.map(a => a._id === id ? (res.data?.data || a) : a)); } catch (err) { setError(err.response?.data?.error || 'Failed to reject ad'); } finally { setAdsLoading(false); } };
  const deactivateAd = async (id) => { setAdsLoading(true); setError(null); try { const res = await api.put(`/admin/ads/${id}/deactivate`); setAds(ads.map(a => a._id === id ? (res.data?.data || a) : a)); } catch (err) { setError(err.response?.data?.error || 'Failed to deactivate ad'); } finally { setAdsLoading(false); } };
  const deleteAd = async (id) => { if (!window.confirm('Delete this advertisement?')) return; setAdsLoading(true); setError(null); try { await api.delete(`/admin/ads/${id}`); setAds(ads.filter(a => a._id !== id)); } catch (err) { setError(err.response?.data?.error || 'Failed to delete ad'); } finally { setAdsLoading(false); } };

  const verifyUser = async (id, current) => {
    setUserLoading(true);
    setError(null);
    try {
      const res = await api.put(`/admin/users/${id}/verify`);
      const updated = res.data?.data;
      setUsers(users.map(u => u._id === id ? { ...u, ...(updated || {}), isVerified: updated?.isVerified ?? !current } : u));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify user');
    } finally {
      setUserLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and their properties?')) return;
    setUserLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setProperties(properties.filter(p => p.owner?._id !== id && p.owner !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setUserLoading(false);
    }
  };

  const approveProperty = async (id) => {
    setPropLoading(true);
    setError(null);
    try {
      const res = await api.put(`/admin/properties/${id}/approve`);
      const updated = res.data?.data;
      setProperties(properties.map(p => p._id === id ? { ...p, ...(updated || {}), isPublished: true, isActive: true } : p));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve property');
    } finally {
      setPropLoading(false);
    }
  };

  const rejectProperty = async (id) => {
    setPropLoading(true);
    setError(null);
    try {
      const res = await api.put(`/admin/properties/${id}/reject`);
      const updated = res.data?.data;
      setProperties(properties.map(p => p._id === id ? { ...p, ...(updated || {}), isPublished: false, isActive: false } : p));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject property');
    } finally {
      setPropLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    setPropLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/properties/${id}`);
      setProperties(properties.filter(p => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete property');
    } finally {
      setPropLoading(false);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setCatLoading(true);
    setError(null);
    try {
      await api.post('/admin/categories', { name: catName.trim(), isPublished: catPublished });
      setCatName('');
      setCatPublished(true);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create category');
    } finally {
      setCatLoading(false);
    }
  };

  const toggleCategoryPublish = async (cat) => {
    setCatLoading(true);
    setError(null);
    try {
      const res = await api.put(`/admin/categories/${cat._id}`, { isPublished: !cat.isPublished });
      const updated = res.data?.data || { ...cat, isPublished: !cat.isPublished };
      setCategories(categories.map(c => c._id === cat._id ? updated : c));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update category');
    } finally {
      setCatLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setCatLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    } finally {
      setCatLoading(false);
    }
  };

  const loadReportSummary = async (from = reportFrom, to = reportTo, type = reportType) => {
    setReportLoading(true);
    setError(null);
    try {
      const params = { type };
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await api.get('/admin/reports/summary', { params });
      setReportSummary(res.data?.data || null);
      setReportAppliedType(type);
      setReportAppliedRange({ from, to });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load report summary');
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reports') loadReportSummary(reportFrom, reportTo, reportType);
  }, [activeTab]);

  const setReportPreset = (preset) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
    const endOfDay = (d) => { const x = new Date(d); x.setHours(23,59,0,0); return x; };
    let from = '', to = '';
    if (preset === 'today') { from = fmt(startOfDay(now)); to = fmt(endOfDay(now)); }
    else if (preset === 'yesterday') { const y = new Date(now); y.setDate(y.getDate()-1); from = fmt(startOfDay(y)); to = fmt(endOfDay(y)); }
    else if (preset === '7d') { const s = new Date(now); s.setDate(s.getDate()-6); from = fmt(startOfDay(s)); to = fmt(endOfDay(now)); }
    else if (preset === 'month') { const s = new Date(now.getFullYear(), now.getMonth(), 1); from = fmt(startOfDay(s)); to = fmt(endOfDay(now)); }
    else if (preset === 'lastMonth') { const s = new Date(now.getFullYear(), now.getMonth()-1, 1); const e = new Date(now.getFullYear(), now.getMonth(), 0); from = fmt(startOfDay(s)); to = fmt(endOfDay(e)); }
    else if (preset === 'all') { from = ''; to = ''; }
    setReportFrom(from); setReportTo(to);
    loadReportSummary(from, to, reportType);
  };

  const reportApplied = !!(reportAppliedType && reportAppliedType === reportType && reportAppliedRange.from === reportFrom && reportAppliedRange.to === reportTo && reportSummary);
  const reportStateMismatch = !!(reportAppliedType && (reportAppliedType !== reportType || reportAppliedRange.from !== reportFrom || reportAppliedRange.to !== reportTo));

  const downloadReport = async (format) => {
    if (!reportApplied) {
      setError('Please click Apply to load the selected report type and date range before downloading.');
      return;
    }
    setReportDownloading(true);
    setError(null);
    try {
      const params = { format, type: reportAppliedType };
      if (reportAppliedRange.from) params.from = reportAppliedRange.from;
      if (reportAppliedRange.to) params.to = reportAppliedRange.to;
      const res = await api.get('/admin/reports/export', { params, responseType: 'blob' });
      const ext = format === 'excel' ? 'xlsx' : 'pdf';
      const blob = new Blob([res.data], { type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ndangira-report-${reportAppliedType}-${new Date().toISOString().slice(0,10)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download report');
    } finally {
      setReportDownloading(false);
    }
  };

  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter(u => u.isVerified).length,
    unverifiedUsers: users.filter(u => !u.isVerified).length,
    totalProperties: properties.length,
    publishedProperties: properties.filter(p => p.isPublished).length,
    pendingProperties: properties.filter(p => !p.isPublished).length,
    completedPayments: properties.filter(p => p.paymentStatus === 'completed').length,
    pendingPayments: properties.filter(p => p.paymentStatus !== 'completed').length,
    totalJobs: jobs.length,
    publishedJobs: jobs.filter(j => j.isPublished).length,
    paidJobs: jobs.filter(j => j.paymentStatus === 'paid').length,
    totalAds: ads.length,
    activeAds: ads.filter(a => a.isActive).length,
    paidAds: ads.filter(a => a.paymentStatus === 'paid').length,
  };

  const chartColors = ['#16a34a', '#22c55e', '#86efac', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#64748b', '#14b8a6'];

  const SimpleBarChart = ({ title, data, valueSuffix = '' }) => {
    const max = Math.max(1, ...data.map((d) => d.value || 0));
    const hasData = data.some((d) => (d.value || 0) > 0);
    return (
      <div className="bg-white p-3 shadow border border-gray-200">
        <h3 className="text-xs font-semibold text-gray-900 mb-2">{title}</h3>
        {!hasData ? <p className="text-xs text-gray-500">No data available</p> : (
          <div className="space-y-2">
            {data.map((d, i) => (
              <div key={d.label}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-gray-700 truncate pr-2">{d.label}</span>
                  <span className="font-medium text-gray-900">{d.value}{valueSuffix}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0)}%`, backgroundColor: d.color || chartColors[i % chartColors.length] }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SimplePieChart = ({ title, data }) => {
    const filtered = data.filter((d) => (d.value || 0) > 0);
    const total = filtered.reduce((s, d) => s + d.value, 0);
    let acc = 0;
    const stops = filtered.map((d, i) => {
      const start = (acc / total) * 100;
      acc += d.value;
      const end = (acc / total) * 100;
      return `${d.color || chartColors[i % chartColors.length]} ${start}% ${end}%`;
    });
    const gradient = stops.length ? `conic-gradient(${stops.join(', ')})` : 'conic-gradient(#e5e7eb 0% 100%)';
    return (
      <div className="bg-white p-3 shadow border border-gray-200">
        <h3 className="text-xs font-semibold text-gray-900 mb-2">{title}</h3>
        {total === 0 ? <p className="text-xs text-gray-500">No data available</p> : (
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full shrink-0 border border-gray-100" style={{ background: gradient }} />
            <div className="w-full space-y-1 min-w-0">
              {filtered.map((d, i) => (
                <div key={d.label} className="flex items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color || chartColors[i % chartColors.length] }} />
                    <span className="text-gray-700 truncate">{d.label}</span>
                  </div>
                  <span className="font-medium text-gray-900 shrink-0">{d.value} ({Math.round((d.value / total) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDashboard = () => {
    const roleCounts = {};
    users.forEach((u) => { const r = (u.role || 'other'); roleCounts[r] = (roleCounts[r] || 0) + 1; });
    const typeCounts = {};
    properties.forEach((p) => { const t = (p.type || 'other'); typeCounts[t] = (typeCounts[t] || 0) + 1; });
    const categoryCounts = {};
    properties.forEach((p) => { const c = (p.category || 'uncategorized'); categoryCounts[c] = (categoryCounts[c] || 0) + 1; });
    const jobStatusCounts = { pending: 0, approved: 0, rejected: 0 };
    jobs.forEach((j) => { jobStatusCounts[j.status || 'pending'] = (jobStatusCounts[j.status || 'pending'] || 0) + 1; });
    const adStatusCounts = { pending: 0, approved: 0, rejected: 0 };
    ads.forEach((a) => { adStatusCounts[a.status || 'pending'] = (adStatusCounts[a.status || 'pending'] || 0) + 1; });

    const overviewBars = [
      { label: 'Users', value: stats.totalUsers, color: '#16a34a' },
      { label: 'Properties', value: stats.totalProperties, color: '#3b82f6' },
      { label: 'Jobs', value: stats.totalJobs, color: '#8b5cf6' },
      { label: 'Advertisements', value: stats.totalAds, color: '#f59e0b' },
    ];
    const propertyStatusPie = [
      { label: 'Published', value: stats.publishedProperties, color: '#16a34a' },
      { label: 'Pending Approval', value: stats.pendingProperties, color: '#f59e0b' },
    ];
    const userVerifyPie = [
      { label: 'Verified', value: stats.verifiedUsers, color: '#16a34a' },
      { label: 'Unverified', value: stats.unverifiedUsers, color: '#94a3b8' },
    ];
    const paymentPie = [
      { label: 'Completed', value: stats.completedPayments, color: '#16a34a' },
      { label: 'Pending/Other', value: stats.pendingPayments, color: '#f59e0b' },
    ];
    const jobsPie = [
      { label: 'Pending', value: jobStatusCounts.pending || 0, color: '#f59e0b' },
      { label: 'Approved', value: jobStatusCounts.approved || 0, color: '#16a34a' },
      { label: 'Rejected', value: jobStatusCounts.rejected || 0, color: '#ef4444' },
    ];
    const adsPie = [
      { label: 'Pending', value: adStatusCounts.pending || 0, color: '#f59e0b' },
      { label: 'Approved', value: adStatusCounts.approved || 0, color: '#16a34a' },
      { label: 'Rejected', value: adStatusCounts.rejected || 0, color: '#ef4444' },
    ];
    const propertyTypeBars = Object.entries(typeCounts).map(([label, value], i) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), value, color: chartColors[i % chartColors.length] }));
    const propertyCategoryBars = Object.entries(categoryCounts).map(([label, value], i) => ({ label, value, color: chartColors[(i + 2) % chartColors.length] })).sort((a,b) => b.value - a.value).slice(0, 8);
    const userRoleBars = Object.entries(roleCounts).map(([label, value], i) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), value, color: chartColors[i % chartColors.length] }));

    return (
      <div className="mb-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 items-start">
        <section className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 shadow border border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-xs text-gray-500">Total Users</p><h3 className="text-lg font-bold text-gray-900">{stats.totalUsers}</h3></div>
                <Users className="h-6 w-6 text-green-600 bg-green-50 p-1.5 rounded" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Registered users</p>
            </div>
            <div className="bg-white p-3 shadow border border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-xs text-gray-500">Verified Users</p><h3 className="text-lg font-bold text-green-600">{stats.verifiedUsers}</h3></div>
                <Shield className="h-6 w-6 text-green-600 bg-green-50 p-1.5 rounded" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Verified accounts</p>
            </div>
            <div className="bg-white p-3 shadow border border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-xs text-gray-500">Total Properties</p><h3 className="text-lg font-bold text-gray-900">{stats.totalProperties}</h3></div>
                <Building2 className="h-6 w-6 text-green-600 bg-green-50 p-1.5 rounded" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Listed properties</p>
            </div>
            <div className="bg-white p-3 shadow border border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-xs text-gray-500">Published</p><h3 className="text-lg font-bold text-green-600">{stats.publishedProperties}</h3></div>
                <CheckCircle2 className="h-6 w-6 text-green-600 bg-green-50 p-1.5 rounded" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Live on website</p>
            </div>
            <div className="bg-white p-3 shadow border border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-xs text-gray-500">Pending Approval</p><h3 className="text-lg font-bold text-amber-600">{stats.pendingProperties}</h3></div>
                <XCircle className="h-6 w-6 text-amber-600 bg-amber-50 p-1.5 rounded" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Awaiting review</p>
            </div>
            <div className="bg-white p-3 shadow border border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-xs text-gray-500">Paid Payments</p><h3 className="text-lg font-bold text-green-600">{stats.completedPayments}</h3></div>
                <CreditCard className="h-6 w-6 text-green-600 bg-green-50 p-1.5 rounded" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Verified payments</p>
            </div>
            <div className="bg-white p-3 shadow border border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-xs text-gray-500">Jobs</p><h3 className="text-lg font-bold text-gray-900">{stats.totalJobs}</h3></div>
                <Briefcase className="h-6 w-6 text-green-600 bg-green-50 p-1.5 rounded" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Job submissions</p>
            </div>
            <div className="bg-white p-3 shadow border border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-xs text-gray-500">Advertisements</p><h3 className="text-lg font-bold text-gray-900">{stats.totalAds}</h3></div>
                <Megaphone className="h-6 w-6 text-green-600 bg-green-50 p-1.5 rounded" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Ad requests</p>
            </div>
          </div>
        </section>

        <section className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SimpleBarChart title="Platform Overview" data={overviewBars} />
            <SimplePieChart title="Property Status" data={propertyStatusPie} />
            <SimplePieChart title="User Verification" data={userVerifyPie} />
            <SimplePieChart title="Property Payments" data={paymentPie} />
            {propertyTypeBars.length > 0 && <SimpleBarChart title="Properties by Type" data={propertyTypeBars} />}
            {propertyCategoryBars.length > 0 && <SimpleBarChart title="Properties by Category" data={propertyCategoryBars} />}
            {userRoleBars.length > 0 && <SimpleBarChart title="Users by Role" data={userRoleBars} />}
            {stats.totalJobs > 0 && <SimplePieChart title="Jobs by Status" data={jobsPie} />}
            {stats.totalAds > 0 && <SimplePieChart title="Advertisements by Status" data={adsPie} />}
          </div>
        </section>
      </div>
    );
  };

  const paginate = (items, page, pageSize) => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

  const renderUsers = () => {
    const pageItems = paginate(users, userPage, userPageSize);
    const totalPages = Math.ceil(users.length / userPageSize) || 1;
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" /> Users Management
          </h2>
        </div>
        <div className="bg-white shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs">
                <th className="pb-3 text-left px-3">Name</th>
                <th className="pb-3 text-left px-3">Email</th>
                <th className="pb-3 text-left px-3">Role</th>
                <th className="pb-3 text-left px-3">Verified</th>
                <th className="pb-3 text-left px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">No users found</td></tr>
              ) : (
                pageItems.map((u) => (
                  <tr key={u._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-3">{u.name}</td>
                    <td className="py-3 px-3">{u.email}</td>
                    <td className="py-3 px-3 capitalize">{u.role}</td>
                    <td className="py-3 px-3">
                      {u.isVerified ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-xs"><XCircle className="h-3.5 w-3.5" /> Unverified</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewItem({ type: 'user', data: u })} title="View" className="text-xs px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> View</button>
                        <button onClick={() => verifyUser(u._id, u.isVerified)} disabled={userLoading} title={u.isVerified ? 'Unverify' : 'Verify'} className={`text-xs px-2 py-1 border flex items-center gap-1 ${u.isVerified ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}><CheckCircle2 className="h-3.5 w-3.5" /> {u.isVerified ? 'Unverify' : 'Verify'}</button>
                        <button onClick={() => deleteUser(u._id)} disabled={userLoading || u.role === 'admin'} title="Delete" className="text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-40 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="text-sm text-gray-600">
            Showing {users.length > 0 ? ((userPage - 1) * userPageSize + 1) : 0} to {Math.min(userPage * userPageSize, users.length)} of {users.length} entries
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-gray-600">Rows per page:</label>
            <select
              value={userPageSize}
              onChange={(e) => { setUserPageSize(parseInt(e.target.value)); setUserPage(1); }}
              className="text-xs border px-2 py-1"
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setUserPage((p) => Math.max(1, p - 1))}
              disabled={userPage === 1}
              className="px-2 py-1 text-xs border hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2 py-1 text-xs font-medium">{userPage} / {totalPages}</span>
            <button
              onClick={() => setUserPage((p) => Math.min(totalPages, p + 1))}
              disabled={userPage === totalPages}
              className="px-2 py-1 text-xs border hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProperties = () => {
    const pageItems = paginate(properties, propPage, propPageSize);
    const totalPages = Math.ceil(properties.length / propPageSize) || 1;
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" /> Properties Management
          </h2>
        </div>
        <div className="bg-white shadow border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs">
                <th className="pb-3 text-left px-3">Title</th>
                <th className="pb-3 text-left px-3">Owner</th>
                <th className="pb-3 text-left px-3">Price</th>
                <th className="pb-3 text-left px-3">Location</th>
                <th className="pb-3 text-left px-3">Status</th>
                <th className="pb-3 text-left px-3">Payment</th>
                <th className="pb-3 text-left px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-gray-500">No properties found</td></tr>
              ) : (
                pageItems.map((p) => (
                  <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-900">{p.title}</td>
                    <td className="py-3 px-3">{p.owner?.name || 'Unknown'}</td>
                    <td className="py-3 px-3">{p.price ? p.price.toLocaleString() : 'N/A'} {p.currency || 'RWF'}</td>
                    <td className="py-3 px-3">{p.area || 'â€”'}</td>
                    <td className="py-3 px-3">
                      {p.isPublished ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Published</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-xs"><XCircle className="h-3.5 w-3.5" /> Hidden</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-1 ${p.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.paymentStatus || 'pending'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setViewItem({ type: 'property', data: p })} title="View" className="text-xs px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> View</button>
                        {p.isPublished ? (
                          <button onClick={() => rejectProperty(p._id)} disabled={propLoading} className="text-xs px-2 py-1 border border-amber-300 text-amber-700 hover:bg-amber-50">Reject</button>
                        ) : (
                          <button onClick={() => approveProperty(p._id)} disabled={propLoading} className="text-xs px-2 py-1 border border-green-300 text-green-700 hover:bg-green-50">Approve</button>
                        )}
                        <button onClick={() => deleteProperty(p._id)} disabled={propLoading} title="Delete" className="text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="text-sm text-gray-600">
            Showing {properties.length > 0 ? ((propPage - 1) * propPageSize + 1) : 0} to {Math.min(propPage * propPageSize, properties.length)} of {properties.length} entries
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-gray-600">Rows per page:</label>
            <select
              value={propPageSize}
              onChange={(e) => { setPropPageSize(parseInt(e.target.value)); setPropPage(1); }}
              className="text-xs border px-2 py-1"
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPropPage((p) => Math.max(1, p - 1))}
              disabled={propPage === 1}
              className="px-2 py-1 text-xs border hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2 py-1 text-xs font-medium">{propPage} / {totalPages}</span>
            <button
              onClick={() => setPropPage((p) => Math.min(totalPages, p + 1))}
              disabled={propPage === totalPages}
              className="px-2 py-1 text-xs border hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><Settings className="h-5 w-5 text-green-600" /> Create Category</h3>
        <form onSubmit={createCategory} className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category name</label>
            <input
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Rent, Sale, Lease"
              required
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 pb-2 sm:pb-0">
            <input type="checkbox" checked={catPublished} onChange={(e) => setCatPublished(e.target.checked)} />
            Published (visible in search)
          </label>
          <button type="submit" disabled={catLoading} className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-60">
            <Plus className="h-4 w-4" /> {catLoading ? 'Saving...' : 'Create'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Categories</h3>
          <p className="text-xs text-gray-500">Only published categories appear in search and property forms.</p>
        </div>
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs">
              <th className="pb-3 pt-3 text-left px-4">Name</th>
              <th className="pb-3 pt-3 text-left px-4">Slug</th>
              <th className="pb-3 pt-3 text-left px-4">Status</th>
              <th className="pb-3 pt-3 text-left px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="4" className="py-8 text-center text-gray-500">No categories yet. Create one above.</td></tr>
            ) : (
              categories.map((c) => (
                <tr key={c._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{c.name}</td>
                  <td className="py-3 px-4 text-gray-600">{c.slug}</td>
                  <td className="py-3 px-4">
                    {c.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Published</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-xs"><XCircle className="h-3.5 w-3.5" /> Draft</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => toggleCategoryPublish(c)} disabled={catLoading} className={`text-xs px-2 py-1 border ${c.isPublished ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                        {c.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => deleteCategory(c._id)} disabled={catLoading} className="text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => {
    const applied = reportApplied;
    const d = reportSummary || {};
    const fmt = (v) => (v ? new Date(v).toLocaleString() : 'â€”');
    const typeLabel = { summary: 'Summary', users: 'Users', properties: 'Properties', payments: 'Payments', categories: 'Categories', jobs: 'Jobs', ads: 'Advertisements', all: 'All (Summary + Details)' };
    const c = d.counts || {};
    const summaryMetrics = [
      ['Total Users', c.users ?? 0],
      ['Verified Users', c.verifiedUsers ?? 0],
      ['Total Properties', c.properties ?? 0],
      ['Published Properties', c.publishedProperties ?? 0],
      ['Pending Approval', c.pendingProperties ?? 0],
      ['Completed Payments', c.completedPayments ?? 0],
      ['Pending Payments', c.pendingPayments ?? 0],
    ];
    const hasSummaryData = summaryMetrics.some(([, v]) => Number(v) > 0);
    const hasUsers = (d.users || []).length > 0;
    const hasProperties = (d.properties || []).length > 0;
    const hasPayments = (d.payments || []).length > 0;
    const hasCategories = (d.categories || []).length > 0;
    const hasJobs = (d.jobs || []).length > 0;
    const hasAds = (d.ads || []).length > 0;
    const hasTypeData = !applied ? false :
      reportAppliedType === 'summary' ? hasSummaryData :
      reportAppliedType === 'users' ? hasUsers :
      reportAppliedType === 'properties' ? hasProperties :
      reportAppliedType === 'payments' ? hasPayments :
      reportAppliedType === 'categories' ? hasCategories :
      reportAppliedType === 'jobs' ? hasJobs :
      reportAppliedType === 'ads' ? hasAds :
      (hasSummaryData || hasUsers || hasProperties || hasPayments || hasCategories || hasJobs || hasAds);

    const renderSummaryTable = (counts = c) => (
      <table className="w-full text-sm">
        <tbody>
          {[
            ['Total Users', counts.users ?? 0, 'text-gray-900'],
            ['Verified Users', counts.verifiedUsers ?? 0, 'text-green-600'],
            ['Total Properties', counts.properties ?? 0, 'text-gray-900'],
            ['Published Properties', counts.publishedProperties ?? 0, 'text-green-600'],
            ['Pending Approval', counts.pendingProperties ?? 0, 'text-amber-600'],
            ['Completed Payments', counts.completedPayments ?? 0, 'text-green-600'],
            ['Pending Payments', counts.pendingPayments ?? 0, 'text-amber-600'],
            ['Jobs', counts.jobs ?? 0, 'text-gray-900'],
            ['Paid Jobs', counts.paidJobs ?? 0, 'text-green-600'],
            ['Advertisements', counts.ads ?? 0, 'text-gray-900'],
            ['Active Ads', counts.activeAds ?? 0, 'text-green-600'],
          ].map(([label, val, cls], i, arr) => (
            <tr key={label} className={i < arr.length - 1 ? 'border-b' : ''}>
              <td className="py-2 text-gray-500">{label}</td>
              <td className={`text-right font-medium ${cls}`}>{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div className="space-y-6">
        <div className="bg-white p-4 shadow border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><Calendar className="h-5 w-5 text-green-600" /> Report Filters</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setReportPreset('today')} className="px-3 py-1.5 text-xs border border-gray-300 hover:bg-gray-50">Today</button>
            <button onClick={() => setReportPreset('yesterday')} className="px-3 py-1.5 text-xs border border-gray-300 hover:bg-gray-50">Yesterday</button>
            <button onClick={() => setReportPreset('7d')} className="px-3 py-1.5 text-xs border border-gray-300 hover:bg-gray-50">Last 7 Days</button>
            <button onClick={() => setReportPreset('month')} className="px-3 py-1.5 text-xs border border-gray-300 hover:bg-gray-50">This Month</button>
            <button onClick={() => setReportPreset('lastMonth')} className="px-3 py-1.5 text-xs border border-gray-300 hover:bg-gray-50">Last Month</button>
            <button onClick={() => setReportPreset('all')} className="px-3 py-1.5 text-xs border border-gray-300 hover:bg-gray-50">All Time</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">From (date & time)</label>
              <input type="datetime-local" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">To (date & time)</label>
              <input type="datetime-local" value={reportTo} onChange={(e) => setReportTo(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="summary">Summary</option>
                <option value="users">Users</option>
                <option value="properties">Properties</option>
                <option value="payments">Payments</option>
                <option value="categories">Categories</option>
                <option value="jobs">Jobs</option>
                <option value="ads">Advertisements</option>
                <option value="all">All (Summary + Details)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => loadReportSummary()} disabled={reportLoading} className="flex-1 bg-gray-800 text-white px-3 py-2 text-sm hover:bg-gray-900 disabled:opacity-60">{reportLoading ? 'Loading...' : 'Apply'}</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => downloadReport('pdf')} disabled={reportDownloading || !applied} className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700 disabled:opacity-60"><Download className="h-4 w-4" /> Download PDF</button>
            <button onClick={() => downloadReport('excel')} disabled={reportDownloading || !applied} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700 disabled:opacity-60"><Download className="h-4 w-4" /> Download Excel</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Select type/range and click <strong>Apply</strong> to view data. Downloads include only the applied report type and range.</p>
          {(!applied || reportStateMismatch) && (
            <div className="mt-3 bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              {!reportSummary ? 'Click Apply to load the selected report type and date range before viewing or downloading.' : 'Report type or date range changed. Click Apply to load and enable download for the selected report.'}
            </div>
          )}
          {applied && (
            <p className="text-xs text-green-700 mt-2">Showing: <strong>{typeLabel[reportAppliedType] || reportAppliedType}</strong> | Range: {reportAppliedRange.from ? new Date(reportAppliedRange.from).toLocaleString() : 'All'} â€” {reportAppliedRange.to ? new Date(reportAppliedRange.to).toLocaleString() : 'Now'}</p>
          )}
        </div>

        {reportLoading && <div className="bg-white p-4 shadow border border-gray-200 text-sm text-gray-500">Loading report...</div>}

        {applied && !reportLoading && !hasTypeData && (
          <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            No report data in selected range.
          </div>
        )}

        {applied && !reportLoading && hasTypeData && (
          <div className="space-y-6">
            {(reportAppliedType === 'summary' || reportAppliedType === 'all') && (
              <div className="bg-white p-6 shadow border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-green-600" /> Summary Report</h3>
                {renderSummaryTable()}
              </div>
            )}

            {(reportAppliedType === 'users' || reportAppliedType === 'all') && (
              <div className="bg-white shadow border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200"><h3 className="text-lg font-bold text-gray-900">Users ({(d.users || []).length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs"><th className="text-left px-4 py-2">Name</th><th className="text-left px-4 py-2">Email</th><th className="text-left px-4 py-2">Phone</th><th className="text-left px-4 py-2">Role</th><th className="text-left px-4 py-2">Verified</th><th className="text-left px-4 py-2">Created</th></tr></thead>
                    <tbody>
                      {(d.users || []).length === 0 ? <tr><td colSpan="6" className="py-6 text-center text-gray-500">No users in range</td></tr> :
                        (d.users || []).map((u) => (
                          <tr key={u._id} className="border-b last:border-0"><td className="px-4 py-2">{u.name}</td><td className="px-4 py-2">{u.email}</td><td className="px-4 py-2">{u.phone || 'â€”'}</td><td className="px-4 py-2 capitalize">{u.role}</td><td className="px-4 py-2">{u.isVerified ? 'Yes' : 'No'}</td><td className="px-4 py-2">{fmt(u.createdAt)}</td></tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(reportAppliedType === 'properties' || reportAppliedType === 'all') && (
              <div className="bg-white shadow border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200"><h3 className="text-lg font-bold text-gray-900">Properties ({(d.properties || []).length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs"><th className="text-left px-4 py-2">Title</th><th className="text-left px-4 py-2">Owner</th><th className="text-left px-4 py-2">Type</th><th className="text-left px-4 py-2">Category</th><th className="text-left px-4 py-2">Price</th><th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Created</th></tr></thead>
                    <tbody>
                      {(d.properties || []).length === 0 ? <tr><td colSpan="7" className="py-6 text-center text-gray-500">No properties in range</td></tr> :
                        (d.properties || []).map((p) => (
                          <tr key={p._id} className="border-b last:border-0"><td className="px-4 py-2 font-medium">{p.title}</td><td className="px-4 py-2">{p.owner?.name || 'â€”'}</td><td className="px-4 py-2 capitalize">{p.type}</td><td className="px-4 py-2">{p.category}</td><td className="px-4 py-2">{p.price != null ? `${Number(p.price).toLocaleString()} ${p.currency || 'RWF'}` : 'â€”'}</td><td className="px-4 py-2">{p.isPublished ? 'Published' : 'Pending'}</td><td className="px-4 py-2">{fmt(p.createdAt)}</td></tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(reportAppliedType === 'payments' || reportAppliedType === 'all') && (
              <div className="bg-white shadow border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200"><h3 className="text-lg font-bold text-gray-900">Payments ({(d.payments || []).length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs"><th className="text-left px-4 py-2">User</th><th className="text-left px-4 py-2">Property</th><th className="text-left px-4 py-2">Type</th><th className="text-left px-4 py-2">Amount</th><th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Method</th><th className="text-left px-4 py-2">Created</th></tr></thead>
                    <tbody>
                      {(d.payments || []).length === 0 ? <tr><td colSpan="7" className="py-6 text-center text-gray-500">No payments in range</td></tr> :
                        (d.payments || []).map((p) => (
                          <tr key={p._id} className="border-b last:border-0"><td className="px-4 py-2">{p.user?.name || p.user?.email || 'â€”'}</td><td className="px-4 py-2">{p.property?.title || 'â€”'}</td><td className="px-4 py-2">{p.type}</td><td className="px-4 py-2">{Number(p.amount || 0).toLocaleString()} {p.currency || 'RWF'}</td><td className="px-4 py-2 capitalize">{p.status}</td><td className="px-4 py-2">{p.method || 'â€”'}</td><td className="px-4 py-2">{fmt(p.createdAt)}</td></tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(reportAppliedType === 'categories' || reportAppliedType === 'all') && (
              <div className="bg-white shadow border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200"><h3 className="text-lg font-bold text-gray-900">Categories ({(d.categories || []).length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs"><th className="text-left px-4 py-2">Name</th><th className="text-left px-4 py-2">Slug</th><th className="text-left px-4 py-2">Published</th><th className="text-left px-4 py-2">Created</th></tr></thead>
                    <tbody>
                      {(d.categories || []).length === 0 ? <tr><td colSpan="4" className="py-6 text-center text-gray-500">No categories in range</td></tr> :
                        (d.categories || []).map((cat) => (
                          <tr key={cat._id} className="border-b last:border-0"><td className="px-4 py-2 font-medium">{cat.name}</td><td className="px-4 py-2">{cat.slug}</td><td className="px-4 py-2">{cat.isPublished ? 'Yes' : 'No'}</td><td className="px-4 py-2">{fmt(cat.createdAt)}</td></tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(reportAppliedType === 'jobs' || reportAppliedType === 'all') && (
              <div className="bg-white shadow border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200"><h3 className="text-lg font-bold text-gray-900">Jobs ({(d.jobs || []).length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs"><th className="text-left px-4 py-2">Title</th><th className="text-left px-4 py-2">Company</th><th className="text-left px-4 py-2">Location</th><th className="text-left px-4 py-2">Type</th><th className="text-left px-4 py-2">Payment</th><th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Submitted By</th><th className="text-left px-4 py-2">Created</th></tr></thead>
                    <tbody>
                      {(d.jobs || []).length === 0 ? <tr><td colSpan="8" className="py-6 text-center text-gray-500">No jobs in range</td></tr> :
                        (d.jobs || []).map((j) => (
                          <tr key={j._id} className="border-b last:border-0"><td className="px-4 py-2 font-medium">{j.title}</td><td className="px-4 py-2">{j.company}</td><td className="px-4 py-2">{j.location}</td><td className="px-4 py-2">{j.type}</td><td className="px-4 py-2 capitalize">{j.paymentStatus || 'unpaid'}{j.amount != null ? ` (${Number(j.amount).toLocaleString()} ${j.currency || 'RWF'})` : ''}</td><td className="px-4 py-2 capitalize">{j.status}{j.isPublished ? ' (published)' : ''}</td><td className="px-4 py-2">{j.submittedBy?.email || j.submittedBy?.name || '—'}</td><td className="px-4 py-2">{fmt(j.createdAt)}</td></tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(reportAppliedType === 'ads' || reportAppliedType === 'all') && (
              <div className="bg-white shadow border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200"><h3 className="text-lg font-bold text-gray-900">Advertisements ({(d.ads || []).length})</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs"><th className="text-left px-4 py-2">Company</th><th className="text-left px-4 py-2">Title</th><th className="text-left px-4 py-2">Plan</th><th className="text-left px-4 py-2">Amount</th><th className="text-left px-4 py-2">Payment</th><th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Expires</th><th className="text-left px-4 py-2">Created</th></tr></thead>
                    <tbody>
                      {(d.ads || []).length === 0 ? <tr><td colSpan="8" className="py-6 text-center text-gray-500">No advertisements in range</td></tr> :
                        (d.ads || []).map((a) => (
                          <tr key={a._id} className="border-b last:border-0"><td className="px-4 py-2"><div className="font-medium">{a.companyName}</div><div className="text-xs text-gray-500">{a.contactEmail || ''}</div></td><td className="px-4 py-2">{a.title}</td><td className="px-4 py-2 capitalize">{a.plan}</td><td className="px-4 py-2">{Number(a.amount || 0).toLocaleString()} {a.currency || 'RWF'}</td><td className="px-4 py-2 capitalize">{a.paymentStatus}</td><td className="px-4 py-2 capitalize">{a.status}{a.isActive ? ' (active)' : ''}</td><td className="px-4 py-2">{a.expiresAt ? fmt(a.expiresAt) : '—'}</td><td className="px-4 py-2">{fmt(a.createdAt)}</td></tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderJobs = () => (
    <div className="bg-white shadow border border-gray-200 overflow-x-auto">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Job Requests & Opportunities</h3>
          <p className="text-xs text-gray-500">Review submissions and approve to publish on /jobs.</p>
        </div>
      </div>
      <table className="w-full min-w-[1080px] text-sm">
        <thead><tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs"><th className="text-left px-4 py-2">Title</th><th className="text-left px-4 py-2">Company</th><th className="text-left px-4 py-2">Location</th><th className="text-left px-4 py-2">Type</th><th className="text-left px-4 py-2">Payment</th><th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Submitted By</th><th className="text-left px-4 py-2">Action</th></tr></thead>
        <tbody>
          {jobs.length === 0 ? <tr><td colSpan="8" className="py-8 text-center text-gray-500">No job submissions</td></tr> : jobs.map((j) => (
            <tr key={j._id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{j.title}</td>
              <td className="px-4 py-3">{j.company}</td>
              <td className="px-4 py-3">{j.location}</td>
              <td className="px-4 py-3">{j.type}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-1 ${j.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{j.paymentStatus || 'unpaid'}</span> <span className="text-xs text-gray-500">({Number(j.amount || 0).toLocaleString()} RWF)</span></td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-1 ${j.status === 'approved' && j.isPublished ? 'bg-green-100 text-green-700' : j.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{j.status}{j.isPublished ? ' (published)' : ''}</span></td>
              <td className="px-4 py-3">{j.submittedBy?.email || '—'}</td>
              <td className="px-4 py-3"><div className="flex flex-wrap gap-2">
                <button onClick={() => setViewItem({ type: 'job', data: j })} className="text-xs px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> View</button>
                <button onClick={() => approveJob(j._id)} disabled={jobsLoading || j.paymentStatus !== 'paid'} className="text-xs px-2 py-1 border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50">Approve</button>
                <button onClick={() => rejectJob(j._id)} disabled={jobsLoading} className="text-xs px-2 py-1 border border-amber-300 text-amber-700 hover:bg-amber-50">Reject</button>
                <button onClick={() => unpublishJob(j._id)} disabled={jobsLoading} className="text-xs px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50">Unpublish</button>
                <button onClick={() => deleteJob(j._id)} disabled={jobsLoading} className="text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAds = () => (
    <div className="bg-white shadow border border-gray-200 overflow-x-auto">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Partnership & Advertisement Requests</h3>
        <p className="text-xs text-gray-500">Confirm payment, then approve to publish. Plans: 50,000 RWF/month, 500,000 RWF/year.</p>
      </div>
      <table className="w-full min-w-[1100px] text-sm">
        <thead><tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs"><th className="text-left px-4 py-2">Company</th><th className="text-left px-4 py-2">Title</th><th className="text-left px-4 py-2">Plan</th><th className="text-left px-4 py-2">Amount</th><th className="text-left px-4 py-2">Payment</th><th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Expires</th><th className="text-left px-4 py-2">Action</th></tr></thead>
        <tbody>
          {ads.length === 0 ? <tr><td colSpan="8" className="py-8 text-center text-gray-500">No advertisement requests</td></tr> : ads.map((a) => (
            <tr key={a._id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3"><div className="font-medium text-gray-900">{a.companyName}</div><div className="text-xs text-gray-500">{a.contactEmail}</div></td>
              <td className="px-4 py-3">{a.title}</td>
              <td className="px-4 py-3 capitalize">{a.plan}</td>
              <td className="px-4 py-3">{Number(a.amount || 0).toLocaleString()} {a.currency || 'RWF'}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-1 ${a.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{a.paymentStatus}</span></td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-1 ${a.status === 'approved' && a.isActive ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{a.status}{a.isActive ? ' (active)' : ''}</span></td>
              <td className="px-4 py-3">{a.expiresAt ? new Date(a.expiresAt).toLocaleDateString() : 'â€”'}</td>
              <td className="px-4 py-3"><div className="flex flex-wrap gap-2">
                <button onClick={() => setViewItem({ type: 'ad', data: a })} className="text-xs px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> View</button>
                <button onClick={() => markAdPaid(a._id)} disabled={adsLoading || a.paymentStatus === 'paid'} className="text-xs px-2 py-1 border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50">Mark Paid</button>
                <button onClick={() => approveAd(a._id)} disabled={adsLoading || a.paymentStatus !== 'paid'} className="text-xs px-2 py-1 border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50">Approve</button>
                <button onClick={() => rejectAd(a._id)} disabled={adsLoading} className="text-xs px-2 py-1 border border-amber-300 text-amber-700 hover:bg-amber-50">Reject</button>
                <button onClick={() => deactivateAd(a._id)} disabled={adsLoading} className="text-xs px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50">Deactivate</button>
                <button onClick={() => deleteAd(a._id)} disabled={adsLoading} className="text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'users': return renderUsers();
      case 'properties': return renderProperties();
      case 'categories': return renderCategories();
      case 'jobs': return renderJobs();
      case 'ads': return renderAds();
      case 'reports': return renderReports();
      default: return renderDashboard();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading admin panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'translate-x-0 w-56' : '-translate-x-full w-56'} lg:translate-x-0 lg:w-16 lg:hover:w-52 group`}>
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <LayoutDashboard className="h-6 w-6 text-green-600 shrink-0" />
            <span className={`font-bold text-xl tracking-tight text-gray-900 whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>Ndangira</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <nav className="p-2 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-3 py-2.5 transition overflow-hidden ${isActive ? 'bg-green-50 text-green-700 font-medium border-r-2 border-green-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={`text-sm whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'} ${isActive ? 'font-medium' : 'font-normal'}`}>{link.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-4 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 border border-red-100 transition overflow-hidden"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={`text-sm whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-20 p-4 sm:p-6 lg:pr-8 lg:py-8">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{sidebarLinks.find(l => l.id === activeTab)?.label}</h1>
              <p className="text-sm sm:text-base text-gray-600">Admin platform management</p>
            </div>
          </div>
        </div>

        {error && <Alert message={error} />}

        {renderTab()}
      </div>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/50 overflow-y-auto">
          <div className="bg-white border border-gray-200 shadow-xl w-full max-w-lg max-h-[75vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">{viewItem.type === 'user' ? 'User Details' : viewItem.type === 'property' ? 'Property Details' : viewItem.type === 'job' ? 'Job Details' : 'Advertisement Details'}</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 hover:bg-gray-100 text-gray-500"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 text-sm">
              {viewItem.type === 'user' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><p className="text-gray-500 text-xs">Name</p><p className="font-medium text-gray-900">{viewItem.data.name || '—'}</p></div>
                  <div><p className="text-gray-500 text-xs">Email</p><p className="font-medium text-gray-900 break-all">{viewItem.data.email || '—'}</p></div>
                  <div><p className="text-gray-500 text-xs">Phone</p><p className="font-medium text-gray-900">{viewItem.data.phone || '—'}</p></div>
                  <div><p className="text-gray-500 text-xs">Role</p><p className="font-medium text-gray-900 capitalize">{viewItem.data.role || '—'}</p></div>
                  <div><p className="text-gray-500 text-xs">Verified</p><p className="font-medium text-gray-900">{viewItem.data.isVerified ? 'Yes' : 'No'}</p></div>
                  <div><p className="text-gray-500 text-xs">ID</p><p className="font-medium text-gray-900 break-all text-xs">{viewItem.data._id}</p></div>
                </div>
              ) : viewItem.type === 'property' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2"><p className="text-gray-500 text-xs">Title</p><p className="font-medium text-gray-900">{viewItem.data.title || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Owner</p><p className="font-medium text-gray-900">{viewItem.data.owner?.name || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Owner Email</p><p className="font-medium text-gray-900 break-all">{viewItem.data.owner?.email || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Type</p><p className="font-medium text-gray-900 capitalize">{viewItem.data.type || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Category</p><p className="font-medium text-gray-900 capitalize">{viewItem.data.category || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Price</p><p className="font-medium text-gray-900">{viewItem.data.price != null ? `${Number(viewItem.data.price).toLocaleString()} ${viewItem.data.currency || 'RWF'}` : '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Location</p><p className="font-medium text-gray-900">{[viewItem.data.area, viewItem.data.city].filter(Boolean).join(', ') || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Published</p><p className="font-medium text-gray-900">{viewItem.data.isPublished ? 'Yes' : 'No'}</p></div>
                    <div><p className="text-gray-500 text-xs">Payment</p><p className="font-medium text-gray-900 capitalize">{viewItem.data.paymentStatus || 'pending'}</p></div>
                    <div><p className="text-gray-500 text-xs">Contact Phone</p><p className="font-medium text-gray-900">{viewItem.data.contactPhone || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Contact Email</p><p className="font-medium text-gray-900 break-all">{viewItem.data.contactEmail || '—'}</p></div>
                  </div>
                  {viewItem.data.description && <div><p className="text-gray-500 text-xs mb-1">Description</p><p className="text-gray-900 whitespace-pre-wrap">{viewItem.data.description}</p></div>}
                </div>
              ) : viewItem.type === 'job' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2"><p className="text-gray-500 text-xs">Title</p><p className="font-medium text-gray-900">{viewItem.data.title || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Company</p><p className="font-medium text-gray-900">{viewItem.data.company || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Location</p><p className="font-medium text-gray-900">{viewItem.data.location || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Type</p><p className="font-medium text-gray-900">{viewItem.data.type || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Category</p><p className="font-medium text-gray-900">{viewItem.data.category || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Status</p><p className="font-medium text-gray-900 capitalize">{viewItem.data.status} {viewItem.data.isPublished ? '(published)' : ''}</p></div>
                    <div className="sm:col-span-2"><p className="text-gray-500 text-xs">Apply Email</p><p className="font-medium text-gray-900 break-all">{viewItem.data.applyEmail || '—'}</p></div>
                    <div className="sm:col-span-2"><p className="text-gray-500 text-xs">Apply URL</p><p className="font-medium text-gray-900 break-all">{viewItem.data.applyUrl || '—'}</p></div>
                  </div>
                  {viewItem.data.description && <div><p className="text-gray-500 text-xs mb-1">Description</p><p className="text-gray-900 whitespace-pre-wrap">{viewItem.data.description}</p></div>}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2"><p className="text-gray-500 text-xs">Company</p><p className="font-medium text-gray-900">{viewItem.data.companyName || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Contact</p><p className="font-medium text-gray-900">{viewItem.data.contactName || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Email</p><p className="font-medium text-gray-900 break-all">{viewItem.data.contactEmail || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Phone</p><p className="font-medium text-gray-900">{viewItem.data.contactPhone || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Plan</p><p className="font-medium text-gray-900 capitalize">{viewItem.data.plan || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Amount</p><p className="font-medium text-gray-900">{Number(viewItem.data.amount || 0).toLocaleString()} {viewItem.data.currency || 'RWF'}</p></div>
                    <div><p className="text-gray-500 text-xs">Payment</p><p className="font-medium text-gray-900 capitalize">{viewItem.data.paymentStatus || '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Status</p><p className="font-medium text-gray-900 capitalize">{viewItem.data.status} {viewItem.data.isActive ? '(active)' : ''}</p></div>
                    <div><p className="text-gray-500 text-xs">Starts</p><p className="font-medium text-gray-900">{viewItem.data.startsAt ? new Date(viewItem.data.startsAt).toLocaleString() : '—'}</p></div>
                    <div><p className="text-gray-500 text-xs">Expires</p><p className="font-medium text-gray-900">{viewItem.data.expiresAt ? new Date(viewItem.data.expiresAt).toLocaleString() : '—'}</p></div>
                    <div className="sm:col-span-2"><p className="text-gray-500 text-xs">Target URL</p><p className="font-medium text-gray-900 break-all">{viewItem.data.targetUrl || '—'}</p></div>
                    <div className="sm:col-span-2"><p className="text-gray-500 text-xs">Title</p><p className="font-medium text-gray-900">{viewItem.data.title || '—'}</p></div>
                  </div>
                  {viewItem.data.description && <div><p className="text-gray-500 text-xs mb-1">Description</p><p className="text-gray-900 whitespace-pre-wrap">{viewItem.data.description}</p></div>}
                  {(viewItem.data.images?.length || viewItem.data.imageUrl) && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Images</p>
                      <div className="flex flex-wrap gap-2">
                        {(viewItem.data.images?.length ? viewItem.data.images : [viewItem.data.imageUrl]).filter(Boolean).map((src, i) => {
                          const url = src.startsWith('http') ? src : `http://localhost:5000${src}`;
                          return <a key={i} href={url} target="_blank" rel="noreferrer"><img src={url} alt="" className="h-20 w-28 object-cover rounded border border-gray-200" /></a>;
                        })}
                      </div>
                    </div>
                  )}
                  {(viewItem.data.videoLinks || []).length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Video Links</p>
                      <ul className="space-y-1">
                        {viewItem.data.videoLinks.map((link, i) => (
                          <li key={i}><a href={link} target="_blank" rel="noreferrer" className="text-green-700 hover:underline break-all">{link}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
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

export default AdminDashboard;