import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, Facebook, Twitter, Youtube, 
  Mail, Phone, MapPin, ArrowRight,
  ArrowUpRight, Globe, ShieldCheck, Award
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const destinations = [
    { name: 'Domestic', to: '/destinations/domestic' },
    { name: 'International', to: '/destinations/international' },
  ];

  const activities = [
    { name: 'Trek', to: '/activities/trek' },
    { name: 'Hiking', to: '/activities/hiking' },
    { name: 'Rafting', to: '/activities/rafting' },
  ];

  return (
    <footer className="bg-slate-900 pt-16 md:pt-24 pb-10 px-4 md:px-6 font-montserrat text-white border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* --- BALANCED TOP SECTION --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          
          {/* LEFT SIDE: TRUST BADGES (Fills the previous "empty" feeling) */}
          <div className="flex flex-wrap gap-8 lg:w-1/3">
            <div className="flex flex-col gap-2">
              <ShieldCheck className="text-emerald-500" size={28} />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-200">Secure Booking</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold">100% Managed & Safe</p>
            </div>
            <div className="flex flex-col gap-2">
              <Globe className="text-emerald-500" size={28} />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-200">Global Reach</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold">Over 50+ Destinations</p>
            </div>
            <div className="flex flex-col gap-2">
              <Award className="text-emerald-500" size={28} />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-200">Expert Guides</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold">Certified Professionals</p>
            </div>
          </div>

          {/* RIGHT SIDE: BRANDING & DESCRIPTION */}
          <div className="lg:w-1/2 lg:text-right flex flex-col lg:items-end space-y-6">
            <Link to="/" className="flex flex-col group w-fit lg:items-end">
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase group-hover:text-emerald-500 transition-colors">
                Tomo Tours and Travel
              </h2>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-emerald-500 mt-2">
                Consult and travel pvt ltd
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
              Your premier gateway to global exploration and expert travel consultancy. 
              We curate extraordinary journeys from the highest peaks to the wildest rivers, 
              ensuring every detail of your adventure is handled with expertise.
            </p>

            <div className="flex gap-4">
              {[<Instagram />, <Facebook />, <Twitter />, <Youtube />].map((icon, i) => (
                <a key={i} href="#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300">
                  {React.cloneElement(icon, { size: 16 })}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- LINKS SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-slate-800/50 pt-16">
          <FooterGroup title="Company">
            <FooterLink to="/" label="Home" />
            <FooterLink to="/about" label="About Us" />
            <FooterLink to="/visa-info" label="Visa Info" />
            <FooterLink to="/blogs" label="Blogs" />
            <FooterLink to="/gallery" label="Gallery" />
            <FooterLink to="/contact" label="Contact" />
          </FooterGroup>

          <FooterGroup title="Destinations">
            {destinations.map(item => <FooterLink key={item.name} to={item.to} label={item.name} />)}
          </FooterGroup>

          <FooterGroup title="Activities">
            {activities.map(item => <FooterLink key={item.name} to={item.to} label={item.name} />)}
          </FooterGroup>

          <FooterGroup title="Get In Touch">
            <div className="space-y-4 pt-1">
              <a href="tel:+97714XXXXXX" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors">
                <Phone size={14} className="text-emerald-500" /> +977 1-4XXXXXX
              </a>
              <a href="mailto:info@tomotours.com" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors">
                <Mail size={14} className="text-emerald-500" /> info@tomotours.com
              </a>
              <div className="flex items-start gap-3 text-slate-400 text-sm font-medium">
                <MapPin size={14} className="text-emerald-500 shrink-0" /> Thamel, Kathmandu, NP
              </div>
            </div>
          </FooterGroup>
        </div>

        {/* --- BOTTOM BAR & ATTRIBUTION --- */}
        <div className="border-t border-slate-800/50 pt-10 text-center relative z-10">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 group">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
              Architected By
            </span>
            <a 
              href="https://khudkila.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3.5 px-6 py-3 bg-white rounded-full border border-slate-100 hover:shadow-xl hover:shadow-emerald-950/10 transition-all duration-300 transform group-hover:-translate-y-1.5"
            >
              <img 
                src="/khudkila2.jpg" 
                alt="Khudkila Logo" 
                className="w-5 h-5 object-contain" 
              />
              <span className="text-slate-900 text-[11px] font-extrabold tracking-tight group-hover:text-emerald-600 transition-colors">
                Khudkila
              </span>
              <ArrowRight size={14} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="border-t border-slate-800/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em]">
              © {currentYear} Tomo Tours and Travel Consult and Travel Pvt Ltd.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterGroup = ({ title, children }) => (
  <div className="space-y-6">
    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.35em] border-l-2 border-emerald-500 pl-3">{title}</h4>
    <div className="flex flex-col space-y-3.5">{children}</div>
  </div>
);

const FooterLink = ({ label, to }) => (
  <Link to={to} className="group flex items-center text-sm font-bold text-slate-400 hover:text-white transition-all w-fit">
    <span className="group-hover:translate-x-1 transition-transform">{label}</span>
    <ArrowUpRight size={12} className="ml-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-emerald-500" />
  </Link>
);

export default Footer;