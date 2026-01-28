import { createColumnHelper } from "@tanstack/react-table";
import DepartmentDataTable from "./DepartmentDataTable";
import Button from "../../components/comman/Button";
import { Edit2, Eye } from "lucide-react"; // Icons for a professional look

const columnHelper = createColumnHelper();

export default function DepartmentTable({ data, onEdit }) {
  const columns = [
    columnHelper.accessor("name", {
      header: "Department Name",
      cell: (info) => (
        <span className="font-semibold text-slate-800">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("code", {
      header: "Code",
      cell: (info) => (
        <code className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">
          {info.getValue()}
        </code>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <span className="text-slate-500 truncate max-w-[200px] block">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("is_active", {
      header: "Status",
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            isActive 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
            {isActive ? "Active" : "Inactive"}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* THE IMPROVED EDIT BUTTON */}
          <button
            onClick={() => onEdit(row.original)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all active:scale-95"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          
          {/* OPTIONAL: VIEW BUTTON FOR BALANCE */}
          {/* <button
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button> */}
        </div>
      ),
    }),
  ];

  return <DepartmentDataTable columns={columns} data={data} />;
}
//****************************************************************************************** */
// import { createColumnHelper } from "@tanstack/react-table";
// import DepartmentDataTable from "./DepartmentDataTable";
// import Button from "../../components/comman/Button";

// const columnHelper = createColumnHelper();

// export default function DepartmentTable({ data, onEdit }) {
//   const columns = [
//     columnHelper.accessor("name", {
//       header: "Department Name",
//     }),
//     columnHelper.accessor("code", {
//       header: "Code",
//     }),
//         columnHelper.accessor("description", {
//       header: "Description",
//     }),
//     columnHelper.accessor("is_active", {
//       header: "Status",
//       cell: (info) => (info.getValue() ? "Active" : "Inactive"),
//     }),
//     columnHelper.display({
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => (
//         <Button
//           size="sm"
//           onClick={() => onEdit(row.original)}
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


// import { createColumnHelper } from "@tanstack/react-table";
// import DepartmentDataTable from "./DepartmentDataTable";

// const columnHelper = createColumnHelper();

// export default function DepartmentTable({ data }) {
//   const columns = [
//     columnHelper.accessor("name", {
//       header: "Department Name",
//     }),
//     columnHelper.accessor("code", {
//       header: "Code",
//     }),
    // columnHelper.accessor("description", {
    //   header: "Description",
    // }),
//     columnHelper.accessor("is_active", {
//       header: "Status",
//       cell: (info) =>
//         info.getValue() ? "Active" : "Inactive",
//     }),
//   ];

//   return (
//     <DepartmentDataTable
//       columns={columns}
//       data={data}
//     />
//   );
// }


// import {
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/comman/Table";

// import Button from "../../components/comman/Button";

// export default function DepartmentDataTable({
//   columns = [],   // ✅ SAFE DEFAULT
//   data = [],      // ✅ SAFE DEFAULT
// }) {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   return (
//     <div className="rounded-md border bg-white">
//       <Table>
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <TableHead key={header.id}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>

//         <TableBody>
//           {table.getRowModel().rows.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(
//                       cell.column.columnDef.cell,
//                       cell.getContext()
//                     )}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell
//                 colSpan={columns.length || 1} // ✅ SAFE
//                 className="h-24 text-center"
//               >
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       <div className="flex items-center justify-end gap-2 p-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }


// export default function DepartmentTable({ data, onEdit }) {
//   return (
//     <div className="overflow-hidden rounded-xl border bg-white">
//       <table className="w-full text-sm">
//         <thead className="bg-slate-50 border-b">
//           <tr>
//             <th className="px-4 py-3 text-left">Department</th>
//             <th className="px-4 py-3 text-left">Code</th>
//             <th className="px-4 py-3 text-left">Description</th>
//             <th className="px-4 py-3 text-right">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map(dept => (
//             <tr
//               key={dept.id}
//               className="border-b last:border-0 hover:bg-slate-50"
//             >
//               <td className="px-4 py-3 font-medium">
//                 {dept.name}
//               </td>
//               <td className="px-4 py-3">
//                 {dept.code || "-"}
//               </td>
//               <td className="px-4 py-3 text-slate-600">
//                 {dept.description || "-"}
//               </td>
//               <td className="px-4 py-3 text-right">
//                 <button
//                   onClick={() => onEdit(dept.id)}
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
