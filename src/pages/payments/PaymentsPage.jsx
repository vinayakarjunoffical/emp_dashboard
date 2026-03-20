import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  X,
  Calendar,
  ChevronDown, 
  ChevronLeft, 
  CalendarDays,
  ChevronRight,
  MessageCircle,
  PackageOpen // 🟢 Added for the empty state
} from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentsPage = () => {
  const [activeSubTab, setActiveSubTab] = useState("Payment Logs");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState(["Sales"]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date());

  // Helper to format date for the input field
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
  };

  const departments = [
    "Unassigned", "Escalation Team", "Finance", 
    "Hr & Admin", "Information Technology", "Sales"
  ];

  const paymentLogs = [
    { name: "Chetan Naik", id: "#MUNGE73", date: "18 Nov '25", cycle: "Nov, 2025", dept: "IT", type: "Saved Offline" },
    { name: "Deepali Kadam", id: "#MUNGE63", date: "18 Nov '25", cycle: "Nov, 2025", dept: "IT", type: "Saved Offline" },
    { name: "Amisha Mundhe", id: "#MUNGE43", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
    { name: "Darshana Sawant", id: "#MUNGE51", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
    { name: "Dhaval Mehta", id: "#MUNGE78", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
    { name: "Divya Rane", id: "#MUNGE79", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
    { name: "Hemlata Tandure", id: "#IN27CD052", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
    { name: "Imran Shaikh", id: "#MUNGE70", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
    { name: "Manisha Kokare", id: "#MUNGE74", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-2 animate-in fade-in duration-500">
      
      <div className="mb-6 text-left">
        <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Payments</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg py-2 shadow-sm overflow-hidden flex flex-col">
        
        {/* 🛠️ TAB NAVIGATION */}
        <div className="px-6 border-b border-slate-100 flex gap-8 bg-white">
          {["Payment Logs", "Payment Settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative !bg-transparent border-0 cursor-pointer ${
                activeSubTab === tab ? "!text-blue-600" : "!text-slate-400 hover:!text-slate-600"
              }`}
            >
              {tab}
              {activeSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>

        {/* 🔍 ACTION BAR */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all" 
              />
            </div>
            <button 
              onClick={() => setShowFilterSidebar(true)}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black !text-blue-600 uppercase tracking-widest hover:bg-slate-50 transition-all !bg-transparent cursor-pointer"
            >
              <Filter size={14} strokeWidth={2.5} /> 
              <span>Filter</span>
            </button>
          </div>

          <button className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border-blue-500 shadow-blue-100 hover:!bg-white active:scale-95 transition-all border outline-none">
            <Plus size={14} strokeWidth={3} /> Add Payment
          </button>
        </div>

        {/* 📋 DYNAMIC CONTENT AREA */}
        {activeSubTab === "Payment Logs" ? (
          <>
            {/* 📋 FIXED DATA TABLE */}
            <div className="w-full text-left overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-50/50 border-y border-slate-100">
                    <th className={`${thStyle} w-[14%] whitespace-normal`}>Name</th>
                    <th className={`${thStyle} w-[10%]`}>Staff ID</th>
                    <th className={`${thStyle} w-[11%]`}>Pay Date</th>
                    <th className={`${thStyle} w-[11%]`}>Pay Cycle</th>
                    <th className={`${thStyle} w-[10%]`}>Dept</th>
                    <th className={`${thStyle} w-[11%] leading-tight`}>Virtual A/C</th>
                    <th className={`${thStyle} w-[11%] leading-tight`}>Dest. Bank A/C</th>
                    <th className={`${thStyle} w-[11%] leading-tight`}>Transact ID</th>
                    <th className={`${thStyle} w-[11%]`}>Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paymentLogs.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-3 py-4 text-[10px] font-bold text-slate-700 truncate">{row.name}</td>
                      <td className="px-3 py-4 text-[10px] font-black text-blue-600 uppercase tracking-tighter truncate">{row.id}</td>
                      <td className="px-3 py-4 text-[9px] font-bold text-slate-500 uppercase">{row.date}</td>
                      <td className="px-3 py-4 text-[9px] font-bold text-slate-500 uppercase">{row.cycle}</td>
                      <td className="px-3 py-4 text-[9px] font-medium text-slate-400 uppercase truncate">{row.dept}</td>
                      <td className="px-3 py-4 text-[9px] font-medium text-slate-300">-</td>
                      <td className="px-3 py-4 text-[9px] font-medium text-slate-300">-</td>
                      <td className="px-3 py-4 text-[9px] font-medium text-slate-300">-</td>
                      <td className="px-3 py-4 text-[9px] font-bold text-slate-500 uppercase truncate">{row.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔢 PAGINATION FOOTER */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows</span>
                <div className="relative">
                  <select className="bg-slate-50 border border-slate-200 pl-2 pr-6 py-1 text-[10px] font-bold text-slate-600 rounded-lg appearance-none outline-none">
                    <option>10</option>
                    <option>25</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <PaginationBtn icon={<ChevronLeft size={14} />} disabled />
                {[1, 2, 3, "...", 39].map((page, i) => (
                  <button 
                    key={i} 
                    className={`w-6 h-6 rounded-lg text-[9px] font-black transition-all border-0 outline-none cursor-pointer ${
                      page === 1 ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-transparent text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <PaginationBtn icon={<ChevronRight size={14} />} />
              </div>
            </div>
          </>
        ) : (
          /* 📦 PAYMENT SETTINGS EMPTY STATE (Requested addition) */
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-16 h-16 bg-[#e6f4f1] rounded-2xl flex items-center justify-center mb-4 border border-[#cce8e2] relative shadow-sm">
              <PackageOpen size={28} className="text-[#00a884]" strokeWidth={1.5} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00a884] text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-black border-2 border-white">
                ?
              </div>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No Settings Found</p>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Payment node configuration is currently empty</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all border-0 active:scale-95">
          <MessageCircle size={22} fill="white" />
        </button>
      </div>

      {/* 🔍 PAYMENT FILTER SIDEBAR */}
      {showFilterSidebar && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
            onClick={() => setShowFilterSidebar(false)} 
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Filter</h2>
              <button 
                onClick={() => setShowFilterSidebar(false)} 
                className="p-1.5 !bg-transparent !text-slate-400 hover:!text-slate-600 border-0 cursor-pointer transition-all"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar text-left">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Payment Cycles</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 rounded-xl appearance-none outline-none focus:border-blue-600 transition-all cursor-pointer">
                    <option>Select payment cycles</option>
                    <option>Nov, 2025</option>
                    <option>Oct, 2025</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* <div className={`space-y-1.5 relative ${showDatePicker ? 'z-[110]' : 'z-10'} text-left`}>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Payment Date</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`w-full border px-4 py-3 text-xs font-bold rounded-xl flex items-center justify-between transition-all outline-none ${
                      showDatePicker 
                        ? "bg-white border-blue-600 ring-4 ring-blue-500/5 text-blue-600 shadow-sm" 
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>{formatDate(paymentDate)}</span>
                    <CalendarDays size={14} className={showDatePicker ? "text-blue-600" : "text-slate-400"} />
                  </button>
                  {showDatePicker && (
                    <>
                      <div className="fixed inset-0 z-[100]" onClick={() => setShowDatePicker(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] z-[110] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-2">
                          <p className="text-[10px] text-center font-black uppercase text-slate-400 py-2">Select Date</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div> */}
              {/* Payment Date Range */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Date</label>
          <div className="relative group">
            <input 
              type="date" 
              placeholder="Select date range" 
              className="w-full bg-slate-50 border border-slate-200 pl-4 pr-10 py-3 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer" 
            />
           
          </div>
        </div>

              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => {
                    const isSelected = selectedDepts.includes(dept);
                    return (
                      <button
                        key={dept}
                        onClick={() => {
                          setSelectedDepts(prev => 
                            isSelected ? prev.filter(d => d !== dept) : [...prev, dept]
                          );
                        }}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                          isSelected 
                          ? "!bg-blue-50 !border-blue-600 !text-blue-600 shadow-sm" 
                          : "!bg-white !border-slate-200 !text-slate-500 hover:!border-slate-300"
                        }`}
                      >
                        {dept}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setSelectedDepts([])}
                className="flex-1 py-3 !bg-white border !border-slate-200 !text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 outline-none cursor-pointer"
              >
                Clear All
              </button>
              <button 
                onClick={() => {
                  toast.success("Filters applied to registry node");
                  setShowFilterSidebar(false);
                }}
                className="flex-1 py-3 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-500/20 hover:!bg-white active:scale-95 transition-all border border-blue-500 outline-none cursor-pointer"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = "px-3 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest align-top";

const PaginationBtn = ({ icon, disabled }) => (
  <button className={`p-1 rounded-lg border border-slate-100 !bg-white transition-all ${disabled ? "opacity-30 cursor-not-allowed" : "text-slate-400 hover:text-blue-600"}`}>
    {icon}
  </button>
);

export default PaymentsPage;
//**************************************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Plus, 
//   X,
//   Calendar,
//   ChevronDown, 
//   ChevronLeft, 
//   ChevronRight,
//   MessageCircle
// } from 'lucide-react';

// const PaymentsPage = () => {
//   const [activeSubTab, setActiveSubTab] = useState("Payment Logs");
//   const [showFilterSidebar, setShowFilterSidebar] = useState(false);
// const [selectedDepts, setSelectedDepts] = useState(["Sales"]);
// const [showDatePicker, setShowDatePicker] = useState(false);
// const [paymentDate, setPaymentDate] = useState(new Date());

// // Helper to format date for the input field
// const formatDate = (date) => {
//   return date.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   }).replace(/ /g, ' ');
// };

// const departments = [
//   "Unassigned", "Escalation Team", "Finance", 
//   "Hr & Admin", "Information Technology", "Sales"
// ];

//   const paymentLogs = [
//     { name: "Chetan Naik", id: "#MUNGE73", date: "18 Nov '25", cycle: "Nov, 2025", dept: "IT", type: "Saved Offline" },
//     { name: "Deepali Kadam", id: "#MUNGE63", date: "18 Nov '25", cycle: "Nov, 2025", dept: "IT", type: "Saved Offline" },
//     { name: "Amisha Mundhe", id: "#MUNGE43", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
//     { name: "Darshana Sawant", id: "#MUNGE51", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
//     { name: "Dhaval Mehta", id: "#MUNGE78", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
//     { name: "Divya Rane", id: "#MUNGE79", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
//     { name: "Hemlata Tandure", id: "#IN27CD052", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
//     { name: "Imran Shaikh", id: "#MUNGE70", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
//     { name: "Manisha Kokare", id: "#MUNGE74", date: "18 Nov '25", cycle: "Nov, 2025", dept: "Sales", type: "Saved Offline" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 animate-in fade-in duration-500">
      
//       <div className="mb-6 text-left">
//         <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Payments</h1>
//       </div>

//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
//         {/* 🛠️ TAB NAVIGATION */}
//         <div className="px-6 border-b border-slate-100 flex gap-8 bg-white">
//           {["Payment Logs", "Payment Settings"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveSubTab(tab)}
//               className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative !bg-transparent border-0 cursor-pointer ${
//                 activeSubTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
//               }`}
//             >
//               {tab}
//               {activeSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
//             </button>
//           ))}
//         </div>

//         {/* 🔍 ACTION BAR */}
//         <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
//           <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
//             <div className="relative w-full sm:w-64 group text-left">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
//               <input 
//                 type="text" 
//                 placeholder="Search..." 
//                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all" 
//               />
//             </div>
//             <button 
//             onClick={() => setShowFilterSidebar(true)}
//             className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black !text-blue-600 uppercase tracking-widest hover:bg-slate-50 transition-all !bg-transparent">
//               <Filter size={14} strokeWidth={2.5} /> 
//               <span>Filter</span>
//             </button>
//           </div>

//           <button className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all border-0 outline-none">
//             <Plus size={14} strokeWidth={3} /> Add Payment
//           </button>
//         </div>

//         {/* 📋 FIXED DATA TABLE (NO SCROLL) */}
//         <div className="w-full text-left overflow-hidden">
//           <table className="w-full text-left border-collapse table-fixed">
//             <thead>
//               <tr className="bg-slate-50/50 border-y border-slate-100">
//                 <th className={`${thStyle} w-[14%] whitespace-normal`}>Name</th>
//                 <th className={`${thStyle} w-[10%]`}>Staff ID</th>
//                 <th className={`${thStyle} w-[11%]`}>Pay Date</th>
//                 <th className={`${thStyle} w-[11%]`}>Pay Cycle</th>
//                 <th className={`${thStyle} w-[10%]`}>Dept</th>
//                 <th className={`${thStyle} w-[11%] leading-tight`}>Virtual A/C</th>
//                 <th className={`${thStyle} w-[11%] leading-tight`}>Dest. Bank A/C</th>
//                 <th className={`${thStyle} w-[11%] leading-tight`}>Transact ID</th>
//                 <th className={`${thStyle} w-[11%]`}>Type</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paymentLogs.map((row, idx) => (
//                 <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
//                   <td className="px-3 py-4 text-[10px] font-bold text-slate-700 truncate">{row.name}</td>
//                   <td className="px-3 py-4 text-[10px] font-black text-blue-600 uppercase tracking-tighter truncate">{row.id}</td>
//                   <td className="px-3 py-4 text-[9px] font-bold text-slate-500 uppercase">{row.date}</td>
//                   <td className="px-3 py-4 text-[9px] font-bold text-slate-500 uppercase">{row.cycle}</td>
//                   <td className="px-3 py-4 text-[9px] font-medium text-slate-400 uppercase truncate">{row.dept}</td>
//                   <td className="px-3 py-4 text-[9px] font-medium text-slate-300">-</td>
//                   <td className="px-3 py-4 text-[9px] font-medium text-slate-300">-</td>
//                   <td className="px-3 py-4 text-[9px] font-medium text-slate-300">-</td>
//                   <td className="px-3 py-4 text-[9px] font-bold text-slate-500 uppercase truncate">{row.type}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 🔢 PAGINATION FOOTER */}
//         <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
//           <div className="flex items-center gap-3">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows</span>
//             <div className="relative">
//               <select className="bg-slate-50 border border-slate-200 pl-2 pr-6 py-1 text-[10px] font-bold text-slate-600 rounded-lg appearance-none outline-none">
//                 <option>10</option>
//                 <option>25</option>
//               </select>
//               <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//             </div>
//           </div>

//           <div className="flex items-center gap-1">
//             <PaginationBtn icon={<ChevronLeft size={14} />} disabled />
//             {[1, 2, 3, "...", 39].map((page, i) => (
//               <button 
//                 key={i} 
//                 className={`w-6 h-6 rounded-lg text-[9px] font-black transition-all border-0 outline-none cursor-pointer ${
//                   page === 1 ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-transparent text-slate-400 hover:bg-slate-50"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <PaginationBtn icon={<ChevronRight size={14} />} />
//           </div>
//         </div>
//       </div>

//       <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
//         <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all border-0 active:scale-95">
//           <MessageCircle size={22} fill="white" />
//         </button>
//       </div>

//       {/* 🔍 PAYMENT FILTER SIDEBAR (Matches image_8ac6e4.jpg) */}
// {showFilterSidebar && (
//   <div className="fixed inset-0 z-[100] flex justify-end">
//     {/* Backdrop */}
//     <div 
//       className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
//       onClick={() => setShowFilterSidebar(false)} 
//     />
    
//     {/* Sidebar Panel */}
//     <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
      
//       {/* Header */}
//       <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
//         <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Filter</h2>
//         <button 
//           onClick={() => setShowFilterSidebar(false)} 
//           className="p-1.5 !bg-transparent !text-slate-400 hover:!text-slate-600 border-0 cursor-pointer transition-all"
//         >
//           <X size={20} strokeWidth={2.5} />
//         </button>
//       </div>

//       {/* Form Body */}
//       <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar text-left">
        
//         {/* Payment Cycles Dropdown */}
//         <div className="space-y-2">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Payment Cycles</label>
//           <div className="relative">
//             <select className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 rounded-xl appearance-none outline-none focus:border-blue-600 transition-all cursor-pointer">
//               <option>Select payment cycles</option>
//               <option>Nov, 2025</option>
//               <option>Oct, 2025</option>
//             </select>
//             <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//           </div>
//         </div>

//         {/* Payment Date Range */}
//         <div className="space-y-2">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Date</label>
//           <div className="relative group">
//             <input 
//               type="date" 
//               placeholder="Select date range" 
//               className="w-full bg-slate-50 border border-slate-200 pl-4 pr-10 py-3 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer" 
//             />
           
//           </div>
//         </div>

//         {/* Department Chips */}
//         <div className="space-y-3">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
//           <div className="flex flex-wrap gap-2">
//             {departments.map((dept) => {
//               const isSelected = selectedDepts.includes(dept);
//               return (
//                 <button
//                   key={dept}
//                   onClick={() => {
//                     setSelectedDepts(prev => 
//                       isSelected ? prev.filter(d => d !== dept) : [...prev, dept]
//                     );
//                   }}
//                   className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
//                     isSelected 
//                     ? "!bg-blue-50 !border-blue-600 !text-blue-600 shadow-sm" 
//                     : "!bg-white !border-slate-200 !text-slate-500 hover:!border-slate-300"
//                   }`}
//                 >
//                   {dept}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Footer Actions */}
//       <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
//         <button 
//           onClick={() => setSelectedDepts([])}
//           className="flex-1 py-3 !bg-white border !border-slate-200 !text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 outline-none cursor-pointer"
//         >
//           Clear All
//         </button>
//         <button 
//           onClick={() => {
//             toast.success("Filters applied to registry node");
//             setShowFilterSidebar(false);
//           }}
//           className="flex-1 py-3 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-500/20 hover:!bg-white active:scale-95 transition-all border outline-none cursor-pointer"
//         >
//           Apply Filter
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// const thStyle = "px-3 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest align-top";

// const PaginationBtn = ({ icon, disabled }) => (
//   <button className={`p-1 rounded-lg border border-slate-100 !bg-white transition-all ${disabled ? "opacity-30 cursor-not-allowed" : "text-slate-400 hover:text-blue-600"}`}>
//     {icon}
//   </button>
// );

// export default PaymentsPage;