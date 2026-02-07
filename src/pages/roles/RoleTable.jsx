import React from 'react';
import { Edit3, Trash2, Users, Shield, Zap, Search, Filter } from 'lucide-react';

const RoleTable = ({ onEdit, activeEditingId }) => {
  const roles = [
    { id: 1, name: 'SUPER_ADMIN', access: 'Admin (Full Access)', members: 3, status: 'Active' },
    { id: 2, name: 'HR_MANAGER', access: 'Editor (Write Access)', members: 12, status: 'Active' },
    { id: 3, name: 'EXTERNAL_DEV', access: 'Viewer (Read Only)', members: 5, status: 'Restricted' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fcfcfd]">
      {/* 1. TABLE UTILITY HEADER */}
      <div className="px-10 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">System Authorities</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Review and manage global access control lists
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search Registry..." 
                className="h-9 w-64 pl-9 pr-4 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm"
              />
            </div>
            <button className="h-9 px-3 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={14} />
            </button>
          </div>
        </div>

        {/* 2. DATA GRID */}
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-[40%] px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Authority Identity</th>
                <th className="w-[25%] px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">Security Clearance</th>
                <th className="w-[15%] px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center border-r border-slate-100">Users</th>
                <th className="w-[20%] px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map((role) => (
                <tr 
                  key={role.id} 
                  className={`transition-all ${
                    activeEditingId === role.id 
                      ? 'bg-amber-50/50' 
                      : 'hover:bg-slate-50/30'
                  }`}
                >
                  {/* Name & ID Column */}
                  <td className="px-6 py-5 border-r border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                        <Shield size={14} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-[11px] tracking-tight">{role.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">UID: 00-RL-{role.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Access Badge Column */}
                  <td className="px-6 py-5 border-r border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        role.access.includes('Admin') ? 'bg-rose-500' : 'bg-emerald-500'
                      }`} />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
                        {role.access}
                      </span>
                    </div>
                  </td>

                  {/* Member Count Column */}
                  <td className="px-6 py-5 text-center border-r border-slate-50">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-100">
                      <Users size={12} className="text-slate-400" />
                      <span className="text-[11px] font-black text-slate-700">{role.members}</span>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => onEdit(role)}
                        className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all border ${
                          activeEditingId === role.id 
                            ? 'bg-amber-500 border-amber-500 text-white' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900'
                        }`}
                      >
                        Modify
                      </button>
                      <button className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER PAGINATION */}
        <div className="mt-4 flex items-center justify-between px-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{roles.length}</span> recorded entries
          </p>
          <div className="flex gap-1">
            <button className="h-8 px-4 bg-white border border-slate-200 rounded text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">Prev</button>
            <button className="h-8 px-4 bg-white border border-slate-900 rounded text-[10px] font-black uppercase tracking-widest text-slate-900">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleTable;
//**********************************************working code phase 11*************************************************************** */
// import React from 'react';
// import { Edit3, Trash2, MoreVertical } from 'lucide-react';

// const RoleTable = ({ onEdit, activeEditingId }) => {
//   const roles = [
//     { id: 1, name: 'Super Admin', access: 'Admin (Full Access)', members: 3 },
//     { id: 2, name: 'Hiring Manager', access: 'Editor (Write Access)', members: 12 },
//     { id: 3, name: 'External Agency', access: 'Viewer (Read Only)', members: 5 },
//   ];

//   return (
//     <div className="p-10 h-full flex flex-col">
//       <div className="mb-8 flex justify-between items-end">
//         <div>
//           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Roles</h3>
//           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global permissions</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50/50 border-b border-slate-100">
//               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Details</th>
//               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Permission</th>
//               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Members</th>
//               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {roles.map((role) => (
//               <tr 
//                 key={role.id} 
//                 className={`group transition-all ${activeEditingId === role.id ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}`}
//               >
//                 <td className="px-8 py-6">
//                   <p className="font-black text-slate-800 tracking-tight uppercase text-xs">{role.name}</p>
//                   <p className="text-[10px] text-slate-400 font-bold mt-0.5">ID: #RL-{role.id}</p>
//                 </td>
//                 <td className="px-8 py-6">
//                   <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-tighter">
//                     {role.access}
//                   </span>
//                 </td>
//                 <td className="px-8 py-6 text-center text-xs font-black text-slate-500">
//                   {role.members}
//                 </td>
//                 <td className="px-8 py-6">
//                   <div className="flex justify-end gap-2">
//                     <button 
//                       onClick={() => onEdit(role)}
//                       className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-sm transition-all"
//                     >
//                       <Edit3 size={16} />
//                     </button>
//                     <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 hover:shadow-sm transition-all">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RoleTable;