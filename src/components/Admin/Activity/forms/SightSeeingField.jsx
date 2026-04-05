import React from 'react';
import { Car, MapPin, Clock, Ticket, Map, Info } from 'lucide-react';

// Note: changed prop from handleInputChange to onChange to match ActivityManager
const SightseeingFields = ({ formData, onChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-4">
        Sightseeing Logistics
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Type */}
        <div className="relative">
          <Car className="absolute left-4 top-4 text-slate-400" size={16} />
          <input 
            type="text" 
            name="vehicleType" // This name is used as the key in specificData
            value={formData.vehicleType || ''} 
            onChange={onChange}
            placeholder="Vehicle (e.g. Private Jeep)" 
            className="w-full p-4 pl-12 bg-slate-50 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-purple-500/10" 
          />
        </div>

        {/* Duration */}
        <div className="relative">
          <Clock className="absolute left-4 top-4 text-slate-400" size={16} />
          <input 
            type="text" 
            name="duration"
            value={formData.duration || ''} 
            onChange={onChange}
            placeholder="Duration (e.g. 6 Hours)" 
            className="w-full p-4 pl-12 bg-slate-50 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-purple-500/10" 
          />
        </div>

        {/* Overview */}
        <div className="col-span-2 space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Overview / Description</label>
          <textarea 
            name="overview"
            value={formData.overview || ''} 
            onChange={onChange}
            placeholder="Enter sightseeing description here..." 
            className="w-full p-5 bg-slate-50 rounded-[2rem] text-sm font-bold outline-none border-2 border-transparent focus:border-purple-500/10 min-h-[120px]" 
          />
        </div>

        {/* Itinerary */}
        <div className="col-span-2 space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Itinerary (Stop by stop)</label>
          <textarea 
            name="itinerary"
            value={formData.itinerary || ''} 
            onChange={onChange}
            placeholder="09:00 AM: Pickup&#10;10:00 AM: Temple Visit..." 
            className="w-full p-5 bg-slate-50 rounded-[2rem] text-sm font-bold outline-none border-2 border-transparent focus:border-orange-500/10 min-h-[150px]" 
          />
        </div>

        {/* Monument Fees */}
        <div className="relative col-span-2">
          <Ticket className="absolute left-4 top-4 text-slate-400" size={16} />
          <input 
            type="text" 
            name="monumentFees"
            value={formData.monumentFees || ''} 
            onChange={onChange}
            placeholder="Est. Monument Fees (e.g. Rs. 2500)" 
            className="w-full p-4 pl-12 bg-slate-50 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-purple-500/10" 
          />
        </div>
      </div>
    </div>
  );
};

export default SightseeingFields;