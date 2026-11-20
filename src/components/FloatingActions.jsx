import { useState, useEffect } from 'react';
import { ArrowUp, Sparkles, Phone } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const phone = '+250787832490';
    const message = encodeURIComponent('Hello Isange, I need support.');
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${message}`, '_blank');
  };

  const openChatbot = () => {
    window.open('https://chat.isange.com', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <button
        onClick={openChatbot}
        className="w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-all hover:scale-105"
        title="AI Assistant"
        aria-label="AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      <button
        onClick={openWhatsApp}
        className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1DB954] transition-all hover:scale-105"
        title="WhatsApp Support"
        aria-label="WhatsApp Support"
      >
        <Phone className="w-6 h-6" />
      </button>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-105"
          title="Back to Top"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingActions;