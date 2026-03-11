import {
  LayoutDashboard,
  PlusCircle,
  Search,
  MoreVertical,
   Send,
   Clock ,
   FileCheck,
   CalendarCheck,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  UserPlus,
  Filter,
  Mail,
  Smartphone,
  Hash,
  Briefcase,
  Activity
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { employeeService } from "../../services/employee.service";

import toast from "react-hot-toast";
import { candidateService } from "../../services/candidateService";
import EmployeeDemoForm from "../dummyemp/EmployeeDemoForm";

// 🛡️ REUSABLE STAGE INDICATOR COMPONENT
const StageIndicator = ({ label, status }) => {
  // 🎨 State Logic Mapping - Simplified for inline badges
  const config = {
    done: {
      statusIcon: <CheckCircle2 size={12} strokeWidth={3} className="text-emerald-500 animate-in zoom-in duration-300" />,
      textColor: "text-emerald-700",
      bg: "bg-emerald-50/50"
    },
    pending: {
      statusIcon: <Clock size={12} strokeWidth={3} className="text-amber-500 animate-pulse" />,
      textColor: "text-amber-600",
      bg: "bg-amber-50/50"
    },
    rejected: {
      statusIcon: <X size={12} strokeWidth={3} className="text-rose-500" />,
      textColor: "text-rose-700",
      bg: "bg-rose-50/50"
    }
  };

  const active = config[status] || config.pending;

  return (
    <div className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg border border-slate-100 transition-all hover:border-slate-200 ${active.bg}`}>
      {/* 🏷️ Label on the left */}
      <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${active.textColor}`}>
        {label}
      </span>

      {/* 🎯 Status Symbol on the right */}
      <div className="flex shrink-0">
        {active.statusIcon}
      </div>
    </div>
  );
};

