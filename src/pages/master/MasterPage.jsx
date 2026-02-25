import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Trash2, 
  Plus, 
  Search, 
  GraduationCap, 
  Layers, 
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Command,
  PlusCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const MasterManagement = () => {
  const [activeTab, setActiveTab] = useState('skills'); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const tabs = [
    { id: 'skills', label: 'Skills', icon: <Zap size={14} strokeWidth={2.5} /> },
    { id: 'educations', label: 'Educations', icon: <GraduationCap size={14} strokeWidth={2.5} /> },
    { id: 'industries', label: 'Industries', icon: <Layers size={14} strokeWidth={2.5} /> },
  ];

  const fetchMasters = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://apihrr.goelectronix.co.in/masters?types=${activeTab}&skip=0&limit=100`);
      const result = await response.json();
      const masterData = result[activeTab] || [];
      setData(masterData);
    } catch (error) {
      toast.error("Failed to load records");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, [activeTab]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    try {
      const response = await fetch(`https://apihrr.goelectronix.co.in/masters/${activeTab}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: [newValue.trim()] })
      });

      if (response.ok) {
        toast.success(`${newValue} added successfully`);
        setNewValue("");
        setIsAddModalOpen(false);
        fetchMasters();
      }
    } catch (error) {
      toast.error("Addition failed");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const response = await fetch(`https://apihrr.goelectronix.co.in/masters/${activeTab}/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Entry removed successfully");
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        fetchMasters();
      }
    } catch (error) {
      toast.error("Delete operation failed");
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- HEADER BLOCK --- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-100">
              <Command size={16} />
            </div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
              Admin Panel
            </h2>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight"> System Master </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Manage basic system Master
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="group flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
        >
          <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
           Add New Item
        </button>
      </div>

      {/* --- ENTERPRISE TOOLBAR --- */}
      <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
        {/* TAB STRIP */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? "bg-white text-blue-600 shadow-sm scale-[1.02]" 
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

        {/* SEARCH CONSOLE */}
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={14} />
          <input 
            type="text"
            placeholder={`Filter ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* --- DATA REGISTRY GRID --- */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Security Watermark */}
        <ShieldCheck className="absolute -right-12 -bottom-12 text-slate-50 opacity-[0.4] -rotate-12 pointer-events-none" size={300} />

        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] z-50">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} strokeWidth={2.5} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Data...</span>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-10 relative z-10">
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    {activeTab === 'skills' && <Zap size={16} strokeWidth={2.5} />}
                    {activeTab === 'educations' && <GraduationCap size={16} strokeWidth={2.5} />}
                    {activeTab === 'industries' && <Layers size={16} strokeWidth={2.5} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Entry #{item.id}</span>
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.name}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }}
                  className="opacity-0 group-hover:opacity-100 p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-48 flex flex-col items-center justify-center relative z-10">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 shadow-inner">
               <Layers size={40} strokeWidth={1} />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Empty Registry</p>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">No {activeTab} matches current filters</p>
          </div>
        )}
      </div>

      {/* --- MODAL SYSTEM --- */}

      {/* ADD ENTRY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">New Master Deployment</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Targeting: {activeTab}</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400"><X size={18}/></button>
            </div>
            <form onSubmit={handleAdd} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Database Entry Name</label>
                <input 
                  autoFocus
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-tight outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Abort</button>
                <button type="submit" className="flex-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all">Finalize Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-50">
                <AlertTriangle size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Confirm Deletion</h3>
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                You are about to remove <span className="text-rose-600 font-black">"{itemToDelete?.name}"</span> from the global taxonomy.
              </p>
            </div>
            <div className="p-8 bg-slate-50 flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:shadow-md">Keep Entry</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-200 transition-all hover:bg-rose-700">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterManagement;
//****************************************************working code phase 1 21/02/26************************************************************ */
// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Zap, 
//   Trash2, 
//   Plus, 
//   Search, 
//   GraduationCap, 
//   Briefcase, 
//   Layers, 
//   AlertTriangle,
//   Loader2,
//   CheckCircle2
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const MasterManagement = () => {
//   const [activeTab, setActiveTab] = useState('skills'); // skills, educations, industries
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
  
//   // Create State
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [newValue, setNewValue] = useState("");
  
//   // Delete State
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   const tabs = [
//     { id: 'skills', label: 'Skills', icon: <Zap size={14} /> },
//     { id: 'educations', label: 'Educations', icon: <GraduationCap size={14} /> },
//     { id: 'industries', label: 'Industries', icon: <Layers size={14} /> },
//   ];

// //   const fetchMasters = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch(`https://apihrr.goelectronix.co.in/masters?types=${activeTab}&skip=0&limit=100`);
// //       const result = await response.json();
// //       // Filter result based on the type since the API might return mixed data
// //     //   setData(result.filter(item => item.type === activeTab));
// //     setData(result?.skill);
// //     } catch (error) {
// //       toast.error("Failed to load records");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// const fetchMasters = async () => {
//     setLoading(true);
//     try {
//       // The types param determines what the API returns
//       const response = await fetch(`https://apihrr.goelectronix.co.in/masters?types=${activeTab}&skip=0&limit=100`);
//       const result = await response.json();
      
//       /** * DYNAMIC KEY MAPPING:
//        * The API returns keys based on the type:
//        * 'skills' -> result.skills
//        * 'educations' -> result.educations
//        * 'industries' -> result.industries
//        */
//       const masterData = result[activeTab] || [];
      
//       setData(masterData);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       toast.error("Failed to load records");
//       setData([]); // Reset data on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMasters();
//   }, [activeTab]);

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     if (!newValue.trim()) return;

//     try {
//       const response = await fetch(`https://apihrr.goelectronix.co.in/masters/${activeTab}/bulk`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ names: [newValue.trim()] })
//       });

//       if (response.ok) {
//         toast.success(`${newValue} added to ${activeTab}`);
//         setNewValue("");
//         setIsAddModalOpen(false);
//         fetchMasters();
//       }
//     } catch (error) {
//       toast.error("Addition failed");
//     }
//   };

//   const handleDelete = async () => {
//     if (!itemToDelete) return;
//     try {
//       const response = await fetch(`https://apihrr.goelectronix.co.in/masters/${activeTab}/${itemToDelete.id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         toast.success("Entry removed successfully");
//         setIsDeleteModalOpen(false);
//         setItemToDelete(null);
//         fetchMasters();
//       }
//     } catch (error) {
//       toast.error("Delete operation failed");
//     }
//   };

//   const filteredData = useMemo(() => {
//     return data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
//   }, [data, searchQuery]);

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
      
//       {/* HEADER & TABS */}
//       <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
//         <div>
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none mb-4">
//             System Masters
//           </h2>
//           <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                   activeTab === tab.id 
//                   ? "bg-white text-blue-600 shadow-sm" 
//                   : "text-slate-500 hover:text-slate-700"
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="relative group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//             <input 
//               type="text"
//               placeholder={`Search ${activeTab}...`}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-600 w-64 transition-all shadow-sm"
//             />
//           </div>
//           <button 
//             onClick={() => setIsAddModalOpen(true)}
//             className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
//           >
//             <Plus size={14} /> Add Entry
//           </button>
//         </div>
//       </div>

//       {/* DATA GRID */}
//       <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm relative min-h-[400px]">
//         {loading ? (
//           <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
//             <Loader2 className="animate-spin text-blue-600" size={32} />
//           </div>
//         ) : filteredData.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
//             {filteredData.map((item) => (
//               <div key={item.id} className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-white transition-all shadow-sm">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
//                     {activeTab === 'skills' && <Zap size={14} />}
//                     {activeTab === 'educations' && <GraduationCap size={14} />}
//                     {activeTab === 'industries' && <Layers size={14} />}
//                   </div>
//                   <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{item.name}</span>
//                 </div>
//                 <button 
//                   onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }}
//                   className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="py-32 flex flex-col items-center justify-center">
//             <Layers size={48} className="text-slate-100 mb-4" />
//             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">No {activeTab} Found</p>
//           </div>
//         )}
//       </div>

//       {/* ADD MODAL */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//             <div className="px-8 py-6 border-b border-slate-100">
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Add New {activeTab.slice(0,-1)}</h3>
//             </div>
//             <form onSubmit={handleAdd} className="p-8 space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Entry Name</label>
//                 <input 
//                   autoFocus
//                   value={newValue}
//                   onChange={(e) => setNewValue(e.target.value)}
//                   placeholder={`Enter ${activeTab.slice(0,-1)} name...`}
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-600 transition-all"
//                 />
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
//                 <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">Save Entry</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
//             <div className="p-8 text-center">
//               <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <AlertTriangle size={32} />
//               </div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Confirm Deletion</h3>
//               <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase">
//                 Are you sure you want to remove <span className="text-slate-900">"{itemToDelete?.name}"</span>? This action cannot be undone.
//               </p>
//             </div>
//             <div className="p-6 bg-slate-50 flex gap-3">
//               <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-100">Cancel</button>
//               <button onClick={handleDelete} className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 transition-all hover:bg-rose-700">Delete Now</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MasterManagement;