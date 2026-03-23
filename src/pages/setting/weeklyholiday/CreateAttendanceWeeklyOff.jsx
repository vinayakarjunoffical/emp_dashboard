import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  Settings2,
  Calendar,
  Check,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateAttendanceWeeklyOff = () => {
  const navigate = useNavigate();
  
  // State management for form inputs
  const [templateName, setTemplateName] = useState("");
  const [attendanceType, setAttendanceType] = useState("Assign Regular Payable Day");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const options = ["Assign Regular Payable Day", "Assign Comp-Off"];

  // ✅ Ensures selection updates state and closes menu properly
  const handleSelect = (e, option) => {
    e.stopPropagation(); 
    setAttendanceType(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24 text-left relative">
      {/* 🚀 HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-300 text-slate-300 transition-transform" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Back to Templates</span>
        </button>
      </div>

      <div className=" mx-auto md:px-6 px-2 mt-4 md:mt-4">
        {/* 📑 MAIN CONFIGURATION CARD */}
        <div className="bg-white border border-slate-200 rounded-[24px] md:p-8 px-4 py-6 shadow-sm space-y-10 relative overflow-hidden">
          
          <div className="space-y-1 relative z-10 mb-4">
            <h1 className="md:text-xl text-lg font-black text-slate-900 tracking-tighter uppercase">Attendance on weekly off configuration</h1>
          </div>

          <div className="space-y-8 relative z-10">
            {/* NAME INPUT */}
            <div className="space-y-2 max-w-sm mb-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Name 
              </label>
              <input 
                type="text" 
                placeholder="Provide a Template Name" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all placeholder:text-slate-300 text-slate-700"
              />
            </div>

            {/* ATTENDANCE TYPE CARD */}
            <div className="border border-slate-100 rounded-xl overflow-visible bg-white shadow-sm ring-1 ring-slate-200/20">
              <div className="p-4 bg-slate-50/30 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance Type</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Choose the attendance type to assign for working on a weekly off
                </p>
              </div>

           <div className="md:p-6 p-4 space-y-2 max-w-sm">
  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
    Type 
  </label>
  
  <div className="relative group">
    {/* Standard HTML Select Dropdown */}
    <select 
      value={attendanceType}
      onChange={(e) => setAttendanceType(e.target.value)}
      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 appearance-none cursor-pointer transition-all pr-10"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    
    {/* Custom Arrow Icon */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-slate-500 transition-colors">
      <ChevronDown size={16} />
    </div>
  </div>
</div>
            </div>
          </div>

          {/* Background Watermark Decoration */}
          <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
            <Calendar size={180} />
          </div>
        </div>
      </div>

      {/* 🛡️ FIXED FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className=" mx-auto flex justify-end gap-3 px-2">
          <button 
            onClick={() => navigate(-1)} 
            className="px-8 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
          >
            cancel
          </button>
          <button 
            className="px-12 py-2.5 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm border border-blue-500 shadow-blue-200 active:scale-95 transition-all cursor-pointer"
          >
            Save Template
          </button>
        </div>
      </div>

      {/* Overlay for closing dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setIsDropdownOpen(false)} 
        />
      )}
    </div>
  );
};

export default CreateAttendanceWeeklyOff;