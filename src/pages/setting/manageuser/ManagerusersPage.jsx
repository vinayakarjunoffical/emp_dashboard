import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  MoreVertical, 
  UserPlus, 
  ShieldCheck,
  Mail,
  Phone,
  X,
  PackageSearch,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManagerusersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Business Admins');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data based on images
  const users = [
    { 
      name: "Goelectronix Technologies Private Limited", 
      roleBadge: "Business Owner", 
      phone: "9892580308", 
      businesses: "All", 
      addedOn: "-",
      isOwner: true 
    },
    { 
      name: "CHAITALI GAIKWAD", 
      phone: "8108508499", 
      businesses: "All", 
      addedOn: "25 Jun 2025" 
    },
    { 
      name: "Vijay Pakhare", 
      phone: "9004616246", 
      businesses: "Goelectronix Technologies Private Limited", 
      addedOn: "11 Oct 2025" 
    },
  ];

  const tabs = [
    'Business Admins', 
    'Restricted Admins', 
    'Reporting Managers', 
    'Attendance Supervisors'
  ];

  const getTabCount = (tab) => {
    if (tab === 'Business Admins') return users.length;
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20 mt-4 text-left relative overflow-x-hidden">
      {/* 🚀 HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-400 transition-transform" />
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest leading-none">Back to Settings</span>
        </button>
      </div>

      <div className="mx-auto px-6 mt-4">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8 relative overflow-hidden">
          
          <div className="space-y-1 relative z-10">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Manage Users</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-2xl">
              Configure user types across your organisation. These users can be assigned to different roles based on their responsibilities.
            </p>
          </div>

          {/* 📑 ROLE TABS */}
          <div className="border-b border-slate-100">
            <div className="flex items-center gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative !bg-transparent border-0 outline-none cursor-pointer ${
                    activeTab === tab ? '!text-blue-600' : '!text-slate-400 hover:!text-slate-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in duration-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 🔍 TABLE SECTION */}
          <div className="space-y-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                   {activeTab} ({getTabCount(activeTab)})
                 </h2>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {activeTab === 'Attendance Supervisors' 
                      ? 'Manage users who can supervise and approve attendance records' 
                      : activeTab === 'Reporting Managers'
                      ? 'Manage users who can take actions on their reportees'
                      : activeTab === 'Restricted Admins'
                      ? 'Manage users who will have restricted adminsitrative privileges'
                      : 'Manage users with administrative privileges'}
                 </p>
               </div>
               
               <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search by name or phon" 
                      className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:border-blue-400 w-64 placeholder:text-slate-300 uppercase tracking-wider"
                    />
                  </div>
                  
                  {/* <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl shadow-sm border border-blue-500 shadow-blue-200 hover:bg-blue-50 transition-all active:scale-95 outline-none cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={3} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Add {activeTab === 'Attendance Supervisors' ? 'Attendance Supervisor' : activeTab === 'Restricted Admins' ? 'Restricted Admin' : activeTab}</span>
                  </button> */}
                  {activeTab !== 'Reporting Managers' && (
  <button 
    onClick={() => setIsSidebarOpen(true)}
    className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl shadow-sm border border-blue-500 shadow-blue-200 hover:bg-blue-50 transition-all active:scale-95 outline-none cursor-pointer"
  >
    <Plus size={16} strokeWidth={3} />
    <span className="text-[11px] font-black uppercase tracking-widest">
      Add {activeTab === 'Attendance Supervisors' ? 'Attendance Supervisor' : activeTab === 'Restricted Admins' ? 'Restricted Admin' : activeTab}
    </span>
  </button>
)}
               </div>
            </div>

            {/* TABLE GRID */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm text-left">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Name</th>
                    {activeTab === 'Business Admins' ? (
                      <>
                        <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Phone Number</th>
                        <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Assigned Businesses</th>
                        <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Added On</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Staff ID</th>
                        <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Phone Number</th>
                        <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Business Division</th>
                        {activeTab === 'Reporting Managers' && <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Reportees</th>}
                      </>
                    )}
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeTab === 'Business Admins' ? (
                    users.map((user, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{user.name}</span>
                            {user.roleBadge && (
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[8px] font-black rounded border border-purple-100 uppercase tracking-tighter">
                                {user.roleBadge}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left"><span className="text-[11px] font-bold text-slate-500">{user.phone}</span></td>
                        <td className="px-4 py-4 text-left"><span className="text-[11px] font-bold text-slate-500">{user.businesses}</span></td>
                        <td className="px-4 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{user.addedOn}</td>
                        <td className="px-8 py-4 text-right">
                          {!user.isOwner ? (
                            <button className="p-2 !text-slate-300 hover:!text-slate-900 transition-colors !bg-transparent border-0 cursor-pointer"><MoreVertical size={18} /></button>
                          ) : <div className="h-9" />}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-20">
                         <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-700">
                            <div className="relative">
                              <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center border-4 border-white shadow-sm">
                                <PackageSearch size={48} className="text-blue-600" strokeWidth={1.5} />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-md"><span className="text-blue-600 font-black text-xs">?</span></div>
                            </div>
                            <div className="text-center space-y-1">
                               <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">No Data</p>
                               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Add your first {activeTab === 'Attendance Supervisors' ? 'supervisor' : activeTab === 'Restricted Admins' ? 'restricted admin' : 'manager'} to get started</p>
                            </div>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
            <ShieldCheck size={240} />
          </div>
        </div>
      </div>

      {/* --- SIDEBAR FORM (DYNAMIC) --- */}
      {activeTab === 'Attendance Supervisors' ? (
        <AddSupervisorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      ) : activeTab === 'Restricted Admins' ? (
        <AddRestrictedAdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      ) : (
        <AddAdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)}/>
      )}
    </div>
  );
};

// 🛡️ SIDEBAR: ATTENDANCE SUPERVISOR
// const AddSupervisorSidebar = ({ isOpen, onClose }) => {
//   return (
//     <div className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-[110] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//       <div className="flex flex-col h-full text-left">
//         <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
//           <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Add Attendance Supervisor</h2>
//           <button onClick={onClose} className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 rounded-xl transition-all !bg-transparent border-0 outline-none cursor-pointer"><X size={20} /></button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-6">
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Staff <span className="text-red-500">*</span></label>
//             <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/20">
//               <div className="flex items-center justify-between px-5 py-3 cursor-pointer group hover:bg-slate-50/50">
//                  <span className="text-[11px] font-bold text-slate-300 uppercase">Select Staff</span>
//                  <ChevronDown size={16} className="text-slate-300 group-hover:text-blue-600 transition-all" />
//               </div>
              
//               <div className="p-2 border-t border-slate-50 space-y-1">
//                 <div className="relative mb-2">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                   <input type="text" placeholder="Search staff..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none" />
//                 </div>
                
//                 <div className="max-h-[300px] overflow-y-auto space-y-0.5 custom-scrollbar">
//                   {["Akshada Patne", "Amisha Mundhe", "Ashwini Shinde", "BRIJESH KUMAR SHUKLA", "Chaitali gaikwad", "Chetan Naik"].map((staff) => (
//                     <div key={staff} className="px-4 py-3 hover:bg-blue-50 rounded-xl cursor-pointer group transition-all border border-transparent hover:border-blue-100">
//                       <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600">{staff}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-8 border-t border-slate-50 bg-slate-50/30 sticky bottom-0">
//           <button className="w-full py-4 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-white transition-all active:scale-[0.98] outline-none cursor-pointer border border-blue-500">
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// 🛡️ SIDEBAR: ATTENDANCE SUPERVISOR
const AddSupervisorSidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-[110] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full text-left">
        
        {/* 🚀 Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Add Attendance Supervisor</h2>
          <button 
            onClick={onClose} 
            className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 rounded-xl transition-all !bg-transparent border-0 outline-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* 📑 Form Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Staff Selection */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Staff 
            </label>
            <div className="relative group">
              <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold text-slate-300 uppercase flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all">
                <span>Select Staff</span>
                <ChevronDown size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Max Approval Days */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Max Approval Days 
            </label>
            <input 
              type="number" 
              defaultValue="2"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all" 
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">+91</span>
              <input 
                type="text" 
                placeholder="Enter phone number"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-14 pr-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" 
              />
            </div>
            <p className="text-[9px] font-medium text-slate-400 mt-2 px-1">
              Note: Attendance Supervisor will be able to login using this number.
            </p>
          </div>

          {/* ℹ️ Detailed Info Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
             <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-tight">
               Attendance supervisor can mark attendance for assigned staff
             </h4>
             <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
               Your attendance supervisor can mark attendance of your staff daily. You'll be able to track these on attendance logs.
             </p>
             <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
               If staff of this attendance supervisor have access to Geo, the attendance supervisor will be able to add Geo on their desktop. They can see the activities of the staff assigned to them - but will not be able to alter any settings.
             </p>
          </div>
        </div>

        {/* 🛡️ Footer Actions */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30 sticky bottom-0">
          <button 
            className="w-full py-4 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm border border-blue-500 shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] outline-none cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// 🛡️ SIDEBAR: BUSINESS ADMIN
const AddAdminSidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-[110] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full text-left">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Add Business Admins</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Business Admin details</p>
          </div>
          <button onClick={onClose} className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 rounded-xl transition-all !bg-transparent border-0 outline-none cursor-pointer"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <div className="space-y-2 mb-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Name</label>
            <input type="text" placeholder="Enter Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" />
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Phone Number</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">+91</span>
              <input type="text" placeholder="Enter phone number" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-14 pr-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" />
            </div>
            <p className="text-[9px] font-medium text-slate-400 mt-2 px-1">Note: Admin will access the business profile using this number.</p>
          </div>
          <div className="space-y-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Assign Business</label>
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/20">
              <div className="relative border-b border-slate-50">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input type="text" placeholder="Search businesses" className="w-full pl-11 pr-4 py-3 text-[10px] font-bold text-slate-600 outline-none placeholder:text-slate-300" />
              </div>
              <div className="max-h-[200px] overflow-y-auto p-2 space-y-1 bg-slate-50/30">
                {["Goelectronix Technologies Private Limited", "Yan Autonations Private Limited"].map((biz) => (
                  <label key={biz} className="flex items-center gap-3 p-3 hover:bg-white rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100 hover:shadow-sm">
                    <input type="checkbox" className="w-4 h-4 rounded mr-2 border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-[10px] !tracking-normal font-bold text-slate-600 group-hover:text-slate-900">{biz}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/30 sticky bottom-0">
          <button className="w-full py-4 !bg-white !text-blue-500 border border-blue-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] outline-none cursor-pointer border-0">Save</button>
        </div>
      </div>
    </div>
  );
};

// 🛡️ SIDEBAR: RESTRICTED ADMIN
const AddRestrictedAdminSidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-[110] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full text-left">
        {/* 🚀 Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Add Restricted Admin</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Restricted Admin details</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 rounded-xl transition-all !bg-transparent border-0 outline-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* 📑 Form Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Name Field */}
          <div className="space-y-2 mb-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Name 
            </label>
            <input 
              type="text" 
              placeholder="Enter Name"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" 
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2 mb-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Phone Number 
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">+91</span>
              <input 
                type="text" 
                placeholder="Enter phone number"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-14 pr-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" 
              />
            </div>
            <p className="text-[9px] font-medium text-slate-400 mt-2 px-1 lowercase">
              Restricted admin will be able to access PagarBook using this number.
            </p>
          </div>

          {/* Reporting Manager Field (Dropdown style from image) */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Reporting Manager
            </label>
            <div className="relative group">
              <select 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold text-slate-400 appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Select user</option>
                <option value="manager1">Indresh Malviya</option>
                <option value="manager2">Sujit Nankare</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-slate-500 transition-colors">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* 🛡️ Footer Actions */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30 sticky bottom-0">
          <button 
            className="w-full py-3 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-white border border-blue-500 transition-all active:scale-[0.98] outline-none cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerusersPage;
//******************************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Search, 
//   Plus, 
//   MoreVertical, 
//   UserPlus, 
//   ShieldCheck,
//   Mail,
//   Phone,
//   X,
//   PackageSearch,
//   ChevronDown
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const ManagerusersPage = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Business Admins');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Data based on images
//   const users = [
//     { 
//       name: "Goelectronix Technologies Private Limited", 
//       roleBadge: "Business Owner", 
//       phone: "9892580308", 
//       businesses: "All", 
//       addedOn: "-",
//       isOwner: true 
//     },
//     { 
//       name: "CHAITALI GAIKWAD", 
//       phone: "8108508499", 
//       businesses: "All", 
//       addedOn: "25 Jun 2025" 
//     },
//     { 
//       name: "Vijay Pakhare", 
//       phone: "9004616246", 
//       businesses: "Goelectronix Technologies Private Limited", 
//       addedOn: "11 Oct 2025" 
//     },
//   ];

//   const tabs = [
//     'Business Admins', 
//     'Restricted Admins', 
//     'Reporting Managers', 
//     'Attendance Supervisors'
//   ];

//   const getTabCount = (tab) => {
//     if (tab === 'Business Admins') return users.length;
//     return 0;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20 text-left relative overflow-x-hidden">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
//         <button 
//           onClick={() => navigate(-1)} 
//           className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-400 transition-transform" />
//           <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest leading-none">Back to Settings</span>
//         </button>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 mt-8">
//         <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-8 relative overflow-hidden">
          
//           <div className="space-y-1 relative z-10">
//             <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Manage Users</h1>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-2xl">
//               Configure user types across your organisation. These users can be assigned to different roles based on their responsibilities.
//             </p>
//           </div>

//           {/* 📑 ROLE TABS */}
//           <div className="border-b border-slate-100">
//             <div className="flex items-center gap-8">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative !bg-transparent border-0 outline-none cursor-pointer ${
//                     activeTab === tab ? '!text-blue-600' : '!text-slate-400 hover:!text-slate-600'
//                   }`}
//                 >
//                   {tab}
//                   {activeTab === tab && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in duration-300" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* 🔍 TABLE SECTION */}
//           <div className="space-y-6 relative z-10">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                <div>
//                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                    {activeTab} ({getTabCount(activeTab)})
//                  </h2>
//                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
//                     {activeTab === 'Attendance Supervisors' 
//                       ? 'Manage users who can supervise and approve attendance records' 
//                       : activeTab === 'Reporting Managers'
//                       ? 'Manage users who can take actions on their reportees'
//                       : 'Manage users with administrative privileges'}
//                  </p>
//                </div>
               
//                <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                     <input 
//                       type="text" 
//                       placeholder="Search by name or phon" 
//                       className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:border-blue-400 w-64 placeholder:text-slate-300 uppercase tracking-wider"
//                     />
//                   </div>
                  
//                   <button 
//                     onClick={() => setIsSidebarOpen(true)}
//                     className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl shadow-sm border border-blue-500 shadow-blue-200 hover:bg-blue-50 transition-all active:scale-95 outline-none cursor-pointer"
//                   >
//                     <Plus size={16} strokeWidth={3} />
//                     <span className="text-[11px] font-black uppercase tracking-widest">Add {activeTab === 'Attendance Supervisors' ? 'Attendance Supervisor' : activeTab}</span>
//                   </button>
//                </div>
//             </div>

//             {/* TABLE GRID */}
//             <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm text-left">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50/50 border-b border-slate-100">
//                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Name</th>
//                     {activeTab === 'Business Admins' ? (
//                       <>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Phone Number</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Assigned Businesses</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Added On</th>
//                       </>
//                     ) : (
//                       <>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Staff ID</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Phone Number</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Business Division</th>
//                         {activeTab === 'Reporting Managers' && <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Reportees</th>}
//                       </>
//                     )}
//                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {activeTab === 'Business Admins' ? (
//                     users.map((user, idx) => (
//                       <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
//                         <td className="px-8 py-4">
//                           <div className="flex items-center gap-3">
//                             <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{user.name}</span>
//                             {user.roleBadge && (
//                               <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[8px] font-black rounded border border-purple-100 uppercase tracking-tighter">
//                                 {user.roleBadge}
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 text-left"><span className="text-[11px] font-bold text-slate-500">{user.phone}</span></td>
//                         <td className="px-4 py-4 text-left"><span className="text-[11px] font-bold text-slate-500">{user.businesses}</span></td>
//                         <td className="px-4 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{user.addedOn}</td>
//                         <td className="px-8 py-4 text-right">
//                           {!user.isOwner ? (
//                             <button className="p-2 !text-slate-300 hover:!text-slate-900 transition-colors !bg-transparent border-0 cursor-pointer"><MoreVertical size={18} /></button>
//                           ) : <div className="h-9" />}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={6} className="py-20">
//                          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-700">
//                             <div className="relative">
//                               <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center border-4 border-white shadow-sm">
//                                 <PackageSearch size={48} className="text-blue-600" strokeWidth={1.5} />
//                               </div>
//                               <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-md"><span className="text-blue-600 font-black text-xs">?</span></div>
//                             </div>
//                             <div className="text-center space-y-1">
//                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">No Data</p>
//                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Add your first {activeTab === 'Attendance Supervisors' ? 'supervisor' : 'manager'} to get started</p>
//                             </div>
//                          </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
//             <ShieldCheck size={240} />
//           </div>
//         </div>
//       </div>

//       {/* --- SIDEBAR FORM (DYNAMIC) --- */}
//       {activeTab === 'Attendance Supervisors' ? (
//         <AddSupervisorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//       ) : (
//         <AddAdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//       )}
      
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)}/>
//       )}
//     </div>
//   );
// };

// // 🛡️ SIDEBAR: ATTENDANCE SUPERVISOR (image_e605fa.jpg)
// const AddSupervisorSidebar = ({ isOpen, onClose }) => {
//   return (
//     <div className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-[110] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//       <div className="flex flex-col h-full text-left">
//         <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
//           <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Add Attendance Supervisor</h2>
//           <button onClick={onClose} className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 rounded-xl transition-all !bg-transparent border-0 outline-none cursor-pointer"><X size={20} /></button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-6">
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Staff <span className="text-red-500">*</span></label>
//             <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/20">
//               <div className="flex items-center justify-between px-5 py-3 cursor-pointer group hover:bg-slate-50/50">
//                  <span className="text-[11px] font-bold text-slate-300 uppercase">Select Staff</span>
//                  <ChevronDown size={16} className="text-slate-300 group-hover:text-blue-600 transition-all" />
//               </div>
              
//               <div className="p-2 border-t border-slate-50 space-y-1">
//                 <div className="relative mb-2">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                   <input type="text" placeholder="Search staff..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none" />
//                 </div>
                
//                 <div className="max-h-[300px] overflow-y-auto space-y-0.5 custom-scrollbar">
//                   {["Akshada Patne", "Amisha Mundhe", "Ashwini Shinde", "BRIJESH KUMAR SHUKLA", "Chaitali gaikwad", "Chetan Naik"].map((staff) => (
//                     <div key={staff} className="px-4 py-3 hover:bg-blue-50 rounded-xl cursor-pointer group transition-all border border-transparent hover:border-blue-100">
//                       <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600">{staff}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-8 border-t border-slate-50 bg-slate-50/30 sticky bottom-0">
//           <button className="w-full py-4 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-white transition-all active:scale-[0.98] outline-none cursor-pointer border border-blue-500">
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 🛡️ SIDEBAR: BUSINESS ADMIN
// const AddAdminSidebar = ({ isOpen, onClose }) => {
//   return (
//     <div className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-[110] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//       <div className="flex flex-col h-full text-left">
//         <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
//           <div className="space-y-1">
//             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Add Business Admins</h2>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Business Admin details</p>
//           </div>
//           <button onClick={onClose} className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 rounded-xl transition-all !bg-transparent border-0 outline-none cursor-pointer"><X size={20} /></button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-8">
//           <div className="space-y-2 mb-4">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Name</label>
//             <input type="text" placeholder="Enter Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" />
//           </div>
//           <div className="space-y-2 mb-4">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Phone Number</label>
//             <div className="relative">
//               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">+91</span>
//               <input type="text" placeholder="Enter phone number" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-14 pr-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" />
//             </div>
//             <p className="text-[9px] font-medium text-slate-400 mt-2 px-1">Note: Admin will access the business profile using this number.</p>
//           </div>
//           <div className="space-y-4">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Assign Business</label>
//             <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/20">
//               <div className="relative border-b border-slate-50">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                 <input type="text" placeholder="Search businesses" className="w-full pl-11 pr-4 py-3 text-[10px] font-bold text-slate-600 outline-none placeholder:text-slate-300" />
//               </div>
//               <div className="max-h-[200px] overflow-y-auto p-2 space-y-1 bg-slate-50/30">
//                 {["Goelectronix Technologies Private Limited", "Yan Autonations Private Limited"].map((biz) => (
//                   <label key={biz} className="flex items-center gap-3 p-3 hover:bg-white rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100 hover:shadow-sm">
//                     <input type="checkbox" className="w-4 h-4 rounded mr-2 border-slate-300 text-blue-600 focus:ring-blue-500" />
//                     <span className="text-[10px] !tracking-normal font-bold text-slate-600 group-hover:text-slate-900">{biz}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-8 border-t border-slate-50 bg-slate-50/30 sticky bottom-0">
//           <button className="w-full py-4 !bg-white !text-blue-500 border border-blue-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] outline-none cursor-pointer border-0">Save</button>
//         </div>
//       </div>
//     </div>
//   );
// };


// const AddRestrictedAdminSidebar = ({ isOpen, onClose }) => {
//   return (
//     <div className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-[110] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//       <div className="flex flex-col h-full text-left">
//         {/* 🚀 Header */}
//         <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
//           <div className="space-y-1">
//             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Add Restricted Admin</h2>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Restricted Admin details</p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 rounded-xl transition-all !bg-transparent border-0 outline-none cursor-pointer"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* 📑 Form Body */}
//         <div className="flex-1 overflow-y-auto p-8 space-y-8">
//           {/* Name Field */}
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
//               Name <span className="text-red-500">*</span>
//             </label>
//             <input 
//               type="text" 
//               placeholder="Enter Name"
//               className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" 
//             />
//           </div>

//           {/* Phone Field */}
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
//               Phone Number <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">+91</span>
//               <input 
//                 type="text" 
//                 placeholder="Enter phone number"
//                 className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-14 pr-5 py-4 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" 
//               />
//             </div>
//             <p className="text-[9px] font-medium text-slate-400 mt-2 px-1 lowercase">
//               Restricted admin will be able to access PagarBook using this number.
//             </p>
//           </div>

//           {/* Reporting Manager Field (Dropdown style from image) */}
//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
//               Reporting Manager
//             </label>
//             <div className="relative group">
//               <select 
//                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-[11px] font-bold text-slate-400 appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
//                 defaultValue=""
//               >
//                 <option value="" disabled>Select user</option>
//                 <option value="manager1">Indresh Malviya</option>
//                 <option value="manager2">Sujit Nankare</option>
//               </select>
//               <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-slate-500 transition-colors">
//                 <ChevronDown size={18} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🛡️ Footer Actions */}
//         <div className="p-8 border-t border-slate-50 bg-slate-50/30 sticky bottom-0">
//           <button 
//             className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] border-0 outline-none cursor-pointer"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagerusersPage;
//****************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Search, 
//   Plus, 
//   MoreVertical, 
//   UserPlus, 
//   ShieldCheck,
//   Mail,
//   Phone,
//   X,
//   PackageSearch // Added for empty state icon
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const ManagerusersPage = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Business Admins');
  
//   // --- 1. NEW STATE FOR SIDEBAR ---
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Data based on image_f06400.jpg
//   const users = [
//     { 
//       name: "Goelectronix Technologies Private Limited", 
//       roleBadge: "Business Owner", 
//       phone: "9892580308", 
//       businesses: "All", 
//       addedOn: "-",
//       isOwner: true 
//     },
//     { 
//       name: "CHAITALI GAIKWAD", 
//       phone: "8108508499", 
//       businesses: "All", 
//       addedOn: "25 Jun 2025" 
//     },
//     { 
//       name: "Vijay Pakhare", 
//       phone: "9004616246", 
//       businesses: "Goelectronix Technologies Private Limited", 
//       addedOn: "11 Oct 2025" 
//     },
//   ];

//   // --- NEW: Empty data for Reporting Managers ---
//   const reportingManagers = [];

//   const tabs = [
//     'Business Admins', 
//     'Restricted Admins', 
//     'Reporting Managers', 
//     'Attendance Supervisors'
//   ];

//   // Helper to determine counts
//   const getTabCount = (tab) => {
//     if (tab === 'Business Admins') return users.length;
//     return 0;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20 text-left relative overflow-x-hidden">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
//         <button 
//           onClick={() => navigate(-1)} 
//           className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-400 transition-transform" />
//           <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest leading-none">Back to Settings</span>
//         </button>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 mt-8">
//         <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-8 relative overflow-hidden">
          
//           {/* PAGE TITLE & DESCRIPTION */}
//           <div className="space-y-1 relative z-10">
//             <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Manage Users</h1>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-2xl">
//               Configure user types across your organisation. These users can be assigned to different roles based on their responsibilities.
//             </p>
//           </div>

//           {/* 📑 ROLE TABS */}
//           <div className="border-b border-slate-100">
//             <div className="flex items-center gap-8">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative !bg-transparent border-0 outline-none cursor-pointer ${
//                     activeTab === tab ? '!text-blue-600' : '!text-slate-400 hover:!text-slate-600'
//                   }`}
//                 >
//                   {tab}
//                   {activeTab === tab && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in duration-300" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* 🔍 TABLE SECTION */}
//           <div className="space-y-6 relative z-10">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                <div>
//                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                    {activeTab} ({getTabCount(activeTab)})
//                  </h2>
//                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
//                     {activeTab === 'Reporting Managers' 
//                       ? 'Manage users who can take actions on their reportees' 
//                       : 'Manage users with administrative privileges'}
//                  </p>
//                </div>
               
//                <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                     <input 
//                       type="text" 
//                       placeholder="Search by name or phon" 
//                       className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:border-blue-400 w-64 placeholder:text-slate-300 uppercase tracking-wider"
//                     />
//                   </div>
                  
//                   <button 
//                     onClick={() => setIsSidebarOpen(true)}
//                     className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl shadow-sm border border-blue-500 shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95  outline-none cursor-pointer"
//                   >
//                     <Plus size={16} strokeWidth={3} />
//                     <span className="text-[11px] font-black uppercase tracking-widest">Add {activeTab}</span>
//                   </button>
//                </div>
//             </div>

//             {/* TABLE GRID */}
//             <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm text-left">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50/50 border-b border-slate-100">
//                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Name</th>
//                     {activeTab === 'Reporting Managers' ? (
//                       <>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Staff ID</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Phone Number</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Business Division</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Reportees</th>
//                       </>
//                     ) : (
//                       <>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Phone Number</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Assigned Businesses</th>
//                         <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Added On</th>
//                       </>
//                     )}
//                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {activeTab === 'Business Admins' ? (
//                     users.map((user, idx) => (
//                       <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
//                         <td className="px-8 py-4">
//                           <div className="flex items-center gap-3">
//                             <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{user.name}</span>
//                             {user.roleBadge && (
//                               <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[8px] font-black rounded border border-purple-100 uppercase tracking-tighter">
//                                 {user.roleBadge}
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 text-left">
//                           <span className="text-[11px] font-bold text-slate-500">{user.phone}</span>
//                         </td>
//                         <td className="px-4 py-4 text-left">
//                           <span className="text-[11px] font-bold text-slate-500">{user.businesses}</span>
//                         </td>
//                         <td className="px-4 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
//                           {user.addedOn}
//                         </td>
//                         <td className="px-8 py-4 text-right">
//                           {!user.isOwner ? (
//                             <button className="p-2 !text-slate-300 hover:!text-slate-900 transition-colors !bg-transparent border-0 outline-none cursor-pointer">
//                               <MoreVertical size={18} />
//                             </button>
//                           ) : (
//                             <div className="h-9" />
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     // --- NEW: EMPTY STATE FOR REPORTING MANAGERS ---
//                     <tr>
//                       <td colSpan={6} className="py-20">
//                          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-700">
//                             <div className="relative">
//                               <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center border-4 border-white shadow-sm">
//                                 <PackageSearch size={48} className="text-blue-600" strokeWidth={1.5} />
//                               </div>
//                               <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-md">
//                                 <span className="text-blue-600 font-black text-xs">?</span>
//                               </div>
//                             </div>
//                             <div className="text-center space-y-1">
//                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">No Data</p>
//                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Add your first manager to get started</p>
//                             </div>
//                          </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
//             <ShieldCheck size={240} />
//           </div>
//         </div>
//       </div>

//       {/* --- 3. SIDEBAR FORM (NEW CODE) --- */}
//       <AddAdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
//       {/* Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] transition-opacity duration-300"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// // 🛡️ SIDEBAR COMPONENT (Preserved Image Logic/Text)
// const AddAdminSidebar = ({ isOpen, onClose }) => {
//   return (
//     <div className={`fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-[110] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//       <div className="flex flex-col h-full text-left">
//         {/* Header */}
//         <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
//           <div className="space-y-1">
//             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Add Business Admins</h2>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Business Admin details</p>
//           </div>
//           <button onClick={onClose} className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 rounded-xl transition-all !bg-transparent border-0 outline-none cursor-pointer">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form Body */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-8">
//           {/* Name Field */}
//           <div className="space-y-2 mb-4">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
//               Name
//             </label>
//             <input 
//               type="text" 
//               placeholder="Enter Name"
//               className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" 
//             />
//           </div>

//           {/* Phone Field */}
//           <div className="space-y-2 mb-4">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
//               Phone Number 
//             </label>
//             <div className="relative">
//               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">+91</span>
//               <input 
//                 type="text" 
//                 placeholder="Enter phone number"
//                 className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-14 pr-5 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300" 
//               />
//             </div>
//             <p className="text-[9px] font-medium text-slate-400 mt-2 px-1">
//               Note: Admin will access the business profile using this number.
//             </p>
//           </div>

//           {/* Assign Business Field */}
//           <div className="space-y-4">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
//               Assign Business 
//             </label>
            
//             <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/20">
//               {/* Search Inside Assign Business */}
//               <div className="relative border-b border-slate-50">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                 <input 
//                   type="text" 
//                   placeholder="Search businesses"
//                   className="w-full pl-11 pr-4 py-3 text-[10px] font-bold text-slate-600 outline-none placeholder:text-slate-300" 
//                 />
//               </div>

//               {/* Business List */}
//               <div className="max-h-[200px] overflow-y-auto p-2 space-y-1 bg-slate-50/30">
//                 {["Goelectronix Technologies Private Limited", "Yan Autonations Private Limited"].map((biz) => (
//                   <label key={biz} className="flex items-center gap-3 p-3 hover:bg-white rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100 hover:shadow-sm">
//                     <input 
//                       type="checkbox" 
//                       className="w-4 h-4 rounded mr-2 border-slate-300 text-blue-600 focus:ring-blue-500" 
//                     />
//                     <span className="text-[10px] !tracking-normal font-bold text-slate-600 group-hover:text-slate-900">{biz}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="p-8 border-t border-slate-50 bg-slate-50/30 sticky bottom-0">
//           <button className="w-full py-4 !bg-white !text-blue-500 border border-blue-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]  outline-none cursor-pointer">
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagerusersPage;