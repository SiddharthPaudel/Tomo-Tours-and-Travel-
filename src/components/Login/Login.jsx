import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider, db } from "../../services/firebase"; 
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import AlertModal from '../../utils/AlertModal'; // Path to your new modal
import pic from "../../images/hero3.jpg";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Added Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const getUserRoleAndSync = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const newUser = {
        uid: user.uid,
        displayName: user.displayName || "New Explorer",
        email: user.email,
        photoURL: user.photoURL || "",
        createdAt: new Date(),
        role: "user" 
      };
      await setDoc(userRef, newUser);
      return "user";
    } else {
      return docSnap.data().role || "user";
    }
  };

  // 2. Optimized Login Logic with Modal
  const handleLoginSuccess = (role) => {
    setModalConfig({
      isOpen: true,
      type: 'success',
      title: 'Login Successful',
      message: 'Welcome back! Redirecting you to your dashboard...',
      confirmText: 'Continue',
      onConfirm: () => {
        setModalConfig({ ...modalConfig, isOpen: false });
        if (role === "admin") {
          navigate("/admin/*");
        } else {
          navigate("/");
        }
      }
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const role = await getUserRoleAndSync(result.user);
      handleLoginSuccess(role); // Show success message
    } catch (err) {
      console.error(err);
      // Keep your existing error text AND show the modal for better UI
      setError("Invalid email or password. Please try again.");
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Authentication Failed',
        message: 'The email or password you entered is incorrect.',
        confirmText: 'Try Again',
        onConfirm: () => setModalConfig({ ...modalConfig, isOpen: false })
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const role = await getUserRoleAndSync(result.user);
      handleLoginSuccess(role); // Show success message
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-start justify-center pt-[5vh] md:pt-[7vh] p-6 font-['Montserrat'] overflow-x-hidden">
      
      {/* 3. Added the Modal Component here */}
      <AlertModal 
        {...modalConfig} 
        onCancel={() => !loading && setModalConfig({ ...modalConfig, isOpen: false })} 
      />

      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] flex flex-col md:flex-row border border-slate-100 overflow-hidden h-fit mb-10">
        
        {/* LEFT SIDE (Hero Image) - NO CHANGES */}
        <div className="md:w-[42%] relative hidden md:block self-stretch min-h-[480px]">
          <img src={pic} alt="Mountains" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/30" />
          <div className="absolute top-8 left-8 text-white z-10">
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              TOMO<span className="text-emerald-400">.</span>
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE (Form) - NO CHANGES */}
        <div className="md:w-[58%] p-6 md:p-10 bg-white flex flex-col items-center">
          <div className="max-w-sm w-full relative">
            <header className="mb-6 text-center">
              <h3 className="text-3xl text-emerald-600 font-bold tracking-tight">Welcome Back</h3>
              <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">The trails are waiting</p>
            </header>

            {error && <p className="text-red-500 text-xs font-bold mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}

            {/* GOOGLE BUTTON */}
            <button 
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all mb-5 shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {/* Google SVG Icon */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09A6.97 6.97 0 015.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11.99 11.99 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-tight">Continue with Google</span>
            </button>

            <div className="relative flex items-center mb-5">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="mx-4 text-[8px] font-bold uppercase tracking-[0.3em] text-slate-300">OR</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* EMAIL FORM */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="group">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="explorer@tomo.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-emerald-500/10 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-1 px-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-[9px] font-bold text-emerald-600">Forgot Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-emerald-500/10 outline-none transition-all shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-slate-100 disabled:bg-slate-400"
              >
                {loading ? "Logging in..." : "Log In"} <ArrowRight size={18} />
              </button>
            </form>

            <footer className="mt-6 text-center pt-5 border-t border-slate-50">
              <p className="text-[11px] font-medium text-slate-500">
                New here? <Link to="/signup" className="text-emerald-600 font-bold ml-1 hover:underline">Create Account</Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;