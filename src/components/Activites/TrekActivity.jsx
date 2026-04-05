import React, { useState, useEffect } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mountain, ArrowRight, ChevronLeft, CheckCircle, 
  Loader2, X, Phone, Users, Clock, Gauge, Tent, CalendarDays
} from 'lucide-react';

import AlertModal from '../../utils/AlertModal';
import PackageCard from '../Cards/PackageCard'; 

const TrekActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allTreks, setAllTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ phone: '', travelDate: '', travelers: '1' });
  const [alertConfig, setAlertConfig] = useState({ show: false, type: 'success', title: '', message: '' });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    
    const q = query(collection(db, "activities"), where("category", "==", "trekking"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const treks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllTreks(treks);

      // Deep linking logic from Sightseeing
      if (id) {
        const found = treks.find(t => t.id === id);
        if (found) {
          setSelectedTrek(found);
        } else {
          setSelectedTrek(null);
          navigate('/activities/trekking'); 
        }
      } else {
        setSelectedTrek(null);
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, [id, navigate]);

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
      setAlertConfig({ show: true, type: 'warning', title: 'Action Required', message: 'Please select a date and enter your phone number.' });
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
        packageName: selectedTrek.title,
        packagePrice: selectedTrek.price,
        packageType: 'trekking',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setAlertConfig({ show: true, title: "Request Sent", message: "We have received your trekking request.", type: 'success' });
      setShowBookingForm(false);
    } catch (e) {
      setAlertConfig({ show: true, title: "Error", message: e.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  // --- DETAIL VIEW ---
  if (selectedTrek) {
    const details = selectedTrek.details || {};
    const highlights = details.highlights ? details.highlights.split('\n').filter(h => h.trim()) : [];
    const itinerarySteps = details.itinerary ? details.itinerary.split('\n').filter(s => s.trim()) : [];

    return (
      <div className="min-h-screen bg-white font-['Montserrat'] animate-in fade-in duration-700">
        <AlertModal 
          isOpen={alertConfig.show} 
          onConfirm={() => { 
            setAlertConfig({ ...alertConfig, show: false }); 
            if (alertConfig.type === 'success') handleBack(); 
          }} 
          {...alertConfig} 
        />

        {showBookingForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowBookingForm(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
              <button onClick={() => setShowBookingForm(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={24} /></button>
              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Confirm Expedition</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Phone size={10}/> Phone</label>
                  <input type="tel" maxLength="10" placeholder="98XXXXXXXX" className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><CalendarDays size={10}/> Start Date</label>
                    <input type="date" min={today} className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, travelDate: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Users size={10}/> Group</label>
                    <select className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setCustomerDetails({...customerDetails, travelers: e.target.value})}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} People</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleBookNow} disabled={isSubmitting} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all">
                  {isSubmitting ? "Processing..." : "Confirm Journey"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative h-[65vh] overflow-hidden">
          <button onClick={handleBack} className="absolute top-10 left-10 z-30 bg-white/20 backdrop-blur-xl p-4 rounded-full text-white hover:bg-white hover:text-emerald-600 transition-all">
            <ChevronLeft size={24} />
          </button>
          <img src={selectedTrek.image} className="w-full h-full object-cover" alt={selectedTrek.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30"></div>
          <div className="absolute bottom-16 left-10 md:left-24 animate-in slide-in-from-left duration-700">
            <span className="bg-emerald-500 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">Trekking Adventure</span>
            <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">{selectedTrek.title}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">Overview</h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{details.overview}</p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                  <CheckCircle size={20} className="text-emerald-500" />
                  <span className="text-[11px] font-black text-slate-700 uppercase">{h}</span>
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-10">Itinerary</h2>
              <div className="space-y-0">
                {itinerarySteps.map((step, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></div>
                      {i !== itinerarySteps.length - 1 && <div className="w-0.5 h-20 bg-slate-100 my-1"></div>}
                    </div>
                    <div className="pb-10">
                      <p className="text-sm font-black text-slate-800 uppercase">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <Tent size={150} className="absolute -bottom-10 -right-10 text-white/5" />
              <div className="relative z-10">
                <div className="mb-10">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Total Package</p>
                  <h3 className="text-5xl font-black tracking-tighter">Rs. {selectedTrek.price}</h3>
                </div>
                <div className="space-y-5 py-8 border-y border-white/10 mb-10">
                   <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2"><Clock size={14}/> Duration</span>
                    <span className="text-white">{details.duration || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2"><Gauge size={14}/> Difficulty</span>
                    <span className="text-emerald-400">{details.difficulty || 'Moderate'}</span>
                  </div>
                </div>
                <button onClick={() => currentUser ? setShowBookingForm(true) : navigate('/login')} className="w-full bg-emerald-500 hover:bg-white hover:text-slate-900 py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
                  Book Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="min-h-screen bg-white font-['Montserrat'] pb-32">
      <AlertModal isOpen={alertConfig.show} onConfirm={() => setAlertConfig({ ...alertConfig, show: false })} {...alertConfig} />

      <header className="py-28 px-10 bg-slate-950 text-white relative overflow-hidden">
        <Mountain size={400} className="absolute -bottom-20 -right-20 text-white/5" />
        <div className="relative z-10 max-w-4xl">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block">Himalayan Expeditions</span>
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.75]">Trekking<br/>Nepal.</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24">
        {/* Same Grid spacing as your PackageCard logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allTreks.map((trek) => (
            <div 
              key={trek.id} 
              onClick={() => handleTrekSelection(trek)} 
              className="cursor-pointer"
            >
              {/* Injecting PackageCard with Trek data */}
              <PackageCard data={{...trek, category: 'Trekking'}} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TrekActivity;