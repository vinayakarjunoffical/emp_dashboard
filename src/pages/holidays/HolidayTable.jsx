import { MoreHorizontal, Download, Filter, Trash2, Edit2,Layers,ShieldCheck, Plus , ChevronDown, Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Lock, Check } from "lucide-react";
import { getHolidays, deleteHoliday, updateHoliday } from "../../services/holiday.service";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const HolidayTable = () => {
  const [holidays, setHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [editingHoliday, setEditingHoliday] = useState(null);
  
  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const deptOptions = ["All", "Engineering", "Human Resources", "Marketing", "Sales", "Finance", "Operations"];

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let result = holidays;
    if (searchTerm) {
      result = result.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (typeFilter !== "All") {
      result = result.filter(h => h.holiday_type === typeFilter);
    }
    setFilteredHolidays(result);
    setCurrentPage(1);
  }, [searchTerm, typeFilter, holidays]);

  const fetchData = async () => {
    try {
      const data = await getHolidays();
      setHolidays(data);
    } catch (err) {
      toast.error("Failed to load holidays");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateHoliday(editingHoliday.id, editingHoliday);
      toast.success("Asset Updated Successfully");
      setEditingHoliday(null);
      fetchData();
    } catch (err) {
      toast.error("Update Protocol Failed");
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHolidays.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      
      {/* 1. TABLE CONTROL HEADER */}
      <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text"
              placeholder="Search assets..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Public">Public</option>
            <option value="Regional">Regional</option>
            <option value="Restricted">Restricted</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. DATA GRID */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Holiday Identifier</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Classification</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Properties</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentItems.map((holiday) => (
              <tr key={holiday.id} className="group hover:bg-blue-50/20 transition-all cursor-default">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 tracking-tight">{holiday.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                      <Layers size={10} /> {holiday.calendar_id}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">
                    <CalendarIcon size={12} /> {holiday.date?.slice(0, 10)}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    holiday.holiday_type === 'Public' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {holiday.holiday_type}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-1.5">
                    {holiday.is_recurring && <span className="w-2 h-2 rounded-full bg-blue-500" title="Recurring" />}
                    {holiday.is_optional && <span className="w-2 h-2 rounded-full bg-slate-300" title="Optional" />}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingHoliday(holiday)} className="p-2 hover:bg-white hover:shadow-md rounded-lg text-blue-500 transition-all">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(holiday.id)} className="p-2 hover:bg-white hover:shadow-md rounded-lg text-red-400 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. PAGINATION FOOTER */}
      <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHolidays.length)} of {filteredHolidays.length} Assets
        </p>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-white transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-white transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 4. MODAL: ENTERPRISE EDIT OVERLAY */}
      {/* {editingHoliday && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Asset Configuration</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">System UID: {editingHoliday.id}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Holiday Identity</label>
                  <input 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                    value={editingHoliday.name}
                    onChange={(e) => setEditingHoliday({...editingHoliday, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Execution Date</label>
                  <input 
                    type="date"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none"
                    value={editingHoliday.date?.slice(0,10)}
                    onChange={(e) => setEditingHoliday({...editingHoliday, date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Classification</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none"
                    value={editingHoliday.holiday_type}
                    onChange={(e) => setEditingHoliday({...editingHoliday, holiday_type: e.target.value})}
                  >
                    <option value="Public">Public</option>
                    <option value="Regional">Regional</option>
                    <option value="Restricted">Restricted</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">System Context (Calendar ID)</label>
                  <div className="relative">
                    <input 
                      readOnly
                      className="w-full px-5 py-3.5 bg-slate-100/50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-400 cursor-not-allowed"
                      value={editingHoliday.calendar_id || "default_india"}
                    />
                    <Lock size={12} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                </div>

                
                <div className="col-span-2 space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Departmental Distribution</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    {deptOptions.map(dept => {
                      const active = editingHoliday.departments?.includes(dept);
                      return (
                        <button
                          key={dept}
                          onClick={() => {
                            let list = editingHoliday.departments || ["All"];
                            if(dept === "All") list = ["All"];
                            else {
                              list = list.filter(d => d !== "All");
                              list = list.includes(dept) ? list.filter(d => d !== dept) : [...list, dept];
                              if(list.length === 0) list = ["All"];
                            }
                            setEditingHoliday({...editingHoliday, departments: list});
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-1.5 ${active ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-400 border border-slate-100'}`}
                        >
                          {active && <Check size={10} />} {dept}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setEditingHoliday(null)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  onClick={handleUpdate}
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
                >
                  Apply Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {editingHoliday && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-[100] p-6">
    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
      
      {/* FIXED HEADER */}
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Asset Configuration</h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md border border-blue-100">Draft Mode</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest flex items-center gap-2">
            <span className="w-1 h-1 bg-slate-300 rounded-full" /> 
            System UID: {editingHoliday.id}
          </p>
        </div>
        <button 
          onClick={() => setEditingHoliday(null)}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
        >
          <Plus className="rotate-45" size={20} />
        </button>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        <div className="grid grid-cols-2 gap-6">
          
          {/* Holiday Name */}
          <div className="col-span-2 space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Holiday Identity</label>
            <input 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all"
              value={editingHoliday.name}
              onChange={(e) => setEditingHoliday({...editingHoliday, name: e.target.value})}
              placeholder="Enter holiday name..."
            />
          </div>

          {/* Date & Type Row */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Execution Date</label>
            <input 
              type="date"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:bg-white transition-all"
              value={editingHoliday.date?.slice(0,10)}
              onChange={(e) => setEditingHoliday({...editingHoliday, date: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Classification</label>
            <div className="relative">
              <select 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none appearance-none focus:bg-white transition-all"
                value={editingHoliday.holiday_type}
                onChange={(e) => setEditingHoliday({...editingHoliday, holiday_type: e.target.value})}
              >
                <option value="Public">Public</option>
                <option value="Regional">Regional</option>
                <option value="Restricted">Restricted</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Read-Only Calendar ID */}
          <div className="col-span-2 space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              System Context <Lock size={8} />
            </label>
            <div className="w-full px-5 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-400 flex items-center justify-between cursor-not-allowed">
              <span>{editingHoliday.calendar_id || "default_india"}</span>
              <span className="text-[8px] bg-slate-200 px-2 py-0.5 rounded text-slate-500">Immutable</span>
            </div>
          </div>

          {/* Departments */}
          <div className="col-span-2 space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Departmental Distribution</label>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[100px] content-start">
              {deptOptions.map(dept => {
                const active = editingHoliday.departments?.includes(dept);
                return (
                  <button
                    key={dept}
                    onClick={() => {
                      let list = editingHoliday.departments || ["All"];
                      if(dept === "All") list = ["All"];
                      else {
                        list = list.filter(d => d !== "All");
                        list = list.includes(dept) ? list.filter(d => d !== dept) : [...list, dept];
                        if(list.length === 0) list = ["All"];
                      }
                      setEditingHoliday({...editingHoliday, departments: list});
                    }}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-2 ${
                      active 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {active && <Check size={10} />} {dept}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2 space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Detailed Protocol Description</label>
            <textarea 
              rows="3"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:bg-white transition-all resize-none"
              value={editingHoliday.description || ""}
              onChange={(e) => setEditingHoliday({...editingHoliday, description: e.target.value})}
              placeholder="Describe the context of this holiday..."
            />
          </div>
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="p-8 border-t border-slate-50 bg-slate-50/30 shrink-0 flex items-center justify-between gap-4">
        <button 
          onClick={() => setEditingHoliday(null)}
          className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
        >
          Cancel Operation
        </button>
        <button 
          onClick={handleUpdate}
          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all active:scale-[0.98]"
        >
          Commit Changes to Database
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default HolidayTable;
//********************************************************working code phase 1******************************************************** */
// import { MoreHorizontal, Download, Filter, Trash2 , Edit2 } from "lucide-react";
// import { getHolidays, deleteHoliday , updateHoliday } from "../../services/holiday.service";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";


// const HolidayTable = () => {

//     const [holidays, setHolidays] = useState([]);
//     const [editingHoliday, setEditingHoliday] = useState(null);

    
//     useEffect(() => {
//   fetchData();
// }, []);

//     const fetchData = async () => {
//   try {
//     const data = await getHolidays();
//     setHolidays(data);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to load holidays");
//   }
// };

// const handleDelete = async (id) => {
//   if (!window.confirm("Delete this holiday?")) return;

//   try {
//     await deleteHoliday(id);
//     toast.success("Holiday Deleted");
//     fetchData(); // refresh
//   } catch (err) {
//     console.error(err);
//     toast.error("Delete failed");
//   }
// };

// // const handleUpdate = async () => {
// //   try {
// //     await updateHoliday(editingHoliday.id, {
// //       name: editingHoliday.name,
// //       date: editingHoliday.date,
// //       holiday_type: editingHoliday.holiday_type,
// //       description: editingHoliday.description,
// //       departments: editingHoliday.departments || ["All"],
// //       is_optional: editingHoliday.is_optional || false,
// //       is_recurring: editingHoliday.is_recurring || false,
// //     });

// //     toast.success("Holiday Updated");
// //     setEditingHoliday(null);
// //     fetchData();

// //   } catch (err) {
// //     console.error(err);
// //     toast.error("Update failed");
// //   }
// // };


// const handleUpdate = async () => {
//   try {
//     await updateHoliday(editingHoliday.id, {
//       name: editingHoliday.name,
//       date: editingHoliday.date,
//       holiday_type: editingHoliday.holiday_type,
//       description: editingHoliday.description,
//       departments: editingHoliday.departments || ["All"],
//       is_optional: editingHoliday.is_optional || false,
//       is_recurring: editingHoliday.is_recurring || false,
//     });

//     toast.success("Holiday Updated");
//     setEditingHoliday(null);
//     fetchData();

//   } catch (err) {
//     console.error(err);
//     toast.error("Update failed");
//   }
// };



//   return (
//     <div className="p-0">
//       <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
//             <Filter size={14} /> Filter
//           </div>
//         </div>
//         <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
//           <Download size={18} />
//         </button>
//       </div>

//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="bg-slate-50/50 border-b border-slate-100">
//             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Holiday Asset</th>
//             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Protocol</th>
//             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
//             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-50">
//           {holidays.map((holiday) => (
//             <tr key={holiday.id} className="group hover:bg-blue-50/30 transition-colors">
//               <td className="px-8 py-5">
//                 <p className="text-sm font-black text-slate-800 tracking-tight capitalize">{holiday.name}</p>
//                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{holiday.calendar_id}</p>
//               </td>
//               <td className="px-8 py-5">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-[10px] font-black text-slate-600 uppercase">
//                   {holiday.date}
//                 </div>
//               </td>
//               <td className="px-8 py-5">
//                 <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
//                   holiday.holiday_type === 'Public' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
//                 }`}>
//                   {holiday.holiday_type}
//                 </span>
//               </td>
//               <td className="px-8 py-5 text-right">
//                 {/* <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
//                   <MoreHorizontal size={18} />
//                 </button> */}
//                 <td className="px-8 py-5 text-right flex justify-end gap-2">
//    {/* EDIT */}
//   <button
//     onClick={() => setEditingHoliday(holiday)}
//     className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
//   >
//     <Edit2 size={18} />
//   </button>

//   {/* DELETE */}
//   <button
//     onClick={() => handleDelete(holiday.id)}
//     className="p-2 text-red-400 hover:text-red-600 transition-colors"
//   >
//     <Trash2 size={18} />
//   </button>
// </td>

//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>


//       {/* {editingHoliday && (
//   <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-2xl w-[420px] space-y-4 shadow-xl">

//       <h3 className="text-lg font-bold">Edit Holiday</h3>

//       <input
//         type="text"
//         value={editingHoliday.name}
//         onChange={(e) =>
//           setEditingHoliday({ ...editingHoliday, name: e.target.value })
//         }
//         className="w-full border p-2 rounded"
//         placeholder="Holiday Name"
//       />

//       <input
//         type="date"
//         value={editingHoliday.date}
//         onChange={(e) =>
//           setEditingHoliday({ ...editingHoliday, date: e.target.value })
//         }
//         className="w-full border p-2 rounded"
//       />

//       <select
//         value={editingHoliday.holiday_type}
//         onChange={(e) =>
//           setEditingHoliday({
//             ...editingHoliday,
//             holiday_type: e.target.value,
//           })
//         }
//         className="w-full border p-2 rounded"
//       >
//         <option value="Public">Public</option>
//         <option value="Regional">Regional</option>
//         <option value="Restricted">Restricted</option>
//       </select>

//       <textarea
//         value={editingHoliday.description || ""}
//         onChange={(e) =>
//           setEditingHoliday({
//             ...editingHoliday,
//             description: e.target.value,
//           })
//         }
//         className="w-full border p-2 rounded"
//         placeholder="Description"
//       />

//       <div className="flex justify-end gap-2 pt-2">
//         <button
//           onClick={() => setEditingHoliday(null)}
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleUpdate}
//           className="px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Update
//         </button>
//       </div>

//     </div>
//   </div>
// )} */}

// {editingHoliday && (
//   <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-2xl w-[520px] space-y-4 shadow-xl">

//       <h3 className="text-lg font-bold">Edit Holiday</h3>

//       {/* Holiday Name */}
//       <input
//         type="text"
//         value={editingHoliday.name}
//         onChange={(e) =>
//           setEditingHoliday({ ...editingHoliday, name: e.target.value })
//         }
//         className="w-full border p-2 rounded"
//         placeholder="Holiday Name"
//       />

//       {/* Date */}
//       <input
//         type="date"
//         value={editingHoliday.date?.slice(0,10)}
//         onChange={(e) =>
//           setEditingHoliday({ ...editingHoliday, date: e.target.value })
//         }
//         className="w-full border p-2 rounded"
//       />

//       {/* Holiday Type */}
//       <select
//         value={editingHoliday.holiday_type}
//         onChange={(e) =>
//           setEditingHoliday({
//             ...editingHoliday,
//             holiday_type: e.target.value,
//           })
//         }
//         className="w-full border p-2 rounded"
//       >
//         <option value="Public">Public</option>
//         <option value="Regional">Regional</option>
//         <option value="Restricted">Restricted</option>
//       </select>

//       {/* Calendar ID (READ ONLY) */}
//       <div>
//         <label className="text-xs font-bold text-gray-500">Calendar ID</label>
//         <input
//           type="text"
//           value="default_india"
//           readOnly
//           className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
//         />
//       </div>

//       {/* Departments Multi Select */}
//       <div>
//         <label className="text-xs font-bold text-gray-500">Departments</label>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {["All","Engineering","Human Resources","Marketing","Sales","Finance","Operations"].map(dept => {
//             const active = editingHoliday.departments?.includes(dept);
//             return (
//               <button
//                 key={dept}
//                 type="button"
//                 onClick={() => {
//                   let newDepts = editingHoliday.departments || ["All"];

//                   if (dept === "All") {
//                     newDepts = ["All"];
//                   } else {
//                     newDepts = newDepts.filter(d => d !== "All");
//                     if (newDepts.includes(dept)) {
//                       newDepts = newDepts.filter(d => d !== dept);
//                       if (newDepts.length === 0) newDepts = ["All"];
//                     } else {
//                       newDepts.push(dept);
//                     }
//                   }

//                   setEditingHoliday({ ...editingHoliday, departments: newDepts });
//                 }}
//                 className={`px-3 py-1 rounded text-xs font-bold ${
//                   active ? "bg-black text-white" : "bg-gray-100"
//                 }`}
//               >
//                 {dept}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Description */}
//       <textarea
//         value={editingHoliday.description || ""}
//         onChange={(e) =>
//           setEditingHoliday({
//             ...editingHoliday,
//             description: e.target.value,
//           })
//         }
//         className="w-full border p-2 rounded"
//         placeholder="Description"
//       />

//       {/* Optional + Recurring */}
//       <div className="flex gap-4">

//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={editingHoliday.is_optional || false}
//             onChange={(e) =>
//               setEditingHoliday({
//                 ...editingHoliday,
//                 is_optional: e.target.checked,
//               })
//             }
//           />
//           Optional
//         </label>

//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={editingHoliday.is_recurring || false}
//             onChange={(e) =>
//               setEditingHoliday({
//                 ...editingHoliday,
//                 is_recurring: e.target.checked,
//               })
//             }
//           />
//           Recurring
//         </label>

//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-2 pt-2">
//         <button
//           onClick={() => setEditingHoliday(null)}
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleUpdate}
//           className="px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Update
//         </button>
//       </div>

//     </div>
//   </div>
// )}


//     </div>
//   );
// };

// export default HolidayTable;