import React from 'react';
import { 
  ArrowLeft, 
  Plus, 
  ShieldCheck, 
  Cloud, 
  HelpCircle,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageSalaryTemplates = () => {
  const navigate = useNavigate();

  // Data mapped directly from image_d76052.jpg
  const templates = [
    {
      id: 1,
      name: "Regular PT",
      type: "Monthly Staff | Percentage wise",
      isDefault: true
    },
    {
      id: 2,
      name: "hourly",
      type: "Hourly Staff | Percentage wise",
      isDefault: true
    },
    {
      id: 3,
      name: "Regular Non PT",
      type: "Monthly Staff | Percentage wise",
      isDefault: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-15 text-left relative">
      {/* 🚀 HEADER - */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-slate-300 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 leading-none">Back</span>
        </button>
      </div>

      <div className=" mx-auto px-6 mt-4">
        {/* 📑 MAIN CONTAINER CARD - */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm space-y-10 relative overflow-hidden">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Salary Structure Templates</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Add and save templates of salary structures
              </p>
            </div>
            
            <button
            onClick={() => navigate('/createsalarystruture')} 
            className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 border border-blue-500 rounded-xl shadow-sm shadow-!blue-200 hover:bg-white transition-all active:scale-95 cursor-pointer">
              <Plus size={16} strokeWidth={3} />
              <span className="text-[11px] font-black uppercase tracking-widest">Create Template</span>
            </button>
          </div>

          {/* 📂 TEMPLATE LIST - */}
          <div className="space-y-4 pt-4 mb-4">
            {templates.map((template, index) => (
              <div 
                key={template.id} 
                className="group flex items-center justify-between p-6 border border-slate-100 rounded-xl hover:border-blue-200 transition-all bg-white"
              >
                <div className="flex items-center gap-6">
                  {/* Index Indicator */}
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <span className="text-[11px] font-black text-blue-600">{index + 1}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                      {template.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  {/* Default Badge */}
                  {template.isDefault && (
                    <span className="px-4 py-1.5 bg-slate-200 text-slate-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-200/50">
                      Default
                    </span>
                  )}
                  
                  <button 
                  onClick={() => navigate('/createsalarystruture', { state: { template } })}
                  className="text-[11px] font-black border border-blue-500 !text-blue-600 !bg-blue-50 uppercase tracking-[0.15em] hover:!bg-blue-50 px-4 py-2 rounded-lg transition-all !bg-transparent  cursor-pointer">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Background Decorative Watermark */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
            <Wallet size={280} />
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default ManageSalaryTemplates;