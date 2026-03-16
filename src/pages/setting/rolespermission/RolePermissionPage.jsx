import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  ShieldCheck, 
  Search, 
  MoreVertical, 
  FileText,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RolePermissionPage = () => {
  const navigate = useNavigate();
  
  // Logic to simulate empty state vs list state
  const [roles, setRoles] = useState([]);

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20 text-left">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-50 rounded-xl !text-slate-400 transition-all !bg-transparent border-0 outline-none active:scale-90"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Settings / Roles & Permissions</span>
      </div>

      <div className=" mx-auto px-6 mt-4">
        {/* 📑 MAIN CONTAINER CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-10 relative overflow-hidden min-h-[500px] flex flex-col">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Roles & Permissions</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Configure privileges and assign roles to your staff
              </p>
            </div>
            
            {roles.length > 0 && (
              <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 border-0">
                <Plus size={16} strokeWidth={3} />
                <span className="text-[11px] font-black uppercase tracking-widest">New Template</span>
              </button>
            )}
          </div>

          {/* 📦 CONTENT AREA (DYNAMIC) */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {roles.length === 0 ? (
              /* EMPTY STATE (As seen in image_e43467.jpg) */
              <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                <div className="relative mb-6">
                  {/* Styled Folder Illustration */}
                  <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center relative border border-emerald-100/50">
                    <FileText size={48} className="text-blue-500" strokeWidth={1.5} />
                    {/* Floating decorative elements to match image */}
                    <div className="absolute -top-2 -left-2 w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 rotate-[-15deg] -z-10" />
                    <div className="absolute top-2 -right-4 w-10 h-10 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-100 rotate-[12deg] -z-10" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                    <Plus size={14} className="text-blue-600" strokeWidth={3} />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No Template Found</p>
                  <button 
                    onClick={() => navigate('/rolespermission')}
                    className="flex items-center gap-2 px-8 py-3 !bg-white !text-blue-500 rounded-xl shadow-sm border !border-blue-500 shadow-blue-200 hover:!bg-white transition-all active:scale-95 "
                  >
                    <Plus size={16} strokeWidth={3} />
                    <span className="text-[11px] font-black uppercase tracking-widest">New Template</span>
                  </button>
                </div>
              </div>
            ) : (
              /* LIST VIEW (If data existed) */
              <div className="w-full space-y-3">
                 {/* Roles list would go here */}
              </div>
            )}
          </div>

          {/* Background Decorative Watermark */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
            <ShieldCheck size={280} />
          </div>
        </div>

        {/* 🛡️ SECURITY FOOTER METADATA */}
        <div className="mt-6 flex items-center gap-2 px-2">
           <Info size={14} className="text-blue-500" />
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
             Role-based access control (RBAC) ensures data security across departments.
           </p>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionPage;