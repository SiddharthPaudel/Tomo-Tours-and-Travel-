import React from 'react';
import { Waves, Info, Clock, CheckCircle, XCircle, ShieldCheck, HeartPulse } from 'lucide-react';

const RaftingFields = ({ formData, onChange }) => (
  <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
    <div className="flex items-center gap-2 px-1 text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-2">
      <Waves size={14} /> River & Safety Logistics
    </div>

    <div className="grid grid-cols-2 gap-4">
      {/* 1. Basic Info */}
      

     

      {/* 2. Overviews */}
      <div className="col-span-2 space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Trip Overview</label>
        <textarea 
          name="overview" 
          value={formData.overview || ''} 
          onChange={onChange}
          placeholder="Rafting is an exciting activity suitable for a wide range of people..." 
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold border-2 border-transparent focus:border-cyan-500/10 outline-none min-h-[100px] resize-none" 
        />
      </div>

      {/* 3. Suitability Sections (Structured) */}
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
            <HeartPulse size={10}/> Physical Fitness
          </label>
          <textarea 
            name="suitabilityFitness" 
            value={formData.suitabilityFitness || ''} 
            onChange={onChange}
            placeholder="Participants should be in good health, paddling requires strength..." 
            className="w-full p-4 bg-slate-50 rounded-xl text-[11px] font-bold border-2 border-transparent focus:border-cyan-500/10 outline-none min-h-[80px] resize-none" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Age & Experience</label>
          <textarea 
            name="suitabilityAge" 
            value={formData.suitabilityAge || ''} 
            onChange={onChange}
            placeholder="Min 12 years old. No prior experience needed..." 
            className="w-full p-4 bg-slate-50 rounded-xl text-[11px] font-bold border-2 border-transparent focus:border-cyan-500/10 outline-none min-h-[80px] resize-none" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Comfort Level</label>
          <textarea 
            name="suitabilityComfort" 
            value={formData.suitabilityComfort || ''} 
            onChange={onChange}
            placeholder="Basic comfort in water is important..." 
            className="w-full p-4 bg-slate-50 rounded-xl text-[11px] font-bold border-2 border-transparent focus:border-cyan-500/10 outline-none min-h-[80px] resize-none" 
          />
        </div>
      </div>

      {/* 4. Highlights & Itinerary */}
      <div className="col-span-2 space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
          <Info size={10}/> Rafting Highlights
        </label>
        <textarea 
          name="highlights" 
          value={formData.highlights || ''} 
          onChange={onChange}
          placeholder="· Experience the thrill of navigating river rapids&#10;· Enjoy views of lush green hills..." 
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold border-2 border-transparent focus:border-cyan-500/10 outline-none min-h-[100px] resize-none" 
        />
      </div>

      <div className="col-span-2 space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
          <Clock size={10}/> Trip Itinerary
        </label>
        <textarea 
          name="itinerary" 
          value={formData.itinerary || ''} 
          onChange={onChange}
          placeholder="7:00 AM – Depart from Hotel&#10;10:30 AM – Safety briefing & Begin Rafting..." 
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold border-2 border-transparent focus:border-cyan-500/10 outline-none min-h-[150px] resize-none" 
        />
      </div>

      {/* 5. Costs */}
      <div className="col-span-2 md:col-span-1 space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1 text-emerald-600">
          <CheckCircle size={10}/> Includes
        </label>
        <textarea 
          name="costIncludes" 
          value={formData.costIncludes || ''} 
          onChange={onChange}
          placeholder="· Two-way transportation&#10;· Rafting equipment&#10;· Lunch & Snacks..." 
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold border-2 border-transparent focus:border-emerald-500/10 outline-none min-h-[120px] resize-none" 
        />
      </div>

      <div className="col-span-2 md:col-span-1 space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1 text-rose-600">
          <XCircle size={10}/> Excludes
        </label>
        <textarea 
          name="costExcludes" 
          value={formData.costExcludes || ''} 
          onChange={onChange}
          placeholder="· Personal insurance&#10;· Tips for guide&#10;· Personal expenses..." 
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold border-2 border-transparent focus:border-rose-500/10 outline-none min-h-[120px] resize-none" 
        />
      </div>

      {/* 6. Technical Meta (River Grade & Duration) */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Difficulty / Grade</label>
        <select 
          name="difficulty" 
          value={formData.difficulty || ''} 
          onChange={onChange}
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold border-2 border-transparent focus:border-cyan-500/10 outline-none"
        >
          <option value="">Select Class</option>
          <option value="Class II">Class II (Easy)</option>
          <option value="Class III">Class III (Moderate)</option>
          <option value="Class IV">Class IV (Difficult)</option>
        </select>
      </div>

      <div className="col-span-2 md:col-span-1 space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
          <Clock size={10}/> Total Duration (Hours)
        </label>
        <input 
          name="duration" 
          value={formData.duration || ''} 
          onChange={onChange}
          type="text" 
          placeholder="e.g. 3 Hours (on water) / 10 Hours (total)" 
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold border-2 border-transparent focus:border-cyan-500/10 outline-none" 
        />
      </div>
    </div>
  </div>
);

export default RaftingFields;