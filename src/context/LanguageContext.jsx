import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const getInitial = () => {
  const saved = localStorage.getItem('lang');
  return saved === 'rw' || saved === 'en' ? saved : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(getInitial);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => (key, vars) => {
    const dict = translations[lang] || translations.en;
    let value = dict[key] ?? translations.en[key] ?? key;
    if (vars && typeof value === 'string') {
      Object.entries(vars).forEach(([k, v]) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return value;
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === 'en' ? 'rw' : 'en'));

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
