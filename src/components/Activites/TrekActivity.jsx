import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mountain, ChevronLeft, CheckCircle, 
  Loader2, X, Phone, Users, Clock, Gauge, Tent, CalendarDays,
  Check, Info, Map, ShieldCheck, Zap
} from 'lucide-react';

import AlertModal from '../../utils/AlertModal';
import PackageCard from '../Cards/PackageCard'; 

const TrekActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- REFS FOR SECTION SCROLLING ---
  const overviewRef = useRef(null);
  const highlightsRef = useRef(null);
  const costRef = useRef(null);
  const itineraryRef = useRef(null);

  const [allTreks, setAllTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ phone: '', travelDate: '', travelers: '1' });
  const [alertConfig, setAlertConfig] = useState({ show: false, type: 'success', title: '', message: '' });

  const today = new Date().toISOString().split('T')[0];

  // Smooth scroll helper
  const scrollToSection = (ref) => {
    if (ref.current) {
      const offset = 120; 
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const q = query(collection(db, "activities"), where("category", "==", "trekking"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const treks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllTreks(treks);

      if (id) {
        const found = treks.find(t => t.id === id);
        if (found) setSelectedTrek(found);
        else navigate('/activities/trekking'); 
      } else {
        setSelectedTrek(null);
      }
      setLoading(false);
    });

    return () => { unsubscribeAuth(); unsubscribeData(); };
  }, [id, navigate]);

  const formatList = (text) => {
    if (!text || text.trim() === "") return [];
    return text.split(/[\n•]+/).filter(item => item.trim() !== '');
  };

  const handleBack = () => {
    setSelectedTrek(null);
    navigate('/activities/trekking'); 
  };

  const handleTrekSelection = (trek) => {
    setSelectedTrek(trek);
    navigate(`/activities/trekking/${trek.id}`);
  };

  const handleBookNow = async () => {
    const phoneRegex = /^9\d{9}$/;
    if (!customerDetails.phone || !customerDetails.travelDate) {
      setAlertConfig({ show: true, type: 'warning', title: 'Action Required', message: 'Please select a date and phone number.' });
      return;
    }
    if (!phoneRegex.test(customerDetails.phone)) {
      setAlertConfig({ show: true, type: 'error', title: 'Invalid Phone', message: 'Enter a valid 10-digit number.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: currentUser?.uid || 'guest',
        userName: currentUser?.displayName || 'Guest User',
        phone: customerDetails.phone,
        travelDate: customerDetails.travelDate,
        travelers: customerDetails.travelers,
        packageName: selectedTrek.title,
        packageType: 'trekking',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setAlertConfig({ show: true, title: "Request Sent", message: "We've received your expedition request.", type: 'success' });
      setShowBookingForm(false);
    } catch (e) {
      setAlertConfig({ show: true, title: "Error", message: e.message, type: 'error' });
    } finally { setIsSubmitting(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  if (selectedTrek) {
    const details = selectedTrek.details || {};
    const highlights = formatList(details.highlights);
    const itinerarySteps = formatList(details.itinerary);
    const costIncludes = formatList(details.costIncludes);
    const costExcludes = formatList(details.costExcludes);

    return (
      <div className="min-h-screen bg-white font-montserrat animate-in fade-in duration-500 pb-20">
        <AlertModal 
          isOpen={alertConfig.show} 
          onConfirm={() => { 
            setAlertConfig({ ...alertConfig, show: false }); 
            if (alertConfig.type === 'success') handleBack(); 
          }} 
          {...alertConfig} 
        />

        {/* HERO AREA */}
        <div className="relative h-[70vh] overflow-hidden">
          <button onClick={handleBack} className="absolute top-10 left-10 z-30 bg-white/20 backdrop-blur-xl p-4 rounded-full text-white hover:bg-emerald-600 transition-all shadow-xl">
            <ChevronLeft size={24} />
          </button>
          <img src={selectedTrek.image} className="w-full h-full object-cover scale-105" alt={selectedTrek.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/40"></div>
          <div className="absolute bottom-16 left-10 md:left-24 z-10">
            <div className="flex items-center gap-3 mb-4">
               <span className="bg-emerald-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">Expedition</span>
               <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-white/30">{details.difficulty || 'Moderate'}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">{selectedTrek.title}</h1>
          </div>
        </div>

        {/* --- CAROUSEL NAVIGATION --- */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-100/80 p-2 rounded-full border border-slate-200/50 w-full md:w-max">
                {[
                  { label: 'Overview', ref: overviewRef },
                  { label: 'Highlights', ref: highlightsRef },
                  { label: 'Cost Details', ref: costRef },
                  { label: 'Itinerary', ref: itineraryRef }
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => scrollToSection(item.ref)}
                    className="group relative px-8 py-3 rounded-full transition-all duration-300 active:scale-95 flex-shrink-0"
                  >
                    <div className="absolute inset-0 bg-white group-hover:bg-emerald-600 rounded-full transition-all duration-300 shadow-sm border border-slate-200 group-hover:border-emerald-600" />
                    <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white transition-colors duration-300">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-24">
            {/* OVERVIEW */}
            <section ref={overviewRef} className="animate-in slide-in-from-bottom duration-700">
              <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-6">The Experience</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{details.overview}</p>
            </section>

            {/* HIGHLIGHTS */}
            <section ref={highlightsRef}>
              <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-10">Trek Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:border-emerald-200 group">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* COST SECTION */}
            <section ref={costRef} className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100">
               <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-12 text-center">Pricing Transparency</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-3">
                      <div className="p-1.5 bg-emerald-100 rounded-lg"><Check size={14}/></div> Cost Includes
                    </h3>
                    <div className="space-y-4">
                      {costIncludes.map((item, idx) => (
                        <div key={idx} className="flex gap-4 text-[11px] font-bold text-slate-500 uppercase leading-snug">
                          <span className="text-emerald-500 mt-0.5"><Zap size={10} fill="currentColor"/></span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-3">
                       <div className="p-1.5 bg-rose-100 rounded-lg"><X size={14}/></div> Cost Excludes
                    </h3>
                    <div className="space-y-4">
                      {costExcludes.map((item, idx) => (
                        <div key={idx} className="flex gap-4 text-[11px] font-bold text-slate-400 uppercase leading-snug">
                          <span className="text-rose-300 mt-0.5"><Zap size={10} fill="currentColor"/></span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </section>

            {/* ITINERARY */}
            <section ref={itineraryRef}>
              <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-12">Day-by-Day Journey</h2>
              <div className="relative ml-4">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200"></div>
                {itinerarySteps.map((step, i) => (
                  <div key={i} className="relative pl-12 pb-12 last:pb-0 group">
                    <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-4 border-white ring-1 ring-emerald-600 z-10 group-hover:scale-125 transition-transform"></div>
                    <div className="bg-white group-hover:bg-slate-50 p-6 rounded-[2rem] border border-transparent group-hover:border-slate-100 transition-all -mt-4">
                       <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR STICKY */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="mb-10">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Expedition Fee</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">Rs. {selectedTrek.price}</span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase">/ Person</span>
                  </div>
                </div>
                <div className="space-y-6 py-10 border-y border-white/10 mb-10">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2"><Clock size={14}/> Timeframe</span>
                    <span className="text-white">{details.duration || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2"><Gauge size={14}/> Difficulty</span>
                    <span className="text-emerald-400">{details.difficulty || 'Moderate'}</span>
                  </div>
                </div>
                <button onClick={() => currentUser ? setShowBookingForm(true) : navigate('/login')} className="w-full bg-emerald-500 hover:bg-white hover:text-slate-900 py-6 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-emerald-900/20">
                  Confirm Booking
                </button>
              </div>
              <Mountain size={200} className="absolute -bottom-10 -right-10 text-white opacity-5 rotate-12 transition-transform group-hover:scale-110" />
            </div>
          </div>
        </div>

        {/* BOOKING MODAL */}
        {showBookingForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
              <button onClick={() => setShowBookingForm(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={24} /></button>
              <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Confirm Expedition</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-emerald-600 uppercase mb-2 block ml-1">Phone Number</label>
                  <input type="tel" maxLength="10" placeholder="98XXXXXXXX" className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-emerald-600 uppercase mb-2 block ml-1">Start Date</label>
                    <input type="date" min={today} className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, travelDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-emerald-600 uppercase mb-2 block ml-1">Team Size</label>
                    <select className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, travelers: e.target.value})}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} People</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleBookNow} disabled={isSubmitting} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Secure My Spot"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- GRID VIEW ---
  return (
    <div className="min-h-screen bg-white font-montserrat pb-32">
      <header className="py-32 px-10 bg-slate-950 text-white relative overflow-hidden">
        <Mountain size={500} className="absolute -bottom-24 -right-24 text-white/5 -rotate-12" />
        <div className="relative z-10 max-w-5xl">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-6 block">The Great Himalaya Range</span>
          <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter uppercase leading-[0.75]">Trekking<br/>Nepal.</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allTreks.map((trek) => (
            <div key={trek.id} onClick={() => handleTrekSelection(trek)} className="cursor-pointer transition-transform duration-500 hover:-translate-y-2">
              <PackageCard data={{...trek, category: 'Trekking'}} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TrekActivity;