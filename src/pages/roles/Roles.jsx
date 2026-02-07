import React, { useState } from 'react';
import RoleForm from './RoleForm';
import RoleTable from './RoleTable';

/**
 * RolesManagement Component
 * Standardized for Enterprise-level Administrative Workflows.
 * Features a Master-Detail layout with high-density UI elements.
 */
const RolesManagement = () => {
  const [editingRole, setEditingRole] = useState(null);

  const handleEditClick = (role) => {
    // Smooth scroll or focus logic could be added here for UX
    setEditingRole(role);
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
  };

  return (
    <div className="flex h-full w-full bg-[#f8f9fb] overflow-hidden antialiased text-slate-900">
      
      {/* 1. CONFIGURATION SIDEBAR (LEFT)
          Fixed width with a high-contrast border and subtle internal shadow
          to separate the 'Action Zone' from the 'Data Zone'.
      */}
      <aside className="w-[420px] bg-white border-r border-slate-200 z-20 flex flex-col relative">
        {/* Subtle decorative edge for depth */}
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent opacity-50" />
        
        <RoleForm 
          editingRole={editingRole} 
          onCancel={handleCancelEdit} 
        />
      </aside>

      {/* 2. DATA WORKSPACE (RIGHT)
          Flexible area utilizing a 'Canvas' feel with ample padding
          to prevent data fatigue.
      */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        
        {/* Workspace Utility Header (Optional - Can be integrated into RoleTable) */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-slate-200/60" />

        <div className="flex-1 overflow-auto custom-scrollbar bg-[#fcfcfd]">
          {/* Inner padding container to keep the table from hitting edges */}
          <div className="h-full min-w-[800px]">
             <RoleTable 
               onEdit={handleEditClick} 
               activeEditingId={editingRole?.id} 
             />
          </div>
        </div>

        {/* Workspace Footer / Status Bar (Enterprise Detail) */}
        <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              System Status: <span className="text-emerald-500">Operational</span>
            </span>
            <div className="h-3 w-[1px] bg-slate-200" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Last Sync: 11:04 AM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              v2.8.4-stable
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default RolesManagement;
//******************************************working code pahse 22************************************************************ */
// import React, { useState } from 'react';
// import RoleForm from './RoleForm';
// import RoleTable from './RoleTable';

// const RolesManagement = () => {
//   const [editingRole, setEditingRole] = useState(null); // null = Create Mode, object = Edit Mode

//   const handleEditClick = (role) => {
//     setEditingRole(role);
//   };

//   const handleCancelEdit = () => {
//     setEditingRole(null);
//   };

//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden">
//       {/* LEFT SIDE: Form Component (Fixed Width) */}
//       <div className="w-[400px] bg-white border-r border-slate-200 shadow-xl z-10 flex flex-col">
//         <RoleForm 
//           editingRole={editingRole} 
//           onCancel={handleCancelEdit} 
//         />
//       </div>

//       {/* RIGHT SIDE: Table Component (Flexible) */}
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <RoleTable onEdit={handleEditClick} activeEditingId={editingRole?.id} />
//       </div>
//     </div>
//   );
// };

// export default RolesManagement;