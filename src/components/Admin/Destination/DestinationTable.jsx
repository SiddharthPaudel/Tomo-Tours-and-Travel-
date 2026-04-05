import React, { useState } from 'react';
import { 
  Edit2, Trash2, MapPin, Clock, BarChart3, 
  ChevronDown, ChevronUp, Globe, Home, Info, CheckCircle2, XCircle
} from 'lucide-react';

const DataTable = ({ data, type, onDelete, onEdit }) => {
  const [expandedId, setExpandedId] = useState(null);
  const isDestination = type === 'destinations';

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden mt-6">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/4">Package Info</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Metrics</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Investment</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right px-12">Manage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => {
            const isExpanded = expandedId === item.id;
            
            return (
              <React.Fragment key={item.id}>
                <tr className={`transition-all ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}>
                  
                  {/* TITLE & IMAGE */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                        <img src={item.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter truncate">{item.name || item.title}</p>
                        <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1 uppercase tracking-widest mt-0.5">
                          <MapPin size={10} /> {item.details?.region || 'Global'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY PILL */}
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                      item.type === 'international' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-orange-50 border-orange-100 text-orange-600'
                    }`}>
                      {item.type === 'international' ? <Globe size={12}/> : <Home size={12}/>}
                      <span className="text-[9px] font-black uppercase tracking-widest">{item.type || 'Activity'}</span>
                    </div>
                  </td>

                  {/* METRICS (Duration/Difficulty) */}
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[11px] font-bold">{item.details?.duration || 'N/A'} Days</span>
                      </div>
                      {!isDestination && (
                        <div className="flex items-center gap-1.5">
                          <BarChart3 size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase">{item.details?.difficulty}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* PRICE/BUDGET */}
                  <td className="px-8 py-6 text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Value</p>
                    <p className="text-base font-black text-slate-900 tracking-tighter">
                       Rs {item.price ? item.price.toLocaleString() : (item.budget || '0')}
                    </p>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleExpand(item.id)}
                        className={`p-2.5 rounded-lg transition-all border ${isExpanded ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-400'}`}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button onClick={() => onEdit(item)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all border border-rose-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* EXPANDED DETAILS PANEL */}
                {isExpanded && (
                  <tr>
                    <td colSpan="5" className="px-12 py-8 bg-slate-50/50 border-x-4 border-slate-900">
                      <div className="grid grid-cols-3 gap-12">
                        {/* Summary Section */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                              <Info size={12} className="text-blue-500" /> Why Choose This Tour
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {item.details?.whyChoose || item.description || "No specific details provided."}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Best Time</h4>
                            <p className="text-xs font-bold text-slate-900">{item.details?.bestTime || 'Year-round'}</p>
                          </div>
                        </div>

                        {/* Inclusions / Exclusions */}
                        <div className="space-y-4">
                           <div>
                            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                              <CheckCircle2 size={12} /> Includes
                            </h4>
                            <p className="text-[11px] text-slate-500 whitespace-pre-line">{item.details?.costIncludes || 'Contact for details'}</p>
                           </div>
                           <div>
                            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                              <XCircle size={12} /> Excludes
                            </h4>
                            <p className="text-[11px] text-slate-500 whitespace-pre-line">{item.details?.costExcludes || 'N/A'}</p>
                           </div>
                        </div>

                        {/* Itinerary Section */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto max-h-[250px]">
                          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 sticky top-0 bg-white pb-2 border-b">Daily Itinerary</h4>
                          <p className="text-[11px] text-slate-600 whitespace-pre-line font-medium leading-loose">
                            {item.details?.itinerary || 'Detailed itinerary not uploaded.'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;