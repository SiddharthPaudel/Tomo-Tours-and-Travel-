import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, onSnapshot, query, serverTimestamp 
} from 'firebase/firestore';
import { X, Plus, Loader2 } from 'lucide-react';

// Components
import DomesticFields from "./forms/DomesticField";
import InternationalFields from "./forms/InternationalField";
import ImageUploadField from '../ImageUploadField';
import DataTable from './DestinationTable';
import AlertModal from "../../../utils/AlertModal";

const FieldComponents = { domestic: DomesticFields, international: InternationalFields };

const DestinationManager = () => {
  const [type, setType] = useState('domestic');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Alert State
  const [alertConfig, setAlertConfig] = useState({ isOpen: false });

  // Form States
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
    setCommonData({ 
      name: item.name, 
      overview: item.overview || '', 
      budget: item.budget 
    });
    setSpecificData(item.details || {});
    setSelectedImage(item.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setAlertConfig({
      isOpen: true,
      type: 'warning',
      title: 'Delete Destination?',
      message: 'This will permanently remove this spot from the public listings.',
      confirmText: 'Delete Now',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "destinations", id));
          setAlertConfig({
            isOpen: true,
            type: 'success',
            title: 'Removed!',
            message: 'Destination deleted successfully.',
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
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        imageUrl = data.secure_url;
      }

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
      
      setIsModalOpen(false);
      setAlertConfig({
        isOpen: true,
        type: 'success',
        title: 'Saved!',
        message: 'The destination has been updated in the database.',
        onConfirm: () => setAlertConfig({ isOpen: false })
      });
      
      // Reset Form
      setCommonData({ name: '', overview: '', budget: '' });
      setSpecificData({});
      setSelectedImage(null);
    } catch (err) { 
      setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: err.message });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="p-4 md:p-8 font-['Montserrat'] animate-in fade-in duration-500 overflow-x-hidden">
      <AlertModal {...alertConfig} onCancel={() => setAlertConfig({ isOpen: false })} />

      {/* Responsive Type Switcher */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit overflow-x-auto">
        {['domestic', 'international'].map(t => (
          <button 
            key={t} 
            onClick={() => setType(t)} 
            className={`flex-1 sm:flex-none px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${type === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
        <div>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Curation</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter capitalize">{type} Spots.</h2>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setCommonData({ name: '', overview: '', budget: '' }); setSpecificData({}); setSelectedImage(null); setIsModalOpen(true); }} 
          className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <DataTable 
          type="destinations" 
          data={destinations.filter(item => item.type === type)} 
          onDelete={handleDelete} 
          onEdit={handleEdit} 
        />
      </div>

      {/* Side Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full md:max-w-xl bg-white h-full sm:h-[95vh] sm:rounded-[3rem] p-6 md:p-12 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900">
              <X size={20} />
            </button>
            
            <h3 className="text-xl md:text-2xl font-black mb-8 uppercase tracking-tighter pt-4 sm:pt-0">
              {editingItem ? 'Edit' : 'New'} Spot
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUploadField onImageSelect={setSelectedImage} initialPreview={editingItem?.image} />
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Package Name</label>
                <input 
                  type="text" placeholder="e.g. Pokhara Adventure" 
                  value={commonData.name} 
                  onChange={(e) => setCommonData({...commonData, name: e.target.value})} 
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-500/10 outline-none text-sm" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Trip Overview</label>
                <textarea 
                  placeholder="The main narrative of the tour..." 
                  value={commonData.overview} 
                  onChange={(e) => setCommonData({...commonData, overview: e.target.value})} 
                  className="w-full p-4 bg-slate-50 rounded-2xl font-medium text-xs min-h-[120px] md:min-h-[150px] border-2 border-transparent focus:border-emerald-500/10 outline-none leading-relaxed" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Pricing (Rs)</label>
                <input 
                  type="text" placeholder="e.g. 18000" 
                  value={commonData.budget} 
                  onChange={(e) => setCommonData({...commonData, budget: e.target.value})} 
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-500/10 outline-none text-sm" 
                />
              </div>

              <div className="py-6 border-y border-slate-100">
                {FieldComponents[type] && React.createElement(FieldComponents[type], { 
                  formData: specificData, 
                  onChange: (e) => setSpecificData({...specificData, [e.target.name]: e.target.value}) 
                })}
              </div>

              <button disabled={loading} type="submit" 
                className="w-full py-4 md:py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Syncing...</> : "Save Destination"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationManager;