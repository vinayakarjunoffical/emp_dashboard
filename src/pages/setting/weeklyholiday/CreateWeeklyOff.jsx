import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Info, 
  Check, 
  Settings2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateWeeklyOff = () => {
  const navigate = useNavigate();
  
  // 1. DATA: Days and Weeks mapping
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weeks = ["All", "1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"];

  // 2. STATE: Matrix to track checked boxes
  const [selectedOffs, setSelectedOffs] = useState({});

  // ✅ UPDATED: Toggle logic for "All" vs individual weeks
  const toggleCheckbox = (day, week) => {
    const key = `${day}-${week}`;
    const newSelected = { ...selectedOffs };

    if (week === "All") {
      // If "All" is being checked, set all weeks for this day to true. 
      // If "All" is being unchecked, set all weeks for this day to false.
      const isChecking = !selectedOffs[key];
      weeks.forEach(w => {
        newSelected[`${day}-${w}`] = isChecking;
      });
    } else {
      // Regular individual week toggle
      newSelected[key] = !selectedOffs[key];
      
      // LOGIC: If an individual week is unchecked, "All" must also be unchecked
      if (!newSelected[key]) {
        newSelected[`${day}-All`] = false;
      }
      
      // LOGIC: If all individual weeks are checked, "All" should automatically check
      const allOthersChecked = weeks.filter(w => w !== "All").every(w => newSelected[`${day}-${w}`]);
      if (allOthersChecked) {
        newSelected[`${day}-All`] = true;
      }
    }

    setSelectedOffs(newSelected);
  };

  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-24 text-left relative">
      {/* 🚀 HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-600 transition-transform" />
          <span className="text-[11px] font-black !capitalize tracking-widest leading-none !text-slate-700">Back to Templates</span>
        </button>
      </div>

      <div className=" mx-auto md:px-6 px-2 md:mt-4 mt-4">
        <div className="bg-white border border-slate-200 rounded-xl md:p-8 p-4 space-y-10 relative overflow-hidden">
          
          <div className="space-y-1 relative z-10 mb-4">
            <h1 className="md:text-xl text-lg font-black !text-slate-900 tracking-tighter !capitalize">Weekly Off Configuration</h1>
            <p className="md:text-[10px] text-[8px] font-bold text-slate-500 capitalize tracking-widest">Define the frequency of holidays across the month</p>
          </div>

          <div className="space-y-8 relative z-10">
            {/* NAME INPUT */}
            <div className="space-y-2 max-w-sm mb-4">
              <label className="text-[11px] font-black !text-slate-800 !capitalize tracking-widest ml-1">
                Name 
              </label>
              <input 
                type="text" 
                placeholder="Provide a Template Name" 
                className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* CONFIGURATION GRID */}
            {/* <div className="space-y-4">
              <label className="md:text-[10px] text-[8px] font-black text-slate-600 capitalize tracking-widest ml-1">
                Select day and frequency for weekly off
              </label>

              <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-left">Days</th>
                      {weeks.map(week => (
                        <th key={week} className="px-4 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-center">
                          {week}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {days.map((day) => (
                      <tr key={day} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 text-[11px] font-bold text-slate-700">{day}</td>
                        {weeks.map((week) => {
                          const isChecked = selectedOffs[`${day}-${week}`];
                          return (
                            <td key={week} className="px-4 py-4 text-center">
                              <div 
                                onClick={() => toggleCheckbox(day, week)}
                                className={`w-5 h-5 mx-auto rounded-md border-2 transition-all cursor-pointer flex items-center justify-center ${
                                  isChecked 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                    : 'bg-white border-slate-200 hover:border-blue-400'
                                }`}
                              >
                                {isChecked && <Check size={12} strokeWidth={4} />}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}

            <div className="space-y-4">
  <label className="md:text-[10px] text-[8px] font-black !text-slate-600 !capitalize tracking-widest ml-1">
    Select day and frequency for weekly off
  </label>

  <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
    {/* 📱 MOBILE FIX: Table becomes a block on mobile, regular table on sm (desktop) */}
    <table className="w-full border-collapse block sm:table">
      
      {/* 📱 MOBILE FIX: Hide table headers on mobile screens */}
      <thead className="hidden sm:table-header-group">
        <tr className="bg-slate-50/50 border-b border-slate-100">
          <th className="px-6 py-4 text-[9px] font-black text-slate-600 capitalize tracking-widest text-left">Days</th>
          {weeks.map(week => (
            <th key={week} className="px-4 py-4 text-[9px] font-black text-slate-600 capitalize tracking-widest text-center">
              {week}
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody className="block sm:table-row-group divide-y divide-slate-100 sm:divide-slate-50">
        {days.map((day) => (
          /* 📱 MOBILE FIX: Rows become flex-wrap cards on mobile, standard table-row on sm */
          <tr key={day} className="group flex flex-wrap sm:table-row hover:bg-slate-50/30 transition-colors p-4 sm:p-0">
            
            {/* DAY LABEL */}
            {/* 📱 MOBILE FIX: Day takes full width (w-full) on mobile to sit on top of the checkboxes */}
            <td className="w-full sm:w-auto px-2 sm:px-6 pb-4 sm:pb-0 sm:py-4 text-[12px] sm:text-[11px] font-black sm:font-bold text-slate-800 sm:text-slate-700 block sm:table-cell border-b sm:border-none border-slate-100 mb-3 sm:mb-0">
              {day}
            </td>
            
            {/* CHECKBOXES */}
            {weeks.map((week) => {
              const isChecked = selectedOffs[`${day}-${week}`];
              return (
                /* 📱 MOBILE FIX: flex-1 ensures the 5 checkboxes share equal width on the bottom row of the mobile card */
                <td key={week} className="flex-1 sm:w-auto flex flex-col sm:table-cell items-center gap-2 sm:gap-0 px-1 sm:px-4 py-2 sm:py-4 text-center block">
                  
                  {/* 📱 MOBILE FIX: Show the week label above the checkbox ONLY on mobile */}
                  <span className="sm:hidden md:text-[8px] text-[6px] font-black text-slate-400 capitalize tracking-widest">
                    {week}
                  </span>
                  
                  <div 
                    onClick={() => toggleCheckbox(day, week)}
                    /* 📱 MOBILE FIX: Slightly larger checkbox (w-6 h-6) on mobile for easier thumbs tapping */
                    className={`w-6 h-6 sm:w-5 sm:h-5 mx-auto rounded-md border-2 transition-all cursor-pointer flex items-center justify-center ${
                      isChecked 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {isChecked && <Check size={14} strokeWidth={4} className="w-3.5 h-3.5 sm:w-3 sm:h-3" />}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
          </div>

          <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
            <Calendar size={180} />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 px-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Info size={14} /></div>
          <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest leading-loose max-w-md">
            Selecting 'All' will automatically mark the holiday for every week of the month. Custom weekly selections override the default behavior.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className=" mx-auto flex justify-end gap-3 px-2">
          <button onClick={() => navigate(-1)} className="px-8 py-2.5  !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all">cancel</button>
          <button className="px-12 py-2.5 !bg-white border border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black capitalize tracking-widest shadow-sm shadow-blue-200 active:scale-95 transition-all">Save Template</button>
        </div>
      </div>
    </div>
  );
};

export default CreateWeeklyOff;