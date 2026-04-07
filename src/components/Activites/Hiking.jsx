import React, { useState, useEffect } from 'react';
import { db, auth } from "../../services/firebase"; 
import { collection, query, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Footprints, Clock, ArrowRight, 
  CheckCircle, ChevronLeft, Mountain, Loader2, Send,
  X, Phone, CalendarDays, Users, Info, MapPin,XCircle
} from 'lucide-react';

import AlertModal from '../../utils/AlertModal';
import PackageCard from '../Cards/PackageCard'; 

const HikingActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // --- DATA SYNC ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const q = query(collection(db, "activities"), where("category", "==", "hiking"));
    
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const hikeData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllHikes(hikeData);

      // Deep linking logic
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

  // --- NAVIGATION HELPERS ---
  const handleBack = () => {
    setSelectedHike(null);
    navigate('/activities/hiking'); 
  };

  const handleHikeSelection = (hike) => {
    setSelectedHike(hike);
    navigate(`/activities/hiking/${hike.id}`);
  };

  // --- BOOKING LOGIC ---
  const handleFinalBooking = async () => {
    const phoneRegex = /^9\d{9}$/;

    if (!customerDetails.phone || !customerDetails.travelDate) {
      setAlertConfig({ 
        show: true, type: 'warning', title: 'Missing Info', 
        message: 'Please provide a contact number and preferred date.' 
      });
      return;
    }

    if (!phoneRegex.test(customerDetails.phone)) {
      setAlertConfig({ 
        show: true, type: 'error', title: 'Invalid Phone', 
        message: 'Please enter a valid 10-digit mobile number starting with 9.' 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingPayload = {
        userId: currentUser?.uid || 'guest',
        userName: currentUser?.displayName || 'Traveler',
        userEmail: currentUser?.email || 'N/A',
        phone: customerDetails.phone,
        travelDate: customerDetails.travelDate, 
        travelers: customerDetails.travelers,
        packageName: selectedHike.title,
        packagePrice: selectedHike.price,
        packageType: 'hiking',
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "bookings"), bookingPayload);

      setAlertConfig({
        show: true, title: "Expedition Reserved!",
        message: `We've received your request for ${selectedHike.title}. Our team will contact you at ${customerDetails.phone} soon.`, 
        type: 'success'
      });
      
      setShowBookingForm(false);
    } catch (e) {
      setAlertConfig({ 
        show: true, title: "Error", message: "Failed to process reservation.", type: 'error' 
      });
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const parseList = (text) => text ? text.split('\n').map(item => item.replace('·', '').trim()).filter(i => i !== "") : [];

// --- STEP-WISE ITINERARY RENDERER (ENHANCED) ---
const renderItinerary = (text) => {
    if (!text) return <p className="text-slate-400 italic">Itinerary details loading...</p>;
    
    // Split by newlines and filter out empty strings to get the steps
    const itinerarySteps = text.split('\n').filter(s => s.trim());

    return (
      <section>
        <div className="space-y-0">
          {itinerarySteps.map((step, i) => (
            <div key={i} className="flex gap-8 group">
              <div className="flex flex-col items-center">
                {/* The Ring Marker */}
                <div className="w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 flex-shrink-0"></div>
                
                {/* The Vertical Line (only show if not the last item) */}
                {i !== itinerarySteps.length - 1 && (
                  <div className="w-0.5 h-20 bg-slate-100 my-1 group-hover:bg-emerald-100 transition-colors"></div>
                )}
              </div>
              
              <div className="pb-10">
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Trails...</p>
    </div>
  );

  // --- DETAIL VIEW ---
  if (selectedHike) {
    const details = selectedHike.details || {};
    const highlights = parseList(details.highlights || selectedHike.highlights);
    const includes = parseList(details.costIncludes || selectedHike.costIncludes);
    const excludes = parseList(details.costExcludes || selectedHike.costExcludes);

    return (
      <div className="min-h-screen bg-white font-montserrat pb-20 animate-in fade-in duration-500">
        <AlertModal 
          isOpen={alertConfig.show} 
          onConfirm={() => { 
            setAlertConfig({ ...alertConfig, show: false }); 
            if (alertConfig.type === 'success') handleBack(); 
          }}
          {...alertConfig} 
        />

        {showBookingForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowBookingForm(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
              <button onClick={() => setShowBookingForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={20}/></button>
              <div className="mb-8">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Reservation</span>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mt-1">Trip Details</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone size={12}/> Mobile Number</label>
                  <input type="tel" maxLength="10" placeholder="98XXXXXXXX" className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-emerald-500/20" onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2"><CalendarDays size={12}/> Preferred Date</label>
                  <input type="date" min={today} className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-emerald-500/20" onChange={(e) => setCustomerDetails({...customerDetails, travelDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2"><Users size={12}/> Travelers</label>
                  <select className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-emerald-500/20 appearance-none" onChange={(e) => setCustomerDetails({...customerDetails, travelers: e.target.value})}>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>)}
                  </select>
                </div>
                <button onClick={handleFinalBooking} disabled={isSubmitting} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <><Send size={14}/> Confirm Expedition</>}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative h-[65vh] w-full">
          <button onClick={handleBack} className="absolute top-8 left-8 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl"><ChevronLeft size={24} /></button>
          <img src={selectedHike.image} alt={selectedHike.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20"></div>
          <div className="absolute bottom-12 left-8 md:left-20 text-white">
             <span className="bg-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">Scenic Hiking</span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">{selectedHike.title}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-20">
            <section>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4 flex items-center gap-3"><Info size={24} className="text-emerald-600"/> Overview</h2>
              <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{details.overview || selectedHike.overview}</p>
            </section>

            <section className="py-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl"><MapPin size={24} /></div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">The Journey</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route details</p>
                </div>
              </div>
              {renderItinerary(details.itinerary || selectedHike.itinerary)}
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-8 text-center">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                    <CheckCircle size={18} className="text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                                    <CheckCircle size={16} /> Cost Includes
                                  </h3>
                  <ul className="space-y-3">{includes.map((item, i) => <li key={i} className="text-[10px] font-bold text-slate-600 flex items-center gap-3 uppercase tracking-wide"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> {item}</li>)}</ul>
                </div>
                <div className="space-y-6">
                 <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <XCircle size={16} /> Cost Excludes
                </h3>
                  <ul className="space-y-3">{excludes.map((item, i) => <li key={i} className="text-[10px] font-bold text-slate-500 flex items-center gap-3 uppercase tracking-wide italic"><div className="w-1.5 h-1.5 bg-red-400 rounded-full"/> {item}</li>)}</ul>
                </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black tracking-tighter text-emerald-400">{selectedHike.price}</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">/ Person</span>
                </div>
                <div className="space-y-4 mb-10 pt-8 border-t border-slate-800">
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest"><span className="flex items-center gap-3"><Clock size={16} className="text-emerald-500"/> Duration</span><span>{details.duration || selectedHike.duration}</span></div>
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest"><span className="flex items-center gap-3"><Mountain size={16} className="text-emerald-500"/> Max Alt.</span><span>{details.elevation || selectedHike.elevation}</span></div>
                </div>
                <button 
                  onClick={() => currentUser ? setShowBookingForm(true) : navigate('/login')} 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95"
                >
                  Reserve Expedition
                </button>
              </div>
              <Footprints size={200} className="absolute -bottom-10 -right-10 text-emerald-600 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="min-h-screen bg-white font-montserrat pb-20">
      <AlertModal isOpen={alertConfig.show} onConfirm={() => setAlertConfig({ ...alertConfig, show: false })} {...alertConfig} />
      <section className="bg-emerald-900 text-white py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px]">Nepal Getaways</span>
          <h1 className="text-6xl md:text-8xl font-black mt-4 mb-6 tracking-tighter uppercase leading-[0.85]">Scenic<br/>Hikes</h1>
        </div>
        <Footprints size={450} className="absolute -bottom-20 -right-20 text-emerald-800 opacity-20" />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allHikes.map((hike) => (
            <div key={hike.id} onClick={() => handleHikeSelection(hike)} className="cursor-pointer">
              <PackageCard data={{...hike, category: 'Hiking'}} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HikingActivity;