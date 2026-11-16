import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Alert } from '../components/Alert';
import { DollarSign, CreditCard, CheckCircle, Smartphone, Building, Landmark } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const Subscribe = () => {
  const [type, setType] = useState('per-property');
  const [method, setMethod] = useState('momo');
  const [status, setStatus] = useState(null);
  const { user, login } = useAuth();
  const { t } = useLanguage();

  const options = [
    { value: 'per-property', label: t('subscribe.perProperty'), amount: 2000, desc: t('subscribe.perPropertyDesc') },
    { value: 'unlimited', label: t('subscribe.unlimited'), amount: 10000, desc: t('subscribe.unlimitedDesc') },
  ];

  const methods = [
    { value: 'momo', label: t('subscribe.momo'), icon: Smartphone, hint: t('subscribe.momoHint') },
    { value: 'airtel', label: t('subscribe.airtel'), icon: Smartphone, hint: t('subscribe.airtelHint') },
    { value: 'bank', label: t('subscribe.bank'), icon: Landmark, hint: t('subscribe.bankHint') },
    { value: 'card', label: t('subscribe.card'), icon: CreditCard, hint: t('subscribe.cardHint') },
  ];

  const initiate = async () => {
    setStatus(null);
    try {
      const res = await api.post('/payments/initiate', { type, method });
      setStatus({ type: 'pending', paymentId: res.data.data.paymentId, amount: res.data.data.amount, method: res.data.data.method || method });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || t('subscribe.failInit') });
    }
  };

  const confirm = async (paymentId) => {
    try {
      await api.post('/payments/verify', { paymentId, status: 'completed' });
      setStatus({ type: 'success', message: t('subscribe.success') });
      if (user) {
        const updatedUser = { ...user, subscriptionType: type, subscriptionActive: type === 'unlimited' };
        login(localStorage.getItem('token'), updatedUser);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || t('subscribe.failVerify') });
    }
  };

  const selectedMethod = methods.find((m) => m.value === method) || methods[0];
  const SelectedIcon = selectedMethod.icon;
  const channelLabel = t(`subscribe.channel.${method}`) || selectedMethod.label;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('subscribe.title')}</h1>
        <p className="text-gray-600 mb-8">{t('subscribe.subtitle')}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {options.map((o) => (
            <button key={o.value} type="button" onClick={() => setType(o.value)} className={`p-6 rounded-xl border text-left hover:ring-2 hover:ring-green-500 transition ${type === o.value ? 'bg-green-50 border-green-600' : 'bg-white border-gray-200'}`}>
              <DollarSign className="h-6 w-6 mb-3 text-green-600" />
              <h3 className="font-bold text-gray-900">{o.label}</h3>
              <p className="text-sm text-gray-500 mb-2">{o.desc}</p>
              <p className="text-lg font-semibold text-green-700">{o.amount.toLocaleString()} RWF</p>
            </button>
          ))}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4">{t('subscribe.chooseMethod')}</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {methods.map((m) => {
              const Icon = m.icon;
              return (
                <button key={m.value} type="button" onClick={() => setMethod(m.value)} className={`p-4 rounded-lg border text-left flex items-start gap-3 transition ${method === m.value ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <Icon className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.hint}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <SelectedIcon className="h-5 w-5 text-green-600" />
            <span className="text-gray-700">
              {t('subscribe.payVia', { amount: type === 'per-property' ? '2,000' : '10,000', method: selectedMethod.label }).replace('<strong>', '').replace('</strong>', '').replace('<strong>', '').replace('</strong>', '')}
            </span>
          </div>

          <button onClick={initiate} className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50" disabled={status?.type === 'pending'}>
            {status?.type === 'pending' ? t('subscribe.initiatedBtn') : t('subscribe.proceed')}
          </button>

          {status && status.type === 'pending' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 space-y-2">
              <p><strong>{t('subscribe.initiated')}</strong> ({t('subscribe.ref')}: {status.paymentId}) {t('subscribe.via')} {selectedMethod.label}.</p>
              <p>{t('subscribe.completeOn', { channel: channelLabel })}</p>
              <button onClick={() => confirm(status.paymentId)} className="inline-flex items-center gap-2 mt-1 bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">
                <CheckCircle className="h-4 w-4" /> {t('subscribe.confirmPaid')}
              </button>
            </div>
          )}

          {status && status.type === 'success' && (
            <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded flex items-start gap-3 text-green-800">
              <CheckCircle className="h-5 w-5 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}
          {status && status.type === 'error' && <Alert message={status.message} />}
        </div>
      </div>
    </div>
  );
};

export default Subscribe;