import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSideBar';
import DashboardOverview from './DashboardOverview';
import UserManager from './UserManager';
import ActivityCRUD from './Activity/ActivityManager';
import { Search } from 'lucide-react';
import DestinationManager from './Destination/DestinationManager';
import InquiryManager from './InquiryManager';
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Booking from './Booking';
import GalleryManager from './GalleryManager';

const AdminMain = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize as null to prevent placeholder flickering on reload
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setAdminData({
              displayName: data.displayName || user.displayName || "Admin User",
              photoURL: data.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${data.displayName || 'Admin'}&background=random`,
              role: data.role || "Admin"
            });
          } else {
            // Fallback for authenticated users without a specific Firestore document
            setAdminData({
              displayName: user.displayName || "Authorized User",
              photoURL: user.photoURL || `https://ui-avatars.com/api/?name=Admin&background=random`,
              role: "Admin"
            });
          }
        } catch (error) {
          console.error("Error fetching admin profile:", error);
          // Set a safe fallback on error so the UI doesn't hang forever
          setAdminData({
            displayName: "Admin",
            photoURL: "https://i.pravatar.cc/150",
            role: "Admin"
          });
        }
      } else {
        setAdminData({
          displayName: "Guest",
          photoURL: "https://i.pravatar.cc/150?u=placeholder",
          role: "No Session"
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex font-['Montserrat'] overflow-x-hidden">
      {/* SIDEBAR */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow transition-all duration-300 w-full lg:ml-64 flex flex-col">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          
          {/* SEARCH */}
          <div className="relative w-40 md:w-72 hidden sm:block ml-14 lg:ml-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Global search..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
            />
          </div>

          <div className="sm:hidden flex-grow" />
          
          {/* PROFILE SECTION WITH LOADING LOGIC */}
          <div className="flex items-center gap-3 md:gap-5 border-l border-slate-100 pl-4 md:pl-5">
            {adminData ? (
              // This renders only once data is fetched from Firebase
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right hidden xs:block">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter truncate max-w-[120px]">
                    {adminData.displayName}
                  </p>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
                    {adminData.role}
                  </p>
                </div>
                <img 
                  src={adminData.photoURL} 
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl shadow-sm object-cover border border-slate-100 transition-transform hover:scale-105" 
                  alt="Admin Profile" 
                  onError={(e) => { e.target.src = "https://i.pravatar.cc/150"; }}
                />
              </div>
            ) : (
              // Professional Skeleton Loader for the "Refresh" state
              <div className="flex items-center gap-3 animate-pulse">
                <div className="text-right hidden xs:flex flex-col gap-1 items-end">
                  <div className="h-2 w-16 bg-slate-200 rounded" />
                  <div className="h-2 w-10 bg-slate-100 rounded" />
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-200 rounded-xl" />
              </div>
            )}
          </div>
        </header>

        {/* DYNAMIC CONTENT SWITCHER */}
        <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-x-hidden">
          <div className="max-w-full">
            {activeTab === 'dashboard' && <DashboardOverview />}
            {activeTab === 'bookings' && <Booking />}
            {activeTab === 'users' && <UserManager />}
            {activeTab === 'activities' && <ActivityCRUD />}
            {activeTab === 'destinations' && <DestinationManager />}
            {activeTab === 'messages' && <InquiryManager />}
            {activeTab === 'gallery' && <GalleryManager />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMain;