import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Info, 
  ChevronDown, 
  MapPin, 
  Clock,
  Camera, 
  MousePointer2, 
  CheckCircle2,
  CalendarDays,
  Timer,
  ShieldCheck,
  UserX
} from 'lucide-react';

const CreateAttendaceTemplate = () => {
  const [selectedMode, setSelectedMode] = useState('manual');
  const navigate = useNavigate(); 
  const location = useLocation();
  const editData = location.state?.templateData;
  // New states for the additional toggles
  const [settings, setSettings] = useState({
    holidayAttendance: 'no_allow',
    trackInOut: true,
    noPunchOut: false,
    multiplePunches: false,
    autoApprove: false,
    markAbsent: false,
    effectiveWorkingHours: 'do_not_show'
  });
  const [templateName, setTemplateName] = useState('');
  // --- ADD THIS BLOCK ---
const [autoApproveData, setAutoApproveData] = useState({
  attendanceItems: [],
  automationItems: [],
  approvalDays: ''
});

// State for open/close status of custom dropdowns
const [activeDropdown, setActiveDropdown] = useState(null); // 'attendance' or 'automation'


// Multi-select logic with "Select All" support
const handleMultiSelect = (key, value) => {
  setAutoApproveData(prev => {
    const current = prev[key];
    const options = key === 'attendanceItems' 
      ? ['Lens Attendance', 'Location Attendance', 'Selfie & Location Attendance']
      : ['Overtimes', 'Fines'];

    if (value === 'Select All') {
      return { ...prev, [key]: current.length === options.length ? [] : options };
    }

    const isSelected = current.includes(value);
    return {
      ...prev,
      [key]: isSelected ? current.filter(i => i !== value) : [...current, value]
    };
  });
};
// ----------------------

 

  useEffect(() => {
    if (editData) {
      setTemplateName(editData.name);
      // If your API provides specific settings, set them here:
      // setSelectedMode(editData.mode);
      // setSettings(editData.settings);
    }
  }, [editData]);

  // Helper function to toggle settings
  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const modes = [
    {
      id: 'default',
      title: 'Mark Present by Default',
      desc: 'Default auto present, can be changed manually',
      icon: <CheckCircle2 size={14} />
    },
    {
      id: 'manual',
      title: 'Manual Attendance',
      desc: 'Attendance is neutral by default, should be marked manually',
      icon: <MousePointer2 size={14} />
    },
    {
      id: 'location',
      title: 'Location Based',
      desc: 'Staff can mark their own attendance. Location captured automatically',
      icon: <MapPin size={14} />
    },
    {
      id: 'selfie',
      title: 'Selfie & Location Based',
      desc: 'Staff mark attendance with Selfie. Location captured automatically',
      icon: <Camera size={14} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] pb-32">
      {/* 🚀 FIXED TOP BAR */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)} 
             className="p-1.5 hover:!bg-slate-50 rounded-lg !text-slate-400 transition-all !bg-transparent border-0">
            <ArrowLeft size={18} />
          </button>
          <div>
            {/* <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Template</h1> */}
            <h1 className="md:text-sm text-[10px] font-black text-slate-900 uppercase tracking-tight">
              {editData ? 'Edit Template' : 'Create Template'}
            </h1>
            <p className="md:text-[9px] text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Attendance Template</p>
          </div>
        </div>
      </div>

      <div className="mx-auto px-1 md:px-4 mt-4 space-y-3">
        
 
        {/* 🏷️ NAME SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2"> 
              <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1 block">Template Name </label>
          {/* <input 
            type="text" 
            placeholder="e.g. Field Staff Template"
            className="w-full bg-slate-50 border border-slate-400 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
          /> */}
          <input 
                type="text" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. Field Staff Template"
                className="w-full bg-slate-50 border border-slate-400 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
              />
              </div>
            </div>
          
        </div>

        {/* ⚙️ SETTINGS SECTION - UPDATED TO GRID */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                <Settings2 size={14} />
              </div>
              <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Attendance Mode </h2>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </div>

          {/* 🔥 GRID LAYOUT IMPLEMENTED HERE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {modes.map((mode) => (
              <div 
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${selectedMode === mode.id ? 'bg-blue-50/30 border-blue-200 shadow-sm' : 'bg-transparent border-slate-50 hover:bg-slate-50 hover:border-slate-200'}`}
              >
                <div className="mt-0.5">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMode === mode.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
                    {selectedMode === mode.id && <div className="w-1 h-1 rounded-full bg-white animate-in zoom-in-50" />}
                  </div>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`transition-colors ${selectedMode === mode.id ? 'text-blue-600' : 'text-slate-400'}`}>{mode.icon}</span>
                    <h3 className={`text-[10px] font-black uppercase tracking-tight leading-tight ${selectedMode === mode.id ? 'text-blue-700' : 'text-slate-700'}`}>{mode.title}</h3>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-tight line-clamp-2">{mode.desc}</p>
                </div>
                {selectedMode === mode.id && (
                  <div className="absolute inset-y-2 left-0 w-0.5 bg-blue-600 rounded-r-full" />
                )}
              </div>
            ))}
          </div>
        </div>


           <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> 
             {/* 🏔️ EXTRA: ATTENDANCE ON HOLIDAYS */}
        <SettingsCard title="Attendance on Holidays" desc="Configure rules for marking attendance on paid holidays" icon={<CalendarDays size={14} />}>
          <div className="space-y-1 mt-2">
            {['Do NOT Allow', 'Comp Off', 'Allow attendance'].map((opt) => (
              <label key={opt} className="flex items-center w-full  gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent transition-colors">
                <input type="radio" name="holiday" className="w-3 h-3 text-blue-600 accent-blue-600" />
                <span className="text-[10px] ml-1 font-bold text-slate-600 uppercase tracking-wide">{opt}</span>
              </label>
            ))}
          </div>
        </SettingsCard>

        {/* ⏱️ EXTRA: TRACK IN & OUT TIME */}
        <SettingsCard title="Track In & Out Time" desc="Track exact punch-in and punch-out timestamps" icon={<Timer size={14} />}>
          <div className="mt-2 space-y-2">
            <ToggleItem label="Track In & Out Time" active={settings.trackInOut} onToggle={() => toggleSetting('trackInOut')} />
            <ToggleItem label="No attendance without punch-out" active={settings.noPunchOut} onToggle={() => toggleSetting('noPunchOut')} />
            <ToggleItem label="Allow Multiple Punches" active={settings.multiplePunches} onToggle={() => toggleSetting('multiplePunches')} />
          </div>
        </SettingsCard>

        {/* ✅ EXTRA: AUTO APPROVE */}
        {/* <SettingsCard title="Auto Approve Items" desc="Automatically approve attendance items after set days" icon={<ShieldCheck size={14} />}>
          <ToggleItem label="Enable Auto Approval" active={settings.autoApprove} onToggle={() => toggleSetting('autoApprove')} />
        </SettingsCard> */}

{/* ✅ EXTRA: AUTO APPROVE */}
<SettingsCard 
  title="Auto Approve Attendance Items" 
  desc="Automatically approve attendance items after a specified number of days" 
  icon={<ShieldCheck size={14} />}
>
  <div className="space-y-4 p-1">
    <ToggleItem 
      label="Enable Auto Approval" 
      active={settings.autoApprove} 
      onToggle={() => toggleSetting('autoApprove')} 
    />

    {settings.autoApprove && (
      <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
        
        {/* Attendance Items Multi-Select Dropdown */}
     {/* Attendance Items Multi-Select Dropdown */}
<div className="space-y-1.5 relative"> {/* 🔥 Parent MUST be relative */}
  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
    Attendance Items
  </label>
  
  <div 
    onClick={() => setActiveDropdown(activeDropdown === 'attendance' ? null : 'attendance')}
    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-sm"
  >
    <span className="text-xs font-bold text-slate-700 truncate">
      {autoApproveData.attendanceItems.length > 0 
        ? `${autoApproveData.attendanceItems.length} Items Selected` 
        : "Select attendance items"}
    </span>
    <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === 'attendance' ? 'rotate-180' : ''}`} />
  </div>

  {/* 🔥 DROPDOWN LIST: Now uses absolute positioning */}
  {activeDropdown === 'attendance' && (
    <>
      {/* Invisible backdrop to close dropdown when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
      
      <div className="absolute top-full mr-4 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
         <CheckboxOption 
           label="Select All" 
           checked={autoApproveData.attendanceItems.length === 3} 
           onChange={() => handleMultiSelect('attendanceItems', 'Select All')} 
           isHeader
         />
         {['Lens Attendance', 'Location Attendance', 'Selfie & Location Attendance'].map(opt => (
           <CheckboxOption 
             key={opt}
             label={opt} 
             checked={autoApproveData.attendanceItems.includes(opt)} 
             onChange={() => handleMultiSelect('attendanceItems', opt)} 
           />
         ))}
      </div>
    </>
  )}
</div>

        {/* Automation Items Multi-Select Dropdown */}
        <div className="space-y-1.5 relative">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Automation Items</label>
          <div 
            onClick={() => setActiveDropdown(activeDropdown === 'automation' ? null : 'automation')}
            className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-sm"
          >
            <span className="text-xs font-bold text-slate-700 truncate">
              {autoApproveData.automationItems.length > 0 
                ? `${autoApproveData.automationItems.length} Items Selected` 
                : "Select automation items"}
            </span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === 'automation' ? 'rotate-180' : ''}`} />
          </div>

          {activeDropdown === 'automation' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 animate-in zoom-in-95 duration-200">
               <CheckboxOption 
                 label="Select All" 
                 checked={autoApproveData.automationItems.length === 2} 
                 onChange={() => handleMultiSelect('automationItems', 'Select All')} 
                 isHeader
               />
               {['Overtimes', 'Fines'].map(opt => (
                 <CheckboxOption 
                   key={opt}
                   label={opt} 
                   checked={autoApproveData.automationItems.includes(opt)} 
                   onChange={() => handleMultiSelect('automationItems', opt)} 
                 />
               ))}
            </div>
          )}
        </div>

        {/* Approval Days */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Approval days</label>
          <input 
            type="number"
            placeholder="Approval days"
            value={autoApproveData.approvalDays}
            onChange={(e) => setAutoApproveData({...autoApproveData, approvalDays: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
          />
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter ml-1 italic">Auto approve after days</p>
        </div>
      </div>
    )}
  </div>
</SettingsCard>

        {/* ❌ EXTRA: MARK ABSENT */}
        <SettingsCard title="Mark Absent on Previous Days" desc="Mark old attendance with no action as absent" icon={<UserX size={14} />}>
          <ToggleItem label="Mark Absent on Previous Days" active={settings.markAbsent} onToggle={() => toggleSetting('markAbsent')} />
        </SettingsCard>

        {/* 🕒 EXTRA: EFFECTIVE WORKING HOURS */}
        <SettingsCard 
          title="Effective Working Hours" 
          desc="Configure effective working hours for your attendance template" 
          icon={<Clock size={14} />}
        >
          <div className="p-1 space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Rule</label>
              <div className="relative group">
                <select
                  value={settings.effectiveWorkingHours}
                  onChange={(e) => setSettings({ ...settings, effectiveWorkingHours: e.target.value })}
                  className="w-full md:w-1/2 bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 appearance-none cursor-pointer transition-all"
                >
                  <option value="do_not_show">Do not show</option>
                  <option value="show_total">Show total hours</option>
                  <option value="show_effective">Show effective hours only</option>
                </select>
                <ChevronDown 
                  size={14} 
                  className="absolute left-[calc(50%-2rem)] md:left-[calc(50%-1.5rem)] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-500" 
                />
              </div>
            </div>

            {/* Informational Hint based on selection */}
            <div className="flex items-start gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
               <div className="mt-0.5 text-blue-500"><Info size={10} /></div>
               <p className="text-[8px] font-medium text-slate-500 uppercase tracking-tight leading-normal">
                 {settings.effectiveWorkingHours === 'do_not_show' 
                   ? "Working hours will not be calculated or displayed in the staff." 
                   : "Calculated hours will be visible in the monthly ."}
               </p>
            </div>
          </div>
        </SettingsCard>

            </div>

       
        {/* ℹ️ INFO NOTE */}
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-600">
           <Info size={14} />
           <p className="text-[8px] font-black uppercase tracking-widest leading-relaxed">
             Note: Changes to the template will reflect across all assigned staff nodes in the next sync cycle.
           </p>
        </div>
      </div>

      {/* 💾 FIXED FOOTER SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex justify-end shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-40">
        <div className=" w-full mx-auto flex justify-end gap-3">
          
          <button
          onClick={() => navigate('/attendancetemplate')}
           className="flex items-center gap-2 border-2 border-blue-500 px-12 py-2.5 !bg-white !text-blue-500 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-600/30 active:scale-95 transition-all">
            <Save size={14} /> Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

// const SettingsCard = ({ title, desc, icon, children }) => (
//   <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-slate-300">
//     <div className="px-4 py-2 flex items-center justify-between bg-slate-50/20 border-b border-slate-50">
//       <div className="flex items-center gap-2">
//         <div className="text-blue-600">{icon}</div>
//         <div>
//           <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none">{title}</h3>
//           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{desc}</p>
//         </div>
//       </div>
//       <ChevronDown size={14} className="text-slate-300" />
//     </div>
//     <div className="p-2">{children}</div>
//   </div>
// );
const SettingsCard = ({ title, desc, icon, children }) => (
  /* 🔥 Removed overflow-hidden here */
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:border-slate-300 relative">
    <div className="px-4 py-2 flex items-center justify-between bg-slate-50/20 border-b border-slate-50">
      <div className="flex items-center gap-2">
        <div className="text-blue-600">{icon}</div>
        <div>
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none">{title}</h3>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{desc}</p>
        </div>
      </div>
      <ChevronDown size={14} className="text-slate-300" />
    </div>
    <div className="p-2">{children}</div>
  </div>
);
const CheckboxOption = ({ label, checked, onChange, isHeader }) => (
  <label className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isHeader ? 'bg-slate-50 mb-1 border-b border-slate-100' : 'hover:bg-slate-50'}`}>
    <input 
      type="checkbox" 
      checked={checked}
      onChange={onChange}
      className="w-3.5 h-3.5 rounded border-slate-300 mr-2 text-blue-600 accent-blue-600 focus:ring-0" 
    />
    <span className={`text-[11px] font-bold uppercase tracking-tight ${checked ? 'text-blue-600' : 'text-slate-600'}`}>
      {label}
    </span>
  </label>
);

const ToggleItem = ({ label, active, onToggle }) => (
  <div 
    onClick={onToggle}
    className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50 cursor-pointer hover:bg-slate-100 transition-all group"
  >
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-700 transition-colors">{label}</span>
    <div className={`w-8 h-4 rounded-full relative transition-all duration-200 ${active ? 'bg-blue-600' : 'bg-slate-300'}`}>
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${active ? 'left-[1.15rem]' : 'left-0.5'}`} />
    </div>
  </div>
);

const Settings2 = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
);

