import React, { useState } from 'react';
import { 
  Calendar, Mail, Send, UserCheck, Clock, 
  MapPin, User, ShieldCheck, CheckCircle2, AlertCircle,Phone, 
} from 'lucide-react';
import { employeeKycService } from "../../services/employeeKyc.service";
import toast from "react-hot-toast";


const JoiningDispatchUI = ({ employee , fetchEmployee }) => {
  const [loading, setLoading] = useState(false);
  const [joiningIssued, setJoiningIssued] = useState(false);
  const [issued, setIssued] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    joining_date: "",
    reporting_time: "09:30",
    reporting_location: "Headquarters - Block A",
    reporting_manager: "",
    reporting_phone: "" 
  });


  React.useEffect(() => {
  if (employee?.joining_letter_sent || employee?.status === "confirmed") {
    setIssued(true);
  }
}, [employee]);


 const handleIssueJoining = async () => {
  try {
    setLoading(true);

    const phoneToSend =
      onboardingData.reporting_phone || employee.phone || "";

    // ✅ India 10 digit validation
    if (phoneToSend && !/^[6-9]\d{9}$/.test(phoneToSend)) {
      toast.error("Enter valid 10-digit Indian mobile number");
      setLoading(false);
      return;
    }

    const payload = {
      joining_date: onboardingData.joining_date,
      joining_time: onboardingData.reporting_time,
      reporting_to_name: onboardingData.reporting_manager,
      reporting_to_email: employee.email, // or manager email if available
      // reporting_to_phone: employee.phone || "",
      reporting_to_phone: onboardingData.reporting_phone || "",
    };

    await employeeKycService.sendJoiningLetter(employee.id, payload);

    setIssued(true);

    toast.success("Joining letter sent successfully");
    fetchEmployee();
  } catch (err) {
    toast.error(err.message || "Failed to send joining letter");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="mt-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* STATUS HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {/* Onboarding Dispatch Center */}
            Employee Onboarding & Joining Confirmation
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Finalize onboarding formalities and issue the official Joining Letter to the candidate.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
          <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">Ready for Issuance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1 & 2: CONFIGURATION FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                
                {/* Joining Date */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Commencement Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
                    value={onboardingData.joining_date}
                    onChange={(e) => setOnboardingData({...onboardingData, joining_date: e.target.value})}
                  />
                </div>

                {/* Reporting Time */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Reporting Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
                    value={onboardingData.reporting_time}
                    onChange={(e) => setOnboardingData({...onboardingData, reporting_time: e.target.value})}
                  />
                </div>

                {/* Reporting Location */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> Office/Reporting Location
                  </label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    onChange={(e) => setOnboardingData({...onboardingData, reporting_location: e.target.value})}
                  >
                    <option>Corporate HQ - Navi Mumbai</option>
                    {/* <option>Tech Hub - Bangalore</option>
                    <option>Regional Office - Delhi</option> */}
                    <option>Remote / Work from Home</option>
                  </select>
                </div>

                {/* Reporting Manager */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Reporting Manager / HR POC
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Manager Name"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
                    value={onboardingData.reporting_manager}
                    onChange={(e) => setOnboardingData({...onboardingData, reporting_manager: e.target.value})}
                  />
                </div>

                {/* Reporting Mobile Number */}
<div className="md:col-span-2 space-y-2">
  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
    <Phone size={14} /> Reporting Contact Number
  </label>
 <input
  type="tel"
  placeholder="Enter 10 digit Mobile Number"
  maxLength={10}
  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
  value={onboardingData.reporting_phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // allow only digits
    setOnboardingData({ ...onboardingData, reporting_phone: value });
  }}
/>

</div>

              </div>
            </div>

            {/* ACTION BAR */}
            <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Policy Compliant</span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* <button className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  Cancel
                </button> */}
                <button
  onClick={handleIssueJoining}
  disabled={!onboardingData.joining_date || loading}
  className="bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-black px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
>
  {loading ? "Processing..." : "ISSUE VIA EMAIL"}
  <Mail size={18} />
</button>

              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: CANDIDATE INFO & SUMMARY */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6">Recipient Preview</h4>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black">
                {employee.full_name?.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">{employee.full_name}</p>
                <p className="text-xs text-blue-200">{employee.email}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-blue-200 uppercase">Designation</span>
                <span className="text-xs font-bold">{employee.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-blue-200 uppercase">Department</span>
                <span className="text-xs font-bold">{employee.department_name}</span>
              </div>
            </div>
          </div>

          {/* DISPATCH CHECKLIST */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Pre-dispatch Checks</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <CheckCircle2 size={16} className="text-green-500" /> Offer Letter Accepted
              </li>
              <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <CheckCircle2 size={16} className="text-green-500" /> Background Verification Cleared
              </li>
              <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <AlertCircle size={16} className={onboardingData.joining_date ? "text-green-500" : "text-amber-500"} /> 
                Joining Date Finalized
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoiningDispatchUI;
//***************************************************working code phase 1 13/02/26***************************************************************** */
// import React, { useState } from 'react';
// import { 
//   Calendar, Mail, Send, UserCheck, Clock, 
//   MapPin, User, ShieldCheck, CheckCircle2, AlertCircle,Phone, 
// } from 'lucide-react';
// import { employeeKycService } from "../../services/employeeKyc.service";
// import toast from "react-hot-toast";


// const JoiningDispatchUI = ({ employee }) => {
//   const [loading, setLoading] = useState(false);
//   const [onboardingData, setOnboardingData] = useState({
//     joining_date: "",
//     reporting_time: "09:30",
//     reporting_location: "Headquarters - Block A",
//     reporting_manager: "",
//     reporting_phone: "" 
//   });

//  const handleIssueJoining = async () => {
//   try {
//     setLoading(true);

//     const phoneToSend =
//       onboardingData.reporting_phone || employee.phone || "";

//     // ✅ India 10 digit validation
//     if (phoneToSend && !/^[6-9]\d{9}$/.test(phoneToSend)) {
//       toast.error("Enter valid 10-digit Indian mobile number");
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       joining_date: onboardingData.joining_date,
//       joining_time: onboardingData.reporting_time,
//       reporting_to_name: onboardingData.reporting_manager,
//       reporting_to_email: employee.email, // or manager email if available
//       // reporting_to_phone: employee.phone || "",
//       reporting_to_phone: onboardingData.reporting_phone || "",
//     };

//     await employeeKycService.sendJoiningLetter(employee.id, payload);

//     toast.success("Joining letter sent successfully");
//   } catch (err) {
//     toast.error(err.message || "Failed to send joining letter");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="mt-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
//       {/* STATUS HEADER */}
//       <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
//         <div>
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">
//             {/* Onboarding Dispatch Center */}
//             Employee Onboarding & Joining Confirmation
//           </h2>
//           <p className="text-slate-500 text-sm font-medium">
//             Finalize onboarding formalities and issue the official Joining Letter to the candidate.
//           </p>
//         </div>
//         <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl">
//           <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
//           <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">Ready for Issuance</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* COLUMN 1 & 2: CONFIGURATION FORM */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
//             <div className="p-8 lg:p-10">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                
//                 {/* Joining Date */}
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                     <Calendar size={14} /> Commencement Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
//                     value={onboardingData.joining_date}
//                     onChange={(e) => setOnboardingData({...onboardingData, joining_date: e.target.value})}
//                   />
//                 </div>

//                 {/* Reporting Time */}
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                     <Clock size={14} /> Reporting Time
//                   </label>
//                   <input
//                     type="time"
//                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
//                     value={onboardingData.reporting_time}
//                     onChange={(e) => setOnboardingData({...onboardingData, reporting_time: e.target.value})}
//                   />
//                 </div>

//                 {/* Reporting Location */}
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                     <MapPin size={14} /> Office/Reporting Location
//                   </label>
//                   <select 
//                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
//                     onChange={(e) => setOnboardingData({...onboardingData, reporting_location: e.target.value})}
//                   >
//                     <option>Corporate HQ - Navi Mumbai</option>
//                     {/* <option>Tech Hub - Bangalore</option>
//                     <option>Regional Office - Delhi</option> */}
//                     <option>Remote / Work from Home</option>
//                   </select>
//                 </div>

//                 {/* Reporting Manager */}
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                     <User size={14} /> Reporting Manager / HR POC
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter Manager Name"
//                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
//                     value={onboardingData.reporting_manager}
//                     onChange={(e) => setOnboardingData({...onboardingData, reporting_manager: e.target.value})}
//                   />
//                 </div>

//                 {/* Reporting Mobile Number */}
// <div className="md:col-span-2 space-y-2">
//   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//     <Phone size={14} /> Reporting Contact Number
//   </label>
//  <input
//   type="tel"
//   placeholder="Enter 10 digit Mobile Number"
//   maxLength={10}
//   className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
//   value={onboardingData.reporting_phone}
//   onChange={(e) => {
//     const value = e.target.value.replace(/\D/g, ""); // allow only digits
//     setOnboardingData({ ...onboardingData, reporting_phone: value });
//   }}
// />

// </div>

//               </div>
//             </div>

//             {/* ACTION BAR */}
//             <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-2 text-slate-400">
//                 <ShieldCheck size={18} />
//                 <span className="text-[10px] font-bold uppercase tracking-wider">Policy Compliant</span>
//               </div>
              
//               <div className="flex items-center gap-4">
//                 <button className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
//                   Cancel
//                 </button>
//                 <button
//   onClick={handleIssueJoining}
//   disabled={!onboardingData.joining_date || loading}
//   className="bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-black px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
// >
//   {loading ? "Processing..." : "ISSUE VIA EMAIL"}
//   <Mail size={18} />
// </button>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* COLUMN 3: CANDIDATE INFO & SUMMARY */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
//             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6">Recipient Preview</h4>
            
//             <div className="flex items-center gap-4 mb-8">
//               <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black">
//                 {employee.full_name?.charAt(0)}
//               </div>
//               <div>
//                 <p className="text-lg font-bold leading-tight">{employee.full_name}</p>
//                 <p className="text-xs text-blue-200">{employee.email}</p>
//               </div>
//             </div>

//             <div className="space-y-4 pt-4 border-t border-white/10">
//               <div className="flex justify-between items-center">
//                 <span className="text-[10px] font-bold text-blue-200 uppercase">Designation</span>
//                 <span className="text-xs font-bold">{employee.role}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-[10px] font-bold text-blue-200 uppercase">Department</span>
//                 <span className="text-xs font-bold">{employee.department_name}</span>
//               </div>
//             </div>
//           </div>

//           {/* DISPATCH CHECKLIST */}
//           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Pre-dispatch Checks</h4>
//             <ul className="space-y-4">
//               <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
//                 <CheckCircle2 size={16} className="text-green-500" /> Offer Letter Accepted
//               </li>
//               <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
//                 <CheckCircle2 size={16} className="text-green-500" /> Background Verification Cleared
//               </li>
//               <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
//                 <AlertCircle size={16} className={onboardingData.joining_date ? "text-green-500" : "text-amber-500"} /> 
//                 Joining Date Finalized
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JoiningDispatchUI;
//*************************************************working code phase 1 06/02/26******************************************************** */
// import React, { useState } from 'react';
// import { 
//   Calendar, Mail, Send, UserCheck, Clock, 
//   MapPin, User, ShieldCheck, CheckCircle2, AlertCircle 
// } from 'lucide-react';
// import { employeeKycService } from "../../services/employeeKyc.service";
// import toast from "react-hot-toast";


// const JoiningDispatchUI = ({ employee }) => {
//   const [loading, setLoading] = useState(false);
//   const [onboardingData, setOnboardingData] = useState({
//     joining_date: "",
//     reporting_time: "09:30",
//     reporting_location: "Headquarters - Block A",
//     reporting_manager: ""
//   });

//  const handleIssueJoining = async () => {
//   try {
//     setLoading(true);

//     const payload = {
//       joining_date: onboardingData.joining_date,
//       joining_time: onboardingData.reporting_time,
//       reporting_to_name: onboardingData.reporting_manager,
//       reporting_to_email: employee.email, // or manager email if available
//       reporting_to_phone: employee.phone || "",
//     };

//     await employeeKycService.sendJoiningLetter(employee.id, payload);

//     toast.success("Joining letter sent successfully");
//   } catch (err) {
//     toast.error(err.message || "Failed to send joining letter");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="mt-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
//       {/* STATUS HEADER */}
//       <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
//         <div>
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">
//             {/* Onboarding Dispatch Center */}
//             Employee Onboarding & Joining Confirmation
//           </h2>
//           <p className="text-slate-500 text-sm font-medium">
//             Finalize onboarding formalities and issue the official Joining Letter to the candidate.
//           </p>
//         </div>
//         <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl">
//           <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
//           <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">Ready for Issuance</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* COLUMN 1 & 2: CONFIGURATION FORM */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
//             <div className="p-8 lg:p-10">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                
//                 {/* Joining Date */}
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                     <Calendar size={14} /> Commencement Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
//                     value={onboardingData.joining_date}
//                     onChange={(e) => setOnboardingData({...onboardingData, joining_date: e.target.value})}
//                   />
//                 </div>

//                 {/* Reporting Time */}
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                     <Clock size={14} /> Reporting Time
//                   </label>
//                   <input
//                     type="time"
//                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
//                     value={onboardingData.reporting_time}
//                     onChange={(e) => setOnboardingData({...onboardingData, reporting_time: e.target.value})}
//                   />
//                 </div>

//                 {/* Reporting Location */}
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                     <MapPin size={14} /> Office/Reporting Location
//                   </label>
//                   <select 
//                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
//                     onChange={(e) => setOnboardingData({...onboardingData, reporting_location: e.target.value})}
//                   >
//                     <option>Corporate HQ - Mumbai</option>
//                     <option>Tech Hub - Bangalore</option>
//                     <option>Regional Office - Delhi</option>
//                     <option>Remote / Work from Home</option>
//                   </select>
//                 </div>

//                 {/* Reporting Manager */}
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                     <User size={14} /> Reporting Manager / HR POC
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter Manager Name"
//                     className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold"
//                     value={onboardingData.reporting_manager}
//                     onChange={(e) => setOnboardingData({...onboardingData, reporting_manager: e.target.value})}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* ACTION BAR */}
//             <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-2 text-slate-400">
//                 <ShieldCheck size={18} />
//                 <span className="text-[10px] font-bold uppercase tracking-wider">Policy Compliant</span>
//               </div>
              
//               <div className="flex items-center gap-4">
//                 <button className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
//                   Cancel
//                 </button>
//                 {/* <button 
//                   onClick={handleIssueJoining}
//                   disabled={!onboardingData.joining_date || loading}
//                   className="bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-black px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
//                 >
//                   {loading ? "Processing..." : "ISSUE VIA EMAIL"}
//                   <Mail size={18} />
//                 </button> */}
//                 <button
//   onClick={handleIssueJoining}
//   disabled={!onboardingData.joining_date || loading}
//   className="bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-black px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
// >
//   {loading ? "Processing..." : "ISSUE VIA EMAIL"}
//   <Mail size={18} />
// </button>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* COLUMN 3: CANDIDATE INFO & SUMMARY */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
//             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6">Recipient Preview</h4>
            
//             <div className="flex items-center gap-4 mb-8">
//               <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black">
//                 {employee.full_name?.charAt(0)}
//               </div>
//               <div>
//                 <p className="text-lg font-bold leading-tight">{employee.full_name}</p>
//                 <p className="text-xs text-blue-200">{employee.email}</p>
//               </div>
//             </div>

//             <div className="space-y-4 pt-4 border-t border-white/10">
//               <div className="flex justify-between items-center">
//                 <span className="text-[10px] font-bold text-blue-200 uppercase">Designation</span>
//                 <span className="text-xs font-bold">{employee.role}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-[10px] font-bold text-blue-200 uppercase">Department</span>
//                 <span className="text-xs font-bold">{employee.department_name}</span>
//               </div>
//             </div>
//           </div>

//           {/* DISPATCH CHECKLIST */}
//           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
//             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Pre-dispatch Checks</h4>
//             <ul className="space-y-4">
//               <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
//                 <CheckCircle2 size={16} className="text-green-500" /> Offer Letter Accepted
//               </li>
//               <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
//                 <CheckCircle2 size={16} className="text-green-500" /> Background Verification Cleared
//               </li>
//               <li className="flex items-center gap-3 text-xs font-medium text-slate-600">
//                 <AlertCircle size={16} className={onboardingData.joining_date ? "text-green-500" : "text-amber-500"} /> 
//                 Joining Date Finalized
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JoiningDispatchUI;