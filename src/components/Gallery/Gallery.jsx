import React, { useState } from 'react';
import { X, Maximize2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- IMPORT YOUR IMAGES HERE ---
import gallery1 from "../../images/hero5.jpg";
import gallery2 from "../../images/hero4.jpg";
// Suggestion: Add more imports here like gallery3, gallery4 for variety
// import gallery3 from "../../images/hero3.jpg";
// import gallery4 from "../../images/hero2.jpg";

const GalleryPage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Trekking', 'Activities', 'Culture', 'Nature'];

  // Balanced Data: Exactly 4 images per category for perfect evenness
  const photos = [
    // TREKKING
    { id: 1, category: 'Trekking', src: gallery1, title: 'Himalayan Peaks' },
    { id: 2, category: 'Trekking', src: gallery2, title: 'The Long Trail' },
    { id: 3, category: 'Trekking', src: gallery1, title: 'Summit Push' },
    { id: 4, category: 'Trekking', src: gallery2, title: 'Base Camp Life' },
    
    // ACTIVITIES
    { id: 5, category: 'Activities', src: gallery2, title: 'White Water' },
    { id: 6, category: 'Activities', src: gallery1, title: 'Lakeside Bliss' },
    { id: 7, category: 'Activities', src: gallery2, title: 'Wild Camping' },
    { id: 8, category: 'Activities', src: gallery1, title: 'Forest Stays' },

    // CULTURE
    { id: 9, category: 'Culture', src: gallery1, title: 'Ancient Echoes' },
    { id: 10, category: 'Culture', src: gallery2, title: 'Temple Views' },
    { id: 11, category: 'Culture', src: gallery1, title: 'Local Heritage' },
    { id: 12, category: 'Culture', src: gallery2, title: 'Monastery Peace' },

    // NATURE
    { id: 13, category: 'Nature', src: gallery2, title: 'Alpine Lakes' },
    { id: 14, category: 'Nature', src: gallery1, title: 'Valley Mists' },
    { id: 15, category: 'Nature', src: gallery2, title: 'Golden Valleys' },
    { id: 16, category: 'Nature', src: gallery1, title: 'Deep Woods' },
  ];

  const filteredPhotos = filter === 'All' 
    ? photos 
    : photos.filter(p => p.category === filter);

  return (
    <div className="bg-white min-h-screen font-montserrat pb-20">
      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
            {/* Background Image using local import */}
            <img src={gallery2} className="w-full h-full object-cover" alt="bg" />
        </div>
        <div className="relative z-10">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Visual Archive</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">The Gallery</h1>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-center gap-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              filter === cat 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'bg-transparent border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- UNIFORM GRID (4 Columns) --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => setSelectedImg(photo)}
              className="group relative aspect-square overflow-hidden rounded-[2rem] cursor-pointer shadow-xl bg-slate-100"
            >
              <img 
                src={photo.src} 
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center p-6 text-center">
                <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-2">{photo.category}</span>
                <h3 className="text-white text-sm font-black uppercase tracking-tight mb-4">{photo.title}</h3>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
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
          className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4" 
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X size={40} />
          </button>
          
          <div className="max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImg.src} 
              alt={selectedImg.title}
              className="max-h-[75vh] w-auto rounded-3xl shadow-2xl animate-in zoom-in duration-300"
            />
            <div className="mt-8 text-center">
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">{selectedImg.category}</span>
              <h2 className="text-white text-3xl font-black uppercase tracking-tighter mt-2">{selectedImg.title}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;