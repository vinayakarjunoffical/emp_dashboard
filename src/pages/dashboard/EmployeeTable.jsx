import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { dashboardService } from "../../services/dashboard.service";
import { employeeKycService } from "../../services/employeeKyc.service";
import { ArrowLeft, Search, User, Briefcase,X,ShieldCheck, Mail,Smartphone,TrendingUp,Fingerprint,Monitor,FileCheck,FileText, Calendar, ChevronRight } from "lucide-react";

const EmployeeTable = () => {
  const [params] = useSearchParams();
  const type = params.get("type") || "all";
  const navigate = useNavigate();
const [selectedEmployee, setSelectedEmployee] = useState(null);
const [modalOpen, setModalOpen] = useState(false);
const [profileLoading, setProfileLoading] = useState(false);
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

  const filteredData = data.filter((emp) => {
  if (!searchText.trim()) return true;

  const text = searchText.toLowerCase();

  return (
    emp.full_name?.toLowerCase().includes(text) ||
    emp.role?.toLowerCase().includes(text) ||
    emp.department_name?.toLowerCase().includes(text)
  );
});


const AnalyticalCard = ({ label, val, icon }) => (
  <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500">
    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{label}</p>
    <p className="text-[13px] font-black text-slate-900 truncate">{val || "—"}</p>
  </div>
);

const RegistryItem = ({ label, value, status }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
    <div className="flex flex-col">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
      <span className="text-xs font-bold text-slate-800">{value || "STAGED_NULL"}</span>
    </div>
    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${status === 'verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
      {status || "pending"}
    </span>
  </div>
);


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
          ) : filteredData.length === 0 ? (
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
                  {/* {data.map((emp) => ( */}
                  {filteredData.map((emp) => (
                    <tr 
                    key={emp.id}
                     className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
//                      onClick={async () => {
//   try {
//     setModalOpen(true);
//     setProfileLoading(true);
//     setSelectedEmployee(null);

//     const full = await employeeKycService.getFull(emp.id);
//     setSelectedEmployee(full);
//   } catch (err) {
//     console.error("Failed to load employee profile", err);
//   } finally {
//     setProfileLoading(false);
//   }
// }}
onClick={() => navigate(`/dashboard/employee/${emp.id}`)}

                     >
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
              {/* Showing {data.length} active records */}
              Showing {filteredData.length} active records
            </p>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live System Database</span>
            </div>
        </div>
      </div>

      {/* {modalOpen && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
    <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">

      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h2 className="text-lg font-bold">
            {selectedEmployee?.full_name || "Loading..."}
          </h2>
          <p className="text-xs text-slate-500">
            {selectedEmployee?.employee_code} • {selectedEmployee?.role}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(false)}
          className="p-2 hover:bg-slate-100 rounded"
        >
          ✕
        </button>
      </div>

 
      <div className="p-6 max-h-[75vh] overflow-y-auto">

 
        {profileLoading && (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase">
              Loading Profile...
            </p>
          </div>
        )}


        {!profileLoading && selectedEmployee && (
          <div className="space-y-6">

        
            <section>
              <h3 className="text-sm font-bold mb-2">Basic Info</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p><b>Email:</b> {selectedEmployee.email}</p>
                <p><b>Phone:</b> {selectedEmployee.phone}</p>
                <p><b>Status:</b> {selectedEmployee.status}</p>
                <p><b>Joining:</b> {selectedEmployee.joining_date}</p>
              </div>
            </section>

 
            {selectedEmployee.address && (
              <section>
                <h3 className="text-sm font-bold mb-2">Address</h3>
                <p className="text-sm">
                  {selectedEmployee.address.current_address_line1},{" "}
                  {selectedEmployee.address.current_city}
                </p>
              </section>
            )}

          
            {selectedEmployee.documents?.length > 0 && (
              <section>
                <h3 className="text-sm font-bold mb-2">Documents</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.document_path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-xs underline"
                    >
                      {doc.document_type}
                    </a>
                  ))}
                </div>
              </section>
            )}

     
            {selectedEmployee.assets?.length > 0 && (
              <section>
                <h3 className="text-sm font-bold mb-2">Assets</h3>

                {selectedEmployee.assets.map((asset) => (
                  <div key={asset.id} className="border rounded p-3 mb-2">
                    <p className="font-bold">{asset.asset_name}</p>
                    <p className="text-xs text-slate-500">
                      {asset.serial_number} • {asset.condition_on_allocation}
                    </p>

                    {asset.images?.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {asset.images.map((img, i) => (
                          <img
                            key={i}
                            src={`https://apihrr.goelectronix.co.in${img}`}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  </div>
)} */}


{modalOpen && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
    {/* Backdrop with extreme blur */}
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setModalOpen(false)} />
    
    {/* Main Container */}
    <div className="relative bg-[#FBFCFE] w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.3)] overflow-hidden flex flex-col lg:flex-row border border-white/20">
      
      {/* 1. LEFT PANEL: IDENTITY ANCHOR (320px) */}
      <aside className="w-full lg:w-80 bg-slate-900 flex flex-col shrink-0 overflow-hidden relative">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
        
        <div className="p-8 flex flex-col items-center text-center flex-1 relative z-10">
          <button onClick={() => setModalOpen(false)} className="absolute top-0 left-0 p-2 text-slate-500 hover:text-white transition-colors lg:hidden">
            <X size={20} />
          </button>

          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
            <div className="relative w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
              {selectedEmployee?.full_name?.charAt(0) || "E"}
            </div>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight uppercase leading-tight">
            {selectedEmployee?.full_name || "Protocol Active"}
          </h2>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-2 mb-6">
            {selectedEmployee?.employee_code || "System Node"}
          </p>

          <div className="w-full space-y-3">
             <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-left">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Operational Role</p>
                <p className="text-xs font-bold text-slate-200">{selectedEmployee?.role || "Unassigned"}</p>
             </div>
             <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-left">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Security Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">{selectedEmployee?.status || "Staged"}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Metadata */}
        <div className="p-8 border-t border-white/5 bg-black/20">
           <div className="flex items-center gap-3 opacity-40">
              <ShieldCheck size={14} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypted Profile Node</span>
           </div>
        </div>
      </aside>

      {/* 2. RIGHT PANEL: ANALYTICAL DATA ENGINE (Scrollable) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
        {profileLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm z-50">
             <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Records...</p>
          </div>
        ) : selectedEmployee && (
          <div className="p-10 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* SECTION: PRIMARY DISPOSITION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <AnalyticalCard label="Communications" val={selectedEmployee.email} icon={<Mail size={14} />} />
               <AnalyticalCard label="Contact Node" val={selectedEmployee.phone} icon={<Smartphone size={14} />} />
               <AnalyticalCard label="Hiring Ledger" val={`₹${selectedEmployee.offered_ctc?.toLocaleString()}`} icon={<TrendingUp size={14} />} />
            </div>

            {/* SECTION: KYC INTEGRITY (High Density) */}
            <div className="space-y-4">
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                 <Fingerprint size={16} className="text-blue-600" /> Identity Verification Registry
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RegistryItem label="Aadhaar UID" value={selectedEmployee.kyc?.aadhaar_number} status={selectedEmployee.kyc?.aadhaar_status} />
                  <RegistryItem label="PAN Registry" value={selectedEmployee.kyc?.pan_number} status={selectedEmployee.kyc?.pan_status} />
                  <RegistryItem label="Settlement (IFSC)" value={selectedEmployee.kyc?.ifsc_code} status={selectedEmployee.kyc?.bank_status} />
                  <RegistryItem label="Account Index" value={selectedEmployee.kyc?.account_number?.replace(/.(?=.{4})/g, "•")} status={selectedEmployee.kyc?.bank_status} />
               </div>
            </div>

            {/* SECTION: DIGITAL ASSETS (With Hover Previews) */}
            <div className="space-y-4">
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                 <Monitor size={16} className="text-blue-600" /> Infrastructure Provisioning
               </h4>
               {selectedEmployee.assets?.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {selectedEmployee.assets.map((asset) => (
                     <div key={asset.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{asset.asset_category}</p>
                             <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">{asset.asset_name}</h5>
                           </div>
                           <div className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-mono font-bold text-slate-500">
                             {asset.serial_number}
                           </div>
                        </div>
                        {asset.images?.length > 0 && (
                          <div className="flex gap-2">
                             {asset.images.map((img, i) => (
                               <div key={i} className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-zoom-in">
                                 <img src={`https://apihrr.goelectronix.co.in${img}`} className="w-full h-full object-cover" alt="asset" />
                               </div>
                             ))}
                          </div>
                        )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">No provisioned hardware found</p>
                 </div>
               )}
            </div>

            {/* SECTION: DOCUMENT VAULT */}
            <div className="space-y-4 pb-10">
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                 <FileCheck size={16} className="text-blue-600" /> Encrypted Document Vault
               </h4>
               <div className="flex flex-wrap gap-3">
                  {selectedEmployee.documents?.map((doc) => (
                    <a key={doc.id} href={doc.document_path} target="_blank" rel="noreferrer" 
                       className="group flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all shadow-sm">
                       <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText size={14} />
                       </div>
                       <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-none">{doc.document_type.replace(/_/g, " ")}</span>
                    </a>
                  ))}
               </div>
            </div>

          </div>
        )}
      </main>

    </div>
  </div>
)}

    </div>
  );
};

export default EmployeeTable;
//***************************************************working code phase 1 12/02/26*********************************************************** */
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { dashboardService } from "../../services/dashboard.service";
// import { ArrowLeft, Search, User, Briefcase, Calendar, ChevronRight } from "lucide-react";

// const EmployeeTable = () => {
//   const [params] = useSearchParams();
//   const type = params.get("type") || "all";
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState(""); // For UI polish

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
//       const tableData = res?.recent_joiners || res?.employees || res?.data || [];
//       setData(tableData);
//     } catch (err) {
//       console.error("Employee Table Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-[#FBFCFE] min-h-screen font-sans">
//       {/* --- ENTERPRISE HEADER --- */}
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all group"
//             >
//               <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
//             </button>
//             <div>
//               <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
//                 <Briefcase size={12} /> Directory / {type.replace("_", " ")}
//               </div>
//               <h1 className="text-3xl font-black text-slate-900 tracking-tighter capitalize">
//                 {type.replace("_", " ")} Employees
//               </h1>
//             </div>
//           </div>

//           {/* QUICK SEARCH/FILTER BAR */}
//           <div className="relative group min-w-[320px]">
//             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
//             <input 
//               type="text"
//               placeholder="Filter by name or role..."
//               className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[18px] text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* --- DATA TABLE CONTAINER --- */}
//         <div className="bg-white border border-slate-100 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden">
//           {loading ? (
//             <div className="p-24 text-center">
//               <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
//               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing Database...</p>
//             </div>
//           ) : data.length === 0 ? (
//             <div className="p-24 text-center">
//               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
//                 <User size={24} className="text-slate-300" />
//               </div>
//               <p className="text-sm font-bold text-slate-900">Zero Records Identified</p>
//               <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50/50 border-b border-slate-100">
//                     <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Associate</th>
//                     <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role & Designation</th>
//                     <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
//                     <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarding Date</th>
//                     <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</th>
//                     <th className="px-6 py-5"></th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-50">
//                   {data.map((emp) => (
//                     <tr key={emp.id} className="group hover:bg-blue-50/30 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs border border-slate-200 group-hover:border-blue-200 group-hover:bg-white transition-all">
//                             {emp.full_name?.charAt(0)}
//                           </div>
//                           <span className="text-[13px] font-bold text-slate-800">{emp.full_name}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-[13px] text-slate-600 font-medium">{emp.role || "-"}</div>
//                       </td>
//                       <td className="px-6 py-4 text-[13px] text-slate-500">
//                         <span className="bg-slate-100/50 px-2 py-1 rounded-md text-[11px] font-bold text-slate-600">
//                           {emp.department_name || "-"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2 text-[13px] text-slate-600">
//                           <Calendar size={13} className="text-slate-300" />
//                           {emp.joining_date
//                             ? new Date(emp.joining_date).toLocaleDateString("en-GB", {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               })
//                             : "-"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
//                             emp.status === "active"
//                               ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
//                               : emp.status === "on_probation"
//                               ? "bg-amber-50 text-amber-600 border border-amber-100"
//                               : "bg-slate-50 text-slate-500 border border-slate-200"
//                           }`}
//                         >
//                           <span className={`w-1.5 h-1.5 rounded-full ${
//                             emp.status === "active" ? "bg-emerald-500" : "bg-amber-500"
//                           }`} />
//                           {emp.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
//                            <ChevronRight size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
        
//         {/* FOOTER INFO */}
//         <div className="flex items-center justify-between px-4">
//             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//               Showing {data.length} active records
//             </p>
//             <div className="flex gap-2">
//                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live System Database</span>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeTable;
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
