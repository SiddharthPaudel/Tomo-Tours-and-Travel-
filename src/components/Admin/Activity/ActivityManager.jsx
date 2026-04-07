import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, onSnapshot, query, serverTimestamp 
} from 'firebase/firestore';
import { X, Plus, Loader2 } from 'lucide-react';

// Field Components
import HikingFields from './forms/HikingField';
import TrekkingFields from './forms/TrekkingField';
import RaftingFields from './forms/RaftingField';
import SightseeingFields from './forms/SightSeeingField';

// UI Components
import ImageUploadField from '../ImageUploadField';
import DataTable from '../DataTable';
import AlertModal from '../../../utils/AlertModal'; // Imported AlertModal

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

  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState({ isOpen: false });

  // Form States
  const [commonData, setCommonData] = useState({ title: '', price: '' });
  const [specificData, setSpecificData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleDelete = async (id) => {
    setAlertConfig({
      isOpen: true,
      type: 'warning',
      title: 'Delete Activity?',
      message: 'This action is permanent. Are you sure you want to remove this activity from inventory?',
      confirmText: 'Delete Now',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "activities", id));
          setAlertConfig({
            isOpen: true,
            type: 'success',
            title: 'Deleted!',
            message: 'Activity has been removed successfully.',
            onConfirm: () => setAlertConfig({ isOpen: false })
          });
        } catch (err) {
          setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: err.message });
        }
      }
    });
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
      
      // Success Alert
      setAlertConfig({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: editingItem ? 'Activity updated successfully.' : 'New activity added to inventory.',
        onConfirm: () => setAlertConfig({ isOpen: false })
      });

    } catch (err) {
      setAlertConfig({ isOpen: true, type: 'error', title: 'Upload Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 font-['Montserrat'] animate-in fade-in duration-500 max-w-full overflow-x-hidden">
      <AlertModal {...alertConfig} onCancel={() => setAlertConfig({ isOpen: false })} />

      {/* Responsive Category Selector */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar">
        {Object.keys(FieldComponents).map(cat => (
          <button key={cat} onClick={() => { setCategory(cat); if(!editingItem) resetForm(); }}
            className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${category === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
        <div>
          <p className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Inventory</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 capitalize tracking-tighter">{category}.</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} 
          className="w-full sm:w-auto bg-slate-900 text-white px-6 py-4 md:px-8 md:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl flex items-center justify-center gap-2">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <DataTable 
          type="activities" 
          data={activities.filter(item => item.category === category)} 
          onDelete={handleDelete} 
          onEdit={handleEdit} 
        />
      </div>

      {/* Responsive Slide-over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full md:max-w-xl bg-white h-full sm:h-[95vh] sm:rounded-[3rem] p-6 md:p-12 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
              <X size={20} />
            </button>
            
            <h3 className="text-xl md:text-2xl font-black mb-8 uppercase tracking-tighter pt-4 sm:pt-0">
              {editingItem ? 'Edit' : 'New'} {category}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <ImageUploadField onImageSelect={setSelectedImage} initialPreview={editingItem?.image} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Package Name</label>
                  <input type="text" name="title" value={commonData.title} onChange={(e) => setCommonData({...commonData, title: e.target.value})} 
                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500/10" required />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price (Rs)</label>
                  <input type="number" name="price" value={commonData.price} onChange={(e) => setCommonData({...commonData, price: e.target.value})} 
                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500/10" required />
                </div>
              </div>

              <div className="py-6 md:py-8 border-y border-slate-100">
                {ActiveFields && <ActiveFields formData={specificData} onChange={(e) => setSpecificData({...specificData, [e.target.name]: e.target.value})} />} 
              </div>

              <button disabled={loading} type="submit" 
                className="w-full py-4 md:py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                {loading ? <><Loader2 className="animate-spin" size={18} /> Syncing...</> : "Save Activity"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityManager;