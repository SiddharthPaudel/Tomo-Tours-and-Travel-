import React, { useState, useEffect } from 'react';
import { X, Maximize2, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase"; // Ensure path is correct

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  // --- FETCH IMAGES FROM FIRESTORE ---
  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(fetchedPhotos);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching gallery:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white min-h-screen font-montserrat pb-20">
      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            {/* Using first photo as a blurred background if available */}
            {photos.length > 0 && (
                <img src={photos[0].url} className="w-full h-full object-cover blur-sm" alt="bg" />
            )}
        </div>
        <div className="relative z-10">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Visual Archive</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">The Gallery</h1>
        </div>
      </div>

      {/* --- GALLERY GRID --- */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="animate-spin text-emerald-500" size={40} />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Artifacts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => setSelectedImg(photo)}
                className="group relative aspect-square overflow-hidden rounded-[2.5rem] cursor-pointer shadow-xl bg-slate-50 border border-slate-100"
              >
                <img 
                  src={photo.url} 
                  alt={photo.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center p-6 text-center">
                  <h3 className="text-white text-sm font-black uppercase tracking-tight mb-4">
                    {photo.name}
                  </h3>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && photos.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No images found</p>
            </div>
        )}
      </div>

      {/* --- FOOTER NAVIGATION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-20 text-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-colors shadow-xl"
        >
          <ArrowLeft size={14} /> Back to Adventure
        </Link>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-900/95 flex items-center justify-center p-4" 
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X size={40} />
          </button>
          
          <div className="max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImg.url} 
              alt={selectedImg.name}
              className="max-h-[75vh] w-auto rounded-3xl shadow-2xl animate-in zoom-in duration-300"
            />
            <div className="mt-8 text-center">
              <h2 className="text-white text-3xl font-black uppercase tracking-tighter mt-2">
                {selectedImg.name}
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;