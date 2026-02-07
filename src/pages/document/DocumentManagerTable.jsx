import React from 'react';
import { FileText, Edit3, Trash2, ShieldCheck, Search, Filter, ListFilter, RotateCcw } from 'lucide-react';

const DocumentManagerTable = ({ documents, onEdit, onDelete, searchQuery, setSearchQuery }) => {
  return (
    <div className="w-full space-y-4">
      
      {/* PROFESSIONAL ACTION BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
        <div className="relative w-full md:w-96 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name..."
            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-black text-slate-600 uppercase tracking-wider hover:bg-white hover:shadow-sm rounded-lg transition-all">
              <ListFilter size={14} /> Filter
            </button>
            <div className="w-[1px] h-4 bg-slate-300"></div>
            <button className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-black text-slate-600 uppercase tracking-wider hover:bg-white hover:shadow-sm rounded-lg transition-all">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
          
          <div className="hidden lg:block h-8 w-[1px] bg-slate-200 mx-2"></div>
          
          <p className="hidden lg:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
            Total Records: <span className="text-slate-900">{documents.length}</span>
          </p>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Index</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Document Identification</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">
                    #{String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-800 tracking-tight">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-md border border-emerald-100">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(doc)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Edit Record"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(doc.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="text-slate-200" size={40} />
                    <p className="text-sm font-bold text-slate-400">No documents match your search.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentManagerTable;
//*********************************************************************************************************** */
// import React from 'react';
// import { FileText, Edit3, Trash2, ShieldCheck, Search, Filter } from 'lucide-react';

// const DocumentManagerTable = ({ documents, onEdit, onDelete }) => {
//   return (
//     <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="bg-slate-50 border-b border-slate-200">
//             <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Index</th>
//             <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Document Identification</th>
//             <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
//             <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Operations</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100">
//           {documents.map((doc, index) => (
//             <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
//               <td className="px-6 py-4 text-xs font-bold text-slate-400">
//                 #{String(index + 1).padStart(2, '0')}
//               </td>
//               <td className="px-6 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                     <FileText size={16} />
//                   </div>
//                   <span className="text-sm font-bold text-slate-800 tracking-tight">{doc.name}</span>
//                 </div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="flex justify-center">
//                   <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-md border border-emerald-100">
//                     <ShieldCheck size={12} /> Verified
//                   </span>
//                 </div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="flex justify-end gap-2">
//                   <button 
//                     onClick={() => onEdit(doc)}
//                     className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
//                   >
//                     <Edit3 size={16} />
//                   </button>
//                   <button 
//                     onClick={() => onDelete(doc.id)}
//                     className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DocumentManagerTable