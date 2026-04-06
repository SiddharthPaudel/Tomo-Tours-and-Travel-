import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Clock } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Direct Firebase Auth
import { db } from "../../services/firebase";
import AlertModal from '../../utils/AlertModal';

const ContactPage = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    activity: 'Trekking',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // 1. Sync Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData(prev => ({
          ...prev, 
          fullName: currentUser.displayName || '', 
          email: currentUser.email || '' 
        }));
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. THE GUARD: Check if user is logged in ONLY on click
    if (!user) {
      setModalConfig({
        isOpen: true,
        type: 'warning', // Or 'error' based on your Modal types
        title: 'Authentication Required',
        message: 'Please sign in to your Tomo Tours account to send this inquiry. This helps us provide you with personalized support.',
        confirmText: 'Sign In Now'
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        userId: user.uid,
        status: 'unread',
        createdAt: serverTimestamp()
      });

      setLoading(false);
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Message Dispatched',
        message: 'Base camp has received your transmission. Our experts will contact you shortly.',
        confirmText: 'Great!'
      });
      setFormData(prev => ({ ...prev, message: '' }));
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white font-montserrat relative" id='contact'>
      
      {/* UNIVERSAL MODAL FOR SUCCESS & AUTH WARNING */}
      <AlertModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        onConfirm={() => {
          setModalConfig({ ...modalConfig, isOpen: false });
          if (!user) window.location.href = '/login'; // Redirect if they weren't logged in
        }}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      {/* --- HERO HEADER --- */}
      <section className="bg-slate-900 py-20 px-6 text-center">
        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
          Get In Touch
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
          Let’s Plan Your <br/> <span className="text-emerald-400 italic">Next Story.</span>
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- LEFT SIDE: CONTACT INFO --- */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-6">
                Contact <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8">Details</span>
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                Have questions about a trek or want a custom itinerary? Our adventure experts are ready to help.
              </p>
              
              <div className="space-y-6">
                <ContactDetail icon={<Phone size={20} />} label="Call Us" value="+1 800-TORNO-TR" />
                <ContactDetail icon={<Mail size={20} />} label="Email Us" value="expeditions@tornotours.com" />
                <ContactDetail icon={<MapPin size={20} />} label="Base Camp" value="123 Adventure Way, Kathmandu, Nepal" />
                <ContactDetail icon={<Clock size={20} />} label="Office Hours" value="Mon - Sat: 9:00 AM - 6:00 PM" />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Follow the journey</p>
              <div className="flex gap-4">
                {[<Instagram />, <Facebook />, <Twitter />].map((icon, i) => (
                  <a key={i} href="#" className="p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-emerald-600 hover:text-white transition-all border border-slate-100">
                    {React.cloneElement(icon, { size: 18 })}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: CONTACT FORM (Always Visible) --- */}
          <div className="lg:col-span-8 bg-slate-50 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Activity</label>
                <select 
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none outline-none"
                >
                  <option>Trekking</option>
                  <option>Hiking</option>
                  <option>Rafting</option>
                  <option>Custom Tour</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890" 
                  className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                <textarea 
                  name="message"
                  required
                  rows="5" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your dream trip..." 
                  className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                ></textarea>
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  disabled={loading}
                  type="submit"
                  className={`flex items-center justify-center gap-3 bg-emerald-600 text-white w-full md:w-auto px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-emerald-100 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-900 active:scale-95'}`}
                >
                  {loading ? 'Sending...' : 'Send Message'} <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Component
const ContactDetail = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-1">
    <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl shadow-sm border border-emerald-100">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <p className="text-sm font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default ContactPage;