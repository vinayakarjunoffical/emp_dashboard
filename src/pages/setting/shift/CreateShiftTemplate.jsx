import React, { useState } from 'react';
import { 
  ArrowLeft, Info, Edit3, Plus, Clock, ChevronDown, Calendar, X, ChevronUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateShiftTemplate = () => {
  const navigate = useNavigate();
  
  // --- 1. ALL STATES ---
  const [shiftType, setShiftType] = useState('Fixed Shift');
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
  // const startMins = timeToMinutes(startTime);
  // const endMins = timeToMinutes(endTime);
  // const totalBreakMins = breaks.reduce((acc, b) => acc + b.duration, 0);
  
  // const shiftLeft = (startMins / 1440) * 100;
  // const shiftWidth = ((endMins - startMins) / 1440) * 100;
  // const bufferLeft = (timeToMinutes(bufferStart) / 1440) * 100;
  // const bufferWidth = ((timeToMinutes(bufferEnd) - timeToMinutes(bufferStart)) / 1440) * 100;

  // const netPayableMins = (endMins - startMins) - totalBreakMins;
  // const payH = Math.floor(Math.max(0, netPayableMins) / 60);
  // const payM = Math.max(0, netPayableMins) % 60;

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
  // const breakSegments = breaks.map(brk => {
  //   let bStart, bEnd;
  //   if (brk.type === 'Intervals') {
  //     bStart = stringTimeToMinutes(brk.intervals.startTime);
  //     bEnd = stringTimeToMinutes(brk.intervals.endTime);
  //   } else {
  //     // For Duration: Defaulting to 2 hours after shift start if no 'start' is provided
  //     bStart = brk.start || (startMins + 120); 
  //     const durationMins = (parseInt(brk.duration.hh) * 60) + parseInt(brk.duration.mm);
  //     bEnd = bStart + durationMins;
  //   }
    
  //   return {
  //     left: (bStart / 1440) * 100,
  //     width: ((bEnd - bStart) / 1440) * 100,
  //     totalMins: bEnd - bStart
  //   };
  // });
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

  // const handleAddBreak = () => {
  //   const newBreak = { id: Date.now(), duration: 30, start: startMins + 120 };
  //   setBreaks([...breaks, newBreak]);
  // };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24 text-left">
      {/* 🚀 HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
        <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-400">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Shift Template</h2>
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
      className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 
        ${activeTab === tab 
          ? '!bg-white shadow-sm !text-blue-600' 
          : '!text-slate-400 !bg-transparent'
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
            <h3 className="md:text-lg text-[15px] font-black text-slate-800 mb-4 uppercase tracking-tighter">Shift Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Type *</label>
                <div className="relative">
                  <select 
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400"
                  >
                    <option value="Fixed Shift">Fixed Shift</option>
                    <option value="Open Shift">Open Shift</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

             
            </div>

            {shiftType === 'Open Shift' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                     <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Name *</label>
                  <input type="text" placeholder="Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
                </div>
               
              </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Work hours</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                       <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] font-bold appearance-none outline-none">
                         {workHoursHH.map(h => <option key={h} value={h}>{h}</option>)}
                       </select>
                       <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">:</span>
                    <div className="relative w-24">
                       <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] font-bold appearance-none outline-none">
                         {minutesList.filter(m => parseInt(m) % 5 === 0).map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                       <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase ml-2">hh:mm</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
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
          {shiftType === 'Fixed Shift' && (
            <div className="space-y-6 overflow-visible relative animate-in fade-in duration-300 mb-4">
                <div>
                     <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Name *</label>
                  <input type="text" placeholder="Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Code</label>
                  <input type="text" placeholder="Optional" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
                </div>
              </div>
                </div>
              <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest">Shift Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 overflow-visible relative">
                <div className="space-y-2 relative">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time *</label>
                  <div onClick={() => toggleSection('startTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 relative z-10">
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
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time *</label>
                  <div onClick={() => toggleSection('endTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 relative z-10">
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

              {/* <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
                <div className="h-4 bg-slate-200 rounded-full w-full relative overflow-hidden ring-1 ring-slate-300/50">
                  <div className="absolute inset-y-0 bg-emerald-400/30 transition-all duration-500" style={{ left: `${bufferLeft}%`, width: `${bufferWidth}%` }} />
                  <div className="absolute inset-y-0 bg-blue-600/20 border-x-2 border-blue-600 z-10 transition-all duration-700" style={{ left: `${shiftLeft}%`, width: `${shiftWidth}%` }} />
                </div>
                <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Buffer</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Break</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift</span></div>
                  </div>
                  <div className="text-[9px] font-black text-slate-500 uppercase">Max Break: <span className="text-slate-900">{totalBreakMins} mins</span> • Payable: <span className="text-blue-600 ml-1">{payH}h {payM}m</span></div>
                </div>
              </div> */}
              {/* 📊 ANALYTICS TIMELINE BAR */}
{/* <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
  <div className="h-4 bg-slate-200 rounded-full w-full relative overflow-hidden ring-1 ring-slate-300/50">
    

    <div 
      className="absolute inset-y-0 bg-emerald-400/30 transition-all duration-500" 
      style={{ left: `${bufferLeft}%`, width: `${bufferWidth}%` }} 
    />
    
 
    <div 
      className="absolute inset-y-0 bg-blue-600/20 border-x-2 border-blue-600 z-10 transition-all duration-700" 
      style={{ left: `${shiftLeft}%`, width: `${shiftWidth}%` }} 
    />


    {breakSegments.map((segment, i) => (
      <div 
        key={i}
        className="absolute inset-y-0 bg-amber-400 border-x border-amber-500 z-20 shadow-sm animate-in fade-in"
        style={{ left: `${segment.left}%`, width: `${segment.width}%` }} 
      />
    ))}
  </div>

  <div className="flex justify-between mt-4">
    <div className="flex items-center gap-4 text-left">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Buffer</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Break</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift</span>
      </div>
    </div>
    <div className="text-[9px] font-black text-slate-500 uppercase">
      Max Break: <span className="text-slate-900">{totalBreakMins} mins</span> • 
      Payable: <span className="text-blue-600 ml-1">{payH}h {payM}m</span>
    </div>
  </div>
</div> */}


{/* 📊 ANALYTICS TIMELINE BAR */}
<div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
  <div className="h-4 bg-slate-200 rounded-full w-full relative overflow-visible ring-1 ring-slate-300/50">
    
    {/* 🟢 BUFFER LAYER */}
    <div 
      className="absolute inset-y-0 bg-emerald-400/30 border-x border-emerald-400/50 transition-all duration-500 group hover:bg-emerald-400/50 hover:z-30 cursor-pointer" 
      style={{ left: `${bufferLeft}%`, width: `${adjustedBufferWidth}%` }} 
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        Buffer: {bufferStart.hh}:{bufferStart.mm} {bufferStart.ampm} - {bufferEnd.hh}:{bufferEnd.mm} {bufferEnd.ampm}
      </div>
    </div>
    
    {/* 🔵 SHIFT LAYER */}
    <div 
      className="absolute inset-y-0 bg-blue-600/20 border-x-2 border-blue-600 transition-all duration-700 group hover:bg-blue-600/40 hover:z-30 cursor-pointer" 
      style={{ left: `${shiftLeft}%`, width: `${adjustedShiftWidth}%`, zIndex: 10 }} 
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
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
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg flex items-center gap-1.5">
          <span className="text-amber-400">{segment.name}</span> | {segment.totalMins} Mins
        </div>
      </div>
    ))}
  </div>

  <div className="flex justify-between mt-6">
    <div className="flex items-center gap-4 text-left">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Buffer</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Break</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift</span>
      </div>
    </div>
    <div className="text-[9px] font-black text-slate-500 uppercase bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
      Max Break: <span className="text-slate-900">{totalBreakMins} mins</span> <span className="mx-1 text-slate-300">•</span> 
      Payable: <span className="text-blue-600 ml-1">{payH}h {payM}m</span>
    </div>
  </div>
