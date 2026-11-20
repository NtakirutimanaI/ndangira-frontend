import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUp, Sparkles, Phone, X, Send, MessageSquare, Users, Bell, Search, Home, Briefcase, Megaphone, CreditCard, MapPin, Clock, CheckCircle2 } from '../components/icons';
import { useLanguage } from '../context/LanguageContext';

const INTENTS = {
  property: { 
    keywords: ['property','properties','house','houses','home','homes','apartment','apartments','plot','plots','land','lands','material','materials','cement','steel','building','mitungo','inzu','amazu','apartmenti','ibibanza','ikibanza','ibikoresho','simiti','inyuma','kwubaka','gushakisha','gukura','kugura','kwita','rent','renting','buy','buying','sale','sell','selling','for sale','for rent','kugurisha','gukodesha','kwishyura','igiciro','price','prices','expensive','cheap','kigali','nyarugenge','gasabo','kicukiro','ruhango','huye','musanze','rubavu','area','location','address','city','neighborhood','akarere','ahantu','deresi','buy house','rent house','find house','looking for house','need house','want house','buy plot','rent plot','buy land','rent land','buy apartment','rent apartment','buy car','rent car','buy materials','building materials'],
    patterns: [/how.*(much|cost|price)/i,/what.*(property|house|plot|material|car)/i,/find.*(house|home|plot|land|property|car|apartment)/i,/looking for/i,/need.*(house|home|plot|land|property|car|apartment)/i,/shaka.*(inzu|ikibanza|ibikoresho|imodoka)/i,/ushaka.*(kugura|kwita|kugodesha)/i,/(buy|rent|purchase|lease).* (house|home|plot|land|property|car|apartment)/i]
  },
  jobs: { 
    keywords: ['job','jobs','career','careers','work','employment','vacancy','vacancies','position','positions','hiring','recruit','recruitment','apply','application','murimo','imirimo','akazi','gushakisha akazi','kwita ku murimo','full-time','part-time','contract','internship','intern','salary','wage','company','employer','employee','cv','resume','interview','qualification','skills','experience','degree','diploma','certificate','find job','looking for job','need job','want job','job search','job opening','job opportunity','employment opportunity'],
    patterns: [/find.*job/i,/looking for.*work/i,/need.*job/i,/shakisha.*akazi/i,/ushaka.*murimo/i,/(find|look for|need|want).* (job|work|employment|career)/i,/(job|work|employment).*(search|opening|opportunity)/i]
  },
  advertise: { 
    keywords: ['advertise','advertisement','ad','ads','promote','promotion','marketing','partner','partnership','sponsor','sponsorship','brand','business','matangazo','kwita','gutangaza','ubucuruzi','ikigo','kugenzura','monthly','yearly','annual','subscription','plan','budget','video','image','photo','link','website','social media','advertise business','promote business','marketing plan','advertising plan','run ads','place ad','post ad'],
    patterns: [/want.*advertise/i,/need.*promotion/i,/promote.*business/i,/gutangaza.*ubucuruzi/i,/(advertise|promote|market).*(business|brand|product|service)/i,/(run|place|post).*(ad|advertisement)/i]
  },
  commission: { 
    keywords: ['commission','fee','fees','charge','charges','cost','costs','price','pricing','percent','percentage','10%','ten percent','platform fee','service fee','komisiyo','gishyura','amafaranga','ikiguzi','icyunguruzwa','who pays','who pay','buyer pays','seller pays','owner pays','client pays','free','free to list','no fee','no cost','how much commission','what is commission','commission rate','fee structure','pricing model','how does pricing work'],
    patterns: [/how.*(commission|fee|charge)/i,/what.*(percent|percentage|commission|fee)/i,/who.*pay/i,/free.*list/i,/komisiyo.*(angahe|bangahe)/i,/ni.*nde.*gishyura/i,/(commission|fee|charge).*(structure|model|rate|work)/i]
  },
  payment: { 
    keywords: ['payment','pay','paying','paid','payments','momo','mobile money','mtm momo','airtel money','airtel','bank transfer','bank','transfer','card','credit card','debit card','visa','mastercard','cash','online payment','digital payment','kwishyura','gushyura','ubwishyu','imomo','mtn momo','airtel','banki','ikarita','krediti','debiti','verify','verification','confirmed','pending','how to pay','payment method','payment options','pay with momo','pay with airtel','pay with card','bank transfer'],
    patterns: [/how.*pay/i,/payment.*method/i,/which.*payment/i,/accept.*payment/i,/uburyo.*bwo.*kwishyura/i,/shyiraho.*amafaranga/i,/(pay|payment).*(method|option|way)/i,/(momo|airtel|bank|card).*(payment|pay)/i]
  },
  contact: { 
    keywords: ['contact','phone','telephone','call','whatsapp','email','mail','address','location','office','support','help','assist','assistance','talk','speak','vugana','telefone','imeyili','kuvugana','ubufasha','gufasha','kigali','nyarugenge','rwanda','visit','come','meet','contact us','reach out','get in touch','customer service','support team'],
    patterns: [/how.*contact/i,/phone.*number/i,/email.*address/i,/where.*(located|office)/i,/vugana.*na/i,/telefone.*ya/i,/(contact|reach|touch).*(you|us|support|team)/i]
  },
  how_it_works: { 
    keywords: ['how','works','work','process','steps','procedure','guide','tutorial','explain','understand','mechanism','system','platform','marketplace','uko','bikora','uburyo','amabwiriza','amahugurwa','igidandazwa','how does it work','how it works','how to use','how to list','how to buy','how to rent','how to post','step by step','process works'],
    patterns: [/how.*(work|works)/i,/how.*(use|using)/i,/explain.*(platform|system|process)/i,/uko.*bikora/i,/sobanura.*urubuga/i,/(how|what).*(process|steps|procedure)/i]
  },
  greeting: { 
    keywords: ['hello','hi','hey','good morning','good afternoon','good evening','muraho','mwaramutse','mwiriwe','hi isange','hey isange','thanks','thank you','murakoze','urakoze','bye','goodbye','murabeho','hello isange','hi there','good day'],
    patterns: [/^(hello|hi|hey|muraho)/i,/^thanks/i,/^murakoze/i,/^(hi|hello|hey).*isange/i]
  },
  general_query: { 
    keywords: ['i need','i want','i would like','i am looking','looking for','search','find','help me','can you','could you','please','nshaka','ndashaka','ndabona','ndaba','mfasha','nshakira','help','assist','support','information','info','tell me','show me','guide me'],
    patterns: [/i (need|want|would like|am looking)/i,/looking for/i,/help me/i,/can you|could you/i,/please/i,/nshaka|ndashaka|mfasha/i]
  }
};

