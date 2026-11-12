import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Home, Search, LogOut, Shield, Building2, Menu, X, Briefcase, Megaphone } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwnerOrAdmin = user && (user.role === 'owner' || user.role === 'admin');
  const close = () => setMenuOpen(false);

  const navLink = (to, label) => (
    <Link to={to} onClick={close} className={location.pathname === to ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-gray-900'}>
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={close} className="flex items-center gap-2">
            <DollarSign className="h-7 w-7 text-green-600" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Ndangira</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLink('/', 'Home')}
            {navLink('/listings', 'Listings')}
            {navLink('/search', 'Search')}
            {navLink('/jobs', 'Jobs')}
            <Link to="/advertise" onClick={close} className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-700">Advertise Here</Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  {isOwnerOrAdmin && (
                    <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                      <Building2 className="h-4 w-4" /> My Properties
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                      <Shield className="h-4 w-4" /> Admin
                    </Link>
                  )}
                  <button onClick={logout} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
                  <Link to="/register" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700">Join</Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
            <div className="flex flex-col gap-2 pb-3 border-b border-gray-100">
              <Link to="/" onClick={close} className={`flex items-center gap-2 py-1 ${location.pathname === '/' ? 'text-green-600 font-medium' : 'text-gray-700'}`}><Home className="h-4 w-4" /> Home</Link>
              <Link to="/listings" onClick={close} className={`flex items-center gap-2 py-1 ${location.pathname === '/listings' ? 'text-green-600 font-medium' : 'text-gray-700'}`}><Building2 className="h-4 w-4" /> Listings</Link>
              <Link to="/search" onClick={close} className={`flex items-center gap-2 py-1 ${location.pathname === '/search' ? 'text-green-600 font-medium' : 'text-gray-700'}`}><Search className="h-4 w-4" /> Search</Link>
              <Link to="/jobs" onClick={close} className={`flex items-center gap-2 py-1 ${location.pathname === '/jobs' ? 'text-green-600 font-medium' : 'text-gray-700'}`}><Briefcase className="h-4 w-4" /> Jobs</Link>
              <Link to="/advertise" onClick={close} className="inline-flex items-center gap-2 py-2 px-3 rounded bg-green-600 text-white font-medium hover:bg-green-700"><Megaphone className="h-4 w-4" /> Advertise Here</Link>
            </div>
            {user ? (
              <div className="flex flex-col gap-2">
                {isOwnerOrAdmin && (
                  <Link to="/dashboard" onClick={close} className="flex items-center gap-2 py-1 text-gray-700 hover:text-gray-900">
                    <Building2 className="h-4 w-4" /> My Properties
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={close} className="flex items-center gap-2 py-1 text-gray-700 hover:text-gray-900">
                    <Shield className="h-4 w-4" /> Admin
                  </Link>
                )}
                <button onClick={() => { logout(); close(); }} className="flex items-center gap-2 py-1 text-left text-gray-700 hover:text-gray-900">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={close} className="py-1 text-gray-700">Login</Link>
                <Link to="/register" onClick={close} className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Join</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