</div>
            </div>
          )}

          {/* 🛡️ SECTION 3: BUFFER & BREAKS (HIDDEN FOR OPEN SHIFT) */}
          {shiftType === 'Fixed Shift' && (
            <div className="space-y-4 overflow-visible relative animate-in fade-in duration-300">
              <div className={`transition-all duration-300 border border-slate-200 rounded-2xl overflow-visible relative ${isBufferEditable ? 'bg-white shadow-md' : 'bg-slate-50/50'}`}>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Buffer Minutes</span>
                  {!isBufferEditable ? (
                    <Edit3 size={16} className="text-blue-500 cursor-pointer hover:scale-110 transition-all" onClick={() => setIsBufferEditable(true)} />
                  ) : (
                    <X size={16} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setIsBufferEditable(false)} />
                  )}
                </div>
                {isBufferEditable && (
                  <div className="md:px-6 px-4 pb-6 pt-2 overflow-visible relative z-[100]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 overflow-visible relative">
                      <div className="space-y-2 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Earliest Punch In</label>
                        <div onClick={() => toggleSection('bufferStart')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer relative z-10">
                          <Clock size={14} className="text-slate-300" /><span className="text-[11px] font-bold text-slate-700 flex-1">{bufferStart.hh}:{bufferStart.mm} {bufferStart.ampm}</span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferStart ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.bufferStart && (
                          <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
                            <TimePickerColumns state={bufferStart} setState={setBufferStart} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('bufferStart')} />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 relative">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Latest Punch Out</label>
                        <div onClick={() => toggleSection('bufferEnd')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer relative z-10">
                          <Clock size={14} className="text-slate-300" /><span className="text-[11px] font-bold text-slate-700 flex-1">{bufferEnd.hh}:{bufferEnd.mm} {bufferEnd.ampm}</span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferEnd ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.bufferEnd && (
                          <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
                            <TimePickerColumns state={bufferEnd} setState={setBufferEnd} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('bufferEnd')} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 !bg-white !text-blue-500  rounded-lg border border-blue-500 text-[10px] font-black uppercase shadow-sm active:scale-95 transition-all">Done</button>
                      <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 !bg-white border !border-blue-500 !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Discard</button>
                    </div>
                  </div>
                )}
              </div>
              {/* <button onClick={handleAddBreak} className="flex items-center gap-2 px-4 py-2 !text-blue-600 !bg-blue-50 rounded-xl hover:!bg-blue-100 border border-blue-500 active:scale-95 transition-all">
                <Plus size={16} strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">Add Break</span>
              </button> */}

              <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Breaks</h3>
        {breaks.length > 0 && (
          <button onClick={() => setBreaks([])} className="text-[10px] font-black !text-blue-500 uppercase !bg-transparent tracking-widest hover:underline">Clear All</button>
        )}
      </div>

      {breaks.map((brk, index) => (
        <div key={brk.id} className="bg-white border border-slate-200 rounded-xl px-2 py-8 md:p-6 shadow-sm relative animate-in slide-in-from-top-4 duration-300">
          {/* Remove Icon */}
          <button 
            onClick={() => handleRemoveBreak(brk.id)}
            className="absolute top-4 right-4 p-1.5 !bg-blue-50 !text-blue-500 rounded-lg hover:bg-white hover:text-white transition-all"
          >
            <X size={14} strokeWidth={3} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-2">
            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Category *</label>
              <select 
                value={brk.category}
                onChange={(e) => updateBreak(brk.id, 'category', e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Casual Break">Casual Break</option>
                <option value="Lunch Break">Lunch Break</option>
              </select>
            </div>

            {/* Break Name Input */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Break Name *</label>
              <input 
                type="text" 
                placeholder="Break Name"
                value={brk.name}
                onChange={(e) => updateBreak(brk.id, 'name', e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-400" 
              />
            </div>

            {/* Pay Type Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Pay Type *</label>
              <select 
                value={brk.payType}
                onChange={(e) => updateBreak(brk.id, 'payType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Type Dropdown (Image 2 logic) */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Type *</label>
              <select 
                value={brk.type}
                onChange={(e) => updateBreak(brk.id, 'type', e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none ring-2 ring-blue-500/5 focus:border-blue-500"
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
              //   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration *</label>
              //   <div className="flex items-center gap-2">
              //     <select className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none">
              //       {workHoursHH.slice(0, 5).map(h => <option key={h}>{h}</option>)}
              //     </select>
              //     <span className="text-slate-300">:</span>
              //     <select className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none">
              //       {['00', '15', '30', '45'].map(m => <option key={m}>{m}</option>)}
              //     </select>
              //     <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">hh:mm</span>
              //   </div>
              // </div>
              /* DURATION VIEW */
<div className="space-y-2">
  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration *</label>
  <div className="flex items-center gap-2">
    <select 
      value={brk.duration.hh}
      onChange={(e) => updateBreak(brk.id, 'duration', { ...brk.duration, hh: e.target.value })}
      className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-blue-400"
    >
      {workHoursHH.slice(0, 5).map(h => <option key={h} value={h}>{h}</option>)}
    </select>
    <span className="text-slate-300">:</span>
    <select 
      value={brk.duration.mm}
      onChange={(e) => updateBreak(brk.id, 'duration', { ...brk.duration, mm: e.target.value })}
      className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-blue-400"
    >
      {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
    </select>
    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">hh:mm</span>
  </div>
</div>
            ) : (
              /* INTERVALS VIEW (Image 3) */
             /* INTERVALS VIEW (Image 3) */
<div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Interval Configuration</p>
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
        <span className="text-[11px] font-black uppercase tracking-widest">Add Break</span>
      </button>
    </div>
            </div>
          )}
        </div>

        {/* 🛡️ FOOTER */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/90">
          <div className="mx-auto flex justify-end gap-3 px-2">
            <button onClick={() => navigate(-1)} className="px-6 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95">cancel</button>
            <button className="px-10 py-2.5 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase border border-blue-500 tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 flex items-center gap-2">Save</button>
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
      <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter ml-1">{label} *</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all border ${
          isOpen ? 'bg-white border-blue-400 ring-4 ring-blue-500/5' : 'bg-slate-50 border-slate-200 hover:bg-white'
        }`}
      >
        <span className="text-[10px] font-bold text-slate-700">{value}</span>
        <Clock size={12} className={isOpen ? 'text-blue-500' : 'text-slate-300'} />
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
//***********************************************working code pahse 1 17/03/26******************************************************* */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, Info, Edit3, Plus, Clock, ChevronDown, Calendar, X, ChevronUp 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateShiftTemplate = () => {
//   const navigate = useNavigate();
  
//   // --- 1. ALL STATES ---
//   const [shiftType, setShiftType] = useState('Fixed Shift');
//   const [isBufferEditable, setIsBufferEditable] = useState(false);
//   const [breaks, setBreaks] = useState([]);
//   const [workHours, setWorkHours] = useState({ hh: "00", mm: "00" });
//   const [showActionButtons, setShowActionButtons] = useState(true);
// const [activeTab, setActiveTab] = useState('Add Template');
//   // Main Shift Time States
//   const [startTime, setStartTime] = useState({ hh: "09", mm: "00", ampm: "AM" });
//   const [endTime, setEndTime] = useState({ hh: "06", mm: "00", ampm: "PM" });
  
//   // Buffer Time States
//   const [bufferStart, setBufferStart] = useState({ hh: "09", mm: "00", ampm: "AM" });
//   const [bufferEnd, setBufferEnd] = useState({ hh: "10", mm: "00", ampm: "PM" });
  
//   // Dropdown Open/Close logic
//   const [openSections, setOpenSections] = useState({
//     startTime: false,
//     endTime: false,
//     bufferStart: false,
//     bufferEnd: false
//   });

//   // --- 2. DATA ARRAYS ---
//   const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
//   const workHoursHH = Array.from({ length: 25 }, (_, i) => i.toString().padStart(2, '0'));
//   const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

//   // --- 3. HELPER LOGIC ---
//   const timeToMinutes = (timeObj) => {
//     if (!timeObj || !timeObj.hh) return 0;
//     let h = parseInt(timeObj.hh);
//     const m = parseInt(timeObj.mm);
//     if (timeObj.ampm === "PM" && h < 12) h += 12;
//     if (timeObj.ampm === "AM" && h === 12) h = 0;
//     return h * 60 + m;
//   };

//   const toggleSection = (section) => {
//     setOpenSections(prev => ({
//       startTime: false, endTime: false, bufferStart: false, bufferEnd: false,
//       [section]: !prev[section]
//     }));
//   };

//   // --- 4. CALCULATIONS FOR TIMELINE ---
//   const startMins = timeToMinutes(startTime);
//   const endMins = timeToMinutes(endTime);
//   const totalBreakMins = breaks.reduce((acc, b) => acc + b.duration, 0);
  
//   const shiftLeft = (startMins / 1440) * 100;
//   const shiftWidth = ((endMins - startMins) / 1440) * 100;
//   const bufferLeft = (timeToMinutes(bufferStart) / 1440) * 100;
//   const bufferWidth = ((timeToMinutes(bufferEnd) - timeToMinutes(bufferStart)) / 1440) * 100;

//   const netPayableMins = (endMins - startMins) - totalBreakMins;
//   const payH = Math.floor(Math.max(0, netPayableMins) / 60);
//   const payM = Math.max(0, netPayableMins) % 60;

//   const handleAddBreak = () => {
//     const newBreak = { id: Date.now(), duration: 30, start: startMins + 120 };
//     setBreaks([...breaks, newBreak]);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24 text-left">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
//         <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-400">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Shift Template</h2>
//       </div>

//       <div className=" mx-auto px-6 mt-8">
//         {/* TABS */}
//        {/* ✅ DYNAMIC TABS LOGIC */}
//        <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-8 border border-slate-200">
//   {['Add Template', 'Assign Rules'].map((tab) => (
//     <button 
//       key={tab} 
//       // ✅ LOGIC: Only allow clicking if it's 'Add Template'
//       onClick={() => tab === 'Add Template' && setActiveTab(tab)}
//       // ✅ LOGIC: Add disabled attribute for 'Assign Rules'
//       disabled={tab === 'Assign Rules'}
//       className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 
//         ${activeTab === tab 
//           ? '!bg-white shadow-sm !text-blue-600' 
//           : '!text-slate-400 !bg-transparent'
//         } 
//         ${tab === 'Assign Rules' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
//       `}
//     >
//       {tab}
//     </button>
//   ))}
// </div>

//         <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-10 overflow-visible relative">
          
//           {/* SECTION 1: CONFIGURATION */}
//           <div className="space-y-6">
//             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Shift Configuration</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Type *</label>
//                 <div className="relative">
//                   <select 
//                     value={shiftType}
//                     onChange={(e) => setShiftType(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400"
//                   >
//                     <option value="Fixed Shift">Fixed Shift</option>
//                     <option value="Open Shift">Open Shift</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 </div>
//               </div>

             
//             </div>

//             {shiftType === 'Open Shift' && (
//               <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
//                 <div>
//                      <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Name *</label>
//                   <input type="text" placeholder="Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
//                 </div>
               
//               </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Work hours</label>
//                   <div className="flex items-center gap-2">
//                     <div className="relative w-24">
//                        <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] font-bold appearance-none outline-none">
//                          {workHoursHH.map(h => <option key={h} value={h}>{h}</option>)}
//                        </select>
//                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
//                     </div>
//                     <span className="text-[10px] font-bold text-slate-400">:</span>
//                     <div className="relative w-24">
//                        <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] font-bold appearance-none outline-none">
//                          {minutesList.filter(m => parseInt(m) % 5 === 0).map(m => <option key={m} value={m}>{m}</option>)}
//                        </select>
//                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
//                     </div>
//                     <span className="text-[9px] font-black text-slate-300 uppercase ml-2">hh:mm</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
//     Show action buttons
//   </label>
//   <label className="relative inline-flex items-center cursor-pointer">
//     <input 
//       type="checkbox" 
//       className="sr-only peer" 
//       checked={showActionButtons}
//       onChange={() => setShowActionButtons(!showActionButtons)} 
//     />
//     <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 
//       after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
//       after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all 
//       peer-checked:after:translate-x-full">
//     </div>
//   </label>
// </div>
//               </div>
//             )}
//           </div>

//           {/* SECTION 2: SHIFT TIME (FIXED ONLY) */}
//           {shiftType === 'Fixed Shift' && (
//             <div className="space-y-6 overflow-visible relative animate-in fade-in duration-300">
//                 <div>
//                      <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Name *</label>
//                   <input type="text" placeholder="Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Code</label>
//                   <input type="text" placeholder="Optional" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
//                 </div>
//               </div>
//                 </div>
//               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Shift Time</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible relative">
//                 <div className="space-y-2 relative">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time *</label>
//                   <div onClick={() => toggleSection('startTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 relative z-10">
//                     <Clock size={16} className="text-slate-400" />
//                     <span className="text-[11px] font-bold text-slate-700 flex-1">{startTime.hh}:{startTime.mm} {startTime.ampm}</span>
//                     <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.startTime ? 'rotate-180' : ''}`} />
//                   </div>
//                   {openSections.startTime && (
//                     <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] flex h-[200px] overflow-hidden animate-in slide-in-from-bottom-2">
//                       <TimePickerColumns state={startTime} setState={setStartTime} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('startTime')} />
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-2 relative">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time *</label>
//                   <div onClick={() => toggleSection('endTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 relative z-10">
//                     <Clock size={16} className="text-slate-400" />
//                     <span className="text-[11px] font-bold text-slate-700 flex-1">{endTime.hh}:{endTime.mm} {endTime.ampm}</span>
//                     <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.endTime ? 'rotate-180' : ''}`} />
//                   </div>
//                   {openSections.endTime && (
//                     <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] flex h-[200px] overflow-hidden animate-in slide-in-from-bottom-2">
//                       <TimePickerColumns state={endTime} setState={setEndTime} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('endTime')} />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
//                 <div className="h-4 bg-slate-200 rounded-full w-full relative overflow-hidden ring-1 ring-slate-300/50">
//                   <div className="absolute inset-y-0 bg-emerald-400/30 transition-all duration-500" style={{ left: `${bufferLeft}%`, width: `${bufferWidth}%` }} />
//                   <div className="absolute inset-y-0 bg-blue-600/20 border-x-2 border-blue-600 z-10 transition-all duration-700" style={{ left: `${shiftLeft}%`, width: `${shiftWidth}%` }} />
//                 </div>
//                 <div className="flex justify-between mt-4">
//                   <div className="flex items-center gap-4 text-left">
//                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Buffer</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Break</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift</span></div>
//                   </div>
//                   <div className="text-[9px] font-black text-slate-500 uppercase">Max Break: <span className="text-slate-900">{totalBreakMins} mins</span> • Payable: <span className="text-blue-600 ml-1">{payH}h {payM}m</span></div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* 🛡️ SECTION 3: BUFFER & BREAKS (HIDDEN FOR OPEN SHIFT) */}
//           {shiftType === 'Fixed Shift' && (
//             <div className="space-y-4 overflow-visible relative animate-in fade-in duration-300">
//               <div className={`transition-all duration-300 border border-slate-200 rounded-2xl overflow-visible relative ${isBufferEditable ? 'bg-white shadow-md' : 'bg-slate-50/50'}`}>
//                 <div className="p-4 flex items-center justify-between">
//                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Buffer Minutes</span>
//                   {!isBufferEditable ? (
//                     <Edit3 size={16} className="text-blue-500 cursor-pointer hover:scale-110 transition-all" onClick={() => setIsBufferEditable(true)} />
//                   ) : (
//                     <X size={16} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setIsBufferEditable(false)} />
//                   )}
//                 </div>
//                 {isBufferEditable && (
//                   <div className="px-6 pb-6 pt-2 overflow-visible relative z-[100]">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 overflow-visible relative">
//                       <div className="space-y-2 relative">
//                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Earliest Punch In</label>
//                         <div onClick={() => toggleSection('bufferStart')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer relative z-10">
//                           <Clock size={14} className="text-slate-300" /><span className="text-[11px] font-bold text-slate-700 flex-1">{bufferStart.hh}:{bufferStart.mm} {bufferStart.ampm}</span>
//                           <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferStart ? 'rotate-180' : ''}`} />
//                         </div>
//                         {openSections.bufferStart && (
//                           <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
//                             <TimePickerColumns state={bufferStart} setState={setBufferStart} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('bufferStart')} />
//                           </div>
//                         )}
//                       </div>
//                       <div className="space-y-2 relative">
//                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Latest Punch Out</label>
//                         <div onClick={() => toggleSection('bufferEnd')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer relative z-10">
//                           <Clock size={14} className="text-slate-300" /><span className="text-[11px] font-bold text-slate-700 flex-1">{bufferEnd.hh}:{bufferEnd.mm} {bufferEnd.ampm}</span>
//                           <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferEnd ? 'rotate-180' : ''}`} />
//                         </div>
//                         {openSections.bufferEnd && (
//                           <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
//                             <TimePickerColumns state={bufferEnd} setState={setBufferEnd} hours={hoursList} minutes={minutesList} onClose={() => toggleSection('bufferEnd')} />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 !bg-white !text-blue-500  rounded-xl border border-blue-500 text-[10px] font-black uppercase shadow-sm active:scale-95 transition-all">Done</button>
//                       <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 !bg-white border !border-blue-500 !text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Discard</button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <button onClick={handleAddBreak} className="flex items-center gap-2 px-4 py-2 !text-blue-600 !bg-blue-50 rounded-xl hover:!bg-blue-100 border border-blue-500 active:scale-95 transition-all">
//                 <Plus size={16} strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">Add Break</span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* 🛡️ FOOTER */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/90">
//           <div className="mx-auto flex justify-end gap-3 px-2">
//             <button onClick={() => navigate(-1)} className="px-6 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95">cancel</button>
//             <button className="px-10 py-2.5 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase border border-blue-500 tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 flex items-center gap-2">Save</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // HELPER: TIME PICKER UI
// const TimePickerColumns = ({ state, setState, hours, minutes, onClose }) => (
//   <>
//     <div className="flex-1 overflow-y-auto p-1 border-r border-slate-50 custom-scrollbar bg-white">
//       {hours.map(h => <div key={h} onClick={() => setState({...state, hh: h})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer transition-all ${state.hh === h ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}>{h}</div>)}
//     </div>
//     <div className="flex-1 overflow-y-auto p-1 border-r border-slate-50 custom-scrollbar bg-white">
//       {minutes.map(m => <div key={m} onClick={() => setState({...state, mm: m})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer transition-all ${state.mm === m ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}>{m}</div>)}
//     </div>
//     <div className="w-14 p-1 bg-slate-50 flex flex-col">
//       {['AM', 'PM'].map(p => <div key={p} onClick={() => {setState({...state, ampm: p}); onClose();}} className={`py-3 text-[10px] font-black text-center rounded-lg cursor-pointer mb-1 transition-all ${state.ampm === p ? 'bg-white text-blue-600 border border-slate-100 shadow-sm' : 'text-slate-400'}`}>{p}</div>)}
//     </div>
//   </>
// );

// export default CreateShiftTemplate;
//*********************************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, Info, Edit3, Plus, Clock, ChevronDown, Calendar, X, ChevronUp 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateShiftTemplate = () => {
//   const navigate = useNavigate();
//   const [shiftType, setShiftType] = useState('Fixed Shift');
//   const [isBufferEditable, setIsBufferEditable] = useState(false);
// const [breaks, setBreaks] = useState([]);
//   // States for Time Picker
//   const [startTime, setStartTime] = useState({ hh: "09", mm: "00", ampm: "AM" });
//   const [endTime, setEndTime] = useState({ hh: "06", mm: "00", ampm: "PM" });
//   const [bufferStart, setBufferStart] = useState({ hh: "09", mm: "00", ampm: "AM" });
//   const [bufferEnd, setBufferEnd] = useState({ hh: "10", mm: "00", ampm: "PM" });
  
//   const [openSections, setOpenSections] = useState({
//     startTime: false,
//     endTime: false,
//     bufferStart: false,
//     bufferEnd: false
//   });

//   const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
//   const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

//   // 1. Helper Logic: Convert time object to minutes from midnight
//  // ✅ FIXED: Single declaration of time conversion logic
//   const timeToMinutes = (timeObj) => {
//     if (!timeObj || !timeObj.hh) return 0;
//     let h = parseInt(timeObj.hh);
//     const m = parseInt(timeObj.mm);
//     if (timeObj.ampm === "PM" && h < 12) h += 12;
//     if (timeObj.ampm === "AM" && h === 12) h = 0;
//     return h * 60 + m;
//   };

//   // 2. Calculate percentages for the CSS
//   const startMins = timeToMinutes(startTime);
//   const endMins = timeToMinutes(endTime);
//   const bufStartMins = timeToMinutes(bufferStart);
//   const bufEndMins = timeToMinutes(bufferEnd);

//   // Total minutes in a day = 1440
//   const shiftLeft = (startMins / 1440) * 100;
//   const shiftWidth = ((endMins - startMins) / 1440) * 100;
  
//   const bufferLeft = (bufStartMins / 1440) * 100;
//   const bufferWidth = ((bufEndMins - bufStartMins) / 1440) * 100;

//   // Calculate Payable Hours
//   const diff = endMins - startMins;
// //   const payH = Math.floor(diff / 60);
// //   const payM = diff % 60;

//   const toggleSection = (section) => {
//     setOpenSections(prev => ({
//       startTime: false,
//       endTime: false,
//       bufferStart: false,
//       bufferEnd: false,
//       [section]: !prev[section]
//     }));
//   };

// // --- Calculations for the Stats ---
// const totalBreakMins = breaks.reduce((acc, b) => acc + b.duration, 0);

// const shiftStartMins = timeToMinutes(startTime);
// const shiftEndMins = timeToMinutes(endTime);


// const netPayableMins = (endMins - startMins) - totalBreakMins;
//   const payH = Math.floor(Math.max(0, netPayableMins) / 60);
//   const payM = Math.max(0, netPayableMins) % 60;

// // Function to handle Add Break (Example: adds a default 30 min break)
// const handleAddBreak = () => {
//   const newBreak = {
//     id: Date.now(),
//     duration: 30, // You can later connect this to a time picker
//     start: shiftStartMins + 120, // Example: start 2 hours after shift
//   };
//   setBreaks([...breaks, newBreak]);
// };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
//         <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Shift Template</h2>
//       </div>

//       <div className="mx-auto px-6 mt-8">
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-8 border border-slate-200">
//           {['Add Template', 'Assign Rules'].map((tab) => (
//             <button key={tab} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${tab === 'Add Template' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-10 overflow-visible relative">
          
//           {/* SECTION 1: CONFIGURATION */}
//           <div className="space-y-6">
//             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Shift Configuration</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Type *</label>
//                 <div className="relative">
//                   <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400">
//                     <option>Fixed Shift</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Name *</label>
//                   <input type="text" placeholder="e.g. Morning" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Code</label>
//                   <input type="text" placeholder="Optional" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 🕒 SECTION 2: SHIFT TIME */}
//           <div className="space-y-6 overflow-visible relative">
//             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Shift Time</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible relative z-[50]">
              
//               {/* START TIME */}
//               <div className="space-y-2 relative">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time *</label>
//                 <div onClick={() => toggleSection('startTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition-all">
//                   <Clock size={16} className="text-slate-400" />
//                   <span className="text-[11px] font-bold text-slate-700 flex-1">{startTime.hh}:{startTime.mm} {startTime.ampm}</span>
//                   <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.startTime ? 'rotate-180' : ''}`} />
//                 </div>
//                 {openSections.startTime && (
//                   <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] flex h-[200px] overflow-hidden animate-in slide-in-from-bottom-2">
//                     <TimePickerColumns state={startTime} setState={setStartTime} hours={hours} minutes={minutes} onClose={() => toggleSection('startTime')} />
//                   </div>
//                 )}
//               </div>

//               {/* END TIME */}
//               <div className="space-y-2 relative">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time *</label>
//                 <div onClick={() => toggleSection('endTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition-all">
//                   <Clock size={16} className="text-slate-400" />
//                   <span className="text-[11px] font-bold text-slate-700 flex-1">{endTime.hh}:{endTime.mm} {endTime.ampm}</span>
//                   <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.endTime ? 'rotate-180' : ''}`} />
//                 </div>
//                 {openSections.endTime && (
//                   <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] flex h-[200px] overflow-hidden animate-in slide-in-from-bottom-2">
//                     <TimePickerColumns state={endTime} setState={setEndTime} hours={hours} minutes={minutes} onClose={() => toggleSection('endTime')} />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Visual Timeline */}
//             <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
//       {/* The Container Bar */}
//       <div className="h-4 bg-slate-200 rounded-full w-full relative overflow-hidden ring-1 ring-slate-300/50">
        
//         {/* 🟢 Buffer Area (Emerald) */}
//         <div 
//           className="absolute inset-y-0 bg-emerald-400/30 border-x border-emerald-500/50 transition-all duration-500"
//           style={{ left: `${bufferLeft}%`, width: `${bufferWidth}%` }}
//         />

//         {/* 🔵 Shift Area (Blue) */}
//         <div 
//           className="absolute inset-y-0 bg-blue-600/20 border-x-2 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-700"
//           style={{ left: `${shiftLeft}%`, width: `${shiftWidth}%` }}
//         />
        
//       </div>

//       {/* Legend and Stats */}
//       <div className="flex justify-between mt-4">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-1.5">
//             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Buffer</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Break</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift</span>
//           </div>
//         </div>
        
//         <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter shadow-sm">
//           Max Break: <span className="text-slate-900">0 mins</span> • 
//           Payable: <span className="text-blue-600 ml-1">{payH}h {payM}m</span>
//         </div>
//       </div>
//     </div>
//           </div>

//           {/* 🛡️ SECTION 3: BUFFER & BREAKS */}
//           <div className="space-y-4 overflow-visible relative">
//             <div className={`transition-all duration-300 border border-slate-200 rounded-2xl overflow-visible relative ${isBufferEditable ? 'bg-white shadow-md' : 'bg-slate-50/50'}`}>
//               <div className="p-4 flex items-center justify-between">
//                 <div className="flex flex-col">
//                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Buffer Minutes</span>
//                   {isBufferEditable && (
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-2">
//                       Punch: {bufferStart.hh}:{bufferStart.mm} {bufferStart.ampm} - {bufferEnd.hh}:{bufferEnd.mm} {bufferEnd.ampm}
//                     </p>
//                   )}
//                 </div>
//                 {!isBufferEditable ? (
//                   <Edit3 size={16} className="text-blue-500 cursor-pointer" onClick={() => setIsBufferEditable(true)} />
//                 ) : (
//                   <X size={16} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setIsBufferEditable(false)} />
//                 )}
//               </div>

//               {isBufferEditable && (
//                 <div className="px-6 pb-6 pt-2 overflow-visible relative z-[100]">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 overflow-visible relative">
                    
//                     {/* BUFFER START */}
//                     <div className="space-y-2 relative">
//                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Earliest Punch In</label>
//                       <div onClick={() => toggleSection('bufferStart')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer">
//                         <Clock size={14} className="text-slate-300" />
//                         <span className="text-[11px] font-bold text-slate-700 flex-1">{bufferStart.hh}:{bufferStart.mm} {bufferStart.ampm}</span>
//                         <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferStart ? 'rotate-180' : ''}`} />
//                       </div>
//                       {openSections.bufferStart && (
//                         <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
//                           <TimePickerColumns state={bufferStart} setState={setBufferStart} hours={hours} minutes={minutes} onClose={() => toggleSection('bufferStart')} />
//                         </div>
//                       )}
//                     </div>

//                     {/* BUFFER END */}
//                     <div className="space-y-2 relative">
//                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Latest Punch Out</label>
//                       <div onClick={() => toggleSection('bufferEnd')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer">
//                         <Clock size={14} className="text-slate-300" />
//                         <span className="text-[11px] font-bold text-slate-700 flex-1">{bufferEnd.hh}:{bufferEnd.mm} {bufferEnd.ampm}</span>
//                         <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferEnd ? 'rotate-180' : ''}`} />
//                       </div>
//                       {openSections.bufferEnd && (
//                         <div className="absolute bottom-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] flex h-[180px] overflow-hidden animate-in slide-in-from-bottom-2">
//                           <TimePickerColumns state={bufferEnd} setState={setBufferEnd} hours={hours} minutes={minutes} onClose={() => toggleSection('bufferEnd')} />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 !bg-white !text-blue-500 border border-blue-500 rounded-xl text-[10px] font-black uppercase shadow-sm shadow-blue-100 active:scale-95 transition-all">Done</button>
//                     <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all">Discard</button>
//                   </div>
//                 </div>
//               )}
//             </div>

//                 <button 
//   onClick={handleAddBreak}
//   className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 active:scale-95 transition-all"
// >
//   <Plus size={16} strokeWidth={3} />
//   <span className="text-[10px] font-black uppercase tracking-widest">Add Break</span>
// </button>
//           </div>
//         </div>

//         {/* 🛡️ FIXED FOOTER SAVE */}
//    {/* 🛡️ FIXED FOOTER ACTIONS */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/90">
//           <div className=" mx-auto flex justify-end gap-3 px-2">
//             {/* Discard Button */}
//             <button 
//               onClick={() => navigate(-1)}
//               className="px-6 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:!bg-slate-50 hover:!text-slate-700 transition-all active:scale-95"
//             >
//               cancel
//             </button>
            
//             {/* Primary Save Button */}
//             <button 
//               className="px-10 py-2.5 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase border border-blue-500 tracking-widest shadow-sm shadow-blue-200 hover:!bg-white transition-all active:scale-95 flex items-center gap-2"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // HELPER: TIME PICKER UI (INTEGRATED)
// const TimePickerColumns = ({ state, setState, hours, minutes, onClose }) => (
//   <>
//     <div className="flex-1 overflow-y-auto p-1 border-r border-slate-50 custom-scrollbar">
//       {hours.map(h => (
//         <div key={h} onClick={() => setState({...state, hh: h})} 
//           className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer transition-colors ${state.hh === h ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}>
//           {h}
//         </div>
//       ))}
//     </div>
//     <div className="flex-1 overflow-y-auto p-1 border-r border-slate-50 custom-scrollbar">
//       {minutes.map(m => (
//         <div key={m} onClick={() => setState({...state, mm: m})} 
//           className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer transition-colors ${state.mm === m ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}>
//           {m}
//         </div>
//       ))}
//     </div>
//     <div className="w-14 p-1 bg-slate-50 flex flex-col">
//       {['AM', 'PM'].map(p => (
//         <div key={p} onClick={() => {setState({...state, ampm: p}); onClose();}} 
//           className={`py-3 text-[10px] font-black text-center rounded-lg cursor-pointer mb-1 transition-all ${state.ampm === p ? 'bg-white text-blue-600 border border-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
//           {p}
//         </div>
//       ))}
//     </div>
//   </>
// );

// export default CreateShiftTemplate;


//****************************************************************************************************** */

// import React, { useState } from 'react';
// import { 
//   ArrowLeft, Info, Edit3, Plus, Clock, ChevronDown, Calendar, X, ChevronUp 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateShiftTemplate = () => {
//   const navigate = useNavigate();
//   const [shiftType, setShiftType] = useState('Fixed Shift');
//   const [isBufferEditable, setIsBufferEditable] = useState(false);

//   // ✅ 1. ADDED MISSING STATES FOR TIME PICKER
//   const [startTime, setStartTime] = useState({ hh: "09", mm: "00", ampm: "AM" });
//   const [endTime, setEndTime] = useState({ hh: "06", mm: "00", ampm: "PM" });
//   const [openSections, setOpenSections] = useState({
//     startTime: false,
//     endTime: false
//   });

//   // ✅ 2. HELPER DATA FOR PICKER
//   const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
//   const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

//   const toggleSection = (section) => {
//     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
//         <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Shift Template</h2>
//       </div>

//       <div className="max-w-4xl mx-auto px-6 mt-8">
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-8 border border-slate-200">
//           {['Add Template', 'Assign Rules'].map((tab) => (
//             <button key={tab} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'Add Template' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-10">
          
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Shift Configuration</h3>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure your shift here. Set names, timings and buffer.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Shift Type <span className="text-red-500">*</span></label>
//                 <div className="relative">
//                   <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 transition-all">
//                     <option>Fixed Shift</option>
//                     <option>Flexible Shift</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Name <span className="text-red-500">*</span></label>
//                   <input type="text" placeholder="e.g. Morning" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Shift Code</label>
//                   <input type="text" placeholder="Optional" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 🕒 SECTION 2: SHIFT TIME (UPDATED WITH DROPDOWNS) */}
//           <div className="space-y-6">
//             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Shift Time</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* START TIME */}
//               <div className="space-y-2 relative">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Start Time <span className="text-red-500">*</span></label>
//                 <div onClick={() => toggleSection('startTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition-all">
//                   <Clock size={16} className="text-slate-400" />
//                   <span className="text-[11px] font-bold text-slate-700 flex-1">{startTime.hh}:{startTime.mm} {startTime.ampm}</span>
//                   <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.startTime ? 'rotate-180' : ''}`} />
//                 </div>

//                 {openSections.startTime && (
//                   <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 flex h-[200px] overflow-hidden animate-in zoom-in-95 duration-200">
//                     <div className="flex-1 overflow-y-auto p-1 custom-scrollbar border-r border-slate-50">
//                       {hours.map(h => <div key={h} onClick={() => setStartTime({...startTime, hh: h})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer ${startTime.hh === h ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}>{h}</div>)}
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-1 custom-scrollbar border-r border-slate-50">
//                       {minutes.map(m => <div key={m} onClick={() => setStartTime({...startTime, mm: m})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer ${startTime.mm === m ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}>{m}</div>)}
//                     </div>
//                     <div className="w-14 p-1 bg-slate-50">
//                       {['AM', 'PM'].map(p => <div key={p} onClick={() => {setStartTime({...startTime, ampm: p}); toggleSection('startTime');}} className={`py-3 text-[10px] font-black text-center rounded-lg cursor-pointer mb-1 ${startTime.ampm === p ? 'bg-white text-blue-600 border shadow-sm' : 'text-slate-400'}`}>{p}</div>)}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* END TIME */}
//               <div className="space-y-2 relative">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">End Time <span className="text-red-500">*</span></label>
//                 <div onClick={() => toggleSection('endTime')} className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition-all">
//                   <Clock size={16} className="text-slate-400" />
//                   <span className="text-[11px] font-bold text-slate-700 flex-1">{endTime.hh}:{endTime.mm} {endTime.ampm}</span>
//                   <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.endTime ? 'rotate-180' : ''}`} />
//                 </div>

//                 {openSections.endTime && (
//                   <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 flex h-[200px] overflow-hidden animate-in zoom-in-95 duration-200">
//                     <div className="flex-1 overflow-y-auto p-1 custom-scrollbar border-r border-slate-50">
//                       {hours.map(h => <div key={h} onClick={() => setEndTime({...endTime, hh: h})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer ${endTime.hh === h ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}>{h}</div>)}
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-1 custom-scrollbar border-r border-slate-50">
//                       {minutes.map(m => <div key={m} onClick={() => setEndTime({...endTime, mm: m})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer ${endTime.mm === m ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}>{m}</div>)}
//                     </div>
//                     <div className="w-14 p-1 bg-slate-50">
//                       {['AM', 'PM'].map(p => <div key={p} onClick={() => {setEndTime({...endTime, ampm: p}); toggleSection('endTime');}} className={`py-3 text-[10px] font-black text-center rounded-lg cursor-pointer mb-1 ${endTime.ampm === p ? 'bg-white text-blue-600 border shadow-sm' : 'text-slate-400'}`}>{p}</div>)}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Timeline Visual */}
//             <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
//                <div className="h-4 bg-slate-200 rounded-full w-full relative overflow-hidden">
//                   <div className="absolute inset-y-0 left-[20%] right-[30%] bg-blue-400/20 border-x-2 border-blue-400" />
//                </div>
//                <div className="flex justify-between mt-4">
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[9px] font-black text-slate-400 uppercase">Buffer</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] font-black text-slate-400 uppercase">Break</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-[9px] font-black text-slate-400 uppercase">Shift</span></div>
//                   </div>
//                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Max Break: 0 mins • Payable: 0h 0m</div>
//                </div>
//             </div>
//           </div>

//           {/* SECTION 3: BUFFER & BREAKS */}
//        {/* SECTION 3: BUFFER & BREAKS */}
// <div className="space-y-4">
//   <div className={`transition-all duration-300 border border-slate-200 rounded-2xl overflow-hidden ${isBufferEditable ? 'bg-white shadow-md' : 'bg-slate-50/50'}`}>
//     <div className="p-4 flex items-center justify-between">
//       <div className="flex flex-col">
//         <div className="flex items-center gap-3">
//           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Buffer Minutes</span>
//           <Info size={14} className="text-slate-300" />
//         </div>
//         {isBufferEditable && (
//           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-2">
//             First Possible Punch-In: <span className="text-slate-600">09:00 AM</span> | Last Possible Punch-Out: <span className="text-slate-600">10:00 PM</span>
//           </p>
//         )}
//       </div>
//       {!isBufferEditable ? (
//         <Edit3 size={16} className="text-blue-500 cursor-pointer hover:scale-110 transition-transform" onClick={() => setIsBufferEditable(true)} />
//       ) : (
//         <X size={16} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setIsBufferEditable(false)} />
//       )}
//     </div>

//     {isBufferEditable && (
//       <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-2">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
//           {/* 🕒 EARLIEST PUNCH IN DROPDOWN */}
//           <div className="space-y-2 relative">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Earliest allowed punch in time</label>
//             <div 
//               onClick={() => toggleSection('bufferStart')}
//               className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition-all"
//             >
//               <Clock size={14} className="text-slate-300" />
//               <span className="text-[11px] font-bold text-slate-700 flex-1">09:00 AM</span>
//               <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferStart ? 'rotate-180' : ''}`} />
//             </div>

//             {openSections.bufferStart && (
//               <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 flex h-[180px] overflow-hidden animate-in zoom-in-95 duration-200">
//                 <div className="flex-1 overflow-y-auto p-1 custom-scrollbar border-r border-slate-50">
//                   {hours.map(h => <div key={h} className="py-1.5 text-[10px] font-bold text-center rounded-lg hover:bg-slate-50 cursor-pointer text-slate-600">{h}</div>)}
//                 </div>
//                 <div className="flex-1 overflow-y-auto p-1 custom-scrollbar border-r border-slate-50">
//                   {minutes.map(m => <div key={m} className="py-1.5 text-[10px] font-bold text-center rounded-lg hover:bg-slate-50 cursor-pointer text-slate-600">{m}</div>)}
//                 </div>
//                 <div className="w-12 p-1 bg-slate-50">
//                   {['AM', 'PM'].map(p => <div key={p} className="py-2 text-[9px] font-black text-center rounded-lg cursor-pointer text-slate-400">{p}</div>)}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* 🕒 LATEST PUNCH OUT DROPDOWN */}
//           <div className="space-y-2 relative">
//             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Latest allowed punch out time</label>
//             <div 
//               onClick={() => toggleSection('bufferEnd')}
//               className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition-all"
//             >
//               <Clock size={14} className="text-slate-300" />
//               <span className="text-[11px] font-bold text-slate-700 flex-1">10:00 PM</span>
//               <ChevronDown size={14} className={`text-slate-400 transition-transform ${openSections.bufferEnd ? 'rotate-180' : ''}`} />
//             </div>

//             {openSections.bufferEnd && (
//               <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-100 flex h-[180px] overflow-hidden animate-in zoom-in-95 duration-200">
//                 <div className="flex-1 overflow-y-auto p-1 custom-scrollbar border-r border-slate-50">
//                   {hours.map(h => <div key={h} className="py-1.5 text-[10px] font-bold text-center rounded-lg hover:bg-slate-50 cursor-pointer text-slate-600">{h}</div>)}
//                 </div>
//                 <div className="flex-1 overflow-y-auto p-1 custom-scrollbar border-r border-slate-50">
//                   {minutes.map(m => <div key={m} className="py-1.5 text-[10px] font-bold text-center rounded-lg hover:bg-slate-50 cursor-pointer text-slate-600">{m}</div>)}
//                 </div>
//                 <div className="w-12 p-1 bg-slate-50">
//                   {['AM', 'PM'].map(p => <div key={p} className="py-2 text-[9px] font-black text-center rounded-lg cursor-pointer text-slate-400">{p}</div>)}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div className="flex gap-2">
//           <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all">Done</button>
//           <button onClick={() => setIsBufferEditable(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Discard</button>
//         </div>
//       </div>
//     )}
//   </div>

//   <button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">
//     <Plus size={16} strokeWidth={3} />
//     <span className="text-[10px] font-black uppercase tracking-widest">Add Break</span>
//   </button>
// </div>
//         </div>

//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-end gap-4 z-40">
//            <button className="px-8 py-2.5 bg-slate-200 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest cursor-not-allowed">
//               Save
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // HELPER: TIME PICKER UI (RESTORED)
// const TimePickerColumns = ({ state, setState, hours, minutes, onClose }) => (
//   <>
//     <div className="flex-1 overflow-y-auto p-1 border-r border-slate-50 custom-scrollbar">
//       {hours.map(h => <div key={h} onClick={() => setState({...state, hh: h})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer ${state.hh === h ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}>{h}</div>)}
//     </div>
//     <div className="flex-1 overflow-y-auto p-1 border-r border-slate-50 custom-scrollbar">
//       {minutes.map(m => <div key={m} onClick={() => setState({...state, mm: m})} className={`py-2 text-[11px] font-bold text-center rounded-lg cursor-pointer ${state.mm === m ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}>{m}</div>)}
//     </div>
//     <div className="w-14 p-1 bg-slate-50 flex flex-col">
//       {['AM', 'PM'].map(p => <div key={p} onClick={() => {setState({...state, ampm: p}); onClose();}} className={`py-3 text-[10px] font-black text-center rounded-lg cursor-pointer mb-1 ${state.ampm === p ? 'bg-white text-blue-600 border shadow-sm' : 'text-slate-400'}`}>{p}</div>)}
//     </div>
//   </>
// );

// export default CreateShiftTemplate;