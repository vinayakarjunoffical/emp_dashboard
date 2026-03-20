import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ChevronDown, Plus, Trash2, HelpCircle, Wallet, Info, ExternalLink, 
  Settings2, X, ChevronUp, ShieldCheck, Cloud, Coins, Receipt, Building2, MinusCircle, MoreVertical,
  CreditCard, History // Added these for the header
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditSalaryStruture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.template;
  
  // Extracting employee context if passed through state (fallback to Template mode)
  const employeeName = location.state?.employeeName || "Registry Template";
  const employeeId = location.state?.employeeId || "SYS-NODE-01";

  // 1. Core State
  const [templateName, setTemplateName] = useState("Default");
  const [isDefault, setIsDefault] = useState(true);
  const [staffType, setStaffType] = useState("Monthly Regular");
  const [calcBy, setCalcBy] = useState("₹ (Fixed Amount)");
  const [newCustomName, setNewCustomName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [selectedEsiItems, setSelectedEsiItems] = useState(["Basic + DA", "HRA"]); 

  // 2. Data Lists State
  const [earnings, setEarnings] = useState([{ id: 1, label: "HRA", amount: "" }, { id: 2, label: "Medical Allowance", amount: "" }, { id: 3, label: "Special Allowance", amount: "" }]);
  const [deductions, setDeductions] = useState([{ id: 1, label: "Provident Fund (PF)", type: "Variable [12%]", hasInfo: true }, { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected" }, { id: 3, label: "Professional Tax (PT)",  }]);
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
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-32 text-left relative overflow-x-hidden">
      
      {/* 🏛️ ATTRACTIVE ENTERPRISE HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-6 sticky top-0 z-[50] rounded-lg shadow-sm animate-in slide-in-from-top-4 duration-500">
        <div className=" mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-5">
            {/* Back Action */}
            <button 
              onClick={() => navigate(-1)} 
              className="p-2.5 !bg-white border !border-slate-200 !text-slate-400 rounded-xl hover:!border-blue-500 hover:!text-blue-600 transition-all shadow-sm active:scale-90 outline-none cursor-pointer"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>

            {/* Branding Box */}
            <div className="hidden sm:flex w-12 h-12 !bg-white !text-blue-500 rounded-xl items-center justify-center shadow-sm shadow-blue-200">
              <CreditCard size={22} strokeWidth={2} />
            </div>

            <div className="flex flex-col text-left">
              
              
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none flex items-center gap-2">
                Edit Salary Structure
                
              </h1>
            </div>
          </div>

          {/* 🏷️ CONTEXT BADGE */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Employee Name</p>
              <p className="text-[11px] font-black text-slate-700 uppercase">{employeeName}</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 hidden md:block mx-2" />
           
          </div>
        </div>
      </div>

      {/* 📦 MAIN CONTENT AREA */}
      <div className="mx-auto px-6 mt-8 space-y-6 max-w-[1440px]">
        
        {/* 💰 1. EARNINGS SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Coins size={18} strokeWidth={2.5} /></div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Earnings</h3>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500 transition-all active:scale-95"><Plus size={14} strokeWidth={3} /> Add More</button>
          </div>
          <div className="p-8 space-y-6">
            {earnings.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
                <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
                <div className="relative w-full md:w-64 ml-auto text-left">
                  <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
                </div>
                <button onClick={() => removeRow(item.id, earnings, setEarnings, suggestedEarnings, setSuggestedEarnings)} className="p-2 !text-slate-200 hover:!text-rose-500 rounded-xl !bg-transparent border border-transparent hover:border-rose-100 cursor-pointer transition-all"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* 📉 2. DEDUCTIONS SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><MinusCircle size={18} strokeWidth={2.5} /></div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Deductions</h3>
            </div>
            <button onClick={() => setIsDeductionModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500 transition-all active:scale-95"><Plus size={14} strokeWidth={3} /> Add More</button>
          </div>
          <div className="p-8 space-y-8">
            {deductions.map((item) => (
              <div key={item.id} className="space-y-4 relative">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/2 flex items-center gap-2 text-left">
                    {item.isExpandable && <ChevronUp size={14} className="text-blue-600" />}
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p>
                    {item.hasInfo && <Info size={12} className="text-slate-300" />}
                  </div>

                  <div className="relative w-full md:w-64 ml-auto text-left">
                    {item.label === "Employee State Insurance (ESI)" ? (
                      <div className="relative">
                        <div 
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                          className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === item.id ? 'border-blue-500 ring-4 ring-blue-500/5 bg-white' : 'hover:border-slate-300'}`}
                        >
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                            {selectedEsiItems.length > 0 ? `${selectedEsiItems.length} Selected` : "Select Components"}
                          </span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                        </div>

                        {activeDropdown === item.id && (
                          <>
                            <div className="fixed inset-0 z-[70]" onClick={() => setActiveDropdown(null)} />
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] p-2 animate-in fade-in slide-in-from-top-1 duration-200 max-h-64 overflow-y-auto custom-scrollbar">
                              {['Basic + DA', 'HRA', 'Medical Allowance', 'Special Allowance', 'OT Wages', 'Bonus Wages', 'Allowance Wages'].map((opt) => (
                                <label key={opt} className="flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer group transition-all">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedEsiItems.includes(opt)}
                                    onChange={() => setSelectedEsiItems(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600" 
                                  />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedEsiItems.includes(opt) ? 'text-blue-600' : 'text-slate-500'}`}>
                                    {opt}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : item.label === "Professional Tax (PT)" ? (
                      <div className="w-full text-right h-10 flex items-center justify-end px-2">
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Manual Configuration</span>
                      </div>
                    ) : (
                      <div className="relative group">
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-[11px] font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 cursor-pointer transition-all">
                          <option>{item.type}</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {item.label !== "Professional Tax (PT)" && (
                    <button onClick={() => removeRow(item.id, deductions, setDeductions, suggestedDeductions, setSuggestedDeductions)} className="p-2 !text-slate-200 hover:!text-rose-500 !bg-transparent border border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {item.label === "Professional Tax (PT)" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-8 -mt-2">
                       <button className="text-[10px] font-medium !text-blue-500 hover:underline border-0 p-0 !bg-transparent cursor-pointer flex items-center gap-1.5">
                         Read Professional Tax Policy <span className="text-slate-400">Across States</span>
                       </button>
                       <div className="bg-slate-50/80 px-3 py-1 rounded-full border border-slate-100 flex items-center gap-1.5">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Applied |</span>
                         <span className="text-[11px] font-black text-slate-800">₹ 0</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">(As Per Current Calculation)</span>
                       </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 pr-1">
                      <p className="text-[11px] font-medium text-slate-500 italic">If monthly payable salary is</p>
                      <div className="flex items-center gap-3">
                        <div className="relative w-28">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                          <input type="text" placeholder="0" className="w-full pl-7 pr-3 py-2.5 bg-slate-100 border-0 rounded-lg text-[11px] font-bold text-slate-600 outline-none" />
                        </div>
                        <div className="relative w-28">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                          <input type="text" placeholder="max" className="w-full pl-7 pr-3 py-2.5 bg-slate-100 border-0 rounded-lg text-[11px] font-bold text-slate-600 outline-none" />
                        </div>
                        <div className="relative w-28 ml-4">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
                          <input type="text" defaultValue="0" className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 shadow-sm" />
                        </div>
                        <button className="p-2 !text-slate-300 hover:!text-slate-900 !bg-transparent border-0 cursor-pointer transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 🤝 3. EMPLOYER SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Building2 size={18} strokeWidth={2.5} /></div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Employer's Contribution</h3>
            </div>
            <button onClick={() => setIsEmployerModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500 transition-all active:scale-95"><Plus size={14} strokeWidth={3} /> Add More</button>
          </div>
          <div className="p-8 space-y-6">
            {employerContributions.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
                <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
                <div className="relative w-full md:w-64 ml-auto text-left">
                  <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 transition-all" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
                </div>
                <button onClick={() => removeRow(item.id, employerContributions, setEmployerContributions, suggestedEmployer, setSuggestedEmployer)} className="p-2 !text-slate-200 hover:!text-rose-500 !bg-transparent border border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/95">
        <div className="max-w-[1440px] mx-auto flex justify-end gap-4 px-6">
          <button onClick={() => navigate(-1)} className="px-10 py-3 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer active:scale-95 transition-all">Cancel</button>
          <button className="px-16 py-3 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:!bg-blue-600 hover:!text-white transition-all cursor-pointer active:scale-95">Save Template</button>
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
              <button onClick={() => modal.setOpen(false)} className="flex-1 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">Cancel</button>
              <button onClick={modal.onSave} className="flex-1 py-3 !bg-white !text-blue-500 border border-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm outline-none cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EditSalaryStruture;
//*********************************************************************************************************** */
// import React, { useState, useEffect } from 'react';
// import { 
//   ArrowLeft, ChevronDown, Plus, Trash2, HelpCircle, Wallet, Info, ExternalLink, 
//   Settings2, X, ChevronUp, ShieldCheck, Cloud, Coins, Receipt, Building2, MinusCircle,MoreVertical,
// } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const EditSalaryStruture = () => {
// const navigate = useNavigate();
//   const location = useLocation();
//   const editData = location.state?.template;

//   // 1. Core State
//   const [templateName, setTemplateName] = useState("Default");
//   const [isDefault, setIsDefault] = useState(true);
//   const [staffType, setStaffType] = useState("Monthly Regular");
//   const [calcBy, setCalcBy] = useState("₹ (Fixed Amount)");
//   const [newCustomName, setNewCustomName] = useState("");
//   const [activeDropdown, setActiveDropdown] = useState(null); // Tracks which deduction dropdown is open
// const [selectedEsiItems, setSelectedEsiItems] = useState(["Basic + DA", "HRA"]); // Initial default values

//   // 2. Data Lists State
//   const [earnings, setEarnings] = useState([{ id: 1, label: "HRA", amount: "" }, { id: 2, label: "Medical Allowance", amount: "" }, { id: 3, label: "Special Allowance", amount: "" }]);
//   const [deductions, setDeductions] = useState([{ id: 1, label: "Provident Fund (PF)", type: "Variable [12%]", hasInfo: true }, { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected" }, { id: 3, label: "Professional Tax (PT)",  }]);
//   const [employerContributions, setEmployerContributions] = useState([{ id: 1, label: "Provident Fund (PF)", amount: "" }, { id: 2, label: "Employee State Insurance (ESI)", amount: "" }]);

//   // 3. Modal States
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
//   const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

//   // 4. Suggested Options Logic
//   const [suggestedEarnings, setSuggestedEarnings] = useState([{ label: "Basic + DA", selected: false }, { label: "HRA", selected: true }, { label: "Medical Allowance", selected: true }, { label: "Special Allowance", selected: true }, { label: "Bonus", selected: false }]);
//   const [suggestedDeductions, setSuggestedDeductions] = useState([{ label: "Provident Fund (PF)", selected: true }, { label: "Employee State Insurance (ESI)", selected: true }, { label: "Professional Tax (PT)", selected: true }, { label: "Income Tax (TDS)", selected: false }]);
//   const [suggestedEmployer, setSuggestedEmployer] = useState([{ label: "Provident Fund (PF)", selected: true }, { label: "Employee State Insurance (ESI)", selected: true }, { label: "Health Insurance", selected: false }]);

//   // Initialize Edit Data
//   useEffect(() => {
//     if (editData) {
//       setTemplateName(editData.name);
//       setIsDefault(editData.isDefault);
//     }
//   }, [editData]);

//   // Logic Helpers
//   const handleSaveList = (suggested, currentList, setList, setModal) => {
//     const selectedList = suggested.filter(item => item.selected).map((item, index) => {
//       const existing = currentList.find(e => e.label === item.label);
//       return existing || { id: Date.now() + index, label: item.label, amount: "", type: "0 Selected" };
//     });
//     setList(selectedList);
//     setModal(false);
//   };

//   const removeRow = (id, list, setList, suggested, setSuggested) => {
//     const itemToRemove = list.find(e => e.id === id);
//     setList(list.filter(item => item.id !== id));
//     if (itemToRemove) setSuggested(suggested.map(s => s.label === itemToRemove.label ? { ...s, selected: false } : s));
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-22 text-left relative overflow-x-hidden">
//       {/* 🚀 FIXED HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[60] shadow-sm">
//         <button onClick={() => navigate(-1)} className="flex !bg-transparent items-center gap-2 text-slate-400 hover:text-blue-600 border-0 bg-transparent cursor-pointer group">
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-300 transition-transform" />
//           <span className="text-[11px] font-black uppercase !text-slate-400 tracking-widest leading-none">Back to Templates</span>
//         </button>
//       </div>

//       <div className=" mx-auto px-6 mt-8 space-y-6">
//         {/* 🏷️ TOP INFO CARD */}
//         {/* <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-10">
//           <div className="flex flex-col md:flex-row md:items-center mb-4 gap-8">
//             <div className="space-y-2 flex-1 max-w-md">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Template Name</label>
//               <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
//             </div>
//             <div className="flex items-center gap-3 pt-6">
//               <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
//               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Set to Default</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-4">
//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Staff Type</label>
//               <div className="relative group">
//                 <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{staffType}</option></select>
//                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Salary Calculation By</label>
//               <div className="relative group">
//                 <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"><option>{calcBy}</option></select>
//                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
//               </div>
//             </div>
//           </div>
//         </div> */}

//         <div>
//             <h1>Edit Salary Structure</h1>
//         </div>

//         {/* 💰 1. EARNINGS SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Coins size={18} strokeWidth={2.5} /></div>
//               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Earnings</h3>
//             </div>
//             <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500"><Plus size={14} strokeWidth={3} /> Add More</button>
//           </div>
//           <div className="p-8 space-y-6">
//             {earnings.map((item) => (
//               <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
//                 <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
//                 <div className="relative w-full md:w-64 ml-auto text-left">
//                   <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
//                 </div>
//                 <button onClick={() => removeRow(item.id, earnings, setEarnings, suggestedEarnings, setSuggestedEarnings)} className="p-2 !text-slate-200 hover:text-blue-500 rounded-xl !bg-transparent border cursor-pointer"><Trash2 size={16} /></button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 📉 2. DEDUCTIONS SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><MinusCircle size={18} strokeWidth={2.5} /></div>
//               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Deductions</h3>
//             </div>
//             <button onClick={() => setIsDeductionModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500"><Plus size={14} strokeWidth={3} /> Add More</button>
//           </div>
//           <div className="p-8 space-y-8">
//             {deductions.map((item) => (
//   <div key={item.id} className="space-y-4 relative">
//     <div className="flex flex-col md:flex-row md:items-center gap-4">
//       {/* 1. Label Section */}
//       <div className="md:w-1/2 flex items-center gap-2 text-left">
//         {item.isExpandable && <ChevronUp size={14} className="text-blue-600" />}
//         <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p>
//         {item.hasInfo && <Info size={12} className="text-slate-300" />}
//       </div>

//       {/* 2. Input/Dropdown Section */}
//       <div className="relative w-full md:w-64 ml-auto text-left">
//         {item.label === "Employee State Insurance (ESI)" ? (
//           <div className="relative">
//             <div 
//               onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
//               className={`w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === item.id ? 'border-blue-500 ring-4 ring-blue-500/5 bg-white' : 'hover:border-slate-300'}`}
//             >
//               <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
//                 {selectedEsiItems.length > 0 ? `${selectedEsiItems.length} Selected` : "Select Components"}
//               </span>
//               <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
//             </div>

//             {activeDropdown === item.id && (
//               <>
//                 <div className="fixed h- inset-0 z-[70]" onClick={() => setActiveDropdown(null)} />
//                 <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200  h-36 rounded-2xl shadow-2xl z-[80] p-2 animate-in fade-in slide-in-from-top-1 duration-200 ring-1 ring-slate-200/50 max-h-64 overflow-y-auto custom-scrollbar">
//                   {['Basic + DA', 'HRA', 'Medical Allowance', 'Special Allowance', 'OT Wages', 'Bonus Wages', 'Allowance Wages'].map((opt) => (
//                     <label key={opt} className="flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer group transition-all">
//                       <input 
//                         type="checkbox" 
//                         checked={selectedEsiItems.includes(opt)}
//                         onChange={() => setSelectedEsiItems(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
//                         className="w-4 h-4 rounded mr-2 border-slate-300 text-blue-600 accent-blue-600 focus:ring-0" 
//                       />
//                       <span className={`text-[10px] font-black uppercase tracking-widest ${selectedEsiItems.includes(opt) ? 'text-blue-600' : 'text-slate-500'}`}>
//                         {opt}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : item.label === "Professional Tax (PT)" ? (
//           /* 🔥 PT Header is blank here because calculation status is shown in the expanded section below */
//           <div className="w-full text-right h-10 flex items-center justify-end px-2">
//              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Manual Configuration</span>
//           </div>
//         ) : (
//           <div className="relative group">
//             <select className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-[11px] font-bold text-slate-600 appearance-none outline-none focus:border-blue-400 cursor-pointer transition-all">
//               <option>{item.type}</option>
//             </select>
//             <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
//           </div>
//         )}
//       </div>

//       {/* 3. Global Trash Icon - 🔥 HIDDEN IF PT */}
//       {item.label !== "Professional Tax (PT)" && (
//         <button onClick={() => removeRow(item.id, deductions, setDeductions, suggestedDeductions, setSuggestedDeductions)} className="p-2 !text-slate-200 hover:!text-rose-500 !bg-transparent border border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all">
//           <Trash2 size={16} />
//         </button>
//       )}
//     </div>

//     {/* 4. Professional Tax Detailed Slab Section */}
//     {item.label === "Professional Tax (PT)" && (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between ml-8 -mt-2">
//            <button className="text-[10px] font-medium !text-blue-500 hover:underline border-0 p-0 !bg-transparent cursor-pointer flex items-center gap-1.5">
//              Read Professional Tax Policy <span className="text-slate-400">Across States</span>
//            </button>
           
//            <div className="bg-slate-50/80 px-3 py-1 rounded-full border border-slate-100 flex items-center gap-1.5">
//              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Applied |</span>
//              <span className="text-[11px] font-black text-slate-800">₹ 0</span>
//              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">(As Per Current Month's Calculation)</span>
//            </div>
//         </div>

//         <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 pr-1">
//           <p className="text-[11px] font-medium text-slate-500 italic">If monthly payable salary is</p>
//           <div className="flex items-center gap-3">
//             <div className="relative w-28">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
//               <input type="text" placeholder="0" className="w-full pl-7 pr-3 py-2.5 bg-slate-100 border-0 rounded-lg text-[11px] font-bold text-slate-600 outline-none" />
//             </div>
//             <div className="relative w-28">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
//               <input type="text" placeholder="max" className="w-full pl-7 pr-3 py-2.5 bg-slate-100 border-0 rounded-lg text-[11px] font-bold text-slate-600 outline-none" />
//             </div>
//             <div className="relative w-28 ml-4">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">₹</span>
//               <input type="text" defaultValue="0" className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 shadow-sm" />
//             </div>
//             {/* 🔥 Trash icon removed from here, using ellipsis for slab actions instead */}
//             <button className="p-2 !text-slate-300 hover:!text-slate-900 !bg-transparent border-0 cursor-pointer">
//               <MoreVertical size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// ))}
       
//           </div>
//         </div>

//         {/* 🤝 3. EMPLOYER SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Building2 size={18} strokeWidth={2.5} /></div>
//               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Employer's Contribution</h3>
//             </div>
//             <button onClick={() => setIsEmployerModalOpen(true)} className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-500"><Plus size={14} strokeWidth={3} /> Add More</button>
//           </div>
//           <div className="p-8 space-y-6">
//             {employerContributions.map((item) => (
//               <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 group">
//                 <div className="md:w-1/2 text-left"><p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</p></div>
//                 <div className="relative w-full md:w-64 ml-auto text-left">
//                   <input type="text" placeholder="Enter Amount" className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400" />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 font-serif">₹</span>
//                 </div>
//                 <button onClick={() => removeRow(item.id, employerContributions, setEmployerContributions, suggestedEmployer, setSuggestedEmployer)} className="p-2 !text-slate-200 hover:!text-blue-500 !bg-transparent border rounded-xl cursor-pointer"><Trash2 size={16} /></button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* FIXED FOOTER ACTIONS */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/95">
//         <div className="mx-auto flex justify-end gap-4 px-2">
//           <button onClick={() => navigate(-1)} className="px-10 py-3 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer">Cancel</button>
//           <button className="px-16 py-3 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:!bg-blue-600 hover:!text-white transition-all cursor-pointer">Save Template</button>
//         </div>
//       </div>

//       {/* ✅ UNIFIED MODAL COMPONENT */}
//       {[
//         { open: isModalOpen, setOpen: setIsModalOpen, list: suggestedEarnings, setList: setSuggestedEarnings, title: "Earnings", onSave: () => handleSaveList(suggestedEarnings, earnings, setEarnings, setIsModalOpen) },
//         { open: isDeductionModalOpen, setOpen: setIsDeductionModalOpen, list: suggestedDeductions, setList: setSuggestedDeductions, title: "Deductions", onSave: () => handleSaveList(suggestedDeductions, deductions, setDeductions, setIsDeductionModalOpen) },
//         { open: isEmployerModalOpen, setOpen: setIsEmployerModalOpen, list: suggestedEmployer, setList: setSuggestedEmployer, title: "Employer Contribution", onSave: () => handleSaveList(suggestedEmployer, employerContributions, setEmployerContributions, setIsEmployerModalOpen) }
//       ].map((modal) => modal.open && (
//         <div key={modal.title} className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => modal.setOpen(false)} />
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 text-left">
//             <div className="p-6 space-y-1"><h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{modal.title} List</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">*Select at least one component</p></div>
//             <div className="px-6 py-4 space-y-6">
//               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Suggested</h4>
//               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
//                 {modal.list.map((item, index) => (
//                   <label key={index} className="flex items-center gap-3 group cursor-pointer">
//                     <input type="checkbox" checked={item.selected} onChange={() => { const updated = [...modal.list]; updated[index].selected = !updated[index].selected; modal.setList(updated); }} className="w-4 h-4 rounded mr-3 border-slate-200 text-blue-600 focus:ring-0" />
//                     <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.label}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className="pt-2"><h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">Custom List</h4>
//                 <div className="flex gap-2"><input type="text" placeholder="Add custom item" className="flex-1 !bg-slate-50 border !border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:!border-blue-400" value={newCustomName} onChange={(e) => setNewCustomName(e.target.value)} /><button onClick={() => { if(newCustomName) { modal.setList([...modal.list, {label: newCustomName, selected: true}]); setNewCustomName(""); } }} className="px-4 py-2.5 !bg-blue-50 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer">Add</button></div>
//               </div>
//             </div>
//             <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
//               <button onClick={() => modal.setOpen(false)} className="flex-1 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest">Cancel</button>
//               <button onClick={modal.onSave} className="flex-1 py-3 !bg-white !text-blue-500 border border-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm">Save</button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default EditSalaryStruture
