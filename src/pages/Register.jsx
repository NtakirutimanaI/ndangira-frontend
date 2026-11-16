import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Alert } from '../components/Alert';
import { Mail, Phone, Eye, EyeOff, Lock, User, X } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'owner' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const close = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || t('register.failed'));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={close} role="dialog" aria-modal="true" aria-label={t('register.title')}>
      <div className="relative w-full max-w-md my-auto" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-gray-600 hover:text-gray-900 shadow-lg border border-gray-200 flex items-center justify-center" aria-label={t('jobs.close')}>
          <X className="h-4 w-4" />
        </button>
        <div className="overflow-y-auto rounded-2xl shadow-2xl border border-white/60 bg-white max-h-[90vh]">
          <div className="p-6 sm:p-7 lg:p-8 flex flex-col">
            <div className="mb-4 flex justify-center">
              <Link to="/" onClick={close} className="inline-flex items-center">
                <img src="/ndangira-logo.png" alt="Ndangira Real Estate" className="h-10 sm:h-12 w-auto" />
              </Link>
            </div>
            <div className="mb-5">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1.5">{t('register.getStarted')}</p>
              <h1 className="text-2xl font-bold text-gray-900">{t('register.createAccount')}</h1>
              <p className="text-gray-500 mt-1 text-sm">{t('register.subtitle')}</p>
            </div>
            {error && <Alert message={error} />}
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.fullName')}</label>
                <div className="relative">
                  <User className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('register.fullNamePlaceholder')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder={t('register.createPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition"
                      aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.phone')}</label>
                  <div className="relative">
                    <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder={t('register.phonePlaceholder')}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.role')}</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="owner">{t('register.owner')}</option>
                  <option value="client">{t('register.client')}</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md shadow-green-600/20 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition">
                {t('register.submit')}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-gray-600">
              {t('register.haveAccount')}{' '}
              <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline">{t('register.signIn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


