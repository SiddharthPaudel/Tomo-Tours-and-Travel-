import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import { auth } from "../../services/firebase";
import { applyActionCode } from "firebase/auth";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  
  // 1. Create a ref to track if we've already sent the request
  const verificationStarted = useRef(false);
  
  const actionCode = searchParams.get('oobCode');

  useEffect(() => {
    const verifyEmail = async () => {
      // 2. If no code or we've already started, don't run again
      if (!actionCode || verificationStarted.current) return;

      // 3. Mark as started immediately
      verificationStarted.current = true;

      try {
        await applyActionCode(auth, actionCode);
        setStatus('success');
      } catch (error) {
        console.error("Verification error:", error.code);
        // Only set error if we haven't already succeeded
        setStatus('error');
      }
    };

    verifyEmail();
  }, [actionCode]);

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-start justify-center pt-[5vh] md:pt-[10vh] p-6 font-['Montserrat']">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 text-center">
        
        {/* DECORATIVE ELEMENTS */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-slate-50 rounded-full blur-3xl opacity-60"></div>

        {status === 'verifying' && (
          <div className="py-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Verifying...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-in zoom-in-95 duration-700">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
              Email <span className="text-emerald-500">Verified.</span>
            </h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4 leading-loose">
              Your account is now active. <br /> 
              Welcome to the <span className="text-slate-900">Tomo</span> ecosystem.
            </p>

            <button 
              onClick={() => navigate('/')}
              className="mt-10 w-full bg-slate-900 hover:bg-emerald-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <XCircle className="text-rose-500" size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              Link <span className="text-rose-500">Expired.</span>
            </h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4 px-4">
              This link is invalid or already used.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-10 w-full bg-slate-100 text-slate-900 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;