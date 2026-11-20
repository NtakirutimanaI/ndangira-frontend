import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Sparkles, Phone, X, Send, MessageSquare } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const INTENTS = {
  property: { keywords: ['property','properties','house','houses','home','homes','apartment','apartments','plot','plots','land','lands','material','materials','cement','steel','building','mitungo','inzu','amazu','apartmenti','ibibanza','ikibanza','ibikoresho','simiti','inyuma','kwubaka','gushakisha','gukura','kugura','kwita','rent','renting','buy','buying','sale','sell','selling','for sale','for rent','kugurisha','gukodesha','kwishyura','igiciro','price','prices','expensive','cheap','kigali','nyarugenge','gasabo','kicukiro','ruhango','huye','musanze','rubavu','area','location','address','city','neighborhood','akarere','ahantu','deresi'], patterns: [/how.*(much|cost|price)/i,/what.*(property|house|plot|material)/i,/find.*(house|home|plot|land|property)/i,/looking for/i,/need.*(house|home|plot|land)/i,/shaka.*(inzu|ikibanza|ibikoresho)/i,/ushaka.*(kugura|kwita)/i] },
  jobs: { keywords: ['job','jobs','career','careers','work','employment','vacancy','vacancies','position','positions','hiring','recruit','recruitment','apply','application','murimo','imirimo','akazi','gushakisha akazi','kwita ku murimo','full-time','part-time','contract','internship','intern','salary','wage','company','employer','employee','cv','resume','interview','qualification','skills','experience','degree','diploma','certificate'], patterns: [/find.*job/i,/looking for.*work/i,/need.*job/i,/shakisha.*akazi/i,/ushaka.*murimo/i] },
  advertise: { keywords: ['advertise','advertisement','ad','ads','promote','promotion','marketing','partner','partnership','sponsor','sponsorship','brand','business','matangazo','kwita','gutangaza','ubucuruzi','ikigo','kugenzura','monthly','yearly','annual','subscription','plan','budget','video','image','photo','link','website','social media'], patterns: [/want.*advertise/i,/need.*promotion/i,/promote.*business/i,/gutangaza.*ubucuruzi/i] },
  commission: { keywords: ['commission','fee','fees','charge','charges','cost','costs','price','pricing','percent','percentage','10%','ten percent','platform fee','service fee','komisiyo','gishyura','amafaranga','ikiguzi','icyunguruzwa','who pays','who pay','buyer pays','seller pays','owner pays','client pays','free','free to list','no fee','no cost'], patterns: [/how.*(commission|fee|charge)/i,/what.*(percent|percentage)/i,/who.*pay/i,/free.*list/i,/komisiyo.*(angahe|bangahe)/i,/ni.*nde.*gishyura/i] },
  payment: { keywords: ['payment','pay','paying','paid','payments','momo','mobile money','mtm momo','airtel money','airtel','bank transfer','bank','transfer','card','credit card','debit card','visa','mastercard','cash','online payment','digital payment','kwishyura','gushyura','ubwishyu','imomo','mtn momo','airtel','banki','ikarita','krediti','debiti','verify','verification','confirmed','pending'], patterns: [/how.*pay/i,/payment.*method/i,/which.*payment/i,/accept.*payment/i,/uburyo.*bwo.*kwishyura/i,/shyiraho.*amafaranga/i] },
  contact: { keywords: ['contact','phone','telephone','call','whatsapp','email','mail','address','location','office','support','help','assist','assistance','talk','speak','vugana','telefone','imeyili','kuvugana','ubufasha','gufasha','kigali','nyarugenge','rwanda','visit','come','meet'], patterns: [/how.*contact/i,/phone.*number/i,/email.*address/i,/where.*(located|office)/i,/vugana.*na/i,/telefone.*ya/i] },
  how_it_works: { keywords: ['how','works','work','process','steps','procedure','guide','tutorial','explain','understand','mechanism','system','platform','marketplace','uko','bikora','uburyo','amabwiriza','amahugurwa','igidandazwa'], patterns: [/how.*(work|works)/i,/how.*(use|using)/i,/explain.*(platform|system)/i,/uko.*bikora/i,/sobanura.*urubuga/i] },
  greeting: { keywords: ['hello','hi','hey','good morning','good afternoon','good evening','muraho','mwaramutse','mwiriwe','hi isange','hey isange','thanks','thank you','murakoze','urakoze','bye','goodbye','murabeho'], patterns: [/^(hello|hi|hey|muraho)/i,/^thanks/i,/^murakoze/i] }
};

