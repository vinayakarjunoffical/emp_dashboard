import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Info, Edit3, Plus, Clock, ChevronDown, Calendar, X, Trash2, Settings2, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const CreateLeave = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Add Template');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalLevel, setApprovalLevel] = useState('Level One');

  // --- API PAYLOAD STATES ---
  const [templateName, setTemplateName] = useState('Leave Policy');
  const [isSandwichApplied, setIsSandwichApplied] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Loading state for API

  // --- NEW: Leave Cycle & Period Logic ---
  const [leaveCycle, setLeaveCycle] = useState('Yearly');
  const [leavePeriod, setLeavePeriod] = useState('Jan 2026 - Dec 2026');

  // Dynamic Options
  const yearlyOptions = [
    'Jan 2026 - Dec 2026',
    'Apr 2026 - Mar 2027',
    'Jan 2027 - Dec 2027',
    'Apr 2027 - Mar 2028'
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyOptions = months.map(m => `${m} 2026`);

  const handleCycleChange = (e) => {
    const newCycle = e.target.value;
    setLeaveCycle(newCycle);
    if (newCycle === 'Yearly') {
      setLeavePeriod(yearlyOptions[0]);
    } else {
      setLeavePeriod(monthlyOptions[0]);
    }
  };
  
  // ---------------------------------------
  // Leave Categories State
  const [leaveCategories, setLeaveCategories] = useState([
    { id: 1, name: '', count: '', rule: 'Lapse', forward: '', accrual: 'Fixed' }
  ]);

  // Total Leaves Logic
  const totalLeaves = leaveCategories.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);

  const addCategory = () => {
    setLeaveCategories([...leaveCategories, { id: Date.now(), name: '', count: '', rule: 'Lapse', forward: '', accrual: 'Fixed' }]);
  };

  const removeCategory = (id) => {
    setLeaveCategories(leaveCategories.filter(cat => cat.id !== id));
  };

  // ✅ UPDATED: Added Validation Logic for Carry Forward Limit
  const updateCategory = (id, field, value) => {
    setLeaveCategories(leaveCategories.map(cat => {
      if (cat.id !== id) return cat;

      const newCat = { ...cat, [field]: value };

      // Rule 1: If updating Carry Forward, cap it at Leave Count
      if (field === 'forward') {
        const leaveCount = parseFloat(cat.count) || 0;
        const forwardCount = parseFloat(value) || 0;
        
        if (forwardCount > leaveCount) {
          toast.error(`Carry Forward cannot exceed Leave Count (${leaveCount})`);
          newCat.forward = cat.count; // Cap it
        }
      }

      // Rule 2: If lowering Leave Count, auto-lower Carry Forward if it exceeds the new limit
      if (field === 'count') {
        const newLeaveCount = parseFloat(value) || 0;
        const currentForward = parseFloat(cat.forward) || 0;

        if (currentForward > newLeaveCount) {
          newCat.forward = value; // Adjust forward down to match the new max
        }
      }

      return newCat;
    }));
  };

  // 🚀 API INTEGRATION: Save Logic
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const payload = {
        name: templateName,
        description: `Leave policy cycle: ${leaveCycle} (${leavePeriod})`,
        is_active: true,
        // Filter out completely empty rows just in case user leaves them blank
        leave_types: leaveCategories
          .filter(cat => cat.name.trim() !== '') 
          .map((cat) => ({
            name: cat.name,
            category: "Paid", 
            days_per_year: parseFloat(cat.count) || 0,
            
            accrual_frequency: cat.accrual, 
            is_prorated: true, 
            
            carry_forward_enabled: cat.rule === 'Carry Forward',
            max_carry_forward_days: cat.rule === 'Carry Forward' ? (parseFloat(cat.forward) || 0) : 0,
            encashment_enabled: cat.rule === 'Encashment',
            
            applicable_gender: "All",
            applicable_marital_status: "All",
            applicable_employment_status: "All",
            
            min_consecutive_days: 0.5,
            max_consecutive_days: null,
            advance_notice_days: 0,
            is_half_day_allowed: true,
            proof_required_after_days: null,
            
            is_sandwich_rule_applied: isSandwichApplied,
            allow_negative_balance: false,
            cannot_club_with: []
        }))
      };

      // Prevent saving if no valid categories exist
      if (payload.leave_types.length === 0) {
        toast.error("Please add at least one named leave category.");
        setIsSaving(false);
        return;
      }

      const response = await fetch("https://uathr.goelectronix.co.in/leave-policies/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Leave Template created successfully!", {
          duration: 3000,
          position: 'top-center',
        });
        
        setTimeout(() => {
          navigate(-1);
        }, 500);
      } else {
        const errorData = await response.json();
        console.error("API Validation Error:", errorData);
        toast.error("Failed to create template. Please check the fields.", {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Network error. Please try again.", {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-32 text-left relative">
      {/* 🚀 HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
        <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-600 border-0 outline-none cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black !text-slate-700 !capitalize tracking-tight">Create Leave Template</h2>
      </div>

      <div className=" mx-auto px-2 md:px-6 mt-4">
        {/* TABS */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-4 border border-slate-200">
          {['Add Template', 'Assign'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => tab === 'Add Template' && setActiveTab(tab)}
              className={`px-8 py-2 rounded-lg text-[10px] !bg-transparent font-black capitalize tracking-widest transition-all cursor-pointer border-0 ${
                activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-600 cursor-not-allowed'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* MAIN FORM CONTAINER */}
        <div className="space-y-6">
          
          {/* SECTION 1: TEMPLATE SETTINGS */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-6 md:p-8 shadow-sm space-y-8">
            <h3 className="text-sm font-black !text-slate-800 mb-4 !capitalize tracking-widest">Template Settings</h3>
            
            <div className="grid grid-cols-1 gap-4 md:gap-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ">
                <div className="space-y-2 max-w-md">
                  <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Template Name</label>
                  <input 
                    type="text" 
                    value={templateName} 
                    onChange={(e) => setTemplateName(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" 
                  />
               </div>
                  {/* CYCLE SELECTION */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Leave Policy Cycle</label>
                    <div className="relative">
                      <select 
                        value={leaveCycle} 
                        onChange={handleCycleChange}
                        className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
                      >
                        <option value="Yearly">Yearly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* DYNAMIC PERIOD SELECTION */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Leave Period</label>
                    <div className="relative">
                      <select 
                        value={leavePeriod} 
                        onChange={(e) => setLeavePeriod(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-400 rounded-xl pl-4 pr-10 py-3 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
                      >
                        {leaveCycle === 'Yearly' 
                          ? yearlyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                          : monthlyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                        }
                      </select>
                      <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* SECTION 2: LEAVE CATEGORIES */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-slate-50">
              <h3 className="text-sm font-black !text-slate-800 !capitalize tracking-widest">Leave Categories</h3>
              <button 
                onClick={addCategory}
                className="flex items-center justify-center gap-2 border border-blue-600 px-4 py-2 !bg-blue-50 !text-blue-600 rounded-xl hover:!bg-blue-100 transition-all active:scale-95 w-full sm:w-auto cursor-pointer"
              >
                <Plus size={16} strokeWidth={3} />
                <span className="text-[10px] font-black capitalize tracking-widest">Add Leave Category</span>
              </button>
            </div>

            <div className="p-4 sm:p-0 overflow-x-hidden sm:overflow-x-auto bg-slate-50/30 sm:bg-transparent">
              <table className="w-full border-collapse block lg:table">
                <thead className="hidden lg:table-header-group">
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Leave Category Name</th>
                    <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Leave Count</th>
                    <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Accrual Type</th>
                    <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Unused Leave Rule</th>
                    <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Carry Forward Limit</th>
                    <th className="px-8 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-right">Delete</th>
                  </tr>
                </thead>
                
                <tbody className="block lg:table-row-group divide-y-0 lg:divide-y divide-slate-50">
                  {leaveCategories.map((cat) => (
                    <tr key={cat.id} className="group block lg:table-row bg-white lg:bg-transparent border border-slate-200 lg:border-none rounded-2xl lg:rounded-none mb-4 lg:mb-0 hover:bg-slate-50/30 transition-colors overflow-hidden shadow-sm lg:shadow-none">
                      
                      <td className="px-4 lg:px-8 py-4 block lg:table-cell border-b border-slate-100 lg:border-none bg-slate-50/50 lg:bg-transparent">
                        <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest block mb-2">Leave Category Name</span>
                        <input 
                          type="text" 
                          value={cat.name} 
                          onChange={(e) => updateCategory(cat.id, 'name', e.target.value)} 
                          placeholder="e.g. Sick Leave"
                          className="bg-white lg:bg-transparent border lg:border-b p-3 lg:p-2 rounded-xl lg:rounded-lg border-slate-200 text-[12px] lg:text-[11px] font-bold text-slate-700 outline-none w-full focus:border-blue-400 lg:focus:border-slate-200" 
                        />
                      </td>
                      
                      <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
                        <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Leave Count</span>
                        <input 
                          type="number" 
                          value={cat.count}
                          onChange={(e) => updateCategory(cat.id, 'count', e.target.value)} 
                          placeholder="0" 
                          className="w-16 lg:w-20 text-right lg:text-left bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold outline-none focus:border-blue-400" 
                        />
                      </td>

                      <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
                        <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Accrual Type</span>
                        <div className="relative w-36 sm:w-36">
                          <select 
                            value={cat.accrual}
                            onChange={(e) => updateCategory(cat.id, 'accrual', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold appearance-none outline-none text-right pr-8 lg:text-left lg:pr-3 cursor-pointer"
                          >
                            <option value="Fixed">Fixed</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </td>
                      
                      <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
                        <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Unused Leave Rule</span>
                        <div className="relative w-32 sm:w-32">
                          <select 
                            value={cat.rule}
                            onChange={(e) => updateCategory(cat.id, 'rule', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold appearance-none outline-none text-right pr-8 lg:text-left lg:pr-3 cursor-pointer"
                          >
                            <option>Lapse</option>
                            <option>Carry Forward</option>
                            <option>Encashment</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </td>
                      
                      <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
                        <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Carry Forward Limit</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={cat.forward}
                            onChange={(e) => updateCategory(cat.id, 'forward', e.target.value)}
                            disabled={cat.rule !== 'Carry Forward'}
                            max={cat.count} // ✅ Native HTML validation cap
                            placeholder="0" 
                            className="w-16 lg:w-20 text-right lg:text-left bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold outline-none disabled:opacity-50" 
                          />
                          <span className="text-[10px] font-bold text-slate-400 capitalize">Days</span>
                        </div>
                      </td>
                      
                      <td className="px-4 lg:px-8 py-3 lg:py-4 block lg:table-cell text-right bg-slate-50/30 lg:bg-transparent">
                        <button 
                          onClick={() => removeCategory(cat.id)} 
                          className="p-2 w-full lg:w-auto flex items-center justify-center lg:inline-block !text-blue-600 hover:text-blue-600 rounded-lg hover:bg-red-50 transition-all border border-blue-600 lg:border-transparent !bg-transparent opacity-100 lg:opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 size={16} className="hidden lg:block" />
                          <span className="lg:hidden text-[10px] font-black capitalize tracking-widest flex items-center gap-2">
                             <Trash2 size={14} /> Remove Category
                          </span>
                        </button>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-2 md:p-8 bg-slate-50/30 border-t border-slate-50">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input 
                  type="checkbox" 
                  checked={isSandwichApplied}
                  onChange={(e) => setIsSandwichApplied(e.target.checked)}
                  className="w-5 h-5 sm:w-4 sm:h-4 rounded mr-3 border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                />
                <span className="text-[11px] sm:text-[10px] font-black text-slate-600 capitalize tracking-widest group-hover:text-slate-900 transition-colors">Count Sandwich Leaves</span>
              </label>
            </div>
          </div>

          {/* SECTION 3: LEAVE APPROVAL */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h3 className="md:text-sm text-[12px] font-black !text-slate-800 !capitalize tracking-widest">Leave Approval</h3>
                 <div className="flex items-center gap-2">
                    <Info size={14} className="text-blue-600" />
                    <p className="md:text-[10px] text-[8px] font-bold text-slate-500 capitalize tracking-widest">Multilevel Approval Settings is set to <span className="text-slate-700">{approvalLevel}</span> by default</p>
                 </div>
              </div>
              <button 
                onClick={() => setIsApprovalModalOpen(true)}
                className="p-3 !bg-slate-50 !text-blue-600 rounded-2xl hover:!bg-white border border-blue-600 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Edit3 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex flex-col sm:flex-row items-center justify-between px-2 gap-4 sm:gap-0">
          
          <div className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck size={18} />
            </div>
            <p className="text-xs font-black text-slate-800 capitalize tracking-tighter">
              Total Leaves: <span className="text-blue-600 ml-1">{totalLeaves}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all text-center cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex-1 sm:flex-none px-4 sm:px-12 py-3 sm:py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] font-black capitalize tracking-widest shadow-sm border border-blue-600 shadow-blue-200 active:scale-95 transition-all text-center cursor-pointer ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isSaving ? "Saving..." : "Save Template"}
            </button>
          </div>

        </div>
      </div>

      {/* 🔍 SET MULTILEVEL APPROVAL MODAL */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsApprovalModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-6 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-lg font-black !text-slate-900 !capitalize tracking-tighter">Set Multilevel Approval</h3>
               <button onClick={() => setIsApprovalModalOpen(false)} className="p-2 !text-slate-400 hover:!bg-slate-50 rounded-full !bg-transparent transition-all border-0 cursor-pointer outline-none"><X size={20} /></button>
            </div>
            <div className="py-4 px-6 space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Choose Type of Approval</label>
                  <div className="relative">
                     <select 
                        value={approvalLevel} 
                        onChange={(e) => setApprovalLevel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
                     >
                        <option value="Level One">Level One</option>
                        <option value="Level Two">Level Two</option>
                        <option value="Level Three">Level Three</option>
                     </select>
                     <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
               </div>
               <button 
                 onClick={() => setIsApprovalModalOpen(false)}
                 className="w-full py-4 !bg-white !text-blue-600 rounded-xl text-xs font-black capitalize tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-white border border-blue-600 transition-all active:scale-[0.98] cursor-pointer"
               >
                 Save Settings
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateLeave; 
//************************************************************************************************* */
// import React, { useState, useEffect } from 'react';
// import { 
//   ArrowLeft, Info, Edit3, Plus, Clock, ChevronDown, Calendar, X, Trash2, Settings2, ShieldCheck
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast'; // ✅ Added Toaster

// const CreateLeave = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Add Template');
//   const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
//   const [approvalLevel, setApprovalLevel] = useState('Level One');

//   // --- API PAYLOAD STATES ---
//   const [templateName, setTemplateName] = useState('Leave Policy');
//   const [accrualType, setAccrualType] = useState('All at once');
//   const [isSandwichApplied, setIsSandwichApplied] = useState(false);
//   const [isSaving, setIsSaving] = useState(false); // Loading state for API

//   // --- NEW: Leave Cycle & Period Logic ---
//   const [leaveCycle, setLeaveCycle] = useState('Yearly');
//   const [leavePeriod, setLeavePeriod] = useState('Jan 2026 - Dec 2026');

//   // Dynamic Options
//   const yearlyOptions = [
//     'Jan 2026 - Dec 2026',
//     'Apr 2026 - Mar 2027',
//     'Jan 2027 - Dec 2027',
//     'Apr 2027 - Mar 2028'
//   ];

//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   const monthlyOptions = months.map(m => `${m} 2026`);

//   const handleCycleChange = (e) => {
//     const newCycle = e.target.value;
//     setLeaveCycle(newCycle);
//     // Auto-update the period to the first valid option of the new cycle
//     if (newCycle === 'Yearly') {
//       setLeavePeriod(yearlyOptions[0]);
//     } else {
//       setLeavePeriod(monthlyOptions[0]);
//     }
//   };
  
//   // ---------------------------------------
//   // Leave Categories State
//   const [leaveCategories, setLeaveCategories] = useState([
//     { id: 1, name: 'Casual Leave', count: 0, rule: 'Lapse', forward: 0 },
//     { id: 2, name: 'Sick Leave', count: 0, rule: 'Lapse', forward: 0 },
//     { id: 3, name: 'Annual Leave', count: 0, rule: 'Lapse', forward: 0 },
//   ]);

//   // Total Leaves Logic
//   const totalLeaves = leaveCategories.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);

//   const addCategory = () => {
//     setLeaveCategories([...leaveCategories, { id: Date.now(), name: '', count: 0, rule: 'Lapse', forward: 0 }]);
//   };

//   const removeCategory = (id) => {
//     setLeaveCategories(leaveCategories.filter(cat => cat.id !== id));
//   };

//   const updateCategory = (id, field, value) => {
//     setLeaveCategories(leaveCategories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat));
//   };

//   // 🚀 API INTEGRATION: Save Logic
//   const handleSave = async () => {
//     setIsSaving(true);

//     try {
//       // 1. Construct the payload according to backend requirements
//       const payload = {
//         name: templateName,
//         description: `Leave policy cycle: ${leaveCycle} (${leavePeriod})`,
//         is_active: true,
//         leave_types: leaveCategories.map((cat) => ({
//           name: cat.name || "-",
//           category: "Paid", // Defaulting to Paid as per standard, could be added to UI later
//           days_per_year: parseFloat(cat.count) || 0,
          
//           accrual_frequency: accrualType === 'Monthly Accrual' ? 'Monthly' : 'Fixed',
//           is_prorated: true, // Defaulting to true
          
//           carry_forward_enabled: cat.rule === 'Carry Forward',
//           max_carry_forward_days: cat.rule === 'Carry Forward' ? (parseFloat(cat.forward) || 0) : 0,
//           encashment_enabled: cat.rule === 'Encashment',
          
//           applicable_gender: "All",
//           applicable_marital_status: "All",
//           applicable_employment_status: "All",
          
//           min_consecutive_days: 0.5,
//           max_consecutive_days: null,
//           advance_notice_days: 0,
//           is_half_day_allowed: true,
//           proof_required_after_days: null,
          
//           is_sandwich_rule_applied: isSandwichApplied, // Linked to global checkbox
//           allow_negative_balance: false,
//           cannot_club_with: []
//         }))
//       };

//       // 2. Make the API Call
//       const response = await fetch("https://uathr.goelectronix.co.in/leave-policies/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         toast.success("Leave Template created successfully!", {
//           duration: 3000,
//           position: 'top-center',
//         });
        
//         setTimeout(() => {
//           navigate(-1);
//         }, 500);
//       } else {
//         const errorData = await response.json();
//         console.error("API Validation Error:", errorData);
//         toast.error("Failed to create template. Please check the fields.", {
//           duration: 4000,
//           position: 'top-center',
//         });
//       }
//     } catch (error) {
//       console.error("Network Error:", error);
//       toast.error("Network error. Please try again.", {
//         duration: 4000,
//         position: 'top-center',
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white font-['Inter'] pb-32 text-left relative">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
//         <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-600 border-0 outline-none cursor-pointer">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black !text-slate-700 !capitalize tracking-tight">Create Leave Template</h2>
//       </div>

//       <div className=" mx-auto px-2 md:px-6 mt-4">
//         {/* TABS */}
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-4 border border-slate-200">
//           {['Add Template', 'Assign'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)}
//               className={`px-8 py-2 rounded-lg text-[10px] !bg-transparent font-black capitalize tracking-widest transition-all cursor-pointer border-0 ${
//                 activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-600 cursor-not-allowed'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* MAIN FORM CONTAINER */}
//         <div className="space-y-6">
          
//           {/* SECTION 1: TEMPLATE SETTINGS */}
//           <div className="bg-white border border-slate-200 rounded-xl px-4 py-6 md:p-8 shadow-sm space-y-8">
//             <h3 className="text-sm font-black !text-slate-800 mb-4 !capitalize tracking-widest">Template Settings</h3>
            
//             <div className="grid grid-cols-1 gap-4 md:gap-6">
//                <div className="space-y-2 max-w-md">
//                   <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Template Name</label>
//                   {/* ✅ BOUND TO STATE */}
//                   <input 
//                     type="text" 
//                     value={templateName} 
//                     onChange={(e) => setTemplateName(e.target.value)} 
//                     className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" 
//                   />
//                </div>

//                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//                   {/* CYCLE SELECTION */}
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Leave Policy Cycle</label>
//                     <div className="relative">
//                       <select 
//                         value={leaveCycle} 
//                         onChange={handleCycleChange}
//                         className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
//                       >
//                         <option value="Yearly">Yearly</option>
//                         <option value="Monthly">Monthly</option>
//                       </select>
//                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
//                     </div>
//                   </div>

//                   {/* DYNAMIC PERIOD SELECTION */}
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Leave Period</label>
//                     <div className="relative">
//                       <select 
//                         value={leavePeriod} 
//                         onChange={(e) => setLeavePeriod(e.target.value)}
//                         className="w-full bg-slate-50 border border-slate-400 rounded-xl pl-4 pr-10 py-3 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
//                       >
//                         {leaveCycle === 'Yearly' 
//                           ? yearlyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
//                           : monthlyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
//                         }
//                       </select>
//                       <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                   </div>

//                   {/* ACCRUAL TYPE */}
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-1 ml-1">
//                        <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest">Accrual Type</label>
//                        <Info size={12} className="text-slate-300" />
//                     </div>
//                     <div className="relative">
//                       {/* ✅ BOUND TO STATE */}
//                       <select 
//                         value={accrualType} 
//                         onChange={(e) => setAccrualType(e.target.value)}
//                         className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
//                       >
//                         <option>All at once</option>
//                         <option>Monthly Accrual</option>
//                       </select>
//                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
//                     </div>
//                   </div>
//                </div>
//             </div>
//           </div>

//           {/* SECTION 2: LEAVE CATEGORIES */}
//           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//             <div className="p-4 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-slate-50">
//               <h3 className="text-sm font-black !text-slate-800 !capitalize tracking-widest">Leave Categories</h3>
//               <button 
//                 onClick={addCategory}
//                 className="flex items-center justify-center gap-2 border border-blue-600 px-4 py-2 !bg-blue-50 !text-blue-600 rounded-xl hover:!bg-blue-100 transition-all active:scale-95 w-full sm:w-auto cursor-pointer"
//               >
//                 <Plus size={16} strokeWidth={3} />
//                 <span className="text-[10px] font-black capitalize tracking-widest">Add Leave Category</span>
//               </button>
//             </div>

//             <div className="p-4 sm:p-0 overflow-x-hidden sm:overflow-x-auto bg-slate-50/30 sm:bg-transparent">
//               <table className="w-full border-collapse block lg:table">
//                 <thead className="hidden lg:table-header-group">
//                   <tr className="bg-slate-50/50 border-b border-slate-100">
//                     <th className="px-8 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Leave Category Name</th>
//                     <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Leave Count</th>
//                     <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Unused Leave Rule</th>
//                     <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Carry Forward Limit</th>
//                     <th className="px-8 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-right">Delete</th>
//                   </tr>
//                 </thead>
                
//                 <tbody className="block lg:table-row-group divide-y-0 lg:divide-y divide-slate-50">
//                   {leaveCategories.map((cat) => (
//                     <tr key={cat.id} className="group block lg:table-row bg-white lg:bg-transparent border border-slate-200 lg:border-none rounded-2xl lg:rounded-none mb-4 lg:mb-0 hover:bg-slate-50/30 transition-colors overflow-hidden shadow-sm lg:shadow-none">
                      
//                       <td className="px-4 lg:px-8 py-4 block lg:table-cell border-b border-slate-100 lg:border-none bg-slate-50/50 lg:bg-transparent">
//                         <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest block mb-2">Leave Category Name</span>
//                         <input 
//                           type="text" 
//                           value={cat.name} 
//                           onChange={(e) => updateCategory(cat.id, 'name', e.target.value)} 
//                           className="bg-white lg:bg-transparent border lg:border-b p-3 lg:p-2 rounded-xl lg:rounded-lg border-slate-200 text-[12px] lg:text-[11px] font-bold text-slate-700 outline-none w-full focus:border-blue-400 lg:focus:border-slate-200" 
//                         />
//                       </td>
                      
//                       <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
//                         <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Leave Count</span>
//                         <input 
//                           type="number" 
//                           value={cat.count || ''}
//                           onChange={(e) => updateCategory(cat.id, 'count', e.target.value)} 
//                           placeholder="0" 
//                           className="w-20 lg:w-24 text-right lg:text-left bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold outline-none focus:border-blue-400" 
//                         />
//                       </td>
                      
//                       <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
//                         <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Unused Leave Rule</span>
//                         <div className="relative w-32 sm:w-32">
//                           {/* ✅ BOUND TO STATE */}
//                           <select 
//                             value={cat.rule}
//                             onChange={(e) => updateCategory(cat.id, 'rule', e.target.value)}
//                             className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold appearance-none outline-none text-right pr-8 lg:text-left lg:pr-3 cursor-pointer"
//                           >
//                             <option>Lapse</option>
//                             <option>Carry Forward</option>
//                             <option>Encashment</option>
//                           </select>
//                           <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
//                         <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Carry Forward Limit</span>
//                         <div className="flex items-center gap-2">
//                           {/* ✅ BOUND TO STATE & DISABLED IF NOT CARRY FORWARD */}
//                           <input 
//                             type="number" 
//                             value={cat.forward || ''}
//                             onChange={(e) => updateCategory(cat.id, 'forward', e.target.value)}
//                             disabled={cat.rule !== 'Carry Forward'}
//                             placeholder="0" 
//                             className="w-16 lg:w-20 text-right lg:text-left bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold outline-none disabled:opacity-50" 
//                           />
//                           <span className="text-[10px] font-bold text-slate-400 capitalize">Days</span>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 lg:px-8 py-3 lg:py-4 block lg:table-cell text-right bg-slate-50/30 lg:bg-transparent">
//                         <button 
//                           onClick={() => removeCategory(cat.id)} 
//                           className="p-2 w-full lg:w-auto flex items-center justify-center lg:inline-block !text-blue-600 hover:text-blue-600 rounded-lg hover:bg-red-50 transition-all border border-blue-600 lg:border-transparent !bg-transparent opacity-100 lg:opacity-0 group-hover:opacity-100 cursor-pointer"
//                         >
//                           <Trash2 size={16} className="hidden lg:block" />
//                           <span className="lg:hidden text-[10px] font-black capitalize tracking-widest flex items-center gap-2">
//                              <Trash2 size={14} /> Remove Category
//                           </span>
//                         </button>
//                       </td>
                      
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="px-6 py-2 md:p-8 bg-slate-50/30 border-t border-slate-50">
//               <label className="flex items-center gap-3 cursor-pointer group w-fit">
//                 {/* ✅ BOUND TO STATE */}
//                 <input 
//                   type="checkbox" 
//                   checked={isSandwichApplied}
//                   onChange={(e) => setIsSandwichApplied(e.target.checked)}
//                   className="w-5 h-5 sm:w-4 sm:h-4 rounded mr-3 border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
//                 />
//                 <span className="text-[11px] sm:text-[10px] font-black text-slate-600 capitalize tracking-widest group-hover:text-slate-900 transition-colors">Count Sandwich Leaves</span>
//               </label>
//             </div>
//           </div>

//           {/* SECTION 3: LEAVE APPROVAL */}
//           <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div className="space-y-1">
//                  <h3 className="md:text-sm text-[12px] font-black !text-slate-800 !capitalize tracking-widest">Leave Approval</h3>
//                  <div className="flex items-center gap-2">
//                     <Info size={14} className="text-blue-600" />
//                     <p className="md:text-[10px] text-[8px] font-bold text-slate-500 capitalize tracking-widest">Multilevel Approval Settings is set to <span className="text-slate-700">{approvalLevel}</span> by default</p>
//                  </div>
//               </div>
//               <button 
//                 onClick={() => setIsApprovalModalOpen(true)}
//                 className="p-3 !bg-slate-50 !text-blue-600 rounded-2xl hover:!bg-white border border-blue-600 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
//               >
//                 <Edit3 size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
//         <div className="mx-auto flex flex-col sm:flex-row items-center justify-between px-2 gap-4 sm:gap-0">
          
//           {/* Left Side: Total Leaves Info */}
//           <div className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
//             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
//               <ShieldCheck size={18} />
//             </div>
//             <p className="text-xs font-black text-slate-800 capitalize tracking-tighter">
//               Total Leaves: <span className="text-blue-600 ml-1">{totalLeaves}</span>
//             </p>
//           </div>
          
//           {/* Right Side: Action Buttons */}
//           <div className="flex items-center gap-3 w-full sm:w-auto">
//             <button 
//               onClick={() => navigate(-1)} 
//               className="flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all text-center cursor-pointer"
//             >
//               Cancel
//             </button>
//             {/* ✅ ATTACHED handleSave */}
//             <button 
//               onClick={handleSave}
//               disabled={isSaving}
//               className={`flex-1 sm:flex-none px-4 sm:px-12 py-3 sm:py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] font-black capitalize tracking-widest shadow-sm border border-blue-600 shadow-blue-200 active:scale-95 transition-all text-center cursor-pointer ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}
//             >
//               {isSaving ? "Saving..." : "Save Template"}
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* 🔍 SET MULTILEVEL APPROVAL MODAL */}
//       {isApprovalModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsApprovalModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
//             <div className="px-6 py-6 border-b border-slate-50 flex items-center justify-between">
//                <h3 className="text-lg font-black !text-slate-900 !capitalize tracking-tighter">Set Multilevel Approval</h3>
//                <button onClick={() => setIsApprovalModalOpen(false)} className="p-2 !text-slate-400 hover:!bg-slate-50 rounded-full !bg-transparent transition-all border-0 cursor-pointer outline-none"><X size={20} /></button>
//             </div>
//             <div className="py-4 px-6 space-y-6">
//                <div className="space-y-3">
//                   <label className="text-[10px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Choose Type of Approval</label>
//                   <div className="relative">
//                      <select 
//                         value={approvalLevel} 
//                         onChange={(e) => setApprovalLevel(e.target.value)}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
//                      >
//                         <option value="Level One">Level One</option>
//                         <option value="Level Two">Level Two</option>
//                         <option value="Level Three">Level Three</option>
//                      </select>
//                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                </div>
//                <button 
//                  onClick={() => setIsApprovalModalOpen(false)}
//                  className="w-full py-4 !bg-white !text-blue-600 rounded-xl text-xs font-black capitalize tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-white border border-blue-600 transition-all active:scale-[0.98] cursor-pointer"
//                >
//                  Save Settings
//                </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateLeave;
//********************************************************************************************************* */
// import React, { useState, useEffect } from 'react';
// import { 
//   ArrowLeft, Info, Edit3, Plus, Clock, ChevronDown, Calendar, X, Trash2, Settings2, ShieldCheck
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreateLeave = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('Add Template');
//   const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
//   const [approvalLevel, setApprovalLevel] = useState('Level One');

//   // --- NEW: Leave Cycle & Period Logic ---
//   const [leaveCycle, setLeaveCycle] = useState('Yearly');
//   const [leavePeriod, setLeavePeriod] = useState('Jan 2026 - Dec 2026');

//   // Dynamic Options
//   const yearlyOptions = [
//     'Jan 2026 - Dec 2026',
//     'Apr 2026 - Mar 2027',
//     'Jan 2027 - Dec 2027',
//     'Apr 2027 - Mar 2028'
//   ];

//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   const monthlyOptions = months.map(m => `${m} 2026`);

//   const handleCycleChange = (e) => {
//     const newCycle = e.target.value;
//     setLeaveCycle(newCycle);
//     // Auto-update the period to the first valid option of the new cycle
//     if (newCycle === 'Yearly') {
//       setLeavePeriod(yearlyOptions[0]);
//     } else {
//       setLeavePeriod(monthlyOptions[0]);
//     }
//   };
//   // ---------------------------------------
//   // Leave Categories State
//   const [leaveCategories, setLeaveCategories] = useState([
//     { id: 1, name: 'Casual Leave', count: 0, rule: 'Lapse', forward: 0 },
//     { id: 2, name: 'Sick Leave', count: 0, rule: 'Lapse', forward: 0 },
//     { id: 3, name: 'Annual Leave', count: 0, rule: 'Lapse', forward: 0 },
//   ]);

//   // Total Leaves Logic
//   const totalLeaves = leaveCategories.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);

//   const addCategory = () => {
//     setLeaveCategories([...leaveCategories, { id: Date.now(), name: '', count: 0, rule: 'Lapse', forward: 0 }]);
//   };

//   const removeCategory = (id) => {
//     setLeaveCategories(leaveCategories.filter(cat => cat.id !== id));
//   };

//   const updateCategory = (id, field, value) => {
//     setLeaveCategories(leaveCategories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat));
//   };

//   return (
//     <div className="min-h-screen bg-white font-['Inter'] pb-32 text-left relative">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50]">
//         <button onClick={() => navigate(-1)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-xl !text-slate-600">
//           <ArrowLeft size={18} />
//         </button>
//         <h2 className="text-sm font-black !text-slate-700 !capitalize tracking-tight">Create Leave Template</h2>
//       </div>

//       <div className=" mx-auto px-2 md:px-6 mt-4">
//         {/* TABS */}
//         <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-4 border border-slate-200">
//           {['Add Template', 'Assign'].map((tab) => (
//             <button 
//               key={tab} 
//               onClick={() => tab === 'Add Template' && setActiveTab(tab)}
//               className={`px-8 py-2 rounded-lg text-[10px] !bg-transparent font-black capitalize tracking-widest transition-all ${
//                 activeTab === tab ? '!bg-white shadow-sm !text-blue-600' : '!text-slate-600 cursor-not-allowed'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* MAIN FORM CONTAINER */}
//         <div className="space-y-6">
          
//           {/* SECTION 1: TEMPLATE SETTINGS */}
//           <div className="bg-white border border-slate-200 rounded-xl px-4 py-6 md:p-8 shadow-sm space-y-8">
//             <h3 className="text-sm font-black !text-slate-800 mb-4 !capitalize tracking-widest">Template Settings</h3>
            
//             <div className="grid grid-cols-1 gap-4 md:gap-6">
//                <div className="space-y-2 max-w-md">
//                   <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Template Name</label>
//                   <input type="text" defaultValue="Leave Policy" className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" />
//                </div>

//                {/* <div className="grid grid-cols-1 md:grid-cols-3  gap-4 md:gap-6">
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Leave Policy Cycle</label>
//                     <div className="relative">
//                       <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none">
//                         <option>Yearly</option>
//                         <option>Monthly</option>
//                       </select>
//                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Leave Period</label>
//                     <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 cursor-pointer">
//                       <span className="text-[11px] font-bold text-slate-700">January 2026 - December 2026</span>
//                       <Calendar size={16} className="text-slate-400" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-1 ml-1">
//                        <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest">Accrual Type</label>
//                        <Info size={12} className="text-slate-300" />
//                     </div>
//                     <div className="relative">
//                       <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none">
//                         <option>All at once</option>
//                         <option>Monthly Accrual</option>
//                       </select>
//                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                     </div>
//                   </div>
//                </div> */}
//                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//                   {/* CYCLE SELECTION */}
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Leave Policy Cycle</label>
//                     <div className="relative">
//                       <select 
//                         value={leaveCycle} 
//                         onChange={handleCycleChange}
//                         className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
//                       >
//                         <option value="Yearly">Yearly</option>
//                         <option value="Monthly">Monthly</option>
//                       </select>
//                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
//                     </div>
//                   </div>

//                   {/* DYNAMIC PERIOD SELECTION */}
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Leave Period</label>
//                     <div className="relative">
//                       <select 
//                         value={leavePeriod} 
//                         onChange={(e) => setLeavePeriod(e.target.value)}
//                         className="w-full bg-slate-50 border border-slate-400 rounded-xl pl-4 pr-10 py-3 text-[11px] font-bold text-slate-700 appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer"
//                       >
//                         {leaveCycle === 'Yearly' 
//                           ? yearlyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
//                           : monthlyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
//                         }
//                       </select>
//                       <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                   </div>

//                   {/* ACCRUAL TYPE */}
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-1 ml-1">
//                        <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest">Accrual Type</label>
//                        <Info size={12} className="text-slate-300" />
//                     </div>
//                     <div className="relative">
//                       <select className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3 text-[11px] font-bold appearance-none outline-none focus:border-blue-400 transition-all cursor-pointer">
//                         <option>All at once</option>
//                         <option>Monthly Accrual</option>
//                       </select>
//                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
//                     </div>
//                   </div>
//                </div>
//             </div>
//           </div>

//           {/* SECTION 2: LEAVE CATEGORIES */}
//           {/* <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//             <div className="p-8 flex items-center justify-between border-b border-slate-50">
//               <h3 className="text-sm font-black text-slate-800 capitalize tracking-widest">Leave Categories</h3>
//               <button 
//                 onClick={addCategory}
//                 className="flex items-center gap-2 border border-blue-600 px-4 py-2 !bg-blue-50 !text-blue-600 rounded-xl hover:!bg-blue-100 transition-all active:scale-95"
//               >
//                 <Plus size={16} strokeWidth={3} />
//                 <span className="text-[10px] font-black capitalize tracking-widest">Add Leave Category</span>
//               </button>
//             </div>

//             <div className="p-0 overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50/50 border-b border-slate-100">
//                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-left">Leave Category Name</th>
//                     <th className="px-4 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-left">Leave Count</th>
//                     <th className="px-4 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-left">Unused Leave Rule</th>
//                     <th className="px-4 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-left">Carry Forward Limit</th>
//                     <th className="px-4 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-center">Custom Fields</th>
//                     <th className="px-4 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-center">Automation</th>
//                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-right">Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {leaveCategories.map((cat) => (
//                     <tr key={cat.id} className="group hover:bg-slate-50/30 transition-colors">
//                       <td className="px-8 py-4">
//                         <input type="text" value={cat.name} onChange={(e) => updateCategory(cat.id, 'name', e.target.value)} className="bg-transparent border p-2 rounded-lg border-slate-200 text-[11px] font-bold text-slate-700 outline-none w-full border-b " />
//                       </td>
//                       <td className="px-4 py-4">
//                         <input type="number" placeholder="0" onChange={(e) => updateCategory(cat.id, 'count', e.target.value)} className="w-24 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold outline-none focus:border-blue-400" />
//                       </td>
//                       <td className="px-4 py-4">
//                         <div className="relative w-32">
//                           <select className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold appearance-none outline-none">
//                             <option>Lapse</option>
//                             <option>Carry Forward</option>
//                             <option>Encashment</option>
//                           </select>
//                           <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                         </div>
//                       </td>
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-2">
//                            <input type="number" placeholder="0" className="w-20 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold outline-none" />
//                            <span className="text-[10px] font-bold text-slate-400 capitalize">Days</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <button className="!text-blue-600 !bg-transparent text-[11px] font-bold hover:underline">0</button>
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <button className="p-2 !text-slate-400 !bg-transparent hover:text-blue-600 transition-colors">
//                           <Settings2 size={16} />
//                         </button>
//                       </td>
//                       <td className="px-8 py-4 text-right">
//                         <button onClick={() => removeCategory(cat.id)} className="p-2 !text-blue-600 hover:text-blue-600 rounded-lg hover:bg-red-50 transition-all border border-blue-600 !bg-transparent opacity-0 group-hover:opacity-100">
//                           <Trash2 size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="p-8 bg-slate-50/30 border-t border-slate-50">
//                <label className="flex items-center gap-3 cursor-pointer group w-fit">
//                   <input type="checkbox" className="w-4 h-4 rounded mr-3 border-slate-300 text-blue-600 focus:ring-blue-600" />
//                   <span className="text-[10px] font-black text-slate-600 capitalize tracking-widest group-hover:text-slate-900 transition-colors">Count Sandwich Leaves</span>
         
//                </label>
//             </div>
//           </div> */}

//           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//   {/* 📱 MOBILE FIX: Flex-col on mobile, flex-row on desktop */}
//   <div className="p-4 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-slate-50">
//     <h3 className="text-sm font-black !text-slate-800 !capitalize tracking-widest">Leave Categories</h3>
//     <button 
//       onClick={addCategory}
//       className="flex items-center justify-center gap-2 border border-blue-600 px-4 py-2 !bg-blue-50 !text-blue-600 rounded-xl hover:!bg-blue-100 transition-all active:scale-95 w-full sm:w-auto"
//     >
//       <Plus size={16} strokeWidth={3} />
//       <span className="text-[10px] font-black capitalize tracking-widest">Add Leave Category</span>
//     </button>
//   </div>

//   {/* 📱 MOBILE FIX: Removed overflow-x-auto on mobile to allow stacked cards, restored on sm */}
//   <div className="p-4 sm:p-0 overflow-x-hidden sm:overflow-x-auto bg-slate-50/30 sm:bg-transparent">
//     <table className="w-full border-collapse block lg:table">
//       {/* 📱 MOBILE FIX: Hide table headers on mobile */}
//       <thead className="hidden lg:table-header-group">
//         <tr className="bg-slate-50/50 border-b border-slate-100">
//           <th className="px-8 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Leave Category Name</th>
//           <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Leave Count</th>
//           <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Unused Leave Rule</th>
//           <th className="px-4 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-left">Carry Forward Limit</th>
//           {/* <th className="px-4 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-center">Custom Fields</th>
//           <th className="px-4 py-4 text-[9px] font-black text-slate-400 capitalize tracking-widest text-center">Automation</th> */}
//           <th className="px-8 py-4 text-[9px] font-black !text-slate-600 capitalize tracking-widest text-right">Delete</th>
//         </tr>
//       </thead>
      
//       <tbody className="block lg:table-row-group divide-y-0 lg:divide-y divide-slate-50">
//         {leaveCategories.map((cat) => (
//           /* 📱 MOBILE FIX: Convert tr to a block card on mobile, table-row on desktop */
//           <tr key={cat.id} className="group block lg:table-row bg-white lg:bg-transparent border border-slate-200 lg:border-none rounded-2xl lg:rounded-none mb-4 lg:mb-0 hover:bg-slate-50/30 transition-colors overflow-hidden shadow-sm lg:shadow-none">
            
//             <td className="px-4 lg:px-8 py-4 block lg:table-cell border-b border-slate-100 lg:border-none bg-slate-50/50 lg:bg-transparent">
//               <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest block mb-2">Leave Category Name</span>
//               <input type="text" value={cat.name} onChange={(e) => updateCategory(cat.id, 'name', e.target.value)} className="bg-white lg:bg-transparent border lg:border-b p-3 lg:p-2 rounded-xl lg:rounded-lg border-slate-200 text-[12px] lg:text-[11px] font-bold text-slate-700 outline-none w-full focus:border-blue-400 lg:focus:border-slate-200" />
//             </td>
            
//             <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
//               <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Leave Count</span>
//               <input type="number" placeholder="0" onChange={(e) => updateCategory(cat.id, 'count', e.target.value)} className="w-20 lg:w-24 text-right lg:text-left bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold outline-none focus:border-blue-400" />
//             </td>
            
//             <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
//               <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Unused Leave Rule</span>
//               <div className="relative w-32 sm:w-32">
//                 <select className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold appearance-none outline-none text-right pr-8 lg:text-left lg:pr-3">
//                   <option>Lapse</option>
//                   <option>Carry Forward</option>
//                   <option>Encashment</option>
//                 </select>
//                 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               </div>
//             </td>
            
//             <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-start border-b border-slate-50 lg:border-none">
//               <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Carry Forward Limit</span>
//               <div className="flex items-center gap-2">
//                 <input type="number" placeholder="0" className="w-16 lg:w-20 text-right lg:text-left bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] lg:text-[11px] font-bold outline-none" />
//                 <span className="text-[10px] font-bold text-slate-400 capitalize">Days</span>
//               </div>
//             </td>
            
//             {/* <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-center border-b border-slate-50 lg:border-none text-center">
//               <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Custom Fields</span>
//               <button className="!text-blue-600 !bg-transparent text-[12px] lg:text-[11px] font-bold hover:underline px-4 lg:px-0 py-1 lg:py-0 bg-blue-50/50 lg:bg-transparent rounded-lg lg:rounded-none">0</button>
//             </td>
            
//             <td className="px-4 py-3 lg:py-4 block lg:table-cell flex items-center justify-between lg:justify-center border-b border-slate-50 lg:border-none text-center">
//               <span className="lg:hidden text-[9px] font-black text-slate-400 capitalize tracking-widest">Automation</span>
//               <button className="p-2 !text-slate-400 !bg-transparent hover:text-blue-600 transition-colors bg-slate-50 lg:bg-transparent rounded-lg lg:rounded-none">
//                 <Settings2 size={16} />
//               </button>
//             </td> */}
            
//             <td className="px-4 lg:px-8 py-3 lg:py-4 block lg:table-cell text-right bg-slate-50/30 lg:bg-transparent">
//                {/* 📱 MOBILE FIX: Touch screens don't have hover, so the trash icon is always visible on mobile (opacity-100) and hidden until hover on desktop (lg:opacity-0) */}
//               <button onClick={() => removeCategory(cat.id)} className="p-2 w-full lg:w-auto flex items-center justify-center lg:inline-block !text-blue-600 hover:text-blue-600 rounded-lg hover:bg-red-50 transition-all border border-blue-600 lg:border-transparent !bg-transparent opacity-100 lg:opacity-0 group-hover:opacity-100">
//                 <Trash2 size={16} className="hidden lg:block" />
//                 <span className="lg:hidden text-[10px] font-black capitalize tracking-widest flex items-center gap-2">
//                    <Trash2 size={14} /> Remove Category
//                 </span>
//               </button>
//             </td>
            
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>

//   <div className="px-6 py-2 md:p-8 bg-slate-50/30 border-t border-slate-50">
//     <label className="flex items-center gap-3 cursor-pointer group w-fit">
//       <input type="checkbox" className="w-5 h-5 sm:w-4 sm:h-4 rounded mr-3 border-slate-300 text-blue-600 focus:ring-blue-600" />
//       <span className="text-[11px] sm:text-[10px] font-black text-slate-600 capitalize tracking-widest group-hover:text-slate-900 transition-colors">Count Sandwich Leaves</span>
//     </label>
//   </div>
// </div>

//           {/* SECTION 3: LEAVE APPROVAL */}
//           <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div className="space-y-1">
//                  <h3 className="md:text-sm text-[12px] font-black !text-slate-800 !capitalize tracking-widest">Leave Approval</h3>
//                  <div className="flex items-center gap-2">
//                     <Info size={14} className="text-blue-600" />
//                     <p className="md:text-[10px] text-[8px] font-bold text-slate-500 capitalize tracking-widest">Multilevel Approval Settings is set to <span className="text-slate-700">{approvalLevel}</span> by default</p>
//                  </div>
//               </div>
//               <button 
//                 onClick={() => setIsApprovalModalOpen(true)}
//                 className="p-3 !bg-slate-50 !text-blue-600 rounded-2xl hover:!bg-white border border-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
//               >
//                 <Edit3 size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🛡️ FIXED FOOTER ACTIONS */}
//       {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
//         <div className=" mx-auto flex items-center justify-between px-2">
//           <div className="flex items-center gap-2">
//              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck size={18} /></div>
//              <p className="text-xs font-black text-slate-800 capitalize tracking-tighter">Total Leaves: <span className="text-blue-600 ml-1">{totalLeaves}</span></p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={() => navigate(-1)} className="px-8 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
//             <button className="px-12 py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] font-black capitalize tracking-widest shadow-sm border border-blue-600 shadow-blue-200 active:scale-95 transition-all">Save Template</button>
//           </div>
//         </div>
//       </div> */}

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
//   {/* 📱 MOBILE FIX: Flex-col on mobile, flex-row on desktop, added gap for stacking */}
//   <div className="mx-auto flex flex-col sm:flex-row items-center justify-between px-2 gap-4 sm:gap-0">
    
//     {/* Left Side: Total Leaves Info */}
//     <div className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
//       <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
//         <ShieldCheck size={18} />
//       </div>
//       <p className="text-xs font-black text-slate-800 capitalize tracking-tighter">
//         Total Leaves: <span className="text-blue-600 ml-1">{totalLeaves}</span>
//       </p>
//     </div>
    
//     {/* Right Side: Action Buttons */}
//     {/* 📱 MOBILE FIX: w-full on mobile to allow buttons to stretch */}
//     <div className="flex items-center gap-3 w-full sm:w-auto">
//       <button 
//         onClick={() => navigate(-1)} 
//         /* 📱 MOBILE FIX: flex-1 ensures 50% width on mobile, px-4 prevents overflow */
//         className="flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:bg-slate-50 transition-all text-center"
//       >
//         Cancel
//       </button>
//       <button 
//         /* 📱 MOBILE FIX: flex-1 ensures 50% width on mobile, px-4 prevents overflow */
//         className="flex-1 sm:flex-none px-4 sm:px-12 py-3 sm:py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] font-black capitalize tracking-widest shadow-sm border border-blue-600 shadow-blue-200 active:scale-95 transition-all text-center"
//       >
//         Save Template
//       </button>
//     </div>

//   </div>
// </div>

//       {/* 🔍 SET MULTILEVEL APPROVAL MODAL (image_f24043.jpg) */}
//       {isApprovalModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsApprovalModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
//             <div className="px-6 py-6 border-b border-slate-50 flex items-center justify-between">
//                <h3 className="text-lg font-black !text-slate-900 !capitalize tracking-tighter">Set Multilevel Approval</h3>
//                <button onClick={() => setIsApprovalModalOpen(false)} className="p-2 !text-slate-400 hover:!bg-slate-50 rounded-full !bg-transparent transition-all"><X size={20} /></button>
//             </div>
//             <div className="py-4 px-6 space-y-6">
//                <div className="space-y-3">
//                   <label className="text-[10px] font-black !text-slate-600 !capitalize tracking-widest ml-1">Choose Type of Approval</label>
//                   <div className="relative">
//                      <select 
//                         value={approvalLevel} 
//                         onChange={(e) => setApprovalLevel(e.target.value)}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
//                      >
//                         <option value="Level One">Level One</option>
//                         <option value="Level Two">Level Two</option>
//                         <option value="Level Three">Level Three</option>
//                      </select>
//                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                </div>
//                <button 
//                  onClick={() => setIsApprovalModalOpen(false)}
//                  className="w-full py-4 !bg-white !text-blue-600 rounded-xl text-xs font-black capitalize tracking-[0.2em] shadow-sm shadow-blue-200 hover:bg-white border border-blue-600 transition-all active:scale-[0.98]"
//                >
//                  Save Settings
//                </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateLeave;