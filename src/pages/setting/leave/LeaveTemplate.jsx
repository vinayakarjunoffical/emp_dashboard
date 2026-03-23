import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, MoreVertical, FileText, ChevronRight, X, Search, Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeaveTemplate = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Data based on image_f2a5bb.jpg
  const leavePolicies = [
    { 
      id: 1, 
      title: "Goex Leave Policy 2024 2025", 
      totalLeaves: 21, 
      staffCount: 1, 
      status: "To be Renewed",
      statusColor: "bg-purple-50 text-purple-600 border-purple-100" 
    },
    { 
      id: 2, 
      title: "Leave Policy 2026", 
      totalLeaves: 24, 
      staffCount: 11, 
      status: "Active",
      statusColor: "bg-blue-50 text-blue-600 border-blue-100" 
    },
    { 
      id: 3, 
      title: "Probation Leave Policy", 
      totalLeaves: 3, 
      staffCount: 8, 
      status: "To be Renewed",
      statusColor: "bg-purple-50 text-purple-600 border-purple-100" 
    },
  ];

  const handleStaffClick = (policy) => {
    setSelectedPolicy(policy);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-10 relative overflow-x-hidden text-left">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-400 transition-all">
            <ArrowLeft size={18} />
          </button>
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Settings / Leave Templates</span>
        </div>
      </div>

      <div className=" mx-auto px-2 md:px-6 mt-4">
        {/* 📑 PAGE HEADER */}
        <div className="flex flex-col px-2 md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="space-y-1">
            <h1 className="md:text-xl text-lg font-black text-slate-900 tracking-tighter uppercase">Leave Templates</h1>
            <p className="md:text-[10px] text-[8px] font-bold text-slate-400 uppercase tracking-widest">Add and save templates of Leave policies.</p>
          </div>
          <button 
          onClick={() => navigate('/createleave')}
          className="flex items-center justify-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 border border-blue-500 rounded-lg shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95">
            <Plus size={16} strokeWidth={3} />
            <span className="text-[11px] font-black uppercase tracking-widest">New Template</span>
          </button>
        </div>

        {/* 📂 LIST OF CARDS */}
        {/* <div className="space-y-3">
          {leavePolicies.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between">
              
                <div className="flex items-center gap-5">
                   <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={24} strokeWidth={1.5} />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.title}</h3>
                        <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-tighter border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Leaves: <span className="text-slate-900 font-black">{item.totalLeaves}</span>
                      </p>
                   </div>
                </div>

                
                <div className="flex items-center gap-8">
                   <div onClick={() => handleStaffClick(item)} className="cursor-pointer group/staff text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/staff:text-blue-500 transition-colors text-right">Assigned Staff</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[11px] font-bold text-slate-700">{item.staffCount}</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover/staff:text-blue-500 transition-all" />
                      </div>
                   </div>
                   <button className="p-2 !bg-transparent !text-slate-300 hover:text-slate-900 transition-colors">
                     <MoreVertical size={20} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        <div className="space-y-3">
  {leavePolicies.map((item) => (
    <div 
      key={item.id} 
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
    >
      {/* 📱 RESPONSIVE WRAPPER: Stacks on mobile (flex-col), row on desktop (sm:flex-row) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        
        {/* Left Section: Info */}
        <div className="flex items-center gap-4 sm:gap-5">
           <div className="p-2.5 sm:p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
              <FileText size={24} strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6" />
           </div>
           <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.title}</h3>
                <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-tighter border whitespace-nowrap ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Total Leaves: <span className="text-slate-900 font-black">{item.totalLeaves}</span>
              </p>
           </div>
        </div>

        {/* Right Section: Staff & Menu */}
        {/* 📱 MOBILE FIX: Full width, spaced out, with a top border to separate from header */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-8 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
           
           <div onClick={() => handleStaffClick(item)} className="cursor-pointer group/staff text-left sm:text-right flex-1 sm:flex-initial">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/staff:text-blue-500 transition-colors sm:text-right">
                Assigned Staff
              </p>
              {/* 📱 MOBILE FIX: Left aligned on mobile, right aligned on desktop */}
              <div className="flex items-center gap-2 justify-start sm:justify-end">
                <span className="text-[11px] font-bold text-slate-700">{item.staffCount}</span>
                <ChevronRight size={14} className="text-slate-300 group-hover/staff:text-blue-500 transition-all" />
              </div>
           </div>
           
           <button className="p-2 !bg-transparent !text-slate-300 hover:!text-slate-900 transition-colors shrink-0">
             <MoreVertical size={20} />
           </button>
        </div>

      </div>
    </div>
  ))}
</div>
      </div>

      {/* 🛡️ STAFF LIST DRAWER */}
      <StaffListDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} policyTitle={selectedPolicy?.title} />
      {isDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40" onClick={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

// ---------------------------------------------------------
// 🚪 REUSABLE STAFF DRAWER COMPONENT
// ---------------------------------------------------------
const StaffListDrawer = ({ isOpen, onClose, policyTitle }) => {
  const [subTab, setSubTab] = useState('unselected');
  const unselectedStaff = [
    { id: '#MUMGE84', name: "Indresh Bhai", location: "Goelectronix Technologies" },
    { id: '#MUMGE82', name: "Nilesh Khanderao Kuwar", location: "Goelectronix Technologies" }
  ];

  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-80 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Assign Staff</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Policy: {policyTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
        </div>

        <div className="px-6 py-4">
          <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
            {['selected', 'unselected'].map((tab) => (
              <button key={tab} onClick={() => setSubTab(tab)} className={`relative !bg-transparent px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${subTab === tab ? '!bg-white shadow-md !text-blue-600' : '!text-slate-400 hover:!text-slate-600'}`}>
                {tab} Staff
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input type="text" placeholder="Search by name or ID..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-50">
              {unselectedStaff.map((staff, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50">
                  <td className="py-3 px-1"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" /></td>
                  <td className="py-3">
                    <p className="text-[11px] font-bold text-slate-700">{staff.name}</p>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{staff.location}</p>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-lg">{staff.id}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button className="w-full py-3 !bg-white !text-blue-500 rounded-xl border border-blue-500 text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
            {subTab === 'selected' ? 'Remove from Policy' : 'Assign to Policy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveTemplate;