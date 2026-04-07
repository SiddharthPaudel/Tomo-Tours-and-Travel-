import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, CheckCircle2, ShieldAlert, MessageSquare, Phone, User, X, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from "../../services/firebase";
import AlertModal from '../../utils/AlertModal'; // Imported AlertModal

const InquiryManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  
  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState({ isOpen: false });

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        formattedDate: doc.data().createdAt?.toDate() 
          ? doc.data().createdAt.toDate().toLocaleString('en-US', { 
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            }) : 'Just now'
      }));
      setInquiries(messageData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    try {
      await updateDoc(doc(db, "messages", id), { status: newStatus });
      // If the selected inquiry is the one being updated, refresh the local state
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      setAlertConfig({ isOpen: true, type: 'error', title: 'Update Failed', message: error.message });
    }
  };

  const deleteInquiry = async (id) => {
    setAlertConfig({
      isOpen: true,
      type: 'warning',
      title: 'Delete Message?',
      message: 'This transmission will be permanently purged from the database.',
      confirmText: 'Purge Now',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "messages", id));
          if (selectedInquiry?.id === id) setSelectedInquiry(null);
          setAlertConfig({ isOpen: false });
        } catch (error) {
          setAlertConfig({ isOpen: true, type: 'error', title: 'Delete Failed', message: error.message });
        }
      }
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4 font-montserrat">
      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Inquiries...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-0 font-montserrat max-w-full overflow-x-hidden">
      <AlertModal {...alertConfig} onCancel={() => setAlertConfig({ isOpen: false })} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
        
        {/* --- LEFT SIDE: INBOX LIST --- */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">Inquiry Inbox</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {inquiries.filter(i => i.status !== 'read').length} Pending Responses
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {inquiries.length > 0 ? inquiries.map((inq) => {
                const isRead = inq.status === 'read';
                return (
                  <div 
                    key={inq.id} 
                    onClick={() => setSelectedInquiry(inq)}
                    className={`p-5 md:p-6 flex items-start gap-3 md:gap-4 transition-all cursor-pointer group ${selectedInquiry?.id === inq.id ? 'bg-slate-50' : 'hover:bg-slate-50/50'} ${!isRead ? 'border-l-4 border-emerald-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-colors ${!isRead ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                      {isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-xs md:text-sm tracking-tight truncate ${!isRead ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                          {inq.fullName}
                        </h4>
                        <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase shrink-0 ml-2">{inq.formattedDate}</span>
                      </div>
                      <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-tighter mb-1">{inq.activity}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 italic">"{inq.message}"</p>
                    </div>

                    <div className="hidden md:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleStatus(inq.id, inq.status); }}
                        className={`p-2 rounded-xl border transition-all ${isRead ? 'text-slate-300 border-slate-100 hover:text-emerald-500' : 'text-emerald-500 border-emerald-100 bg-emerald-50'}`}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-24 md:py-32 text-center">
                  <ShieldAlert className="mx-auto text-slate-100 mb-4" size={48} />
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">No incoming transmissions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: MESSAGE READER (Modal-like on mobile) --- */}
        <div className={`lg:col-span-5 ${selectedInquiry ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:block'}`}>
          {selectedInquiry ? (
            <div className="flex items-end lg:items-start justify-center h-full bg-slate-900/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none p-0 lg:p-0">
              <div className="w-full lg:sticky lg:top-8 bg-slate-900 h-[85vh] lg:h-auto rounded-t-[3rem] lg:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl animate-in slide-in-from-bottom lg:slide-in-from-right-8 duration-500 overflow-y-auto">
                
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-emerald-500/20 p-3 rounded-2xl">
                    <MessageSquare className="text-emerald-400" size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => deleteInquiry(selectedInquiry.id)}
                      className="p-3 bg-white/5 hover:bg-rose-500/20 text-white/20 hover:text-rose-400 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button 
                      onClick={() => setSelectedInquiry(null)}
                      className="lg:hidden p-3 bg-white/5 text-white/40 rounded-2xl"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/60 block mb-2">Sender Details</label>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><User size={14}/></div>
                       <h3 className="text-lg md:text-xl font-black tracking-tighter uppercase truncate">{selectedInquiry.fullName}</h3>
                    </div>
                    <p className="text-xs text-white/40 mt-1 ml-11 font-bold break-all">{selectedInquiry.email}</p>
                    {selectedInquiry.phone && (
                      <div className="flex items-center gap-3 mt-2 ml-11 text-white/60">
                        <Phone size={12} /> <span className="text-[11px] font-bold">{selectedInquiry.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/60 block mb-4">Transmission Body</label>
                    <div className="bg-white/5 p-5 md:p-6 rounded-[2rem] text-[13px] md:text-sm leading-relaxed text-slate-300 font-medium whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={() => toggleStatus(selectedInquiry.id, selectedInquiry.status)}
                      className={`w-full py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${selectedInquiry.status === 'read' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                    >
                      {selectedInquiry.status === 'read' ? 'Mark as Unread' : 'Mark as Processed'}
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-100 rounded-[3rem] hidden lg:flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="text-slate-200" size={32} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Select an inquiry to view full transmission</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryManager;