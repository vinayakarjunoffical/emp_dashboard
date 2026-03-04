import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  ChevronDown, 
  ShieldCheck, 
  MessageSquare,
  Zap,
  Mail,
  Loader2,
  Phone,
  Briefcase,
  History,
  CheckCircle2,
  ArrowRightCircle
} from "lucide-react";
import { useLocation } from "react-router-dom"; // Ensure this is imported
import { candidateService } from "../../services/candidateService"; // Adjust path as needed
import toast from "react-hot-toast";

const CandidateFlow = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
const location = useLocation();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);


React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cId = params.get("id");

    if (cId) {
      const fetchCandidateProtocol = async () => {
        try {
          setLoading(true);
          const data = await candidateService.getById(cId);
          setCandidate(data);
        } catch (err) {
          console.error("Fetch Error:", err);
          toast.error("Failed to load candidate profile");
        } finally {
          setLoading(false);
        }
      };
      fetchCandidateProtocol();
    }
  }, [location.search]);

  const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2";
  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-[#2563eb] transition-all shadow-inner";

  const previousDecisions = [
    { status: "Talked", date: "24-FEB-2026", remark: "Candidate is interested but currently traveling.", user: "Admin" },
    { status: "Not Talked", date: "20-FEB-2026", remark: "Initial reach out via email protocol.", user: "System" },
    { status: "Profile Match", date: "18-FEB-2026", remark: "AI Protocol matched skill set for React/Tailwind.", user: "System" },
  ];

  // Handle loading state
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
       <Loader2 className="animate-spin text-[#2563eb]" size={48} />
    </div>
  );

  if (!candidate) return <div className="p-20 text-center font-black uppercase text-slate-400">No Candidate ID Detected</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 🟢 TOP SECTION: CANDIDATE IDENTITY */}
        {/* <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
          <ShieldCheck className="absolute -right-10 -top-10 text-blue-600 opacity-[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700" size={250} />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100">
                JD
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Protocol: Active Inbound</span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 uppercase">
                  {candidate.full_name?.charAt(0) || "U"}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                  <span className="text-slate-400 font-bold text-xs flex items-center gap-1.5 uppercase tracking-wide"><Mail size={14} className="text-blue-500"/> john.doe@enterprise.com</span>
                  <span className="text-slate-400 font-bold text-xs flex items-center gap-1.5 uppercase tracking-wide"><Phone size={14} className="text-blue-500"/> +91 98765 43210</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 min-w-[240px]">
              <span className={labelClass}>Applied Vacancy</span>
              <span className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
                <Briefcase size={16} className="text-blue-600"/> Sr. Product Designer
              </span>
            </div>
          </div>
        </div> */}
        {/* 🟢 TOP SECTION: DYNAMIC CANDIDATE IDENTITY */}
<div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
  <ShieldCheck className="absolute -right-10 -top-10 text-blue-600 opacity-[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700" size={250} />
  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="flex items-center gap-6">
      {/* Avatar with dynamic Initial */}
      <div className="h-20 w-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100 uppercase">
        {candidate.full_name?.charAt(0) || "U"}
      </div>
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
            ID: #00{candidate.id}
          </span>
          {/* Dynamic Status Badge from API */}
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
            {candidate.status ? candidate.status.replace(/_/g, ' ') : 'Open'}
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 uppercase">
          {candidate.full_name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
          <span className="text-slate-400 font-bold text-xs flex items-center gap-1.5 uppercase tracking-wide">
            <Mail size={14} className="text-blue-500"/> {candidate.email}
          </span>
          <span className="text-slate-400 font-bold text-xs flex items-center gap-1.5 uppercase tracking-wide">
            <Phone size={14} className="text-blue-500"/> {candidate?.phone || "Not Spacified"}
          </span>
        </div>
      </div>
    </div>
    
    <div className="bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 min-w-[240px]">
      <span className={labelClass}>Position</span>
      <span className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
        <Briefcase size={16} className="text-blue-600"/> 
        {/* Mapping position from API or fallback */}
        {candidate.position || "Not Spacified"}
      </span>
    </div>
  </div>
</div>

        {/* 🔵 BOTTOM SECTION: TWO-COLUMN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: DECISION FORM */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-5 mb-8">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Zap size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Decision Engine</h3>
              </div>

              <div className="space-y-8">
                {/* Status Selection */}
                <div className="space-y-2">
                  <label className={labelClass}>Select Candidate Protocol</label>
                  <div className="relative group">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer group-hover:border-blue-300 h-[52px]`}
                    >
                      <option value="">Select Status</option>
                      <option value="not_talked">Have Not Talked</option>
                      <option value="talked">Talked</option>
                      <option value="interview_call">Called for Interview</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 pointer-events-none" />
                  </div>
                </div>

                {/* INTERVIEW CONDITIONAL BOX */}
                {selectedStatus === "interview_call" && (
                  <div className="animate-in slide-in-from-top-4 fade-in duration-500 bg-blue-50/20 border-2 border-dashed border-blue-100 rounded-3xl p-6 grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 flex items-center gap-2 border-b border-blue-100/50 pb-3">
                        <Calendar size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Interview Schedule Protocol</span>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Target Date</label>
                      <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className={`${inputClass} !bg-white h-[48px]`} />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Target Time</label>
                      <input type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} className={`${inputClass} !bg-white h-[48px]`} />
                    </div>
                  </div>
                )}

                {/* Submission Note: Large Textarea */}
                <div className="space-y-2">
                  <label className={labelClass}>Audit Log / Submission Note</label>
                  <div className="relative">
                    <textarea 
                      rows={6}
                      placeholder="Enter detailed feedback or interaction logs here..." 
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className={`${inputClass} py-4 resize-none min-h-[160px]`}
                    />
                    <MessageSquare size={16} className="absolute right-4 top-4 text-slate-300" />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 italic">Logs are permanent and visible in the audit trail.</p>
                </div>

                <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 active:scale-[0.99] flex items-center justify-center gap-3">
                  <UserCheck size={20} strokeWidth={3} />
                  Execute Decision Protocol
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AUDIT TRAIL */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-fit">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">
                  <History size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Audit Trail</h3>
              </div>
              <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{previousDecisions.length} Logs</span>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[650px] custom-scrollbar">
              {previousDecisions.map((item, idx) => (
                <div key={idx} className="relative pl-8 border-l-2 border-slate-100 last:border-l-0 pb-2">
                  <div className="absolute -left-[9px] top-0 bg-white p-0.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.status}</span>
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                         <Clock size={10} />
                         {item.date}
                      </div>
                    </div>
                    <div className="bg-white/50 border border-slate-100 p-3 rounded-xl">
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">"{item.remark}"</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Authenticated By:</span>
                      <span className="text-[10px] font-black text-blue-600 flex items-center gap-1">
                        <ArrowRightCircle size={12} /> {item.user}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateFlow;
//*************************************************working code phase 1 02/03/26************************************************ */
// import React, { useState } from 'react';
// import { 
//   Calendar, 
//   Clock, 
//   UserCheck, 
//   ChevronDown, 
//   ShieldCheck, 
//   MessageSquare,
//   Zap,
//   User,
//   Mail,
//   Phone,
//   Briefcase,
//   History,
//   CheckCircle2
// } from "lucide-react";

// const CandidateFlow = () => {
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [remark, setRemark] = useState("");
//   const [interviewDate, setInterviewDate] = useState("");
//   const [interviewTime, setInterviewTime] = useState("");

//   const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2";
//   const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-[#2563eb] transition-all shadow-inner";

//   // Dummy Data for Audit Trail
//   const previousDecisions = [
//     { status: "Talked", date: "24-FEB-2026", remark: "Candidate is interested but currently traveling.", user: "Admin" },
//     { status: "Not Talked", date: "20-FEB-2026", remark: "Initial reach out via email protocol.", user: "System" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
//       <div className="max-w-7xl mx-auto space-y-6">
        
//         {/* 🟢 TOP SECTION: CANDIDATE IDENTITY CARD */}
//         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden">
//           <ShieldCheck className="absolute -right-10 -top-10 text-blue-600 opacity-[0.03] -rotate-12" size={200} />
//           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div className="flex items-center gap-6">
//               <div className="h-20 w-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200">
//                 JD
//               </div>
//               <div>
//                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Active Candidate</span>
//                 <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 uppercase">John Doe Prototype</h1>
//                 <p className="text-slate-400 font-bold text-sm flex items-center gap-4 mt-1">
//                   <span className="flex items-center gap-1.5"><Mail size={14}/> john.doe@enterprise.com</span>
//                   <span className="flex items-center gap-1.5"><Phone size={14}/> +91 98765 43210</span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
//                 <span className={labelClass}>Applied For</span>
//                 <span className="text-xs font-black text-slate-700 uppercase flex items-center gap-2"><Briefcase size={14} className="text-blue-600"/> Sr. Product Designer</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🔵 BOTTOM SECTION: TWO-COLUMN SPLIT */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
//           {/* LEFT COLUMN: CURRENT DECISION ENGINE */}
//           <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8">
//             <div className="flex items-center gap-3 border-b border-slate-50 pb-5">
//               <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
//                 <Zap size={20} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Decision</h3>
//             </div>

//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className={labelClass}>Select Status</label>
//                   <div className="relative group">
//                     <select
//                       value={selectedStatus}
//                       onChange={(e) => setSelectedStatus(e.target.value)}
//                       className={`${inputClass} appearance-none pr-10 cursor-pointer group-hover:border-blue-300`}
//                     >
//                       <option value="">Select Protocol</option>
//                       <option value="not_talked">Have Not Talked</option>
//                       <option value="talked">Talked</option>
//                       <option value="interview_call">Called for Interview</option>
//                       <option value="interviewed">Interviewed</option>
//                       <option value="hired">Hired</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                     <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>Submission Note</label>
//                   <div className="relative">
//                     <input 
//                       type="text" 
//                       placeholder="Audit log remark..." 
//                       value={remark}
//                       onChange={(e) => setRemark(e.target.value)}
//                       className={inputClass}
//                     />
//                     <MessageSquare size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
//                   </div>
//                 </div>
//               </div>

//               {/* INTERVIEW CONDITIONAL BOX */}
//               {selectedStatus === "interview_call" && (
//                 <div className="animate-in slide-in-from-top-4 fade-in duration-500 bg-blue-50/30 border-2 border-dashed border-blue-100 rounded-3xl p-6 grid grid-cols-2 gap-6">
//                   <div className="space-y-2 col-span-2">
//                     <div className="flex items-center gap-2 mb-2">
//                       <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
//                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Interview Schedule</span>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className={labelClass}>Date</label>
//                     <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className={`${inputClass} !bg-white`} />
//                   </div>
//                   <div className="space-y-2">
//                     <label className={labelClass}>Time</label>
//                     <input type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} className={`${inputClass} !bg-white`} />
//                   </div>
//                 </div>
//               )}

//               <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-3">
//                 <UserCheck size={18} strokeWidth={3} />
//                 Confirm Decision
//               </button>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: AUDIT TRAIL / PREVIOUS DECISIONS */}
//           <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col">
//             <div className="flex items-center gap-3 border-b border-slate-50 pb-5 mb-6">
//               <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">
//                 <History size={20} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Audit Trail</h3>
//             </div>

//             <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
//               {previousDecisions.map((item, idx) => (
//                 <div key={idx} className="relative pl-8 border-l-2 border-slate-100 pb-2 last:border-l-0">
//                   {/* Timeline Dot */}
//                   <div className="absolute -left-[9px] top-0 bg-white p-0.5">
//                     <CheckCircle2 size={16} className="text-emerald-500 bg-white" />
//                   </div>
                  
//                   <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 hover:border-blue-100 transition-colors">
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="text-[11px] font-black text-slate-900 uppercase">{item.status}</span>
//                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.date}</span>
//                     </div>
//                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">"{item.remark}"</p>
//                     <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
//                       <span className="text-[8px] font-black text-slate-400 uppercase">Logged By: <span className="text-blue-600">{item.user}</span></span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CandidateFlow;
//************************************************************************************************************ */
// import React, { useState } from 'react';
// import { 
//   Calendar, 
//   Clock, 
//   UserCheck, 
//   ChevronDown, 
//   ShieldCheck, 
//   MessageSquare,
//   Zap
// } from "lucide-react";

// const CandidateFlow = () => {
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [remark, setRemark] = useState("");
//   const [interviewDate, setInterviewDate] = useState("");
//   const [interviewTime, setInterviewTime] = useState("");

//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-2";
//   const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-[#2563eb] transition-all shadow-inner";

//   return (
//     <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-start">
//       {/* 🛡️ MAIN DECISION CARD */}
//       <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-10 relative overflow-hidden">
        
//         {/* Security Watermark Background */}
//         <ShieldCheck className="absolute -right-8 -top-8 text-blue-600 opacity-[0.03] -rotate-12 pointer-events-none" size={240} />

//         <div className="relative z-10 space-y-8">
//           {/* HEADER UNIT */}
//           <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
//             <div className="p-3 bg-blue-50 text-[#2563eb] rounded-2xl border border-blue-100">
//               <Zap size={24} strokeWidth={2.5} />
//             </div>
//             <div>
//               <span className={labelClass}>Workflow Protocol</span>
//               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Candidate Decision Flow</h2>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* 🔵 STATUS SELECTOR NODE */}
//             <div className="space-y-2">
//               <label className={labelClass}>System Status</label>
//               <div className="relative group">
//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className={`${inputClass} appearance-none pr-10 cursor-pointer group-hover:border-blue-300`}
//                 >
//                   <option value="">Select Protocol</option>
//                   <option value="not_talked">Have Not Talked</option>
//                   <option value="talked">Talked</option>
//                   <option value="interview_call">Called for Interview</option>
//                   <option value="interviewed">Interviewed</option>
//                   <option value="hired">Hired</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//                 <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#2563eb] transition-colors" />
//               </div>
//             </div>

//             {/* 🔴 REMARK INPUT NODE */}
//             <div className="space-y-2">
//               <label className={labelClass}>Process Remarks</label>
//               <div className="relative">
//                 <input 
//                   type="text" 
//                   placeholder="Enter detailed remark..." 
//                   value={remark}
//                   onChange={(e) => setRemark(e.target.value)}
//                   className={inputClass}
//                 />
//                 <MessageSquare size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
//               </div>
//             </div>
//           </div>

//           {/* 🟢 CONDITIONAL INTERVIEW NODE: Only shows when "interview_call" is active */}
//           {selectedStatus === "interview_call" && (
//             <div className="animate-in slide-in-from-top-4 fade-in duration-500 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[2rem] p-8 space-y-6">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
//                 <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Schedule Interview Protocol</span>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className={labelClass}>Proposed Date</label>
//                   <div className="relative">
//                     <input 
//                       type="date" 
//                       value={interviewDate}
//                       onChange={(e) => setInterviewDate(e.target.value)}
//                       className={`${inputClass} !bg-white`} 
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>Proposed Time</label>
//                   <div className="relative">
//                     <input 
//                       type="time" 
//                       value={interviewTime}
//                       onChange={(e) => setInterviewTime(e.target.value)}
//                       className={`${inputClass} !bg-white`} 
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ACTION BUTTON */}
//           <div className="pt-6 border-t border-slate-50">
//             <button className="w-full flex items-center justify-center gap-3 bg-[#2563eb] hover:bg-blue-700 text-white py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-200 active:scale-[0.98] group">
//               <UserCheck size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
//               Execute Decision
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CandidateFlow;