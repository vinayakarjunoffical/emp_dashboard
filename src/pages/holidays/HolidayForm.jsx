import React, { useState } from "react";
import { Plus, Trash2, ShieldCheck, Info, Layers, Calendar as CalendarIcon, ChevronDown, Check, Lock } from "lucide-react";
import { createHolidays } from "../../services/holiday.service";
import toast from "react-hot-toast";

const HolidayForm = () => {
  const departmentOptions = ["All", "Engineering", "Human Resources", "Marketing", "Sales", "Finance", "Operations"];

  const [holidays, setHolidays] = useState([{
    name: "",
    date: "",
    holiday_type: "Public",
    description: "",
    departments: ["All"],
    calendar_id: "default_india", // This value will be displayed in the read-only field
    is_optional: false,
    is_recurring: false
  }]);

  const addRow = () => setHolidays([...holidays, {
    name: "", date: "", holiday_type: "Public", description: "",
    departments: ["All"], calendar_id: "default_india", is_optional: false, is_recurring: false
  }]);

  const removeRow = (index) => setHolidays(holidays.filter((_, i) => i !== index));

  const updateField = (index, field, value) => {
    const newHolidays = [...holidays];
    newHolidays[index][field] = value;
    setHolidays(newHolidays);
  };

  const toggleDepartment = (index, dept) => {
    const currentDepts = holidays[index].departments;
    let newDepts;
    if (dept === "All") {
      newDepts = ["All"];
    } else {
      newDepts = currentDepts.filter(d => d !== "All");
      if (newDepts.includes(dept)) {
        newDepts = newDepts.filter(d => d !== dept);
        if (newDepts.length === 0) newDepts = ["All"];
      } else {
        newDepts = [...newDepts, dept];
      }
    }
    updateField(index, 'departments', newDepts);
  };


  const handleSubmit = async () => {
  try {
    const payload = holidays.map(h => ({
      name: h.name,
      date: h.date,
      holiday_type: h.holiday_type,
      description: h.description,
      departments: h.departments,
      calendar_id: h.calendar_id,
      is_optional: h.is_optional,
      is_recurring: h.is_recurring,
    }));

    await createHolidays(payload);

    toast.success("Holidays Created Successfully");

    // reset form (optional)
    setHolidays([{
      name: "",
      date: "",
      holiday_type: "Public",
      description: "",
      departments: ["All"],
      calendar_id: "default_india",
      is_optional: false,
      is_recurring: false
    }]);

  } catch (err) {
    console.error(err);
    toast.error("Failed to create holidays");
  }
};


  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Asset Configuration</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Controlled Data Entry Protocol</p>
        </div>
        <button 
          onClick={addRow}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={14} /> Add New Entry
        </button>
      </div>

      <div className="space-y-12">
        {holidays.map((item, index) => (
          <div key={index} className="group relative p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
            
            <div className="absolute -left-3 top-10 w-8 h-8 bg-slate-900 text-white text-[10px] font-black flex items-center justify-center rounded-lg shadow-xl">
              {String(index + 1).padStart(2, '0')}
            </div>
            
            {index > 0 && (
              <button onClick={() => removeRow(index)} className="absolute -right-3 -top-3 p-2.5 bg-white border border-red-100 text-red-500 rounded-full shadow-xl hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={16} />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              <div className="md:col-span-6 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={12} /> Holiday Name
                </label>
                <input 
                  type="text" 
                  value={item.name}
                  onChange={(e) => updateField(index, 'name', e.target.value)}
                  placeholder="e.g. Annual Foundation Day" 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CalendarIcon size={12} /> Target Date
                </label>
                <input 
                  type="date" 
                  value={item.date}
                  onChange={(e) => updateField(index, 'date', e.target.value)}
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none"
                />
              </div>

              {/* CALENDAR ID - SYSTEM LOCKED DISPLAY */}
              <div className="md:col-span-3 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers size={12} /> Calendar ID
                </label>
                <div className="relative group/lock">
                  <div className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-400 flex items-center justify-between cursor-not-allowed select-none">
                    <span className="tracking-tight">{item.calendar_id}</span>
                    <Lock size={12} className="text-slate-300" />
                  </div>
                  {/* Hover explanation for enterprise users */}
                  <div className="absolute -top-8 right-0 px-2 py-1 bg-slate-800 text-white text-[7px] font-black uppercase rounded opacity-0 group-hover/lock:opacity-100 transition-opacity pointer-events-none tracking-[0.2em]">
                    System Assigned
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Holiday Type</label>
                <div className="relative">
                  <select 
                    value={item.holiday_type}
                    onChange={(e) => updateField(index, 'holiday_type', e.target.value)}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none appearance-none cursor-pointer"
                  >
                    <option value="Public">Public</option>
                    <option value="Regional">Regional</option>
                    <option value="Restricted">Restricted</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
              </div>

              <div className="md:col-span-9 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Applicable Departments</label>
                <div className="flex flex-wrap gap-2 p-2 bg-white border border-slate-200 rounded-2xl min-h-[52px] items-center">
                  {departmentOptions.map((dept) => {
                    const isActive = item.departments.includes(dept);
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => toggleDepartment(index, dept)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5 ${
                          isActive 
                            ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {isActive && <Check size={10} />}
                        {dept}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-12 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
                <textarea 
                  value={item.description}
                  onChange={(e) => updateField(index, 'description', e.target.value)}
                  rows="2"
                  placeholder="Provide context for this holiday..."
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none resize-none"
                />
              </div>

              <div className="md:col-span-6 flex gap-4">
                <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border transition-all ${item.is_optional ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
                  <div>
                    <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Optional Asset</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Non-Mandatory</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={item.is_optional}
                    onChange={(e) => updateField(index, 'is_optional', e.target.checked)}
                    className="w-5 h-5 accent-blue-600 rounded-md cursor-pointer" 
                  />
                </div>

                <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border transition-all ${item.is_recurring ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                  <div>
                    <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Recurring Cycle</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Annual Pattern</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={item.is_recurring}
                    onChange={(e) => updateField(index, 'is_recurring', e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded-md cursor-pointer" 
                  />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-3 text-slate-400">
          <ShieldCheck size={20} />
          <p className="text-[9px] font-black uppercase tracking-widest">Protocol: JSON Structure Validated</p>
        </div>
        <button  onClick={handleSubmit} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95">
          Submit Configuration Batch
        </button>
      </div>
    </div>
  );
};

export default HolidayForm;
//**********************************************************working code phase 12******************************************************************* */
// import React, { useState } from "react";
// import { Plus, Trash2, ShieldCheck, Info, Layers, Calendar as CalendarIcon, ChevronDown, Check } from "lucide-react";

// const HolidayForm = () => {
//   // Config options for dropdowns
//   const calendarOptions = ["default_india", "us_regional", "eu_standard", "uae_corporate"];
//   const departmentOptions = ["All", "Engineering", "Human Resources", "Marketing", "Sales", "Finance", "Operations"];

//   const [holidays, setHolidays] = useState([{
//     name: "",
//     date: "",
//     holiday_type: "Public",
//     description: "",
//     departments: ["All"],
//     calendar_id: "default_india",
//     is_optional: false,
//     is_recurring: false
//   }]);

//   const addRow = () => setHolidays([...holidays, {
//     name: "", date: "", holiday_type: "Public", description: "",
//     departments: ["All"], calendar_id: "default_india", is_optional: false, is_recurring: false
//   }]);

//   const removeRow = (index) => setHolidays(holidays.filter((_, i) => i !== index));

//   const updateField = (index, field, value) => {
//     const newHolidays = [...holidays];
//     newHolidays[index][field] = value;
//     setHolidays(newHolidays);
//   };

//   const toggleDepartment = (index, dept) => {
//     const currentDepts = holidays[index].departments;
//     let newDepts;
//     if (dept === "All") {
//       newDepts = ["All"];
//     } else {
//       newDepts = currentDepts.filter(d => d !== "All");
//       if (newDepts.includes(dept)) {
//         newDepts = newDepts.filter(d => d !== dept);
//         if (newDepts.length === 0) newDepts = ["All"];
//       } else {
//         newDepts = [...newDepts, dept];
//       }
//     }
//     updateField(index, 'departments', newDepts);
//   };

//   return (
//     <div className="p-10 bg-white min-h-screen">
//       {/* SECTION HEADER */}
//       <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
//         <div>
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Asset Configuration</h2>
//           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Controlled Data Entry Protocol</p>
//         </div>
//         <button 
//           onClick={addRow}
//           className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
//         >
//           <Plus size={14} /> Add New Entry
//         </button>
//       </div>

//       <div className="space-y-12">
//         {holidays.map((item, index) => (
//           <div key={index} className="group relative p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
            
//             <div className="absolute -left-3 top-10 w-8 h-8 bg-slate-900 text-white text-[10px] font-black flex items-center justify-center rounded-lg shadow-xl">
//               {String(index + 1).padStart(2, '0')}
//             </div>
            
//             {index > 0 && (
//               <button onClick={() => removeRow(index)} className="absolute -right-3 -top-3 p-2.5 bg-white border border-red-100 text-red-500 rounded-full shadow-xl hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
//                 <Trash2 size={16} />
//               </button>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
//               {/* PRIMARY DATA */}
//               <div className="md:col-span-6 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Info size={12} /> Holiday Name
//                 </label>
//                 <input 
//                   type="text" 
//                   value={item.name}
//                   onChange={(e) => updateField(index, 'name', e.target.value)}
//                   placeholder="e.g. Annual Foundation Day" 
//                   className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                 />
//               </div>

//               <div className="md:col-span-3 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <CalendarIcon size={12} /> Target Date
//                 </label>
//                 <input 
//                   type="date" 
//                   value={item.date}
//                   onChange={(e) => updateField(index, 'date', e.target.value)}
//                   className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none"
//                 />
//               </div>

//               {/* CALENDAR ID DROPDOWN */}
//               {/* <div className="md:col-span-3 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Layers size={12} /> Calendar ID
//                 </label>
//                 <div className="relative">
//                   <select 
//                     value={item.calendar_id}
//                     onChange={(e) => updateField(index, 'calendar_id', e.target.value)}
//                     className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none appearance-none"
//                   >
//                     {calendarOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
//                 </div>
//               </div> */}
//               {/* CALENDAR ID - READ ONLY PROTOCOL */}
// <div className="md:col-span-3 space-y-2">
//   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//     <Layers size={12} /> Calendar ID
//   </label>
//   <div className="relative group/lock">
//     {/* Visual Container matching the Select/Input style */}
//     <div className="w-full px-5 py-3.5 bg-slate-100/50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 flex items-center justify-between cursor-not-allowed">
//       <span>{item.calendar_id}</span>
      
//       {/* Lock icon instead of Chevron to signal Read-Only status */}
//       <div className="flex items-center gap-2">
//         <div className="w-[1px] h-3 bg-slate-200" />
//         <svg 
//           width="12" 
//           height="12" 
//           viewBox="0 0 24 24" 
//           fill="none" 
//           stroke="currentColor" 
//           strokeWidth="3" 
//           strokeLinecap="round" 
//           strokeLinejoin="round" 
//           className="text-slate-400"
//         >
//           <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
//           <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//         </svg>
//       </div>
//     </div>

//     {/* Subtle Tooltip on Hover */}
//     <div className="absolute -top-8 left-0 px-2 py-1 bg-slate-800 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover/lock:opacity-100 transition-opacity pointer-events-none tracking-widest">
//       System Locked Field
//     </div>
//   </div>
// </div>

//               {/* HOLIDAY TYPE */}
//               <div className="md:col-span-3 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Holiday Type</label>
//                 <div className="relative">
//                   <select 
//                     value={item.holiday_type}
//                     onChange={(e) => updateField(index, 'holiday_type', e.target.value)}
//                     className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none appearance-none"
//                   >
//                     <option value="Public">Public</option>
//                     <option value="Regional">Regional</option>
//                     <option value="Restricted">Restricted</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
//                 </div>
//               </div>

//               {/* DEPARTMENTS MULTI-SELECT CHIPS */}
//               <div className="md:col-span-9 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Applicable Departments</label>
//                 <div className="flex flex-wrap gap-2 p-2 bg-white border border-slate-200 rounded-2xl min-h-[52px] items-center">
//                   {departmentOptions.map((dept) => {
//                     const isActive = item.departments.includes(dept);
//                     return (
//                       <button
//                         key={dept}
//                         onClick={() => toggleDepartment(index, dept)}
//                         className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5 ${
//                           isActive 
//                             ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
//                             : "bg-slate-100 text-slate-400 hover:bg-slate-200"
//                         }`}
//                       >
//                         {isActive && <Check size={10} />}
//                         {dept}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* DESCRIPTION */}
//               <div className="md:col-span-12 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
//                 <textarea 
//                   value={item.description}
//                   onChange={(e) => updateField(index, 'description', e.target.value)}
//                   rows="2"
//                   placeholder="Provide context for this holiday..."
//                   className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none resize-none"
//                 />
//               </div>

//               {/* PROTOCOLS */}
//               <div className="md:col-span-6 flex gap-4">
//                 <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border transition-all ${item.is_optional ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
//                   <div>
//                     <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Optional Asset</p>
//                     <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Non-Mandatory</p>
//                   </div>
//                   <input 
//                     type="checkbox" 
//                     checked={item.is_optional}
//                     onChange={(e) => updateField(index, 'is_optional', e.target.checked)}
//                     className="w-5 h-5 accent-blue-600 rounded-md cursor-pointer" 
//                   />
//                 </div>

//                 <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border transition-all ${item.is_recurring ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
//                   <div>
//                     <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Recurring Cycle</p>
//                     <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Annual Pattern</p>
//                   </div>
//                   <input 
//                     type="checkbox" 
//                     checked={item.is_recurring}
//                     onChange={(e) => updateField(index, 'is_recurring', e.target.checked)}
//                     className="w-5 h-5 accent-emerald-600 rounded-md cursor-pointer" 
//                   />
//                 </div>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>

//       {/* SUBMISSION FOOTER */}
//       <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
//         <div className="hidden lg:flex items-center gap-3 text-slate-400">
//           <ShieldCheck size={20} />
//           <p className="text-[9px] font-black uppercase tracking-widest">Protocol: JSON Structure Validated</p>
//         </div>
//         <button className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95">
//           Submit Configuration Batch
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HolidayForm;
//*****************************************************working code phase 12************************************************************** */
// import React, { useState } from "react";
// import { Plus, Trash2, ShieldCheck, Info, Layers, Calendar as CalendarIcon } from "lucide-react";

// const HolidayForm = () => {
//   // Logic to handle multiple holiday entries
//   const [holidays, setHolidays] = useState([{
//     name: "",
//     date: "",
//     holiday_type: "Public",
//     description: "",
//     departments: ["All"],
//     calendar_id: "default_india",
//     is_optional: false,
//     is_recurring: false
//   }]);

//   const addRow = () => setHolidays([...holidays, {
//     name: "", date: "", holiday_type: "Public", description: "",
//     departments: ["All"], calendar_id: "default_india", is_optional: false, is_recurring: false
//   }]);

//   const removeRow = (index) => setHolidays(holidays.filter((_, i) => i !== index));

//   const updateField = (index, field, value) => {
//     const newHolidays = [...holidays];
//     newHolidays[index][field] = value;
//     setHolidays(newHolidays);
//   };

//   return (
//     <div className="p-10 bg-white">
//       {/* SECTION HEADER */}
//       <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
//         <div>
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Asset Configuration</h2>
//           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Populate organizational holiday parameters</p>
//         </div>
//         <button 
//           onClick={addRow}
//           className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
//         >
//           <Plus size={14} /> Add New Entry
//         </button>
//       </div>

//       <div className="space-y-12">
//         {holidays.map((item, index) => (
//           <div key={index} className="group relative p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
            
//             {/* ROW COUNTER & DELETE */}
//             <div className="absolute -left-3 top-10 w-8 h-8 bg-slate-900 text-white text-[10px] font-black flex items-center justify-center rounded-lg shadow-xl">
//               {String(index + 1).padStart(2, '0')}
//             </div>
            
//             {index > 0 && (
//               <button 
//                 onClick={() => removeRow(index)}
//                 className="absolute -right-3 -top-3 p-2.5 bg-white border border-red-100 text-red-500 rounded-full shadow-xl hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
//               >
//                 <Trash2 size={16} />
//               </button>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
//               {/* ROW 1: PRIMARY DATA */}
//               <div className="md:col-span-5 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Info size={12} /> Holiday Name
//                 </label>
//                 <input 
//                   type="text" 
//                   value={item.name}
//                   onChange={(e) => updateField(index, 'name', e.target.value)}
//                   placeholder="e.g. Annual Foundation Day" 
//                   className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                 />
//               </div>

//               <div className="md:col-span-3 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <CalendarIcon size={12} /> Target Date
//                 </label>
//                 <input 
//                   type="date" 
//                   value={item.date}
//                   onChange={(e) => updateField(index, 'date', e.target.value)}
//                   className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none"
//                 />
//               </div>

//               <div className="md:col-span-4 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Layers size={12} /> Calendar ID
//                 </label>
//                 <input 
//                   type="text" 
//                   value={item.calendar_id}
//                   onChange={(e) => updateField(index, 'calendar_id', e.target.value)}
//                   className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none italic text-slate-500"
//                 />
//               </div>

//               {/* ROW 2: CATEGORIZATION */}
//               <div className="md:col-span-3 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Holiday Type</label>
//                 <select 
//                   value={item.holiday_type}
//                   onChange={(e) => updateField(index, 'holiday_type', e.target.value)}
//                   className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none"
//                 >
//                   <option value="Public">Public</option>
//                   <option value="Regional">Regional</option>
//                   <option value="Restricted">Restricted</option>
//                 </select>
//               </div>

//               <div className="md:col-span-5 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Applicable Departments</label>
//                 <div className="relative">
//                   <input 
//                     type="text" 
//                     value={item.departments.join(", ")}
//                     placeholder="All, HR, Engineering..." 
//                     className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none"
//                     onChange={(e) => updateField(index, 'departments', e.target.value.split(", "))}
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-blue-500 uppercase">Array</span>
//                 </div>
//               </div>

//               {/* ROW 3: DESCRIPTION */}
//               <div className="md:col-span-12 space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
//                 <textarea 
//                   value={item.description}
//                   onChange={(e) => updateField(index, 'description', e.target.value)}
//                   rows="2"
//                   placeholder="Provide context for this holiday..."
//                   className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none resize-none"
//                 />
//               </div>

//               {/* ROW 4: PROTOCOLS (BOOLEANS) */}
//               <div className="md:col-span-6 flex gap-4">
//                 <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border transition-all ${item.is_optional ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
//                   <div>
//                     <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Optional Asset</p>
//                     <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Non-Mandatory</p>
//                   </div>
//                   <input 
//                     type="checkbox" 
//                     checked={item.is_optional}
//                     onChange={(e) => updateField(index, 'is_optional', e.target.checked)}
//                     className="w-5 h-5 accent-blue-600 rounded-md" 
//                   />
//                 </div>

//                 <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border transition-all ${item.is_recurring ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
//                   <div>
//                     <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Recurring Cycle</p>
//                     <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Annual Pattern</p>
//                   </div>
//                   <input 
//                     type="checkbox" 
//                     checked={item.is_recurring}
//                     onChange={(e) => updateField(index, 'is_recurring', e.target.checked)}
//                     className="w-5 h-5 accent-emerald-600 rounded-md" 
//                   />
//                 </div>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>

//       {/* SUBMISSION FOOTER */}
//       <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
//         <div className="hidden lg:flex items-center gap-3 text-slate-400">
//           <ShieldCheck size={20} />
//           <p className="text-[9px] font-black uppercase tracking-widest">Encryption Protocol: AES-256 Enabled</p>
//         </div>
//         <button className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95">
//           Submit Configuration Batch
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HolidayForm;
//*************************************************woring code phase 12************************************************************************ */
// import React, { useState } from "react";
// import { Plus, Trash2, Save, ShieldCheck } from "lucide-react";

// const HolidayForm = () => {
//   const [holidays, setHolidays] = useState([{
//     name: "", date: "", holiday_type: "Public", description: "",
//     departments: ["All"], calendar_id: "default_india", is_optional: false, is_recurring: false
//   }]);

//   const addRow = () => setHolidays([...holidays, { ...holidays[0], name: "", date: "" }]);
//   const removeRow = (index) => setHolidays(holidays.filter((_, i) => i !== index));

//   return (
//     <div className="p-10">
//       <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
//         <div>
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Holiday Configuration</h2>
//           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Batch Entry Mode</p>
//         </div>
//         <button onClick={addRow} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100 transition-all">
//           <Plus size={14} /> Add Entry
//         </button>
//       </div>

//       <div className="space-y-6">
//         {holidays.map((item, index) => (
//           <div key={index} className="group relative grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all">
//             {index > 0 && (
//               <button onClick={() => removeRow(index)} className="absolute -top-3 -right-3 p-2 bg-white border border-red-100 text-red-500 rounded-full shadow-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <Trash2 size={14} />
//               </button>
//             )}
            
//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Name</label>
//               <input type="text" placeholder="e.g. Independence Day" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Calendar Date</label>
//               <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Holiday Type</label>
//               <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none">
//                 <option>Public</option>
//                 <option>Regional</option>
//                 <option>Optional</option>
//               </select>
//             </div>

//             <div className="flex items-end gap-4">
//               <div className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl">
//                  <span className="text-[10px] font-black text-slate-400 uppercase">Recurring</span>
//                  <input type="checkbox" className="w-4 h-4 rounded-md accent-blue-600" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
//         <button className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl transition-all">
//           <ShieldCheck size={18} /> Deploy Calendar Updates
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HolidayForm;