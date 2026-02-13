import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  SendHorizontal, 
  Loader2, 
  CheckCircle2, 
  Info, 
  Gavel,
  History 
} from 'lucide-react';
import { employeeKycService } from "../../services/employeeKyc.service";

const ReviewSection = ({ employeeId ,  onReviewSubmitted }) => {

  console.log("sss", employeeId)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    review_type: 'probation',
    decision: 'confirmed',
    comments: ''
  });

const handleSubmit = async () => {
  if (!employeeId) {
    alert("Employee ID not loaded");
    return;
  }

  if (!formData.comments.trim()) return;

  setLoading(true);

  try {
    const res = await employeeKycService.addReview(employeeId, formData);
    console.log("Review saved:", res);

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    onReviewSubmitted?.();

    await employeeKycService.getFull(employeeId)

  } catch (error) {
    console.error("Submission failed", error.message);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      {/* 1. TOP TOOLBAR */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Gavel size={16} />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">
              Employment Action & Review
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Lifecycle event: ID #{Math.floor(Math.random() * 10000)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold text-slate-500 hover:bg-slate-100 rounded-md transition-colors uppercase">
             <History size={12} /> View History
           </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="p-6 grid grid-cols-12 gap-6">
        
        {/* LEFT: Parameters */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-0.5">
              Assessment Phase
            </label>
            <select
              value={formData.review_type}
              onChange={(e) => setFormData({...formData, review_type: e.target.value})}
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="probation">Probationary Period</option>
              <option value="confirmation">Full Confirmation</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-0.5">
              Determination Outcome
            </label>
            <div className="p-1 bg-slate-100/50 rounded-xl border border-slate-200 space-y-1">
              {[
                { id: 'confirmed', label: 'Confirm Employment', color: 'text-emerald-600' },
                { id: 'extended', label: 'Extend Period', color: 'text-amber-600' },
                { id: 'exit', label: 'Terminate Contract', color: 'text-red-600' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({...formData, decision: opt.id})}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all
                    ${formData.decision === opt.id 
                      ? 'bg-white shadow-sm text-slate-900 border border-slate-200' 
                      : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.decision === opt.id ? (opt.id === 'confirmed' ? 'bg-emerald-500' : opt.id === 'extended' ? 'bg-amber-500' : 'bg-red-500') : 'bg-slate-300'}`} />
                    {opt.label}
                  </span>
                  {formData.decision === opt.id && <CheckCircle2 size={12} className="text-blue-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Justification */}
        <div className="col-span-12 lg:col-span-8 space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              Executive Summary & Justification
            </label>
            <span className="text-[9px] font-mono text-slate-300">REQ: MIN 20 CHARS</span>
          </div>
          <textarea
            value={formData.comments}
            onChange={(e) => setFormData({...formData, comments: e.target.value})}
            placeholder="Type your formal assessment comments here..."
            className="w-full h-full min-h-[220px] p-5 bg-white border border-slate-200 rounded-2xl text-[12px] font-medium text-slate-600 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all resize-none leading-relaxed placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* 3. FOOTER COMMIT BAR */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Info size={14} className="text-blue-500" />
          <p className="text-[9px] font-bold uppercase tracking-tight">
            Submission creates a permanent audit trail for HR compliance.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || formData.comments.length < 5}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
            ${success 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-900 text-white hover:bg-black hover:shadow-lg hover:shadow-slate-200 active:scale-95'
            } disabled:opacity-30 disabled:grayscale`}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : success ? (
            <CheckCircle2 size={14} className="animate-bounce" />
          ) : (
            <SendHorizontal size={14} />
          )}
          {success ? "Decision Recorded" : "Finalize Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
// import React, { useState } from 'react';
// import { ShieldCheck, MessageSquare, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// const ReviewSection = ({ onReviewSubmit }) => {
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [formData, setFormData] = useState({
//     review_type: 'probation',
//     decision: 'confirmed',
//     comments: ''
//   });

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await onReviewSubmit(formData);
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (error) {
//       console.error("Submission failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden mb-8">
//       {/* SECTION HEADER */}
//       <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
//             <ShieldCheck size={18} />
//           </div>
//           <div>
//             <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
//               Performance Assessment
//             </h2>
//             <p className="text-[10px] text-slate-400 font-medium mt-0.5">Formal employment review and decision protocol</p>
//           </div>
//         </div>
        
//         {/* STATUS INDICATOR */}
//         <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
//           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
//           <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Drafting Phase</span>
//         </div>
//       </div>

//       <div className="p-8">
//         <div className="grid grid-cols-12 gap-8">
          
//           {/* LEFT COLUMN: CONTROLS */}
//           <div className="col-span-12 lg:col-span-4 space-y-6">
//             {/* Review Type Enum */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Review Type
//               </label>
//               <select
//                 value={formData.review_type}
//                 onChange={(e) => setFormData({...formData, review_type: e.target.value})}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
//               >
//                 <option value="probation">Probation Review</option>
//                 <option value="confirmation">Confirmation Review</option>
//               </select>
//             </div>

//             {/* Decision Enum */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Final Decision
//               </label>
//               <div className="grid grid-cols-1 gap-2">
//                 {['confirmed', 'extended', 'exit'].map((opt) => (
//                   <button
//                     key={opt}
//                     onClick={() => setFormData({...formData, decision: opt})}
//                     className={`px-4 py-3 rounded-2xl text-left text-xs font-black uppercase tracking-tight transition-all border ${
//                       formData.decision === opt 
//                       ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
//                       : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
//                     }`}
//                   >
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: COMMENTS */}
//           <div className="col-span-12 lg:col-span-8 space-y-2">
//             <div className="flex items-center justify-between ml-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                 Reviewer Comments & Justification
//               </label>
//               <div className="flex items-center gap-1.5 text-slate-300">
//                 <MessageSquare size={12} />
//                 <span className="text-[9px] font-bold uppercase">{formData.comments.length} chars</span>
//               </div>
//             </div>
//             <textarea
//               value={formData.comments}
//               onChange={(e) => setFormData({...formData, comments: e.target.value})}
//               placeholder="Provide a detailed rationale for the decision. Mention key performance indicators, cultural fit, and growth areas..."
//               className="w-full h-[184px] p-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-xs font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
//             />
//           </div>
//         </div>

//         {/* FOOTER ACTION */}
//         <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
//           <div className="flex items-center gap-2 text-slate-400">
//             <AlertCircle size={14} />
//             <p className="text-[10px] font-medium italic">Decision will be finalized in the employee's permanent record.</p>
//           </div>
          
//           <button
//             onClick={handleSubmit}
//             disabled={loading || !formData.comments}
//             className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all
//               ${success 
//                 ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' 
//                 : 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0'
//               } disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed`}
//           >
//             {loading ? (
//               <>
//                 <Loader2 size={16} className="animate-spin" />
//                 Processing...
//               </>
//             ) : success ? (
//               <>
//                 <CheckCircle2 size={16} />
//                 Review Logged
//               </>
//             ) : (
//               <>
//                 <Save size={16} />
//                 Submit Assessment
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewSection;