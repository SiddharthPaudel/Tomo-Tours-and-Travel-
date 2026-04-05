import React from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Clock } from 'lucide-react';
import hero1 from "../../images/hero2.jpg";
const ContactPage = () => {
  return (
    <div className="bg-white font-montserrat" id='contact'>
      {/* --- HERO HEADER --- */}
      <section className="bg-slate-900 py-20 px-6 text-center">
        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
          Get In Touch
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
          Let’s Plan Your <br/> <span className="text-emerald-400">Next Story.</span>
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- LEFT SIDE: CONTACT INFO (4 Columns) --- */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-6">
                Contact <span className="text-emerald-600">Details</span>
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Have questions about a trek or want a custom itinerary? Our adventure experts are ready to help.
              </p>
              
              <div className="space-y-6">
                <ContactDetail 
                  icon={<Phone size={20} />} 
                  label="Call Us" 
                  value="+1 800-TORNO-TR" 
                />
                <ContactDetail 
                  icon={<Mail size={20} />} 
                  label="Email Us" 
                  value="expeditions@tornotours.com" 
                />
                <ContactDetail 
                  icon={<MapPin size={20} />} 
                  label="Base Camp" 
                  value="123 Adventure Way, Kathmandu, Nepal" 
                />
                <ContactDetail 
                  icon={<Clock size={20} />} 
                  label="Office Hours" 
                  value="Mon - Sat: 9:00 AM - 6:00 PM" 
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Follow the journey</p>
              <div className="flex gap-4">
                {[<Instagram />, <Facebook />, <Twitter />].map((icon, i) => (
                  <a key={i} href="#" className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-emerald-600 hover:text-white transition-all">
                    {React.cloneElement(icon, { size: 18 })}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: CONTACT FORM (8 Columns) --- */}
          <div className="lg:col-span-8 bg-slate-50 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Interested Activity</label>
                <select className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                  <option>Trekking</option>
                  <option>Hiking</option>
                  <option>Rafting</option>
                  <option>Custom Tour</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <input type="tel" placeholder="+1 234 567 890" className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                <textarea rows="5" placeholder="Tell us about your dream trip..." className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
              </div>

              <div className="md:col-span-2 pt-4">
                <button className="flex items-center justify-center gap-3 bg-emerald-600 text-white w-full md:w-auto px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100 active:scale-95">
                  Send Message <Send size={14} />
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
      
      {/* Map Placeholder */}
      {/* <section className="h-[400px] w-full bg-slate-200 grayscale hover:grayscale-0 transition-all duration-700">
         <iframe 
            src="http://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.4934335541!2d85.25609355480584!3d27.70881180295191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu!5e0!3m2!1sen!2snp!4v1700000000000" 
            width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy">
         </iframe>
      </section> */}
    </div>
  );
};

// Helper Component
const ContactDetail = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default ContactPage;