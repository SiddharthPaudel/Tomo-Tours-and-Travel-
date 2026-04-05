import React from 'react';
import { TrendingUp, Users, Map } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-slate-50 text-slate-900"><Icon size={24} /></div>
      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
    </div>
    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

const DashboardOverview = () => (
  <div className="animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatCard title="Total Revenue" value="$42,850" trend="+12%" icon={TrendingUp} />
      <StatCard title="Total Users" value="2,543" trend="+5%" icon={Users} />
      <StatCard title="Active Tours" value="48" trend="Stable" icon={Map} />
    </div>
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 h-64 flex items-center justify-center text-slate-400 font-bold italic">
      Revenue Graph Placeholder
    </div>
  </div>
);

export default DashboardOverview;