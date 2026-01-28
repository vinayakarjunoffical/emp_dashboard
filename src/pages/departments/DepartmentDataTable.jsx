import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel, // Required for search
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/comman/Table";
import Button from "../../components/comman/Button";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"; // Recommended icon library

export default function DepartmentDataTable({ columns = [], data = [] }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Hooking up the filter engine
  });

  return (
    <div className="flex flex-col gap-4">
      {/* TOOLBAR: SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            placeholder="Search departments, IDs, or locations..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 text-sm h-10">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          {/* Add extra action buttons here like "Add Department" */}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id} className="hover:bg-transparent border-b">
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="group hover:bg-slate-50/80 transition-colors border-b last:border-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-4 text-sm text-slate-600">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-slate-200" />
                      <p className="font-medium">No results found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* FOOTER / PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/30">
          <div className="hidden sm:block">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span> to <span className="font-semibold text-slate-700">
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}
              </span> of <span className="font-semibold text-slate-700">{data.length}</span> results
            </p>
          </div>

          <div className="flex items-center gap-2">
  {/* Previous Button */}
  <Button
    variant="outline"
    size="sm"
    className={`
      flex items-center gap-1 px-4 py-2 font-medium transition-all duration-200
      border-slate-200 bg-white text-slate-600
      hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200
      active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100
      shadow-sm rounded-lg
    `}
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
    <span>Previous</span>
  </Button>

  {/* Page Numbers Indicator (Optional but recommended for visual balance) */}
  <div className="hidden md:flex items-center px-4 h-9 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 tracking-wider">
    PAGE {table.getState().pagination.pageIndex + 1} OF {table.getPageCount()}
  </div>

  {/* Next Button */}
  <Button
    variant="outline"
    size="sm"
    className={`
      flex items-center gap-1 px-4 py-2 font-medium transition-all duration-200
      border-slate-200 bg-white text-slate-600
      hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200
      active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100
      shadow-sm rounded-lg
    `}
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
  </Button>
</div>
        </div>
      </div>
    </div>
  );
}

//******************************************************working code phase 3********************************************************** */

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
//   columns = [],
//   data = [],
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
//           {table.getHeaderGroups().map((group) => (
//             <TableRow key={group.id}>
//               {group.headers.map((header) => (
//                 <TableHead key={header.id}>
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext()
//                   )}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>

//         <TableBody>
//           {table.getRowModel().rows.map((row) => (
//             <TableRow key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <TableCell key={cell.id}>
//                   {flexRender(
//                     cell.column.columnDef.cell,
//                     cell.getContext()
//                   )}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <div className="flex justify-end gap-2 p-4">
//         <Button
//           variant="outline"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }
