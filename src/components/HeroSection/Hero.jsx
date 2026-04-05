import React, { useState, useEffect } from 'react';
import { Search, MapPin, Compass, ChevronDown, Mountain, Waves, Footprints } from 'lucide-react';
import hero1 from "../../images/hero1.jpg";
import hero2 from "../../images/hero6.jpg";
import hero3 from "../../images/hero5.jpg";

const slides = [
  {
    image: hero1,
    title: "Adventure Awaits.",
    sub: "Book Your Next Great Story.",
    tag: "Mountain Treks"
  },
  {
    image: hero2,
    title: "Rush of the River.",
    sub: "Conquer Wild Currents Together.",
    tag: "White Water Rafting"
  },
  {
    image: hero3,
    title: "Pathways to Serenity.",
    sub: "Discover Nature's Best Kept Secrets.",
    tag: "Scenic Hiking"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState('Select Activity');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activities = [
    { name: 'Trekking', icon: <Mountain size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Rafting', icon: <Waves size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Hiking', icon: <Footprints size={16} />, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <section className="relative h-[80vh] md:h-[87vh] w-full overflow-hidden font-montserrat">
      
      {/* --- CINEMATIC CAROUSEL --- */}
      {slides.map((slide, index) => (
        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"}`}>
          <img 
            src={slide.image} 
            className={`w-full h-full object-cover transform transition-transform duration-[8000ms] ${index === current ? "scale-110" : "scale-100"}`} 
            alt="Travel Background" 
          />
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/50 via-transparent to-black/60"></div>
        </div>
      ))}

      {/* --- CONTENT AREA (Moved upwards using pt-32 and justify-start) --- */}
      <div className="relative z-10 h-full flex flex-col items-center justify-start text-center px-6 pt-32 md:pt-48">
        
        {/* Subtle Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-50 rounded">
            {slides[current].tag}
          </span>
        </div>

        {/* Headings */}
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-3 drop-shadow-lg">
          {slides[current].title.split('.')[0]}
          <span className="block text-emerald-400">{slides[current].title.split('.')[1]}</span>
        </h1>
        
        {/* Subtext - Reduced margin-bottom from mb-10 to mb-8 */}
        <p className="text-base md:text-lg text-gray-200 font-light tracking-wide max-w-xl mx-auto mb-8">
          {slides[current].sub}
        </p>

        {/* --- PROFESSIONAL SEARCH CARD (Lifted up) --- */}
        <div className="w-full max-w-4xl bg-white p-1.5 md:p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-1 transform md:-translate-y-2">
          
          <div className="w-full md:flex-1 flex items-center gap-3 px-5 py-2 md:border-r border-gray-100">
            <MapPin className="text-emerald-600 shrink-0" size={18} />
            <div className="text-left w-full">
              <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Destination</label>
              <input 
                type="text" 
                placeholder="Where to?" 
                className="w-full bg-transparent font-bold text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none" 
              />
            </div>
          </div>

          <div className="w-full md:flex-1 relative">
            <div 
              onClick={() => setActiveDropdown(activeDropdown === 'act' ? null : 'act')}
              className="flex items-center gap-3 px-5 py-2 md:border-r border-gray-100 cursor-pointer group"
            >
              <Compass className="text-emerald-600 shrink-0 group-hover:rotate-45 transition-transform" size={18} />
              <div className="text-left w-full">
                <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Activity</label>
                <div className="flex items-center justify-between">
                  <span className={`font-bold uppercase text-[12px] tracking-tight ${selectedActivity === 'Select Activity' ? 'text-slate-300' : 'text-slate-800'}`}>
                    {selectedActivity}
                  </span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform ${activeDropdown === 'act' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {activeDropdown === 'act' && (
              <div className="absolute top-[120%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                {activities.map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => { setSelectedActivity(item.name); setActiveDropdown(null); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-all group"
                  >
                    <div className={`p-1.5 rounded ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                    <span className="font-bold uppercase text-[10px] tracking-widest text-slate-700">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="w-full md:w-auto bg-emerald-600 hover:bg-slate-900 text-white px-8 py-4 rounded-xl md:rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95">
            <Search size={16} />
            Search
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 flex gap-2">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-emerald-500' : 'w-4 bg-white/20 hover:bg-white/40'}`} 
            />
          ))}
        </div>
      </div>

      {activeDropdown && <div className="fixed inset-0 z-0" onClick={() => setActiveDropdown(null)}></div>}
    </section>
  );
};

export default Hero;