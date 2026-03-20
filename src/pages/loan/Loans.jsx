import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreVertical,
  ShieldCheck,
  CloudCog,
  X,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Loans = () => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // 🔥 Added for Add Loan
  const [editingData, setEditingData] = useState(null);

  const transactions = [
    {
      id: 1,
      type: 'Repayment',
      date: 'September Salary',
      description: 'salary advance',
      amount: '₹ 2,000',
      isCredit: true,
    },
    {
      id: 2,
      type: 'Loan Amount',
      date: '24 Sep, 2025',
      description: 'salary advance',
      amount: '(-) ₹ 2,000',
      isCredit: false,
    }
  ];

  const handleEditClick = (item) => {
    setEditingData(item);
    setShowEditModal(true);
  };

  return (
    <div className="p-4 bg-white min-h-screen animate-in fade-in duration-500">
      {/* 🔙 BACK NAVIGATION */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 mb-6 !text-slate-600 font-bold !bg-transparent border-0 cursor-pointer outline-none group"
      >
        <ArrowLeft size={14} strokeWidth={3} />
        <span className="text-[10px] uppercase tracking-widest">Back</span>
      </button>

      <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Loans</h2>

      {/* 💳 SUMMARY STATS STRIP */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-6 mb-6">
        <div className="flex gap-12">
          <StatBox label="Total Loan Amount" value="₹ 2,000" />
          <div className="w-[1px] h-8 bg-slate-100 hidden sm:block" />
          <StatBox label="Total Payments" value="₹ 2,000" />
          <div className="w-[1px] h-8 bg-slate-100 hidden sm:block" />
          <StatBox label="Loan Balance" value="₹ 0" />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 border !border-blue-100 !text-blue-600 rounded-lg hover:!bg-blue-50 transition-all !bg-transparent">
            <Download size={16} />
          </button>
          <button className="px-6 py-2 border !border-blue-600 !text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-blue-50 transition-all !bg-transparent">
            Deduct Loan
          </button>
          {/* 🔥 Trigger Add Modal */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 !bg-white !text-blue-500 border border-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all active:scale-95"
          >
            Add Loan
          </button>
        </div>
      </div>

      {/* 📊 TRANSACTION LIST */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-visible mb-8">
        <div className="divide-y divide-slate-50">
          {transactions.map((item, index) => (
            <div 
              key={item.id} 
              style={{ zIndex: openMenuId === item.id ? 50 : 0 }}
              className={`relative flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group ${index === 0 ? 'rounded-t-xl' : ''} ${index === transactions.length -1 ? 'rounded-b-xl' : ''}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2 rounded-full ${item.isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {item.isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div className="w-32">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.type}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-medium text-slate-500">{item.date}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-medium text-slate-400 italic">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 relative">
                <p className="text-[11px] font-black text-slate-700">{item.amount}</p>
                
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === item.id ? null : item.id);
                    }}
                    className="!text-slate-300 hover:!text-blue-600 !bg-transparent border-0 p-0 cursor-pointer transition-colors outline-none"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenuId === item.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                      <div className="absolute right-0 top-0 mt-0 mr-6 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 min-w-[150px] animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={() => {
                            handleEditClick(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-widest !text-slate-600 hover:!bg-slate-50 hover:!text-blue-600 transition-all !bg-transparent border-0 cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      

      {/* ➕ ADD LOAN ENTRY MODAL (Matches image_8102fe.jpg) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white text-left">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Add Loan Entry</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dhaval Mehta</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 !bg-transparent !text-slate-400 hover:!text-slate-600 border-0 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 bg-white text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date</label>
                <input type="date" defaultValue="2026-03-20" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <input type="number" placeholder="Amount" className="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description (Optional)</label>
                <input type="text" placeholder="Add Description" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer group py-1">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Send SMS to Staff</span>
              </label>

              <button 
                onClick={() => {
                  toast.success("Synchronizing Loan Artifact...");
                  setShowAddModal(false);
                }}
                className="w-full py-3 !bg-white !text-blue-500 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] shadow-sm border border-blue-500 shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all mt-2 cursor-pointer "
              >
                Add Loan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 EDIT DEDUCTION MODAL */}
     {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Edit Deduction</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dhaval Mehta</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 !bg-transparent !text-slate-400 hover:!text-slate-600 border-0 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5 bg-white text-left">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deduct From</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl appearance-none outline-none focus:border-blue-600 transition-all cursor-pointer">
                    <option>September Salary</option>
                    <option>October Salary</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <input type="text" defaultValue={editingData?.amount.replace(/[^\d.]/g, '')} className="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all" />
                </div>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description (Optional)</label>
                <input type="text" defaultValue={editingData?.description} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer group py-1">
                <input type="checkbox" defaultChecked className="w-4 h-4 mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Send SMS to Staff</span>
              </label>
              <button 
                onClick={() => {
                  toast.success("Updated Deduction...");
                  setShowEditModal(false);
                }}
                className="w-full py-3 !bg-white !text-blue-500 border border-blue-500 rounded-lg text-[11px] font-black uppercase tracking-[0.15em] shadow-sm shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all mt-2 cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Helpers
const StatBox = ({ label, value }) => (
  <div className="space-y-1 text-left">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-slate-900">{value}</p>
  </div>
);

const PromiseItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div className="text-left">
      <p className="text-[10px] font-black text-slate-800 leading-none">{title}</p>
      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{desc}</p>
    </div>
  </div>
);

export default Loans;
//***************************************************************************************** */
// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Download, 
//   ArrowUpRight, 
//   ArrowDownLeft, 
//   MoreVertical,
//   ShieldCheck,
//   CloudCog,
//   X,
//   ChevronDown
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const Loans = () => {
//   const navigate = useNavigate();
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingData, setEditingData] = useState(null);

//   const transactions = [
//     {
//       id: 1,
//       type: 'Repayment',
//       date: 'September Salary',
//       description: 'salary advance',
//       amount: '₹ 2,000',
//       isCredit: true,
//     },
//     {
//       id: 2,
//       type: 'Loan Amount',
//       date: '24 Sep, 2025',
//       description: 'salary advance',
//       amount: '(-) ₹ 2,000',
//       isCredit: false,
//     }
//   ];

//   const handleEditClick = (item) => {
//     setEditingData(item);
//     setShowEditModal(true);
//   };

//   return (
//     <div className="p-4 bg-white min-h-screen animate-in fade-in duration-500">
//       {/* 🔙 BACK NAVIGATION */}
//       <button 
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-1 mb-6 !text-blue-600 font-bold !bg-transparent border-0 cursor-pointer outline-none group"
//       >
//         <ArrowLeft size={14} strokeWidth={3} />
//         <span className="text-[10px] uppercase tracking-widest">Back</span>
//       </button>

//       <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Loans</h2>

//       {/* 💳 SUMMARY STATS STRIP */}
//       <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-6 mb-6">
//         <div className="flex gap-12">
//           <StatBox label="Total Loan Amount" value="₹ 2,000" />
//           <div className="w-[1px] h-8 bg-slate-100 hidden sm:block" />
//           <StatBox label="Total Payments" value="₹ 2,000" />
//           <div className="w-[1px] h-8 bg-slate-100 hidden sm:block" />
//           <StatBox label="Loan Balance" value="₹ 0" />
//         </div>

//         <div className="flex items-center gap-2">
//           <button className="p-2 border !border-blue-100 !text-blue-600 rounded-lg hover:!bg-blue-50 transition-all !bg-transparent">
//             <Download size={16} />
//           </button>
//           <button className="px-6 py-2 border !border-blue-600 !text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-blue-50 transition-all !bg-transparent">
//             Deduct Loan
//           </button>
//           <button className="px-6 py-2 !bg-transparent !text-blue-500 border border-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-white shadow-sm shadow-blue-200 transition-all active:scale-95">
//             Add Loan
//           </button>
//         </div>
//       </div>

//       {/* 📊 TRANSACTION LIST - Changed to overflow-visible */}
//       <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-visible mb-8">
//         <div className="divide-y divide-slate-50">
//           {transactions.map((item, index) => (
//             <div 
//               key={item.id} 
//               style={{ zIndex: openMenuId === item.id ? 50 : 0 }}
//               className={`relative flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group ${index === 0 ? 'rounded-t-xl' : ''} ${index === transactions.length -1 ? 'rounded-b-xl' : ''}`}
//             >
//               <div className="flex items-center gap-4 flex-1">
//                 <div className={`p-2 rounded-full ${item.isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
//                   {item.isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
//                 </div>
//                 <div className="w-32">
//                   <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.type}</p>
//                 </div>
//                 <div className="flex-1 text-center">
//                   <p className="text-[11px] font-medium text-slate-500">{item.date}</p>
//                 </div>
//                 <div className="flex-1 text-center">
//                   <p className="text-[11px] font-medium text-slate-400 italic">{item.description}</p>
//                 </div>
//               </div>

//               {/* AMOUNT & DROPDOWN NODE */}
//               <div className="flex items-center gap-4 relative">
//                 <p className="text-[11px] font-black text-slate-700">{item.amount}</p>
                
//                 <div className="relative">
//                   <button 
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setOpenMenuId(openMenuId === item.id ? null : item.id);
//                     }}
//                     className="!text-slate-300 hover:!text-blue-600 !bg-transparent border-0 p-0 cursor-pointer transition-colors outline-none"
//                   >
//                     <MoreVertical size={16} />
//                   </button>

//                   {/* 📂 THE DROPDOWN POPUP */}
//                   {openMenuId === item.id && (
//                     <>
//                       <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
//                       <div className="absolute right-0 top-0 mt-0 mr-6 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 min-w-[150px] animate-in fade-in zoom-in-95 duration-100">
//                         <button
//                           onClick={() => {
//                             handleEditClick(item);
//                             setOpenMenuId(null);
//                           }}
//                           className="w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-widest !text-slate-600 hover:!bg-slate-50 hover:!text-blue-600 transition-all !bg-transparent border-0 cursor-pointer"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 🛡️ PROMISE FOOTER */}
//       <div className="flex items-center gap-8 mt-12">
//         <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Our Promise</h4>
//         <div className="flex items-center gap-6">
//           <PromiseItem icon={<ShieldCheck size={18} className="text-emerald-500" />} title="100% Safe" desc="Pagatbook is safe" />
//           <PromiseItem icon={<CloudCog size={18} className="text-blue-500" />} title="100% Auto Backup" desc="All data is linked to your phone number" />
//         </div>
//       </div>

//       {/* 📝 EDIT DEDUCTION MODAL */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowEditModal(false)} />
//           <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
//               <div>
//                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Edit Deduction</h3>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dhaval Mehta</p>
//               </div>
//               <button onClick={() => setShowEditModal(false)} className="p-1.5 !bg-transparent !text-slate-400 hover:!text-slate-600 border-0 cursor-pointer">
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="p-6 space-y-5 bg-white text-left">
//               <div className="space-y-1.5 text-left">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deduct From</label>
//                 <div className="relative">
//                   <select className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl appearance-none outline-none focus:border-blue-600 transition-all cursor-pointer">
//                     <option>September Salary</option>
//                     <option>October Salary</option>
//                   </select>
//                   <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>
//               <div className="space-y-1.5 text-left">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount</label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
//                   <input type="text" defaultValue={editingData?.amount.replace(/[^\d.]/g, '')} className="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all" />
//                 </div>
//               </div>
//               <div className="space-y-1.5 text-left">
//                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description (Optional)</label>
//                 <input type="text" defaultValue={editingData?.description} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all" />
//               </div>
//               <label className="flex items-center gap-2 cursor-pointer group py-1">
//                 <input type="checkbox" defaultChecked className="w-4 h-4 mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
//                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Send SMS to Staff</span>
//               </label>
//               <button 
//                 onClick={() => {
//                   toast.success("Updated Deduction...");
//                   setShowEditModal(false);
//                 }}
//                 className="w-full py-3 !bg-white !text-blue-500 border border-blue-500 rounded-lg text-[11px] font-black uppercase tracking-[0.15em] shadow-sm shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all mt-2 cursor-pointer"
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Internal Helpers
// const StatBox = ({ label, value }) => (
//   <div className="space-y-1">
//     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
//     <p className="text-sm font-black text-slate-900">{value}</p>
//   </div>
// );

// const PromiseItem = ({ icon, title, desc }) => (
//   <div className="flex items-center gap-3">
//     {icon}
//     <div className="text-left">
//       <p className="text-[10px] font-black text-slate-800 leading-none">{title}</p>
//       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{desc}</p>
//     </div>
//   </div>
// );

// export default Loans;


// import React , {useState} from 'react';
// import { 
//   ArrowLeft, 
//   Download, 
//   ArrowUpRight, 
//   ArrowDownLeft, 
//   MoreVertical,
//   ShieldCheck,
//   CloudCog,
//   X,
//    ChevronDown
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const Loans = () => {
//   const navigate = useNavigate();
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
// const [editingData, setEditingData] = useState(null);
//   const transactions = [
//     {
//       id: 1,
//       type: 'Repayment',
//       date: 'September Salary',
//       description: 'salary advance',
//       amount: '₹ 2,000',
//       isCredit: true,
//     },
//     {
//       id: 2,
//       type: 'Loan Amount',
//       date: '24 Sep, 2025',
//       description: 'salary advance',
//       amount: '(-) ₹ 2,000',
//       isCredit: false,
//     }
//   ];


// const handleEditClick = (item) => {
//   setEditingData(item);
//   setShowEditModal(true);
// };

//   return (
//     <div className="p-4 bg-white min-h-screen animate-in fade-in duration-500">
//       {/* 🔙 BACK NAVIGATION */}
//       <button 
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-1 mb-6 !text-blue-600 font-bold !bg-transparent border-0 cursor-pointer outline-none group"
//       >
//         <ArrowLeft size={14} strokeWidth={3} />
//         <span className="text-[10px] uppercase tracking-widest">Back</span>
//       </button>

//       <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Loans</h2>

//       {/* 💳 SUMMARY STATS STRIP */}
//       <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-6 mb-6">
//         <div className="flex gap-12">
//           <StatBox label="Total Loan Amount" value="₹ 2,000" />
//           <div className="w-[1px] h-8 bg-slate-100 hidden sm:block" />
//           <StatBox label="Total Payments" value="₹ 2,000" />
//           <div className="w-[1px] h-8 bg-slate-100 hidden sm:block" />
//           <StatBox label="Loan Balance" value="₹ 0" />
//         </div>

//         <div className="flex items-center gap-2">
//           <button className="p-2 border !border-blue-100 !text-blue-600 rounded-lg hover:!bg-blue-50 transition-all !bg-transparent">
//             <Download size={16} />
//           </button>
//           <button className="px-6 py-2 border !border-blue-600 !text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-blue-50 transition-all !bg-transparent">
//             Deduct Loan
//           </button>
//           <button className="px-6 py-2 !bg-transparent !text-blue-500 border border-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:!bg-white shadow-sm shadow-blue-200 transition-all active:scale-95">
//             Add Loan
//           </button>
//         </div>
//       </div>

//       {/* 📊 TRANSACTION LIST */}
//       <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden mb-8">
//         <div className="divide-y divide-slate-50">
//           {transactions.map((item) => (
//             <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group">
//               <div className="flex items-center gap-4 flex-1">
//                 {/* ICON BOX */}
//                 <div className={`p-2 rounded-full ${item.isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
//                   {item.isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
//                 </div>
                
//                 {/* LABEL */}
//                 <div className="w-32">
//                   <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.type}</p>
//                 </div>

//                 {/* DATE/SOURCE */}
//                 <div className="flex-1 text-center">
//                   <p className="text-[11px] font-medium text-slate-500">{item.date}</p>
//                 </div>

//                 {/* DESCRIPTION */}
//                 <div className="flex-1 text-center">
//                   <p className="text-[11px] font-medium text-slate-400 italic">{item.description}</p>
//                 </div>
//               </div>

//               {/* AMOUNT & MENU */}
//   <div className="flex items-center gap-4 relative">
//   <p className="text-[11px] font-black text-slate-700">
//     {item.amount}
//   </p>
  
//   <div className="relative">
//     <button 
//       onClick={(e) => {
//         e.stopPropagation();
//         setOpenMenuId(openMenuId === item.id ? null : item.id);
//       }}
//       className="!text-slate-300 hover:!text-blue-600 !bg-transparent border-0 p-0 cursor-pointer transition-colors outline-none"
//     >
//       <MoreVertical size={16} />
//     </button>

//     {/* 📂 DROPDOWN MENU (Matches image_8afbc3.jpg) */}
//     {openMenuId === item.id && (
//       <>
//         {/* Invisible backdrop to close menu on click outside */}
//         <div className="fixed inset-0 z-80" onClick={() => setOpenMenuId(null)} />
        
//         <div className="absolute right-0 top-0 mt-0 ml-2 translate-x-full bg-white border border-slate-200 rounded-lg shadow-xl z-80 py-1 min-w-[80px] animate-in fade-in zoom-in-95 duration-100">
//           <button
//             onClick={() => {
//               handleEditClick(item);
//               setOpenMenuId(null);
//             }}
//             className="w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all !bg-transparent border-0 cursor-pointer"
//           >
//             Edit
//           </button>
//         </div>
//       </>
//     )}
//   </div>
// </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 🛡️ PROMISE FOOTER */}
//       <div className="flex items-center gap-8 mt-12">
//         <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Our Promise</h4>
//         <div className="flex items-center gap-6">
//           <PromiseItem 
//             icon={<ShieldCheck size={18} className="text-emerald-500" />} 
//             title="100% Safe" 
//             desc="Pagatbook is safe" 
//           />
//           <PromiseItem 
//             icon={<CloudCog size={18} className="text-blue-500" />} 
//             title="100% Auto Backup" 
//             desc="All data is linked to your phone number" 
//           />
//         </div>
//       </div>

//       {/* 📝 EDIT DEDUCTION MODAL (Matches image_8afbc3.jpg) */}
// {showEditModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//     <div 
//       className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
//       onClick={() => setShowEditModal(false)} 
//     />
    
//     <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
//         <div>
//           <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Edit Deduction</h3>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dhaval Mehta</p>
//         </div>
//         <button onClick={() => setShowEditModal(false)} className="p-1.5 !bg-transparent !text-slate-400 hover:!text-slate-600 cursor-pointer border-0">
//           <X size={18} />
//         </button>
//       </div>

//       {/* Body */}
//       <div className="p-6 space-y-5 bg-white">
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deduct From</label>
//           <div className="relative">
//             <select className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl appearance-none outline-none focus:border-blue-600 transition-all cursor-pointer">
//               <option>September Salary</option>
//               <option>October Salary</option>
//             </select>
//             <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//           </div>
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount</label>
//           <div className="relative">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
//             <input 
//               type="text" 
//               defaultValue={editingData?.amount.replace(/[^\d.]/g, '')}
//               className="w-full bg-slate-50 border border-slate-200 pl-8 pr-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all" 
//             />
//           </div>
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description (Optional)</label>
//           <input 
//             type="text" 
//             defaultValue={editingData?.description}
//             className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all" 
//           />
//         </div>

//         <label className="flex items-center gap-2 cursor-pointer group py-1">
//           <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
//           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">Send SMS to Staff</span>
//         </label>

//         <button 
//           onClick={() => {
//             toast.success("Deduction updated in registry ✅");
//             setShowEditModal(false);
//           }}
//           className="w-full py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all mt-2"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// // Sub-components for clean code
// const StatBox = ({ label, value }) => (
//   <div className="space-y-1">
//     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
//     <p className="text-sm font-black text-slate-900">{value}</p>
//   </div>
// );

// const PromiseItem = ({ icon, title, desc }) => (
//   <div className="flex items-center gap-3">
//     {icon}
//     <div>
//       <p className="text-[10px] font-black text-slate-800 leading-none">{title}</p>
//       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{desc}</p>
//     </div>
//   </div>
// );

// export default Loans;