const RESPONSES = {
  en: { property:"🏠 **Properties on Isange:**\n• Owners list for **FREE** — no upfront fees\n• Buyers/renters pay **10% commission** on top of the listed price\n• Types: **Houses, Cars, Plots, Materials**\n• Search by location, type, transaction (sale/rent), condition (new/used)\n• Direct contact with platform (owner contacts hidden)\n\n🔍 Use the Search page to filter by your needs!", jobs:"💼 **Jobs on Isange:**\n• Employers post jobs for **5,000 RWF**\n• Isange adds **10% fee** shown to applicants\n• Admin reviews & approves before publishing\n• Types: Full-time, Part-time, Contract, Internship\n• Applications go directly to employer (email/website)\n\n📋 Check /jobs page for current opportunities!", advertise:"📢 **Advertising on Isange:**\n• Plans from **5,000 RWF/month, year, or custom period**\n• Add images, videos (YouTube, TikTok, Instagram), links\n• Admin verifies payment & approves before publishing\n• Appears on Advertise page for all visitors\n\n💼 Great for brand visibility across Rwanda!", commission:"💰 **Our 10% Commission Model:**\n• **Property owners:** Set your price → list FREE → receive your full amount\n• **Buyers/Renters:** See platform price (your price + 10%)\n• **Platform takes 10%** from the buyer/renter side\n• **Owner contacts hidden** — platform contacts shown instead\n• **No hidden fees** — transparent pricing\n\n✅ Win-win: owners get their price, buyers see total upfront!", payment:"💳 **Payment Methods Accepted:**\n• **MTN MoMo** — Mobile Money Rwanda\n• **Airtel Money** — Mobile Money Rwanda\n• **Bank Transfer** — Any Rwanda bank\n• **Debit/Credit Card** — Visa, Mastercard\n\n✅ Admin verifies payment before publishing\n⏱️ Usually instant for MoMo/Card, 1-2 days for bank", contact:"📞 **Contact Isange:**\n• **WhatsApp:** +250 787 832 490 (fastest)\n• **Email:** info@isange.com\n• **Office:** Kigali, Nyarugenge, Rwanda\n• **Hours:** Mon-Fri 8am-6pm, Sat 9am-1pm\n\n💬 Or chat with me here for instant help!", how_it_works:"🔄 **How Isange Works:**\n\n**For Property Owners:**\n1. Register as Owner → 2. Submit property (free) → 3. Admin approves → 4. Buyer/renter pays 10% → 5. You get your price\n\n**For Buyers/Renters:**\n1. Search properties → 2. See platform price (includes 10%) → 3. Contact platform → 4. Connect with owner\n\n**For Job Seekers:**\n1. Browse /jobs → 2. Apply via employer link/email\n\n**For Advertisers:**\n1. Choose plan → 2. Pay → 3. Admin approves → 4. Ad goes live\n\n💡 Simple, transparent, no middleman commissions!", greeting:"Hello! 👋 I'm **Isange AI Assistant**. How can I help you today?\n\nYou can ask me about:\n• 🏠 Properties (houses, plots, materials)\n• 💼 Jobs & careers\n• 📢 Advertising\n• 💰 10% commission model\n• 💳 Payment methods\n• 📞 Contact & support\n\nJust type your question naturally!", default:"I'm here to help! 🤖 Ask me anything about Isange — properties, jobs, ads, payments, or how the platform works. Try questions like:\n• \"How do I list my house?\"\n• \"What's the commission?\"\n• \"How do I pay with MoMo?\"\n• \"Where are you located?\"" },
  rw: { property:"🏠 **Imitungo kuri Isange:**\n• Ba nyir'imitungo batangaza **NTIBISHYURA** — nta makungu\n• Abaguzi/abakodesha bishyura **10%** ku ncuro yikiguzi\n• Ubwoko: **Amazu, Imodoka, Ibibanza, Ibikoresho**\n• Shaka ukurikije aho biherereye, ubwoko, gikorwa (kugura/kodesha), imiterere (gishya/cyarakoreshejwe)\n• Vugana na Isange (amakuru ya nyirayo yarahishwe)\n\n🔍 Koresha Search page kugira ngo ufite ibyo ushaka!", jobs:"💼 **Imirimo kuri Isange:**\n• Abakozi batangaza imirimo kuri **5,000 RWF**\n• Isange iyongera **10%** ibonywa na basabiraho\n• Ubuyobozi burasuzuma bwemeza mbere yo gutangaza\n• Ubwoko: Umwanya wuzuye, igice, amasezerano, imenyeza\n• Gusaba genda ku nyir'akazi (imeyili/website)\n\n📋 Reba /jobs kureba amahirwe ahari ubu!", advertise:"📢 **Gutangaza kuri Isange:**\n• Gahunda tangura kuri **5,000 RWF/ukwezi, umwaka, cyangwa igihe kingana**\n• Ongeraho amafoto, video (YouTube, TikTok, Instagram), link\n• Ubuyobozi bugenzura ubwishyu bwemeza mbere yo gutangaza\n• Bitangazwa ku rupapuro rw'Amatangazo abantu bose babona\n\n💼 Byiza kugira ngo ubucuruzi bwawe bugaragare mu Rwanda hose!", commission:"💰 **Gahunda Yacu yo 10%:**\n• **Ba nyir'imitungo:** Bashyira igiciro cyawe → batangaza ntibishyura → babona amafaranga yawe yose\n• **Abaguzi/Abakodesha:** Babona igiciro cy'isoko (igiciro cyawe + 10%)\n• **Isange ishita 10%** ku ruhande rw'abaguzi/abakodesha\n• **Amakuru ya nyirayo yarahishwe** — ya Isange aragaragara\n• **Nta makungu yambere** — igiciro cyumvikana\n\n✅ Byiza: ba nyir'imitungo babona amafaranga yawe, abaguzi babona igiciro cyose!", payment:"💳 **Uburyo Bwo Kwishyura Bukoreshwa:**\n• **MTN MoMo** — Mobile Money Rwanda\n• **Airtel Money** — Mobile Money Rwanda\n• **Kohereza kuri Banki** — Banki yose mu Rwanda\n• **Ikarita ya Debiti/Krediti** — Visa, Mastercard\n\n✅ Ubuyobozi bugenzura ubwishyu mbere yo gutangaza\n⏱️ Bisanzwe birarangira MoMo/Ikarita, iminsi 1-2 kuri banki", contact:"📞 **Vugana na Isange:**\n• **WhatsApp:** +250 787 832 490 (bihuye cyane)\n• **Imeyili:** info@isange.com\n• **Ibiro:** Kigali, Nyarugenge, Rwanda\n• **Amasaha:** Ku wa mbere-ku wa gatanu 8am-6pm, Ku wa gatandatu 9am-1pm\n\n💬 Cyangwa vugana nanje hano kugira ufasha ibihuye!", how_it_works:"🔄 **Uko Isange Bikora:**\n\n**Ku Ba Nyir'Imitungo:**\n1. Iyandikishe nka Nyir'umutungo → 2. Tangaza umutungo (ntibishyura) → 3. Ubuyobozi bwemeza → 4. Umugura/umukodesha ishura 10% → 5. Waba amafaranga yawe\n\n**Ku Ba Guza/Abakodesha:**\n1. Shaka imitungo → 2. Reba igiciro cy'isoko (kigaragara 10%) → 3. Vugana na Isange → 4. Huza na nyir'umutungo\n\n**Ku Basabiraho Imirimo:**\n1. Reba /jobs → 2. Saba ukoresheje link/imeyili ya nyir'akazi\n\n**Ku Batangiza:**\n1. Hitamo gahunda → 2. Ishyure → 3. Ubuyobozi bwemeza → 4. Itangazo rigaragara\n\n💡 Byoroshye, cyumvikana, nta komisiyo y'umuhuza!", greeting:"Muraho! 👋 Ndi **Umufasha w'Isange AI**. Nkushobora kugufasha iki uyu munsi?\n\nUshobora kumbwira ibyo biri:\n• 🏠 Imitungo (amazu, ibibanza, ibikoresho)\n• 💼 Imirimo n'amahirwe\n• 📢 Amatangazo\n• 💰 Gahunda yo 10%\n• 💳 Uburyo bwo kwishyura\n• 📞 Vugana n'ubufasha\n\nAndika ibibazo byawe mu buryo bwihariye!", default:"Ndi hano kugufasha! 🤖 Mbuze ibyo wabaza ku Isange — imitungo, imirimo, amatangazo, kwishyura, cyangwa uwo rubuga rukora. Gerageza ibibazo nka:\n• \"Nshaka gutangaza inzu yanjye?\"\n• \"Komisiyo ni angahe?\"\n• \"Nishyura ate MoMo?\"\n• \"Muri ahe?\"" }
};

