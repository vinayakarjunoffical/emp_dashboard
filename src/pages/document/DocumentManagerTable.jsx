import React, { useState } from 'react';
import { FileText, Edit3, Trash2, ShieldCheck, Search, ListFilter, RotateCcw, Eye, Calendar, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';

const DocumentManagerTable = ({ documents, onEdit, onDelete, searchQuery, setSearchQuery, onPreview }) => {
  const [previewDoc, setPreviewDoc] = useState(null);


  
  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Standard density for enterprise tables

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = documents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(documents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- PREVIEW MODAL COMPONENT ---
  const DocumentPreviewModal = ({ doc, isOpen, onClose }) => {
    if (!isOpen || !doc) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">System Preview</p>
                <h3 className="text-sm font-black text-slate-900 uppercase">Asset Details</h3>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4 border border-slate-100">
                <FileText size={32} />
              </div>
              <h4 className="text-base font-black text-slate-900 leading-tight mb-1">{doc.name?.replace(/_/g, ' ')}</h4>
              <p className="text-xs font-medium text-slate-400 break-all px-4">{doc.file_path}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                <p className="text-xs font-bold text-slate-700">{formatDate(doc.created_at)}</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Format</p>
                <p className="text-xs font-bold text-slate-700 uppercase">.docx (OpenXML)</p>
              </div>
            </div>
          </div>
          <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
              Close
            </button>
            <a href={`https://apihrr.goelectronix.co.in/${doc?.raw?.file_path}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl text-center shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={14} /> View File
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* PREVIEW MODAL INSTANCE */}
      <DocumentPreviewModal 
        doc={previewDoc} 
        isOpen={!!previewDoc} 
        onClose={() => setPreviewDoc(null)} 
      />

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
        <div className="relative w-full md:w-96 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            placeholder="Search documents by name..."
            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
            System Records: <span className="text-slate-900">{documents.length}</span>
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Registry</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Timestamp</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Security</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {currentItems.length > 0 ? (
              currentItems.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 group transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-sm">
                        <FileText size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 leading-none mb-1">{doc.name?.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] font-medium text-slate-400 truncate max-w-[200px] uppercase tracking-tight">
                          {doc.file_path ? doc.file_path.split(/[\\/]/).pop() : "No file"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
                      <Calendar size={12} />
                      <span className="text-[11px] font-bold">{formatDate(doc.created_at)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-100 uppercase tracking-tighter shadow-sm">
                      <ShieldCheck size={10} className="inline mr-1 mb-0.5" /> Verified
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setPreviewDoc(doc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Preview">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onEdit(doc)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                        <Edit3 size={16} />
                      </button>
                      {/* <button onClick={() => onDelete(doc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-20 bg-slate-50/30">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={32} className="text-slate-200" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching records</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION FOOTER */}
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{indexOfFirstItem + 1}</span> to <span className="text-slate-900">{Math.min(indexOfLastItem, documents.length)}</span> of {documents.length}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:hover:text-slate-500 transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`min-w-[32px] h-8 text-[11px] font-black rounded-xl transition-all ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:hover:text-slate-500 transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagerTable;
//**************************************************working code phase 33 10/02/26***************************************************************** */
// import React, { useState } from 'react';
// import { FileText, Edit3, Trash2, ShieldCheck, Search, ListFilter, RotateCcw, Eye, Calendar, ExternalLink , X} from 'lucide-react';

// const DocumentManagerTable = ({ documents, onEdit, onDelete, searchQuery, setSearchQuery, onPreview }) => {
//    const [previewDoc, setPreviewDoc] = useState(null);

  

//   const formatDate = (dateString) => {
   

//   if (!dateString) return "--";
//   return new Date(dateString).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const DocumentPreviewModal = ({ doc, isOpen, onClose }) => {
//   if (!isOpen || !doc) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
//       <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
//         {/* Modal Header */}
//         <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
//               <ShieldCheck size={20} />
//             </div>
//             <div>
//               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">System Preview</p>
//               <h3 className="text-sm font-black text-slate-900 uppercase">Asset Details</h3>
//             </div>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
//             <X size={20} className="text-slate-400" />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-8 space-y-6">
//           <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center text-center">
//             <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4 border border-slate-100">
//               <FileText size={32} />
//             </div>
//             <h4 className="text-base font-black text-slate-900 leading-tight mb-1">
//               {doc.name.replace(/_/g, ' ')}
//             </h4>
//             <p className="text-xs font-medium text-slate-400 break-all px-4">
//               {doc.file_path}
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="p-4 rounded-2xl border border-slate-100 bg-white">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Created</p>
//               <p className="text-xs font-bold text-slate-700">{new Date(doc.created_at).toLocaleDateString()}</p>
//             </div>
//             <div className="p-4 rounded-2xl border border-slate-100 bg-white">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Format</p>
//               <p className="text-xs font-bold text-slate-700 uppercase">.docx (OpenXML)</p>
//             </div>
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex gap-3">
//           <button 
//             onClick={onClose}
//             className="flex-1 py-3 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200"
//           >
//             Close
//           </button>
//           <a 
//             href={`https://apihrr.goelectronix.co.in/${doc.file_path}`}
//             target="_blank"
//             rel="noreferrer"
//             className="flex-1 py-3 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl text-center shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
//           >
//             <ExternalLink size={14} /> View File
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

//   return (
//     <div className="w-full space-y-4">
//       {/* ACTION BAR (Keeping your existing logic) */}
//       <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
//         <div className="relative w-full md:w-96 group">
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//             <Search size={18} />
//           </div>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search documents by name..."
//             className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
//             Total Assets: <span className="text-slate-900">{documents.length}</span>
//           </p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-200">
//               <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Registry</th>
//               <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Timestamp</th>
//               <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Security</th>
//               <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-slate-100">
//             {documents.length > 0 ? (
//               documents.map((doc) => (
//                 <tr key={doc.id} className="hover:bg-slate-50/80 group transition-colors">
//                   {/* NAME COLUMN */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                         <FileText size={18} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-sm font-bold text-slate-800 leading-none mb-1">{doc.name.replace(/_/g, ' ')}</span>
//                         <span className="text-[10px] font-medium text-slate-400 truncate max-w-[200px] uppercase tracking-tight">
//                           {doc.file_path ? doc.file_path.split(/[\\/]/).pop() : "No file"}
//                         </span>
//                       </div>
//                     </div>
//                   </td>

//                   {/* DATE COLUMN */}
//                   <td className="px-6 py-4 text-center">
//                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
//                       <Calendar size={12} />
//                       <span className="text-[11px] font-bold">{formatDate(doc.created_at)}</span>
//                     </div>
//                   </td>

//                   {/* STATUS COLUMN */}
//                   <td className="px-6 py-4 text-center">
//                     <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-100 uppercase tracking-tighter">
//                       <ShieldCheck size={10} className="inline mr-1 mb-0.5" /> Verified
//                     </span>
//                   </td>

//                   {/* ACTIONS COLUMN */}
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex justify-end gap-1">
//                       <button
//                         // onClick={() => onPreview(doc)}
//                         onClick={() => setPreviewDoc(doc)}
//                         className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                         title="Preview"
//                       >
//                         <Eye size={16} />
//                       </button>
//                       <button
//                         onClick={() => onEdit(doc)}
//                         className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
//                         title="Edit Configuration"
//                       >
//                         <Edit3 size={16} />
//                       </button>
//                       <button
//                         onClick={() => onDelete(doc.id)}
//                         className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                         title="Decommission"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center py-20 bg-slate-50/30">
//                   <div className="flex flex-col items-center gap-2">
//                     <Search size={32} className="text-slate-200" />
//                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching records</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DocumentManagerTable;
//****************************************************working code phase 12 10/02/26**************************************************************** */
// import React , {useState} from 'react';
// import { FileText, Edit3, Trash2, ShieldCheck, Search, ListFilter, RotateCcw } from 'lucide-react';

// const DocumentManagerTable = ({ documents, onEdit, onDelete, searchQuery, setSearchQuery }) => {



//   return (
//     <div className="w-full space-y-4">

//       {/* ACTION BAR */}
//       <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
//         <div className="relative w-full md:w-96 group">
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//             <Search size={18} />
//           </div>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search documents by name..."
//             className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
//           />
//         </div>

//         <div className="flex items-center gap-2 w-full md:w-auto">
//           <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
//             <button className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-black text-slate-600 uppercase tracking-wider hover:bg-white rounded-lg">
//               <ListFilter size={14} /> Filter
//             </button>
//             <div className="w-[1px] h-4 bg-slate-300"></div>
//             <button className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-black text-slate-600 uppercase tracking-wider hover:bg-white rounded-lg">
//               <RotateCcw size={14} /> Reset
//             </button>
//           </div>

//           <p className="hidden lg:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-2">
//             Total Records: <span className="text-slate-900">{documents.length}</span>
//           </p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-200">
//               <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Index</th>
//               <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Document</th>
//               <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-center">Status</th>
//               <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-right">Operations</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-slate-100">
//             {documents.length > 0 ? (
//               documents.map((doc, index) => (
//                 <tr key={doc.id} className="hover:bg-slate-50 group">
//                   <td className="px-6 py-4 text-xs font-bold text-slate-400">
//                     #{String(index + 1).padStart(2, "0")}
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                         <FileText size={16} />
//                       </div>
//                       <span className="text-sm font-bold text-slate-800">{doc.name}</span>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4 text-center">
//                     <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-md border border-emerald-100">
//                       <ShieldCheck size={12} className="inline mr-1" />
//                       Verified
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 text-right">
//                     <button
//                       onClick={() => onEdit(doc)}
//                       className="mr-2 p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
//                     >
//                       <Edit3 size={16} />
//                     </button>

//                     <button
//                       onClick={() => onDelete(doc.id)}
//                       className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center py-12 text-slate-400 font-bold">
//                   No documents found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DocumentManagerTable;

//************************************************************************************************************ */
// import React, { useState ,useEffect } from 'react'; 
// import { FileText, Edit3, Trash2, ShieldCheck, Search, Filter, ListFilter, RotateCcw } from 'lucide-react';


// const DocumentManagerTable = ({ documents, onEdit, onDelete, searchQuery, setSearchQuery }) => {
//   const [documents, setDocuments] = React.useState([]);
// const [searchQuery, setSearchQuery] = React.useState("");


// React.useEffect(() => {
//   fetchTemplates();
// }, []);

// const filteredDocs = documents.filter((doc) =>
//   doc.name.toLowerCase().includes(searchQuery.toLowerCase())
// );


// const fetchTemplates = async () => {
//   try {
//     const res = await policyTemplateService.getAllTemplates();

//     // 🔹 Map API → Table format
//     const mapped = (res?.data || res || []).map((item) => ({
//       id: item.id,
//       name: item.name,   // adjust if API uses different key
//       raw: item,         // keep full data for edit
//     }));

//     setDocuments(mapped);

//   } catch (err) {
//     console.error("Failed to load templates", err);
//   }
// };

// const handleCreate = async (data) => {
//   try {
//     await policyTemplateService.createTemplate(data);
//     alert("Created Successfully ✅");

//     setShowForm(false);
//     fetchTemplates();   // 🔹 refresh table

//   } catch (err) {
//     console.error(err);
//     alert("Create Failed ❌");
//   }
// };

// const handleUpdate = async (data) => {
//   try {
//     await policyTemplateService.updateTemplate(editData.id, data);
//     alert("Updated Successfully ✅");

//     setShowForm(false);
//     setEditData(null);
//     fetchTemplates();   // 🔹 refresh table

//   } catch (err) {
//     console.error(err);
//     alert("Update Failed ❌");
//   }
// };



//   return (
//     <div className="w-full space-y-4">
      
//       {/* PROFESSIONAL ACTION BAR */}
//       <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
//         <div className="relative w-full md:w-96 group">
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
//             <Search size={18} />
//           </div>
//           <input 
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search documents by name..."
//             className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
//           />
//         </div>

//         <div className="flex items-center gap-2 w-full md:w-auto">
//           <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
//             <button className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-black text-slate-600 uppercase tracking-wider hover:bg-white hover:shadow-sm rounded-lg transition-all">
//               <ListFilter size={14} /> Filter
//             </button>
//             <div className="w-[1px] h-4 bg-slate-300"></div>
//             <button className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-black text-slate-600 uppercase tracking-wider hover:bg-white hover:shadow-sm rounded-lg transition-all">
//               <RotateCcw size={14} /> Reset
//             </button>
//           </div>
          
//           <div className="hidden lg:block h-8 w-[1px] bg-slate-200 mx-2"></div>
          
//           <p className="hidden lg:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
//             Total Records: <span className="text-slate-900">{documents.length}</span>
//           </p>
//         </div>
//       </div>

//       {/* DATA TABLE */}
//       <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-200">
//               <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Index</th>
//               <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Document Identification</th>
//               <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
//               <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Operations</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {documents.length > 0 ? (
//               documents.map((doc, index) => (
//                 <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
//                   <td className="px-6 py-4 text-xs font-bold text-slate-400">
//                     #{String(index + 1).padStart(2, '0')}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
//                         <FileText size={16} />
//                       </div>
//                       <span className="text-sm font-bold text-slate-800 tracking-tight">{doc.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex justify-center">
//                       <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-md border border-emerald-100">
//                         <ShieldCheck size={12} /> Verified
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button 
//                         onClick={() => onEdit(doc)}
//                         className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
//                         title="Edit Record"
//                       >
//                         <Edit3 size={16} />
//                       </button>
//                       <button 
//                         onClick={() => onDelete(doc.id)}
//                         className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                         title="Delete Record"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="px-6 py-12 text-center">
//                   <div className="flex flex-col items-center gap-2">
//                     <Search className="text-slate-200" size={40} />
//                     <p className="text-sm font-bold text-slate-400">No documents match your search.</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DocumentManagerTable;
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