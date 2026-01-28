import { useEffect, useState } from "react";
import { departmentService } from "../../services/department.service";
import Button from "../../components/comman/Button";
import { PlusCircle, Edit3, X } from "lucide-react";

export default function DepartmentForm({ department, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const isEditing = !!department?.id;

  useEffect(() => {
    if (isEditing) {
      departmentService.getById(department.id).then((data) => {
        setForm({
          name: data.name || "",
          code: data.code || "",
          description: data.description || "",
          is_active: data.is_active ?? true,
        });
      });
    } else {
      // Reset form if department becomes null (Add mode)
      resetForm();
    }
  }, [department]);

  const resetForm = () => {
    setForm({ name: "", code: "", description: "", is_active: true });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Department name is required";
    if (!form.code.trim()) newErrors.code = "Code is required";
    if (form.description.length > 0 && form.description.length < 5) {
      newErrors.description = "Description must be at least 5 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      await departmentService.update(department.id, form);
    } else {
      await departmentService.create(form);
    }

    onSuccess();
    resetForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-6 border border-slate-200 rounded-xl shadow-sm"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Edit3 className="w-5 h-5 text-indigo-600" />
          ) : (
            <PlusCircle className="w-5 h-5 text-emerald-600" />
          )}
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? "Edit Department" : "Add New Department"}
          </h2>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Department Name</label>
          <input
            className={`w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
              errors.name ? "border-red-500 bg-red-50" : "border-slate-200"
            }`}
            placeholder="e.g. Human Resources"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Code Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Department Code</label>
          <input
            className={`w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
              errors.code ? "border-red-500 bg-red-50" : "border-slate-200"
            }`}
            placeholder="e.g. HR-01"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            className={`w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none ${
              errors.description ? "border-red-500 bg-red-50" : "border-slate-200"
            }`}
            placeholder="Briefly describe the department's purpose..."
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-3 py-2">
          <div 
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${form.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${form.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm font-medium text-slate-600">Active Status</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          type="submit" 
          className={`flex-1 py-3 rounded-lg font-semibold shadow-md transition-all active:scale-[0.98] ${
            isEditing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
          } text-white`}
        >
          {isEditing ? "Save Changes" : "Create Department"}
        </Button>
        
        {isEditing && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

//*********************************************************************************************** */
// import { useEffect, useState } from "react";
// import { departmentService } from "../../services/department.service";
// import Button from "../../components/comman/Button";

// export default function DepartmentForm({ department, onSuccess }) {
//   const [form, setForm] = useState({
//     name: "",
//     code: "",
//     description: "",
//     is_active: true,
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (department?.id) {
//       departmentService.getById(department.id).then((data) => {
//         setForm({
//           name: data.name || "",
//           code: data.code || "",
//           description: data.description || "",
//           is_active: data.is_active ?? true,
//         });
//       });
//     }
//   }, [department]);

//   const validate = () => {
//     const newErrors = {};

//     if (!form.name.trim()) {
//       newErrors.name = "Department name is required";
//     }

//     if (!form.code.trim()) {
//       newErrors.code = "Department code is required";
//     }

//     if (!form.description.trim()) {
//       newErrors.description = "Description is required";
//     } else if (form.description.length < 5) {
//       newErrors.description = "Description must be at least 5 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     if (department?.id) {
//       await departmentService.update(department.id, {
//         name: form.name,
//         code: form.code,
//         description: form.description,
//       });
//     } else {
//       await departmentService.create({
//         name: form.name,
//         code: form.code,
//         description: form.description,
//         is_active: form.is_active,
//       });
//     }

//     onSuccess();
//     setForm({
//       name: "",
//       code: "",
//       description: "",
//       is_active: true,
//     });
//     setErrors({});
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 bg-white p-4 border rounded"
//     >
//       <h2 className="text-lg font-semibold">
//         {department ? "Edit Department" : "Add Department"}
//       </h2>

//       {/* Name */}
//       <div>
//         <input
//           className="w-full border px-3 py-2 rounded"
//           placeholder="Department Name"
//           value={form.name}
//           onChange={(e) =>
//             setForm({ ...form, name: e.target.value })
//           }
//         />
//         {errors.name && (
//           <p className="text-red-500 text-sm">{errors.name}</p>
//         )}
//       </div>

//       {/* Code */}
//       <div>
//         <input
//           className="w-full border px-3 py-2 rounded"
//           placeholder="Code"
//           value={form.code}
//           onChange={(e) =>
//             setForm({ ...form, code: e.target.value })
//           }
//         />
//         {errors.code && (
//           <p className="text-red-500 text-sm">{errors.code}</p>
//         )}
//       </div>

//       {/* Description */}
//       <div>
//         <textarea
//           className="w-full border px-3 py-2 rounded"
//           placeholder="Description"
//           rows={3}
//           value={form.description}
//           onChange={(e) =>
//             setForm({ ...form, description: e.target.value })
//           }
//         />
//         {errors.description && (
//           <p className="text-red-500 text-sm">
//             {errors.description}
//           </p>
//         )}
//       </div>

//       {/* Active */}
//       <label className="flex gap-2 items-center">
//         <input
//           type="checkbox"
//           checked={form.is_active}
//           onChange={(e) =>
//             setForm({ ...form, is_active: e.target.checked })
//           }
//         />
//         Active
//       </label>

//       <Button type="submit">
//         {department ? "Update" : "Create"}
//       </Button>
//     </form>
//   );
// }
