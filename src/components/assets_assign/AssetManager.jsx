import React, { useState } from 'react';
import { 
  Monitor, Cpu, Package, X, Plus, ShieldCheck, CheckCircle2, 
  Loader2, Database, Zap, Hash, Calendar, Info, MessageSquare, 
  Mail, ChevronDown, Laptop, Smartphone, MousePointer2, ClipboardList
} from 'lucide-react';

const AssetManager = ({ previousAssets = [], assetRows = [], onAdd, onRemove, onChange, onApiSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Modal Logic State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useTodayDate, setUseTodayDate] = useState(true);
  const [galleryAsset, setGalleryAsset] = useState(null);
  const [tempAsset, setTempAsset] = useState({
    asset_category: "laptop",
    asset_name: "",
    serial_number: "",
    model_number: "",
    allocated_at: new Date().toISOString().split('T')[0],
    condition_on_allocation: "new",
    remarks: "",
    send_email: false,
    images: [] 
  });

  const handleOpenModal = () => {
    setTempAsset({
      asset_category: "laptop",
      asset_name: "",
      serial_number: "",
      model_number: "",
      allocated_at: new Date().toISOString().split('T')[0],
      condition_on_allocation: "new",
      remarks: "",
      send_email: false
    });
    setUseTodayDate(true);
    setIsModalOpen(true);
  };

  const handleConfirmAdd = () => {
    if (!tempAsset.asset_name || !tempAsset.serial_number) return;
    onAdd(tempAsset); 
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (assetRows.length === 0) return;
    setIsSubmitting(true);
    try {
      await onApiSubmit(assetRows); 
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Asset submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER: ENTERPRISE METADATA */}
      <div className="flex items-center justify-between px-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
             <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] block">
               Asset Provisioning System
             </label>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Lifecycle v4.2 • Secure Hardware Allocation</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95"
        >
          <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
          Provision Asset
        </button>
      </div>

      {/* MODAL: ASSET ENTRY - FIXED POSITIONING */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          {/* Modal Container: Max-height 90% of screen */}
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 border border-white/20">
            
            {/* Modal Header: Pinned */}
            <div className="flex-none px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                  <Cpu className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Provision Hardware</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Inventory Dispatch Registry</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
              >
                <X size={18} className="text-slate-400 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Modal Body: Scrollable area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                
                {/* Category */}
                <div className="space-y-1.5 group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Category</label>
                  <div className="relative">
                     <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                     <select 
                      value={tempAsset.asset_category}
                      onChange={(e) => setTempAsset({...tempAsset, asset_category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-10 py-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
                    >
                      <option value="laptop">Laptop / Workstation</option>
                      <option value="mobile">Mobile Device</option>
                      <option value="peripherals">Peripherals</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                  </div>
                </div>

                {/* Asset Name */}
                <div className="space-y-1.5 group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Asset Name</label>
                  <div className="relative">
                    <Laptop className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text"
                      placeholder="e.g. MacBook Pro M3"
                      value={tempAsset.asset_name}
                      onChange={(e) => setTempAsset({...tempAsset, asset_name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                    />
                  </div>
                </div>

                {/* Serial */}
                <div className="space-y-1.5 group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Serial Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text"
                      placeholder="SN-XXXX-XXXX"
                      value={tempAsset.serial_number}
                      onChange={(e) => setTempAsset({...tempAsset, serial_number: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Model */}
                <div className="space-y-1.5 group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Model Number</label>
                  <div className="relative">
                    <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text"
                      placeholder="A2941 / MRX..."
                      value={tempAsset.model_number}
                      onChange={(e) => setTempAsset({...tempAsset, model_number: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-1.5 group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Condition</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <select 
                      value={tempAsset.condition_on_allocation}
                      onChange={(e) => setTempAsset({...tempAsset, condition_on_allocation: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-10 py-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="new">Brand New</option>
                      <option value="good">Good / Refurbished</option>
                      <option value="used">Used / Functional</option>
                    </select>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Date</label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={useTodayDate} 
                        onChange={(e) => {
                          setUseTodayDate(e.target.checked);
                          if(e.target.checked) setTempAsset({...tempAsset, allocated_at: new Date().toISOString().split('T')[0]})
                        }}
                        className="w-3 h-3 rounded text-blue-600 focus:ring-0" 
                      />
                      <span className="text-[9px] font-black text-slate-400 group-hover:text-blue-600 uppercase">Today</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="date"
                      disabled={useTodayDate}
                      value={tempAsset.allocated_at}
                      onChange={(e) => setTempAsset({...tempAsset, allocated_at: e.target.value})}
                      className={`w-full border pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none transition-all
                        ${useTodayDate ? 'bg-slate-100 border-slate-100 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500'}`}
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div className="col-span-2 space-y-1.5 group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Deployment Remarks</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-3.5 text-slate-400" size={14} />
                    <textarea 
                      value={tempAsset.remarks}
                      onChange={(e) => setTempAsset({...tempAsset, remarks: e.target.value})}
                      placeholder="Internal setup notes..."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>




                {/* Multiple Image Upload */}
{/* <div className="col-span-2 space-y-1.5">
  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
    Asset Images
  </label>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      const files = Array.from(e.target.files || []);
      setTempAsset((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...files], // append multiple times
      }));
    }}
    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-2"
  />

  
  {tempAsset.images?.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {tempAsset.images.map((file, i) => (
        <div key={i} className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-16 h-16 object-cover rounded-lg border"
          />

          <button
            type="button"
            onClick={() =>
              setTempAsset((prev) => ({
                ...prev,
                images: prev.images.filter((_, idx) => idx !== i),
              }))
            }
            className="absolute -top-2 -right-2 bg-white border rounded-full p-0.5 shadow hover:bg-red-50"
          >
            <X size={12} className="text-red-500" />
          </button>
        </div>
      ))}
    </div>
  )}
</div> */}  

{/* Multiple Image Upload: Enterprise Dropzone */}
<div className="col-span-2 space-y-3">
  <div className="flex items-center justify-between px-1">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
      Hardware Documentation
    </label>
    <span className="text-[9px] font-bold text-slate-400 uppercase">
      {tempAsset.images?.length || 0} / 5 Files Staged
    </span>
  </div>

  <div className="relative group">
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => {
        const files = Array.from(e.target.files || []);
        setTempAsset((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...files],
        }));
      }}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
    />
    
    <div className={`
      border-2 border-dashed rounded-[1.5rem] p-6 transition-all duration-300 flex flex-col items-center justify-center text-center
      ${tempAsset.images?.length > 0 ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-200 group-hover:bg-white group-hover:border-blue-400'}
    `}>
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Monitor size={20} className="text-slate-400 group-hover:text-blue-500" />
      </div>
      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
        Capture Asset Verification
      </p>
      <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
        Drag scans or click to browse protocol
      </p>
    </div>
  </div>

  {/* Image Gallery Grid */}
  {tempAsset.images?.length > 0 && (
    <div className="grid grid-cols-4 gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
      {tempAsset.images.map((file, i) => (
        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <img
            src={URL.createObjectURL(file)}
            alt="staged-asset"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() =>
                setTempAsset((prev) => ({
                  ...prev,
                  images: prev.images.filter((_, idx) => idx !== i),
                }))
              }
              className="p-1.5 bg-white text-rose-500 rounded-lg shadow-lg hover:bg-rose-50 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          {/* Micro-label for file size */}
          <div className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[7px] font-black text-white uppercase truncate">
            {(file.size / 1024).toFixed(0)} KB
          </div>
        </div>
      ))}
    </div>
  )}
</div>


                {/* Email Panel */}
                <div className="col-span-2 flex items-center justify-between p-4 bg-blue-50/40 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-blue-600" />
                    <div>
                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Dispatch Notification</p>
                      <p className="text-[9px] text-slate-500 font-medium tracking-tight">Notify candidate on commit</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setTempAsset({...tempAsset, send_email: !tempAsset.send_email})}
                    className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-all duration-300 ${tempAsset.send_email ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${tempAsset.send_email ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer: Pinned */}
            <div className="flex-none px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors px-2"
              >
                Discard
              </button>
              <button 
                onClick={handleConfirmAdd}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Add to Registry
                <CheckCircle2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

{/* // 2. Add this block inside your return, near your other modals */}
      {galleryAsset && (
  <div className="fixed inset-0 z-[1000] flex items-center  h-screen justify-center p-6 animate-in fade-in duration-300">
    <div 
      className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" 
      onClick={() => setGalleryAsset(null)} 
    />
    
    <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
      {/* GALLERY HEADER */}
      <div className="p-8 border-b border-slate-100 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-blue-400 shadow-xl">
            <Monitor size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {galleryAsset.asset_name}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Document Vault • SN: {galleryAsset.serial_number}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setGalleryAsset(null)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={24} className="text-slate-400" />
        </button>
      </div>

      {/* GALLERY GRID */}
      <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {galleryAsset.images.map((imgUrl, idx) => (
            <div key={idx} className="group relative aspect-square bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <img 
                src={`https://apihrr.goelectronix.co.in${imgUrl}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt="asset-doc"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <a 
                  href={`https://apihrr.goelectronix.co.in${imgUrl}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-[10px] font-black text-white uppercase text-center hover:bg-white hover:text-slate-900 transition-all"
                >
                  View Full Image
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GALLERY FOOTER */}
      <div className="p-6 bg-slate-900 flex justify-between items-center px-10">
        <div className="flex items-center gap-2">
           <ShieldCheck size={14} className="text-emerald-400" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encrypted Staging Node</span>
        </div>
        <button 
          onClick={() => setGalleryAsset(null)}
          className="px-8 py-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Close View
        </button>
      </div>
    </div>
  </div>
)}

      {/* RENDERED LISTS (Existing Code Continues) */}
      <div className="space-y-4">


        {/* EMPTY STATE */}
  {previousAssets.length === 0 && assetRows.length === 0 && (
    
     <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 flex flex-col items-center justify-center bg-slate-50/30">
             <div className="p-4 bg-white rounded-full shadow-sm mb-4">
               <Package size={32} className="text-slate-200" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Ready / No Data</p>
           </div>
  )}

        {/* Previous Assets Mapping... */}
        {previousAssets.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 ml-1">Committed Infrastructure</p>
            {previousAssets.map((asset, i) => (
              <div key={`prev-${i}`} className="grid grid-cols-12 gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-1 flex justify-center">
                  <div className="p-2.5 bg-white text-emerald-500 rounded-xl shadow-sm border border-slate-100">
                    {(asset.asset_category || "").toLowerCase() === "laptop" ? <Monitor size={16} /> : <Smartphone size={16} />}
                  </div>
                </div>
                <div className="col-span-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Asset Identity</p>
                  <p className="text-xs font-bold text-slate-700 truncate capitalize">{asset.asset_category} — {asset.asset_name}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Serial / Reference</p>
                  <p className="text-xs font-mono font-bold text-slate-500">{asset?.serial_number || "—"}</p>
                </div>
                <div className="col-span-4 flex justify-end">
                  {/* <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase border border-emerald-100">
                    <ShieldCheck size={10} /> Fully Managed
                  </span> */}
                  {/* Column 4: Status & Staged Docs */}
<div className="col-span-4 flex items-center justify-end gap-4">
  {/* NEW: IMAGE STACK CLICKABLE */}
  {asset.images?.length > 0 && (
    <button 
      onClick={() => setGalleryAsset(asset)} // New state needed
      className="flex items-center -space-x-2 px-2 py-1 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-all shadow-sm"
    >
      {asset.images.slice(0, 2).map((img, idx) => (
        <div key={idx} className="w-6 h-6 rounded-md border-2 border-white overflow-hidden bg-slate-100">
          <img 
            src={`https://apihrr.goelectronix.co.in${img}`} 
            className="w-full h-full object-cover" 
            alt="asset" 
          />
        </div>
      ))}
      {asset.images.length > 2 && (
        <div className="w-6 h-6 rounded-md border-2 border-white bg-slate-900 flex items-center justify-center text-[7px] font-black text-white">
          +{asset.images.length - 2}
        </div>
      )}
    </button>
  )}

  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase border border-emerald-100">
    <ShieldCheck size={10} /> Fully Managed
  </span>
</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Draft Assets Mapping... */}
        {assetRows.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-2 ml-1">Draft Staging Area</p>
            {assetRows.map((row, index) => (
              <div key={`new-${index}`} className="group grid grid-cols-12 gap-4 p-5 bg-white border border-slate-200 rounded-[1.5rem] items-center hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 animate-in fade-in slide-in-from-left-4">
                <div className="col-span-1 flex justify-center">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      {row.asset_category === "laptop" ? <Monitor size={16} /> : <Smartphone size={16} />}
                    </div>
                </div>
                <div className="col-span-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Provisioned Asset</p>
                  <p className="text-xs font-black text-slate-800 truncate capitalize">{row.asset_name}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Identification</p>
                  <p className="text-xs font-mono font-bold text-slate-500">{row.serial_number}</p>
                </div>
                {/* <div className="col-span-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Condition & Status</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase">{row.condition_on_allocation} • {row.allocated_at}</p>
                </div> */}
                <div className="col-span-3">
  <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">
    Condition & Status
  </p>

  <p className="text-[10px] font-bold text-slate-600 uppercase">
    {row.condition_on_allocation} • {row.allocated_at}
  </p>

  {/* IMAGE PREVIEW (Step 3) */}
  {row.images?.length > 0 && (
    <div className="flex gap-1 mt-2 flex-wrap">
      {row.images.map((file, i) => (
        <img
          key={i}
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-8 h-8 rounded object-cover border"
        />
      ))}
    </div>
  )}
</div>

                <div className="col-span-2 flex justify-end items-center gap-2">
                  {row.send_email && <Mail size={14} className="text-blue-400 mr-2" />}
                  <button onClick={() => onRemove(index)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sync Action Bar... */}
        {assetRows.length > 0 && (
          <div className="mt-10 p-0.5 bg-slate-900 rounded-[2.2rem] shadow-2xl shadow-slate-900/20 !border-1">
             <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4
                  ${isSuccess ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-blue-600'} text-white active:scale-[0.98] disabled:opacity-50`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : isSuccess ? <CheckCircle2 size={18} /> : <Database size={18} />}
                {isSubmitting ? "Executing Deployment..." : isSuccess ? "Registry Synchronized" : "Finalize & Sync Inventory"}
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetManager;
//************************************************working code phase 1 12/02/26********************************************************* */
// import React, { useState } from 'react';
// import { 
//   Monitor, Cpu, Package, X, Plus, ShieldCheck, CheckCircle2, 
//   Loader2, Database, Zap, Hash, Calendar, Info, MessageSquare, 
//   Mail, ChevronDown, Laptop, Smartphone, MousePointer2, ClipboardList
// } from 'lucide-react';

// const AssetManager = ({ previousAssets = [], assetRows = [], onAdd, onRemove, onChange, onApiSubmit }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
  
//   // Modal Logic State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [useTodayDate, setUseTodayDate] = useState(true);
//   const [tempAsset, setTempAsset] = useState({
//     asset_category: "laptop",
//     asset_name: "",
//     serial_number: "",
//     model_number: "",
//     allocated_at: new Date().toISOString().split('T')[0],
//     condition_on_allocation: "new",
//     remarks: "",
//     send_email: false
//   });

//   const handleOpenModal = () => {
//     setTempAsset({
//       asset_category: "laptop",
//       asset_name: "",
//       serial_number: "",
//       model_number: "",
//       allocated_at: new Date().toISOString().split('T')[0],
//       condition_on_allocation: "new",
//       remarks: "",
//       send_email: false
//     });
//     setUseTodayDate(true);
//     setIsModalOpen(true);
//   };

//   const handleConfirmAdd = () => {
//     if (!tempAsset.asset_name || !tempAsset.serial_number) return;
//     onAdd(tempAsset); 
//     setIsModalOpen(false);
//   };

//   const handleSubmit = async () => {
//     if (assetRows.length === 0) return;
//     setIsSubmitting(true);
//     try {
//       await onApiSubmit(assetRows); 
//       setIsSuccess(true);
//       setTimeout(() => setIsSuccess(false), 3000);
//     } catch (error) {
//       console.error("Asset submission failed", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* HEADER: ENTERPRISE METADATA */}
//       <div className="flex items-center justify-between px-2 pb-4 border-b border-slate-100">
//         <div>
//           <div className="flex items-center gap-2">
//              <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//              <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] block">
//                Asset Provisioning System
//              </label>
//           </div>
//           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Lifecycle v4.2 • Secure Hardware Allocation</p>
//         </div>
//         <button
//           onClick={handleOpenModal}
//           className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95"
//         >
//           <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
//           Provision Asset
//         </button>
//       </div>

//       {/* MODAL: ASSET ENTRY - FIXED POSITIONING */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
//           {/* Backdrop */}
//           <div 
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
//             onClick={() => setIsModalOpen(false)} 
//           />
          
//           {/* Modal Container: Max-height 90% of screen */}
//           <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 border border-white/20">
            
//             {/* Modal Header: Pinned */}
//             <div className="flex-none px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white shadow-sm z-10">
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
//                   <Cpu className="text-white" size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-black text-slate-900 tracking-tight">Provision Hardware</h3>
//                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Inventory Dispatch Registry</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setIsModalOpen(false)} 
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
//               >
//                 <X size={18} className="text-slate-400 group-hover:rotate-90 transition-transform" />
//               </button>
//             </div>

//             {/* Modal Body: Scrollable area */}
//             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
//               <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                
//                 {/* Category */}
//                 <div className="space-y-1.5 group">
//                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Category</label>
//                   <div className="relative">
//                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                      <select 
//                       value={tempAsset.asset_category}
//                       onChange={(e) => setTempAsset({...tempAsset, asset_category: e.target.value})}
//                       className="w-full bg-slate-50 border border-slate-200 pl-10 pr-10 py-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
//                     >
//                       <option value="laptop">Laptop / Workstation</option>
//                       <option value="mobile">Mobile Device</option>
//                       <option value="peripherals">Peripherals</option>
//                     </select>
//                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
//                   </div>
//                 </div>

//                 {/* Asset Name */}
//                 <div className="space-y-1.5 group">
//                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Asset Name</label>
//                   <div className="relative">
//                     <Laptop className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                     <input 
//                       type="text"
//                       placeholder="e.g. MacBook Pro M3"
//                       value={tempAsset.asset_name}
//                       onChange={(e) => setTempAsset({...tempAsset, asset_name: e.target.value})}
//                       className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
//                     />
//                   </div>
//                 </div>

//                 {/* Serial */}
//                 <div className="space-y-1.5 group">
//                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Serial Number</label>
//                   <div className="relative">
//                     <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                     <input 
//                       type="text"
//                       placeholder="SN-XXXX-XXXX"
//                       value={tempAsset.serial_number}
//                       onChange={(e) => setTempAsset({...tempAsset, serial_number: e.target.value})}
//                       className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </div>

//                 {/* Model */}
//                 <div className="space-y-1.5 group">
//                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Model Number</label>
//                   <div className="relative">
//                     <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                     <input 
//                       type="text"
//                       placeholder="A2941 / MRX..."
//                       value={tempAsset.model_number}
//                       onChange={(e) => setTempAsset({...tempAsset, model_number: e.target.value})}
//                       className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none focus:bg-white focus:border-blue-500 transition-all"
//                     />
//                   </div>
//                 </div>

//                 {/* Condition */}
//                 <div className="space-y-1.5 group">
//                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Condition</label>
//                   <div className="relative">
//                     <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                     <select 
//                       value={tempAsset.condition_on_allocation}
//                       onChange={(e) => setTempAsset({...tempAsset, condition_on_allocation: e.target.value})}
//                       className="w-full bg-slate-50 border border-slate-200 pl-10 pr-10 py-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 appearance-none cursor-pointer"
//                     >
//                       <option value="new">Brand New</option>
//                       <option value="good">Good / Refurbished</option>
//                       <option value="used">Used / Functional</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Date Selection */}
//                 <div className="space-y-1.5">
//                   <div className="flex justify-between items-center px-1">
//                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Date</label>
//                     <label className="flex items-center gap-2 cursor-pointer group">
//                       <input 
//                         type="checkbox" 
//                         checked={useTodayDate} 
//                         onChange={(e) => {
//                           setUseTodayDate(e.target.checked);
//                           if(e.target.checked) setTempAsset({...tempAsset, allocated_at: new Date().toISOString().split('T')[0]})
//                         }}
//                         className="w-3 h-3 rounded text-blue-600 focus:ring-0" 
//                       />
//                       <span className="text-[9px] font-black text-slate-400 group-hover:text-blue-600 uppercase">Today</span>
//                     </label>
//                   </div>
//                   <div className="relative">
//                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                     <input 
//                       type="date"
//                       disabled={useTodayDate}
//                       value={tempAsset.allocated_at}
//                       onChange={(e) => setTempAsset({...tempAsset, allocated_at: e.target.value})}
//                       className={`w-full border pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none transition-all
//                         ${useTodayDate ? 'bg-slate-100 border-slate-100 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500'}`}
//                     />
//                   </div>
//                 </div>

//                 {/* Remarks */}
//                 <div className="col-span-2 space-y-1.5 group">
//                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Deployment Remarks</label>
//                   <div className="relative">
//                     <MessageSquare className="absolute left-4 top-3.5 text-slate-400" size={14} />
//                     <textarea 
//                       value={tempAsset.remarks}
//                       onChange={(e) => setTempAsset({...tempAsset, remarks: e.target.value})}
//                       placeholder="Internal setup notes..."
//                       rows={2}
//                       className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Email Panel */}
//                 <div className="col-span-2 flex items-center justify-between p-4 bg-blue-50/40 rounded-2xl border border-blue-100/50">
//                   <div className="flex items-center gap-3">
//                     <Mail size={16} className="text-blue-600" />
//                     <div>
//                       <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Dispatch Notification</p>
//                       <p className="text-[9px] text-slate-500 font-medium tracking-tight">Notify candidate on commit</p>
//                     </div>
//                   </div>
//                   <div 
//                     onClick={() => setTempAsset({...tempAsset, send_email: !tempAsset.send_email})}
//                     className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-all duration-300 ${tempAsset.send_email ? 'bg-blue-600' : 'bg-slate-200'}`}
//                   >
//                     <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${tempAsset.send_email ? 'translate-x-5' : 'translate-x-0'}`} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer: Pinned */}
//             <div className="flex-none px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors px-2"
//               >
//                 Discard
//               </button>
//               <button 
//                 onClick={handleConfirmAdd}
//                 className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
//               >
//                 Add to Registry
//                 <CheckCircle2 size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* RENDERED LISTS (Existing Code Continues) */}
//       <div className="space-y-4">


//         {/* EMPTY STATE */}
//   {previousAssets.length === 0 && assetRows.length === 0 && (
//     // <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
//     //   <Package size={28} className="text-slate-300 mb-3" />
//     //   <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
//     //     No Asset Assigned Yet
//     //   </p>
//     //   <p className="text-[10px] text-slate-400 mt-1">
//     //     Provision hardware to begin asset lifecycle
//     //   </p>
//     // </div>
//      <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 flex flex-col items-center justify-center bg-slate-50/30">
//              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
//                <Package size={32} className="text-slate-200" />
//              </div>
//              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Ready / No Data</p>
//            </div>
//   )}

//         {/* Previous Assets Mapping... */}
//         {previousAssets.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 ml-1">Committed Infrastructure</p>
//             {previousAssets.map((asset, i) => (
//               <div key={`prev-${i}`} className="grid grid-cols-12 gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl items-center hover:bg-slate-50 transition-colors">
//                 <div className="col-span-1 flex justify-center">
//                   <div className="p-2.5 bg-white text-emerald-500 rounded-xl shadow-sm border border-slate-100">
//                     {(asset.asset_category || "").toLowerCase() === "laptop" ? <Monitor size={16} /> : <Smartphone size={16} />}
//                   </div>
//                 </div>
//                 <div className="col-span-4">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Asset Identity</p>
//                   <p className="text-xs font-bold text-slate-700 truncate capitalize">{asset.asset_category} — {asset.asset_name}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Serial / Reference</p>
//                   <p className="text-xs font-mono font-bold text-slate-500">{asset?.serial_number || "—"}</p>
//                 </div>
//                 <div className="col-span-4 flex justify-end">
//                   <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase border border-emerald-100">
//                     <ShieldCheck size={10} /> Fully Managed
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Draft Assets Mapping... */}
//         {assetRows.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-2 ml-1">Draft Staging Area</p>
//             {assetRows.map((row, index) => (
//               <div key={`new-${index}`} className="group grid grid-cols-12 gap-4 p-5 bg-white border border-slate-200 rounded-[1.5rem] items-center hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 animate-in fade-in slide-in-from-left-4">
//                 <div className="col-span-1 flex justify-center">
//                     <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
//                       {row.asset_category === "laptop" ? <Monitor size={16} /> : <Smartphone size={16} />}
//                     </div>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Provisioned Asset</p>
//                   <p className="text-xs font-black text-slate-800 truncate capitalize">{row.asset_name}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Identification</p>
//                   <p className="text-xs font-mono font-bold text-slate-500">{row.serial_number}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Condition & Status</p>
//                   <p className="text-[10px] font-bold text-slate-600 uppercase">{row.condition_on_allocation} • {row.allocated_at}</p>
//                 </div>
//                 <div className="col-span-2 flex justify-end items-center gap-2">
//                   {row.send_email && <Mail size={14} className="text-blue-400 mr-2" />}
//                   <button onClick={() => onRemove(index)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
//                     <X size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Sync Action Bar... */}
//         {assetRows.length > 0 && (
//           <div className="mt-10 p-0.5 bg-slate-900 rounded-[2.2rem] shadow-2xl shadow-slate-900/20 !border-1">
//              <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className={`w-full py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4
//                   ${isSuccess ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-blue-600'} text-white active:scale-[0.98] disabled:opacity-50`}
//               >
//                 {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : isSuccess ? <CheckCircle2 size={18} /> : <Database size={18} />}
//                 {isSubmitting ? "Executing Deployment..." : isSuccess ? "Registry Synchronized" : "Finalize & Sync Inventory"}
//               </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetManager;
//****************************************************working code phase 123************************************************************* */
// import React, { useState } from 'react';
// import { 
//   Monitor, Cpu, Package, X, Plus, ShieldCheck, CheckCircle2, 
//   Loader2, Database, Zap, Hash, Calendar, Info, MessageSquare, 
//   Mail, ChevronDown, Laptop, Smartphone, MousePointer2, ClipboardList
// } from 'lucide-react';

// const AssetManager = ({ previousAssets = [], assetRows = [], onAdd, onRemove, onChange, onApiSubmit }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
  
//   // Modal Logic State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [useTodayDate, setUseTodayDate] = useState(true);
//   const [tempAsset, setTempAsset] = useState({
//     asset_category: "laptop",
//     asset_name: "",
//     serial_number: "",
//     model_number: "",
//     allocated_at: new Date().toISOString().split('T')[0],
//     condition_on_allocation: "new",
//     remarks: "",
//     send_email: false
//   });

//   const handleOpenModal = () => {
//     setTempAsset({
//       asset_category: "laptop",
//       asset_name: "",
//       serial_number: "",
//       model_number: "",
//       allocated_at: new Date().toISOString().split('T')[0],
//       condition_on_allocation: "new",
//       remarks: "",
//       send_email: false
//     });
//     setUseTodayDate(true);
//     setIsModalOpen(true);
//   };

//   const handleConfirmAdd = () => {
//     if (!tempAsset.asset_name || !tempAsset.serial_number) return;
//     onAdd(tempAsset); 
//     setIsModalOpen(false);
//   };

//   const handleSubmit = async () => {
//     if (assetRows.length === 0) return;
//     setIsSubmitting(true);
//     try {
//       await onApiSubmit(assetRows); 
//       setIsSuccess(true);
//       setTimeout(() => setIsSuccess(false), 3000);
//     } catch (error) {
//       console.error("Asset submission failed", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* HEADER: ENTERPRISE METADATA */}
//       <div className="flex items-center justify-between px-2 pb-4 border-b border-slate-100">
//         <div>
//           <div className="flex items-center gap-2">
//              <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//              <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] block">
//                Asset Provisioning System
//              </label>
//           </div>
//           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Lifecycle v4.2 • Secure Hardware Allocation</p>
//         </div>
//         <button
//           onClick={handleOpenModal}
//           className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95"
//         >
//           <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
//           Provision Asset
//         </button>
//       </div>

//       {/* MODAL: ASSET ENTRY */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-99 flex items-center justify-center p-4 sm:p-6">
//           <div 
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
//             onClick={() => setIsModalOpen(false)} 
//           />
          
//           <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/20">
//             {/* Modal Header */}
//             <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-b from-slate-50/50 to-transparent">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
//                   <Cpu className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Provision Hardware</h3>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Internal Inventory Registry</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setIsModalOpen(false)} 
//                 className="p-3 hover:bg-slate-100 rounded-full transition-colors group"
//               >
//                 <X size={20} className="text-slate-400 group-hover:rotate-90 transition-transform" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-10 grid grid-cols-2 gap-x-8 gap-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
//               {/* Category */}
//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Category</label>
//                 <div className="relative">
//                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={16} />
//                    <select 
//                     value={tempAsset.asset_category}
//                     onChange={(e) => setTempAsset({...tempAsset, asset_category: e.target.value})}
//                     className="w-full bg-slate-50 border border-slate-200 pl-12 pr-10 py-3 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
//                   >
//                     <option value="laptop">Laptop / Workstation</option>
//                     <option value="mobile">Mobile Device</option>
//                     <option value="peripherals">Peripherals</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
//                 </div>
//               </div>

//               {/* Asset Name */}
//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Asset Name</label>
//                 <div className="relative">
//                   <Laptop className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={16} />
//                   <input 
//                     type="text"
//                     placeholder="e.g. MacBook Pro M3"
//                     value={tempAsset.asset_name}
//                     onChange={(e) => setTempAsset({...tempAsset, asset_name: e.target.value})}
//                     className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Serial & Model */}
//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Serial Number</label>
//                 <div className="relative">
//                   <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={16} />
//                   <input 
//                     type="text"
//                     placeholder="SN-XXXX-XXXX"
//                     value={tempAsset.serial_number}
//                     onChange={(e) => setTempAsset({...tempAsset, serial_number: e.target.value})}
//                     className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Model Number</label>
//                 <div className="relative">
//                   <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={16} />
//                   <input 
//                     type="text"
//                     placeholder="A2941 / MRX..."
//                     value={tempAsset.model_number}
//                     onChange={(e) => setTempAsset({...tempAsset, model_number: e.target.value})}
//                     className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Condition */}
//               <div className="space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Condition</label>
//                 <div className="relative">
//                   <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={16} />
//                   <select 
//                     value={tempAsset.condition_on_allocation}
//                     onChange={(e) => setTempAsset({...tempAsset, condition_on_allocation: e.target.value})}
//                     className="w-full bg-slate-50 border border-slate-200 pl-12 pr-10 py-3 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 appearance-none cursor-pointer"
//                   >
//                     <option value="new">Brand New</option>
//                     <option value="good">Good / Refurbished</option>
//                     <option value="used">Used / Functional</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
//                 </div>
//               </div>

//               {/* Allocation Date Logic */}
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center px-1 mb-2">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Allocation Date</label>
//                   <label className="flex items-center gap-2 cursor-pointer group">
//                     <input 
//                       type="checkbox" 
//                       checked={useTodayDate} 
//                       onChange={(e) => {
//                         setUseTodayDate(e.target.checked);
//                         if(e.target.checked) setTempAsset({...tempAsset, allocated_at: new Date().toISOString().split('T')[0]})
//                       }}
//                       className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 transition-all" 
//                     />
//                     <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase">Set Today</span>
//                   </label>
//                 </div>
//                 <div className="relative group">
//                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={16} />
//                   <input 
//                     type="date"
//                     disabled={useTodayDate}
//                     value={tempAsset.allocated_at}
//                     onChange={(e) => setTempAsset({...tempAsset, allocated_at: e.target.value})}
//                     className={`w-full border pl-12 pr-4 py-3 rounded-xl text-xs font-bold outline-none transition-all
//                       ${useTodayDate ? 'bg-slate-100 border-slate-100 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500'}`}
//                   />
//                 </div>
//               </div>

//               {/* Remarks */}
//               <div className="col-span-2 space-y-2 group">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Remarks / Deployment Notes</label>
//                 <div className="relative">
//                   <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600" size={16} />
//                   <textarea 
//                     value={tempAsset.remarks}
//                     onChange={(e) => setTempAsset({...tempAsset, remarks: e.target.value})}
//                     placeholder="Add special handling instructions or setup requirements..."
//                     rows={2}
//                     className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
//                   />
//                 </div>
//               </div>

//               {/* Email Toggle */}
//               <div className="col-span-2 flex items-center justify-between p-5 bg-blue-50/40 rounded-2xl border border-blue-100/50 mt-2">
//                 <div className="flex items-center gap-4">
//                   <div className="p-2 bg-white rounded-lg shadow-sm">
//                     <Mail size={18} className="text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Email Dispatch</p>
//                     <p className="text-[10px] text-slate-500 font-medium">Notify the candidate about this asset allocation</p>
//                   </div>
//                 </div>
//                 <div 
//                   onClick={() => setTempAsset({...tempAsset, send_email: !tempAsset.send_email})}
//                   className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${tempAsset.send_email ? 'bg-blue-600' : 'bg-slate-200'}`}
//                 >
//                   <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${tempAsset.send_email ? 'translate-x-6' : 'translate-x-0'}`} />
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex justify-end items-center gap-4">
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
//               >
//                 Cancel Draft
//               </button>
//               <button 
//                 onClick={handleConfirmAdd}
//                 className="group flex items-center gap-3 px-10 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all"
//               >
//                 Add Asset to List
//                 <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ASSET LIST SECTIONS */}
//       <div className="space-y-4">
//         {/* PREVIOUS ASSETS (Read Only) */}
//         {previousAssets.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 ml-1">Committed Infrastructure</p>
//             {previousAssets.map((asset, i) => (
//               <div
//                 key={`prev-${i}`}
//                 className="grid grid-cols-12 gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl items-center hover:bg-slate-50 transition-colors"
//               >
//                 <div className="col-span-1 flex justify-center">
//                   <div className="p-2.5 bg-white text-emerald-500 rounded-xl shadow-sm border border-slate-100">
//                     {(asset.asset_category || "").toLowerCase() === "laptop" ? <Monitor size={16} /> : <Smartphone size={16} />}
//                   </div>
//                 </div>
//                 <div className="col-span-4">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Asset Identity</p>
//                   <p className="text-xs font-bold text-slate-700 truncate capitalize">
//                     {asset.asset_category} — {asset.asset_name}
//                   </p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Serial / Reference</p>
//                   <p className="text-xs font-mono font-bold text-slate-500">{asset?.serial_number || "—"}</p>
//                 </div>
//                 <div className="col-span-4 flex justify-end">
//                   <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase border border-emerald-100">
//                     <ShieldCheck size={10} /> Fully Managed
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* DRAFT ASSETS */}
//         {assetRows.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-2 ml-1">Draft Staging Area</p>
//             {assetRows.map((row, index) => (
//               <div
//                 key={`new-${index}`}
//                 className="group grid grid-cols-12 gap-4 p-5 bg-white border border-slate-200 rounded-[1.5rem] items-center hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 animate-in fade-in slide-in-from-left-4"
//               >
//                 <div className="col-span-1 flex justify-center">
//                     <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
//                       {row.asset_category === "laptop" ? <Monitor size={16} /> : <Smartphone size={16} />}
//                     </div>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Provisioned Asset</p>
//                   <p className="text-xs font-black text-slate-800 truncate capitalize">{row.asset_name}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Identification</p>
//                   <p className="text-xs font-mono font-bold text-slate-500">{row.serial_number}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Condition & Status</p>
//                   <p className="text-[10px] font-bold text-slate-600 uppercase">
//                     {row.condition_on_allocation} • {row.allocated_at}
//                   </p>
//                 </div>
//                 <div className="col-span-2 flex justify-end items-center gap-2">
//                   {row.send_email && <Mail size={14} className="text-blue-400 mr-2" />}
//                   <button onClick={() => onRemove(index)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
//                     <X size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* EMPTY STATE */}
//         {assetRows.length === 0 && previousAssets.length === 0 && (
//           <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center bg-slate-50/30">
//              <div className="p-5 bg-white rounded-full shadow-sm mb-4">
//                 <Package size={40} className="text-slate-200" />
//              </div>
//              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Inventory Core Ready</p>
//              <p className="text-[9px] text-slate-300 font-bold uppercase mt-2">Add hardware to begin deployment</p>
//           </div>
//         )}

//         {/* SYNC ACTION BAR */}
//         {assetRows.length > 0 && (
//           <div className="mt-10 p-1.5 bg-slate-900 rounded-[2.2rem] shadow-2xl shadow-slate-900/20">
//              <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className={`w-full py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4
//                   ${isSuccess ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-blue-600'} text-white active:scale-[0.98] disabled:opacity-50`}
//               >
//                 {isSubmitting ? (
//                   <Loader2 className="animate-spin" size={18} />
//                 ) : isSuccess ? (
//                   <CheckCircle2 size={18} />
//                 ) : (
//                   <Database size={18} />
//                 )}
//                 {isSubmitting ? "Executing Deployment..." : isSuccess ? "Registry Synchronized" : "Finalize & Sync Inventory"}
//               </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetManager;
//*****************************************************working code phase 33*************************************************************** */
// import React, { useState } from 'react';
// import { 
//   Monitor, Cpu, Package, X, Plus, ShieldCheck, CheckCircle2, 
//   Loader2, Database, Zap, Hash, Calendar, Info, MessageSquare, Mail, ChevronDown 
// } from 'lucide-react';

// const AssetManager = ({ previousAssets = [], assetRows = [], onAdd, onRemove, onChange, onApiSubmit }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
  
//   // Modal Logic State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [useTodayDate, setUseTodayDate] = useState(true);
//   const [tempAsset, setTempAsset] = useState({
//     asset_category: "laptop",
//     asset_name: "",
//     serial_number: "",
//     model_number: "",
//     allocated_at: new Date().toISOString().split('T')[0],
//     condition_on_allocation: "new",
//     remarks: "",
//     send_email: false
//   });

//   const handleOpenModal = () => {
//     setTempAsset({
//       asset_category: "laptop",
//       asset_name: "",
//       serial_number: "",
//       model_number: "",
//       allocated_at: new Date().toISOString().split('T')[0],
//       condition_on_allocation: "new",
//       remarks: "",
//       send_email: false
//     });
//     setIsModalOpen(true);
//   };

//   const handleConfirmAdd = () => {
//     // Mapping tempAsset to your existing assetRows structure logic
//     // Using the spread to ensure all your new fields are passed to the parent's onAdd
//     onAdd(tempAsset); 
//     setIsModalOpen(false);
//   };

//   const handleSubmit = async () => {
//     if (assetRows.length === 0) return;
//     setIsSubmitting(true);
//     try {
//       await onApiSubmit(assetRows); 
//       setIsSuccess(true);
//       setTimeout(() => setIsSuccess(false), 3000);
//     } catch (error) {
//       console.error("Asset submission failed", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* HEADER: ENTERPRISE METADATA */}
//       <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
//         <div>
//           <div className="flex items-center gap-2">
//              <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//              <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">
//                Asset Provisioning System
//              </label>
//           </div>
//           <p className="text-[10px] text-slate-400 font-medium mt-1">Hardware lifecycle management and recruitment allocation</p>
//         </div>
//         <button
//           onClick={handleOpenModal}
//           className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 active:scale-95"
//         >
//           <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
//           Provision Asset
//         </button>
//       </div>

//       {/* MODAL: ASSET ENTRY */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
//             <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
//               <div>
//                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Provision New Hardware</h3>
//                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Entry Serial: #AUTO-GEN</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
//                 <X size={20} className="text-slate-400" />
//               </button>
//             </div>

//             <div className="p-8 grid grid-cols-2 gap-6">
//               {/* Category & Name */}
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
//                 <select 
//                   value={tempAsset.asset_category}
//                   onChange={(e) => setTempAsset({...tempAsset, asset_category: e.target.value})}
//                   className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
//                 >
//                   <option value="laptop">Laptop / Workstation</option>
//                   <option value="mobile">Mobile Device</option>
//                   <option value="peripherals">Peripherals</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Name</label>
//                 <input 
//                   type="text"
//                   placeholder="MacBook Pro M3..."
//                   value={tempAsset.asset_name}
//                   onChange={(e) => setTempAsset({...tempAsset, asset_name: e.target.value})}
//                   className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
//                 />
//               </div>

//               {/* Serial & Model */}
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Serial Number</label>
//                 <input 
//                   type="text"
//                   value={tempAsset.serial_number}
//                   onChange={(e) => setTempAsset({...tempAsset, serial_number: e.target.value})}
//                   className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-mono outline-none focus:border-blue-500 transition-all"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Model Number</label>
//                 <input 
//                   type="text"
//                   value={tempAsset.model_number}
//                   onChange={(e) => setTempAsset({...tempAsset, model_number: e.target.value})}
//                   className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-mono outline-none focus:border-blue-500 transition-all"
//                 />
//               </div>

//               {/* Condition & Date Logic */}
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Condition</label>
//                 <select 
//                   value={tempAsset.condition_on_allocation}
//                   onChange={(e) => setTempAsset({...tempAsset, condition_on_allocation: e.target.value})}
//                   className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
//                 >
//                   <option value="new">Brand New</option>
//                   <option value="good">Good / Refurbished</option>
//                   <option value="used">Used / Functional</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between items-center px-1">
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Allocation Date</label>
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input 
//                       type="checkbox" 
//                       checked={useTodayDate} 
//                       onChange={(e) => {
//                         setUseTodayDate(e.target.checked);
//                         if(e.target.checked) setTempAsset({...tempAsset, allocated_at: new Date().toISOString().split('T')[0]})
//                       }}
//                       className="w-3 h-3 rounded text-blue-600 focus:ring-0" 
//                     />
//                     <span className="text-[9px] font-bold text-slate-400 uppercase">Today</span>
//                   </label>
//                 </div>
//                 {!useTodayDate && (
//                   <input 
//                     type="date"
//                     value={tempAsset.allocated_at}
//                     onChange={(e) => setTempAsset({...tempAsset, allocated_at: e.target.value})}
//                     className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none animate-in fade-in slide-in-from-top-1"
//                   />
//                 )}
//                 {useTodayDate && (
//                   <div className="w-full bg-slate-100/50 p-3 rounded-xl text-[10px] font-black text-slate-400 italic">
//                     Timestamping: {new Date().toLocaleDateString()}
//                   </div>
//                 )}
//               </div>

//               {/* Remarks */}
//               <div className="col-span-2 space-y-2">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Remarks / Notes</label>
//                 <textarea 
//                   value={tempAsset.remarks}
//                   onChange={(e) => setTempAsset({...tempAsset, remarks: e.target.value})}
//                   rows={2}
//                   className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-medium outline-none focus:border-blue-500 transition-all resize-none"
//                 />
//               </div>

//               {/* Email Toggle */}
//               <div className="col-span-2 flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
//                 <div className="flex items-center gap-3">
//                   <Mail size={18} className="text-blue-600" />
//                   <div>
//                     <p className="text-[10px] font-black text-slate-700 uppercase">Notification protocol</p>
//                     <p className="text-[9px] text-blue-600/70 font-medium tracking-tight whitespace-nowrap overflow-hidden">Send allocation details to candidate email upon commit</p>
//                   </div>
//                 </div>
//                 <input 
//                   type="checkbox"
//                   checked={tempAsset.send_email}
//                   onChange={(e) => setTempAsset({...tempAsset, send_email: e.target.checked})}
//                   className="w-5 h-5 rounded-lg border-blue-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
//                 />
//               </div>
//             </div>

//             <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleConfirmAdd}
//                 className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
//               >
//                 Add to Registry
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* REMAINDER OF YOUR EXISTING UI CODE (Committed Assets, Draft Rows, Footer) */}
//       <div className="space-y-4">
//         {/* ... (PreviousAssets mapping stays exactly as you provided) ... */}
//         {previousAssets.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">Committed Inventory</p>
//             {previousAssets.map((asset, i) => (
//               <div
//                 key={`prev-${i}`}
//                 className="grid grid-cols-12 gap-4 p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl items-center opacity-90 hover:opacity-100 transition-opacity"
//               >
//                 {/* Your existing committed assets UI */}
//                 <div className="col-span-1 flex justify-center">
//                   <div className="p-2.5 bg-white text-emerald-500 rounded-xl shadow-sm border border-slate-100">
//                     {(asset.category || asset.asset_category || "").toLowerCase() === "laptop" ? <Monitor size={16} /> : <Package size={16} />}
//                   </div>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Asset Info</p>
//                   <p className="text-xs font-bold text-slate-700 truncate">
//                     {(asset.category || asset.asset_category || "").toUpperCase()} — {asset.asset_name}
//                   </p>
//                 </div>
//                 {/* ... rest of previousAssets items */}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* SECTION: DRAFT ASSETS */}
//         {assetRows.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest px-2">Draft Assignments</p>
//             {assetRows.map((row, index) => (
//               <div
//                 key={`new-${index}`}
//                 className="group grid grid-cols-12 gap-3 p-5 bg-white border border-slate-200 rounded-[1.5rem] items-center hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
//               >
//                 <div className="col-span-1 flex justify-center">
//                     <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
//                       {row.asset_category === "laptop" ? <Monitor size={16} /> : <Package size={16} />}
//                     </div>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Asset</p>
//                   <p className="text-xs font-bold text-slate-800">{row.asset_name}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Identification</p>
//                   <p className="text-xs font-mono text-slate-500">{row.serial_number}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Condition / Date</p>
//                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
//                     {row.condition_on_allocation} — {row.allocated_at}
//                   </p>
//                 </div>
//                 <div className="col-span-2 flex justify-end">
//                   <button onClick={() => onRemove(index)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
//                     <X size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* EMPTY STATE & FOOTER ACTION BAR logic as before... */}
//         {assetRows.length === 0 && previousAssets.length === 0 && (
//           <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 flex flex-col items-center justify-center bg-slate-50/30">
//              <Package size={32} className="text-slate-200 mb-4" />
//              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Ready / No Data</p>
//           </div>
//         )}

//         {assetRows.length > 0 && (
//            <div className="mt-8 p-1 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50">
//              <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className={`w-full py-4 rounded-[1.7rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3
//                   ${isSuccess ? 'bg-emerald-500' : 'bg-slate-900'} text-white`}
//               >
//                 {isSubmitting ? "Processing..." : isSuccess ? "Success" : "Finalize & Sync Inventory"}
//               </button>
//            </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetManager;
//***************************************************working code phase 12 07/02/26*************************************************************** */
// import React, { useState } from 'react';
// import { Monitor, Cpu, Package, X, Plus, ShieldCheck, CheckCircle2, Loader2, Database, Zap, Hash } from 'lucide-react';

// const AssetManager = ({ previousAssets = [], assetRows = [], onAdd, onRemove, onChange, onApiSubmit }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async () => {
//     if (assetRows.length === 0) return;
//     setIsSubmitting(true);
//     try {
//       await onApiSubmit(assetRows); 
//       setIsSuccess(true);
//       setTimeout(() => setIsSuccess(false), 3000);
//     } catch (error) {
//       console.error("Asset submission failed", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* HEADER: ENTERPRISE METADATA */}
//       <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
//         <div>
//           <div className="flex items-center gap-2">
//              <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//              <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">
//                Asset Provisioning System
//              </label>
//           </div>
//           <p className="text-[10px] text-slate-400 font-medium mt-1">Hardware lifecycle management and recruitment allocation</p>
//         </div>
//         <button
//           onClick={onAdd}
//           className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 active:scale-95"
//         >
//           <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
//           Add New Asset
//         </button>
//       </div>

//       <div className="space-y-4">
//         {/* SECTION: COMMITTED ASSETS (READ-ONLY) */}
//         {previousAssets.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">Committed Inventory</p>
//             {previousAssets.map((asset, i) => (
//               <div
//                 key={`prev-${i}`}
//                 className="grid grid-cols-12 gap-4 p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl items-center opacity-90 hover:opacity-100 transition-opacity"
//               >
//                 <div className="col-span-1 flex justify-center">
//                   <div className="p-2.5 bg-white text-emerald-500 rounded-xl shadow-sm border border-slate-100">
//                     {(asset.category || asset.asset_category || "").toLowerCase() === "laptop" ? <Monitor size={16} /> : <Package size={16} />}
//                   </div>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Asset Info</p>
//                   <p className="text-xs font-bold text-slate-700 truncate">
//                     {(asset.category || asset.asset_category || "").toUpperCase()} — {asset.asset_name}
//                   </p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Serial Number</p>
//                   <p className="text-xs font-mono text-slate-500">{asset?.serial_number || "—"}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Model / Mobile</p>
//                   <p className="text-xs font-mono text-slate-500">{asset?.model_number || "—"}</p>
//                 </div>
//                 <div className="col-span-2 flex justify-end">
//                   <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-100">
//                     <ShieldCheck size={10} /> Verified
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* SECTION: DRAFT ASSETS (DYNAMIC ROWS) */}
//         {assetRows.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest px-2">Draft Assignments</p>
//             {assetRows.map((row, index) => (
//               <div
//                 key={`new-${index}`}
//                 className="group grid grid-cols-12 gap-3 p-5 bg-white border border-slate-200 rounded-[1.5rem] items-end hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 animate-in slide-in-from-top-4"
//               >
//                 {/* 1. Category */}
//                 <div className="col-span-2 space-y-2">
//                   <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Category</p>
//                   <select
//                     value={row.category}
//                     onChange={(e) => onChange(index, "category", e.target.value)}
//                     className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
//                   >
//                     <option value="laptop">Laptop</option>
//                     <option value="mobile">Mobile</option>
//                     <option value="sim_card">SIM Card</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 {/* 2. Specification (Model Name) */}
//                 <div className="col-span-3 space-y-2">
//                   <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest truncate">
//                     {row.category === "sim_card" ? "Carrier / Plan" : "Specification"}
//                   </p>
//                   <input
//                     value={row.model}
//                     onChange={(e) => onChange(index, "model", e.target.value)}
//                     placeholder="e.g. iPhone 15 Pro"
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//                   />
//                 </div>

//                 {/* 3. NEW: Model / Mobile Number Input */}
//                 <div className="col-span-3 space-y-2">
//                   <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest truncate">Model / Phone No.</p>
//                   <input
//                     value={row.model_number || ""}
//                     onChange={(e) => onChange(index, "model_number", e.target.value)}
//                     placeholder="e.g. A2848 / +1..."
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//                   />
//                 </div>

//                 {/* 4. Identification (Serial Number) */}
//                 <div className="col-span-3 space-y-2">
//                   <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Identification</p>
//                   <input
//                     value={row.serial}
//                     onChange={(e) => onChange(index, "serial", e.target.value)}
//                     placeholder="Serial or IMEI..."
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//                   />
//                 </div>

//                 {/* 5. Remove Action */}
//                 <div className="col-span-1 flex justify-center">
//                   <button
//                     onClick={() => onRemove(index)}
//                     className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* EMPTY STATE */}
//         {assetRows.length === 0 && previousAssets.length === 0 && (
//           <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 flex flex-col items-center justify-center bg-slate-50/30">
//             <div className="p-4 bg-white rounded-full shadow-sm mb-4">
//               <Package size={32} className="text-slate-200" />
//             </div>
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Ready / No Data</p>
//           </div>
//         )}

//         {/* FOOTER ACTION BAR */}
//         {assetRows.length > 0 && (
//           <div className="mt-8 p-1 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-700">
//             <div className="px-6 py-3 flex items-center justify-between border-b border-slate-100/80 mb-1">
//               <div className="flex items-center gap-2">
//                 <Database size={12} className="text-blue-500" />
//                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Queue: Synchronize staging area</span>
//               </div>
//               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 rounded-md">
//                 <Zap size={10} className="text-blue-600 fill-blue-600" />
//                 <span className="text-[9px] font-bold text-blue-600 uppercase">
//                   {assetRows.length} {assetRows.length === 1 ? 'Pending Item' : 'Pending Items'}
//                 </span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className={`w-full py-4 rounded-[1.7rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3
//                 ${isSuccess 
//                   ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
//                   : 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]'
//                 } disabled:opacity-50 disabled:grayscale`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 size={16} className="animate-spin" />
//                   Processing Deployment...
//                 </>
//               ) : isSuccess ? (
//                 <>
//                   <CheckCircle2 size={16} className="animate-bounce" />
//                   Commit Success
//                 </>
//               ) : (
//                 "Finalize & Sync Inventory"
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetManager;
//**************************************************working code phase 2 07/02/26********************************************************************* */
// import React, { useState } from 'react';
// import { Monitor, Cpu, Package, X, Plus, ShieldCheck, CheckCircle2, Loader2, Database, Zap, Hash } from 'lucide-react';

// const AssetManager = ({ previousAssets = [], assetRows = [], onAdd, onRemove, onChange, onApiSubmit }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async () => {
//     if (assetRows.length === 0) return;
//     setIsSubmitting(true);
//     try {
//       await onApiSubmit(assetRows); 
//       setIsSuccess(true);
//       setTimeout(() => setIsSuccess(false), 3000);
//     } catch (error) {
//       console.error("Asset submission failed", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* HEADER: ENTERPRISE METADATA */}
//       <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
//         <div>
//           <div className="flex items-center gap-2">
//              <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
//              <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">
//                Asset Provisioning System
//              </label>
//           </div>
//           <p className="text-[10px] text-slate-400 font-medium mt-1">Hardware lifecycle management and recruitment allocation</p>
//         </div>
//         <button
//           onClick={onAdd}
//           className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 active:scale-95"
//         >
//           <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
//           Add New Asset
//         </button>
//       </div>

//       <div className="space-y-4">
//         {/* SECTION: COMMITTED ASSETS (READ-ONLY) */}
//         {previousAssets.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">Committed Inventory</p>
//             {previousAssets.map((asset, i) => (
//               <div
//                 key={`prev-${i}`}
//                 className="grid grid-cols-12 gap-4 p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl items-center opacity-90 hover:opacity-100 transition-opacity"
//               >
//                 <div className="col-span-1 flex justify-center">
//                   <div className="p-2.5 bg-white text-emerald-500 rounded-xl shadow-sm border border-slate-100">
//                     {(asset.category || asset.asset_category || "").toLowerCase() === "laptop" ? <Monitor size={16} /> : <Package size={16} />}
//                   </div>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Asset Info</p>
//                   <p className="text-xs font-bold text-slate-700 truncate">
//                     {(asset.category || asset.asset_category || "").toUpperCase()} — {asset.asset_name}
//                   </p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Serial Number</p>
//                   <p className="text-xs font-mono text-slate-500">{asset?.serial_number || "—"}</p>
//                 </div>
//                 <div className="col-span-3">
//                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Model / Mobile</p>
//                   <p className="text-xs font-mono text-slate-500">{asset?.model_number || "—"}</p>
//                 </div>
//                 <div className="col-span-2 flex justify-end">
//                   <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-100">
//                     <ShieldCheck size={10} /> Verified
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* SECTION: DRAFT ASSETS (DYNAMIC ROWS) */}
//         {assetRows.length > 0 && (
//           <div className="space-y-2">
//             <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest px-2">Draft Assignments</p>
//             {assetRows.map((row, index) => (
//               <div
//                 key={`new-${index}`}
//                 className="group grid grid-cols-12 gap-3 p-5 bg-white border border-slate-200 rounded-[1.5rem] items-end hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 animate-in slide-in-from-top-4"
//               >
//                 {/* 1. Category */}
//                 <div className="col-span-2 space-y-2">
//                   <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Category</p>
//                   <select
//                     value={row.category}
//                     onChange={(e) => onChange(index, "category", e.target.value)}
//                     className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
//                   >
//                     <option value="laptop">Laptop</option>
//                     <option value="mobile">Mobile</option>
//                     <option value="sim_card">SIM Card</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 {/* 2. Specification (Model Name) */}
//                 <div className="col-span-3 space-y-2">
//                   <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest truncate">
//                     {row.category === "sim_card" ? "Carrier / Plan" : "Specification"}
//                   </p>
//                   <input
//                     value={row.model}
//                     onChange={(e) => onChange(index, "model", e.target.value)}
//                     placeholder="e.g. iPhone 15 Pro"
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//                   />
//                 </div>

//                 {/* 3. NEW: Model / Mobile Number Input */}
//                 <div className="col-span-3 space-y-2">
//                   <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest truncate">Model / Phone No.</p>
//                   <input
//                     value={row.model_number || ""}
//                     onChange={(e) => onChange(index, "model_number", e.target.value)}
//                     placeholder="e.g. A2848 / +1..."
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//                   />
//                 </div>

//                 {/* 4. Identification (Serial Number) */}
//                 <div className="col-span-3 space-y-2">
//                   <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Identification</p>
//                   <input
//                     value={row.serial}
//                     onChange={(e) => onChange(index, "serial", e.target.value)}
//                     placeholder="Serial or IMEI..."
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
//                   />
//                 </div>

//                 {/* 5. Remove Action */}
//                 <div className="col-span-1 flex justify-center">
//                   <button
//                     onClick={() => onRemove(index)}
//                     className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* EMPTY STATE */}
//         {assetRows.length === 0 && previousAssets.length === 0 && (
//           <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 flex flex-col items-center justify-center bg-slate-50/30">
//             <div className="p-4 bg-white rounded-full shadow-sm mb-4">
//               <Package size={32} className="text-slate-200" />
//             </div>
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Ready / No Data</p>
//           </div>
//         )}

//         {/* FOOTER ACTION BAR */}
//         {assetRows.length > 0 && (
//           <div className="mt-8 p-1 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-700">
//             <div className="px-6 py-3 flex items-center justify-between border-b border-slate-100/80 mb-1">
//               <div className="flex items-center gap-2">
//                 <Database size={12} className="text-blue-500" />
//                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Queue: Synchronize staging area</span>
//               </div>
//               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 rounded-md">
//                 <Zap size={10} className="text-blue-600 fill-blue-600" />
//                 <span className="text-[9px] font-bold text-blue-600 uppercase">
//                   {assetRows.length} {assetRows.length === 1 ? 'Pending Item' : 'Pending Items'}
//                 </span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className={`w-full py-4 rounded-[1.7rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3
//                 ${isSuccess 
//                   ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
//                   : 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]'
//                 } disabled:opacity-50 disabled:grayscale`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 size={16} className="animate-spin" />
//                   Processing Deployment...
//                 </>
//               ) : isSuccess ? (
//                 <>
//                   <CheckCircle2 size={16} className="animate-bounce" />
//                   Commit Success
//                 </>
//               ) : (
//                 "Finalize & Sync Inventory"
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetManager;
// import React from 'react';
// import { Monitor, Cpu, Package, X, Plus, ShieldCheck } from 'lucide-react';

// const AssetManager = ({ previousAssets = [], assetRows = [], onAdd, onRemove, onChange }) => {
//   return (
//     <div className="space-y-6">
//       {/* Header section with Metadata */}
//       <div className="flex items-center justify-between px-1">
//         <div>
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
//             Hardware Assets Assignment
//           </label>
//           <p className="text-[10px] text-slate-400 font-medium">Provisioning hardware for new recruitment cycles</p>
//         </div>
//         <button
//           onClick={onAdd}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-100 transition-all border border-blue-100"
//         >
//           <Plus size={14} /> Add Asset
//         </button>
//       </div>

//       <div className="space-y-3">
//         {/* SECTION: PREVIOUSLY COMMITTED ASSETS */}
//         {previousAssets.map((asset, i) => (
//           <div
//             key={`prev-${i}`}
//             className="group grid grid-cols-12 gap-4 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl items-center opacity-80"
//           >
//             <div className="col-span-1 flex justify-center">
//               <div className="p-2 bg-white text-emerald-500 rounded-lg shadow-sm">
//                 {(asset.category || asset.asset_category || "").toLowerCase() === "laptop" ? <Monitor size={16} /> : <Package size={16} />}
//               </div>
//             </div>
//             <div className="col-span-4">
//               <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Asset Info</p>
//               <p className="text-xs font-bold text-slate-700">{( asset.category || asset.asset_category || "" ).toUpperCase()
// } — {asset.asset_name}</p>
//             </div>
//             <div className="col-span-4">
//               <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Serial / ID</p>
//               <p className="text-xs font-mono text-slate-500">{asset?.serial_number || "-"}</p>
//             </div>
//             <div className="col-span-4">
//               <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Modal / Mobile Number</p>
//               <p className="text-xs font-mono text-slate-500">{asset?.model_number || "-"}</p>
//             </div>
//             <div className="col-span-3 flex justify-end">
//               <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-tighter border border-emerald-200">
//                 <ShieldCheck size={10} /> Verified
//               </span>
//             </div>
//           </div>
//         ))}

//         {/* SECTION: NEW DYNAMIC ROWS (DRAFTS) */}
//         {assetRows.map((row, index) => (
//           <div
//             key={`new-${index}`}
//             className="group grid grid-cols-12 gap-3 p-4 bg-white border border-slate-200 rounded-[1.5rem] items-end hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all animate-in slide-in-from-top-2 duration-300"
//           >
//             {/* Category Select */}
//             <div className="col-span-3 space-y-1.5">
//               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Category</p>
//               <select
//                 value={row.category}
//                 onChange={(e) => onChange(index, "category", e.target.value)}
//                 className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
//               >
//                 <option value="laptop">Laptop</option>
//                 <option value="mobile">Mobile</option>
//                 <option value="sim_card">SIM Card</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//             {/* Model Input */}
//             <div className="col-span-4 space-y-1.5">
//               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">
//                 {row.category === "sim_card" ? "Carrier / Plan" : "Model Specification"}
//               </p>
//               <input
//                 value={row.model}
//                 onChange={(e) => onChange(index, "model", e.target.value)}
//                 placeholder="e.g. MacBook Air M2"
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
//               />
//             </div>

//             {/* Identification/Serial */}
//             <div className="col-span-4 space-y-1.5">
//               <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Identification</p>
//               <input
//                 value={row.serial}
//                 onChange={(e) => onChange(index, "serial", e.target.value)}
//                 placeholder="Serial Number..."
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-medium text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
//               />
//             </div>

//             {/* Remove Action */}
//             <div className="col-span-1 flex justify-center pb-1">
//               <button
//                 onClick={() => onRemove(index)}
//                 className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* Empty State */}
//         {assetRows.length === 0 && previousAssets.length === 0 && (
//           <div className="border-2 border-dashed border-slate-100 rounded-[2rem] py-10 flex flex-col items-center justify-center">
//             <Package size={32} className="text-slate-200 mb-2" />
//             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Assets Assigned</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetManager;