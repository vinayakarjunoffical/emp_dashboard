import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  Trash2,
  Wallet,
  Info,
  ChevronUp,
  Coins,
  Building2,
  MinusCircle,
  MoreVertical,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast"; // Import this at the top

const SalaryStructureTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.template;
  const [activePtMenu, setActivePtMenu] = useState(null);

  // 🚀 PF SPECIFIC STATES
  const [pfCalcType, setPfCalcType] = useState("Variable"); // "Fixed" or "Variable"
  const [pfVariablePercent, setPfVariablePercent] = useState("12");
  const [selectedPfComponents, setSelectedPfComponents] = useState([
    "Basic + DA",
  ]);

  // 🚀 PT SLABS STATE (Matches the test case from the image)
  const [ptSlabs, setPtSlabs] = useState([
    { id: 1, min: "0", max: "max", tax: "0" },
  ]);

  const handlePtSlabChange = (id, field, value) => {
    setPtSlabs(
      ptSlabs.map((slab) =>
        slab.id === id ? { ...slab, [field]: value } : slab,
      ),
    );
  };

  // 🚀 Add / Delete PT Row Logic
  const addPtRow = (index) => {
    const newSlabs = [...ptSlabs];
    // Insert new empty row right below the current one
    newSlabs.splice(index + 1, 0, {
      id: Date.now(),
      min: "",
      max: "",
      tax: "0",
    });
    setPtSlabs(newSlabs);
    setActivePtMenu(null);
  };

  const deletePtRow = (id) => {
    // Prevent deleting if it's the only row left
    if (ptSlabs.length > 1) {
      setPtSlabs(ptSlabs.filter((slab) => slab.id !== id));
    }
    setActivePtMenu(null);
  };

  // 1. Core State
  const [templateName, setTemplateName] = useState("Default");
  const [isDefault, setIsDefault] = useState(true);
  const [staffType, setStaffType] = useState("Monthly Regular");
  const [calcBy, setCalcBy] = useState("₹ (Fixed Amount)"); // State to toggle API fields
  const [newCustomName, setNewCustomName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEsiItems, setSelectedEsiItems] = useState([
    "Basic + DA",
    "HRA",
  ]);

  // 2. Data Lists State
  const [earnings, setEarnings] = useState([
    { id: 1, label: "HRA", amount: "" },
    { id: 2, label: "Medical Allowance", amount: "" },
    { id: 3, label: "Special Allowance", amount: "" },
  ]);
  const [deductions, setDeductions] = useState([
    {
      id: 1,
      label: "Provident Fund (PF)",
      type: "Variable [12%]",
      hasInfo: true,
    },
    { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected" },
    { id: 3, label: "Professional Tax (PT)" },
  ]);
  const [employerContributions, setEmployerContributions] = useState([
    { id: 1, label: "Provident Fund (PF)", amount: "" },
    { id: 2, label: "Employee State Insurance (ESI)", amount: "" },
  ]);

  // 3. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

  // Suggested Options State
  const [suggestedEarnings, setSuggestedEarnings] = useState([
    { label: "Basic + DA", selected: false },
    { label: "HRA", selected: true },
    { label: "Medical Allowance", selected: true },
    { label: "Special Allowance", selected: true },
    { label: "Bonus", selected: false },
  ]);
  const [suggestedDeductions, setSuggestedDeductions] = useState([
    { label: "Provident Fund (PF)", selected: true },
    { label: "Employee State Insurance (ESI)", selected: true },
    { label: "Professional Tax (PT)", selected: true },
    { label: "Income Tax (TDS)", selected: false },
  ]);
  const [suggestedEmployer, setSuggestedEmployer] = useState([
    { label: "Provident Fund (PF)", selected: true },
    { label: "Employee State Insurance (ESI)", selected: true },
    { label: "Health Insurance", selected: false },
  ]);

  // Handle API Save
  const handleSaveTemplate = async () => {
    setIsSubmitting(true);

    const isFixed = calcBy.includes("Fixed Amount");

    const components = [
      ...earnings.map((item) => ({
        name: item.label,
        component_type: "earning",
        percentage_of_ctc: isFixed ? null : parseFloat(item.amount) || 0,
        fixed_annual_value: isFixed ? parseFloat(item.amount) || 0 : null,
      })),
      ...deductions.map((item) => ({
        name: item.label,
        component_type: "deduction",
        percentage_of_ctc: isFixed ? null : 0,
        fixed_annual_value: isFixed ? 0 : null,
      })),
      ...employerContributions.map((item) => ({
        name: item.label,
        component_type: "benefit",
        percentage_of_ctc: isFixed ? null : parseFloat(item.amount) || 0,
        fixed_annual_value: isFixed ? parseFloat(item.amount) || 0 : null,
      })),
    ];

    const payload = {
      name: templateName,
      description: `${staffType} template created via UI`,
      is_default: isDefault,
      components: components,
    };

    const savingToast = toast.loading("Saving template details...");

    try {
      const response = await fetch(
        "https://uathr.goelectronix.co.in/salary-templates",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        // alert("Template saved successfully!");
        toast.success("Template saved successfully!", { id: savingToast });
        navigate("/managesalarytemplates");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        // alert("Failed to save template.");
        toast.error("Failed to save. Please check inputs.", { id: savingToast });
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Network error. Please try again.", { id: savingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveList = (suggested, currentList, setList, setModal) => {
    const selectedList = suggested
      .filter((item) => item.selected)
      .map((item, index) => {
        const existing = currentList.find((e) => e.label === item.label);
        return (
          existing || {
            id: Date.now() + index,
            label: item.label,
            amount: "",
            type: "0 Selected",
          }
        );
      });
    setList(selectedList);
    setModal(false);
  };

  const removeRow = (id, list, setList, suggested, setSuggested) => {
    const itemToRemove = list.find((e) => e.id === id);
    setList(list.filter((item) => item.id !== id));
    if (itemToRemove)
      setSuggested(
        suggested.map((s) =>
          s.label === itemToRemove.label ? { ...s, selected: false } : s,
        ),
      );
  };

  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-22 text-left relative overflow-x-hidden">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50] shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex !bg-transparent items-center gap-2 text-black hover:text-blue-600 border-0 bg-transparent cursor-pointer group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 text-black transition-transform"
          />
          <span className="text-[11px] font-black uppercase !text-black tracking-widest leading-none">
            Back to Templates
          </span>
        </button>
      </div>

      <div className="mx-auto md:px-6 px-2 mt-4 space-y-6">
        {/* TOP INFO CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 mb-4 shadow-sm space-y-10">
          <div className="flex flex-col md:flex-row md:items-center mb-4 gap-8">
            <div className="space-y-2 flex-1 max-w-md">
              <label className="text-[9px] font-black !text-black uppercase tracking-[0.2em] ml-1">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
              <span className="text-[10px] font-bold text-black uppercase tracking-widest">
                Set to Default
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black !text-black uppercase tracking-[0.2em] ml-1">
                Staff Type
              </label>
              <div className="relative group">
                <select
                  value={staffType}
                  onChange={(e) => setStaffType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black appearance-none outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option>Monthly Regular</option>
                  <option>Hourly</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black !text-black uppercase tracking-[0.2em] ml-1">
                Salary Calculation By
              </label>
              <div className="relative group">
                <select
                  value={calcBy}
                  onChange={(e) => setCalcBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black appearance-none outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option>₹ (Fixed Amount)</option>
                  <option>% (Percentage wise)</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* EARNINGS SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4 shadow-sm">
          <div className="bg-slate-50/50 px-4 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Coins size={18} strokeWidth={2.5} />
              </div>
              <h3 className="text-[11px] font-black !text-black uppercase tracking-[0.2em]">
                Earnings
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 !text-blue-600 text-[10px] font-black !bg-white uppercase border px-4 py-3 rounded-xl !border-blue-600 cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} />{" "}
              <span className="hidden sm:inline">Add More</span>
            </button>
          </div>
          <div className="p-4 sm:p-8 space-y-6">
            {earnings.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 group border-b border-slate-50 sm:border-0 pb-4 sm:pb-0 last:border-0"
              >
                <div className="w-full sm:w-1/2 text-left">
                  <p className="text-[11px] font-bold text-black uppercase">
                    {item.label}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="number"
                      placeholder="Enter value"
                      value={item.amount}
                      onChange={(e) =>
                        setEarnings(
                          earnings.map((ev) =>
                            ev.id === item.id
                              ? { ...ev, amount: e.target.value }
                              : ev,
                          ),
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-black outline-none focus:border-blue-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-black">
                      {calcBy.includes("Fixed") ? "₹" : "%"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      removeRow(
                        item.id,
                        earnings,
                        setEarnings,
                        suggestedEarnings,
                        setSuggestedEarnings,
                      )
                    }
                    className="p-2.5 !bg-blue-50 !text-blue-600 border border-blue-100 rounded-xl cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📉 2. DEDUCTIONS SECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl mb-4 shadow-sm relative z-[40]">
          <div className="bg-slate-50/50 px-4 sm:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <MinusCircle size={18} strokeWidth={2.5} />
              </div>
              <h3 className="text-[11px] font-black !text-black uppercase tracking-[0.2em]">
                Deductions
              </h3>
            </div>
            <button
              onClick={() => setIsDeductionModalOpen(true)}
              className="flex items-center justify-center gap-2 !text-blue-600 text-[10px] font-black !bg-white sm:!bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-600 w-full sm:w-auto"
            >
              <Plus size={14} strokeWidth={3} /> Add More
            </button>
          </div>

          <div className="p-4 sm:p-8 space-y-8 sm:space-y-6">
            {deductions.map((item) => (
              <div
                key={item.id}
                className="space-y-4 relative border-b border-slate-50 sm:border-0 pb-6 sm:pb-0 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
                  <div className="w-full md:w-1/2 flex items-center gap-2 text-left mb-2 md:mb-0">
                    {item.isExpandable && (
                      <ChevronUp size={14} className="text-blue-600 shrink-0" />
                    )}
                    <p className="text-[11px] font-bold text-black uppercase tracking-tight">
                      {item.label}
                    </p>
                    {item.hasInfo && (
                      <Info size={12} className="text-black shrink-0" />
                    )}
                  </div>

                  <div className="relative flex-1 md:flex-none md:w-64 md:ml-auto text-left">
                    {item.label === "Employee State Insurance (ESI)" ? (
                      <div className="relative">
                        <div
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.id ? null : item.id,
                            )
                          }
                          className={`w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${
                            activeDropdown === item.id
                              ? "border-blue-600 ring-4 ring-blue-600/5 bg-white"
                              : "hover:border-slate-300"
                          }`}
                        >
                          <span className="text-[10px] font-black text-black uppercase tracking-tighter truncate pr-2">
                            {selectedEsiItems.length > 0
                              ? `${selectedEsiItems.length} Selected`
                              : "Select Components"}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-black-400 shrink-0 transition-transform duration-300 ${
                              activeDropdown === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {activeDropdown === item.id && (
                          <>
                            <div
                              className="fixed inset-0 z-[70]"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] p-2 animate-in fade-in slide-in-from-top-1 duration-200 ring-1 ring-slate-200/50 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                              {[
                                "Basic + DA",
                                "HRA",
                                "Medical Allowance",
                                "Special Allowance",
                                "OT Wages",
                                "Bonus Wages",
                                "Allowance Wages",
                              ].map((opt) => (
                                <label
                                  key={opt}
                                  className="flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer group transition-all"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedEsiItems.includes(opt)}
                                    onChange={() =>
                                      setSelectedEsiItems((prev) =>
                                        prev.includes(opt)
                                          ? prev.filter((i) => i !== opt)
                                          : [...prev, opt],
                                      )
                                    }
                                    className="w-4 h-4 shrink-0 rounded mr-2 border-slate-300 text-blue-600 accent-blue-600 focus:ring-0"
                                  />
                                  <span
                                    className={`text-[10px] font-black uppercase tracking-widest ${
                                      selectedEsiItems.includes(opt)
                                        ? "text-blue-600"
                                        : "text-black"
                                    }`}
                                  >
                                    {opt}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : item.label === "Professional Tax (PT)" ? (
                      <div className="w-full text-left md:text-right h-auto md:h-10 flex items-center md:justify-end px-2 py-2 md:py-0">
                        {/* 🔥 Added text exactly as per second image */}
                        <span className="text-[11px] font-bold text-black tracking-tight">
                          Added | ₹ 0{" "}
                          <span className="text-[10px] font-medium text-black normal-case">
                            (As Per Current Month's Calculation)
                          </span>
                        </span>
                      </div>
                    ) : item.label === "Provident Fund (PF)" ? (
                      <div className="relative">
                        <div
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.id ? null : item.id,
                            )
                          }
                          className={`w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${
                            activeDropdown === item.id
                              ? "border-blue-600 ring-4 ring-blue-600/5 bg-white"
                              : "hover:border-slate-300"
                          }`}
                        >
                          <span className="text-[10px] font-black text-black uppercase tracking-tighter truncate pr-2">
                            {pfCalcType === "Fixed"
                              ? "₹ 1,800 Fixed"
                              : `${pfVariablePercent}% Variable`}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-black shrink-0 transition-transform duration-300 ${
                              activeDropdown === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {activeDropdown === item.id && (
                          <>
                            <div
                              className="fixed inset-0 z-[70]"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div className="absolute top-full right-0 mt-1 w-full min-w-[240px] bg-white border border-slate-200 rounded-xl shadow-xl z-[80] p-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                              {/* <label
                                className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all"
                                onClick={() => setPfCalcType("Fixed")}
                              >
                                <input
                                  type="radio"
                                  checked={pfCalcType === "Fixed"}
                                  onChange={() => setPfCalcType("Fixed")}
                                  className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-0"
                                />
                                <span
                                  className={`text-[11px] font-bold ${
                                    pfCalcType === "Fixed"
                                      ? "text-black-900"
                                      : "text-black-400"
                                  }`}
                                >
                                  ₹ 1,800 Fixed
                                </span>
                              </label>

                              <label
                                className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all mt-0.5"
                                onClick={() => setPfCalcType("Variable")}
                              >
                                <input
                                  type="radio"
                                  checked={pfCalcType === "Variable"}
                                  onChange={() => setPfCalcType("Variable")}
                                  className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-0"
                                />
                                <span className="flex items-center gap-1.5 flex-1">
                                  <input
                                    type="text"
                                    value={pfVariablePercent}
                                    onChange={(e) =>
                                      setPfVariablePercent(e.target.value)
                                    }
                                    onFocus={() => setPfCalcType("Variable")}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-7 bg-transparent border-b border-slate-200 text-center outline-none text-[11px] font-black text-black-700 focus:border-blue-600"
                                  />
                                  <span className="text-[10px] font-black text-black-400 uppercase tracking-tight">
                                    % Variable
                                  </span>
                                </span>
                              </label> */}

                              <div className="space-y-1">
  {/* 1️⃣ Fixed Option Row */}
  <label
    className="flex flex-row items-center gap-3 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all w-full"
    onClick={() => setPfCalcType("Fixed")}
  >
    <input
      type="radio"
      checked={pfCalcType === "Fixed"}
      onChange={() => setPfCalcType("Fixed")}
      className="w-3.5 h-3.5 mr-2 shrink-0 text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
    />
    <span
      className={`text-[11px] font-bold whitespace-nowrap tracking-tight ${
        pfCalcType === "Fixed" ? "text-black" : "text-black"
      }`}
    >
      ₹ 1,800 Fixed
    </span>
  </label>

  {/* 2️⃣ Variable Option Row */}
<label
  className="flex flex-row items-center gap-3 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all mt-0.5 w-full"
  onClick={() => setPfCalcType("Variable")}
>
  {/* Radio Button */}
  <input
    type="radio"
    checked={pfCalcType === "Variable"}
    onChange={() => setPfCalcType("Variable")}
    className="w-3.5 h-3.5  text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
  />

  {/* Input and Label Group in one row */}
  <div className="flex flex-row items-center gap-1.5 w-fit whitespace-nowrap">
    <input
      type="text"
      value={pfVariablePercent}
      onChange={(e) => setPfVariablePercent(e.target.value)}
      onFocus={() => setPfCalcType("Variable")}
      onClick={(e) => e.stopPropagation()}
      // shrink-0 prevents the input from taking extra space
      className="w-8 shrink-0 bg-transparent border-b border-slate-200 text-center outline-none text-[11px] font-black text-black focus:border-blue-600 py-0"
    />
    <span className="text-[10px] font-black text-black uppercase tracking-widest">
      % Variable
    </span>
  </div>
</label>
</div>

                              <div
                                className={`mt-1.5 pt-1 border-t border-slate-50 space-y-0.5 ${
                                  pfCalcType === "Variable"
                                    ? "opacity-100"
                                    : "opacity-40 pointer-events-none"
                                }`}
                              >
                                {[
                                  "Basic + DA",
                                  "HRA",
                                  "Medical Allowance",
                                  "Special Allowance",
                                  "OT Wages",
                                  "Bonus Wages",
                                  "Allowance Wages",
                                ].map((comp) => (
                                  <label
                                    key={comp}
                                    className="flex items-center gap-2.5 px-2 py-1 hover:bg-blue-50/50 rounded-md cursor-pointer transition-all"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedPfComponents.includes(
                                        comp,
                                      )}
                                      disabled={pfCalcType !== "Variable"}
                                      onChange={() =>
                                        setSelectedPfComponents((prev) =>
                                          prev.includes(comp)
                                            ? prev.filter((c) => c !== comp)
                                            : [...prev, comp],
                                        )
                                      }
                                      className="w-3 h-3 mr-2 rounded border-slate-300 text-blue-600 focus:ring-0"
                                    />
                                    <span
                                      className={`text-[9px] font-black uppercase tracking-tight ${
                                        selectedPfComponents.includes(comp) &&
                                        pfCalcType === "Variable"
                                          ? "text-blue-600"
                                          : "text-black"
                                      }`}
                                    >
                                      {comp}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="relative group">
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-[11px] font-bold text-black appearance-none outline-none focus:border-blue-400 cursor-pointer transition-all">
                          <option>{item.type}</option>
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. Global Trash Icon */}
                  {item.label !== "Professional Tax (PT)" && (
                    <div className="shrink-0 md:ml-2">
                      <button
                        onClick={() =>
                          removeRow(
                            item.id,
                            deductions,
                            setDeductions,
                            suggestedDeductions,
                            setSuggestedDeductions,
                          )
                        }
                        className="p-2.5 sm:p-2 bg-blue-50 sm:!bg-transparent !text-blue-600 sm:!text-blue-600 hover:!text-rose-500 border border-rose-100 sm:border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Professional Tax Detailed Slab Section */}
              


  {item.label === "Professional Tax (PT)" && (
                  <div className="space-y-3 pt-2 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between ml-1 sm:ml-8 gap-3 sm:gap-0 mb-4">
                      <button className="text-[10px] font-medium !text-blue-600 hover:underline border-0 p-0 !bg-transparent cursor-pointer flex items-center gap-1.5 w-fit">
                        Read Professional Tax Policy{" "}
                        <span className="text-black">Across States</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-2 ml-1 sm:ml-8">
                      {ptSlabs.map((slab, index) => (
                        <div
                          key={slab.id}
                          className="flex flex-col md:flex-row md:items-center justify-end gap-3 sm:gap-4 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-none"
                        >
                          <p className="text-[10px] sm:text-[11px] font-medium text-black italic mb-1 sm:mb-0 mr-2">
                            If monthly payable salary is
                          </p>

                          <div className="grid grid-cols-[1fr_1fr] sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            {/* 🚀 MIN Input */}
                            <div className="relative w-full sm:w-24">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-black">
                                ₹
                              </span>
                              <input
                                type="text"
                                /* 🚀 LOGIC: If it's the first row, use its own min. Otherwise, use the previous row's max. */
                                value={
                                  index === 0
                                    ? slab.min
                                    : ptSlabs[index - 1].max
                                }
                                onChange={(e) => {
                                  if (index === 0) {
                                    handlePtSlabChange(
                                      slab.id,
                                      "min",
                                      e.target.value,
                                    );
                                  }
                                }}
                                /* 🚀 UI: Disable all 'min' inputs except the very first one */
                                readOnly={index !== 0}
                                className={`w-full pl-7 pr-3 py-2 bg-white sm:bg-slate-50 border border-slate-200 sm:border-slate-200 rounded-lg text-[11px] font-bold text-black outline-none focus:border-blue-400 ${
                                  index !== 0
                                    ? "opacity-70 bg-slate-100 cursor-not-allowed"
                                    : ""
                                }`}
                              />
                            </div>

                            {/* 🚀 MAX Input */}
                            <div className="relative w-full sm:w-24">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-black">
                                ₹
                              </span>
                              <input
                                type="text"
                                // If it is the last row, force it empty so the "max" placeholder is shown
                                value={
                                  index === ptSlabs.length - 1 ? "" : slab.max
                                }
                                onChange={(e) => {
                                  // Only update if it's NOT the last row
                                  if (index !== ptSlabs.length - 1) {
                                    handlePtSlabChange(
                                      slab.id,
                                      "max",
                                      e.target.value,
                                    );
                                  }
                                }}
                                // 🚀 UI: Disable if it's the last row
                                readOnly={index === ptSlabs.length - 1}
                                placeholder={
                                  index === ptSlabs.length - 1 ? "max" : ""
                                }
                                className={`w-full pl-7 pr-3 py-2 bg-white sm:bg-slate-50 border border-slate-200 sm:border-slate-200 rounded-lg text-[11px] font-bold text-black outline-none focus:border-blue-400 ${
                                  index === ptSlabs.length - 1
                                    ? "opacity-70 bg-slate-100 cursor-not-allowed"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>

                          {/* Tax Amount Input & Add/Delete Menu */}
                          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 sm:ml-4 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0 w-full sm:w-auto relative">
                            <div className="relative flex-1 sm:flex-none sm:w-24">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-black">
                                ₹
                              </span>
                              <input
                                type="text"
                                value={slab.tax}
                                onChange={(e) =>
                                  handlePtSlabChange(
                                    slab.id,
                                    "tax",
                                    e.target.value,
                                  )
                                }
                                className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-black outline-none focus:border-blue-400 shadow-sm"
                              />
                            </div>

                            <button
                              onClick={() =>
                                setActivePtMenu(
                                  activePtMenu === slab.id ? null : slab.id,
                                )
                              }
                              className="p-1.5 !text-black hover:!text-black !bg-white sm:!bg-transparent border border-slate-200 sm:border-0 rounded-lg shrink-0 transition-colors cursor-pointer"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activePtMenu === slab.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-[70]"
                                  onClick={() => setActivePtMenu(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl z-[80] p-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                  <button
                                    onClick={() => addPtRow(index)}
                                    className="w-full text-left px-3 py-2 text-[10px] font-black !text-black hover:!bg-slate-50 hover:!text-blue-600 rounded-lg transition-colors uppercase !bg-transparent tracking-widest cursor-pointer"
                                  >
                                    Add Row
                                  </button>
                                  <button
                                    onClick={() => deletePtRow(slab.id)}
                                    disabled={ptSlabs.length === 1}
                                    className="w-full text-left px-3 py-2 text-[10px] font-black !text-rose-500 hover:!bg-rose-50 hover:!text-rose-600 rounded-lg transition-colors uppercase !bg-transparent tracking-widest disabled:opacity-50 disabled:cursor-not-allowed mt-0.5"
                                  >
                                    Delete Row
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* EMPLOYER CONTRIBUTION SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Building2 size={18} strokeWidth={2.5} />
              </div>
              <h3 className="text-[11px] font-black !text-black uppercase tracking-[0.2em]">
                Employer's Contribution
              </h3>
            </div>
            <button
              onClick={() => setIsEmployerModalOpen(true)}
              className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase border px-4 py-3 rounded-xl !border-blue-600 cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} /> Add More
            </button>
          </div>
          <div className="p-8 space-y-6">
            {employerContributions.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center gap-4 group"
              >
                <div className="md:w-1/2 text-left">
                  <p className="text-[11px] font-bold text-black uppercase">
                    {item.label}
                  </p>
                </div>
                <div className="relative w-full md:w-64 ml-auto">
                  <input
                    type="number"
                    placeholder="Enter value"
                    value={item.amount}
                    onChange={(e) =>
                      setEmployerContributions(
                        employerContributions.map((ev) =>
                          ev.id === item.id
                            ? { ...ev, amount: e.target.value }
                            : ev,
                        ),
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-black outline-none focus:border-blue-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-black">
                    {calcBy.includes("Fixed") ? "₹" : "%"}
                  </span>
                </div>
                <button
                  onClick={() =>
                    removeRow(
                      item.id,
                      employerContributions,
                      setEmployerContributions,
                      suggestedEmployer,
                      setSuggestedEmployer,
                    )
                  }
                  className="p-2 !text-blue-600 hover:!text-blue-600 !bg-transparent border rounded-xl cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md">
        <div className="mx-auto flex justify-end gap-4 px-2">
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-3 !bg-white border !border-slate-200 !text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSaveTemplate}
            className={`px-16 py-3 border rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all cursor-pointer ${isSubmitting ? "bg-slate-100 text-black border-slate-200" : "!bg-white !text-blue-600 border-blue-600 hover:!bg-blue-600 hover:!text-white"}`}
          >
            {isSubmitting ? "Saving..." : "Save Template"}
          </button>
        </div>
      </div>

      {[
        {
          open: isModalOpen,
          setOpen: setIsModalOpen,
          list: suggestedEarnings,
          setList: setSuggestedEarnings,
          title: "Earnings",
          onSave: () =>
            handleSaveList(
              suggestedEarnings,
              earnings,
              setEarnings,
              setIsModalOpen,
            ),
        },
        {
          open: isDeductionModalOpen,
          setOpen: setIsDeductionModalOpen,
          list: suggestedDeductions,
          setList: setSuggestedDeductions,
          title: "Deductions",
          onSave: () =>
            handleSaveList(
              suggestedDeductions,
              deductions,
              setDeductions,
              setIsDeductionModalOpen,
            ),
        },
        {
          open: isEmployerModalOpen,
          setOpen: setIsEmployerModalOpen,
          list: suggestedEmployer,
          setList: setSuggestedEmployer,
          title: "Employer Contribution",
          onSave: () =>
            handleSaveList(
              suggestedEmployer,
              employerContributions,
              setEmployerContributions,
              setIsEmployerModalOpen,
            ),
        },
      ].map(
        (modal) =>
          modal.open && (
            <div
              key={modal.title}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={() => modal.setOpen(false)}
              />
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 text-left">
                <div className="p-6 space-y-1">
                  <h2 className="text-lg font-black text-black uppercase tracking-tighter">
                    {modal.title} List
                  </h2>
                  <p className="text-[10px] font-bold text-black uppercase tracking-widest">
                    *Select at least one component
                  </p>
                </div>
                <div className="px-6 py-4 space-y-6">
                  <h4 className="text-[11px] font-black text-black uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">
                    Suggested
                  </h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {modal.list.map((item, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => {
                            const updated = [...modal.list];
                            updated[index].selected = !updated[index].selected;
                            modal.setList(updated);
                          }}
                          className="w-4 h-4 rounded mr-3 border-slate-200 text-blue-600 focus:ring-0"
                        />
                        <span className="text-[11px] font-bold text-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-[11px] font-black text-black uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">
                      Custom List
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom item"
                        className="flex-1 !bg-slate-50 border !border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:!border-blue-400"
                        value={newCustomName}
                        onChange={(e) => setNewCustomName(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          if (newCustomName) {
                            modal.setList([
                              ...modal.list,
                              { label: newCustomName, selected: true },
                            ]);
                            setNewCustomName("");
                          }
                        }}
                        className="px-4 py-2.5 !bg-blue-50 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
                  <button
                    onClick={() => modal.setOpen(false)}
                    className="flex-1 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modal.onSave}
                    className="flex-1 py-3 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ),
      )}
    </div>
  );
};

export default SalaryStructureTemplate;
//************************************************************************************************* */
// import React, { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   ChevronDown,
//   Plus,
//   Trash2,
//   Wallet,
//   Info,
//   ChevronUp,
//   Coins,
//   Building2,
//   MinusCircle,
//   MoreVertical,
// } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";

// const SalaryStructureTemplate = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editData = location.state?.template;

//   // 🚀 PF SPECIFIC STATES
//   const [pfCalcType, setPfCalcType] = useState("Variable"); // "Fixed" or "Variable"
//   const [pfVariablePercent, setPfVariablePercent] = useState("12");
//   const [selectedPfComponents, setSelectedPfComponents] = useState([
//     "Basic + DA",
//   ]);

//   // 1. Core State
//   const [templateName, setTemplateName] = useState("Default");
//   const [isDefault, setIsDefault] = useState(true);
//   const [staffType, setStaffType] = useState("Monthly Regular");
//   const [calcBy, setCalcBy] = useState("₹ (Fixed Amount)"); // State to toggle API fields
//   const [newCustomName, setNewCustomName] = useState("");
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedEsiItems, setSelectedEsiItems] = useState([
//     "Basic + DA",
//     "HRA",
//   ]);

//   // 2. Data Lists State
//   const [earnings, setEarnings] = useState([
//     { id: 1, label: "HRA", amount: "" },
//     { id: 2, label: "Medical Allowance", amount: "" },
//     { id: 3, label: "Special Allowance", amount: "" },
//   ]);
//   const [deductions, setDeductions] = useState([
//     {
//       id: 1,
//       label: "Provident Fund (PF)",
//       type: "Variable [12%]",
//       hasInfo: true,
//     },
//     { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected" },
//     { id: 3, label: "Professional Tax (PT)" },
//   ]);
//   const [employerContributions, setEmployerContributions] = useState([
//     { id: 1, label: "Provident Fund (PF)", amount: "" },
//     { id: 2, label: "Employee State Insurance (ESI)", amount: "" },
//   ]);

//   // 3. Modal States
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
//   const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

//   // Suggested Options State (Keeping your existing state)
//   const [suggestedEarnings, setSuggestedEarnings] = useState([
//     { label: "Basic + DA", selected: false },
//     { label: "HRA", selected: true },
//     { label: "Medical Allowance", selected: true },
//     { label: "Special Allowance", selected: true },
//     { label: "Bonus", selected: false },
//   ]);
//   const [suggestedDeductions, setSuggestedDeductions] = useState([
//     { label: "Provident Fund (PF)", selected: true },
//     { label: "Employee State Insurance (ESI)", selected: true },
//     { label: "Professional Tax (PT)", selected: true },
//     { label: "Income Tax (TDS)", selected: false },
//   ]);
//   const [suggestedEmployer, setSuggestedEmployer] = useState([
//     { label: "Provident Fund (PF)", selected: true },
//     { label: "Employee State Insurance (ESI)", selected: true },
//     { label: "Health Insurance", selected: false },
//   ]);

//   // Handle API Save
//   const handleSaveTemplate = async () => {
//     setIsSubmitting(true);

//     // Determine if we use percentage or fixed based on calcBy
//     const isFixed = calcBy.includes("Fixed Amount");

//     // Construct components array
//     const components = [
//       ...earnings.map((item) => ({
//         name: item.label,
//         component_type: "earning",
//         percentage_of_ctc: isFixed ? null : parseFloat(item.amount) || 0,
//         fixed_annual_value: isFixed ? parseFloat(item.amount) || 0 : null,
//       })),
//       ...deductions.map((item) => ({
//         name: item.label,
//         component_type: "deduction",
//         percentage_of_ctc: isFixed ? null : 0, // Deductions usually have specific logic, setting default 0
//         fixed_annual_value: isFixed ? 0 : null,
//       })),
//       ...employerContributions.map((item) => ({
//         name: item.label,
//         component_type: "benefit", // Employer contributions mapped to benefit
//         percentage_of_ctc: isFixed ? null : parseFloat(item.amount) || 0,
//         fixed_annual_value: isFixed ? parseFloat(item.amount) || 0 : null,
//       })),
//     ];

//     const payload = {
//       name: templateName,
//       description: `${staffType} template created via UI`,
//       is_default: isDefault,
//       components: components,
//     };

//     try {
//       const response = await fetch(
//         "https://uathr.goelectronix.co.in/salary-templates",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );

//       if (response.ok) {
//         alert("Template saved successfully!");
//         navigate("/managesalarytemplates");
//       } else {
//         const errorData = await response.json();
//         console.error("API Error:", errorData);
//         alert("Failed to save template.");
//       }
//     } catch (error) {
//       console.error("Network Error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Logic Helpers (Preserved from your code)
//   const handleSaveList = (suggested, currentList, setList, setModal) => {
//     const selectedList = suggested
//       .filter((item) => item.selected)
//       .map((item, index) => {
//         const existing = currentList.find((e) => e.label === item.label);
//         return (
//           existing || {
//             id: Date.now() + index,
//             label: item.label,
//             amount: "",
//             type: "0 Selected",
//           }
//         );
//       });
//     setList(selectedList);
//     setModal(false);
//   };

//   const removeRow = (id, list, setList, suggested, setSuggested) => {
//     const itemToRemove = list.find((e) => e.id === id);
//     setList(list.filter((item) => item.id !== id));
//     if (itemToRemove)
//       setSuggested(
//         suggested.map((s) =>
//           s.label === itemToRemove.label ? { ...s, selected: false } : s,
//         ),
//       );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-22 text-left relative overflow-x-hidden">
//       {/* HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50] shadow-sm">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex !bg-transparent items-center gap-2 text-black-400 hover:text-blue-600 border-0 bg-transparent cursor-pointer group"
//         >
//           <ArrowLeft
//             size={18}
//             className="group-hover:-translate-x-1 text-black-300 transition-transform"
//           />
//           <span className="text-[11px] font-black uppercase !text-black-400 tracking-widest leading-none">
//             Back to Templates
//           </span>
//         </button>
//       </div>

//       <div className="mx-auto md:px-6 px-2 mt-4 space-y-6">
//         {/* TOP INFO CARD */}
//         <div className="bg-white border border-slate-200 rounded-xl p-8 mb-4 shadow-sm space-y-10">
//           <div className="flex flex-col md:flex-row md:items-center mb-4 gap-8">
//             <div className="space-y-2 flex-1 max-w-md">
//               <label className="text-[9px] font-black text-black-400 uppercase tracking-[0.2em] ml-1">
//                 Template Name
//               </label>
//               <input
//                 type="text"
//                 value={templateName}
//                 onChange={(e) => setTemplateName(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black-700 outline-none focus:border-blue-400"
//               />
//             </div>
//             <div className="flex items-center gap-3 pt-6">
//               <input
//                 type="checkbox"
//                 checked={isDefault}
//                 onChange={(e) => setIsDefault(e.target.checked)}
//                 className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
//               />
//               <span className="text-[10px] font-bold text-black-500 uppercase tracking-widest">
//                 Set to Default
//               </span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-4">
//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-black-400 uppercase tracking-[0.2em] ml-1">
//                 Staff Type
//               </label>
//               <div className="relative group">
//                 <select
//                   value={staffType}
//                   onChange={(e) => setStaffType(e.target.value)}
//                   className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"
//                 >
//                   <option>Monthly Regular</option>
//                   <option>Hourly</option>
//                 </select>
//                 <ChevronDown
//                   size={14}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-black-300 pointer-events-none"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-black-400 uppercase tracking-[0.2em] ml-1">
//                 Salary Calculation By
//               </label>
//               <div className="relative group">
//                 <select
//                   value={calcBy}
//                   onChange={(e) => setCalcBy(e.target.value)}
//                   className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black-700 appearance-none outline-none focus:border-blue-400 cursor-pointer"
//                 >
//                   <option>₹ (Fixed Amount)</option>
//                   <option>% (Percentage wise)</option>
//                 </select>
//                 <ChevronDown
//                   size={14}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-black-300 pointer-events-none"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* EARNINGS SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4 shadow-sm">
//           <div className="bg-slate-50/50 px-4 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                 <Coins size={18} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-[11px] font-black text-black-900 uppercase tracking-[0.2em]">
//                 Earnings
//               </h3>
//             </div>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center justify-center gap-2 !text-blue-600 text-[10px] font-black !bg-white uppercase border px-4 py-3 rounded-xl !border-blue-600 cursor-pointer"
//             >
//               <Plus size={14} strokeWidth={3} />{" "}
//               <span className="hidden sm:inline">Add More</span>
//             </button>
//           </div>
//           <div className="p-4 sm:p-8 space-y-6">
//             {earnings.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 group border-b border-slate-50 sm:border-0 pb-4 sm:pb-0 last:border-0"
//               >
//                 <div className="w-full sm:w-1/2 text-left">
//                   <p className="text-[11px] font-bold text-black-700 uppercase">
//                     {item.label}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
//                   <div className="relative flex-1 sm:w-64">
//                     <input
//                       type="number"
//                       placeholder="Enter value"
//                       value={item.amount}
//                       onChange={(e) =>
//                         setEarnings(
//                           earnings.map((ev) =>
//                             ev.id === item.id
//                               ? { ...ev, amount: e.target.value }
//                               : ev,
//                           ),
//                         )
//                       }
//                       className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-black-700 outline-none focus:border-blue-400"
//                     />
//                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-black-400">
//                       {calcBy.includes("Fixed") ? "₹" : "%"}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() =>
//                       removeRow(
//                         item.id,
//                         earnings,
//                         setEarnings,
//                         suggestedEarnings,
//                         setSuggestedEarnings,
//                       )
//                     }
//                     className="p-2.5 !bg-blue-50 !text-blue-600 border border-blue-100 rounded-xl cursor-pointer"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 📉 2. DEDUCTIONS SECTION */}
//         <div className="bg-white border border-slate-200 rounded-2xl mb-4 shadow-sm relative z-[40]">
//           <div className="bg-slate-50/50 px-4 sm:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
//                 <MinusCircle size={18} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-[11px] font-black text-black-900 uppercase tracking-[0.2em]">
//                 Deductions
//               </h3>
//             </div>
//             <button
//               onClick={() => setIsDeductionModalOpen(true)}
//               className="flex items-center justify-center gap-2 !text-blue-600 text-[10px] !bg-transparent font-black border border-blue-600 px-4 py-3 rounded-xl uppercase"
//             >
//               <Plus size={14} /> Add More
//             </button>
//           </div>

//           <div className="p-4 sm:p-8 space-y-8">
//             {deductions.map((item) => (
//               <div
//                 key={item.id}
//                 className="space-y-4 relative border-b border-slate-50 sm:border-0 pb-6 sm:pb-0 last:border-0"
//               >
//                 <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
//                   <div className="w-full md:w-1/2 flex items-center gap-2 text-left">
//                     <p className="text-[11px] font-bold text-black-700 uppercase">
//                       {item.label}
//                     </p>
//                     {item.hasInfo && (
//                       <Info size={12} className="text-black-300" />
//                     )}
//                   </div>

//                   <div className="relative flex-1 md:w-64 md:ml-auto text-left">
//                     {item.label === "Provident Fund (PF)" ? (
//                       <div className="relative">
//                         <div
//                           onClick={() =>
//                             setActiveDropdown(
//                               activeDropdown === item.id ? null : item.id,
//                             )
//                           }
//                           className={`w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === item.id ? "border-blue-600 bg-white" : ""}`}
//                         >
//                           <span className="text-[10px] font-black text-black-600 uppercase">
//                             {pfCalcType === "Fixed"
//                               ? "₹ 1,800 Fixed"
//                               : `${pfVariablePercent}% Variable`}
//                           </span>
//                           <ChevronDown
//                             size={14}
//                             className={`text-black-400 transition-transform ${activeDropdown === item.id ? "rotate-180" : ""}`}
//                           />
//                         </div>

//                         {activeDropdown === item.id && (
//                           <>
//                             <div
//                               className="fixed inset-0 z-[70]"
//                               onClick={() => setActiveDropdown(null)}
//                             />
//                             <div className="absolute top-full right-0 mt-1 w-full min-w-[240px] bg-white border border-slate-200 rounded-xl shadow-xl z-[80] p-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
//                               {/* 1️⃣ Fixed Label - Compact */}
//                               <label
//                                 className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all"
//                                 onClick={() => setPfCalcType("Fixed")}
//                               >
//                                 <input
//                                   type="radio"
//                                   checked={pfCalcType === "Fixed"}
//                                   onChange={() => setPfCalcType("Fixed")}
//                                   className="w-3.5 h-3.5 mr-2 text-blue-600 border-slate-300 focus:ring-0"
//                                 />
//                                 <span
//                                   className={`text-[11px] font-bold ${pfCalcType === "Fixed" ? "text-black-900" : "text-black-400"}`}
//                                 >
//                                   ₹ 1,800 Fixed
//                                 </span>
//                               </label>

//                               {/* 2️⃣ Variable Option - Flex Row & Tight Spacing */}
//                               <label
//                                 className="flex flex-row items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all mt-0.5"
//                                 onClick={() => setPfCalcType("Variable")}
//                               >
//                                 <div className="flex">
//                                   <input
//                                     type="radio"
//                                     checked={pfCalcType === "Variable"}
//                                     onChange={() => setPfCalcType("Variable")}
//                                     className="w-3.5 h-3.5 mr-2 text-blue-600 border-slate-300 focus:ring-0"
//                                   />
//                                   <span className="flex items-center gap-1.5 flex-1">
//                                     <input
//                                       type="text"
//                                       value={pfVariablePercent}
//                                       onChange={(e) =>
//                                         setPfVariablePercent(e.target.value)
//                                       }
//                                       onFocus={() => setPfCalcType("Variable")}
//                                       onClick={(e) => e.stopPropagation()}
//                                       className="w-7 bg-transparent border-b border-slate-200 text-center outline-none text-[11px] font-black text-black-700 focus:border-blue-600"
//                                     />
//                                     <span className="text-[10px] font-black text-black-400 uppercase tracking-tight">
//                                       % Variable
//                                     </span>
//                                   </span>
//                                 </div>
//                               </label>

//                               {/* 3️⃣ Component Checklist - Compact List */}
//                               <div
//                                 className={`mt-1.5 pt-1 border-t border-slate-50 space-y-0.5 ${pfCalcType === "Variable" ? "opacity-100" : "opacity-40 pointer-events-none"}`}
//                               >
//                                 {[
//                                   "Basic + DA",
//                                   "HRA",
//                                   "Medical Allowance",
//                                   "Special Allowance",
//                                   "OT Wages",
//                                   "Bonus Wages",
//                                   "Allowance Wages",
//                                 ].map((comp) => (
//                                   <label
//                                     key={comp}
//                                     className="flex items-center gap-2.5 px-2 py-1 hover:bg-blue-50/50 rounded-md cursor-pointer transition-all"
//                                   >
//                                     <input
//                                       type="checkbox"
//                                       checked={selectedPfComponents.includes(
//                                         comp,
//                                       )}
//                                       disabled={pfCalcType !== "Variable"}
//                                       onChange={() =>
//                                         setSelectedPfComponents((prev) =>
//                                           prev.includes(comp)
//                                             ? prev.filter((c) => c !== comp)
//                                             : [...prev, comp],
//                                         )
//                                       }
//                                       className="w-3 h-3 mr-2 rounded border-slate-300 text-blue-600 focus:ring-0"
//                                     />
//                                     <span
//                                       className={`text-[9px] font-black uppercase tracking-tight ${selectedPfComponents.includes(comp) && pfCalcType === "Variable" ? "text-blue-600" : "text-black-400"}`}
//                                     >
//                                       {comp}
//                                     </span>
//                                   </label>
//                                 ))}
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ) : item.label === "Employee State Insurance (ESI)" ? (
//                       <div className="relative">
//                         <div
//                           onClick={() =>
//                             setActiveDropdown(
//                               activeDropdown === item.id ? null : item.id,
//                             )
//                           }
//                           className={`w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === item.id ? "border-blue-600 ring-4 ring-blue-600/5 bg-white" : "hover:border-slate-300"}`}
//                         >
//                           <span className="text-[10px] font-black text-black-600 uppercase tracking-tighter truncate pr-2">
//                             {selectedEsiItems.length > 0
//                               ? `${selectedEsiItems.length} Selected`
//                               : "Select Components"}
//                           </span>
//                           <ChevronDown
//                             size={14}
//                             className={`text-black-400 shrink-0 transition-transform duration-300 ${activeDropdown === item.id ? "rotate-180" : ""}`}
//                           />
//                         </div>

//                         {activeDropdown === item.id && (
//                           <>
//                             <div
//                               className="fixed inset-0 z-[70]"
//                               onClick={() => setActiveDropdown(null)}
//                             />
//                             <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] p-2 animate-in fade-in slide-in-from-top-1 duration-200 ring-1 ring-slate-200/50 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
//                               {[
//                                 "Basic + DA",
//                                 "HRA",
//                                 "Medical Allowance",
//                                 "Special Allowance",
//                                 "OT Wages",
//                                 "Bonus Wages",
//                                 "Allowance Wages",
//                               ].map((opt) => (
//                                 <label
//                                   key={opt}
//                                   className="flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer group transition-all"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedEsiItems.includes(opt)}
//                                     onChange={() =>
//                                       setSelectedEsiItems((prev) =>
//                                         prev.includes(opt)
//                                           ? prev.filter((i) => i !== opt)
//                                           : [...prev, opt],
//                                       )
//                                     }
//                                     className="w-4 h-4 shrink-0 rounded mr-2 border-slate-300 text-blue-600 accent-blue-600 focus:ring-0"
//                                   />
//                                   <span
//                                     className={`text-[10px] font-black uppercase tracking-widest ${selectedEsiItems.includes(opt) ? "text-blue-600" : "text-black-500"}`}
//                                   >
//                                     {opt}
//                                   </span>
//                                 </label>
//                               ))}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="w-full text-right">
//                         <span className="text-[9px] font-black text-black-300 uppercase italic">
//                           Manual Configuration
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                   {item.label !== "Professional Tax (PT)" && (
//                     <button
//                       onClick={() =>
//                         removeRow(
//                           item.id,
//                           deductions,
//                           setDeductions,
//                           suggestedDeductions,
//                           setSuggestedDeductions,
//                         )
//                       }
//                       className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* EMPLOYER CONTRIBUTION SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
//                 <Building2 size={18} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-[11px] font-black text-black-900 uppercase tracking-[0.2em]">
//                 Employer's Contribution
//               </h3>
//             </div>
//             <button
//               onClick={() => setIsEmployerModalOpen(true)}
//               className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase border px-4 py-3 rounded-xl !border-blue-600 cursor-pointer"
//             >
//               <Plus size={14} strokeWidth={3} /> Add More
//             </button>
//           </div>
//           <div className="p-8 space-y-6">
//             {employerContributions.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex flex-col md:flex-row md:items-center gap-4 group"
//               >
//                 <div className="md:w-1/2 text-left">
//                   <p className="text-[11px] font-bold text-black-700 uppercase">
//                     {item.label}
//                   </p>
//                 </div>
//                 <div className="relative w-full md:w-64 ml-auto">
//                   <input
//                     type="number"
//                     placeholder="Enter value"
//                     value={item.amount}
//                     onChange={(e) =>
//                       setEmployerContributions(
//                         employerContributions.map((ev) =>
//                           ev.id === item.id
//                             ? { ...ev, amount: e.target.value }
//                             : ev,
//                         ),
//                       )
//                     }
//                     className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-black-700 outline-none focus:border-blue-400"
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-black-400">
//                     {calcBy.includes("Fixed") ? "₹" : "%"}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() =>
//                     removeRow(
//                       item.id,
//                       employerContributions,
//                       setEmployerContributions,
//                       suggestedEmployer,
//                       setSuggestedEmployer,
//                     )
//                   }
//                   className="p-2 !text-black-200 hover:!text-blue-600 !bg-transparent border rounded-xl cursor-pointer"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* FIXED FOOTER ACTIONS */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md">
//         <div className="mx-auto flex justify-end gap-4 px-2">
//           <button
//             onClick={() => navigate(-1)}
//             className="px-10 py-3 !bg-white border !border-slate-200 !text-black-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button
//             disabled={isSubmitting}
//             onClick={handleSaveTemplate}
//             className={`px-16 py-3 border rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all cursor-pointer ${isSubmitting ? "bg-slate-100 text-black-400 border-slate-200" : "!bg-white !text-blue-600 border-blue-600 hover:!bg-blue-600 hover:!text-white"}`}
//           >
//             {isSubmitting ? "Saving..." : "Save Template"}
//           </button>
//         </div>
//       </div>

//       {[
//         {
//           open: isModalOpen,
//           setOpen: setIsModalOpen,
//           list: suggestedEarnings,
//           setList: setSuggestedEarnings,
//           title: "Earnings",
//           onSave: () =>
//             handleSaveList(
//               suggestedEarnings,
//               earnings,
//               setEarnings,
//               setIsModalOpen,
//             ),
//         },
//         {
//           open: isDeductionModalOpen,
//           setOpen: setIsDeductionModalOpen,
//           list: suggestedDeductions,
//           setList: setSuggestedDeductions,
//           title: "Deductions",
//           onSave: () =>
//             handleSaveList(
//               suggestedDeductions,
//               deductions,
//               setDeductions,
//               setIsDeductionModalOpen,
//             ),
//         },
//         {
//           open: isEmployerModalOpen,
//           setOpen: setIsEmployerModalOpen,
//           list: suggestedEmployer,
//           setList: setSuggestedEmployer,
//           title: "Employer Contribution",
//           onSave: () =>
//             handleSaveList(
//               suggestedEmployer,
//               employerContributions,
//               setEmployerContributions,
//               setIsEmployerModalOpen,
//             ),
//         },
//       ].map(
//         (modal) =>
//           modal.open && (
//             <div
//               key={modal.title}
//               className="fixed inset-0 z-[200] flex items-center justify-center p-4"
//             >
//               <div
//                 className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
//                 onClick={() => modal.setOpen(false)}
//               />
//               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 text-left">
//                 <div className="p-6 space-y-1">
//                   <h2 className="text-lg font-black text-black-900 uppercase tracking-tighter">
//                     {modal.title} List
//                   </h2>
//                   <p className="text-[10px] font-bold text-black-400 uppercase tracking-widest">
//                     *Select at least one component
//                   </p>
//                 </div>
//                 <div className="px-6 py-4 space-y-6">
//                   <h4 className="text-[11px] font-black text-black-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">
//                     Suggested
//                   </h4>
//                   <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
//                     {modal.list.map((item, index) => (
//                       <label
//                         key={index}
//                         className="flex items-center gap-3 group cursor-pointer"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={item.selected}
//                           onChange={() => {
//                             const updated = [...modal.list];
//                             updated[index].selected = !updated[index].selected;
//                             modal.setList(updated);
//                           }}
//                           className="w-4 h-4 rounded mr-3 border-slate-200 text-blue-600 focus:ring-0"
//                         />
//                         <span className="text-[11px] font-bold text-black-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
//                           {item.label}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                   <div className="pt-2">
//                     <h4 className="text-[11px] font-black text-black-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">
//                       Custom List
//                     </h4>
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         placeholder="Add custom item"
//                         className="flex-1 !bg-slate-50 border !border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:!border-blue-400"
//                         value={newCustomName}
//                         onChange={(e) => setNewCustomName(e.target.value)}
//                       />
//                       <button
//                         onClick={() => {
//                           if (newCustomName) {
//                             modal.setList([
//                               ...modal.list,
//                               { label: newCustomName, selected: true },
//                             ]);
//                             setNewCustomName("");
//                           }
//                         }}
//                         className="px-4 py-2.5 !bg-blue-50 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer"
//                       >
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
//                   <button
//                     onClick={() => modal.setOpen(false)}
//                     className="flex-1 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={modal.onSave}
//                     className="flex-1 py-3 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ),
//       )}
//     </div>
//   );
// };

// export default SalaryStructureTemplate;
//***************************************************working code phase 1 with out api 24/03/26************************************************** */
// import React, { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   ChevronDown,
//   Plus,
//   Trash2,
//   HelpCircle,
//   Wallet,
//   Info,
//   ExternalLink,
//   Settings2,
//   X,
//   ChevronUp,
//   ShieldCheck,
//   Cloud,
//   Coins,
//   Receipt,
//   Building2,
//   MinusCircle,
//   MoreVertical,
// } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";

// const SalaryStructureTemplate = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editData = location.state?.template;

//   // 1. Core State
//   const [templateName, setTemplateName] = useState("Default");
//   const [isDefault, setIsDefault] = useState(true);
//   const [staffType, setStaffType] = useState("Monthly Regular");
//   const [calcBy, setCalcBy] = useState("₹ (Fixed Amount)");
//   const [newCustomName, setNewCustomName] = useState("");
//   const [activeDropdown, setActiveDropdown] = useState(null); // Tracks which deduction dropdown is open
//   const [selectedEsiItems, setSelectedEsiItems] = useState([
//     "Basic + DA",
//     "HRA",
//   ]); // Initial default values

//   // 2. Data Lists State
//   const [earnings, setEarnings] = useState([
//     { id: 1, label: "HRA", amount: "" },
//     { id: 2, label: "Medical Allowance", amount: "" },
//     { id: 3, label: "Special Allowance", amount: "" },
//   ]);
//   const [deductions, setDeductions] = useState([
//     {
//       id: 1,
//       label: "Provident Fund (PF)",
//       type: "Variable [12%]",
//       hasInfo: true,
//     },
//     { id: 2, label: "Employee State Insurance (ESI)", type: "0 Selected" },
//     { id: 3, label: "Professional Tax (PT)" },
//   ]);
//   const [employerContributions, setEmployerContributions] = useState([
//     { id: 1, label: "Provident Fund (PF)", amount: "" },
//     { id: 2, label: "Employee State Insurance (ESI)", amount: "" },
//   ]);

//   // 3. Modal States
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
//   const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

//   // 4. Suggested Options Logic
//   const [suggestedEarnings, setSuggestedEarnings] = useState([
//     { label: "Basic + DA", selected: false },
//     { label: "HRA", selected: true },
//     { label: "Medical Allowance", selected: true },
//     { label: "Special Allowance", selected: true },
//     { label: "Bonus", selected: false },
//   ]);
//   const [suggestedDeductions, setSuggestedDeductions] = useState([
//     { label: "Provident Fund (PF)", selected: true },
//     { label: "Employee State Insurance (ESI)", selected: true },
//     { label: "Professional Tax (PT)", selected: true },
//     { label: "Income Tax (TDS)", selected: false },
//   ]);
//   const [suggestedEmployer, setSuggestedEmployer] = useState([
//     { label: "Provident Fund (PF)", selected: true },
//     { label: "Employee State Insurance (ESI)", selected: true },
//     { label: "Health Insurance", selected: false },
//   ]);

//   // Initialize Edit Data
//   useEffect(() => {
//     if (editData) {
//       setTemplateName(editData.name);
//       setIsDefault(editData.isDefault);
//     }
//   }, [editData]);

//   // Logic Helpers
//   const handleSaveList = (suggested, currentList, setList, setModal) => {
//     const selectedList = suggested
//       .filter((item) => item.selected)
//       .map((item, index) => {
//         const existing = currentList.find((e) => e.label === item.label);
//         return (
//           existing || {
//             id: Date.now() + index,
//             label: item.label,
//             amount: "",
//             type: "0 Selected",
//           }
//         );
//       });
//     setList(selectedList);
//     setModal(false);
//   };

//   const removeRow = (id, list, setList, suggested, setSuggested) => {
//     const itemToRemove = list.find((e) => e.id === id);
//     setList(list.filter((item) => item.id !== id));
//     if (itemToRemove)
//       setSuggested(
//         suggested.map((s) =>
//           s.label === itemToRemove.label ? { ...s, selected: false } : s,
//         ),
//       );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-22 text-left relative overflow-x-hidden">
//       {/* 🚀 FIXED HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-[50] shadow-sm">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex !bg-transparent items-center gap-2 text-black-400 hover:text-blue-600 border-0 bg-transparent cursor-pointer group"
//         >
//           <ArrowLeft
//             size={18}
//             className="group-hover:-translate-x-1 text-black-300 transition-transform"
//           />
//           <span className="text-[11px] font-black uppercase !text-black-400 tracking-widest leading-none">
//             Back to Templates
//           </span>
//         </button>
//       </div>

//       <div className=" mx-auto md:px-6 px-2 mt-4 space-y-6">
//         {/* 🏷️ TOP INFO CARD */}
//         <div className="bg-white border border-slate-200 rounded-xl p-8 mb-4 shadow-sm space-y-10">
//           <div className="flex flex-col md:flex-row md:items-center mb-4 gap-8">
//             <div className="space-y-2 flex-1 max-w-md">
//               <label className="text-[9px] font-black text-black-400 uppercase tracking-[0.2em] ml-1">
//                 Template Name
//               </label>
//               <input
//                 type="text"
//                 value={templateName}
//                 onChange={(e) => setTemplateName(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black-700 outline-none focus:border-blue-400"
//               />
//             </div>
//             <div className="flex items-center gap-3 pt-6">
//               <input
//                 type="checkbox"
//                 checked={isDefault}
//                 onChange={(e) => setIsDefault(e.target.checked)}
//                 className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
//               />
//               <span className="text-[10px] font-bold text-black-500 uppercase tracking-widest">
//                 Set to Default
//               </span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-4">
//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-black-400 uppercase tracking-[0.2em] ml-1">
//                 Staff Type
//               </label>
//               <div className="relative group">
//                 <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black-700 appearance-none outline-none focus:border-blue-400 cursor-pointer">
//                   <option>{staffType}</option>
//                 </select>
//                 <ChevronDown
//                   size={14}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-black-300 pointer-events-none"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[9px] font-black text-black-400 uppercase tracking-[0.2em] ml-1">
//                 Salary Calculation By
//               </label>
//               <div className="relative group">
//                 <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-bold text-black-700 appearance-none outline-none focus:border-blue-400 cursor-pointer">
//                   <option>{calcBy}</option>
//                 </select>
//                 <ChevronDown
//                   size={14}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-black-300 pointer-events-none"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 💰 1. EARNINGS SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl sm:rounded-xl overflow-hidden mb-4 shadow-sm">
//           {/* 📱 MOBILE FIX: Adjusted padding for smaller screens (px-4 sm:px-8) */}
//           <div className="bg-slate-50/50 px-4 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-2">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                 <Coins size={18} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-[11px] font-black text-black-900 uppercase tracking-[0.2em]">
//                 Earnings
//               </h3>
//             </div>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center justify-center gap-2 !text-blue-600 text-[10px] font-black !bg-white sm:!bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-600 shrink-0"
//             >
//               <Plus size={14} strokeWidth={3} />{" "}
//               <span className="hidden sm:inline">Add More</span>
//               <span className="sm:hidden">Add</span>
//             </button>
//           </div>

//           {/* 📱 MOBILE FIX: Reduced padding on mobile */}
//           <div className="p-4 sm:p-8 space-y-6 sm:space-y-6">
//             {earnings.map((item) => (
//               <div
//                 key={item.id}
//                 /* 📱 MOBILE FIX: Flex-col on mobile, flex-row on desktop. Added border-b on mobile to separate stacked items. */
//                 className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:gap-4 group border-b border-slate-50 sm:border-0 pb-4 sm:pb-0 last:border-0 last:pb-0"
//               >
//                 <div className="w-full sm:w-1/2 text-left">
//                   <p className="text-[11px] font-bold text-black-700 uppercase tracking-tight">
//                     {item.label}
//                   </p>
//                 </div>

//                 {/* 📱 MOBILE FIX: Placed Input and Trash icon in their own flex row so they sit side-by-side on mobile */}
//                 <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto sm:ml-auto">
//                   {/* Input Wrapper - takes flex-1 on mobile to fill space next to trash */}
//                   <div className="relative flex-1 sm:flex-none sm:w-64 text-left">
//                     <input
//                       type="text"
//                       placeholder="Enter Amount"
//                       className="w-full bg-white sm:bg-slate-50 border border-slate-200 sm:border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-black-700 outline-none focus:border-blue-400 shadow-sm sm:shadow-none transition-all"
//                     />
//                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-black-400 font-serif">
//                       ₹
//                     </span>
//                   </div>

//                   {/* Trash Button */}
//                   {/* 📱 MOBILE FIX: Made permanently visible on mobile (no hover state on touch screens), with a red tint for a clear touch target */}
//                   <button
//                     onClick={() =>
//                       removeRow(
//                         item.id,
//                         earnings,
//                         setEarnings,
//                         suggestedEarnings,
//                         setSuggestedEarnings,
//                       )
//                     }
//                     className="p-2.5 sm:p-2 !bg-blue-50 sm:!bg-transparent !text-blue-600 sm:!text-blue-600 hover:!text-blue-600 border border-blue-100 sm:!border-transparent hover:!border-blue-100 rounded-xl cursor-pointer transition-all shrink-0"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 📉 2. DEDUCTIONS SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl sm:rounded-xl overflow-hidden mb-4 shadow-sm">
//           <div className="bg-slate-50/50 px-4 sm:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
//                 <MinusCircle size={18} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-[11px] font-black text-black-900 uppercase tracking-[0.2em]">
//                 Deductions
//               </h3>
//             </div>
//             <button
//               onClick={() => setIsDeductionModalOpen(true)}
//               className="flex items-center justify-center gap-2 !text-blue-600 text-[10px] font-black !bg-white sm:!bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-600 w-full sm:w-auto"
//             >
//               <Plus size={14} strokeWidth={3} /> Add More
//             </button>
//           </div>

//           <div className="p-4 sm:p-8 space-y-8 sm:space-y-6">
//             {deductions.map((item) => (
//               <div
//                 key={item.id}
//                 className="space-y-4 relative border-b border-slate-50 sm:border-0 pb-6 sm:pb-0 last:border-0 last:pb-0"
//               >
//                 {/* 📱 MOBILE FIX: Used flex-wrap and controlled widths for the main row */}
//                 <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
//                   {/* 1. Label Section */}
//                   <div className="w-full md:w-1/2 flex items-center gap-2 text-left mb-2 md:mb-0">
//                     {item.isExpandable && (
//                       <ChevronUp size={14} className="text-blue-600 shrink-0" />
//                     )}
//                     <p className="text-[11px] font-bold text-black-700 uppercase tracking-tight">
//                       {item.label}
//                     </p>
//                     {item.hasInfo && (
//                       <Info size={12} className="text-black-300 shrink-0" />
//                     )}
//                   </div>

//                   {/* 2. Input/Dropdown Section */}
//                   {/* 📱 MOBILE FIX: Takes full width minus trash icon on mobile, auto width on desktop */}
//                   <div className="relative flex-1 md:flex-none md:w-64 md:ml-auto text-left">
//                     {
//                     item.label === "Employee State Insurance (ESI)" ?
//                     (
//                       <div className="relative">
//                         <div
//                           onClick={() =>
//                             setActiveDropdown(
//                               activeDropdown === item.id ? null : item.id,
//                             )
//                           }
//                           className={`w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === item.id ? "border-blue-600 ring-4 ring-blue-600/5 bg-white" : "hover:border-slate-300"}`}
//                         >
//                           <span className="text-[10px] font-black text-black-600 uppercase tracking-tighter truncate pr-2">
//                             {selectedEsiItems.length > 0
//                               ? `${selectedEsiItems.length} Selected`
//                               : "Select Components"}
//                           </span>
//                           <ChevronDown
//                             size={14}
//                             className={`text-black-400 shrink-0 transition-transform duration-300 ${activeDropdown === item.id ? "rotate-180" : ""}`}
//                           />
//                         </div>

//                         {activeDropdown === item.id && (
//                           <>
//                             <div
//                               className="fixed inset-0 z-[70]"
//                               onClick={() => setActiveDropdown(null)}
//                             />
//                             <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[80] p-2 animate-in fade-in slide-in-from-top-1 duration-200 ring-1 ring-slate-200/50 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
//                               {[
//                                 "Basic + DA",
//                                 "HRA",
//                                 "Medical Allowance",
//                                 "Special Allowance",
//                                 "OT Wages",
//                                 "Bonus Wages",
//                                 "Allowance Wages",
//                               ].map((opt) => (
//                                 <label
//                                   key={opt}
//                                   className="flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer group transition-all"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedEsiItems.includes(opt)}
//                                     onChange={() =>
//                                       setSelectedEsiItems((prev) =>
//                                         prev.includes(opt)
//                                           ? prev.filter((i) => i !== opt)
//                                           : [...prev, opt],
//                                       )
//                                     }
//                                     className="w-4 h-4 shrink-0 rounded mr-2 border-slate-300 text-blue-600 accent-blue-600 focus:ring-0"
//                                   />
//                                   <span
//                                     className={`text-[10px] font-black uppercase tracking-widest ${selectedEsiItems.includes(opt) ? "text-blue-600" : "text-black-500"}`}
//                                   >
//                                     {opt}
//                                   </span>
//                                 </label>
//                               ))}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ) : item.label === "Professional Tax (PT)" ? (
//                       /* 🔥 PT Header is blank here because calculation status is shown in the expanded section below */
//                       <div className="w-full text-left md:text-right h-auto md:h-10 flex items-center md:justify-end px-2 py-2 md:py-0">
//                         <span className="text-[9px] font-black text-black-300 uppercase tracking-widest italic">
//                           Manual Configuration
//                         </span>
//                       </div>
//                     ) : (
//                       <div className="relative group">
//                         <select className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-[11px] font-bold text-black-600 appearance-none outline-none focus:border-blue-400 cursor-pointer transition-all">
//                           <option>{item.type}</option>
//                         </select>
//                         <ChevronDown
//                           size={14}
//                           className="absolute right-4 top-1/2 -translate-y-1/2 text-black-300 pointer-events-none"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   {/* 3. Global Trash Icon - 🔥 HIDDEN IF PT */}
//                   {item.label !== "Professional Tax (PT)" && (
//                     <div className="shrink-0 md:ml-2">
//                       <button
//                         onClick={() =>
//                           removeRow(
//                             item.id,
//                             deductions,
//                             setDeductions,
//                             suggestedDeductions,
//                             setSuggestedDeductions,
//                           )
//                         }
//                         className="p-2.5 sm:p-2 bg-blue-50 sm:!bg-transparent !text-blue-600 sm:!text-blue-600 hover:!text-rose-500 border border-rose-100 sm:border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* 4. Professional Tax Detailed Slab Section */}
//                 {item.label === "Professional Tax (PT)" && (
//                   <div className="space-y-4 pt-2">
//                     {/* 📱 MOBILE FIX: Stacked the top header elements for PT on mobile */}
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between ml-1 sm:ml-8 gap-3 sm:gap-0">
//                       <button className="text-[10px] font-medium !text-blue-600 hover:underline border-0 p-0 !bg-transparent cursor-pointer flex items-center gap-1.5 w-fit">
//                         Read Professional Tax Policy{" "}
//                         <span className="text-black-400">Across States</span>
//                       </button>

//                       <div className="bg-slate-50/80 px-3 py-2 sm:py-1 rounded-lg sm:rounded-full border border-slate-100 flex items-center gap-1.5 w-fit sm:w-auto">
//                         <span className="text-[10px] font-bold text-black-400 uppercase tracking-tighter">
//                           Applied |
//                         </span>
//                         <span className="text-[11px] font-black text-black-800">
//                           ₹ 0
//                         </span>
//                         <span className="text-[9px] font-bold text-black-400 uppercase tracking-tight hidden sm:inline">
//                           (As Per Current Month's Calculation)
//                         </span>
//                       </div>
//                     </div>

//                     {/* 📱 MOBILE FIX: Grid layout on mobile for inputs to prevent overflow, row on desktop */}
//                     <div className="flex flex-col md:flex-row md:items-center justify-end gap-3 sm:gap-4 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-none">
//                       <p className="text-[10px] sm:text-[11px] font-medium text-black-500 italic mb-1 sm:mb-0">
//                         If monthly payable salary is
//                       </p>

//                       <div className="grid grid-cols-[1fr_auto_1fr] sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
//                         {/* Min Input */}
//                         <div className="relative w-full sm:w-28">
//                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-black-400">
//                             ₹
//                           </span>
//                           <input
//                             type="text"
//                             placeholder="0"
//                             className="w-full pl-7 pr-3 py-2.5 bg-white sm:bg-slate-100 border border-slate-200 sm:border-0 rounded-lg text-[11px] font-bold text-black-600 outline-none focus:border-blue-400 sm:focus:border-0"
//                           />
//                         </div>

//                         <span className="text-black-300 text-xs sm:hidden">
//                           to
//                         </span>

//                         {/* Max Input */}
//                         <div className="relative w-full sm:w-28">
//                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-black-400">
//                             ₹
//                           </span>
//                           <input
//                             type="text"
//                             placeholder="max"
//                             className="w-full pl-7 pr-3 py-2.5 bg-white sm:bg-slate-100 border border-slate-200 sm:border-0 rounded-lg text-[11px] font-bold text-black-600 outline-none focus:border-blue-400 sm:focus:border-0"
//                           />
//                         </div>
//                       </div>

//                       {/* Tax Amount Input & Menu */}
//                       <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 sm:ml-4 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0 w-full sm:w-auto">
//                         <p className="text-[10px] font-black text-black-400 uppercase sm:hidden w-12">
//                           Tax:
//                         </p>
//                         <div className="relative flex-1 sm:flex-none sm:w-28">
//                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-black-400">
//                             ₹
//                           </span>
//                           <input
//                             type="text"
//                             defaultValue="0"
//                             className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-black-700 outline-none focus:border-blue-400 shadow-sm"
//                           />
//                         </div>
//                         <button className="p-2 !text-black-400 hover:!text-black-900 !bg-white sm:!bg-transparent border border-slate-200 sm:border-0 rounded-lg sm:rounded-none shrink-0 transition-colors">
//                           <MoreVertical size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 🤝 3. EMPLOYER SECTION */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
//                 <Building2 size={18} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-[11px] font-black text-black-900 uppercase tracking-[0.2em]">
//                 Employer's Contribution
//               </h3>
//             </div>
//             <button
//               onClick={() => setIsEmployerModalOpen(true)}
//               className="flex items-center gap-2 !text-blue-600 text-[10px] font-black !bg-transparent uppercase shadow-sm cursor-pointer border px-4 py-3 rounded-xl !border-blue-600"
//             >
//               <Plus size={14} strokeWidth={3} /> Add More
//             </button>
//           </div>
//           <div className="p-8 space-y-6">
//             {employerContributions.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex flex-col md:flex-row md:items-center gap-4 group"
//               >
//                 <div className="md:w-1/2 text-left">
//                   <p className="text-[11px] font-bold text-black-700 uppercase tracking-tight">
//                     {item.label}
//                   </p>
//                 </div>
//                 <div className="relative w-full md:w-64 ml-auto text-left">
//                   <input
//                     type="text"
//                     placeholder="Enter Amount"
//                     className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-4 pr-10 py-2.5 text-[11px] font-bold text-black-700 outline-none focus:border-blue-400"
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-black-400 font-serif">
//                     ₹
//                   </span>
//                 </div>
//                 <button
//                   onClick={() =>
//                     removeRow(
//                       item.id,
//                       employerContributions,
//                       setEmployerContributions,
//                       suggestedEmployer,
//                       setSuggestedEmployer,
//                     )
//                   }
//                   className="p-2 !text-black-200 hover:!text-blue-600 !bg-transparent border rounded-xl cursor-pointer"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* FIXED FOOTER ACTIONS */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] backdrop-blur-md bg-white/95">
//         <div className="mx-auto flex justify-end gap-4 px-2">
//           <button
//             onClick={() => navigate(-1)}
//             className="px-10 py-3 !bg-white border !border-slate-200 !text-black-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button className="px-16 py-3 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:!bg-blue-600 hover:!text-white transition-all cursor-pointer">
//             Save Template
//           </button>
//         </div>
//       </div>

//       {/* ✅ UNIFIED MODAL COMPONENT */}
//       {[
//         {
//           open: isModalOpen,
//           setOpen: setIsModalOpen,
//           list: suggestedEarnings,
//           setList: setSuggestedEarnings,
//           title: "Earnings",
//           onSave: () =>
//             handleSaveList(
//               suggestedEarnings,
//               earnings,
//               setEarnings,
//               setIsModalOpen,
//             ),
//         },
//         {
//           open: isDeductionModalOpen,
//           setOpen: setIsDeductionModalOpen,
//           list: suggestedDeductions,
//           setList: setSuggestedDeductions,
//           title: "Deductions",
//           onSave: () =>
//             handleSaveList(
//               suggestedDeductions,
//               deductions,
//               setDeductions,
//               setIsDeductionModalOpen,
//             ),
//         },
//         {
//           open: isEmployerModalOpen,
//           setOpen: setIsEmployerModalOpen,
//           list: suggestedEmployer,
//           setList: setSuggestedEmployer,
//           title: "Employer Contribution",
//           onSave: () =>
//             handleSaveList(
//               suggestedEmployer,
//               employerContributions,
//               setEmployerContributions,
//               setIsEmployerModalOpen,
//             ),
//         },
//       ].map(
//         (modal) =>
//           modal.open && (
//             <div
//               key={modal.title}
//               className="fixed inset-0 z-[200] flex items-center justify-center p-4"
//             >
//               <div
//                 className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
//                 onClick={() => modal.setOpen(false)}
//               />
//               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 text-left">
//                 <div className="p-6 space-y-1">
//                   <h2 className="text-lg font-black text-black-900 uppercase tracking-tighter">
//                     {modal.title} List
//                   </h2>
//                   <p className="text-[10px] font-bold text-black-400 uppercase tracking-widest">
//                     *Select at least one component
//                   </p>
//                 </div>
//                 <div className="px-6 py-4 space-y-6">
//                   <h4 className="text-[11px] font-black text-black-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">
//                     Suggested
//                   </h4>
//                   <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
//                     {modal.list.map((item, index) => (
//                       <label
//                         key={index}
//                         className="flex items-center gap-3 group cursor-pointer"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={item.selected}
//                           onChange={() => {
//                             const updated = [...modal.list];
//                             updated[index].selected = !updated[index].selected;
//                             modal.setList(updated);
//                           }}
//                           className="w-4 h-4 rounded mr-3 border-slate-200 text-blue-600 focus:ring-0"
//                         />
//                         <span className="text-[11px] font-bold text-black-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
//                           {item.label}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                   <div className="pt-2">
//                     <h4 className="text-[11px] font-black text-black-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-4">
//                       Custom List
//                     </h4>
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         placeholder="Add custom item"
//                         className="flex-1 !bg-slate-50 border !border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold outline-none focus:!border-blue-400"
//                         value={newCustomName}
//                         onChange={(e) => setNewCustomName(e.target.value)}
//                       />
//                       <button
//                         onClick={() => {
//                           if (newCustomName) {
//                             modal.setList([
//                               ...modal.list,
//                               { label: newCustomName, selected: true },
//                             ]);
//                             setNewCustomName("");
//                           }
//                         }}
//                         className="px-4 py-2.5 !bg-blue-50 !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-blue-600 hover:!text-white transition-all border-0 cursor-pointer"
//                       >
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6 border-t border-slate-50 flex gap-4 bg-slate-50/30">
//                   <button
//                     onClick={() => modal.setOpen(false)}
//                     className="flex-1 py-3 !bg-white border !border-blue-600 !text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={modal.onSave}
//                     className="flex-1 py-3 !bg-white !text-blue-600 border border-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ),
//       )}
//     </div>
//   );
// };

// export default SalaryStructureTemplate;
