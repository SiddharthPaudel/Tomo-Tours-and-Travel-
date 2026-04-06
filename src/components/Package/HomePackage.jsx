import React, { useState, useEffect } from 'react';
import { db } from "../../services/firebase"; 
import { collection, query, limit, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import PackageCard from '../Cards/PackageCard';

const HomePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "activities"), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPackages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPackages(fetchedPackages);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
  );

  return (
    <section className="py-24 bg-white font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SIMPLIFIED HEADER */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 block">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">
              Best <span className="text-emerald-500">Packages</span>
            </h2>
          </div>

          {/* SIMPLER EXPLORE LINK */}
          <button 
            onClick={() => navigate('/PackagePage')}
            className="group flex items-center gap-2 text-slate-900 hover:text-emerald-600 transition-colors"
          >
            <span className="text-xs font-black uppercase tracking-widest">View All</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              onClick={() => navigate(`/activities/${pkg.category?.toLowerCase()}/${pkg.id}`)}
              className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
            >
              <PackageCard data={pkg} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePackages;