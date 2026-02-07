import React from 'react';
import { Calendar, MessageSquare, Clock, ShieldCheck, ArrowRight, Fingerprint, CheckCircle2, AlertCircle, Shield, Lock, ChevronDown } from 'lucide-react';
import { documentSubmissionService } from "../../services/documentSubmission.service";

const DocumentSubmissionUI = ({ status, submissionDate, remarks, onDocumentSubmit, employeeId, employee }) => {
  const isSubmitted = status === "submitted";

  const [date, setDate] = React.useState(submissionDate || "");
  const [remark, setRemark] = React.useState(remarks || "");
  const [docStatus, setDocStatus] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Checks for the checklist UI
  const isDateValid = !!date;
  const isRemarkValid = remark.trim().length >= 20;

  const handleSubmit = async () => {
    if (!date) {
      alert("Please select submission date");
      return;
    }
    if (remark.trim().length < 20) {
      alert("Remark must be minimum 20 characters");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        date: date,
        status: docStatus,
        remark: remark,
      };
      await documentSubmissionService.submit(employeeId, payload);
      alert("Document submitted successfully");
      onDocumentSubmit?.();
    } catch (error) {
      alert(error.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "06 Feb 2026";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (val) => {
  if (!val) return "Submitted";

  return val
    .toString()
    .replace(/_/g, " ")            // submitted_pending → submitted pending
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize Words
};


  // if (isSubmitted) {
  //   return (
  //     <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
  //       <div className="bg-emerald-50/30 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
  //         <div className="flex items-center gap-3">
  //           <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
  //             <ShieldCheck className="text-white" size={18} />
  //           </div>
  //           <div>
  //             <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">Status: Authenticated</p>
  //             <h2 className="text-sm font-bold text-slate-900 mt-1">Physical Document Submitted</h2>
  //           </div>
  //         </div>
  //         <span className="text-[9px] font-mono font-bold bg-white text-slate-500 px-2 py-1 rounded border border-slate-200 uppercase">
  //           ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
  //         </span>
  //       </div>
        
  //       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
  //         {[
  //           { label: "Submission Date", val: formatDate(employee?.doc_submission_date), icon: <Calendar size={14}/> },
  //           { label: "Audit Log", val: "System Logged & Encrypted", icon: <Clock size={14}/> }
  //         ].map((stat, i) => (
  //           <div key={i} className="px-6 py-2 first:pl-0 last:pr-0">
  //             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
  //               {stat.icon} {stat.label}
  //             </span>
  //             <p className="text-xs font-bold text-slate-800 tracking-tight">{stat.val}</p>
  //           </div>
  //         ))}
  //       </div>

  //       <div className="p-6 bg-slate-50/30">
  //         <div className="flex gap-4 items-start">
  //           <Fingerprint className="text-slate-300 mt-1" size={20} />
  //           <div className="space-y-1">
  //             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Signature Remarks</span>
  //             <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
  //               "{remarks || "The automated validation engine has confirmed all document headers match the employee profile."}"
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  
  // --- SUBMITTED / VERIFIED STATE (Enterprise Redesign) ---
  if (isSubmitted) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row">
          
          {/* Main Content Area */}
          <div className="flex-1 p-8">
            {/* Top Row: Title and Status */}
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                    {employee?.doc_submission_status || status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Archive V4</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Physical Document Submitted</h2>
                <p className="text-sm text-slate-500 font-medium">The physical documents have been successfully received and recorded.</p>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="text-emerald-600" size={24} />
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Submission Date</p>
                <div className="flex items-center gap-2 text-slate-800">
                  <Calendar size={16} className="text-blue-500" />
                  <span className="text-sm font-bold">{formatDate(employee?.doc_submission_date)}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Documetment Status</p>
                <div className="flex items-center gap-2 text-slate-800">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-sm font-mono font-bold">
                     {formatStatus(employee?.doc_submission_status || status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Remarks Block */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
               {/* Decorative Background Icon */}
               <Fingerprint className="absolute -right-4 -bottom-4 text-slate-100 rotate-12" size={100} />
               
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                   <MessageSquare size={14} className="text-slate-400" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Submission Remarks</p>
                 </div>
                 <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                   "{employee?.doc_submission_status || remarks || "No additional remarks were provided during document submission."}"
                 </p>
               </div>
            </div>
          </div>

          {/* Sidebar Area (Metadata & Actions) */}
          <div className="w-full md:w-72 bg-slate-50/50 border-l border-slate-100 p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4"> Record Details</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold text-slate-600">Secure Record Stored</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold text-slate-600">Submission Logged</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-bold text-slate-600">Documents Received</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Step</p>
                <p className="text-xs text-slate-500 leading-tight">Proceed to  <strong>verification</strong> for final approval.</p>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            <Fingerprint size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Physical Document Submission</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Compliance V4</p>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest underline decoration-blue-200 underline-offset-2 cursor-help">Protocol Active</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">Status</span>
            <span className="text-[10px] font-bold text-amber-500 uppercase leading-none mt-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Awaiting Entry
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="flex-1 p-8 space-y-6 border-r border-slate-50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Submission Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                />
              </div>
            </div>

            {/* Professional Status Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <select
                  value={docStatus}
                  onChange={(e) => setDocStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-10 py-2.5 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Protocol</option>
                  <option value="submitted">Submitted</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                  <option value="no_show">No Show</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Remarks Textarea */}
          <div className="space-y-2">
            <div className="flex justify-between">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Submission Remarks</label>
               <span className={`text-[9px] font-bold uppercase ${remark.length >= 20 ? 'text-emerald-500' : 'text-slate-300'}`}>
                 {remark.length} / 20 chars min
               </span>
            </div>
            <div className="relative group">
              <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <textarea 
                rows={5}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Detail the contents of this digital package for the audit log..."
                className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-4 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-80 bg-slate-50/50 p-8 space-y-6 border-l border-slate-100">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-2">
              Workflow Status
            </h4>
            
            <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Readiness Check</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded leading-none ${isDateValid && isRemarkValid ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                  {isDateValid && isRemarkValid ? 'Ready' : 'Pending'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {isDateValid ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />}
                  <span className={`text-[11px] font-medium ${isDateValid ? 'text-slate-900' : 'text-slate-400'}`}>Valid Submission Date</span>
                </div>
                <div className="flex items-center gap-3">
                  {isRemarkValid ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />}
                  <span className={`text-[11px] font-medium ${isRemarkValid ? 'text-slate-900' : 'text-slate-400'}`}>Audit Remarks (20+ chars)</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  {isDateValid && isRemarkValid 
                    ? "Authorization criteria met. You may now finalize the submission."
                    : "Complete all required fields to authorize the transition to the Verification Review module."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer bar */}
      <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Core-Node: Compliance-01</p>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`group flex items-center gap-3 px-8 py-3 rounded-xl transition-all active:scale-95 shadow-lg 
            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black text-white shadow-slate-200'}`}
        >
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <CheckCircle2 size={14} className="text-emerald-400" />
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {loading ? "Processing..." : "Finalize & Commit"}
          </span>
          {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </div>
    </div>
  );
};

export default DocumentSubmissionUI;
//*************************************************working code phase 1 7/02/26********************************************************** */
// import React from 'react';
// import { Calendar, MessageSquare, Clock, ShieldCheck, ArrowRight, Fingerprint, CheckCircle2, AlertCircle,Lock, HardDrive, Shield } from 'lucide-react';
// import { documentSubmissionService } from "../../services/documentSubmission.service";

// const DocumentSubmissionUI = ({ status, submissionDate, remarks, onDocumentSubmit , employeeId, employee }) => {
//   const isSubmitted = status === "submitted";

//   const [date, setDate] = React.useState(submissionDate || "");
//   const [remark, setRemark] = React.useState(remarks || "");
//   const [docStatus, setDocStatus] = React.useState("");
//   const [loading, setLoading] = React.useState(false);

//   // ------------------ API SUBMIT ------------------
//   const handleSubmit = async () => {
//     if (!date) {
//       alert("Please select submission date");
//       return;
//     }

//     if (remark.trim().length < 20) {
//       alert("Remark must be minimum 20 characters");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         date: date,
//         status: docStatus,
//         remark: remark,
//       };

//       await documentSubmissionService.submit(employeeId, payload);

//       alert("Document submitted successfully");

//       onDocumentSubmit?.(); // refresh parent data if needed
//     } catch (error) {
//       alert(error.message || "Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const formatDate = (dateStr) => {
//   if (!dateStr) return "06 Feb 2026";

//   const d = new Date(dateStr);

//   return d.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };


//   // --- SUBMITTED / VERIFIED STATE ---
//   if (isSubmitted) {
//     return (
//       <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
//         <div className="bg-emerald-50/30 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
//               <ShieldCheck className="text-white" size={18} />
//             </div>
//             <div>
//               <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">Status: Authenticated</p>
//               <h2 className="text-sm font-bold text-slate-900 mt-1">Physical Document Submitted</h2>
//             </div>
//           </div>
//           <span className="text-[9px] font-mono font-bold bg-white text-slate-500 px-2 py-1 rounded border border-slate-200 uppercase">
//             ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
//           </span>
//         </div>
        
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
//           {[
//             { label: "Submission Date", val: formatDate(employee?.doc_submission_date), icon: <Calendar size={14}/> },
//             { label: "Audit Log", val: "System Logged & Encrypted", icon: <Clock size={14}/> }
//           ].map((stat, i) => (
//             <div key={i} className="px-6 py-2 first:pl-0 last:pr-0">
//               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
//                 {stat.icon} {stat.label}
//               </span>
//               <p className="text-xs font-bold text-slate-800 tracking-tight">{stat.val}</p>
//             </div>
//           ))}
//         </div>

//         <div className="p-6 bg-slate-50/30">
//           <div className="flex gap-4 items-start">
//             <Fingerprint className="text-slate-300 mt-1" size={20} />
//             <div className="space-y-1">
//               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Signature Remarks</span>
//               <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
//                 "{remarks || "The automated validation engine has confirmed all document headers match the employee profile."}"
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- ACTIVE FORM STATE ---
//   return (
//     <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//       {/* Header with Breadcrumb-style detail */}
//       <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//             <Fingerprint size={20} />
//           </div>
//           <div>
//             <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Submission Portal</h2>
//             <div className="flex items-center gap-2 mt-0.5">
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Compliance V4</p>
//               <span className="h-1 w-1 rounded-full bg-slate-300" />
//               <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest underline decoration-blue-200 underline-offset-2 cursor-help">View Protocol Details</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//             <div className="hidden md:flex flex-col items-end mr-2">
//                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">Network</span>
//                 <span className="text-[10px] font-bold text-emerald-500 uppercase leading-none mt-1 flex items-center gap-1">
//                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Encrypted
//                 </span>
//             </div>
//             <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
//             <AlertCircle size={18} className="text-slate-300 hover:text-blue-500 transition-colors cursor-pointer" />
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row">
//         {/* Left Column: Form Inputs */}
//         <div className="flex-1 p-8 space-y-8 border-r border-slate-50">
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Submission Date</label>
//                 <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded">Current UTC</span>
//               </div>
//               <div className="relative group">
//                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//                 <input 
//                   type="date" 
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
//                 />
//               </div>
//             </div>

//              {/* STATUS */}
//         <div>
//           <label className="text-xs font-bold">Status</label>
//           <select
//             value={docStatus}
//             // onChange={(e) => setDocStatus(e.target.value)}
//              onChange={(e) => {
//     console.log("Selected status:", e.target.value);
//     setDocStatus(e.target.value);
//   }}
//             className="w-full mt-2 border rounded-lg px-3 py-2"
//           >
//             <option value="">select any value</option>
//             <option value="submitted">Submitted</option>
//             <option value="verified">Verified</option>
//             <option value="rejected">Rejected</option>
//             <option value="no_show">No Show</option>
//           </select>
//         </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Trail Notes</label>
//               <div className="relative group">
//                 <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//                 <textarea 
//                   rows={5}
//                   value={remark}
//   onChange={(e) => setRemark(e.target.value)}
//                   placeholder="Detail the contents of this digital package for the audit log..."
//                   className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-4 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column: System metadata (Fills the visual gap) */}
       
//         <div className="w-full md:w-80 bg-slate-50/50 p-8 space-y-6 border-l border-slate-100">
//   {/* MODULE STATUS SECTION */}
//   <div className="space-y-4">
//     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-2">
//       Workflow Progress
//     </h4>
//   </div>

//   {/* SUBMISSION REQUIREMENTS CHECKLIST */}
//   <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
//     <div className="flex justify-between items-center">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Readiness Check</p>
//       <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded leading-none">Pending</span>
//     </div>
    
//     <div className="space-y-3">
//       <div className="flex items-center gap-3">
//         {/* If date is picked, change to emerald CheckCircle2 */}
//         <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
//         <span className="text-[11px] text-slate-600 font-medium">Valid Submission Date</span>
//       </div>
//       <div className="flex items-center gap-3">
//         <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
//         <span className="text-[11px] text-slate-600 font-medium">Audit Remarks (Min 20 chars)</span>
//       </div>
//     </div>

//     {/* Dynamic helper text */}
//     <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
//       <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
//         Complete all required fields to authorize the transition to the <span className="text-slate-900 font-bold">Verification Review</span> module.
//       </p>
//     </div>
//   </div>

// </div>
//       </div>

//       {/* Footer bar */}
//       <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
//         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        
//         <button
//           // onClick={onDocumentSubmit}
//            onClick={handleSubmit}
//           disabled={loading}
//           className="group flex items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
//         >
//           <CheckCircle2 size={14} className="text-emerald-400" />
//           {/* Finalize & Commit */}
//             {loading ? "Submitting..." : "Finalize & Commit"}
//           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DocumentSubmissionUI;
//*********************************************working code phase 1122************************************************************************* */
// import React from 'react';
// import { Calendar, MessageSquare, Clock, ShieldCheck, ArrowRight, Fingerprint, CheckCircle2, AlertCircle,Lock, HardDrive, Shield } from 'lucide-react';
// import { documentSubmissionService } from "../../services/documentSubmission.service";

// const DocumentSubmissionUI = ({ status, submissionDate, remarks, onDocumentSubmit , employeeId = 22 }) => {
//   const isSubmitted = status === "submitted";

//   const [date, setDate] = React.useState(submissionDate || "");
//   const [remark, setRemark] = React.useState(remarks || "");
//   const [docStatus, setDocStatus] = React.useState("");
//   const [loading, setLoading] = React.useState(false);

//   // ------------------ API SUBMIT ------------------
//   const handleSubmit = async () => {
//     if (!date) {
//       alert("Please select submission date");
//       return;
//     }

//     if (remark.trim().length < 20) {
//       alert("Remark must be minimum 20 characters");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         date: date,
//         status: docStatus,
//         remark: remark,
//       };

//       await documentSubmissionService.submit(employeeId, payload);

//       alert("Document submitted successfully");

//       onDocumentSubmit?.(); // refresh parent data if needed
//     } catch (error) {
//       alert(error.message || "Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- SUBMITTED / VERIFIED STATE ---
//   if (isSubmitted) {
//     return (
//       <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
//         <div className="bg-emerald-50/30 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
//               <ShieldCheck className="text-white" size={18} />
//             </div>
//             <div>
//               <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">Status: Authenticated</p>
//               <h2 className="text-sm font-bold text-slate-900 mt-1">Digital Package Verified</h2>
//             </div>
//           </div>
//           <span className="text-[9px] font-mono font-bold bg-white text-slate-500 px-2 py-1 rounded border border-slate-200 uppercase">
//             ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
//           </span>
//         </div>
        
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
//           {[
//             { label: "Submission Date", val: submissionDate || "06 Feb 2026", icon: <Calendar size={14}/> },
//             { label: "Audit Log", val: "System Logged & Encrypted", icon: <Clock size={14}/> }
//           ].map((stat, i) => (
//             <div key={i} className="px-6 py-2 first:pl-0 last:pr-0">
//               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
//                 {stat.icon} {stat.label}
//               </span>
//               <p className="text-xs font-bold text-slate-800 tracking-tight">{stat.val}</p>
//             </div>
//           ))}
//         </div>

//         <div className="p-6 bg-slate-50/30">
//           <div className="flex gap-4 items-start">
//             <Fingerprint className="text-slate-300 mt-1" size={20} />
//             <div className="space-y-1">
//               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Signature Remarks</span>
//               <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
//                 "{remarks || "The automated validation engine has confirmed all document headers match the employee profile."}"
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- ACTIVE FORM STATE ---
//   return (
//     <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//       {/* Header with Breadcrumb-style detail */}
//       <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
//             <Fingerprint size={20} />
//           </div>
//           <div>
//             <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Submission Portal</h2>
//             <div className="flex items-center gap-2 mt-0.5">
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Compliance V4</p>
//               <span className="h-1 w-1 rounded-full bg-slate-300" />
//               <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest underline decoration-blue-200 underline-offset-2 cursor-help">View Protocol Details</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//             <div className="hidden md:flex flex-col items-end mr-2">
//                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">Network</span>
//                 <span className="text-[10px] font-bold text-emerald-500 uppercase leading-none mt-1 flex items-center gap-1">
//                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Encrypted
//                 </span>
//             </div>
//             <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
//             <AlertCircle size={18} className="text-slate-300 hover:text-blue-500 transition-colors cursor-pointer" />
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row">
//         {/* Left Column: Form Inputs */}
//         <div className="flex-1 p-8 space-y-8 border-r border-slate-50">
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Submission Date</label>
//                 <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded">Current UTC</span>
//               </div>
//               <div className="relative group">
//                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//                 <input 
//                   type="date" 
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
//                 />
//               </div>
//             </div>

//              {/* STATUS */}
//         <div>
//           <label className="text-xs font-bold">Status</label>
//           <select
//             value={docStatus}
//             onChange={(e) => setDocStatus(e.target.value)}
//             className="w-full mt-2 border rounded-lg px-3 py-2"
//           >
//             <option value="submitted">Submitted</option>
//             <option value="verified">Verified</option>
//             <option value="rejected">Rejected</option>
//             <option value="no_show">No Show</option>
//           </select>
//         </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Trail Notes</label>
//               <div className="relative group">
//                 <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//                 <textarea 
//                   rows={5}
//                   value={remark}
//   onChange={(e) => setRemark(e.target.value)}
//                   placeholder="Detail the contents of this digital package for the audit log..."
//                   className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-4 text-xs font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column: System metadata (Fills the visual gap) */}
//         {/* <div className="w-full md:w-80 bg-slate-50/50 p-8 space-y-6">
//             <div className="space-y-4">
//                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-2">Technical Specs</h4>
                
//                 <div className="space-y-4">
//                     <div className="flex gap-3 items-center">
//                         <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400"><HardDrive size={14}/></div>
//                         <div>
//                             <p className="text-[9px] font-black text-slate-500 uppercase">Target Node</p>
//                             <p className="text-[11px] font-bold text-slate-700">COMPLIANCE-MAIN-01</p>
//                         </div>
//                     </div>
                    
//                     <div className="flex gap-3 items-center">
//                         <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400"><Shield size={14}/></div>
//                         <div>
//                             <p className="text-[9px] font-black text-slate-500 uppercase">Integrity Check</p>
//                             <p className="text-[11px] font-bold text-slate-700">SHA-256 Enabled</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Auto-Validation</p>
//                 <div className="flex justify-between items-center">
//                     <span className="text-[11px] font-bold text-slate-700">Metadata Scans</span>
//                     <span className="text-[10px] font-bold text-blue-600">Active</span>
//                 </div>
//                 <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
//                     <div className="bg-blue-500 h-full w-[65%]" />
//                 </div>
//             </div>
//         </div> */}
//         <div className="w-full md:w-80 bg-slate-50/50 p-8 space-y-6 border-l border-slate-100">
//   {/* MODULE STATUS SECTION */}
//   <div className="space-y-4">
//     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-2">
//       Workflow Progress
//     </h4>
    
//     {/* <div className="relative pl-4 space-y-6 border-l border-slate-200">

//       <div className="relative">
//         <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-50" />
//         <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight">Active Module</p>
//         <p className="text-[11px] font-bold text-slate-700">Document Intake</p>
//       </div>

    
//       <div className="relative opacity-50">
//         <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-slate-300" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Up Next</p>
//         <p className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
//           Verification Review <Lock size={10} />
//         </p>
//       </div>
//     </div> */}
//   </div>

//   {/* SUBMISSION REQUIREMENTS CHECKLIST */}
//   <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
//     <div className="flex justify-between items-center">
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Readiness Check</p>
//       <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded leading-none">Pending</span>
//     </div>
    
//     <div className="space-y-3">
//       <div className="flex items-center gap-3">
//         {/* If date is picked, change to emerald CheckCircle2 */}
//         <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
//         <span className="text-[11px] text-slate-600 font-medium">Valid Submission Date</span>
//       </div>
//       <div className="flex items-center gap-3">
//         <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
//         <span className="text-[11px] text-slate-600 font-medium">Audit Remarks (Min 20 chars)</span>
//       </div>
//     </div>

//     {/* Dynamic helper text */}
//     <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
//       <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
//         Complete all required fields to authorize the transition to the <span className="text-slate-900 font-bold">Verification Review</span> module.
//       </p>
//     </div>
//   </div>

// </div>
//       </div>

//       {/* Footer bar */}
//       <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
//         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        
//         <button
//           // onClick={onDocumentSubmit}
//            onClick={handleSubmit}
//           disabled={loading}
//           className="group flex items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
//         >
//           <CheckCircle2 size={14} className="text-emerald-400" />
//           {/* Finalize & Commit */}
//             {loading ? "Submitting..." : "Finalize & Commit"}
//           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DocumentSubmissionUI;
//*************************************************working code phase 33*************************************************** */
// import React from 'react';
// import { Calendar, MessageSquare, Clock, ShieldCheck, ArrowRight, Fingerprint, CheckCircle2, AlertCircle } from 'lucide-react';

// const DocumentSubmissionUI = ({ status, submissionDate, remarks, onDocumentSubmit }) => {
//   const isSubmitted = status === "submitted";

//   // --- SUBMITTED / VERIFIED STATE ---
//   if (isSubmitted) {
//     return (
//       <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
//         <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
//               <ShieldCheck className="text-white" size={18} />
//             </div>
//             <div>
//               <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">Status: Authenticated</p>
//               <h2 className="text-sm font-bold text-slate-900 mt-1">Digital Package Verified</h2>
//             </div>
//           </div>
//           <span className="text-[9px] font-bold bg-white text-emerald-600 px-2 py-1 rounded border border-emerald-200 uppercase tracking-tighter">
//             TS-{Date.now().toString().slice(-6)}
//           </span>
//         </div>
        
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
//           {[
//             { label: "Submission Date", val: submissionDate || "06 Feb 2026", icon: <Calendar size={14}/> },
//             { label: "Audit Log", val: "System Logged & Encrypted", icon: <Clock size={14}/> }
//           ].map((stat, i) => (
//             <div key={i} className="px-6 py-4 first:pl-0 last:pr-0">
//               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
//                 {stat.icon} {stat.label}
//               </span>
//               <p className="text-xs font-bold text-slate-800 tracking-tight">{stat.val}</p>
//             </div>
//           ))}
//         </div>

//         <div className="p-6 bg-slate-50/30">
//           <div className="flex gap-4 items-start">
//             <div className="mt-1 text-slate-300">
//               <Fingerprint size={20} />
//             </div>
//             <div className="space-y-1">
//               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Signature Remarks</span>
//               <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
//                 "{remarks || "The automated validation engine has confirmed all document headers match the employee profile."}"
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- ACTIVE FORM STATE ---
//   return (
//     <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
//       {/* Refined Modular Header */}
//       <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-inner">
//             <Fingerprint size={20} />
//           </div>
//           <div>
//             <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Submission Portal</h2>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Internal Compliance V4</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
//           <AlertCircle size={12} className="text-blue-500" />
//           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Payload</span>
//         </div>
//       </div>

//       {/* Input Section */}
//       <div className="p-8 space-y-8 bg-white">
        
//         {/* Date Input occupying specific width for better balance */}
//         <div className="max-w-md space-y-2">
//           <div className="flex justify-between items-center">
//             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Submission Date</label>
//             <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter italic">Official Timestamp</span>
//           </div>
//           <div className="relative group">
//             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//             <input 
//               type="date" 
//               className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-lg focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
//             />
//           </div>
//         </div>

//         {/* Textarea Section */}
//         <div className="space-y-2">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Trail Notes</label>
//           <div className="relative group">
//             <MessageSquare className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//             <textarea 
//               rows={4}
//               placeholder="Detail the contents of this digital package for the audit log..."
//               className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-3.5 text-xs font-bold text-slate-800 rounded-lg focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Action Bar */}
//       <div className="px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
//         <div className="hidden sm:flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
//           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Ready for secure transit</p>
//         </div>

//         <button
//           onClick={onDocumentSubmit}
//           className="group flex items-center gap-3 px-8 py-2.5 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-md transition-all active:scale-95"
//         >
//           <CheckCircle2 size={14} />
//           Complete Submission
//           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DocumentSubmissionUI;
//**************************************************working code phase 2****************************************************** */
// import React from 'react';
// import { CheckCircle2, FileText, Calendar, MessageSquare, Clock, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

// const DocumentSubmissionUI = ({ status, submissionDate, remarks, onDocumentSubmit }) => {
//   const isSubmitted = status === "submitted";

//   // --- SUBMITTED / ARCHIVED STATE ---
//   if (isSubmitted) {
//     return (
//       <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
//         <div className="bg-slate-900 p-6 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
//               <ShieldCheck className="text-emerald-500" size={20} />
//             </div>
//             <div>
//               <h2 className="text-sm font-black text-white uppercase tracking-wider">Vault Submission Verified</h2>
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Reference Hash: #2026-DX-09</p>
//             </div>
//           </div>
//           <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-500 uppercase tracking-widest">
//             Audit Ready
//           </div>
//         </div>
        
//         <div className="p-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//             {[
//               { label: "Record Date", val: submissionDate || "Feb 06, 2026", icon: <Calendar size={14}/> },
//               { label: "Verification", val: "SYS_VALIDATED", icon: <Clock size={14}/> },
//               { label: "Security Protocol", val: "AES-GCM-256", icon: <Lock size={14}/> }
//             ].map((stat, i) => (
//               <div key={i} className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl">
//                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2 mb-1.5">
//                   {stat.icon} {stat.label}
//                 </span>
//                 <span className="text-xs font-bold text-slate-700 tracking-tight">{stat.val}</span>
//               </div>
//             ))}
//           </div>

//           <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden">
//              <div className="absolute top-0 right-0 p-3 opacity-5">
//                 <MessageSquare size={40} />
//              </div>
//             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Internal Auditor Remarks</span>
//             <p className="text-xs text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-300 pl-4">
//               "{remarks || "Data package integrity confirmed. Automated provisioning triggered."}"
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- ACTIVE INPUT STATE ---
//   return (
//     <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all">
//       <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
//         <div>
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">Compliance Document Intake</h2>
//           <p className="text-[9px] text-slate-400 mt-0.5 uppercase font-bold tracking-widest">System Interface Version 4.0.2</p>
//         </div>
//         <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded text-[9px] font-black text-blue-600 uppercase tracking-widest">
//            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
//            Awaiting Entry
//         </div>
//       </div>

//       <div className="p-8 space-y-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="flex flex-col gap-2">
//             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Record Timestamp</label>
//             <div className="relative group">
//               <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//               <input 
//                 type="date" 
//                 className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-800 rounded-lg focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Asset Classification</label>
//             <div className="relative">
//               <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//               <input 
//                 disabled 
//                 placeholder="PROT_RESTRICTED_ACCESS" 
//                 className="w-full bg-slate-100/50 border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-400 rounded-lg cursor-not-allowed italic"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col gap-2">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-0.5">Execution Summary / Remarks</label>
//           <textarea 
//             rows={4}
//             placeholder="Document context, version history, or specific compliance notes..."
//             className="w-full bg-slate-50/50 border border-slate-200 px-5 py-3 text-xs font-bold text-slate-800 rounded-lg focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none placeholder:text-slate-300"
//           />
//         </div>
//       </div>

//       <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
//           Process ID: #VER-0226
//         </span>
//         <button
//           onClick={onDocumentSubmit}
//           className="group flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg shadow-lg shadow-slate-900/10 transition-all active:scale-95"
//         >
//           Execute Submission
//           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DocumentSubmissionUI;
//**************************************************working code phase 55****************************************************************** */
// import React from 'react';
// import { CheckCircle2, FileText, Calendar, MessageSquare, Clock, ShieldCheck, Info } from 'lucide-react';

// const DocumentSubmissionUI = ({ status, submissionDate, remarks, onDocumentSubmit }) => {
//   const isSubmitted = status === "submitted";

//   // --- SUBMITTED / CONFIRMATION UI ---
//   if (isSubmitted) {
//     return (
//       <div className="w-full bg-white border border-emerald-200 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
//         <div className="bg-gradient-to-r from-emerald-50 to-white p-10 flex flex-col md:flex-row items-center gap-6 border-b border-emerald-100">
//           <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0 transform -rotate-3">
//             <ShieldCheck className="text-white" size={40} />
//           </div>
//           <div className="text-center md:text-left">
//             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Submission Verified</h2>
//             <p className="text-emerald-600 font-bold text-sm mt-1 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
//               <CheckCircle2 size={16} /> Compliance Standard: AES-256 Secured
//             </p>
//           </div>
//         </div>
        
//         <div className="p-10 bg-white">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
//             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
//               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
//                 <Calendar size={14} className="text-emerald-500" /> Received Date
//               </span>
//               <span className="text-lg font-bold text-slate-800">{submissionDate || "Feb 06, 2026"}</span>
//             </div>
            
//             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
//               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
//                 <Clock size={14} className="text-emerald-500" /> Verification
//               </span>
//               <div className="flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                 <span className="text-lg font-bold text-slate-800">SYSTEM_COMPLETED</span>
//               </div>
//             </div>

//             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
//               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
//                 <FileText size={14} className="text-emerald-500" /> Reference ID
//               </span>
//               <span className="text-lg font-bold text-slate-800 tracking-tighter uppercase">#DOC-VER-2026-09</span>
//             </div>
//           </div>

//           <div className="bg-emerald-50/30 p-8 rounded-2xl border-2 border-dashed border-emerald-100">
//             <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
//               <MessageSquare size={16} /> Final Audit Remarks
//             </span>
//             <p className="text-slate-700 font-medium leading-relaxed italic text-lg">
//               "{remarks || "The digital package has been successfully audited and cross-referenced with the global employee database. No further action is required from the candidate at this stage."}"
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- FORM / PENDING UI ---
//   return (
//     <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all">
//       {/* Header Overlay Style */}
//       <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Document Submission</h2>
//             <p className="text-[10px] text-blue-600 mt-1 uppercase font-black tracking-[0.25em]">Authorized Submission Digital Document</p>
//           </div>
//           <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
//              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
//              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Awaiting Payload</span>
//           </div>
//         </div>
//       </div>

//       <div className="p-10 space-y-10">
//         {/* Entry Information Grid - Full Width Scaling */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           <div className="flex flex-col gap-3">
//             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Submission Date</label>
//             <div className="relative group">
//               <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
//               <input 
//                 type="date" 
//                 className="w-full bg-white border-2 border-slate-100 pl-12 pr-6 py-4 text-sm font-bold text-slate-800 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col gap-3">
//             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Reference</label>
//             <div className="relative group">
//               <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//               <input 
//                 disabled 
//                 placeholder="DOC-PRT-SECURE-2026" 
//                 className="w-full bg-slate-50 border-2 border-slate-100 pl-12 pr-6 py-4 text-sm font-bold text-slate-400 rounded-2xl cursor-not-allowed"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Remarks Section */}
//         <div className="flex flex-col gap-3">
//           <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Remarks</label>
//           <div className="relative group">
//             <textarea 
//               rows={5}
//               placeholder="Provide context regarding the uploaded documents (e.g., list of certifications, pending items)..."
//               className="w-full bg-white border-2 border-slate-100 px-6 py-5 text-sm font-bold text-slate-800 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Professional Alert Box */}
//         {/* <div className="bg-slate-900 p-6 rounded-2xl flex items-center gap-5 shadow-lg shadow-slate-200">
//           <div className="p-3 bg-blue-600 rounded-xl text-white">
//             <Info size={24} />
//           </div>
//           <div>
//             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 text-blue-400">Compliance Requirement</p>
//             <p className="text-sm text-white font-medium">
//               System requires high-fidelity PDF scans. Encrypted or password-protected files will be rejected by the auto-parser.
//             </p>
//           </div>
//         </div> */}
//       </div>

//       {/* Action Footer */}
//       <div className="px-10 py-6 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 flex items-center justify-between">
//         <p className="text-[10px] font-bold text-slate-400 uppercase max-w-[200px] leading-relaxed">
//           Secure Submission Terminal <br/> Authorized Access Only
//         </p>
//         <button
//           onClick={onDocumentSubmit}
//           className="flex items-center gap-3 px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
//         >
//           <CheckCircle2 size={20} />
//           Finalize Submission
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DocumentSubmissionUI;
//*************************************************working code phase 1 6/02/26****************************************************** */
// import React from 'react';
// import { CheckCircle2, FileText, Calendar, MessageSquare, Clock, ShieldCheck } from 'lucide-react';

// const DocumentSubmissionUI = ({ status, submissionDate, remarks, onDocumentSubmit }) => {
//   const isSubmitted = status === "document_submitted";

//   // --- SUBMITTED / CONFIRMATION UI ---
//   if (isSubmitted) {
//     return (
//       <div className="w-full max-w-6xl mx-auto bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/5 animate-in fade-in zoom-in duration-500">
//         <div className="bg-emerald-50/50 p-8 flex flex-col items-center text-center border-b border-emerald-100">
//           <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
//             <ShieldCheck className="text-emerald-600" size={32} />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-900">Submission Verified</h2>
//           <p className="text-emerald-700 font-medium text-sm mt-1 uppercase tracking-[0.1em]">Documents Received & Encrypted</p>
//         </div>
        
//         <div className="p-8 space-y-6 bg-white">
//           <div className="grid grid-cols-2 gap-6">
//             <div className="flex flex-col gap-1">
//               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
//                 <Calendar size={14} /> Received Date
//               </span>
//               <span className="text-sm font-bold text-slate-800">{submissionDate || "Feb 06, 2026"}</span>
//             </div>
//             <div className="flex flex-col gap-1">
//               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
//                 <Clock size={14} /> Verification Status
//               </span>
//               <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md w-fit">COMPLETED</span>
//             </div>
//           </div>

//           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
//             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
//               <MessageSquare size={14} /> Official Remarks
//             </span>
//             <p className="text-sm text-slate-600 italic">"{remarks || "No additional remarks provided."}"</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- FORM / PENDING UI ---
//   return (
//     <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all">
//       <div className="px-8 py-6 border-b border-slate-100 bg-white">
//         <h2 className="text-xl font-bold text-slate-900 tracking-tight">Document Submission</h2>
//         <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Employee Onboarding Flow</p>
//       </div>

//       <div className="p-8 space-y-8">
//         {/* Entry Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-bold text-slate-500 uppercase">Submission Date</label>
//             <div className="relative group">
//               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//               <input 
//                 type="date" 
//                 className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 text-sm font-semibold rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-bold text-slate-500 uppercase">Reference Number</label>
//             <div className="relative group">
//               <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
//               <input 
//                 disabled 
//                 placeholder="AUTOGEN-2026-X" 
//                 className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-sm font-semibold rounded-xl"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Remarks Section */}
//         <div className="flex flex-col gap-2">
//           <label className="text-[11px] font-bold text-slate-500 uppercase">Submission Remarks</label>
//           <div className="relative">
//             <textarea 
//               rows={4}
//               placeholder="e.g. All educational certificates and previous experience letters attached..."
//               className="w-full bg-white border border-slate-200 px-4 py-4 text-sm font-medium rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all resize-none"
//             />
//           </div>
//         </div>

//         {/* Warning/Info Box */}
//         <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
//           <Clock className="text-amber-600 shrink-0" size={18} />
//           <p className="text-[12px] text-amber-800 font-medium">
//             Please ensure all files are in PDF format and under 5MB. Once submitted, records cannot be modified without HR approval.
//           </p>
//         </div>
//       </div>

//       <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
//         <button
//           onClick={onDocumentSubmit}
//           className="flex items-center gap-2 px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
//         >
//           <CheckCircle2 size={18} />
//           Submit All Documents
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DocumentSubmissionUI;