import React, { useState, useEffect } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Mountain, Clock, Gauge, ArrowRight, Info,
  ChevronLeft, CheckCircle, XCircle, Shield, X, Loader2,
  Flag, Map, Tent
} from 'lucide-react';
import AlertModal from '../../utils/AlertModal';

const TrekActivity = () => {
  const [allTreks, setAllTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ phone: '', travelDate: '', travelers: '1' });
  const [alertConfig, setAlertConfig] = useState({ show: false, type: 'success', title: '', message: '' });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const q = query(collection(db, "activities"), where("category", "==", "trekking"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const trekData = snapshot.docs.map(doc => {
        const data = doc.data();
        const details = data.details || {};
        return {
          id: doc.id,
          title: data.title || '',
          image: data.image || '',
          price: data.price || '',
          overview: details.overview || '',
          highlights: details.highlights || '',
          itinerary: details.itinerary || '',
          costIncludes: details.costIncludes || '',
          costExcludes: details.costExcludes || '',
          duration: details.duration || data.duration || '',
          elevation: details.maxAlt || '',
          difficulty: details.difficulty || 'Moderate',
          tag: data.tag || 'Expedition'
        };
      });
      setAllTreks(trekData);
      setLoading(false);
    });

    return () => { unsubscribeAuth(); unsubscribeData(); };
  }, []);

  const handleFinalBooking = async () => {
    if (!customerDetails.phone || !customerDetails.travelDate) {
      setAlertConfig({ show: true, type: 'warning', title: 'Required', message: 'Please provide phone and date.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: currentUser?.uid || 'guest',
        userName: currentUser?.displayName || 'Traveler',
        userEmail: currentUser?.email || 'N/A',
        phone: customerDetails.phone,
        travelDate: customerDetails.travelDate,
        travelers: customerDetails.travelers,
        activityTitle: selectedTrek.title,
        price: selectedTrek.price,
        category: 'trekking',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setAlertConfig({ show: true, title: "Success!", message: "Expedition request sent.", type: 'success' });
      setShowBookingForm(false);
    } catch (e) {
      setAlertConfig({ show: true, title: "Error", message: e.message, type: 'error' });
    } finally { setIsSubmitting(false); }
  };

  const parseList = (text) => text ? text.split('\n').map(item => item.replace('·', '').trim()).filter(i => i !== "") : [];

  const renderProfessionalItinerary = (text) => {
    if (!text) return <p className="text-slate-400 italic">Itinerary pending...</p>;
    const days = text.split(/(?=Day\s?\d+[:\s\-])/g).filter(d => d.trim() !== "");

    return (
      <div className="relative ml-4 space-y-0">
        <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200"></div>
        {days.map((dayText, idx) => {
          const splitIndex = dayText.indexOf(':') !== -1 ? dayText.indexOf(':') : dayText.indexOf(' ');
          const dayLabel = dayText.substring(0, splitIndex).trim();
          const dayDesc = dayText.substring(splitIndex + 1).trim();

          return (
            <div key={idx} className="relative pl-10 pb-10 group">
              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-4 border-white ring-1 ring-emerald-500 z-10"></div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{dayLabel}</span>
                <p className="text-sm font-bold text-slate-800 leading-snug">{dayDesc}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>;

  if (selectedTrek) {
    const highlights = parseList(selectedTrek.highlights);
    const includes = parseList(selectedTrek.costIncludes);
    const excludes = parseList(selectedTrek.costExcludes);

    return (
      <div className="min-h-screen bg-white font-montserrat pb-20">
        <AlertModal 
          isOpen={alertConfig.show} 
          onConfirm={() => { setAlertConfig({ ...alertConfig, show: false }); if (alertConfig.type === 'success') setSelectedTrek(null); }}
          {...alertConfig} 
        />

        {/* HIGH QUALITY HERO SECTION */}
        <div className="relative h-screen w-full overflow-hidden">
          <button 
            onClick={() => setSelectedTrek(null)} 
            className="absolute top-10 left-10 z-30 bg-black/30 backdrop-blur-xl p-4 rounded-full text-white hover:bg-white hover:text-emerald-600 transition-all shadow-2xl"
          >
            <ChevronLeft size={28} />
          </button>

          <img 
            src={selectedTrek.image} 
            alt={selectedTrek.title} 
            className="w-full h-full object-cover transform scale-105 animate-in zoom-in duration-1000" 
          />
          
          {/* DEPTH GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
          
          <div className="absolute bottom-20 left-8 md:left-24 max-w-4xl animate-in slide-in-from-bottom-10 duration-700">
             <span className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] mb-6 inline-block shadow-xl">
               {selectedTrek.tag}
             </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
              {selectedTrek.title}
            </h1>
          </div>
        </div>

        {/* REST OF CONTENT REMAINS THE SAME */}
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-24">
            <section>
              <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">Overview</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedTrek.overview}</p>
            </section>

            <section>
               <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-12">Expedition Itinerary</h2>
              {renderProfessionalItinerary(selectedTrek.itinerary)}
            </section>

            {/* Highlights, Includes, Excludes remain as in previous version... */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-[11px] font-black text-slate-700 uppercase">{item}</span>
                  </div>
                ))}
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <Tent size={180} className="absolute -bottom-10 -right-10 text-white/5 opacity-10" />
              <div className="relative z-10">
                <div className="mb-10">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Package Price</p>
                  <h3 className="text-5xl font-black tracking-tighter">Rs. {selectedTrek.price}</h3>
                </div>
                
                <div className="space-y-5 py-8 border-y border-white/10 mb-10">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span><Clock size={14} className="inline mr-2"/> Duration</span>
                    <span className="text-white">{selectedTrek.duration}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span><Gauge size={14} className="inline mr-2"/> Grade</span>
                    <span className="text-white">{selectedTrek.difficulty}</span>
                  </div>
                </div>

                <button 
                  onClick={() => currentUser ? setShowBookingForm(true) : setAlertConfig({show: true, title: 'Login Required', message: 'Please sign in.', type: 'error'})}
                  className="w-full bg-emerald-500 hover:bg-white hover:text-slate-900 py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl"
                >
                  Reserve Expedition
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GALLERY VIEW
  return (
    <div className="min-h-screen bg-white font-montserrat">
      <header className="bg-slate-950 text-white py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px]">Nepal Himalayas</span>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">Peak<br/>Trekking.</h1>
        </div>
        <Mountain size={500} className="absolute -bottom-20 -right-20 text-slate-900 opacity-50" />
      </header>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allTreks.map((trek) => (
            <div key={trek.id} className="group bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-700">
              <div className="h-96 overflow-hidden">
                <img src={trek.image} alt={trek.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="p-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-8 group-hover:text-emerald-600 transition-colors">{trek.title}</h3>
                <button onClick={() => setSelectedTrek(trek)} className="w-full bg-slate-50 hover:bg-emerald-600 hover:text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  Explore Expedition <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrekActivity;