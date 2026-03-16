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
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24 text-left relative">
      {/* 🚀 HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-300 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none !text-slate-400">Back to Templates</span>
        </button>
      </div>

      <div className=" mx-auto px-6 mt-4">
        <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-10 relative overflow-hidden">
          
          <div className="space-y-1 relative z-10 mb-4">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Weekly Off Configuration</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Define the frequency of holidays across the month</p>
          </div>

          <div className="space-y-8 relative z-10">
            {/* NAME INPUT */}
            <div className="space-y-2 max-w-sm mb-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Name 
              </label>
              <input 
                type="text" 
                placeholder="Provide a Template Name" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* CONFIGURATION GRID */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
                Select day and frequency for weekly off
              </label>

              <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Days</th>
                      {weeks.map(week => (
                        <th key={week} className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
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
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
            <Calendar size={180} />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 px-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Info size={14} /></div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose max-w-md">
            Selecting 'All' will automatically mark the holiday for every week of the month. Custom weekly selections override the default behavior.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className=" mx-auto flex justify-end gap-3 px-2">
          <button onClick={() => navigate(-1)} className="px-8 py-2.5  !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">cancel</button>
          <button className="px-12 py-2.5 !bg-white border border-blue-500 !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-200 active:scale-95 transition-all">Save Template</button>
        </div>
      </div>
    </div>
  );
};

export default CreateWeeklyOff;