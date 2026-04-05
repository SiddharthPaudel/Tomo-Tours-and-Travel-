import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { auth, db } from "../../services/firebase"; 
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth"; // Removed signOut
import { doc, setDoc } from "firebase/firestore";
import pic from "../../images/hero5.jpg";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match!");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Set Display Name 
      await updateProfile(user, { displayName: formData.fullName });

      // 3. Send Verification Email
      await sendEmailVerification(user);

      // 4. Create Firestore Document
      // We set emailVerified to false initially. 
      // The Navbar will flip this to true once the link is clicked.
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: formData.fullName,
        email: user.email,
        emailVerified: false, 
        role: "user", 
        createdAt: new Date(),
      });

      // 5. REMOVED: await signOut(auth);
      // By staying logged in, the Navbar can "watch" the user.
      // Once they click the link in their email and come back/refresh, 
      // the Navbar syncs the DB.

      setIsVerificationSent(true); 
    } catch (err) {
      console.error(err);
      const errorMessage = err.message.includes("auth/email-already-in-use") 
        ? "This email is already registered." 
        : err.message.replace("Firebase:", "");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6 font-['Montserrat']">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-500" size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Verify Email</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            We've sent a link to <span className="font-bold text-slate-800">{formData.email}</span>. 
            Keep this tab open, check your email, and click the link!
          </p>
          <button 
            onClick={() => navigate('/')} // Take them to Home so they see the "Verify" banner
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 uppercase text-xs tracking-widest"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-start justify-center pt-[5vh] md:pt-[7vh] p-6 font-['Montserrat'] overflow-x-hidden">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] flex flex-col md:flex-row border border-slate-100 overflow-hidden h-fit mb-10">
        
        {/* LEFT SIDE (Hero) */}
        <div className="md:w-[42%] relative hidden md:block self-stretch min-h-[580px]">
          <img src={pic} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute top-8 left-8 text-white z-10">
            <h1 className="text-2xl font-black tracking-tighter uppercase">TOMO<span className="text-emerald-400">.</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Consult & Travel</p>
          </div>
        </div>

        {/* RIGHT SIDE (Form) */}
        <div className="md:w-[58%] p-6 md:p-10 bg-white flex flex-col items-center">
          <div className="max-w-sm w-full">
            <header className="mb-8 text-center">
              <h3 className="text-3xl text-emerald-600 font-bold tracking-tight">Create Account</h3>
              <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">Join our explorer community</p>
            </header>

            {error && <p className="text-red-500 text-xs font-bold mb-4 text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="group">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input required name="fullName" type="text" onChange={handleChange} placeholder="Enter your name" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-emerald-500/20 outline-none transition-all" />
                </div>
              </div>

              <div className="group">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input required name="email" type="email" onChange={handleChange} placeholder="explorer@tomo.com" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-emerald-500/20 outline-none transition-all" />
                </div>
              </div>

              <div className="group">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input required name="password" type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 bg-slate-50 border-2 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-emerald-500/20 outline-none transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="group">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input required name="confirmPassword" type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl text-sm font-semibold focus:bg-white focus:border-emerald-500/20 outline-none transition-all" />
                </div>
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className={`w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-4 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600 active:scale-[0.98]'}`}
              >
                {loading ? "Creating Account..." : "Join Now"} <ArrowRight size={16} />
              </button>
            </form>

            <footer className="mt-8 text-center pt-6 border-t border-slate-50">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                Already a member? <Link to="/login" className="text-emerald-600 font-black ml-1 hover:underline">Log In</Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;