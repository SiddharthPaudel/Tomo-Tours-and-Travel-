import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploadField = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelect(file); // Send the file back to the main form state
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div className="w-full mb-6">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-1">
        Cover Image
      </label>

      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-3 bg-white rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Activity Photo</p>
            <p className="text-[9px] text-slate-300 mt-1 font-bold italic">PNG, JPG (Max 5MB)</p>
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
      ) : (
        <div className="relative group h-44 rounded-[2rem] overflow-hidden border border-slate-200 shadow-lg">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              onClick={clearImage}
              className="p-3 bg-white text-rose-500 rounded-2xl shadow-xl hover:scale-110 transition-transform"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;