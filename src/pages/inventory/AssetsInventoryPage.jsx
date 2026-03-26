import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Box, Laptop, Server, Package, Image as ImageIcon, 
  MoreVertical, XCircle, UploadCloud, X, Save, AlertCircle, HardDrive, Edit3, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AssetsInventoryPage = () => {
  // 1. PAGE & TABLE STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy Data for Table
  const [assets, setAssets] = useState([
    { id: "AST-101", category: "Electronics", name: "MacBook Pro 16-inch", serial: "C02XYZ123", model: "A2141", condition: "Good", status: "Assigned" },
    { id: "AST-102", category: "Furniture", name: "Ergonomic Office Chair", serial: "CHR-0092", model: "Herman Miller Aeron", condition: "New", status: "Available" },
    { id: "AST-103", category: "Hardware", name: "Dell 27-inch Monitor", serial: "DL-MN-883", model: "U2720Q", condition: "Fair", status: "Available" },
    { id: "AST-104", category: "Electronics", name: "ThinkPad XPS 15", serial: "TP-9921", model: "XPS-15-9500", condition: "New", status: "Assigned" },
    { id: "AST-105", category: "Mobile Device", name: "iPhone 14 Pro", serial: "IP14-9281", model: "A2890", condition: "New", status: "Available" },
  ]);

  // 2. MODAL FORM STATES (Matching your API screenshot)
  const initialFormState = {
    asset_category: "Electronics",
    asset_name: "",
    serial_number: "",
    model_number: "",
    condition: "new",
    remarks: ""
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]); // Store actual File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Store Object URLs for UI

  // 3. HANDLERS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews(imagePreviews.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.asset_category || !formData.asset_name) {
      toast.error("Category and Asset Name are required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData payload as per your API structure
      const payload = new FormData();
      payload.append("asset_category", formData.asset_category);
      payload.append("asset_name", formData.asset_name);
      
      if (formData.serial_number) payload.append("serial_number", formData.serial_number);
      if (formData.model_number) payload.append("model_number", formData.model_number);
      
      payload.append("condition", formData.condition);
      
      if (formData.remarks) payload.append("remarks", formData.remarks);
      
      // Append multiple images
      images.forEach((file) => {
        payload.append("images", file);
      });

      // Simulating API Call
      // const response = await fetch('YOUR_API_URL', { method: 'POST', body: payload });
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Asset added to inventory successfully");
      setIsAddModalOpen(false);
      setFormData(initialFormState);
      setImages([]);
      setImagePreviews([]);
      
    } catch (error) {
      toast.error("Failed to add asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setFormData(initialFormState);
    setImages([]);
    setImagePreviews([]);
  };

  // 4. HELPER STYLES
  const labelStyle = "block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1";
  const inputStyle = "w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-slate-300";
  const thStyle = "px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-left pb-12">
      <Toaster position="top-right" />

      {/* 🚀 PAGE HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 sticky top-0 z-[50]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Company Assets</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Hardware, Software & Inventory</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20 outline-none cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} /> Add New Asset
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* 📊 INVENTORY DATA TABLE */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm overflow-hidden animate-in fade-in duration-500">
          
          {/* Table Controls (Search & Filter) */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search assets by name or serial..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all outline-none cursor-pointer">
              <Filter size={14} /> Filter Status
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className={thStyle}>Asset Name</th>
                  <th className={thStyle}>Category</th>
                  <th className={thStyle}>Serial / Model</th>
                  <th className={thStyle}>Condition</th>
                  <th className={thStyle}>Status</th>
                  <th className={`${thStyle} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {assets.map((asset, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{asset.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {asset.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {asset.category === 'Electronics' || asset.category === 'Mobile Device' ? <Laptop size={10} /> : <Box size={10} />}
                        {asset.category}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-bold text-slate-700">{asset.serial || "N/A"}</p>
                      <p className="text-[9px] font-medium text-slate-400 uppercase mt-0.5">M: {asset.model || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                      {asset.condition}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1 w-fit ${
                        asset.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${asset.status === 'Available' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-transparent border-0 outline-none cursor-pointer">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing 1 to 5 of 24 assets</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all outline-none cursor-pointer"><ChevronLeft size={14} /></button>
              <span className="text-[10px] font-black text-slate-700 px-2">Page 1</span>
              <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all outline-none cursor-pointer"><ChevronRight size={14} /></button>
            </div>
          </div>

        </div>
      </div>

      {/* 🛡️ ADD ASSET MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={closeModal} />
          
          <div className="relative bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-200">
                  <HardDrive size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Add New Asset</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Enter inventory details to catalog</p>
                </div>
              </div>
              <button type="button" onClick={closeModal} className="p-2 bg-transparent hover:bg-slate-100 rounded-full text-slate-400 transition-colors border-0 cursor-pointer outline-none">
                <XCircle size={24} strokeWidth={2} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 custom-scrollbar">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Category */}
                  <div className="space-y-1">
                    <label className={labelStyle}>Category Type <span className="text-rose-500">*</span></label>
                    <select 
                      name="asset_category"
                      value={formData.asset_category}
                      onChange={handleInputChange}
                      className={inputStyle}
                    >
                      <option value="Electronics">Electronics (Laptops, Phones)</option>
                      <option value="Furniture">Furniture (Chairs, Desks)</option>
                      <option value="Vehicles">Company Vehicles</option>
                      <option value="Peripherals">Peripherals (Keyboards, Mice)</option>
                      <option value="Other">Other Assets</option>
                    </select>
                  </div>

                  {/* Asset Name */}
                  <div className="space-y-1">
                    <label className={labelStyle}>Asset Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      name="asset_name"
                      value={formData.asset_name}
                      onChange={handleInputChange}
                      placeholder="e.g. MacBook Pro 16-inch"
                      className={inputStyle}
                    />
                  </div>

                  {/* Serial Number */}
                  <div className="space-y-1">
                    <label className={labelStyle}>Serial Number / Asset Tag</label>
                    <input 
                      type="text" 
                      name="serial_number"
                      value={formData.serial_number}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className={inputStyle}
                    />
                  </div>

                  {/* Model Number */}
                  <div className="space-y-1">
                    <label className={labelStyle}>Model Number</label>
                    <input 
                      type="text" 
                      name="model_number"
                      value={formData.model_number}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className={inputStyle}
                    />
                  </div>

                  {/* Condition */}
                  <div className="space-y-1 md:col-span-2">
                    <label className={labelStyle}>Current Condition</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {['new', 'good', 'fair', 'poor', 'damaged'].map((cond) => (
                        <label key={cond} className={`flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer transition-all ${formData.condition === cond ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/10' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                          <input 
                            type="radio" 
                            name="condition" 
                            value={cond} 
                            checked={formData.condition === cond}
                            onChange={handleInputChange}
                            className="hidden" 
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest">{cond}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-1 md:col-span-2">
                    <label className={labelStyle}>Additional Notes / Remarks</label>
                    <textarea 
                      rows={3} 
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      placeholder="Any specific details, damages, or notes..."
                      className={`${inputStyle} resize-none rounded-xl`}
                    />
                  </div>

                  {/* Multiple Images Upload */}
                  <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <label className={labelStyle}>Asset Images</label>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{images.length} File(s) Selected</span>
                    </div>
                    
                    {/* Drag & Drop Zone */}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <p className="text-xs font-bold text-slate-700 mb-1">Click to upload images</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PNG, JPG, JPEG (Max 5MB each)</p>
                      </div>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {imagePreviews.map((src, index) => (
                          <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button" 
                                onClick={() => removeImage(index)}
                                className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 z-20">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-6 py-2.5 bg-transparent border border-slate-300 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer outline-none"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 disabled:bg-slate-300 disabled:shadow-none transition-all cursor-pointer outline-none"
              >
                {isSubmitting ? (
                  <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" /> Uploading...</>
                ) : (
                  <><Save size={16} strokeWidth={2.5} /> Save Asset</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsInventoryPage;