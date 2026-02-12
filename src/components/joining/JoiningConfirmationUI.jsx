import React, { useState } from 'react';
import { Calendar, MessageSquare, UserPlus, ShieldCheck, ArrowRight, Info, CheckCircle2, Clock, Fingerprint, ChevronDown, AlertCircle } from 'lucide-react';
import { documentSubmissionService } from "../../services/documentSubmission.service";
import toast from "react-hot-toast";

const JoiningConfirmationUI = ({ employee, onConfirmJoining }) => {
  const isJoined = employee?.joining_attendance_status === "joined";
  const employeeId = employee?.id || 0;

  const [date, setDate] = useState("");
  const [remark, setRemark] = useState("");
  const [joiningStatus, setJoiningStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // --- STATUS MAPPING ---
  const statusConfig = {
    joined: { label: "Joined", color: "text-emerald-600 bg-emerald-50 border-emerald-100", ping: "bg-emerald-500" },
    no_show: { label: "No Show", color: "text-rose-600 bg-rose-50 border-rose-100", ping: "bg-rose-500" },
    pending: { label: "Awaiting Action", color: "text-amber-600 bg-amber-50 border-amber-100", ping: "bg-amber-500" }
  };

  const currentStatus = statusConfig[employee?.joining_attendance_status] || statusConfig.pending;

  const handleConfirm = async () => {
    // if (!date) return alert("Please select joining date");
     if (!date) {
    toast.error("Please select joining date");
    return;
  }
    try {
      setLoading(true);
      const payload = { actual_joining_date: date, status: joiningStatus, remark: remark || "" };
      await documentSubmissionService.confirmJoining(employeeId, payload);
      // alert("Joining confirmed successfully");
       toast.success("Joining confirmed successfully");
      onConfirmJoining?.();
    } catch (err) {
      // alert(err.message);
       toast.error(err?.message || "Joining confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Pending";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  // --- JOINED STATE (Success View) ---
  if (isJoined) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-8">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HR Lifecycle v2.1</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Onboarding Finalized</h2>
                <p className="text-sm text-slate-500 font-medium">The employee has been officially inducted into the resourcing pool.</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <ShieldCheck className="text-emerald-600" size={24} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Official Joining Date</p>
                <div className="flex items-center gap-2 text-slate-800">
                  <Calendar size={16} className="text-blue-500" />
                  <span className="text-sm font-bold">{formatDate(employee?.actual_joining_date)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Profile Status</p>
                <div className="flex items-center gap-2 text-slate-800">
                  <UserPlus size={16} className="text-slate-400" />
                  {/* <span className="text-sm font-bold uppercase tracking-tight text-emerald-600">Active_Resourcing</span> */}
                   <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
               <Fingerprint className="absolute -right-4 -bottom-4 text-slate-100 rotate-12" size={100} />
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                   <MessageSquare size={14} className="text-slate-400" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HR Audit Remark</p>
                 </div>
                 <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                   "{employee?.joining_attendance_status || "Induction process completed according to standard protocol."}"
                 </p>
               </div>
            </div>
          </div>

          <div className="w-full md:w-72 bg-slate-50/50 border-l border-slate-100 p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">System Integration</h4>
              <ul className="space-y-4">
                {['Payroll Synchronized', 'ID Generation Complete', 'Asset Access Enabled'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[11px] font-bold text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* <button className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-700 rounded-xl">
              View Digital ID
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  // --- INPUT FORM STATE (Enterprise Redesign) ---
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden  shadow-sm">
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <UserPlus size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Joining Activation</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Awaiting Final Input</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actual Joining Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendance Status</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <select value={joiningStatus} onChange={(e) => setJoiningStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-10 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 appearance-none cursor-pointer outline-none transition-all"
                >
                  <option value="">Select Status</option>
                  <option value="joined">Joined</option>
                  <option value="no_show">No Show</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HR Final Remarks</label>
            <div className="relative group">
              <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <textarea rows={4} value={remark} onChange={(e) => setRemark(e.target.value)}
                placeholder="Induction notes, location details, or special instructions..."
                className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-4 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all resize-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Checklist */}
        <div className="w-full md:w-80 bg-slate-50/50 p-8 border-l border-slate-100 space-y-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Readiness Check</h4>
            <div className="space-y-3">
              {[
                { label: 'Joining Date Set', met: !!date },
                { label: 'Status Assigned', met: !!joiningStatus },
                { label: 'Audit Log Ready', met: remark.length > 5 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.met ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />}
                  <span className={`text-[11px] font-bold ${item.met ? 'text-slate-900' : 'text-slate-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Personnel Authorization Required</p>
        <button onClick={handleConfirm} disabled={loading}
          className="group flex items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-slate-200"
        >
          {loading ? "Processing..." : "Activate Profile"}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default JoiningConfirmationUI;
//************************************************working phase 2 07/02/26****************************************************************** */
// import React , {useState} from 'react';
// import { Calendar, MessageSquare, UserPlus, ShieldCheck, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
// import { documentSubmissionService } from "../../services/documentSubmission.service";

// const JoiningConfirmationUI = ({ employee }) => {
// const isJoined = employee?.joining_attendance_status === "joined";

//   console.log("data" , employee)

//   const employeeId = employee?.id || 0;


//   // const [date, setDate] = useState("");
//   // const [remark, setRemark] = useState("");
//   // const [joiningStatus, setJoiningStatus] = useState("joined");
//   // const [loading, setLoading] = useState(false);

//     const [date, setDate] = useState("");
//   const [remark, setRemark] = useState("");
//   const [joiningStatus, setJoiningStatus] = useState("");
//   const [loading, setLoading] = useState(false);

//   // --- API CALL ---
//   const handleConfirm = async () => {
//     if (!date) return alert("Please select joining date");
//     if (!employeeId) return alert("Employee ID missing");

//     try {
//       setLoading(true);

//       const payload = {
//         actual_joining_date: date,
//         status: joiningStatus,
//         remark: remark || "",
//       };

//       await documentSubmissionService.confirmJoining(employeeId, payload);

//       // onConfirmJoining && onConfirmJoining(payload); // keep existing logic
//        alert("Joining confirmed successfully");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };


//   new Date(employee?.actual_joining_date).toLocaleDateString("en-GB", {
//   day: "2-digit",
//   month: "short",
//   year: "numeric",
// })



//   // --- JOINED / ACTIVE STATE (Success View) ---
//   if (isJoined) {
//     return (
//       <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden animate-in fade-in zoom-in duration-700 border border-slate-100">
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white relative">
//           <div className="relative z-10 flex items-center gap-5">
//             <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
//               <ShieldCheck size={24} className="text-emerald-400" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold tracking-tight">Onboarding Complete</h2>
//               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Employee Profile is now Active</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
//           <div className="space-y-6">
//             <div className="flex flex-col gap-1">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                 <Calendar size={14} className="text-blue-600" /> Confirmed Joining
//               </span>
//               <span className="text-lg font-bold text-slate-800">
//                 {/* {joiningDate || "Feb 06, 2026"} */}
//                 {employee?.actual_joining_date || "—"}
//                 </span>
//             </div>
//             <div className="flex flex-col gap-1">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                 <UserPlus size={14} className="text-blue-600" /> Lifecycle Stage
//               </span>
//               <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 w-fit">
//                 ACTIVE_RESOURCING
//               </span>
//             </div>
//           </div>

//           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">HR Audit Remarks</span>
//             <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
//               {/* "{remarks || "System access provisioned and payroll sync completed successfully."}" */}
//                "{employee?.remark || "Joining recorded successfully"}"
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- PENDING JOINING STATE (Input View) ---
//   return (
//     <div className="w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 transition-all">
//       {/* Refined Header */}
//       <div className="px-8 py-6 border-b border-slate-50 bg-white flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-bold text-slate-900 tracking-tight">Joining Confirmation</h2>
//           <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-widest">Employee Final Activation</p>
//         </div>
//         <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
//           <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
//           <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Awaiting Payload</span>
//         </div>
//       </div>

//       <div className="p-8 space-y-8">
//         {/* Single Focused Row for Joining Date */}
//         <div className="max-w-md flex flex-col gap-2 group">
//           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-600 transition-colors">
//             Official Joining Date
//           </label>
//           <div className="relative">
//             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-all" size={18} />
//             <input 
//               type="date" 
//               value={date}
//   onChange={(e) => setDate(e.target.value)}
//               className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 text-sm font-bold text-slate-800 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
//             />
//           </div>
//         </div>

//          {/* STATUS DROPDOWN */}
//         <div>
//           <label className="text-xs font-bold text-slate-500">Joining Status</label>
//           <select
//             value={joiningStatus}
//             onChange={(e) => setJoiningStatus(e.target.value)}
//             className="w-full border rounded-xl px-4 py-2 mt-1"
//           >
//             <option value="joined">Joined</option>
//             <option value="no_show">No Show</option>
//           </select>
//         </div>

//         {/* Remarks Section - Full Width but scaled text */}
//         <div className="flex flex-col gap-2 group">
//           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-600 transition-colors">
//             Final Activation Remarks
//           </label>
//           <textarea 
//             rows={4}
//             value={remark}
//   onChange={(e) => setRemark(e.target.value)}
//             placeholder="Notes regarding office location, induction schedule, or special instructions..."
//             className="w-full bg-white border border-slate-200 px-5 py-4 text-sm font-medium text-slate-800 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none shadow-sm"
//           />
//         </div>

//         {/* Compliance Note - Subtle design */}
//         <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex gap-4">
//           <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600 h-fit">
//             <Info size={18} />
//           </div>
//           <div className="space-y-1">
//             <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">System Impact Notice</p>
//             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
//               Activating this profile will trigger system-wide payroll integration and generate official credentials. Ensure data accuracy before finalization.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Refined Action Footer */}
//       <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-4">
//         <button className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors px-4 py-2">
//           Discard Draft
//         </button>
//         <button
//           onClick={handleConfirm}
//             disabled={loading}
//           className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
//         >
//           <CheckCircle2 size={16} />
//          {loading ? "Activating..." : "Activate Profile"}
//           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JoiningConfirmationUI;
//*************************************************working code phase 2 7/02/26*************************************************************** */
// import React from 'react';
// import { Calendar, MessageSquare, UserPlus, ShieldCheck, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

// const JoiningConfirmationUI = ({ status, joiningDate, remarks, onConfirmJoining }) => {
//   const isJoined = status === "active";

//   // --- JOINED / ACTIVE STATE (Success View) ---
//   if (isJoined) {
//     return (
//       <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden animate-in fade-in zoom-in duration-700 border border-slate-100">
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white relative">
//           <div className="relative z-10 flex items-center gap-5">
//             <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
//               <ShieldCheck size={24} className="text-emerald-400" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold tracking-tight">Onboarding Complete</h2>
//               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Employee Profile is now Active</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
//           <div className="space-y-6">
//             <div className="flex flex-col gap-1">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                 <Calendar size={14} className="text-blue-600" /> Confirmed Joining
//               </span>
//               <span className="text-lg font-bold text-slate-800">{joiningDate || "Feb 06, 2026"}</span>
//             </div>
//             <div className="flex flex-col gap-1">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                 <UserPlus size={14} className="text-blue-600" /> Lifecycle Stage
//               </span>
//               <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 w-fit">
//                 ACTIVE_RESOURCING
//               </span>
//             </div>
//           </div>

//           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">HR Audit Remarks</span>
//             <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
//               "{remarks || "System access provisioned and payroll sync completed successfully."}"
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- PENDING JOINING STATE (Input View) ---
//   return (
//     <div className="w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 transition-all">
//       {/* Refined Header */}
//       <div className="px-8 py-6 border-b border-slate-50 bg-white flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-bold text-slate-900 tracking-tight">Joining Confirmation</h2>
//           <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-widest">Employee Final Activation</p>
//         </div>
//         <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
//           <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
//           <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Awaiting Payload</span>
//         </div>
//       </div>

//       <div className="p-8 space-y-8">
//         {/* Single Focused Row for Joining Date */}
//         <div className="max-w-md flex flex-col gap-2 group">
//           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-600 transition-colors">
//             Official Joining Date
//           </label>
//           <div className="relative">
//             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-all" size={18} />
//             <input 
//               type="date" 
//               className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 text-sm font-bold text-slate-800 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Remarks Section - Full Width but scaled text */}
//         <div className="flex flex-col gap-2 group">
//           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-blue-600 transition-colors">
//             Final Activation Remarks
//           </label>
//           <textarea 
//             rows={4}
//             placeholder="Notes regarding office location, induction schedule, or special instructions..."
//             className="w-full bg-white border border-slate-200 px-5 py-4 text-sm font-medium text-slate-800 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none shadow-sm"
//           />
//         </div>

//         {/* Compliance Note - Subtle design */}
//         <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex gap-4">
//           <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600 h-fit">
//             <Info size={18} />
//           </div>
//           <div className="space-y-1">
//             <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">System Impact Notice</p>
//             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
//               Activating this profile will trigger system-wide payroll integration and generate official credentials. Ensure data accuracy before finalization.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Refined Action Footer */}
//       <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-4">
//         <button className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors px-4 py-2">
//           Discard Draft
//         </button>
//         <button
//           onClick={onConfirmJoining}
//           className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
//         >
//           <CheckCircle2 size={16} />
//           Activate Profile
//           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JoiningConfirmationUI;
//**********************************************************working code phase 1************************************************************** */
// import React from 'react';
// import { Calendar, MessageSquare, UserPlus, ShieldCheck, ArrowRight, Briefcase, Info } from 'lucide-react';

// const JoiningConfirmationUI = ({ status, joiningDate, remarks, onConfirmJoining }) => {
//   const isJoined = status === "active"; // Or "onboarded"

//   // --- JOINED / ACTIVE STATE (Success View) ---
//   if (isJoined) {
//     return (
//       <div className="w-full bg-white rounded-[2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
//         <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-12 text-white relative overflow-hidden">
//           {/* Decorative background element */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          
//           <div className="relative z-10 flex flex-col items-center md:items-start gap-6">
//             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
//               <UserPlus size={40} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-4xl font-black tracking-tight">Onboarding Finalized</h2>
//               <p className="text-blue-100 font-bold text-xs mt-2 uppercase tracking-[0.3em] flex items-center gap-2">
//                 <ShieldCheck size={16} /> Status: Resource Officially Active
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="p-12 bg-white">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//             <div className="space-y-8">
//               <div className="flex flex-col gap-1">
//                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Calendar size={14} className="text-blue-600" /> Official Joining Date
//                 </span>
//                 <span className="text-2xl font-bold text-slate-800">{joiningDate || "Feb 06, 2026"}</span>
//               </div>
              
//               <div className="flex flex-col gap-1">
//                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Briefcase size={14} className="text-blue-600" /> Employment ID
//                 </span>
//                 <span className="text-2xl font-bold text-slate-800 tracking-tight">EMP_REF_99012</span>
//               </div>
//             </div>

//             <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-center">
//               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
//                 <MessageSquare size={14} /> Final Onboarding Remarks
//               </span>
//               <p className="text-slate-600 font-medium italic leading-relaxed">
//                 "{remarks || "Resource has completed all prerequisites. System access and hardware allocation have been triggered based on the confirmed start date."}"
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- PENDING JOINING STATE (Input View) ---
//   return (
//     <div className="w-full bg-white rounded-[2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)]">
//       {/* Module Header */}
//       <div className="px-12 py-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-end">
//         <div>
//           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Joining Confirmation</h2>
//           <p className="text-[10px] text-blue-600 mt-2 uppercase font-black tracking-[0.25em]">Final Lifecycle Stage / HCM-Core-V3</p>
//         </div>
//         <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
//           <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
//           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Date Sync</span>
//         </div>
//       </div>

//       <div className="p-12 space-y-12">
//         {/* Entry Information */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           <div className="flex flex-col gap-3 group">
//             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
//               Confirmed Joining Date
//             </label>
//             <div className="relative">
//               <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all" size={22} />
//               <input 
//                 type="date" 
//                 className="w-full bg-white border-2 border-slate-100 pl-14 pr-6 py-5 text-lg font-bold text-slate-800 rounded-2xl focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col gap-3">
//             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Payroll Cycle Start</label>
//             <div className="relative">
//               <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-200" size={22} />
//               <input 
//                 disabled 
//                 placeholder="AUTO_SYNC_UPON_CONFIRMATION" 
//                 className="w-full bg-slate-50 border-2 border-slate-50 pl-14 pr-6 py-5 text-sm font-bold text-slate-400 rounded-2xl cursor-not-allowed italic"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Remarks Section */}
//         <div className="flex flex-col gap-3 group">
//           <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
//             HR Deployment Remarks
//           </label>
//           <div className="relative">
//             <textarea 
//               rows={5}
//               placeholder="Enter final deployment notes, office location details, or orientation schedule..."
//               className="w-full bg-white border-2 border-slate-100 px-8 py-6 text-md font-bold text-slate-800 rounded-3xl focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 outline-none transition-all resize-none shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Professional Compliance Alert */}
//         <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex items-center gap-5">
//           <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
//             <Info size={24} />
//           </div>
//           <div>
//             <p className="text-sm font-bold text-slate-800">Final Confirmation Impact</p>
//             <p className="text-xs text-slate-600 font-medium leading-relaxed">
//               Confirming this action will trigger automatic welcome emails and provision the employee's workstation identity. Ensure the joining date matches the signed appointment letter.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Action Footer */}
//       <div className="px-12 py-8 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-between">
//         <button className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
//           Discard Draft
//         </button>
//         <button
//           onClick={onConfirmJoining}
//           className="group flex items-center gap-3 px-12 py-5 bg-slate-900 hover:bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.03] active:scale-[0.97]"
//         >
//           Activate Employee Profile
//           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JoiningConfirmationUI;