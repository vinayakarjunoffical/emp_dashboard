import React, { useState } from 'react';
import { 
  ArrowLeft, Info, Edit3, Plus, Clock, ChevronDown, Calendar, X, ChevronUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"; 

const CreateShiftTemplate = () => {
  const navigate = useNavigate();
  
  // --- 1. ALL STATES ---
  // const [shiftType, setShiftType] = useState('Fixed Shift');
  const [shiftType, setShiftType] = useState('fixed');
  const [isBufferEditable, setIsBufferEditable] = useState(false);
  const [breaks, setBreaks] = useState([]);
  const [workHours, setWorkHours] = useState({ hh: "00", mm: "00" });
  const [showActionButtons, setShowActionButtons] = useState(true);
const [activeTab, setActiveTab] = useState('Add Template');
  // Main Shift Time States
  const [startTime, setStartTime] = useState({ hh: "09", mm: "00", ampm: "AM" });
  const [endTime, setEndTime] = useState({ hh: "06", mm: "00", ampm: "PM" });
  
  // Buffer Time States
  const [bufferStart, setBufferStart] = useState({ hh: "09", mm: "00", ampm: "AM" });
  const [bufferEnd, setBufferEnd] = useState({ hh: "10", mm: "00", ampm: "PM" });
  
  // Dropdown Open/Close logic
  const [openSections, setOpenSections] = useState({
    startTime: false,
    endTime: false,
    bufferStart: false,
    bufferEnd: false
  });

  const [name, setName] = useState('');
  const [shiftCode, setShiftCode] = useState('');

  // --- 2. DATA ARRAYS ---
  const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const workHoursHH = Array.from({ length: 25 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleAddBreak = () => {
  const newBreak = { 
    id: Date.now(), 
    category: 'Casual Break',
    name: '',
    payType: 'Unpaid',
    type: 'Duration', // Default type from Image 1
    duration: { hh: '00', mm: '00' },
    intervals: {
      startBuffer: '12:00 AM',
      startTime: '12:00 AM',
      endTime: '12:30 AM',
      bufferEnd: '12:30 AM'
    }
  };
  setBreaks([...breaks, newBreak]);
};

const handleRemoveBreak = (id) => {
  setBreaks(breaks.filter(b => b.id !== id));
};

const updateBreak = (id, key, value) => {
  setBreaks(breaks.map(b => b.id === id ? { ...b, [key]: value } : b));
};

  // --- 3. HELPER LOGIC ---
  const timeToMinutes = (timeObj) => {
    if (!timeObj || !timeObj.hh) return 0;
    let h = parseInt(timeObj.hh);
    const m = parseInt(timeObj.mm);
    if (timeObj.ampm === "PM" && h < 12) h += 12;
    if (timeObj.ampm === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      startTime: false, endTime: false, bufferStart: false, bufferEnd: false,
      [section]: !prev[section]
    }));
  };


// --- 4. CALCULATIONS FOR TIMELINE ---
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  // 🛰️ SHIFT & BUFFER CALCULATIONS (Fixed the ReferenceError)
  const shiftLeft = (startMins / 1440) * 100;
  const shiftWidth = ((endMins - startMins) / 1440) * 100;
  const bufferLeft = (timeToMinutes(bufferStart) / 1440) * 100;
  const bufferWidth = ((timeToMinutes(bufferEnd) - timeToMinutes(bufferStart)) / 1440) * 100;

  // 🕒 Helper to convert "12:30 AM" string to minutes
  const stringTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    let h = parseInt(hours, 10);
    if (modifier === 'PM' && h < 12) h += 12;
    return h * 60 + parseInt(minutes, 10);
  };

  // 🟡 Process all breaks to get timeline segments
  const breakSegments = breaks.map(brk => {
    let bStart, bEnd;
    if (brk.type === 'Intervals') {
      bStart = stringTimeToMinutes(brk.intervals.startTime);
      bEnd = stringTimeToMinutes(brk.intervals.endTime);
    } else {
      // For Duration: Defaulting to 2 hours after shift start if no 'start' is provided
      bStart = brk.start || (startMins + 120); 
      const durationMins = (parseInt(brk.duration.hh) * 60) + parseInt(brk.duration.mm);
      bEnd = bStart + durationMins;
    }
    
    // Safety check for night shifts crossing midnight
    let width = ((bEnd - bStart) / 1440) * 100;
    if (width < 0) width += 100; 

    return {
      left: (bStart / 1440) * 100,
      width: width,
      totalMins: bEnd - bStart < 0 ? (bEnd - bStart) + 1440 : bEnd - bStart,
      name: brk.name || brk.category // Added for Tooltip
    };
  });

  // Safety check for shift width crossing midnight
  let adjustedShiftWidth = shiftWidth;
  if (adjustedShiftWidth < 0) adjustedShiftWidth += 100;

  let adjustedBufferWidth = bufferWidth;
  if (adjustedBufferWidth < 0) adjustedBufferWidth += 100;

  const totalBreakMins = breakSegments.reduce((acc, s) => acc + s.totalMins, 0);
  
  // 💰 Financial: Calculate payable hours
  const netPayableMins = (endMins - startMins) - totalBreakMins;
  const payH = Math.floor(Math.max(0, netPayableMins) / 60);
  const payM = Math.max(0, netPayableMins) % 60;


  const formatTimeTo24H = (timeObj) => {
    let h = parseInt(timeObj.hh);
    if (timeObj.ampm === "PM" && h < 12) h += 12;
    if (timeObj.ampm === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${timeObj.mm}:00`;
  };

  const parseBreakTimeTo24H = (timeStr) => {
    if (!timeStr) return "00:00:00";
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    let h = parseInt(hours, 10);
    if (modifier === 'PM' && h < 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    
    return `${h.toString().padStart(2, '0')}:${minutes}:00`;
  };

  const handleSave = async () => {
    if (!name) {
      toast.error("Shift Name is required");
      return;
    }

    // 2. Calculate and Validate Work Hours (Fixes the API Error)
    const totalWorkMinutes = parseInt(workHours.hh) * 60 + parseInt(workHours.mm);
    
    if (shiftType === 'open' && totalWorkMinutes === 0) {
      toast.error("Total work hours are required for Open Shift");
      return;
    }

    const savingToast = toast.loading("Creating shift template...");

    const payload = {
      name: name,
      shift_code: shiftCode || "N/A",
      shift_type: shiftType === 'Fixed Shift' ? 'fixed' : 'open',
      start_time: formatTimeTo24H(startTime),
      end_time: formatTimeTo24H(endTime),
      // Only send buffer if it's a fixed shift, otherwise null
      earliest_punch_in: shiftType === 'fixed' ? formatTimeTo24H(bufferStart) : null,
      latest_punch_out: shiftType === 'fixed' ? formatTimeTo24H(bufferEnd) : null,
      // Map your break objects to the API format
      breaks: breaks.map(brk => ({
        break_name: brk.name || brk.category,
start_time: brk.type === 'Intervals' ? parseBreakTimeTo24H(brk.intervals.startTime) : "00:00:00",
        end_time: brk.type === 'Intervals' ? parseBreakTimeTo24H(brk.intervals.endTime) : "00:00:00"
      })),
      // ✅ Properly calculates float hours (e.g., 8.5)
      work_hours: shiftType === 'open' ? (totalWorkMinutes / 60) : 0,
      is_active: true
    };

    try {
      const response = await fetch("https://uathr.goelectronix.co.in/shifts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Shift Template Created!", { id: savingToast });
        navigate('/shift'); // Navigate back to the list page
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast.error("Failed to save shift details", { id: savingToast });
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Network error. Please check your connection.", { id: savingToast });
    }
  };


  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-24 text-left">
      {/* 🚀 HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
        <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-600">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black !text-slate-700 capitalize tracking-tight">Create Shift Template</h2>
      </div>

      <div className=" mx-auto px-2 md:px-6 mt-4">
        {/* TABS */}
       {/* ✅ DYNAMIC TABS LOGIC */}
       <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-4 border border-slate-200">
  {['Add Template', 'Assign Rules'].map((tab) => (
    <button 
      key={tab} 
      // ✅ LOGIC: Only allow clicking if it's 'Add Template'
      onClick={() => tab === 'Add Template' && setActiveTab(tab)}
      // ✅ LOGIC: Add disabled attribute for 'Assign Rules'
      disabled={tab === 'Assign Rules'}
      className={`px-6 py-2 rounded-lg text-[10px] font-black capitalize tracking-widest transition-all duration-200 
        ${activeTab === tab 
          ? '!bg-white shadow-sm !text-blue-600' 
          : '!text-slate-800 !bg-transparent'
        } 
        ${tab === 'Assign Rules' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      `}
    >
      {tab}
    </button>
  ))}
</div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-8 shadow-sm space-y-10 overflow-visible relative">
          
          {/* SECTION 1: CONFIGURATION */}
          <div className="space-y-6 mb-4">
            <h3 className="md:text-lg text-[15px] font-black !text-slate-800 mb-4 !capitalize tracking-tighter">Shift Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Shift Type *</label>
                <div className="relative">
                  <select 
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400"
                  >
                    <option value="fixed">Fixed Shift</option>
                    <option value="open">Open Shift</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

             
            </div>

            {shiftType === 'open' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                     <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black !text-slate-700 !capitalize tracking-widest ml-1">Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
                </div>
               
              </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Work hours</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                       <select
                       value={workHours.hh}
                       onChange={(e) => setWorkHours({...workHours, hh: e.target.value})}
                       className="w-full bg-slate-50 border border-slate-400 rounded-xl px-3 py-2 text-[11px] font-bold appearance-none outline-none">
                         {workHoursHH.map(h => <option key={h} value={h}>{h}</option>)}
                       </select>
                       <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">:</span>
                    <div className="relative w-24">
                       <select 
                       value={workHours.mm}
                       onChange={(e) => setWorkHours({...workHours, mm: e.target.value})}
                       className="w-full bg-slate-50 border border-slate-400 rounded-xl px-3 py-2 text-[11px] font-bold appearance-none outline-none">
                         {minutesList.filter(m => parseInt(m) % 5 === 0).map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                       <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    </div>
                    <span className="text-[9px] font-black text-slate-300 capitalize ml-2">hh:mm</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
  <label className="text-[10px] font-black !text-slate-600 !capitalize tracking-widest">
    Show action buttons
  </label>
  <label className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      className="sr-only peer" 
      checked={showActionButtons}
      onChange={() => setShowActionButtons(!showActionButtons)} 
    />
    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 
      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
      after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all 
      peer-checked:after:translate-x-full">
    </div>
  </label>
</div>
              </div>
            )}
          </div>

          {/* SECTION 2: SHIFT TIME (FIXED ONLY) */}
          {shiftType === 'fixed' && (
            <div className="space-y-6 overflow-visible relative animate-in fade-in duration-300 mb-4">
                <div>
                     <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Name *</label>
                  <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full  bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Shift Code</label>
                  <input type="text" placeholder="Optional" value={shiftCode} onChange={(e) => setShiftCode(e.target.value)} className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
                </div>
              </div>
                </div>
              <h3 className="text-sm font-black !text-slate-700 mb-4 !capitalize tracking-widest">Shift Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 overflow-visible relative">
                <div className="space-y-2 relative">
                  <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Start Time *</label>
                  <div onClick={() => toggleSection('startTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 relative z-10">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-700 flex-1">{startTime.hh}:{startTime.mm} {startTime.ampm}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.startTime ? 'rotate-180' : ''}`} />
                  </div>
                  {openSections.startTime && (
                    <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] flex h-[200px] overflow-hidden animate-in slide-in-from-bottom-2">
                      <TimePickerColumns state={startTime} setState={setStartTime} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('startTime')} />
                    </div>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">End Time *</label>
                  <div onClick={() => toggleSection('endTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 relative z-10">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-700 flex-1">{endTime.hh}:{endTime.mm} {endTime.ampm}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.endTime ? 'rotate-180' : ''}`} />
                  </div>
                  {openSections.endTime && (
                    <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] flex h-[200px] overflow-hidden animate-in slide-in-from-bottom-2">
                      <TimePickerColumns state={endTime} setState={setEndTime} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('endTime')} />
                    </div>
                  )}
                </div>
              </div>




{/* 📊 ANALYTICS TIMELINE BAR */}
<div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
  <div className="h-4 bg-slate-200 rounded-full w-full relative overflow-visible ring-1 ring-slate-300/50">
    
    {/* 🟢 BUFFER LAYER */}
    <div 
      className="absolute inset-y-0 bg-emerald-400/30 border-x border-emerald-400/50 transition-all duration-500 group hover:bg-emerald-400/50 hover:z-30 cursor-pointer" 
      style={{ left: `${bufferLeft}%`, width: `${adjustedBufferWidth}%` }} 
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black capitalize tracking-widest px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        Buffer: {bufferStart.hh}:{bufferStart.mm} {bufferStart.ampm} - {bufferEnd.hh}:{bufferEnd.mm} {bufferEnd.ampm}
      </div>
    </div>
    
    {/* 🔵 SHIFT LAYER */}
    <div 
      className="absolute inset-y-0 bg-blue-600/20 border-x-2 border-blue-600 transition-all duration-700 group hover:bg-blue-600/40 hover:z-30 cursor-pointer" 
      style={{ left: `${shiftLeft}%`, width: `${adjustedShiftWidth}%`, zIndex: 10 }} 
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black capitalize tracking-widest px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        Shift: {startTime.hh}:{startTime.mm} {startTime.ampm} - {endTime.hh}:{endTime.mm} {endTime.ampm}
      </div>
    </div>

    {/* 🟡 DYNAMIC BREAK SEGMENTS */}
    {breakSegments.map((segment, i) => (
      <div 
        key={i}
        className="absolute inset-y-0 bg-amber-400 border-x border-amber-500 shadow-sm animate-in fade-in group hover:bg-amber-300 hover:z-40 cursor-pointer"
        style={{ left: `${segment.left}%`, width: `${segment.width}%`, zIndex: 20 }} 
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black capitalize tracking-widest px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg flex items-center gap-1.5">
          <span className="text-amber-400">{segment.name}</span> | {segment.totalMins} Mins
        </div>
      </div>
    ))}
  </div>

  <div className="flex justify-between mt-6">
    <div className="flex items-center gap-4 text-left">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-[9px] font-black text-slate-400 capitalize tracking-widest">Buffer</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-[9px] font-black text-slate-400 capitalize tracking-widest">Break</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="text-[9px] font-black text-slate-400 capitalize tracking-widest">Shift</span>
      </div>
    </div>
    <div className="text-[9px] font-black text-slate-500 capitalize bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
      Max Break: <span className="text-slate-900">{totalBreakMins} mins</span> <span className="mx-1 text-slate-300">•</span> 
      Payable: <span className="text-blue-600 ml-1">{payH}h {payM}m</span>
    </div>
  </div>
</div>
            </div>
          )}

          {/* 🛡️ SECTION 3: BUFFER & BREAKS (HIDDEN FOR OPEN SHIFT) */}
          {shiftType === 'fixed' && (
            <div className="space-y-4 overflow-visible relative animate-in fade-in duration-300">
              <div className={`transition-all duration-300 border border-slate-200 rounded-2xl overflow-visible relative ${isBufferEditable ? 'bg-white shadow-md' : 'bg-slate-50/50'}`}>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-700 capitalize tracking-widest leading-none">Buffer Minutes</span>
                  {!isBufferEditable ? (
                    <Edit3 size={16} className="text-blue-600 cursor-pointer hover:scale-110 transition-all" onClick={() => setIsBufferEditable(true)} />
                  ) : (
                    <X size={16} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setIsBufferEditable(false)} />
                  )}
                </div>
                {isBufferEditable && (
                  <div className="md:px-6 px-4 pb-6 pt-2 overflow-visible relative z-[100]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 overflow-visible relative">
                      <div className="space-y-2 relative">
                        <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Earliest Punch In</label>
                        <div onClick={() => toggleSection('bufferStart')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 cursor-pointer relative z-10">
                          <Clock size={14} className="text-slate-300" /><span className="text-[11px] font-bold text-slate-700 flex-1">{bufferStart.hh}:{bufferStart.mm} {bufferStart.ampm}</span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferStart ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.bufferStart && (
                          <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-400 rounded-2xl shadow-2xl z-[110] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
                            <TimePickerColumns state={bufferStart} setState={setBufferStart} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('bufferStart')} />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 relative">
                        <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Latest Punch Out</label>
                        <div onClick={() => toggleSection('bufferEnd')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 cursor-pointer relative z-10">
                          <Clock size={14} className="text-slate-300" /><span className="text-[11px] font-bold text-slate-700 flex-1">{bufferEnd.hh}:{bufferEnd.mm} {bufferEnd.ampm}</span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferEnd ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.bufferEnd && (
                          <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-400 rounded-2xl shadow-2xl z-[110] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
                            <TimePickerColumns state={bufferEnd} setState={setBufferEnd} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('bufferEnd')} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 !bg-white !text-blue-600  rounded-lg border border-blue-600 text-[10px] font-black capitalize shadow-sm active:scale-95 transition-all">Done</button>
                      <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 !bg-white border !border-blue-600 !text-blue-600 rounded-lg text-[10px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all">Discard</button>
                    </div>
                  </div>
                )}
              </div>
              {/* <button onClick={handleAddBreak} className="flex items-center gap-2 px-4 py-2 !text-blue-600 !bg-blue-50 rounded-xl hover:!bg-blue-100 border border-blue-600 active:scale-95 transition-all">
                <Plus size={16} strokeWidth={3} /><span className="text-[10px] font-black capitalize tracking-widest">Add Break</span>
              </button> */}

              <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black !text-slate-800 !capitalize tracking-widest">Breaks</h3>
        {breaks.length > 0 && (
          <button onClick={() => setBreaks([])} className="text-[10px] font-black !text-blue-600 capitalize !bg-transparent tracking-widest hover:underline">Clear All</button>
        )}
      </div>

      {breaks.map((brk, index) => (
        <div key={brk.id} className="bg-white border border-slate-200 rounded-xl px-2 py-8 md:p-6 shadow-sm relative animate-in slide-in-from-top-4 duration-300">
          {/* Remove Icon */}
          <button 
            onClick={() => handleRemoveBreak(brk.id)}
            className="absolute top-4 right-4 p-1.5 !bg-blue-50 !text-blue-600 rounded-lg hover:bg-white hover:text-white transition-all"
          >
            <X size={14} strokeWidth={3} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-2">
            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Category *</label>
              <select 
                value={brk.category}
                onChange={(e) => updateBreak(brk.id, 'category', e.target.value)}
                className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Casual Break">Casual Break</option>
                <option value="Lunch Break">Lunch Break</option>
              </select>
            </div>

            {/* Break Name Input */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 !capitalize tracking-widest ml-1">Break Name *</label>
              <input 
                type="text" 
                placeholder="Break Name"
                value={brk.name}
                onChange={(e) => updateBreak(brk.id, 'name', e.target.value)}
                className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-400" 
              />
            </div>

            {/* Pay Type Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Pay Type *</label>
              <select 
                value={brk.payType}
                onChange={(e) => updateBreak(brk.id, 'payType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Type Dropdown (Image 2 logic) */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Type *</label>
              <select 
                value={brk.type}
                onChange={(e) => updateBreak(brk.id, 'type', e.target.value)}
                className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none ring-2 ring-blue-600/5 focus:border-blue-600"
              >
                <option value="Duration">Duration</option>
                <option value="Intervals">Intervals</option>
              </select>
            </div>
          </div>

          {/* 🔥 CONDITIONAL RENDER (Image 1 vs Image 3) */}
          <div className="md:mt-6 mt-2 pt-2 md:pt-6 border-t border-slate-50">
            {brk.type === 'Duration' ? (
              /* DURATION VIEW */
              // <div className="space-y-2">
              //   <label className="text-[9px] font-black text-slate-500 capitalize tracking-widest ml-1">Duration *</label>
              //   <div className="flex items-center gap-2">
              //     <select className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none">
              //       {workHoursHH.slice(0, 5).map(h => <option key={h}>{h}</option>)}
              //     </select>
              //     <span className="text-slate-300">:</span>
              //     <select className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none">
              //       {['00', '15', '30', '45'].map(m => <option key={m}>{m}</option>)}
              //     </select>
              //     <span className="text-[9px] font-black text-slate-300 capitalize tracking-widest ml-2">hh:mm</span>
              //   </div>
              // </div>
              /* DURATION VIEW */
<div className="space-y-2">
  <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Duration *</label>
  <div className="flex items-center gap-2">
    <select 
      value={brk.duration.hh}
      onChange={(e) => updateBreak(brk.id, 'duration', { ...brk.duration, hh: e.target.value })}
      className="bg-slate-50 border border-slate-400 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-blue-400"
    >
      {workHoursHH.slice(0, 5).map(h => <option key={h} value={h}>{h}</option>)}
    </select>
    <span className="text-slate-300">:</span>
    <select 
      value={brk.duration.mm}
      onChange={(e) => updateBreak(brk.id, 'duration', { ...brk.duration, mm: e.target.value })}
      className="bg-slate-50 border border-slate-400 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-blue-400"
    >
      {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
    </select>
    <span className="text-[9px] font-black text-slate-300 capitalize tracking-widest ml-2">hh:mm</span>
  </div>
</div>
            ) : (
              /* INTERVALS VIEW (Image 3) */
             /* INTERVALS VIEW (Image 3) */
<div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
  <p className="text-[10px] font-black text-slate-800 capitalize tracking-widest">Interval Configuration</p>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <IntervalInput 
      label="Start Buffer" 
      value={brk.intervals.startBuffer} 
      onTimeChange={(val) => updateBreak(brk.id, 'intervals', { ...brk.intervals, startBuffer: val })} 
    />
    <IntervalInput 
      label="Start Time" 
      value={brk.intervals.startTime} 
      onTimeChange={(val) => updateBreak(brk.id, 'intervals', { ...brk.intervals, startTime: val })} 
    />
    <IntervalInput 
      label="End Time" 
      value={brk.intervals.endTime} 
      onTimeChange={(val) => updateBreak(brk.id, 'intervals', { ...brk.intervals, endTime: val })} 
    />
    <IntervalInput 
      label="Buffer End" 
      value={brk.intervals.bufferEnd} 
      onTimeChange={(val) => updateBreak(brk.id, 'intervals', { ...brk.intervals, bufferEnd: val })} 
    />
  </div>
</div>
            )}
          </div>
        </div>
      ))}

      {/* Add Break Trigger */}
      <button onClick={handleAddBreak} className="flex items-center gap-2 px-6 py-3 !text-blue-600 !bg-white rounded-xl hover:!bg-blue-50 border-2 border-blue-600 shadow-sm active:scale-95 transition-all">
        <Plus size={16} strokeWidth={3} />
        <span className="text-[11px] font-black capitalize tracking-widest">Add Break</span>
      </button>
    </div>
            </div>
          )}
        </div>

        {/* 🛡️ FOOTER */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/90">
          <div className="mx-auto flex justify-end gap-3 px-2">
            <button onClick={() => navigate(-1)} className="px-6 py-2.5 !bg-white border !border-slate-400 !text-slate-600 rounded-xl text-[11px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-all active:scale-95">cancel</button>
            <button onClick={handleSave} className="px-10 py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] font-black capitalize border border-blue-600 tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 flex items-center gap-2">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// HELPER: TIME PICKER UI
const TimePickerColumns = ({ state, setState, hours, minutes, onClose }) => (
  <>
    <div className="flex-1 overflow-y-auto p-1 border-r border-slate-50 custom-scrollbar bg-white">
      {hours.map(h => <div key={h} onClick={() => setState({...state, hh: h})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer transition-all ${state.hh === h ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}>{h}</div>)}
    </div>
    <div className="flex-1 overflow-y-auto p-1 border-r border-slate-50 custom-scrollbar bg-white">
      {minutes.map(m => <div key={m} onClick={() => setState({...state, mm: m})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer transition-all ${state.mm === m ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}>{m}</div>)}
    </div>
    <div className="w-14 p-1 bg-slate-50 flex flex-col">
      {['AM', 'PM'].map(p => <div key={p} onClick={() => {setState({...state, ampm: p}); onClose();}} className={`py-3 text-[10px] font-black text-center rounded-lg cursor-pointer mb-1 transition-all ${state.ampm === p ? 'bg-white text-blue-600 border border-slate-100 shadow-sm' : 'text-slate-400'}`}>{p}</div>)}
    </div>
  </>
);

const IntervalInput = ({ label, value, onTimeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Assuming 'value' is string like "12:00 AM"
  // We need to parse it for the picker columns
  const [hh, rest] = value.split(':');
  const [mm, ampm] = rest.split(' ');
  const timeObj = { hh, mm, ampm };

  const handleSelect = (updates) => {
    const newTime = { ...timeObj, ...updates };
    onTimeChange(`${newTime.hh}:${newTime.mm} ${newTime.ampm}`);
  };

  // Re-using your existing lists
  const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="space-y-1.5 relative">
      <label className="text-[8px] font-black text-slate-400 capitalize tracking-tighter ml-1">{label} *</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all border ${
          isOpen ? 'bg-white border-blue-400 ring-4 ring-blue-600/5' : 'bg-slate-50 border-slate-200 hover:bg-white'
        }`}
      >
        <span className="text-[10px] font-bold text-slate-700">{value}</span>
        <Clock size={12} className={isOpen ? 'text-blue-600' : 'text-slate-300'} />
      </div>

      {/* 🔥 TIME SELECTION DROPDOWN */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[120]" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-[110%] left-0 w-[220px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[130] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
            <TimePickerColumns 
              state={timeObj} 
              setState={handleSelect} 
              hours={hoursList} 
              minutes={minutesList} 
              onClose={() => setIsOpen(false)} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CreateShiftTemplate;
