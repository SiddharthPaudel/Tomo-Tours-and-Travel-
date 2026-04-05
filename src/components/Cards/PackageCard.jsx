import React from 'react';
import { Calendar, MapPin, ArrowRight, Star, Users } from 'lucide-react';

const PackageCard = ({ data }) => {
  // Defensive check to prevent crashes if data is missing
  if (!data) return null;

  return (
    <div className="group bg-white rounded-[2.5rem] p-3 shadow-sm hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 border border-gray-100 flex flex-col h-full font-['Montserrat']">
      
      {/* Image Container */}
      <div className="relative h-72 rounded-[2.2rem] overflow-hidden">
        <img 
          src={data.image} 
          // Use title OR name for alt text
          alt={data.title || data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        {/* Category Floating Badge */}
        <div className="absolute top-5 left-5">
          <span className="bg-white/95 backdrop-blur-md text-emerald-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
            {data.category}
          </span>
        </div>

        {/* Price Floating Badge */}
        <div className="absolute bottom-5 right-5 bg-emerald-500 text-white px-5 py-2 rounded-2xl font-black shadow-lg border border-emerald-400">
          {/* Support both numeric and string prices */}
          {data.price ? `Rs. ${data.price}` : (data.budget ? `Rs. ${data.budget}` : 'Contact Us')}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 pt-7 pb-5 flex flex-col flex-grow">
        
        {/* Top Meta Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.15em]">
            <MapPin size={14} strokeWidth={2.5} />
            {data.location || "Nepal"}
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
            <Star size={12} className="text-emerald-500" fill="currentColor" />
            <span className="text-[10px] font-black text-emerald-700">4.9</span>
          </div>
        </div>

        {/* Title / Name - FIXED HERE */}
        <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-emerald-500 transition-colors leading-tight line-clamp-1">
          {data.title || data.name}
        </h3>

        {/* Description / Overview */}
        <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
          {data.desc || data.overview || "Experience the beauty of this destination with our premium travel package."}
        </p>

        {/* Feature Highlights */}
        <div className="flex items-center justify-between mb-8 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/50">
          <div className="flex items-center gap-2.5">
            <Calendar size={18} className="text-emerald-500" />
            <span className="text-[11px] font-bold text-gray-700">
              {data.duration || (data.details?.duration) || "TBD"}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-emerald-200"></div>
          <div className="flex items-center gap-2.5">
            <Users size={18} className="text-emerald-500" />
            <span className="text-[11px] font-bold text-gray-700">
              {data.groupSize || "Small Group"}
            </span>
          </div>
        </div>

        {/* Main Action Button */}
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