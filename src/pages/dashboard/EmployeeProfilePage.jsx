import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { employeeKycService } from "../../services/employeeKyc.service";
import { 
  ArrowLeft, Mail, Smartphone, TrendingUp, Fingerprint, Monitor, 
  FileCheck, FileText, ShieldCheck, Activity, MapPin, Lock,
  Briefcase, Calendar, ChevronRight, ExternalLink, Hash, Info
} from "lucide-react";

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        setLoading(true);
        const data = await employeeKycService.getFull(id);
        setEmployee(data);
      } catch (err) {
        console.error("Profile Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullProfile();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen font-black uppercase text-slate-400 animate-pulse tracking-widest text-xs">Node_Retrieval_In_Progress</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* 01. INTEGRATED SYSTEM HEADER */}
      <div className="bg-slate-50/50 border-b border-slate-100 pt-8 pb-0">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex items-start gap-6">
              <button onClick={() => navigate(-1)} className="mt-1 p-2 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all">
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase tracking-widest">Employee</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{employee?.employee_code}</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
                  {employee?.full_name}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-8 pb-1">
               <StatNode label="Employment" val={employee?.status} color="text-emerald-500" />
               <StatNode label="Assignment" val={employee?.role} />
               <StatNode label="Node" val={employee?.address?.current_city} />
            </div>
          </div>

          {/* 02. SEGMENTED TAB NAVIGATOR (Linear Style) */}
          <div className="flex items-center gap-1 border-b border-transparent overflow-x-auto no-scrollbar">
            <NavSegment active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Overview" icon={<Activity size={14}/>} />
            <NavSegment active={activeTab === "kyc"} onClick={() => setActiveTab("kyc")} label="Identity Registry" icon={<Fingerprint size={14}/>} />
            <NavSegment active={activeTab === "infrastructure"} onClick={() => setActiveTab("infrastructure")} label="Assets & Hardware" icon={<Monitor size={14}/>} />
            <NavSegment active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Documentation" icon={<FileCheck size={14}/>} />
          </div>
        </div>
      </div>

      {/* 03. MAIN STAGE */}
      <main className="max-w-[1400px] mx-auto px-8 py-12">
        
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Core Metrics */}
            <div className="col-span-12 lg:col-span-8 space-y-10">
               <div className="grid grid-cols-3 gap-6">
                  <ValueBlock label="Communications" val={employee.email} icon={<Mail size={16}/>} />
                  <ValueBlock label="Contact" val={employee.phone} icon={<Smartphone size={16}/>} />
                  <ValueBlock label="Offered CTC" val={`₹${employee.offered_ctc?.toLocaleString()}`} icon={<TrendingUp size={16}/>} />
               </div>

               <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-3">Deployment Schedule</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
                     <GhostField label="Probation Start" val={employee.probation_start_date} />
                     <GhostField label="Probation End" val={employee.probation_end_date} />
                     <GhostField label="Confirmation" val={employee.confirmation_date} />
                     <GhostField label="Actual Joining" val={employee.actual_joining_date} />
                  </div>
               </div>
            </div>

            {/* Reporting Context Sidebar */}
            <div className="col-span-12 lg:col-span-4">
               <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Matrix</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-blue-600 shadow-sm">
                      {employee.reporting_manager_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">{employee.reporting_manager_name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Reporting Head</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* TAB: KYC */}
        {activeTab === "kyc" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <RegistrySlate label="Aadhaar UID" val={employee.kyc?.aadhaar_number} status={employee.kyc?.aadhaar_status} />
             <RegistrySlate label="PAN Inventory" val={employee.kyc?.pan_number} status={employee.kyc?.pan_status} />
             <RegistrySlate label="IFSC Protocol" val={employee.kyc?.ifsc_code} status={employee.kyc?.bank_status} />
             <RegistrySlate label="Settlement Index" val={employee.kyc?.account_number?.replace(/.(?=.{4})/g, "•")} status={employee.kyc?.bank_status} />
          </div>
        )}

        {/* TAB: INFRASTRUCTURE */}
        {activeTab === "infrastructure" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
             {employee.assets?.map(asset => (
               <div key={asset.id} className="group p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="p-3 bg-white rounded-2xl border border-slate-100 text-blue-600 group-hover:scale-110 transition-transform shadow-sm"><Monitor size={20}/></div>
                      <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{asset.asset_category}</p>
                        <h5 className="text-lg font-black text-slate-800 leading-none mt-1">{asset.asset_name}</h5>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{asset.serial_number}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200/50">
                    {asset.images?.map((img, i) => (
                      <img key={i} src={`https://apihrr.goelectronix.co.in${img}`} className="w-14 h-14 rounded-2xl object-cover border-4 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer" alt="asset" />
                    ))}
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* TAB: VAULT */}
        {activeTab === "vault" && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-500">
             {employee.documents?.map(doc => (
               <a key={doc.id} href={doc.document_path} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-600 transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors"><FileText size={20} className="text-slate-400 group-hover:text-blue-600"/></div>
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight leading-tight">{doc.document_type.replace(/_/g, " ")}</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-200 group-hover:text-blue-600 transition-all" />
               </a>
             ))}
           </div>
        )}

      </main>
    </div>
  );
};

/* --- ENTERPRISE SLATE SUB-COMPONENTS --- */

const StatNode = ({ label, val, color }) => (
  <div className="flex flex-col items-end">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
    <p className={`text-xs font-black uppercase tracking-widest ${color || 'text-slate-900'}`}>{val || "Pending"}</p>
  </div>
);

const NavSegment = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2.5 px-6 py-4 transition-all relative group`}
  >
    <span className={`transition-all ${active ? 'text-blue-600 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
    <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{label}</span>
    {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.4)]" />}
  </button>
);

const ValueBlock = ({ label, val, icon }) => (
  <div className="p-6 border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-50 rounded-xl text-blue-600">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-sm font-black text-slate-900 truncate">{val || "—"}</p>
  </div>
);

const GhostField = ({ label, val }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{label}</p>
    <p className="text-sm font-bold text-slate-700">{val || "Not_Set"}</p>
  </div>
);

const RegistrySlate = ({ label, val, status }) => (
  <div className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-slate-800 font-mono tracking-[0.1em]">{val || "--- --- ---"}</p>
    </div>
    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${status === 'verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
       <div className={`w-1.5 h-1.5 rounded-full ${status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
       {status || "Pending"}
    </div>
  </div>
);

export default EmployeeProfilePage;
//***************************************************working code 12/02/26*************************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import { 
//   ArrowLeft, Mail, Smartphone, TrendingUp, Fingerprint, Monitor, 
//   FileCheck, FileText, ShieldCheck, Activity, MapPin, Lock,
//   Briefcase, Calendar, ChevronRight, ExternalLink, Hash, ShieldAlert
// } from "lucide-react";

// const EmployeeProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchFullProfile = async () => {
//       try {
//         setLoading(true);
//         const data = await employeeKycService.getFull(id);
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFullProfile();
//   }, [id]);

//   if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Node...</div>;

//   return (
//     <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900">
      
//       {/* 01. GLOBAL COMMAND BAR */}
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4">
//         <div className="max-w-[1600px] mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-6">
//             <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
//               <ArrowLeft size={18} className="text-slate-500" />
//             </button>
//             <div className="h-6 w-px bg-slate-200" />
//             <div className="flex flex-col">
//                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
//                   <ShieldCheck size={12} /> Encrypted Environment
//                </div>
//                <h1 className="text-sm font-bold text-slate-800">Personnel Dossier: {employee?.employee_code}</h1>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//              <div className="px-3 py-1 bg-slate-100 rounded-md border border-slate-200 text-[10px] font-black text-slate-500 uppercase">
//                 Last Sync: {new Date().toLocaleTimeString()}
//              </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-[1600px] mx-auto p-8 grid grid-cols-12 gap-8">
        
//         {/* 02. PERSISTENT IDENTITY SIDEBAR */}
//         <aside className="col-span-12 lg:col-span-3 space-y-6">
//           <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-slate-300 mb-6">
//                 {employee?.full_name?.charAt(0)}
//               </div>
//               <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{employee?.full_name}</h2>
//               <p className="text-xs font-bold text-slate-400 mt-2">{employee?.role || "Position Unassigned"}</p>
              
//               <div className="mt-8 w-full pt-8 border-t border-slate-100 space-y-4">
//                 <SidebarInfo icon={<Mail size={14}/>} label="Registry Email" val={employee?.email} />
//                 <SidebarInfo icon={<Smartphone size={14}/>} label="Device Link" val={employee?.phone} />
//                 <SidebarInfo icon={<MapPin size={14}/>} label="Primary Node" val={employee?.address?.current_city} />
//               </div>
//             </div>
//           </div>

//           {/* TAB NAVIGATOR */}
//           <nav className="space-y-1">
//             <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="System Overview" icon={<Activity size={16}/>} />
//             <TabButton active={activeTab === "kyc"} onClick={() => setActiveTab("kyc")} label="Identity & KYC" icon={<Fingerprint size={16}/>} />
//             <TabButton active={activeTab === "infrastructure"} onClick={() => setActiveTab("infrastructure")} label="Infrastructure" icon={<Monitor size={16}/>} />
//             <TabButton active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Document Vault" icon={<FileCheck size={16}/>} />
//           </nav>
//         </aside>

//         {/* 03. MAIN WORKSPACE */}
//         <main className="col-span-12 lg:col-span-9">
          
//           {/* OVERVIEW TAB */}
//           {activeTab === "overview" && (
//             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
//                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <MetricCard label="Annual Gross CTC" val={`₹${employee?.offered_ctc?.toLocaleString()}`} sub="Base Compensation" icon={<TrendingUp size={18}/>} color="blue" />
//                   <MetricCard label="Tenure Status" val={employee?.status} sub="Contract State" icon={<Briefcase size={18}/>} color="emerald" />
//                   <MetricCard label="Onboarding Date" val={employee?.joining_date} sub="Registry Entry" icon={<Calendar size={18}/>} color="slate" />
//                </div>

//                <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm">
//                   <SectionHeader title="Deployment Logistics" />
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                      <DataField label="Probation Start" val={employee.probation_start_date} />
//                      <DataField label="Probation End" val={employee.probation_end_date} />
//                      <DataField label="Actual Joining" val={employee.actual_joining_date} />
//                      <DataField label="Reporting Node" val={employee.reporting_manager_name} />
//                   </div>
//                </div>
//             </div>
//           )}

//           {/* KYC TAB */}
//           {activeTab === "kyc" && (
//             <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionHeader title="Identity Verification Registry" />
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <RegistryRow label="Aadhaar UID" val={employee.kyc?.aadhaar_number} status={employee.kyc?.aadhaar_status} />
//                   <RegistryRow label="Permanent Account (PAN)" val={employee.kyc?.pan_number} status={employee.kyc?.pan_status} />
//                   <RegistryRow label="Settlement Index (IFSC)" val={employee.kyc?.ifsc_code} status={employee.kyc?.bank_status} />
//                   <RegistryRow label="Account Number" val={employee.kyc?.account_number?.replace(/.(?=.{4})/g, "•")} status={employee.kyc?.bank_status} />
//                </div>
//             </div>
//           )}

//           {/* INFRASTRUCTURE TAB */}
//           {activeTab === "infrastructure" && (
//             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
//                {employee.assets?.map(asset => (
//                  <div key={asset.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex items-center justify-between group hover:border-blue-400 transition-all">
//                     <div className="flex items-center gap-6">
//                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//                           <Monitor size={24} />
//                        </div>
//                        <div>
//                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">{asset.asset_category}</p>
//                           <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">{asset.asset_name}</h4>
//                           <div className="flex items-center gap-3 mt-2">
//                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
//                                 <Hash size={10}/> {asset.serial_number}
//                              </span>
//                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Condition: {asset.condition_on_allocation}</span>
//                           </div>
//                        </div>
//                     </div>
//                     <div className="flex gap-2">
//                        {asset.images?.map((img, i) => (
//                          <div key={i} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:scale-110 transition-transform">
//                             <img src={`https://apihrr.goelectronix.co.in${img}`} className="w-full h-full object-cover" alt="asset" />
//                          </div>
//                        ))}
//                     </div>
//                  </div>
//                ))}
//             </div>
//           )}

//           {/* VAULT TAB */}
//           {activeTab === "vault" && (
//             <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionHeader title="Authorized Document Repository" />
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {employee.documents?.map(doc => (
//                     <a key={doc.id} href={doc.document_path} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-slate-200/40 transition-all group">
//                        <div className="flex items-center gap-4">
//                           <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
//                              <FileText size={18}/>
//                           </div>
//                           <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{doc.document_type.replace(/_/g, " ")}</span>
//                        </div>
//                        <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors"/>
//                     </a>
//                   ))}
//                </div>
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// };

// /* --- ENTERPRISE HELPER COMPONENTS --- */

// const SidebarInfo = ({ icon, label, val }) => (
//   <div className="flex items-center gap-4 text-left">
//     <div className="text-slate-400">{icon}</div>
//     <div>
//       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
//       <p className="text-xs font-bold text-slate-600 truncate max-w-[180px]">{val || "Not Registered"}</p>
//     </div>
//   </div>
// );

// const TabButton = ({ active, onClick, label, icon }) => (
//   <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 -translate-y-0.5' : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-900'}`}>
//     {icon}
//     <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
//   </button>
// );

// const MetricCard = ({ label, val, sub, icon, color }) => {
//   const colors = {
//     blue: "text-blue-600 bg-blue-50 border-blue-100",
//     emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
//     slate: "text-slate-600 bg-slate-50 border-slate-100"
//   };
//   return (
//     <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
//       <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colors[color]}`}>
//         {icon}
//       </div>
//       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
//       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter truncate">{val || "—"}</h3>
//       <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">{sub}</p>
//     </div>
//   );
// };

// const RegistryRow = ({ label, val, status }) => (
//   <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl">
//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{label}</p>
//       <p className="text-sm font-bold text-slate-800 font-mono tracking-wider">{val || "UNAVAILABLE"}</p>
//     </div>
//     <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
//       {status || "Pending"}
//     </span>
//   </div>
// );

// const SectionHeader = ({ title }) => (
//   <div className="flex items-center gap-4 mb-8">
//      <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] whitespace-nowrap">{title}</h3>
//      <div className="h-[1px] w-full bg-slate-100" />
//   </div>
// );

// const DataField = ({ label, val }) => (
//   <div className="space-y-1">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
//     <p className="text-sm font-bold text-slate-800">{val || "—"}</p>
//   </div>
// );

// export default EmployeeProfilePage;
//************************************************************working code 12/02/26************************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import { 
//   ArrowLeft, Mail, Smartphone, TrendingUp, Fingerprint, Monitor, 
//   FileCheck, FileText, ShieldCheck, Activity, MapPin, Lock,
//   Briefcase, Calendar, ChevronRight, Star, ExternalLink 
// } from "lucide-react";

// const EmployeeProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchFullProfile = async () => {
//       try {
//         setLoading(true);
//         const data = await employeeKycService.getFull(id);
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFullProfile();
//   }, [id]);

//   // Internal Loader Component
//   const GlobalTerminalLoader = () => (
//     <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-8">
//         <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
//         <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full animate-ping" />
//         <div className="relative w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
//           <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>
//       <div className="space-y-3 text-center">
//         <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">System Protocol: Data Retrieval</h3>
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synchronizing with Governance Node...</p>
//       </div>
//     </div>
//   );

//   if (loading) return <GlobalTerminalLoader />;
//   if (!employee) return <div className="p-20 text-center font-black uppercase text-slate-400 tracking-widest">Asset Not Found</div>;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      
//       {/* --- TOP BREADCRUMB --- */}
//       <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm group">
//             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/>
//           </button>
//           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
//             <span>Directory</span>
//             <ChevronRight size={12} />
//             <span className="text-blue-600">Personnel Dossier</span>
//           </div>
//         </div>
//         <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Security Level 4</span>
//       </div>

//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
//         {/* --- LEFT SIDEBAR --- */}
//         <aside className="col-span-12 lg:col-span-3 space-y-6">
//           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl shadow-slate-200">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
//             <div className="relative w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-3xl font-black text-white shadow-2xl mx-auto mb-6">
//               {employee?.full_name?.charAt(0)}
//             </div>
//             <h2 className="text-xl font-black text-white tracking-tight uppercase leading-tight">{employee?.full_name}</h2>
//             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-2 mb-8">{employee?.employee_code}</p>
//             <div className="space-y-3 text-left">
//                <SidebarStat label="Operational Role" val={employee?.role} />
//                <SidebarStat label="System Status" val={employee?.status} active />
//             </div>
//           </div>

//           <nav className="flex flex-col gap-2">
//             <TabNavItem active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Profile Overview" icon={<Activity size={16}/>} />
//             <TabNavItem active={activeTab === "kyc"} onClick={() => setActiveTab("kyc")} label="Identity Registry" icon={<Fingerprint size={16}/>} />
//             <TabNavItem active={activeTab === "infrastructure"} onClick={() => setActiveTab("infrastructure")} label="Infrastructure" icon={<Monitor size={16}/>} />
//             <TabNavItem active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Document Vault" icon={<FileCheck size={16}/>} />
//           </nav>
//         </aside>

//         {/* --- RIGHT CONTENT AREA --- */}
//         <main className="col-span-12 lg:col-span-9 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm min-h-[70vh]">
          
//           {activeTab === "overview" && (
//             <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionTitle title="Primary Disposition" subtitle="Core contact and payroll metadata" />
//                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                  <AnalyticalCard label="Communications" val={employee.email} icon={<Mail size={14} />} />
//                  <AnalyticalCard label="Contact Node" val={employee.phone} icon={<Smartphone size={14} />} />
//                  <AnalyticalCard label="Hiring Ledger" val={`₹${employee.offered_ctc?.toLocaleString()}`} icon={<TrendingUp size={14} />} />
//                </div>
               
//                <SectionTitle title="Deployment Schedule" subtitle="Timeline for organizational integration" />
//                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 grid grid-cols-2 gap-8">
//                   <DetailItem label="Probation Start" val={employee.probation_start_date} />
//                   <DetailItem label="Probation End" val={employee.probation_end_date} />
//                   <DetailItem label="Confirmation Target" val={employee.confirmation_date} />
//                   <DetailItem label="Actual Joining" val={employee.actual_joining_date} />
//                </div>
//             </div>
//           )}

//           {activeTab === "kyc" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionTitle title="Identity Verification Registry" subtitle="Verified government-linked credentials" />
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <RegistryItem label="Aadhaar UID" value={employee.kyc?.aadhaar_number} status={employee.kyc?.aadhaar_status} />
//                   <RegistryItem label="PAN Registry" value={employee.kyc?.pan_number} status={employee.kyc?.pan_status} />
//                   <RegistryItem label="Settlement (IFSC)" value={employee.kyc?.ifsc_code} status={employee.kyc?.bank_status} />
//                   <RegistryItem label="Account Index" value={employee.kyc?.account_number?.replace(/.(?=.{4})/g, "•")} status={employee.kyc?.bank_status} />
//                </div>
//             </div>
//           )}

//           {activeTab === "infrastructure" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionTitle title="Hardware Provisioning" subtitle="Inventory assigned to current node" />
//                {employee.assets?.length > 0 ? (
//                  <div className="grid grid-cols-1 gap-4">
//                    {employee.assets.map(asset => (
//                      <div key={asset.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white hover:shadow-xl transition-all">
//                         <div className="flex items-center gap-5">
//                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-blue-600"><Monitor size={20}/></div>
//                            <div>
//                               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{asset.asset_category}</p>
//                               <h5 className="text-sm font-black text-slate-800 tracking-tight">{asset.asset_name}</h5>
//                               <p className="text-[10px] font-mono font-bold text-slate-400 mt-1">{asset.serial_number}</p>
//                            </div>
//                         </div>
//                         <div className="flex gap-2">
//                           {asset.images?.map((img, i) => (
//                             <img key={i} src={`https://apihrr.goelectronix.co.in${img}`} className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm hover:scale-125 transition-transform cursor-pointer" alt="asset" />
//                           ))}
//                         </div>
//                      </div>
//                    ))}
//                  </div>
//                ) : (
//                 <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No infrastructure provisioned</p>
//                 </div>
//                )}
//             </div>
//           )}

//           {activeTab === "vault" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionTitle title="Encrypted Document Vault" subtitle="Authorized digital compliance copies" />
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {employee.documents?.map(doc => (
//                     <a key={doc.id} href={doc.document_path} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[1.5rem] hover:border-blue-500 transition-all group">
//                        <div className="flex items-center gap-4">
//                           <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><FileText size={18}/></div>
//                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{doc.document_type.replace(/_/g, " ")}</span>
//                        </div>
//                        <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors"/>
//                     </a>
//                   ))}
//                </div>
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// };

// /* --- SHARED SUB-COMPONENTS (Defined here to fix ReferenceError) --- */

// const AnalyticalCard = ({ label, val, icon }) => (
//   <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500">
//     <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
//       {icon}
//     </div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{label}</p>
//     <p className="text-[13px] font-black text-slate-900 truncate">{val || "—"}</p>
//   </div>
// );

// const RegistryItem = ({ label, value, status }) => (
//   <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
//     <div className="flex flex-col">
//       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
//       <span className="text-xs font-bold text-slate-800">{value || "STAGED_NULL"}</span>
//     </div>
//     <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${status === 'verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
//       {status || "pending"}
//     </span>
//   </div>
// );

// const SidebarStat = ({ label, val, active }) => (
//   <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-left">
//     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
//     <div className="flex items-center gap-2">
//       {active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
//       <p className={`text-xs font-bold ${active ? 'text-emerald-400 uppercase tracking-tighter' : 'text-slate-200'}`}>{val || "Unassigned"}</p>
//     </div>
//   </div>
// );

// const TabNavItem = ({ active, onClick, label, icon }) => (
//   <button onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 border w-full text-left ${active ? 'bg-white border-slate-200 shadow-lg text-blue-600 translate-x-2' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
//     <span className={`${active ? 'scale-110' : 'opacity-60'}`}>{icon}</span>
//     <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
//   </button>
// );

// const SectionTitle = ({ title, subtitle }) => (
//   <div className="space-y-1 mb-8">
//     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h4>
//     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{subtitle}</p>
//   </div>
// );

// const DetailItem = ({ label, val }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//     <p className="text-sm font-bold text-slate-800">{val || "NOT_LOGGED"}</p>
//   </div>
// );

// export default EmployeeProfilePage;
//****************************************************working code phase 1 12/02/26************************************************************** */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import { 
//   ArrowLeft, Mail, Smartphone, TrendingUp, Fingerprint, Monitor, 
//   FileCheck, FileText, ShieldCheck, Activity, MapPin,Lock,
//   Briefcase, Calendar, ChevronRight, Star, ExternalLink 
// } from "lucide-react";

// const EmployeeProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchFullProfile = async () => {
//       try {
//         setLoading(true);
//         const data = await employeeKycService.getFull(id);
//         setEmployee(data);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFullProfile();
//   }, [id]);

//   const GlobalTerminalLoader = () => (
//     <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-8">
//         {/* Outer Rotating Gear Effect */}
//         <div className="absolute inset-0 w-24 h-24 border-4 border-dashed border-blue-500/20 rounded-full animate-spin-slow" />
        
//         {/* Pulse Rings */}
//         <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full animate-ping" />
        
//         {/* Central Identity Core */}
//         <div className="relative w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800">
//           <ShieldCheck size={40} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>
  
//       {/* Technical Status Text */}
//       <div className="space-y-3 text-center">
//         <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">
//           System Protocol: Data Retrieval
//         </h3>
//         <div className="flex flex-col items-center gap-1">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//             Synchronizing with Governance Node...
//           </p>
//           {/* Progress Bar Micro-animation */}
//           <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
//             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full animate-progress-loading" />
//           </div>
//         </div>
//       </div>
  
//       {/* Security Metadata Footer */}
//       <div className="absolute bottom-10 flex items-center gap-4 text-slate-300">
//          <div className="flex items-center gap-1.5">
//             <Lock size={10} />
//             <span className="text-[9px] font-black uppercase tracking-tighter">Encrypted Handshake</span>
//          </div>
//          <div className="w-1 h-1 bg-slate-200 rounded-full" />
//          <div className="text-[9px] font-black uppercase tracking-tighter">ISO 27001 Verified</div>
//       </div>
//     </div>
//   );

//   if (loading) return <GlobalTerminalLoader />; // Use the loader we built previously

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      
//       {/* --- TOP BREADCRUMB NAVIGATION --- */}
//       <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
//             <ArrowLeft size={18} />
//           </button>
//           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
//             <span>Directory</span>
//             <ChevronRight size={12} />
//             <span className="text-blue-600">Personnel Dossier</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Core Terminal</span>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
//         {/* --- LEFT PANEL: IDENTITY CARD (3 Cols) --- */}
//         <aside className="col-span-12 lg:col-span-3 space-y-6">
//           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl shadow-slate-200">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
            
//             <div className="relative w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-3xl font-black text-white shadow-2xl mx-auto mb-6">
//               {employee?.full_name?.charAt(0)}
//             </div>

//             <h2 className="text-xl font-black text-white tracking-tight uppercase leading-tight">{employee?.full_name}</h2>
//             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-2 mb-8">{employee?.employee_code}</p>

//             <div className="space-y-3">
//                <SidebarStat label="Current Assignment" val={employee?.role} />
//                <SidebarStat label="System Status" val={employee?.status} active />
//             </div>
//           </div>

//           {/* TAB NAVIGATION BUTTONS */}
//           <nav className="flex flex-col gap-2">
//             <TabNavItem active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Analytical Overview" icon={<Activity size={16}/>} />
//             <TabNavItem active={activeTab === "kyc"} onClick={() => setActiveTab("kyc")} label="Identity Registry" icon={<Fingerprint size={16}/>} />
//             <TabNavItem active={activeTab === "infrastructure"} onClick={() => setActiveTab("infrastructure")} label="Infrastructure" icon={<Monitor size={16}/>} />
//             <TabNavItem active={activeTab === "vault"} onClick={() => setActiveTab("vault")} label="Document Vault" icon={<FileCheck size={16}/>} />
//           </nav>
//         </aside>

//         {/* --- RIGHT PANEL: DATA ENGINE (9 Cols) --- */}
//         <main className="col-span-12 lg:col-span-9 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm min-h-[70vh]">
          
//           {/* TAB CONTENT: OVERVIEW */}
//           {activeTab === "overview" && (
//             <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionTitle title="Primary Disposition" subtitle="Core contact and payroll metadata" />
//                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                  <AnalyticalCard label="Communications" val={employee.email} icon={<Mail size={14} />} />
//                  <AnalyticalCard label="Contact Node" val={employee.phone} icon={<Smartphone size={14} />} />
//                  <AnalyticalCard label="Hiring Ledger" val={`₹${employee.offered_ctc?.toLocaleString()}`} icon={<TrendingUp size={14} />} />
//                </div>
               
//                <SectionTitle title="Deployment Schedule" subtitle="Timeline for organizational integration" />
//                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 grid grid-cols-2 gap-8">
//                   <DetailItem label="Probation Start" val={employee.probation_start_date} />
//                   <DetailItem label="Probation End" val={employee.probation_end_date} />
//                   <DetailItem label="Confirmation Target" val={employee.confirmation_date} />
//                   <DetailItem label="Actual Joining" val={employee.actual_joining_date} />
//                </div>
//             </div>
//           )}

//           {/* TAB CONTENT: KYC */}
//           {activeTab === "kyc" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionTitle title="Identity Verification Registry" subtitle="Verified government-linked credentials" />
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <RegistryItem label="Aadhaar UID" value={employee.kyc?.aadhaar_number} status={employee.kyc?.aadhaar_status} />
//                   <RegistryItem label="PAN Registry" value={employee.kyc?.pan_number} status={employee.kyc?.pan_status} />
//                   <RegistryItem label="Settlement (IFSC)" value={employee.kyc?.ifsc_code} status={employee.kyc?.bank_status} />
//                   <RegistryItem label="Account Index" value={employee.kyc?.account_number?.replace(/.(?=.{4})/g, "•")} status={employee.kyc?.bank_status} />
//                </div>
//             </div>
//           )}

//           {/* TAB CONTENT: INFRASTRUCTURE (ASSETS) */}
//           {activeTab === "infrastructure" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionTitle title="Hardware Provisioning" subtitle="Inventory assigned to current node" />
//                <div className="grid grid-cols-1 gap-4">
//                  {employee.assets?.map(asset => (
//                    <div key={asset.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white hover:shadow-xl transition-all">
//                       <div className="flex items-center gap-5">
//                          <div className="p-3 bg-white rounded-2xl shadow-sm"><Monitor size={20} className="text-blue-600"/></div>
//                          <div>
//                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{asset.asset_category}</p>
//                             <h5 className="text-sm font-black text-slate-800">{asset.asset_name}</h5>
//                             <p className="text-[10px] font-mono font-bold text-slate-400 mt-1">{asset.serial_number}</p>
//                          </div>
//                       </div>
//                       <div className="flex gap-2">
//                         {asset.images?.map((img, i) => (
//                           <img key={i} src={`https://apihrr.goelectronix.co.in${img}`} className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm hover:scale-125 transition-transform" />
//                         ))}
//                       </div>
//                    </div>
//                  ))}
//                </div>
//             </div>
//           )}

//           {/* TAB CONTENT: VAULT */}
//           {activeTab === "vault" && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
//                <SectionTitle title="Encrypted Document Vault" subtitle="Authorized digital compliance copies" />
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {employee.documents?.map(doc => (
//                     <a key={doc.id} href={doc.document_path} target="_blank" className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[1.5rem] hover:border-blue-500 transition-all group">
//                        <div className="flex items-center gap-4">
//                           <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><FileText size={18}/></div>
//                           <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{doc.document_type.replace(/_/g, " ")}</span>
//                        </div>
//                        <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600"/>
//                     </a>
//                   ))}
//                </div>
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// };

// /* --- SHARED SUB-COMPONENTS --- */

// const SidebarStat = ({ label, val, active }) => (
//   <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-left">
//     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
//     <div className="flex items-center gap-2">
//       {active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
//       <p className={`text-xs font-bold ${active ? 'text-emerald-400 uppercase tracking-tighter' : 'text-slate-200'}`}>{val || "Unassigned"}</p>
//     </div>
//   </div>
// );

// const TabNavItem = ({ active, onClick, label, icon }) => (
//   <button onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 border ${active ? 'bg-white border-slate-200 shadow-lg text-blue-600 translate-x-2' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
//     <span className={`${active ? 'scale-110' : 'opacity-60'}`}>{icon}</span>
//     <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
//   </button>
// );

// const SectionTitle = ({ title, subtitle }) => (
//   <div className="space-y-1 mb-8">
//     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h4>
//     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{subtitle}</p>
//   </div>
// );

// const DetailItem = ({ label, val }) => (
//   <div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//     <p className="text-sm font-bold text-slate-800">{val || "NOT_LOGGED"}</p>
//   </div>
// );

// export default EmployeeProfilePage;