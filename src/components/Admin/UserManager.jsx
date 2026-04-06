import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, User, Mail, CheckCircle, XCircle } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../services/firebase";

const UserManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "user"));
        const querySnapshot = await getDocs(q);
        
        const userData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            // Mapping specifically to your 'displayName' field
            username: data.displayName || "Unnamed Traveler",
            email: data.email || "No Email Provided",
            // Mapping to your 'emailVerified' boolean field
            isVerified: data.emailVerified === true, 
            joinDate: data.createdAt?.toDate ? 
              data.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 
              'Recent'
          };
        });

        setUsers(userData);
        setLoading(false);
      } catch (error) {
        console.error("Firestore Sync Error:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 font-['Montserrat']">
        <div className="w-12 h-12 border-[3px] border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Traveler Cloud</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-['Montserrat'] max-w-[1400px] mx-auto">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Traveler Directory</h2>
          <div className="flex items-center gap-3 mt-2 bg-slate-900 w-fit px-4 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <p className="text-[9px] font-black text-white uppercase tracking-widest">
              {users.length} Active Records
            </p>
          </div>
        </div>
        
        <div className="relative w-full lg:w-96 group">
          <Search 
            className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
              searchQuery ? 'text-emerald-500' : 'text-slate-300'
            }`} 
            size={18} 
          />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 focus:border-emerald-500/20 focus:ring-[6px] focus:ring-emerald-500/5 rounded-[1.5rem] text-xs font-bold outline-none transition-all shadow-sm group-hover:shadow-md"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Traveler Name</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Acquired</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Verification</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-all group">
                    {/* DISPLAY NAME COLUMN */}
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center transition-all group-hover:bg-emerald-600 group-hover:rotate-6">
                          <User size={18} />
                        </div>
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">
                          {user.username}
                        </span>
                      </div>
                    </td>

                    {/* EMAIL ADDRESS COLUMN */}
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail size={14} className="opacity-30" />
                        <span className="text-xs font-bold lowercase tracking-tight">{user.email}</span>
                      </div>
                    </td>

                    {/* ACQUIRED DATE */}
                    <td className="px-10 py-7 text-center">
                      <div className="inline-flex flex-col items-center">
                         <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{user.joinDate}</span>
                         <span className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">Joined</span>
                      </div>
                    </td>

                    {/* VERIFICATION STATUS CHIP */}
                    <td className="px-10 py-7 text-right">
                      <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase px-4 py-2 rounded-xl border-2 transition-all ${
                        user.isVerified 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                          : 'bg-rose-50 text-rose-600 border-rose-100/50'
                      }`}>
                        {user.isVerified ? <CheckCircle size={12} className="animate-in fade-in" /> : <XCircle size={12} />}
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-10 py-40 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-6 bg-slate-50 rounded-full mb-4">
                        <ShieldAlert size={48} className="text-slate-200" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Zero matches found in directory</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;