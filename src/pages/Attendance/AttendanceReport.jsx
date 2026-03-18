import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, Filter, Calendar, ChevronDown, MoreVertical, UserPlus,  Umbrella,Info ,Trash2,
  UserCheck, UserX, Clock, AlertCircle, FileText, Settings, X, Plus, Layers,ChevronLeft, ChevronRight,HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendanceReport = () => {
      const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFineModalOpen, setIsFineModalOpen] = useState(false); 
  const [activeStaff, setActiveStaff] = useState({ name: "Dhaval Mehta", date: "17 Mar 2026" });

  // Function to open modal
  //  const handleBadgeClick = () => setIsModalOpen(true);
  const handleBadgeClick = (staffName, type) => {
    setActiveStaff({ name: staffName, date: "17 Mar 2026" });
    if (type === 'F') {
      setIsFineModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const stats = [
    { label: "Total Staff", value: "39", icon: <FileText size={12} /> },
    { label: "Present", value: "0", icon: <UserCheck size={12} className="text-emerald-500" /> },
    { label: "Absent", value: "33", icon: <UserX size={12} className="text-rose-500" /> },
    { label: "Half Day", value: "0", icon: <Clock size={12} className="text-amber-500" /> },
    { label: "Overtime", value: "0h 0m", icon: <Plus size={12} /> },
    { label: "Fine Hours", value: "0h 0m", icon: <AlertCircle size={12} /> },
    { label: "Punched In", value: "0", icon: <UserCheck size={12} /> },
  ];

  return (
    <div className="min-h-screen font-['Inter'] text-left relative">
      {/* 🚀 1. ALERT BANNER */}
      <div className="bg-amber-50 border-b border-amber-100 rounded-lg py-3 mb-4 px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-700">
          <AlertCircle size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">1 Leaves Pending Approval</span>
        </div>
        <button className="text-[10px] font-black !text-blue-600 !bg-transparent uppercase hover:underline underline-offset-4">View Details</button>
      </div>

      {/* 🚀 2. HEADER SECTION */}
     <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center rounded-xl justify-between sticky top-0 z-30 shadow-sm">
  
  {/* ⬅️ LEFT SECTION: Title + Alert Pill + Date */}
  <div className="flex items-center gap-5">
    <h2 className="text-sm font-black text-slate-800 uppercase tracking-tighter">
      Attendance Summary
    </h2>

    {/* ⚠️ ALERT PILL (From image_311e03.png) */}
    <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full animate-pulse-subtle">
      <AlertCircle size={12} className="text-rose-500" strokeWidth={3} />
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
        Approval pending for other dates
      </span>
      <button className="text-[10px] font-black !text-blue-600  !bg-transparent uppercase hover:underline ml-1 cursor-pointer">
        View
      </button>
    </div>

    {/* 🗓️ DATE SELECTOR */}
    {/* <div className="flex items-center gap-2 !bg-slate-50 border !border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
      <Calendar size={14} className="text-slate-400" />
      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
        17 Mar 2026
      </span>
      <ChevronDown size={14} className="!text-slate-300" />
    </div> */}
  </div>

  {/* ➡️ RIGHT SECTION: Actions with Dividers */}
  <div className="flex items-center gap-4">
    
    {/* Action 1 */}
    <button className="flex items-center gap-2 px-3 py-1.5 !text-blue-600 font-black text-[10px] uppercase tracking-widest hover:!bg-blue-50 !bg-transparent rounded-lg transition-all">
      <Layers size={14} />
      Unprocessed Logs
    </button>

    {/* Vertical Divider */}
    <div className="w-px h-4 bg-slate-200" />

    {/* Action 2 */}
    <button className="flex items-center gap-2 px-3 py-1.5 !text-slate-500  !bg-transparent font-black text-[10px] uppercase tracking-widest hover:!bg-slate-50 rounded-lg transition-all">
      Daily Report
      <ChevronDown size={12} className="text-slate-400" />
    </button>

    {/* Vertical Divider */}
    <div className="w-px h-4 bg-slate-200" />

    {/* Action 3: Settings */}
    <button className="p-1.5 !text-slate-400 hover:!text-blue-600 hover:!bg-blue-50  !bg-transparent rounded-lg transition-all group">
      <Settings size={18} className="group-hover:rotate-45 transition-transform duration-300" />
    </button>
  </div>
</div>

      <div className="p-6 space-y-6">
        {/* 🚀 3. ANALYTICS STRIP */}
        {/* 📊 ATTENDANCE ANALYTICS: CARD VIEW */}
<div className="space-y-6">
  {/* 1. TOP HEADER: Date Selector & Review Action (Outside the grid) */}
  <div className="flex items-center justify-between px-1">
    <div className="flex items-center border border-slate-200 rounded-xl px-2 py-1 gap-1 bg-white shadow-sm">
      <button className="p-1.5 !text-slate-400 hover:!text-slate-600 transition-colors !bg-transparent border-0 cursor-pointer">
        <ChevronLeft size={16} />
      </button>
      <span className="text-[11px] font-bold text-slate-700 px-2 uppercase tracking-tight">17 Mar 2026</span>
      <button className="p-1.5 !text-slate-400 hover:!text-slate-600 transition-colors !bg-transparent border-0 cursor-pointer">
        <ChevronRight size={16} />
      </button>
      <div className="w-px h-4 bg-slate-100 mx-1" />
      <button className="p-1.5 !text-slate-400 hover:!text-blue-600 transition-colors !bg-transparent border-0 cursor-pointer">
        <Calendar size={16} />
      </button>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex items-center bg-amber-400/40 px-3 py-1.5 rounded-md gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[11px] font-black text-amber-800 uppercase tracking-tight">
          Pending Approval : <span className="text-amber-600">1</span>
        </span>
      </div>
      <button
      onClick={() => navigate('/attendacereview')}
      className="px-8 py-2.5 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 border border-blue-500 cursor-pointer">
        Review Logs
      </button>
    </div>
  </div>

  {/* 2. STATS GRID: Individual Enterprise Cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
    {stats.map((stat, idx) => (
      <div 
        key={idx} 
        className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group relative overflow-hidden"
      >
        {/* Decorative Watermark Icon (Optional Enterprise Feel) */}
        <div className="absolute -bottom-2 -right-2 text-slate-50 group-hover:text-blue-50 opacity-20 transition-colors">
            {React.cloneElement(stat.icon, { size: 48, strokeWidth: 1 })}
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className={`p-1.5 rounded-lg border ${stat.color === 'rose' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
              {React.cloneElement(stat.icon, { size: 14, strokeWidth: 2.5 })}
            </div>
            <HelpCircle size={12} className="text-slate-200 opacity-0 group-hover:opacity-10 transition-opacity cursor-help" />
          </div>
          
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {stat.value}
            </h3>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* 🚀 4. SEARCH & FILTER TOOLBAR */}
     {/* 🔍 COMPOSITE TOOLBAR: ACTIONS + SEARCH + FILTER */}
<div className="flex items-center gap-4 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
  
  {/* ⬅️ LEFT GROUP: QUICK ACTIONS */}
  <div className="flex items-center">
    {/* Bulk Add Button */}
    <button className="flex items-center gap-2.5 px-4 py-2 !text-slate-700 hover:!bg-slate-50 transition-all rounded-xl border-0 !bg-transparent cursor-pointer group">
      <UserPlus size={14} className="!text-blue-600 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
        Bulk Add Attendance
      </span>
    </button>

    {/* Vertical Divider */}
    <div className="w-px h-5 bg-slate-100 mx-1" />

    {/* Leaves Button */}
    <button
    onClick={() => navigate('/attendenceleaves')}
    className="flex items-center gap-2.5 px-4 py-2 !text-slate-700 hover:!bg-slate-50 transition-all rounded-xl border-0 !bg-transparent cursor-pointer group">
      <Umbrella size={14} className="text-indigo-500 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
        Leaves
      </span>
    </button>
  </div>

  {/* 🔍 MIDDLE: SEARCH (Expands to fill space) */}
  <div className="relative flex-1 group">
    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
    <input 
      type="text" 
      placeholder="Search Staff..." 
      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-400 transition-all placeholder:text-slate-300"
    />
  </div>

  {/* ➡️ RIGHT: FILTER */}
  {/* <button 
    onClick={() => setShowFilter(true)}
    className="flex items-center gap-2 px-6 py-2 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all active:scale-95 cursor-pointer shadow-sm shadow-blue-50"
  >
    <Filter size={13} strokeWidth={3} /> 
    Filter
  </button> */}
  <button 
  onClick={() => setShowFilter(true)}
  className="flex items-center gap-2 px-6 py-2 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all active:scale-95 cursor-pointer shadow-sm shadow-blue-50"
>
  <Filter size={13} strokeWidth={3} /> 
  Filter
</button>
</div>

        {/* 🚀 5. DEPARTMENT LISTING (SALES) */}
        {/* <div className="space-y-4">
           <div className="flex items-center gap-2 ml-1">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Sales</h3>
              <span className="bg-slate-200 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">5</span>
           </div>

           <div className="space-y-2">
             <EmployeeRow name="Dhaval Mehta" id="MUM0878" status="Not Marked" />
             <EmployeeRow name="Hemlata Tandure" id="IN23CD056" status="Not Marked" />
           </div>
        </div> */}
        {/* 🚀 5. DEPARTMENT LISTING (SALES) */}
<div className="space-y-4">
   <div className="flex items-center gap-2 ml-1">
      <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Sales</h3>
      <span className="bg-slate-200 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">5</span>
   </div>

   <div className="space-y-2">
     {/* ⚡ Pass the function as a prop here */}
     <EmployeeRow 
        name="Dhaval Mehta" 
        id="MUM0878" 
        status="Not Marked" 
        onBadgeClick={handleBadgeClick} 
     />
     <EmployeeRow 
        name="Hemlata Tandure" 
        id="IN23CD056" 
        status="Not Marked" 
        onBadgeClick={handleBadgeClick} 
     />
   </div>
</div>
      </div>

      {/* 🚀 FILTER MODAL (IMAGE 2 REPLICA) */}
      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
          {isFineModalOpen && <FineModal staff={activeStaff} onClose={() => setIsFineModalOpen(false)} />}

              {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          {/* Modal Card */}
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-2">
                <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">{activeStaff.name}</h2>
                <span className="text-slate-300">|</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{activeStaff.date}</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 !bg-slate-50 !text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border !border-slate-200 hover:bg-slate-100 transition-all cursor-pointer">
                <Plus size={14} /> Add Shift
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              {/* Adding Label */}
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Adding - <span className="text-blue-600">11 To 8</span></p>
                <Info size={14} className="text-slate-300" />
              </div>

              {/* Shift Name Dropdown */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Shift Name</label>
                <div className="relative group">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer">
                    <option>11 to 8</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>

              {/* Time Pickers Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Time</label>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 group focus-within:border-blue-400 transition-all">
                    <span className="text-[11px] font-bold text-slate-300 uppercase">-- : -- --</span>
                    <Clock size={16} className="text-slate-300 group-focus-within:text-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Time</label>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5">
                    <span className="text-[11px] font-bold text-slate-300 uppercase">-- : -- --</span>
                    <Clock size={16} className="text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Mandatory Alert */}
              {/* <div className="flex items-center gap-2.5 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <AlertCircleIcon />
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Out time is mandatory to mark present</p>
              </div> */}
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button className="flex-1 py-3.5 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm cursor-not-allowed border border-blue-500">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: EMPLOYEE ROW ---
// const EmployeeRow = ({ name, id, status, onBadgeClick }) => (
    
//   <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-6 shadow-sm hover:shadow-md transition-all group">
//     {/* Left side: Info */}
//     <div className="flex-1">
//       <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{name}</h4>
//       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{id}</p>
//       <div className="flex items-center gap-3 mt-3 text-[10px] font-black uppercase tracking-widest">
//          <button className="!text-blue-500 hover:underline border-0 !bg-transparent p-0 cursor-pointer">+ Add Note</button>
//          <span className="text-slate-200">|</span>
//          <button className="!text-slate-400 hover:!text-slate-900 border-0 !bg-transparent p-0 cursor-pointer">Logs</button>
//       </div>
//     </div>

//     {/* Right side: Status Grid (Eye-Catching UI) */}
//     <div className="grid grid-cols-3 gap-2 w-full md:w-[480px]">
//         <StatusBadge label="P" title="Present" color="emerald" onClick={handleBadgeClick} />
//         <StatusBadge label="HD" title="Half Day" color="amber" onClick={handleBadgeClick} />
//         <StatusBadge label="A" title="Absent" color="rose" onClick={handleBadgeClick} />
//         <StatusBadge label="F" title="Fine" color="orange" onClick={handleBadgeClick} />
//         <StatusBadge label="OT" title="Overtime" color="blue" onClick={handleBadgeClick} />
//         <StatusBadge label="L" title="Leave" color="purple" onClick={handleBadgeClick} />
//     </div>

//     <button className="p-2 text-slate-200 group-hover:text-slate-400 border-0 bg-transparent cursor-pointer">
//       <MoreVertical size={16} />
//     </button>
//   </div>
// );

// --- UPDATED SUB-COMPONENT: EMPLOYEE ROW ---
const EmployeeRow = ({ name, id, status, onBadgeClick }) => ( // 👈 Added onBadgeClick here
  <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-6 shadow-sm hover:shadow-md transition-all group text-left">
    <div className="flex-1">
      <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{name}</h4>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{id}</p>
      <div className="flex items-center gap-3 mt-3 text-[10px] font-black uppercase tracking-widest">
         <button className="!text-blue-500 hover:underline border-0 !bg-transparent p-0 cursor-pointer">+ Add Note</button>
         <span className="text-slate-200">|</span>
         <button className="!text-slate-400 hover:!text-slate-900 border-0 !bg-transparent p-0 cursor-pointer">Logs</button>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 w-full md:w-[480px]">
        {/* ⚡ Use the prop here instead of the direct function name */}
        {/* <StatusBadge label="P" title="Present" color="slate" onClick={onBadgeClick} />
        <StatusBadge label="HD" title="Half Day" color="slate" onClick={onBadgeClick} />
        <StatusBadge label="A" title="Absent" color="slate" onClick={onBadgeClick} />

                <StatusBadge label="F" title="Fine" color="slate" onClick={() => onBadgeClick(name, 'F')} highlight />
        <StatusBadge label="OT" title="Overtime" color="slate" onClick={onBadgeClick} />
        <StatusBadge label="L" title="Leave" color="slate" onClick={onBadgeClick} /> */}
        <StatusBadge label="P" title="Present" color="slate" onClick={() => onBadgeClick(name, 'P')} />
        <StatusBadge label="HD" title="Half Day" color="slate" onClick={() => onBadgeClick(name, 'HD')} />
        <StatusBadge label="A" title="Absent" color="slate" onClick={() => onBadgeClick(name, 'A')} />
        <StatusBadge label="F" title="Fine" color="slate" onClick={() => onBadgeClick(name, 'F')} />
        <StatusBadge label="OT" title="Overtime" color="slate" onClick={() => onBadgeClick(name, 'OT')} />
        <StatusBadge label="L" title="Leave" color="slate" onClick={() => onBadgeClick(name, 'L')} />
    </div>

    <button className="p-2 !text-slate-200 group-hover:!text-slate-400 border-0 !bg-transparent cursor-pointer">
      <MoreVertical size={16} />
    </button>
  </div>
);

// --- SUB-COMPONENT: STATUS BADGE ---
// --- HELPER COMPONENTS ---

const StatusBadge = ({ label, title, color, onClick }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white",
    amber: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white",
    rose: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white",
    orange: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600 hover:text-white",
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white",
    purple: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white",
    slate: "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:text-blue-500"
  };

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all duration-300 group active:scale-95 ${colors[color]}`}
    >
      <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/40 font-black text-[10px]">
        {label}
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest opacity-90">{title}</span>
    </div>
  );
};


const FilterModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Filter By');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 🌫️ Backdrop with Enterprise Blur */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* 📦 Modal Card */}
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        
        {/* 📑 TAB HEADER */}
        <div className="flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex gap-8">
            {['Filter By', 'Group By'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 text-[11px] font-black uppercase tracking-widest transition-all relative border-0 !bg-transparent cursor-pointer ${
                  activeTab === tab ? '!text-blue-600' : '!text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-2 !text-slate-300 hover:!text-slate-900 border-0 !bg-transparent cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* フォーム FORM CONTENT */}
        <div className="p-8 space-y-6">
          {activeTab === 'Filter By' ? (
            <>
              {/* Staff Type */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Staff Type</label>
                <div className="relative group">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-400 appearance-none outline-none focus:border-blue-400 cursor-pointer">
                    <option>Select Staff Type</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>

              {/* Shifts */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Shifts</label>
                <div className="relative group">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-400 appearance-none outline-none focus:border-blue-400 cursor-pointer">
                    <option>Select Shift Type</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
                <div className="relative group">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-400 appearance-none outline-none focus:border-blue-400 cursor-pointer">
                    <option>Select a Department</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-300 italic text-[10px] uppercase font-black tracking-widest">
              Grouping settings coming soon
            </div>
          )}
        </div>

        {/* 🏁 FOOTER ACTIONS */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 !bg-white border !border-slate-200 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all cursor-pointer"
          >
            Clear Filter
          </button>
          <button 
            className="flex-1 py-3.5 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 border-0 cursor-pointer"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};


// --- SUB-COMPONENT: FINE MODAL (🔥 THE NEW MODAL) ---
// const FineModal = ({ staff, onClose }) => (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
//     <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
//       <div className="p-6 flex items-center justify-between border-b border-slate-50">
//         <div className="space-y-1">
//           <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-tight">Fine</h2>
//           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{staff.name}</p>
//         </div>
//         <button onClick={onClose} className="p-2 !text-slate-300 hover:!text-slate-900 border-0 !bg-transparent cursor-pointer"><X size={20} /></button>
//       </div>

//       <div className="p-8 space-y-6">
//         <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
//            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">10 To 7</span>
//            <Trash2 size={16} className="text-rose-400 hover:text-rose-600 cursor-pointer" />
//         </div>

//         {/* Dynamic Fine Sections */}
//         {['Late Entry', 'Early Out', 'Excess Breaks'].map((label, i) => (
//           <div key={i} className="pb-6 border-b border-slate-50 last:border-0 relative">
//             <div className="flex justify-between items-center mb-4">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
//               <X size={14} className="text-slate-300 hover:text-slate-600 cursor-pointer" />
//             </div>
            
//             <div className="grid grid-cols-12 gap-4 items-center">
//               <div className="col-span-4 space-y-1">
//                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Actual Hours</span>
//                 <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700">00 : 00 hrs</div>
//               </div>
//               <div className="col-span-4 space-y-1">
//                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Hours</span>
//                 <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-700">00 : 00 hrs</div>
//               </div>
//               <div className="col-span-4 space-y-1">
//                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Fine Amount</span>
//                 <div className="flex items-center gap-2">
//                   <select className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-2 text-[10px] font-bold text-slate-500 outline-none w-full appearance-none">
//                     <option>1x Salary</option>
//                   </select>
//                   <span className="text-[11px] font-black text-slate-700 whitespace-nowrap">₹ 68.1 / HR</span>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase">Amount: <span className="text-slate-800">₹ 0</span></div>
//           </div>
//         ))}
//       </div>

//       <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//         <span className="text-[12px] font-black text-slate-800 uppercase tracking-widest">Total Amount: ₹ 0</span>
//         <button className="px-10 py-3 !bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 border-0 cursor-pointer hover:bg-blue-700 transition-all">Save Fine</button>
//       </div>
//     </div>
//   </div>
// );
// const FineModal = ({ staff, onClose }) => (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     {/* 🌫️ Backdrop */}
//     <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
    
//     {/* 📦 Modal Card */}
//     <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
      
//       {/* 🔝 Tight Header */}
//       <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 bg-white">
//         <div className="space-y-0.5">
//           <h2 className="text-[15px] font-black text-slate-800 uppercase tracking-tight">Fine</h2>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{staff.name}</p>
//         </div>
//         <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 !bg-transparent transition-all"><X size={18} /></button>
//       </div>

//       <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
//         {/* 📋 Shift Indicator Strip */}
//         <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
//            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">10 To 7</span>
//            <Trash2 size={14} className="text-rose-400 hover:text-rose-600 cursor-pointer transition-colors" />
//         </div>

//         {/* ⚡ Fine Sections: Minimum Spacing Applied */}
//         {['Late Entry', 'Early Out', 'Excess Breaks'].map((label, i) => (
//           <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl relative group hover:border-blue-100 transition-all">
//             <div className="flex justify-between items-center mb-3">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
//               <button className="!bg-transparent p-0 border-0"><X size={14} className="text-slate-200 group-hover:text-slate-400 cursor-pointer" /></button>
//             </div>
            
//             <div className="grid grid-cols-3 gap-3">
//               {/* Col 1: Actual Hrs */}
//               <div className="space-y-1">
//                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-1">Actual Hours</span>
//                 <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 whitespace-nowrap">00 : 00 hrs</div>
//               </div>
              
//               {/* Col 2: Hours Input */}
//               <div className="space-y-1 text-center">
//                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">hours</span>
//                 <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-black text-slate-800 ring-offset-2 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-400">00 : 00 hrs</div>
//               </div>

//               {/* Col 3: Fine Rate */}
//               <div className="space-y-1">
//                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-1">Fine Amount</span>
//                 <div className="flex items-center gap-1.5">
//                   <div className="flex-1 relative group/select">
//                     <select className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-2 text-[10px] font-bold text-slate-600 appearance-none outline-none focus:border-blue-400">
//                       <option>1x Salary</option>
//                     </select>
//                     <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
//                   </div>
//                   <span className="text-[10px] font-black text-slate-700 shrink-0">₹ 68.1 <span className="text-slate-300 font-bold ml-0.5">/ HR</span></span>
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Row Amount */}
//             <div className="mt-2.5 flex items-center gap-1">
//               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Amount:</span>
//               <span className="text-[10px] font-black text-slate-800">₹ 0</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🏁 Footer: Includes SMS Checkbox and Apply Button */}
//       <div className="p-5 bg-slate-50/80 border-t border-slate-100 space-y-4">
//         <div className="flex items-center justify-between">
//            <div className="flex flex-col">
//              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Amount</span>
//              <span className="text-[18px] font-black text-slate-900 tracking-tighter">₹ 0</span>
//            </div>

//            {/* 📱 SMS Toggle */}
//            <label className="flex items-center gap-2.5 cursor-pointer group">
//              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 transition-all" defaultChecked />
//              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-slate-900 transition-colors">Send SMS to Staff</span>
//            </label>
//         </div>

//         <button className="w-full py-3.5 !bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all border-0 cursor-pointer">
//           Apply Fine
//         </button>
//       </div>
//     </div>
//   </div>
// );


const FineModal = ({ staff, onClose }) => {
  // 1. Logic: State for each fine category
  // Using strings for hours to allow clearable/placeholder inputs
  const [fines, setFines] = useState({
    'Late Entry': { hours: '', multiplier: 1, rate: 68.1, actual: "01:20" },
    'Early Out': { hours: '', multiplier: 1, rate: 68.1, actual: "00:45" },
    'Excess Breaks': { hours: '', multiplier: 1, rate: 68.1, actual: "00:00" }
  });

  const [sendSMS, setSendSMS] = useState(true);

  // 2. Logic: Handler for input changes
  const handleUpdate = (label, field, value) => {
    setFines(prev => ({
      ...prev,
      [label]: {
        ...prev[label],
        [field]: value
      }
    }));
  };

  // 3. Logic: Calculations
// 🧮 Calculation Logic
const calculateRowAmount = (fine) => {
  const hh = parseFloat(fine.hh) || 0;
  const mm = parseFloat(fine.mm) || 0;
  
  // Convert minutes to decimal (e.g., 30 mins = 0.5 hours)
  const totalDecimalHours = hh + (mm / 60);
  
  // Formula: Hours * Multiplier * Hourly Rate
  const amount = totalDecimalHours * (fine.multiplier || 1) * (fine.rate || 0);
  
  return amount.toFixed(2);
};

const totalAmount = useMemo(() => {
  return Object.values(fines).reduce((acc, curr) => {
    return acc + parseFloat(calculateRowAmount(curr));
  }, 0).toFixed(2);
}, [fines]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        
        {/* 🔝 Tight Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 bg-white">
          <div className="space-y-0.5">
            <h2 className="text-[15px] font-black text-slate-800 uppercase tracking-tight">Fine Calculation</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{staff.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:!bg-slate-50 rounded-lg !text-slate-400 !bg-transparent transition-all"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* 📋 Shift Indicator Strip */}
          <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">Shift: 10 To 7</span>
             <Trash2 size={14} className="text-rose-400 hover:text-rose-600 cursor-pointer transition-colors" />
          </div>

          {/* ⚡ Fine Sections */}
          {Object.entries(fines).map(([label, fine], i) => (
            <div key={label} className="p-4 bg-white border border-slate-100 rounded-2xl relative group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
                <button className="!bg-transparent p-0 border-0"><X size={14} className="text-slate-200 group-hover:text-slate-400 cursor-pointer" /></button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Col 1: Actual Hrs (Static Data) */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-1">Actual Hours</span>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                    {fine.actual} hrs
                  </div>
                </div>
                
                {/* Col 2: Hours Input (Interactive) */}
               <div className="space-y-1">
  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block text-center">
    Fine Hours
  </span>
  
  {/* <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
 
    <div className="relative group">
      <select 
        value={fine.hh || "00"}
        onChange={(e) => handleUpdate(label, 'hh', e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 text-[10px] font-black text-slate-800 outline-none focus:border-blue-400 transition-all appearance-none cursor-pointer text-center"
      >
        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
          <option key={h} value={h}>{h} h</option>
        ))}
      </select>
      <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
    </div>

    
    <div className="relative group">
      <select 
        value={fine.mm || "00"}
        onChange={(e) => handleUpdate(label, 'mm', e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 text-[10px] font-black text-slate-800 outline-none focus:border-blue-400 transition-all appearance-none cursor-pointer text-center"
      >
        {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
          <option key={m} value={m}>{m} m</option>
        ))}
      </select>
      <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
    </div>
  </div> */}

  <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
  <TimeSelector 
    value={fine.hh} 
    suffix="h"
    options={Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))}
    onChange={(val) => handleUpdate(label, 'hh', val)} 
  />
  <TimeSelector 
    value={fine.mm} 
    suffix="m"
    options={Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))}
    onChange={(val) => handleUpdate(label, 'mm', val)} 
  />
</div>
</div>

                {/* Col 3: Fine Rate (Interactive) */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-1">Multiplier</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 relative">
                      <select 
                        value={fine.multiplier}
                        onChange={(e) => handleUpdate(label, 'multiplier', parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-2 text-[10px] font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 cursor-pointer"
                      >
                        <option value={1}>1x Sal</option>
                        <option value={2}>2x Sal</option>
                        <option value={0.5}>0.5x Sal</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                    <div className="text-[10px] font-black text-slate-700 shrink-0">₹ {fine.rate}</div>
                  </div>
                </div>
              </div>

              {/* Individual Amount Display */}
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Calculated Amount:</span>
                  <span className="text-[10px] font-black text-blue-600 font-mono">₹ {calculateRowAmount(fine)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🏁 Footer */}
        <div className="p-5 bg-slate-50/80 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Fine Amount</span>
               <span className="text-[20px] font-black text-slate-900 tracking-tighter">₹ {totalAmount}</span>
             </div>

             {/* 📱 SMS Toggle */}
             <label className="flex items-center gap-2.5 cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={sendSMS}
                 onChange={(e) => setSendSMS(e.target.checked)}
                 className="w-4 h-4 rounded border-slate-300 text-blue-600 mr-1 focus:ring-0 transition-all cursor-pointer" 
               />
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-slate-900 transition-colors">Send SMS Notification</span>
             </label>
          </div>

          <button 
            disabled={totalAmount <= 0}
            className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all border-0 cursor-pointer flex items-center justify-center gap-2 ${
              totalAmount > 0 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98]" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Apply Fine 
            {totalAmount > 0 && <span>(₹ {totalAmount})</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: FILTER MODAL ---
// const FilterModal = ({ onClose }) => (
//   <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end p-0">
//     <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
//     <div className="bg-white w-full max-w-md h-full relative z-10 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
//       <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Filter Reports</h2>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Refine your attendance data</p>
//         </div>
//         <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 transition-all border-0 cursor-pointer"><X size={20}/></button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
//         <FilterGroup label="Attendance Status" options={["All", "Present", "Absent", "Half Day", "Not Marked"]} />
//         <FilterGroup label="Department" options={["All", "Sales", "Management", "Operations"]} />
//         <FilterGroup label="Staff Type" options={["All", "Regular", "Contract", "Field Staff"]} />
//       </div>

//       <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
//         <button className="w-full py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest border-0 cursor-pointer">Reset All</button>
//         <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 border-0 cursor-pointer">Apply Filter</button>
//       </div>
//     </div>
//   </div>
// );

const AlertCircleIcon = () => (
  <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
    <Info size={14} strokeWidth={3} />
  </div>
);

const TimeSelector = ({ value, onChange, options, suffix }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* 🔘 Current Selection Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full !bg-white border !border-slate-200 rounded-lg py-1.5 text-[10px] font-black !text-slate-800 outline-none focus:border-blue-400 transition-all flex items-center justify-center gap-1 group"
      >
        <span>{value || "00"} {suffix}</span>
        <ChevronDown size={10} className={`!text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180 !text-blue-500' : ''}`} />
      </button>

      {/* 📂 Dropdown Menu */}
      {isOpen && (
        <>
          {/* Transparent Backdrop to close when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            {/* 🔥 FIXED HEIGHT: Exactly 250px */}
            <div className="h-[150px] overflow-y-auto custom-scrollbar text-center">
              {options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2.5 text-[10px] font-bold cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${
                    value === opt 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {opt} {suffix}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const FilterGroup = ({ label, options }) => (
  <div className="space-y-3">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => (
        <button key={i} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'}`}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default AttendanceReport;