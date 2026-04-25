import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Landmark, Loader2, X, Phone, Users, CalendarDays,
  ChevronLeft, CheckCircle, History, Car, Calendar, Languages, Binoculars, MapPin, Compass
} from 'lucide-react';
import AlertModal from '../../utils/AlertModal';
import PackageCard from '../Cards/PackageCard'; 
import { useParams, useNavigate } from 'react-router-dom';

const SightSeeingActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- REFS FOR SECTION SCROLLING ---
  const overviewRef = useRef(null);
  const highlightsRef = useRef(null);
  const timelineRef = useRef(null);

  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
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
    const q = query(collection(db, "activities"), where("category", "==", "sightseeing"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const tours = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllTours(tours);

      if (id) {
        const foundTour = tours.find(t => t.id === id);
        if (foundTour) setSelectedTour(foundTour);
        else navigate('/activities/sightseeing');
      } else {
        setSelectedTour(null);
      }
      setLoading(false);
    });

    return () => { unsubscribeAuth(); unsubscribeData(); };
  }, [id, navigate]);

  // Helper to split dynamic strings from backend into clean arrays
  const formatList = (text) => {
    if (!text || text.trim() === "") return [];
    return text.split(/[\n•]+/).filter(item => item.trim() !== '');
  };

  const handleBack = () => {
    setSelectedTour(null);
    navigate('/activities/sightseeing'); 
  };

  const handleTourSelection = (tour) => {
    setSelectedTour(tour);
    navigate(`/activities/sightseeing/${tour.id}`);
  };

  const handleBookNow = async () => {
    const phoneRegex = /^9\d{9}$/;
    if (!customerDetails.phone || !customerDetails.travelDate) {
      setAlertConfig({ show: true, type: 'warning', title: 'Action Required', message: 'Please select a date and phone number.' });
      return;
    }
    if (!phoneRegex.test(customerDetails.phone)) {
      setAlertConfig({ show: true, type: 'error', title: 'Invalid Phone', message: 'Enter a valid 10-digit number starting with 9.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: currentUser?.uid || 'guest',
        userName: currentUser?.displayName || 'Guest User',
        userEmail: currentUser?.email || 'N/A',
        phone: customerDetails.phone,
        travelDate: customerDetails.travelDate,
        travelers: customerDetails.travelers,
        packageName: selectedTour.title,
        packagePrice: selectedTour.price,
        packageType: 'sightseeing',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setAlertConfig({ show: true, title: "Booking Success!", message: "We will contact you shortly to finalize your tour.", type: 'success' });
      setShowBookingForm(false);
    } catch (e) {
      setAlertConfig({ show: true, title: "Booking Failed", message: e.message, type: 'error' });
    } finally { setIsSubmitting(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-amber-600" size={40} />
    </div>
  );

  if (selectedTour) {
    const details = selectedTour.details || {};
    const highlights = formatList(details.highlights);
    const itinerarySteps = formatList(details.itinerary);

    return (
      <div className="min-h-screen bg-slate-50 font-['Montserrat'] animate-in fade-in duration-700 pb-20">
        <AlertModal 
          isOpen={alertConfig.show} 
          onConfirm={() => { 
            setAlertConfig({ ...alertConfig, show: false }); 
            if (alertConfig.type === 'success') handleBack(); 
          }} 
          {...alertConfig} 
        />

        {/* HERO AREA */}
        <div className="relative h-[65vh] overflow-hidden">
          <button onClick={handleBack} className="absolute top-10 left-10 z-30 bg-white/20 backdrop-blur-xl p-4 rounded-full text-white hover:bg-white hover:text-amber-600 transition-all">
            <ChevronLeft size={24} />
          </button>
          <img src={selectedTour.image} className="w-full h-full object-cover" alt={selectedTour.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-black/20 to-black/40"></div>
          <div className="absolute bottom-16 left-10 md:left-24 animate-in slide-in-from-left duration-700">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[3rem] shadow-2xl max-w-2xl">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em] mb-4 block">Cultural Immersions</span>
              <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{selectedTour.title}</h1>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC SECTION NAVIGATION --- */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-200/50 p-2 rounded-full border border-slate-200/50">
                <button onClick={() => scrollToSection(overviewRef)} className="px-8 py-3 rounded-full bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm border border-slate-200">
                  Overview
                </button>
                {highlights.length > 0 && (
                  <button onClick={() => scrollToSection(highlightsRef)} className="px-8 py-3 rounded-full bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm border border-slate-200">
                    Highlights
                  </button>
                )}
                {itinerarySteps.length > 0 && (
                  <button onClick={() => scrollToSection(timelineRef)} className="px-8 py-3 rounded-full bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm border border-slate-200">
                    Route
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-20">
            {/* OVERVIEW */}
            <section ref={overviewRef}>
              <h2 className="text-xs font-black text-amber-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Compass size={18}/> The Experience
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{details.overview || "Loading cultural details..."}</p>
            </section>

            {/* HIGHLIGHTS - Rendered from dynamic data */}
            {highlights.length > 0 && (
              <section ref={highlightsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-amber-200 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <CheckCircle size={20} />
                    </div>
                    <span className="text-[11px] font-black text-slate-700 uppercase">{h}</span>
                  </div>
                ))}
              </section>
            )}

            {/* ROUTE TIMELINE - Rendered from dynamic data */}
            {itinerarySteps.length > 0 && (
              <section ref={timelineRef}>
                <h2 className="text-xs font-black text-amber-600 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                  <MapPin size={18}/> Route Timeline
                </h2>
                <div className="space-y-0">
                  {itinerarySteps.map((step, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-amber-600 ring-4 ring-amber-100 group-hover:scale-125 transition-all"></div>
                        {i !== itinerarySteps.length - 1 && <div className="w-0.5 h-20 bg-slate-200 my-1"></div>}
                      </div>
                      <div className="pb-10">
                        <p className="text-sm font-black text-slate-800 uppercase group-hover:text-amber-600 transition-colors">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* STICKY SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden relative">
              <History size={150} className="absolute -bottom-10 -right-10 text-white/5 opacity-10" />
              <div className="relative z-10">
                <div className="mb-10">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Package Cost</p>
                  <h3 className="text-5xl font-black tracking-tighter">Rs. {selectedTour.price}</h3>
                </div>
                <div className="space-y-5 py-8 border-y border-white/10 mb-10">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span className="flex items-center gap-2"><Car size={14}/> Vehicle</span><span className="text-white">{details.vehicleType || 'Private Car'}</span></div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span className="flex items-center gap-2"><Calendar size={14}/> Duration</span><span className="text-white">{details.duration || '1'} Day(s)</span></div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span className="flex items-center gap-2"><Languages size={14}/> Guide</span><span className="text-white">{details.isGuideIncluded ? "Professional" : "On Request"}</span></div>
                </div>
                <button onClick={() => currentUser ? setShowBookingForm(true) : setAlertConfig({show: true, title: 'Login Required', message: 'Please login to book.', type: 'error'})} className="w-full bg-amber-500 hover:bg-white hover:text-slate-900 py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-amber-900/20">Reserve Experience</button>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING MODAL */}
        {showBookingForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
              <button onClick={() => setShowBookingForm(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={24} /></button>
              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Reserve Your Spot</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Phone size={10}/> Phone Number</label>
                  <input type="tel" maxLength="10" placeholder="98XXXXXXXX" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><CalendarDays size={10}/> Travel Date</label>
                    <input type="date" min={today} className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, travelDate: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Users size={10}/> Travelers</label>
                    <select className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, travelers: e.target.value})}>
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Person(s)</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleBookNow} disabled={isSubmitting} className="w-full py-5 bg-amber-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // GRID VIEW
  return (
    <div className="min-h-screen bg-white font-['Montserrat'] pb-32">
      <AlertModal isOpen={alertConfig.show} onConfirm={() => setAlertConfig({ ...alertConfig, show: false })} {...alertConfig} />
      <header className="py-28 px-6 text-center bg-amber-50 relative overflow-hidden">
        <Landmark size={400} className="absolute -bottom-20 -left-20 text-amber-100/50 -rotate-12" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-4 block">Cultural Immersions</span>
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8]">Sightseeing<br/><span className="text-amber-600">Nepal.</span></h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allTours.map((tour) => (
            <div key={tour.id} onClick={() => handleTourSelection(tour)} className="cursor-pointer transition-transform duration-500 hover:-translate-y-2">
              <PackageCard data={{ ...tour, category: 'Sightseeing' }} />
            </div>
          ))}
        </div>
        {allTours.length === 0 && !loading && (
          <div className="text-center py-20">
            <Binoculars size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">No heritage tours found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SightSeeingActivity;