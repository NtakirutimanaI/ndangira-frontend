import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Sparkles, Phone, X, Send, MessageSquare } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const CHATBOT_RESPONSES = {
  en: {
    greeting: "Hello! I'm Isange AI Assistant. How can I help?",
    menu: "I can help with:\n• Properties (houses, plots, materials)\n• Jobs search\n• Advertising\n• 10% commission model\n• Payment methods\n• Contact support",
    property: "Owners list FREE. Buyers/renters pay 10% on top. Types: Houses, Cars, Plots, Materials.",
    jobs: "Employers post jobs (5,000 RWF). Isange adds 10% for applicants. Admin approves.",
    advertise: "Ads from 5,000 RWF/month, year, or custom. Images, videos, links. Admin approves.",
    commission: "Owners set price. Platform adds 10% for buyers. Owner contact hidden, platform shown.",
    payment: "MTN MoMo, Airtel Money, Bank Transfer, Card. Admin verifies before publishing.",
    contact: "WhatsApp: +250 787 832 490\nEmail: info@isange.com\nKigali, Nyarugenge, Rwanda",
    default: "Ask me about properties, jobs, ads, or how Isange works."
  },
  rw: {
    greeting: "Muraho! Nd'umufasha w'Isange AI. Nkushobora kugufasha iki?",
    menu: "Nkushobora kugufasha:\n• Imitungo (amazu, ibibanza, ibikoresho)\n• Imirimo\n• Amatangazo\n• Gahunda yo 10%\n• Kwishyura\n• Vugana n'ubufasha",
    property: "Ba nyir'imitungo batangaza ntibishyura. Abaguzi bishyura 10%. Ubwoko: Amazu, Imodoka, Ibibanza, Ibikoresho.",
    jobs: "Abakozi batangaza (5,000 RWF). Isange iyongera 10%. Ubuyobozi bwemeza.",
    advertise: "Amatangazo tangura 5,000 RWF/ukwezi, umwaka, cyangwa igihe kingana. Ubuyobozi bwemeza.",
    commission: "Ba nyir'imitungo bashyira igiciro. Isange iyongera 10%. Amakuru ya nyirayo yarahishwe.",
    payment: "MTN MoMo, Airtel Money, Banki, Ikarita. Ubuyobozi bugenzura ubwishyu.",
    contact: "WhatsApp: +250 787 832 490\nImeyili: info@isange.com\nKigali, Nyarugenge, Rwanda",
    default: "Mbuze ibyo biri ku mitungo, imirimo, amatangazo, cyangwa uwo Isange bikora."
  }
};

const DraggableModal = ({ isOpen, onClose, children, title, buttonRef }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const modalWidth = 320;
      const modalHeight = 400;
      
      // Position above the button, aligned to right edge
      let x = btnRect.right - modalWidth;
      let y = btnRect.top - modalHeight - 10;
      
      // Keep within viewport
      x = Math.max(10, Math.min(window.innerWidth - modalWidth - 10, x));
      y = Math.max(10, Math.min(window.innerHeight - modalHeight - 10, y));
      
      setPosition({ x, y });
    }
  }, [isOpen, buttonRef]);

  const handleMouseDown = (e) => {
    if (e.target.closest('button, a, input')) return;
    setIsDragging(true);
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      const modalWidth = 320;
      const modalHeight = 400;
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;
      newX = Math.max(10, Math.min(window.innerWidth - modalWidth - 10, newX));
      newY = Math.max(10, Math.min(window.innerHeight - modalHeight - 10, newY));
      setPosition({ x: newX, y: newY });
    };

    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed z-50 transition-all duration-150"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: 'calc(100vw - 20px)',
        maxWidth: '320px',
        maxHeight: 'calc(100vh - 20px)'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        <div className="bg-orange-500 text-white p-3 rounded-t-xl flex items-center justify-between cursor-move select-none touch-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="font-semibold text-sm">{title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const WhatsAppModal = ({ isOpen, onClose, buttonRef }) => {
  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      buttonRef={buttonRef}
      title="WhatsApp Support"
    >
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-600">Contact us directly on WhatsApp for quick support.</p>
        <a
          href="https://wa.me/250787832490?text=Hello%20Isange%2C%20I%20need%20support."
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#25D366] text-white text-center py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#1DB954] transition"
        >
          Open WhatsApp
        </a>
      </div>
    </DraggableModal>
  );
};

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const chatbotBtnRef = useRef(null);
  const whatsappBtnRef = useRef(null);
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
    'Properties', 'Jobs', 'Ads', '10% fee', 'Payment', 'Contact'
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes slide-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-slide-in { animation: slide-in 0.2s ease-out; }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
        <button
          ref={chatbotBtnRef}
          onClick={() => setShowChatbot(true)}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
          title="AI Assistant"
          aria-label="AI Assistant"
        >
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        <button
          ref={whatsappBtnRef}
          onClick={() => setShowWhatsApp(true)}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1DB954] transition-all hover:scale-105 active:scale-95"
          title="WhatsApp Support"
          aria-label="WhatsApp Support"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        )}
      </div>

      <ChatbotModal
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        buttonRef={chatbotBtnRef}
        messages={messages}
        input={input}
        setInput={setInput}
        isTyping={isTyping}
        handleSend={handleSend}
        handleKeyPress={handleKeyPress}
        quickReplies={quickReplies}
        messagesEndRef={messagesEndRef}
        lang={lang}
      />

      <WhatsAppModal
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        buttonRef={whatsappBtnRef}
      />
    </>
  );
};

const ChatbotModal = ({ isOpen, onClose, buttonRef, messages, input, setInput, isTyping, handleSend, handleKeyPress, quickReplies, messagesEndRef, lang }) => {
  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      buttonRef={buttonRef}
      title="Isange AI"
    >
      <div className="flex-1 overflow-y-auto p-3 space-y-2" ref={messagesEndRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => { setInput(reply); handleSend(); }}
              className="px-2.5 py-1 text-[11px] bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition whitespace-nowrap"
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
            placeholder="Type..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </DraggableModal>
  );
};

export default FloatingActions;