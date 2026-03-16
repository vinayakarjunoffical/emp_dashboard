import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, MoreVertical, Calendar, ChevronRight,ChevronUp, X, Search, Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HolidayPage = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const holidayTemplates = [
    { id: 1, title: "Holiday Calendar 2025", holidays: 3, staffCount: 15, status: "Active" },
    { id: 2, title: "Holiday Calendar 2026", holidays: 11, staffCount: 22, status: "Active" },
  ];

  const handleStaffClick = (template) => {
    setSelectedTemplate(template);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10 relative overflow-x-hidden text-left">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 rounded-xl !text-slate-400 !bg-transparent transition-all">
            <ArrowLeft size={18} />
          </button>
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Settings / Holiday Templates</span>
        </div>
      </div>

      <div className=" mx-auto px-6 mt-8">
        {/* 📑 PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Holiday Templates</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create templates to auto-assign paid leave on public holidays.</p>
          </div>
          <button 
          onClick={()=> navigate('/createholiday')}
          className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl shadow-sm border border-blue-500 shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={16} strokeWidth={3} />
            <span className="text-[11px] font-black uppercase tracking-widest">New Template</span>
          </button>
        </div>

        {/* 📂 LIST OF TEMPLATES */}
        <div className="space-y-3">
          {holidayTemplates.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Calendar size={24} strokeWidth={1.5} />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.title}</h3>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-md uppercase tracking-tighter border border-blue-100">{item.status}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Number of Holidays: <span className="text-slate-900">{item.holidays}</span></p>
                   </div>
                </div>

                <div className="flex items-center gap-8">
                   {/* TRIGGER: Open Staff List */}
                   <div onClick={() => handleStaffClick(item)} className="cursor-pointer group/staff text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/staff:text-blue-500 transition-colors">Assigned Staff</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[11px] font-bold text-slate-700">{item.staffCount}</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover/staff:text-blue-500 transition-all" />
                      </div>
                   </div>
                   <button className="p-2 !text-slate-300 !bg-transparent hover:!text-slate-900 transition-colors">
                     <MoreVertical size={20} />
                   </button>
                </div>
              </div>
            </div>
          ))}
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
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Staff List</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
          </div>

          <div className="px-6 py-4">
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
              {['selected', 'unselected'].map((tab) => (
                <button key={tab} onClick={() => setSubTab(tab)} className={`relative px-6 py-2 rounded-lg text-[10px] font-black uppercase !bg-transparent tracking-widest transition-all duration-300 ${subTab === tab ? '!bg-white shadow-md !text-blue-600 ring-1 ring-slate-200/50' : '!text-slate-400 hover:text-slate-600'}`}>
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
            <button onClick={() => setIsFilterOpen(true)} className="flex items-center !bg-transparent gap-2 px-4 py-2 border !border-blue-500 rounded-xl !text-blue-600 text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-colors">
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
                    <td className="py-3 text-[10px] font-black text-blue-600 uppercase">{staff.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <button className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ${subTab === 'selected' ? '!bg-blue-50 !text-blue-600 border !border-blue-500 hover:!bg-white' : '!bg-white !text-blue-500 border !border-blue-500 hover:!bg-blue-50'}`}>
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
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tighter">Filter By</h3>
          <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-0.5" />
        </div>
        <button onClick={() => setIsFilterOpen(false)} className="p-1.5 !bg-slate-50 hover:!bg-slate-50 hover:!text-blue-500 rounded-lg !text-slate-400 transition-all"><X size={16} /></button>
      </div>

      <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-left">
        {[
          { id: 'salary', label: 'Salary Type', options: ['Monthly', 'Daily', 'Work Basis', 'Hourly'] },
          { id: 'dept', label: 'Department', options: ['Finance', 'Hr & Admin', 'IT', 'Sales'] }
        ].map((section) => (
          <div key={section.id} className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">{section.label}</label>
            <div className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white ${openAccordion === section.id ? 'ring-1 ring-blue-500 border-blue-500 shadow-md' : 'border-slate-100 ring-1 ring-slate-200/50'}`}>
              <div onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)} className={`px-3 py-2 flex justify-between items-center cursor-pointer transition-colors ${openAccordion === section.id ? 'bg-blue-50/30' : 'bg-slate-50/50 hover:bg-slate-50'}`}>
                <span className={`text-[10px] font-bold ${openAccordion === section.id ? 'text-blue-600' : 'text-slate-500'}`}>Select Options</span>
                <ChevronUp size={14} className={`transition-transform duration-300 ${openAccordion === section.id ? 'text-blue-500' : 'text-slate-400 rotate-180'}`} />
              </div>

              {openAccordion === section.id && (
                <div className="p-1 space-y-0.5 animate-in slide-in-from-top-1">
                  {/* ✅ FIXED SELECT ALL LOGIC */}
                  <label className="flex items-center gap-x-5 px-3 py-2 bg-blue-50/40 rounded-lg cursor-pointer border border-blue-100/50 mb-1 group">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        // Targets only checkboxes belonging to THIS specific section
                        const checkboxes = document.querySelectorAll(`.${section.id}-checkbox-item`);
                        checkboxes.forEach(cb => cb.checked = e.target.checked);
                      }}
                      className="w-4 h-4 mr-2 rounded border-blue-300 text-blue-600 focus:ring-0 cursor-pointer" 
                    />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Select All</span>
                  </label>

                  {/* Individual Options */}
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
        <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2 !bg-white border border-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest !text-blue-500 hover:shadow-md transition-all active:scale-95">
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