import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Car, Home as HomeIcon, DollarSign, MapPin, Search } from 'lucide-react';

const categories = [
  { key: 'house', label: 'Houses', icon: <HomeIcon className="h-5 w-5" />, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { key: 'car', label: 'Cars', icon: <Car className="h-5 w-5" />, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { key: 'plot', label: 'Plots', icon: <Building2 className="h-5 w-5" />, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  { key: 'material', label: 'Materials', icon: <DollarSign className="h-5 w-5" />, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
];

const heroSlides = [
  { type: 'video', src: 'https://videos.pexels.com/video-files/2103099/2103099-hd_1920_1080_30fps.mp4', alt: 'Cars moving on the road' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80', alt: 'Modern house for rent or sale' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80', alt: 'Plot of land for sale' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80', alt: 'Machinery and equipment for rent or sale' },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-4 py-20 text-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          {heroSlides.map((slide, i) => (
            <div key={slide.src} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
              {slide.type === 'video' ? (
                <video className="w-full h-full object-cover" src={slide.src} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                <img className="w-full h-full object-cover" src={slide.src} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} />
              )}
            </div>
          ))}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">Find homes, cars, and plots in Rwanda</h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow">
            Ndangira connects property owners directly with renters and buyers — no middleman commissions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/listings" className="bg-green-600 text-white px-8 py-3 text-lg font-medium hover:bg-green-700 shadow-lg">
              Browse Listings
            </Link>
            <Link to="/register" className="border border-white/80 text-white px-8 py-3 text-lg font-medium hover:bg-white/10 backdrop-blur-sm">
              Join as Owner
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {heroSlides.map((_, i) => (
              <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={() => setCurrent(i)} className={`h-2.5 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white border-t">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search by Category</h2>
            <p className="text-gray-600">Choose what you are looking for</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to={`/search?type=${cat.key}`}
                className="group p-4 border border-gray-200 hover:border-green-500 hover:shadow-sm transition flex flex-col items-center gap-2"
              >
                <div className={`${cat.iconBg} p-2 group-hover:bg-green-600 transition`}>
                  {cat.icon}
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <MapPin className="h-10 w-10 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Search by location</h3>
              <p className="text-gray-600 text-sm">Find properties by area and city across Rwanda.</p>
            </div>
            <div>
              <DollarSign className="h-10 w-10 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Pay 2,000 RWF</h3>
              <p className="text-gray-600 text-sm">Pay per property to publish your listing.</p>
            </div>
            <div>
              <Search className="h-10 w-10 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Direct contact</h3>
              <p className="text-gray-600 text-sm">Contact owners directly via phone or Plot UPI.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