const RESPONSES = {
  en: { 
    property:"🏠 **Properties on Isange:**\n• Owners list for **FREE** — no upfront fees\n• Buyers/renters pay **10% commission** on top of the listed price\n• Types: **Houses, Cars, Plots, Materials**\n• Search by location, type, transaction (sale/rent), condition (new/used)\n• Direct contact with platform (owner contacts hidden)\n\n🔍 Use the Search page to filter by your needs!", 
    jobs:"💼 **Jobs on Isange:**\n• Employers post jobs for **5,000 RWF**\n• Isange adds **10% fee** shown to applicants\n• Admin reviews & approves before publishing\n• Types: Full-time, Part-time, Contract, Internship\n• Applications go directly to employer (email/website)\n\n📋 Check /jobs page for current opportunities!", 
    advertise:"📢 **Advertising on Isange:**\n• Plans from **5,000 RWF/month, year, or custom period**\n• Add images, videos (YouTube, TikTok, Instagram), links\n• Admin verifies payment & approves before publishing\n• Appears on Advertise page for all visitors\n\n💼 Great for brand visibility across Rwanda!", 
    commission:"💰 **Our 10% Commission Model:**\n• **Property owners:** Set your price → list FREE → receive your full amount\n• **Buyers/Renters:** See platform price (your price + 10%)\n• **Platform takes 10%** from the buyer/renter side\n• **Owner contacts hidden** — platform contacts shown instead\n• **No hidden fees** — transparent pricing\n\n✅ Win-win: owners get their price, buyers see total upfront!", 
    payment:"💳 **Payment Methods Accepted:**\n• **MTN MoMo** — Mobile Money Rwanda\n• **Airtel Money** — Mobile Money Rwanda\n• **Bank Transfer** — Any Rwanda bank\n• **Debit/Credit Card** — Visa, Mastercard\n\n✅ Admin verifies payment before publishing\n⏱️ Usually instant for MoMo/Card, 1-2 days for bank", 
    contact:"📞 **Contact Isange:**\n• **WhatsApp:** +250 787 832 490 (fastest)\n• **Email:** info@isange.com\n• **Office:** Kigali, Nyarugenge, Rwanda\n• **Hours:** Mon-Fri 8am-6pm, Sat 9am-1pm\n\n💬 Or chat with me here for instant help!", 
    how_it_works:"🔄 **How Isange Works:**\n\n**For Property Owners:**\n1. Create account → Owner dashboard\n2. Add property (min 3 images, price, details)\n3. Submit for review — **FREE to list**\n4. Admin approves → goes live on website\n5. Buyers contact Isange → we connect you\n6. You get your full asking price\n\n**For Buyers/Renters:**\n1. Browse properties on Search page\n2. See platform price (your price + 10%)\n3. Contact Isange via WhatsApp/Email\n4. We arrange viewing & handle process\n\n**For Job Seekers:**\n1. Browse jobs on /jobs page\n2. Apply directly to employer\n\n**For Advertisers:**\n1. Choose plan → submit ad with media\n2. Admin verifies payment → approves\n3. Ad appears on Advertise page", 
    default:"🤖 **I'm Isange AI — here to help!**\n\nI can answer questions about:\n• 🏠 **Properties** — buying, renting, listing\n• 💼 **Jobs** — finding, posting\n• 📢 **Advertising** — plans, placement\n• 💰 **Commission & Fees** — how 10% works\n• 💳 **Payments** — MoMo, Airtel, Bank, Card\n• 📞 **Contact** — WhatsApp, Email, Office\n• 🔄 **How it works** — step by step\n\n**Try asking:**\n• \"How do I list my house for rent?\"\n• \"What payment methods do you accept?\"\n• \"How much is the commission?\"\n• \"I want to advertise my business\"\n• \"Find me a 3-bedroom house in Kigali\"\n\n**Or just type naturally — I understand!** 😊", 
    fallback:"🤔 I want to make sure I give you the right answer. Could you rephrase or tell me more about what you're looking for?\n\nFor example:\n• Are you looking to **buy/rent a property**?\n• Do you want to **post a job or ad**?\n• Need info on **fees, payments, or how it works**?\n\nI'm here to help! 💚" 
  },
  rw: { 
    property:"🏠 **Imitungo kuri Isange:**\n• Ba nyir'imitungo batangaza **NTIBISHYURA** — nta makungu\n• Abaguzi/abakodesha bishyura **10%** ku ncuro yikiguzi\n• Ubwoko: **Amazu, Imodoka, Ibibanza, Ibikoresho**\n• Shaka ukurikije aho biherereye, ubwoko, gikorwa (gukura/gukodesha), imiterere (gishya/cyarakoreshejwe)\n• Vugana na Isange (amakuru ya nyirayo yarahishwe)\n\n🔍 Koresha Search page kugira ngo ufite ibyo ushaka!", 
    jobs:"💼 **Imirimo kuri Isange:**\n• Abakozi batangaza imirimo kuri **5,000 RWF**\n• Isange iyongera **10%** ibonywa na basabiraho\n• Ubuyobozi burasuzuma bwemeza mbere yo gutangaza\n• Ubwoko: Umwanya wuzuye, igice, amasezerano, imenyeza\n• Gusaba genda ku nyir'akazi (imeyili/website)\n\n📋 Reba /jobs kureba amahirwe ahari ubu!", 
    advertise:"📢 **Gutangaza kuri Isange:**\n• Gahunda tangura kuri **5,000 RWF/ukwezi, umwaka, cyangwa igihe kingana**\n• Ongeraho amafoto, video (YouTube, TikTok, Instagram), link\n• Ubuyobozi bugenzura ubwishyu bwemeza mbere yo gutangaza\n• Bitangazwa ku rupapuro rw'Amatangazo abantu bose babona\n\n💼 Byiza kugira ngo ubucuruzi bwawe bugaragare mu Rwanda hose!", 
    commission:"💰 **Gahunda Yacu yo 10%:**\n• **Ba nyir'imitungo:** Bashyira igiciro cyawe → batangaza ntibishyura → babona amafaranga yawe yose\n• **Abaguzi/Abakodesha:** Babona igiciro cy'isoko (igiciro cyawe + 10%)\n• **Isange ishita 10%** ku ruhande rw'abaguzi/abakodesha\n• **Amakuru ya nyirayo yarahishwe** — ya Isange aragaragara\n• **Nta makungu yambere** — igiciro cyumvikana\n\n✅ Byiza: ba nyir'imitungo babona amafaranga yawe, abaguzi babona igiciro cyose!", 
    payment:"💳 **Uburyo Bwo Kwishyura Bukoreshwa:**\n• **MTN MoMo** — Mobile Money Rwanda\n• **Airtel Money** — Mobile Money Rwanda\n• **Kohereza kuri Banki** — Banki yose mu Rwanda\n• **Ikarita ya Debiti/Krediti** — Visa, Mastercard\n\n✅ Ubuyobozi bugenzura ubwishyu mbere yo gutangaza\n⏱️ Bisanzwe birarangira MoMo/Ikarita, iminsi 1-2 kuri banki", 
    contact:"📞 **Vugana na Isange:**\n• **WhatsApp:** +250 787 832 490 (bikomeye)\n• **Email:** info@isange.com\n• **Ofisi:** Kigali, Nyarugenge, Rwanda\n• **Amasaha:** Lundi-Kurwa 8am-6pm, Kuwa gatandatu 9am-1pm\n\n💬 Cyangwa vugana nanje hano kugira ufite ubufasha buhanitse!", 
    how_it_works:"🔄 **Isange Bikora Utyo:**\n\n**Ba Nyir'imitungo:**\n1. Kwiyandikisha → Dashboard ya nyir'imitungo\n2. Ongeraho igitundu (amafoto 3+, igiciro, ibisobanuro)\n3. Ohereza kugenzurwa — **NTIBISHYURA** gutangaza\n4. Ubuyobozi bwemeza → bitangazwa ku rugero\n5. Abaguzi bavugana na Isange → tubahurira\n6. Mubona amafaranga yawe yose y'ikiguzi\n\n**Abaguzi/Abakodesha:**\n1. Shaka imitungo ku Search page\n2. Mubona igiciro cy'isoko (ikiguzi cyawe + 10%)\n3. Vugana na Isange (WhatsApp/Email)\n4. Turangira kureba & tugenzura ibyerekeranye\n\n**Basabiye Imirimo:**\n1. Reba imirimo ku /jobs page\n2. Sabira ku nyir'akazi\n\n**Batangiza:**\n1. Hitamo gahunda → ohereza gitangazo na media\n2. Ubuyobozi bugenzura ubwishyu → bwemeza\n3. Gitangazo gishiraho ku rupapuro rw'Amatangazo", 
    default:"🤖 **Ndi Isange AI — hano kugufasha!**\n\nNakwibagira ibibazo byerekeye:\n• 🏠 **Imitungo** — gukura, gukodesha, gutangaza\n• 💼 **Imirimo** — gushakisha, kwandikisha\n• 📢 **Gutangaza** — gahunda, kugaragaza\n• 💰 **Komisiyo & Amafaranga** — 10% bikora utyo\n• 💳 **Kwishyura** — MoMo, Airtel, Banki, Ikarta\n• 📞 **Vugana** — WhatsApp, Email, Ofisi\n• 🔄 **Ibikora utyo** — hatanu hatanu\n\n**Gera ube:**\n• \"Nshaka gutangaza inzu yanjye gukodesha?\"\n• \"Uburyo bwo kwishyura mbfite ni buhe?\"\n• \"Komisiyo ni angahe?\"\n• \"Nshaka gutangaza ubucuruzi bwanjye\"\n• \"Mfasha nshakire inzu ya n'imirima 3 mu Kigali\"\n\n**Cyangwa andika mu buryo bwiza — Nkumva!** 😊", 
    fallback:"🤔 Nshaka kugira ngo ndabishimire neza. Wiyandike none cyangwa mpa amakuru makuru ku byo ushaka?\n\nUshobora kureba:\n• Ushaka **gukura/gukodesha igitundu**?\n• Ufite ikibazo cy'**imirimo cyangwa amatangazo**?\n• Ufite **komisiyo, kwishyura, cyangwa ibikora utyo**?\n\nNdi hano kugufasha! 💚" 
  }
};

