import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  CalendarDays, 
  ChevronRight, 
  Users,
  Search,
  Settings2,
  X,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WeeklyHoliday = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Weekly Off');
  
  // --- STATE FOR DRAWER ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Data for First Tab (Weekly Off)
  const weeklyOffTemplates = [
    { id: 1, name: "Default Template-1", createdBy: "Goelectronix Technologies Private Limited", staffCount: 38 },
    { id: 2, name: "Saturday Holoday", createdBy: "Goelectronix Technologies Private Limited", staffCount: 1 },
    { id: 3, name: "Sat Sun Off", createdBy: "Goelectronix Technologies Private Limited", staffCount: 0 },
  ];

  // ✅ Data for Second Tab (Attendance On Weekly Off) -
  const attendanceTemplates = [
    { id: 1, name: "System Comp Off Template", createdBy: "Goelectronix Technologies Private Limited", staffCount: 38 }
  ];

  const handleStaffClick = (template) => {
    setSelectedTemplate(template);
    setIsDrawerOpen(true);
  };

  // Determine which data to show
  const currentTemplates = activeTab === 'Weekly Off' ? weeklyOffTemplates : attendanceTemplates;

  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-20 text-left relative overflow-x-hidden">
      {/* 🚀 HEADER */}
      <div className="bg-white border-b border-slate-100 px-2 md:px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-600 transition-transform" />
          <span className="text-[11px] font-black bg-transparent !text-slate-700 !capitalize tracking-widest">Back to Settings</span>
        </button>
      </div>

      <div className="mx-auto md:px-6 px-2 mt-4">
        {/* 📑 MAIN CONTAINER CARD */}
        <div className="bg-white border border-slate-200 rounded-xl md:p-8 p-4 shadow-sm space-y-8">
          
          {/* TOP ACTIONS & TABS */}
          <div className="space-y-6 mb-4">
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
              {['Weekly Off', 'Attendance On Weekly Off'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg md:text-[10px] text-[8px] font-black capitalize tracking-widest transition-all duration-200 cursor-pointer ${
                    activeTab === tab 
                      ? '!bg-white shadow-sm !text-blue-600' 
                      : '!text-slate-500 hover:!text-slate-600 !bg-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                {/* ✅ Dynamic Title & Description - */}
                <h1 className="md:text-xl text-lg font-black !text-slate-900 tracking-tighter !capitalize leading-tight">
                  {activeTab === 'Weekly Off' ? 'Weekly Off Template' : 'Attendance on Weekly Off Templates'}
                </h1>
                <p className="md:text-[10px] text-[8px] font-bold !text-slate-600 !capitalize tracking-widest">
                  {activeTab === 'Weekly Off' 
                    ? 'Create templates for weekly off management' 
                    : 'Create templates to mark attendance on weekly off'}
                </p>
              </div>
              
              {/* <button
                onClick={() => navigate('/createweeklyholiday')} 
                className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl border border-blue-500 shadow-sm shadow-blue-200 hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={16} strokeWidth={3} />
                <span className="text-[11px] font-black capitalize tracking-widest">New Template</span>
              </button> */}
              <button
  onClick={() => {
    if (activeTab === 'Weekly Off') {
      navigate('/createweeklyholiday');
    } else {
      navigate('/createattendaceweeklyoff');
    }
  }}
  className="flex items-center justify-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl border border-blue-500 shadow-sm shadow-blue-200 hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
>
  <Plus size={16} strokeWidth={3} />
  <span className="md:text-[11px] text-[8px] font-black capitalize tracking-widest">{`New ${activeTab} Template`}</span>
</button>
            </div>
          </div>

          {/* 📂 TEMPLATE LIST */}
          <div className="space-y-3">
            {currentTemplates.map((template) => (
              <div 
                key={template.id} 
                className="group flex items-center justify-between md:p-6 p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/50 transition-all bg-white relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-blue-600 transition-colors" />
                
                <div className="flex items-center gap-5 relative z-10 text-left">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <CalendarDays size={24} strokeWidth={1.5} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black !text-slate-800 !capitalize tracking-tight group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <p className="md:text-[9px] text-[8px] font-bold text-slate-500 capitalize tracking-wider leading-none">
                        Created by: <span className="text-slate-600">{template.createdBy}</span>
                      </p>
                      <div className="h-1 w-1 rounded-full bg-slate-200 hidden md:block" />
                      
                      <button 
                        onClick={() => handleStaffClick(template)}
                        className="text-[9px] font-black !text-blue-500 capitalize cursor-pointer tracking-widest hover:underline underline-offset-4 !bg-transparent border-0 outline-none leading-none"
                      >
                        Assigned Staff: {template.staffCount} Staffs
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                  <button className="p-2 !text-slate-300 hover:text-slate-900 hover:!bg-slate-100 rounded-lg transition-all !bg-transparent border-0 cursor-pointer">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-slate-900 pointer-events-none rotate-12">
                   <Settings2 size={100} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🛡️ MODULAR STAFF DRAWER */}
      <StaffListDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={selectedTemplate?.name}
      />
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[80] transition-all duration-300" 
          onClick={() => setIsDrawerOpen(false)} 
        />
      )}
    </div>
  );
};

const StaffListDrawer = ({ isOpen, onClose, title }) => {
  const [subTab, setSubTab] = useState('unselected');
  const unselectedStaff = [
    { id: '#MUMGE84', name: "indresh bhai", location: "Goelectronix Technologies Private Limited" },
    { id: '#MUMGE82', name: "Nilesh Khanderao Kuwar", location: "Goelectronix Technologies Private Limited" }
  ];

  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[100] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full relative text-left">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-slate-900 capitalize tracking-tighter leading-none">Staff List</h2>
            <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest mt-1">Template: {title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all !bg-transparent cursor-pointer border-0"><X size={20} /></button>
        </div>

        <div className="px-6 py-4">
          <div className="flex p-1 bg-slate-100 rounded-xl w-fit mb-4 border border-slate-200/60 shadow-inner">
            {['selected', 'unselected'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setSubTab(tab)} 
                className={`relative px-6 py-2 rounded-lg text-[10px] font-black capitalize !bg-transparent tracking-widest transition-all duration-300 cursor-pointer ${
                  subTab === tab ? '!bg-white shadow-md !text-blue-600 ring-1 ring-slate-200/50' : '!text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab} Staff
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input type="text" placeholder="Search by name..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-400 transition-all font-bold" />
          </div>
          <button className="flex items-center !bg-transparent gap-2 px-4 py-2 border border-blue-500 rounded-xl !text-blue-600 text-[10px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-colors cursor-pointer">
            <Filter size={14} /> Filter
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="py-2 px-1"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" /></th>
                <th className="py-2 text-[9px] font-black text-slate-300 capitalize tracking-widest">Details</th>
                <th className="py-2 text-[9px] font-black text-slate-300 capitalize tracking-widest text-right">System ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {unselectedStaff.map((staff, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-1"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" /></td>
                  <td className="py-3">
                    <p className="text-[11px] font-bold text-slate-700">{staff.name}</p>
                    <p className="text-[8px] font-black text-slate-300 capitalize tracking-widest leading-tight">{staff.location}</p>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-black text-blue-600 capitalize bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{staff.id}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button className="w-full py-3 !bg-white !text-blue-600 border-2 border-blue-500 rounded-xl text-[11px] font-black capitalize tracking-widest shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all active:scale-95 cursor-pointer">
            {subTab === 'selected' ? 'Remove Selected Staff' : 'Move to Selected Staff'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyHoliday;
//****************************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Plus, 
//   MoreVertical, 
//   CalendarDays, 
//   ChevronRight, 
//   Users,
//   Search,
//   Settings2,
//   X,
//   Filter
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const WeeklyHoliday = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Weekly Off');
  
//   // --- 1. NEW STATE FOR DRAWER ---
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);

//   // Data based on image_f0f228.jpg
//   const templates = [
//     { 
//       id: 1, 
//       name: "Default Template-1", 
//       createdBy: "Goelectronix Technologies Private Limited", 
//       staffCount: 38 
//     },
//     { 
//       id: 2, 
//       name: "Saturday Holoday", 
//       createdBy: "Goelectronix Technologies Private Limited", 
//       staffCount: 1 
//     },
//     { 
//       id: 3, 
//       name: "Sat Sun Off", 
//       createdBy: "Goelectronix Technologies Private Limited", 
//       staffCount: 0 
//     },
//   ];

//   // --- 2. NEW CLICK HANDLER ---
//   const handleStaffClick = (template) => {
//     setSelectedTemplate(template);
//     setIsDrawerOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20 text-left relative overflow-x-hidden">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
//         <button 
//           onClick={() => navigate(-1)} 
//           className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-400 transition-transform" />
//           <span className="text-[11px] font-black bg-transparent text-slate-400 capitalize tracking-widest">Back to Settings</span>
//         </button>
//       </div>

//       <div className=" mx-auto px-6 mt-8">
//         {/* 📑 MAIN CONTAINER CARD */}
//         <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-8">
          
//           {/* TOP ACTIONS & TABS */}
//           <div className="space-y-6">
//             <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
//               {['Weekly Off', 'Attendance On Weekly Off'].map((tab) => (
//                 <button 
//                   key={tab} 
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-6 py-2 rounded-lg text-[10px] font-black capitalize tracking-widest transition-all duration-200 ${
//                     activeTab === tab 
//                       ? '!bg-white shadow-sm !text-blue-600' 
//                       : '!text-slate-400 hover:!text-slate-600 !bg-transparent'
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div className="space-y-1">
//                 <h1 className="text-xl font-black text-slate-900 tracking-tighter capitalize">Weekly Off Template</h1>
//                 <p className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">Create templates for weekly off management</p>
//               </div>
              
//               <button
//               onClick={() => navigate('/createweeklyholiday')} 
//               className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl border border-blue-500 shadow-sm shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
//                 <Plus size={16} strokeWidth={3} />
//                 <span className="text-[11px] font-black capitalize tracking-widest">New Template</span>
//               </button>
//             </div>
//           </div>

//           {/* 📂 TEMPLATE LIST */}
//           <div className="space-y-3">
//             {templates.map((template) => (
//               <div 
//                 key={template.id} 
//                 className="group flex items-center justify-between p-6 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/50 transition-all bg-white relative overflow-hidden"
//               >
//                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-blue-600 transition-colors" />
                
//                 <div className="flex items-center gap-5 relative z-10">
//                   <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
//                     <CalendarDays size={24} strokeWidth={1.5} />
//                   </div>
                  
//                   <div className="space-y-1.5">
//                     <h3 className="text-sm font-black text-slate-800 capitalize tracking-tight group-hover:text-blue-600 transition-colors">
//                       {template.name}
//                     </h3>
//                     <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
//                       <p className="text-[9px] font-bold text-slate-400 capitalize tracking-wider">
//                         Created by: <span className="text-slate-600">{template.createdBy}</span>
//                       </p>
//                       <div className="h-1 w-1 rounded-full bg-slate-200 hidden md:block" />
                      
//                       {/* --- 3. UPDATED CLICK ACTION --- */}
//                       <button 
//                         onClick={() => handleStaffClick(template)}
//                         className="text-[9px] font-black !text-blue-500 capitalize cursor-pointer tracking-widest hover:underline underline-offset-4 !bg-transparent border-0 outline-none"
//                       >
//                         Assigned Staff: {template.staffCount} Staffs
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 relative z-10">
//                   <button className="p-2 !text-slate-300 hover:text-slate-900 hover:!bg-slate-100 rounded-lg transition-all !bg-transparent border-0">
//                     <MoreVertical size={20} />
//                   </button>
//                 </div>

//                 <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-slate-900 pointer-events-none rotate-12">
//                    <Settings2 size={100} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- 4. NEW DRAWER COMPONENT CALL --- */}
//       <StaffListDrawer 
//         isOpen={isDrawerOpen} 
//         onClose={() => setIsDrawerOpen(false)} 
//         title={selectedTemplate?.name}
//       />
//       {isDrawerOpen && (
//         <div 
//           className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[80] transition-all duration-300" 
//           onClick={() => setIsDrawerOpen(false)} 
//         />
//       )}
//     </div>
//   );
// };

// // --- 5. NEW STAFF LIST DRAWER COMPONENT ---
// const StaffListDrawer = ({ isOpen, onClose, title }) => {
//   const [subTab, setSubTab] = useState('unselected');
//   const unselectedStaff = [
//     { id: '#MUMGE84', name: "indresh bhai", location: "Goelectronix Technologies Private Limited" },
//     { id: '#MUMGE82', name: "Nilesh Khanderao Kuwar", location: "Goelectronix Technologies Private Limited" }
//   ];

//   return (
//     <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[100] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//       <div className="flex flex-col h-full relative text-left">
//         {/* Header */}
//         <div className="p-6 border-b border-slate-100 flex justify-between items-start">
//           <div>
//             <h2 className="text-xl font-black text-slate-900 capitalize tracking-tighter leading-none">Staff List</h2>
//             <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest mt-1">Template: {title}</p>
//           </div>
//           <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all !bg-transparent"><X size={20} /></button>
//         </div>

//         {/* Tab Switcher */}
//         <div className="px-6 py-4">
//           <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
//             {['selected', 'unselected'].map((tab) => (
//               <button 
//                 key={tab} 
//                 onClick={() => setSubTab(tab)} 
//                 className={`relative px-6 py-2 rounded-lg text-[10px] font-black capitalize !bg-transparent tracking-widest transition-all duration-300 ${
//                   subTab === tab ? '!bg-white shadow-md !text-blue-600 ring-1 ring-slate-200/50' : '!text-slate-400 hover:text-slate-600'
//                 }`}
//               >
//                 {tab} Staff
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Search & Filter */}
//         <div className="px-6 mb-4 flex gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//             <input 
//               type="text" 
//               placeholder="Search by name..." 
//               className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-400 transition-all font-bold" 
//             />
//           </div>
//           <button className="flex items-center !bg-transparent gap-2 px-4 py-2 border border-blue-500 rounded-xl !text-blue-600 text-[10px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-colors">
//             <Filter size={14} /> Filter
//           </button>
//         </div>

//         {/* Table Content */}
//         <div className="flex-1 overflow-y-auto px-6">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b border-slate-50">
//                 <th className="py-2 px-1"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" /></th>
//                 <th className="py-2 text-[9px] font-black text-slate-300 capitalize tracking-widest">Details</th>
//                 <th className="py-2 text-[9px] font-black text-slate-300 capitalize tracking-widest text-right">System ID</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {unselectedStaff.map((staff, idx) => (
//                 <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
//                   <td className="py-3 px-1"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" /></td>
//                   <td className="py-3">
//                     <p className="text-[11px] font-bold text-slate-700">{staff.name}</p>
//                     <p className="text-[8px] font-black text-slate-300 capitalize tracking-widest leading-tight">{staff.location}</p>
//                   </td>
//                   <td className="py-3 text-right">
//                     <span className="text-[10px] font-black text-blue-600 capitalize bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{staff.id}</span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer Action */}
//         <div className="p-6 border-t border-slate-100 bg-slate-50/50">
//           <button className="w-full py-3 !bg-white !text-blue-600 border-2 border-blue-500 rounded-xl text-[11px] font-black capitalize tracking-widest shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all active:scale-95">
//             {subTab === 'selected' ? 'Remove Selected Staff' : 'Move to Selected Staff'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeeklyHoliday;