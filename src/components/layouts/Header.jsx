import React, { useState, useEffect } from "react";
import { Link as ScrollLink, scroller } from "react-scroll";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Mountain,
  Waves,
  Footprints,
  Globe,
  Map,
  Binoculars,
  User,
  LogOut,
  Settings,
  AlertCircle,
  RefreshCw,
  Package,
  MessageSquare,
} from "lucide-react";
import { auth, db } from "../../services/firebase";
import {
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import logoImg from "../../icon/logo1.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [resending, setResending] = useState(false);

  // States for mobile dropdowns
  const [mobileDestOpen, setMobileDestOpen] = useState(false);
  const [mobileActOpen, setMobileActOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.emailVerified) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().emailVerified === false) {
            await updateDoc(userRef, { emailVerified: true });
          }
        } catch (err) {
          console.error("Sync error:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const checkVerificationStatus = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      setUser({ ...updatedUser });
      if (updatedUser.emailVerified) {
        const userRef = doc(db, "users", updatedUser.uid);
        await updateDoc(userRef, { emailVerified: true });
      }
    }
  };

  const handleResendEmail = async () => {
    if (!auth.currentUser) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      alert("Verification email sent!");
    } catch (error) {
      alert("Wait a moment before resending.");
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      setIsOpen(false);
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const destinations = [
    {
      name: "Domestic",
      to: "/destinations/domestic",
      icon: <Map size={16} />,
      desc: "Explore local beauty",
    },
    {
      name: "International",
      to: "/destinations/international",
      icon: <Globe size={16} />,
      desc: "Global expeditions",
    },
  ];

  const activities = [
    {
      name: "Trek",
      to: "/activities/trek",
      icon: <Mountain size={16} />,
      desc: "High altitude climbs",
    },
    {
      name: "Hiking",
      to: "/activities/hiking",
      icon: <Footprints size={16} />,
      desc: "Scenic nature walks",
    },
    {
      name: "Rafting",
      to: "/activities/rafting",
      icon: <Waves size={16} />,
      desc: "River adventures",
    },
    {
      name: "Sight seeing",
      to: "/activities/sightseeing",
      icon: <Binoculars size={16} />,
      desc: "Cultural heritage tours",
    },
  ];

  // Enhanced Navigation Logic for Routing + Scrolling
  const handleNavClick = (target) => {
    setIsOpen(false);

    if (target.startsWith("/")) {
      navigate(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If we are not on Home, navigate Home first then scroll
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          scroller.scrollTo(target, {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
            offset: -100,
          });
        }, 100);
      } else {
        scroller.scrollTo(target, {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          offset: -100,
        });
      }
    }
  };

  const handleHomeClick = () => {
    setIsOpen(false);
    location.pathname !== "/"
      ? navigate("/")
      : window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="w-full font-montserrat sticky top-0 z-[100] shadow-sm bg-white">
      {user && !user.emailVerified && (
        <div className="bg-amber-500 text-white text-[10px] md:text-xs py-2 px-6 flex justify-center items-center gap-4 font-bold">
          <span className="flex items-center gap-2">
            <AlertCircle size={14} /> Verify your email.
          </span>
          <div className="flex gap-3">
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="underline"
            >
              {resending ? "..." : "Resend"}
            </button>
            <button
              onClick={checkVerificationStatus}
              className="bg-white/20 px-2 py-0.5 rounded flex items-center gap-1"
            >
              <RefreshCw size={10} /> Verified
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-900 text-white text-[10px] py-2.5 px-6 flex justify-between items-center tracking-wider font-semibold">
        <div className="flex items-center gap-6 mx-auto md:mx-0">
          <span className="flex items-center gap-2">
            <Phone size={12} className="text-emerald-500" /> +1 800-TOMO-GW
          </span>
          <span className="hidden md:flex items-center gap-2">
            <Mail size={12} className="text-emerald-500" />{" "}
            info@tomoglobewise.com
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-400 italic">
          <MapPin size={10} className="text-emerald-500" /> Your Gateway to
          Adventure
        </div>
      </div>

      <nav className="border-b border-gray-100 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-20 md:h-24 items-center">
            <div
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={handleHomeClick}
            >
              <img
                src={logoImg}
                alt="Logo"
                className="h-10 md:h-14 w-auto object-contain"
              />
              <div className="flex flex-col">
                <h1 className="text-sm md:text-2xl font-black tracking-tighter text-slate-800 leading-none uppercase">
                  Tomo GlobeWise
                </h1>
                <span className="text-[6px] md:text-[9px] font-extrabold uppercase tracking-[0.1em] text-emerald-600 mt-1 block leading-none">
                  Consult and travel pvt ltd
                </span>
              </div>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex space-x-1 items-center">
              <button
                onClick={handleHomeClick}
                className="px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-emerald-600 uppercase transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("about")}
                className="px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-emerald-600 uppercase transition-colors"
              >
                About Us
              </button>

              <DesktopDropdown
                label="Destinations"
                items={destinations}
                onAction={handleNavClick}
              />
              <DesktopDropdown
                label="Activities"
                items={activities}
                onAction={handleNavClick}
              />

              <button
                onClick={() => handleNavClick("/PackagePage")} // Added the '/' to signify a route
                className="px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-emerald-600 uppercase transition-colors"
              >
                Packages
              </button>
              <RouterLink
                to="/gallery"
                className="px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-emerald-600 uppercase transition-colors"
              >
                Gallery
              </RouterLink>
              <button
                onClick={() => handleNavClick("contact")}
                className="px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-emerald-600 uppercase transition-colors"
              >
                Contact
              </button>

              <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-2 relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-slate-50 rounded-full border border-slate-100"
                    >
                      <div className="text-left hidden xl:block">
                        <p className="text-[10px] font-black text-slate-800 leading-none uppercase">
                          {user.displayName || "Explorer"}
                        </p>
                        <p
                          className={`text-[8px] font-bold mt-0.5 uppercase tracking-tighter ${user.emailVerified ? "text-emerald-600" : "text-amber-500"}`}
                        >
                          {user.emailVerified ? "Verified" : "Pending"}
                        </p>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs overflow-hidden border-2 ${user.emailVerified ? "bg-emerald-600" : "bg-amber-400"}`}
                      >
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="profile" />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <ChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
                      />
                    </button>
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-2xl border p-2 z-[200]">
                        <RouterLink
                          to="/profile"
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl"
                        >
                          <User size={16} className="text-emerald-600" />
                          <span className="text-[11px] font-bold text-slate-700 uppercase">
                            My Profile
                          </span>
                        </RouterLink>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-500 rounded-xl"
                        >
                          <LogOut size={16} />
                          <span className="text-[11px] font-bold uppercase">
                            Log Out
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <RouterLink
                      to="/login"
                      className="px-4 py-2 text-[11px] font-bold text-slate-700 uppercase hover:bg-slate-50 rounded-lg"
                    >
                      Login
                    </RouterLink>
                    <RouterLink
                      to="/signup"
                      className="px-5 py-2.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg uppercase shadow-md"
                    >
                      Sign Up
                    </RouterLink>
                  </>
                )}
              </div>
            </div>

            {/* MOBILE TOGGLE */}
            <div className="lg:hidden flex items-center gap-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-800 p-2"
              >
                {isOpen ? (
                  <X size={32} className="text-emerald-600" />
                ) : (
                  <Menu size={32} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 top-[115px] bg-white z-[150] overflow-y-auto p-6 pb-32 shadow-2xl animate-in slide-in-from-top duration-300">
            {user && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-center gap-4 border ${user.emailVerified ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-black ${user.emailVerified ? "bg-emerald-600" : "bg-amber-500"}`}
                >
                  {user.displayName?.charAt(0) || "E"}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase">
                    {user.displayName || "Explorer"}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    {user.emailVerified ? "Verified" : "Pending"}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <button
                onClick={handleHomeClick}
                className="text-left py-4 border-b border-gray-50 text-xs font-black text-slate-700 uppercase"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("about")}
                className="text-left py-4 border-b border-gray-50 text-xs font-black text-slate-700 uppercase"
              >
                About Us
              </button>

              {/* Mobile Destinations Accordion */}
              <div>
                <button
                  onClick={() => setMobileDestOpen(!mobileDestOpen)}
                  className="w-full flex justify-between items-center py-4 border-b border-gray-50 text-xs font-black text-slate-700 uppercase"
                >
                  Destinations{" "}
                  <ChevronDown
                    size={16}
                    className={mobileDestOpen ? "rotate-180" : ""}
                  />
                </button>
                {mobileDestOpen && (
                  <div className="bg-slate-50 rounded-xl p-2 mt-2 space-y-1">
                    {destinations.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.to)}
                        className="w-full flex items-center gap-3 p-3 text-[10px] font-bold text-slate-600 uppercase"
                      >
                        {item.icon} {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Activities Accordion */}
              <div>
                <button
                  onClick={() => setMobileActOpen(!mobileActOpen)}
                  className="w-full flex justify-between items-center py-4 border-b border-gray-50 text-xs font-black text-slate-700 uppercase"
                >
                  Activities{" "}
                  <ChevronDown
                    size={16}
                    className={mobileActOpen ? "rotate-180" : ""}
                  />
                </button>
                {mobileActOpen && (
                  <div className="bg-slate-50 rounded-xl p-2 mt-2 space-y-1">
                    {activities.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.to)}
                        className="w-full flex items-center gap-3 p-3 text-[10px] font-bold text-slate-600 uppercase"
                      >
                        {item.icon} {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

             <button 
  onClick={() => handleNavClick('/PackagePage')} // Added the '/' to signify a route
  className="text-left py-4 border-b border-gray-50 text-xs font-black text-slate-700 uppercase"
>
  Packages
</button>
              <RouterLink
                to="/gallery"
                onClick={() => setIsOpen(false)}
                className="text-left py-4 border-b border-gray-50 text-xs font-black text-slate-700 uppercase"
              >
                Gallery
              </RouterLink>
              <button
                onClick={() => handleNavClick("contact")}
                className="text-left py-4 border-b border-gray-50 text-xs font-black text-slate-700 uppercase"
              >
                Contact
              </button>

              {user ? (
                <div className="pt-8 space-y-3">
                  <RouterLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex justify-center items-center gap-3 py-4 bg-slate-50 text-slate-800 text-sm font-black rounded-xl uppercase border"
                  >
                    View Profile
                  </RouterLink>
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 bg-red-50 text-red-600 text-sm font-black rounded-xl uppercase"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="pt-8 flex flex-col gap-4">
                  <RouterLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex justify-center py-4 bg-slate-50 text-slate-800 text-sm font-black rounded-xl uppercase border"
                  >
                    Login
                  </RouterLink>
                  <RouterLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 bg-emerald-600 text-white text-center text-sm font-black rounded-xl uppercase shadow-lg"
                  >
                    Sign Up
                  </RouterLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

const DesktopDropdown = ({ label, items, onAction }) => (
  <div className="relative group px-3 py-2">
    <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 group-hover:text-emerald-600 uppercase transition-colors">
      {label}{" "}
      <ChevronDown
        size={14}
        className="group-hover:rotate-180 transition-transform"
      />
    </button>
    <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-2xl mt-2 border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-3 transform origin-top duration-300">
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onAction(item.to)}
          className="flex items-start gap-4 p-3 hover:bg-emerald-50 rounded-xl w-full text-left transition-colors mb-1 last:mb-0"
        >
          <div className="text-emerald-600 bg-emerald-100 p-2.5 rounded-lg flex-shrink-0">
            {item.icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-800 uppercase leading-none">
              {item.name}
            </p>
            <p className="text-[9px] font-bold text-emerald-600 mt-1 uppercase tracking-tighter">
              {item.desc}
            </p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default Navbar;