export default CreateAttendaceTemplate;
//********************************************************working code phase 1 17/03/26**************************************************** */
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, 
//   Save, 
//   Info, 
//   ChevronDown, 
//   MapPin, 
//   Clock,
//   Camera, 
//   MousePointer2, 
//   CheckCircle2,
//   CalendarDays,
//   Timer,
//   ShieldCheck,
//   UserX
// } from 'lucide-react';

// const CreateAttendaceTemplate = () => {
//   const [selectedMode, setSelectedMode] = useState('manual');
//   const navigate = useNavigate(); 
//   const location = useLocation();
//   const editData = location.state?.templateData;
//   // New states for the additional toggles
//   const [settings, setSettings] = useState({
//     holidayAttendance: 'no_allow',
//     trackInOut: true,
//     noPunchOut: false,
//     multiplePunches: false,
//     autoApprove: false,
//     markAbsent: false,
//     effectiveWorkingHours: 'do_not_show'
//   });
//   const [templateName, setTemplateName] = useState('');
 

//   useEffect(() => {
//     if (editData) {
//       setTemplateName(editData.name);
//       // If your API provides specific settings, set them here:
//       // setSelectedMode(editData.mode);
//       // setSettings(editData.settings);
//     }
//   }, [editData]);

//   // Helper function to toggle settings
//   const toggleSetting = (key) => {
//     setSettings(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   const modes = [
//     {
//       id: 'default',
//       title: 'Mark Present by Default',
//       desc: 'Default auto present, can be changed manually',
//       icon: <CheckCircle2 size={14} />
//     },
//     {
//       id: 'manual',
//       title: 'Manual Attendance',
//       desc: 'Attendance is neutral by default, should be marked manually',
//       icon: <MousePointer2 size={14} />
//     },
//     {
//       id: 'location',
//       title: 'Location Based',
//       desc: 'Staff can mark their own attendance. Location captured automatically',
//       icon: <MapPin size={14} />
//     },
//     {
//       id: 'selfie',
//       title: 'Selfie & Location Based',
//       desc: 'Staff mark attendance with Selfie. Location captured automatically',
//       icon: <Camera size={14} />
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] pb-32">
//       {/* 🚀 FIXED TOP BAR */}
//       <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate(-1)} 
//              className="p-1.5 hover:!bg-slate-50 rounded-lg !text-slate-400 transition-all !bg-transparent border-0">
//             <ArrowLeft size={18} />
//           </button>
//           <div>
//             {/* <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Template</h1> */}
//             <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">
//               {editData ? 'Edit Template' : 'Create Template'}
//             </h1>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Attendance Template</p>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto px-4 mt-4 space-y-3">
        
