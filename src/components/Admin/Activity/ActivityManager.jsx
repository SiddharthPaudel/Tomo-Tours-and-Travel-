import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, onSnapshot, query, serverTimestamp 
} from 'firebase/firestore';

// Field Components
import HikingFields from './forms/HikingField';
import TrekkingFields from './forms/TrekkingField';
import RaftingFields from './forms/RaftingField';
import SightseeingFields from './forms/SightSeeingField';

// UI Components
import ImageUploadField from '../ImageUploadField';
import DataTable from '../DataTable';

const FieldComponents = {
  hiking: HikingFields,
  trekking: TrekkingFields,
  rafting: RaftingFields,
  sightseeing: SightseeingFields
};

const ActivityManager = () => {
  const [category, setCategory] = useState('hiking');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form States
  const [commonData, setCommonData] = useState({ title: '', price: '' });
  const [specificData, setSpecificData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // ENV Variables
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_ACTIVITIES;

  const ActiveFields = FieldComponents[category];

  useEffect(() => {
    const q = query(collection(db, "activities"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setCategory(item.category);
    setCommonData({ title: item.title || '', price: item.price || '' });
    setSpecificData(item.details || {});
    setSelectedImage(item.image || null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setCommonData({ title: '', price: '' });
    setSpecificData({});
    setSelectedImage(null);
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

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST', body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Upload Failed");
        imageUrl = data.secure_url;
      }

      const payload = {
        title: commonData.title,
        price: parseFloat(commonData.price) || 0,
        category,
        details: { ...specificData },
        image: imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingItem) {
        await updateDoc(doc(db, "activities", editingItem.id), payload);
      } else {
        await addDoc(collection(db, "activities"), { ...payload, createdAt: serverTimestamp() });
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-['Montserrat'] animate-in fade-in duration-500">
      <div className="flex gap-4 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {Object.keys(FieldComponents).map(cat => (
          <button key={cat} onClick={() => { setCategory(cat); if(!editingItem) resetForm(); }}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Inventory</p>
          <h2 className="text-4xl font-black text-slate-900 capitalize tracking-tighter">{category}.</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl">+ Add New</button>
      </div>

      <DataTable 
        type="activities" 
        data={activities.filter(item => item.category === category)} 
        onDelete={async (id) => { if(window.confirm("Delete?")) await deleteDoc(doc(db, "activities", id)); }}
        onEdit={handleEdit} 
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white h-full rounded-[3rem] p-12 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 font-bold">✕</button>
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">{editingItem ? 'Edit' : 'New'} {category}</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <ImageUploadField onImageSelect={setSelectedImage} initialPreview={editingItem?.image} />
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Package Name</label>
                  <input type="text" name="title" value={commonData.title} onChange={(e) => setCommonData({...commonData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500/10" required />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price (Rs)</label>
                  <input type="number" name="price" value={commonData.price} onChange={(e) => setCommonData({...commonData, price: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500/10" required />
                </div>
              </div>
              <div className="py-8 border-y border-slate-100">
                {ActiveFields && <ActiveFields formData={specificData} onChange={(e) => setSpecificData({...specificData, [e.target.name]: e.target.value})} />} 
              </div>
              <button disabled={loading} type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all">
                {loading ? "Processing..." : "Save Activity"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityManager;