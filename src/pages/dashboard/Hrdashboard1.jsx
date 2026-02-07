import React, { useState } from 'react';
import { 
  Users, ShieldCheck, Briefcase, Zap, 
  Search, Filter, ArrowUpRight, Plus, 
  MoreHorizontal, Lock, Globe, FileText,
  Activity, TrendingUp, AlertCircle, Clock
} from 'lucide-react';

const HRGovernanceDashboard = () => {
  // Dummy Data - Enterprise Registry
  const [employees] = useState([
    { id: "EMP-9021", name: "Sarah Chen", role: "Sr. Software Architect", dept: "Engineering", status: "Active", risk: "Low", location: "Singapore" },
    { id: "EMP-9022", name: "Marcus Vane", role: "Product Strategy", dept: "Growth", status: "Onboarding", risk: "Low", location: "London" },
    { id: "EMP-9023", name: "Elena Rodriguez", role: "VP of Fintech", dept: "Operations", status: "Active", risk: "Moderate", location: "Madrid" },
    { id: "EMP-9024", name: "David Park", role: "Security Engineer", dept: "Engineering", status: "Review", risk: "High", location: "Remote" },
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans antialiased text-slate-900">
      
      {/* --- SECTION 1: SYSTEM HUD (Heads Up Display) --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black tracking-[0.2em] uppercase">
              Human Capital Terminal
            </div>
            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-tight">
              <Lock size={10} /> Secure Layer 7
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            Personnel <span className="text-slate-400 font-light">&</span> Asset Governance
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
            <Plus size={14} /> Provision New Asset
          </button>
        </div>
      </div>

      {/* --- SECTION 2: TOP-LEVEL ANALYTICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Headcount", val: "1,284", change: "+12%", icon: <Users size={20}/>, color: "text-blue-600" },
          { label: "Active Requisitions", val: "42", change: "5 Pending", icon: <Briefcase size={20}/>, color: "text-amber-600" },
          { label: "Compliance Index", val: "98.2%", change: "Optimized", icon: <ShieldCheck size={20}/>, color: "text-emerald-600" },
          { label: "System Uptime", val: "99.9%", change: "Real-time", icon: <Activity size={20}/>, color: "text-indigo-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="relative z-10">
              <div className={`${stat.color} mb-4 opacity-80 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <h2 className="text-2xl font-black text-slate-900">{stat.val}</h2>
                <span className="text-[10px] font-bold text-emerald-500 mb-1">{stat.change}</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              {React.cloneElement(stat.icon, { size: 100 })}
            </div>
          </div>
        ))}
      </div>

      {/* --- SECTION 3: CORE DATA GRID & RISK AUDIT --- */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Main Asset Registry */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Global Asset Registry</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500">
                  <Search size={12} /> Search Employees...
                </div>
              </div>
              <Filter size={16} className="text-slate-400 cursor-pointer hover:text-slate-900" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Name</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Business Unit</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {employees.map((emp, i) => (
                    <tr key={i} className="hover:bg-blue-50/20 transition-colors group cursor-pointer">
                      <td className="px-8 py-5">
                        <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">#{emp.id}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 tracking-tight">{emp.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{emp.role}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <Globe size={12} className="text-slate-300" /> {emp.dept}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{emp.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm">
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Compliance & Risk */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Risk Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <TrendingUp size={120} className="absolute -bottom-10 -right-10 text-white/5 opacity-20" />
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                <AlertCircle size={14} /> Risk Assessment Logic
              </h4>
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase">Churn Probability</p>
                    <p className="text-xl font-black">Low (4.2%)</p>
                  </div>
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-blue-500" />
                  </div>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase">Equity Balance</p>
                    <p className="text-xl font-black">94.8%</p>
                  </div>
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[90%] h-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={14} /> Real-time Audit Trail
            </h4>
            <div className="space-y-6">
              {[
                { time: "2m ago", text: "New Job Logic committed to #COMP-2024", type: "system" },
                { time: "14m ago", text: "EMP-9021 location updated to Singapore", type: "user" },
                { time: "1h ago", text: "Quarterly Audit Report Generated", type: "report" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 2 && <div className="absolute left-1.5 top-6 w-[1px] h-8 bg-slate-100" />}
                  <div className="w-3 h-3 rounded-full border-2 border-slate-100 bg-white mt-1 z-10" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-tight">{log.text}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRGovernanceDashboard;