import React, { useState, useEffect } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Globe, ArrowRight, ChevronLeft, 
  Loader2, Calendar, Info, Clock, Check, X, 
  Users, MapPin, Target, Tent, Phone, CalendarDays
} from 'lucide-react';

import AlertModal from '../../utils/AlertModal';
import PackageCard from '../Cards/PackageCard'; 

const InternationalActivity = () => {
  const { id } = useParams(); // URL ID for deep linking
  const navigate = useNavigate(); 

  const [allDestinations, setAllDestinations] = useState([]);
  const [selectedIntl, setSelectedIntl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth & Booking States
  const [currentUser, setCurrentUser] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Alert Modal Config
  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    type: 'success', 
    title: '', 
    message: '',
    confirmText: 'OK',
    onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })) 
  });

  const [bookingData, setBookingData] = useState({ 
    phone: '', travelers: '1', date: '' 
  });

  const today = new Date().toISOString().split('T')[0];

  // Logic mirrored from TrekActivity
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    
    // Query the "destinations" collection instead of "activities"
    const q = query(collection(db, "destinations"), where("type", "==", "international"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllDestinations(docs);

      // Handle deep linking based on URL ID
      if (id) {
        const found = docs.find(d => d.id === id);
        if (found) {
          setSelectedIntl(found);
        } else {
          setSelectedIntl(null);
          navigate('/activities/international'); 
        }
      } else {
        setSelectedIntl(null);
      }
      
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, [id, navigate]);

  const handleBack = () => {
    setSelectedIntl(null);
    navigate('/destinations/international'); 
  };

  const handleSelection = (dest) => {
    setSelectedIntl(dest);
    navigate(`/destinations/international/${dest.id}`);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^9\d{9}$/;

    if (!bookingData.date || !bookingData.phone) {
      setModalConfig({
        isOpen: true, type: 'warning', title: 'Action Required',
        message: 'Please select a date and enter your phone number.',
        confirmText: 'Fix Now',
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }

    if (!phoneRegex.test(bookingData.phone)) {
        setModalConfig({
          isOpen: true, type: 'error', title: 'Invalid Phone',
          message: 'Enter a valid 10-digit number starting with 9.',
          confirmText: 'Retry',
          onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
        });
        return;
      }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "bookings"), {
        userId: currentUser?.uid || 'guest',
        userName: currentUser?.displayName || 'Guest User',
        userEmail: currentUser?.email || 'N/A',
        phone: bookingData.phone, 
        travelDate: bookingData.date, 
        travelers: bookingData.travelers,
        packageName: selectedIntl.name,
        packagePrice: selectedIntl.budget,
        packageType: 'international',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setModalConfig({
        isOpen: true, type: 'success', title: 'Request Received',
        message: `Your request for ${selectedIntl.name} has been sent. We will contact you soon.`,
        confirmText: 'Excellent',
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          setShowBookingModal(false);
          handleBack();
        }
      });
    } catch (error) {
      setModalConfig({
        isOpen: true, type: 'error', title: 'Error',
        message: error.message,
        confirmText: 'OK',
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatList = (text) => {
    if (!text || text.trim() === "") return [];
    return text.split(/[\n•]+/).filter(item => item.trim() !== '');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  // --- DETAIL VIEW ---
  if (selectedIntl) {
    const { name, overview, budget, image, details } = selectedIntl;
    
    return (
      <div className="min-h-screen bg-white font-['Montserrat'] animate-in fade-in duration-700 pb-20">
        <AlertModal {...modalConfig} onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })} />
        
        {/* HERO SECTION */}
        <div className="relative h-[65vh] w-full bg-emerald-950 overflow-hidden">
          <button onClick={handleBack} className="absolute top-10 left-10 z-30 bg-white/20 backdrop-blur-xl p-4 rounded-full text-white hover:bg-emerald-500 transition-all">
            <ChevronLeft size={24} />
          </button>
          
          <div className="absolute inset-0">
             <img src={image} alt={name} className="w-full h-full object-cover opacity-60" />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />
          
          <div className="absolute bottom-16 left-10 md:left-24 z-10">
            <span className="bg-emerald-500 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">International Destination</span>
            <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.85]">{name}</h1>
          </div>
          <Globe size={500} className="absolute -bottom-24 -right-24 text-white/5 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              <section>
                <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-6">Overview</h2>
                <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-line">{overview}</p>
              </section>

              {details?.whyChoose && (
                <section className="bg-emerald-950 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
                   <div className="flex items-center gap-3 mb-10 relative z-10">
                     <Target size={18} className="text-emerald-400" />
                     <h2 className="text-[11px] font-black text-emerald-300 uppercase tracking-[0.4em]">Strategic Highlights</h2>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {formatList(details.whyChoose).map((point, index) => (
                      <div key={index} className="flex items-start gap-4 p-6 bg-white/5 rounded-[2.5rem] border border-white/10">
                        <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">0{index + 1}</div>
                        <p className="text-emerald-100 text-[11px] font-bold uppercase mt-1">{point.trim()}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16 border-y border-slate-100">
                <div>
                  <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <Check size={18} className="p-1 bg-emerald-100 rounded-full"/> Cost Includes
                  </h3>
                  <div className="space-y-4">
                    {formatList(details?.costIncludes).map((item, idx) => (
                      <div key={idx} className="flex gap-4 text-[12px] font-bold text-slate-500 uppercase">
                        <span className="text-emerald-500">•</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <X size={18} className="p-1 bg-rose-100 rounded-full"/> Cost Excludes
                  </h3>
                  <div className="space-y-4">
                    {formatList(details?.costExcludes).map((item, idx) => (
                      <div key={idx} className="flex gap-4 text-[12px] font-bold text-slate-400 uppercase">
                        <span className="text-rose-300">•</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {details?.itinerary && (
                <section>
                  <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-10">Expedition Timeline</h2>
                  <div className="relative ml-4 border-l-2 border-emerald-50">
                    {details.itinerary.split('\n').filter(d => d.trim()).map((day, idx) => (
                      <div key={idx} className="relative pl-10 pb-12 group">
                        <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Phase 0{idx+1}</span>
                        <p className="text-sm font-bold text-slate-700 leading-snug">{day}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <Tent size={150} className="absolute -bottom-10 -right-10 text-white/5" />
                <div className="relative z-10">
                  <div className="mb-10">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Investment</p>
                    <h3 className="text-5xl font-black tracking-tighter">Rs {budget}</h3>
                  </div>
                  
                  <div className="py-8 border-y border-white/10 mb-10 space-y-5">
                    <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                      <span className="flex items-center gap-2"><Clock size={16} /> Duration</span>
                      <span className="text-white">{details?.duration || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                      <span className="flex items-center gap-2"><MapPin size={16} /> Region</span>
                      <span className="text-emerald-400">{details?.region || 'International'}</span>
                    </div>
                  </div>

                  <button 
                    onClick={currentUser ? () => setShowBookingModal(true) : () => navigate('/login')} 
                    className="w-full bg-emerald-500 hover:bg-white hover:text-slate-900 py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl"
                  >
                    {currentUser ? "Start Reservation" : "Login to Book"}
                  </button>
                </div>
              </div>
            </div>
        </div>

        {/* BOOKING MODAL */}
        {showBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-950/80">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowBookingModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={24} /></button>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">Finalize</h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-10">{name}</p>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 mb-2"><Phone size={14} className="text-emerald-500" /> WhatsApp / Phone</label>
                  <input required type="tel" maxLength="10" placeholder="98XXXXXXXX" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-emerald-500" 
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 mb-2"><CalendarDays size={14} className="text-emerald-500" /> Date</label>
                    <input required type="date" min={today} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-emerald-500" 
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 mb-2"><Users size={14} className="text-emerald-500" /> Group</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm outline-none"
                      onChange={(e) => setBookingData({...bookingData, travelers: e.target.value})}>
                      {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{num} Travelers</option>)}
                    </select>
                  </div>
                </div>
                <button disabled={isSubmitting} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all">
                  {isSubmitting ? "Processing..." : "Confirm Journey"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="min-h-screen bg-white font-['Montserrat'] pb-32 animate-in fade-in duration-500">
      <header className="py-28 px-10 bg-emerald-950 text-white relative overflow-hidden">
        <Globe size={400} className="absolute -bottom-20 -right-20 text-white/5" />
        <div className="relative z-10 max-w-4xl">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block">The Global Collection</span>
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.75]">World<br/>Gateways.</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allDestinations.map((dest) => (
            <div 
              key={dest.id} 
              onClick={() => handleSelection(dest)} 
              className="cursor-pointer"
            >
              <PackageCard 
                data={{
                  ...dest, 
                  category: dest.details?.region || 'International',
                  price: dest.budget // Standardizing for the card component
                }} 
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InternationalActivity;