function detectIntent(input, lang) {
  const lower = input.toLowerCase().trim();
  
  // Direct pattern matches first (highest priority)
  for (const [intent, data] of Object.entries(INTENTS)) {
    for (const pattern of data.patterns) { 
      if (pattern.test(lower)) return intent; 
    }
  }

  // Enhanced keyword scoring with weights - more flexible matching
  const scores = {};
  for (const [intent, data] of Object.entries(INTENTS)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        // Weight by keyword specificity (longer = more specific)
        score += keyword.length * 2;
        // Bonus for exact word boundaries
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(lower)) score += 15;
        // Bonus for multi-word phrases
        if (keyword.includes(' ')) score += 20;
      }
    }
    // Context boosters
    if (intent === 'greeting' && lower.length < 30) score += 50;
    if (intent === 'general_query' && (lower.startsWith('i ') || lower.startsWith('can ') || lower.startsWith('could ') || lower.startsWith('please') || lower.startsWith('nshaka') || lower.startsWith('ndashaka') || lower.startsWith('help'))) score += 30;
    scores[intent] = score;
  }

  // Find highest scoring intent
  let bestIntent = 'default', bestScore = 0;
  for (const [intent, score] of Object.entries(scores)) {
    if (score > bestScore) { bestScore = score; bestIntent = intent; }
  }

  // If general_query wins or no strong match, try to infer specific intent from context
  if ((bestIntent === 'general_query' || bestScore < 15) && bestScore > 0) {
    // Check for property-related terms in the query
    const propertyTerms = ['house','home','apartment','plot','land','material','car','vehicle','inzu','ikibanza','ibibanza','imodoka','ibikoresho','gukura','kugura','kwita','kugodesha','kugurisha','buy','rent','purchase','lease','property','properties','mitungo'];
    const jobTerms = ['job','work','career','murimo','akazi','imirimo','employment','vacancy','position','hiring'];
    const adTerms = ['advertise','ad','promote','matangazo','gutangaza','marketing','brand','business'];
    const commissionTerms = ['commission','fee','fees','charge','percent','percentage','10%','komisiyo','gishyura','amafaranga','ikiguzi'];
    const paymentTerms = ['pay','payment','momo','mobile money','bank','card','kwishyura','gushyura','airtel','transfer','visa','mastercard'];
    const contactTerms = ['contact','phone','whatsapp','email','address','vugana','telefone','imeyili','support','help'];
    const howTerms = ['how','process','steps','procedure','guide','tutorial','explain','uko','bikora','uburyo','amabwiriza'];

    if (propertyTerms.some(t => lower.includes(t))) return 'property';
    if (jobTerms.some(t => lower.includes(t))) return 'jobs';
    if (adTerms.some(t => lower.includes(t))) return 'advertise';
    if (commissionTerms.some(t => lower.includes(t))) return 'commission';
    if (paymentTerms.some(t => lower.includes(t))) return 'payment';
    if (contactTerms.some(t => lower.includes(t))) return 'contact';
    if (howTerms.some(t => lower.includes(t))) return 'how_it_works';
  }

  // If we have a decent score, use it; otherwise fallback to default
  return bestScore >= 10 ? bestIntent : 'default';
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const modalWidth = 280;
    const modalHeight = 420;
    // On small screens, center the modal
    if (window.innerWidth < 640) {
      setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    } else {
      const x = Math.max(10, Math.min(window.innerWidth - modalWidth - 10, window.innerWidth - modalWidth - 100));
      const y = Math.max(10, Math.min(window.innerHeight - modalHeight - 10, window.innerHeight - modalHeight - 100));
      setPosition({ x, y });
    }
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('button, a, input, textarea')) return;
    setIsDragging(true);
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging || !modalRef.current) return;
      const rect = modalRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      let newX = clientX - dragOffset.current.x;
      let newY = clientY - dragOffset.current.y;
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));
      setPosition({ x: newX, y: newY });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  const modalContent = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[280px] max-h-[420px] flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
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

  // Apply position via ref to avoid inline style warnings
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.position = 'fixed';
      modalRef.current.style.transform = 'none';
      // On small screens (< 640px), center the modal
      if (window.innerWidth < 640) {
        modalRef.current.style.left = '50%';
        modalRef.current.style.top = '50%';
        modalRef.current.style.transform = 'translate(-50%, -50%)';
      } else {
        modalRef.current.style.left = `${position.x}px`;
        modalRef.current.style.top = `${position.y}px`;
      }
    }
  }, [position.x, position.y]);

  return createPortal(modalContent, document.body);
}

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsappMode, setWhatsAppMode] = useState(null); // 'support' | 'group'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { lang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (showChatbot && messages.length === 0) {
      const responses = lang === 'rw' ? RESPONSES.rw : RESPONSES.en;
      setMessages([{ text: responses.greeting, sender: 'bot' }]);
    }
  }, [showChatbot, lang]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const intent = detectIntent(userMessage, lang);
      const responses = lang === 'rw' ? RESPONSES.rw : RESPONSES.en;
      const botResponse = responses[intent] || responses.default;
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = lang === 'rw' ? ['Imitungo','Imirimo','Amatangazo','10%','Kwishyura','Vugana'] : ['Properties','Jobs','Ads','10% fee','Payment','Contact'];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
        <button onClick={() => { setShowWhatsApp(false); setShowChatbot(true); }} className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-105 active:scale-95" title="AI Assistant" aria-label="AI Assistant"><MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></button>
        <button onClick={() => { setShowChatbot(false); setWhatsAppMode(null); setShowWhatsApp(true); }} className="w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1DB954] transition-all hover:scale-105 active:scale-95" title="WhatsApp" aria-label="WhatsApp"><Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></button>
        {showScrollTop && <button onClick={scrollToTop} className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-105 active:scale-95" title="Back to Top" aria-label="Back to Top"><ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></button>}
      </div>

      <Modal isOpen={showChatbot} onClose={() => setShowChatbot(false)} title="Isange AI">
        <div className="space-y-2">
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
          <div className="flex gap-2"><input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type..." className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /><button type="button" onClick={handleSend} disabled={!input.trim()||isTyping} className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-50"><Send className="w-4 h-4 text-white"/></button></div>
        </div>
      </Modal>

      <Modal isOpen={showWhatsApp} onClose={() => { setShowWhatsApp(false); setWhatsAppMode(null); }} title="WhatsApp">
        {whatsappMode === null ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">Choose an option:</p>
            <button onClick={() => setWhatsAppMode('support')} className="w-full bg-[#25D366] text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#1DB954] transition">
              <MessageSquare className="w-4 h-4" />
              <span>Contact Support</span>
            </button>
            <button onClick={() => setWhatsAppMode('group')} className="w-full bg-[#25D366] text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#1DB954] transition">
              <Users className="w-4 h-4" />
              <span>Join Updates Group</span>
            </button>
            <button onClick={() => setWhatsAppMode('notify')} className="w-full bg-[#128C7E] text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#0B6E5B] transition">
              <Bell className="w-4 h-4" />
              <span>Get Notifications (WhatsApp Business)</span>
            </button>
          </div>
        ) : whatsappMode === 'support' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Contact us directly on WhatsApp for quick support.</p>
            <a href="https://wa.me/250787832490?text=Hello%20Isange%2C%20I%20need%20support." target="_blank" rel="noopener noreferrer" className="block w-full bg-[#25D366] text-white text-center py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#1DB954] transition">Open WhatsApp Chat</a>
            <button onClick={() => setWhatsAppMode(null)} className="w-full text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        ) : whatsappMode === 'group' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Join our WhatsApp group for instant updates on new properties, jobs, and ads.</p>
            <p className="text-xs text-gray-500">Group invite link will be added by admin.</p>
            <a href="https://chat.whatsapp.com/GROUP_INVITE_LINK_PLACEHOLDER" target="_blank" rel="noopener noreferrer" className="block w-full bg-[#25D366] text-white text-center py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#1DB954] transition opacity-50 cursor-not-allowed">Join Group (Admin: add invite link)</a>
            <button onClick={() => setWhatsAppMode(null)} className="w-full text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Subscribe to receive WhatsApp notifications when new properties, jobs, or ads are published.</p>
            <p className="text-xs text-gray-500">Requires WhatsApp Business API setup (admin only).</p>
            <a href="https://wa.me/250787832490?text=Hello%20Isange%2C%20I%20want%20to%20subscribe%20to%20WhatsApp%20notifications%20for%20new%20listings." target="_blank" rel="noopener noreferrer" className="block w-full bg-[#128C7E] text-white text-center py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#0B6E5B] transition">Request Subscription</a>
            <button onClick={() => setWhatsAppMode(null)} className="w-full text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default FloatingActions;