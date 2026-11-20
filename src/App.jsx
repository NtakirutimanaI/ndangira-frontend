import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Search from './pages/Search';
import Jobs from './pages/Jobs';
import Advertise from './pages/Advertise';
import Login from './pages/Login';
import Register from './pages/Register';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdvertiseBanner from './components/AdvertiseBanner';
import FloatingActions from './components/FloatingActions';

const App = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/admin';
  return (
    <>
      <AdvertiseBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isDashboard && <Footer />}
      {!isDashboard && <FloatingActions />}
    </>
  );
};

export default App;
