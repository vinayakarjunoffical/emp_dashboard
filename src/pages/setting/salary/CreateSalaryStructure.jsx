import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ChevronDown, Plus, Trash2, HelpCircle, Wallet, Info, ExternalLink, 
  Settings2, X, ChevronUp, ShieldCheck, Cloud, Coins, Receipt, Building2, MinusCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SalaryStructureTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.template;

  // 1. Core State
  const [templateName, setTemplateName] = useState("Default");
  const [isDefault, setIsDefault] = useState(true);
  const [staffType, setStaffType] = useState("Monthly Regular");
  const [calcBy, setCalcBy] = useState("₹ (Fixed Amount)");
  const [newCustomName, setNewCustomName] = useState("");

  // 2. Data Lists State
  const [earnings, setEarnings] = useState([{ id: 1, label: "HRA", amount: "" }, { id: 2, label: "Medical Allowance", amount: "" }, { id: 3, label: "Special Allowance", amount: "" }]);
  const [deductions, setDeductions] = useState([{ id: 1, label: "Provident Fund (PF)", type: "Variable [12%]", hasInfo: true }, { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected" }, { id: 3, label: "Professional Tax (PT)", type: "Applied", isExpandable: true }]);
  const [employerContributions, setEmployerContributions] = useState([{ id: 1, label: "Provident Fund (PF)", amount: "" }, { id: 2, label: "Employee State Insurance (ESI)", amount: "" }]);

  // 3. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

  // 4. Suggested Options Logic
  const [suggestedEarnings, setSuggestedEarnings] = useState([{ label: "Basic + DA", selected: false }, { label: "HRA", selected: true }, { label: "Medical Allowance", selected: true }, { label: "Special Allowance", selected: true }, { label: "Bonus", selected: false }]);
  const [suggestedDeductions, setSuggestedDeductions] = useState([{ label: "Provident Fund (PF)", selected: true }, { label: "Employee State Insurance (ESI)", selected: true }, { label: "Professional Tax (PT)", selected: true }, { label: "Income Tax (TDS)", selected: false }]);
  const [suggestedEmployer, setSuggestedEmployer] = useState([{ label: "Provident Fund (PF)", selected: true }, { label: "Employee State Insurance (ESI)", selected: true }, { label: "Health Insurance", selected: false }]);

  // Initialize Edit Data
  useEffect(() => {
    if (editData) {
      setTemplateName(editData.name);
      setIsDefault(editData.isDefault);
    }
  }, [editData]);

  // Logic Helpers
  const handleSaveList = (suggested, currentList, setList, setModal) => {
    const selectedList = suggested.filter(item => item.selected).map((item, index) => {
      const existing = currentList.find(e => e.label === item.label);
      return existing || { id: Date.now() + index, label: item.label, amount: "", type: "0 Selected" };
    });
    setList(selectedList);
    setModal(false);
  };

  const removeRow = (id, list, setList, suggested, setSuggested) => {
    const itemToRemove = list.find(e => e.id === id);
    setList(list.filter(item => item.id !== id));
    if (itemToRemove) setSuggested(suggested.map(s => s.label === itemToRemove.label ? { ...s, selected: false } : s));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-22 text-left relative overflow-x-hidden">
      {/* 🚀 FIXED HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[60] shadow-sm">
        <button onClick={() => navigate(-1)} className="flex !bg-transparent items-center gap-2 text-slate-400 hover:text-blue-600 border-0 bg-transparent cursor-pointer group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-300 transition-transform" />
          <span className="text-[11px] font-black uppercase !text-slate-400 tracking-widest leading-none">Back to Templates</span>
        </button>
      </div>

      <div className=" mx-auto px-6 mt-8 space-y-6">
        {/* 🏷️ TOP INFO CARD */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-10">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="space-y-2 flex-1 max-w-md">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Template Name</label>
              <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Set to Default</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Staff Type</label>
              <div className="relative group">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{staffType}</option></select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Salary Calculation By</label>
              <div className="relative group">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{calcBy}</option></select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 💰 1. EARNINGS SECTION */}
        <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Coins size={18} strokeWidth={2.5} /></div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Earnings</h3>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500"><Plus size={14} strokeWidth={3} /> Add More</button>
          </div>
          <div className="p-8 space-y-6">
            {earnings.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
                <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
                <div className="relative w-full md:w-64 ml-auto text-left">
                  <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
                </div>
                <button onClick={() => removeRow(item.id, earnings, setEarnings, suggestedEarnings, setSuggestedEarnings)} className="p-2 !text-slate-200 hover:text-blue-500 rounded-xl !bg-transparent border cursor-pointer"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* 📉 2. DEDUCTIONS SECTION */}
        <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><MinusCircle size={18} strokeWidth={2.5} /></div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Deductions</h3>
            </div>
            <button onClick={() => setIsDeductionModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500"><Plus size={14} strokeWidth={3} /> Add More</button>
          </div>
          <div className="p-8 space-y-8">
            {deductions.map((item) => (
              <div key={item.id} className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/2 flex items-center gap-2 text-left">
                    {item.isExpandable && <ChevronUp size={14} className="text-blue-600" />}
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p>
                    {item.hasInfo && <Info size={12} className="text-slate-300" />}
                  </div>
                  <div className="relative w-full md:w-64 ml-auto group text-left">
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-[11px] font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{item.type}</option></select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  </div>
                  <button onClick={() => removeRow(item.id, deductions, setDeductions, suggestedDeductions, setSuggestedDeductions)} className="p-2 !text-slate-200 hover:!text-blue-500 !bg-transparent border rounded-xl cursor-pointer"><Trash2 size={16} /></button>
                </div>
                {item.label === "Professional Tax (PT)" && (
                  <div className="ml-6 space-y-4 text-left border-l-2 border-slate-100 pl-6">
                    <button className="text-[9px] font-black !text-blue-600 uppercase tracking-widest !bg-transparent hover:underline  border-0 p-0 cursor-pointer flex items-center gap-1.5">Read PT Policy Across States <ExternalLink size={10}/></button>
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Monthly payable salary</p>
                      <div className="flex items-center gap-3">
                         <div className="relative w-24"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300">₹</span><input type="text" defaultValue="0" className="w-full pl-6 pr-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none" /></div>
                         <span className="text-[10px] font-black text-slate-300 uppercase">to</span>
                         <div className="relative w-24"><input type="text" placeholder="max" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none" /></div>
                         <button className="p-2 !text-slate-300 hover:text-blue-500 !bg-transparent border-0 cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 🤝 3. EMPLOYER SECTION */}
        <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Building2 size={18} strokeWidth={2.5} /></div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Employer's Contribution</h3>
            </div>
            <button onClick={() => setIsEmployerModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500"><Plus size={14} strokeWidth={3} /> Add More</button>
          </div>
          <div className="p-8 space-y-6">
            {employerContributions.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
                <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
                <div className="relative w-full md:w-64 ml-auto text-left">
                  <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
                </div>
                <button onClick={() => removeRow(item.id, employerContributions, setEmployerContributions, suggestedEmployer, setSuggestedEmployer)} className="p-2 !text-slate-200 hover:!text-blue-500 !bg-transparent border rounded-xl cursor-pointer"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/95">
        <div className="mx-auto flex justify-end gap-4 px-2">
          <button onClick={() => navigate(-1)} className="px-10 py-3 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer">Cancel</button>
          <button className="px-16 py-3 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:!bg-blue-600 hover:!text-white transition-all cursor-pointer">Save Template</button>
        </div>
      </div>

      {/* ✅ UNIFIED MODAL COMPONENT */}
      {[
        { open: isModalOpen, setOpen: setIsModalOpen, list: suggestedEarnings, setList: setSuggestedEarnings, title: "Earnings", onSave: () => handleSaveList(suggestedEarnings, earnings, setEarnings, setIsModalOpen) },
        { open: isDeductionModalOpen, setOpen: setIsDeductionModalOpen, list: suggestedDeductions, setList: setSuggestedDeductions, title: "Deductions", onSave: () => handleSaveList(suggestedDeductions, deductions, setDeductions, setIsDeductionModalOpen) },
        { open: isEmployerModalOpen, setOpen: setIsEmployerModalOpen, list: suggestedEmployer, setList: setSuggestedEmployer, title: "Employer Contribution", onSave: () => handleSaveList(suggestedEmployer, employerContributions, setEmployerContributions, setIsEmployerModalOpen) }
      ].map((modal) => modal.open && (
        <div key={modal.title} className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => modal.setOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 text-left">
            <div className="p-6 space-y-1"><h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{modal.title} List</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">*Select at least one component</p></div>
            <div className="px-6 py-4 space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Suggested</h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {modal.list.map((item, index) => (
                  <label key={index} className="flex items-center gap-3 group cursor-pointer">
                    <input type="checkbox" checked={item.selected} onChange={() => { const updated = [...modal.list]; updated[index].selected = !updated[index].selected; modal.setList(updated); }} className="w-4 h-4 rounded mr-3 border-slate-200 text-blue-600 focus:ring-0" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
              <div className="pt-2"><h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Custom List</h4>
                <div className="flex gap-2"><input type="text" placeholder="Add custom item" className="flex-1 !bg-slate-50 border !border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:!border-blue-400" value={newCustomName} onChange={(e) => setNewCustomName(e.target.value)} /><button onClick={() => { if(newCustomName) { modal.setList([...modal.list, {label: newCustomName, selected: true}]); setNewCustomName(""); } }} className="px-4 py-2.5 !bg-blue-50 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer">Add</button></div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
              <button onClick={() => modal.setOpen(false)} className="flex-1 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest">Cancel</button>
              <button onClick={modal.onSave} className="flex-1 py-3 !bg-white !text-blue-500 border border-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm">Save</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalaryStructureTemplate;
//******************************************************************************************************** */
// import React, { useState, useEffect } from 'react';
// import { 
//   ArrowLeft, ChevronDown, Plus, Trash2, HelpCircle, Wallet, Info, ExternalLink, Settings2, X, ChevronUp, ShieldCheck, Cloud
// } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const SalaryStructureTemplate = () => {
//   const navigate = useNavigate();

//   // 1. Basic Info State
//   const [templateName, setTemplateName] = useState("Default");
//   const [isDefault, setIsDefault] = useState(true);
//   const [staffType, setStaffType] = useState("Monthly Regular");
//   const [calcBy, setCalcBy] = useState("₹ (Fixed Amount)");
//   const [newCustomName, setNewCustomName] = useState("");
//   const location = useLocation();

//   const editData = location.state?.template;

//   // ✅ INITIALIZE DATA ON LOAD
//   useEffect(() => {
//     if (editData) {
//       setTemplateName(editData.name);
//       setIsDefault(editData.isDefault);
//       // If your 'template' object in ManageSalaryTemplates had earnings/deductions, 
//       // you would map them here:
//       // if(editData.earnings) setEarnings(editData.earnings);
//     }
//   }, [editData]);

//   // 2. Earnings State & Sync Logic
//   const [earnings, setEarnings] = useState([
//     { id: 1, label: "HRA", amount: "" },
//     { id: 2, label: "Medical Allowance", amount: "" },
//     { id: 3, label: "Special Allowance", amount: "" }
//   ]);
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [suggestedEarnings, setSuggestedEarnings] = useState([
//     { label: "Basic + DA", selected: false },
//     { label: "HRA", selected: true },
//     { label: "Medical Allowance", selected: true },
//     { label: "Travel Allowance", selected: false },
//     { label: "Special Allowance", selected: true },
//     { label: "Meal Allowance", selected: false },
//     { label: "Leave Travel Allowance", selected: false },
//     { label: "Bonus", selected: false },
//   ]);

//   // 3. Deductions State & Logic
//   const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
//   const [deductions, setDeductions] = useState([
//     { id: 1, label: "Provident Fund (PF)", type: "Variable [12%]", hasInfo: true },
//     { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected" },
//     { id: 3, label: "Professional Tax (PT)", type: "Applied (As Per Current Month's Calculation)", isExpandable: true }
//   ]);

//   const [suggestedDeductions, setSuggestedDeductions] = useState([
//     { label: "Provident Fund (PF)", selected: true },
//     { label: "Employee State Insurance (ESI)", selected: true },
//     { label: "Professional Tax (PT)", selected: true },
//     { label: "Income Tax (TDS)", selected: false },
//     { label: "Loan Repayment", selected: false },
//     { label: "Advance Salary", selected: false },
//   ]);

//   // 4. Employer Contribution State & Logic
//   const [employerContributions, setEmployerContributions] = useState([
//     { id: 1, label: "Provident Fund (PF)", amount: "" },
//     { id: 2, label: "Employee State Insurance (ESI)", amount: "" },
//     { id: 3, label: "Health Insurance", amount: "" }
//   ]);
//   const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
//   const [suggestedEmployer, setSuggestedEmployer] = useState([
//     { label: "Provident Fund (PF)", selected: true },
//     { label: "Employee State Insurance (ESI)", selected: true },
//     { label: "Health Insurance", selected: true },
//     { label: "Gratuity", selected: false },
//     { label: "Labor Welfare Fund (LWF)", selected: false },
//   ]);

//   // ✅ HELPER FUNCTIONS FOR MODALS
//   const handleSaveList = (suggested, currentList, setList, setModal) => {
//     const selectedList = suggested
//       .filter(item => item.selected)
//       .map((item, index) => {
//         const existing = currentList.find(e => e.label === item.label);
//         if (existing) return existing;
//         return {
//           id: Date.now() + index,
//           label: item.label,
//           amount: "",
//           type: item.label === "Professional Tax (PT)" ? "Applied (As Per Current Month's Calculation)" : "0 Selected",
//           isExpandable: item.label === "Professional Tax (PT)",
//           hasInfo: item.label === "Provident Fund (PF)"
//         };
//       });
//     setList(selectedList);
//     setModal(false);
//   };

//   const handleAddCustom = (suggested, setSuggested) => {
//     if (newCustomName.trim()) {
//       setSuggested([...suggested, { label: newCustomName, selected: true }]);
//       setNewCustomName("");
//     }
//   };

//   const toggleSuggestion = (index, list, setList) => {
//     const updated = [...list];
//     updated[index].selected = !updated[index].selected;
//     setList(updated);
//   };

//   const removeRow = (id, list, setList, suggested, setSuggested) => {
//     const itemToRemove = list.find(e => e.id === id);
//     setList(list.filter(item => item.id !== id));
//     if (itemToRemove) {
//       setSuggested(suggested.map(s => s.label === itemToRemove.label ? { ...s, selected: false } : s));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left relative overflow-x-hidden">
//       {/* 🚀 STICKY HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[60] shadow-sm">
//         <button onClick={() => navigate(-1)} className="flex items-center  !bg-transparent gap-2 text-slate-400 hover:text-blue-600 border-0 bg-transparent cursor-pointer group">
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-300 transition-transform" />
//           <span className="text-[11px] font-black uppercase text-slate-300 tracking-widest leading-none">Back to Templates</span>
//         </button>
//       </div>

//       <div className=" mx-auto px-6 mt-8 space-y-8">
//         <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-12 relative overflow-hidden">
//           <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Salary Structure Template</h1>

//           <div className="space-y-12 relative z-10">
//             {/* TEMPLATE NAME SECTION */}
//             <div className="flex flex-col md:flex-row md:items-center gap-8 mb-4">
//               <div className="space-y-2 flex-1 max-w-md">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Template Name</label>
//                 <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 shadow-inner" />
//               </div>
//               <div className="flex items-center gap-3 pt-6">
//                 <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer" />
//                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Set to Default</span>
//               </div>
//             </div>

//             {/* STAFF DETAILS */}
//             <div className="space-y-6 mb-4">
//               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Staff Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Staff Type</label>
//                   <div className="relative group"><select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{staffType}</option></select><ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" /></div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Salary Calculation By</label>
//                   <div className="relative group"><select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{calcBy}</option></select><ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" /></div>
//                 </div>
//               </div>
//             </div>

//             {/* EARNINGS SECTION */}
//             <div className="space-y-6 mb-4">
//               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Earnings</h3>
//               <div className="space-y-6">
//                 {earnings.map((item) => (
//                   <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
//                     <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
//                     <div className="relative w-full md:w-64 ml-auto text-left">
//                       <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
//                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
//                     </div>
//                     <button onClick={() => removeRow(item.id, earnings, setEarnings, suggestedEarnings, setSuggestedEarnings)} className="p-2 !text-slate-300 hover:!text-blue-500 !bg-transparent border-0 cursor-pointer transition-colors"><Trash2 size={16} /></button>
//                   </div>
//                 ))}
//                 <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-blue-50/50 px-4 py-2 rounded-lg uppercase tracking-[0.2em] hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer mt-2"><Plus size={14} strokeWidth={3} /> Add More</button>
//               </div>
//             </div>

//             {/* ✅ RESTORED: DEDUCTIONS SECTION */}
//             <div className="space-y-6 mb-4">
//               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Deductions</h3>
//               <div className="space-y-8">
//                 {deductions.map((item) => (
//                   <div key={item.id} className="space-y-4">
//                     <div className="flex flex-col md:flex-row md:items-center gap-4">
//                       <div className="md:w-1/2 flex items-center gap-2 text-left">
//                          {item.isExpandable && <ChevronUp size={14} className="text-blue-600" />}
//                          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p>
//                          {item.hasInfo && <Info size={12} className="text-slate-300" />}
//                       </div>
//                       <div className="relative w-full md:w-64 ml-auto group text-left">
//                         <select className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-[11px] font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{item.type}</option></select>
//                         <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-blue-500 transition-colors" />
//                       </div>
//                       <button onClick={() => removeRow(item.id, deductions, setDeductions, suggestedDeductions, setSuggestedDeductions)} className="p-2 !text-slate-300 hover:!text-blue-500 !bg-transparent border-0 cursor-pointer transition-colors"><Trash2 size={16} /></button>
//                     </div>
//                     {item.label === "Professional Tax (PT)" && (
//                       <div className="ml-6 space-y-4 text-left">
//                         <button className="text-[9px] font-black !text-blue-600 uppercase tracking-widest hover:underline !bg-transparent border-0 p-0 cursor-pointer flex items-center gap-1.5 font-sans">Read Professional Tax Policy Across States. <ExternalLink size={10}/></button>
//                         <div className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 ring-1 ring-white">
//                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">If monthly payable salary is</p>
//                           <div className="flex items-center gap-3">
//                              <div className="relative w-24"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300">₹</span><input type="text" defaultValue="0" className="w-full pl-6 pr-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none" /></div>
//                              <span className="text-[10px] font-black text-slate-300 uppercase">to</span>
//                              <div className="relative w-24"><input type="text" placeholder="max" className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none" /></div>
//                              <div className="relative w-24"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300">₹</span><input type="text" defaultValue="0" className="w-full pl-6 pr-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none" /></div>
//                              <button className="p-2 !text-slate-300 hover:!text-blue-400 !bg-transparent border-0 cursor-pointer"><Trash2 size={14} /></button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <button onClick={() => setIsDeductionModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-blue-50/50 px-4 py-2 rounded-lg uppercase tracking-[0.2em] hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer mt-2"><Plus size={14} strokeWidth={3} /> Add More</button>
//               </div>
//             </div>

//             {/* ✅ RESTORED: EMPLOYER'S CONTRIBUTION SECTION */}
//             <div className="space-y-6 mb-4">
//               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Employer's Contribution</h3>
//               <div className="space-y-6">
//                 {employerContributions.map((item) => (
//                   <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
//                     <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
//                     <div className="relative w-full md:w-64 ml-auto text-left">
//                       <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
//                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
//                     </div>
//                     <button onClick={() => removeRow(item.id, employerContributions, setEmployerContributions, suggestedEmployer, setSuggestedEmployer)} className="p-2 !text-slate-300 !bg-transparent hover:!text-blue-500  border-0 cursor-pointer transition-colors"><Trash2 size={16} /></button>
//                   </div>
//                 ))}
//                 <button onClick={() => setIsEmployerModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-blue-50/50 px-4 py-2 rounded-lg uppercase tracking-[0.2em] hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer mt-2"><Plus size={14} strokeWidth={3} /> Add More</button>
//               </div>
//             </div>
//           </div>
//           <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12"><Wallet size={320} /></div>
//         </div>

        
//       </div>

//       {/* FIXED FOOTER */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/95">
//         <div className=" mx-auto flex justify-end gap-4 px-2">
//           <button onClick={() => navigate(-1)} className="px-10 py-3 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all cursor-pointer shadow-sm border-0 outline-none">Cancel</button>
//           <button className="px-16 py-3 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm border border-blue-500 shadow-blue-200 hover:!bg-white transition-all outline-none cursor-pointer">Save Template</button>
//         </div>
//       </div>

//       {/* ✅ UNIFIED MODAL LOGIC */}
//       {[
//         { open: isModalOpen, setOpen: setIsModalOpen, list: suggestedEarnings, setList: setSuggestedEarnings, title: "Earnings", onSave: () => handleSaveList(suggestedEarnings, earnings, setEarnings, setIsModalOpen) },
//         { open: isDeductionModalOpen, setOpen: setIsDeductionModalOpen, list: suggestedDeductions, setList: setSuggestedDeductions, title: "Deductions", onSave: () => handleSaveList(suggestedDeductions, deductions, setDeductions, setIsDeductionModalOpen) },
//         { open: isEmployerModalOpen, setOpen: setIsEmployerModalOpen, list: suggestedEmployer, setList: setSuggestedEmployer, title: "Employer", onSave: () => handleSaveList(suggestedEmployer, employerContributions, setEmployerContributions, setIsEmployerModalOpen) }
//       ].map((modal) => modal.open && (
//         <div key={modal.title} className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => modal.setOpen(false)} />
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
//             <div className="p-6 text-left space-y-1 text-left">
//               <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{modal.title} Default List</h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">*Selecting atleast one component is a must</p>
//             </div>
//             <div className="px-6 py-4 space-y-6 text-left text-left">
//               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Suggested</h4>
//               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
//                 {modal.list.map((item, index) => (
//                   <label key={index} className="flex items-center gap-3 group cursor-pointer">
//                     <input type="checkbox" checked={item.selected} onChange={() => toggleSuggestion(index, modal.list, modal.setList)} className="w-4 h-4 rounded mr-3 border-slate-200 text-blue-600 focus:ring-0 cursor-pointer" />
//                     <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.label}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className="pt-2">
//                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Custom List</h4>
//                 <div className="flex gap-2 text-left">
//                   <input type="text" placeholder="Add custom item" className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:border-blue-400" value={newCustomName} onChange={(e) => setNewCustomName(e.target.value)} />
//                   <button onClick={() => handleAddCustom(modal.list, modal.setList)} className="px-4 py-2.5 !bg-blue-50 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer">Add</button>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
//               <button onClick={() => modal.setOpen(false)} className="flex-1 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 active:scale-95 border outline-none cursor-pointer">Cancel</button>
//               <button onClick={modal.onSave} className="flex-1 py-3 !bg-white !text-blue-500 border border-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-200 active:scale-95 outline-none cursor-pointer">Save</button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SalaryStructureTemplate;
