import React, { useState } from "react";
import { Calendar, Plus, Table as TableIcon, LayoutGrid } from "lucide-react";
import HolidayForm from "./HolidayForm";
import HolidayTable from "./HolidayTable";

const HolidayManager = () => {
  const [activeTab, setActiveTab] = useState("registry"); // 'registry' or 'configure'

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* ENTERPRISE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
            <Calendar size={28} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">
              Corporate Calendar
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Global Holiday Configuration & Registry
            </p>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveTab("registry")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "registry" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <TableIcon size={14} /> Registry
          </button>
          <button
            onClick={() => setActiveTab("configure")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "configure" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Plus size={14} /> Configure
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        {activeTab === "registry" ? <HolidayTable /> : <HolidayForm />}
      </div>
    </div>
  );
};

export default HolidayManager;