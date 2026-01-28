
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
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

export default function EmpDemoPage() {
  const [editData, setEditData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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

  // const handleFormSubmit = async (employeeData) => {
  //   try {
  //     if (editData) {
  //       await employeeService.update(editData.id, employeeData);
  //     } else {
  //       await employeeService.create(employeeData);
  //     }
  //     setEditData(null);
  //     fetchEmployees();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-12">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Management</h1>
            <p className="text-slate-500 text-sm font-medium">Create, edit and manage your organization's workforce.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            <UserPlus size={18} />
            Total Employees: {employees.length}
          </div>
        </div>

        {/* SECTION 1: PROFESSIONAL FORM (TOP) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
            {/* Note: To make the form fields horizontal, 
               ensure EmployeeForm uses: <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> 
            */}
            <EmployeeDemoForm
              initialData={editData}
              onSubmit={handleFormSubmit}
              buttonText={editData ? "Update Employee" : "Register Employee"}
            />
          </div>
        </div>

        {/* SECTION 2: TABLE SEARCH & FILTERS */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               Employee Directory
            </h2>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                    {["Code", "Employee Details", "Role", "Phone", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center first:text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                        Loading Data...
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-400 font-medium">
                        No employee records found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                          {emp.employee_code}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{emp.full_name}</span>
                            <span className="text-xs text-slate-500">{emp.email}</span>
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            emp.status === "created" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                          }`}>
                            <span className={`w-1 h-1 rounded-full mr-1.5 ${
                              emp.status === "created" ? "bg-blue-500" : "bg-green-500"
                            }`} />
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 ">
                            <button onClick={() => handleEdit(emp.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => navigate(`/dummyemp/${emp.id}`)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="View">
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
                <button className="p-1.5 border border-slate-300 rounded hover:bg-white text-slate-400 disabled:opacity-50" disabled>
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
//***********************************************working code phase 1 20/1/26***************************************************************** */
// import {
//   LayoutDashboard,
//   PlusCircle,
//   Search,
//   MoreVertical,
//   Edit3,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   Eye ,
// } from "lucide-react";
// import EmployeeForm from "../employees/EmployeeForm";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";

// const API_BASE = "https://emp-onbd-1.onrender.com";

// export default function EmpDemoPage() {
//   const [departments, setDepartments] = useState([
//     {
//       id: 1,
//       name: "DEVP",
//       code: "JOB-01",
//       description: "TESTING",
//       active: true,
//     },
//     {
//       id: 2,
//       name: "Sales",
//       code: "Sales-01",
//       description: "WORKING",
//       active: true,
//     },
//     {
//       id: 3,
//       name: "HR & Admin",
//       code: "HR-01",
//       description: "HR with administrative responsibilities",
//       active: false,
//     },
//   ]);

//   const [editData, setEditData] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     code: "",
//     description: "",
//     active: true,
//   });
//   const [editId, setEditId] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
// const [statusFilter, setStatusFilter] = useState("");
// const navigate = useNavigate();

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

//   const handleFormSubmit = async (employeeData) => {
//     try {
//       if (editData) {
//         // UPDATE
//         await employeeService.update(editData.id, employeeData);
//       } else {
//         // CREATE
//         await employeeService.create(employeeData);
//       }

//       setEditData(null);
//       fetchEmployees();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const data = await employeeService.getById(id);
//       setEditData(data);
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

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const filteredEmployees = employees.filter((emp) => {
//   const searchMatch =
//     emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
//     emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//     emp.employee_code?.toLowerCase().includes(searchText.toLowerCase())||
//     emp.role?.toLowerCase().includes(searchText.toLocaleLowerCase());

//   const statusMatch = statusFilter
//     ? emp.status === statusFilter
//     : true;

//   return searchMatch && statusMatch;
// });

// const handleView = (id) => {
//   navigate(`/employees/${id}`);
// };



//   return (
//     <div className="min-h-screen  flex font-sans text-slate-900">
//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 flex flex-col">
  

//         <div className="p-8 grid grid-cols-12 gap-8">
       
//           <div className="col-span-12 lg:col-span-4">
//             <div className="p-0">
//               <EmployeeForm
//                 initialData={editData}
//                 onSubmit={handleFormSubmit}
//                 buttonText={
//                   editData ? "Update Records" : "Confirm Registration"
//                 }
//               />

//               {editData && (
//                 <button
//                   onClick={() => setEditData(null)}
//                   className="w-full mt-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
//                 >
//                   Cancel and add new instead
//                 </button>
//               )}
//             </div>
//           </div>

          
//           {/* RIGHT PANEL: DATA TABLE */}
// <div className="col-span-12 lg:col-span-8">
//   <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

//     {/* TABLE TOOLBAR */}
//     <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="relative">
//           <Search
//             size={16}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//           />
//           <input
//   placeholder="Search employees..."
//   value={searchText}
//   onChange={(e) => setSearchText(e.target.value)}
//   className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// />

//         </div>

//         <select
//   value={statusFilter}
//   onChange={(e) => setStatusFilter(e.target.value)}
//   className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
// >
//   <option value="">All Status</option>
//   <option value="created">Created</option>
  
// </select>

//       </div>

     
//     </div>

//     {/* TABLE */}
//     <div className="overflow-x-auto">
//       <table className="w-full text-sm">
//         <thead className="bg-slate-50 sticky top-0 z-10">
//           <tr className="border-b border-slate-200 whitespace-nowrap">
//             {[
//               "Employee Code",
//               "Full Name",
//               "Email",
//               "Phone",
//               "Role",
//               "Joining Date",
//               "Status",
//             ].map((h) => (
//               <th
//                 key={h}
//                 className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest"
//               >
//                 {h}
//               </th>
//             ))}
//             <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//               Actions
//             </th>
//           </tr>
//         </thead>

        

//         <tbody className="divide-y divide-slate-100">
//   {loading ? (
//     <tr>
//       <td colSpan={8} className="py-16 text-center">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//           <span className="text-sm text-slate-500 font-medium">
//             Loading employees...
//           </span>
//         </div>
//       </td>
//     </tr>
//   ) : filteredEmployees.length === 0 ? (
//     <tr>
//       <td colSpan={8} className="py-12 text-center text-slate-500">
//         No employees found
//       </td>
//     </tr>
//   ) : (
//     filteredEmployees.map((emp) => (
//       <tr
//         key={emp.id}
//         className="hover:bg-slate-50 transition-colors whitespace-nowrap"
//       >
//         <td className="px-6 py-4 font-mono text-slate-700">
//           {emp.employee_code}
//         </td>

//         <td className="px-6 py-4 font-semibold text-slate-800">
//           {emp.full_name}
//         </td>

//         <td className="px-6 py-4 text-slate-600">
//           {emp.email}
//         </td>

//         <td className="px-6 py-4 text-slate-600">
//           {emp.phone}
//         </td>

//         <td className="px-6 py-4 capitalize text-slate-700">
//           {emp.role}
//         </td>

//         <td className="px-6 py-4 text-slate-600">
//           {emp.joining_date}
//         </td>

//         <td className="px-6 py-4">
//           <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
//             emp.status === "created"
//               ? "bg-blue-50 text-blue-700"
//               : emp.status === "active"
//               ? "bg-green-50 text-green-700"
//               : "bg-slate-100 text-slate-600"
//           }`}>
//             {emp.status}
//           </span>
//         </td>

//         <td className="px-6 py-4 text-right">
//           <button
//             onClick={() => handleEdit(emp.id)}
//             className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
//           >
//             <Edit3 size={16} />
//           </button>

//            {/* VIEW */}
//     <button
//       onClick={() => handleView(emp.id)}
//       className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
//       title="View Employee"
//     >
//       <Eye size={16} />
//     </button>
//         </td>
//       </tr>
//     ))
//   )}
// </tbody>

//       </table>
//     </div>

//     {/* FOOTER / PAGINATION */}
//     <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
//       <span className="text-xs text-slate-500 font-medium">
//         Showing 1–10 of {employees.length} employees
//       </span>

//       <div className="flex items-center gap-2">
//         <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
//           <ChevronLeft size={16} />
//         </button>

//         <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">
//           1
//         </button>

//         <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
//           2
//         </button>

//         <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
//           <ChevronRight size={16} />
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

//         </div>
//       </main>
//     </div>
//   );
// }