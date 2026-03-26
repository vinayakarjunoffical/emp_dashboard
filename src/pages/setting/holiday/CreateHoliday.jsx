import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Info, Inbox, X, ShieldCheck, Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateHoliday = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Add Template');

  const [holidays, setHolidays] = useState([
    { id: 1, name: 'New Year', day: 1, month: 'Jan', year: 2026 },
    { id: 2, name: 'Republic Day', day: 26, month: 'Jan', year: 2026 },
    { id: 3, name: 'Holi', day: 15, month: 'Mar', year: 2026 },
  ]);

  const removeHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));

  // --- REVISED MODAL LOGIC (Handles both Add & Edit) ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showModalPicker, setShowModalPicker] = useState(false);
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing an existing row
  const [newHoliday, setNewHoliday] = useState({ name: '', day: 1, month: 'Jan' });

  const openAddModal = () => {
    setEditingId(null);
    setNewHoliday({ name: '', day: 1, month: 'Jan' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (holiday) => {
    setEditingId(holiday.id);
    setNewHoliday({ name: holiday.name, day: holiday.day, month: holiday.month });
    setIsAddModalOpen(true);
  };

  const handleSaveHoliday = () => {
    if (!newHoliday.name.trim()) return; // Don't save empty names
    
    if (editingId) {
      // Update existing holiday
      setHolidays(holidays.map(h => 
        h.id === editingId 
          ? { ...h, name: newHoliday.name, day: newHoliday.day, month: newHoliday.month } 
          : h
      ));
    } else {
      // Add new holiday
      const newId = Date.now();
      setHolidays([{ 
        id: newId, 
        name: newHoliday.name, 
        day: newHoliday.day, 
        month: newHoliday.month, 
        year: startCycle.year 
      }, ...holidays]);
    }
    
    // Reset and close
    setNewHoliday({ name: '', day: 1, month: 'Jan' });
    setEditingId(null);
    setIsAddModalOpen(false);
    setShowModalPicker(false);
  };


  // 🔥 Automatically forces End Date to be AFTER Start Date
  const handleStartCycleChange = (newStart) => {
    setStartCycle(newStart);

    // Convert month/year into a continuous number for easy comparison
    const startTotalMonths = newStart.year * 12 + months.indexOf(newStart.month);
    const endTotalMonths = endCycle.year * 12 + months.indexOf(endCycle.month);

    // If End Date is not strictly AFTER Start Date, push it forward by 1 month
    if (endTotalMonths <= startTotalMonths) {
      let nextMonthIndex = months.indexOf(newStart.month) + 1;
      let nextYear = newStart.year;
      
      if (nextMonthIndex > 11) {
        nextMonthIndex = 0;
        nextYear += 1;
      }
      
      setEndCycle({ month: months[nextMonthIndex], year: nextYear });
    }
  };

  const [startCycle, setStartCycle] = useState({ month: 'Jan', year: 2026 });
  const [endCycle, setEndCycle] = useState({ month: 'Dec', year: 2026 });
  const [showPicker, setShowPicker] = useState(null);

  const years = Array.from({ length: 12 }, (_, i) => 2020 + i);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const quarterCounts = holidays.reduce((acc, h) => {
    const m = h.month;
    if (['Jan', 'Feb', 'Mar'].includes(m)) acc.q1++;
    else if (['Apr', 'May', 'Jun'].includes(m)) acc.q2++;
    else if (['Jul', 'Aug', 'Sep'].includes(m)) acc.q3++;
    else acc.q4++;
    return acc;
  }, { q1: 0, q2: 0, q3: 0, q4: 0 });

  const totalHolidays = holidays.length || 1; 
  const qPct = {
    q1: (quarterCounts.q1 / totalHolidays) * 100,
    q2: (quarterCounts.q2 / totalHolidays) * 100,
    q3: (quarterCounts.q3 / totalHolidays) * 100,
    q4: (quarterCounts.q4 / totalHolidays) * 100,
  };

  const earliestHoliday = holidays.length > 0 
    ? [...holidays].sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month))[0].name 
    : "None";

  const getHolidayDate = (h) => {
    const monthIdx = months.indexOf(h.month);
    return new Date(h.year, monthIdx, h.day);
  };

  const today = new Date();

  const upcomingHolidays = holidays
    .map(h => ({ ...h, dateObj: getHolidayDate(h) }))
    .filter(h => h.dateObj >= today)
    .sort((a, b) => a.dateObj - b.dateObj);

  const nextHoliday = upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;

  const weekendHolidaysCount = holidays.filter(h => {
    const day = getHolidayDate(h).getDay();
    return day === 0 || day === 6; 
  }).length;

  const monthCounts = holidays.reduce((acc, h) => {
    acc[h.month] = (acc[h.month] || 0) + 1;
    return acc;
  }, {});
  
  const busiestMonth = Object.keys(monthCounts).length > 0 
    ? Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b)
    : "N/A";

  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-32 text-left relative">
      {/* HEADER */}
      <div className="!bg-white border-b !border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-[50]">
        <button onClick={() => navigate(-1)} className="p-1.5 !bg-transparent hover:bg-slate-50 rounded-lg !text-slate-600 cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black !text-slate-700 !capitalize tracking-tight">Create Holiday Template</h2>
      </div>

      <div className="mx-auto px-4 mt-4">
        {/* TABS */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-4 border border-slate-200">
          {['Add Template', 'Assign Staff'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => tab === 'Add Template' && setActiveTab(tab)} 
              className={`px-6 py-1.5 rounded-lg text-[10px] font-black !bg-transparent capitalize tracking-widest transition-all ${
                activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-600 cursor-not-allowed opacity-80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-visible">
          {/* TOP CARD: CONFIGURATION */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative p-5">
            <div className="mb-4">
              <h3 className="md:text-sm text-[12px] font-black !text-slate-800 !capitalize tracking-tighter">Holiday Template Details</h3>
              <p className="md:text-[10px] text-[8px] font-bold !text-slate-500 capitalize tracking-widest mt-1">Define your holiday and list of public holidays.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-visible">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black !text-slate-800 !capitalize tracking-widest ml-1">Template Name *</label>
                <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" />
              </div>
              
              {/* ANNUAL HOLIDAY PERIOD SECTION */}
              <div className="space-y-3">
                <h3 className="md:text-[12px] text-[10px] !capitalize font-semibold !text-slate-800">
                  Annual Holiday Period
                </h3>

                {/* <div className="grid grid-cols-2 gap-4">
                
                  <div className="space-y-1.5 relative">
                    <label className="text-[9px] font-medium text-slate-400 ml-1">Start Month</label>
                    <div 
                      onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')} 
                      className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all shadow-sm"
                    >
                      <span className="text-[12px] font-medium text-slate-800">
                        {startCycle.month} {startCycle.year}
                      </span>
                      <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    {showPicker === 'start' && (
                      <MonthYearPicker selected={startCycle} setSelected={setStartCycle} onClose={() => setShowPicker(null)} months={months} position="left-0" />
                    )}
                  </div>

           
                  <div className="space-y-1.5 relative">
                    <label className="text-[9px] font-medium text-slate-400 ml-1">End Month</label>
                    <div 
                      onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')} 
                      className="flex items-center justify-between w-full bg-slate-50/80 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-slate-300 transition-all"
                    >
                      <span className="text-[12px] font-medium text-slate-500">
                        {endCycle.month} {endCycle.year}
                      </span>
                      <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    {showPicker === 'end' && (
                      <MonthYearPicker selected={endCycle} setSelected={setEndCycle} onClose={() => setShowPicker(null)} months={months} position="right-0" />
                    )}
                  </div>
                </div> */}

                <div className="grid grid-cols-2 gap-4">
  {/* CYCLE START */}
  <div className="space-y-1.5 relative">
    <label className="text-[9px] font-medium !capitalize !text-slate-600 ml-1">Start Month</label>
    <div 
      onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')} 
      className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all shadow-sm"
    >
      <span className="text-[12px] font-medium text-slate-800">
        {startCycle.month} {startCycle.year}
      </span>
      <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
    </div>
    {showPicker === 'start' && (
      <MonthYearPicker 
        selected={startCycle} 
        setSelected={handleStartCycleChange} // 🔥 Updated Handler
        onClose={() => setShowPicker(null)} 
        months={months} 
        position="left-0" 
      />
    )}
  </div>

  {/* CYCLE END */}
  <div className="space-y-1.5 relative">
    <label className="text-[9px] font-medium !capitalize !text-slate-600 ml-1">End Month</label>
    <div 
      onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')} 
      className="flex items-center justify-between w-full bg-slate-50/80 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-slate-300 transition-all"
    >
      <span className="text-[12px] font-medium text-slate-500">
        {endCycle.month} {endCycle.year}
      </span>
      <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
    </div>
    {showPicker === 'end' && (
      <MonthYearPicker 
        selected={endCycle} 
        setSelected={setEndCycle} 
        onClose={() => setShowPicker(null)} 
        months={months} 
        position="right-0"
        minDate={startCycle} // 🔥 Added Restriction Prop
      />
    )}
  </div>
</div>
              </div>
            </div>
          </div>

          {/* LIST SECTION */}
          <div className="bg-white border border-slate-200 rounded-xl sm:rounded-xl shadow-sm overflow-visible relative p-4 sm:p-8 min-h-[350px]">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
              
              {/* ⬅️ LEFT COLUMN: REGISTRY INPUTS (70%) */}
              <div className="flex-1 space-y-6 lg:border-r border-b lg:border-b-0 border-slate-100 lg:pr-8 pb-4 lg:pb-0">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:gap-0">
                  <div>
                    <h4 className="text-[13px] font-black text-slate-900 capitalize tracking-tighter leading-none">Holiday List</h4>
                    <p className="text-[9px] font-bold text-slate-400 capitalize mt-2 tracking-widest">Map public holidays to the 2026 cycle</p>
                  </div>
                  <button 
                    onClick={openAddModal} 
                    className="flex items-center justify-center border-2 !border-blue-600 gap-2 px-5 py-2.5 sm:py-2.5 !bg-white !text-blue-600 rounded-xl hover:!bg-blue-50 transition-all shadow-sm active:scale-95 group w-full sm:w-auto cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-[10px] font-black capitalize tracking-widest">Add Holiday</span>
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-visible bg-white shadow-inner">
                  <div className="hidden sm:grid grid-cols-12 bg-slate-50/80 px-6 py-3 border-b border-slate-100">
                    <div className="col-span-7 text-[8px] font-black text-slate-400 capitalize tracking-[0.2em]">Holiday Name</div>
                    <div className="col-span-5 text-[8px] font-black text-slate-400 capitalize tracking-[0.2em] text-center">Calendar Date</div>
                  </div>

                  <div className="divide-y divide-slate-50">
                    {holidays.length > 0 ? (
                      holidays.map((holiday) => (
                        <div key={holiday.id} className="flex flex-col sm:grid sm:grid-cols-12 px-4 sm:px-6 py-4 gap-3 sm:gap-0 sm:items-center hover:bg-slate-50/50 transition-all group border-b sm:border-none border-slate-50 last:border-none">
                          
                          {/* 🛑 FIX: Changed input to read-only span */}
                          <div className="w-full sm:col-span-7 sm:pr-6">
                            <span className="block w-full text-[12px] sm:text-[11px] font-bold text-slate-700 capitalize tracking-tight py-1 sm:py-0">
                              {holiday.name}
                            </span>
                          </div>
                          
                          {/* 🛑 FIX: Removed date picker onClick logic, added Edit Action */}
                          <div className="w-full sm:col-span-5 flex items-center justify-between sm:justify-end gap-3">
                            <div className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-3 text-slate-600 bg-slate-50 sm:bg-slate-50/80 px-4 py-3 sm:py-2 rounded-xl border border-slate-100 sm:border-slate-100/80">
                              <Calendar size={13} className="text-slate-400" />
                              <span className="text-[10px] font-black capitalize tracking-tighter">
                                {holiday.day} {holiday.month} {holiday.year}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button onClick={() => openEditModal(holiday)} className="p-3 sm:p-2 !bg-blue-50 sm:!bg-transparent !text-blue-600 hover:!text-blue-600 rounded-xl transition-all cursor-pointer">
                                <Edit3 size={14} />
                              </button>
                              <button onClick={() => removeHoliday(holiday.id)} className="p-3 sm:p-2 !bg-rose-50 sm:!bg-transparent !text-rose-500 hover:!text-rose-600 rounded-xl transition-all cursor-pointer">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-slate-300 opacity-40">
                        <Inbox size={40} strokeWidth={1.5} />
                        <p className="text-[10px] font-black capitalize tracking-[0.2em] mt-4">Empty Holiday Data</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ➡️ RIGHT COLUMN: SUMMARY PANEL (30%) */}
              <div className="w-full lg:w-72 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                    <Info size={14} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 capitalize tracking-widest">Holiday Summary</h4>
                </div>

                <div className="bg-white rounded-[24px] border border-blue-600 p-6 !text-blue-600 relative overflow-hidden shadow-sm shadow-blue-50">
                  <Calendar className="absolute -bottom-4 -right-4 opacity-10 rotate-12" size={100} />
                  <p className="text-[9px] font-black capitalize tracking-[0.2em] text-slate-400">Total Holidays</p>
                  <div className="flex items-end gap-2 mt-1">
                    <h2 className="text-4xl font-black">{holidays.length}</h2>
                    <span className="text-[10px] font-bold text-slate-400 mb-1.5 capitalize">holidays</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <SummaryStrip 
                    label="Next Holiday" 
                    value={nextHoliday ? nextHoliday.name : "No upcoming"} 
                    color={nextHoliday ? "blue" : "slate"} 
                  />
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 px-2">
           <Info size={14} className="text-blue-600" />
           <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">
             Holidays count: <span className="text-slate-900 font-black">{holidays.length}</span>
           </p>
        </div>
      </div>

      {/* STICKY ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex justify-end gap-3 px-2">
          <button onClick={() => navigate(-1)} className="px-8 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
          <button className="px-12 py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] border border-blue-600 font-black capitalize tracking-widest shadow-sm shadow-blue-200 active:scale-95 hover:bg-blue-700 transition-all cursor-pointer">Save Template</button>
        </div>
      </div>

      {/* 🚀 ADD/EDIT HOLIDAY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsAddModalOpen(false)} 
          />
          
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-visible animate-in zoom-in-95 duration-200 flex flex-col">
            
            <div className="bg-slate-50 rounded-t-[2.5rem] px-6 sm:px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-slate-900 capitalize tracking-widest">
                    {editingId ? 'Edit Holiday' : 'Add New Holiday'}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 capitalize tracking-tight mt-0.5">
                    {editingId ? 'Update name and date' : 'Assign a name and date'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-2 hover:!bg-slate-200 rounded-full transition-colors !text-slate-400 cursor-pointer border-0 !bg-transparent"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 capitalize tracking-widest ml-1">Holiday Name *</label>
                <input 
                  type="text" 
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                  placeholder="e.g., Diwali, Christmas" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all shadow-inner" 
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 capitalize tracking-widest ml-1">Select Date *</label>
                <div 
                  onClick={() => setShowModalPicker(!showModalPicker)} 
                  className={`w-full border rounded-2xl px-4 py-3.5 flex justify-between items-center cursor-pointer transition-all ${
                    showModalPicker ? 'bg-white border-blue-400 ring-4 ring-blue-600/5' : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <span className="text-[12px] font-bold text-slate-700">
                    {newHoliday.day} {newHoliday.month}
                  </span>
                  <Calendar size={16} className={showModalPicker ? "text-blue-600" : "text-slate-400"} />
                </div>
                
                {showModalPicker && (
                  <div className="absolute -top-2 left-0 right-0 mt-2 z-[1010]">
                    <MonthDayPicker 
                      selected={newHoliday} 
                      setSelected={(val) => { 
                        setNewHoliday({...newHoliday, ...val}); 
                        setShowModalPicker(false); 
                      }} 
                      onClose={() => setShowModalPicker(false)} 
                      months={months} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-b-[2.5rem] border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="flex-1 py-3.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[10px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveHoliday} 
                disabled={!newHoliday.name.trim()}
                className="flex-1 py-3.5 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[10px] font-black capitalize tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {editingId ? 'Update Holiday' : 'Add Holiday'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


// --- INTERNAL COMPONENT: MONTH & YEAR PICKER (For Header) ---
const MonthYearPicker = ({ selected, setSelected, onClose, months, position = "left-0", minDate }) => {
  const [viewMode, setViewMode] = useState('months');
  const [viewYear, setViewYear] = useState(selected.year);
  const startYearGrid = viewYear - 4;
  const yearGrid = Array.from({ length: 12 }, (_, i) => startYearGrid + i);

  // 🔥 HELPER: Checks if a month should be disabled based on minDate
  const isMonthDisabled = (m, y) => {
    if (!minDate) return false;
    const mIdx = months.indexOf(m);
    const minIdx = months.indexOf(minDate.month);
    // Disable if year is past, or if it's the same year and the month is <= start month
    return y < minDate.year || (y === minDate.year && mIdx <= minIdx);
  };

  // 🔥 HELPER: Checks if a year should be disabled entirely
  const isYearDisabled = (y) => {
    if (!minDate) return false;
    // If the minDate is December, the whole current year is disabled for the END picker
    return y < minDate.year || (y === minDate.year && minDate.month === 'Dec');
  };

  return (
    <div className={`absolute top-[105%] ${position} w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-4 animate-in zoom-in-95 duration-200`}>
      
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear - 1) : setViewYear(viewYear - 12); }} className="p-1 !bg-transparent hover:!bg-slate-100 rounded-lg !text-slate-400 border-0 cursor-pointer">
          <ChevronLeft size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'months' ? 'years' : 'months'); }} className="px-3 !bg-transparent py-1 hover:!bg-blue-50 rounded-lg transition-colors group border-0 cursor-pointer">
          <span className="text-xs font-black text-slate-800 tracking-widest flex items-center gap-1 group-hover:text-blue-600">
            {viewMode === 'months' ? viewYear : `${yearGrid[0]} - ${yearGrid[11]}`}
            <ChevronDown size={12} className={viewMode === 'years' ? 'rotate-180' : ''} />
          </span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear + 1) : setViewYear(viewYear + 12); }} className="p-1 hover:!bg-slate-100 !bg-transparent rounded-lg !text-slate-400 border-0 cursor-pointer">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid Selection */}
      <div className="grid grid-cols-3 gap-2">
        {viewMode === 'months' ? (
          months.map((m) => {
            const disabled = isMonthDisabled(m, viewYear);
            return (
              <button 
                key={m} 
                disabled={disabled}
                onClick={(e) => { e.stopPropagation(); setSelected({ month: m, year: viewYear }); onClose(); }} 
                className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all border-0 ${
                  disabled 
                    ? 'opacity-30 cursor-not-allowed !bg-slate-50 !text-slate-400'
                    : selected.month === m && selected.year === viewYear 
                      ? '!bg-white !text-blue-600 shadow-sm border-2 border-blue-600' 
                      : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600 cursor-pointer'
                }`}
              >
                {m}
              </button>
            )
          })
        ) : (
          yearGrid.map((y) => {
            const disabled = isYearDisabled(y);
            return (
              <button 
                key={y} 
                disabled={disabled}
                onClick={(e) => { e.stopPropagation(); setViewYear(y); setViewMode('months'); }} 
                className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all border-0 ${
                  disabled
                    ? 'opacity-30 cursor-not-allowed !bg-slate-50 !text-slate-400'
                    : selected.year === y 
                      ? '!bg-white !text-blue-600 shadow-sm border border-blue-600' 
                      : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600 cursor-pointer'
                }`}
              >
                {y}
              </button>
            )
          })
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-[9px] font-black !bg-transparent !text-slate-400 capitalize tracking-widest hover:text-slate-600 border-0 cursor-pointer">
          Close
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT: MONTH & DAY ONLY PICKER (For Add/Edit Modal) ---
const MonthDayPicker = ({ selected, setSelected, onClose, months }) => {
  const [viewMode, setViewMode] = useState('months');
  const [tempMonth, setTempMonth] = useState(selected?.month || 'Jan');

  const getDaysInMonth = (month) => {
    const monthIndex = months.indexOf(month);
    // Using a leap year (2024) to ensure Feb allows 29 days just in case
    return new Date(2024, monthIndex + 1, 0).getDate();
  };

  const daysGrid = Array.from({ length: getDaysInMonth(tempMonth) }, (_, i) => i + 1);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[250] p-5 animate-in zoom-in-95 duration-200">
      
      <div className="flex items-center justify-between mb-5 px-1 border-b border-slate-50 pb-3">
        <span className="text-[9px] font-black text-slate-400 capitalize tracking-[0.2em]">
          {viewMode === 'months' ? 'Select Month' : `Select Date in ${tempMonth}`}
        </span>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:!bg-slate-50 rounded-full !text-slate-400 border-0 !bg-transparent cursor-pointer">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {viewMode === 'months' ? (
          <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
            {months.map(m => (
              <button 
                key={m} 
                onClick={(e) => { e.stopPropagation(); setTempMonth(m); setViewMode('days'); }}
                className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all border-0 cursor-pointer ${
                  tempMonth === m 
                    ? '!bg-white !text-blue-600 shadow-sm shadow-blue-200' 
                    : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-2 duration-300">
            <div className="grid grid-cols-7 gap-1">
              {daysGrid.map(d => (
                <button 
                  key={d} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelected({ month: tempMonth, day: d }); 
                  }}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all border-0 cursor-pointer ${
                    selected?.day === d && selected?.month === tempMonth 
                      ? '!bg-white !text-blue-600  shadow-sm' 
                      : '!bg-slate-50 !text-slate-700 hover:!bg-blue-50 hover:!text-blue-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setViewMode('months'); }} 
              className="mt-4 text-[8px] font-black !text-blue-600 capitalize tracking-widest flex items-center gap-1 border-0 !bg-transparent hover:underline transition-all cursor-pointer"
            >
              <ChevronLeft size={10} /> Back to Months
            </button>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="text-[9px] font-black !bg-transparent !text-slate-400 capitalize tracking-widest hover:text-slate-600 border-0 cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

const SummaryStrip = ({ label, value, color = "slate", isPeak }) => {
  const displayValue = isPeak && typeof value === 'object' 
    ? Object.entries(value).sort((a,b) => b[1] - a[1])[0][0] 
    : value;

  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100"
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${colorMap[color] || colorMap.slate}`}>
      <span className="text-[9px] font-black capitalize tracking-widest opacity-70">{label}</span>
      <span className="text-[10px] font-black capitalize">{displayValue}</span>
    </div>
  );
};

export default CreateHoliday;
//********************************************************working code phase 2 23/03/26************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Info, Inbox, X, ShieldCheck
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateHoliday = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Add Template');
//   const [showPickerId, setShowPickerId] = useState(null);

//   const [holidays, setHolidays] = useState([
//     { id: 1, name: 'New Year', day: 1, month: 'Jan', year: 2026 },
//     { id: 2, name: 'Republic Day', day: 26, month: 'Jan', year: 2026 },
//     { id: 3, name: 'Holi', day: 15, month: 'Mar', year: 2026 },
//   ]);

//   const removeHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));

//   // --- NEW MODAL LOGIC ---
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [showModalPicker, setShowModalPicker] = useState(false);
//   const [newHoliday, setNewHoliday] = useState({ name: '', day: 1, month: 'Jan' });

//   const handleSaveNewHoliday = () => {
//     if (!newHoliday.name.trim()) return; // Don't save empty names
    
//     const newId = Date.now();
//     // Add to the top of the list, injecting the current cycle year automatically
//     setHolidays([{ 
//       id: newId, 
//       name: newHoliday.name, 
//       day: newHoliday.day, 
//       month: newHoliday.month, 
//       year: startCycle.year 
//     }, ...holidays]);
    
//     // Reset and close
//     setNewHoliday({ name: '', day: 1, month: 'Jan' });
//     setIsAddModalOpen(false);
//     setShowModalPicker(false);
//   };

//   const [startCycle, setStartCycle] = useState({ month: 'Jan', year: 2026 });
//   const [endCycle, setEndCycle] = useState({ month: 'Dec', year: 2026 });
//   const [showPicker, setShowPicker] = useState(null);

//   const years = Array.from({ length: 12 }, (_, i) => 2020 + i);
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   // 1. Calculate Quarterly Distribution
//   const quarterCounts = holidays.reduce((acc, h) => {
//     const m = h.month;
//     if (['Jan', 'Feb', 'Mar'].includes(m)) acc.q1++;
//     else if (['Apr', 'May', 'Jun'].includes(m)) acc.q2++;
//     else if (['Jul', 'Aug', 'Sep'].includes(m)) acc.q3++;
//     else acc.q4++;
//     return acc;
//   }, { q1: 0, q2: 0, q3: 0, q4: 0 });

//   const totalHolidays = holidays.length || 1; // Prevent division by zero
//   const qPct = {
//     q1: (quarterCounts.q1 / totalHolidays) * 100,
//     q2: (quarterCounts.q2 / totalHolidays) * 100,
//     q3: (quarterCounts.q3 / totalHolidays) * 100,
//     q4: (quarterCounts.q4 / totalHolidays) * 100,
//   };

//   // 2. Find the Earliest Holiday name
//   const earliestHoliday = holidays.length > 0 
//     ? [...holidays].sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month))[0].name 
//     : "None";

//   // Helper to convert holiday object to JS Date
//   const getHolidayDate = (h) => {
//     const monthIdx = months.indexOf(h.month);
//     return new Date(h.year, monthIdx, h.day);
//   };

//   const today = new Date();

//   // 1. Find the Next Upcoming Holiday
//   const upcomingHolidays = holidays
//     .map(h => ({ ...h, dateObj: getHolidayDate(h) }))
//     .filter(h => h.dateObj >= today)
//     .sort((a, b) => a.dateObj - b.dateObj);

//   const nextHoliday = upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;

//   // 2. Count Weekend Holidays (Sat/Sun)
//   const weekendHolidaysCount = holidays.filter(h => {
//     const day = getHolidayDate(h).getDay();
//     return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
//   }).length;

//   // 3. Find the Month with most holidays
//   const monthCounts = holidays.reduce((acc, h) => {
//     acc[h.month] = (acc[h.month] || 0) + 1;
//     return acc;
//   }, {});
//   const busiestMonth = Object.keys(monthCounts).length > 0 
//     ? Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b)
//     : "N/A";

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left relative">
//       {/* HEADER */}
//       <div className="!bg-white border-b !border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-[50]">
//         <button onClick={() => navigate(-1)} className="p-1.5 !bg-transparent hover:bg-slate-50 rounded-lg !text-slate-400 cursor-pointer">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black text-slate-900 capitalize tracking-tight">Create Holiday Template</h2>
//       </div>

//       <div className="mx-auto px-4 mt-4">
//         {/* TABS */}
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-4 border border-slate-200">
//           {['Add Template', 'Assign Staff'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)} 
//               className={`px-6 py-1.5 rounded-lg text-[10px] font-black !bg-transparent capitalize tracking-widest transition-all ${
//                 activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-400 cursor-not-allowed opacity-60'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 gap-4 overflow-visible">
//           {/* TOP CARD: CONFIGURATION */}
//           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative p-5">
//             <div className="mb-4">
//               <h3 className="md:text-sm text-[12px] font-black text-slate-800 capitalize tracking-tighter">Holiday Template Details</h3>
//               <p className="md:text-[10px] text-[8px] font-bold text-slate-400 capitalize tracking-widest mt-1">Define your holiday and list of public holidays.</p>
//             </div>

//             <div className="grid grid-cols-1 gap-4 overflow-visible">
//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Template Name *</label>
//                 <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" />
//               </div>
              
//               {/* ANNUAL HOLIDAY PERIOD SECTION */}
//               <div className="space-y-3">
//                 <h3 className="md:text-[12px] text-[10px] font-semibold text-slate-800">
//                   Annual Holiday Period
//                 </h3>

//                 <div className="grid grid-cols-2 gap-4">
//                   {/* CYCLE START */}
//                   <div className="space-y-1.5 relative">
//                     <label className="text-[9px] font-medium text-slate-400 ml-1">Start Month</label>
//                     <div 
//                       onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')} 
//                       className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all shadow-sm"
//                     >
//                       <span className="text-[12px] font-medium text-slate-800">
//                         {startCycle.month} {startCycle.year}
//                       </span>
//                       <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
//                     </div>
//                     {showPicker === 'start' && (
//                       <MonthYearPicker selected={startCycle} setSelected={setStartCycle} onClose={() => setShowPicker(null)} months={months} position="left-0" />
//                     )}
//                   </div>

//                   {/* CYCLE END */}
//                   <div className="space-y-1.5 relative">
//                     <label className="text-[9px] font-medium text-slate-400 ml-1">End Month</label>
//                     <div 
//                       onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')} 
//                       className="flex items-center justify-between w-full bg-slate-50/80 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-slate-300 transition-all"
//                     >
//                       <span className="text-[12px] font-medium text-slate-500">
//                         {endCycle.month} {endCycle.year}
//                       </span>
//                       <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
//                     </div>
//                     {showPicker === 'end' && (
//                       <MonthYearPicker selected={endCycle} setSelected={setEndCycle} onClose={() => setShowPicker(null)} months={months} position="right-0" />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* LIST SECTION */}
//           <div className="bg-white border border-slate-200 rounded-xl sm:rounded-xl shadow-sm overflow-visible relative p-4 sm:p-8 min-h-[500px]">
//             <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
              
//               {/* ⬅️ LEFT COLUMN: REGISTRY INPUTS (70%) */}
//               <div className="flex-1 space-y-6 lg:border-r border-b lg:border-b-0 border-slate-100 lg:pr-8 pb-4 lg:pb-0">
                
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:gap-0">
//                   <div>
//                     <h4 className="text-[13px] font-black text-slate-900 capitalize tracking-tighter leading-none">Holiday List</h4>
//                     <p className="text-[9px] font-bold text-slate-400 capitalize mt-2 tracking-widest">Map public holidays to the 2026 cycle</p>
//                   </div>
//                   <button 
//                     // ✅ NEW ONCLICK: Opens Modal instead of adding blank row
//                     onClick={() => setIsAddModalOpen(true)} 
//                     className="flex items-center justify-center border-2 !border-blue-600 gap-2 px-5 py-2.5 sm:py-2.5 !bg-white !text-blue-600 rounded-xl hover:!bg-blue-50 transition-all shadow-sm active:scale-95 group w-full sm:w-auto cursor-pointer"
//                   >
//                     <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//                     <span className="text-[10px] font-black capitalize tracking-widest">Add Holiday</span>
//                   </button>
//                 </div>

//                 <div className="border border-slate-100 rounded-2xl overflow-visible bg-white shadow-inner">
//                   <div className="hidden sm:grid grid-cols-12 bg-slate-50/80 px-6 py-3 border-b border-slate-100">
//                     <div className="col-span-7 text-[8px] font-black text-slate-400 capitalize tracking-[0.2em]">Holiday Name</div>
//                     <div className="col-span-5 text-[8px] font-black text-slate-400 capitalize tracking-[0.2em] text-center">Calendar Date</div>
//                   </div>

//                   <div className="divide-y divide-slate-50">
//                     {holidays.length > 0 ? (
//                       holidays.map((holiday) => (
//                         <div key={holiday.id} className="flex flex-col sm:grid sm:grid-cols-12 px-4 sm:px-6 py-4 gap-3 sm:gap-0 sm:items-center hover:bg-slate-50/50 transition-all group relative animate-in slide-in-from-top-2 border-b sm:border-none border-slate-50 last:border-none">
                          
//                           <div className="w-full sm:col-span-7 sm:pr-6">
//                             <input 
//                               type="text" 
//                               value={holiday.name} 
//                               onChange={(e) => setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, name: e.target.value } : h))}
//                               className="w-full bg-slate-50/50 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none text-[12px] sm:text-[11px] font-bold text-slate-700 outline-none focus:text-blue-600 placeholder:text-slate-300 capitalize tracking-tight transition-colors" 
//                               placeholder="Enter Name..." 
//                             />
//                           </div>
                          
//                           <div className="w-full sm:col-span-5 relative flex items-center justify-between sm:justify-end gap-3">
//                             <div 
//                               onClick={() => setShowPickerId(showPickerId === holiday.id ? null : holiday.id)} 
//                               className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-3 text-blue-600 cursor-pointer bg-blue-50/30 hover:bg-blue-50 px-4 py-3 sm:py-2 rounded-xl border border-blue-100/50 transition-all"
//                             >
//                               <Calendar size={13} />
//                               <span className="text-[10px] font-black capitalize tracking-tighter">
//                                 {holiday.day} {holiday.month} {holiday.year}
//                               </span>
//                             </div>
                            
//                             <button onClick={() => removeHoliday(holiday.id)} className="p-3 sm:p-2 !bg-rose-50 sm:!bg-transparent !text-rose-500 sm:!text-slate-300 hover:!text-rose-500 rounded-xl transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer">
//                               <Trash2 size={14} />
//                             </button>

//                             {/* Existing Inline Picker for editing existing dates */}
//                             {showPickerId === holiday.id && (
//                               <div className="absolute top-[115%] left-0 sm:left-auto right-0 z-[200]">
//                                 <FullDatePicker 
//                                   selected={{ day: holiday.day, month: holiday.month, year: holiday.year }} 
//                                   setSelected={(val) => {
//                                     setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, ...val } : h));
//                                     setShowPickerId(null);
//                                   }} 
//                                   onClose={() => setShowPickerId(null)} 
//                                   months={months}
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="py-20 flex flex-col items-center justify-center text-slate-300 opacity-40">
//                         <Inbox size={40} strokeWidth={1.5} />
//                         <p className="text-[10px] font-black capitalize tracking-[0.2em] mt-4">Empty Holiday Data</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* ➡️ RIGHT COLUMN: SUMMARY PANEL (30%) */}
//               <div className="w-full lg:w-72 space-y-6">
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
//                     <Info size={14} strokeWidth={2.5} />
//                   </div>
//                   <h4 className="text-[11px] font-black text-slate-900 capitalize tracking-widest">Holiday Summary</h4>
//                 </div>

//                 <div className="bg-white rounded-[24px] border border-blue-600 p-6 !text-blue-600 relative overflow-hidden shadow-sm shadow-blue-50">
//                   <Calendar className="absolute -bottom-4 -right-4 opacity-10 rotate-12" size={100} />
//                   <p className="text-[9px] font-black capitalize tracking-[0.2em] text-slate-400">Total Holidays</p>
//                   <div className="flex items-end gap-2 mt-1">
//                     <h2 className="text-4xl font-black">{holidays.length}</h2>
//                     <span className="text-[10px] font-bold text-slate-400 mb-1.5 capitalize">holidays</span>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <SummaryStrip 
//                     label="Next Holiday" 
//                     value={nextHoliday ? nextHoliday.name : "No upcoming"} 
//                     color={nextHoliday ? "blue" : "slate"} 
//                   />
//                   <SummaryStrip 
//                     label="Weekend Falls" 
//                     value={`${weekendHolidaysCount} Days`} 
//                     color={weekendHolidaysCount > 0 ? "amber" : "slate"} 
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex items-center gap-2 px-2">
//            <Info size={14} className="text-blue-600" />
//            <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">
//              Holidays count: <span className="text-slate-900 font-black">{holidays.length}</span>
//            </p>
//         </div>
//       </div>

//       {/* STICKY ACTION BAR */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
//         <div className="mx-auto flex justify-end gap-3 px-2">
//           <button onClick={() => navigate(-1)} className="px-8 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
//           <button className="px-12 py-2.5 !bg-blue-600 !text-white rounded-xl text-[11px] border border-blue-600 font-black capitalize tracking-widest shadow-sm shadow-blue-200 active:scale-95 hover:bg-blue-700 transition-all cursor-pointer">Save Template</button>
//         </div>
//       </div>

//       {/* 🚀 NEW: ADD HOLIDAY MODAL */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
//           {/* Backdrop */}
//           <div 
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
//             onClick={() => setIsAddModalOpen(false)} 
//           />
          
//           {/* Modal Container */}
//           {/* 🔥 FIX 1: Changed overflow-hidden to overflow-visible so the dropdown can break out of the modal box */}
//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-visible animate-in zoom-in-95 duration-200 flex flex-col">
            
//             {/* Header */}
//             {/* 🔥 FIX 2: Added rounded-t-[2.5rem] to keep the top corners round since we removed overflow-hidden */}
//             <div className="bg-slate-50 rounded-t-[2.5rem] px-6 sm:px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm border border-blue-600">
//                   <Calendar size={18} />
//                 </div>
//                 <div>
//                   <h3 className="text-[13px] font-black text-slate-900 capitalize tracking-widest">
//                     Add New Holiday
//                   </h3>
//                   <p className="text-[9px] font-bold text-slate-400 capitalize tracking-tight mt-0.5">
//                     Assign a name and date
//                   </p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setIsAddModalOpen(false)} 
//                 className="p-2 hover:!bg-slate-200 rounded-full transition-colors !text-slate-400 cursor-pointer border-0 !bg-transparent"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Form Body */}
//             <div className="p-6 sm:p-8 space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 capitalize tracking-widest ml-1">Holiday Name *</label>
//                 <input 
//                   type="text" 
//                   value={newHoliday.name}
//                   onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
//                   placeholder="e.g., Diwali, Christmas" 
//                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all shadow-inner" 
//                 />
//               </div>

//               <div className="space-y-2 relative">
//                 <label className="text-[10px] font-black text-slate-400 capitalize tracking-widest ml-1">Select Date *</label>
//                 <div 
//                   onClick={() => setShowModalPicker(!showModalPicker)} 
//                   className={`w-full border rounded-2xl px-4 py-3.5 flex justify-between items-center cursor-pointer transition-all ${
//                     showModalPicker ? 'bg-white border-blue-400 ring-4 ring-blue-600/5' : 'bg-slate-50 border-slate-200 hover:bg-white'
//                   }`}
//                 >
//                   <span className="text-[12px] font-bold text-slate-700">
//                     {newHoliday.day} {newHoliday.month}
//                   </span>
//                   <Calendar size={16} className={showModalPicker ? "text-blue-600" : "text-slate-400"} />
//                 </div>
                
//                 {/* 🚀 NEW: MONTH & DAY ONLY PICKER */}
//                 {showModalPicker && (
//                   <div className="absolute -top-10 left-0 right-0 mt-2 z-[1010]">
//                     <MonthDayPicker 
//                       selected={newHoliday} 
//                       setSelected={(val) => { 
//                         setNewHoliday({...newHoliday, ...val}); 
//                         setShowModalPicker(false); 
//                       }} 
//                       onClose={() => setShowModalPicker(false)} 
//                       months={months} 
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer */}
//             {/* 🔥 FIX 3: Added rounded-b-[2.5rem] to keep bottom corners round */}
//             <div className="p-6 bg-slate-50 rounded-b-[2.5rem] border-t border-slate-100 flex gap-3">
//               <button 
//                 onClick={() => setIsAddModalOpen(false)} 
//                 className="flex-1 py-3.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[10px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-all cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleSaveNewHoliday} 
//                 disabled={!newHoliday.name.trim()}
//                 className="flex-1 py-3.5 !bg-white !text-blue-600 rounded-xl text-[10px] font-black border border-blue-600 capitalize tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//               >
//                 Add Holiday
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// // --- INTERNAL COMPONENT: MONTH & YEAR PICKER (For Header) ---
// const MonthYearPicker = ({ selected, setSelected, onClose, months, position = "left-0" }) => {
//   const [viewMode, setViewMode] = useState('months');
//   const [viewYear, setViewYear] = useState(selected.year);
//   const startYearGrid = viewYear - 4;
//   const yearGrid = Array.from({ length: 12 }, (_, i) => startYearGrid + i);

//   return (
//     <div className={`absolute top-[105%] ${position} w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-4 animate-in zoom-in-95 duration-200`}>
//       <div className="flex items-center justify-between mb-4 px-1">
//         <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear - 1) : setViewYear(viewYear - 12); }} className="p-1 !bg-transparent hover:!bg-slate-100 rounded-lg !text-slate-400"><ChevronLeft size={16} /></button>
//         <button onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'months' ? 'years' : 'months'); }} className="px-3 !bg-transparent py-1 hover:!bg-blue-50 rounded-lg transition-colors group">
//           <span className="text-xs font-black text-slate-800 tracking-widest flex items-center gap-1 group-hover:text-blue-600">
//             {viewMode === 'months' ? viewYear : `${yearGrid[0]} - ${yearGrid[11]}`}
//             <ChevronDown size={12} className={viewMode === 'years' ? 'rotate-180' : ''} />
//           </span>
//         </button>
//         <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear + 1) : setViewYear(viewYear + 12); }} className="p-1 hover:!bg-slate-100 !bg-transparent rounded-lg !text-slate-400"><ChevronRight size={16} /></button>
//       </div>

//       <div className="grid grid-cols-3 gap-2">
//         {viewMode === 'months' ? (
//           months.map((m) => (
//             <button key={m} onClick={(e) => { e.stopPropagation(); setSelected({ month: m, year: viewYear }); onClose(); }} className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all ${selected.month === m && selected.year === viewYear ? '!bg-white !text-blue-600 shadow-sm border-2 border-blue-600' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}>{m}</button>
//           ))
//         ) : (
//           yearGrid.map((y) => (
//             <button key={y} onClick={(e) => { e.stopPropagation(); setViewYear(y); setViewMode('months'); }} className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all ${selected.year === y ? '!bg-white !text-blue-600' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}>{y}</button>
//           ))
//         )}
//       </div>
//       <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
//         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-[9px] font-black !bg-transparent !text-slate-400 capitalize tracking-widest hover:text-slate-600 border-0 cursor-pointer">Close</button>
//       </div>
//     </div>
//   );
// };

// // --- NEW COMPONENT: MONTH & DAY ONLY PICKER (For Add Modal) ---
// // const MonthDayPicker = ({ selected, setSelected, onClose, months }) => {
// //   const [viewMode, setViewMode] = useState('months');
// //   const [tempMonth, setTempMonth] = useState(selected?.month || 'Jan');

// //   const getDaysInMonth = (month) => {
// //     const monthIndex = months.indexOf(month);
// //     // Using a leap year (2024) to ensure Feb allows 29 days just in case
// //     return new Date(2024, monthIndex + 1, 0).getDate();
// //   };

// //   const daysGrid = Array.from({ length: getDaysInMonth(tempMonth) }, (_, i) => i + 1);

// //   return (
// //     <div className="w-full bg-white border border-slate-200 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[250] p-5 animate-in zoom-in-95 duration-200">
      
// //       <div className="flex items-center justify-between mb-5 px-1 border-b border-slate-50 pb-3">
// //         <span className="text-[9px] font-black text-slate-400 capitalize tracking-[0.2em]">
// //           {viewMode === 'months' ? 'Select Month' : `Select Date in ${tempMonth}`}
// //         </span>
// //         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-slate-50 rounded-full text-slate-400 border-0 !bg-transparent cursor-pointer">
// //           <X size={14} />
// //         </button>
// //       </div>

// //       <div className="space-y-4">
// //         {viewMode === 'months' ? (
// //           <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
// //             {months.map(m => (
// //               <button 
// //                 key={m} 
// //                 onClick={(e) => { e.stopPropagation(); setTempMonth(m); setViewMode('days'); }}
// //                 className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all border-0 cursor-pointer ${
// //                   tempMonth === m 
// //                     ? '!bg-blue-600 !text-white shadow-sm shadow-blue-200' 
// //                     : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'
// //                 }`}
// //               >
// //                 {m}
// //               </button>
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="animate-in slide-in-from-right-2 duration-300">
// //             <div className="grid grid-cols-7 gap-1">
// //               {daysGrid.map(d => (
// //                 <button 
// //                   key={d} 
// //                   onClick={(e) => { 
// //                     e.stopPropagation(); 
// //                     setSelected({ month: tempMonth, day: d }); 
// //                   }}
// //                   className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all border-0 cursor-pointer ${
// //                     selected?.day === d && selected?.month === tempMonth 
// //                       ? '!bg-blue-600 !text-white shadow-sm' 
// //                       : '!bg-slate-50 !text-slate-700 hover:!bg-blue-50 hover:!text-blue-600'
// //                   }`}
// //                 >
// //                   {d}
// //                 </button>
// //               ))}
// //             </div>
// //             <button 
// //               onClick={(e) => { e.stopPropagation(); setViewMode('months'); }} 
// //               className="mt-4 text-[8px] font-black !text-blue-600 capitalize tracking-widest flex items-center gap-1 border-0 !bg-transparent hover:underline transition-all cursor-pointer"
// //             >
// //               <ChevronLeft size={10} /> Back to Months
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// const MonthDayPicker = ({ selected, setSelected, onClose, months }) => {
//   const [viewMode, setViewMode] = useState('months');
//   const [tempMonth, setTempMonth] = useState(selected?.month || 'Jan');

//   const getDaysInMonth = (month) => {
//     const monthIndex = months.indexOf(month);
//     // Using a leap year (2024) to ensure Feb allows 29 days just in case
//     return new Date(2024, monthIndex + 1, 0).getDate();
//   };

//   const daysGrid = Array.from({ length: getDaysInMonth(tempMonth) }, (_, i) => i + 1);

//   return (
//     <div className="w-full bg-white border border-slate-200 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[250] p-5 animate-in zoom-in-95 duration-200">
      
//       <div className="flex items-center justify-between mb-5 px-1 border-b border-slate-50 pb-3">
//         <span className="text-[9px] font-black text-slate-400 capitalize tracking-[0.2em]">
//           {viewMode === 'months' ? 'Select Month' : `Select Date in ${tempMonth}`}
//         </span>
//         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:!bg-slate-50 rounded-full !text-slate-400 border-0 !bg-transparent cursor-pointer">
//           <X size={14} />
//         </button>
//       </div>

//       <div className="space-y-4">
//         {viewMode === 'months' ? (
//           <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
//             {months.map(m => (
//               <button 
//                 key={m} 
//                 onClick={(e) => { e.stopPropagation(); setTempMonth(m); setViewMode('days'); }}
//                 className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all border-0 cursor-pointer ${
//                   tempMonth === m 
//                     ? '!bg-white !text-blue-600 shadow-sm shadow-blue-200' 
//                     : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'
//                 }`}
//               >
//                 {m}
//               </button>
//             ))}
//           </div>
//         ) : (
//           <div className="animate-in slide-in-from-right-2 duration-300">
//             <div className="grid grid-cols-7 gap-1">
//               {daysGrid.map(d => (
//                 <button 
//                   key={d} 
//                   onClick={(e) => { 
//                     e.stopPropagation(); 
//                     setSelected({ month: tempMonth, day: d }); 
//                   }}
//                   className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all border-0 cursor-pointer ${
//                     selected?.day === d && selected?.month === tempMonth 
//                       ? '!bg-white !text-blue-600 shadow-sm' 
//                       : '!bg-slate-50 !text-slate-700 hover:!bg-blue-50 hover:!text-blue-600'
//                   }`}
//                 >
//                   {d}
//                 </button>
//               ))}
//             </div>
//             <button 
//               onClick={(e) => { e.stopPropagation(); setViewMode('months'); }} 
//               className="mt-4 text-[8px] font-black !text-blue-600 capitalize tracking-widest flex items-center gap-1 border-0 !bg-transparent hover:underline transition-all cursor-pointer"
//             >
//               <ChevronLeft size={10} /> Back to Months
//             </button>
//           </div>
//         )}

//         {/* 🔥 NEW: Close Button Section */}
//         <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
//           <button 
//             onClick={(e) => { e.stopPropagation(); onClose(); }} 
//             className="text-[9px] font-black !bg-transparent !text-slate-400 capitalize tracking-widest hover:text-slate-600 border-0 cursor-pointer transition-colors"
//           >
//             Close
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };


// // --- INTERNAL COMPONENT: FULL DATE PICKER (For Inline Editing) ---
// const FullDatePicker = ({ selected, setSelected, onClose, months }) => {
//   const [viewMode, setViewMode] = useState('years'); 
//   const [tempDate, setTempDate] = useState({ 
//     day: selected?.day || 1, 
//     month: selected?.month || 'Jan', 
//     year: selected?.year || 2026 
//   });
  
//   const [yearGridStart, setYearGridStart] = useState(
//     Math.floor((selected?.year || 2026) / 12) * 12
//   );

//   const years = Array.from({ length: 12 }, (_, i) => yearGridStart + i);

//   const getDaysInMonth = (month, year) => {
//     const monthIndex = months.indexOf(month);
//     return new Date(year, monthIndex + 1, 0).getDate();
//   };

//   const daysGrid = Array.from({ length: getDaysInMonth(tempDate.month, tempDate.year) }, (_, i) => i + 1);

//   const nextDecade = (e) => { e.stopPropagation(); setYearGridStart(prev => prev + 12); };
//   const prevDecade = (e) => { e.stopPropagation(); setYearGridStart(prev => prev - 12); };

//   return (
//     <div className="w-[280px] bg-white border border-slate-200 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[250] p-5 animate-in zoom-in-95 duration-200">
      
//       <div className="flex items-center justify-between mb-5 px-1 border-b border-slate-50 pb-3">
//         <div className="flex items-center gap-2">
//            <span className="text-[9px] font-black text-slate-400 capitalize tracking-[0.2em]">
//              {viewMode === 'years' ? `${years[0]} - ${years[11]}` : `Select ${viewMode.slice(0, -1)}`}
//            </span>
//         </div>
        
//         <div className="flex items-center gap-1">
//           {viewMode === 'years' && (
//             <>
//               <button onClick={prevDecade} className="p-1 hover:!bg-slate-50 rounded-lg !text-slate-400 transition-colors border-0 !bg-transparent cursor-pointer">
//                 <ChevronLeft size={14} />
//               </button>
//               <button onClick={nextDecade} className="p-1 hover:!bg-slate-50 rounded-lg !text-slate-400 transition-colors border-0 !bg-transparent cursor-pointer">
//                 <ChevronRight size={14} />
//               </button>
//             </>
//           )}
//           <button onClick={onClose} className="p-1 hover:!bg-slate-50 rounded-full !text-slate-300 border-0 !bg-transparent ml-2 cursor-pointer">
//             <X size={14} />
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {viewMode === 'years' && (
//           <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
//             {years.map(y => (
//               <button 
//                 key={y} 
//                 onClick={(e) => { e.stopPropagation(); setTempDate({...tempDate, year: y}); setViewMode('months'); }}
//                 className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all border-0 cursor-pointer ${
//                   tempDate.year === y 
//                     ? '!bg-blue-600 !text-white shadow-sm shadow-blue-200' 
//                     : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'
//                 }`}
//               >
//                 {y}
//               </button>
//             ))}
//           </div>
//         )}

//         {viewMode === 'months' && (
//           <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
//             {months.map(m => (
//               <button 
//                 key={m} 
//                 onClick={(e) => { e.stopPropagation(); setTempDate({...tempDate, month: m}); setViewMode('days'); }}
//                 className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all border-0 cursor-pointer ${tempDate.month === m ? '!bg-blue-600 !text-white shadow-sm shadow-blue-200' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}
//               >
//                 {m}
//               </button>
//             ))}
//             <button onClick={(e) => { e.stopPropagation(); setViewMode('years'); }} className="col-span-3 mt-2 text-[8px] font-black !text-blue-600 capitalize tracking-widest border-0 !bg-transparent hover:underline transition-all cursor-pointer">
//               ← Change Year
//             </button>
//           </div>
//         )}

//         {viewMode === 'days' && (
//           <div>
//             <div className="grid grid-cols-7 gap-1 animate-in fade-in duration-300">
//               {daysGrid.map(d => (
//                 <button 
//                   key={d} 
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     const final = { ...tempDate, day: d };
//                     setSelected(final);
//                   }}
//                   className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all border-0 cursor-pointer ${tempDate.day === d ? '!bg-blue-600 !text-white shadow-sm' : '!bg-slate-50 !text-slate-700 hover:!bg-blue-50 hover:!text-blue-600'}`}
//                 >
//                   {d}
//                 </button>
//               ))}
//             </div>
//             <button onClick={(e) => { e.stopPropagation(); setViewMode('months'); }} className="mt-4 text-[8px] font-black !text-blue-600 capitalize tracking-widest flex items-center gap-1 border-0 !bg-transparent hover:underline transition-all cursor-pointer">
//               <ChevronLeft size={10} /> Back to {tempDate.month}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const SummaryStrip = ({ label, value, color = "slate", isPeak }) => {
//   const displayValue = isPeak && typeof value === 'object' 
//     ? Object.entries(value).sort((a,b) => b[1] - a[1])[0][0] 
//     : value;

//   const colorMap = {
//     blue: "bg-blue-50 text-blue-600 border-blue-100",
//     emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
//     amber: "bg-amber-50 text-amber-600 border-amber-100",
//     slate: "bg-slate-50 text-slate-600 border-slate-100"
//   };

//   return (
//     <div className={`flex items-center justify-between p-3 rounded-xl border ${colorMap[color] || colorMap.slate}`}>
//       <span className="text-[9px] font-black capitalize tracking-widest opacity-70">{label}</span>
//       <span className="text-[10px] font-black capitalize">{displayValue}</span>
//     </div>
//   );
// };

// export default CreateHoliday;
//*******************************************************working code phase 1 23/03/26***************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Info, Inbox,X ,ShieldCheck
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateHoliday = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Add Template');
//   const [showPickerId, setShowPickerId] = useState(null);

//   const [holidays, setHolidays] = useState([
//     { id: 1, name: 'New Year', date: 'Jan 2026' },
//     { id: 2, name: 'Republic Day', date: 'Jan 2026' },
//     { id: 3, name: 'Holi', date: 'Mar 2026' },
//   ]);

//   const removeHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));

//   // ✅ LOGIC CHANGE: New holidays now added to the START of the array
//   const addHolidayRow = () => {
//     const newId = Date.now();
//     setHolidays([{ id: newId, name: '', date: 'Select Month' }, ...holidays]);
//     setShowPickerId(newId); // Automatically open picker for new entry
//   };

//   const [startCycle, setStartCycle] = useState({ month: 'Jan', year: 2026 });
//   const [endCycle, setEndCycle] = useState({ month: 'Dec', year: 2026 });
//   const [showPicker, setShowPicker] = useState(null);

//   const years = Array.from({ length: 12 }, (_, i) => 2020 + i);
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   // 1. Calculate Quarterly Distribution
// const quarterCounts = holidays.reduce((acc, h) => {
//   const m = h.month;
//   if (['Jan', 'Feb', 'Mar'].includes(m)) acc.q1++;
//   else if (['Apr', 'May', 'Jun'].includes(m)) acc.q2++;
//   else if (['Jul', 'Aug', 'Sep'].includes(m)) acc.q3++;
//   else acc.q4++;
//   return acc;
// }, { q1: 0, q2: 0, q3: 0, q4: 0 });

// const totalHolidays = holidays.length || 1; // Prevent division by zero
// const qPct = {
//   q1: (quarterCounts.q1 / totalHolidays) * 100,
//   q2: (quarterCounts.q2 / totalHolidays) * 100,
//   q3: (quarterCounts.q3 / totalHolidays) * 100,
//   q4: (quarterCounts.q4 / totalHolidays) * 100,
// };

// // 2. Find the Earliest Holiday name
// const earliestHoliday = holidays.length > 0 
//   ? [...holidays].sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month))[0].name 
//   : "None";


//   // Helper to convert holiday object to JS Date
// const getHolidayDate = (h) => {
//   const monthIdx = months.indexOf(h.month);
//   return new Date(h.year, monthIdx, h.day);
// };

// const today = new Date();

// // 1. Find the Next Upcoming Holiday
// const upcomingHolidays = holidays
//   .map(h => ({ ...h, dateObj: getHolidayDate(h) }))
//   .filter(h => h.dateObj >= today)
//   .sort((a, b) => a.dateObj - b.dateObj);

// const nextHoliday = upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;

// // 2. Count Weekend Holidays (Sat/Sun)
// const weekendHolidaysCount = holidays.filter(h => {
//   const day = getHolidayDate(h).getDay();
//   return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
// }).length;

// // 3. Find the Month with most holidays
// const monthCounts = holidays.reduce((acc, h) => {
//   acc[h.month] = (acc[h.month] || 0) + 1;
//   return acc;
// }, {});
// const busiestMonth = Object.keys(monthCounts).length > 0 
//   ? Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b)
//   : "N/A";

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left">
//       {/* HEADER */}
//       <div className="!bg-white border-b !border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-[50]">
//         <button onClick={() => navigate(-1)} className="p-1.5 !bg-transparent hover:bg-slate-50 rounded-lg !text-slate-400">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black text-slate-900 capitalize tracking-tight">Create Holiday Template</h2>
//       </div>

//       <div className=" mx-auto px-2 md:px-4 mt-4">
//         {/* TABS */}
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-4 border border-slate-200">
//           {['Add Template', 'Assign Staff'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)} 
//               className={`px-6 py-1.5 rounded-lg text-[10px] font-black !bg-transparent capitalize tracking-widest transition-all ${
//                 activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-400 cursor-not-allowed'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 gap-4 overflow-visible">
//           {/* TOP CARD: CONFIGURATION */}
//           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative p-5">
//             <div className="mb-4">
//               <h3 className="md:text-sm text-[12px] font-black text-slate-800 capitalize tracking-tighter">Holiday Template Details</h3>
//               <p className="md:text-[10px] text-[8px] font-bold text-slate-400 capitalize tracking-widest mt-1">Define your holiday and list of public holidays.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-1 gap-4 overflow-visible">
//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Template Name *</label>
//                 <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400" />
//               </div>
              
//               {/* CYCLE START */}
//               {/* <div className="space-y-1.5 relative">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Holiday Start</label>
//                 <div onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')} className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all">
//                   <span className="text-[11px] font-bold text-slate-700">{startCycle.month} {startCycle.year}</span>
//                   <Calendar size={14} className="text-slate-400" />
//                 </div>
//                 {showPicker === 'start' && (
//                   <MonthYearPicker selected={startCycle} setSelected={setStartCycle} onClose={() => setShowPicker(null)} months={months} position="left-0" />
//                 )}
//               </div>

       
//               <div className="space-y-1.5 relative">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Holiday End</label>
//                 <div onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')} className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all">
//                   <span className="text-[11px] font-bold text-slate-700">{endCycle.month} {endCycle.year}</span>
//                   <Calendar size={14} className="text-slate-400" />
//                 </div>
//                 {showPicker === 'end' && (
//                   <MonthYearPicker selected={endCycle} setSelected={setEndCycle} onClose={() => setShowPicker(null)} months={months} position="right-0" />
//                 )}
//               </div> */}

//               {/* ANNUAL HOLIDAY PERIOD SECTION */}
// <div className="space-y-3">
//   {/* Header */}
//   <h3 className="md:text-[12px] text-[10px] font-semibold text-slate-800">
//     Annual Holiday Period
//   </h3>

//   {/* 2-Column Grid for Pickers */}
//   <div className="grid grid-cols-2 gap-4">
    
//     {/* CYCLE START */}
//     <div className="space-y-1.5 relative">
//       <label className="text-[9px] font-medium text-slate-400 ml-1">
//         Start Month
//       </label>
//       <div 
//         onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')} 
//         className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all shadow-sm"
//       >
//         <span className="text-[12px] font-medium text-slate-800">
//           {startCycle.month} {startCycle.year}
//         </span>
//         <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
//       </div>
//       {showPicker === 'start' && (
//         <MonthYearPicker 
//           selected={startCycle} 
//           setSelected={setStartCycle} 
//           onClose={() => setShowPicker(null)} 
//           months={months} 
//           position="left-0" 
//         />
//       )}
//     </div>

//     {/* CYCLE END */}
//     <div className="space-y-1.5 relative">
//       <label className="text-[9px] font-medium text-slate-400 ml-1">
//         End Month
//       </label>
//       <div 
//         onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')} 
//         className="flex items-center justify-between w-full bg-slate-50/80 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-slate-300 transition-all"
//       >
//         {/* Text is slightly lighter here to match the image's greyed-out look */}
//         <span className="text-[12px] font-medium text-slate-500">
//           {endCycle.month} {endCycle.year}
//         </span>
//         <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
//       </div>
//       {showPicker === 'end' && (
//         <MonthYearPicker 
//           selected={endCycle} 
//           setSelected={setEndCycle} 
//           onClose={() => setShowPicker(null)} 
//           months={months} 
//           position="right-0" 
//         />
//       )}
//     </div>

//   </div>
// </div>
//             </div>
//           </div>

//           {/* LIST SECTION: Now much more prominent */}
//           {/* <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative p-5 min-h-[400px]">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-[11px] font-black text-slate-800 capitalize tracking-widest">Holiday List</h4>
//                 <p className="text-[9px] font-bold text-slate-400 capitalize">Recent entries shown at top</p>
//               </div>
//               <button 
//                 onClick={addHolidayRow} 
//                 className="flex items-center border border-blue-600 gap-2 px-4 py-2 !bg-white !text-blue-600 rounded-lg hover:!bg-white transition-all shadow-sm shadow-blue-100 active:scale-95"
//               >
//                 <Plus size={16} strokeWidth={3} />
//                 <span className="text-[10px] font-black capitalize tracking-widest">Add Holiday</span>
//               </button>
//             </div>

//             <div className="border border-slate-100 rounded-xl overflow-visible bg-white">
//               <div className="grid grid-cols-12 bg-slate-50/80 px-4 py-2 border-b border-slate-100">
//                 <div className="col-span-7 text-[8px] font-black text-slate-400 capitalize tracking-widest">Holiday Name</div>
//                 <div className="col-span-4 text-[8px] font-black text-slate-400 capitalize tracking-widest text-center">Date</div>
//                 <div className="col-span-1"></div>
//               </div>

//               {holidays.length > 0 ? (
//                             <div className="divide-y divide-slate-50">
//                               {holidays.map((holiday) => (
//                                 <div key={holiday.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition-all group relative overflow-visible animate-in slide-in-from-top-2">
//                                   <div className="col-span-7 pr-6">
//                                     <input 
//                                       type="text" 
//                                       value={holiday.name} 
//                                       onChange={(e) => setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, name: e.target.value } : h))}
//                                       className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none focus:text-blue-600 placeholder:text-slate-300" 
//                                       placeholder="Enter Protocol Name..." 
//                                     />
//                                   </div>
                                  
//                                   <div className="col-span-4 relative flex justify-center">
//                                     <div 
//                                       onClick={() => setShowPickerId(showPickerId === holiday.id ? null : holiday.id)} 
//                                       className="flex items-center gap-3 text-blue-600 cursor-pointer bg-blue-50/30 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100/50 transition-all group/btn"
//                                     >
//                                       <Calendar size={13} className="group-hover/btn:scale-110 transition-transform" />
//                                       <span className="text-[10px] font-black capitalize tracking-tighter">
//                                         {holiday.day} {holiday.month} {holiday.year}
//                                       </span>
//                                     </div>
              
                                 
//                                     {showPickerId === holiday.id && (
//                                       <div className="absolute top-[115%] z-[200]">
//                                         <FullDatePicker 
//                                           selected={{ day: holiday.day, month: holiday.month, year: holiday.year }} 
//                                           setSelected={(val) => {
//                                             setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, ...val } : h));
//                                             setShowPickerId(null);
//                                           }} 
//                                           onClose={() => setShowPickerId(null)} 
//                                           months={months}
//                                         />
//                                       </div>
//                                     )}
//                                   </div>
              
//                                   <div className="col-span-1 flex justify-end">
//                                     <button onClick={() => removeHoliday(holiday.id)} className="p-2 bg-white text-slate-300 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-slate-100 shadow-sm">
//                                       <Trash2 size={14} />
//                                     </button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
                       
//                             <div className="py-20 flex flex-col items-center justify-center text-slate-300">
//                               <Inbox size={48} strokeWidth={1} className="mb-4 opacity-20" />
//                               <p className="text-[10px] font-black capitalize tracking-widest">No holidays in registry</p>
//                             </div>
//                           )}
//             </div>
//           </div> */}

//           {/* 📑 HOLIDAY LIST SECTION: ENTERPRISE SPLIT */}
// {/* <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-visible relative p-8 min-h-[500px]">
//   <div className="flex flex-col lg:flex-row gap-8">
    
  
//     <div className="flex-1 space-y-6 border-r border-slate-100 pr-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h4 className="text-[13px] font-black text-slate-900 capitalize tracking-tighter leading-none">Holiday List</h4>
//           <p className="text-[9px] font-bold text-slate-400 capitalize mt-2 tracking-widest">Map public holidays to the 2026 cycle</p>
//         </div>
//         <button 
//           onClick={addHolidayRow} 
//           className="flex items-center border-2 !border-blue-600 gap-2 px-5 py-2.5 !bg-white !text-blue-600 rounded-xl hover:!bg-white hover:!text-blue-600 transition-all shadow-sm active:scale-95 group"
//         >
//           <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//           <span className="text-[10px] font-black  capitalize tracking-widest">Add Holiday</span>
//         </button>
//       </div>

//       <div className="border border-slate-100 rounded-2xl overflow-visible bg-white shadow-inner">
    
//         <div className="grid grid-cols-12 bg-slate-50/80 px-6 py-3 border-b border-slate-100">
//           <div className="col-span-7 text-[8px] font-black text-slate-400 capitalize tracking-[0.2em]">Holiday Name</div>
//           <div className="col-span-5 text-[8px] font-black text-slate-400 capitalize tracking-[0.2em] text-center">Calendar Date</div>
//         </div>

//         <div className="divide-y divide-slate-50">
//           {holidays.length > 0 ? (
//             holidays.map((holiday) => (
//               <div key={holiday.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition-all group relative animate-in slide-in-from-top-2">
//                 <div className="col-span-7 pr-6">
//                   <input 
//                     type="text" 
//                     value={holiday.name} 
//                     onChange={(e) => setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, name: e.target.value } : h))}
//                     className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none focus:text-blue-600 placeholder:text-slate-300 capitalize tracking-tight" 
//                     placeholder="Enter Name..." 
//                   />
//                 </div>
                
//                 <div className="col-span-5 relative flex items-center justify-end gap-3">
//                   <div 
//                     onClick={() => setShowPickerId(showPickerId === holiday.id ? null : holiday.id)} 
//                     className="flex items-center gap-3 text-blue-600 cursor-pointer bg-blue-50/30 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100/50 transition-all"
//                   >
//                     <Calendar size={13} />
//                     <span className="text-[10px] font-black capitalize tracking-tighter">
//                       {holiday.day} {holiday.month} {holiday.year}
//                     </span>
//                   </div>
//                   <button onClick={() => removeHoliday(holiday.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100">
//                     <Trash2 size={14} />
//                   </button>

//                   {showPickerId === holiday.id && (
//                     <div className="absolute top-[115%] right-0 z-[200]">
//                       <FullDatePicker 
//                         selected={{ day: holiday.day, month: holiday.month, year: holiday.year }} 
//                         setSelected={(val) => {
//                           setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, ...val } : h));
//                           setShowPickerId(null);
//                         }} 
//                         onClose={() => setShowPickerId(null)} 
//                         months={months}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="py-20 flex flex-col items-center justify-center text-slate-300 opacity-40">
//               <Inbox size={40} strokeWidth={1.5} />
//               <p className="text-[10px] font-black capitalize tracking-[0.2em] mt-4">Empty Holiday Data</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

   
//     <div className="w-full lg:w-72 space-y-6">
 
//       <div className="flex items-center gap-2 mb-2">
//         <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
//           <Info size={14} strokeWidth={2.5} />
//         </div>
//         <h4 className="text-[11px] font-black text-slate-900 capitalize tracking-widest">Holiday Summary</h4>
//       </div>

//       <div className="bg-white rounded-[24px] border border-blue-600 p-6 !text-blue-600 relative overflow-hidden shadow-sm shadow-slate-200">
//         <Calendar className="absolute -bottom-4 -right-4 opacity-10 rotate-12" size={100} />
//         <p className="text-[9px] font-black capitalize tracking-[0.2em] text-slate-400">Total Holidays</p>
//         <div className="flex items-end gap-2 mt-1">
//           <h2 className="text-4xl font-black">{holidays.length}</h2>
//           <span className="text-[10px] font-bold text-slate-400 mb-1.5 capitalize">holidays</span>
//         </div>
//       </div>

     

//       <div className="space-y-2">

//     <SummaryStrip 
//       label="Next Holiday" 
//       value={nextHoliday ? nextHoliday.name : "No upcoming"} 
//       color={nextHoliday ? "blue" : "slate"} 
//     />
    
  
//     <SummaryStrip 
//       label="Weekend Falls" 
//       value={`${weekendHolidaysCount} Days`} 
//       color={weekendHolidaysCount > 0 ? "amber" : "slate"} 
//     />

    
//   </div>



      
//     </div>

//   </div>
// </div> */}

// <div className="bg-white border border-slate-200 rounded-xl sm:rounded-xl shadow-sm overflow-visible relative p-4 sm:p-8 min-h-[500px]">
//   <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
    
//     {/* ⬅️ LEFT COLUMN: REGISTRY INPUTS (70%) */}
//     {/* 📱 MOBILE FIX: Changed border-r to border-b on mobile, adjusted padding */}
//     <div className="flex-1 space-y-6 lg:border-r border-b lg:border-b-0 border-slate-100 lg:pr-8 pb-4 lg:pb-0">
      
//       {/* 📱 MOBILE FIX: Flex-col on mobile, flex-row on desktop */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:gap-0">
//         <div>
//           <h4 className="text-[13px] font-black text-slate-900 capitalize tracking-tighter leading-none">Holiday List</h4>
//           <p className="text-[9px] font-bold text-slate-400 capitalize mt-2 tracking-widest">Map public holidays to the 2026 cycle</p>
//         </div>
//         <button 
//           onClick={addHolidayRow} 
//           className="flex items-center justify-center border-2 !border-blue-600 gap-2 px-5 py-2.5 sm:py-2.5 !bg-white !text-blue-600 rounded-xl hover:!bg-white hover:!text-blue-600 transition-all shadow-sm active:scale-95 group w-full sm:w-auto"
//         >
//           <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//           <span className="text-[10px] font-black capitalize tracking-widest">Add Holiday</span>
//         </button>
//       </div>

//       <div className="border border-slate-100 rounded-2xl overflow-visible bg-white shadow-inner">
//         {/* Table Header */}
//         {/* 📱 MOBILE FIX: Hide the table header on small screens */}
//         <div className="hidden sm:grid grid-cols-12 bg-slate-50/80 px-6 py-3 border-b border-slate-100">
//           <div className="col-span-7 text-[8px] font-black text-slate-400 capitalize tracking-[0.2em]">Holiday Name</div>
//           <div className="col-span-5 text-[8px] font-black text-slate-400 capitalize tracking-[0.2em] text-center">Calendar Date</div>
//         </div>

//         <div className="divide-y divide-slate-50">
//           {holidays.length > 0 ? (
//             holidays.map((holiday) => (
//               /* 📱 MOBILE FIX: Stack inputs vertically on mobile, grid on desktop */
//               <div key={holiday.id} className="flex flex-col sm:grid sm:grid-cols-12 px-4 sm:px-6 py-4 gap-3 sm:gap-0 sm:items-center hover:bg-slate-50/50 transition-all group relative animate-in slide-in-from-top-2 border-b sm:border-none border-slate-50 last:border-none">
                
//                 <div className="w-full sm:col-span-7 sm:pr-6">
//                   <input 
//                     type="text" 
//                     value={holiday.name} 
//                     onChange={(e) => setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, name: e.target.value } : h))}
//                     /* 📱 MOBILE FIX: Added a slight background & padding on mobile so it looks like a distinct input field */
//                     className="w-full bg-slate-50/50 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none text-[12px] sm:text-[11px] font-bold text-slate-700 outline-none focus:text-blue-600 placeholder:text-slate-300 capitalize tracking-tight" 
//                     placeholder="Enter Name..." 
//                   />
//                 </div>
                
//                 <div className="w-full sm:col-span-5 relative flex items-center justify-between sm:justify-end gap-3">
//                   <div 
//                     onClick={() => setShowPickerId(showPickerId === holiday.id ? null : holiday.id)} 
//                     /* 📱 MOBILE FIX: Flex-1 forces the date picker to take up remaining width on mobile */
//                     className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-3 text-blue-600 cursor-pointer bg-blue-50/30 hover:bg-blue-50 px-4 py-3 sm:py-2 rounded-xl border border-blue-100/50 transition-all"
//                   >
//                     <Calendar size={13} />
//                     <span className="text-[10px] font-black capitalize tracking-tighter">
//                       {holiday.day} {holiday.month} {holiday.year}
//                     </span>
//                   </div>
                  
//                   {/* 📱 MOBILE FIX: Opacity is always 100% on mobile because touch screens don't have "hover" */}
//                   <button onClick={() => removeHoliday(holiday.id)} className="p-3 sm:p-2 !bg-blue-50 sm:!bg-transparent !text-blue-600 sm:!text-blue-300 hover:!text-blue-600 rounded-xl transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 shrink-0">
//                     <Trash2 size={14} />
//                   </button>

//                   {showPickerId === holiday.id && (
//                     <div className="absolute top-[115%] left-0 sm:left-auto right-0 z-[200]">
//                       <FullDatePicker 
//                         selected={{ day: holiday.day, month: holiday.month, year: holiday.year }} 
//                         setSelected={(val) => {
//                           setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, ...val } : h));
//                           setShowPickerId(null);
//                         }} 
//                         onClose={() => setShowPickerId(null)} 
//                         months={months}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="py-20 flex flex-col items-center justify-center text-slate-300 opacity-40">
//               <Inbox size={40} strokeWidth={1.5} />
//               <p className="text-[10px] font-black capitalize tracking-[0.2em] mt-4">Empty Holiday Data</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* ➡️ RIGHT COLUMN: SUMMARY PANEL (30%) */}
//     <div className="w-full lg:w-72 space-y-6">
//       {/* Summary Header */}
//       <div className="flex items-center gap-2 mb-2">
//         <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
//           <Info size={14} strokeWidth={2.5} />
//         </div>
//         <h4 className="text-[11px] font-black text-slate-900 capitalize tracking-widest">Holiday Summary</h4>
//       </div>

//       {/* 🚀 TOTAL COUNT BOX */}
//       <div className="bg-white rounded-[24px] border border-blue-600 p-6 !text-blue-600 relative overflow-hidden shadow-sm shadow-slate-200">
//         <Calendar className="absolute -bottom-4 -right-4 opacity-10 rotate-12" size={100} />
//         <p className="text-[9px] font-black capitalize tracking-[0.2em] text-slate-400">Total Holidays</p>
//         <div className="flex items-end gap-2 mt-1">
//           <h2 className="text-4xl font-black">{holidays.length}</h2>
//           <span className="text-[10px] font-bold text-slate-400 mb-1.5 capitalize">holidays</span>
//         </div>
//       </div>

//       {/* 📊 HORIZONTAL INFO STRIPS */}
//       <div className="space-y-2">
//         {/* Next Event */}
//         <SummaryStrip 
//           label="Next Holiday" 
//           value={nextHoliday ? nextHoliday.name : "No upcoming"} 
//           color={nextHoliday ? "blue" : "slate"} 
//         />
        
//         {/* Weekend Alert */}
//         <SummaryStrip 
//           label="Weekend Falls" 
//           value={`${weekendHolidaysCount} Days`} 
//           color={weekendHolidaysCount > 0 ? "amber" : "slate"} 
//         />
//       </div>
      
//     </div>
//   </div>
// </div>
//         </div>

//         {/* INFO FOOTER */}
//         <div className="mt-6 flex items-center gap-2 px-2">
//            <Info size={14} className="text-blue-600" />
//            <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">
//              Holidays count: <span className="text-slate-900 font-black">{holidays.length}</span>
//            </p>
//         </div>
//       </div>

//       {/* STICKY ACTION BAR */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
//         <div className=" mx-auto flex justify-end gap-3">
//           <button onClick={() => navigate(-1)} className="px-8 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-lg text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
//           <button className="px-12 py-2.5 !bg-white !text-blue-600 rounded-lg text-[11px] border border-blue-600 font-black capitalize tracking-widest shadow-sm shadow-blue-200 active:scale-95 transition-all">Save Template</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- INTERNAL COMPONENT: MONTH & YEAR PICKER ---
// const MonthYearPicker = ({ selected, setSelected, onClose, months, position = "left-0" }) => {
//   const [viewMode, setViewMode] = useState('months');
//   const [viewYear, setViewYear] = useState(selected.year);
//   const startYearGrid = viewYear - 4;
//   const yearGrid = Array.from({ length: 12 }, (_, i) => startYearGrid + i);

//   return (
//     <div className={`absolute top-[105%] ${position} w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-4 animate-in zoom-in-95 duration-200`}>
//       <div className="flex items-center justify-between mb-4 px-1">
//         <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear - 1) : setViewYear(viewYear - 12); }} className="p-1 !bg-transparent hover:!bg-slate-100 rounded-lg !text-slate-400"><ChevronLeft size={16} /></button>
//         <button onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'months' ? 'years' : 'months'); }} className="px-3 !bg-transparent py-1 hover:!bg-blue-50 rounded-lg transition-colors group">
//           <span className="text-xs font-black text-slate-800 tracking-widest flex items-center gap-1 group-hover:text-blue-600">
//             {viewMode === 'months' ? viewYear : `${yearGrid[0]} - ${yearGrid[11]}`}
//             <ChevronDown size={12} className={viewMode === 'years' ? 'rotate-180' : ''} />
//           </span>
//         </button>
//         <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear + 1) : setViewYear(viewYear + 12); }} className="p-1 hover:!bg-slate-100 !bg-transparent rounded-lg !text-slate-400"><ChevronRight size={16} /></button>
//       </div>

//       <div className="grid grid-cols-3 gap-2">
//         {viewMode === 'months' ? (
//           months.map((m) => (
//             <button key={m} onClick={(e) => { e.stopPropagation(); setSelected({ month: m, year: viewYear }); onClose(); }} className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all ${selected.month === m && selected.year === viewYear ? '!bg-white !text-blue-600 shadow-sm border-2 border-blue-600' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}>{m}</button>
//           ))
//         ) : (
//           yearGrid.map((y) => (
//             <button key={y} onClick={(e) => { e.stopPropagation(); setViewYear(y); setViewMode('months'); }} className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all ${selected.year === y ? '!bg-white !text-blue-600' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}>{y}</button>
//           ))
//         )}
//       </div>
//       <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
//         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-[9px] font-black !bg-transparent !text-slate-400 capitalize tracking-widest hover:text-slate-600">Close</button>
//       </div>
//     </div>
//   );
// };

// const FullDatePicker = ({ selected, setSelected, onClose, months }) => {
//  const [viewMode, setViewMode] = useState('years'); 
//   // 🔥 Safety: Fallback to current date if selected values are missing
//   const [tempDate, setTempDate] = useState({ 
//     day: selected?.day || 1, 
//     month: selected?.month || 'Jan', 
//     year: selected?.year || 2026 
//   });
  
//   // 🔥 Safety: Ensure yearGridStart is always a number
//   const [yearGridStart, setYearGridStart] = useState(
//     Math.floor((selected?.year || 2026) / 12) * 12
//   );

//   // 🔥 2. Generate a dynamic 12-year grid
//   const years = Array.from({ length: 12 }, (_, i) => yearGridStart + i);

//   const getDaysInMonth = (month, year) => {
//     const monthIndex = months.indexOf(month);
//     return new Date(year, monthIndex + 1, 0).getDate();
//   };

//   const daysGrid = Array.from({ length: getDaysInMonth(tempDate.month, tempDate.year) }, (_, i) => i + 1);

//   // 🔥 3. Navigation handlers for years
//   const nextDecade = (e) => {
//     e.stopPropagation();
//     setYearGridStart(prev => prev + 12);
//   };
  
//   const prevDecade = (e) => {
//     e.stopPropagation();
//     setYearGridStart(prev => prev - 12);
//   };

//   return (
//     <div className="w-[280px] bg-white border border-slate-200 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[250] p-5 animate-in zoom-in-95 duration-200">
      
//       {/* 🧭 NAVIGATION HEADER */}
//       <div className="flex items-center justify-between mb-5 px-1 border-b border-slate-50 pb-3">
//         <div className="flex items-center gap-2">
//            {/* 🔥 Show Year Range when in year mode */}
//            <span className="text-[9px] font-black text-slate-400 capitalize tracking-[0.2em]">
//              {viewMode === 'years' ? `${years[0]} - ${years[11]}` : `Select ${viewMode.slice(0, -1)}`}
//            </span>
//         </div>
        
//         <div className="flex items-center gap-1">
//           {/* 🔥 Navigation Arrows for Year Range */}
//           {viewMode === 'years' && (
//             <>
//               <button onClick={prevDecade} className="p-1 hover:!bg-slate-50 rounded-lg !text-slate-400 transition-colors border-0 !bg-transparent">
//                 <ChevronLeft size={14} />
//               </button>
//               <button onClick={nextDecade} className="p-1 hover:!bg-slate-50 rounded-lg !text-slate-400 transition-colors border-0 !bg-transparent">
//                 <ChevronRight size={14} />
//               </button>
//             </>
//           )}
//           <button onClick={onClose} className="p-1 hover:!bg-slate-50 rounded-full !text-slate-300 border-0 !bg-transparent ml-2">
//             <X size={14} />
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {/* 📅 YEARS GRID (12 Years) */}
//         {viewMode === 'years' && (
//           <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
//             {years.map(y => (
//               <button 
//                 key={y} 
//                 onClick={() => { setTempDate({...tempDate, year: y}); setViewMode('months'); }}
//                 className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all ${
//                   tempDate.year === y 
//                     ? '!bg-white !text-blue-600 shadow-sm shadow-blue-200  border border-blue-600' 
//                     : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600  border border-slate-500'
//                 }`}
//               >
//                 {y}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* 📅 MONTHS GRID stays the same... */}
//         {viewMode === 'months' && (
//           <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
//             {months.map(m => (
//               <button 
//                 key={m} 
//                 onClick={() => { setTempDate({...tempDate, month: m}); setViewMode('days'); }}
//                 className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all ${tempDate.month === m ? '!bg-white !text-blue-600 shadow-sm shadow-blue-200' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50'}`}
//               >
//                 {m}
//               </button>
//             ))}
//             <button onClick={() => setViewMode('years')} className="col-span-3 mt-2 text-[8px] font-black !text-blue-600 capitalize tracking-widest border-0 !bg-transparent hover:underline transition-all">
//               ← Change Year
//             </button>
//           </div>
//         )}

//         {/* 📅 DAYS GRID stays the same... */}
//         {viewMode === 'days' && (
//           <div>
//             <div className="grid grid-cols-7 gap-1 animate-in fade-in duration-300">
//               {daysGrid.map(d => (
//                 <button 
//                   key={d} 
//                   onClick={() => {
//                     const final = { ...tempDate, day: d };
//                     setSelected(final);
//                   }}
//                   className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${tempDate.day === d ? '!bg-white !text-blue-600 shadow-sm' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}
//                 >
//                   {d}
//                 </button>
//               ))}
//             </div>
//             <button onClick={() => setViewMode('months')} className="mt-4 text-[8px] font-black !text-blue-600 capitalize tracking-widest flex items-center gap-1 border-0 !bg-transparent hover:underline transition-all">
//               <ChevronLeft size={10} /> Back to {tempDate.month}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const SummaryStrip = ({ label, value, color = "slate", isPeak }) => {
//   // Logic to find peak month if isPeak is true
//   const displayValue = isPeak && typeof value === 'object' 
//     ? Object.entries(value).sort((a,b) => b[1] - a[1])[0][0] 
//     : value;

//   const colorMap = {
//     blue: "bg-blue-50 text-blue-600 border-blue-100",
//     emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
//     slate: "bg-slate-50 text-slate-600 border-slate-100"
//   };

//   return (
//     <div className={`flex items-center justify-between p-3 rounded-xl border ${colorMap[color] || colorMap.slate}`}>
//       <span className="text-[9px] font-black capitalize tracking-widest opacity-70">{label}</span>
//       <span className="text-[10px] font-black capitalize">{displayValue}</span>
//     </div>
//   );
// };

// export default CreateHoliday;
//*****************************************************working code phase 1 17/03/26***************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Info, Inbox,X 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateHoliday = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Add Template');
//   const [showPickerId, setShowPickerId] = useState(null);

//   const [holidays, setHolidays] = useState([
//     { id: 1, name: 'New Year', date: 'Jan 2026' },
//     { id: 2, name: 'Republic Day', date: 'Jan 2026' },
//     { id: 3, name: 'Holi', date: 'Mar 2026' },
//   ]);

//   const removeHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));

//   // ✅ LOGIC CHANGE: New holidays now added to the START of the array
//   const addHolidayRow = () => {
//     const newId = Date.now();
//     setHolidays([{ id: newId, name: '', date: 'Select Month' }, ...holidays]);
//     setShowPickerId(newId); // Automatically open picker for new entry
//   };

//   const [startCycle, setStartCycle] = useState({ month: 'Jan', year: 2026 });
//   const [endCycle, setEndCycle] = useState({ month: 'Dec', year: 2026 });
//   const [showPicker, setShowPicker] = useState(null);

//   const years = Array.from({ length: 12 }, (_, i) => 2020 + i);
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left">
//       {/* HEADER */}
//       <div className="!bg-white border-b !border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-[50]">
//         <button onClick={() => navigate(-1)} className="p-1.5 !bg-transparent hover:bg-slate-50 rounded-lg !text-slate-400">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black text-slate-900 capitalize tracking-tight">Create Holiday Template</h2>
//       </div>

//       <div className=" mx-auto px-4 mt-6">
//         {/* TABS */}
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-6 border border-slate-200">
//           {['Add Template', 'Assign Staff'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)} 
//               className={`px-6 py-1.5 rounded-lg text-[10px] font-black !bg-transparent capitalize tracking-widest transition-all ${
//                 activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-400 cursor-not-allowed'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 gap-6 overflow-visible">
//           {/* TOP CARD: CONFIGURATION */}
//           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative p-5">
//             <div className="mb-6">
//               <h3 className="text-sm font-black text-slate-800 capitalize tracking-tighter">Holiday Template Details</h3>
//               <p className="text-[10px] font-bold text-slate-400 capitalize tracking-widest mt-1">Define your holiday and list of public holidays.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-visible">
//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Template Name *</label>
//                 <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400" />
//               </div>
              
//               {/* CYCLE START */}
//               <div className="space-y-1.5 relative">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Holiday Start</label>
//                 <div onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')} className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all">
//                   <span className="text-[11px] font-bold text-slate-700">{startCycle.month} {startCycle.year}</span>
//                   <Calendar size={14} className="text-slate-400" />
//                 </div>
//                 {showPicker === 'start' && (
//                   <MonthYearPicker selected={startCycle} setSelected={setStartCycle} onClose={() => setShowPicker(null)} months={months} position="left-0" />
//                 )}
//               </div>

//               {/* CYCLE END */}
//               <div className="space-y-1.5 relative">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Holiday End</label>
//                 <div onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')} className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all">
//                   <span className="text-[11px] font-bold text-slate-700">{endCycle.month} {endCycle.year}</span>
//                   <Calendar size={14} className="text-slate-400" />
//                 </div>
//                 {showPicker === 'end' && (
//                   <MonthYearPicker selected={endCycle} setSelected={setEndCycle} onClose={() => setShowPicker(null)} months={months} position="right-0" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* LIST SECTION: Now much more prominent */}
//           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible relative p-5 min-h-[400px]">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-[11px] font-black text-slate-800 capitalize tracking-widest">Holiday List</h4>
//                 <p className="text-[9px] font-bold text-slate-400 capitalize">Recent entries shown at top</p>
//               </div>
//               <button 
//                 onClick={addHolidayRow} 
//                 className="flex items-center border border-blue-600 gap-2 px-4 py-2 !bg-white !text-blue-600 rounded-lg hover:!bg-white transition-all shadow-sm shadow-blue-100 active:scale-95"
//               >
//                 <Plus size={16} strokeWidth={3} />
//                 <span className="text-[10px] font-black capitalize tracking-widest">Add Holiday</span>
//               </button>
//             </div>

//             <div className="border border-slate-100 rounded-xl overflow-visible bg-white">
//               <div className="grid grid-cols-12 bg-slate-50/80 px-4 py-2 border-b border-slate-100">
//                 <div className="col-span-7 text-[8px] font-black text-slate-400 capitalize tracking-widest">Holiday Name</div>
//                 <div className="col-span-4 text-[8px] font-black text-slate-400 capitalize tracking-widest text-center">Date</div>
//                 <div className="col-span-1"></div>
//               </div>

//               {/* {holidays.length > 0 ? (
//                 <div className="divide-y divide-slate-50">
//                   {holidays.map((holiday) => (
//                     <div key={holiday.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-slate-50 transition-all group relative overflow-visible animate-in slide-in-from-top-2 duration-300">
//                       <div className="col-span-7 pr-4">
//                         <input type="text" defaultValue={holiday.name} className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none focus:text-blue-600" placeholder="Enter Name" />
//                       </div>
//                       <div className="col-span-4 relative flex justify-center">
//                         <div onClick={() => setShowPickerId(showPickerId === holiday.id ? null : holiday.id)} className="flex items-center gap-2 text-blue-600 cursor-pointer bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all">
//                           <Calendar size={12} /><span className="text-[10px] font-black capitalize">{holiday.date}</span>
//                         </div>
//                         {showPickerId === holiday.id && (
//                           <div className="absolute top-[110%] z-[200]">
                            
//                             <FullDatePicker 
//                             selected={{ day: holiday.day, month: holiday.month, year: holiday.year }} 
//                             setSelected={(val) => {
//                               setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, ...val } : h));
//                               setShowPickerId(null);
//                             }} 
//                             onClose={() => setShowPickerId(null)} 
//                             months={months}
//                           />
//                           </div>
//                         )}
//                       </div>
//                       <div className="col-span-1 flex justify-end">
//                         <button onClick={() => removeHoliday(holiday.id)} className="p-1.5 !bg-transparent !text-blue-600 hover:!text-blue-600 hover:bg-white rounded-lg transition-all opacity-0 border border-blue-600 group-hover:opacity-100">
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
            
//                 <div className="py-20 flex flex-col items-center justify-center text-slate-300">
//                    <Inbox size={48} strokeWidth={1} className="mb-4 opacity-20" />
//                    <p className="text-[10px] font-black capitalize tracking-widest">No holidays added yet</p>
//                    <button onClick={addHolidayRow} className="mt-4 text-[10px] text-blue-600 font-bold capitalize underline underline-offset-4">Click to add first holiday</button>
//                 </div>
//               )} */}

//               {holidays.length > 0 ? (
//                             <div className="divide-y divide-slate-50">
//                               {holidays.map((holiday) => (
//                                 <div key={holiday.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition-all group relative overflow-visible animate-in slide-in-from-top-2">
//                                   <div className="col-span-7 pr-6">
//                                     <input 
//                                       type="text" 
//                                       value={holiday.name} 
//                                       onChange={(e) => setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, name: e.target.value } : h))}
//                                       className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none focus:text-blue-600 placeholder:text-slate-300" 
//                                       placeholder="Enter Protocol Name..." 
//                                     />
//                                   </div>
                                  
//                                   <div className="col-span-4 relative flex justify-center">
//                                     <div 
//                                       onClick={() => setShowPickerId(showPickerId === holiday.id ? null : holiday.id)} 
//                                       className="flex items-center gap-3 text-blue-600 cursor-pointer bg-blue-50/30 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100/50 transition-all group/btn"
//                                     >
//                                       <Calendar size={13} className="group-hover/btn:scale-110 transition-transform" />
//                                       <span className="text-[10px] font-black capitalize tracking-tighter">
//                                         {holiday.day} {holiday.month} {holiday.year}
//                                       </span>
//                                     </div>
              
//                                     {/* 🔥 FULL DATE, MONTH, YEAR PICKER */}
//                                     {showPickerId === holiday.id && (
//                                       <div className="absolute top-[115%] z-[200]">
//                                         <FullDatePicker 
//                                           selected={{ day: holiday.day, month: holiday.month, year: holiday.year }} 
//                                           setSelected={(val) => {
//                                             setHolidays(holidays.map(h => h.id === holiday.id ? { ...h, ...val } : h));
//                                             setShowPickerId(null);
//                                           }} 
//                                           onClose={() => setShowPickerId(null)} 
//                                           months={months}
//                                         />
//                                       </div>
//                                     )}
//                                   </div>
              
//                                   <div className="col-span-1 flex justify-end">
//                                     <button onClick={() => removeHoliday(holiday.id)} className="p-2 bg-white text-slate-300 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-slate-100 shadow-sm">
//                                       <Trash2 size={14} />
//                                     </button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             /* Empty State logic remains same */
//                             <div className="py-20 flex flex-col items-center justify-center text-slate-300">
//                               <Inbox size={48} strokeWidth={1} className="mb-4 opacity-20" />
//                               <p className="text-[10px] font-black capitalize tracking-widest">No holidays in registry</p>
//                             </div>
//                           )}
//             </div>
//           </div>
//         </div>

//         {/* INFO FOOTER */}
//         <div className="mt-6 flex items-center gap-2 px-2">
//            <Info size={14} className="text-blue-600" />
//            <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">
//              Holidays count: <span className="text-slate-900 font-black">{holidays.length}</span>
//            </p>
//         </div>
//       </div>

//       {/* STICKY ACTION BAR */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
//         <div className=" mx-auto flex justify-end gap-3">
//           <button onClick={() => navigate(-1)} className="px-8 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-lg text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
//           <button className="px-12 py-2.5 !bg-white !text-blue-600 rounded-lg text-[11px] border border-blue-600 font-black capitalize tracking-widest shadow-sm shadow-blue-200 active:scale-95 transition-all">Save Template</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- INTERNAL COMPONENT: MONTH & YEAR PICKER ---
// const MonthYearPicker = ({ selected, setSelected, onClose, months, position = "left-0" }) => {
//   const [viewMode, setViewMode] = useState('months');
//   const [viewYear, setViewYear] = useState(selected.year);
//   const startYearGrid = viewYear - 4;
//   const yearGrid = Array.from({ length: 12 }, (_, i) => startYearGrid + i);

//   return (
//     <div className={`absolute top-[105%] ${position} w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-4 animate-in zoom-in-95 duration-200`}>
//       <div className="flex items-center justify-between mb-4 px-1">
//         <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear - 1) : setViewYear(viewYear - 12); }} className="p-1 !bg-transparent hover:!bg-slate-100 rounded-lg !text-slate-400"><ChevronLeft size={16} /></button>
//         <button onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'months' ? 'years' : 'months'); }} className="px-3 !bg-transparent py-1 hover:!bg-blue-50 rounded-lg transition-colors group">
//           <span className="text-xs font-black text-slate-800 tracking-widest flex items-center gap-1 group-hover:text-blue-600">
//             {viewMode === 'months' ? viewYear : `${yearGrid[0]} - ${yearGrid[11]}`}
//             <ChevronDown size={12} className={viewMode === 'years' ? 'rotate-180' : ''} />
//           </span>
//         </button>
//         <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear + 1) : setViewYear(viewYear + 12); }} className="p-1 hover:!bg-slate-100 !bg-transparent rounded-lg !text-slate-400"><ChevronRight size={16} /></button>
//       </div>

//       <div className="grid grid-cols-3 gap-2">
//         {viewMode === 'months' ? (
//           months.map((m) => (
//             <button key={m} onClick={(e) => { e.stopPropagation(); setSelected({ month: m, year: viewYear }); onClose(); }} className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all ${selected.month === m && selected.year === viewYear ? '!bg-white !text-blue-600 shadow-sm border-2 border-blue-600' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}>{m}</button>
//           ))
//         ) : (
//           yearGrid.map((y) => (
//             <button key={y} onClick={(e) => { e.stopPropagation(); setViewYear(y); setViewMode('months'); }} className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all ${selected.year === y ? '!bg-white !text-blue-600' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}>{y}</button>
//           ))
//         )}
//       </div>
//       <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
//         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-[9px] font-black !bg-transparent !text-slate-400 capitalize tracking-widest hover:text-slate-600">Close</button>
//       </div>
//     </div>
//   );
// };

// const FullDatePicker = ({ selected, setSelected, onClose, months }) => {
//   const [viewMode, setViewMode] = useState('years'); 
//   const [tempDate, setTempDate] = useState({ ...selected });
  
//   // 🔥 1. Add state to track the starting year of the current grid view
//   // It defaults to a "block" of 12 years based on the selected year
//   const [yearGridStart, setYearGridStart] = useState(Math.floor(selected.year / 12) * 12);

//   // 🔥 2. Generate a dynamic 12-year grid
//   const years = Array.from({ length: 12 }, (_, i) => yearGridStart + i);

//   const getDaysInMonth = (month, year) => {
//     const monthIndex = months.indexOf(month);
//     return new Date(year, monthIndex + 1, 0).getDate();
//   };

//   const daysGrid = Array.from({ length: getDaysInMonth(tempDate.month, tempDate.year) }, (_, i) => i + 1);

//   // 🔥 3. Navigation handlers for years
//   const nextDecade = (e) => {
//     e.stopPropagation();
//     setYearGridStart(prev => prev + 12);
//   };
  
//   const prevDecade = (e) => {
//     e.stopPropagation();
//     setYearGridStart(prev => prev - 12);
//   };

//   return (
//     <div className="w-[280px] bg-white border border-slate-200 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[250] p-5 animate-in zoom-in-95 duration-200">
      
//       {/* 🧭 NAVIGATION HEADER */}
//       <div className="flex items-center justify-between mb-5 px-1 border-b border-slate-50 pb-3">
//         <div className="flex items-center gap-2">
//            {/* 🔥 Show Year Range when in year mode */}
//            <span className="text-[9px] font-black text-slate-400 capitalize tracking-[0.2em]">
//              {viewMode === 'years' ? `${years[0]} - ${years[11]}` : `Select ${viewMode.slice(0, -1)}`}
//            </span>
//         </div>
        
//         <div className="flex items-center gap-1">
//           {/* 🔥 Navigation Arrows for Year Range */}
//           {viewMode === 'years' && (
//             <>
//               <button onClick={prevDecade} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors border-0 bg-transparent">
//                 <ChevronLeft size={14} />
//               </button>
//               <button onClick={nextDecade} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors border-0 bg-transparent">
//                 <ChevronRight size={14} />
//               </button>
//             </>
//           )}
//           <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-full text-slate-300 border-0 bg-transparent ml-2">
//             <X size={14} />
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {/* 📅 YEARS GRID (12 Years) */}
//         {viewMode === 'years' && (
//           <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
//             {years.map(y => (
//               <button 
//                 key={y} 
//                 onClick={() => { setTempDate({...tempDate, year: y}); setViewMode('months'); }}
//                 className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all ${
//                   tempDate.year === y 
//                     ? '!bg-white !text-blue-600 shadow-sm shadow-blue-200  border border-blue-600' 
//                     : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600  border border-slate-500'
//                 }`}
//               >
//                 {y}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* 📅 MONTHS GRID stays the same... */}
//         {viewMode === 'months' && (
//           <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
//             {months.map(m => (
//               <button 
//                 key={m} 
//                 onClick={() => { setTempDate({...tempDate, month: m}); setViewMode('days'); }}
//                 className={`py-2.5 rounded-xl text-[10px] font-black capitalize transition-all ${tempDate.month === m ? '!bg-white !text-blue-600 shadow-sm shadow-blue-200' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50'}`}
//               >
//                 {m}
//               </button>
//             ))}
//             <button onClick={() => setViewMode('years')} className="col-span-3 mt-2 text-[8px] font-black !text-blue-600 capitalize tracking-widest border-0 !bg-transparent hover:underline transition-all">
//               ← Change Year
//             </button>
//           </div>
//         )}

//         {/* 📅 DAYS GRID stays the same... */}
//         {viewMode === 'days' && (
//           <div>
//             <div className="grid grid-cols-7 gap-1 animate-in fade-in duration-300">
//               {daysGrid.map(d => (
//                 <button 
//                   key={d} 
//                   onClick={() => {
//                     const final = { ...tempDate, day: d };
//                     setSelected(final);
//                   }}
//                   className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${tempDate.day === d ? '!bg-white !text-blue-600 shadow-sm' : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'}`}
//                 >
//                   {d}
//                 </button>
//               ))}
//             </div>
//             <button onClick={() => setViewMode('months')} className="mt-4 text-[8px] font-black !text-blue-600 capitalize tracking-widest flex items-center gap-1 border-0 !bg-transparent hover:underline transition-all">
//               <ChevronLeft size={10} /> Back to {tempDate.month}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateHoliday;
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
//         <h2 className="text-sm font-black text-slate-900 capitalize tracking-tight">Create Holiday Template</h2>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 mt-6">
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-6 border border-slate-200">
//           {['Add Template', 'Assign Staff'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)}
//               className={`px-6 py-1.5 rounded-lg text-[10px] font-black capitalize tracking-widest transition-all ${
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
//             <h3 className="text-sm font-black text-slate-800 capitalize tracking-tighter">Template Details</h3>
//             <p className="text-[10px] font-bold text-slate-400 capitalize tracking-widest mt-1">Define your holiday cycle and list of public holidays.</p>
//           </div>

//           <div className="p-5 space-y-6 overflow-visible">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-visible">
//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Template Name *</label>
//                 <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400" />
//               </div>
              
//               {/* ✅ Nested Grid for Start/End Cycle */}
//               <div className="grid grid-cols-2 gap-4 overflow-visible">
//                 <div className="space-y-1.5 relative">
//                   <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Cycle Start</label>
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
//                   <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Cycle End</label>
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
//                 <h4 className="text-[11px] font-black text-slate-800 capitalize tracking-widest">List of Holidays</h4>
//                 <button onClick={addHolidayRow} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all group">
//                   <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//                   <span className="text-[9px] font-black capitalize tracking-widest">Add Holiday</span>
//                 </button>
//               </div>

//              <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-visible bg-white">
//   {/* Header Row */}
//   <div className="grid grid-cols-12 bg-slate-50/50 px-4 py-2 border-b border-slate-100">
//     <div className="col-span-7 text-[8px] font-black text-slate-400 capitalize tracking-widest">Holiday Name</div>
//     <div className="col-span-4 text-[8px] font-black text-slate-400 capitalize tracking-widest">Month</div>
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
//           <span className="text-[10px] font-black capitalize whitespace-nowrap">
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
//           <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50">Cancel</button>
//           <button className="px-10 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black capitalize tracking-widest shadow-lg shadow-blue-100 active:scale-95">Save Template</button>
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
//             className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all ${
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
//         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-[9px] font-black text-slate-400 capitalize tracking-widest hover:text-slate-600">Close</button>
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
//         <h2 className="text-sm font-black text-slate-900 capitalize tracking-tight">Create Holiday Template</h2>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 mt-6">
//         {/* TABS */}
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-6 border border-slate-200">
//           {['Add Template', 'Assign Staff'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)}
//               disabled={tab === 'Assign Staff'}
//               className={`px-6 py-1.5 rounded-lg text-[10px] font-black capitalize tracking-widest transition-all ${
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
//             <h3 className="text-sm font-black text-slate-800 capitalize tracking-tighter">Template Details</h3>
//             <p className="text-[10px] font-bold text-slate-400 capitalize tracking-widest mt-1">Define your holiday cycle and list of public holidays.</p>
//           </div>

//           <div className="p-5 space-y-6">
//             {/* NAME & CYCLE GRID */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Template Name *</label>
//                 <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400" />
//               </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//  {/* 📅 START CYCLE CALENDAR INPUT */}
//               <div className="space-y-1.5 relative">
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Cycle Start</label>
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
//                 <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Cycle End</label>
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
//                 <h4 className="text-[11px] font-black text-slate-800 capitalize tracking-widest">List of Holidays</h4>
//                 <button 
//                   onClick={addHolidayRow}
//                   className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all group"
//                 >
//                   <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//                   <span className="text-[9px] font-black capitalize tracking-widest">Add Holiday</span>
//                 </button>
//               </div>

//               {/* TABLE-LIKE LIST */}
//               <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-hidden">
//                 <div className="grid grid-cols-12 bg-slate-50/50 px-4 py-2 border-b border-slate-100">
//                    <div className="col-span-7 text-[8px] font-black text-slate-400 capitalize tracking-widest">Holiday Name</div>
//                    <div className="col-span-4 text-[8px] font-black text-slate-400 capitalize tracking-widest">Date</div>
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
//                           <span className="text-[10px] font-black capitalize tracking-tighter">{holiday.date}</span>
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
//            <Info size={14} className="text-blue-600" />
//            <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">
//              Total Holidays Added: <span className="text-slate-900 font-black">{holidays.length}</span>
//            </p>
//         </div>
//       </div>

//       {/* 🛡️ FIXED FOOTER ACTIONS */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50">
//         <div className="max-w-4xl mx-auto flex justify-end gap-3 px-2">
//           <button 
//             onClick={() => navigate(-1)}
//             className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all"
//           >
//             Cancel
//           </button>
//           <button 
//             className="px-10 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black capitalize tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
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
//             className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all ${
//               selected.month === m && selected.year === viewYear
//                 ? '!bg-white !text-blue-600 shadow-md border-2 border-blue-600 shadow-blue-100'
//                 : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600'
//             }`}
//           >
//             {m}
//           </button>
//         ))}
//       </div>

//       <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
//         <button onClick={onClose} className="text-[9px] font-black text-slate-400 capitalize tracking-widest hover:text-slate-600">Close</button>
//       </div>
//     </div>
//   );
// };


// export default CreateHoliday;