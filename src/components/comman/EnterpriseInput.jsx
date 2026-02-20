import React from "react";

const EnterpriseInput = React.memo(({
  label,
  value,
  min,
  max,          // ✅ added
  step,         // ✅ optional (ex: 900 = 15 min)
  disabled, 
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  ...rest  
}) => {
  return (
    <div className="flex flex-col gap-2 group w-full">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>

      <div className="relative">
        {/* Optional Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Icon size={16} />
          </div>
        )}

        <input
          type={type}
          value={value}
          min={min}
           max={max}          // ✅ important for time/date limit
          step={step}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl
          ${Icon ? "pl-12 pr-5" : "px-5"}
          py-3.5 text-sm font-bold text-slate-800
          focus:bg-white focus:border-indigo-500
          outline-none transition-all shadow-sm hover:bg-slate-100/50`}
        />
      </div>
    </div>
  );
});

EnterpriseInput.displayName = "EnterpriseInput";

export default EnterpriseInput;
