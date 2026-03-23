import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldCheck, ChevronDown, Info, Clock, 
  Building2, Wallet, Settings2, Calendar, Users, 
  CreditCard, LayoutGrid, Bell, CheckCircle2, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RolePermission = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");

  // Data mapped directly from PDF Source text
  const permissionSections = [
    {
      group: "Attendance Settings",
      icon: <Clock size={16} />,
      items: ["View Attendance", "Mark Attendance", "View Overtime & Fines", "Mark Overtime & Fines"]
    },
    {
      group: "Templates",
      icon: <Calendar size={16} />,
      items: ["Attendance Templates", "Shift Templates", "Leave Templates","Automation Rules Templates", "Expense Templates"]
    },
    {
      group: "Staff Management",
      icon: <Users size={16} />,
      items: ["View Staff Profile", "View Staff Bank Details", "View Staff Salary Information", "Deactivate Staff", "Delete Staff"]
    },
     {
      group: "Leaves",
      icon: <Wallet size={16} />,
      items: ["Edit Leaves Balances", "Approve Leaves", "Encash Leaves"]
    },
    {
      group: "Roster",
      icon: <Users size={16} />,
      items: ["Configure Staff Roster"]
    },
   
    {
      group: "Reimbursement",
      icon: <Building2 size={16} />,
      items: [ "Approve Expense Claims"]
    },
    {
      group: "Payments",
      icon: <Settings2 size={16} />,
      items: ["Process Offline Payments", "Process Online Payments"]
    },
     {
      group: "Payroll",
      icon: <Settings2 size={16} />,
      items: ["Freeze Payroll", "Process Payroll"]
    },
     {
      group: "Lens",
      icon: <Settings2 size={16} />,
      items: ["Enroll/Delete Faces"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left relative overflow-x-hidden">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-[50] shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:!bg-slate-100 rounded-xl !text-slate-400 transition-all border !bg-transparent outline-none active:scale-90"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Configure Role Permissions</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Assign module access for staff roles</p>
          </div>
        </div>
      </div>

      <div className=" mx-auto md:px-6 px-2 mt-4 space-y-8 mb-4">
        
        {/* TOP IDENTITY CARD */}
       <div className="bg-white border border-slate-200 mb-4 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
  {/* ROLE NAME INPUT */}
  <div className="space-y-2 flex-1 w-full md:max-w-md relative z-10">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
      Role Name <span className="text-blue-600">*</span>
    </label>
    <input 
      type="text" 
      placeholder="e.g. ATTENDANCE MANAGER" 
      value={roleName}
      onChange={(e) => setRoleName(e.target.value)}
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-slate-300 uppercase tracking-wider"
    />
  </div>

  {/* ROLE DESCRIPTION INPUT (Replacing Permission Logic) */}
  <div className="space-y-2 flex-1 w-full relative z-10">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
      Role Description
    </label>
    <input 
      type="text" 
      placeholder="Describe the responsibilities of this role..." 
      value={roleDescription}
      onChange={(e) => setRoleDescription(e.target.value)}
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[11px] font-bold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-slate-300 uppercase tracking-wider"
    />
  </div>

  {/* Subtle background decoration */}
  <Lock className="absolute -right-4 -bottom-4 text-slate-900 opacity-[0.03] rotate-12" size={140} />
</div>

        {/* 📦 PERMISSIONS GRID SECTION (3 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* {permissionSections.map((section, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-[24px] shadow-sm flex flex-col overflow-hidden hover:border-blue-300 transition-all group relative">
              
            
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 text-blue-600 shadow-sm group-hover:border-blue-100">
                    {section.icon}
                  </div>
                  <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em]">{section.group}</h3>
                </div>
                <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 active:scale-95">Select All</button>
              </div>

             
              <div className="p-5 space-y-5 flex-1">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center justify-between gap-4 group/item">
                    <div className="flex items-center gap-3 flex-1">
                       <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer transition-all" />
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-tight group-hover/item:text-slate-900 transition-colors">
                         {item}
                       </span>
                    </div>
                    
                    <div className="relative">
                      <select className="bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-8 py-1.5 text-[9px] font-black uppercase text-slate-500 appearance-none outline-none cursor-pointer hover:border-blue-300 hover:text-blue-600 transition-all min-w-[110px]">
                        <option>Full Access</option>
                        <option>View Only</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))} */}

          {permissionSections.map((section, idx) => {
  const isLens = section.group === "Lens"; // Check if this is the special card

  return (
    <div key={idx} className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden hover:border-blue-300 transition-all group relative">
      
      {/* Box Header */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-white rounded-xl border border-slate-100 shadow-sm ${isLens ? 'text-purple-600' : 'text-blue-600'}`}>
            {section.icon}
          </div>
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em]">{section.group}</h3>
          {isLens && <Info size={12} className="text-slate-300" />}
        </div>
        {/* <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 active:scale-95">Select All</button> */}
      </div>

      {/* Special Table Header for Lens only  */}
      {isLens && (
        <div className="grid grid-cols-12 px-5 py-2 bg-slate-50/50 border-b border-slate-100">
          <div className="col-span-1"></div>
          <div className="col-span-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Privilege name</div>
          <div className="col-span-3 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Applies to</div>
          <div className="col-span-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Selected Units</div>
        </div>
      )}

      {/* Items List */}
      <div className="p-5 space-y-5 flex-1">
        {section.items.map((item, iIdx) => (
          <div key={iIdx} className={`flex items-center justify-between gap-4 group/item ${isLens ? 'grid grid-cols-12' : ''}`}>
            
            {/* Left Section: Checkbox + Name */}
            <div className={`flex items-center gap-3 ${isLens ? 'col-span-5' : 'flex-1'}`}>
               <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer transition-all" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-tight group-hover/item:text-slate-900 transition-colors">
                 {typeof item === 'string' ? item : item.name}
               </span>
            </div>
            
            {/* Right Section: Dropdowns */}
            {isLens ? (
              // Double Dropdown for Lens 
              <>
                <div className="col-span-3 relative px-1">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-7 py-1.5 text-[9px] font-black uppercase text-slate-500 appearance-none outline-none cursor-pointer hover:border-blue-300 transition-all">
                    <option>Work Location</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="col-span-4 relative pl-1">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-7 py-1.5 text-[9px] font-black uppercase text-slate-500 appearance-none outline-none cursor-pointer hover:border-blue-300 transition-all">
                    <option>Select Busines...</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </>
            ) : (
              // Standard single dropdown for other sections
              <div className="relative">
                <select className="bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-8 py-1.5 text-[9px] font-black uppercase text-slate-500 appearance-none outline-none cursor-pointer hover:border-blue-300 transition-all min-w-[110px]">
                  {/* <option>Full Access</option>
                  <option>View Only</option> */}
                    <option>Direct Reportees Only</option>
                      <option>All Reportees</option>
                       <option>Work locations</option>
                        <option>Business Function</option>
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
})}
        </div>
      </div>

      {/* 🛡️ FIXED FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/95">
        <div className=" mx-auto flex items-center justify-end px-2">
          {/* <div className="hidden md:flex items-center gap-3">
             <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-100">
               <ShieldCheck size={22} strokeWidth={2.5} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Security Protocol Active</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Changes are recorded in Audit Logs</p>
             </div>
          </div> */}
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="flex-1 md:flex-none px-10 py-3 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              Discard Changes
            </button>
            <button 
              className="flex-1 md:flex-none px-14 py-3 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest border border-blue-500 shadow-sm shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermission;