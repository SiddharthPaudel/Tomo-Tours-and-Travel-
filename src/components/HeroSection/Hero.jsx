import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Compass, ChevronDown, Mountain, Waves, 
  Footprints, Globe, Home, Plane, Users, Plus, Minus, Map, ArrowRightLeft
} from 'lucide-react';
import hero1 from "../../images/hero1.jpg";
import hero2 from "../../images/hero6.jpg";
import hero3 from "../../images/hero5.jpg";

const slides = [
  { image: hero1, title: "Adventure Awaits.", sub: "Crafting bespoke journeys across the Himalayas." },
  { image: hero2, title: "Rush of the River.", sub: "Premium rafting experiences on wild currents." },
  { image: hero3, title: "Pathways to Serenity.", sub: "Discover the world's most secluded sanctuaries." }
];

const Hero = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null); 
  
  const [selectedDest, setSelectedDest] = useState('Select Region');
  const [selectedActivity, setSelectedActivity] = useState('Select Activity');
  const [flightType, setFlightType] = useState('Round Trip');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const flightOptions = ['Round Trip', 'One Way'];
  const destinations = [{ name: 'Domestic', icon: <Home size={14} /> }, { name: 'International', icon: <Globe size={14} /> }];
  const activities = [{ name: 'Trekking', icon: <Mountain size={14} /> }, { name: 'Rafting', icon: <Waves size={14} /> }, { name: 'Hiking', icon: <Footprints size={14} /> }, { name: 'Sightseeing', icon: <Map size={14} /> }];

  const handleSearch = () => {
    const activityPath = selectedActivity !== 'Select Activity' ? selectedActivity.toLowerCase() : 'sightseeing';
    navigate(`/activities/${activityPath}?guests=${guests}&type=${flightType.toLowerCase()}`);
  };

  return (
    <section className="relative h-[85vh] w-full overflow-hidden font-['Montserrat'] bg-slate-900">
      
      {/* --- BACKGROUND --- */}
      {slides.map((slide, index) => (
        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-xl">
          {slides[current].title}
        </h1>
        <p className="text-sm md:text-base text-gray-200 font-medium mb-12 max-w-xl opacity-90 tracking-wide">
          {slides[current].sub}
        </p>

        {/* --- SEARCH BAR --- */}
        <div className="w-full max-w-6xl bg-white p-1.5 rounded-full shadow-2xl flex flex-col md:flex-row items-center border border-slate-100">
          
          {/* Flight Type Field (Green Branding) */}
          <div className="relative border-r border-slate-100">
            <div 
              onClick={() => setActiveDropdown(activeDropdown === 'flight' ? null : 'flight')}
              className="flex items-center gap-3 px-6 py-2.5 hover:bg-slate-50 cursor-pointer rounded-full transition-all"
            >
              <Plane size={15} className="text-emerald-600 -rotate-12" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600/60 mb-1">Flights</span>
                <span className="font-bold text-[11px] text-emerald-600 uppercase tracking-tight">{flightType}</span>
              </div>
              <ChevronDown size={10} className="text-emerald-300" />
            </div>

            {activeDropdown === 'flight' && (
              <div className="absolute top-[125%] left-0 w-48 bg-white rounded-2xl border border-slate-100 shadow-2xl p-1 z-50">
                {flightOptions.map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => { setFlightType(opt); setActiveDropdown(null); }}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-emerald-50 rounded-xl text-left transition-all"
                  >
                    <ArrowRightLeft size={12} className="text-emerald-600" />
                    <span className="font-bold uppercase text-[10px] tracking-widest text-slate-700">{opt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination Field */}
          <div className="w-full md:flex-1 relative border-r border-slate-100">
            <div 
              onClick={() => setActiveDropdown(activeDropdown === 'dest' ? null : 'dest')}
              className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50 cursor-pointer transition-all rounded-full"
            >
              <div className="flex items-center gap-3 text-left overflow-hidden">
                <MapPin size={15} className="text-emerald-600 shrink-0" />
                <div className="flex flex-col leading-none">
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-1">Where to?</span>
                  <span className={`font-bold truncate text-[11px] tracking-tight ${selectedDest === 'Select Region' ? 'text-slate-300' : 'text-slate-800'}`}>
                    {selectedDest}
                  </span>
                </div>
              </div>
              <ChevronDown size={12} className="text-slate-300" />
            </div>

            {activeDropdown === 'dest' && (
              <div className="absolute top-[125%] left-0 w-full bg-white rounded-2xl border border-slate-100 shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-1">
                {destinations.map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => { setSelectedDest(item.name); setActiveDropdown(null); }}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-emerald-50 rounded-xl text-left transition-all"
                  >
                    <div className="p-1.5 bg-slate-50 text-emerald-600 rounded-lg">{item.icon}</div>
                    <span className="font-bold uppercase text-[10px] tracking-widest text-slate-700">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Activity Field */}
          <div className="w-full md:flex-1 relative border-r border-slate-100">
            <div 
              onClick={() => setActiveDropdown(activeDropdown === 'act' ? null : 'act')}
              className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50 cursor-pointer transition-all rounded-full"
            >
              <div className="flex items-center gap-3 text-left overflow-hidden">
                <Compass size={15} className="text-emerald-600 shrink-0" />
                <div className="flex flex-col leading-none">
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-1">Activity</span>
                  <span className={`font-bold truncate text-[11px] tracking-tight ${selectedActivity === 'Select Activity' ? 'text-slate-300' : 'text-slate-800'}`}>
                    {selectedActivity}
                  </span>
                </div>
              </div>
              <ChevronDown size={12} className="text-slate-300" />
            </div>

            {activeDropdown === 'act' && (
              <div className="absolute top-[125%] left-0 w-full bg-white rounded-2xl border border-slate-100 shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-1">
                {activities.map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => { setSelectedActivity(item.name); setActiveDropdown(null); }}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-emerald-50 rounded-xl text-left transition-all"
                  >
                    <div className="p-1.5 bg-slate-50 text-emerald-600 rounded-lg">{item.icon}</div>
                    <span className="font-bold uppercase text-[10px] tracking-widest text-slate-700">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guests Count */}
          <div className="w-full md:w-36 flex items-center justify-between px-5 py-2.5">
            <div className="flex items-center gap-3">
              <Users size={15} className="text-emerald-600" />
              <span className="font-bold text-[11px] text-slate-800">{guests}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-1 hover:text-emerald-600 text-slate-300 transition-colors"><Minus size={12}/></button>
              <button onClick={() => setGuests(guests + 1)} className="p-1 hover:text-emerald-600 text-slate-300 transition-colors"><Plus size={12}/></button>
            </div>
          </div>

          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-emerald-600 hover:bg-slate-900 text-white px-9 py-3 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Search size={14} strokeWidth={3} />
            Search
          </button>
        </div>

      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-10 flex gap-2 w-full justify-center">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-700 ${i === current ? 'w-10 bg-emerald-500' : 'w-4 bg-white/20'}`} 
          />
        ))}
      </div>

      {activeDropdown && <div className="fixed inset-0 z-0" onClick={() => setActiveDropdown(null)}></div>}
    </section>
  );
};

export default Hero;