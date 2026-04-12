import React, { useState, useEffect } from 'react';
import { auth } from "../../services/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, CheckCircle, ShieldCheck, Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const actionCode = searchParams.get('oobCode');

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validCode, setValidCode] = useState(true);

  // Validation States
  const validations = {
    minLength: newPassword.length >= 8,
    hasNumber: /\d/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isPasswordValid = Object.values(validations).every(Boolean);

  useEffect(() => {
    if (!actionCode) {
      setValidCode(false);
    } else {
      verifyPasswordResetCode(auth, actionCode).catch(() => setValidCode(false));
    }
  }, [actionCode]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setLoading(true);
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      alert("Failed to reset: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!validCode) return (
    <div className="min-h-screen flex items-start justify-center pt-[10vh] bg-[#F8FAFB] font-['Montserrat'] p-6">
       <div className="text-center p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 max-w-sm w-full animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
             <Lock size={24} />
          </div>
          <p className="text-rose-600 font-black uppercase tracking-widest text-[10px] mb-4">Link Expired or Invalid</p>
          <button onClick={() => navigate('/forgot-password')} className="text-[11px] font-bold text-slate-900 underline uppercase hover:text-emerald-600 transition-colors">
            Request a new link
          </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-start justify-center pt-[3vh] md:pt-[6vh] p-6 font-['Montserrat']">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {!success ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
             <header className="mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck className="text-emerald-600" size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight whitespace-nowrap">
                  Secure Your <span className="text-emerald-500">Account.</span>
                </h2>
                <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3 leading-relaxed">
                  Set a strong new password for your profile
                </p>
             </header>

             <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
                     New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full pl-14 pr-14 py-4 md:py-5 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/10 focus:bg-white transition-all shadow-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors px-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="grid grid-cols-1 gap-2 px-2">
                  <ValidationItem label="At least 8 characters" isValid={validations.minLength} />
                  <ValidationItem label="Contains a number" isValid={validations.hasNumber} />
                  <ValidationItem label="Contains a special character" isValid={validations.hasSpecial} />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !isPasswordValid} 
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 md:py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Update Password <ArrowRight size={16}/></>
                  )}
                </button>
             </form>
          </div>
        ) : (
          <div className="text-center py-10 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-emerald-500" size={32} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Password Updated!</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase leading-loose">
               Your security is our priority. <br/> Redirecting you to login...
             </p>
          </div>
        )}

        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full blur-2xl opacity-40"></div>
      </div>
    </div>
  );
};

// Helper component for validation items
const ValidationItem = ({ label, isValid }) => (
  <div className={`flex items-center gap-2 transition-colors duration-300 ${isValid ? 'text-emerald-600' : 'text-slate-300'}`}>
    {isValid ? <Check size={12} className="stroke-[4px]" /> : <X size={12} className="stroke-[4px]" />}
    <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
  </div>
);

export default ResetPassword;