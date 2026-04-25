import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Waves, Clock, Zap, Info, ChevronLeft, CheckCircle, XCircle, 
  Shield, LifeBuoy, Map, X, Loader2, HeartPulse, UserCheck, 
  Phone, CalendarDays, Users, Anchor 
} from 'lucide-react';

import AlertModal from '../../utils/AlertModal';
import PackageCard from '../Cards/PackageCard';

const RaftingActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- REFS FOR SECTION SCROLLING ---
  const overviewRef = useRef(null);
  const safetyRef = useRef(null);
  const timelineRef = useRef(null);
  const costRef = useRef(null);

  // --- STATE MANAGEMENT ---
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ phone: '', travelDate: '', travelers: '1' });
  const [alertConfig, setAlertConfig] = useState({ show: false, type: 'success', title: '', message: '' });

  const today = new Date().toISOString().split('T')[0];

  // Helper for smooth scrolling with sticky header offset
  const scrollToSection = (ref) => {
    if (ref.current) {
      const offset = 120; 
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // --- FIREBASE DATA FETCHING ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const q = query(collection(db, "activities"), where("category", "==", "rafting"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const trips = snapshot.docs.map(doc => {
        const data = doc.data();
        const details = data.details || {};
        return {
          id: doc.id,
          title: data.title || '',
          image: data.image || '',
          price: data.price || '',
          subCategory: data.subCategory || 'whitewater',
          tag: data.tag || 'Top Rated',
          overview: details.overview || '',
          highlights: details.highlights || '',
          itinerary: details.itinerary || '',
          costIncludes: details.costIncludes || '',
          costExcludes: details.costExcludes || '',
          duration: details.duration || data.duration || '',
          difficulty: details.difficulty || 'Class III',
          suitabilityFitness: details.suitabilityFitness || '',
          suitabilityAge: details.suitabilityAge || '',
          suitabilityExp: details.suitabilityExp || '',
        };
      });
      setAllTrips(trips);

      if (id) {
        const foundTrip = trips.find(t => t.id === id);
        if (foundTrip) setSelectedTrip(foundTrip);
      } else {
        setSelectedTrip(null);
      }
      setLoading(false);
    });

    return () => { unsubscribeAuth(); unsubscribeData(); };
  }, [id]);

  const handleCloseDetail = () => {
    setSelectedTrip(null);
    navigate('/activities/rafting');
  };

  const handleFinalBooking = async () => {
    const phoneRegex = /^9\d{9}$/;
    if (!customerDetails.phone || !customerDetails.travelDate) {
      setAlertConfig({ show: true, type: 'warning', title: 'Details Required', message: 'Please provide all details.' });
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
        userName: currentUser?.displayName || 'Traveler',
        phone: customerDetails.phone,
        travelDate: customerDetails.travelDate,
        travelers: customerDetails.travelers,
        packageName: selectedTrip.title,
        packageType: 'rafting',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setAlertConfig({ show: true, title: "Booking Sent!", message: "We will contact you shortly.", type: 'success' });
      setShowBookingForm(false);
    } catch (e) {
      setAlertConfig({ show: true, title: "Error", message: "Request failed.", type: 'error' });
    } finally { setIsSubmitting(false); }
  };

  const parseList = (text) => text ? text.split('\n').map(item => item.replace('·', '').trim()).filter(i => i !== "") : [];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preparing Rapids...</p>
    </div>
  );

  if (selectedTrip) {
    const highlights = parseList(selectedTrip.highlights);
    const includes = parseList(selectedTrip.costIncludes);
    const excludes = parseList(selectedTrip.costExcludes);
    const itineraryLines = parseList(selectedTrip.itinerary);

    return (
      <div className="min-h-screen bg-white font-montserrat pb-20 animate-in fade-in duration-500">
        <AlertModal 
          isOpen={alertConfig.show} 
          onConfirm={() => { setAlertConfig({ ...alertConfig, show: false }); if (alertConfig.type === 'success') handleCloseDetail(); }}
          {...alertConfig} 
        />

        {/* HERO AREA */}
        <div className="relative h-[65vh] w-full">
          <button onClick={handleCloseDetail} className="absolute top-8 left-8 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-emerald-600 transition-all shadow-xl"><ChevronLeft size={24} /></button>
          <img src={selectedTrip.image} alt={selectedTrip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10"></div>
          <div className="absolute bottom-12 left-8 md:left-20 z-10">
            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">{selectedTrip.tag}</span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-none drop-shadow-2xl">{selectedTrip.title}</h1>
          </div>
        </div>

        {/* --- CAROUSEL NAVIGATION --- */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory bg-slate-100/80 p-1.5 md:p-2 rounded-full w-full md:w-max border border-slate-200/50">
                {[
                  { label: 'Overview', ref: overviewRef },
                  { label: 'Safety', ref: safetyRef },
                  { label: 'Timeline', ref: timelineRef },
                  { label: 'Pricing', ref: costRef }
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => scrollToSection(item.ref)}
                    className="group relative px-5 py-2.5 md:px-8 md:py-3 rounded-full transition-all duration-300 active:scale-95 snap-center flex-shrink-0"
                  >
                    <div className="absolute inset-0 bg-white group-hover:bg-emerald-600 rounded-full transition-all duration-300 shadow-sm border border-slate-200 group-hover:border-emerald-600" />
                    <span className="relative z-10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
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
            <section ref={overviewRef}>
              <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6">Overview</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedTrip.overview}</p>
            </section>

            <section ref={safetyRef}>
              <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-10">Suitability & Safety</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all hover:border-blue-100">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase mb-3"><HeartPulse size={16}/> Physical Fitness</h4>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">{selectedTrip.suitabilityFitness}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all hover:border-blue-100">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase mb-3"><UserCheck size={16}/> Age & Experience</h4>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                      <b>Requirement:</b> {selectedTrip.suitabilityAge} <br/>
                      <b>Experience:</b> {selectedTrip.suitabilityExp}
                    </p>
                </div>
              </div>
            </section>

            <section ref={timelineRef}>
                <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-12">Expedition Timeline</h2>
                <div className="relative ml-4">
                    <div className="absolute left-0 top-2 bottom-2 w-px bg-blue-100"></div>
                    {itineraryLines.map((line, idx, arr) => (
                        <div key={idx} className="relative pl-12 pb-12 last:pb-0 group">
                            <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-blue-600 border-4 border-white ring-1 ring-blue-600 z-10 group-hover:scale-125 transition-transform"></div>
                            <p className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover:text-blue-700 transition-colors">{line}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section ref={costRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 py-16 border-y border-slate-100">
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><CheckCircle size={16} /> Cost Includes</h3>
                    <ul className="space-y-4">
                        {includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 flex-shrink-0"/> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2"><XCircle size={16}/> Cost Excludes</h3>
                    <ul className="space-y-4">
                        {excludes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide italic">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1 flex-shrink-0"/> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
          </div>

          {/* SIDEBAR PRICE CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black tracking-tighter text-blue-400">{selectedTrip.price}</span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase">/ Person</span>
                  </div>
                  <div className="space-y-5 mb-10 pt-10 border-t border-slate-800">
                    <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest"><span>Duration</span><span className="text-white">{selectedTrip.duration}</span></div>
                    <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest"><span>River Grade</span><span className="text-white">{selectedTrip.difficulty}</span></div>
                  </div>
                  <button 
                    onClick={() => currentUser ? setShowBookingForm(true) : navigate('/login')} 
                    className="w-full bg-blue-600 hover:bg-white hover:text-slate-900 py-6 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl"
                  >
                    Book Expedition
                  </button>
                  <div className="mt-8 space-y-3">
                    <p className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter"><LifeBuoy size={14} className="text-blue-500"/> Certified Safety Equipment</p>
                    <p className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter"><Anchor size={14} className="text-blue-500"/> Expert Local Guides</p>
                  </div>
                </div>
                <Waves size={240} className="absolute -bottom-16 -right-16 text-blue-900 opacity-20 rotate-12" />
            </div>
          </div>
        </div>

        {/* BOOKING MODAL */}
        {showBookingForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-slate-950/60 backdrop-blur-md">
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
              <button onClick={() => setShowBookingForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={20}/></button>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-8">Reservation</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-blue-600 uppercase mb-2 block ml-1">Phone Number</label>
                  <input type="tel" maxLength="10" placeholder="98XXXXXXXX" className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-blue-500/20" onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-blue-600 uppercase mb-2 block ml-1">Date</label>
                    <input type="date" min={today} className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, travelDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-blue-600 uppercase mb-2 block ml-1">People</label>
                    <select className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, travelers: e.target.value})}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Persons</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleFinalBooking} disabled={isSubmitting} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all active:scale-95">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18}/> : "Confirm Expedition"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- MAIN GRID VIEW ---
  return (
    <div className="min-h-screen bg-white font-montserrat pb-20">
      <AlertModal isOpen={alertConfig.show} onConfirm={() => setAlertConfig({ ...alertConfig, show: false })} {...alertConfig} />
      
      <header className="bg-slate-950 text-white py-36 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Nepal River Adventures</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85]">
            White<br/><span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>Water</span>
          </h1>
        </div>
        <Waves size={400} className="absolute -bottom-20 -right-20 text-blue-900 opacity-10 rotate-12" />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allTrips.map((trip) => (
            <div 
              key={trip.id} 
              onClick={() => setSelectedTrip(trip)} 
              className="cursor-pointer transition-transform duration-500 hover:-translate-y-2"
            >
              <PackageCard 
                data={{ 
                  ...trip, 
                  category: 'Rafting', 
                  highlights: [] 
                }} 
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RaftingActivity;