import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Info, 
  HelpCircle,
  Banknote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EncashPage = () => {
  const navigate = useNavigate();

  // 1. Updated Dummy Data with actual encashable limits
  const [staffData, setStaffData] = useState([
    { id: 1, name: "Hemlata Tandure", encashableLeaves: 12, encashCount: 0, compensation: 690.97, total: 0 },
    { id: 2, name: "Sandip Satpute", encashableLeaves: 5, encashCount: 0, compensation: 1088.71, total: 0 },
    { id: 3, name: "Pratik Uttam Hankare", encashableLeaves: 8, encashCount: 0, compensation: 1125.03, total: 0 },
  ]);

  // 2. Logic: Handle Input Changes & Multiplication

const handleCountChange = (id, value) => {
  // If the input is empty, set it to an empty string so placeholder shows
  if (value === "") {
    setStaffData(prevData => prevData.map(staff => 
      staff.id === id ? { ...staff, encashCount: "", total: "0.00" } : staff
    ));
    return;
  }

  const count = parseFloat(value);
  
  setStaffData(prevData => prevData.map(staff => {
    if (staff.id === id) {
      // Logic: Ensure we don't exceed the leave limit
      const validatedCount = Math.min(count, staff.encashableLeaves);
      return {
        ...staff,
        encashCount: validatedCount,
        total: (validatedCount * staff.compensation).toFixed(2)
      };
    }
    return staff;
  }));
};

  // 3. Logic: Calculate Grand Total for Footer
  const grandTotal = useMemo(() => {
    return staffData.reduce((acc, curr) => acc + parseFloat(curr.total), 0).toFixed(2);
  }, [staffData]);

  // Check if any leaves are actually being encashed to enable button
  const hasEncashment = staffData.some(s => s.encashCount > 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* 🚀 NAV HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center sticky top-0 z-30">
        <button 
          onClick={() => navigate(-1)} 
          className="p-1.5 hover:!bg-slate-50 rounded-lg !bg-transparent text-slate-400 border border-transparent hover:!border-slate-100 transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={16} className='text-slate-400' />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Back</span>
        </button>
      </div>

      <div className="mx-auto px-6 mt-6 max-w-[1400px]">
        {/* 📑 PAGE TITLE SECTION */}
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Encash Unused Leave</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Encashed leave amount would be added to Staff's Salary
          </p>
        </div>

        {/* 📊 DATA CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Staff Name</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Encashable Leaves</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Encash Count</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Per Day Compensation</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Total Compensation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="bg-blue-50/30">
                  <td colSpan="5" className="px-6 py-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Monthly Regular</span>
                  </td>
                </tr>

                {staffData.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{staff.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-600">{staff.encashableLeaves} Left</span>
                        <Info size={12} className="text-slate-300 cursor-help" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                    <input 
  type="number" 
  value={staff.encashCount} // This will now be "" when cleared, showing the placeholder
  onChange={(e) => handleCountChange(staff.id, e.target.value)}
  placeholder="0"
  max={staff.encashableLeaves}
  onWheel={(e) => e.target.blur()} // Pro-tip: prevents scrolling from changing numbers
  className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/5 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
/>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 px-3 py-1.5 bg-slate-50/50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500">
                        {staff.compensation}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-black text-slate-800 tracking-tight">₹ {staff.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 💰 BOTTOM SUMMARY STRIP */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Amount</span>
            <span className="text-lg font-black text-slate-900 tracking-tighter">₹ {grandTotal}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
           
           <button 
             disabled={!hasEncashment}
             className={`flex items-center gap-2 px-8 py-3 rounded-lg text-[11px] font-black uppercase cursor-pointer tracking-widest transition-all ${
               hasEncashment 
               ? "!bg-white !text-blue-500 shadow-sm shadow-blue-100 hover:!bg-white border border-blue-500 active:scale-95" 
               : "!bg-slate-200 !text-slate-400 cursor-not-allowed"
             }`}
           >
             <Banknote size={16} />
             Encash Leaves
           </button>
        </div>
      </div>
    </div>
  );
};

export default EncashPage;