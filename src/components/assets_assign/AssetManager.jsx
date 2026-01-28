import React from 'react';
import { Monitor, Cpu, Package, X, Plus, ShieldCheck } from 'lucide-react';

const AssetManager = ({ previousAssets = [], assetRows = [], onAdd, onRemove, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Header section with Metadata */}
      <div className="flex items-center justify-between px-1">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Hardware Assets Assignment
          </label>
          <p className="text-[10px] text-slate-400 font-medium">Provisioning hardware for new recruitment cycles</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-100 transition-all border border-blue-100"
        >
          <Plus size={14} /> Add Asset
        </button>
      </div>

      <div className="space-y-3">
        {/* SECTION: PREVIOUSLY COMMITTED ASSETS */}
        {previousAssets.map((asset, i) => (
          <div
            key={`prev-${i}`}
            className="group grid grid-cols-12 gap-4 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl items-center opacity-80"
          >
            <div className="col-span-1 flex justify-center">
              <div className="p-2 bg-white text-emerald-500 rounded-lg shadow-sm">
                {asset.category.toLowerCase() === "laptop" ? <Monitor size={16} /> : <Package size={16} />}
              </div>
            </div>
            <div className="col-span-4">
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Asset Info</p>
              <p className="text-xs font-bold text-slate-700">{asset.category.toUpperCase()} — {asset.model}</p>
            </div>
            <div className="col-span-4">
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Serial / ID</p>
              <p className="text-xs font-mono text-slate-500">{asset.serial}</p>
            </div>
            <div className="col-span-3 flex justify-end">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-tighter border border-emerald-200">
                <ShieldCheck size={10} /> Verified
              </span>
            </div>
          </div>
        ))}

        {/* SECTION: NEW DYNAMIC ROWS (DRAFTS) */}
        {assetRows.map((row, index) => (
          <div
            key={`new-${index}`}
            className="group grid grid-cols-12 gap-3 p-4 bg-white border border-slate-200 rounded-[1.5rem] items-end hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all animate-in slide-in-from-top-2 duration-300"
          >
            {/* Category Select */}
            <div className="col-span-3 space-y-1.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Category</p>
              <select
                value={row.category}
                onChange={(e) => onChange(index, "category", e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
              >
                <option value="laptop">Laptop</option>
                <option value="mobile">Mobile</option>
                <option value="sim_card">SIM Card</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Model Input */}
            <div className="col-span-4 space-y-1.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">
                {row.category === "sim_card" ? "Carrier / Plan" : "Model Specification"}
              </p>
              <input
                value={row.model}
                onChange={(e) => onChange(index, "model", e.target.value)}
                placeholder="e.g. MacBook Air M2"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Identification/Serial */}
            <div className="col-span-4 space-y-1.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Identification</p>
              <input
                value={row.serial}
                onChange={(e) => onChange(index, "serial", e.target.value)}
                placeholder="Serial Number..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-medium text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Remove Action */}
            <div className="col-span-1 flex justify-center pb-1">
              <button
                onClick={() => onRemove(index)}
                className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {assetRows.length === 0 && previousAssets.length === 0 && (
          <div className="border-2 border-dashed border-slate-100 rounded-[2rem] py-10 flex flex-col items-center justify-center">
            <Package size={32} className="text-slate-200 mb-2" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Assets Assigned</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetManager;