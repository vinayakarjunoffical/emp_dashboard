import {
  LayoutDashboard,
  PlusCircle,
  Search,
  MoreVertical,
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
} from "lucide-react";
import EmployeeForm from "../employees/EmployeeForm";
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
      // Note: We don't show success toast here because
      // EmployeeDemoForm handles the success toast itself.
    } catch (err) {
      console.error("Page Level Error:", err.message);

      // IMPORTANT: Re-throw the error so the Child Form's
      // catch block can see it and show the toast.
      throw err;
    }
  };

  const handleEdit = async (id) => {
    try {
      const data = await employeeService.getById(id);
      setEditData(data);
      // Scroll to top smoothly so user sees the form filled
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

  const TerminalLoader = () => (
    <div className="col-span-12 py-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative mb-6">
        {/* Outer Pulse Ring */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
        {/* Inner Core */}
        <div className="relative w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
          <Activity size={28} className="text-blue-500 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">
          Executing Data Retrieval
        </p>
        <div className="flex items-center justify-center gap-1">
          <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">
          Synchronizing with Governance Node...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-12">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* PAGE HEADER */}
        {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Management</h1>
            <p className="text-slate-500 text-sm font-medium">Create, edit and manage your organization's workforce.</p>
          </div>

          <div>
       
            <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            <UserPlus size={18} />
            Total Employees: {employees.length}
          </div>
          </div>
        </div> */}
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
            {/* ➕ NEW ADD EMPLOYEE BUTTON */}
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
        {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              {editData ? "Edit Employee Records" : "New Employee Registration"}
            </h2>
            {editData && (
              <button 
                onClick={() => setEditData(null)}
                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                CANCEL EDIT
              </button>
            )}
          </div>
          <div className="p-6">
      
            <EmployeeDemoForm
              initialData={editData}
              onSubmit={handleFormSubmit}
              buttonText={editData ? "Update Employee" : "Register Employee"}
            />
          </div>
        </div> */}

        {/* SECTION 1: PROFESSIONAL FORM (TOP) */}
        {(isFormVisible || editData) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                {editData
                  ? "Edit Employee Records"
                  : "New Employee Registration"}
              </h2>
              <button
                onClick={() => {
                  setEditData(null);
                  setIsFormVisible(false); // Close form when clicking cancel
                }}
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
                  setIsFormVisible(false); // Auto-close form on successful submit
                }}
                buttonText={editData ? "Update Employee" : "Register Employee"}
              />
            </div>
          </div>
        )}

        {/* SECTION 2: TABLE SEARCH & FILTERS */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Employee Directory
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMigration}
                disabled={isMigrating} // Assuming a loading state exists
                className="relative ml-auto !bg-transparent group overflow-hidden"
              >
                {/* Outer Glow/Border Layer */}
                <div className="flex items-center gap-3 px-6 py-2.5 bg-white border border-blue-500 rounded-xl transition-all duration-300 group-hover:!border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] active:scale-95 disabled:opacity-50">
                  {/* Animated Status Icon */}
                  <div
                    className={`transition-transform duration-700 ${isMigrating ? "animate-spin" : "group-hover:rotate-180"}`}
                  >
                    <RefreshCw
                      size={22}
                      className="!text-blue-500 group-hover:!text-blue-500"
                    />
                  </div>
                </div>
              </button>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder="Search records..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 bg-white">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-2 text-sm bg-transparent outline-none font-medium text-slate-600"
                >
                  <option value="">Status: All</option>
                  <option value="created">Created</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* TABLE AREA */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      "Temp ID",
                      "Emp ID",
                      "Employee Details",
                      "Role",
                      "Phone",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center first:text-left"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-20 text-center text-slate-400"
                      >
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                        Loading Data...
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-20 text-center text-slate-400 font-medium"
                      >
                        No employee records found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                          {/* {emp.employee_code} */}
                          {emp?.temp_id || "-"}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                          {/* {emp.employee_code} */}
                          {emp?.employee_code || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">
                              {emp.full_name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {emp.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">
                            {emp.role || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 font-medium">
                          {emp.phone}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              emp.status === "created"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full mr-1.5 ${
                                emp.status === "created"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            />
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 ">
                            <button
                              onClick={() => handleEdit(emp.id)}
                              className="p-2 !bg-white !text-blue-600 border !border-blue-600 hover:bg-white rounded-lg"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            {/* <button onClick={() => navigate(`/dummyemp/${emp.id}`)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="View">
                              <Eye size={16} />
                            </button> */}
                            <button
                              onClick={() => navigate(`/dummyemp/${emp.id}`)}
                              className="p-2 border border-blue-500 !bg-white hover:bg-white !text-blue-500 rounded-lg"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            {/* <button onClick={() => handleDelete(emp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                              <Trash2 size={16} />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION AREA */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Displaying {filteredEmployees.length} records
              </p>
              <div className="flex gap-2">
                <button
                  className="p-1.5 border border-slate-300 rounded hover:bg-white text-slate-400 disabled:opacity-50"
                  disabled
                >
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1.5 border border-slate-300 rounded hover:bg-white text-slate-600">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
