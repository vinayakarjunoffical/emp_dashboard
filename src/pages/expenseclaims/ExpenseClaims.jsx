import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  Calendar, 
  Upload, 
  FileText, 
  Plus,
  Save, 
  Send,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ExpenseClaims = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const staffName = location.state?.employeeName || "Sandip Satpute";

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-500 flex flex-col">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-50 !bg-transparent rounded-xl !text-slate-400 border border-slate-100 transition-all border-0 outline-none cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Add Claim</h1>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{staffName}</span>
          </div>
        </div>
      </div>

      {/* 📝 FORM CONTENT */}
      <div className="flex-1 w-full mx-auto p-6 md:p-10 space-y-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          
          {/* Expense Type */}
          <div className={inputGroupStyle}>
            <label className={labelStyle}>Expense Type <span className="text-rose-500">*</span></label>
            <div className="relative">
              <select className={fieldStyle}>
                <option>Travel Expense</option>
                <option>Food & Beverage</option>
                <option>Medical Reimbursement</option>
                <option>Internet/Utility</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Expense Date */}
          <div className={inputGroupStyle}>
            <label className={labelStyle}>Expense Date <span className="text-rose-500">*</span></label>
            <div className="relative">
              <input type="text" placeholder="Enter expense date" className={fieldStyle} />
              <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Bill Number */}
          <div className={inputGroupStyle}>
            <label className={labelStyle}>Bill Number</label>
            <input type="text" placeholder="Enter bill number" className={fieldStyle} />
          </div>

          {/* Amount */}
          <div className={inputGroupStyle}>
            <label className={labelStyle}>Amount <span className="text-rose-500">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input type="number" placeholder="Enter amount" className={fieldStyle + " pl-8"} />
            </div>
          </div>

          {/* Description - Full Width */}
          <div className={`${inputGroupStyle} md:col-span-2`}>
            <label className={labelStyle}>Description</label>
            <textarea 
              rows={3} 
              placeholder="Enter description" 
              className={fieldStyle + " resize-none py-3 h-24"} 
            />
          </div>
        </div>

        {/* 📎 ATTACHMENT DROPZONE (Exact match to image_7db960.jpg) */}
        <div className="space-y-3">
          <label className={labelStyle}>Attachments <span className="text-rose-500">*</span></label>
          <div className="w-full border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30 p-12 flex flex-col items-center justify-center text-center group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Upload size={28} strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center border-2 border-white">
                <Plus size={14} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Upload attachment</p>
            <p className="text-[9px] text-slate-400 font-medium max-w-xs mt-2 leading-relaxed">
              Only jpg, jpeg and pdf format supported.<br/>
              Max 20 files can be uploaded. Max file size will be 2.00MB each.
            </p>
          </div>
        </div>
      </div>

      {/* 💾 STICKY FOOTER */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0 z-30">
        <button 
          className="px-6 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 outline-none cursor-pointer"
        >
          Save as Draft
        </button>
        <button 
          className="px-10 py-2.5 !bg-transparent !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-500/20 hover:bg-white border border-blue-500 active:scale-95 transition-all outline-none cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// 🎨 COMPONENT STYLES
const inputGroupStyle = "flex flex-col gap-1.5";
const labelStyle = "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1";
const fieldStyle = "w-full bg-slate-50 border border-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none";

export default ExpenseClaims;