function detectIntent(input, lang) {
  const lower = input.toLowerCase();
  for (const [intent, data] of Object.entries(INTENTS)) {
    for (const pattern of data.patterns) { if (pattern.test(lower)) return intent; }
  }
  let bestIntent = 'default', bestScore = 0;
  for (const [intent, data] of Object.entries(INTENTS)) {
    let score = 0;
    for (const keyword of data.keywords) { if (lower.includes(keyword.toLowerCase())) score += keyword.length; }
    if (score > bestScore) { bestScore = score; bestIntent = intent; }
  }
  if (lower.length < 30 && INTENTS.greeting.keywords.some(k => lower.includes(k))) return 'greeting';
  return bestScore > 0 ? bestIntent : 'default';
}

const Modal = ({ isOpen, onClose, title, children, triggerRef }) => {
  if (!isOpen) return null;

  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    if (triggerRef.current) {
      const btnRect = triggerRef.current.getBoundingClientRect();
      const modalWidth = Math.min(280, window.innerWidth - 20);
      const modalHeight = Math.min(420, window.innerHeight - 20);
      // Position to the left of the button, vertically centered
      let x = btnRect.left - modalWidth - 12;
      let y = btnRect.top + (btnRect.height / 2) - (modalHeight / 2);
      // Clamp to viewport
      x = Math.max(10, Math.min(window.innerWidth - modalWidth - 10, x));
      y = Math.max(10, Math.min(window.innerHeight - modalHeight - 10, y));
      setPosition({ x, y });
    } else {
      setPosition({ x: null, y: null });
    }
  }, [isOpen, triggerRef]);

  const handleMouseDown = (e) => {
    if (e.target.closest('button, a, input, textarea')) return;
    setIsDragging(true);
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  };

  useEffect(() => {
    if (!isOpen) setIsDragging(false);
  }, [isOpen]);

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      const rect = modalRef.current?.getBoundingClientRect();
      if (!rect) return;
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));
      setPosition({ x: newX, y: newY });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging]);

  return (
    <div className="fixed inset-0 z-[60] p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[280px] max-h-[420px] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          left: position.x !== null ? `${position.x}px` : '50%',
          top: position.y !== null ? `${position.y}px` : '50%',
          transform: position.x === null ? 'translate(-50%, -50%)' : 'none',
          animation: 'fade-in 0.2s ease-out',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="bg-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between cursor-move select-none touch-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Sparkles className="w-4 h-4 text-white"/></div>
            <p className="font-semibold text-sm truncate">{title}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition text-white" aria-label="Close">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 min-h-0">{children}</div>
      </div>
    </div>
  );
};

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const chatbotTriggerRef = useRef(null);
  const whatsappTriggerRef = useRef(null);
  const { lang } = useLanguage();

  useEffect(() => { const handleScroll = () => setShowScrollTop(window.scrollY > 200); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);
  useEffect(() => { if (showChatbot && messages.length === 0) { const responses = lang === 'rw' ? RESPONSES.rw : RESPONSES.en; setMessages([{ text: responses.greeting, sender: 'bot' }]); } }, [showChatbot, lang]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleSend = () => { if (!input.trim()) return; const userMessage = input; setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]); setInput(''); setIsTyping(true); setTimeout(() => { const intent = detectIntent(userMessage, lang); const responses = lang === 'rw' ? RESPONSES.rw : RESPONSES.en; const botResponse = responses[intent] || responses.default; setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]); setIsTyping(false); }, 600); };
  const handleKeyPress = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } };
  const quickReplies = lang === 'rw' ? ['Imitungo','Imirimo','Amatangazo','10%','Kwishyura','Vugana'] : ['Properties','Jobs','Ads','10% fee','Payment','Contact'];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
        <button ref={chatbotTriggerRef} onClick={() => { setShowWhatsApp(false); setShowChatbot(true); }} className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-105 active:scale-95" title="AI Assistant" aria-label="AI Assistant"><MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></button>
        <button ref={whatsappTriggerRef} onClick={() => { setShowChatbot(false); setShowWhatsApp(true); }} className="w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1DB954] transition-all hover:scale-105 active:scale-95" title="WhatsApp Support" aria-label="WhatsApp Support"><Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></button>
        {showScrollTop && <button onClick={scrollToTop} className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-105 active:scale-95" title="Back to Top" aria-label="Back to Top"><ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></button>}
      </div>

      <Modal isOpen={showChatbot} onClose={() => setShowChatbot(false)} title="Isange AI" triggerRef={chatbotTriggerRef}>
        <div className="space-y-2" ref={messagesContainerRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && <div className="flex justify-start"><div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-2xl rounded-bl-none"><div className="flex gap-1"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/></div></div></div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex gap-1.5 mb-2 flex-wrap">{quickReplies.map(reply => <button key={reply} onClick={()=>{setInput(reply);handleSend();}} className="px-2.5 py-1 text-[11px] bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition whitespace-nowrap">{reply}</button>)}</div>
          <div className="flex gap-2"><input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Type..." className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /><button type="button" onClick={handleSend} disabled={!input.trim()||isTyping} className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-50"><Send className="w-4 h-4 text-white"/></button></div>
        </div>
      </Modal>

      <Modal isOpen={showWhatsApp} onClose={() => setShowWhatsApp(false)} title="WhatsApp Support">
        <div className="space-y-3"><p className="text-sm text-gray-600">Contact us directly on WhatsApp for quick support.</p><a href="https://wa.me/250787832490?text=Hello%20Isange%2C%20I%20need%20support." target="_blank" rel="noopener noreferrer" className="block w-full bg-[#25D366] text-white text-center py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#1DB954] transition">Open WhatsApp</a></div>
      </Modal>
    </>
  );
};

export default FloatingActions;