export default function CandidateDemoPage() {
  const [editData, setEditData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 8; // Adjust based on preference

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      await candidateService.migrateCandidates();
      toast.success("Migration completed successfully 🚀");
    } catch (err) {
      toast.error(err.message || "Migration failed ❌");
    } finally {
      setIsMigrating(false);
    }
  };

  const handleFormSubmit = async (employeeData) => {
    try {
      if (editData) {
        await employeeService.update(editData.id, employeeData);
      } else {
        await employeeService.create(employeeData);
      }
      setEditData(null);
      fetchEmployees();
    } catch (err) {
      console.error("Page Level Error:", err.message);
      throw err;
    }
  };

  const handleEdit = async (id) => {
    try {
      const data = await employeeService.getById(id);
      setEditData(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await employeeService.remove(id);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const searchMatch =
      emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.employee_code?.toLowerCase().includes(searchText.toLowerCase());
    const statusMatch = statusFilter ? emp.status === statusFilter : true;
    return searchMatch && statusMatch;
  });

  const getPageNumbers = (totalPages, current) => {
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (current >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', current, '...', totalPages);
    }
  }
  return pages;
};

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-12">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
   
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Employee Management
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Create, edit and manage your organization's workforce.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl text-[11px] border border-blue-500 font-black uppercase tracking-widest hover:bg-white transition-all  active:scale-95"
            >
              {isFormVisible ? <XCircle size={18} /> : <PlusCircle size={18} />}
              {isFormVisible ? "Close Form" : "Add Employee"}
            </button>

            <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <UserPlus size={18} />
              Records: {employees.length}
            </div>
          </div>
        </div>

        {/* SECTION 1: PROFESSIONAL FORM (TOP) */}
        {(isFormVisible || editData) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                {editData ? "Edit Employee Records" : "New Employee Registration"}
              </h2>
              <button
                onClick={() => { setEditData(null); setIsFormVisible(false); }}
                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all active:scale-90"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            <div className="p-6">
              <EmployeeDemoForm
                initialData={editData}
                onSubmit={(data) => {
                  handleFormSubmit(data);
                  setIsFormVisible(false);
                }}
                buttonText={editData ? "Update Employee" : "Register Employee"}
              />
            </div>
          </div>
        )}

        {/* SECTION 2: SEARCH & FILTERS */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  placeholder="Search records..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 bg-white shadow-sm">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-3 text-[10px] bg-transparent outline-none font-black uppercase tracking-widest text-slate-600 cursor-pointer"
                >
                  <option value="">Status: All</option>
                  <option value="created">Created</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleMigration}
              disabled={isMigrating}
              className="flex items-center gap-3 px-6 py-3 bg-white border border-blue-500 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95"
            >
              <RefreshCw size={16} className={isMigrating ? "animate-spin" : ""} />
              
            </button>
          </div>

          {/* 🎯 DATA REGISTRY: HORIZONTAL CARDS REPLACING TABLE */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center animate-pulse">
                <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Temp Employee Data</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="py-20 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 font-bold uppercase text-xs">
                No employee records found.
              </div>
            ) : (
            //   filteredEmployees.map((emp) => (
            //     <div 
            //       key={emp.id}
            //       className="group relative bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
            //     >
            //       {/* Status Accent Bar */}
            //       <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${emp.status === 'created' ? 'bg-blue-500' : 'bg-green-500'}`} />

            //       {/* 1. Identity Block */}
            //       <div className="flex items-center gap-4 w-full md:w-[25%] min-w-0">
            //         <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white text-lg font-black shrink-0 shadow-lg">
            //           {emp.full_name?.charAt(0)}
            //         </div>
            //         <div className="min-w-0">
            //           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Employee</span>
            //           <h3 className="text-sm font-black text-slate-900 uppercase truncate leading-none">{emp.full_name}</h3>
            //           <div className="flex flex-col items-center gap-2 mt-1.5">
            //             <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Emp ID: {emp.employee_code || "-"}</span>
            //             <span className="text-[10px] font-bold text-slate-400">Tmp ID: {emp.temp_id || "-"}</span>
            //           </div>
            //         </div>
            //       </div>

            //       {/* 2. Contact Metadata Block */}
            //       <div className="flex flex-1 items-center justify-between w-full md:w-auto px-0 md:px-6 border-l-0 md:border-l border-slate-100">
            //         <div className="space-y-1.5">
            //           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Contact Details</span>
            //           <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 truncate">
            //             <Mail size={12} className="text-slate-300" /> {emp.email}
            //           </div>
            //           <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
            //             <Smartphone size={12} className="text-slate-300" /> {emp.phone}
            //           </div>
            //         </div>

            //         <div className="hidden lg:block space-y-1.5 border-l border-slate-100 pl-8">
            //           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Assigned Role</span>
            //           <div className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase tracking-tighter">
            //             <Briefcase size={12} className="text-blue-500" /> {emp.role || "N/A"}
            //           </div>
            //         </div>
            //       </div>

            //       {/* 3. Status Badge Block */}
            //       <div className="flex flex-row md:flex-col items-center justify-center w-full md:w-[15%] border-l-0 md:border-l border-slate-100 gap-2">
            //         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest hidden md:block">Registry State</span>
            //         <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            //           emp.status === 'created' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
            //         }`}>
            //           {emp.status}
            //         </div>
            //       </div>

            //       {/* 4. Action Execution Block */}
            //       <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            //         <button 
            //           onClick={() => handleEdit(emp.id)}
            //           className="p-2.5 !bg-white !text-blue-500 hover:!text-blue-600 hover:bg-white border !border-blue-100 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
            //           title="Edit Node"
            //         >
            //           <Edit3 size={16} strokeWidth={2.5} />
            //         </button>
            //         <button 
            //           onClick={() => navigate(`/dummyemp/${emp.id}`)}
            //           className="flex items-center gap-2 p-2.5 !bg-white !text-blue-500 rounded-xl text-[10px] border border-blue-100 font-black uppercase tracking-widest hover:!bg-white transition-all shadow-sm active:scale-95"
            //         >
            //           <Eye size={16} strokeWidth={2.5} />
            //         </button>
            //       </div>
            //     </div>
            //   ))
     filteredEmployees.map((emp) => (
  <div 
    key={emp.id}
    className="group relative bg-white border border-slate-200 rounded-2xl p-5 flex flex-col xl:flex-row items-center gap-0 xl:gap-2 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
  >
    {/* ⚡ Dynamic Status Sidebar Accent */}
    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500 ${
      emp.status === 'confirmed' ? 'bg-emerald-500' : 
      emp.status === 'on_probation' ? 'bg-amber-500' : 'bg-blue-500'
    }`} />

    {/* 01. PRIMARY IDENTITY (18%) */}
    <div className="flex items-center gap-4 w-full xl:w-[18%] min-w-0 pb-4 xl:pb-0 px-2">
      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 text-lg font-black shadow-sm uppercase shrink-0 group-hover:scale-110 transition-transform duration-500">
        {emp.full_name?.charAt(0)}
      </div>
      <div className="min-w-0">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Name</span>
        <h3 className="text-[13px] font-black text-slate-900 uppercase truncate leading-tight">{emp.full_name}</h3>
        <div className="mt-2">
          <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 whitespace-nowrap">
            {emp.temp_id || "OFFER PENDING"}
          </span>
        </div>
      </div>
    </div>

    {/* 02. CONTACT HUB (14%) - BORDER LEFT */}
    <div className="w-full xl:w-[14%] border-t xl:border-t-0 xl:border-l border-slate-100 px-4 py-4 xl:py-0 space-y-2">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact</span>
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 truncate group-hover:text-blue-600 transition-colors">
        <Mail size={12} className="text-slate-300" /> {emp.email}
      </div>
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
        <Smartphone size={12} className="text-slate-300" /> +91 {emp.phone}
      </div>
    </div>

    {/* 03. ONBOARDING ROADMAP (35%) - THE 2x2 GRID NODE */}
    <div className="w-full xl:w-[35%] border-t xl:border-t-0 xl:border-l border-slate-100 px-6 py-4 xl:py-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Onboarding</span>
        {/* <div className="h-1 flex-1 bg-slate-50 mx-4 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/3 opacity-100" /> 
        </div> */}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <StageIndicator 
          label="Offer Letter" 
          status={emp.status === 'rejected' ? 'rejected' : (emp.status !== 'created' ? 'done' : 'pending')} 
        />
        <StageIndicator 
          label="Doc Verif." 
          status={emp.doc_submission_status === 'submitted' ? 'done' : (emp.doc_submission_status === 'rejected' ? 'rejected' : 'pending')} 
        />
        <StageIndicator 
          label="Asset Assign" 
          status={emp.status === 'confirmed' ? 'done' : 'pending'} 
        />
        <StageIndicator 
          label="Join Letter" 
          status={emp.joining_attendance_status === 'joined' ? 'done' : (emp.joining_attendance_status === 'no_show' ? 'rejected' : 'pending')} 
        />
      </div>
    </div>

    {/* 04. REGISTRY STATUS (10%) - BORDER LEFT */}
    <div className="w-full xl:w-[12%] border-t xl:border-t-0 xl:border-l border-slate-100 px-4 py-4 xl:py-0 flex flex-col justify-center items-center xl:items-start">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</span>
      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap tracking-widest border shadow-sm transition-all duration-500 ${
        emp.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ' : 
        emp.status === 'on_probation' ? 'bg-amber-50 text-amber-600 border-amber-100 ' : 
        'bg-white text-blue-600 border-blue-100 '
      }`}>
        {emp.status?.replace('_', ' ')}
      </div>
    </div>

    {/* 05. DEPLOYMENT (15%) - BORDER LEFT */}
    <div className="w-full xl:w-[11%] border-t xl:border-t-0 xl:border-l border-slate-100 px-4 py-4 xl:py-0 space-y-2 min-w-0">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Role</span>
      <div 
        className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase leading-none truncate cursor-help group-hover:text-blue-600 transition-colors"
        title={emp.role || "Role TBD"}
      >
        <Briefcase size={12} className="text-blue-500 shrink-0" />
        <span className="truncate">{emp.role || "TBD"}</span>
      </div>
      <div 
        className="text-[9px] font-bold text-slate-400 uppercase truncate cursor-help"
        title={emp.reporting_manager_name ? `Reports to: ${emp.reporting_manager_name}` : "Pending Manager"}
      >
        <span className="truncate">Mgr: {emp.reporting_manager_name || "PENDING"}</span>
      </div>
    </div>

    {/* 06. ACTIONS (FLEX-1) - BORDER LEFT */}
    <div className="w-full xl:flex-1 border-t xl:border-t-0 xl:border-l border-slate-100 px-4 py-4 xl:py-0 flex items-center justify-end gap-3">
      <button 
        onClick={(e) => { e.stopPropagation(); handleEdit(emp.id); }} 
        className="p-3 !bg-white !text-blue-500 hover:!text-blue-500 hover:!bg-white border !border-blue-500 hover:!border-blue-600 rounded-xl transition-all duration-300 shadow-sm active:scale-90"
      >
        <Edit3 size={15} strokeWidth={3}/>
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); navigate(`/dummyemp/${emp.id}`); }} 
        className="flex items-center gap-3 px-3 py-3 !bg-white !text-blue-500 border border-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 shrink-0"
      >
        
        <Eye size={15} strokeWidth={3}/>
      </button>
    </div>
  </div>
))
            )
            }
          </div>

          {/* PAGINATION AREA */}
          {/* <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Governance Registry • Displaying {filteredEmployees.length} Nodes
            </p>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-blue-500 transition-all"><ChevronLeft size={18} /></button>
              <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 hover:text-blue-500 transition-all shadow-sm"><ChevronRight size={18} /></button>
            </div>
          </div> */}
          {/* --- PAGINATION AREA --- */}
