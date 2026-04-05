import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  MapPin,
  Clock,
  BarChart3,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  XCircle,
  Globe
} from "lucide-react";

const DataTable = ({ data, type, onDelete, onEdit }) => {
  const [expandedId, setExpandedId] = useState(null);
  const isDestination = type === "destinations";

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden mt-6">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/3">
              Package & Timing
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Region / Type
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
              Complexity
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
              Value (Rs)
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right px-12">
              Manage
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <React.Fragment key={item.id}>
                <tr className={`transition-all ${isExpanded ? "bg-slate-50/80" : "hover:bg-slate-50/50"} group`}>
                  {/* PACKAGE & TIMING */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter truncate">
                          {item.title || item.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1 uppercase tracking-wider">
                            <Clock size={10} />
                            {item.details?.duration || "1"}{" "}
                            {item.details?.duration === "1" ? "Day" : "Days"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* REGION / TYPE */}
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <MapPin size={10} className="text-blue-500" />
                        {item.details?.region || item.details?.province || "Nepal"}
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 w-fit">
                        <Globe size={8} className="text-slate-400" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                          {isDestination ? 'International' : 'Activity'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* DIFFICULTY */}
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                      <BarChart3
                        size={12}
                        className={
                          item.details?.difficulty === "Hard"
                            ? "text-rose-500"
                            : item.details?.difficulty === "Moderate"
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }
                      />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                          item.details?.difficulty === "Hard" ? "text-rose-600" : 
                          item.details?.difficulty === "Moderate" ? "text-amber-600" : "text-emerald-600"
                        }`}>
                        {item.details?.difficulty || "Easy"}
                      </span>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="px-8 py-6 text-right">
                    <p className="text-lg font-black text-slate-900 tracking-tighter">
                      Rs {item.price?.toLocaleString() || item.budget?.toLocaleString() || "0"}
                    </p>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className={`p-2.5 rounded-xl transition-all border ${
                          isExpanded 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* EXPANDED DETAILS DRAWER */}
                {isExpanded && (
                  <tr>
                    <td colSpan="5" className="px-10 py-8 bg-slate-50/50 border-x-4 border-slate-900 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-3 gap-8">
                        {/* Summary */}
                        <div className="space-y-4">
                          
                          <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Target Audience</h4>
                            <p className="text-[11px] font-bold text-slate-700">{item.details?.whoFor || 'All Travelers'}</p>
                          </div>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
                           <div>
                            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                              <CheckCircle2 size={12} /> Inclusions
                            </h4>
                            <p className="text-[10px] text-slate-500 whitespace-pre-line leading-relaxed">
                              {item.details?.costIncludes || 'Standard package inclusions.'}
                            </p>
                           </div>
                           <div className="pt-2 border-t border-slate-50">
                            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                              <XCircle size={12} /> Exclusions
                            </h4>
                            <p className="text-[10px] text-slate-500 whitespace-pre-line leading-relaxed">
                              {item.details?.costExcludes || 'Personal expenses, Tips.'}
                            </p>
                           </div>
                        </div>

                        {/* Itinerary */}
                        <div className="bg-slate-900 p-5 rounded-2xl shadow-inner overflow-y-auto max-h-[220px]">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-800 pb-2">Full Itinerary</h4>
                          <p className="text-[11px] text-slate-300 whitespace-pre-line font-medium leading-loose">
                            {item.details?.itinerary || 'Itinerary details not yet provided.'}
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

      {data.length === 0 && (
        <div className="py-20 text-center bg-slate-50/20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlignLeft size={24} className="text-slate-300" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            No records found
          </p>
        </div>
      )}
    </div>
  );
};

export default DataTable;