import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Info, Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateHoliday = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Add Template');
  const [showPickerId, setShowPickerId] = useState(null);

  const [holidays, setHolidays] = useState([
    { id: 1, name: 'New Year', date: 'Jan 2026' },
    { id: 2, name: 'Republic Day', date: 'Jan 2026' },
    { id: 3, name: 'Holi', date: 'Mar 2026' },
  ]);

  const removeHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));

  // ✅ LOGIC CHANGE: New holidays now added to the START of the array
  const addHolidayRow = () => {
    const newId = Date.now();
    setHolidays([{ id: newId, name: '', date: 'Select Month' }, ...holidays]);
    setShowPickerId(newId); // Automatically open picker for new entry
  };

  const [startCycle, setStartCycle] = useState({ month: 'Jan', year: 2026 });
  const [endCycle, setEndCycle] = useState({ month: 'Dec', year: 2026 });
  const [showPicker, setShowPicker] = useState(null);

  const years = Array.from({ length: 12 }, (_, i) => 2020 + i);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left">
      {/* HEADER */}
      <div className="!bg-white border-b !border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-[50]">
        <button onClick={() => navigate(-1)} className="p-1.5 !bg-transparent hover:bg-slate-50 rounded-lg !text-slate-400">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Holiday Template</h2>
      </div>

      <div className=" mx-auto px-4 mt-6">
        {/* TABS */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-6 border border-slate-200">
          {['Add Template', 'Assign Staff'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => tab === 'Add Template' && setActiveTab(tab)} 
              className={`px-6 py-1.5 rounded-lg text-[10px] font-black !bg-transparent uppercase tracking-widest transition-all ${
                activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-400 cursor-not-allowed'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 overflow-visible">
          {/* TOP CARD: CONFIGURATION */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative p-5">
            <div className="mb-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Holiday Template Details</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Define your holiday and list of public holidays.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-visible">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Name *</label>
                <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400" />
              </div>
              
              {/* CYCLE START */}
              <div className="space-y-1.5 relative">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Holiday Start</label>
                <div onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')} className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all">
                  <span className="text-[11px] font-bold text-slate-700">{startCycle.month} {startCycle.year}</span>
                  <Calendar size={14} className="text-slate-400" />
                </div>
                {showPicker === 'start' && (
                  <MonthYearPicker selected={startCycle} setSelected={setStartCycle} onClose={() => setShowPicker(null)} months={months} position="left-0" />
                )}
              </div>

              {/* CYCLE END */}
              <div className="space-y-1.5 relative">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Holiday End</label>
                <div onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')} className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all">
                  <span className="text-[11px] font-bold text-slate-700">{endCycle.month} {endCycle.year}</span>
                  <Calendar size={14} className="text-slate-400" />
                </div>
                {showPicker === 'end' && (
                  <MonthYearPicker selected={endCycle} setSelected={setEndCycle} onClose={() => setShowPicker(null)} months={months} position="right-0" />
                )}
              </div>
            </div>
          </div>

          {/* LIST SECTION: Now much more prominent */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative p-5 min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Holiday List</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Recent entries shown at top</p>
              </div>
              <button 
                onClick={addHolidayRow} 
                className="flex items-center border border-blue-500 gap-2 px-4 py-2 !bg-white !text-blue-500 rounded-lg hover:!bg-white transition-all shadow-sm shadow-blue-100 active:scale-95"
              >
                <Plus size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Add Holiday</span>
              </button>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-visible bg-white">
              <div className="grid grid-cols-12 bg-slate-50/80 px-4 py-2 border-b border-slate-100">
                <div className="col-span-7 text-[8px] font-black text-slate-400 uppercase tracking-widest">Holiday Name</div>
                <div className="col-span-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Month</div>
                <div className="col-span-1"></div>
              </div>

              {holidays.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {holidays.map((holiday) => (
                    <div key={holiday.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-slate-50 transition-all group relative overflow-visible animate-in slide-in-from-top-2 duration-300">
                      <div className="col-span-7 pr-4">
                        <input type="text" defaultValue={holiday.name} className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none focus:text-blue-600" placeholder="Enter Name" />
                      </div>
                      <div className="col-span-4 relative flex justify-center">
                        <div onClick={() => setShowPickerId(showPickerId === holiday.id ? null : holiday.id)} className="flex items-center gap-2 text-blue-600 cursor-pointer bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all">
                          <Calendar size={12} /><span className="text-[10px] font-black uppercase">{holiday.date}</span>
                        </div>
                        {showPickerId === holiday.id && (
                          <div className="absolute top-[110%] z-[200]">
                            <MonthYearPicker 
                              selected={{ month: holiday.date.split(' ')[0], year: parseInt(holiday.date.split(' ')[1]) || 2026 }} 
                              setSelected={(val) => {
                                setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, date: `${val.month} ${val.year}` } : h));
                                setShowPickerId(null);
                              }} 
                              onClose={() => setShowPickerId(null)} 
                              months={months}
                            />
                          </div>
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button onClick={() => removeHoliday(holiday.id)} className="p-1.5 !bg-transparent !text-blue-500 hover:!text-blue-500 hover:bg-white rounded-lg transition-all opacity-0 border border-blue-600 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* EMPTY STATE */
                <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                   <Inbox size={48} strokeWidth={1} className="mb-4 opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-widest">No holidays added yet</p>
                   <button onClick={addHolidayRow} className="mt-4 text-[10px] text-blue-500 font-bold uppercase underline underline-offset-4">Click to add first holiday</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INFO FOOTER */}
        <div className="mt-6 flex items-center gap-2 px-2">
           <Info size={14} className="text-blue-500" />
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
             Holidays count: <span className="text-slate-900 font-black">{holidays.length}</span>
           </p>
        </div>
      </div>

      {/* STICKY ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className=" mx-auto flex justify-end gap-3">
          <button onClick={() => navigate(-1)} className="px-8 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
          <button className="px-12 py-2.5 !bg-white !text-blue-500 rounded-lg text-[11px] border border-blue-500 font-black uppercase tracking-widest shadow-sm shadow-blue-200 active:scale-95 transition-all">Save Template</button>
        </div>
      </div>
    </div>
  );
};

// --- INTERNAL COMPONENT: MONTH & YEAR PICKER ---
const MonthYearPicker = ({ selected, setSelected, onClose, months, position = "left-0" }) => {
  const [viewMode, setViewMode] = useState('months');
  const [viewYear, setViewYear] = useState(selected.year);
  const startYearGrid = viewYear - 4;
  const yearGrid = Array.from({ length: 12 }, (_, i) => startYearGrid + i);

  return (
    <div className={`absolute top-[105%] ${position} w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-4 animate-in zoom-in-95 duration-200`}>
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear - 1) : setViewYear(viewYear - 12); }} className="p-1 !bg-transparent hover:!bg-slate-100 rounded-lg !text-slate-400"><ChevronLeft size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'months' ? 'years' : 'months'); }} className="px-3 !bg-transparent py-1 hover:!bg-blue-50 rounded-lg transition-colors group">
          <span className="text-xs font-black text-slate-800 tracking-widest flex items-center gap-1 group-hover:text-blue-600">
            {viewMode === 'months' ? viewYear : `${yearGrid[0]} - ${yearGrid[11]}`}
            <ChevronDown size={12} className={viewMode === 'years' ? 'rotate-180' : ''} />
          </span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear + 1) : setViewYear(viewYear + 12); }} className="p-1 hover:!bg-slate-100 !bg-transparent rounded-lg !text-slate-400"><ChevronRight size={16} /></button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {viewMode === 'months' ? (
          months.map((m) => (
            <button key={m} onClick={(e) => { e.stopPropagation(); setSelected({ month: m, year: viewYear }); onClose(); }} className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selected.month === m && selected.year === viewYear ? '!bg-white !text-blue-500 shadow-sm border-2 border-blue-600' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}>{m}</button>
          ))
        ) : (
          yearGrid.map((y) => (
            <button key={y} onClick={(e) => { e.stopPropagation(); setViewYear(y); setViewMode('months'); }} className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selected.year === y ? '!bg-white !text-blue-500' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}>{y}</button>
          ))
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-[9px] font-black !bg-transparent !text-slate-400 uppercase tracking-widest hover:text-slate-600">Close</button>
      </div>
    </div>
  );
};

export default CreateHoliday;
//************************************************working code phase 1 16/03/26**************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Info 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateHoliday = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Add Template');
//   const [showPickerId, setShowPickerId] = useState(null);

//   const [holidays, setHolidays] = useState([
//     { id: 1, name: 'New Year', date: '01 Jan 2026' },
//     { id: 2, name: 'Republic Day', date: '26 Jan 2026' },
//     { id: 3, name: 'Holi', date: '14 Mar 2026' },
//   ]);

//   const removeHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));
//   const addHolidayRow = () => setHolidays([...holidays, { id: Date.now(), name: '', date: 'Select Date' }]);

//   const [startCycle, setStartCycle] = useState({ month: 'January', year: 2026 });
//   const [endCycle, setEndCycle] = useState({ month: 'December', year: 2026 });
//   const [showPicker, setShowPicker] = useState(null);

//   const years = Array.from({ length: 10 }, (_, i) => 2021 + i);
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20 text-left">
//       <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-[100]">
//         <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-all">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Holiday Template</h2>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 mt-6">
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-6 border border-slate-200">
//           {['Add Template', 'Assign Staff'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)}
//               className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
//                 activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 cursor-not-allowed'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* ✅ Added overflow-visible to the Main Card */}
//         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative">
//           <div className="p-5 border-b border-slate-50">
//             <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Template Details</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Define your holiday cycle and list of public holidays.</p>
//           </div>

//           <div className="p-5 space-y-6 overflow-visible">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-visible">
//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Name *</label>
//                 <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400" />
//               </div>
              
//               {/* ✅ Nested Grid for Start/End Cycle */}
//               <div className="grid grid-cols-2 gap-4 overflow-visible">
//                 <div className="space-y-1.5 relative">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cycle Start</label>
//                   <div 
//                     onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')}
//                     className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all"
//                   >
//                     <span className="text-[11px] font-bold text-slate-700">{startCycle.month} {startCycle.year}</span>
//                     <Calendar size={14} className="text-slate-400" />
//                   </div>
//                   {showPicker === 'start' && (
//                     <MonthYearPicker 
//                       selected={startCycle} 
//                       setSelected={setStartCycle} 
//                       onClose={() => setShowPicker(null)} 
//                       years={years} 
//                       months={months}
//                       position="left-0"
//                     />
//                   )}
//                 </div>

//                 <div className="space-y-1.5 relative">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cycle End</label>
//                   <div 
//                     onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')}
//                     className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all"
//                   >
//                     <span className="text-[11px] font-bold text-slate-700">{endCycle.month} {endCycle.year}</span>
//                     <Calendar size={14} className="text-slate-400" />
//                   </div>
//                   {showPicker === 'end' && (
//                     <MonthYearPicker 
//                       selected={endCycle} 
//                       setSelected={setEndCycle} 
//                       onClose={() => setShowPicker(null)} 
//                       years={years} 
//                       months={months}
//                       position="right-0" 
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center justify-between px-1">
//                 <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">List of Holidays</h4>
//                 <button onClick={addHolidayRow} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all group">
//                   <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//                   <span className="text-[9px] font-black uppercase tracking-widest">Add Holiday</span>
//                 </button>
//               </div>

//              <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-visible bg-white">
//   {/* Header Row */}
//   <div className="grid grid-cols-12 bg-slate-50/50 px-4 py-2 border-b border-slate-100">
//     <div className="col-span-7 text-[8px] font-black text-slate-400 uppercase tracking-widest">Holiday Name</div>
//     <div className="col-span-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Month</div>
//     <div className="col-span-1"></div>
//   </div>

//   {/* Holiday Rows */}
//   {holidays.map((holiday) => (
//     <div key={holiday.id} className="grid grid-cols-12 px-4 py-2 items-center hover:bg-slate-50 transition-colors group relative overflow-visible">
//       {/* Name Input */}
//       <div className="col-span-7 pr-4">
//         <input 
//           type="text" 
//           defaultValue={holiday.name} 
//           className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none" 
//           placeholder="Enter Name"
//         />
//       </div>

//       {/* 📅 Month Picker Trigger */}
//       <div className="col-span-4 relative overflow-visible">
//         <div 
//           onClick={() => setShowPickerId(showPickerId === holiday.id ? null : holiday.id)}
//           className="flex items-center gap-2 text-blue-600 cursor-pointer hover:bg-blue-50 w-fit px-2 py-1 rounded-lg transition-all"
//         >
//           <Calendar size={12} />
//           <span className="text-[10px] font-black uppercase whitespace-nowrap">
//             {holiday.date || 'Select Month'}
//           </span>
//         </div>

//         {/* Individual Row Picker */}
//         {showPickerId === holiday.id && (
//           <div className="absolute top-[110%] left-0 z-[200]">
//             <MonthYearPicker 
//               selected={{ month: holiday.date.split(' ')[0], year: 2026 }} // Logic to parse existing date
//               setSelected={(val) => {
//                 const updatedHolidays = holidays.map(h => 
//                   h.id === holiday.id ? { ...h, date: `${val.month} ${val.year}` } : h
//                 );
//                 setHolidays(updatedHolidays);
//                 setShowPickerId(null);
//               }} 
//               onClose={() => setShowPickerId(null)} 
//               years={years} 
//               months={months}
//             />
//           </div>
//         )}
//       </div>

//       {/* Delete Button */}
//       <div className="col-span-1 flex justify-end">
//         <button 
//           onClick={() => removeHoliday(holiday.id)} 
//           className="p-1.5 text-slate-300 hover:text-red-500 rounded-md transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50"
//         >
//           <Trash2 size={14} />
//         </button>
//       </div>
//     </div>
//   ))}
// </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50">
//         <div className="max-w-4xl mx-auto flex justify-end gap-3 px-2">
//           <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50">Cancel</button>
//           <button className="px-10 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95">Save Template</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MonthYearPicker = ({ selected, setSelected, onClose, years, months, position = "left-0" }) => {
//   const [viewYear, setViewYear] = useState(selected.year);

//   return (
//     <div className={`absolute top-[105%] ${position} w-[240px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-4 animate-in zoom-in-95 duration-200`}>
//       <div className="flex items-center justify-between mb-4 px-1">
//         <button onClick={(e) => { e.stopPropagation(); setViewYear(viewYear - 1); }} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><ChevronLeft size={16} /></button>
//         <span className="text-xs font-black text-slate-800 tracking-widest">{viewYear}</span>
//         <button onClick={(e) => { e.stopPropagation(); setViewYear(viewYear + 1); }} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><ChevronRight size={16} /></button>
//       </div>

//       <div className="grid grid-cols-3 gap-2">
//         {months.map((m) => (
//           <button
//             key={m}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelected({ month: m, year: viewYear });
//               onClose();
//             }}
//             className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
//               selected.month === m && selected.year === viewYear
//                 ? 'bg-blue-600 text-white shadow-md border-2 border-blue-600'
//                 : 'bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
//             }`}
//           >
//             {m}
//           </button>
//         ))}
//       </div>
//       <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
//         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Close</button>
//       </div>
//     </div>
//   );
// };

// export default CreateHoliday;
//******************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Calendar, 
//   Plus, 
//   Trash2, 
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown, 
//   Info 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateHoliday = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Add Template');

//   // Initial holiday list based on image logic
//   const [holidays, setHolidays] = useState([
//     { id: 1, name: 'New Year', date: '01 Jan 2026' },
//     { id: 2, name: 'Republic Day', date: '26 Jan 2026' },
//     { id: 3, name: 'Holi', date: '14 Mar 2026' },
//   ]);

//   const removeHoliday = (id) => {
//     setHolidays(holidays.filter(h => h.id !== id));
//   };

//   const addHolidayRow = () => {
//     const newId = Date.now();
//     setHolidays([...holidays, { id: newId, name: '', date: 'Select Date' }]);
//   };

// // --- 📅 CALENDAR PICKER STATES ---
//   const [startCycle, setStartCycle] = useState({ month: 'January', year: 2026 });
//   const [endCycle, setEndCycle] = useState({ month: 'December', year: 2026 });
//   const [showPicker, setShowPicker] = useState(null); // 'start' or 'end'



//   const years = Array.from({ length: 10 }, (_, i) => 2021 + i);
//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

  

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20 text-left">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-50">
//         <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-all">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Holiday Template</h2>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 mt-6">
//         {/* TABS */}
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-6 border border-slate-200">
//           {['Add Template', 'Assign Staff'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)}
//               disabled={tab === 'Assign Staff'}
//               className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
//                 activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 cursor-not-allowed'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* MAIN CARD */}
//         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//           <div className="p-5 border-b border-slate-50">
//             <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Template Details</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Define your holiday cycle and list of public holidays.</p>
//           </div>

//           <div className="p-5 space-y-6">
//             {/* NAME & CYCLE GRID */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Name *</label>
//                 <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400" />
//               </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//  {/* 📅 START CYCLE CALENDAR INPUT */}
//               <div className="space-y-1.5 relative">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cycle Start</label>
//                 <div 
//                   onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')}
//                   className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all"
//                 >
//                   <span className="text-[11px] font-bold text-slate-700">{startCycle.month} {startCycle.year}</span>
//                   <Calendar size={14} className="text-slate-400" />
//                 </div>
//                 {showPicker === 'start' && (
//                   <MonthYearPicker 
//                     selected={startCycle} 
//                     setSelected={setStartCycle} 
//                     onClose={() => setShowPicker(null)} 
//                     years={years} 
//                     months={months} 
//                   />
//                 )}
//               </div>

//               {/* 📅 END CYCLE CALENDAR INPUT */}
//               <div className="space-y-1.5 relative">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cycle End</label>
//                 <div 
//                   onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')}
//                   className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all"
//                 >
//                   <span className="text-[11px] font-bold text-slate-700">{endCycle.month} {endCycle.year}</span>
//                   <Calendar size={14} className="text-slate-400" />
//                 </div>
//                 {showPicker === 'end' && (
//                   <MonthYearPicker 
//                     selected={endCycle} 
//                     setSelected={setEndCycle} 
//                     onClose={() => setShowPicker(null)} 
//                     years={years} 
//                     months={months} 
//                   />
//                 )}
//               </div>
// </div>
//             </div>

//             {/* HOLIDAY LIST SECTION */}
//             <div className="space-y-3">
//               <div className="flex items-center justify-between px-1">
//                 <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">List of Holidays</h4>
//                 <button 
//                   onClick={addHolidayRow}
//                   className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all group"
//                 >
//                   <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//                   <span className="text-[9px] font-black uppercase tracking-widest">Add Holiday</span>
//                 </button>
//               </div>

//               {/* TABLE-LIKE LIST */}
//               <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-hidden">
//                 <div className="grid grid-cols-12 bg-slate-50/50 px-4 py-2 border-b border-slate-100">
//                    <div className="col-span-7 text-[8px] font-black text-slate-400 uppercase tracking-widest">Holiday Name</div>
//                    <div className="col-span-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Date</div>
//                    <div className="col-span-1"></div>
//                 </div>

//                 <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
//                   {holidays.map((holiday) => (
//                     <div key={holiday.id} className="grid grid-cols-12 px-4 py-2 items-center hover:bg-slate-50 transition-colors group">
//                       <div className="col-span-7 pr-4">
//                         <input 
//                           type="text" 
//                           defaultValue={holiday.name}
//                           placeholder="Enter holiday name"
//                           className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none placeholder:text-slate-300"
//                         />
//                       </div>
//                       <div className="col-span-4">
//                         <div className="flex items-center gap-2 text-blue-600 cursor-pointer">
//                           <Calendar size={12} />
//                           <span className="text-[10px] font-black uppercase tracking-tighter">{holiday.date}</span>
//                         </div>
//                       </div>
//                       <div className="col-span-1 flex justify-end">
//                         <button 
//                           onClick={() => removeHoliday(holiday.id)}
//                           className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🛡️ FOOTER STATS INFO */}
//         <div className="mt-4 flex items-center gap-2 px-2">
//            <Info size={14} className="text-blue-500" />
//            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
//              Total Holidays Added: <span className="text-slate-900 font-black">{holidays.length}</span>
//            </p>
//         </div>
//       </div>

//       {/* 🛡️ FIXED FOOTER ACTIONS */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50">
//         <div className="max-w-4xl mx-auto flex justify-end gap-3 px-2">
//           <button 
//             onClick={() => navigate(-1)}
//             className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
//           >
//             Cancel
//           </button>
//           <button 
//             className="px-10 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
//           >
//             Save Template
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- 🛡️ INTERNAL COMPONENT: MONTH YEAR CALENDAR PICKER ---
// const MonthYearPicker = ({ selected, setSelected, onClose, years, months }) => {
//   const [viewYear, setViewYear] = useState(selected.year);

//   return (
//     <div className="absolute top-[110%] left-0 w-[240px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[80] p-4 animate-in zoom-in-95 duration-200">
//       {/* Year Selector Header */}
//       <div className="flex items-center justify-between mb-4 px-1">
//         <button onClick={() => setViewYear(viewYear - 1)} className="p-1 hover:!bg-slate-200 !bg-transparent rounded-lg !text-slate-400"><ChevronLeft size={16} /></button>
//         <span className="text-xs font-black text-slate-800 tracking-widest">{viewYear}</span>
//         <button onClick={() => setViewYear(viewYear + 1)} className="p-1 hover:!bg-slate-200 !bg-transparent rounded-lg !text-slate-400"><ChevronRight size={16} /></button>
//       </div>

//       {/* Month Grid */}
//       <div className="grid grid-cols-3 gap-2">
//         {months.map((m) => (
//           <button
//             key={m}
//             onClick={() => {
//               setSelected({ month: m, year: viewYear });
//               onClose();
//             }}
//             className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
//               selected.month === m && selected.year === viewYear
//                 ? '!bg-white !text-blue-500 shadow-md border-2 border-blue-500 shadow-blue-100'
//                 : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'
//             }`}
//           >
//             {m}
//           </button>
//         ))}
//       </div>

//       <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
//         <button onClick={onClose} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Close</button>
//       </div>
//     </div>
//   );
// };


// export default CreateHoliday;