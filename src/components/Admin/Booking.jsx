import React, { useState, useEffect } from 'react';
import { db } from "../../services/firebase";
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { 
  Search, CheckCircle, XCircle, Calendar, MapPin, Loader2, Mail, Phone 
} from 'lucide-react';
import AlertModal from '../../utils/AlertModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateBookingStatus = async (id, newStatus) => {
    setModalConfig({
      isOpen: true,
      type: newStatus === 'confirmed' ? 'success' : 'warning',
      title: 'Update Status?',
      message: `Are you sure you want to mark this booking as ${newStatus}?`,
      confirmText: 'Confirm Update',
      onConfirm: async () => {
        try {
          const bookingRef = doc(db, "bookings", id);
          await updateDoc(bookingRef, { status: newStatus });
          setModalConfig({ isOpen: false });
        } catch (error) { console.error("Error updating status:", error); }
      }
    });
  };

  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      b.packageName?.toLowerCase().includes(term) || 
      b.userName?.toLowerCase().includes(term) ||
      b.userEmail?.toLowerCase().includes(term) ||
      b.phone?.includes(term);

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Reservations...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 font-montserrat">
      <AlertModal {...modalConfig} onCancel={() => setModalConfig({ isOpen: false })} />

      {/* HEADER & FILTERS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Booking Control</h1>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Manage incoming expeditions</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-grow sm:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Search bookings..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full sm:w-64 md:w-72 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white border border-slate-100 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none shadow-sm cursor-pointer"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* MOBILE LIST VIEW (Visible only on small screens) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black uppercase">
                  {booking.userName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{booking.userName || 'Unknown'}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
                    {booking.status || 'pending'}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={18} /></button>
                <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><XCircle size={18} /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trip</p>
                <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1"><MapPin size={10} className="text-emerald-500"/> {booking.packageName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1"><Calendar size={10}/> {booking.travelDate}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                <Mail size={12} className="text-slate-400" /> {booking.userEmail}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-black text-slate-900">
                <Phone size={12} className="text-emerald-500" /> {booking.phone || "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (Hidden on small screens) */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Traveler</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Trip Info</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Group</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black uppercase">
                        {booking.userName?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-black text-slate-900 whitespace-nowrap uppercase tracking-tight">
                        {booking.userName || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 text-[11px] font-bold text-slate-600 truncate max-w-[150px]">
                        <Mail size={12} className="text-slate-400" /> {booking.userEmail}
                      </span>
                      <span className="flex items-center gap-2 text-[11px] font-black text-slate-900">
                        <Phone size={12} className="text-emerald-500" /> {booking.phone || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
                        <MapPin size={12} className="text-emerald-500" /> {booking.packageName}
                      </span>
                      <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar size={12} /> {booking.travelDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-100">
                        <span className="text-sm font-black text-slate-900">{booking.travelers || '1'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
                      {booking.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all active:scale-90" title="Confirm"><CheckCircle size={20} /></button>
                      <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-all active:scale-90" title="Cancel"><XCircle size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;