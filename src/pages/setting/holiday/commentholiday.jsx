import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Plus, MoreVertical, Calendar, ChevronRight, ChevronUp, X, Search, Filter, Edit2, Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HolidayPage = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [holidayTemplates, setHolidayTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚀 DROPDOWN STATE
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('https://uathr.goelectronix.co.in/holidays/templates/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setHolidayTemplates(data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // 🖱️ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStaffClick = (template) => {
    setSelectedTemplate(template);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (item) => {
    setOpenDropdownId(null);
    // TODO: Add your edit logic here (e.g., open a modal, or navigate to edit page)
    console.log("Editing template:", item);
    // navigate(`/editholiday/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-10 relative overflow-x-hidden text-left">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 rounded-xl !text-slate-400 !bg-transparent transition-all">
            <ArrowLeft size={18} />
          </button>
          <span className="text-[10px] font-black text-slate-500 capitalize tracking-widest leading-none">Settings / Holiday Templates</span>
        </div>
      </div>

      <div className=" mx-auto md:px-6 px-2 mt-8">
        {/* 📑 PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="space-y-1 px-2">
            <h1 className="md:text-xl text-lg font-black !text-slate-900 tracking-tighter !capitalize">Holiday Templates</h1>
            <p className="md:text-[10px] text-[8px] font-bold !text-slate-500 capitalize tracking-widest">Create templates to auto-assign paid leave on public holidays.</p>
          </div>
          <button 
            onClick={()=> navigate('/createholiday')}
            className="flex items-center justify-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 rounded-xl shadow-sm border border-blue-600 shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={16} strokeWidth={3} />
            <span className="text-[11px] font-black capitalize tracking-widest">New Template</span>
          </button>
        </div>

        {/* 📂 LIST OF TEMPLATES */}
        <div className="space-y-3" ref={dropdownRef}>
          {isLoading ? (
            <div className="text-center py-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Templates...</span>
            </div>
          ) : (
            holidayTemplates.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
              >
                {/* 📱 RESPONSIVE WRAPPER: Stacks on mobile (flex-col), row on desktop (sm:flex-row) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                  
                  {/* LEFT SIDE: Icon & Details */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <Calendar size={24} strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black !text-slate-800 !capitalize tracking-tight">
                          {item.name}
                        </h3>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-md capitalize tracking-tighter border border-blue-100 whitespace-nowrap">
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold !text-slate-500 capitalize tracking-widest">
                        Number of Holidays: <span className="text-slate-900">{item.holidays ? item.holidays.length : 0}</span>
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE: Assigned Staff & Menu */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-8 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
                    
                    {/* TRIGGER: Open Staff List */}
                    <div 
                      onClick={() => handleStaffClick(item)} 
                      className="cursor-pointer group/staff text-left sm:text-right flex-1 sm:flex-initial"
                    >
                      <p className="text-[9px] font-black text-slate-400 capitalize tracking-widest mb-1 group-hover/staff:text-blue-600 transition-colors">
                        Assigned Staff
                      </p>
                      <div className="flex items-center gap-2 justify-start sm:justify-end">
                        <span className="text-[11px] font-bold text-slate-700">{item.staffCount || 0}</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover/staff:text-blue-600 transition-all" />
                      </div>
                    </div>
                    
                    {/* ⚙️ OPTIONS DROPDOWN */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === item.id ? null : item.id);
                        }}
                        className={`p-2 rounded-xl transition-colors shrink-0 ${openDropdownId === item.id ? '!bg-blue-50 !text-blue-600' : '!bg-transparent !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50'}`}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {/* Dropdown Menu Box */}
                      {openDropdownId === item.id && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="p-1">
                            <button 
                              onClick={() => handleEditClick(item)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group/item"
                            >
                              <Edit2 size={14} className="text-slate-400 group-hover/item:text-blue-600" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover/item:text-blue-600">Edit</span>
                            </button>
                            <div className="h-px w-full bg-slate-100 my-1" />
                            <button 
                              onClick={() => {
                                setOpenDropdownId(null);
                                // Add delete logic
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group/item"
                            >
                              <Trash2 size={14} className="text-slate-400 group-hover/item:text-red-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover/item:text-red-600">Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🛡️ STAFF LIST DRAWER (Integrated Logic) */}
      <StaffListDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      {isDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40" onClick={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

// ---------------------------------------------------------
// 🚪 REUSABLE STAFF DRAWER COMPONENT
// ---------------------------------------------------------
const StaffListDrawer = ({ isOpen, onClose }) => {
  const [subTab, setSubTab] = useState('unselected');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const unselectedStaff = [
    { id: '#MUMGE84', name: "indresh bhai", location: "Goelectronix Technologies Private Limited" },
    { id: '#MUMGE82', name: "Nilesh Khanderao Kuwar", location: "Goelectronix Technologies Private Limited" }
  ];

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-80 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full relative">
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <h2 className="text-xl font-black text-slate-900 capitalize tracking-tighter">Staff List</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
          </div>

          <div className="px-6 py-4">
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
              {['selected', 'unselected'].map((tab) => (
                <button key={tab} onClick={() => setSubTab(tab)} className={`relative px-6 py-2 rounded-lg text-[10px] font-black capitalize !bg-transparent tracking-widest transition-all duration-300 ${subTab === tab ? '!bg-white shadow-md !text-blue-600 ring-1 ring-slate-200/50' : '!text-slate-400 hover:text-slate-600'}`}>
                  {tab} Staff
                  {subTab === tab && <span className="absolute -top-1 -right-1 w-2 h-2 !bg-white rounded-full border-2 !border-white animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input type="text" placeholder="Search by name..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-400" />
            </div>
            <button onClick={() => setIsFilterOpen(true)} className="flex items-center !bg-transparent gap-2 px-4 py-2 border !border-blue-600 rounded-xl !text-blue-600 text-[10px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-colors">
              <Filter size={14} /> Filter
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {unselectedStaff.map((staff, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-1"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" /></td>
                    <td className="py-3 text-[11px] font-bold text-slate-700">{staff.name}</td>
                    <td className="py-3 text-[10px] font-black text-blue-600 capitalize">{staff.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <button className={`w-full py-3 rounded-xl text-[11px] font-black capitalize tracking-widest transition-all shadow-sm ${subTab === 'selected' ? '!bg-blue-50 !text-blue-600 border !border-blue-600 hover:!bg-white' : '!bg-white !text-blue-600 border !border-blue-600 hover:!bg-blue-50'}`}>
              {subTab === 'selected' ? 'Remove Staff' : 'Move to Selected'}
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 ACCORDION FILTER MODAL (Global Centered) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsFilterOpen(false)} />
          
          <div className="relative bg-white w-full max-w-[360px] rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-300">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-[13px] font-black text-slate-900 capitalize tracking-tighter">Filter By</h3>
                <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-0.5" />
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="p-1.5 !bg-slate-50 hover:!bg-slate-50 hover:!text-blue-600 rounded-lg !text-slate-400 transition-all"><X size={16} /></button>
            </div>

            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-left">
              {[
                { id: 'salary', label: 'Salary Type', options: ['Monthly', 'Daily', 'Work Basis', 'Hourly'] },
                { id: 'dept', label: 'Department', options: ['Finance', 'Hr & Admin', 'IT', 'Sales'] }
              ].map((section) => (
                <div key={section.id} className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 capitalize tracking-[0.15em] ml-0.5">{section.label}</label>
                  <div className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white ${openAccordion === section.id ? 'ring-1 ring-blue-600 border-blue-600 shadow-md' : 'border-slate-100 ring-1 ring-slate-200/50'}`}>
                    <div onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)} className={`px-3 py-2 flex justify-between items-center cursor-pointer transition-colors ${openAccordion === section.id ? 'bg-blue-50/30' : 'bg-slate-50/50 hover:bg-slate-50'}`}>
                      <span className={`text-[10px] font-bold ${openAccordion === section.id ? 'text-blue-600' : 'text-slate-500'}`}>Select Options</span>
                      <ChevronUp size={14} className={`transition-transform duration-300 ${openAccordion === section.id ? 'text-blue-600' : 'text-slate-400 rotate-180'}`} />
                    </div>

                    {openAccordion === section.id && (
                      <div className="p-1 space-y-0.5 animate-in slide-in-from-top-1">
                        <label className="flex items-center gap-x-5 px-3 py-2 bg-blue-50/40 rounded-lg cursor-pointer border border-blue-100/50 mb-1 group">
                          <input 
                            type="checkbox" 
                            onChange={(e) => {
                              const checkboxes = document.querySelectorAll(`.${section.id}-checkbox-item`);
                              checkboxes.forEach(cb => cb.checked = e.target.checked);
                            }}
                            className="w-4 h-4 mr-2 rounded border-blue-300 text-blue-600 focus:ring-0 cursor-pointer" 
                          />
                          <span className="text-[10px] font-black text-blue-700 capitalize tracking-widest">Select All</span>
                        </label>

                        {section.options.map((opt) => (
                          <label key={opt} className="flex items-center gap-x-5 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all">
                            <input 
                              type="checkbox" 
                              className={`${section.id}-checkbox-item w-4 h-4 mr-2 rounded border-slate-300 text-blue-600 focus:ring-0 transition-all cursor-pointer`} 
                            />
                            <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 tracking-wide">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2 !bg-white border border-blue-600 rounded-lg text-[10px] font-black capitalize tracking-widest !text-blue-600 hover:shadow-md transition-all active:scale-95">
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HolidayPage;
//*************************************working code phase 1 ********************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, Plus, MoreVertical, Calendar, ChevronRight,ChevronUp, X, Search, Filter 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const HolidayPage = () => {
//   const navigate = useNavigate();
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);

//   const holidayTemplates = [
//     { id: 1, title: "Holiday Calendar 2025", holidays: 3, staffCount: 15, status: "Active" },
//     { id: 2, title: "Holiday Calendar 2026", holidays: 11, staffCount: 22, status: "Active" },
//   ];

//   const handleStaffClick = (template) => {
//     setSelectedTemplate(template);
//     setIsDrawerOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-white font-sans pb-10 relative overflow-x-hidden text-left">
//       {/* 🚀 STICKY HEADER */}
//       <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
//         <div className="flex items-center gap-3">
//           <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 rounded-xl !text-slate-400 !bg-transparent transition-all">
//             <ArrowLeft size={18} />
//           </button>
//           <span className="text-[10px] font-black text-slate-500 capitalize tracking-widest leading-none">Settings / Holiday Templates</span>
//         </div>
//       </div>

//       <div className=" mx-auto md:px-6 px-2 mt-8">
//         {/* 📑 PAGE HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//           <div className="space-y-1 px-2">
//             <h1 className="md:text-xl text-lg font-black !text-slate-900 tracking-tighter !capitalize">Holiday Templates</h1>
//             <p className="md:text-[10px] text-[8px] font-bold !text-slate-500 capitalize tracking-widest">Create templates to auto-assign paid leave on public holidays.</p>
//           </div>
//           <button 
//           onClick={()=> navigate('/createholiday')}
//           className="flex items-center justify-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 rounded-xl shadow-sm border border-blue-600 shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
//             <Plus size={16} strokeWidth={3} />
//             <span className="text-[11px] font-black capitalize tracking-widest">New Template</span>
//           </button>
//         </div>

//         {/* 📂 LIST OF TEMPLATES */}
//         {/* <div className="space-y-3">
//           {holidayTemplates.map((item) => (
//             <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-5">
//                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
//                       <Calendar size={24} strokeWidth={1.5} />
//                    </div>
//                    <div className="space-y-1">
//                       <div className="flex items-center gap-2">
//                         <h3 className="text-sm font-black text-slate-800 capitalize tracking-tight">{item.title}</h3>
//                         <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-md capitalize tracking-tighter border border-blue-100">{item.status}</span>
//                       </div>
//                       <p className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">Number of Holidays: <span className="text-slate-900">{item.holidays}</span></p>
//                    </div>
//                 </div>

//                 <div className="flex items-center gap-8">
             
//                    <div onClick={() => handleStaffClick(item)} className="cursor-pointer group/staff text-right">
//                       <p className="text-[9px] font-black text-slate-400 capitalize tracking-widest mb-1 group-hover/staff:text-blue-600 transition-colors">Assigned Staff</p>
//                       <div className="flex items-center gap-2 justify-end">
//                         <span className="text-[11px] font-bold text-slate-700">{item.staffCount}</span>
//                         <ChevronRight size={14} className="text-slate-300 group-hover/staff:text-blue-600 transition-all" />
//                       </div>
//                    </div>
//                    <button className="p-2 !text-slate-300 !bg-transparent hover:!text-slate-900 transition-colors">
//                      <MoreVertical size={20} />
//                    </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div> */}


//         <div className="space-y-3">
//   {holidayTemplates.map((item) => (
//     <div 
//       key={item.id} 
//       className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
//     >
//       {/* 📱 RESPONSIVE WRAPPER: Stacks on mobile (flex-col), row on desktop (sm:flex-row) */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        
//         {/* LEFT SIDE: Icon & Details */}
//         <div className="flex items-center gap-4 sm:gap-5">
//           <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
//             <Calendar size={24} strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6" />
//           </div>
//           <div className="space-y-1">
//             <div className="flex flex-wrap items-center gap-2">
//               <h3 className="text-sm font-black !text-slate-800 !capitalize tracking-tight">
//                 {item.title}
//               </h3>
//               <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-md capitalize tracking-tighter border border-blue-100 whitespace-nowrap">
//                 {item.status}
//               </span>
//             </div>
//             <p className="text-[10px] font-bold !text-slate-500 capitalize tracking-widest">
//               Number of Holidays: <span className="text-slate-900">{item.holidays}</span>
//             </p>
//           </div>
//         </div>

//         {/* RIGHT SIDE: Assigned Staff & Menu */}
//         {/* 📱 MOBILE FIX: Full width, spaced out, with a top border to separate from header */}
//         <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-8 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
          
//           {/* TRIGGER: Open Staff List */}
//           <div 
//             onClick={() => handleStaffClick(item)} 
//             className="cursor-pointer group/staff text-left sm:text-right flex-1 sm:flex-initial"
//           >
//             <p className="text-[9px] font-black text-slate-400 capitalize tracking-widest mb-1 group-hover/staff:text-blue-600 transition-colors">
//               Assigned Staff
//             </p>
//             {/* 📱 MOBILE FIX: Left aligned on mobile, right aligned on desktop */}
//             <div className="flex items-center gap-2 justify-start sm:justify-end">
//               <span className="text-[11px] font-bold text-slate-700">{item.staffCount}</span>
//               <ChevronRight size={14} className="text-slate-300 group-hover/staff:text-blue-600 transition-all" />
//             </div>
//           </div>
          
//           <button className="p-2 !text-slate-300 !bg-transparent hover:!text-slate-900 transition-colors shrink-0">
//             <MoreVertical size={20} />
//           </button>
//         </div>

//       </div>
//     </div>
//   ))}
// </div>
//       </div>

//       {/* 🛡️ STAFF LIST DRAWER (Integrated Logic) */}
//       <StaffListDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
//       {isDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40" onClick={() => setIsDrawerOpen(false)} />}
//     </div>
//   );
// };

// // ---------------------------------------------------------
// // 🚪 REUSABLE STAFF DRAWER COMPONENT
// // ---------------------------------------------------------
// const StaffListDrawer = ({ isOpen, onClose }) => {
//   const [subTab, setSubTab] = useState('unselected');
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [openAccordion, setOpenAccordion] = useState(null);

//   const unselectedStaff = [
//     { id: '#MUMGE84', name: "indresh bhai", location: "Goelectronix Technologies Private Limited" },
//     { id: '#MUMGE82', name: "Nilesh Khanderao Kuwar", location: "Goelectronix Technologies Private Limited" }
//   ];

//   return (
//     <>
//       <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-80 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="flex flex-col h-full relative">
//           <div className="p-6 border-b border-slate-100 flex justify-between items-start">
//             <h2 className="text-xl font-black text-slate-900 capitalize tracking-tighter">Staff List</h2>
//             <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
//           </div>

//           <div className="px-6 py-4">
//             <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
//               {['selected', 'unselected'].map((tab) => (
//                 <button key={tab} onClick={() => setSubTab(tab)} className={`relative px-6 py-2 rounded-lg text-[10px] font-black capitalize !bg-transparent tracking-widest transition-all duration-300 ${subTab === tab ? '!bg-white shadow-md !text-blue-600 ring-1 ring-slate-200/50' : '!text-slate-400 hover:text-slate-600'}`}>
//                   {tab} Staff
//                   {subTab === tab && <span className="absolute -top-1 -right-1 w-2 h-2 !bg-white rounded-full border-2 !border-white animate-pulse" />}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="px-6 mb-4 flex gap-2">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//               <input type="text" placeholder="Search by name..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-400" />
//             </div>
//             <button onClick={() => setIsFilterOpen(true)} className="flex items-center !bg-transparent gap-2 px-4 py-2 border !border-blue-600 rounded-xl !text-blue-600 text-[10px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-colors">
//               <Filter size={14} /> Filter
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto px-6">
//             <table className="w-full text-left">
//               <tbody className="divide-y divide-slate-50">
//                 {unselectedStaff.map((staff, idx) => (
//                   <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
//                     <td className="py-3 px-1"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" /></td>
//                     <td className="py-3 text-[11px] font-bold text-slate-700">{staff.name}</td>
//                     <td className="py-3 text-[10px] font-black text-blue-600 capitalize">{staff.id}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="p-6 border-t border-slate-100 bg-slate-50/50">
//             <button className={`w-full py-3 rounded-xl text-[11px] font-black capitalize tracking-widest transition-all shadow-sm ${subTab === 'selected' ? '!bg-blue-50 !text-blue-600 border !border-blue-600 hover:!bg-white' : '!bg-white !text-blue-600 border !border-blue-600 hover:!bg-blue-50'}`}>
//               {subTab === 'selected' ? 'Remove Staff' : 'Move to Selected'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 🔍 ACCORDION FILTER MODAL (Global Centered) */}
//      {isFilterOpen && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-2">
//     <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsFilterOpen(false)} />
    
//     <div className="relative bg-white w-full max-w-[360px] rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-300">
//       {/* Header */}
//       <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-white">
//         <div>
//           <h3 className="text-[13px] font-black text-slate-900 capitalize tracking-tighter">Filter By</h3>
//           <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-0.5" />
//         </div>
//         <button onClick={() => setIsFilterOpen(false)} className="p-1.5 !bg-slate-50 hover:!bg-slate-50 hover:!text-blue-600 rounded-lg !text-slate-400 transition-all"><X size={16} /></button>
//       </div>

//       <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-left">
//         {[
//           { id: 'salary', label: 'Salary Type', options: ['Monthly', 'Daily', 'Work Basis', 'Hourly'] },
//           { id: 'dept', label: 'Department', options: ['Finance', 'Hr & Admin', 'IT', 'Sales'] }
//         ].map((section) => (
//           <div key={section.id} className="space-y-1">
//             <label className="text-[9px] font-black text-slate-400 capitalize tracking-[0.15em] ml-0.5">{section.label}</label>
//             <div className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white ${openAccordion === section.id ? 'ring-1 ring-blue-600 border-blue-600 shadow-md' : 'border-slate-100 ring-1 ring-slate-200/50'}`}>
//               <div onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)} className={`px-3 py-2 flex justify-between items-center cursor-pointer transition-colors ${openAccordion === section.id ? 'bg-blue-50/30' : 'bg-slate-50/50 hover:bg-slate-50'}`}>
//                 <span className={`text-[10px] font-bold ${openAccordion === section.id ? 'text-blue-600' : 'text-slate-500'}`}>Select Options</span>
//                 <ChevronUp size={14} className={`transition-transform duration-300 ${openAccordion === section.id ? 'text-blue-600' : 'text-slate-400 rotate-180'}`} />
//               </div>

//               {openAccordion === section.id && (
//                 <div className="p-1 space-y-0.5 animate-in slide-in-from-top-1">
//                   {/* ✅ FIXED SELECT ALL LOGIC */}
//                   <label className="flex items-center gap-x-5 px-3 py-2 bg-blue-50/40 rounded-lg cursor-pointer border border-blue-100/50 mb-1 group">
//                     <input 
//                       type="checkbox" 
//                       onChange={(e) => {
//                         // Targets only checkboxes belonging to THIS specific section
//                         const checkboxes = document.querySelectorAll(`.${section.id}-checkbox-item`);
//                         checkboxes.forEach(cb => cb.checked = e.target.checked);
//                       }}
//                       className="w-4 h-4 mr-2 rounded border-blue-300 text-blue-600 focus:ring-0 cursor-pointer" 
//                     />
//                     <span className="text-[10px] font-black text-blue-700 capitalize tracking-widest">Select All</span>
//                   </label>

//                   {/* Individual Options */}
//                   {section.options.map((opt) => (
//                     <label key={opt} className="flex items-center gap-x-5 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all">
//                       <input 
//                         type="checkbox" 
//                         className={`${section.id}-checkbox-item w-4 h-4 mr-2 rounded border-slate-300 text-blue-600 focus:ring-0 transition-all cursor-pointer`} 
//                       />
//                       <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 tracking-wide">{opt}</span>
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
//         <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2 !bg-white border border-blue-600 rounded-lg text-[10px] font-black capitalize tracking-widest !text-blue-600 hover:shadow-md transition-all active:scale-95">
//           Apply Filter
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </>
//   );
// };

// export default HolidayPage;