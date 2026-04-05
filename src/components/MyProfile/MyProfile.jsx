import React, { useState, useEffect } from "react";
import { db, auth } from "../../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Package,
  ChevronRight,
  Loader2,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Users,
  ArrowRight,
} from "lucide-react";

// --- INTERNAL ALERT MODAL COMPONENT ---
const AlertModal = ({
  isOpen,
  type = "success",
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Continue",
}) => {
  if (!isOpen) return null;

  const themes = {
    success: {
      icon: <ShieldCheck size={48} className="text-emerald-500" />,
      bg: "bg-emerald-50",
      button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
      accent: "text-emerald-600",
    },
    warning: {
      icon: <LogOut size={48} className="text-amber-500" />,
      bg: "bg-amber-50",
      button: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
      accent: "text-amber-600",
    },
  };

  const theme = themes[type];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="relative bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 p-10 text-center animate-in zoom-in-95 duration-300">
        <div
          className={`mx-auto w-20 h-20 ${theme.bg} rounded-[2rem] flex items-center justify-center mb-6`}
        >
          {theme.icon}
        </div>
        <span
          className={`${theme.accent} text-[9px] font-black uppercase tracking-[0.4em] mb-2 block`}
        >
          Account Security
        </span>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          {title}
        </h2>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 px-4">
          {message}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full ${theme.button} text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl`}
          >
            {confirmText} <ArrowRight size={14} />
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-600 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: null,
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
        );
        const unsubscribeBookings = onSnapshot(q, (snapshot) => {
          setBookings(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          );
          setLoading(false);
        });
        return () => unsubscribeBookings();
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  const triggerLogout = () => {
    setModalConfig({
      isOpen: true,
      type: "warning",
      title: "Sign Out?",
      message:
        "Are you sure you want to end your current session? You will need to login again to view your bookings.",
      confirmText: "Yes, Sign Out",
      onConfirm: () => {
        auth.signOut().then(() => navigate("/"));
      },
      onCancel: () => setModalConfig({ ...modalConfig, isOpen: false }),
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Loading Dashboard
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-montserrat pb-20">
      {/* Custom Modal Rendering */}
      <AlertModal {...modalConfig} onCancel={modalConfig.onCancel} />

      <div className="bg-emerald-950 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center text-white overflow-hidden shadow-2xl border-4 border-emerald-900">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 p-2 rounded-xl border-4 border-emerald-950 text-white">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em]">
              Member Dashboard
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mt-2">
              {user?.displayName || "Traveler"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
              <div className="flex items-center gap-2 text-emerald-200/60 text-[11px] font-bold">
                <Mail size={14} className="text-emerald-500" /> {user?.email}
              </div>
              <div className="flex items-center gap-2 text-emerald-200/60 text-[11px] font-bold">
                <Clock size={14} className="text-emerald-500" /> Joined{" "}
                {new Date(user?.metadata.creationTime).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button
            onClick={triggerLogout}
            className="flex items-center gap-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 px-6 py-4 rounded-2xl transition-all border border-white/10 text-[11px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Account Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-xs">
                    <Package size={16} className="text-emerald-600" /> Total
                    Bookings
                  </div>
                  <span className="text-lg font-black text-slate-900">
                    {bookings.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-xs">
                    <ShieldCheck size={16} className="text-emerald-600" />{" "}
                    Status
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                Travel History
              </h2>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
                <AlertCircle
                  size={48}
                  className="text-slate-200 mx-auto mb-4"
                />
                <h3 className="text-lg font-black text-slate-400 uppercase tracking-tighter">
                  No Bookings Found
                </h3>
                <button
                  onClick={() => navigate("/domestic")}
                  className="mt-8 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            {/* DYNAMIC STATUS BADGE */}
                            <div
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                                booking.status === "approved"
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                  : "bg-amber-50 border-amber-100 text-amber-600"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                  booking.status === "approved"
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                {booking.status || "pending"}
                              </span>
                            </div>

                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                              {booking.packageType}
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter group-hover:text-emerald-600 transition-colors">
                            {booking.packageName}
                          </h3>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                              <Users size={12} /> {booking.travelers} Travelers
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                              <Calendar size={12} /> {booking.travelDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Total
                        </p>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">
                          {booking.packagePrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