<div className="flex items-center justify-between pt-8 border-t border-slate-200">
  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
    candidate data
  </p>
  
  <div className="flex items-center gap-2">
    {/* Left Arrow */}
    <button 
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-blue-500 hover:border-blue-200 disabled:opacity-30 transition-all active:scale-90"
    >
      <ChevronLeft size={18} strokeWidth={3} />
    </button>

    {/* Middle Numbered Pages */}
    <div className="flex items-center gap-1.5 px-2">
      {getPageNumbers(Math.ceil(filteredEmployees.length / recordsPerPage), currentPage).map((page, idx) => (
        <button
          key={idx}
          disabled={page === '...'}
          onClick={() => typeof page === 'number' && setCurrentPage(page)}
          className={`h-9 min-w-[36px] flex items-center justify-center rounded-xl text-[11px] font-black transition-all active:scale-95 ${
            currentPage === page 
              ? "!bg-white !text-blue-500 shadow-lg !shadow-blue-200 ring-2 !ring-blue-600 ring-offset-2" 
              : page === '...' 
                ? "!text-slate-300 cursor-default" 
                : "!bg-white !text-slate-500 border !border-slate-200 hover:!border-blue-300 hover:!text-blue-600 shadow-sm"
          }`}
        >
          {page}
        </button>
      ))}
    </div>

    {/* Right Arrow */}
    <button 
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEmployees.length / recordsPerPage)))}
      disabled={currentPage === Math.ceil(filteredEmployees.length / recordsPerPage)}
      className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 hover:text-blue-500 hover:border-blue-200 disabled:opacity-30 transition-all active:scale-90"
    >
      <ChevronRight size={18} strokeWidth={3} />
    </button>
  </div>
</div>
        </div>
      </main>
    </div>
  );
}