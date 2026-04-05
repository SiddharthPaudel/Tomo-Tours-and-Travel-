import React, { useState, useEffect } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Map, Navigation, ArrowRight, Camera,
  Hotel, Users, LayoutGrid, Calendar,
  ChevronLeft, CheckCircle, Shield, Mountain,
  Info, Clock, Sparkles, Send, Lock, X, Loader2, MapPin, Waves, Zap
} from 'lucide-react';
import AlertModal from '../../utils/AlertModal';

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

  // 1. Monitor Auth State
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

  // 2. Fetch Data & Sync with URL ID
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "destinations"), where("type", "==", "domestic"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDomesticDestinations(docs);
      
      // Critical Fix: Sync the URL ID with the fetched data
      if (id) {
        const found = docs.find(d => d.id === id);
        if (found) {
          setSelectedDest(found);
        } else {
          console.warn("No matching destination found for ID:", id);
          setSelectedDest(null);
        }
      } else {
        setSelectedDest(null);
      }
      
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [id]); // Re-runs when the URL ID changes

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

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
        title: "Booking Successful!",
        message: `Your request for ${selectedDest.name} has been received.`,
        type: 'success'
      });
      setBookingData(prev => ({ ...prev, phone: '', date: '', travelers: '1' }));
    } catch (error) {
      console.error("Booking Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setSelectedDest(null);
    navigate('/destinations/domestic');
  };

  const formatList = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text.split(/[\n•·]+/).filter(item => item.trim() !== '');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Local Adventures</p>
    </div>
  );

  // --- BOOKING MODAL COMPONENT ---
  const BookingModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setShowBookingModal(false)} />
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
        <button onClick={() => setShowBookingModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-emerald-600 transition-colors">
          <X size={20} />
        </button>
        <div className="mb-8">
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em]">Local Reservation</span>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mt-1">{selectedDest?.name}</h2>
        </div>
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <input required type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none" 
            value={bookingData.name} onChange={(e) => setBookingData({...bookingData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="email" placeholder="Email" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none" 
              value={bookingData.email} onChange={(e) => setBookingData({...bookingData, email: e.target.value})} />
            <input required type="tel" placeholder="Phone" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none" 
              value={bookingData.phone} onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required type="date" className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none" 
              value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
            <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[12px] outline-none"
              value={bookingData.travelers} onChange={(e) => setBookingData({...bookingData, travelers: e.target.value})}>
              {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num}>{num} Travelers</option>)}
            </select>
          </div>
          <button disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14}/> Confirm Booking</>}
          </button>
        </form>
      </div>
    </div>
  );

  // --- DETAIL VIEW ---
  if (selectedDest) {
    const { name, overview, budget, image, details } = selectedDest;
    return (
      <div className="min-h-screen bg-white font-montserrat pb-20 animate-in fade-in duration-500">
        <AlertModal 
          isOpen={alertConfig.show} 
          onConfirm={() => setAlertConfig(prev => ({ ...prev, show: false }))}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
        />
        {showBookingModal && <BookingModal />}
        
        <div className="relative h-[65vh] w-full">
          <button onClick={handleBack} className="absolute top-8 left-8 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-slate-900 transition-all">
            <ChevronLeft size={24} />
          </button>
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
          <div className="absolute bottom-12 left-8 md:left-20 text-white max-w-4xl">
            <div className="flex gap-2 mb-4">
               <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Domestic</span>
               {details?.difficulty && <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{details.difficulty}</span>}
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">{name}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">The Experience</h2>
              <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line mb-8">{overview}</p>
            </section>

            {details?.highlights && (
              <section>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-6">Expedition Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formatList(details.highlights).map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors">
                      <CheckCircle size={18} className="text-emerald-600" />
                      <span className="text-[11px] font-black text-slate-700 uppercase">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Investment</span>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black tracking-tighter">Rs {budget}</span>
                <span className="text-slate-400 text-[10px] font-bold uppercase">/ Person</span>
              </div>
              
              <button onClick={currentUser ? () => setShowBookingModal(true) : () => navigate('/login')} className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all">
                {currentUser ? "Book This Expedition" : "Login to Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="min-h-screen bg-white font-montserrat pb-20">
      <section className="bg-emerald-900 text-white py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px]">Nepal Getaways</span>
          <h1 className="text-6xl md:text-8xl font-black mt-4 mb-6 tracking-tighter uppercase leading-[0.85]">Wild <br/>Nepal</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {domesticDestinations.map((dest) => (
            <div key={dest.id} className="group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500">
              <div className="relative h-80 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-2xl font-black tracking-tighter uppercase leading-none">{dest.name}</p>
                </div>
              </div>
              <div className="p-8">
                <button 
                  onClick={() => navigate(`/destinations/domestic/${dest.id}`)} 
                  className="w-full bg-slate-900 text-white hover:bg-emerald-600 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DomesticActivity;