import React, { useState, useEffect } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, ChevronLeft, 
  XCircle, X, Loader2, Send, Clock, 
  Gauge, Tent, Calendar, Phone, Users, Info, Mountain
} from 'lucide-react';
import AlertModal from '../../utils/AlertModal';
import PackageCard from '../Cards/PackageCard'; // Ensure the path to your PackageCard is correct

const DomesticActivity = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [selectedDest, setSelectedDest] = useState(null);
  const [domesticDestinations, setDomesticDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth & Booking States
  const [currentUser, setCurrentUser] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ 
    show: false, title: '', message: '', type: 'success'
  });
  const [bookingData, setBookingData] = useState({ 
    name: '', email: '', phone: '', travelers: '1', date: '' 
  });

  // Current date for calendar validation (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setBookingData(prev => ({ ...prev, name: user.displayName || '', email: user.email || '' }));
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "destinations"), where("type", "==", "domestic"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDomesticDestinations(docs);
      if (id) {
        const found = docs.find(d => d.id === id);
        if (found) setSelectedDest(found);
      } else {
        setSelectedDest(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // --- UPDATED VALIDATION ---
    
    // 1. Date Validation
    if (!bookingData.date || bookingData.date < today) {
      setAlertConfig({ 
        show: true, 
        title: "Invalid Date", 
        message: "Please select a valid future date for your expedition.", 
        type: 'warning' 
      });
      return;
    }

    // 2. Phone Number Validation (Nepal Standard)
    // Regex explanation: Starts with 9, followed by 7, 8, or 6 (common prefixes), total 10 digits
    const phoneRegex = /^9[678]\d{8}$/; 
    
    if (!bookingData.phone) {
      setAlertConfig({ 
        show: true, 
        title: "Phone Required", 
        message: "We need a contact number to coordinate your trip.", 
        type: 'warning' 
      });
      return;
    }

    if (!phoneRegex.test(bookingData.phone)) {
      setAlertConfig({ 
        show: true, 
        title: "Invalid Number", 
        message: "Please enter a valid 10-digit mobile number starting with 9.", 
        type: 'warning' 
      });
      return;
    }

    // --- END VALIDATION ---

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid,
        userName: bookingData.name,
        userEmail: bookingData.email,
        phone: bookingData.phone,
        travelDate: bookingData.date,
        travelers: bookingData.travelers,
        packageName: selectedDest.name,
        packagePrice: selectedDest.budget,
        packageType: 'domestic',
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setShowBookingModal(false);
      setAlertConfig({ 
        show: true, 
        title: "Reservation Sent", 
        message: `We have received your request for ${selectedDest.name}.`, 
        type: 'success' 
      });
      setBookingData(prev => ({ ...prev, phone: '', date: '', travelers: '1' }));
    } catch (error) {
      setAlertConfig({ 
        show: true, 
        title: "Error", 
        message: "Booking failed. Please check your connection.", 
        type: 'error' 
      });
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const formatList = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text.split(/[\n•·]+/).filter(item => item.trim() !== '');
  };

  const renderItinerary = (text) => {
    if (!text) return <p className="text-slate-400 italic font-bold text-[10px]">ITINERARY PENDING...</p>;
    const days = text.split(/(?=Day\s?\d+[:\s\-])/g).filter(d => d.trim() !== "");

    return (
      <div className="relative ml-4 border-l-2 border-emerald-50">
        {days.map((day, idx) => {
          const [label, ...desc] = day.split(/[:\s-](.+)/);
          return (
            <div key={idx} className="relative pl-10 pb-12 group">
              <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">{label}</span>
              <p className="text-sm font-bold text-slate-700 leading-snug">{desc.join('').trim()}</p>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>;

  if (selectedDest) {
    const { name, overview, budget, image, details } = selectedDest;
    const highlights = formatList(details?.highlights);
    const includes = formatList(details?.costIncludes);
    const excludes = formatList(details?.costExcludes);

    return (
      <div className="min-h-screen bg-white font-montserrat pb-20">
        <AlertModal 
          isOpen={alertConfig.show} 
          onConfirm={() => { setAlertConfig(p => ({ ...p, show: false })); if(alertConfig.type === 'success') navigate('/destinations/domestic'); }}
          {...alertConfig} 
        />
        
        {/* GREEN HERO SECTION */}
        <div className="relative h-[65vh] w-full bg-emerald-950 overflow-hidden">
          <button onClick={() => navigate('/destinations/domestic')} className="absolute top-8 left-8 z-30 bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-emerald-500 transition-all">
            <ChevronLeft size={24} />
          </button>
          
          <div className="absolute inset-0 opacity-40">
             <img src={image} alt={name} className="w-full h-full object-cover mix-blend-overlay" />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />
          
          <div className="absolute bottom-16 left-8 md:left-20 max-w-4xl z-10">
            <div className="flex gap-3 mb-6">
               <span className="bg-emerald-500 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest">Domestic Expedition</span>
               <span className="bg-white/10 backdrop-blur text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest">{details?.duration || '7 Days'}</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.85]">{name}</h1>
          </div>
          <Mountain size={500} className="absolute -bottom-24 -right-24 text-white/5 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-20">
            <section>
              <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-6">Overview</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-line">{overview}</p>
            </section>

            {/* HIGHLIGHTS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <h2 className="col-span-full text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Core Highlights</h2>
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-emerald-50 transition-colors">
                    <CheckCircle size={18} className="text-emerald-500" />
                    <span className="text-[11px] font-black text-slate-700 uppercase">{item}</span>
                  </div>
                ))}
            </section>

            {/* COST DETAILS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-y border-slate-100">
              <div>
                <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <CheckCircle size={16} /> Cost Includes
                </h3>
                <ul className="space-y-4">
                  {includes.map((item, i) => (
                    <li key={i} className="text-[12px] font-bold text-slate-500 uppercase flex gap-3">
                      <span className="text-emerald-500">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <XCircle size={16} /> Cost Excludes
                </h3>
                <ul className="space-y-4">
                  {excludes.map((item, i) => (
                    <li key={i} className="text-[12px] font-bold text-slate-500 uppercase flex gap-3">
                      <span className="text-rose-400">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-10">Itinerary</h2>
              {renderItinerary(details?.itinerary)}
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <Tent size={180} className="absolute -bottom-10 -right-10 text-white/5" />
              <div className="relative z-10">
                <div className="mb-10">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Package Price</p>
                  <h3 className="text-5xl font-black tracking-tighter">Rs {budget}</h3>
                </div>
                
                <div className="py-8 border-y border-white/10 mb-10 space-y-5">
                  <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2"><Clock size={16} /> Duration</span>
                    <span className="text-white">{details?.duration || '7 Days'}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2"><Gauge size={16} /> Grade</span>
                    <span className="text-emerald-400">{details?.difficulty || 'Moderate'}</span>
                  </div>
                </div>

                <button 
                  onClick={currentUser ? () => setShowBookingModal(true) : () => navigate('/login')} 
                  className="w-full bg-emerald-500 hover:bg-white hover:text-slate-900 py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Start Booking <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VALIDATED BOOKING MODAL */}
        {showBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-950/80">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowBookingModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">Finalize</h2>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{name}</p>
              </div>
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block flex items-center gap-2"><Phone size={14} className="text-emerald-500" /> WhatsApp / Phone</label>
                  <input required type="tel" placeholder="98XXXXXXXX" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all font-bold text-sm" 
                    value={bookingData.phone} onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block flex items-center gap-2"><Calendar size={14} className="text-emerald-500" /> Start Date</label>
                    <input 
                      required 
                      type="date" 
                      min={today} // Prevents past date selection
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all font-bold text-sm" 
                      value={bookingData.date} 
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block flex items-center gap-2"><Users size={14} className="text-emerald-500" /> Group Size</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all font-bold text-sm appearance-none"
                      value={bookingData.travelers} onChange={(e) => setBookingData({...bookingData, travelers: e.target.value})}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'Person':'People'}</option>)}
                    </select>
                  </div>
                </div>
                <div className="p-5 bg-emerald-50 rounded-3xl flex items-start gap-4">
                  <Info size={20} className="text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-[10px] font-bold text-emerald-800 uppercase leading-tight">Confirmation is subject to availability for the chosen date.</p>
                </div>
                <button disabled={isSubmitting} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Confirm Reservation"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- LIST VIEW (WITH PACKAGECARD) ---
  return (
    <div className="min-h-screen bg-white font-montserrat">
      <header className="bg-emerald-950 text-white py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[10px]">Nepal Getaways</span>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.75] mt-4">Local<br/>Adventures.</h1>
        </div>
        <Mountain size={600} className="absolute -bottom-40 -right-40 text-emerald-900/50 pointer-events-none" />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {domesticDestinations.map((dest) => (
            <div key={dest.id} onClick={() => navigate(`/destinations/domestic/${dest.id}`)} className="cursor-pointer">
              {/* Ensure category is injected if missing from DB for visual consistency */}
              <PackageCard data={{...dest, category: 'Domestic'}} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DomesticActivity;