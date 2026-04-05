import React, { useState } from 'react';
import { Search, UserCircle, ShieldAlert } from 'lucide-react';

const UserManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data State
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Verified', initial: 'JD', joinDate: 'Jan 2024' },
    { id: 2, name: 'Sarah Chen', email: 'sarah.guide@tomo.com', role: 'Guide', status: 'Pending', initial: 'SC', joinDate: 'Feb 2024' },
    { id: 3, name: 'Mike Ross', email: 'mike@tomo.admin', role: 'Admin', status: 'Verified', initial: 'MR', joinDate: 'Dec 2023' },
    { id: 4, name: 'Emma Wilson', email: 'emma@traveler.com', role: 'Customer', status: 'Verified', initial: 'EW', joinDate: 'Mar 2024' },
    { id: 5, name: 'Liam Neeson', email: 'liam@action.com', role: 'Customer', status: 'Suspended', initial: 'LN', joinDate: 'Jan 2024' },
  ]);

  // Filter: 1. Only Customers | 2. Apply Search
  const filteredUsers = users
    .filter(user => user.role === 'Customer')
    .filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* MINIMAL HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Traveler Directory</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Total Verified Customers: {filteredUsers.filter(u => u.status === 'Verified').length}
          </p>
        </div>
        
        {/* SEARCH BAR */}
        <div className="relative">
          <Search 
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              searchQuery ? 'text-emerald-500' : 'text-slate-300'
            }`} 
            size={16} 
          />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search travelers..."
            className="pl-12 pr-6 py-3 bg-slate-100/50 border-2 border-transparent focus:border-emerald-500/10 focus:bg-white rounded-2xl text-xs font-bold outline-none transition-all w-72 shadow-sm"
          />
        </div>
      </div>

      {/* SIMPLIFIED TABLE (No Actions) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Traveler</th>
              <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
              <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Joined</th>
              <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-all">
                  
                  {/* PROFILE */}
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px] tracking-tighter shadow-lg">
                        {user.initial}
                      </div>
                      <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{user.name}</span>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-10 py-6">
                    <span className="text-xs font-semibold text-slate-500">{user.email}</span>
                  </td>

                  {/* JOIN DATE */}
                  <td className="px-10 py-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {user.joinDate}
                  </td>

                  {/* STATUS */}
                  <td className="px-10 py-6 text-right">
                    <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border ${
                      user.status === 'Verified' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <ShieldAlert size={40} className="mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">No matching travelers</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;