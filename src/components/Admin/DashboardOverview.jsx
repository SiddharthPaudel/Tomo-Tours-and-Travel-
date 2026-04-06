import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Map, 
  Briefcase, 
  Globe, 
  Clock, 
  CheckCircle2, 
  PlaneTakeoff,
  ChevronRight,
  Activity
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../services/firebase";

// --- Sub-Component: Enhanced StatCard ---
const StatCard = ({ title, value, icon: Icon, colorClass, description }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl ${colorClass} transition-transform group-hover:scale-110`}>
        <Icon size={24} />
      </div>
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
      {description && <p className="text-slate-400 text-[10px] mt-2 font-medium">{description}</p>}
    </div>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    domesticDest: 0,
    intlDest: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    loading: true
  });

  useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const [activitiesSnap, destinationsSnap, bookingsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "activities")),
          getDocs(collection(db, "destinations")),
          getDocs(collection(db, "bookings")),
          getDocs(collection(db, "users"))
        ]);

        const destData = destinationsSnap.docs.map(doc => doc.data());
        const bookingsData = bookingsSnap.docs.map(doc => doc.data());
        const userData = usersSnap.docs.map(doc => doc.data());

        setStats({
          totalUsers: userData.filter(u => u.role?.toLowerCase() === 'user').length,
          totalActivities: activitiesSnap.size,
          domesticDest: destData.filter(d => d.type?.toLowerCase() === 'domestic').length,
          intlDest: destData.filter(d => d.type?.toLowerCase().includes('internation')).length,
          pendingBookings: bookingsData.filter(b => b.status?.toLowerCase() === 'pending').length,
          confirmedBookings: bookingsData.filter(b => b.status?.toLowerCase() === 'confirmed').length,
          loading: false
        });
      } catch (error) {
        console.error("Firestore Sync Error:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    getFirebaseData();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 w-full h-full border-4 border-emerald-100 rounded-full"></div>
          <div className="absolute top-0 w-full h-full border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Initializing Dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-['Montserrat'] max-w-[1400px] mx-auto p-4">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Admin Overview</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Live snapshot of Tomo Tours operations.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Real-time DB</span>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value={stats.totalUsers} 
          icon={Users} 
          colorClass="bg-blue-50 text-blue-600"
          description="Registered travelers"
        />
        <StatCard 
          title="All Activities" 
          value={stats.totalActivities} 
          icon={Activity} 
          colorClass="bg-violet-50 text-violet-600"
          description="Global tour options"
        />
        <StatCard 
          title="Domestic" 
          value={stats.domesticDest} 
          icon={PlaneTakeoff} 
          colorClass="bg-orange-50 text-orange-600"
          description="Local destinations"
        />
        <StatCard 
          title="International" 
          value={stats.intlDest} 
          icon={Globe} 
          colorClass="bg-indigo-50 text-indigo-600"
          description="Foreign packages"
        />
      </div>

      {/* Booking Management Center - Full Width Focused */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={20} className="text-emerald-500" /> Booking Operations
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:bg-amber-50 hover:border-amber-100 transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-6">
              <div className="p-4 bg-white rounded-2xl text-amber-500 shadow-sm transition-transform group-hover:scale-110"><Clock size={28} /></div>
              <div className="flex items-center gap-2 text-slate-300 group-hover:text-amber-500 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest">View All</span>
                <ChevronRight size={18} />
              </div>
            </div>
            <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stats.pendingBookings}</h3>
            <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest opacity-80">Pending Approvals</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:bg-emerald-50 hover:border-emerald-100 transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-6">
              <div className="p-4 bg-white rounded-2xl text-emerald-500 shadow-sm transition-transform group-hover:scale-110"><CheckCircle2 size={28} /></div>
              <div className="flex items-center gap-2 text-slate-300 group-hover:text-emerald-500 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest">View All</span>
                <ChevronRight size={18} />
              </div>
            </div>
            <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stats.confirmedBookings}</h3>
            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest opacity-80">Confirmed Packages</p>
          </div>
        </div>

        {/* Subtle Decorative Background */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-50 rounded-full opacity-40 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default DashboardOverview;