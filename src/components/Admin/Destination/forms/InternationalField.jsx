import React from 'react';

const InternationalField = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="col-span-2 border-b border-slate-100 pb-2">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">
          International Package Details
        </p>
        <p className="text-[9px] text-slate-400 font-medium italic">All pricing in Nepalese Rupees (Rs)</p>
      </div>

      {/* Region / Country & Duration */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Country</label>
        <input 
          type="text" name="region" value={formData.region || ''} onChange={onChange}
          placeholder="e.g. Vietnam"
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500/10 transition-all" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Days)</label>
        <input 
          type="text" name="duration" value={formData.duration || ''} onChange={onChange}
          placeholder="e.g. 5"
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500/10 transition-all" 
        />
      </div>

      {/* Best Time & Why Choose This Tour */}
      <div className="col-span-2 space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Best Time to Visit</label>
        <input 
          type="text" name="bestTime" value={formData.bestTime || ''} onChange={onChange}
          placeholder="e.g. March to May and September to November"
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500/10 transition-all" 
        />
      </div>

      {/* NEW FIELD: WHY CHOOSE THIS TOUR */}
      <div className="col-span-2 space-y-2">
        <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Why Choose This Tour?</label>
        <textarea 
          name="whyChoose" value={formData.whyChoose || ''} onChange={onChange}
          placeholder="This itinerary combines city exploration, cultural heritage, and scenic countryside..."
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500/10 min-h-[80px]" 
        />
      </div>

      {/* Highlights */}
      <div className="col-span-2 space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Trip Highlights (Comma Separated)</label>
        <textarea 
          name="highlights" value={formData.highlights || ''} onChange={onChange}
          placeholder="Hanoi Culture, Ninh Binh Hidden Gem, Halong Bay Wonder..."
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500/10 min-h-[80px]" 
        />
      </div>

      {/* Audience & Experience */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Who is this for?</label>
        <textarea 
          name="whoFor" value={formData.whoFor || ''} onChange={onChange}
          placeholder="Cultural seekers, Adventure lovers..."
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500/10 min-h-[100px]" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Trip Experience</label>
        <textarea 
          name="experience" value={formData.experience || ''} onChange={onChange}
          placeholder="Comfortable stays, Guided excursions..."
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500/10 min-h-[100px]" 
        />
      </div>

      {/* Includes / Excludes */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Inclusions</label>
        <textarea 
          name="costIncludes" value={formData.costIncludes || ''} onChange={onChange}
          placeholder="Visa assistance, Round-trip flight tickets..."
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-[11px] outline-none border-2 border-transparent focus:border-emerald-500/10 min-h-[120px]" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black text-rose-600 uppercase tracking-widest ml-1">Exclusions</label>
        <textarea 
          name="costExcludes" value={formData.costExcludes || ''} onChange={onChange}
          placeholder="Personal insurance, Tips, Snacks..."
          className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-[11px] outline-none border-2 border-transparent focus:border-rose-500/10 min-h-[120px]" 
        />
      </div>

      {/* Itinerary */}
      <div className="col-span-2 space-y-2">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Itinerary (Day by Day)</label>
        <textarea 
          name="itinerary" value={formData.itinerary || ''} onChange={onChange}
          placeholder="Day 1: Arrival in Hanoi... Day 2: Hanoi City Tour..."
          className="w-full p-4 bg-slate-100 rounded-2xl font-medium text-xs outline-none border-2 border-transparent focus:border-blue-500/10 min-h-[150px]" 
        />
      </div>
    </div>
  );
};

export default InternationalField;