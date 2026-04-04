import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Clock,
  Users,
  ShieldCheck,
  ChevronRight,
  X,
  Search,
  Filter,
  User,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShiftPage = () => {
  const navigate = useNavigate();

  // 1. Logic: Component States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null); // id of the active shift
  const [shiftData, setShiftData] = useState([]); // ✅ API Data State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch(
          "https://uathr.goelectronix.co.in/shifts/",
        );
        if (response.ok) {
          const data = await response.json();
          setShiftData(data);
        }
      } catch (error) {
        console.error("Shift API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  const shifts = [
    { id: 1, title: "10 to 7", time: "10:00 AM - 7:00 PM", count: 29 },
    { id: 2, title: "11 to 8", time: "11:00 AM - 8:00 PM", count: 3 },
    { id: 3, title: "9:30 to 6:30", time: "9:30 AM - 6:30 PM", count: 2 },
    { id: 4, title: "IT Staff", time: "9:00 AM - 6:00 PM", count: 4 },
  ];

  // 🕒 TIME FORMATTER (Converts 18:00:00 to 6:00 PM)
  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleStaffClick = (shift) => {
    setSelectedShift(shift);
    setIsDrawerOpen(true);
  };

  const ShiftSkeleton = () => (
    <div className="bg-white border border-slate-100 rounded-xl p-4 animate-pulse shadow-sm mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-1 h-10 bg-slate-100 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-100 rounded" />
            <div className="h-6 w-48 bg-slate-50 border border-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-32 bg-slate-50 rounded-xl border border-slate-100" />
          <div className="h-8 w-8 bg-slate-50 rounded-lg" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans pb-10 relative overflow-x-hidden">
      {/* 🚀 STICKY HEADER */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 !bg-transparent hover:!bg-slate-50 rounded-xl !text-slate-600 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-[10px] font-black !text-slate-900 !capitalize tracking-widest">
            Settings / Shifts
          </span>
        </div>
      </div>

      <div className="mx-auto px-1 md:px-4 mt-4">
        {/* 📑 PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 !bg-white !text-blue-600 border !border-blue-600 rounded-xl shadow-sm">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="md:text-xl text-lg font-black !text-slate-800 tracking-tighter !capitalize">
                  Shift Templates
                </h1>
                <p className="md:text-[10px] text-[8px] font-bold !text-slate-600 capitalize tracking-[0.15em]">
                  Add relevant shift templates for your business.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/createnewtemplate")}
            className="group flex items-center justify-center gap-2 px-5 py-2.5 border !border-blue-600 !bg-white !text-blue-600 rounded-xl shadow-sm hover:!bg-white hover:text-white transition-all active:scale-95"
          >
            <Plus
              size={16}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform"
            />
            <span className="text-[11px] font-black capitalize tracking-widest">
              New Template
            </span>
          </button>
        </div>

        {/* 📂 LIST OF SHIFTS */}
        <div className="grid grid-cols-1 gap-2 px-2">
          {loading
            ? // <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              //   <Loader2 className="animate-spin text-blue-600" size={32} />
              //   <p className="text-[10px] font-black uppercase tracking-widest">Accessing Shift Registry...</p>
              // </div>
              // ✅ SHOW SKELETONS WHILE LOADING
              Array.from({ length: 4 }).map((_, i) => <ShiftSkeleton key={i} />)
            : shiftData.map((shift) => (
                <div
                  key={shift.id}
                  className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group relative ${
                    activeMenu === shift.id ? "z-40" : "z-10"
                  }`}
                >
                  {/* Security Watermark */}
                  <div className="absolute -bottom-4 -right-4 text-slate-100 opacity-[0.4] group-hover:text-blue-50 transition-colors -rotate-12 pointer-events-none">
                    <ShieldCheck size={100} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-4 sm:gap-0">
                    {/* Left Side: Shift Title & Time */}
                    <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                      <div
                        className={`w-1 h-10 shrink-0 rounded-full transition-colors ${activeMenu === shift.id ? "bg-blue-600" : "bg-slate-100 group-hover:bg-blue-600"}`}
                      />
                      <div className="space-y-1 w-full flex-1">
                        <div className="flex items-center gap-0 w-fit gap-3 justify-between">
                          <h3 className="text-sm font-black !text-slate-800 capitalize tracking-tight group-hover:text-blue-600">
                            {shift.name} {/* ✅ Maps to API 'name' */}
                          </h3>

                          {/* ✅ SHIFT TYPE BADGE */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.15em] border shadow-sm ${
                              shift.shift_type === "fixed"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}
                          >
                            {shift.shift_type}
                          </span>

                          {/* Mobile Menu Icon */}
                          <div className="relative sm:hidden block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(
                                  activeMenu === shift.id ? null : shift.id,
                                );
                              }}
                              className={`p-2 rounded-xl transition-all !bg-transparent border-0 outline-none ${activeMenu === shift.id ? "!text-blue-600 !bg-blue-50" : "!text-slate-300"}`}
                            >
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Time Stripe */}
                        <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 w-max">
                          <Clock size={12} className="text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500 capitalize tracking-tight">
                            Time:{" "}
                            <span className="text-slate-800">
                              {formatTime(shift.start_time)} -{" "}
                              {formatTime(shift.end_time)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Assigned Staff & Desktop Menu */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pl-5 sm:pl-0 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                      {/* Staff Count Button */}
                      <div
                        onClick={() => handleStaffClick(shift)}
                        className="bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100 flex items-center justify-between sm:justify-start gap-4 cursor-pointer hover:bg-blue-100 transition-colors w-full sm:w-auto"
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] font-black text-blue-400 capitalize tracking-widest leading-none mb-1">
                            Assigned Staff
                          </span>
                          <span className="text-[10px] font-bold text-blue-600 underline underline-offset-4 tracking-tighter">
                            {/* Note: API doesn't provide count, using 0 as placeholder */}
                            0 Staffs
                          </span>
                        </div>
                        <ChevronRight
                          size={12}
                          className="text-blue-400 group-hover:translate-x-1 transition-transform"
                        />
                      </div>

                      {/* Desktop Menu */}
                      <div className="relative hidden sm:block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(
                              activeMenu === shift.id ? null : shift.id,
                            );
                          }}
                          className={`p-2 rounded-xl transition-all !bg-transparent border-0 outline-none ${activeMenu === shift.id ? "!text-blue-600 !bg-blue-50" : "!text-slate-300 hover:!text-slate-900"}`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenu === shift.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40 cursor-default bg-transparent"
                              onClick={() => setActiveMenu(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-950/5 text-left">
                              <div className="p-2 space-y-0.5">
                                <MenuOption
                                  icon={<Clock size={14} />}
                                  label="Edit Shift"
                                  onClick={() => {}}
                                />
                                <MenuOption
                                  icon={<Users size={14} />}
                                  label="Assign Staff"
                                  onClick={() => handleStaffClick(shift)}
                                />
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                <MenuOption
                                  icon={<X size={14} />}
                                  label="Delete Shift"
                                  variant="danger"
                                  onClick={() => {}}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* 🛡️ MODULAR COMPONENTS */}
      <StaffListDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------
// 🚪 STAFF DRAWER COMPONENT
// ---------------------------------------------------------
const StaffListDrawer = ({ isOpen, onClose }) => {
  const [subTab, setSubTab] = useState("unselected");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const unselectedStaff = [
    {
      id: "#MUMGE84",
      name: "indresh bhai",
      location: "Goelectronix Technologies Private Limited",
    },
    {
      id: "#MUMGE82",
      name: "Nilesh Khanderao Kuwar",
      location: "Goelectronix Technologies Private Limited",
    },
  ];

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-80 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full relative">
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <h2 className="text-xl font-black text-slate-900 capitalize tracking-tighter">
              Staff List
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
              {["selected", "unselected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  className={`relative px-6 py-2 rounded-lg text-[10px] font-black capitalize !bg-transparent tracking-widest transition-all duration-300 ${subTab === tab ? "!bg-white shadow-md !text-blue-600 ring-1 ring-slate-200/50" : "!text-slate-400 hover:text-slate-600"}`}
                >
                  {tab} Staff
                  {subTab === tab && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 !bg-white rounded-full border-2 !border-white animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={14}
              />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-400"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center !bg-transparent gap-2 px-4 py-2 border !border-blue-600 rounded-xl !text-blue-600 text-[10px] font-black capitalize tracking-widest hover:!bg-slate-50 transition-colors"
            >
              <Filter size={14} /> Filter
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {unselectedStaff.map((staff, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-blue-600"
                      />
                    </td>
                    <td className="py-3 text-[11px] font-bold text-slate-700">
                      {staff.name}
                    </td>
                    <td className="py-3 text-[10px] font-black text-blue-600 capitalize">
                      {staff.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <button
              className={`w-full py-3 rounded-xl text-[11px] font-black capitalize tracking-widest transition-all shadow-sm ${subTab === "selected" ? "!bg-blue-50 !text-blue-600 border !border-blue-600 hover:!bg-white" : "!bg-white !text-blue-600 border !border-blue-600 hover:!bg-blue-50"}`}
            >
              {subTab === "selected" ? "Remove Staff" : "Move to Selected"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 ACCORDION FILTER MODAL (Global Centered) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setIsFilterOpen(false)}
          />

          <div className="relative bg-white w-full max-w-[360px] rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-300">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-[13px] font-black text-slate-900 capitalize tracking-tighter">
                  Filter By
                </h3>
                <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-0.5" />
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 !bg-slate-50 hover:!bg-slate-50 hover:!text-blue-600 rounded-lg !text-slate-400 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-left">
              {[
                {
                  id: "salary",
                  label: "Salary Type",
                  options: ["Monthly", "Daily", "Work Basis", "Hourly"],
                },
                {
                  id: "dept",
                  label: "Department",
                  options: ["Finance", "Hr & Admin", "IT", "Sales"],
                },
              ].map((section) => (
                <div key={section.id} className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 capitalize tracking-[0.15em] ml-0.5">
                    {section.label}
                  </label>
                  <div
                    className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white ${openAccordion === section.id ? "ring-1 ring-blue-600 border-blue-600 shadow-md" : "border-slate-100 ring-1 ring-slate-200/50"}`}
                  >
                    <div
                      onClick={() =>
                        setOpenAccordion(
                          openAccordion === section.id ? null : section.id,
                        )
                      }
                      className={`px-3 py-2 flex justify-between items-center cursor-pointer transition-colors ${openAccordion === section.id ? "bg-blue-50/30" : "bg-slate-50/50 hover:bg-slate-50"}`}
                    >
                      <span
                        className={`text-[10px] font-bold ${openAccordion === section.id ? "text-blue-600" : "text-slate-500"}`}
                      >
                        Select Options
                      </span>
                      <ChevronUp
                        size={14}
                        className={`transition-transform duration-300 ${openAccordion === section.id ? "text-blue-600" : "text-slate-400 rotate-180"}`}
                      />
                    </div>

                    {openAccordion === section.id && (
                      <div className="p-1 space-y-0.5 animate-in slide-in-from-top-1">
                        {/* ✅ FIXED SELECT ALL LOGIC */}
                        <label className="flex items-center gap-x-5 px-3 py-2 bg-blue-50/40 rounded-lg cursor-pointer border border-blue-100/50 mb-1 group">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              // Targets only checkboxes belonging to THIS specific section
                              const checkboxes = document.querySelectorAll(
                                `.${section.id}-checkbox-item`,
                              );
                              checkboxes.forEach(
                                (cb) => (cb.checked = e.target.checked),
                              );
                            }}
                            className="w-4 h-4 mr-2 rounded border-blue-300 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span className="text-[10px] font-black text-blue-700 capitalize tracking-widest">
                            Select All
                          </span>
                        </label>

                        {/* Individual Options */}
                        {section.options.map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-x-5 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all"
                          >
                            <input
                              type="checkbox"
                              className={`${section.id}-checkbox-item w-4 h-4 mr-2 rounded border-slate-300 text-blue-600 focus:ring-0 transition-all cursor-pointer`}
                            />
                            <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 tracking-wide">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-5 py-2 !bg-white border border-blue-600 rounded-lg text-[10px] font-black capitalize tracking-widest !text-blue-600 hover:shadow-md transition-all active:scale-95"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 🛡️ REUSABLE META COMPONENT
const MetaInfo = ({ icon, label, value, isLink }) => (
  <div className="flex items-center gap-2.5">
    <div
      className={`p-1.5 rounded-lg ${isLink ? "bg-blue-100 text-blue-600" : "bg-white text-slate-400 shadow-sm border border-slate-100"}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 capitalize tracking-[0.15em] leading-none mb-1">
        {label}
      </p>
      <p
        className={`text-[10px] font-bold capitalize leading-none ${isLink ? "text-blue-600 underline cursor-pointer" : "text-slate-600"}`}
      >
        {value}
      </p>
    </div>
  </div>
);

const MenuOption = ({ icon, label, onClick, variant = "default" }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group !bg-transparent border-0 outline-none ${
      variant === "danger"
        ? "hover:bg-red-50 text-red-400 hover:text-red-600"
        : "hover:bg-slate-50 text-slate-400 hover:text-blue-600"
    }`}
  >
    <span className="shrink-0">{icon}</span>
    <span
      className={`text-[9px] font-black capitalize tracking-[0.15em] ${
        variant === "danger"
          ? "text-red-500/70 group-hover:text-red-600"
          : "text-slate-500 group-hover:text-slate-900"
      }`}
    >
      {label}
    </span>
  </button>
);

export default ShiftPage;
