import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, onSnapshot, query, serverTimestamp 
} from 'firebase/firestore';

import DomesticFields from "./forms/DomesticField";
import InternationalFields from "./forms/InternationalField";
import ImageUploadField from '../ImageUploadField';
import DataTable from './DestinationTable';

const FieldComponents = { domestic: DomesticFields, international: InternationalFields };

const DestinationManager = () => {
  const [type, setType] = useState('domestic');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // CHANGED: Removed description, added overview
  const [commonData, setCommonData] = useState({ name: '', overview: '', budget: '' });
  const [specificData, setSpecificData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_DESTINATIONS;

  useEffect(() => {
    const q = query(collection(db, "destinations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setType(item.type);
    // CHANGED: Map overview from the item
    setCommonData({ 
      name: item.name, 
      overview: item.overview || '', 
      budget: item.budget 
    });
    setSpecificData(item.details || {});
    setSelectedImage(item.image);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = editingItem?.image || null;
      if (selectedImage && typeof selectedImage !== 'string') {
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('upload_preset', UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      // Payload now uses overview
      const payload = { 
        ...commonData, 
        type, 
        details: specificData, 
        image: imageUrl, 
        updatedAt: serverTimestamp() 
      };

      if (editingItem) {
        await updateDoc(doc(db, "destinations", editingItem.id), payload);
      } else {
        await addDoc(collection(db, "destinations"), { ...payload, createdAt: serverTimestamp() });
      }
      
      // Reset state after success
      setCommonData({ name: '', overview: '', budget: '' });
      setSpecificData({});
      setSelectedImage(null);
      setIsModalOpen(false);
    } catch (err) { 
      alert(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="p-8 font-['Montserrat']">
      <div className="flex gap-4 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {['domestic', 'international'].map(t => (
          <button 
            key={t} 
            onClick={() => setType(t)} 
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-end mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter capitalize">{type} Spots.</h2>
        <button 
          onClick={() => { setEditingItem(null); setCommonData({ name: '', overview: '', budget: '' }); setSpecificData({}); setSelectedImage(null); setIsModalOpen(true); }} 
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl"
        >
          + Add New
        </button>
      </div>

      <DataTable 
        type="destinations" 
        data={destinations.filter(item => item.type === type)} 
        onDelete={async (id) => { if(window.confirm("Delete?")) await deleteDoc(doc(db, "destinations", id)); }}
        onEdit={handleEdit} 
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white h-full rounded-[3rem] p-12 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 font-bold">✕</button>
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">{editingItem ? 'Edit' : 'New'} Spot</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUploadField onImageSelect={setSelectedImage} initialPreview={editingItem?.image} />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Package Name</label>
                <input 
                  type="text" placeholder="e.g. Kathmandu and Chitwan Tour" 
                  value={commonData.name} 
                  onChange={(e) => setCommonData({...commonData, name: e.target.value})} 
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-500/10 outline-none" 
                  required 
                />
              </div>

              {/* CHANGED: Description replaced with Trip Overview */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trip Overview</label>
                <textarea 
                  placeholder="The main narrative of the tour..." 
                  value={commonData.overview} 
                  onChange={(e) => setCommonData({...commonData, overview: e.target.value})} 
                  className="w-full p-4 bg-slate-50 rounded-2xl font-medium text-xs min-h-[150px] border-2 border-transparent focus:border-emerald-500/10 outline-none leading-relaxed" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pricing (Rs)</label>
                <input 
                  type="text" placeholder="e.g. 18000" 
                  value={commonData.budget} 
                  onChange={(e) => setCommonData({...commonData, budget: e.target.value})} 
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-500/10 outline-none" 
                />
              </div>

              <div className="py-6 border-y border-slate-100">
                {FieldComponents[type] && React.createElement(FieldComponents[type], { 
                  formData: specificData, 
                  onChange: (e) => setSpecificData({...specificData, [e.target.name]: e.target.value}) 
                })}
              </div>

              <button disabled={loading} type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-colors">
                {loading ? "Processing..." : "Save Destination"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationManager;