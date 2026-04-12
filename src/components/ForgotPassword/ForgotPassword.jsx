import React, { useState } from 'react';
import { auth } from "../../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, ChevronLeft, Loader2, CheckCircle2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Check your inbox.");
      setEmail('');
    } catch (err) {
      setError("We couldn't find an account with that email.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Changed pt-[10vh] to pt-[5vh] to move it upward */
    <div className="min-h-screen bg-[#F8FAFB] flex items-start justify-center pt-[5vh] md:pt-[8vh] p-6 font-['Montserrat']">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-all mb-8 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Login
        </button>

        <header className="mb-8">
            {/* Removed <br /> to show on same line */}
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
              Reset <span className="text-emerald-500">Access.</span>
            </h2>
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3 leading-relaxed">
              Enter your email to receive a secure recovery link
            </p>
        </header>

        {/* Status Messages */}
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-emerald-500 p-1 rounded-full text-white flex-shrink-0">
                <CheckCircle2 size={14} />
            </div>
            <p className="text-[9px] font-black text-emerald-800 uppercase tracking-tight">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
             <div className="bg-rose-500 p-1 rounded-full text-white flex-shrink-0">
                <Mail size={14} />
            </div>
            <p className="text-[9px] font-black text-rose-700 uppercase tracking-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
               Email Address
            </label>
            <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tomo.com" 
                    className="w-full pl-14 pr-6 py-4 md:py-5 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/10 focus:bg-white transition-all shadow-sm"
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 md:py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-[0.98] disabled:bg-slate-300 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <>Send Link <Send size={14} /></>
            )}
          </button>
        </form>

        {/* Decorative Elements */}
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full blur-2xl opacity-40"></div>
      </div>
    </div>
  );
};

export default ForgotPassword;