import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // 🔥 Added imports
import { 
  ArrowLeft, 
  ChevronDown, 
  PackageOpen
} from 'lucide-react';

const SalaryOverviewVariable = () => {
  // --- REDIRECTION & LOCATION LOGIC ---
  const location = useLocation();
  const navigate = useNavigate();


  const onBack = () => {
  navigate(-1, { 
    state: { 
      activeTab: "Salary Overview", 
      openMonthId: location.state?.monthId // monthId is passed from source
    } 
  });
};
  
  // Extract state passed from the previous page (with fallbacks for test cases)
  const { 
    employeeName = "Dhaval Mehta", 
    selectedMonth = "January 2026" 
  } = location.state || {};

//   const onBack = () => navigate(-1); 

  // --- EXISTING STATE & LOGIC ---
  const [activeSubTab, setActiveSubTab] = useState("Earnings");
  const subTabs = ["Earnings", "Deductions", "Payments", "Adjustments"];

  const renderHeaders = () => {
    if (activeSubTab === "Payments") {
      return (
        <>
          <th className={thStyle}>Action Type</th>
          <th className={thStyle}>Entry Date</th>
          <th className={thStyle}>Mode</th>
          <th className={thStyle}>Amount</th>
          <th className={thStyle}>Description</th>
          <th className={thStyle}>Created At</th>
          <th className={thStyle}>Last Updated At</th>
          <th className={thStyle + " text-right"}>Actions</th>
        </>
      );
    }
    
    if (activeSubTab === "Adjustments") {
      return (
        <>
          <th className={thStyle}>Entry</th>
          <th className={thStyle}>Entry Date</th>
          <th className={thStyle}>Amount</th>
        </>
      );
    }

    return (
      <>
        <th className={thStyle}>Action Type</th>
        <th className={thStyle}>Entry Date</th>
        <th className={thStyle}>Amount</th>
        <th className={thStyle}>Description</th>
        <th className={thStyle}>Created At</th>
        <th className={thStyle}>Created By</th>
        <th className={thStyle}>Last Updated At</th>
        <th className={thStyle}>Last Updated By</th>
        <th className={thStyle + " text-right"}>Actions</th>
      </>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      {/* 🔙 BACK NAVIGATION STRIP */}
      <button 
        onClick={onBack}
        className="flex items-center gap-1 mb-4 !text-slate-400 hover:text-blue-800 transition-colors !bg-transparent border-0 cursor-pointer outline-none"
      >
        <ArrowLeft size={14} strokeWidth={3} />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Salary Overview</span>
      </button>

      {/* 📋 HEADER CARD */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm mb-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
            {employeeName} | <span className="!text-slate-500">{selectedMonth}</span>
          </h2>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 !bg-white border !border-slate-200 !text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all outline-none">
            Actions <ChevronDown size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* 🛠️ SUB-TAB NAVIGATION */}
        <div className="flex gap-1 mt-4 border-b border-slate-50">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-tighter transition-all !bg-transparent border-0 border-b-2 cursor-pointer outline-none ${
                activeSubTab === tab 
                ? "!border-blue-600 !text-blue-600" 
                : "!border-transparent !text-slate-400 hover:!text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 DATA GRID / TABLE */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {renderHeaders()}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td 
                  colSpan={activeSubTab === "Adjustments" ? 3 : 10} 
                  className="py-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-[#e6f4f1] rounded-2xl flex items-center justify-center mb-4 border border-[#cce8e2] relative shadow-sm">
                       <PackageOpen size={28} className="text-[#00a884]" strokeWidth={1.5} />
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00a884] text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-black border-2 border-white">?</div>
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No Data</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const thStyle = "px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap";

export default SalaryOverviewVariable;
//*********************************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   ChevronDown, 
//   Search, 
//   FileText, 
//   MoreHorizontal,
//   PackageOpen
// } from 'lucide-react';

// const SalaryOverviewVariable = ({ onBack, employeeName = "Dhaval Mehta", selectedMonth = "January 2026" }) => {
//   const [activeSubTab, setActiveSubTab] = useState("Earnings");

//   const subTabs = ["Earnings", "Deductions", "Payments", "Adjustments"];

//   return (
//     <div className="animate-in fade-in duration-500">
//       {/* 🔙 BACK NAVIGATION STRIP */}
//       <button 
//         onClick={onBack}
//         className="flex items-center gap-1 mb-4 !text-slate-400 hover:text-blue-800 transition-colors !bg-transparent border-0 cursor-pointer"
//       >
//         <ArrowLeft size={14} strokeWidth={3} />
//         <span className="text-[10px] font-black uppercase tracking-widest">Back to Salary Overview</span>
//       </button>

//       {/* 📋 HEADER CARD */}
//       <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm mb-3">
//         <div className="flex justify-between items-center">
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//             {employeeName} | <span className="!text-slate-500">{selectedMonth}</span>
//           </h2>
          
//           <button className="flex items-center gap-1.5 px-3 py-1.5 !bg-white border !border-slate-200 !text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all">
//             Actions <ChevronDown size={12} />
//           </button>
//         </div>

//         {/* 🛠️ SUB-TAB NAVIGATION */}
//         <div className="flex gap-1 mt-4 border-b border-slate-50">
//           {subTabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveSubTab(tab)}
//               className={`px-4 py-2 text-[10px] font-black uppercase tracking-tighter transition-all !bg-transparent border-0 border-b-2 cursor-pointer ${
//                 activeSubTab === tab 
//                 ? "!border-blue-600 !text-blue-600" 
//                 : "!border-transparent !text-slate-400 hover:!text-slate-600"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 📊 DATA GRID / TABLE */}
//       <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/80 border-b border-slate-100">
//                 <th className={thStyle}>Action Type</th>
//                 <th className={thStyle}>Entry Date</th>
//                 <th className={thStyle}>Amount</th>
//                 <th className={thStyle}>Description</th>
//                 <th className={thStyle}>Created At</th>
//                 <th className={thStyle}>Created By</th>
//                 <th className={thStyle}>Last Updated At</th>
//                 <th className={thStyle}>Last Updated By</th>
//                 <th className={thStyle + " text-right"}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* 📦 EMPTY STATE (Matching Image) */}
//               <tr>
//                 <td colSpan="9" className="py-20 text-center">
//                   <div className="flex flex-col items-center justify-center">
//                     <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 border border-emerald-100 relative shadow-sm">
//                        <PackageOpen size={28} className="text-emerald-500" strokeWidth={1.5} />
//                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-black border-2 border-white">?</div>
//                     </div>
//                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Data Available</p>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Tailwind Styles for Metadata-First Table
// const thStyle = "px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap";

// export default SalaryOverviewVariable;