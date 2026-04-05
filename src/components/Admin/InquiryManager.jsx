import React, { useState } from 'react';
import { Mail, MailOpen, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const InquiryManager = () => {
  const [inquiries, setInquiries] = useState([
    { 
      id: 1, 
      sender: 'Alice Johnson', 
      email: 'alice@example.com', 
      subject: 'Booking for Everest Base Camp', 
      message: 'Hi, I want to know if there are slots available for April?', 
      date: '2 hours ago',
      isRead: false 
    },
    { 
      id: 2, 
      sender: 'Bob Smith', 
      email: 'bob@travels.com', 
      subject: 'Refund Policy', 
      message: 'What is the refund policy if the flight is canceled?', 
      date: 'Yesterday',
      isRead: true 
    }
  ]);

  const toggleRead = (id) => {
    setInquiries(inquiries.map(inq => 
      inq.id === id ? { ...inq, isRead: !inq.isRead } : inq
    ));
  };

  const deleteInquiry = (id) => {
    setInquiries(inquiries.filter(inq => inq.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Inquiry Inbox</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {inquiries.filter(i => !i.isRead).length} New Messages
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {inquiries.length > 0 ? inquiries.map((inq) => (
            <div 
              key={inq.id} 
              className={`p-6 flex items-start gap-6 transition-all hover:bg-slate-50/50 group ${!inq.isRead ? 'bg-emerald-50/20' : ''}`}
            >
              {/* STATUS ICON */}
              <div className="mt-1">
                {!inq.isRead ? (
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Mail size={18} />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                    <MailOpen size={18} />
                  </div>
                )}
              </div>

              {/* MESSAGE CONTENT */}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className={`text-sm tracking-tight ${!inq.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>
                      {inq.sender}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold">{inq.email}</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase flex items-center gap-1">
                    <Clock size={10} /> {inq.date}
                  </span>
                </div>
                
                <h5 className="text-xs font-black text-slate-800 mt-2 uppercase tracking-wide">{inq.subject}</h5>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {inq.message}
                </p>
              </div>

              {/* QUICK ACTIONS */}
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleRead(inq.id)}
                  className={`p-2 rounded-xl border transition-all ${inq.isRead ? 'text-slate-300 border-slate-100' : 'text-emerald-500 border-emerald-100 bg-emerald-50'}`}
                  title={inq.isRead ? "Mark as Unread" : "Mark as Read"}
                >
                  <CheckCircle2 size={16} />
                </button>
                <button 
                  onClick={() => deleteInquiry(inq.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center">
              <p className="text-xs font-black uppercase text-slate-300 tracking-widest">Inbox is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryManager;