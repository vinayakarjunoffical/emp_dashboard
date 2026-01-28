import React, { useState } from 'react';
import { Calendar, FileCheck, Printer, Download, Send, Info, ShieldCheck } from 'lucide-react';

const JoiningLetterWorkspace = ({ employee }) => {
  const [joiningDate, setJoiningDate] = useState("");

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: CONFIGURATION PANEL (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="bg-slate-900 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FileCheck size={20} />
                </div>
                <h3 className="font-bold tracking-tight">Letter Configuration</h3>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* JOINING DATE INPUT */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Official Commencement Date
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-800 shadow-sm"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * This date will be dynamically injected into the formal joining letter template.
                </p>
              </div>

              {/* GUIDELINES */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} className="text-blue-600" />
                  <span className="text-[10px] font-black text-blue-800 uppercase">Compliance Note</span>
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  The joining letter is a legal supplement to the offer. Ensure the date matches the onboarding schedule.
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3 pt-4">
                <button className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]">
                  <Send size={18} />
                  ISSUE JOINING LETTER
                </button>
                <button className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  <Download size={18} />
                  SAVE AS PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE PREVIEW (8 Columns) */}
        <div className="lg:col-span-8">
          <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-[2.5rem] p-4 lg:p-10 relative">
            
            {/* PAPER CARD */}
            <div className="bg-white shadow-2xl rounded-sm mx-auto max-w-[600px] min-h-[750px] p-12 lg:p-16 text-slate-800 relative overflow-hidden">
              
              {/* WATERMARK */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <h1 className="text-9xl font-black -rotate-45 uppercase">OFFICIAL</h1>
              </div>

              {/* DOCUMENT CONTENT */}
              <div className="relative z-10 space-y-10">
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                  <div className="h-12 w-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl">
                    {employee.full_name?.charAt(0) || "C"}
                  </div>
                  <div className="text-right">
                    <h2 className="font-black text-xl tracking-tighter">LETTER OF JOINING</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Ref: HR/JOIN/{employee.id || '2026'}</p>
                  </div>
                </div>

                {/* Body Section */}
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">To,</p>
                    <p className="text-lg font-black">{employee.full_name}</p>
                    <p className="text-xs text-slate-500 uppercase">{employee.role || 'Senior Associate'}</p>
                  </div>

                  <div className="py-4">
                    <p className="text-sm leading-[1.8] text-slate-700">
                      We are pleased to formally welcome you to <strong>Enterprise Systems Corp</strong>. 
                      Following our selection process, we are delighted to confirm your appointment.
                    </p>
                  </div>

                  {/* HIGHLIGHTED DATE SECTION */}
                  <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-slate-900 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Effective Joining Date</p>
                      <p className="text-xl font-black text-slate-900 mt-1">
                        {joiningDate ? new Date(joiningDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Select Date..."}
                      </p>
                    </div>
                    <Calendar size={32} className="text-slate-200" />
                  </div>

                  <div className="space-y-4 pt-4">
                    <p className="text-sm leading-[1.8] text-slate-700">
                      As per this letter, you are requested to report at our headquarters on the date mentioned above at 09:00 AM. 
                      Please ensure all original documents are carried for final verification.
                    </p>
                    <p className="text-sm leading-[1.8] text-slate-700">
                      We look forward to a mutually beneficial association.
                    </p>
                  </div>
                </div>

                {/* Footer / Signatures */}
                <div className="pt-16 flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="h-px w-32 bg-slate-300 mb-2"></div>
                    <p className="text-[10px] font-black uppercase">Candidate Signature</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-black uppercase">HR Department</p>
                    <p className="text-[10px] text-slate-400 italic">Digitally Signed & Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING ACTION TOOLBAR */}
            <div className="absolute top-8 right-8 flex flex-col gap-2">
              <button className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-lg text-slate-600 transition-all hover:scale-110" title="Print Letter">
                <Printer size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JoiningLetterWorkspace;