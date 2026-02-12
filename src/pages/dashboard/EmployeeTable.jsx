import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { dashboardService } from "../../services/dashboard.service";
import { ArrowLeft, Search, User, Briefcase, Calendar, ChevronRight } from "lucide-react";

const EmployeeTable = () => {
  const [params] = useSearchParams();
  const type = params.get("type") || "all";
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(""); // For UI polish

  useEffect(() => {
    fetchEmployees();
  }, [type]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (type === "active") filters.status = "active";
      else if (type === "on_probation") filters.status = "on_probation";
      else if (type === "recent") filters.recent = true;

      const res = await dashboardService.getEmployeeStats(filters);
      const tableData = res?.recent_joiners || res?.employees || res?.data || [];
      setData(tableData);
    } catch (err) {
      console.error("Employee Table Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#FBFCFE] min-h-screen font-sans">
      {/* --- ENTERPRISE HEADER --- */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
                <Briefcase size={12} /> Directory / {type.replace("_", " ")}
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter capitalize">
                {type.replace("_", " ")} Employees
              </h1>
            </div>
          </div>

          {/* QUICK SEARCH/FILTER BAR */}
          <div className="relative group min-w-[320px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Filter by name or role..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[18px] text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {/* --- DATA TABLE CONTAINER --- */}
        <div className="bg-white border border-slate-100 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden">
          {loading ? (
            <div className="p-24 text-center">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing Database...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <User size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-900">Zero Records Identified</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Associate</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role & Designation</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarding Date</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</th>
                    <th className="px-6 py-5"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {data.map((emp) => (
                    <tr key={emp.id} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs border border-slate-200 group-hover:border-blue-200 group-hover:bg-white transition-all">
                            {emp.full_name?.charAt(0)}
                          </div>
                          <span className="text-[13px] font-bold text-slate-800">{emp.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] text-slate-600 font-medium">{emp.role || "-"}</div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-500">
                        <span className="bg-slate-100/50 px-2 py-1 rounded-md text-[11px] font-bold text-slate-600">
                          {emp.department_name || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[13px] text-slate-600">
                          <Calendar size={13} className="text-slate-300" />
                          {emp.joining_date
                            ? new Date(emp.joining_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                            emp.status === "active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : emp.status === "on_probation"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-slate-50 text-slate-500 border border-slate-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                          }`} />
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                           <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* FOOTER INFO */}
        <div className="flex items-center justify-between px-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {data.length} active records
            </p>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live System Database</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
//**********************************************working code phase 12 9/02/26****************************************************************** */
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { dashboardService } from "../../services/dashboard.service";
// import { ArrowLeft } from "lucide-react";

// const EmployeeTable = () => {
//   const [params] = useSearchParams();
//   const type = params.get("type") || "all";

//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//   }, [type]);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);

//       const filters = {};

//       if (type === "active") filters.status = "active";
//       else if (type === "on_probation") filters.status = "on_probation";
//       else if (type === "recent") filters.recent = true;

//       const res = await dashboardService.getEmployeeStats(filters);

//       const tableData =
//         res?.recent_joiners || res?.employees || res?.data || [];

//       setData(tableData);
//     } catch (err) {
//       console.error("Employee Table Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-[#F8FAFC] min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 bg-white border rounded-lg"
//           >
//             <ArrowLeft size={16} />
//           </button>

//           <h1 className="text-2xl font-black capitalize">
//             {type.replace("_", " ")} Employees
//           </h1>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-10 text-center text-slate-400 font-bold">
//             Loading employees...
//           </div>
//         ) : data.length === 0 ? (
//           <div className="p-10 text-center text-slate-400 font-bold">
//             No employees found
//           </div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Role</th>
//                 <th className="p-3 text-left">Department</th>
//                 <th className="p-3 text-left">Joining Date</th>
//                 <th className="p-3 text-left">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {data.map((emp) => (
//                 <tr key={emp.id} className="border-t hover:bg-slate-50">
//                   <td className="p-3 font-semibold">{emp.full_name}</td>
//                   <td className="p-3">{emp.role || "-"}</td>
//                   <td className="p-3">{emp.department_name || "-"}</td>
//                   <td className="p-3">
//                     {emp.joining_date
//                       ? new Date(emp.joining_date).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })
//                       : "-"}
//                   </td>
//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full font-bold ${
//                         emp.status === "active"
//                           ? "bg-emerald-100 text-emerald-700"
//                           : emp.status === "on_probation"
//                           ? "bg-amber-100 text-amber-700"
//                           : "bg-slate-100 text-slate-600"
//                       }`}
//                     >
//                       {emp.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeTable;
