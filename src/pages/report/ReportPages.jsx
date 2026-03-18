import React, { useState } from 'react';
import { 
  Search, Star, Eye, Inbox, Play, Download, 
  FileText, Calendar, PieChart, Clock, AlertCircle 
} from 'lucide-react';

const ReportPages = () => {
  const [activeTab, setActiveTab] = useState('Reports');

  const reports = [
    { id: 1, title: "Attendance Report", desc: "Staff level summary for individual attendance cycle", icon: <FileText size={16} /> },
    { id: 2, title: "Daily Attendance Report", desc: "Day wise attendance summary, individual attendance view and punch logs", icon: <Calendar size={16} /> },
    { id: 3, title: "Muster Roll Report", desc: "Monthly view of day wise attendance, fine, OT, etc. of all staff", icon: <PieChart size={16} /> },
    { id: 4, title: "Staff Fine Report", desc: "Check fine amounts, fine hours from Late Fines, Early Outs and Breaks", icon: <AlertCircle size={16} /> },
    { id: 5, title: "Staff Overtime Report", desc: "Check OT amount, OT hours from Overtime and Early Overtime", icon: <Clock size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10 text-left">
      {/* 🚀 Header Strip */}
      <div className="bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex gap-8">
          {['Reports', 'Downloads'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-[10px] font-black uppercase !bg-transparent tracking-widest transition-all relative border-0 cursor-pointer ${
                activeTab === tab ? '!text-blue-600' : '!text-slate-400 hover:!text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto px-6 mt-4 space-y-4">
        {activeTab === 'Reports' ? (
          /* 📋 REPORTS TAB CONTENT */
          <>
            {/* 🔍 Search Bar Container */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search for a Report" 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
              />
            </div>

            {/* 📑 Bookmark Section Title */}
            <div className="flex items-center gap-2 pt-2 ml-1">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Bookmark Reports</h3>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* 📋 Reports List */}
            <div className="space-y-1.5">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="group bg-white border border-slate-100 p-3 rounded-lg flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <button className="!bg-transparent p-1 !text-blue-600 hover:scale-110 transition-transform cursor-pointer border-0">
                      <Star size={14} fill="currentColor" strokeWidth={0} />
                    </button>

                    <div className="space-y-0.5">
                      <h4 className="text-[12px] font-black text-slate-800 pb-0.5 uppercase tracking-tight leading-tight">
                        {report.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight opacity-80">
                        {report.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 !bg-blue-50 !text-blue-600 rounded-lg hover:!bg-blue-100 transition-colors border-0 cursor-pointer">
                      <Eye size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-100 hover:!bg-white border border-blue-500 active:scale-95 transition-all cursor-pointer">
                      Generate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* 📥 DOWNLOADS TAB CONTENT (EMPTY STATE) */
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500">
            <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
              <Inbox size={48} className="text-slate-200" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">No Documents Found</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">You haven't generated or added any documents yet</p>
            </div>
            <button 
              onClick={() => setActiveTab('Reports')}
              className="px-6 py-2.5 !bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer border-0"
            >
              Go to Reports
            </button>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ReportPages;

//*****************************************************working code phase 1************************************************************ */
// import React, { useState } from 'react';
// import { 
//   Search, Star, Eye, EyeOff, Play, Download, 
//   FileText, Calendar, PieChart, Clock, AlertCircle 
// } from 'lucide-react';

// const ReportPages = () => {
//   const [activeTab, setActiveTab] = useState('Reports');

//   const reports = [
//     { id: 1, title: "Attendance Report", desc: "Staff level summary for individual attendance cycle", icon: <FileText size={16} /> },
//     { id: 2, title: "Daily Attendance Report", desc: "Day wise attendance summary, individual attendance view and punch logs", icon: <Calendar size={16} /> },
//     { id: 3, title: "Muster Roll Report", desc: "Monthly view of day wise attendance, fine, OT, etc. of all staff", icon: <PieChart size={16} /> },
//     { id: 4, title: "Staff Fine Report", desc: "Check fine amounts, fine hours from Late Fines, Early Outs and Breaks", icon: <AlertCircle size={16} /> },
//     { id: 5, title: "Staff Overtime Report", desc: "Check OT amount, OT hours from Overtime and Early Overtime", icon: <Clock size={16} /> },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans pb-10">
//       {/* 🚀 Header Strip */}
//       <div className="bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-30">
//         <div className="flex gap-8">
//           {['Reports', 'Downloads'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative !bg-transparent border-0 cursor-pointer ${
//                 activeTab === tab ? '!text-blue-600' : '!text-slate-400 hover:!text-slate-600'
//               }`}
//             >
//               {tab}
//               {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className=" mx-auto px-6 mt-4 space-y-4">
        
//         {/* 🔍 Search Bar Container */}
//         <div className="relative group">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
//           <input 
//             type="text" 
//             placeholder="Search for a Report" 
//             className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
//           />
//         </div>

//         {/* 📑 Bookmark Section Title */}
//         <div className="flex items-center gap-2 pt-2 ml-1">
//           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Bookmark Reports</h3>
//           <div className="h-px flex-1 bg-slate-100" />
//         </div>

//         {/* 📋 Reports List */}
//         <div className="space-y-1.5">
//           {reports.map((report) => (
//             <div 
//               key={report.id} 
//               className="group bg-white border border-slate-100 p-3 rounded-lg flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition-all"
//             >
//               <div className="flex items-center gap-4">
//                 {/* Star Icon */}
//                 <button className="!bg-transparent p-1 !text-blue-600 hover:scale-110 transition-transform cursor-pointer border-0">
//                   <Star size={14} fill="currentColor" strokeWidth={0} />
//                 </button>

//                 {/* Report Info */}
//                 <div className="space-y-0.5">
//                   <h4 className="text-[12px] font-black text-slate-800 pb-0.5 uppercase tracking-tight leading-tight">
//                     {report.title}
//                   </h4>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight opacity-80">
//                     {report.desc}
//                   </p>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center gap-2">
//                 <button className="p-2 !bg-blue-50 !text-blue-600 rounded-lg hover:!bg-blue-100 transition-colors border-0 cursor-pointer">
//                   <Eye size={14} />
//                 </button>
//                 <button className="flex items-center gap-2 px-5 py-2 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-100 hover:!bg-white border border-blue-500 active:scale-95 transition-all  cursor-pointer">
//                   Generate
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

     

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// };

// export default ReportPages;