//           <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2"> 
//             </div>
//         {/* 🏷️ NAME SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
//             <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2"> 
//               <div>
//                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1 block">Template Name </label>
//           {/* <input 
//             type="text" 
//             placeholder="e.g. Field Staff Template"
//             className="w-full bg-slate-50 border border-slate-400 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
//           /> */}
//           <input 
//                 type="text" 
//                 value={templateName}
//                 onChange={(e) => setTemplateName(e.target.value)}
//                 placeholder="e.g. Field Staff Template"
//                 className="w-full bg-slate-50 border border-slate-400 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
//               />
//               </div>
//             </div>
          
//         </div>

//         {/* ⚙️ SETTINGS SECTION - UPDATED TO GRID */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
//             <div className="flex items-center gap-2">
//               <div className="p-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
//                 <Settings2 size={14} />
//               </div>
//               <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Attendance Mode </h2>
//             </div>
//             <ChevronDown size={14} className="text-slate-400" />
//           </div>

//           {/* 🔥 GRID LAYOUT IMPLEMENTED HERE */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             {modes.map((mode) => (
//               <div 
//                 key={mode.id}
//                 onClick={() => setSelectedMode(mode.id)}
//                 className={`relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${selectedMode === mode.id ? 'bg-blue-50/30 border-blue-200 shadow-sm' : 'bg-transparent border-slate-50 hover:bg-slate-50 hover:border-slate-200'}`}
//               >
//                 <div className="mt-0.5">
//                   <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMode === mode.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
//                     {selectedMode === mode.id && <div className="w-1 h-1 rounded-full bg-white animate-in zoom-in-50" />}
//                   </div>
//                 </div>
//                 <div className="flex-1 space-y-0.5">
//                   <div className="flex items-center gap-2">
//                     <span className={`transition-colors ${selectedMode === mode.id ? 'text-blue-600' : 'text-slate-400'}`}>{mode.icon}</span>
//                     <h3 className={`text-[10px] font-black uppercase tracking-tight leading-tight ${selectedMode === mode.id ? 'text-blue-700' : 'text-slate-700'}`}>{mode.title}</h3>
//                   </div>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-tight line-clamp-2">{mode.desc}</p>
//                 </div>
//                 {selectedMode === mode.id && (
//                   <div className="absolute inset-y-2 left-0 w-0.5 bg-blue-600 rounded-r-full" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>


