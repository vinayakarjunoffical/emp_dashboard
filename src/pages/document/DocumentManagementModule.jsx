import React from "react";
import { FilePlus, Search, Filter } from "lucide-react";
import DocumentForm from "./DocumentForm";
import DocumentManagerTable from "./DocumentManagerTable";

const DocumentManagementModule = () => {
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState(null);
  
  const documents = [
    { id: 1, name: "Employee_Onboarding_Handbook_2026.pdf" },
    { id: 2, name: "NDA_Agreement_Standard_V2.docx" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Document Control</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Enterprise Asset Management</p>
          </div>
          {!showForm && (
            <button 
              onClick={() => { setEditData(null); setShowForm(true); }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <FilePlus size={16} /> Add Document
            </button>
          )}
        </div>

        {/* Form State */}
        {showForm && (
          <DocumentForm 
            mode={editData ? 'edit' : 'add'} 
            initialData={editData}
            onCancel={() => setShowForm(false)}
            onSubmit={() => setShowForm(false)}
          />
        )}

        {/* Table View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Active Repository</h4>
            <div className="flex gap-2 text-slate-400">
               <Search size={16} className="cursor-pointer hover:text-blue-600" />
               <Filter size={16} className="cursor-pointer hover:text-blue-600" />
            </div>
          </div>
          <DocumentManagerTable 
            documents={documents} 
            onEdit={(doc) => { setEditData(doc); setShowForm(true); }}
            onDelete={(id) => console.log('Delete', id)}
          />
        </div>

      </div>
    </div>
  );
};


export default DocumentManagementModule