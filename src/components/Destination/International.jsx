import React, { useState, useEffect } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Plane, ArrowRight, ShieldCheck, ChevronLeft, 
  Star, Loader2, Calendar, Info, Clock, Check, X, 
  Sparkles, Users, MapPin, Target, Send, Lock
} from 'lucide-react';
import AlertModal from '../../utils/AlertModal';
const InternationalActivity = () => {
  const navigate = useNavigate(); 
  const [selectedIntl, setSelectedIntl] = useState(null);
  const [internationalDestinations, setInternationalDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth & Booking States
  const [currentUser, setCurrentUser] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    type: 'success', 
    title: '', 
    message: '',
    confirmText: 'OK',
    onConfirm: () => {} 
  });
  const [bookingData, setBookingData] = useState({ 
    name: '', email: '', phone: '', travelers: '1', date: '' 
  });

  // Monitor Auth State 
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setBookingData(prev => ({
          ...prev,
          name: user.displayName || '',
          email: user.email || ''
        }));
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch Data
  useEffect(() => {
    const q = query(collection(db, "destinations"), where("type", "==", "international"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInternationalDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

const handleBookingSubmit = async (e) => {
  e.preventDefault();
  
  if (!currentUser) return alert("Please login to book.");
  
  setIsSubmitting(true);

  try {
    const bookingPayload = {
      // 1. Data from Firebase Auth (The "Source of Truth")
      userId: currentUser.uid,
      userName: currentUser.displayName || bookingData.name || "Anonymous Traveler",
      userEmail: currentUser.email,

      // 2. Data from your local Form State
      phone: bookingData.phone, 
      travelDate: bookingData.date, 
      travelers: bookingData.travelers,
      
      // 3. Package Details
      packageName: selectedIntl.name,
      packagePrice: selectedIntl.budget,
      packageType: 'international',
      
      // 4. Status and Timestamps
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    // Save to Firestore
    await addDoc(collection(db, "bookings"), bookingPayload);

    // 5. FIXED: This was causing the error because setModalConfig was undefined
    setModalConfig({
      isOpen: true,
      type: 'success',
      title: 'Booking Sent!',
      message: `We've received your request for ${selectedIntl.name}. Our team will contact you at ${bookingData.phone} soon.`,
      confirmText: 'Got it',
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        setShowBookingModal(false);
      }
    });

  } catch (error) {
    console.error("Firestore Save Error:", error);
    // This alert was showing because of the JS error above
    alert("Error: " + error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  const formatList = (text) => {
    if (!text || text.trim() === "") return [];
    return text.split(/[\n•]+/).filter(item => item.trim() !== '');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Worldwide Collection</p>
    </div>
  );

  // --- BOOKING MODAL ---
  const BookingModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setShowBookingModal(false)} />
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
        <button onClick={() => setShowBookingModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-emerald-600 transition-colors">
          <X size={20} />
        </button>
        <div className="mb-8">
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em]">Reservation</span>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mt-1">{selectedIntl?.name}</h2>
        </div>
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <input required type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none border-2 border-transparent focus:border-emerald-500/20" 
            value={bookingData.name} onChange={(e) => setBookingData({...bookingData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="email" placeholder="Email" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none border-2 border-transparent focus:border-emerald-500/20" 
              value={bookingData.email} onChange={(e) => setBookingData({...bookingData, email: e.target.value})} />
            <input required type="tel" placeholder="Phone" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none border-2 border-transparent focus:border-emerald-500/20" 
              value={bookingData.phone} onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required type="date" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none border-2 border-transparent focus:border-emerald-500/20" 
              value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
            <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none border-2 border-transparent focus:border-emerald-500/20"
              value={bookingData.travelers} onChange={(e) => setBookingData({...bookingData, travelers: e.target.value})}>
              {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{num} Travelers</option>)}
            </select>
          </div>
          <button disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14}/> Send Booking Request</>}
          </button>
        </form>
      </div>
    </div>
  );

  // --- DETAIL VIEW ---
  if (selectedIntl) {
    const { name, overview, budget, image, details } = selectedIntl;
    
    return (
      <div className="min-h-screen bg-white font-montserrat pb-20 animate-in fade-in duration-500">
        {showBookingModal && <BookingModal />}
      
      <AlertModal 
        {...modalConfig} 
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })} 
      />
        
        <div className="relative h-[50vh] w-full overflow-hidden">
          <button onClick={() => setSelectedIntl(null)} className="absolute top-8 left-8 z-30 bg-white p-3 rounded-full shadow-2xl hover:bg-emerald-600 hover:text-white transition-all border border-slate-100">
            <ChevronLeft size={20} />
          </button>
          <img src={image} alt={name} className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          <div className="absolute bottom-10 left-8 md:left-20">
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">{name}</h1>
            {details?.region && (
               <div className="flex items-center gap-2 mt-4 text-emerald-400 bg-white/90 backdrop-blur-md w-fit px-4 py-1.5 rounded-full shadow-lg">
                 <MapPin size={12}/><span className="text-[9px] font-black uppercase tracking-[0.3em]">{details.region}</span>
               </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            <div className="lg:col-span-8 space-y-20">
              {/* Overview */}
              {overview && (
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <Info size={18} className="text-emerald-600" />
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">The Narrative</h2>
                  </div>
                  <p className="text-slate-600 text-[16px] leading-[1.9] font-medium whitespace-pre-line first-letter:text-6xl first-letter:font-black first-letter:text-emerald-600 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                    {overview}
                  </p>
                </section>
              )}

              {/* Strategic Advantage */}
              {details?.whyChoose && (
                <section className="bg-emerald-950 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl group">
                   <Globe className="absolute -right-20 -bottom-20 opacity-5 text-white rotate-12 group-hover:rotate-90 transition-transform duration-[4s]" size={300} />
                   <div className="flex items-center gap-3 mb-10 relative z-10">
                     <Target size={18} className="text-emerald-400" />
                     <h2 className="text-[11px] font-black text-emerald-300 uppercase tracking-[0.4em]">Strategic Advantage</h2>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {formatList(details.whyChoose).map((point, index) => (
                      <div key={index} className="flex items-start gap-4 p-6 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">0{index + 1}</div>
                        <p className="text-emerald-100 text-[11px] font-bold uppercase leading-relaxed tracking-tight mt-1">{point.trim()}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience Curation (RESTORED) */}
              {details?.experience && (
                <section>
                  <div className="flex items-center gap-3 mb-10">
                    <Sparkles size={18} className="text-amber-500" />
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Experience Curation</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formatList(details.experience).map((point, index) => (
                      <div key={index} className="group flex items-start gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                        <div className="shrink-0 w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-lg group-hover:rotate-6 transition-transform">0{index + 1}</div>
                        <p className="text-slate-700 text-[11px] font-bold uppercase leading-relaxed tracking-tight mt-1">{point.trim()}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Inclusions & Exclusions (RESTORED) */}
              {(details?.costIncludes || details?.costExcludes) && (
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16 border-y border-slate-100">
                  {details?.costIncludes && (
                    <div className="space-y-8">
                      <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Check size={18} className="p-1 bg-emerald-100 rounded-full"/> Cost Includes
                      </h3>
                      <div className="space-y-5">
                        {formatList(details.costIncludes).map((item, idx) => (
                          <div key={idx} className="flex gap-4 text-[12px] font-bold text-slate-600 leading-relaxed group">
                            <span className="text-emerald-500 group-hover:translate-x-1 transition-transform">✓</span> 
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {details?.costExcludes && (
                    <div className="space-y-8">
                      <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <X size={18} className="p-1 bg-rose-100 rounded-full"/> Cost Excludes
                      </h3>
                      <div className="space-y-5">
                        {formatList(details.costExcludes).map((item, idx) => (
                          <div key={idx} className="flex gap-4 text-[12px] font-bold text-slate-400 leading-relaxed group">
                            <span className="text-rose-300 group-hover:translate-x-1 transition-transform">✕</span> 
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Itinerary */}
              {details?.itinerary && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                    <Calendar size={18} className="text-emerald-600" /> Curated Schedule
                  </h3>
                  <div className="space-y-0 pl-6 border-l border-slate-100 ml-4">
                    {details.itinerary.split('\n').filter(d => d.trim()).map((day, i) => (
                      <div key={i} className="relative pb-12 group last:pb-0">
                        <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-white border-2 border-emerald-600 z-10 group-hover:scale-150 transition-transform" />
                        <div className="pl-8">
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] block mb-2">Phase 0{i+1}</span>
                          <p className="text-slate-800 text-sm font-bold leading-relaxed">{day}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-12 space-y-8">
                <div className="bg-emerald-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Package Value</p>
                    <div className="flex items-baseline gap-2 mb-10">
                      <span className="text-5xl font-black tracking-tighter">{budget}</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">/ Person</span>
                    </div>
                    
                    <div className="space-y-5 mb-10 pt-8 border-t border-emerald-900/50">
                      {details?.duration && <div className="flex items-center gap-4 text-[10px] font-black text-emerald-200 uppercase tracking-widest"><Clock size={16} className="text-emerald-500"/> {details.duration} Days</div>}
                      {details?.bestTime && <div className="flex items-start gap-4 text-[10px] font-black text-emerald-200 uppercase tracking-widest"><Calendar size={16} className="text-emerald-500 shrink-0"/> Window: {details.bestTime}</div>}
                      <div className="flex items-center gap-4 text-[10px] font-black text-emerald-200 uppercase tracking-widest"><ShieldCheck size={16} className="text-emerald-500"/> Verified Premium</div>
                    </div>

                    {currentUser ? (
                      <button onClick={() => setShowBookingModal(true)} className="w-full bg-white text-emerald-950 hover:bg-emerald-500 hover:text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95">
                        Confirm Availability
                      </button>
                    ) : (
                      <button onClick={() => navigate('/login')} className="w-full bg-emerald-800/50 border border-emerald-700 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:bg-emerald-700">
                        <Lock size={14} /> Login to Book
                      </button>
                    )}
                   </div>
                   <Globe className="absolute -bottom-20 -right-20 opacity-10 group-hover:rotate-90 transition-transform duration-[4s]" size={250} />
                </div>
                {details?.whoFor && (
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Users size={18} className="text-emerald-600" />
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ideal Travelers</h4>
                    </div>
                    <p className="text-[11px] font-bold text-slate-700 uppercase leading-loose tracking-tight">{details.whoFor}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="min-h-screen bg-white font-montserrat pb-20 animate-in fade-in duration-500">
      <section className="bg-emerald-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px]">The Global Collection</span>
          <h1 className="text-5xl md:text-7xl font-black mt-4 mb-6 tracking-tighter uppercase">International <br/>Gateways</h1>
        </div>
        <Globe size={400} className="absolute -bottom-20 -right-20 text-emerald-800 opacity-20" />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {internationalDestinations.map((dest) => (
            <div key={dest.id} className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
              <div className="relative h-72 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6"><span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-emerald-900 tracking-widest">{dest.details?.region || 'Global'}</span></div>
                <div className="absolute top-6 right-6"><div className="bg-emerald-600 text-white px-4 py-1.5 rounded-full shadow-lg"><span className="text-[9px] font-black tracking-tighter uppercase">{dest.budget}</span></div></div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-2"><span className="text-emerald-600 text-[8px] font-black uppercase tracking-widest">{dest.details?.duration || '5'} Days Package</span></div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-6 leading-tight group-hover:text-emerald-700 transition-colors">{dest.name}</h3>
                <button onClick={() => setSelectedIntl(dest)} className="w-full bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">View Global Tour <ArrowRight size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InternationalActivity;