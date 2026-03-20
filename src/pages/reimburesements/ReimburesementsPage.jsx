import React, { useState } from 'react';
import { 
  Search, 
  Download,
  Filter, 
  Plus, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ArrowLeft,
  X,
  Calendar,
  Eye,
  ShieldCheck,
  Info,
  FileText,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ReimburesementsPage = () => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState("Dashboard");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [expandedSetting, setExpandedSetting] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showItemisedBills, setShowItemisedBills] = useState(true); // Default open as per image
  const [selectedClaim, setSelectedClaim] = useState(null);

  const expenseTypes = ["Travel Expense", "Food Expense", "Travelling expenses"];

  const tableData = [
    { type: "Travel Expense", claimId: "#25", name: "Imran Shaikh", staffId: "#MUNGE70", date: "15 Sep '25 - 15 Sep '25", reqAmount: "₹ 2,322", status: "Paid", applied: "15 Sep '25", appAmount: "₹ 2,322", settled: "15 Sep '25" },
    { type: "Travel Expense", claimId: "#24", name: "Imran Shaikh", staffId: "#MUNGE70", date: "02 Aug '25 - 02 Aug '25", reqAmount: "₹ 1,500", status: "Paid", applied: "10 Sep '25", appAmount: "₹ 1,500", settled: "02 Aug '25" },
  ];

  const handleRowClick = (claim) => {
    setSelectedClaim(claim);
    setShowSidebar(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-2 md:p-2 animate-in fade-in duration-500 font-sans overflow-x-hidden">
      
      {/* 🏛️ TOP PAGE HEADER */}
      <div className="mb-4 flex items-center gap-4 text-left animate-in slide-in-from-left-4 duration-500">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 hover:!bg-white hover:!border-blue-200 hover:!text-blue-600 bg-transparent !rounded-xl !text-slate-400 border !border-slate-100 transition-all cursor-pointer outline-none !bg-transparent active:scale-90 shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Reimbursements
          </h1>
        </div>
      </div>

      {/* 📑 TAB NAVIGATION */}
      <div className="flex gap-8 mb-0 px-2">
        {["Dashboard", "Settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`py-3 text-[10px] font-black uppercase tracking-widest transition-all relative !bg-transparent border-0 cursor-pointer ${
              activeSubTab === tab ? "!text-blue-600" : "!text-slate-400 hover:!text-slate-600"
            }`}
          >
            {tab}
            {activeSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
          </button>
        ))}
      </div>

      {/* 📊 MAIN CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {activeSubTab === "Dashboard" ? (
          <>
            <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Dashboard</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select className="bg-slate-50 border border-slate-200 pl-3 pr-8 py-1.5 text-[10px] font-black text-slate-600 uppercase rounded-lg appearance-none outline-none cursor-pointer">
                    <option>FY 2025 - 2026</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button 
                  onClick={() => setShowFilterModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all outline-none cursor-pointer">
                  <Filter size={12} strokeWidth={2.5} /> Filter
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard label="Reimbursements Paid" amount="₹ 3,822" claims="2" color="purple" />
              <SummaryCard label="Reimbursements Approved" amount="₹ 0" claims="0" color="green" />
              <SummaryCard label="Reimbursements Pending" amount="₹ 0" claims="0" color="orange" />
            </div>

            <div className="px-6 py-3 bg-slate-50/30 border-y border-slate-100 text-left">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
                <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>

            <div className="overflow-x-auto minimal-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className={thStyle}>Expense Type</th>
                    <th className={thStyle}>Claim ID</th>
                    <th className={thStyle}>Staff Name</th>
                    <th className={thStyle}>Staff ID</th>
                    <th className={thStyle}>Expense Date</th>
                    <th className={thStyle}>Requested Amount</th>
                    <th className={thStyle}>Status</th>
                    <th className={thStyle}>Applied At</th>
                    <th className={thStyle}>Approved At</th>
                    <th className={thStyle}>Approved Amount</th>
                    <th className={thStyle}>Approved By</th>
                    <th className={thStyle}>Settlement Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tableData.map((row, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => handleRowClick(row)}
                      className="hover:bg-slate-50/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-200" /></td>
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">{row.type}</td>
                      <td className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase">{row.claimId}</td>
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-600">{row.name}</td>
                      <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{row.staffId}</td>
                      <td className="px-6 py-4 text-[10px] font-medium text-slate-500">{row.date}</td>
                      <td className="px-6 py-4 text-[10px] font-black text-slate-700">{row.reqAmount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 w-fit border border-indigo-100">
                          <div className="w-1 h-1 rounded-full bg-indigo-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest">{row.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-medium text-slate-600">{row.applied}</td>
                      <td className="px-6 py-4 text-[10px] font-medium text-slate-600">-</td>
                      <td className="px-6 py-4 text-[10px] font-black text-slate-700">{row.appAmount}</td>
                      <td className="px-6 py-4 text-[10px] font-medium text-slate-600">-</td>
                      <td className="px-6 py-4 text-[10px] font-medium text-slate-400">{row.settled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows Per Page</span>
                <div className="relative">
                  <select className="bg-slate-50 border border-slate-200 pl-2 pr-6 py-1 text-[10px] font-bold text-slate-600 rounded-lg appearance-none outline-none"><option>10</option></select>
                  <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 !text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 !text-slate-300 !bg-transparent border-0"><ChevronLeft size={16} /></button>
                <button className="w-6 h-6 rounded bg-blue-600 text-white text-[10px] font-black border-0">1</button>
                <button className="p-1 !text-slate-300 !bg-transparent border-0"><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        ) : (
          /* ⚙️ SETTINGS VIEW (Matches image_8bbfa5.jpg) */
          <div className="p-8 text-left animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Reimbursement Settings</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Access reimbursement based settings here.</p>
            </div>
            <div className="space-y-4 max-w-5xl">
              <SettingsItem title="Reimbursement Templates" desc="Configure reimbursement templates, assign to staff, and more." />
              <div className={`border rounded-2xl transition-all duration-300 ${expandedSetting === 'approval' ? 'border-blue-200 bg-white' : 'border-slate-100 bg-white'}`}>
                <button onClick={() => setExpandedSetting(expandedSetting === 'approval' ? null : 'approval')} className="w-full flex items-center justify-between p-6 !bg-transparent outline-none cursor-pointer group">
                  <div className="text-left space-y-1">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Approval Setting</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Choose admins who will be approving staff reimbursement requests</p>
                  </div>
                  <div className={`p-2 rounded-xl transition-all ${expandedSetting === 'approval' ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </div>
                </button>
                {expandedSetting === 'approval' && (
                  <div className="px-6 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-3">
                      <AdminToggle label="Vijay Pakhare" defaultChecked={true} />
                      <AdminToggle label="CHAITALI GAIKWAD" defaultChecked={false} />
                    </div>
                    <div className="pt-4"><button className="px-8 py-2 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border-0 outline-none">Save</button></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📋 REIMBURSEMENT DETAILS SIDEBAR (Matches image_8c3b22.jpg EXACTLY) */}
      {showSidebar && (
        <div className="fixed inset-0 z-[250] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={() => setShowSidebar(false)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-y-auto custom-scrollbar">
            
            {/* Header: Title + Status Badge + Actions */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Travel Expense</h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Paid</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-1.5 hover:!bg-slate-50 rounded-lg !text-blue-600 transition-all !bg-transparent border-0 outline-none cursor-pointer"><Download size={18} strokeWidth={2.5} /></button>
                <button onClick={() => setShowSidebar(false)} className="p-1.5 hover:!bg-slate-50 rounded-lg !text-slate-400 transition-all !bg-transparent border-0 outline-none cursor-pointer"><X size={20} strokeWidth={2.5} /></button>
              </div>
            </div>

            {/* Sidebar Content Body */}
            <div className="flex-1 p-8 space-y-10 text-left">
              {/* Metadata Strip */}
              <div className="flex flex-wrap gap-x-12 gap-y-4">
                <DetailItem label="Staff Name" value="Imran Shaikh" />
                <DetailItem label="Staff ID" value="#MUNGE70" isBlue />
                <DetailItem label="Settlement Date" value="15 Sep '25" />
              </div>

              {/* Data Grid: 3 Columns */}
              <div className="grid grid-cols-3 gap-y-10 gap-x-6">
                <DetailItem label="Claim ID" value="#25" isBlue />
                <DetailItem label="Expense Date" value="15 Sep '25 - 15 Sep '25" />
                <DetailItem label="Bill Number" value="122" />
                
                <DetailItem label="Requested Amount" value="₹ 2,322" isBlack />
                <DetailItem label="Description" value="previous month salary" />
                <DetailItem label="Created At" value="15 Sep '25" />

                <DetailItem label="Paid Amount" value="₹ 2,322" isBlack />
                <DetailItem label="Approved by" value="-" />
                <DetailItem label="Approval remark" value="-" />
              </div>

              {/* Audit Trail */}
              <div className="space-y-6 pt-6 border-t border-slate-50">
                <DetailItem label="Paid remark" value="approved by vijay sir" />
                <DetailItem label="Created by" value="Goelectronix Technologies Private Limited" />
                <DetailItem label="Paid by" value="Goelectronix Technologies Private Limited" />
              </div>

             {/* 📋 ITEMISED BILLS ACCORDION (Matches image_8c9c80.jpg) */}
<div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${showItemisedBills ? 'border-blue-100 shadow-sm' : 'border-slate-100'}`}>
  <div 
    onClick={() => setShowItemisedBills(!showItemisedBills)}
    className="px-5 py-4 flex items-center justify-between bg-slate-50/30 cursor-pointer group"
  >
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg transition-colors ${showItemisedBills ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
        <FileText size={14} strokeWidth={2.5} />
      </div>
      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Itemised Bills</span>
    </div>
    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${showItemisedBills ? 'rotate-180' : ''}`} />
  </div>

  {showItemisedBills && (
    <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300 bg-white">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Bill No.</th>
            <th className="py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="group">
            <td className="py-4 text-[11px] font-bold text-slate-600">122</td>
            <td className="py-4 text-[11px] font-black text-slate-900 text-right">₹ 2,322</td>
          </tr>
        </tbody>
      </table>
    </div>
  )}
</div>

{/* 📎 ATTACHMENTS SECTION (Matches image_8c9c80.jpg) */}
{/* 📎 ATTACHMENT PREVIEW NODE (Matches image_8ca786.png) */}
<div className="w-full flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Attachments</label>
  {/* 📄 Fanned Document Graphic */}
  <div className="relative w-32 h-24 mb-6 flex items-center justify-center">
    {/* Back-Left Document Node */}
    <div className="absolute w-16 h-20 border-2 border-blue-500 bg-white rounded-xl -rotate-[15deg] -translate-x-4 opacity-40 shadow-sm" />
    
    {/* Back-Right Document Node */}
    <div className="absolute w-16 h-20 border-2 border-blue-500 bg-white rounded-xl rotate-[15deg] translate-x-4 opacity-40 shadow-sm" />
    
    {/* Front Center Document Node */}
    <div className="relative w-18 h-22 border-2 border-blue-600 bg-blue-50/50 rounded-xl flex items-center justify-center shadow-lg z-10 scale-105">
       {/* Internal "Focus/Scan" Graphic */}
       <div className="w-8 h-8 flex flex-col items-center justify-center border-2 border-blue-600 rounded-lg relative overflow-hidden">
          <div className="w-4 h-0.5 bg-blue-600 rounded-full mb-0.5" />
          <div className="w-4 h-0.5 bg-blue-600 rounded-full opacity-50" />
       </div>
    </div>
  </div>

  {/* 👁️ View PDF Action Node */}
  <button className="flex items-center gap-2 px-5 py-3 !bg-white border !border-blue-500 !text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-100 hover:!border-blue-400 hover:!bg-blue-50 transition-all active:scale-95 outline-none cursor-pointer">
    <Eye size={14} strokeWidth={2.5} />
    View pdf
  </button>
</div>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 FILTER MODAL */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowFilterModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-visible animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Filter By</h3>
              <button onClick={() => setShowFilterModal(false)} className="p-1.5 !bg-transparent !text-slate-400 hover:!text-slate-600 border-0 cursor-pointer"><X size={18} strokeWidth={2.5} /></button>
            </div>
            <div className="p-6 space-y-5 bg-white text-left pb-10">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expense Type</label>
                <div className="relative">
                  <button onClick={() => setShowTypeDropdown(!showTypeDropdown)} className="w-full !bg-white border !border-slate-200 px-4 py-2.5 text-xs font-bold !text-slate-400 flex items-center justify-between rounded-xl outline-none transition-all">
                    <span className={selectedTypes.length > 0 ? "text-slate-700" : ""}>{selectedTypes.length > 0 ? `${selectedTypes.length} selected` : "Select Expense Type"}</span>
                    <ChevronDown size={14} className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 p-2 animate-in slide-in-from-top-2 duration-200">
                      <label className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group"><input type="checkbox" className="w-4 h-4 mr-2 rounded border-slate-300 text-blue-600" checked={selectedTypes.length === expenseTypes.length} onChange={() => setSelectedTypes(selectedTypes.length === expenseTypes.length ? [] : [...expenseTypes])} /><span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Select All</span></label>
                      <div className="h-px bg-slate-50 my-1" />
                      {expenseTypes.map((type) => (<label key={type} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group"><input type="checkbox" className="w-4 h-4 rounded mr-2 border-slate-300 text-blue-600" checked={selectedTypes.includes(type)} onChange={() => {setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);}} /><span className="text-[11px] font-medium text-slate-600 uppercase tracking-tight">{type}</span></label>))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label><div className="relative"><select className="w-full bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl appearance-none outline-none focus:border-blue-600 cursor-pointer"><option>Select</option><option>IT</option><option>Sales</option></select><ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Month Range</label><div className="relative group"><input type="date" className="w-full bg-white border border-slate-200 pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none cursor-pointer" /></div></div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 rounded-b-2xl">
              <button onClick={() => { setSelectedTypes([]); setShowFilterModal(false); }} className="flex-1 py-2.5 !bg-white border !border-slate-200 !text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all outline-none">Clear</button>
              <button onClick={() => { toast.success("Registry Synced"); setShowFilterModal(false); }} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 active:scale-95 transition-all outline-none">Apply</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .minimal-scrollbar::-webkit-scrollbar { height: 4px; }
        .minimal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .minimal-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

// 🎨 INTERNAL COMPONENTS
const SummaryCard = ({ label, amount, claims, color }) => {
  const themes = { purple: "bg-[#f3e8ff] border-[#e9d5ff] text-[#7e22ce]", green: "bg-[#f0fdf4] border-[#dcfce7] text-[#15803d]", orange: "bg-[#fff7ed] border-[#ffedd5] text-[#c2410c]" };
  return (
    <div className={`p-4 rounded-xl border flex justify-between items-start transition-all hover:shadow-md ${themes[color]}`}>
      <div className="text-left"><p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-3">{label}</p><p className="text-xl font-black tracking-tight">{amount}</p></div>
      <div className="text-right"><Info size={14} className="opacity-40 mb-3" /><p className="text-[9px] font-black uppercase">Claims: <span className="text-[12px]">{claims}</span></p></div>
    </div>
  );
};

const AdminToggle = ({ label, defaultChecked }) => (
  <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-slate-200 transition-all max-w-md">
    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} /><div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div></label>
    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{label}</span>
  </div>
);

const DetailItem = ({ label, value, isBlue, isBlack }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
    <p className={`text-[11px] font-bold tracking-tight uppercase leading-none ${
      isBlue ? "text-blue-600" : isBlack ? "text-slate-900 font-black" : "text-slate-700"
    }`}>{value || "-"}</p>
  </div>
);

const SettingsItem = ({ title, desc, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group !bg-transparent outline-none cursor-pointer"><div className="text-left space-y-1"><h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{title}</h3><p className="text-[10px] text-slate-400 font-medium">{desc}</p></div><div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"><ChevronRight size={18} strokeWidth={2.5} /></div></button>
);

const thStyle = "px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap";

export default ReimburesementsPage;
//************************************************************************************************* */
// import React, { useState } from 'react';
// import { 
//   Search, 
//   Download,
//   Filter, 
//   Plus, 
//   ChevronDown, 
//   ChevronLeft, 
//   ChevronRight,
//   ArrowLeft,
//   X,
//   Calendar ,
//   Info,
//   Circle,
//   HelpCircle
// } from 'lucide-react';

// const ReimburesementsPage = () => {
//   const [activeSubTab, setActiveSubTab] = useState("Dashboard");
//   const [showFilterModal, setShowFilterModal] = useState(false);
// const [showTypeDropdown, setShowTypeDropdown] = useState(false);
// const [selectedTypes, setSelectedTypes] = useState([]);
// const [expandedSetting, setExpandedSetting] = useState(null); // 'approval' or null

// const expenseTypes = ["Travel Expense", "Food Expense", "Travelling expenses"];4
// const [showSidebar, setShowSidebar] = useState(false);
// const [selectedClaim, setSelectedClaim] = useState(null);

// const handleRowClick = (claim) => {
//   setSelectedClaim(claim);
//   setShowSidebar(true);
// };

//   // 📂 Dummy data mapped from image_8b4705.jpg
//   const tableData = [
//     { type: "Travel Expense", claimId: "#25", name: "Imran Shaikh", staffId: "#MUNGE70", date: "15 Sep '25 - 15 Sep '25", reqAmount: "₹ 2,322", status: "Paid", applied: "15 Sep '25", appAmount: "₹ 2,322", settled: "15 Sep '25" },
//     { type: "Travel Expense", claimId: "#24", name: "Imran Shaikh", staffId: "#MUNGE70", date: "02 Aug '25 - 02 Aug '25", reqAmount: "₹ 1,500", status: "Paid", applied: "10 Sep '25", appAmount: "₹ 1,500", settled: "02 Aug '25" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-2 md:p-2 animate-in fade-in duration-500 font-sans">
      
//       {/* 🏛️ TOP PAGE HEADER */}
//  {/* 🏛️ TOP PAGE HEADER: Navigation & Identity */}
// <div className="mb-6 flex items-center gap-4 text-left animate-in slide-in-from-left-4 duration-500">
//   {/* ⬅️ Back Action Node */}
//   <button 
//     onClick={() => navigate(-1)} 
//     className="p-2.5 hover:!bg-white hover:!border-blue-200 hover:!text-blue-600 bg-transparent !rounded-xl !text-slate-400 border !border-slate-100 transition-all cursor-pointer !bg-transparent outline-none active:scale-90 shadow-sm"
//   >
//     <ArrowLeft size={18} strokeWidth={2.5} />
//   </button>

//   <div className="flex flex-col justify-center">
//     {/* Metadata Breadcrumb */}
    
    
//     <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">
//       Reimbursements
//     </h1>
//   </div>
// </div>

//       {/* 📑 TAB NAVIGATION */}
//       <div className="flex gap-8 mb-0 px-2">
//         {["Dashboard", "Settings"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveSubTab(tab)}
//             className={`py-3 text-[10px] font-black uppercase tracking-widest transition-all relative !bg-transparent border-0 cursor-pointer ${
//               activeSubTab === tab ? "!text-blue-600" : "!text-slate-400 hover:!text-slate-600"
//             }`}
//           >
//             {tab}
//             {activeSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {/* 📊 MAIN CONTAINER */}
//       {/* <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
  
//         <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
//           <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Dashboard</h2>
          
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <select className="bg-slate-50 border border-slate-200 pl-3 pr-8 py-1.5 text-[10px] font-black text-slate-600 uppercase rounded-lg appearance-none outline-none cursor-pointer">
//                 <option>FY 2025 - 2026</option>
//               </select>
//               <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
//             </div>
//             <button 
//             onClick={() => setShowFilterModal(true)}
//             className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all outline-none cursor-pointer">
//               <Filter size={12} strokeWidth={2.5} /> Filter
//             </button>
//           </div>
//         </div>

  
//         <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <SummaryCard label="Reimbursements Paid" amount="₹ 3,822" claims="2" color="purple" />
//           <SummaryCard label="Reimbursements Approved" amount="₹ 0" claims="0" color="green" />
//           <SummaryCard label="Reimbursements Pending" amount="₹ 0" claims="0" color="orange" />
//         </div>

       
//         <div className="px-6 py-3 bg-slate-50/30 border-y border-slate-100 text-left">
//           <div className="relative w-full sm:w-80 group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
//             <input 
//               type="text" 
//               placeholder="Search by Claim ID, Staff name or Staff ID" 
//               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:border-blue-500 transition-all" 
//             />
//           </div>
//         </div>

  
//         <div className="overflow-x-auto minimal-scrollbar">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100">
//                 <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
//                 <th className={thStyle}>Expense Type</th>
//                 <th className={thStyle}>Claim ID</th>
//                 <th className={thStyle}>Staff Name</th>
//                 <th className={thStyle}>Staff ID</th>
//                 <th className={thStyle}>Expense Date</th>
//                 <th className={thStyle}>Requested Amount</th>
//                 <th className={thStyle}>Status</th>
//                 <th className={thStyle}>Applied At</th>
//                 <th className={thStyle}>Approved At</th>
//                 <th className={thStyle}>Approved Amount</th>
//                 <th className={thStyle}>Approved By</th>
//                 <th className={thStyle}>Settlement Date</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {tableData.map((row, idx) => (
//                 <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
//                   <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-200" /></td>
//                   <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">{row.type}</td>
//                   <td className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase">{row.claimId}</td>
//                   <td className="px-6 py-4 text-[10px] font-bold text-slate-600">{row.name}</td>
//                   <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{row.staffId}</td>
//                   <td className="px-6 py-4 text-[10px] font-medium text-slate-500">{row.date}</td>
//                   <td className="px-6 py-4 text-[10px] font-black text-slate-700">{row.reqAmount}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 w-fit border border-indigo-100">
//                       <div className="w-1 h-1 rounded-full bg-indigo-500" />
//                       <span className="text-[9px] font-black uppercase tracking-widest">{row.status}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-[10px] font-medium text-slate-600">{row.applied}</td>
//                   <td className="px-6 py-4 text-[10px] font-medium text-slate-600">-</td>
//                   <td className="px-6 py-4 text-[10px] font-black text-slate-700">{row.appAmount}</td>
//                   <td className="px-6 py-4 text-[10px] font-medium text-slate-600">-</td>
//                   <td className="px-6 py-4 text-[10px] font-medium text-slate-400">{row.settled}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

     
//         <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
//           <div className="flex items-center gap-3">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows Per Page</span>
//             <div className="relative">
//               <select className="bg-slate-50 border border-slate-200 pl-2 pr-6 py-1 text-[10px] font-bold text-slate-600 rounded-lg appearance-none outline-none">
//                 <option>10</option>
//               </select>
//               <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 !text-slate-400 pointer-events-none" />
//             </div>
//           </div>

//           <div className="flex items-center gap-1">
//             <button className="p-1 !text-slate-300 !bg-transparent border-0"><ChevronLeft size={16} /></button>
//             <button className="w-6 h-6 rounded bg-blue-600 text-white text-[10px] font-black border-0">1</button>
//             <button className="p-1 !text-slate-300 !bg-transparent border-0"><ChevronRight size={16} /></button>
//           </div>
//         </div>

       
// {showFilterModal && (
//   <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
//     <div 
//       className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
//       onClick={() => setShowFilterModal(false)} 
//     />
    
//     <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-visible animate-in zoom-in-95 duration-200 flex flex-col">
    
//       <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-2xl">
//         <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Filter By</h3>
//         <button onClick={() => setShowFilterModal(false)} className="p-1.5 !bg-transparent !text-slate-400 hover:!text-slate-600 border-0 cursor-pointer">
//           <X size={18} strokeWidth={2.5} />
//         </button>
//       </div>


//       <div className="p-6 space-y-5 bg-white text-left pb-10">
        
        
//         <div className="space-y-1.5 relative">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expense Type</label>
//           <div className="relative">
//             <button 
//               onClick={() => setShowTypeDropdown(!showTypeDropdown)}
//               className="w-full !bg-white border !border-slate-200 px-4 py-2.5 text-xs font-bold !text-slate-400 flex items-center justify-between rounded-xl outline-none focus:!border-blue-600 transition-all"
//             >
//               <span className={selectedTypes.length > 0 ? "text-slate-700" : ""}>
//                 {selectedTypes.length > 0 ? `${selectedTypes.length} selected` : "Select Expense Type"}
//               </span>
//               <ChevronDown size={14} className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
//             </button>

       
//             {showTypeDropdown && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 p-2 animate-in slide-in-from-top-2 duration-200">
//                 <label className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
//                   <input 
//                     type="checkbox" 
//                     className="w-4 h-4 mr-2 rounded border-slate-300 text-blue-600"
//                     checked={selectedTypes.length === expenseTypes.length}
//                     onChange={() => setSelectedTypes(selectedTypes.length === expenseTypes.length ? [] : [...expenseTypes])}
//                   />
//                   <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Select All</span>
//                 </label>
//                 <div className="h-px bg-slate-50 my-1" />
//                 {expenseTypes.map((type) => (
//                   <label key={type} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
//                     <input 
//                       type="checkbox" 
//                       className="w-4 h-4 rounded mr-2 border-slate-300 text-blue-600"
//                       checked={selectedTypes.includes(type)}
//                       onChange={() => {
//                         setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
//                       }}
//                     />
//                     <span className="text-[11px] font-medium text-slate-600 uppercase tracking-tight">{type}</span>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
//           <div className="relative">
//             <select className="w-full bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl appearance-none outline-none focus:border-blue-600 cursor-pointer">
//               <option>Select</option>
//               <option>Information Technology</option>
//               <option>Sales</option>
//             </select>
//             <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//           </div>
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Month Range</label>
//           <div className="relative group">
//             <input 
//               type="date" 
//               placeholder="Select Month Range" 
//               className="w-full bg-white border border-slate-200 pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:border-blue-600 cursor-pointer" 
//             />
//           </div>
//         </div>
//       </div>

 
//       <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 rounded-b-2xl">
//         <button 
//           onClick={() => { setSelectedTypes([]); setShowFilterModal(false); }}
//           className="flex-1 py-2.5 !bg-white border !border-slate-200 !text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-all active:scale-95 outline-none"
//         >
//           Clear Filter
//         </button>
//         <button 
//           onClick={() => {
//             toast.success("Filtering Reimbursement Node...");
//             setShowFilterModal(false);
//           }}
//           className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 active:scale-95 transition-all border-0 outline-none"
//         >
//           Apply Filter
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//       </div> */}

//       {/* 📊 MAIN CONTAINER CONTENT */}
// <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
//   {activeSubTab === "Dashboard" ? (
//     <>
//       {/* --- DASHBOARD VIEW (Your Existing Code) --- */}
//       <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
//         <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Dashboard</h2>
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <select className="bg-slate-50 border border-slate-200 pl-3 pr-8 py-1.5 text-[10px] font-black text-slate-600 uppercase rounded-lg appearance-none outline-none cursor-pointer">
//               <option>FY 2025 - 2026</option>
//             </select>
//             <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
//           </div>
//           <button 
//           onClick={() => setShowFilterModal(true)}
//           className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all outline-none cursor-pointer">
//             <Filter size={12} strokeWidth={2.5} /> Filter
//           </button>
//         </div>
//       </div>

//       <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//         <SummaryCard label="Reimbursements Paid" amount="₹ 3,822" claims="2" color="purple" />
//         <SummaryCard label="Reimbursements Approved" amount="₹ 0" claims="0" color="green" />
//         <SummaryCard label="Reimbursements Pending" amount="₹ 0" claims="0" color="orange" />
//       </div>

//       <div className="px-6 py-3 bg-slate-50/30 border-y border-slate-100 text-left">
//         <div className="relative w-full sm:w-80 group">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
//           <input 
//             type="text" 
//             placeholder="Search by Claim ID, Staff name or Staff ID" 
//             className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:border-blue-500 transition-all" 
//           />
//         </div>
//       </div>

//       <div className="overflow-x-auto minimal-scrollbar">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50/50 border-b border-slate-100">
//               <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
//               <th className={thStyle}>Expense Type</th>
//               <th className={thStyle}>Claim ID</th>
//               <th className={thStyle}>Staff Name</th>
//               <th className={thStyle}>Staff ID</th>
//               <th className={thStyle}>Expense Date</th>
//               <th className={thStyle}>Requested Amount</th>
//               <th className={thStyle}>Status</th>
//               <th className={thStyle}>Applied At</th>
//               <th className={thStyle}>Approved At</th>
//               <th className={thStyle}>Approved Amount</th>
//               <th className={thStyle}>Approved By</th>
//               <th className={thStyle}>Settlement Date</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {tableData.map((row, idx) => (
//               <tr key={idx}
//               onClick={() => handleRowClick(row)}
//               className="hover:bg-slate-50/30 transition-colors group">
//                 <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-200" /></td>
//                 <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">{row.type}</td>
//                 <td className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase">{row.claimId}</td>
//                 <td className="px-6 py-4 text-[10px] font-bold text-slate-600">{row.name}</td>
//                 <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{row.staffId}</td>
//                 <td className="px-6 py-4 text-[10px] font-medium text-slate-500">{row.date}</td>
//                 <td className="px-6 py-4 text-[10px] font-black text-slate-700">{row.reqAmount}</td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 w-fit border border-indigo-100">
//                     <div className="w-1 h-1 rounded-full bg-indigo-500" />
//                     <span className="text-[9px] font-black uppercase tracking-widest">{row.status}</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-[10px] font-medium text-slate-600">{row.applied}</td>
//                 <td className="px-6 py-4 text-[10px] font-medium text-slate-600">-</td>
//                 <td className="px-6 py-4 text-[10px] font-black text-slate-700">{row.appAmount}</td>
//                 <td className="px-6 py-4 text-[10px] font-medium text-slate-600">-</td>
//                 <td className="px-6 py-4 text-[10px] font-medium text-slate-400">{row.settled}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
//         <div className="flex items-center gap-3">
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows Per Page</span>
//           <div className="relative">
//             <select className="bg-slate-50 border border-slate-200 pl-2 pr-6 py-1 text-[10px] font-bold text-slate-600 rounded-lg appearance-none outline-none">
//               <option>10</option>
//             </select>
//             <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 !text-slate-400 pointer-events-none" />
//           </div>
//         </div>
//         <div className="flex items-center gap-1">
//           <button className="p-1 !text-slate-300 !bg-transparent border-0"><ChevronLeft size={16} /></button>
//           <button className="w-6 h-6 rounded bg-blue-600 text-white text-[10px] font-black border-0">1</button>
//           <button className="p-1 !text-slate-300 !bg-transparent border-0"><ChevronRight size={16} /></button>
//         </div>
//       </div>
//     </>
//   ) : (
//     /* ⚙️ SETTINGS VIEW (Matches image_8bb07e.jpg) */
//     // <div className="p-8 text-left animate-in fade-in duration-500">
//     //   <div className="mb-8">
//     //     <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Reimbursement Settings</h2>
//     //     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Access reimbursement based settings here.</p>
//     //   </div>

//     //   <div className="space-y-4 max-w-5xl">
//     //     <SettingsItem 
//     //       title="Reimbursement Templates" 
//     //       desc="Configure reimbursement templates, assign to staff, and more." 
//     //     />
//     //     <SettingsItem 
//     //       title="Approval Setting" 
//     //       desc="Choose admins who will be approving staff reimbursement requests" 
//     //     />
//     //   </div>
//     // </div>
//     <>
//     {/* ⚙️ SETTINGS VIEW (Matches image_8bbfa5.jpg) */}
// <div className="p-8 text-left animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
//   <div className="mb-8">
//     <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Reimbursement Settings</h2>
//     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Access reimbursement based settings here.</p>
//   </div>

//   <div className="space-y-4 max-w-5xl">
//     {/* 1. Reimbursement Templates (Static) */}
//     <SettingsItem 
//       title="Reimbursement Templates" 
//       desc="Configure reimbursement templates, assign to staff, and more." 
//       onClick={() => {}}
//     />

//     {/* 2. Approval Setting (Expandable Accordion) */}
//     <div className={`border rounded-2xl transition-all duration-300 ${expandedSetting === 'approval' ? 'border-blue-200 bg-white' : 'border-slate-100 bg-white'}`}>
//       <button 
//         onClick={() => setExpandedSetting(expandedSetting === 'approval' ? null : 'approval')}
//         className="w-full flex items-center justify-between p-6 !bg-transparent outline-none cursor-pointer group"
//       >
//         <div className="text-left space-y-1">
//           <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
//             Approval Setting
//           </h3>
//           <p className="text-[10px] text-slate-400 font-medium">
//             Choose admins who will be approving staff reimbursement requests
//           </p>
//         </div>
//         <div className={`p-2 rounded-xl transition-all ${expandedSetting === 'approval' ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
//           <ChevronDown size={18} strokeWidth={2.5} />
//         </div>
//       </button>

//       {/* 📂 EXPANDED CONTENT */}
//       {expandedSetting === 'approval' && (
//         <div className="px-6 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-300">
//           <div className="space-y-3">
//             <AdminToggle label="Vijay Pakhare" defaultChecked={true} />
//             <AdminToggle label="CHAITALI GAIKWAD" defaultChecked={false} />
//           </div>

//           <div className="pt-4">
//             <button 
//               onClick={() => {
//                 toast.success("Approval registry updated ✅");
//                 setExpandedSetting(null);
//               }}
//               className="px-8 py-2 !bg-slate-200 !text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-white hover:!text-blue-500 border border-slate-500 hover:border-blue-500 transition-all outline-none cursor-pointer"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
//   {/* 📋 REIMBURSEMENT DETAILS SIDEBAR (Matches image_8c2c45.jpg) */}
// {showSidebar && (
//   <div className="fixed inset-0 z-[200] flex justify-end">
//     {/* 🌑 Backdrop */}
//     <div 
//       className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
//       onClick={() => setShowSidebar(false)} 
//     />
    
//     {/* 🏛️ Sidebar Panel */}
//     <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-y-auto custom-scrollbar">
      
//       {/* 🔝 Header Section */}
//       <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
//         <div className="flex items-center gap-3">
//           <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Travel Expense</h2>
//           <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
//             <div className="w-1 h-1 rounded-full bg-indigo-500" />
//             <span className="text-[8px] font-black uppercase tracking-widest">Paid</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <button className="p-1.5 hover:bg-slate-50 rounded-lg text-blue-600 transition-all !bg-transparent border-0 outline-none cursor-pointer">
//             <Download size={18} strokeWidth={2.5} />
//           </button>
//           <button onClick={() => setShowSidebar(false)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-all !bg-transparent border-0 outline-none cursor-pointer">
//             <X size={20} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>

//       {/* 📄 Content Area */}
//       <div className="flex-1 p-8 space-y-10 text-left">
        
//         {/* Metadata Strip */}
//         <div className="flex flex-wrap gap-x-10 gap-y-2">
//           <DetailItem label="Staff Name" value="Imran Shaikh" />
//           <DetailItem label="Staff ID" value="#MUNGE70" isBlue />
//           <DetailItem label="Settlement Date" value="15 Sep '25" />
//         </div>

//         {/* Details Grid */}
//         <div className="grid grid-cols-3 gap-y-10 gap-x-6">
//           <DetailItem label="Claim ID" value="#25" isBlue />
//           <DetailItem label="Expense Date" value="15 Sep '25 - 15 Sep '25" />
//           <DetailItem label="Bill Number" value="122" />
          
//           <DetailItem label="Requested Amount" value="₹ 2,322" isBlack />
//           <div className="col-span-1">
//              <DetailItem label="Description" value="previous month salary" />
//           </div>
//           <DetailItem label="Created At" value="15 Sep '25" />

//           <DetailItem label="Paid Amount" value="₹ 2,322" isBlack />
//           <DetailItem label="Approved By" value="-" />
//           <DetailItem label="Approval Remark" value="-" />
//         </div>

//         {/* Audit Trail Section */}
//         <div className="space-y-6 pt-6 border-t border-slate-50">
//           <DetailItem label="Paid Remark" value="approved by vijay sir" />
//           <DetailItem label="Created By" value="Goelectronix Technologies Private Limited" />
//           <DetailItem label="Paid By" value="Goelectronix Technologies Private Limited" />
//         </div>

//         {/* Itemised Bills Accordion Placeholder */}
//         <div className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50/30">
//           <div className="flex items-center gap-3">
//             <FileText size={16} className="text-slate-400" />
//             <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Itemised Bills</span>
//           </div>
//           <ChevronDown size={14} className="text-slate-400" />
//         </div>

//         {/* Attachments Section */}
//         <div className="space-y-3">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Attachments</label>
//           <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
//              <span className="text-[11px] font-medium text-slate-600 truncate max-w-[80%]">5e6vzlju8q_imran shaikh remaining slary .pdf</span>
//              <Download size={14} className="text-slate-400 group-hover:text-blue-600" />
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
// </div>
//     </>
//   )}
// </div>

//       <style>{`
//         .minimal-scrollbar::-webkit-scrollbar { height: 4px; }
//         .minimal-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .minimal-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
//       `}</style>
//     </div>
//   );
// };

// // 🎨 INTERNAL COMPONENTS
// const SummaryCard = ({ label, amount, claims, color }) => {
//   const themes = {
//     purple: "bg-[#f3e8ff] border-[#e9d5ff] text-[#7e22ce]",
//     green: "bg-[#f0fdf4] border-[#dcfce7] text-[#15803d]",
//     orange: "bg-[#fff7ed] border-[#ffedd5] text-[#c2410c]"
//   };
  
//   return (
//     <div className={`p-4 rounded-xl border flex justify-between items-start transition-all hover:shadow-md ${themes[color]}`}>
//       <div className="text-left">
//         <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-3">{label}</p>
//         <p className="text-xl font-black tracking-tight">{amount}</p>
//       </div>
//       <div className="text-right">
//         <Info size={14} className="opacity-40 mb-3" />
//         <p className="text-[9px] font-black uppercase">Claims: <span className="text-[12px]">{claims}</span></p>
//       </div>
//     </div>
//   );
// };


// // 🔘 CUSTOM TOGGLE NODE
// const AdminToggle = ({ label, defaultChecked }) => (
//   <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-slate-200 transition-all max-w-md">
//     <label className="relative inline-flex items-center cursor-pointer">
//       <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
//       <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
//     </label>
//     <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{label}</span>
//   </div>
// );


// const DetailItem = ({ label, value, isBlue, isBlack }) => (
//   <div className="space-y-1">
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
//     <p className={`text-[11px] font-bold tracking-tight uppercase leading-none ${
//       isBlue ? "text-blue-600" : isBlack ? "text-slate-900 font-black" : "text-slate-700"
//     }`}>
//       {value || "-"}
//     </p>
//   </div>
// );


// // 📄 UPDATED SETTINGS ITEM (Simple Nav version)
// const SettingsItem = ({ title, desc, onClick }) => (
//   <button 
//     onClick={onClick}
//     className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group !bg-transparent outline-none cursor-pointer"
//   >
//     <div className="text-left space-y-1">
//       <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
//         {title}
//       </h3>
//       <p className="text-[10px] text-slate-400 font-medium">
//         {desc}
//       </p>
//     </div>
//     <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//       <ChevronRight size={18} strokeWidth={2.5} />
//     </div>
//   </button>
// );


// const thStyle = "px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap";

// export default ReimburesementsPage;