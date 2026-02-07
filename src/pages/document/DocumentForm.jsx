import React from 'react';
import { FilePlus, Save, X, Info, ShieldCheck, Fingerprint } from 'lucide-react';

const DocumentForm = ({ mode = 'add', initialData, onSubmit, onCancel }) => {
  const isEdit = mode === 'edit';

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-400">
      {/* HEADER: Refined with a very subtle bottom border and distinct typography */}
      <div className="px-8 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            isEdit 
              ? 'bg-amber-50 border-amber-100 text-amber-600' 
              : 'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
            {isEdit ? <Fingerprint size={20} /> : <FilePlus size={20} />}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
              {isEdit ? 'Configuration Edit' : 'New Asset Registration'}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
              <ShieldCheck size={10} className="text-emerald-500" /> Secure Cloud Repository
            </p>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200"
        >
          <X size={18} />
        </button>
      </div>

      {/* BODY: Increased breathing room and tighter input design */}
      <div className="p-10 space-y-8">
        <div className="flex flex-col gap-2.5 group">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
              Document Title / Alias
            </label>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Required Field</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              defaultValue={initialData?.name || ''}
              placeholder="E.g. Q1_Financial_Report_Internal"
              className="w-full bg-slate-50/50 border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-800 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
            />
          </div>
        </div>

        {/* INFO BOX: Redesigned to look like a system notification */}
        <div className="bg-slate-900 rounded-2xl p-5 flex gap-4 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
            <Info size={16} />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-black text-white uppercase tracking-wider leading-none">Protocol Information</p>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Upon commit, the system triggers an <span className="text-blue-400 font-bold">SHA-256 integrity check</span>. Names must be unique within the current department directory.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER: Integrated look with zero shadow */}
      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest max-w-[150px]">
          Authorized changes are logged to the master audit trail.
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onSubmit}
            className={`flex items-center gap-2 px-8 py-2.5 text-[10px] font-black text-white uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-sm
              ${isEdit 
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/10' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/10'}
            `}
          >
            <Save size={14} />
            {isEdit ? 'Update Entry' : 'Commit Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;
//***********************************************working code pahse 1*********************************************************** */
// import React from 'react';
// import { FilePlus, Save, X, Info } from 'lucide-react';

// const DocumentForm = ({ mode = 'add', initialData, onSubmit, onCancel }) => {
//   const isEdit = mode === 'edit';

//   return (
//     <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
//       <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <div className={`p-2 rounded-lg ${isEdit ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
//             {isEdit ? <FilePlus size={18} /> : <FilePlus size={18} />}
//           </div>
//           <div>
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
//               {isEdit ? 'Modify Document Record' : 'Register New Document'}
//             </h3>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
//               Internal Compliance Registry
//             </p>
//           </div>
//         </div>
//         <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
//           <X size={20} />
//         </button>
//       </div>

//       <div className="p-8 space-y-6">
//         <div className="flex flex-col gap-2 group">
//           <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
//             Document Name / Title
//           </label>
//           <input 
//             type="text" 
//             defaultValue={initialData?.name || ''}
//             placeholder="e.g. Annual_Tax_Compliance_2026.pdf"
//             className="w-full bg-white border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
//           />
//         </div>

//         <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3">
//           <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
//           <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
//             Ensure the document name is descriptive. The system will automatically append a unique version hash upon submission.
//           </p>
//         </div>
//       </div>

//       <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
//         <button 
//           onClick={onCancel}
//           className="px-5 py-2 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-lg transition-all"
//         >
//           Cancel
//         </button>
//         <button 
//           onClick={onSubmit}
//           className={`flex items-center gap-2 px-6 py-2 text-[11px] font-black text-white uppercase tracking-widest rounded-lg shadow-lg transition-all active:scale-95
//             ${isEdit ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}
//           `}
//         >
//           <Save size={14} />
//           {isEdit ? 'Update Record' : 'Commit Record'}
//         </button>
//       </div>
//     </div>
//   );
// };


// export default DocumentForm