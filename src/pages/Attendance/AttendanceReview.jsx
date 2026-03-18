import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Calendar, ChevronLeft, ChevronRight, 
  MapPin, Clock, CheckCircle, XCircle, MoreVertical 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendanceReview = () => {
  const navigate = useNavigate();
  const [selectedStaff, setSelectedStaff] = useState([]);

   // Mock Data from image
  const pendingData = [
    { 
      id: "EMP001", 
      name: "Nilesh Khanderao Kuwar", 
      role: "Sales",
      shift: "10 to 7",
      punchIn: { time: "9:40 AM", location: "6SXW+JGR, Varap, Khemani Industry Area, Varp, Maharashtra 421103, India" },
      punchOut: { time: "-", location: "" }
    },{ 
      id: "EMP0012", 
      name: "Nile Khanderao Kuar", 
      role: "Sales",
      shift: "10 to 7",
      punchIn: { time: "9:40 AM", location: "6SXW+JGR, Varap, Khemani Industry Area, Varp, Maharashtra 421103, India" },
      punchOut: {time: "8:40 PM", location: "6SXW+JGR, Varap, Khemani Industry Area, Varp, Maharashtra 421103, India" }
    }
  ];


// 1. Handle "Select All" toggle
const handleSelectAll = (e) => {
  if (e.target.checked) {
    const allIds = pendingData.map((item) => item.id);
    setSelectedStaff(allIds);
  } else {
    setSelectedStaff([]);
  }
};

// 2. Handle individual row toggle
const handleSelectRow = (id) => {
  setSelectedStaff((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
};

// 3. Helper to check if all are selected
const isAllSelected = pendingData.length > 0 && selectedStaff.length === pendingData.length;

 

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left relative">
      
      {/* 🚀 1. HEADER: Navigation & Title */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-40">
        <button 
          onClick={() => navigate(-1)} 
          className="p-1.5 hover:!bg-slate-50 rounded-lg !text-slate-400 border-0 !bg-transparent cursor-pointer transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-tighter">
          Attendance Pending for Approval
        </h2>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        
        {/* 🚀 2. TOOLBAR: Date & Search */}
       {/* 🔍 COMPOSITE TOOLBAR: DATE + SEARCH */}
<div className="flex flex-col md:flex-row md:items-center gap-4">
  
  {/* 🗓️ 1. Date Selector Box (Fixed Width) */}
  <div className="flex items-center w-fit border border-slate-200 rounded-xl px-2 py-1 gap-1 bg-white shadow-sm h-[42px]">
    <button className="p-1.5 !text-slate-400 hover:!text-slate-600 !bg-transparent border-0 cursor-pointer transition-colors">
      <ChevronLeft size={16} />
    </button>
    <span className="text-[11px] font-black !text-slate-700 px-3 uppercase tracking-widest whitespace-nowrap">
      17 Mar 2026
    </span>
    <button className="p-1.5 !text-slate-400 hover:text-slate-600 !bg-transparent border-0 cursor-pointer transition-colors">
      <ChevronRight size={16} />
    </button>
    <div className="w-px h-4 bg-slate-100 mx-1" />
    <Calendar size={16} className="text-slate-400 mr-2" />
  </div>

  {/* 🔍 2. Search Box (Flexible Width) */}
  <div className="relative group flex-1 max-w-md">
    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
    <input 
      type="text" 
      placeholder="Search Staff Registry..." 
      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 shadow-sm transition-all placeholder:text-slate-300 uppercase tracking-tight"
    />
  </div>
</div>

        {/* 🚀 3. REGISTRY TABLE CARD */}
        <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
          
          {/* Shift Group Header */}
          <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex items-center gap-3">
             <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">10 to 7</span>
             <span className="bg-slate-200 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">1</span>
          </div>

          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
  <thead>
    <tr className="border-b border-slate-50 bg-slate-50/30">
      <th className="px-6 py-4 w-12">
        {/* 🔥 Header Checkbox */}
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer" 
          checked={isAllSelected}
          onChange={handleSelectAll}
        />
      </th>
      <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Staff Name</th>
      <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Punch In</th>
      <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Punch Out</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-50">
    {pendingData.map((staff) => (
      <tr 
        key={staff.id} 
        className={`group transition-colors ${selectedStaff.includes(staff.id) ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}
      >
        <td className="px-6 py-6">
          {/* 🔥 Individual Row Checkbox */}
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer" 
            checked={selectedStaff.includes(staff.id)}
            onChange={() => handleSelectRow(staff.id)}
          />
        </td>
        
        {/* Staff Name Column */}
        <td className="px-4 py-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-black">
               {staff.name.charAt(0)}
             </div>
             <div>
                <h4 className={`text-[11px] font-black uppercase tracking-tight ${selectedStaff.includes(staff.id) ? 'text-blue-600' : 'text-slate-800'}`}>
                  {staff.name}
                </h4>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase">0h 0m</p>
             </div>
          </div>
        </td>

        {/* Punch In Detail */}
        <td className="px-4 py-6">
          <div className="flex items-start gap-3 max-w-xs">
             <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                <img src="https://via.placeholder.com/40" alt="Selfie" className="w-full h-full object-cover opacity-50" />
             </div>
             <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                   <Clock size={12} className="text-blue-500" />
                   <span className="text-[11px] font-black text-slate-800">{staff.punchIn.time}</span>
                </div>
                <div className="flex items-start gap-1">
                   <MapPin size={10} className="text-slate-300 mt-0.5" />
                   <p className="text-[9px] font-medium text-slate-400 leading-tight line-clamp-1">
                     {staff.punchIn.location}
                   </p>
                </div>
             </div>
          </div>
        </td>

        {/* Punch Out Detail */}
        <td className="px-4 py-6">
         <div className="flex items-start gap-3 max-w-xs">
             <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                <img src="https://via.placeholder.com/40" alt="Selfie" className="w-full h-full object-cover opacity-50" />
             </div>
             <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                   <Clock size={12} className="text-blue-500" />
                   <span className="text-[11px] font-black text-slate-800">{staff.punchOut.time}</span>
                </div>
                <div className="flex items-start gap-1">
                   <MapPin size={10} className="text-slate-300 mt-0.5" />
                   <p className="text-[9px] font-medium text-slate-400 leading-tight line-clamp-1">
                     {staff.punchOut.location}
                   </p>
                </div>
             </div>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          </div>
        </div>
      </div>

      {/* 🚀 4. STICKY FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className=" mx-auto flex justify-end gap-3 px-6">
          <button className="flex items-center gap-2 px-10 py-2.5 !bg-slate-100 hover:!bg-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border border-slate-300 cursor-pointer">
            <XCircle size={14} /> Reject Selected
          </button>
          <button className="flex items-center gap-2 px-10 py-2.5 !bg-white hover:!bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-200 transition-all border border-blue-500 cursor-pointer">
            <CheckCircle size={14} /> Approve Selected
          </button>
        </div>
      </div>

    </div>
  );
};

export default AttendanceReview;
