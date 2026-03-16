import React, { useState } from 'react';
import { ArrowLeft, Wallet, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Salarylogic = () => {
  const navigate = useNavigate();
  // State to manage the selected calculation logic
  const [selectedLogic, setSelectedLogic] = useState('Calendar Month');

  const logicOptions = [
    {
      title: 'Calendar Month',
      description: 'Ex: March will have 31 payable days, April will have 30 payable days etc.',
    },
    {
      title: 'Every Month 30 Days',
      description: 'Ex: March will have 30 payable days, April will have 30 payable days etc.',
    },
    {
      title: 'Every Month 28 Days',
      description: 'Ex: March will have 28 payable days, April will have 28 payable days etc.',
    },
    {
      title: 'Every Month 26 Days',
      description: 'Ex: March will have 26 payable days, April will have 26 payable days etc.',
    },
    {
      title: 'Exclude Weekly Offs',
      description: 'Ex: Month with 31 days and 4 weekly offs will have 27 payable days.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-18 text-left relative">
      {/* 🚀 HEADER - */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-300 transition-transform" />
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest leading-none">Back</span>
        </button>
      </div>

      <div className=" mx-auto px-6 mt-4">
        {/* 📑 MAIN CONFIGURATION CARD - */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-8 relative overflow-hidden">
          
          <div className="space-y-4 relative z-10">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Payable Days & Work Hours</h1>
            
            <div className="space-y-2">
              <p className="text-[12px] font-bold text-slate-700">
                What is the effective payable days per month, work hours per day in your organization?
              </p>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-2xl">
                We will calculate based on your selection <span className="text-slate-900 font-bold uppercase tracking-tight">salary / payable days, hourly wage rate = daily wage rate / number of work hours</span> for salary calculation
              </p>
            </div>
          </div>

          {/* 🔘 LOGIC OPTIONS LIST - */}
          <div className="space-y-8 relative z-10 pt-4">
            {logicOptions.map((option) => (
              <div
                key={option.title}
                onClick={() => setSelectedLogic(option.title)}
                className="flex items-start gap-5 group cursor-pointer select-none"
              >
                {/* Custom Radio Button UI */}
                <div className="pt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    selectedLogic === option.title 
                      ? 'border-blue-600 bg-white' 
                      : 'border-slate-200 bg-white group-hover:border-blue-400'
                  }`}>
                    {selectedLogic === option.title && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-in fade-in zoom-in duration-300" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className={`text-[13px] font-black uppercase tracking-tight transition-colors duration-200 ${
                    selectedLogic === option.title ? 'text-blue-600' : 'text-slate-800'
                  }`}>
                    {option.title}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Background Branding Watermark */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
            <Wallet size={240} />
          </div>
        </div>


      </div>

      {/* 🛡️ FIXED FOOTER ACTIONS - */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className=" mx-auto flex justify-end gap-3 px-2">
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            className="px-14 py-2.5 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm border border-blue-500 shadow-blue-200 active:scale-95 transition-all cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Salarylogic;