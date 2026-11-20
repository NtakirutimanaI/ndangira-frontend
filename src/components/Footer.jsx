import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, Building2, Shield, CheckCircle2, Facebook, Twitter, Instagram, Linkedin } from './icons';
import { useLanguage } from '../context/LanguageContext';

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/isange', Icon: Facebook, className: 'bg-[#1877F2] hover:bg-[#166FE5] text-white' },
  { label: 'X (Twitter)', href: 'https://twitter.com/isange', Icon: Twitter, className: 'bg-black hover:bg-neutral-800 text-white' },
  { label: 'Instagram', href: 'https://instagram.com/isange', Icon: Instagram, className: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4] hover:brightness-110 text-white' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/isange', Icon: Linkedin, className: 'bg-[#0A66C2] hover:bg-[#004182] text-white' },
];

const Footer = () => {
  const { t } = useLanguage();
  const footerLinks = {
    company: [
      { label: t('footer.about'), href: '/about' },
      { label: t('footer.howItWorks'), href: '/how-it-works' },
      { label: t('footer.blog'), href: '/blog' },
    ],
    forOwners: [
      { label: t('footer.publishProperty'), href: '/dashboard' },
      { label: t('footer.plans'), href: '/subscribe' },
      { label: t('footer.dashboard'), href: '/dashboard' },
    ],
    forClients: [
      { label: t('footer.search'), href: '/search' },
      { label: t('footer.listings'), href: '/listings' },
      { label: t('footer.rentHouse'), href: '/search?type=house&category=rent' },
    ],
    support: [
      { label: t('footer.help'), href: '/help' },
      { label: t('footer.contact'), href: '/contact' },
      { label: t('footer.faq'), href: '/faq' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
<div className="flex items-center mb-3">
              <img src="/isange.png" alt="Isange - Aho ibyo ukeneye bihurira" className="h-12 w-auto max-w-[170px] object-contain" />
            </div>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label} className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110 ${s.className}`}>
                  <s.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-3">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.href + item.label}>
                  <Link to={item.href} className="text-sm text-gray-300 hover:text-green-400 transition break-words">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-3">{t('footer.forOwners')}</h4>
            <ul className="space-y-2">
              {footerLinks.forOwners.map((item) => (
                <li key={item.href + item.label}>
                  <Link to={item.href} className="text-sm text-gray-300 hover:text-green-400 transition break-words">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-3">{t('footer.forClients')}</h4>
            <ul className="space-y-2">
              {footerLinks.forClients.map((item) => (
                <li key={item.href + item.label}>
                  <Link to={item.href} className="text-sm text-gray-300 hover:text-green-400 transition break-words">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-3">{t('footer.support')}</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((item) => (
                <li key={item.href + item.label}>
                  <Link to={item.href} className="text-sm text-gray-300 hover:text-green-400 transition break-words">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t('footer.contactUs')}</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>KG 123 St, Nyarugunga, Kigali, Rwanda</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href="tel:+250788000000" className="hover:text-green-400 transition break-all">+250 788 000 000</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href="mailto:info@isange.com" className="hover:text-green-400 transition break-all">info@isange.com</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t('footer.platformFacts')}</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                  <span>{t('footer.noCommission')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                  <span>{t('footer.verifiedListings')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                  <span>{t('footer.propertyTypes')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                  <span>{t('footer.servingRwanda')}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t('footer.subscriptionPlans')}</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">●</span>
                  <span>{t('footer.planPerProperty')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">●</span>
                  <span>{t('footer.planUnlimited')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400 text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} Isange by MAKE IT SOLUTIONS Ltd. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/privacy" className="hover:text-green-400 transition">{t('footer.privacy')}</Link>
                <Link to="/terms" className="hover:text-green-400 transition">{t('footer.terms')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
