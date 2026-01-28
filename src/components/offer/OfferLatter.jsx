import React , {useState} from 'react'
import {
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Info,
  Edit3,
  Mail,
  RefreshCcw,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { employeeKycService } from "../../services/employeeKyc.service";
import { employeeService } from "../../services/employee.service";


const OfferLatter = ({employee , fetchEmployee }) => {
      const [formData, setFormData] = useState({
        offered_ctc: "",
      });
       const [isRevising, setIsRevising] = useState(false);
         const [statusexp, setStatusexp] = useState([]);

         const id = employee?.id || 0;

       const handleOfferSubmit = async () => {
          try {
            if (!formData.offered_ctc) {
              toast.error("Please enter offered CTC");
              return;
            }
      
            // 🔁 REVISION FLOW
            if (isRevising) {
              await employeeKycService.reviseOffer(id, {
                new_ctc: Number(formData.offered_ctc),
              });
      
              toast.success("Offer revised successfully");
              setIsRevising(false);
              fetchEmployee();
              return;
            }
      
            // 🚀 FIRST-TIME OFFER RELEASE FLOW
            const isFresher = statusexp?.status === "filled" ? false : true;
      
            const payload = {
              full_name: employee.full_name,
              email: employee.email,
              phone: employee.phone,
              department_id: employee.department_id,
              role: employee.role,
              is_fresher: isFresher,
              offered_ctc: Number(formData.offered_ctc),
            };
      
            await employeeService.update(id, payload);
      
            toast.success("Offer released successfully");
            fetchEmployee();
          } catch (err) {
            toast.error(err.message || "Failed to process offer");
          }
        };


  return (
    <>
      <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/40">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-white">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                <ShieldCheck size={22} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  Remuneration Setup
                </h3>
                <p className="text-blue-300/60 text-[10px] font-bold uppercase tracking-[0.15em]">
                  {employee.status === "offer_sent"
                    ? "Offer Issued & Pending"
                    : "Payroll & Compliance Verification"}
                </p>
              </div>
            </div>

            {/* Dynamic Badge based on Status */}
            <div className="flex items-center gap-3">
              {employee.status === "offer_sent" && (
                <span className="flex items-center gap-1.5 text-[10px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 uppercase">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
                  Offer Released
                </span>
              )}
              <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 uppercase">
                Workflow: Phase 4
              </span>
            </div>
          </div>

          {/* CANDIDATE CONTEXT BAR */}
          <div className="bg-slate-50/50 border-b border-slate-100 p-4">
            {/* ... (Same as your previous Context Bar code) ... */}
          </div>

          {/* FORM CONTENT */}
          <div className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* LEFT: INPUT OR DISPLAY FIELD */}
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    {employee.status === "offer_sent" && !isRevising
                      ? "Current Offered CTC"
                      : "Proposed Annual CTC (INR)"}
                  </label>

                  {employee.status === "offer_sent" && !isRevising ? (
                    /* LOCKED DISPLAY MODE */
                    <div className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-slate-900">
                          ₹
                          {Number(employee.offered_ctc).toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          / Per Annum
                        </span>
                      </div>
                      <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                        <CheckCircle size={20} />
                      </div>
                    </div>
                  ) : (
                    /* INPUT MODE (Fresh or Revision) */
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-blue-600 transition-colors text-xl">
                        ₹
                      </div>
                      <input
                        type="number"
                        placeholder="Ex: 800000"
                        value={formData.offered_ctc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offered_ctc: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-6 py-4 bg-white border-2 border-blue-600 rounded-2xl focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-black text-xl text-slate-800 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* RIGHT: MARKET BENCHMARKING */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={16} className="text-slate-400" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Decision Support
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {isRevising
                      ? "You are now in revision mode. Updating this will overwrite the previously sent offer and notify the candidate of the new terms."
                      : `Standard increments for ${employee.department_name} range between 15% to 22%.`}
                  </p>
                </div>
              </div>

              {/* ACTION FOOTER */}
              {/* <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-3 text-slate-400 max-w-sm">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-medium">
              Digital contracts are legally binding. Ensure all figures are validated by the finance department.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {employee.status === 'offer_sent' && !isRevising ? (
           
              <button 
                onClick={() => {
                  setFormData({...formData, offered_ctc: employee.offered_ctc});
                  setIsRevising(true);
                }}
                className="group flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
              >
                <Edit3 size={18} className="text-slate-400" />
                REVISE OFFER
              </button>
            ) : (
          
              <>
                {isRevising && (
                  <button 
                    onClick={() => setIsRevising(false)}
                    className="px-6 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={handleOfferSubmit}
                  disabled={!formData.offered_ctc}
                  className="group relative bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-xl flex items-center gap-3"
                >
                  <span className="text-sm tracking-tight">
                    {isRevising ? 'SEND REVISED OFFER' : 'RELEASE OFFER'}
                  </span>
                  <div className="border-l border-white/20 pl-3">
                    {isRevising ? <RefreshCcw size={16} className="animate-spin-slow" /> : <Send size={16} />}
                  </div>
                </button>
              </>
            )}
          </div>
        </div> */}

              {/* ACTION FOOTER */}
              {/* <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-3 text-slate-400 max-w-sm">
                  <Info size={18} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-medium">
                    Email dispatch will use the{" "}
                    <span className="text-slate-600 font-bold">
                      Standard Offer Template
                    </span>
                    . Ensure the candidate's email address is verified before
                    sending.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {employee.status === "offer_sent" && !isRevising ? (
             
                    <>
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            offered_ctc: employee.offered_ctc,
                          });
                          setIsRevising(true);
                        }}
                        className="group flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 text-sm"
                      >
                        <Edit3
                          size={16}
                          className="text-slate-400 group-hover:text-blue-500"
                        />
                        REVISE
                      </button>

                      <button
                        disabled={employee.status !== "offer_sent"}
                        onClick={async () => {
                          try {
                            toast.loading("Dispatching offer email...");
                            await employeeKycService.sendOffer(id);
                            toast.dismiss();
                            toast.success("Offer email sent successfully!");
                          } catch (err) {
                            toast.dismiss();
                            toast.error(
                              err.message || "Failed to send offer email",
                            );
                          }
                        }}
                        className={`group flex items-center gap-3 px-6 py-3 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200 text-sm
    ${
      employee.status !== "offer_sent"
        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }
  `}
                      >
                        <Mail size={18} />
                        SEND OFFER MAIL
                      </button>
                    </>
                  ) : (
                
                    <>
                      {isRevising && (
                        <button
                          onClick={() => setIsRevising(false)}
                          className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={handleOfferSubmit}
                        disabled={!formData.offered_ctc}
                        className="group relative bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-xl flex items-center gap-3"
                      >
                        <span className="text-sm tracking-tight">
                          {isRevising ? "CONFIRM REVISION" : "RELEASE OFFER"}
                        </span>
                        <div className="border-l border-white/20 pl-3">
                          {isRevising ? (
                            <RefreshCcw size={16} />
                          ) : (
                            <Send size={16} />
                          )}
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div> */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
  {/* GUIDANCE TEXT */}
  <div className="flex items-start gap-3 text-slate-400 max-w-sm">
    <Info size={18} className="shrink-0 mt-0.5" />
    <p className="text-[11px] leading-relaxed font-medium">
      Releasing the offer will finalize the payroll structure. 
      <span className="text-slate-600 font-bold"> Express Dispatch</span> will 
      immediately trigger the legal contract to the candidate's inbox.
    </p>
  </div>

  {/* BUTTON GROUP */}
  <div className="flex items-center gap-3">
    {employee.status === "offer_sent" && !isRevising ? (
      /* POST-RELEASE VIEW (Already Sent) */
      <>
        <button
          onClick={() => {
            setFormData({ ...formData, offered_ctc: employee.offered_ctc });
            setIsRevising(true);
          }}
          className="group flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-sm"
        >
          <Edit3 size={16} className="text-slate-400" />
          REVISE TERMS
        </button>

        <button
          onClick={async () => {
            try {
              toast.loading("Dispatching offer email...");
              await employeeKycService.sendOffer(id);
              toast.dismiss();
              toast.success("Offer email sent successfully!");
            } catch (err) {
              toast.dismiss();
              toast.error(err.message || "Failed to send offer email");
            }
          }}
          className="group flex items-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm"
        >
          <Mail size={18} />
          RESEND MAIL
        </button>
      </>
    ) : (
      /* ACTIVE ACTIONS: RELEASE OR RELEASE + SEND */
      <>
        {isRevising && (
          <button
            onClick={() => setIsRevising(false)}
            className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        )}

        {/* BUTTON 1: JUST RELEASE (SAVE) */}
        <button
          onClick={handleOfferSubmit}
          disabled={!formData.offered_ctc}
          className="px-6 py-3.5 bg-white border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-sm"
        >
          {isRevising ? "SAVE REVISION" : "RELEASE ONLY"}
        </button>

        {/* BUTTON 2: RELEASE & SEND (The Combined Action) */}
        <button
          onClick={async () => {
            try {
              // First, save the data
              await handleOfferSubmit(); 
              
              // Second, trigger the email dispatch
              toast.loading("Finalizing & Dispatching...");
              await employeeKycService.sendOffer(id);
              
              toast.dismiss();
              toast.success("Offer Released & Dispatched!");
            } catch (err) {
              toast.dismiss();
              toast.error(err.message || "Dispatch failed");
            }
          }}
          disabled={!formData.offered_ctc}
          className="group relative bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-xl flex items-center gap-3"
        >
          <span className="text-sm tracking-tight">
            {isRevising ? "CONFIRM & SEND" : "RELEASE & SEND MAIL"}
          </span>
          <div className="border-l border-white/20 pl-3">
            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>
      </>
    )}
  </div>
</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OfferLatter

///*********************************************working code phase 1  24/1/25****************************************************** */
// import React , {useState} from 'react'
// import {
//   ShieldCheck,
//   CheckCircle,
//   TrendingUp,
//   Info,
//   Edit3,
//   Mail,
//   RefreshCcw,
//   Send,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { employeeKycService } from "../../services/employeeKyc.service";
// import { employeeService } from "../../services/employee.service";


// const OfferLatter = ({employee , fetchEmployee }) => {
//       const [formData, setFormData] = useState({
//         offered_ctc: "",
//       });
//        const [isRevising, setIsRevising] = useState(false);
//          const [statusexp, setStatusexp] = useState([]);

//          const id = employee?.id || 0;

//        const handleOfferSubmit = async () => {
//           try {
//             if (!formData.offered_ctc) {
//               toast.error("Please enter offered CTC");
//               return;
//             }
      
//             // 🔁 REVISION FLOW
//             if (isRevising) {
//               await employeeKycService.reviseOffer(id, {
//                 new_ctc: Number(formData.offered_ctc),
//               });
      
//               toast.success("Offer revised successfully");
//               setIsRevising(false);
//               fetchEmployee();
//               return;
//             }
      
//             // 🚀 FIRST-TIME OFFER RELEASE FLOW
//             const isFresher = statusexp?.status === "filled" ? false : true;
      
//             const payload = {
//               full_name: employee.full_name,
//               email: employee.email,
//               phone: employee.phone,
//               department_id: employee.department_id,
//               role: employee.role,
//               is_fresher: isFresher,
//               offered_ctc: Number(formData.offered_ctc),
//             };
      
//             await employeeService.update(id, payload);
      
//             toast.success("Offer released successfully");
//             fetchEmployee();
//           } catch (err) {
//             toast.error(err.message || "Failed to process offer");
//           }
//         };


//   return (
//     <>
//       <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
//         <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/40">
//           {/* HEADER */}
//           <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-8 py-5 flex items-center justify-between">
//             <div className="flex items-center gap-4 text-white">
//               <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
//                 <ShieldCheck size={22} className="text-blue-400" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold tracking-tight">
//                   Remuneration Setup
//                 </h3>
//                 <p className="text-blue-300/60 text-[10px] font-bold uppercase tracking-[0.15em]">
//                   {employee.status === "offer_sent"
//                     ? "Offer Issued & Pending"
//                     : "Payroll & Compliance Verification"}
//                 </p>
//               </div>
//             </div>

//             {/* Dynamic Badge based on Status */}
//             <div className="flex items-center gap-3">
//               {employee.status === "offer_sent" && (
//                 <span className="flex items-center gap-1.5 text-[10px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 uppercase">
//                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
//                   Offer Released
//                 </span>
//               )}
//               <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 uppercase">
//                 Workflow: Phase 4
//               </span>
//             </div>
//           </div>

//           {/* CANDIDATE CONTEXT BAR */}
//           <div className="bg-slate-50/50 border-b border-slate-100 p-4">
//             {/* ... (Same as your previous Context Bar code) ... */}
//           </div>

//           {/* FORM CONTENT */}
//           <div className="p-8 lg:p-12">
//             <div className="max-w-4xl mx-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                 {/* LEFT: INPUT OR DISPLAY FIELD */}
//                 <div className="space-y-4">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
//                     {employee.status === "offer_sent" && !isRevising
//                       ? "Current Offered CTC"
//                       : "Proposed Annual CTC (INR)"}
//                   </label>

//                   {employee.status === "offer_sent" && !isRevising ? (
//                     /* LOCKED DISPLAY MODE */
//                     <div className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
//                       <div className="flex items-center gap-3">
//                         <span className="text-2xl font-black text-slate-900">
//                           ₹
//                           {Number(employee.offered_ctc).toLocaleString("en-IN")}
//                         </span>
//                         <span className="text-xs font-bold text-slate-400">
//                           / Per Annum
//                         </span>
//                       </div>
//                       <div className="p-2 bg-green-100 text-green-700 rounded-lg">
//                         <CheckCircle size={20} />
//                       </div>
//                     </div>
//                   ) : (
//                     /* INPUT MODE (Fresh or Revision) */
//                     <div className="relative group">
//                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-blue-600 transition-colors text-xl">
//                         ₹
//                       </div>
//                       <input
//                         type="number"
//                         placeholder="Ex: 800000"
//                         value={formData.offered_ctc}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             offered_ctc: e.target.value,
//                           })
//                         }
//                         className="w-full pl-12 pr-6 py-4 bg-white border-2 border-blue-600 rounded-2xl focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-black text-xl text-slate-800 shadow-sm"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* RIGHT: MARKET BENCHMARKING */}
//                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
//                   <div className="flex items-center gap-3 mb-2">
//                     <TrendingUp size={16} className="text-slate-400" />
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                       Decision Support
//                     </p>
//                   </div>
//                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
//                     {isRevising
//                       ? "You are now in revision mode. Updating this will overwrite the previously sent offer and notify the candidate of the new terms."
//                       : `Standard increments for ${employee.department_name} range between 15% to 22%.`}
//                   </p>
//                 </div>
//               </div>

//               {/* ACTION FOOTER */}
//               {/* <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
//           <div className="flex items-start gap-3 text-slate-400 max-w-sm">
//             <Info size={18} className="shrink-0 mt-0.5" />
//             <p className="text-[11px] leading-relaxed font-medium">
//               Digital contracts are legally binding. Ensure all figures are validated by the finance department.
//             </p>
//           </div>
          
//           <div className="flex items-center gap-4">
//             {employee.status === 'offer_sent' && !isRevising ? (
           
//               <button 
//                 onClick={() => {
//                   setFormData({...formData, offered_ctc: employee.offered_ctc});
//                   setIsRevising(true);
//                 }}
//                 className="group flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
//               >
//                 <Edit3 size={18} className="text-slate-400" />
//                 REVISE OFFER
//               </button>
//             ) : (
          
//               <>
//                 {isRevising && (
//                   <button 
//                     onClick={() => setIsRevising(false)}
//                     className="px-6 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button 
//                   onClick={handleOfferSubmit}
//                   disabled={!formData.offered_ctc}
//                   className="group relative bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-xl flex items-center gap-3"
//                 >
//                   <span className="text-sm tracking-tight">
//                     {isRevising ? 'SEND REVISED OFFER' : 'RELEASE OFFER'}
//                   </span>
//                   <div className="border-l border-white/20 pl-3">
//                     {isRevising ? <RefreshCcw size={16} className="animate-spin-slow" /> : <Send size={16} />}
//                   </div>
//                 </button>
//               </>
//             )}
//           </div>
//         </div> */}

//               {/* ACTION FOOTER */}
//               {/* <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
//                 <div className="flex items-start gap-3 text-slate-400 max-w-sm">
//                   <Info size={18} className="shrink-0 mt-0.5" />
//                   <p className="text-[11px] leading-relaxed font-medium">
//                     Email dispatch will use the{" "}
//                     <span className="text-slate-600 font-bold">
//                       Standard Offer Template
//                     </span>
//                     . Ensure the candidate's email address is verified before
//                     sending.
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   {employee.status === "offer_sent" && !isRevising ? (
             
//                     <>
//                       <button
//                         onClick={() => {
//                           setFormData({
//                             ...formData,
//                             offered_ctc: employee.offered_ctc,
//                           });
//                           setIsRevising(true);
//                         }}
//                         className="group flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 text-sm"
//                       >
//                         <Edit3
//                           size={16}
//                           className="text-slate-400 group-hover:text-blue-500"
//                         />
//                         REVISE
//                       </button>

//                       <button
//                         disabled={employee.status !== "offer_sent"}
//                         onClick={async () => {
//                           try {
//                             toast.loading("Dispatching offer email...");
//                             await employeeKycService.sendOffer(id);
//                             toast.dismiss();
//                             toast.success("Offer email sent successfully!");
//                           } catch (err) {
//                             toast.dismiss();
//                             toast.error(
//                               err.message || "Failed to send offer email",
//                             );
//                           }
//                         }}
//                         className={`group flex items-center gap-3 px-6 py-3 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200 text-sm
//     ${
//       employee.status !== "offer_sent"
//         ? "bg-slate-300 text-slate-500 cursor-not-allowed"
//         : "bg-blue-600 text-white hover:bg-blue-700"
//     }
//   `}
//                       >
//                         <Mail size={18} />
//                         SEND OFFER MAIL
//                       </button>
//                     </>
//                   ) : (
                
//                     <>
//                       {isRevising && (
//                         <button
//                           onClick={() => setIsRevising(false)}
//                           className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       <button
//                         onClick={handleOfferSubmit}
//                         disabled={!formData.offered_ctc}
//                         className="group relative bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-xl flex items-center gap-3"
//                       >
//                         <span className="text-sm tracking-tight">
//                           {isRevising ? "CONFIRM REVISION" : "RELEASE OFFER"}
//                         </span>
//                         <div className="border-l border-white/20 pl-3">
//                           {isRevising ? (
//                             <RefreshCcw size={16} />
//                           ) : (
//                             <Send size={16} />
//                           )}
//                         </div>
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div> */}
//               <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
//   {/* GUIDANCE TEXT */}
//   <div className="flex items-start gap-3 text-slate-400 max-w-sm">
//     <Info size={18} className="shrink-0 mt-0.5" />
//     <p className="text-[11px] leading-relaxed font-medium">
//       Releasing the offer will finalize the payroll structure. 
//       <span className="text-slate-600 font-bold"> Express Dispatch</span> will 
//       immediately trigger the legal contract to the candidate's inbox.
//     </p>
//   </div>

//   {/* BUTTON GROUP */}
//   <div className="flex items-center gap-3">
//     {employee.status === "offer_sent" && !isRevising ? (
//       /* POST-RELEASE VIEW (Already Sent) */
//       <>
//         <button
//           onClick={() => {
//             setFormData({ ...formData, offered_ctc: employee.offered_ctc });
//             setIsRevising(true);
//           }}
//           className="group flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-sm"
//         >
//           <Edit3 size={16} className="text-slate-400" />
//           REVISE TERMS
//         </button>

//         <button
//           onClick={async () => {
//             try {
//               toast.loading("Dispatching offer email...");
//               await employeeKycService.sendOffer(id);
//               toast.dismiss();
//               toast.success("Offer email sent successfully!");
//             } catch (err) {
//               toast.dismiss();
//               toast.error(err.message || "Failed to send offer email");
//             }
//           }}
//           className="group flex items-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm"
//         >
//           <Mail size={18} />
//           RESEND MAIL
//         </button>
//       </>
//     ) : (
//       /* ACTIVE ACTIONS: RELEASE OR RELEASE + SEND */
//       <>
//         {isRevising && (
//           <button
//             onClick={() => setIsRevising(false)}
//             className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700"
//           >
//             Cancel
//           </button>
//         )}

//         {/* BUTTON 1: JUST RELEASE (SAVE) */}
//         <button
//           onClick={handleOfferSubmit}
//           disabled={!formData.offered_ctc}
//           className="px-6 py-3.5 bg-white border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-sm"
//         >
//           {isRevising ? "SAVE REVISION" : "RELEASE ONLY"}
//         </button>

//         {/* BUTTON 2: RELEASE & SEND (The Combined Action) */}
//         <button
//           onClick={async () => {
//             try {
//               // First, save the data
//               await handleOfferSubmit(); 
              
//               // Second, trigger the email dispatch
//               toast.loading("Finalizing & Dispatching...");
//               await employeeKycService.sendOffer(id);
              
//               toast.dismiss();
//               toast.success("Offer Released & Dispatched!");
//             } catch (err) {
//               toast.dismiss();
//               toast.error(err.message || "Dispatch failed");
//             }
//           }}
//           disabled={!formData.offered_ctc}
//           className="group relative bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-xl flex items-center gap-3"
//         >
//           <span className="text-sm tracking-tight">
//             {isRevising ? "CONFIRM & SEND" : "RELEASE & SEND MAIL"}
//           </span>
//           <div className="border-l border-white/20 pl-3">
//             <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
//           </div>
//         </button>
//       </>
//     )}
//   </div>
// </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default OfferLatter
