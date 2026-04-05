import React from 'react';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, 
  Loader2, ShieldCheck, LogOut 
} from 'lucide-react';

const AlertModal = ({ 
isOpen, 
  type = 'success', 
  title, 
  message, 
  onConfirm = () => {}, // Default empty function
  onCancel = () => {},  // Default empty function
  confirmText = "Continue", 
  loading = false
}) => {
  if (!isOpen) return null;

  const themes = {
    success: {
      icon: <ShieldCheck size={40} className="text-emerald-500" />,
      bg: 'bg-emerald-50',
      button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
      accent: 'text-emerald-600'
    },
    warning: {
      icon: <LogOut size={40} className="text-amber-500" />,
      bg: 'bg-amber-50',
      button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
      accent: 'text-amber-600'
    },
    error: {
      icon: <AlertTriangle size={40} className="text-rose-500" />,
      bg: 'bg-rose-50',
      button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200',
      accent: 'text-rose-600'
    }
  };

  const theme = themes[type] || themes.success;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity" 
        onClick={loading ? null : onCancel} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 p-10 text-center animate-in zoom-in-95 duration-300">
        
        {/* Icon Container */}
        <div className={`mx-auto w-20 h-20 ${theme.bg} rounded-[2.2rem] flex items-center justify-center mb-6`}>
          {theme.icon}
        </div>

        {/* Text Content */}
        <span className={`${theme.accent} text-[9px] font-black uppercase tracking-[0.4em] mb-2 block`}>
          System Notification
        </span>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-3">
          {title}
        </h2>
        <p className="text-slate-500 font-medium text-xs leading-relaxed mb-8 px-2">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            disabled={loading}
            className={`w-full ${theme.button} text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                {confirmText} <ArrowRight size={14} />
              </>
            )}
          </button>
          
          {!loading && onCancel && (
            <button 
              onClick={onCancel}
              className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;