import React from 'react';

const HikingFields = ({ formData, onChange }) => (
  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
    <div className="col-span-2 text-[10px] font-black text-emerald-600 uppercase mb-2 flex items-center gap-2">
      <div className="w-4 h-[2px] bg-emerald-600"></div>
      Hiking & Trekking Expedition Details
    </div>
    
   

    <div className="col-span-2 space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Trip Overview</label>
      <textarea name="overview" value={formData.overview || ''} onChange={onChange} placeholder="The legendary Annapurna Base Camp is a dream..." className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10 min-h-[100px] resize-none" />
    </div>

    {/* --- NEW FIELDS ADDED HERE --- */}
    <div className="col-span-2 space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Trip Experience (What they will feel/do)</label>
      <textarea name="experience" value={formData.experience || ''} onChange={onChange} placeholder="· A perfect blend of trekking and luxury&#10;· Cultural immersion..." className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10 min-h-[80px] resize-none" />
    </div>

    <div className="col-span-2 space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Why This Trip Stands Out</label>
      <textarea name="standsOut" value={formData.standsOut || ''} onChange={onChange} placeholder="This trek offers the best of both worlds—authentic trekking and heli comfort..." className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10 min-h-[80px] resize-none" />
    </div>

    <div className="space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Duration</label>
      <input name="duration" value={formData.duration || ''} onChange={onChange} type="text" placeholder="9 Days" className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10" />
    </div>

    <div className="space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Max Elevation</label>
      <input name="elevation" value={formData.elevation || ''} onChange={onChange} type="text" placeholder="4,130 m" className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10" />
    </div>

    <div className="col-span-2 space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Tour Highlights</label>
      <textarea name="highlights" value={formData.highlights || ''} onChange={onChange} placeholder="· Scenic flight to Pokhara..." className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10 min-h-[80px] resize-none" />
    </div>

    <div className="col-span-2 space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Daily Itinerary</label>
      <textarea name="itinerary" value={formData.itinerary || ''} onChange={onChange} placeholder="Day 01: Arrival..." className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10 min-h-[120px] resize-none" />
    </div>

    <div className="space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Includes</label>
      <textarea name="costIncludes" value={formData.costIncludes || ''} onChange={onChange} className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10 min-h-[80px] resize-none" />
    </div>

    <div className="space-y-1">
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Excludes</label>
      <textarea name="costExcludes" value={formData.costExcludes || ''} onChange={onChange} className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-500/10 min-h-[80px] resize-none" />
    </div>
  </div>
);

export default HikingFields;