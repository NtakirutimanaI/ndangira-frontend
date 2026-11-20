import { useState, useEffect } from 'react';
import { ArrowUp, Sparkles, Phone, X } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
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

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          onClick={() => setShowChatbot(true)}
          className="w-12 h-12 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-105"
          title="AI Assistant"
          aria-label="AI Assistant"
        >
          <Sparkles className="w-6 h-6" />
        </button>

        <button
          onClick={() => setShowWhatsApp(true)}
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

      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">AI Assistant</h3>
              <button onClick={() => setShowChatbot(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Chat with our AI assistant for instant help.</p>
            <a
              href="https://chat.isange.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-orange-500 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition"
            >
              Open AI Chat
            </a>
          </div>
        </div>
      )}

      {showWhatsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">WhatsApp Support</h3>
              <button onClick={() => setShowWhatsApp(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Contact us directly on WhatsApp for quick support.</p>
            <a
              href="https://wa.me/250787832490?text=Hello%20Isange%2C%20I%20need%20support."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-[#1DB954] transition"
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActions;