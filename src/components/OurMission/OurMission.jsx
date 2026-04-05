import React from 'react';
import { 
  Target, CheckCircle2, Globe2, ShieldCheck, 
  Clock, Banknote, MapPin, Sparkles, 
  Mountain, Plane, HeartHandshake, Zap
} from 'lucide-react';

const Mission = () => {
  const reasons = [
    {
      icon: <Sparkles size={22} />,
      title: "Personalized Experiences",
      desc: "Customized itineraries designed around your specific interests, budget, and travel style."
    },
    {
      icon: <Target size={22} />,
      title: "Expert Local Guides",
      desc: "Professional and knowledgeable guides who ensure authentic and enriching experiences."
    },
    {
      icon: <Banknote size={22} />,
      title: "Transparent Pricing",
      desc: "Affordable rates with no hidden costs—just honest pricing with the best value for your money."
    },
    {
      icon: <Clock size={22} />,
      title: "24/7 Customer Support",
      desc: "Round-the-clock assistance for a smooth, worry-free, and seamless journey."
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Trusted & Reliable",
      desc: "A reputation built on consistent customer satisfaction and successful travel history."
    },
    {
      icon: <HeartHandshake size={22} />,
      title: "Safe & Comfortable",
      desc: "Your safety and comfort are our top priorities at every single step of your journey."
    }
  ];

  const pillars = [
    "Experiencing Cultures",
    "Natural Beauty",
    "Lifelong Memories",
    "Meaningful Connections"
  ];

  const destinations = [
    "Nepal Tours", "Everest Helicopter", "Adventure Treks", "Dubai", 
    "Thailand", "Europe", "Japan", "Bali"
  ];

  return (
    <section className="py-24 px-6 bg-white font-montserrat" id="mission">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER: THE CORE MISSION --- */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-24 border-b border-slate-100 pb-16">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-sm mb-6">
              Our Strategic Mission
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-[1.1] mb-6">
              Easy, Affordable & <br/>
              <span className="text-emerald-600">Truly Unforgettable.</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              We believe travel is more than just visiting destinations—it's about connecting with the world in meaningful ways. With Tomo GlobeWise, every trip becomes a story worth telling.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            {pillars.map((text, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- GRID: WHY CHOOSE TOMO GLOBEWISE --- */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-16">
            <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter shrink-0">
              Why Choose Tomo GlobeWise?
            </h3>
            <div className="h-[1px] w-full bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {reasons.map((reason, index) => (
              <div key={index} className="group relative">
                {/* Icon Box */}
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm shadow-emerald-100">
                  {reason.icon}
                </div>
                
                {/* Text Content */}
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">
                  {reason.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight opacity-90 max-w-[280px]">
                  {reason.desc}
                </p>

                {/* Subtle border for separation on mobile */}
                <div className="absolute -bottom-5 left-0 w-12 h-[2px] bg-slate-100 lg:hidden"></div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FOOTER: DESTINATIONS & CONFIDENCE --- */}
        

      </div>
    </section>
  );
};

export default Mission;