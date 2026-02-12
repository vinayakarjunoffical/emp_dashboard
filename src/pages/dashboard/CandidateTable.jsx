import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { dashboardService } from "../../services/dashboard.service";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  MoreHorizontal, 
   ArrowLeft,
  Search,
  User,
  Mail,
  Calendar,
  Layers,
  Activity,
  ArrowUpRight,
  RefreshCcw
} from "lucide-react";

const CandidateTable = () => {
  const [params] = useSearchParams();
    const navigate = useNavigate();
  const type = params.get("type") || "all";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchTable = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (type !== "all") {
        if (type === "manual") filters.entry_method = "manual";
        else filters.status = type;
      }
      const res = await dashboardService.getCandidateStats(filters);
      const table = res?.recent_activity || res?.candidates || res?.data || [];
      setData(table);
    } catch (err) {
      console.error("Table API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTable();
    setCurrentPage(1);
  }, [type]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

//   const StatusBadge = ({ status }) => {
//     const styles = {
//       hired: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
//       pending: "bg-amber-500/10 text-amber-600 border-amber-200/50",
//       rejected: "bg-rose-500/10 text-rose-600 border-rose-200/50",
//       screening: "bg-blue-500/10 text-blue-600 border-blue-200/50",
//       default: "bg-slate-100 text-slate-500 border-slate-200"
//     };
//     const style = styles[status?.toLowerCase()] || styles.default;
//     return (
//       <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border uppercase tracking-[0.15em] flex items-center gap-1.5 w-fit ${style}`}>
//         <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
//         {formatStatus(status) || "-"}
//       </span>
//     );
//   };


const StatusBadge = ({ status }) => {
  const styles = {
    hired: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
    pending: "bg-amber-500/10 text-amber-600 border-amber-200/50",
    rejected: "bg-rose-500/10 text-rose-600 border-rose-200/50",
    screening: "bg-blue-500/10 text-blue-600 border-blue-200/50",
    interviewing: "bg-indigo-500/10 text-indigo-600 border-indigo-200/50",
    migrated: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
    jd_sent: "bg-amber-500/10 text-amber-600 border-amber-200/50",
    default: "bg-slate-100 text-slate-500 border-slate-200"
  };

  const style = styles[status?.toLowerCase()] || styles.default;

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border uppercase tracking-[0.15em] flex items-center gap-1.5 w-fit ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {formatStatus(status)}
    </span>
  );
};

  const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")                // remove underscore
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize
};


  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans selection:bg-blue-100">
      
      {/* --- ENTERPRISE HEADER --- */}
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="flex gap-3">
  
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
            </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em]">
              <Activity size={14} /> Global Talent Pool
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter capitalize flex items-center gap-3">
              {type === "all" ? "Candidate Management" : `${type} List`}
              <span className="text-sm font-medium bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-400">
                {data.length} Total
              </span>
            </h2>
          </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Query system..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all w-64 shadow-sm"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
              <RefreshCcw size={18} />
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-xl text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-xl">
              <Download size={16} /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* --- MAIN TABLE CARD --- */}
        <div className="bg-white border border-slate-200 rounded-[24px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Data</span>
            </div>
          ) : data.length === 0 ? (
            <div className="py-32 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <Layers size={32} />
              </div>
              <p className="text-slate-500 font-bold tracking-tight">System returned 0 matching records.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Candidate</th>
                      <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Email</th>
                      <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                      <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Entry Source</th>
                      <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Updated</th>
                      <th className="p-5"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {currentItems.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/20 transition-all group relative">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                              <User size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                                    {row.full_name || "Internal Record"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">UID: {row.id?.toString().slice(-6) || 'SYS-ENT'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                            <Mail size={14} className="text-slate-300" />
                            {row.email || "---"}
                          </div>
                        </td>
                        <td className="p-5">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                                <ArrowUpRight size={10} className="text-blue-500" />
                                {row.entry_method || "Direct API"}
                             </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                            <Calendar size={14} className="text-slate-300" />
                            {row.updated_at ? new Date(row.updated_at).toLocaleDateString('en-GB') : "-"}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* --- ENTERPRISE PAGINATION --- */}
              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Showing <span className="text-slate-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)}</span> 
                  <span className="mx-2 text-slate-200">|</span> 
                  Batch Scope: <span className="text-slate-900">{data.length} Records</span>
                </p>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 shadow-sm transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 text-xs font-black rounded-xl transition-all border ${
                          currentPage === i + 1 
                          ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 shadow-sm transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateTable;
//***************************************working code phase 1 9/02/26******************************************************** */
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { dashboardService } from "../../services/dashboard.service";

// const CandidateTable = () => {
//   const [params] = useSearchParams();
//   const type = params.get("type") || "all";

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchTable = async () => {
//     try {
//       setLoading(true);

//       const filters = {};

//       // KPI → filter mapping
//       if (type !== "all") {
//         if (type === "manual") filters.entry_method = "manual";
//         else filters.status = type;
//       }

//       const res = await dashboardService.getCandidateStats(filters);

//       /**
//        * Your API returns:
//        * {
//        *   total_candidates: 120,
//        *   status_distribution: [],
//        *   entry_method_distribution: [],
//        *   recent_activity: [],   <-- LIST DATA
//        * }
//        */

//       const table =
//         res?.recent_activity ||
//         res?.candidates ||
//         res?.data ||
//         [];

//       setData(table);

//     } catch (err) {
//       console.error("Table API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTable();
//   }, [type]);

//   return (
//     <div className="p-8">
//       <h2 className="text-xl font-bold mb-6 capitalize">
//         {type === "all" ? "All Candidates" : `${type} Candidates`}
//       </h2>

//       {loading ? (
//         <div className="text-center py-10">Loading...</div>
//       ) : data.length === 0 ? (
//         <div className="text-center py-10 text-gray-400">
//           No data found
//         </div>
//       ) : (
//         <div className="overflow-auto border rounded-xl">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Entry</th>
//                 <th className="p-3 text-left">Created</th>
//               </tr>
//             </thead>

//             <tbody>
//               {data.map((row) => (
//                 <tr key={row.id} className="border-t">
//                   <td className="p-3 font-medium">
//                     {row.full_name || "-"}
//                   </td>
//                   <td className="p-3">{row.email || "-"}</td>
//                   <td className="p-3 capitalize">
//                     {row.status || "-"}
//                   </td>
//                   <td className="p-3 capitalize">
//                     {row.entry_method || "-"}
//                   </td>
//                   <td className="p-3">
//                     {row.updated_at
//                       ? new Date(row.updated_at).toLocaleDateString()
//                       : "-"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CandidateTable;
