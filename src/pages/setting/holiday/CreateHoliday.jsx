import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Info, Inbox, X, Edit3, Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const CreateHoliday = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState('Add Template');

  const isEditMode = Boolean(id); 
  const [isPageLoading, setIsPageLoading] = useState(isEditMode); 
  const [isSaving, setIsSaving] = useState(false); // 🚀 Added save loading state
   
  const [templateName, setTemplateName] = useState(''); 
  const [description, setDescription] = useState(''); // 🚀 Added description state for API
  const [holidays, setHolidays] = useState([]);
  const [startCycle, setStartCycle] = useState({ month: 'Jan', year: 2026 });
  const [endCycle, setEndCycle] = useState({ month: 'Dec', year: 2026 });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    if (isEditMode) {
      const fetchTemplateData = async () => {
        try {
          const response = await fetch(`https://uathr.goelectronix.co.in/holidays/templates/${id}`);
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          
          setTemplateName(data.name || '');
          setDescription(data.description || ''); // 🚀 Populate description
          
          if (data.holidays && Array.isArray(data.holidays)) {
            const mappedHolidays = data.holidays.map(h => {
              const [y, m, d] = h.date.split('-');
              return {
                id: h.id || Date.now() + Math.random(),
                name: h.name,
                day: parseInt(d, 10),
                month: months[parseInt(m, 10) - 1],
                year: parseInt(y, 10)
              };
            });
            setHolidays(mappedHolidays);
          }
        } catch (error) {
          console.error("Error fetching template data:", error);
        } finally {
          setIsPageLoading(false);
        }
      };
      fetchTemplateData();
    }
  }, [id, isEditMode]);

  const removeHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));

  // --- MODAL LOGIC (Handles both Add & Edit) ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showModalPicker, setShowModalPicker] = useState(false);
  const [editingId, setEditingId] = useState(null); 
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

  const handleSaveHolidayLocally = () => {
    if (!newHoliday.name.trim()) return; 
    
    if (editingId) {
      setHolidays(holidays.map(h => 
        h.id === editingId 
          ? { ...h, name: newHoliday.name, day: newHoliday.day, month: newHoliday.month } 
          : h
      ));
    } else {
      const newId = Date.now();
      setHolidays([{ 
        id: newId, 
        name: newHoliday.name, 
        day: newHoliday.day, 
        month: newHoliday.month, 
        year: startCycle.year 
      }, ...holidays]);
    }
    
    setNewHoliday({ name: '', day: 1, month: 'Jan' });
    setEditingId(null);
    setIsAddModalOpen(false);
    setShowModalPicker(false);
  };

  // 🚀 MAIN API SAVE FUNCTION
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("Template Name is required!");
      return;
    }

    setIsSaving(true);

    // 1. Format the holidays array for the API (Convert Month strings to YYYY-MM-DD)
    const formattedHolidays = holidays.map(h => {
      const monthNumber = (months.indexOf(h.month) + 1).toString().padStart(2, '0');
      const dayNumber = h.day.toString().padStart(2, '0');
      return {
        name: h.name,
        date: `${h.year || startCycle.year}-${monthNumber}-${dayNumber}`,
        holiday_type: "Public", // Providing a default based on previous GET payload
        is_half_day: false
      };
    });

    // 2. Construct the Payload
    const payload = {
      name: templateName,
      year: startCycle.year,
      description: description || "Holiday Template",
      is_active: true,
      holidays: formattedHolidays
    };

    // 3. Make the Request
    try {
      const url = isEditMode 
        ? `https://uathr.goelectronix.co.in/holidays/templates/${id}` 
        : 'https://uathr.goelectronix.co.in/holidays/templates/';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save template to the server.');
      }

      // Success -> Redirect to List
      navigate(-1);

    } catch (error) {
      console.error("Save Error:", error);
      alert("Something went wrong while saving the template.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartCycleChange = (newStart) => {
    setStartCycle(newStart);
    const startTotalMonths = newStart.year * 12 + months.indexOf(newStart.month);
    const endTotalMonths = endCycle.year * 12 + months.indexOf(endCycle.month);

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

  const [showPicker, setShowPicker] = useState(null);

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

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Loading Data...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-32 text-left relative">
      {/* HEADER */}
      <div className="!bg-white border-b !border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-[50]">
        <button onClick={() => navigate(-1)} className="p-1.5 !bg-transparent hover:bg-slate-50 rounded-lg !text-slate-600 cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black !text-slate-700 !capitalize tracking-tight">
          {isEditMode ? 'Edit Holiday Template' : 'Create Holiday Template'}
        </h2>
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
                <input 
                  type="text" 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. 2026 Calendar" 
                  className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" 
                />
              </div>

              {/* 🚀 DESCRIPTION FIELD */}
              {/* <div className="space-y-1.5 mt-2">
                <label className="text-[9px] font-black !text-slate-800 !capitalize tracking-widest ml-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template..." 
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400 transition-all resize-none" 
                />
              </div> */}
              
              {/* ANNUAL HOLIDAY PERIOD SECTION */}
              <div className="space-y-3 mt-2">
                <h3 className="md:text-[12px] text-[10px] !capitalize font-semibold !text-slate-800">
                  Annual Holiday Period
                </h3>

                <div className="grid grid-cols-2 gap-4">
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
                        setSelected={handleStartCycleChange} 
                        onClose={() => setShowPicker(null)} 
                        months={months} 
                        position="left-0" 
                      />
                    )}
                  </div>

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
                        minDate={startCycle} 
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
                          
                          <div className="w-full sm:col-span-7 sm:pr-6">
                            <span className="block w-full text-[12px] sm:text-[11px] font-bold text-slate-700 capitalize tracking-tight py-1 sm:py-0">
                              {holiday.name}
                            </span>
                          </div>
                          
                          <div className="w-full sm:col-span-5 flex items-center justify-between sm:justify-end gap-3">
                            <div className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-3 text-slate-600 bg-slate-50 sm:bg-slate-50/80 px-4 py-3 sm:py-2 rounded-xl border border-slate-100 sm:border-slate-100/80">
                              <Calendar size={13} className="text-slate-400" />
                              <span className="text-[10px] font-black capitalize tracking-tighter">
                                {holiday.day} {holiday.month} {holiday.year || startCycle.year}
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
          <button onClick={() => navigate(-1)} className="px-8 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all cursor-pointer">
            Cancel
          </button>
          
          {/* 🚀 SAVE BUTTON WITH API INTEGRATION */}
          <button 
            onClick={handleSaveTemplate}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-12 py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] border border-blue-600 font-black capitalize tracking-widest shadow-sm shadow-blue-200 active:scale-95 hover:bg-blue-50 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            {isSaving ? 'Saving...' : (isEditMode ? 'Update Template' : 'Save Template')}
          </button>
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
                onClick={handleSaveHolidayLocally} 
                disabled={!newHoliday.name.trim()}
                className="flex-1 py-3.5 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[10px] font-black capitalize tracking-widest shadow-sm shadow-blue-200 hover:!bg-blue-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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


