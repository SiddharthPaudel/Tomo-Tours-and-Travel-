import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { 
  collection, addDoc, serverTimestamp, query, 
  orderBy, onSnapshot, deleteDoc, doc 
} from "firebase/firestore";
import { db } from "../../services/firebase";
import AlertModal from '../../utils/AlertModal';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  
  const [alertConfig, setAlertConfig] = useState({ 
    show: false, 
    type: 'success', 
    title: '', 
    msg: '', 
    onConfirm: () => {} 
  });

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_GALLERY;

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
    if (!file || !description.trim()) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Upload Failed");

      await addDoc(collection(db, "gallery"), {
        url: data.secure_url,
        name: description,
        createdAt: serverTimestamp()
      });

      setFile(null);
      setDescription('');
      
      setAlertConfig({
        show: true,
        type: 'success',
        title: 'Uploaded',
        msg: 'Digital artifact synced.',
        onConfirm: () => setAlertConfig({ ...alertConfig, show: false })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setAlertConfig({
      show: true,
      type: 'warning',
      title: 'Remove?',
      msg: 'Delete this from the cloud gallery?',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "gallery", id));
          setAlertConfig({
            show: true,
            type: 'success',
            title: 'Removed',
            msg: 'Artifact deleted.',
            onConfirm: () => setAlertConfig({ ...alertConfig, show: false })
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center font-black uppercase text-slate-300 tracking-widest text-[10px]">
      Fetching Assets...
    </div>
  );

  return (
    <div className="p-4 md:p-8 font-['Montserrat'] max-w-7xl mx-auto space-y-8 md:space-y-12">
      
      {/* CHECK ALERTMODAL.JSX:
        Ensure the overlay div uses 'bg-slate-900/60' instead of 'backdrop-blur' 
        to keep the background sharp and visible during deletion.
      */}
      <AlertModal 
        isOpen={alertConfig.show}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.msg}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig({ ...alertConfig, show: false })}
      />

      {/* RESPONSIVE UPLOAD BOX */}
      <div className="bg-white border border-slate-100 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6">Gallery Update</h2>
        <div className="flex flex-col xl:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Artifact Name" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 p-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-emerald-500/10 transition-all"
          />
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <label className="flex-1 cursor-pointer bg-slate-50 px-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-all flex items-center justify-center min-h-[56px]">
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
              <span className="text-[10px] font-black uppercase text-slate-400 truncate max-w-[200px]">
                {file ? file.name : "Choose Image"}
              </span>
            </label>

            <button 
              onClick={handleUpload}
              disabled={uploading || !file || !description}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-20 shadow-xl flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
              {uploading ? "Processing" : "Add to Cloud"}
            </button>
          </div>
        </div>
      </div>

      {/* RESPONSIVE MASONRY-STYLE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {images.map((img) => (
          <div key={img.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="aspect-square bg-slate-50 overflow-hidden relative">
              <img 
                src={img.url} 
                alt={img.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Mobile-friendly delete button (Always visible on mobile, hover on desktop) */}
              <button 
                onClick={() => handleDeleteClick(img.id)}
                className="absolute top-4 right-4 bg-white text-rose-500 p-3 rounded-2xl shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-black uppercase text-slate-800 truncate tracking-tight">{img.name}</p>
              <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">Cloud Asset</p>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] opacity-20">
            <ImageIcon size={40} className="mb-4" />
            <p className="text-[11px] font-black uppercase tracking-widest">Gallery Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;