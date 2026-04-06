import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSideBar';
import DashboardOverview from './DashboardOverview';
import UserManager from './UserManager';
import ActivityCRUD from './Activity/ActivityManager';
import { Search } from 'lucide-react';
import DestinationManager from './Destination/DestinationManager';
import InquiryManager from './InquiryManager';
// Firebase Imports
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Booking from './Booking';
import GalleryManager from './GalleryManager';

const AdminMain = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState({  
    displayName: "Loading...",
    photoURL: "https://i.pravatar.cc/150?u=placeholder",
    role: "Admin"
  });

  useEffect(() => {
    // 1. Use onAuthStateChanged to wait for the user session to load
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 2. Fetch profile from Firestore using the verified UID
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setAdminData({
              displayName: data.displayName || user.displayName || "Admin User",
              photoURL: data.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${data.displayName || 'Admin'}&background=random`,
              role: data.role || "Admin"
            });
          } else {
            // Fallback to Auth data if Firestore doc doesn't exist yet
            setAdminData(prev => ({
              ...prev,
              displayName: user.displayName || "Authorized User",
              photoURL: user.photoURL || prev.photoURL
            }));
          }
        } catch (error) {
          console.error("Error fetching admin profile:", error);
          if (error.code === 'permission-denied') {
            setAdminData(prev => ({ ...prev, displayName: "Access Denied", role: "Unauthorized" }));
          }
        }
      } else {
        // Handle case where user logs out or session expires
        setAdminData({
          displayName: "Guest",
          photoURL: "https://i.pravatar.cc/150?u=placeholder",
          role: "No Session"
        });
      }
    });

    // 3. Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex font-['Montserrat']">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-grow lg:ml-64 flex flex-col">
        {/* TOPBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Global search..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-5 border-l border-slate-100 pl-5">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                {adminData.displayName}
              </p>
              <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
                {adminData.role}
              </p>
            </div>
            <img 
              src={adminData.photoURL} 
              className="w-10 h-10 rounded-xl shadow-sm object-cover border border-slate-100 transition-transform hover:scale-105" 
              alt="Admin Profile" 
              onError={(e) => e.target.src = "https://i.pravatar.cc/150"} // Fallback for broken links
            />
          </div>
        </header>

        {/* DYNAMIC CONTENT SWITCHER */}
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'bookings' && <Booking />}
          {activeTab === 'users' && <UserManager />}
          {activeTab === 'activities' && <ActivityCRUD />}
          {activeTab === 'destinations' && <DestinationManager />}
          {activeTab === 'messages' && <InquiryManager />}
          {activeTab === 'gallery' && <GalleryManager />}
        </div>
      </main>
    </div>
  );
};

export default AdminMain;