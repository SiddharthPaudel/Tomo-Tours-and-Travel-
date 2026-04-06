import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../services/firebase";
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Globe, 
  LogOut,
  Settings,
  ChevronRight,
  Mail,
  ClipboardList ,ImageIcon// Icon for Bookings
} from 'lucide-react';
import AlertModal from '../../utils/AlertModal';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Modal State for Logout Confirmation
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    confirmText: 'Sign Out',
    onConfirm: () => {},
  });

  // Handle Logout with Premium Modal
  const handleLogout = () => {
    setModalConfig({
      isOpen: true,
      type: 'warning',
      title: 'Admin Sign Out',
      message: 'Are you sure you want to end your administrative session?',
      confirmText: 'Yes, Sign Out',
      onConfirm: async () => {
        setIsLoggingOut(true);
        try {
          // Artificial delay for smooth UI feedback
          await new Promise(resolve => setTimeout(resolve, 800));
          await signOut(auth);
          navigate('/');
        } catch (error) {
          console.error("Logout Error:", error.message);
        } finally {
          setIsLoggingOut(false);
          setModalConfig({ ...modalConfig, isOpen: false });
        }
      }
    });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: ClipboardList }, // Added Bookings Tab
    { id: 'activities', label: 'Activities', icon: Map },
    { id: 'destinations', label: 'Destinations', icon: Globe },
    { id: 'users', label: 'Travelers', icon: Users },
    { id: 'messages', label: 'Inquiries', icon: Mail },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-400 flex flex-col fixed h-full z-20 border-r border-slate-800/50 font-montserrat">
      
      {/* Logout Confirmation Modal */}
      <AlertModal 
        {...modalConfig} 
        loading={isLoggingOut}
        onCancel={() => !isLoggingOut && setModalConfig({ ...modalConfig, isOpen: false })} 
      />

      {/* BRANDING */}
      <div className="h-24 flex items-center px-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <h1 className="text-lg font-black text-white tracking-tighter uppercase">
            TOMO<span className="text-emerald-500">.</span>
          </h1>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-grow px-3 mt-4 space-y-1">
        <p className="px-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 opacity-50">
          Management
        </p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-200'} />
                <span className={`text-[13px] font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </div>
              
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              )}
              {!isActive && (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 mt-auto border-t border-slate-800/50 bg-slate-900/20">
        <div className="space-y-1">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors group">
            <Settings size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black uppercase tracking-widest text-rose-400/70 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;