// --- INTERNAL COMPONENT: MONTH & YEAR PICKER ---
const MonthYearPicker = ({ selected, setSelected, onClose, months, position = "left-0", minDate }) => {
  const [viewMode, setViewMode] = useState('months');
  const [viewYear, setViewYear] = useState(selected.year);
  const startYearGrid = viewYear - 4;
  const yearGrid = Array.from({ length: 12 }, (_, i) => startYearGrid + i);

  const isMonthDisabled = (m, y) => {
    if (!minDate) return false;
    const mIdx = months.indexOf(m);
    const minIdx = months.indexOf(minDate.month);
    return y < minDate.year || (y === minDate.year && mIdx <= minIdx);
  };

  const isYearDisabled = (y) => {
    if (!minDate) return false;
    return y < minDate.year || (y === minDate.year && minDate.month === 'Dec');
  };

  return (
    <div className={`absolute top-[105%] ${position} w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-4 animate-in zoom-in-95 duration-200`}>
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

// --- COMPONENT: MONTH & DAY ONLY PICKER ---
const MonthDayPicker = ({ selected, setSelected, onClose, months }) => {
  const [viewMode, setViewMode] = useState('months');
  const [tempMonth, setTempMonth] = useState(selected?.month || 'Jan');

  const getDaysInMonth = (month) => {
    const monthIndex = months.indexOf(month);
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
//**************************************************************************************************** */
// import React, { useState ,useEffect } from 'react';
// import { 
//   ArrowLeft, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Info, Inbox, X, ShieldCheck, Edit3
// } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';

// const CreateHoliday = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); 
//   const [activeTab, setActiveTab] = useState('Add Template');

//     const isEditMode = Boolean(id); 
//     const [isPageLoading, setIsPageLoading] = useState(isEditMode); 
//       const [description, setDescription] = useState('');
   
//       const [templateName, setTemplateName] = useState(''); // 🚀 Controlled state for Template Name
//         const [holidays, setHolidays] = useState([]);
//         const [startCycle, setStartCycle] = useState({ month: 'Jan', year: 2026 });
//         const [endCycle, setEndCycle] = useState({ month: 'Dec', year: 2026 });

//   // const [holidays, setHolidays] = useState([
//   //   { id: 1, name: 'New Year', day: 1, month: 'Jan', year: 2026 },
//   //   { id: 2, name: 'Republic Day', day: 26, month: 'Jan', year: 2026 },
//   //   { id: 3, name: 'Holi', day: 15, month: 'Mar', year: 2026 },
//   // ]);

//   const removeHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));

//   // --- REVISED MODAL LOGIC (Handles both Add & Edit) ---
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [showModalPicker, setShowModalPicker] = useState(false);
//   const [editingId, setEditingId] = useState(null); // Tracks if we are editing an existing row
//   const [newHoliday, setNewHoliday] = useState({ name: '', day: 1, month: 'Jan' });


//     useEffect(() => {
//       if (isEditMode) {
//         const fetchTemplateData = async () => {
//           try {
//             const response = await fetch(`https://uathr.goelectronix.co.in/holidays/templates/${id}/`);
//             if (!response.ok) throw new Error('Failed to fetch');
//             const data = await response.json();
            
//             setTemplateName(data.name || '');
            
//             // Map API holidays to local format
//             if (data.holidays && Array.isArray(data.holidays)) {
//               const mappedHolidays = data.holidays.map(h => {
//                 // Parse "YYYY-MM-DD" safely avoiding timezone issues
//                 const [y, m, d] = h.date.split('-');
//                 return {
//                   id: h.id,
//                   name: h.name,
//                   day: parseInt(d, 10),
//                   month: months[parseInt(m, 10) - 1],
//                   year: parseInt(y, 10)
//                 };
//               });
//               setHolidays(mappedHolidays);
//             }
//           } catch (error) {
//             console.error("Error fetching template data:", error);
//           } finally {
//             setIsPageLoading(false);
//           }
//         };
//         fetchTemplateData();
//       }
//     }, [id, isEditMode]);

//   const openAddModal = () => {
//     setEditingId(null);
//     setNewHoliday({ name: '', day: 1, month: 'Jan' });
//     setIsAddModalOpen(true);
//   };

//   const openEditModal = (holiday) => {
//     setEditingId(holiday.id);
//     setNewHoliday({ name: holiday.name, day: holiday.day, month: holiday.month });
//     setIsAddModalOpen(true);
//   };

//   const handleSaveHoliday = () => {
//     if (!newHoliday.name.trim()) return; // Don't save empty names
    
//     if (editingId) {
//       // Update existing holiday
//       setHolidays(holidays.map(h => 
//         h.id === editingId 
//           ? { ...h, name: newHoliday.name, day: newHoliday.day, month: newHoliday.month } 
//           : h
//       ));
//     } else {
//       // Add new holiday
//       const newId = Date.now();
//       setHolidays([{ 
//         id: newId, 
//         name: newHoliday.name, 
//         day: newHoliday.day, 
//         month: newHoliday.month, 
//         year: startCycle.year 
//       }, ...holidays]);
//     }
    
//     // Reset and close
//     setNewHoliday({ name: '', day: 1, month: 'Jan' });
//     setEditingId(null);
//     setIsAddModalOpen(false);
//     setShowModalPicker(false);
//   };


//   // 🔥 Automatically forces End Date to be AFTER Start Date
//   const handleStartCycleChange = (newStart) => {
//     setStartCycle(newStart);

//     // Convert month/year into a continuous number for easy comparison
//     const startTotalMonths = newStart.year * 12 + months.indexOf(newStart.month);
//     const endTotalMonths = endCycle.year * 12 + months.indexOf(endCycle.month);

//     // If End Date is not strictly AFTER Start Date, push it forward by 1 month
//     if (endTotalMonths <= startTotalMonths) {
//       let nextMonthIndex = months.indexOf(newStart.month) + 1;
//       let nextYear = newStart.year;
      
//       if (nextMonthIndex > 11) {
//         nextMonthIndex = 0;
//         nextYear += 1;
//       }
      
//       setEndCycle({ month: months[nextMonthIndex], year: nextYear });
//     }
//   };

//   // const [startCycle, setStartCycle] = useState({ month: 'Jan', year: 2026 });
//   // const [endCycle, setEndCycle] = useState({ month: 'Dec', year: 2026 });
//   const [showPicker, setShowPicker] = useState(null);

//   const years = Array.from({ length: 12 }, (_, i) => 2020 + i);
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  

//   const quarterCounts = holidays.reduce((acc, h) => {
//     const m = h.month;
//     if (['Jan', 'Feb', 'Mar'].includes(m)) acc.q1++;
//     else if (['Apr', 'May', 'Jun'].includes(m)) acc.q2++;
//     else if (['Jul', 'Aug', 'Sep'].includes(m)) acc.q3++;
//     else acc.q4++;
//     return acc;
//   }, { q1: 0, q2: 0, q3: 0, q4: 0 });

//   const totalHolidays = holidays.length || 1; 
//   const qPct = {
//     q1: (quarterCounts.q1 / totalHolidays) * 100,
//     q2: (quarterCounts.q2 / totalHolidays) * 100,
//     q3: (quarterCounts.q3 / totalHolidays) * 100,
//     q4: (quarterCounts.q4 / totalHolidays) * 100,
//   };

//   const earliestHoliday = holidays.length > 0 
//     ? [...holidays].sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month))[0].name 
//     : "None";

//   const getHolidayDate = (h) => {
//     const monthIdx = months.indexOf(h.month);
//     return new Date(h.year, monthIdx, h.day);
//   };

//   const today = new Date();

//   const upcomingHolidays = holidays
//     .map(h => ({ ...h, dateObj: getHolidayDate(h) }))
//     .filter(h => h.dateObj >= today)
//     .sort((a, b) => a.dateObj - b.dateObj);

//   const nextHoliday = upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;

//   const weekendHolidaysCount = holidays.filter(h => {
//     const day = getHolidayDate(h).getDay();
//     return day === 0 || day === 6; 
//   }).length;

//   const monthCounts = holidays.reduce((acc, h) => {
//     acc[h.month] = (acc[h.month] || 0) + 1;
//     return acc;
//   }, {});
  
//   const busiestMonth = Object.keys(monthCounts).length > 0 
//     ? Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b)
//     : "N/A";

//   return (
//     <div className="min-h-screen bg-white font-['Inter'] pb-32 text-left relative">
//       {/* HEADER */}
//       <div className="!bg-white border-b !border-slate-100 px-4 py-2.5 flex items-center gap-4 sticky top-0 z-[50]">
//         <button onClick={() => navigate(-1)} className="p-1.5 !bg-transparent hover:bg-slate-50 rounded-lg !text-slate-600 cursor-pointer">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black !text-slate-700 !capitalize tracking-tight">Create Holiday Template</h2>
//       </div>

//       <div className="mx-auto px-4 mt-4">
//         {/* TABS */}
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-4 border border-slate-200">
//           {['Add Template', 'Assign Staff'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)} 
//               className={`px-6 py-1.5 rounded-lg text-[10px] font-black !bg-transparent capitalize tracking-widest transition-all ${
//                 activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-600 cursor-not-allowed opacity-80'
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
//               <h3 className="md:text-sm text-[12px] font-black !text-slate-800 !capitalize tracking-tighter">Holiday Template Details</h3>
//               <p className="md:text-[10px] text-[8px] font-bold !text-slate-500 capitalize tracking-widest mt-1">Define your holiday and list of public holidays.</p>
//             </div>

//             <div className="grid grid-cols-1 gap-4 overflow-visible">
//               <div className="space-y-1.5">
//                 <label className="text-[9px] font-black !text-slate-800 !capitalize tracking-widest ml-1">Template Name *</label>
//                 <input type="text" placeholder="e.g. 2026 Calendar" className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" />
//               </div>
              
//               {/* ANNUAL HOLIDAY PERIOD SECTION */}
//               <div className="space-y-3">
//                 <h3 className="md:text-[12px] text-[10px] !capitalize font-semibold !text-slate-800">
//                   Annual Holiday Period
//                 </h3>

//                 {/* <div className="grid grid-cols-2 gap-4">
                
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
//                 </div> */}

//                 <div className="grid grid-cols-2 gap-4">
//   {/* CYCLE START */}
//   <div className="space-y-1.5 relative">
//     <label className="text-[9px] font-medium !capitalize !text-slate-600 ml-1">Start Month</label>
//     <div 
//       onClick={() => setShowPicker(showPicker === 'start' ? null : 'start')} 
//       className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-all shadow-sm"
//     >
//       <span className="text-[12px] font-medium text-slate-800">
//         {startCycle.month} {startCycle.year}
//       </span>
//       <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
//     </div>
//     {showPicker === 'start' && (
//       <MonthYearPicker 
//         selected={startCycle} 
//         setSelected={handleStartCycleChange} // 🔥 Updated Handler
//         onClose={() => setShowPicker(null)} 
//         months={months} 
//         position="left-0" 
//       />
//     )}
//   </div>

//   {/* CYCLE END */}
//   <div className="space-y-1.5 relative">
//     <label className="text-[9px] font-medium !capitalize !text-slate-600 ml-1">End Month</label>
//     <div 
//       onClick={() => setShowPicker(showPicker === 'end' ? null : 'end')} 
//       className="flex items-center justify-between w-full bg-slate-50/80 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:border-slate-300 transition-all"
//     >
//       <span className="text-[12px] font-medium text-slate-500">
//         {endCycle.month} {endCycle.year}
//       </span>
//       <Calendar size={16} className="text-slate-400" strokeWidth={1.5} />
//     </div>
//     {showPicker === 'end' && (
//       <MonthYearPicker 
//         selected={endCycle} 
//         setSelected={setEndCycle} 
//         onClose={() => setShowPicker(null)} 
//         months={months} 
//         position="right-0"
//         minDate={startCycle} // 🔥 Added Restriction Prop
//       />
//     )}
//   </div>
// </div>
//               </div>
//             </div>
//           </div>

//           {/* LIST SECTION */}
//           <div className="bg-white border border-slate-200 rounded-xl sm:rounded-xl shadow-sm overflow-visible relative p-4 sm:p-8 min-h-[350px]">
//             <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
              
//               {/* ⬅️ LEFT COLUMN: REGISTRY INPUTS (70%) */}
//               <div className="flex-1 space-y-6 lg:border-r border-b lg:border-b-0 border-slate-100 lg:pr-8 pb-4 lg:pb-0">
                
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:gap-0">
//                   <div>
//                     <h4 className="text-[13px] font-black text-slate-900 capitalize tracking-tighter leading-none">Holiday List</h4>
//                     <p className="text-[9px] font-bold text-slate-400 capitalize mt-2 tracking-widest">Map public holidays to the 2026 cycle</p>
//                   </div>
//                   <button 
//                     onClick={openAddModal} 
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
//                         <div key={holiday.id} className="flex flex-col sm:grid sm:grid-cols-12 px-4 sm:px-6 py-4 gap-3 sm:gap-0 sm:items-center hover:bg-slate-50/50 transition-all group border-b sm:border-none border-slate-50 last:border-none">
                          
//                           {/* 🛑 FIX: Changed input to read-only span */}
//                           <div className="w-full sm:col-span-7 sm:pr-6">
//                             <span className="block w-full text-[12px] sm:text-[11px] font-bold text-slate-700 capitalize tracking-tight py-1 sm:py-0">
//                               {holiday.name}
//                             </span>
//                           </div>
                          
//                           {/* 🛑 FIX: Removed date picker onClick logic, added Edit Action */}
//                           <div className="w-full sm:col-span-5 flex items-center justify-between sm:justify-end gap-3">
//                             <div className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-3 text-slate-600 bg-slate-50 sm:bg-slate-50/80 px-4 py-3 sm:py-2 rounded-xl border border-slate-100 sm:border-slate-100/80">
//                               <Calendar size={13} className="text-slate-400" />
//                               <span className="text-[10px] font-black capitalize tracking-tighter">
//                                 {holiday.day} {holiday.month} {holiday.year}
//                               </span>
//                             </div>
                            
//                             <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
//                               <button onClick={() => openEditModal(holiday)} className="p-3 sm:p-2 !bg-blue-50 sm:!bg-transparent !text-blue-600 hover:!text-blue-600 rounded-xl transition-all cursor-pointer">
//                                 <Edit3 size={14} />
//                               </button>
//                               <button onClick={() => removeHoliday(holiday.id)} className="p-3 sm:p-2 !bg-rose-50 sm:!bg-transparent !text-rose-500 hover:!text-rose-600 rounded-xl transition-all cursor-pointer">
//                                 <Trash2 size={14} />
//                               </button>
//                             </div>
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
//           <button className="px-12 py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] border border-blue-600 font-black capitalize tracking-widest shadow-sm shadow-blue-200 active:scale-95 hover:bg-blue-700 transition-all cursor-pointer">Save Template</button>
//         </div>
//       </div>

//       {/* 🚀 ADD/EDIT HOLIDAY MODAL */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
//           <div 
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
//             onClick={() => setIsAddModalOpen(false)} 
//           />
          
//           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-visible animate-in zoom-in-95 duration-200 flex flex-col">
            
//             <div className="bg-slate-50 rounded-t-[2.5rem] px-6 sm:px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
//                   <Calendar size={18} />
//                 </div>
//                 <div>
//                   <h3 className="text-[13px] font-black text-slate-900 capitalize tracking-widest">
//                     {editingId ? 'Edit Holiday' : 'Add New Holiday'}
//                   </h3>
//                   <p className="text-[9px] font-bold text-slate-400 capitalize tracking-tight mt-0.5">
//                     {editingId ? 'Update name and date' : 'Assign a name and date'}
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
                
//                 {showModalPicker && (
//                   <div className="absolute -top-2 left-0 right-0 mt-2 z-[1010]">
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

//             <div className="p-6 bg-slate-50 rounded-b-[2.5rem] border-t border-slate-100 flex gap-3">
//               <button 
//                 onClick={() => setIsAddModalOpen(false)} 
//                 className="flex-1 py-3.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[10px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-all cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleSaveHoliday} 
//                 disabled={!newHoliday.name.trim()}
//                 className="flex-1 py-3.5 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[10px] font-black capitalize tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//               >
//                 {editingId ? 'Update Holiday' : 'Add Holiday'}
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };


// // --- INTERNAL COMPONENT: MONTH & YEAR PICKER (For Header) ---
// const MonthYearPicker = ({ selected, setSelected, onClose, months, position = "left-0", minDate }) => {
//   const [viewMode, setViewMode] = useState('months');
//   const [viewYear, setViewYear] = useState(selected.year);
//   const startYearGrid = viewYear - 4;
//   const yearGrid = Array.from({ length: 12 }, (_, i) => startYearGrid + i);

//   // 🔥 HELPER: Checks if a month should be disabled based on minDate
//   const isMonthDisabled = (m, y) => {
//     if (!minDate) return false;
//     const mIdx = months.indexOf(m);
//     const minIdx = months.indexOf(minDate.month);
//     // Disable if year is past, or if it's the same year and the month is <= start month
//     return y < minDate.year || (y === minDate.year && mIdx <= minIdx);
//   };

//   // 🔥 HELPER: Checks if a year should be disabled entirely
//   const isYearDisabled = (y) => {
//     if (!minDate) return false;
//     // If the minDate is December, the whole current year is disabled for the END picker
//     return y < minDate.year || (y === minDate.year && minDate.month === 'Dec');
//   };

//   return (
//     <div className={`absolute top-[105%] ${position} w-[260px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-4 animate-in zoom-in-95 duration-200`}>
      
//       {/* Header Navigation */}
//       <div className="flex items-center justify-between mb-4 px-1">
//         <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear - 1) : setViewYear(viewYear - 12); }} className="p-1 !bg-transparent hover:!bg-slate-100 rounded-lg !text-slate-400 border-0 cursor-pointer">
//           <ChevronLeft size={16} />
//         </button>
//         <button onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'months' ? 'years' : 'months'); }} className="px-3 !bg-transparent py-1 hover:!bg-blue-50 rounded-lg transition-colors group border-0 cursor-pointer">
//           <span className="text-xs font-black text-slate-800 tracking-widest flex items-center gap-1 group-hover:text-blue-600">
//             {viewMode === 'months' ? viewYear : `${yearGrid[0]} - ${yearGrid[11]}`}
//             <ChevronDown size={12} className={viewMode === 'years' ? 'rotate-180' : ''} />
//           </span>
//         </button>
//         <button onClick={(e) => { e.stopPropagation(); viewMode === 'months' ? setViewYear(viewYear + 1) : setViewYear(viewYear + 12); }} className="p-1 hover:!bg-slate-100 !bg-transparent rounded-lg !text-slate-400 border-0 cursor-pointer">
//           <ChevronRight size={16} />
//         </button>
//       </div>

//       {/* Grid Selection */}
//       <div className="grid grid-cols-3 gap-2">
//         {viewMode === 'months' ? (
//           months.map((m) => {
//             const disabled = isMonthDisabled(m, viewYear);
//             return (
//               <button 
//                 key={m} 
//                 disabled={disabled}
//                 onClick={(e) => { e.stopPropagation(); setSelected({ month: m, year: viewYear }); onClose(); }} 
//                 className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all border-0 ${
//                   disabled 
//                     ? 'opacity-30 cursor-not-allowed !bg-slate-50 !text-slate-400'
//                     : selected.month === m && selected.year === viewYear 
//                       ? '!bg-white !text-blue-600 shadow-sm border-2 border-blue-600' 
//                       : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600 cursor-pointer'
//                 }`}
//               >
//                 {m}
//               </button>
//             )
//           })
//         ) : (
//           yearGrid.map((y) => {
//             const disabled = isYearDisabled(y);
//             return (
//               <button 
//                 key={y} 
//                 disabled={disabled}
//                 onClick={(e) => { e.stopPropagation(); setViewYear(y); setViewMode('months'); }} 
//                 className={`py-2 rounded-xl text-[10px] font-black capitalize transition-all border-0 ${
//                   disabled
//                     ? 'opacity-30 cursor-not-allowed !bg-slate-50 !text-slate-400'
//                     : selected.year === y 
//                       ? '!bg-white !text-blue-600 shadow-sm border border-blue-600' 
//                       : '!bg-slate-50 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600 cursor-pointer'
//                 }`}
//               >
//                 {y}
//               </button>
//             )
//           })
//         )}
//       </div>

//       <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
//         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-[9px] font-black !bg-transparent !text-slate-400 capitalize tracking-widest hover:text-slate-600 border-0 cursor-pointer">
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- COMPONENT: MONTH & DAY ONLY PICKER (For Add/Edit Modal) ---
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
//                       ? '!bg-white !text-blue-600  shadow-sm' 
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
