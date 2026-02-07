import React, { useEffect, useState } from 'react';
import { ShieldCheck, X, Save, Plus, Info, Lock, ChevronRight, ShieldAlert } from 'lucide-react';

const RoleForm = ({ editingRole, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', description: '', access: 'View' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRole) {
      setFormData(editingRole);
    } else {
      setFormData({ name: '', description: '', access: 'Viewer (Read Only)' });
    }
  }, [editingRole]);

  return (
    <div className="flex flex-col h-full bg-[#fcfcfd] border-l border-slate-200 shadow-[20px_0_40px_rgba(0,0,0,0.02)]">
      
      {/* 1. HEADER: High-Density & Semantic */}
      <div className="px-6 py-5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className={`p-2 rounded-lg border shadow-sm transition-all duration-300 ${
            editingRole 
              ? 'bg-amber-50 border-amber-200 text-amber-700' 
              : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <ShieldCheck size={18} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight truncate">
              {editingRole ? 'Modify System Role' : 'Define New Authority'}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {editingRole ? `Reference: ${editingRole.id}` : 'Configuration Mode'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BODY: Structured Fields */}
      <div className="flex-1 overflow-y-auto p-6 space-y-7 custom-scrollbar">
        
        {/* Field: Role Identification */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ChevronRight size={12} className="text-slate-300" />
              Functional Identity
            </label>
            <span className="text-[9px] font-black text-slate-300 uppercase">Mandatory</span>
          </div>
          <input 
            type="text"
            className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white focus:border-slate-900 focus:ring-[3px] focus:ring-slate-900/5 outline-none font-semibold text-slate-700 transition-all text-sm placeholder:text-slate-300 shadow-sm"
            placeholder="e.g. System_Architect"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Field: Security Level (Enterprise Radio Grid) */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ChevronRight size={12} className="text-slate-300" />
            Authorization Level
          </label>
          
          <div className="space-y-2">
            {[
              { id: 'Admin (Full Access)', desc: 'Unrestricted system modification', icon: <ShieldAlert size={14}/> },
              { id: 'Editor (Write Access)', desc: 'Operational changes and management', icon: <Save size={14}/> },
              { id: 'Viewer (Read Only)', desc: 'Restricted to observation only', icon: <Lock size={14}/> }
            ].map((level) => (
              <button 
                key={level.id}
                onClick={() => setFormData({...formData, access: level.id})}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                  formData.access === level.id 
                    ? 'bg-slate-900 border-slate-900 shadow-md shadow-slate-200' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`mt-0.5 p-1.5 rounded-md ${
                  formData.access === level.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {level.icon}
                </div>
                <div>
                  <p className={`text-[12px] font-bold ${formData.access === level.id ? 'text-white' : 'text-slate-800'}`}>
                    {level.id}
                  </p>
                  <p className={`text-[10px] font-medium mt-0.5 ${formData.access === level.id ? 'text-slate-400' : 'text-slate-400'}`}>
                    {level.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Audit Note */}
        <div className="flex gap-3.5 p-4 rounded-xl border border-blue-100 bg-blue-50/40">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-blue-700/80 leading-relaxed">
            Changes to authorization levels are logged in the <strong>Audit Trail</strong> and require secondary approval for production environments.
          </p>
        </div>
      </div>

      {/* 3. FOOTER: Clear & Weighted Actions */}
      <div className="px-6 py-6 bg-white border-t border-slate-200">
        <div className="flex flex-col gap-2.5">
          <button 
            disabled={isSubmitting}
            className={`h-11 w-full rounded-lg flex items-center justify-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] ${
              editingRole 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200'
            }`}
          >
            {editingRole ? <Save size={14} /> : <Plus size={14} />}
            {editingRole ? 'Commit System Update' : 'Initialize Authority'}
          </button>
          
          <button 
            onClick={onCancel}
            className="h-11 w-full rounded-lg flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
          >
            {editingRole ? 'Abort Transaction' : 'Clear Form'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;
//*********************************************working code phase 1**************************************************** */
// import React, { useEffect, useState } from 'react';
// import { ShieldCheck, X, Save, Plus } from 'lucide-react';

// const RoleForm = ({ editingRole, onCancel }) => {
//   const [formData, setFormData] = useState({ name: '', description: '', access: 'View' });

//   // Sync form when editingRole changes
//   useEffect(() => {
//     if (editingRole) {
//       setFormData(editingRole);
//     } else {
//       setFormData({ name: '', description: '', access: 'View' });
//     }
//   }, [editingRole]);

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-8 border-b border-slate-100 bg-white">
//         <div className="flex items-center gap-3 mb-2">
//           <div className={`p-2 rounded-xl ${editingRole ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
//             <ShieldCheck size={20} />
//           </div>
//           <h2 className="text-xl font-black text-slate-900 tracking-tight">
//             {editingRole ? 'Edit Role' : 'Create New Role'}
//           </h2>
//         </div>
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//           {editingRole ? `Modifying ID: #RL-${editingRole.id}` : 'Define system access levels'}
//         </p>
//       </div>

//       <div className="p-8 space-y-6 flex-1 overflow-y-auto">
//         <div className="space-y-2">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Name</label>
//           <input 
//             type="text"
//             className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"
//             placeholder="e.g. Senior Recruiter"
//             value={formData.name}
//             onChange={(e) => setFormData({...formData, name: e.target.value})}
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permission Level</label>
//           <select 
//             className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"
//             value={formData.access}
//             onChange={(e) => setFormData({...formData, access: e.target.value})}
//           >
//             <option>Admin (Full Access)</option>
//             <option>Editor (Write Access)</option>
//             <option>Viewer (Read Only)</option>
//           </select>
//         </div>
//       </div>

//       {/* Action Footer */}
//       <div className="p-8 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
//         <button className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-lg ${editingRole ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-slate-900 hover:bg-black shadow-slate-200'}`}>
//           {editingRole ? <Save size={16}/> : <Plus size={16}/>}
//           {editingRole ? 'Update Role' : 'Create Role'}
//         </button>
        
//         {editingRole && (
//           <button 
//             onClick={onCancel}
//             className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-200 transition-all"
//           >
//             <X size={16}/> Cancel Edit
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RoleForm;