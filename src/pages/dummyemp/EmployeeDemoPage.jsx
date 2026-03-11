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
import { useEffect, useState } from "react";
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
  const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

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

  const filteredEmployees = employees.filter((emp) => {
    const searchMatch =
      emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.employee_code?.toLowerCase().includes(searchText.toLowerCase());
    const statusMatch = statusFilter ? emp.status === statusFilter : true;
    return searchMatch && statusMatch;
  });

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TerminalLoader = () => (
    <div className="col-span-12 py-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl border border-blue-500">
          <Loader2 size={28} className="text-blue-500 animate-pulse" />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">Loading Employee Data</p>
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
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Employee  Management </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={handleMigration} disabled={isMigrating} className="p-3 !bg-white !text-blue-600 rounded-xl border border-blue-500 shadow-sm shadow-blue-100 active:scale-95 transition-all">
                <RefreshCw size={20} className={isMigrating ? "animate-spin" : ""} />
             </button>
             <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="flex items-center gap-2 px-6 py-3 !bg-white !text-blue-500 rounded-xl text-[10px] font-black border !border-blue-500 uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-sm shadow-slate-200"
            >
              {isFormVisible ? <XCircle size={18} /> : <PlusCircle size={18} />}
              {isFormVisible ? "Close Terminal" : "Add Employee"}
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
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
            <Filter size={14} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none text-slate-600"
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
                    System Registration Protocol
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
            <TerminalLoader />
          ) : (
            filteredEmployees.map((emp) => (
              <div 
                key={emp.id} 
                className="group bg-white border border-slate-100 rounded-2xl p-5 flex items-center shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden"
              >
                {/* VERTICAL ACCENT (Color coded by status) */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-blue-600'}`} />

                {/* 1. IDENTITY BOX - 10% */}
                <div className="flex-[0_0_10%] flex justify-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-xl font-black text-blue-600 shadow-inner group-hover:bg-white transition-colors">
                     {emp.full_name?.charAt(0)}
                  </div>
                </div>

                {/* 2. NAME & CODE - 18% */}
                <div className="flex-[0_0_18%] px-4 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Name</p>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{emp.full_name}</h3>
                    <p className="text-[10px] font-mono font-bold text-blue-500 uppercase">{emp.employee_code || "TMP-PENDING"}</p>
                </div>

                {/* 3. CONTACT - 20% */}
                <div className="flex-[0_0_20%] border-l border-slate-100 px-6 space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                    <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 truncate">
                            <Mail size={12} className="text-blue-500" /> {emp.email}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                            <Phone size={12} className="text-blue-500" /> {emp.phone}
                        </div>
                    </div>
                </div>

                {/* 4. ROLE & MGR - 24% (Matches Onboarding section width) */}
                <div className="flex-[0_0_24%] border-l border-slate-100 px-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Organization Role</p>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:border-blue-200 transition-colors">
                      <Briefcase size={16} className="text-blue-600" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">
                        {emp.role || "TBD"}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MGR:</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${emp.manager ? 'text-slate-600' : 'text-orange-500'}`}>
                          {emp.manager || "PENDING"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. STATUS - 14% (Matches your xl:w-[14%]) */}
                <div className="flex-[0_0_16%] border-l border-slate-100 px-6 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
                    <span className={`inline-block px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        emp.status === 'active' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm shadow-blue-50'
                    }`}>
                        {/* {emp.status} */}
                        {emp.status?.replace(/_/g, ' ')}
                    </span>
                </div>

                {/* 6. ACTIONS - 14% */}
                <div className="flex-[0_0_14%] flex items-center justify-center gap-2 border-l border-slate-100 pl-4">
                  <button 
                    onClick={() => handleEdit(emp.id)} 
                    className="p-3 !bg-white border !border-slate-200 !text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Edit Record"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
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
                 Node Registry: Page {currentPage} of {totalPages || 1}
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
// import {
//   LayoutDashboard,
//   PlusCircle,
//   Search,
//   MoreVertical,
//   Edit3,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   X,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   RefreshCw,
//   Eye,
//   UserPlus,
//   Filter,
//   Activity,
//   Mail,
//   Phone,
//   Briefcase
// } from "lucide-react";
// import EmployeeForm from "../employees/EmployeeForm";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import EmployeeDemoForm from "./EmployeeDemoForm";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";

// export default function EmpDemoPage() {
//   const [editData, setEditData] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [isMigrating, setIsMigrating] = useState(false);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       const data = await employeeService.getAll();
//       setEmployees(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMigration = async () => {
//     try {
//       setIsMigrating(true);
//       await candidateService.migrateCandidates();
//       toast.success("Migration completed successfully 🚀");
//     } catch (err) {
//       toast.error(err.message || "Migration failed ❌");
//     } finally {
//       setIsMigrating(false);
//     }
//   };

//   const handleFormSubmit = async (employeeData) => {
//     try {
//       if (editData) {
//         await employeeService.update(editData.id, employeeData);
//       } else {
//         await employeeService.create(employeeData);
//       }
//       setEditData(null);
//       fetchEmployees();
//     } catch (err) {
//       console.error("Page Level Error:", err.message);
//       throw err;
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const data = await employeeService.getById(id);
//       setEditData(data);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filteredEmployees = employees.filter((emp) => {
//     const searchMatch =
//       emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
//       emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//       emp.employee_code?.toLowerCase().includes(searchText.toLowerCase());
//     const statusMatch = statusFilter ? emp.status === statusFilter : true;
//     return searchMatch && statusMatch;
//   });

//   const TerminalLoader = () => (
//     <div className="col-span-12 py-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-6">
//         <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
//         <div className="relative w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
//           <Activity size={28} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>
//       <div className="space-y-2 text-center">
//         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">
//           Executing Data Retrieval
//         </p>
//         <div className="flex items-center justify-center gap-1">
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
//       <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
//         {/* PAGE HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
//           <div>
//             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
//               Employee Management
//               <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase tracking-tighter font-black">v2.4</span>
//             </h1>
//             <p className="text-slate-500 text-sm font-medium">Create, edit and manage your organization's workforce.</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setIsFormVisible(!isFormVisible)}
//               className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 rounded-xl text-[11px] border border-blue-500 font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
//             >
//               {isFormVisible ? <XCircle size={18} /> : <PlusCircle size={18} />}
//               {isFormVisible ? "Close Form" : "Add Employee"}
//             </button>

//             <div className="flex items-center gap-2 text-[11px] font-black text-blue-600 bg-white px-4 py-2.5 rounded-xl border border-blue-100 uppercase tracking-widest shadow-sm">
//               <UserPlus size={16} strokeWidth={2.5} />
//               Records: {employees.length}
//             </div>
//           </div>
//         </div>

//         {/* SECTION 1: REGISTRATION FORM */}
//         {(isFormVisible || editData) && (
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-top-4 duration-500">
//             <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
//               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-600 rounded-full" />
//                 {editData ? "Edit Employee Records" : "New Employee Registration"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setEditData(null);
//                   setIsFormVisible(false);
//                 }}
//                 className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all active:scale-90"
//               >
//                 <X size={20} strokeWidth={3} />
//               </button>
//             </div>
//             <div className="p-6">
//               <EmployeeDemoForm
//                 initialData={editData}
//                 onSubmit={(data) => {
//                   handleFormSubmit(data);
//                   setIsFormVisible(false);
//                 }}
//                 buttonText={editData ? "Update Employee" : "Register Employee"}
//               />
//             </div>
//           </div>
//         )}

//         {/* SECTION 2: SEARCH & FILTERS */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="relative group">
//             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//             <input
//               placeholder="Search records..."
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               className="pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl w-full md:w-96 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none shadow-sm"
//             />
//           </div>

//           <div className="flex items-center gap-3">
//              <button
//               onClick={handleMigration}
//               disabled={isMigrating}
//               className="p-3 bg-white border border-blue-500 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
//             >
//               <RefreshCw size={20} className={isMigrating ? "animate-spin" : ""} />
//             </button>

//             <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-4 py-1.5 bg-white shadow-sm">
//               <Filter size={14} className="text-slate-400" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="py-2 text-[11px] font-black uppercase tracking-widest bg-transparent outline-none text-slate-600"
//               >
//                 <option value="">Status: All</option>
//                 <option value="created">Created</option>
//                 <option value="active">Active</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* SECTION 3: HORIZONTAL INFO STRIPS */}
//         <div className="space-y-4">
//           {loading ? (
//             <TerminalLoader />
//           ) : filteredEmployees.length === 0 ? (
//             <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
//               No employee records found.
//             </div>
//           ) : (
//             filteredEmployees.map((emp) => (
//               <div 
//                 key={emp.id} 
//                 className="group relative bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-blue-200 hover:shadow-md transition-all duration-300 overflow-hidden"
//               >
//                 {/* 1. BRANDING BOX / AVATAR */}
//                 <div className="flex-shrink-0 w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 transition-colors duration-500">
//                   <span className="text-xl font-black text-slate-400 group-hover:text-white uppercase">
//                     {emp.full_name?.charAt(0) || "U"}
//                   </span>
//                 </div>

//                 {/* 2. PRIMARY INFO (Meta-Data First) */}
//                 <div className="flex-1 min-w-[180px]">
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity Node</p>
//                   <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
//                     {emp.full_name}
//                   </h3>
//                   <div className="flex items-center gap-2 mt-1">
//                      <span className="text-[10px] font-mono font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
//                        {emp.employee_code || emp.temp_id || "TEMP-PENDING"}
//                      </span>
//                   </div>
//                 </div>

//                 {/* 3. CONTACT STRIP */}
//                 <div className="flex-1 border-l border-slate-100 pl-6 hidden lg:block">
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Access Credentials</p>
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2 text-xs text-slate-600">
//                       <Mail size={12} className="text-slate-300" />
//                       {emp.email}
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-slate-500">
//                       <Phone size={12} className="text-slate-300" />
//                       {emp.phone}
//                     </div>
//                   </div>
//                 </div>

//                 {/* 4. ROLE / DEPARTMENT */}
//                 <div className="flex-1 border-l border-slate-100 pl-6 hidden md:block">
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Designation</p>
//                   <div className="flex items-center gap-2">
//                     <Briefcase size={14} className="text-blue-500" />
//                     <span className="text-xs font-bold text-slate-700 uppercase">
//                       {emp.role || "TBD"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* 5. STATUS BOX */}
//                 <div className="flex-shrink-0 text-center px-8 border-l border-slate-100">
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">System Status</p>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
//                     emp.status === 'active' 
//                     ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
//                     : 'bg-blue-50 text-blue-600 border-blue-100'
//                   }`}>
//                     <div className={`w-1 h-1 rounded-full mr-2 ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
//                     {emp.status}
//                   </span>
//                 </div>

//                 {/* 6. ACTIONS */}
//                 <div className="flex items-center gap-2 ml-auto">
//                   <button
//                     onClick={() => handleEdit(emp.id)}
//                     className="p-2.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
//                     title="Edit"
//                   >
//                     <Edit3 size={16} strokeWidth={2.5} />
//                   </button>
//                   <button
//                     onClick={() => navigate(`/dummyemp/${emp.id}`)}
//                     className="p-2.5 bg-white border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
//                     title="View Profile"
//                   >
//                     <Eye size={16} strokeWidth={2.5} />
//                   </button>
//                 </div>

//                 {/* WATERMARK ICON (Security Feel) */}
//                 <UserPlus className="absolute -bottom-6 -right-6 w-24 h-24 text-slate-50 opacity-[0.4] -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors" />
//               </div>
//             ))
//           )}
//         </div>

//         {/* FOOTER PAGINATION */}
//         <div className="px-6 py-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//             Processing {filteredEmployees.length} active nodes
//           </p>
//           <div className="flex gap-2">
//             <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 disabled:opacity-30" disabled>
//               <ChevronLeft size={18} />
//             </button>
//             <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
//******************************************************************************************************* */
// import {
//   LayoutDashboard,
//   PlusCircle,
//   Search,
//   MoreVertical,
//   Edit3,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   X,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   RefreshCw,
//   Eye,
//   UserPlus,
//   Filter,
// } from "lucide-react";
// import EmployeeForm from "../employees/EmployeeForm";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";
// import EmployeeDemoForm from "./EmployeeDemoForm";
// import toast from "react-hot-toast";
// import { candidateService } from "../../services/candidateService";

// export default function EmpDemoPage() {
//   const [editData, setEditData] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [isMigrating, setIsMigrating] = useState(false);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       const data = await employeeService.getAll();
//       setEmployees(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMigration = async () => {
//     try {
//       setIsMigrating(true);
//       await candidateService.migrateCandidates();
//       toast.success("Migration completed successfully 🚀");
//     } catch (err) {
//       toast.error(err.message || "Migration failed ❌");
//     } finally {
//       setIsMigrating(false);
//     }
//   };

//   const handleFormSubmit = async (employeeData) => {
//     try {
//       if (editData) {
//         await employeeService.update(editData.id, employeeData);
//       } else {
//         await employeeService.create(employeeData);
//       }
//       setEditData(null);
//       fetchEmployees();
//       // Note: We don't show success toast here because
//       // EmployeeDemoForm handles the success toast itself.
//     } catch (err) {
//       console.error("Page Level Error:", err.message);

//       // IMPORTANT: Re-throw the error so the Child Form's
//       // catch block can see it and show the toast.
//       throw err;
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const data = await employeeService.getById(id);
//       setEditData(data);
//       // Scroll to top smoothly so user sees the form filled
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this employee?")) return;
//     try {
//       await employeeService.remove(id);
//       fetchEmployees();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filteredEmployees = employees.filter((emp) => {
//     const searchMatch =
//       emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
//       emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//       emp.employee_code?.toLowerCase().includes(searchText.toLowerCase());
//     const statusMatch = statusFilter ? emp.status === statusFilter : true;
//     return searchMatch && statusMatch;
//   });

//   const TerminalLoader = () => (
//     <div className="col-span-12 py-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
//       <div className="relative mb-6">
//         {/* Outer Pulse Ring */}
//         <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
//         {/* Inner Core */}
//         <div className="relative w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
//           <Activity size={28} className="text-blue-500 animate-pulse" />
//         </div>
//       </div>
//       <div className="space-y-2 text-center">
//         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">
//           Executing Data Retrieval
//         </p>
//         <div className="flex items-center justify-center gap-1">
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
//           <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
//         </div>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">
//           Synchronizing with Governance Node...
//         </p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-12">
//       <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
//         {/* PAGE HEADER */}
//         {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
//           <div>
//             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Management</h1>
//             <p className="text-slate-500 text-sm font-medium">Create, edit and manage your organization's workforce.</p>
//           </div>

//           <div>
       
//             <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
//             <UserPlus size={18} />
//             Total Employees: {employees.length}
//           </div>
//           </div>
//         </div> */}
//         {/* PAGE HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
//           <div>
//             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//               Employee Management
//             </h1>
//             <p className="text-slate-500 text-sm font-medium">
//               Create, edit and manage your organization's workforce.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* ➕ NEW ADD EMPLOYEE BUTTON */}
//             <button
//               onClick={() => setIsFormVisible(!isFormVisible)}
//               className="flex items-center gap-2 px-6 py-2.5 !bg-white !text-blue-500 rounded-xl text-[11px] border border-blue-500 font-black uppercase tracking-widest hover:bg-white transition-all  active:scale-95"
//             >
//               {isFormVisible ? <XCircle size={18} /> : <PlusCircle size={18} />}
//               {isFormVisible ? "Close Form" : "Add Employee"}
//             </button>

//             <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
//               <UserPlus size={18} />
//               Records: {employees.length}
//             </div>
//           </div>
//         </div>

//         {/* SECTION 1: PROFESSIONAL FORM (TOP) */}
//         {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//           <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
//             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
//               {editData ? "Edit Employee Records" : "New Employee Registration"}
//             </h2>
//             {editData && (
//               <button 
//                 onClick={() => setEditData(null)}
//                 className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
//               >
//                 CANCEL EDIT
//               </button>
//             )}
//           </div>
//           <div className="p-6">
      
//             <EmployeeDemoForm
//               initialData={editData}
//               onSubmit={handleFormSubmit}
//               buttonText={editData ? "Update Employee" : "Register Employee"}
//             />
//           </div>
//         </div> */}

//         {/* SECTION 1: PROFESSIONAL FORM (TOP) */}
//         {(isFormVisible || editData) && (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-top-4 duration-500">
//             <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
//               <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
//                 {editData
//                   ? "Edit Employee Records"
//                   : "New Employee Registration"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setEditData(null);
//                   setIsFormVisible(false); // Close form when clicking cancel
//                 }}
//                 className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all active:scale-90"
//               >
//                 <X size={20} strokeWidth={3} />
//               </button>
//             </div>
//             <div className="p-6">
//               <EmployeeDemoForm
//                 initialData={editData}
//                 onSubmit={(data) => {
//                   handleFormSubmit(data);
//                   setIsFormVisible(false); // Auto-close form on successful submit
//                 }}
//                 buttonText={editData ? "Update Employee" : "Register Employee"}
//               />
//             </div>
//           </div>
//         )}

//         {/* SECTION 2: TABLE SEARCH & FILTERS */}
//         <div className="space-y-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               Employee List
//             </h2>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleMigration}
//                 disabled={isMigrating} // Assuming a loading state exists
//                 className="relative ml-auto !bg-transparent group overflow-hidden"
//               >
//                 {/* Outer Glow/Border Layer */}
//                 <div className="flex items-center gap-3 px-6 py-2.5 bg-white border border-blue-500 rounded-xl transition-all duration-300 group-hover:!border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] active:scale-95 disabled:opacity-50">
//                   {/* Animated Status Icon */}
//                   <div
//                     className={`transition-transform duration-700 ${isMigrating ? "animate-spin" : "group-hover:rotate-180"}`}
//                   >
//                     <RefreshCw
//                       size={22}
//                       className="!text-blue-500 group-hover:!text-blue-500"
//                     />
//                   </div>
//                 </div>
//               </button>
//               <div className="relative">
//                 <Search
//                   size={16}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   placeholder="Search records..."
//                   value={searchText}
//                   onChange={(e) => setSearchText(e.target.value)}
//                   className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
//                 />
//               </div>
//               <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 bg-white">
//                 <Filter size={14} className="text-slate-400" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="py-2 text-sm bg-transparent outline-none font-medium text-slate-600"
//                 >
//                   <option value="">Status: All</option>
//                   <option value="created">Created</option>
//                   <option value="active">Active</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* TABLE AREA */}
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-slate-50 border-b border-slate-200">
//                   <tr>
//                     {[
//                       "Temp ID",
//                       "Emp ID",
//                       "Employee Details",
//                       "Role",
//                       "Phone",
//                       "Status",
//                       "Actions",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center first:text-left"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {loading ? (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="py-20 text-center text-slate-400"
//                       >
//                         <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
//                         Loading Data...
//                       </td>
//                     </tr>
//                   ) : filteredEmployees.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="py-20 text-center text-slate-400 font-medium"
//                       >
//                         No employee records found.
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredEmployees.map((emp) => (
//                       <tr
//                         key={emp.id}
//                         className="hover:bg-slate-50/80 transition-colors group"
//                       >
//                         <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
//                           {/* {emp.employee_code} */}
//                           {emp?.temp_id || "-"}
//                         </td>
//                         <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
//                           {/* {emp.employee_code} */}
//                           {emp?.employee_code || "-"}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col">
//                             <span className="font-bold text-slate-800">
//                               {emp.full_name}
//                             </span>
//                             <span className="text-xs text-slate-500">
//                               {emp.email}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-center">
//                           <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">
//                             {emp.role || "N/A"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-center text-slate-600 font-medium">
//                           {emp.phone}
//                         </td>
//                         <td className="px-6 py-4 text-center">
//                           <span
//                             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
//                               emp.status === "created"
//                                 ? "bg-blue-100 text-blue-700"
//                                 : "bg-green-100 text-green-700"
//                             }`}
//                           >
//                             <span
//                               className={`w-1 h-1 rounded-full mr-1.5 ${
//                                 emp.status === "created"
//                                   ? "bg-blue-500"
//                                   : "bg-green-500"
//                               }`}
//                             />
//                             {emp.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center justify-center gap-2 ">
//                             <button
//                               onClick={() => handleEdit(emp.id)}
//                               className="p-2 !bg-white !text-blue-600 border !border-blue-600 hover:bg-white rounded-lg"
//                               title="Edit"
//                             >
//                               <Edit3 size={16} />
//                             </button>
//                             {/* <button onClick={() => navigate(`/dummyemp/${emp.id}`)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="View">
//                               <Eye size={16} />
//                             </button> */}
//                             <button
//                               onClick={() => navigate(`/dummyemp/${emp.id}`)}
//                               className="p-2 border border-blue-500 !bg-white hover:bg-white !text-blue-500 rounded-lg"
//                               title="View"
//                             >
//                               <Eye size={16} />
//                             </button>
//                             {/* <button onClick={() => handleDelete(emp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
//                               <Trash2 size={16} />
//                             </button> */}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* PAGINATION AREA */}
//             <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
//               <p className="text-xs font-medium text-slate-500">
//                 Displaying {filteredEmployees.length} records
//               </p>
//               <div className="flex gap-2">
//                 <button
//                   className="p-1.5 border border-slate-300 rounded hover:bg-white text-slate-400 disabled:opacity-50"
//                   disabled
//                 >
//                   <ChevronLeft size={16} />
//                 </button>
//                 <button className="p-1.5 border border-slate-300 rounded hover:bg-white text-slate-600">
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
