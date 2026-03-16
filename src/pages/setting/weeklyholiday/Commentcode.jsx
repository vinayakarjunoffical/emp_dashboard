import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronDown, Plus, Trash2, HelpCircle, Wallet, Info, ExternalLink, Settings2, X, ChevronUp, ShieldCheck, Cloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SalaryStructureTemplate = () => {
  const navigate = useNavigate();

  // 1. Basic Info State
  const [templateName, setTemplateName] = useState("Default");
  const [isDefault, setIsDefault] = useState(true);
  const [staffType, setStaffType] = useState("Monthly Regular");
  const [calcBy, setCalcBy] = useState("₹ (Fixed Amount)");
  const [newCustomName, setNewCustomName] = useState("");

  // 2. Earnings State & Logic
  const [earnings, setEarnings] = useState([
    { id: 1, label: "HRA", amount: "" },
    { id: 2, label: "Medical Allowance", amount: "" },
    { id: 3, label: "Special Allowance", amount: "" }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestedEarnings, setSuggestedEarnings] = useState([
    { label: "Basic + DA", selected: false },
    { label: "HRA", selected: true },
    { label: "Medical Allowance", selected: true },
    { label: "Travel Allowance", selected: false },
    { label: "Special Allowance", selected: true },
    { label: "Meal Allowance", selected: false },
    { label: "Leave Travel Allowance", selected: false },
    { label: "Bonus", selected: false },
  ]);

  const handleSaveEarnings = () => {
    const selectedList = suggestedEarnings
      .filter(item => item.selected)
      .map((item, index) => {
        const existing = earnings.find(e => e.label === item.label);
        return existing ? existing : { id: Date.now() + index, label: item.label, amount: "" };
      });
    setEarnings(selectedList);
    setIsModalOpen(false);
  };

  // 3. Deductions State & Logic
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [deductions, setDeductions] = useState([
    { id: 1, label: "Provident Fund (PF)", type: "Variable [12%]", hasInfo: true },
    { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected" },
    { id: 3, label: "Professional Tax (PT)", type: "Applied (As Per Current Month's Calculation)", isExpandable: true }
  ]);

  const [suggestedDeductions, setSuggestedDeductions] = useState([
    { label: "Provident Fund (PF)", selected: true },
    { label: "Employee State Insurance (ESI)", selected: true },
    { label: "Professional Tax (PT)", selected: true },
    { label: "Income Tax (TDS)", selected: false },
    { label: "Loan Repayment", selected: false },
    { label: "Advance Salary", selected: false },
  ]);

  const handleSaveDeductions = () => {
    const selectedList = suggestedDeductions
      .filter(item => item.selected)
      .map((item, index) => {
        const existing = deductions.find(d => d.label === item.label);
        if (existing) return existing;
        
        return {
          id: Date.now() + index,
          label: item.label,
          type: item.label === "Professional Tax (PT)" ? "Applied (As Per Current Month's Calculation)" : "0 Selected",
          isExpandable: item.label === "Professional Tax (PT)",
          hasInfo: item.label === "Provident Fund (PF)"
        };
      });
    setDeductions(selectedList);
    setIsDeductionModalOpen(false);
  };

  const removeDeduction = (id) => {
    const itemToRemove = deductions.find(d => d.id === id);
    setDeductions(deductions.filter(item => item.id !== id));
    if (itemToRemove) {
      setSuggestedDeductions(prev => prev.map(s => s.label === itemToRemove.label ? { ...s, selected: false } : s));
    }
  };

  // 4. Employer Contribution State
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
  const [employerContributions, setEmployerContributions] = useState([
    { id: 1, label: "Provident Fund (PF)", amount: "" },
    { id: 2, label: "Employee State Insurance (ESI)", amount: "" },
    { id: 3, label: "Health Insurance", amount: "" }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left relative overflow-x-hidden">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[60] shadow-sm text-left">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Back to Templates</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-12 relative overflow-hidden">
          <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase text-left">Salary Structure Template</h1>

          <div className="space-y-12 relative z-10 text-left">
            {/* 🏷️ TEMPLATE NAME SECTION */}
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="space-y-2 flex-1 max-w-md">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Template Name</label>
                <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 shadow-inner" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Set to Default</span>
              </div>
            </div>

            {/* 👥 STAFF DETAILS */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Staff Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Staff Type</label>
                  <div className="relative group"><select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{staffType}</option></select><ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" /></div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Salary Calculation By</label>
                  <div className="relative group"><select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{calcBy}</option></select><ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" /></div>
                </div>
              </div>
            </div>

            {/* 💰 EARNINGS SECTION */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Earnings</h3>
              <div className="space-y-4">
                {earnings.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
                    <div className="md:w-1/2 text-left">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p>
                    </div>
                    <div className="relative w-full md:w-64 ml-auto text-left">
                      <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
                    </div>
                    <button onClick={() => removeEarning(item.id)} className="p-2 text-slate-300 hover:text-red-500 bg-transparent border-0 cursor-pointer"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-blue-600 text-[10px] font-black bg-blue-50/50 px-4 py-2 rounded-lg uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all border-0 cursor-pointer mt-2">
                  <Plus size={14} strokeWidth={3} /> Add More
                </button>
              </div>
            </div>

            {/* 📉 DEDUCTIONS SECTION */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Deductions</h3>
              <div className="space-y-8">
                {deductions.map((item) => (
                  <div key={item.id} className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 group">
                      <div className="md:w-1/2 flex items-center gap-2 text-left">
                         {item.isExpandable && <ChevronUp size={14} className="text-blue-600" />}
                         <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p>
                         {item.hasInfo && <Info size={12} className="text-slate-300" />}
                      </div>
                      <div className="relative w-full md:w-64 ml-auto group text-left">
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-[11px] font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 cursor-pointer">
                          <option>{item.type}</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-blue-500 transition-colors" />
                      </div>
                      <button onClick={() => removeDeduction(item.id)} className="p-2 text-slate-300 hover:text-red-500 bg-transparent border-0 cursor-pointer transition-colors"><Trash2 size={16} /></button>
                    </div>

                    {/* Special PT Row Logic */}
                    {item.label === "Professional Tax (PT)" && (
                      <div className="ml-6 space-y-4 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                        <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline bg-transparent border-0 p-0 cursor-pointer flex items-center gap-1.5">Read Professional Tax Policy Across States. <ExternalLink size={10}/></button>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 ring-1 ring-white">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">If monthly payable salary is</p>
                          <div className="flex items-center gap-3">
                             <div className="relative w-24">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-serif">₹</span>
                               <input type="text" defaultValue="0" className="w-full pl-6 pr-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 outline-none focus:border-blue-300 transition-all" />
                             </div>
                             <span className="text-[10px] font-black text-slate-300">to</span>
                             <div className="relative w-24">
                               <input type="text" placeholder="max" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 outline-none focus:border-blue-300 transition-all placeholder:text-slate-300" />
                             </div>
                             <div className="relative w-24">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-serif">₹</span>
                               <input type="text" defaultValue="0" className="w-full pl-6 pr-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 outline-none focus:border-blue-300 transition-all" />
                             </div>
                             <button className="p-2 text-slate-300 hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* ✅ Trigger Deduction Modal */}
                <button onClick={() => setIsDeductionModalOpen(true)} className="flex items-center gap-2 text-blue-600 text-[10px] font-black bg-blue-50/50 px-4 py-2 rounded-lg uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all border-0 cursor-pointer pt-2">
                  <Plus size={14} strokeWidth={3} /> Add More
                </button>
              </div>
            </div>

            {/* 🤝 EMPLOYER'S CONTRIBUTION SECTION */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Employer's Contribution</h3>
              <div className="space-y-6">
                {employerContributions.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
                    <div className="md:w-1/2 text-left">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p>
                    </div>
                    <div className="relative w-full md:w-64 ml-auto text-left">
                      <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-red-500 bg-transparent border-0 cursor-pointer transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
            <Wallet size={320} />
          </div>
        </div>

        {/* 🛡️ SECURITY PROMISE */}
        <div className="mt-12 flex flex-col md:flex-row md:items-center gap-8 px-4 text-left">
          <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-widest leading-none">Our Promise</h4>
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100"><ShieldCheck size={18} strokeWidth={2.5} /></div>
               <div>
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">100% Safe</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">PagarBook is safe</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100"><Cloud size={18} strokeWidth={2.5} /></div>
               <div>
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">100% Auto Backup</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Data is linked to phone</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/95">
        <div className="max-w-5xl mx-auto flex justify-end gap-4 px-2">
          <button onClick={() => navigate(-1)} className="px-10 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer border-0 outline-none">Cancel</button>
          <button className="px-16 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all border-0 cursor-pointer">Save Template</button>
        </div>
      </div>

      {/* ✅ COMPONENT MODALS (Shared Logic for Earnings/Deductions) */}
      {[
        { 
          open: isModalOpen, 
          setOpen: setIsModalOpen, 
          list: suggestedEarnings, 
          setSuggested: setSuggestedEarnings, 
          title: "Earnings", 
          onSave: handleSaveEarnings 
        },
        { 
          open: isDeductionModalOpen, 
          setOpen: setIsDeductionModalOpen, 
          list: suggestedDeductions, 
          setSuggested: setSuggestedDeductions, 
          title: "Deductions", 
          onSave: handleSaveDeductions 
        }
      ].map((modal) => modal.open && (
        <div key={modal.title} className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => modal.setOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 text-left space-y-1 text-left">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{modal.title} Default List</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">*Selecting atleast one component is a must</p>
            </div>
            <div className="px-6 py-4 space-y-6 text-left">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Suggested</h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {modal.list.map((item, index) => (
                  <label key={index} className="flex items-center gap-3 group cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={item.selected} 
                      onChange={() => {
                        const updated = [...modal.list];
                        updated[index].selected = !updated[index].selected;
                        modal.setSuggested(updated);
                      }} 
                      className="w-4 h-4 rounded mr-3 border-slate-200 text-blue-600 focus:ring-0 cursor-pointer" 
                    />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
              <button onClick={() => modal.setOpen(false)} className="flex-1 py-3 bg-white border border-blue-600 text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 border-0 outline-none cursor-pointer">Cancel</button>
              <button onClick={modal.onSave} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 border-0 outline-none cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalaryStructureTemplate;