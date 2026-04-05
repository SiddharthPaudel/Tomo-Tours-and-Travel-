import React from 'react';
import { 
  FileCheck, ShieldAlert, Clock, Globe, 
  CheckCircle2, AlertCircle, HelpCircle, ArrowRight 
} from 'lucide-react';

const VisaInfo = () => {
  const commonVisas = [
    {
      country: "Nepal",
      type: "On-Arrival / E-Visa",
      processing: "1-3 Days",
      requirements: ["Valid Passport (6 months)", "Passport Photos", "Visa Fee in USD", "Arrival Form"],
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      country: "Tibet (China)",
      type: "Group Visa",
      processing: "4-7 Days",
      requirements: ["Chinese Visa", "Tibet Travel Permit", "Full Itinerary", "Agency Invite"],
      color: "bg-slate-50 border-slate-200"
    },
    {
      country: "Bhutan",
      type: "Pre-Approved",
      processing: "7-10 Days",
      requirements: ["Clear Passport Scan", "Full Payment", "Sustainable Dev Fee", "Approved Tour"],
      color: "bg-emerald-50 border-emerald-200"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-montserrat pb-20">
      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs">Essential Documents</span>
          <h1 className="text-4xl md:text-6xl font-black mt-4 mb-6 tracking-tighter">Visa Information</h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Navigating international borders can be complex. We simplify the process so you can focus on the adventure ahead.
          </p>
        </div>
      </section>

      {/* 2. QUICK STATS */}
      <section className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Clock className="text-emerald-500" />, title: "Average Processing", desc: "5-10 Business Days" },
            { icon: <Globe className="text-emerald-500" />, title: "Global Support", desc: "Visa help for 50+ countries" },
            { icon: <FileCheck className="text-emerald-500" />, title: "Document Review", desc: "100% Free Pre-check" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-50 flex flex-col items-center text-center">
              <div className="bg-emerald-50 p-4 rounded-full mb-4">{stat.icon}</div>
              <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">{stat.title}</h3>
              <p className="text-slate-500 text-xs mt-1 font-bold">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VISA DESTINATIONS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Popular Destinations</h2>
            <div className="h-1.5 w-20 bg-emerald-500 mt-2 rounded-full"></div>
          </div>
          <p className="text-slate-500 text-sm font-medium max-w-md">
            Requirements vary by nationality. Please contact our specialized visa desk for your specific case.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commonVisas.map((visa, index) => (
            <div key={index} className={`border rounded-3xl p-8 transition-all hover:shadow-2xl hover:-translate-y-1 ${visa.color}`}>
              <h3 className="text-2xl font-black text-slate-800 mb-1">{visa.country}</h3>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">{visa.type}</span>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">Processing: {visa.processing}</span>
                </div>
                <div className="pt-4 border-t border-gray-200/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Requirements</p>
                  <ul className="space-y-3">
                    {visa.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. GENERAL GUIDELINES */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] overflow-hidden shadow-sm flex flex-col md:flex-row">
          <div className="bg-emerald-600 p-12 text-white md:w-2/5 flex flex-col justify-center">
            <ShieldAlert size={48} className="mb-6 opacity-50" />
            <h2 className="text-3xl font-black leading-tight mb-4 tracking-tighter">Important Compliance</h2>
            <p className="text-emerald-100 text-sm leading-relaxed font-medium">
              Incorrect documentation is the #1 cause for travel delays. Ensure your details are verified by our experts.
            </p>
          </div>
          <div className="p-12 md:w-3/5 grid gap-8">
            <div className="flex gap-4">
              <div className="bg-amber-50 p-3 rounded-xl h-fit">
                <AlertCircle className="text-amber-600" size={20} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm uppercase">Passport Validity</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Your passport must be valid for at least 6 months beyond your date of entry.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-50 p-3 rounded-xl h-fit">
                <HelpCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm uppercase">Insurance Coverage</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Many visas now require proof of travel insurance covering COVID-19 and medical evacuation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-4">Need a Custom Visa Quote?</h2>
        <p className="text-slate-500 text-sm font-bold mb-8 italic italic tracking-tight">Our agents respond within 2 business hours.</p>
        <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center gap-3 mx-auto shadow-xl">
          Contact Visa Desk <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
};

export default VisaInfo;