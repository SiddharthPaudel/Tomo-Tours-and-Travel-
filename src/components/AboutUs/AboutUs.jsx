import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { Compass, Zap, Map, Heart, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import hero1 from "../../images/hero2.jpg";
import hero2 from "../../images/hero7.jpg";
import hero3 from "../../images/hero5.jpg";

const AboutUs = () => {
  const navigate = useNavigate(); // 2. Initialize navigate

  const values = [
    { icon: <ShieldCheck size={20} />, title: "Trusted Partner", desc: "Seamless & Managed." },
    { icon: <Zap size={20} />, title: "Expertly Crafted", desc: "Dreams into reality." },
    { icon: <Globe size={20} />, title: "Global & Local", desc: "Nepal and beyond." },
    { icon: <Heart size={20} />, title: "Tailored Journeys", desc: "Every detail matters." },
  ];

  return (
    <section className="py-20 px-6 bg-[#fcfcfc] font-montserrat overflow-hidden relative" id='about'>
      
      {/* Background Decorative Circles */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-slate-100 rounded-full blur-3xl -z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT SIDE: VISUAL COLLAGE */}
          <div className="w-full lg:w-1/2 relative flex justify-center">
            <div className="relative w-[80%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <img 
                src={hero3} 
                alt="Main trek" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -left-2 top-1/4 w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src={hero1} alt="Rafting" className="w-full h-full object-cover" />
            </div>

            <div className="absolute -right-2 bottom-10 w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src={hero2} alt="Camping" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* RIGHT SIDE: TEXT CONTENT */}
          <div className="w-full lg:w-1/2 text-left">
            <div className="inline-block px-3 py-1 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm mb-5">
              Welcome to Tomo Tours and Travel
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter leading-tight mb-6">
              Your Partner for <br/>
              <span className="text-emerald-600">Enriching Journeys</span>
            </h2>

            <div className="space-y-5 mb-10">
              <p className="text-slate-800 text-sm md:text-base font-bold leading-relaxed max-w-lg">
                At Tomo Tours and Travel, we specialize in transforming your travel dreams into reality with expertly crafted packages from Nepal and beyond.
              </p>
              
              <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
                We are a passionate team of experts dedicated to creating exceptional experiences—from breathtaking international expeditions to immersive local adventures.
              </p>
            </div>

            {/* ICON LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
              {values.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="bg-emerald-600 text-white p-2 rounded-full shadow-md transition-transform group-hover:scale-105">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider leading-none mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Added onClick handler */}
            <button 
              onClick={() => navigate('/packagepage')}
              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase text-[9px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
            >
              Explore Our Packages
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;