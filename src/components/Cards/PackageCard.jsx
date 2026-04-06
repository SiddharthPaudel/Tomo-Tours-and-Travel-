import React from 'react';
import { MapPin, ArrowRight, Star, Check, Clock } from 'lucide-react';

const PackageCard = ({ data }) => {
  if (!data) return null;

  const title = data.title || data.name;
  const image = data.image;
  const category = data.category || data.type;
  const price = data.price || data.budget;
  const location = data.location;
  const rating = data.rating; 
  const highlights = data.highlights || data.features || []; 

  // Clean duration logic
  const rawDuration = data.duration || data.details?.duration || "";
  const durationText = rawDuration && (typeof rawDuration === 'number' || !rawDuration.toString().toLowerCase().includes('day')) 
    ? `${rawDuration} Days` 
    : rawDuration;

  return (
    <div className="group bg-white rounded-[2.5rem] p-3 shadow-sm hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 border border-gray-100 flex flex-col h-full font-['Montserrat']">
      
      {/* Image Section */}
      <div className="relative h-72 rounded-[2.2rem] overflow-hidden bg-slate-100">
        {image && (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        )}
        
        {/* Category Badge (Top Left) */}
        {category && (
          <div className="absolute top-5 left-5">
            <span className="bg-white/95 backdrop-blur-md text-emerald-600 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
              {category}
            </span>
          </div>
        )}

        {/* DAYS BADGE (Top Right Only) */}
        {durationText && (
          <div className="absolute top-5 right-5">
            <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-xl flex items-center gap-2">
              <Clock size={10} className="text-emerald-400" strokeWidth={3} />
              <span className="text-[9px] font-black text-white uppercase tracking-tighter">
                {durationText}
              </span>
            </div>
          </div>
        )}

        {/* PRICE BADGE (Bottom Right Only) */}
        {price && (
          <div className="absolute bottom-5 right-5">
            <div className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl font-black shadow-lg border border-emerald-400 text-sm tracking-tight">
              Rs. {price}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-5 pt-7 pb-5 flex flex-col flex-grow">
        
        <div className="flex items-center justify-between mb-4">
          {location && (
            <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.15em]">
              <MapPin size={14} strokeWidth={2.5} />
              {location}
            </div>
          )}
          
          {rating && (
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md ml-auto">
              <Star size={12} className="text-emerald-500" fill="currentColor" />
              <span className="text-[10px] font-black text-emerald-700">{rating}</span>
            </div>
          )}
        </div>

        {title && (
          <h3 className="text-2xl font-black text-gray-900 mb-5 group-hover:text-emerald-500 transition-colors leading-tight line-clamp-1 uppercase tracking-tighter">
            {title}
          </h3>
        )}

        {/* Dynamic Highlights Chips */}
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {highlights.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                <Check size={10} className="text-emerald-500" strokeWidth={4} />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button className="mt-auto flex items-center justify-between w-full p-2 pl-7 bg-emerald-500 group-hover:bg-emerald-600 rounded-full transition-all duration-300 shadow-lg shadow-emerald-200">
          <span className="text-white font-black text-[11px] uppercase tracking-widest">
            Book Journey
          </span>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm group-hover:rotate-[-45deg] transition-transform">
            <ArrowRight size={20} strokeWidth={3} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default PackageCard;