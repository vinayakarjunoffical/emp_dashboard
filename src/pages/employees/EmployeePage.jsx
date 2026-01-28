
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
  Eye ,
} from "lucide-react";
import EmployeeForm from "./EmployeeForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { employeeService } from "../../services/employee.service";

const API_BASE = "https://emp-onbd-1.onrender.com";

export default function EmpPage() {
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "DEVP",
      code: "JOB-01",
      description: "TESTING",
      active: true,
    },
    {
      id: 2,
      name: "Sales",
      code: "Sales-01",
      description: "WORKING",
      active: true,
    },
    {
      id: 3,
      name: "HR & Admin",
      code: "HR-01",
      description: "HR with administrative responsibilities",
      active: false,
    },
  ]);

  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    active: true,
  });
  const [editId, setEditId] = useState(null);
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

  const handleFormSubmit = async (employeeData) => {
    try {
      if (editData) {
        // UPDATE
        await employeeService.update(editData.id, employeeData);
      } else {
        // CREATE
        await employeeService.create(employeeData);
      }

      setEditData(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const data = await employeeService.getById(id);
      setEditData(data);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const filteredEmployees = employees.filter((emp) => {
  const searchMatch =
    emp.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.employee_code?.toLowerCase().includes(searchText.toLowerCase())||
    emp.role?.toLowerCase().includes(searchText.toLocaleLowerCase());

  const statusMatch = statusFilter
    ? emp.status === statusFilter
    : true;

  return searchMatch && statusMatch;
});

const handleView = (id) => {
  navigate(`/employees/${id}`);
};



  return (
    <div className="min-h-screen  flex font-sans text-slate-900">
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col">
  

        <div className="p-8 grid grid-cols-12 gap-8">
       
          <div className="col-span-12 lg:col-span-4">
            <div className="p-0">
              <EmployeeForm
                initialData={editData}
                onSubmit={handleFormSubmit}
                buttonText={
                  editData ? "Update Records" : "Confirm Registration"
                }
              />

              {editData && (
                <button
                  onClick={() => setEditData(null)}
                  className="w-full mt-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel and add new instead
                </button>
              )}
            </div>
          </div>

          
          {/* RIGHT PANEL: DATA TABLE */}
<div className="col-span-12 lg:col-span-8">
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

    {/* TABLE TOOLBAR */}
    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
  placeholder="Search employees..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

        </div>

        <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
>
  <option value="">All Status</option>
  <option value="created">Created</option>
  
</select>

      </div>

     
    </div>

    {/* TABLE */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr className="border-b border-slate-200 whitespace-nowrap">
            {[
              "Employee Code",
              "Full Name",
              "Email",
              "Phone",
              "Role",
              "Joining Date",
              "Status",
            ].map((h) => (
              <th
                key={h}
                className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest"
              >
                {h}
              </th>
            ))}
            <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>

        

        <tbody className="divide-y divide-slate-100">
  {loading ? (
    <tr>
      <td colSpan={8} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-sm text-slate-500 font-medium">
            Loading employees...
          </span>
        </div>
      </td>
    </tr>
  ) : filteredEmployees.length === 0 ? (
    <tr>
      <td colSpan={8} className="py-12 text-center text-slate-500">
        No employees found
      </td>
    </tr>
  ) : (
    filteredEmployees.map((emp) => (
      <tr
        key={emp.id}
        className="hover:bg-slate-50 transition-colors whitespace-nowrap"
      >
        <td className="px-6 py-4 font-mono text-slate-700">
          {emp.employee_code}
        </td>

        <td className="px-6 py-4 font-semibold text-slate-800">
          {emp.full_name}
        </td>

        <td className="px-6 py-4 text-slate-600">
          {emp.email}
        </td>

        <td className="px-6 py-4 text-slate-600">
          {emp.phone}
        </td>

        <td className="px-6 py-4 capitalize text-slate-700">
          {emp.role}
        </td>

        <td className="px-6 py-4 text-slate-600">
          {emp.joining_date}
        </td>

        <td className="px-6 py-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            emp.status === "created"
              ? "bg-blue-50 text-blue-700"
              : emp.status === "active"
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}>
            {emp.status}
          </span>
        </td>

        <td className="px-6 py-4 text-right">
          <button
            onClick={() => handleEdit(emp.id)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
          >
            <Edit3 size={16} />
          </button>

           {/* VIEW */}
    <button
      onClick={() => handleView(emp.id)}
      className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
      title="View Employee"
    >
      <Eye size={16} />
    </button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>

    {/* FOOTER / PAGINATION */}
    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
      <span className="text-xs text-slate-500 font-medium">
        Showing 1–10 of {employees.length} employees
      </span>

      <div className="flex items-center gap-2">
        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
          <ChevronLeft size={16} />
        </button>

        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">
          1
        </button>

        <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
          2
        </button>

        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
</div>

        </div>
      </main>
    </div>
  );
}
///***************************phase 7******************************* */
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
// import EmployeeForm from "./EmployeeForm";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";

// const API_BASE = "https://emp-onbd-1.onrender.com";

// export default function EmpPage() {
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
//   {/* <option value="active">Active</option> */}
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

//         {/* <tbody className="divide-y divide-slate-100">
//        {filteredEmployees.map((emp) => (
//             <tr
//               key={emp.id}
//               className="hover:bg-slate-50 transition-colors whitespace-nowrap"
//             >
//               <td className="px-6 py-4 font-mono text-slate-700">
//                 {emp.employee_code}
//               </td>

//               <td className="px-6 py-4 font-semibold text-slate-800">
//                 {emp.full_name}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.email}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.phone}
//               </td>

//               <td className="px-6 py-4 capitalize text-slate-700">
//                 {emp.role}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.joining_date}
//               </td>

//               <td className="px-6 py-4">
//                 <span
//                   className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
//                     emp.status === "created"
//                       ? "bg-blue-50 text-blue-700"
//                       : emp.status === "active"
//                       ? "bg-green-50 text-green-700"
//                       : "bg-slate-100 text-slate-600"
//                   }`}
//                 >
//                   {emp.status === "active" ? (
//                     <CheckCircle2 size={14} />
//                   ) : (
//                     <XCircle size={14} />
//                   )}
//                   {emp.status}
//                 </span>
//               </td>

//               <td className="px-6 py-4 text-right">
//                 <div className="inline-flex items-center gap-2">
//                   <button
//                     onClick={() => handleEdit(emp.id)}
//                     className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
//                   >
//                     <Edit3 size={16} />
//                   </button>

//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody> */}

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
//******************************************phase 6******************************************** */
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
// } from "lucide-react";
// import EmployeeForm from "./EmployeeForm";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";

// const API_BASE = "https://emp-onbd-1.onrender.com";

// export default function EmpPage() {
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

//           {/* <div className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50/50 border-b border-slate-100">
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Employee Code
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Full Name
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Email
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Phone
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Role
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Joining Date
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {employees.map((emp) => (
//                       <tr key={emp.id} className="hover:bg-slate-50 whitespace-nowrap">
//                         <td className="px-6 py-4 font-mono text-sm text-slate-700">
//                           {emp.employee_code}
//                         </td>

//                         <td className="px-6 py-4 font-semibold text-slate-800">
//                           {emp.full_name}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.email}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.phone}
//                         </td>

//                         <td className="px-6 py-4 capitalize text-slate-700">
//                           {emp.role}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.joining_date}
//                         </td>

//                         <td className="px-6 py-4">
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               emp.status === "created"
//                                 ? "bg-blue-100 text-blue-700"
//                                 : emp.status === "active"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-slate-100 text-slate-600"
//                             }`}
//                           >
//                             {emp.status}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4 text-right space-x-3">
//                           <button
//                             onClick={() => handleEdit(emp.id)}
//                             className="text-blue-600 hover:text-blue-800"
//                           >
//                             <Edit3 size={16} />
//                           </button>

//                           <button
//                             onClick={() => handleDelete(emp.id)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

          
//               <div className="p-4 border-t border-slate-100 flex items-center justify-between">
//                 <span className="text-xs text-slate-500 font-medium">
//                   Showing 3 of 12 departments
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50">
//                     <ChevronLeft size={16} />
//                   </button>
//                   <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">
//                     1
//                   </button>
//                   <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
//                     2
//                   </button>
//                   <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div> */}
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
//   {/* <option value="active">Active</option> */}
// </select>

//       </div>

//       {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700">
//         <PlusCircle size={16} />
//         Add Employee
//       </button> */}
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
//        {filteredEmployees.map((emp) => (
//             <tr
//               key={emp.id}
//               className="hover:bg-slate-50 transition-colors whitespace-nowrap"
//             >
//               <td className="px-6 py-4 font-mono text-slate-700">
//                 {emp.employee_code}
//               </td>

//               <td className="px-6 py-4 font-semibold text-slate-800">
//                 {emp.full_name}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.email}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.phone}
//               </td>

//               <td className="px-6 py-4 capitalize text-slate-700">
//                 {emp.role}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.joining_date}
//               </td>

//               <td className="px-6 py-4">
//                 <span
//                   className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
//                     emp.status === "created"
//                       ? "bg-blue-50 text-blue-700"
//                       : emp.status === "active"
//                       ? "bg-green-50 text-green-700"
//                       : "bg-slate-100 text-slate-600"
//                   }`}
//                 >
//                   {emp.status === "active" ? (
//                     <CheckCircle2 size={14} />
//                   ) : (
//                     <XCircle size={14} />
//                   )}
//                   {emp.status}
//                 </span>
//               </td>

//               <td className="px-6 py-4 text-right">
//                 <div className="inline-flex items-center gap-2">
//                   <button
//                     onClick={() => handleEdit(emp.id)}
//                     className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
//                   >
//                     <Edit3 size={16} />
//                   </button>

//                   {/* <button
//                     onClick={() => handleDelete(emp.id)}
//                     className="p-2 rounded-lg hover:bg-red-50 text-red-600"
//                   >
//                     <Trash2 size={16} />
//                   </button> */}

//                   {/* <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
//                     <MoreVertical size={16} />
//                   </button> */}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
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

//********************************************working code phase 4************************************************ */

// import {
//   LayoutDashboard,
//   PlusCircle,
//   Search,
//   MoreVertical,
//   Edit3,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import EmployeeForm from "./EmployeeForm";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";

// const API_BASE = "https://emp-onbd-1.onrender.com";

// export default function EmpPage() {
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

//           {/* <div className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50/50 border-b border-slate-100">
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Employee Code
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Full Name
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Email
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Phone
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Role
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Joining Date
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {employees.map((emp) => (
//                       <tr key={emp.id} className="hover:bg-slate-50 whitespace-nowrap">
//                         <td className="px-6 py-4 font-mono text-sm text-slate-700">
//                           {emp.employee_code}
//                         </td>

//                         <td className="px-6 py-4 font-semibold text-slate-800">
//                           {emp.full_name}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.email}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.phone}
//                         </td>

//                         <td className="px-6 py-4 capitalize text-slate-700">
//                           {emp.role}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.joining_date}
//                         </td>

//                         <td className="px-6 py-4">
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               emp.status === "created"
//                                 ? "bg-blue-100 text-blue-700"
//                                 : emp.status === "active"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-slate-100 text-slate-600"
//                             }`}
//                           >
//                             {emp.status}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4 text-right space-x-3">
//                           <button
//                             onClick={() => handleEdit(emp.id)}
//                             className="text-blue-600 hover:text-blue-800"
//                           >
//                             <Edit3 size={16} />
//                           </button>

//                           <button
//                             onClick={() => handleDelete(emp.id)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

          
//               <div className="p-4 border-t border-slate-100 flex items-center justify-between">
//                 <span className="text-xs text-slate-500 font-medium">
//                   Showing 3 of 12 departments
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50">
//                     <ChevronLeft size={16} />
//                   </button>
//                   <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">
//                     1
//                   </button>
//                   <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
//                     2
//                   </button>
//                   <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div> */}
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
//   {/* <option value="active">Active</option> */}
// </select>

//       </div>

//       {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700">
//         <PlusCircle size={16} />
//         Add Employee
//       </button> */}
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
//        {filteredEmployees.map((emp) => (
//             <tr
//               key={emp.id}
//               className="hover:bg-slate-50 transition-colors whitespace-nowrap"
//             >
//               <td className="px-6 py-4 font-mono text-slate-700">
//                 {emp.employee_code}
//               </td>

//               <td className="px-6 py-4 font-semibold text-slate-800">
//                 {emp.full_name}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.email}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.phone}
//               </td>

//               <td className="px-6 py-4 capitalize text-slate-700">
//                 {emp.role}
//               </td>

//               <td className="px-6 py-4 text-slate-600">
//                 {emp.joining_date}
//               </td>

//               <td className="px-6 py-4">
//                 <span
//                   className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
//                     emp.status === "created"
//                       ? "bg-blue-50 text-blue-700"
//                       : emp.status === "active"
//                       ? "bg-green-50 text-green-700"
//                       : "bg-slate-100 text-slate-600"
//                   }`}
//                 >
//                   {emp.status === "active" ? (
//                     <CheckCircle2 size={14} />
//                   ) : (
//                     <XCircle size={14} />
//                   )}
//                   {emp.status}
//                 </span>
//               </td>

//               <td className="px-6 py-4 text-right">
//                 <div className="inline-flex items-center gap-2">
//                   <button
//                     onClick={() => handleEdit(emp.id)}
//                     className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
//                   >
//                     <Edit3 size={16} />
//                   </button>

//                   {/* <button
//                     onClick={() => handleDelete(emp.id)}
//                     className="p-2 rounded-lg hover:bg-red-50 text-red-600"
//                   >
//                     <Trash2 size={16} />
//                   </button> */}

//                   {/* <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
//                     <MoreVertical size={16} />
//                   </button> */}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
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
//*********************************************pphase 2***************************** */

// import {
//   LayoutDashboard,
//   PlusCircle,
//   Search,
//   MoreVertical,
//   Edit3,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import EmployeeForm from "./EmployeeForm";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";

// const API_BASE = "https://emp-onbd-1.onrender.com";

// export default function EmpPage() {
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

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 flex flex-col">
//         {/* TOP HEADER */}

//         <div className="p-8 grid grid-cols-12 gap-8">
//           {/* LEFT PANEL: INPUT FORM */}
//           <div className="col-span-12 lg:col-span-4">
//             <div className="p-6">
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
//           <div className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50/50 border-b border-slate-100">
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Employee Code
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Full Name
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Email
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Phone
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Role
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Joining Date
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {employees.map((emp) => (
//                       <tr key={emp.id} className="hover:bg-slate-50 whitespace-nowrap">
//                         <td className="px-6 py-4 font-mono text-sm text-slate-700">
//                           {emp.employee_code}
//                         </td>

//                         <td className="px-6 py-4 font-semibold text-slate-800">
//                           {emp.full_name}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.email}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.phone}
//                         </td>

//                         <td className="px-6 py-4 capitalize text-slate-700">
//                           {emp.role}
//                         </td>

//                         <td className="px-6 py-4 text-slate-600">
//                           {emp.joining_date}
//                         </td>

//                         <td className="px-6 py-4">
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               emp.status === "created"
//                                 ? "bg-blue-100 text-blue-700"
//                                 : emp.status === "active"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-slate-100 text-slate-600"
//                             }`}
//                           >
//                             {emp.status}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4 text-right space-x-3">
//                           <button
//                             onClick={() => handleEdit(emp.id)}
//                             className="text-blue-600 hover:text-blue-800"
//                           >
//                             <Edit3 size={16} />
//                           </button>

//                           <button
//                             onClick={() => handleDelete(emp.id)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* TABLE FOOTER / PAGINATION */}
//               <div className="p-4 border-t border-slate-100 flex items-center justify-between">
//                 <span className="text-xs text-slate-500 font-medium">
//                   Showing 3 of 12 departments
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50">
//                     <ChevronLeft size={16} />
//                   </button>
//                   <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">
//                     1
//                   </button>
//                   <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
//                     2
//                   </button>
//                   <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
//**************************************************working code phase 1************************************************* */
// import {
//   LayoutDashboard,
//   PlusCircle,
//   Search,
//   MoreVertical,
//   Edit3,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";
// import EmployeeForm from "./EmployeeForm";
// import { useEffect, useState } from "react";
// import { employeeService } from "../../services/employee.service";

// const API_BASE = "https://emp-onbd-1.onrender.com";

// export default function EmpPage() {
//   const [departments, setDepartments] = useState([
//     { id: 1, name: "DEVP", code: "JOB-01", description: "TESTING", active: true },
//     { id: 2, name: "Sales", code: "Sales-01", description: "WORKING", active: true },
//     { id: 3, name: "HR & Admin", code: "HR-01", description: "HR with administrative responsibilities", active: false },
//   ]);

//   const [editData, setEditData] = useState(null);

//   const [form, setForm] = useState({ name: "", code: "", description: "", active: true });
//   const [editId, setEditId] = useState(null);
//   const [employees, setEmployees] = useState([]);
// const [loading, setLoading] = useState(false);

// useEffect(() => {
//   fetchEmployees();
// }, []);

// const fetchEmployees = async () => {
//   try {
//     setLoading(true);
//     const data = await employeeService.getAll();
//     setEmployees(data);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };

// const handleFormSubmit = async (employeeData) => {
//   try {
//     if (editData) {
//       // UPDATE
//       await employeeService.update(editData.id, employeeData);
//     } else {
//       // CREATE
//       await employeeService.create(employeeData);
//     }

//     setEditData(null);
//     fetchEmployees();
//   } catch (err) {
//     console.error(err);
//   }
// };

//  const handleEdit = async (id) => {
//   try {
//     const data = await employeeService.getById(id);
//     setEditData(data);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const handleDelete = async (id) => {
//   if (!confirm("Delete this employee?")) return;

//   try {
//     await employeeService.remove(id);
//     fetchEmployees();
//   } catch (err) {
//     console.error(err);
//   }
// };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 flex flex-col">

//         {/* TOP HEADER */}

//         <div className="p-8 grid grid-cols-12 gap-8">

//           {/* LEFT PANEL: INPUT FORM */}
//           <div className="col-span-12 lg:col-span-4">
//             {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
//                 <h3 className="font-bold text-slate-800">
//                   {editId ? "Update Department" : "Add New Department"}
//                 </h3>
//                 <p className="text-xs text-slate-500 mt-1">Fill in the details to categorize your workforce.</p>
//               </div>
//               <form className="p-6 space-y-5">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Department Name</label>
//                   <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="e.g. Engineering" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Code</label>
//                   <input name="code" value={form.code} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="e.g. ENG-01" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Description</label>
//                   <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" placeholder="Briefly describe department goals..." />
//                 </div>

//                 <label className="flex items-center gap-3 cursor-pointer group">
//                   <div className="relative">
//                     <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="sr-only peer" />
//                     <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
//                     <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
//                   </div>
//                   <span className="text-sm font-medium text-slate-700">Set as Active</span>
//                 </label>

//                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]">
//                    {editId ? "Save Changes" : "Create Department"}
//                 </button>
//               </form>
//             </div> */}

//             <div className="p-6">
//           <EmployeeForm
//             initialData={editData}
//             onSubmit={handleFormSubmit}
//             buttonText={editData ? "Update Records" : "Confirm Registration"}
//           />

//           {editData && (
//             <button
//               onClick={() => setEditData(null)}
//               className="w-full mt-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
//             >
//               Cancel and add new instead
//             </button>
//           )}
//         </div>
//           </div>

//           {/* RIGHT PANEL: DATA TABLE */}
//           <div className="col-span-12 lg:col-span-8">
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//   <tr className="bg-slate-50/50 border-b border-slate-100">
//     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//       Employee Code
//     </th>
//     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//       Full Name
//     </th>
//     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//       Email
//     </th>
//     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//       Phone
//     </th>
//     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//       Role
//     </th>
//     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//       Joining Date
//     </th>
//     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//       Status
//     </th>
//     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
//       Actions
//     </th>
//   </tr>
// </thead>

// <tbody className="divide-y divide-slate-100">
//   {employees.map((emp) => (
//     <tr key={emp.id} className="hover:bg-slate-50">
//       <td className="px-6 py-4 font-mono text-sm text-slate-700">
//         {emp.employee_code}
//       </td>

//       <td className="px-6 py-4 font-semibold text-slate-800">
//         {emp.full_name}
//       </td>

//       <td className="px-6 py-4 text-slate-600">
//         {emp.email}
//       </td>

//       <td className="px-6 py-4 text-slate-600">
//         {emp.phone}
//       </td>

//       <td className="px-6 py-4 capitalize text-slate-700">
//         {emp.role}
//       </td>

//       <td className="px-6 py-4 text-slate-600">
//         {emp.joining_date}
//       </td>

//       <td className="px-6 py-4">
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//             emp.status === "created"
//               ? "bg-blue-100 text-blue-700"
//               : emp.status === "active"
//               ? "bg-green-100 text-green-700"
//               : "bg-slate-100 text-slate-600"
//           }`}
//         >
//           {emp.status}
//         </span>
//       </td>

//       <td className="px-6 py-4 text-right space-x-3">
//         <button
//           onClick={() => handleEdit(emp.id)}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           <Edit3 size={16} />
//         </button>

//         <button
//           onClick={() => handleDelete(emp.id)}
//           className="text-red-600 hover:text-red-800"
//         >
//           <Trash2 size={16} />
//         </button>
//       </td>
//     </tr>
//   ))}
// </tbody>

//                 </table>
//               </div>

//               {/* TABLE FOOTER / PAGINATION */}
//               <div className="p-4 border-t border-slate-100 flex items-center justify-between">
//                 <span className="text-xs text-slate-500 font-medium">Showing 3 of 12 departments</span>
//                 <div className="flex items-center gap-2">
//                   <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={16}/></button>
//                   <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">1</button>
//                   <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">2</button>
//                   <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50"><ChevronRight size={16}/></button>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }

// import { useState } from "react";

// const API_BASE = "https://emp-onbd-1.onrender.com";

// export default function EmployeePage() {
//   const [employees, setEmployees] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [exitEmp, setExitEmp] = useState(null);

//   const [form, setForm] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     joining_date: "",
//   });

//   const [exitForm, setExitForm] = useState({
//     exit_date: "",
//     exit_reason: "",
//   });

//   /* ---------- handlers ---------- */
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleExitChange = (e) =>
//     setExitForm({ ...exitForm, [e.target.name]: e.target.value });

//   /* ---------- create / update ---------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       full_name: form.full_name,
//       email: form.email,
//       phone: form.phone,
//       department_id: Number(form.department_id),
//       role: form.role,
//       joining_date: form.joining_date,
//     };

//     const url = editId
//       ? `${API_BASE}/employees/${editId}`
//       : `${API_BASE}/employees`;

//     const method = editId ? "PUT" : "POST";

//     await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     setEmployees((prev) =>
//       editId
//         ? prev.map((e) => (e.id === editId ? { ...e, ...payload } : e))
//         : [...prev, { id: Date.now(), ...payload }]
//     );

//     setEditId(null);
//     setForm({
//       full_name: "",
//       email: "",
//       phone: "",
//       department_id: "",
//       role: "",
//       joining_date: "",
//     });
//   };

//   /* ---------- edit ---------- */
//   const handleEdit = (emp) => {
//     setEditId(emp.id);
//     setForm(emp);
//   };

//   /* ---------- exit employee ---------- */
//   const submitExit = async () => {
//     await fetch(`${API_BASE}/employees/${exitEmp.id}/exit`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(exitForm),
//     });

//     setEmployees((prev) =>
//       prev.map((e) =>
//         e.id === exitEmp.id ? { ...e, exited: true } : e
//       )
//     );

//     setExitEmp(null);
//     setExitForm({ exit_date: "", exit_reason: "" });
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* LEFT FORM */}
//       <div className="lg:col-span-1 bg-white border rounded-xl p-5">
//         <h2 className="text-lg font-semibold mb-4">
//           {editId ? "Update Employee" : "Add Employee"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input className="input" name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} required />
//           <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
//           <input className="input" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
//           <input className="input" name="department_id" type="number" placeholder="Department ID" value={form.department_id} onChange={handleChange} required />
//           <input className="input" name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
//           <input className="input" name="joining_date" type="date" value={form.joining_date} onChange={handleChange} required />

//           <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
//             {editId ? "Update Employee" : "Create Employee"}
//           </button>
//         </form>
//       </div>

//       {/* RIGHT TABLE */}
//       <div className="lg:col-span-2 bg-white border rounded-xl p-5">
//         <h2 className="text-lg font-semibold mb-4">Employee List</h2>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="th">Name</th>
//                 <th className="th">Email</th>
//                 <th className="th">Role</th>
//                 <th className="th">Dept</th>
//                 <th className="th">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="text-center py-4 text-gray-500">
//                     No employees found
//                   </td>
//                 </tr>
//               )}

//               {employees.map((emp) => (
//                 <tr key={emp.id} className="border-t">
//                   <td className="td">{emp.full_name}</td>
//                   <td className="td">{emp.email}</td>
//                   <td className="td">{emp.role}</td>
//                   <td className="td">{emp.department_id}</td>
//                   <td className="td space-x-2">
//                     <button
//                       onClick={() => handleEdit(emp)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setExitEmp(emp)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Exit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* EXIT MODAL */}
//       {exitEmp && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl w-full max-w-md p-6">
//             <h3 className="text-lg font-semibold mb-2">Exit Employee</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               {exitEmp.full_name}
//             </p>

//             <div className="space-y-3">
//               <input
//                 type="date"
//                 name="exit_date"
//                 value={exitForm.exit_date}
//                 onChange={handleExitChange}
//                 className="input"
//                 required
//               />

//               <textarea
//                 name="exit_reason"
//                 placeholder="Exit reason"
//                 value={exitForm.exit_reason}
//                 onChange={handleExitChange}
//                 className="input h-24"
//                 required
//               />
//             </div>

//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setExitEmp(null)}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitExit}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg"
//               >
//                 Confirm Exit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