//            <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> 
//              {/* 🏔️ EXTRA: ATTENDANCE ON HOLIDAYS */}
//         <SettingsCard title="Attendance on Holidays" desc="Configure rules for marking attendance on paid holidays" icon={<CalendarDays size={14} />}>
//           <div className="space-y-1 mt-2">
//             {['Do NOT Allow', 'Comp Off', 'Allow attendance'].map((opt) => (
//               <label key={opt} className="flex items-center w-full  gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent transition-colors">
//                 <input type="radio" name="holiday" className="w-3 h-3 text-blue-600 accent-blue-600" />
//                 <span className="text-[10px] ml-1 font-bold text-slate-600 uppercase tracking-wide">{opt}</span>
//               </label>
//             ))}
//           </div>
//         </SettingsCard>

//         {/* ⏱️ EXTRA: TRACK IN & OUT TIME */}
//         <SettingsCard title="Track In & Out Time" desc="Track exact punch-in and punch-out timestamps" icon={<Timer size={14} />}>
//           <div className="mt-2 space-y-2">
//             <ToggleItem label="Track In & Out Time" active={settings.trackInOut} onToggle={() => toggleSetting('trackInOut')} />
//             <ToggleItem label="No attendance without punch-out" active={settings.noPunchOut} onToggle={() => toggleSetting('noPunchOut')} />
//             <ToggleItem label="Allow Multiple Punches" active={settings.multiplePunches} onToggle={() => toggleSetting('multiplePunches')} />
//           </div>
//         </SettingsCard>

