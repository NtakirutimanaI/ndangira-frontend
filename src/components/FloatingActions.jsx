import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Sparkles, Phone, X, Send, MessageSquare } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const CHATBOT_RESPONSES = {
  en: {
    greeting: "Hello! I'm Isange AI Assistant. How can I help you today?",
    menu: "I can help you with:\n• Finding properties (houses, plots, materials)\n• Searching for jobs\n• Advertising on Isange\n• Understanding our 10% commission model\n• Payment methods\n• Contacting support",
    property: "Isange connects property owners with buyers/renters. Owners list for FREE. Buyers/renters pay 10% commission on top of the listed price. Property types: Houses, Cars, Plots, Materials.",
    jobs: "Employers post jobs (5,000 RWF fee). Isange adds 10% fee shown to applicants. Admin approves before publishing on /jobs page.",
    advertise: "Ads start from 5,000 RWF/month, year, or custom period. Add images, videos, links. Admin approves after payment verification.",
    commission: "Our model: Property owners set their price. Platform adds 10% for buyers/renters. Owner contact hidden, platform contact shown. No upfront fees for owners.",
    payment: "Payment methods: MTN MoMo, Airtel Money, Bank Transfer, Card. Admin verifies payment before publishing.",
    contact: "WhatsApp: +250 787 832 490\nEmail: info@isange.com\nLocation: Kigali, Nyarugenge, Rwanda",
    default: "I'm here to help! Ask me about properties, jobs, ads, or how Isange works."
  },
  rw: {
    greeting: "Muraho! Nd'umufasha w'Isange AI. Nkushobora kugufasha iki uyu munsi?",
    menu: "Nkushobora kugufasha:\n• Gushakisha imitungo (amazu, ibibanza, ibikoresho)\n• Gushakisha imirimo\n• Gutangaza kuri Isange\n• Gukumbuza gahunda yo 10%\n• Iburyo bwo kwishyura\n• Kuvugana n'ubufasha",
    property: "Isange ihuza ba nyir'imitungo n'abaguzi/abakodesha. Ba nyir'imitungo batangaza ntibishyura. Abaguzi/abakodesha bishyura 10% ku ncuro yikiguzi. Ubwoko: Amazu, Imodoka, Ibibanza, Ibikoresho.",
    jobs: "Abakozi batangaza imirimo (5,000 RWF). Isange iyongera 10% ibonywa na basabiraho. Ubuyobozi bwemeza mbere yo gutangaza kuri /jobs.",
    advertise: "Amatangazo tangura kuri 5,000 RWF/ukwezi, umwaka, cyangwa igihe kingana. Ongeraho amafoto, video, link. Ubuyobozi bwemeza nyuma yo kugenzura ubwishyu.",
    commission: "Gahunda yacu: Ba nyir'imitungo bashyira igiciro cyawe. Isange iyongera 10% ku ba guza/ba kodesha. Amakuru ya nyirayo yarahishwe, ya Isange aragaragara. Nta makungu yambere.",
    payment: "Uburyo bwo kwishyura: MTN MoMo, Airtel Money, Banki, Ikarita. Ubuyobozi bugenzura ubwishyu mbere yo gutangaza.",
    contact: "WhatsApp: +250 787 832 490\nImeyili: info@isange.com\nAho: Kigali, Nyarugenge, Rwanda",
    default: "Ndi hano kugufasha! Mbuze ibyo biri ku mitungo, imirimo, amatangazo, cyangwa uwo Isange bikora."
  }
};

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (showChatbot && messages.length === 0) {
      const responses = lang === 'rw' ? CHATBOT_RESPONSES.rw : CHATBOT_RESPONSES.en;
      setMessages([{ text: responses.greeting, sender: 'bot' }, { text: responses.menu, sender: 'bot' }]);
    }
  }, [showChatbot, lang]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBotResponse = (userInput) => {
    const responses = lang === 'rw' ? CHATBOT_RESPONSES.rw : CHATBOT_RESPONSES.en;
    const input = userInput.toLowerCase();
    
    if (input.includes('property') || input.includes('house') || input.includes('plot') || input.includes('material') || input.includes('mitungo') || input.includes('inzu') || input.includes('ibibanza') || input.includes('ibikoresho')) {
      return responses.property;
    }
    if (input.includes('job') || input.includes('career') || input.includes('work') || input.includes('murimo') || input.includes('akazi')) {
      return responses.jobs;
    }
    if (input.includes('advert') || input.includes('promot') || input.includes('matangazo')) {
      return responses.advertise;
    }
    if (input.includes('commission') || input.includes('fee') || input.includes('10%') || input.includes('komisiyo') || input.includes('gishyura')) {
      return responses.commission;
    }
    if (input.includes('payment') || input.includes('pay') || input.includes('momo') || input.includes('airtel') || input.includes('kwishyura')) {
      return responses.payment;
    }
    if (input.includes('contact') || input.includes('phone') || input.includes('whatsapp') || input.includes('email') || input.includes('vugana') || input.includes('telefone')) {
      return responses.contact;
    }
    return responses.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const quickReplies = lang === 'rw' ? [
    'Imitungo', 'Imirimo', 'Amatangazo', '10%', 'Kwishyura', 'Vugana'
  ] : [
    'Properties', 'Jobs', 'Advertise', '10% fee', 'Payment', 'Contact'
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          onClick={() => setShowChatbot(true)}
          className="w-12 h-12 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-105"
          title="AI Assistant"
          aria-label="AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowChatbot(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full h-[85vh] max-h-[600px] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Isange AI Assistant</p>
                  <p className="text-xs opacity-80">Online</p>
                </div>
              </div>
              <button onClick={() => setShowChatbot(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={messagesEndRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2 mb-2 flex-wrap">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => {
                      setInput(reply);
                      handleSend();
                    }}
                    className="px-3 py-1.5 text-xs bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showWhatsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowWhatsApp(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
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