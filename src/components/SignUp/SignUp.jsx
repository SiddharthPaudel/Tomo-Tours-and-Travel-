import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { auth, db } from "../../services/firebase"; 
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import pic from "../../images/hero5.jpg";
import AlertModal from '../../utils/AlertModal';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(formData.email)) {
      setAlertConfig({ isOpen: true, type: 'error', title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      setAlertConfig({ isOpen: true, type: 'error', title: 'Weak Password', message: 'Use 8+ chars with upper, lower, number, and special symbol.' });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setAlertConfig({ isOpen: true, type: 'error', title: 'Mismatch', message: 'Passwords do not match.' });
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: formData.fullName });
      await sendEmailVerification(user);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: formData.fullName,
        email: user.email,
        emailVerified: false, 
        role: "user", 
        createdAt: new Date(),
      });
      setIsVerificationSent(true); 
    } catch (err) {
      let msg = err.message.replace("Firebase:", "");
      if (err.code === 'auth/email-already-in-use') msg = "Email already registered.";
      setAlertConfig({ isOpen: true, type: 'error', title: 'Signup Failed', message: msg });
    } finally {
      setLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6 font-['Montserrat']">
        <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-100">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Verify Email</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Link sent to <span className="font-bold text-slate-900">{formData.email}</span>.
          </p>
          <button onClick={() => navigate('/')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl uppercase text-[10px] tracking-[0.2em]">
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-4 md:p-6 font-['Montserrat']">
      <AlertModal 
        {...alertConfig} 
        onConfirm={() => setAlertConfig({ ...alertConfig, isOpen: false })} 
        onCancel={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />

      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-sm flex flex-col md:flex-row border border-slate-100 overflow-hidden min-h-[600px]">
        
        {/* LEFT SIDE (Hero) - MODIFIED: Removed Tint and Blur */}
        <div className="md:w-[45%] relative hidden md:block">
          <img src={pic} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
          
          {/* UPDATED: Full Branding */}
          <div className="absolute top-10 left-10 text-white z-10">
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">TOMO TOURS<br/>AND TRAVEL<span className="text-emerald-400">.</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mt-2">Consult & Travel</p>
          </div>
        </div>

        {/* RIGHT SIDE (Form) */}
        <div className="md:w-[55%] p-8 md:p-14 bg-white flex flex-col justify-center relative">
          
          {/* MOVED: Login Link to Top Right */}
          <div className="absolute top-8 right-8 md:top-10 md:right-14">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Member? <Link to="/login" className="text-emerald-600 font-black ml-1 hover:underline">Log In</Link>
            </p>
          </div>

          <div className="max-w-sm w-full mx-auto mt-4">
            <header className="mb-8 text-left">
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Create Account</h3>
              <p className="text-slate-400 text-[9px] font-black mt-2 uppercase tracking-[0.3em]">Join the explorer network</p>
            </header>

            <form onSubmit={handleSignup} className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input required name="fullName" type="text" onChange={handleChange} placeholder="Siddhartha Paudel" className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-emerald-500/10 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input required name="email" type="email" onChange={handleChange} placeholder="explorer@tomo.np" className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-emerald-500/10 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input required name="password" type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="••••••••" className="w-full pl-11 pr-11 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-emerald-500/10 outline-none transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input required name="confirmPassword" type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="••••••••" className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-emerald-500/10 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className={`w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 mt-4 shadow-xl hover:shadow-emerald-500/5 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600 active:scale-95'}`}
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Initialize Account"} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;