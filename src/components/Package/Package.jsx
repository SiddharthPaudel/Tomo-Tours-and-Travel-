import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../../services/firebase"; 
import { collection, query, onSnapshot } from 'firebase/firestore';
import { 
  Loader2, Compass, Search, Filter, Plane, Map, 
  Waves, Mountain, Footprints, Camera, Globe 
} from 'lucide-react';
import PackageCard from '../Cards/PackageCard'; 

const Packages = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Offers', icon: <Compass size={16} /> },
    { id: 'international', label: 'International', icon: <Globe size={16} /> },
    { id: 'domestic', label: 'Domestic', icon: <Map size={16} /> },
    { id: 'sightseeing', label: 'Sightseeing', icon: <Camera size={16} /> },
    { id: 'trekking', label: 'Trekking', icon: <Mountain size={16} /> },
    { id: 'hiking', label: 'Hiking', icon: <Footprints size={16} /> },
    { id: 'rafting', label: 'Rafting', icon: <Waves size={16} /> },
  ];

  useEffect(() => {
    // 1. Define queries for both collections
    const activitiesQ = query(collection(db, "activities"));
    const destinationsQ = query(collection(db, "destinations"));

    let activitiesData = [];
    let destinationsData = [];

    // 2. Listener for Activities (Sightseeing, Hiking, etc.)
    const unsubscribeActivities = onSnapshot(activitiesQ, (snapshot) => {
      activitiesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        source: 'activities' // Flag to track origin
      }));
      combineData();
    });

    // 3. Listener for Destinations (Domestic & International)
    const unsubscribeDestinations = onSnapshot(destinationsQ, (snapshot) => {
      destinationsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data, 
          // Map "type" from destinations to "category" for the filter logic
          category: data.type || data.category || 'domestic', 
          source: 'destinations'
        };
      });
      combineData();
    });

    // 4. Helper to merge both arrays and stop loading
    const combineData = () => {
      const merged = [...activitiesData, ...destinationsData];
      setAllPackages(merged);
      setLoading(false);
    };

    return () => {
      unsubscribeActivities();
      unsubscribeDestinations();
    };
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = allPackages;

    if (activeCategory !== 'all') {
      result = result.filter(pkg => pkg.category?.toLowerCase() === activeCategory);
    }

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter(pkg => 
        pkg.title?.toLowerCase().includes(term) ||
        pkg.name?.toLowerCase().includes(term) || // Destinations might use 'name' instead of 'title'
        pkg.location?.toLowerCase().includes(term)
      );
    }

    setFilteredPackages(result);
  }, [activeCategory, searchQuery, allPackages]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-['Montserrat'] pb-20">
      <header className="relative pt-32 pb-20 px-6 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/10 skew-x-12 translate-x-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block underline decoration-emerald-500/30 underline-offset-4">
            Premium Selection
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            Our Best <br /> <span className="text-emerald-500">Packages.</span>
          </h1>
          
          <div className="relative max-w-2xl mt-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              className="w-full pl-16 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 py-4">
          <Filter size={16} className="text-slate-400 mr-4 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                onClick={() => navigate(`/activities/${pkg.category.toLowerCase()}/${pkg.id}`)} 
                className="cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              >
                 <PackageCard data={pkg} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center text-slate-400 uppercase font-black tracking-widest text-xs">
            No packages found in this category
          </div>
        )}
      </main>
    </div>
  );
};

export default Packages;