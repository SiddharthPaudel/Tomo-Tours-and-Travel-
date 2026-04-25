import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Footprints, Clock, ArrowRight, 
  CheckCircle, ChevronLeft, Mountain, Loader2, Send,
  X, Phone, CalendarDays, Users, Info, MapPin, XCircle, Globe
} from 'lucide-react';

import AlertModal from '../../utils/AlertModal';
import PackageCard from '../Cards/PackageCard'; 

const HikingActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- REFS FOR SECTION SCROLLING ---
  const overviewRef = useRef(null);
  const journeyRef = useRef(null);
  const costRef = useRef(null);
  const highlightsRef = useRef(null);

  // --- STATE MANAGEMENT ---
  const [allHikes, setAllHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHike, setSelectedHike] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ phone: '', travelDate: '', travelers: '1' });
  
  const [alertConfig, setAlertConfig] = useState({
    show: false, type: 'success', title: '', message: ''
  });

  const today = new Date().toISOString().split('T')[0];

  // Helper for smooth scrolling with sticky header offset
  const scrollToSection = (ref) => {
    if (ref.current) {
      const offset = 120; 
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // --- DATA SYNC ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const q = query(collection(db, "activities"), where("category", "==", "hiking"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const hikeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllHikes(hikeData);

      if (id) {
        const found = hikeData.find(h => h.id === id);
        if (found) {
          setSelectedHike(found);
        } else {
          setSelectedHike(null);
          navigate('/activities/hiking'); 
        }
      } else {
        setSelectedHike(null);
      }
      setLoading(false);
    });

    return () => { unsubscribeAuth(); unsubscribeData(); };
  }, [id, navigate]);

  const handleBack = () => {
    setSelectedHike(null);
    navigate('/activities/hiking'); 
  };

  const handleHikeSelection = (hike) => {
    setSelectedHike(hike);
    navigate(`/activities/hiking/${hike.id}`);
  };

  const handleFinalBooking = async () => {
    const phoneRegex = /^9\d{9}$/;
    if (!customerDetails.phone || !customerDetails.travelDate) {
      setAlertConfig({ show: true, type: 'warning', title: 'Missing Info', message: 'Please provide details.' });
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
        packageName: selectedHike.title,
        packageType: 'hiking',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setAlertConfig({ show: true, title: "Expedition Reserved!", message: "Our team will contact you soon.", type: 'success' });
      setShowBookingForm(false);
    } catch (e) {
      setAlertConfig({ show: true, title: "Error", message: "Failed to process reservation.", type: 'error' });
    } finally { setIsSubmitting(false); }
  };

  const parseList = (text) => text ? text.split('\n').map(item => item.replace('·', '').trim()).filter(i => i !== "") : [];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Trails...</p>
    </div>
  );

  if (selectedHike) {
    const details = selectedHike.details || {};
    const highlights = parseList(details.highlights || selectedHike.highlights);
    const includes = parseList(details.costIncludes || selectedHike.costIncludes);
    const excludes = parseList(details.costExcludes || selectedHike.costExcludes);

    return (
      <div className="min-h-screen bg-white font-montserrat pb-20 animate-in fade-in duration-500">
        <AlertModal isOpen={alertConfig.show} onConfirm={() => { setAlertConfig({ ...alertConfig, show: false }); if (alertConfig.type === 'success') handleBack(); }} {...alertConfig} />

        {/* HERO */}
        <div className="relative h-[65vh] w-full">
          <button onClick={handleBack} className="absolute top-8 left-8 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-emerald-600 transition-all shadow-xl"><ChevronLeft size={24} /></button>
          <img src={selectedHike.image} alt={selectedHike.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>
          <div className="absolute bottom-12 left-8 md:left-20 text-white z-10">
            <span className="bg-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">Scenic Hiking</span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl text-slate-900">{selectedHike.title}</h1>
          </div>
        </div>

        {/* --- CAROUSEL NAVIGATION --- */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory bg-slate-100/80 p-1.5 md:p-2 rounded-full w-full md:w-max border border-slate-200/50">
                {[
                  { label: 'Overview', ref: overviewRef },
                  { label: 'Journey', ref: journeyRef },
                  { label: 'Highlights', ref: highlightsRef },
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
              <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-6">Overview</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{details.overview || selectedHike.overview}</p>
            </section>

            <section ref={journeyRef} className="py-10">
              <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-12">The Journey</h2>
              <div className="space-y-0">
                {(details.itinerary || selectedHike.itinerary)?.split('\n').filter(s => s.trim()).map((step, i, arr) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 flex-shrink-0"></div>
                      {i !== arr.length - 1 && <div className="w-0.5 h-20 bg-slate-100 my-1 group-hover:bg-emerald-100 transition-colors"></div>}
                    </div>
                    <div className="pb-10">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section ref={highlightsRef} className="bg-emerald-950 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
              <h2 className="text-[11px] font-black text-emerald-300 uppercase tracking-[0.4em] mb-10 relative z-10">Expedition Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <CheckCircle size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
              <Footprints size={200} className="absolute -bottom-10 -right-10 text-white/5" />
            </section>

            <section ref={costRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16 border-y border-slate-100">
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><CheckCircle size={16} /> Includes</h3>
                <ul className="space-y-3">{includes.map((item, i) => <li key={i} className="text-[10px] font-bold text-slate-600 flex items-center gap-3 uppercase"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> {item}</li>)}</ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2"><XCircle size={16} /> Excludes</h3>
                <ul className="space-y-3">{excludes.map((item, i) => <li key={i} className="text-[10px] font-bold text-slate-500 flex items-center gap-3 uppercase italic"><div className="w-1.5 h-1.5 bg-red-400 rounded-full"/> {item}</li>)}</ul>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Total Price</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black tracking-tighter text-white">{selectedHike.price}</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">/ Person</span>
                </div>
                <div className="space-y-4 mb-10 pt-8 border-t border-slate-800">
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest"><span className="flex items-center gap-3"><Clock size={16} className="text-emerald-500"/> Duration</span><span>{details.duration || selectedHike.duration}</span></div>
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest"><span className="flex items-center gap-3"><Mountain size={16} className="text-emerald-500"/> Max Alt.</span><span>{details.elevation || selectedHike.elevation}</span></div>
                </div>
                <button onClick={() => currentUser ? setShowBookingForm(true) : navigate('/login')} className="w-full bg-emerald-600 hover:bg-white hover:text-slate-900 py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl">Reserve Expedition</button>
              </div>
              <Footprints size={200} className="absolute -bottom-10 -right-10 text-emerald-600 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </div>

        {/* BOOKING MODAL */}
        {showBookingForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-md bg-slate-950/60">
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
              <button onClick={() => setShowBookingForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={20}/></button>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-8">Finalize Trip</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">Mobile Number</label>
                  <input type="tel" maxLength="10" placeholder="98XXXXXXXX" className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-emerald-500/20" onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">Preferred Date</label>
                  <input type="date" min={today} className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-emerald-500/20" onChange={(e) => setCustomerDetails({...customerDetails, travelDate: e.target.value})} />
                </div>
                <button onClick={handleFinalBooking} disabled={isSubmitting} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all">
                  {isSubmitting ? "Processing..." : "Confirm Expedition"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="min-h-screen bg-white font-montserrat pb-20">
      <AlertModal isOpen={alertConfig.show} onConfirm={() => setAlertConfig({ ...alertConfig, show: false })} {...alertConfig} />
      <header className="bg-emerald-900 text-white py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px]">Nepal Getaways</span>
          <h1 className="text-6xl md:text-8xl font-black mt-4 mb-6 tracking-tighter uppercase leading-[0.85]">Scenic<br/>Hikes.</h1>
        </div>
        <Footprints size={450} className="absolute -bottom-20 -right-20 text-emerald-800 opacity-20" />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allHikes.map((hike) => (
            <div key={hike.id} onClick={() => handleHikeSelection(hike)} className="cursor-pointer">
              <PackageCard data={{...hike, category: 'Hiking', price: hike.price}} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HikingActivity;