import { Link } from 'react-router-dom';
import { DollarSign, Phone, Mail, MapPin, Clock, Globe, Building2, Shield, CheckCircle2 } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Blog', href: '/blog' },
  ],
  forOwners: [
    { label: 'Publish Property', href: '/dashboard' },
    { label: 'Plans', href: '/subscribe' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  forClients: [
    { label: 'Search', href: '/search' },
    { label: 'Listings', href: '/listings' },
    { label: 'Rent House', href: '/search?type=house&category=rent' },
  ],
  support: [
    { label: 'Help', href: '/help' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
};

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/ndangira' },
  { label: 'Twitter', href: 'https://twitter.com/ndangira' },
  { label: 'Instagram', href: 'https://instagram.com/ndangira' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/ndangira' },
];

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="max-w-[150px]">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="text-lg font-bold text-white">Ndangira</span>
          </div>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Rwanda property marketplace connecting owners directly with renters and buyers.
          </p>
          <div className="flex gap-2">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded bg-gray-800 flex items-center justify-center text-xs text-gray-400 hover:text-white hover:bg-green-600 transition">
                {s.label[0]}
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-[150px]">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Company</h4>
          <ul className="space-y-1">
            {footerLinks.company.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="text-xs text-gray-400 hover:text-green-400 transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-[150px]">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">For Property Owners</h4>
          <ul className="space-y-1">
            {footerLinks.forOwners.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="text-xs text-gray-400 hover:text-green-400 transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-[150px]">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">For Clients</h4>
          <ul className="space-y-1">
            {footerLinks.forClients.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="text-xs text-gray-400 hover:text-green-400 transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-[150px]">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Support</h4>
          <ul className="space-y-1">
            {footerLinks.support.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="text-xs text-gray-400 hover:text-green-400 transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="max-w-[200px]">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Contact Us</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex items-start gap-1">
                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                <span>KG 123 St, Nyarugunga, Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 shrink-0" />
                <a href="tel:+250788000000" className="hover:text-green-400 transition">+250 788 000 000</a>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 shrink-0" />
                <a href="mailto:info@ndangira.com" className="hover:text-green-400 transition">info@ndangira.com</a>
              </div>
            </div>
          </div>

          <div className="max-w-[200px]">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Platform Facts</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex items-start gap-1">
                <Shield className="h-3 w-3 mt-0.5 shrink-0 text-green-500" />
                <span>No commission charges</span>
              </div>
              <div className="flex items-start gap-1">
                <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-green-500" />
                <span>Admin-verified listings</span>
              </div>
              <div className="flex items-start gap-1">
                <Building2 className="h-3 w-3 shrink-0 text-green-500" />
                <span>Houses, Cars, Plots, Materials</span>
              </div>
              <div className="flex items-start gap-1">
                <Globe className="h-3 w-3 shrink-0 text-green-500" />
                <span>Serving all Rwanda</span>
              </div>
            </div>
          </div>

          <div className="max-w-[200px]">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Subscription Plans</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex items-start gap-1">
                <span className="text-green-500">●</span>
                <span>2,000 RWF - Per property</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-green-500">●</span>
                <span>10,000 RWF - Unlimited (30 days)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Ndangira by MAKE IT SOLUTIONS Ltd.</p>
            <div className="flex gap-3">
              <Link to="/privacy" className="hover:text-green-400 transition">Privacy</Link>
              <Link to="/terms" className="hover:text-green-400 transition">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