//         {/* ✅ EXTRA: AUTO APPROVE */}
//         <SettingsCard title="Auto Approve Items" desc="Automatically approve attendance items after set days" icon={<ShieldCheck size={14} />}>
//           <ToggleItem label="Enable Auto Approval" active={settings.autoApprove} onToggle={() => toggleSetting('autoApprove')} />
//         </SettingsCard>

//         {/* ❌ EXTRA: MARK ABSENT */}
//         <SettingsCard title="Mark Absent on Previous Days" desc="Mark old attendance with no action as absent" icon={<UserX size={14} />}>
//           <ToggleItem label="Mark Absent on Previous Days" active={settings.markAbsent} onToggle={() => toggleSetting('markAbsent')} />
//         </SettingsCard>

//         {/* 🕒 EXTRA: EFFECTIVE WORKING HOURS */}
//         <SettingsCard 
//           title="Effective Working Hours" 
//           desc="Configure effective working hours for your attendance template" 
//           icon={<Clock size={14} />}
//         >
//           <div className="p-1 space-y-3">
//             <div className="flex flex-col gap-1.5">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Rule</label>
//               <div className="relative group">
//                 <select
//                   value={settings.effectiveWorkingHours}
//                   onChange={(e) => setSettings({ ...settings, effectiveWorkingHours: e.target.value })}
//                   className="w-full md:w-1/2 bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 appearance-none cursor-pointer transition-all"
//                 >
//                   <option value="do_not_show">Do not show</option>
//                   <option value="show_total">Show total hours</option>
//                   <option value="show_effective">Show effective hours only</option>
//                 </select>
//                 <ChevronDown 
//                   size={14} 
//                   className="absolute left-[calc(50%-2rem)] md:left-[calc(50%-1.5rem)] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-500" 
//                 />
//               </div>
//             </div>

//             {/* Informational Hint based on selection */}
//             <div className="flex items-start gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
//                <div className="mt-0.5 text-blue-500"><Info size={10} /></div>
//                <p className="text-[8px] font-medium text-slate-500 uppercase tracking-tight leading-normal">
//                  {settings.effectiveWorkingHours === 'do_not_show' 
//                    ? "Working hours will not be calculated or displayed in the staff." 
//                    : "Calculated hours will be visible in the monthly ."}
//                </p>
//             </div>
//           </div>
//         </SettingsCard>

//             </div>

       
//         {/* ℹ️ INFO NOTE */}
//         <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-600">
//            <Info size={14} />
//            <p className="text-[8px] font-black uppercase tracking-widest leading-relaxed">
//              Note: Changes to the template will reflect across all assigned staff nodes in the next sync cycle.
//            </p>
//         </div>
//       </div>

//       {/* 💾 FIXED FOOTER SAVE BUTTON */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex justify-end shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-40">
//         <div className=" w-full mx-auto flex justify-end gap-3">
          
