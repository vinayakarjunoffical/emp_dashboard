import React, { useState, useMemo } from 'react';
import { X, Trash2, ChevronDown } from 'lucide-react';

const FineModal = ({ staff, onClose }) => {
  // 1. Logic: State for each fine category
  // Using strings for hours to allow clearable/placeholder inputs
  const [fines, setFines] = useState({
    'Late Entry': { hours: '', multiplier: 1, rate: 68.1, actual: "01:20" },
    'Early Out': { hours: '', multiplier: 1, rate: 68.1, actual: "00:45" },
    'Excess Breaks': { hours: '', multiplier: 1, rate: 68.1, actual: "00:00" }
  });

  const [sendSMS, setSendSMS] = useState(true);

  // 2. Logic: Handler for input changes
  const handleUpdate = (label, field, value) => {
    setFines(prev => ({
      ...prev,
      [label]: {
        ...prev[label],
        [field]: value
      }
    }));
  };

  // 3. Logic: Calculations
  const calculateRowAmount = (fine) => {
    const hours = parseFloat(fine.hours) || 0;
    return (hours * fine.multiplier * fine.rate).toFixed(2);
  };

  const totalAmount = useMemo(() => {
    return Object.values(fines).reduce((acc, curr) => {
      const rowAmt = parseFloat(calculateRowAmount(curr));
      return acc + rowAmt;
    }, 0).toFixed(2);
  }, [fines]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        
        {/* 🔝 Tight Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 bg-white">
          <div className="space-y-0.5">
            <h2 className="text-[15px] font-black text-slate-800 uppercase tracking-tight">Fine Calculation</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{staff.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 !bg-transparent transition-all"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* 📋 Shift Indicator Strip */}
          <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">Shift: 10 To 7</span>
             <Trash2 size={14} className="text-rose-400 hover:text-rose-600 cursor-pointer transition-colors" />
          </div>

          {/* ⚡ Fine Sections */}
          {Object.entries(fines).map(([label, fine], i) => (
            <div key={label} className="p-4 bg-white border border-slate-100 rounded-2xl relative group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
                <button className="!bg-transparent p-0 border-0"><X size={14} className="text-slate-200 group-hover:text-slate-400 cursor-pointer" /></button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Col 1: Actual Hrs (Static Data) */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-1">Actual Hours</span>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                    {fine.actual} hrs
                  </div>
                </div>
                
                {/* Col 2: Hours Input (Interactive) */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block text-center">fine hours</span>
                  <input 
                    type="number"
                    placeholder="0.0"
                    value={fine.hours}
                    onChange={(e) => handleUpdate(label, 'hours', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-black text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Col 3: Fine Rate (Interactive) */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-1">Multiplier</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 relative">
                      <select 
                        value={fine.multiplier}
                        onChange={(e) => handleUpdate(label, 'multiplier', parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-2 text-[10px] font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 cursor-pointer"
                      >
                        <option value={1}>1x Sal</option>
                        <option value={2}>2x Sal</option>
                        <option value={0.5}>0.5x Sal</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                    <div className="text-[10px] font-black text-slate-700 shrink-0">₹ {fine.rate}</div>
                  </div>
                </div>
              </div>

              {/* Individual Amount Display */}
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Calculated Amount:</span>
                  <span className="text-[10px] font-black text-blue-600 font-mono">₹ {calculateRowAmount(fine)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🏁 Footer */}
        <div className="p-5 bg-slate-50/80 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Fine Amount</span>
               <span className="text-[20px] font-black text-slate-900 tracking-tighter">₹ {totalAmount}</span>
             </div>

             {/* 📱 SMS Toggle */}
             <label className="flex items-center gap-2.5 cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={sendSMS}
                 onChange={(e) => setSendSMS(e.target.checked)}
                 className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 transition-all cursor-pointer" 
               />
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-slate-900 transition-colors">Send SMS Notification</span>
             </label>
          </div>

          <button 
            disabled={totalAmount <= 0}
            className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all border-0 cursor-pointer flex items-center justify-center gap-2 ${
              totalAmount > 0 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98]" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Apply Fine 
            {totalAmount > 0 && <span>(₹ {totalAmount})</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FineModal;