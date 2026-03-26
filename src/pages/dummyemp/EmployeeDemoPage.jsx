import {
  PlusCircle,
  Search,
  XCircle,
  X,
  RefreshCw,
  Eye,
  UserPlus,
  Filter,
  Activity,
  Mail,
  Phone,
  Briefcase,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState , useMemo } from "react";
import { employeeService } from "../../services/employee.service";
import EmployeeDemoForm from "./EmployeeDemoForm";
import toast from "react-hot-toast";
import { candidateService } from "../../services/candidateService";

export default function EmpDemoPage() {
  const [editData, setEditData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(searchText);
  }, 300); // Wait 300ms
  return () => clearTimeout(handler);
}, [searchText]);

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

  // const filteredEmployees = employees.filter((emp) => {
  //   const searchMatch =
  //     emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
  //     emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
  //     emp.employee_code?.toLowerCase().includes(searchText.toLowerCase());
  //   const statusMatch = statusFilter ? emp.status === statusFilter : true;
  //   return searchMatch && statusMatch;
  // });

  // const filteredEmployees = employees.filter((emp) => {
  //   // 1. Ensure the employee has a code (filters out null, undefined, or empty strings)
  //   const hasEmployeeCode = !!emp.employee_code && emp.employee_code.trim() !== "";

  //   // 2. Existing Search Match Logic
  //   const searchMatch =
  //     emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
  //     emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
  //     emp.employee_code?.toLowerCase().includes(searchText.toLowerCase());
      
  //   // 3. Existing Status Match Logic
  //   const statusMatch = statusFilter ? emp.status === statusFilter : true;
    
  //   // Return true only if they have a code AND match your other active filters
  //   return hasEmployeeCode && searchMatch && statusMatch;
  // });

  // Replace your existing filteredEmployees constant with this:
const filteredEmployees = useMemo(() => {
  return employees.filter((emp) => {
    const hasEmployeeCode = !!emp.employee_code && emp.employee_code.trim() !== "";
    const searchMatch =
      emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.employee_code?.toLowerCase().includes(searchText.toLowerCase());
    const statusMatch = statusFilter ? emp.status === statusFilter : true;
    
    return hasEmployeeCode && searchMatch && statusMatch;
  });
}, [employees, searchText, statusFilter]); // Only runs when these 3 change

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCreationDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // Gets 'Mar'
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`; // Outputs exactly: "07 Mar 2026"
  };

  const TerminalLoader = () => (
    <div className="col-span-12 py-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl border border-blue-600">
          <Loader2 size={28} className="text-blue-600 animate-pulse" />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">Loading Employee Data</p>
    </div>
  );

  const EmployeeSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => (
      <div 
        key={i} 
        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex items-center relative overflow-hidden"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        
        {/* 1. Identity Box Placeholder */}
        <div className="w-16 shrink-0 flex justify-center ml-2">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl border border-slate-200" />
        </div>

        {/* 2. Name & Code Placeholder */}
        <div className="flex-1 px-4 space-y-2">
          <div className="h-2 w-8 bg-slate-200 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-3 w-1/2 bg-blue-100 rounded" />
        </div>

        {/* 3. Contact Placeholder */}
        <div className="flex-1 border-l border-slate-100 px-4 space-y-3">
          <div className="h-2 w-12 bg-slate-200 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-2/3 bg-slate-100 rounded" />
          </div>
        </div>

        {/* 4. Role Placeholder */}
        <div className="flex-1 border-l border-slate-100 px-4 space-y-3">
          <div className="h-2 w-10 bg-slate-200 rounded" />
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-2 w-1/2 bg-slate-100 rounded" />
            </div>
          </div>
        </div>

        {/* 5. Status Placeholder */}
        <div className="flex-1 border-l border-slate-100 px-4 flex flex-col items-center">
          <div className="h-2 w-12 bg-slate-200 rounded mb-3" />
          <div className="h-6 w-20 bg-slate-100 rounded-xl" />
        </div>

        {/* 6. Date Placeholder */}
        <div className="flex-1 border-l border-slate-100 px-4 flex flex-col items-center">
          <div className="h-2 w-16 bg-slate-200 rounded mb-3" />
          <div className="h-7 w-24 bg-slate-50 rounded-xl border border-slate-100" />
        </div>

        {/* 7. Actions Placeholder */}
        <div className="w-28 shrink-0 flex items-center justify-center gap-2 border-l border-slate-100 pl-4">
          <div className="w-11 h-11 bg-slate-100 rounded-xl" />
          <div className="w-11 h-11 bg-slate-100 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-12">
      <main className="max-w-[1600px] mx-auto px-6 pt-8 space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                <Briefcase size={20} className="text-white" />
            </div>
            <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">HR Portal / Management</p>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Employee  Management</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={handleMigration} disabled={isMigrating} className="p-3 !bg-white !text-blue-600 rounded-xl border border-blue-600 shadow-sm shadow-blue-100 active:scale-95 transition-all">
                <RefreshCw size={20} className={isMigrating ? "animate-spin" : ""} />
             </button>
             {/* <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="flex items-center gap-2 px-6 py-3 !bg-white !text-blue-600 rounded-xl text-[10px] font-black border !border-blue-600 uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-sm shadow-slate-200"
            >
              {isFormVisible ? <XCircle size={18} /> : <PlusCircle size={18} />}
              {isFormVisible ? "Close Terminal" : "Add Employee"}
            </button> */}
            <button
  onClick={() => navigate('/newemployeesalary')} // Update this path to match your actual route
  className="flex items-center gap-2 px-6 py-3 !bg-white !text-blue-600 rounded-xl text-[10px] font-black border !border-blue-600 uppercase tracking-widest hover:!bg-blue-50 transition-all active:scale-95 shadow-sm shadow-slate-200 cursor-pointer outline-none"
>
  <PlusCircle size={18} />
  Add Employee
</button>
          </div>
        </div>

        {/* SEARCH & FILTERS (Exact Image Match) */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search records..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/10 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
            <Filter size={14} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="!bg-transparent text-[11px] font-black uppercase tracking-widest outline-none text-slate-600"
            >
              <option value="">Status: All</option>
              <option value="created">Created</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        {/* FORM DRAWER */}
        {(isFormVisible || editData) && (
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 animate-in slide-in-from-top-5 duration-500">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Employee Add Form
                </h2>
                <button onClick={() => { setEditData(null); setIsFormVisible(false); }} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
             </div>
             <EmployeeDemoForm
                initialData={editData}
                onSubmit={(data) => { handleFormSubmit(data); setIsFormVisible(false); }}
                buttonText={editData ? "Update Matrix" : "Deploy to System"}
              />
          </div>
        )}

        {/* LIST SECTION (Image Design Match) */}
        <div className="space-y-4">
          {loading ? (
            // <TerminalLoader />
            <EmployeeSkeleton />
          ) : (
            filteredEmployees.map((emp) => (
    
      <div 
  key={emp.id} 
  className="group w-full bg-white border border-slate-100 rounded-2xl p-5 flex items-center shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500 relative overflow-hidden"
>
  {/* VERTICAL ACCENT */}
  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-blue-600'}`} />

  {/* 1. IDENTITY BOX (Fixed Width) */}
  <div className="w-16 shrink-0 flex justify-center ml-2">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-xl font-black text-blue-600 shadow-inner group-hover:bg-white transition-colors">
        {emp.full_name?.charAt(0)}
    </div>
  </div>

  {/* 2. NAME & CODE (Equal Flex 1) */}
  <div className="flex-1 px-4 space-y-1 overflow-hidden">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Name</p>
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{emp.full_name}</h3>
      <p className="text-[10px] font-mono font-bold text-blue-600 uppercase">{emp.employee_code || "TMP-PENDING"}</p>
  </div>

  {/* 3. CONTACT (Equal Flex 1) */}
  <div className="flex-1 border-l border-slate-100 px-4 space-y-2 overflow-hidden">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
      <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 truncate">
              <Mail size={12} className="text-blue-600 shrink-0" /> <span className="truncate">{emp.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 truncate">
              <Phone size={12} className="text-blue-600 shrink-0" /> <span className="truncate">{emp.phone}</span>
          </div>
      </div>
  </div>

  {/* 4. ROLE & MGR (Equal Flex 1) */}
  <div className="flex-1 border-l border-slate-100 px-4 overflow-hidden">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Role</p>
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:border-blue-200 transition-colors shrink-0">
        <Briefcase size={16} className="text-blue-600" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">
          {emp.role || "TBD"}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5 truncate">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">MGR:</span>
          <span className={`text-[9px] font-black uppercase tracking-widest truncate ${emp.reporting_manager_name ? 'text-slate-600' : 'text-orange-500'}`}>
            {emp.reporting_manager_name || "Not Specified"}
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* 5. STATUS (Equal Flex 1) */}
  <div className="flex-1 border-l border-slate-100 px-4 flex flex-col items-center justify-center">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
      <span className={`inline-block px-4 whitespace-nowrap py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
          emp.status === 'active' 
          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
          : 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm shadow-blue-50'
      }`}>
          {emp.status?.replace(/_/g, ' ')}
      </span>
  </div>

   {/* 5. Joining DATE (Equal Flex 1) */}
  <div className="flex-1 border-l border-slate-100 px-1 flex flex-col items-center justify-center">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Joining Date</p>
      <span className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
        <Clock size={12} className="text-slate-400" />
        {formatCreationDate(emp.joining_date)}
      </span>
  </div>

  {/* 6. CREATED DATE (Equal Flex 1) */}
  <div className="flex-1 border-l border-slate-100 px-4 flex flex-col items-center justify-center">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Created Date</p>
      <span className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
        <Clock size={12} className="text-slate-400" />
        {formatCreationDate(emp.created_at)}
      </span>
  </div>



  {/* 7. ACTIONS (Fixed Width) */}
  <div className="w-28 shrink-0 flex items-center justify-center gap-2 border-l border-slate-100 pl-4">
    {/* <button 
      onClick={() => handleEdit(emp.id)} 
      className="p-3 !bg-white border !border-slate-200 !text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
      title="Edit Record"
    >
      <Edit3 size={18} />
    </button> */}
    <button 
      // onClick={() => navigate(`/dummyemp/${emp.id}`)} 
      onClick={() => navigate(`/dummyemp/${emp.id}`)} 
      className="p-3 !bg-white border !border-slate-200 !text-blue-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-90"
      title="View Profile"
    >
      <Eye size={18} />
    </button>
  </div>
</div>
            ))
          )}
        </div>

         {/* NUMERICAL PAGINATION FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 Number of Employee: Page {currentPage} of {totalPages || 1}
               </p>
            </div>

            <div className="flex items-center gap-2">
                {/* Prev Button */}
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={18} strokeWidth={3} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-[11px] font-black transition-all border ${
                            currentPage === number 
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
                          }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all active:scale-90"
                >
                    <ChevronRight size={18} strokeWidth={3} />
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}
