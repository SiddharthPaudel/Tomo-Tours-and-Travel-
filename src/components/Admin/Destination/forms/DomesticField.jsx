import React from 'react';
import { MapPin, Clock, Star, CheckCircle2, XCircle, Notebook, ListChecks, Calendar, Sparkles } from 'lucide-react';

const DomesticFields = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* SECTION: BASIC LOGISTICS */}
      <div className="col-span-2 border-b border-slate-100 pb-2 flex justify-between items-center">
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Package Specifics</p>
        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase font-mono tracking-tighter">Nepal Domestic</span>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
          <MapPin size={10} /> Region / Provinces
        </label>
        <input 
          type="text" name="province" value={formData.province || ''} onChange={onChange}
          placeholder="e.g. Kathmandu & Chitwan"
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all shadow-inner" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
          <Clock size={10} /> Duration
        </label>
        <input 
          type="text" name="duration" value={formData.duration || ''} onChange={onChange}
          placeholder="e.g. 6 Days"
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all shadow-inner" 
        />
      </div>

      {/* TRIP OVERVIEW - The Main Narrative */}
    

      {/* TOUR HIGHLIGHTS */}
      <div className="col-span-2 space-y-2">
        <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-1">
          <ListChecks size={10} /> Tour Highlights
        </label>
        <textarea 
          name="highlights" value={formData.highlights || ''} onChange={onChange}
          placeholder="• Explore iconic landmarks&#10;• Canoe along the Rapti River..."
          className="w-full p-4 bg-emerald-50/30 rounded-2xl font-bold text-[11px] outline-none border-2 border-emerald-100/50 focus:border-emerald-500/20 min-h-[110px] shadow-sm" 
        />
      </div>

      {/* TRIP ITINERARY */}
      <div className="col-span-2 space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
          <Calendar size={10} /> Trip Itinerary
        </label>
        <textarea 
          name="itinerary" value={formData.itinerary || ''} onChange={onChange}
          placeholder="Day 01 – Arrival...&#10;Day 02 – Sightseeing..."
          className="w-full p-5 bg-slate-100 rounded-[2rem] font-bold text-xs outline-none border-2 border-transparent focus:border-emerald-500/10 min-h-[150px] leading-loose shadow-inner" 
        />
      </div>

      {/* TRIP EXPERIENCE */}
      <div className="col-span-2 space-y-2">
        <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-1">
          <Sparkles size={10} /> Trip Experience
        </label>
        <textarea 
          name="experience" value={formData.experience || ''} onChange={onChange}
          placeholder="• 3-star hotel accommodations&#10;• Private transfers..."
          className="w-full p-4 bg-blue-50/30 rounded-2xl font-bold text-[11px] outline-none border-2 border-blue-100/50 focus:border-blue-500/20 min-h-[100px] shadow-sm" 
        />
      </div>

      {/* WHY THIS TRIP STANDS OUT */}
      <div className="col-span-2 space-y-2">
        <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest ml-1 flex items-center gap-1">
          <Star size={10} /> Why This Trip Stands Out
        </label>
        <textarea 
          name="whyChoose" value={formData.whyChoose || ''} onChange={onChange}
          placeholder="This 6-day tour offers a complete Nepal experience..."
          className="w-full p-4 bg-amber-50/30 rounded-2xl font-bold text-sm outline-none border-2 border-amber-100/50 focus:border-amber-500/20 min-h-[80px] shadow-sm" 
        />
      </div>

      {/* COST INCLUDES / EXCLUDES */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-1">
          <CheckCircle2 size={10} /> Cost Includes
        </label>
        <textarea 
          name="costIncludes" value={formData.costIncludes || ''} onChange={onChange}
          placeholder="• Airport pickup&#10;• Meals as per itinerary"
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-[11px] outline-none border-2 border-transparent focus:border-emerald-500/20 min-h-[130px] shadow-inner" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-1 flex items-center gap-1">
          <XCircle size={10} /> Cost Excludes
        </label>
        <textarea 
          name="costExcludes" value={formData.costExcludes || ''} onChange={onChange}
          placeholder="• Travel insurance&#10;• Personal expenses"
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-[11px] outline-none border-2 border-transparent focus:border-rose-500/20 min-h-[130px] shadow-inner" 
        />
      </div>
    </div>
  );
};

export default DomesticFields;