//           <button
//           onClick={() => navigate('/attendancetemplate')}
//            className="flex items-center gap-2 border-2 border-blue-500 px-12 py-2.5 !bg-white !text-blue-500 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-600/30 active:scale-95 transition-all">
//             <Save size={14} /> Save Template
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SettingsCard = ({ title, desc, icon, children }) => (
//   <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-slate-300">
//     <div className="px-4 py-2 flex items-center justify-between bg-slate-50/20 border-b border-slate-50">
//       <div className="flex items-center gap-2">
//         <div className="text-blue-600">{icon}</div>
//         <div>
//           <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none">{title}</h3>
//           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{desc}</p>
//         </div>
//       </div>
//       <ChevronDown size={14} className="text-slate-300" />
//     </div>
//     <div className="p-2">{children}</div>
//   </div>
// );

// const ToggleItem = ({ label, active, onToggle }) => (
//   <div 
//     onClick={onToggle}
//     className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50 cursor-pointer hover:bg-slate-100 transition-all group"
//   >
//     <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-700 transition-colors">{label}</span>
//     <div className={`w-8 h-4 rounded-full relative transition-all duration-200 ${active ? 'bg-blue-600' : 'bg-slate-300'}`}>
//       <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${active ? 'left-[1.15rem]' : 'left-0.5'}`} />
//     </div>
//   </div>
// );

// const Settings2 = ({ size }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
// );

// export default CreateAttendaceTemplate;
//**********************************************working code phase 1 13/03/26*************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Save, 
//   Info, 
//   ChevronDown, 
//   MapPin, 
//   Clock,
//   Camera, 
//   MousePointer2, 
//   CheckCircle2,
//   CalendarDays,
//   Timer,
//   ShieldCheck,
//   UserX
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateAttendaceTemplate = () => {
//   const [selectedMode, setSelectedMode] = useState('manual');
//   const navigate = useNavigate(); 
//   // New states for the additional toggles
//   const [settings, setSettings] = useState({
//     holidayAttendance: 'no_allow',
//     trackInOut: true,
//     noPunchOut: false,
//     multiplePunches: false,
//     autoApprove: false,
//     markAbsent: false,
//     effectiveWorkingHours: 'do_not_show'
//   });

//   // Helper function to toggle settings
//   const toggleSetting = (key) => {
//     setSettings(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   const modes = [
//     {
//       id: 'default',
//       title: 'Mark Present by Default',
//       desc: 'Default auto present, can be changed manually',
//       icon: <CheckCircle2 size={14} />
//     },
//     {
//       id: 'manual',
//       title: 'Manual Attendance',
//       desc: 'Attendance is neutral by default, should be marked manually',
//       icon: <MousePointer2 size={14} />
//     },
//     {
//       id: 'location',
//       title: 'Location Based',
//       desc: 'Staff can mark their own attendance. Location captured automatically',
//       icon: <MapPin size={14} />
//     },
//     {
//       id: 'selfie',
//       title: 'Selfie & Location Based',
//       desc: 'Staff mark attendance with Selfie. Location captured automatically',
//       icon: <Camera size={14} />
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] pb-32">
//       {/* 🚀 FIXED TOP BAR */}
//       <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate(-1)} 
//              className="p-1.5 hover:!bg-slate-50 rounded-lg !text-slate-400 transition-all !bg-transparent border-0">
//             <ArrowLeft size={18} />
//           </button>
//           <div>
//             <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Template</h1>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Attendance Template</p>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto px-4 mt-4 space-y-3">
        
//           <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2"> 
//             </div>
//         {/* 🏷️ NAME SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
//             <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2"> 
//               <div>
//                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1 block">Template Name </label>
//           <input 
//             type="text" 
//             placeholder="e.g. Field Staff Template"
//             className="w-full bg-slate-50 border border-slate-400 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
//           />
//               </div>
//             </div>
          
//         </div>

//         {/* ⚙️ SETTINGS SECTION - UPDATED TO GRID */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
//             <div className="flex items-center gap-2">
//               <div className="p-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
//                 <Settings2 size={14} />
//               </div>
//               <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Attendance Mode </h2>
//             </div>
//             <ChevronDown size={14} className="text-slate-400" />
//           </div>

//           {/* 🔥 GRID LAYOUT IMPLEMENTED HERE */}
//           <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
//             {modes.map((mode) => (
//               <div 
//                 key={mode.id}
//                 onClick={() => setSelectedMode(mode.id)}
//                 className={`relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${selectedMode === mode.id ? 'bg-blue-50/30 border-blue-200 shadow-sm' : 'bg-transparent border-slate-50 hover:bg-slate-50 hover:border-slate-200'}`}
//               >
//                 <div className="mt-0.5">
//                   <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMode === mode.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
//                     {selectedMode === mode.id && <div className="w-1 h-1 rounded-full bg-white animate-in zoom-in-50" />}
//                   </div>
//                 </div>
//                 <div className="flex-1 space-y-0.5">
//                   <div className="flex items-center gap-2">
//                     <span className={`transition-colors ${selectedMode === mode.id ? 'text-blue-600' : 'text-slate-400'}`}>{mode.icon}</span>
//                     <h3 className={`text-[10px] font-black uppercase tracking-tight leading-tight ${selectedMode === mode.id ? 'text-blue-700' : 'text-slate-700'}`}>{mode.title}</h3>
//                   </div>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-tight line-clamp-2">{mode.desc}</p>
//                 </div>
//                 {selectedMode === mode.id && (
//                   <div className="absolute inset-y-2 left-0 w-0.5 bg-blue-600 rounded-r-full" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>


//            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2"> 
//              {/* 🏔️ EXTRA: ATTENDANCE ON HOLIDAYS */}
//         <SettingsCard title="Attendance on Holidays" desc="Configure rules for marking attendance on paid holidays" icon={<CalendarDays size={14} />}>
//           <div className="space-y-1 mt-2">
//             {['Do NOT Allow', 'Comp Off', 'Allow attendance'].map((opt) => (
//               <label key={opt} className="flex items-center w-full  gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent transition-colors">
//                 <input type="radio" name="holiday" className="w-3 h-3 text-blue-600 accent-blue-600" />
//                 <span className="text-[10px] ml-1 font-bold text-slate-600 uppercase tracking-wide">{opt}</span>
//               </label>
//             ))}
//           </div>
//         </SettingsCard>

//         {/* ⏱️ EXTRA: TRACK IN & OUT TIME */}
//         <SettingsCard title="Track In & Out Time" desc="Track exact punch-in and punch-out timestamps" icon={<Timer size={14} />}>
//           <div className="mt-2 space-y-2">
//             <ToggleItem label="Track In & Out Time" active={settings.trackInOut} onToggle={() => toggleSetting('trackInOut')} />
//             <ToggleItem label="No attendance without punch-out" active={settings.noPunchOut} onToggle={() => toggleSetting('noPunchOut')} />
//             <ToggleItem label="Allow Multiple Punches" active={settings.multiplePunches} onToggle={() => toggleSetting('multiplePunches')} />
//           </div>
//         </SettingsCard>

//         {/* ✅ EXTRA: AUTO APPROVE */}
//         <SettingsCard title="Auto Approve Items" desc="Automatically approve attendance items after set days" icon={<ShieldCheck size={14} />}>
//           <ToggleItem label="Enable Auto Approval" active={settings.autoApprove} onToggle={() => toggleSetting('autoApprove')} />
//         </SettingsCard>

//         {/* ❌ EXTRA: MARK ABSENT */}
//         <SettingsCard title="Mark Absent on Previous Days" desc="Mark old attendance with no action as absent" icon={<UserX size={14} />}>
//           <ToggleItem label="Mark Absent on Previous Days" active={settings.markAbsent} onToggle={() => toggleSetting('markAbsent')} />
//         </SettingsCard>

//         {/* 🕒 EXTRA: EFFECTIVE WORKING HOURS */}
//         <SettingsCard 
//           title="Effective Working Hours" 
//           desc="Configure effective working hours for your attendance template" 
//           icon={<Clock size={14} />}
//         >
//           <div className="p-1 space-y-3">
//             <div className="flex flex-col gap-1.5">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Rule</label>
//               <div className="relative group">
//                 <select
//                   value={settings.effectiveWorkingHours}
//                   onChange={(e) => setSettings({ ...settings, effectiveWorkingHours: e.target.value })}
//                   className="w-full md:w-1/2 bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 appearance-none cursor-pointer transition-all"
//                 >
//                   <option value="do_not_show">Do not show</option>
//                   <option value="show_total">Show total hours</option>
//                   <option value="show_effective">Show effective hours only</option>
//                 </select>
//                 <ChevronDown 
//                   size={14} 
//                   className="absolute left-[calc(50%-2rem)] md:left-[calc(50%-1.5rem)] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-500" 
//                 />
//               </div>
//             </div>

//             {/* Informational Hint based on selection */}
//             <div className="flex items-start gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
//                <div className="mt-0.5 text-blue-500"><Info size={10} /></div>
//                <p className="text-[8px] font-medium text-slate-500 uppercase tracking-tight leading-normal">
//                  {settings.effectiveWorkingHours === 'do_not_show' 
//                    ? "Working hours will not be calculated or displayed in the staff." 
//                    : "Calculated hours will be visible in the monthly ."}
//                </p>
//             </div>
//           </div>
//         </SettingsCard>

//             </div>

       
//         {/* ℹ️ INFO NOTE */}
//         <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-600">
//            <Info size={14} />
//            <p className="text-[8px] font-black uppercase tracking-widest leading-relaxed">
//              Note: Changes to the template will reflect across all assigned staff nodes in the next sync cycle.
//            </p>
//         </div>
//       </div>

//       {/* 💾 FIXED FOOTER SAVE BUTTON */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex justify-end shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-40">
//         <div className=" w-full mx-auto flex justify-end gap-3">
          
//           <button
//           onClick={() => navigate('/attendancetemplate')}
//            className="flex items-center gap-2 border-2 border-blue-500 px-12 py-2.5 !bg-white !text-blue-500 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-600/30 active:scale-95 transition-all">
//             <Save size={14} /> Save Template
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SettingsCard = ({ title, desc, icon, children }) => (
//   <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-slate-300">
//     <div className="px-4 py-2 flex items-center justify-between bg-slate-50/20 border-b border-slate-50">
//       <div className="flex items-center gap-2">
//         <div className="text-blue-600">{icon}</div>
//         <div>
//           <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none">{title}</h3>
//           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{desc}</p>
//         </div>
//       </div>
//       <ChevronDown size={14} className="text-slate-300" />
//     </div>
//     <div className="p-2">{children}</div>
//   </div>
// );

// const ToggleItem = ({ label, active, onToggle }) => (
//   <div 
//     onClick={onToggle}
//     className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50 cursor-pointer hover:bg-slate-100 transition-all group"
//   >
//     <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-700 transition-colors">{label}</span>
//     <div className={`w-8 h-4 rounded-full relative transition-all duration-200 ${active ? 'bg-blue-600' : 'bg-slate-300'}`}>
//       <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${active ? 'left-[1.15rem]' : 'left-0.5'}`} />
//     </div>
//   </div>
// );

// const Settings2 = ({ size }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
// );

// export default CreateAttendaceTemplate;
//********************************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Save, 
//   Info, 
//   ChevronDown, 
//   MapPin, 
//   Camera, 
//   MousePointer2, 
//   CheckCircle2 
// } from 'lucide-react';

// const CreateAttendaceTemplate = () => {
//   const [selectedMode, setSelectedMode] = useState('manual');

//   const modes = [
//     {
//       id: 'default',
//       title: 'Mark Present by Default',
//       desc: 'Default auto present, can be changed manually',
//       icon: <CheckCircle2 size={14} />
//     },
//     {
//       id: 'manual',
//       title: 'Manual Attendance',
//       desc: 'Attendance is neutral by default, should be marked manually',
//       icon: <MousePointer2 size={14} />
//     },
//     {
//       id: 'location',
//       title: 'Location Based',
//       desc: 'Staff can mark their own attendance. Location captured automatically',
//       icon: <MapPin size={14} />
//     },
//     {
//       id: 'selfie',
//       title: 'Selfie & Location Based',
//       desc: 'Staff mark attendance with Selfie. Location captured automatically',
//       icon: <Camera size={14} />
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] pb-20">
//       {/* 🚀 FIXED TOP BAR */}
//       <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-all bg-transparent border-0">
//             <ArrowLeft size={18} />
//           </button>
//           <div>
//             <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Create Template</h1>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Registry Configuration</p>
//           </div>
//         </div>
//         <button className="flex items-center gap-2 px-6 py-2 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
//           <Save size={14} /> Save Template
//         </button>
//       </div>

//       <div className=" mx-auto px-4 mt-6 space-y-4">
        
//         {/* 🏷️ NAME SECTION */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2 block">Template Name <span className="text-rose-500">*</span></label>
//           <input 
//             type="text" 
//             placeholder="e.g. Field Staff Template"
//             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-300"
//           />
//         </div>

//         {/* ⚙️ SETTINGS SECTION */}
//         <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//           {/* Header Strip */}
//           <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
//             <div className="flex items-center gap-3">
//               <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
//                 <Settings2 size={16} />
//               </div>
//               <h2 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Attendance Mode Configuration</h2>
//             </div>
//             <ChevronDown size={16} className="text-slate-400" />
//           </div>

//           <div className="p-2 space-y-1">
//             {modes.map((mode) => (
//               <div 
//                 key={mode.id}
//                 onClick={() => setSelectedMode(mode.id)}
//                 className={`
//                   relative flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all border
//                   ${selectedMode === mode.id 
//                     ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100' 
//                     : 'bg-transparent border-transparent hover:bg-slate-50'}
//                 `}
//               >
//                 {/* Custom Radio Node */}
//                 <div className="mt-1">
//                   <div className={`
//                     w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
//                     ${selectedMode === mode.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}
//                   `}>
//                     {selectedMode === mode.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
//                   </div>
//                 </div>

//                 <div className="flex-1 space-y-0.5">
//                   <div className="flex items-center gap-2">
//                     <span className={`text-slate-400 ${selectedMode === mode.id ? 'text-blue-600' : ''}`}>
//                       {mode.icon}
//                     </span>
//                     <h3 className={`text-xs font-black uppercase tracking-tight ${selectedMode === mode.id ? 'text-blue-700' : 'text-slate-700'}`}>
//                       {mode.title}
//                     </h3>
//                   </div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-tight">
//                     {mode.desc}
//                   </p>
//                 </div>

//                 {selectedMode === mode.id && (
//                   <div className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-r-full" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ℹ️ INFO NOTE */}
//         <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-indigo-600">
//            <Info size={16} />
//            <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
//              Note: Changes to the template will reflect across all assigned staff nodes in the next sync cycle.
//            </p>
//         </div>

//       </div>
//     </div>
//   );
// };

// const Settings2 = ({ size }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
// );

// export default CreateAttendaceTemplate;