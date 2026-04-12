import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass, ChevronDown, Mountain, Waves, Footprints, Globe, Home } from 'lucide-react';
import hero1 from "../../images/hero1.jpg";
import hero2 from "../../images/hero6.jpg";
import hero3 from "../../images/hero5.jpg";

const slides = [
  { image: hero1, title: "Adventure Awaits.", sub: "Book Your Next Great Story.", tag: "Mountain Treks" },
  { image: hero2, title: "Rush of the River.", sub: "Conquer Wild Currents Together.", tag: "White Water Rafting" },
  { image: hero3, title: "Pathways to Serenity.", sub: "Discover Nature's Best Kept Secrets.", tag: "Scenic Hiking" }
];

const Hero = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'dest' or 'act'
  
  // Search State
  const [selectedDest, setSelectedDest] = useState('Select Region');
  const [selectedActivity, setSelectedActivity] = useState('Select Activity');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const destinations = [
    { name: 'Domestic', icon: <Home size={16} />, path: '/destinations/domestic' },
    { name: 'International', icon: <Globe size={16} />, path: '/destinations/international' },
  ];

  const activities = [
    { name: 'Trekking', icon: <Mountain size={16} />, path: '/activities/trekking' },
    { name: 'Rafting', icon: <Waves size={16} />, path: '/activities/rafting' },
    { name: 'Hiking', icon: <Footprints size={16} />, path: '/activities/hiking' },
    { name: 'Sightseeing', icon: <Compass size={16} />, path: '/activities/sightseeing' },
  ];

  // --- FINAL SEARCH HANDLER ---
  const handleSearch = () => {
    // 1. If Activity is selected, prioritize that path
    if (selectedActivity !== 'Select Activity') {
      const act = activities.find(a => a.name === selectedActivity);
      if (act) return navigate(act.path);
    }

    // 2. Otherwise, check Destination
    if (selectedDest !== 'Select Region') {
      const dest = destinations.find(d => d.name === selectedDest);
      if (dest) return navigate(dest.path);
    }

    // 3. Fallback
    navigate('/activities/sightseeing');
  };

  return (
    <section className="relative h-[80vh] md:h-[87vh] w-full overflow-hidden font-['Montserrat']">
      
      {/* --- CAROUSEL --- */}
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

      <div className="relative z-10 h-full flex flex-col items-center justify-start text-center px-6 pt-32 md:pt-48">
        
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-50 rounded">
            {slides[current].tag}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-3 drop-shadow-lg">
          {slides[current].title.split('.')[0]}
          <span className="block text-emerald-400">{slides[current].title.split('.')[1]}</span>
        </h1>
        
        <p className="text-base md:text-lg text-gray-200 font-light tracking-wide max-w-xl mx-auto mb-8">
          {slides[current].sub}
        </p>

        {/* --- DUAL DROPDOWN SEARCH CARD --- */}
        <div className="w-full max-w-4xl bg-white p-1.5 md:p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-1 transform md:-translate-y-2">
          
          {/* Destination Dropdown */}
          <div className="w-full md:flex-1 relative">
            <div 
              onClick={() => setActiveDropdown(activeDropdown === 'dest' ? null : 'dest')}
              className="flex items-center gap-3 px-5 py-2 md:border-r border-gray-100 cursor-pointer group"
            >
              <MapPin className="text-emerald-600 shrink-0" size={18} />
              <div className="text-left w-full">
                <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Destination</label>
                <div className="flex items-center justify-between">
                  <span className={`font-bold uppercase text-[12px] tracking-tight ${selectedDest === 'Select Region' ? 'text-slate-300' : 'text-slate-800'}`}>
                    {selectedDest}
                  </span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform ${activeDropdown === 'dest' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {activeDropdown === 'dest' && (
              <div className="absolute top-[120%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                {destinations.map((item) => (
                  <button 
                    key={item.name}
                    type="button"
                    onClick={() => { setSelectedDest(item.name); setActiveDropdown(null); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-all group text-left"
                  >
                    <div className="p-1.5 rounded bg-slate-50 text-emerald-600 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <span className="font-bold uppercase text-[10px] tracking-widest text-slate-700">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Activity Dropdown */}
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
                    type="button"
                    onClick={() => { setSelectedActivity(item.name); setActiveDropdown(null); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-all group text-left"
                  >
                    <div className="p-1.5 rounded bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <span className="font-bold uppercase text-[10px] tracking-widest text-slate-700">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-emerald-600 hover:bg-slate-900 text-white px-8 py-4 rounded-xl md:rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Search size={16} />
            Search
          </button>
        </div>

        {/* Indicators */}
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