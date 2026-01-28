import { useEffect, useState } from "react";
import { departmentService } from "../../services/department.service";
import DepartmentTable from "./DepartmentTable";
import DepartmentForm from "../departments/DepartmentForm";
import { PlusCircle } from "lucide-react";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = () => {
    departmentService
      .getAll()
      .then((res) => setDepartments(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFormSuccess = () => {
    fetchDepartments();
    setSelectedDepartment(null); // Reset to Add mode
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center text-slate-500 font-medium">
      Loading departments...
    </div>
  );

  return (
    <main className="flex-1 flex flex-col bg-slate-50/50 min-h-screen">
      {/* HEADER AREA */}
      <div className="px-8 pt-8">
        <h1 className="text-2xl font-bold text-slate-800">Department Management</h1>
        <p className="text-slate-500 text-sm">Create, edit, and manage company departments.</p>
      </div>

      <div className="p-8 grid grid-cols-12 gap-8">
        
        {/* LEFT: Form Section */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-8">
            <DepartmentForm
              department={selectedDepartment}
              onSuccess={handleFormSuccess}
              // If your DepartmentForm has an internal Cancel button, 
              // you can pass this same function:
              onCancel={() => setSelectedDepartment(null)}
            />

            {/* REDIRECT / CANCEL BUTTON BELOW FORM */}
            {selectedDepartment && (
              <button
                onClick={() => setSelectedDepartment(null)}
                className="group w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
                Cancel and add new instead
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Table Section */}
        <div className="col-span-12 lg:col-span-8">
          <DepartmentTable
            data={departments}
            onEdit={(dept) => setSelectedDepartment(dept)}
          />
        </div>
      </div>
    </main>
  );
}
//****************************************working code phase 2*************************************************** */
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { departmentService } from "../../services/department.service";
// import DepartmentTable from "./DepartmentTable";
// import DepartmentForm from "../departments/DepartmentForm";

// export default function DepartmentList() {
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     departmentService
//       .getAll()
//       .then((res) => setDepartments(res))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="grid grid-cols-12 gap-6">
//       {/* LEFT: Add / Edit Form */}
//       <div className="col-span-4">
//         <DepartmentForm
//           department={selectedDepartment}
//           onSuccess={() => {
//             departmentService.getAll().then(setDepartments);
//             setSelectedDepartment(null);
//           }}
//         />
//       </div>

//       {/* RIGHT: Table */}
//       <div className="col-span-8">
//         <DepartmentTable
//           data={departments}
//           onEdit={(dept) => setSelectedDepartment(dept)}
//         />
//       </div>
//     </div>
//   );
// }

//************************************************************************************************** */

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { departmentService } from "../../services/department.service";
// import DepartmentTable from "./DepartmentTable";

// export default function DepartmentList() {
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     departmentService
//       .getAll()
//       .then((res) => setDepartments(res))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold">Departments</h1>

//         <button
//           onClick={() => navigate("/departments/add")}
//           className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm"
//         >
//           + Add Department
//         </button>
//       </div>

//       <DepartmentTable data={departments} />
//     </div>
//   );
// }



// import { createColumnHelper } from "@tanstack/react-table";
// import DepartmentDataTable from "../departments/DepartmentTable";
// import Button from "../../components/comman/Button";

// const columnHelper = createColumnHelper();

// export default function DepartmentTable({ data, onEdit }) {
//   const columns = [
//     columnHelper.accessor("name", {
//       header: "Department Name",
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor("code", {
//       header: "Code",
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.display({
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => (
//         <Button
//           size="sm"
//           onClick={() => onEdit(row.original.id)}
//         >
//           Edit
//         </Button>
//       ),
//     }),
//   ];

//   return (
//     <DepartmentDataTable
//       columns={columns}
//       data={data}
//     />
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { departmentService } from "../../services/department.service";
// import DepartmentTable from "../../pages/departments/DepartmentTable";

// export default function DepartmentList() {
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     departmentService.getAll().then(setDepartments);
//   }, []);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold">
//           Departments
//         </h1>

//         <button
//           onClick={() => navigate("/departments/add")}
//           className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm"
//         >
//           + Add Department
//         </button>
//       </div>

//       {/* Table */}
//       <DepartmentTable
//         data={departments}
//         onEdit={(id) => navigate(`/departments/edit/${id}`)}
//       />
//     </div>
//   );
// }
