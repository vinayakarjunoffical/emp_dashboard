import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Layers, Filter, Info, X, ChevronDown, 
  ChevronRight, Search,  Inbox, Eye, ChevronLeft, Download
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 🔥 Base styles
import { useNavigate } from 'react-router-dom';

const LeavesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 1. 📂 Data for Calendar and Table
 const previousLeavesData = [
    { name: "Sandip Satpute", id: "#28171645", type: "Annual Leave", availed: "1 Day", dates: "24 Feb (S1) - 24 Feb (S2)", status: "Approved", created: "24 Feb '26" },
    { name: "Sandip Satpute", id: "#28171645", type: "Comp Off Leave", availed: "1 Day", dates: "10 Feb (S1) - 10 Feb (S2)", status: "Pending", created: "18 Feb '26" },
    { name: "Sandip Satpute", id: "#28171645", type: "Sick Leave", availed: "1 Day", dates: "07 Feb (S1) - 07 Feb (S2)", status: "Approved", created: "15 Feb '26" },
    { name: "Sandesh Rajwade", id: "#30087077", type: "Comp Off Leave", availed: "3 Day", dates: "31 Jan (S1) - 02 Feb (S2)", status: "Approved", created: "30 Jan '26" },
  ];

  // Dummy Leave/Holiday markers for Calendar
  const calendarEvents = {
    "2026-03-03": { label: "Holi", type: "holiday" },
    "2026-03-19": { label: "Gudi Padwa", type: "holiday" },
    "2026-03-18": { label: "Today", type: "today" }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-400 border !border-slate-100 transition-all">
            <ArrowLeft size={18} />
          </button>
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Back</span>
        </div>
      </div>

      <div className="mx-auto px-1 md:px-6 mt-6 space-y-4 ">
        {/* ⚠️ PENDING APPROVAL ALERT */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><Info size={16} /></div>
            <span className="text-[11px] font-bold  text-amber-800 uppercase tracking-tight">1 Leaves Pending Approval</span>
          </div>
          <button className="text-[10px] font-black !text-blue-600 uppercase !bg-transparent tracking-widest hover:underline">View Details</button>
        </div>

        {/* 📑 MAIN CONTENT CARD */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Leave(s)</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">(01 Jan 2026 - 31 Dec 2026)</p>
            </div>
           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
  {/* 📄 Report Button */}
  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 border !border-blue-500 !text-blue-600 rounded-xl text-[9px] sm:text-[10px] font-black uppercase !bg-white tracking-widest hover:!bg-blue-50 transition-all active:scale-95 shadow-sm sm:shadow-none">
    <FileText size={14} strokeWidth={2.5} />
    <span className='flex !whitespace-nowrap'>
      <span className="hidden xs:inline md:flex pr-0.5">Leave Balance</span> Report
    </span>
  </button>

  {/* 💰 Encash Button */}
  <button
  onClick={() => navigate('/encashleaves')}
  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 border border-blue-500 !bg-white !text-blue-500 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
    <Layers size={14} strokeWidth={2.5} />
    <span className='flex !whitespace-nowrap'>
      <span className="hidden xs:inline  md:flex pr-0.5">Bulk</span> Encash Leave
    </span>
  </button>
</div>
          </div>

          {/* TABS */}
          <div className="px-6 border-b border-slate-100 flex gap-8">
            {[{ id: 'upcoming', label: 'Upcoming Leaves' }, { id: 'previous', label: 'Previous Leaves' }, { id: 'calendar', label: 'Leave Calendar' }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 text-[10px] font-black uppercase !bg-transparent tracking-widest transition-all relative ${activeTab === tab.id ? '!text-blue-600' : '!text-slate-400 hover:!text-slate-600'}`}>
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>

          {activeTab === 'calendar' ? (
            /* 📅 TAB 3: CALENDAR VIEW */
             <CalendarView events={calendarEvents} onFilterClick={() => setIsFilterOpen(true)} />
          ) : (
            /* 📋 TAB 1 & 2: TABLE VIEW */
            <>
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
                   List of {activeTab === 'previous' ? 'Previous' : 'Upcoming'} Leave(s)
                 </h3>
                 <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 px-3 py-1.5 !bg-white border !border-slate-200 rounded-lg text-[10px] font-black !text-blue-600 uppercase tracking-widest shadow-sm">
                   <Filter size={12} /> Filter
                 </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30 border-b border-slate-100">
                      {["Staff Name", "Staff ID", "Type", "Leaves Availed", "Leave Dates", "Status", "Created Date", "View"].map(header => (
                        <th key={header} className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activeTab === 'previous' ? (
                      previousLeavesData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 text-[11px] font-bold text-slate-600">{row.name}</td>
                          <td className="px-6 py-4 text-[10px] font-black text-blue-600 tracking-tighter uppercase">{row.id}</td>
                          <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{row.type}</td>
                          <td className="px-6 py-4 text-[10px] font-bold text-slate-500">{row.availed}</td>
                          <td className="px-6 py-4 text-[10px] font-medium text-slate-400">{row.dates}</td>
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full w-fit ${row.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                              <span className="text-[9px] font-black uppercase tracking-widest">{row.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{row.created}</td>
                          <td className="px-6 py-4">
                             <button className="flex items-center gap-1 cursor-pointer !text-blue-600 hover:underline !bg-transparent group">
                               <Eye size={12} className="group-hover:scale-110 transition-transform" /> <span className="text-[9px] font-black uppercase tracking-widest">View</span>
                             </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-20">
                          <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                              <Inbox size={48} className="text-slate-300" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Data Found</p>
                              <p className="text-[9px] font-medium text-slate-300 uppercase">Your leave list is currently empty</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}

       {/* 🎨 MOBILE RESPONSIVE CALENDAR CSS */}
      <style>{`
        .react-calendar { width: 100% !important; border: none !important; font-family: inherit !important; background: transparent !important; }
        .react-calendar__navigation { border-bottom: 1px solid #f1f5f9; padding: 12px; }
        .react-calendar__navigation button { font-weight: 900 !important; text-transform: uppercase !important; font-size: 11px !important; color: #1e293b !important; }
        .react-calendar__month-view__weekdays { background: #f8fafc; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .react-calendar__month-view__weekdays__weekday { text-decoration: none !important; font-size: 9px !important; font-weight: 900 !important; color: #94a3b8 !important; letter-spacing: 0.15em !important; }
        
        /* 📱 Responsive Tile Heights */
        .react-calendar__tile { 
           min-height: 120px !important; 
           border-right: 1px solid #f1f5f9 !important; 
           border-bottom: 1px solid #f1f5f9 !important; 
           display: flex !important; 
           flex-direction: column !important; 
           align-items: flex-start !important; 
           justify-content: flex-start !important; 
           padding: 8px !important; 
        }

        @media (max-width: 640px) {
          .react-calendar__tile { min-height: 80px !important; padding: 4px !important; }
          .react-calendar__tile abbr { font-size: 10px !important; }
          .holiday-label { font-size: 7px !important; padding: 2px !important; }
        }

        .react-calendar__tile:hover { background-color: #f8fafc !important; }
        .react-calendar__tile--now { background: #eff6ff !important; }
        .react-calendar__tile--now abbr { color: #2563eb !important; font-weight: 900 !important; }
        .react-calendar__tile abbr { font-size: 11px; font-weight: 800; color: #64748b; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ---------------------------------------------------------
// 🗓️ CALENDAR VIEW COMPONENT
// ---------------------------------------------------------
// const CalendarView = ({ events, onFilterClick }) => {
//   const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  
//   return (
//     <div className="p-6 space-y-6 animate-in fade-in duration-500">
//       <div className="space-y-1">
//         <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Leave Calendar</h2>
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Track and manage team's approved leaves with shared leave calendar</p>
//       </div>

//       {/* Calendar Controls */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-50 pb-4">
//         <div className="flex items-center gap-3">
//           <div className="relative group min-w-[200px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
//             <input type="text" placeholder="Search by name or staff id" className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:border-blue-500 transition-all" />
//           </div>
//           <button onClick={onFilterClick} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-slate-50 transition-all">
//             <Filter size={14} /> Filter
//           </button>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
//             <button className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-blue-600"><ChevronLeft size={16} /></button>
//             <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-2">March 2026</span>
//             <button className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-blue-600"><ChevronRight size={16} /></button>
//             <button className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 ml-1 border-l border-slate-200 pl-3"><Calendar size={16} /></button>
//           </div>
//           <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
//             <Download size={14} /> Download
//           </button>
//         </div>
//       </div>

//       {/* Calendar Grid */}
//       <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
//         <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
//           {days.map(day => (
//             <div key={day} className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 last:border-r-0">{day}</div>
//           ))}
//         </div>
//         <div className="grid grid-cols-7 bg-white">
//           {[...Array(31)].map((_, i) => {
//             const date = `2026-03-${String(i + 1).padStart(2, '0')}`;
//             const event = events[date];
//             return (
//               <div key={i} className="min-h-[120px] p-2 border-r border-b border-slate-100 group relative hover:bg-slate-50/30 transition-colors">
//                 <span className={`text-[11px] font-black ${event?.type === 'today' ? 'w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md shadow-blue-200' : 'text-slate-400'}`}>
//                   {i + 1}
//                 </span>
                
//                 {event?.type === 'holiday' && (
//                   <div className="mt-2 px-2 py-1.5 bg-amber-50 border border-amber-100 rounded-lg animate-in slide-in-from-left-2 duration-300">
//                     <p className="text-[9px] font-black text-amber-700 uppercase tracking-tight truncate">{event.label}</p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };


const CalendarView = ({ events, onFilterClick }) => {
  const [date, setDate] = useState(new Date());

  // 🔥 Logic: Add custom markers inside the tile
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const event = events[dateStr];

      if (event) {
        return (
          <div className={`mt-2 w-full px-2 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-tight animate-in fade-in slide-in-from-left-2 ${
            event.type === 'holiday' 
            ? 'bg-amber-50 border-amber-100 text-amber-700' 
            : 'bg-blue-50 border-blue-100 text-blue-700'
          }`}>
            {event.label}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Search and Action Bar */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-50 bg-white">
  {/* 🔍 SEARCH & FILTER GROUP */}
  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
    
    {/* Search Input Container */}
    <div className="relative w-full sm:w-64 md:min-w-[280px] group">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" 
        size={14} 
      />
      <input 
        type="text" 
        placeholder="Search by Leave name" 
        className="w-full pl-9 pr-4 py-2.5 md:py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" 
      />
    </div>

    {/* Filter Button */}
    {/* <button 
      onClick={onFilterClick} 
      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 md:py-2 border !border-slate-200 rounded-xl text-[10px] font-black !text-blue-600 uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 !bg-transparent"
    >
      <Filter size={14} strokeWidth={2.5} /> 
      <span>Filter</span>
    </button> */}
  </div>

  {/* 📥 DOWNLOAD ACTION */}
  <button className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 md:py-2.5 !bg-white !text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-100 hover:bg-white border border-blue-500 active:scale-95 transition-all">
    <Download size={14} strokeWidth={2.5} /> 
    <span>Download</span>
  </button>
</div>

      {/* The Calendar Wrapper */}
      <div className="bg-white">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          next2Label={null}
          prev2Label={null}
        formatShortWeekday={(locale, date) => 
  ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][date.getDay()]
}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// 🚪 MODAL COMPONENT (Existing logic kept)
// ---------------------------------------------------------
// const FilterModal = ({ onClose }) => {
//   // Dummy state for chips to show "Active" UI
//   const [selectedCategory, setSelectedCategory] = useState('Annual Leave');
//   const [selectedStatus, setSelectedStatus] = useState('Approved');

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       {/* 🌑 Backdrop: Reduced blur for cleaner look */}
//       <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      
//       {/* 🏛️ Modal Card: Tightened Max Width and Spacing */}
//       <div className="relative bg-white w-full max-w-xl rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         {/* 🔝 Header: Reduced vertical padding (py-4) */}
//         <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
//           <div>
//             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Filter By</h2>
//             <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-0.5" />
//           </div>
//           <button onClick={onClose} className="p-1.5 hover:!bg-slate-50 rounded-xl !text-slate-400 !bg-transparent transition-all active:scale-90">
//             <X size={18} />
//           </button>
//         </div>

//         {/* 📝 Form Body: Optimized gaps (space-y-5) and padding (p-6) */}
//         <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
//           {/* Staff Select */}
//           <div className="space-y-1.5">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Staff Member</label>
//             <div className="relative">
//               <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all">
//                 <option>Select Staff</option>
//                 <option>Sandip Satpute</option>
//                 <option>Hemlata Tandure</option>
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
//             </div>
//           </div>

//           {/* Leave Category Chips */}
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Leave Category</label>
//             <div className="flex flex-wrap gap-1.5">
//               {['Annual Leave', 'Casual Leave', 'Sick Leave'].map((cat) => (
//                 <button 
//                   key={cat} 
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-4 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
//                     selectedCategory === cat 
//                     ? '!bg-white border-blue-600 !text-blue-500 shadow-sm shadow-blue-100' 
//                     : '!bg-white !border-slate-200 !text-slate-500 hover:border-slate-300'
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Leave Status Chips */}
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Leave Status</label>
//             <div className="flex flex-wrap gap-1.5">
//               {['Approved', 'Pending', 'Rejected', 'Expired'].map((status) => (
//                 <button 
//                   key={status} 
//                   onClick={() => setSelectedStatus(status)}
//                   className={`px-4 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
//                     selectedStatus === status 
//                     ? '!bg-white !border-blue-600 !text-blue-500 shadow-sm shadow-blue-100' 
//                     : '!bg-white !border-slate-200 !text-slate-500 hover:!border-slate-300'
//                   }`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Date Range Inputs: More compact Grid */}
//           <div className="grid grid-cols-2 gap-3 pt-1">
//             <div className="space-y-1.5">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Created Date</label>
//               <div className="relative">
//                 <input type="text" placeholder="DD-MM-YYYY" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
//                 <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//               </div>
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Application Date</label>
//               <div className="relative">
//                 <input type="text" placeholder="DD-MM-YYYY" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
//                 <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🛠️ Footer Actions: Compact vertical padding (p-5) */}
//         <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
//           <button 
//             onClick={onClose} 
//             className="flex-1 py-3 border !border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest !text-slate-400 !bg-white hover:!text-slate-600 hover:!border-slate-300 transition-all active:scale-95"
//           >
//             Clear
//           </button>
//           <button 
//             onClick={onClose} 
//             className="flex-1 py-3 !bg-white rounded-lg text-[10px] font-black border border-blue-500 uppercase tracking-widest !text-blue-500 shadow-sm shadow-blue-100 hover:bg-white transition-all active:scale-95"
//           >
//             Apply Filter
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// 🚪 UPDATED FILTER MODAL COMPONENT
const FilterModal = ({ onClose }) => {
  // Dummy state for chips to show "Active" UI
  const [selectedCategory, setSelectedCategory] = useState('Annual Leave');
  const [selectedStatus, setSelectedStatus] = useState('Approved');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 🌑 Backdrop: Reduced blur for cleaner look */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      
      {/* 🏛️ Modal Card: Tightened Max Width and Spacing */}
      <div className="relative bg-white w-full max-w-xl rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* 🔝 Header: Reduced vertical padding (py-4) */}
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Filter By</h2>
            <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-0.5" />
          </div>
          <button onClick={onClose} className="p-1.5 hover:!bg-slate-50 rounded-xl !text-slate-400 !bg-transparent transition-all active:scale-90">
            <X size={18} />
          </button>
        </div>

        {/* 📝 Form Body: Optimized gaps (space-y-5) and padding (p-6) */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
          {/* Staff Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Staff Member</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all">
                <option>Select Staff</option>
                <option>Sandip Satpute</option>
                <option>Hemlata Tandure</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Leave Category Chips */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Leave Category</label>
            <div className="flex flex-wrap gap-1.5">
              {['Annual Leave', 'Casual Leave', 'Sick Leave'].map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
                    selectedCategory === cat 
                    ? '!bg-white border-blue-600 !text-blue-500 shadow-sm shadow-blue-100' 
                    : '!bg-white !border-slate-200 !text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Leave Status Chips */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Leave Status</label>
            <div className="flex flex-wrap gap-1.5">
              {['Approved', 'Pending', 'Rejected', 'Expired'].map((status) => (
                <button 
                  key={status} 
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
                    selectedStatus === status 
                    ? '!bg-white !border-blue-600 !text-blue-500 shadow-sm shadow-blue-100' 
                    : '!bg-white !border-slate-200 !text-slate-500 hover:!border-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Inputs: More compact Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
  {/* 📅 Created Date */}
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
      Created Date
    </label>
    <div className="relative group">
      <input 
        type="date" 
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer" 
      />
      {/* Lucide Icon Overlay - pointer-events-none ensures you click the input underneath */}
     
    </div>
  </div>

  {/* 📅 Application Date */}
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
      Application Date
    </label>
    <div className="relative group">
      <input 
        type="date" 
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer" 
      />
      
    </div>
  </div>

  {/* 🎨 CSS to hide the native browser icon but keep functionality */}
  <style>{`
    input[type="date"]::-webkit-calendar-picker-indicator {
      background: transparent;
      bottom: 0;
      color: transparent;
      cursor: pointer;
      height: auto;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: auto;
    }
  `}</style>
</div>
        </div>

        {/* 🛠️ Footer Actions: Compact vertical padding (p-5) */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 border !border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest !text-slate-400 !bg-white hover:!text-slate-600 hover:!border-slate-300 transition-all active:scale-95"
          >
            Clear
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 py-3 !bg-white rounded-lg text-[10px] font-black border border-blue-500 uppercase tracking-widest !text-blue-500 shadow-sm shadow-blue-100 hover:bg-white transition-all active:scale-95"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeavesPage;
//************************************************************************************************ */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, FileText, Layers, Filter, Info,X,ChevronDown, 
//   ChevronRight, Search, Calendar, Inbox, Eye 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const LeavesPage = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('upcoming');
//    const [isFilterOpen, setIsFilterOpen] = useState(false);

//   // 1. 📂 Dummy Data for "Previous Leaves" tab
//   const previousLeavesData = [
//     { name: "Sandip Satpute", id: "#28171645", type: "Annual Leave", availed: "1 Day", dates: "24 Feb (S1) - 24 Feb (S2)", status: "Approved", created: "24 Feb '26" },
//     { name: "Sandip Satpute", id: "#28171645", type: "Comp Off Leave", availed: "1 Day", dates: "10 Feb (S1) - 10 Feb (S2)", status: "Pending", created: "18 Feb '26" },
//     { name: "Sandip Satpute", id: "#28171645", type: "Sick Leave", availed: "1 Day", dates: "07 Feb (S1) - 07 Feb (S2)", status: "Approved", created: "15 Feb '26" },
//     { name: "Sandesh Rajwade", id: "#30087077", type: "Comp Off Leave", availed: "3 Day", dates: "31 Jan (S1) - 02 Feb (S2)", status: "Approved", created: "30 Jan '26" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans pb-10">
//       {/* 🚀 STICKY HEADER (Existing Code) */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-400 border !border-slate-100 transition-all">
//             <ArrowLeft size={18} />
//           </button>
//           <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Back</span>
//         </div>
//       </div>

//       <div className="mx-auto px-6 mt-6  space-y-4">
//         {/* ⚠️ PENDING APPROVAL ALERT (Existing Code) */}
//         <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><Info size={16} /></div>
//             <span className="text-[11px] font-bold text-amber-800 uppercase tracking-tight">1 Leaves Pending Approval</span>
//           </div>
//           <button className="text-[10px] font-black !text-blue-600 uppercase !bg-transparent tracking-widest hover:underline">View Details</button>
//         </div>

//         {/* 📑 MAIN CONTENT CARD */}
//         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
//           <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="space-y-1">
//               <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Leave(s)</h1>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">(01 Jan 2026 - 31 Dec 2026)</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="flex items-center gap-2 px-4 py-2 border !border-blue-500 !text-blue-600 rounded-xl text-[10px] font-black uppercase !bg-transparent tracking-widest hover:!bg-blue-50 transition-all">
//                 <FileText size={14} /> Leave Balance Report
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 border border-blue-500 !bg-transparent !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-100 hover:!bg-white transition-all">
//                 <Layers size={14} /> Bulk Encash Leave
//               </button>
//             </div>
//           </div>

//           <div className="px-6 border-b border-slate-100 flex gap-8">
//             {[{ id: 'upcoming', label: 'Upcoming Leaves' }, { id: 'previous', label: 'Previous Leaves' }, { id: 'calendar', label: 'Leave Calendar' }].map((tab) => (
//               <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 text-[10px] font-black uppercase !bg-transparent tracking-widest transition-all relative ${activeTab === tab.id ? '!text-blue-600' : '!text-slate-400 hover:!text-slate-600'}`}>
//                 {tab.label}
//                 {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
//               </button>
//             ))}
//           </div>

//           <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
//              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
//                List of {activeTab === 'previous' ? 'Previous' : 'Upcoming'} Leave(s)
//              </h3>
//              <button 
//                onClick={() => setIsFilterOpen(true)}
//              className="flex items-center gap-2 px-3 py-1.5 !bg-white border !border-slate-200 rounded-lg text-[10px] font-black !text-blue-600 uppercase tracking-widest shadow-sm">
//                <Filter size={12} /> Filter
//              </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/30 border-b border-slate-100">
//                   {["Staff Name", "Staff ID", "Type", "Leaves Availed", "Leave Dates", "Status", "Created Date", "View"].map(header => (
//                     <th key={header} className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{header}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {activeTab === 'previous' ? (
//                   // ✅ Tab 2: Show Previous Data
//                   previousLeavesData.map((row, idx) => (
//                     <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
//                       <td className="px-6 py-4 text-[11px] font-bold text-slate-600">{row.name}</td>
//                       <td className="px-6 py-4 text-[10px] font-black text-blue-600 tracking-tighter uppercase">{row.id}</td>
//                       <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{row.type}</td>
//                       <td className="px-6 py-4 text-[10px] font-bold text-slate-500">{row.availed}</td>
//                       <td className="px-6 py-4 text-[10px] font-medium text-slate-400">{row.dates}</td>
//                       <td className="px-6 py-4">
//                         <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full w-fit ${row.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
//                           <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
//                           <span className="text-[9px] font-black uppercase tracking-widest">{row.status}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{row.created}</td>
//                       <td className="px-6 py-4">
//                          <button className="flex items-center gap-1 cursor-pointer !text-blue-600 hover:underline !bg-transparent">
//                            <Eye size={12} /> <span className="text-[9px] font-black uppercase tracking-widest">View</span>
//                          </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   // ✅ Tab 1: Show Empty State (Existing)
//                   <tr>
//                     <td colSpan="8" className="py-20">
//                       <div className="flex flex-col items-center justify-center text-center space-y-4">
//                         <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//                           <Inbox size={48} className="text-slate-300" strokeWidth={1.5} />
//                         </div>
//                         <div className="space-y-1">
//                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Data Found</p>
//                           <p className="text-[9px] font-medium text-slate-300 uppercase">Your leave list is currently empty</p>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>


//           </div>
//         </div>
//       </div>

//         {/* 🛡️ FILTER MODAL COMPONENT */}
//       {isFilterOpen && (
//         <FilterModal onClose={() => setIsFilterOpen(false)} />
//       )}
//     </div>
//   );
// };

// // 🚪 MODAL COMPONENT
// const FilterModal = ({ onClose }) => {
//   // Dummy state for chips to show "Active" UI
//   const [selectedCategory, setSelectedCategory] = useState('Annual Leave');
//   const [selectedStatus, setSelectedStatus] = useState('Approved');

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       {/* 🌑 Backdrop: Reduced blur for cleaner look */}
//       <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      
//       {/* 🏛️ Modal Card: Tightened Max Width and Spacing */}
//       <div className="relative bg-white w-full max-w-xl rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         {/* 🔝 Header: Reduced vertical padding (py-4) */}
//         <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
//           <div>
//             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Filter By</h2>
//             <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-0.5" />
//           </div>
//           <button onClick={onClose} className="p-1.5 hover:!bg-slate-50 rounded-xl !text-slate-400 !bg-transparent transition-all active:scale-90">
//             <X size={18} />
//           </button>
//         </div>

//         {/* 📝 Form Body: Optimized gaps (space-y-5) and padding (p-6) */}
//         <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
//           {/* Staff Select */}
//           <div className="space-y-1.5">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Staff Member</label>
//             <div className="relative">
//               <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all">
//                 <option>Select Staff</option>
//                 <option>Sandip Satpute</option>
//                 <option>Hemlata Tandure</option>
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
//             </div>
//           </div>

//           {/* Leave Category Chips */}
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Leave Category</label>
//             <div className="flex flex-wrap gap-1.5">
//               {['Annual Leave', 'Casual Leave', 'Sick Leave'].map((cat) => (
//                 <button 
//                   key={cat} 
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-4 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
//                     selectedCategory === cat 
//                     ? '!bg-white border-blue-600 !text-blue-500 shadow-sm shadow-blue-100' 
//                     : '!bg-white !border-slate-200 !text-slate-500 hover:border-slate-300'
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Leave Status Chips */}
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Leave Status</label>
//             <div className="flex flex-wrap gap-1.5">
//               {['Approved', 'Pending', 'Rejected', 'Expired'].map((status) => (
//                 <button 
//                   key={status} 
//                   onClick={() => setSelectedStatus(status)}
//                   className={`px-4 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
//                     selectedStatus === status 
//                     ? '!bg-white !border-blue-600 !text-blue-500 shadow-sm shadow-blue-100' 
//                     : '!bg-white !border-slate-200 !text-slate-500 hover:!border-slate-300'
//                   }`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Date Range Inputs: More compact Grid */}
//           <div className="grid grid-cols-2 gap-3 pt-1">
//             <div className="space-y-1.5">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Created Date</label>
//               <div className="relative">
//                 <input type="text" placeholder="DD-MM-YYYY" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
//                 <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//               </div>
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Application Date</label>
//               <div className="relative">
//                 <input type="text" placeholder="DD-MM-YYYY" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
//                 <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🛠️ Footer Actions: Compact vertical padding (p-5) */}
//         <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
//           <button 
//             onClick={onClose} 
//             className="flex-1 py-3 border !border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest !text-slate-400 !bg-white hover:!text-slate-600 hover:!border-slate-300 transition-all active:scale-95"
//           >
//             Clear
//           </button>
//           <button 
//             onClick={onClose} 
//             className="flex-1 py-3 !bg-white rounded-lg text-[10px] font-black border border-blue-500 uppercase tracking-widest !text-blue-500 shadow-sm shadow-blue-100 hover:bg-white transition-all active:scale-95"
//           >
//             Apply Filter
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeavesPage;
//****************************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   FileText, 
//   Layers, 
//   Filter, 
//   Info, 
//   ChevronRight, 
//   Search, 
//   Calendar,
//   Inbox
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const LeavesPage = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('upcoming');

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans pb-10">
//       {/* 🚀 STICKY HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => navigate(-1)} 
//             className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-400 border !border-slate-100 transition-all"
//           >
//             <ArrowLeft size={18} />
//           </button>
//           <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Back</span>
//         </div>
//       </div>

//       <div className="mx-auto px-6 mt-6 max-w-[1600px] space-y-4">
        
//         {/* ⚠️ PENDING APPROVAL ALERT */}
//         <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
//               <Info size={16} />
//             </div>
//             <span className="text-[11px] font-bold text-amber-800 uppercase tracking-tight">
//               1 Leaves Pending Approval
//             </span>
//           </div>
//           <button className="text-[10px] font-black !text-blue-600 uppercase !bg-transparent tracking-widest hover:underline">
//             View Details
//           </button>
//         </div>

//         {/* 📑 MAIN CONTENT CARD */}
//         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          
//           {/* Header Strip */}
//           <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="space-y-1">
//               <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Leave(s)</h1>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                 (01 Jan 2026 - 31 Dec 2026)
//               </p>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <button className="flex items-center gap-2 px-4 py-2 border !border-blue-500 !text-blue-600 rounded-xl text-[10px] font-black uppercase !bg-transparent tracking-widest hover:!bg-blue-50 transition-all">
//                 <FileText size={14} /> Leave Balance Report
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 border border-blue-500 !bg-transparent !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-100 hover:!bg-white transition-all">
//                 <Layers size={14} /> Bulk Encash Leave
//               </button>
//             </div>
//           </div>

//           {/* 🔘 TAB NAVIGATION */}
//           <div className="px-6 border-b border-slate-100 flex gap-8">
//             {[
//               { id: 'upcoming', label: 'Upcoming Leaves' },
//               { id: 'previous', label: 'Previous Leaves' },
//               { id: 'calendar', label: 'Leave Calendar' }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`py-4 text-[10px] font-black uppercase !bg-transparent tracking-widest transition-all relative ${
//                   activeTab === tab.id ? '!text-blue-600' : '!text-slate-400 hover:!text-slate-600'
//                 }`}
//               >
//                 {tab.label}
//                 {activeTab === tab.id && (
//                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* 🔍 TABLE CONTROLS */}
//           <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
//              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">List of Upcoming Leave(s)</h3>
//              <button className="flex items-center gap-2 px-3 py-1.5 !bg-white border !border-slate-200 rounded-lg text-[10px] font-black !text-blue-600 uppercase tracking-widest shadow-sm">
//                <Filter size={12} /> Filter
//              </button>
//           </div>

//           {/* 📊 DATA TABLE */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/30 border-b border-slate-100">
//                   <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Staff Name</th>
//                   <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Staff ID</th>
//                   <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Type</th>
//                   <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Leaves Availed</th>
//                   <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Leave Dates</th>
//                   <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
//                   <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Created Date</th>
//                   <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">View</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* 📦 EMPTY STATE */}
//                 <tr>
//                   <td colSpan="8" className="py-20">
//                     <div className="flex flex-col items-center justify-center text-center space-y-4">
//                       <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//                         <Inbox size={48} className="text-slate-300" strokeWidth={1.5} />
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Data Found</p>
//                         <p className="text-[9px] font-medium text-slate-300 uppercase">Your leave list is currently empty</p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// };

// export default LeavesPage;