import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Briefcase, Calendar, Building2, Save } from "lucide-react";
import { departmentService } from "../../services/department.service"
export default function EmployeeForm({ initialData, onSubmit, buttonText = "Save Employee" }) {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department_id: "",
    role: "",
    joining_date: "",
  });

  const resetForm = () => {
  setFormData({
    full_name: "",
    email: "",
    phone: "",
    department_id: "",
    role: "",
    joining_date: "",
  });
};

useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments", error);
    }
  };

  fetchDepartments();
}, []);



  // Sync state if initialData changes (e.g., when clicking Edit)
  // useEffect(() => {
  //   if (initialData) setFormData(initialData);
  // }, [initialData]);

  useEffect(() => {
  if (initialData) {
    setFormData(initialData);
  } else {
    resetForm();
  }
}, [initialData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSubmit(formData);
  // };

  const handleSubmit = (e) => {
  e.preventDefault();
  onSubmit(formData);

  // Clear form ONLY when adding new employee
  if (!initialData) {
    resetForm();
  }
};


  const inputStyle = "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm";
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1";
  const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

       {/* HEADER */}
    <div className="mb-1 pb-1 border-b border-slate-100">
      <h2 className="text-lg font-bold text-slate-800">
        {initialData ? "Edit Employee" : "Add Employee"}
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        {initialData
          ? "Update employee details"
          : "Enter details to register a new employee"}
      </p>
    </div>
      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className={labelStyle}>Full Name</label>
        <div className="relative">
          <User className={iconStyle} />
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            className={inputStyle}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label className={labelStyle}>Email</label>
          <div className="relative">
            <Mail className={iconStyle} />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              className={inputStyle}
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelStyle}>Phone</label>
          <div className="relative">
            <Phone className={iconStyle} />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
              className={inputStyle}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Department */}
        {/* <div>
          <label className={labelStyle}>Department ID</label>
          <div className="relative">
            <Building2 className={iconStyle} />
            <input
              name="department_id"
              type="number"
              value={formData.department_id}
              onChange={handleChange}
              placeholder="e.g. 1"
              className={inputStyle}
              required
            />
          </div>
        </div> */}

        <div>
  <label className={labelStyle}>Department</label>
  <div className="relative">
    <Building2 className={iconStyle} />
    <select
      name="department_id"
      value={formData.department_id}
      onChange={handleChange}
      className={inputStyle}
      required
    >
      <option value="">Select Department</option>
      {departments.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.name}
        </option>
      ))}
    </select>
  </div>
</div>


        {/* Role */}
        <div>
          <label className={labelStyle}>Role</label>
          <div className="relative">
            <Briefcase className={iconStyle} />
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Software Engineer"
              className={inputStyle}
              required
            />
          </div>
        </div>
      </div>

      {/* Joining Date */}
      <div>
        <label className={labelStyle}>Joining Date</label>
        <div className="relative">
          <Calendar className={iconStyle} />
          <input
            name="joining_date"
            type="date"
            value={formData.joining_date}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-4"
      >
        <Save size={18} />
        {buttonText}
      </button>
    </form>
    </div>
  );
}
//*********************************************working code************************************************** */
// import React, { useEffect, useState } from "react";
// import { User, Mail, Phone, Briefcase, Calendar, Building2, Save } from "lucide-react";

// export default function EmployeeForm({ initialData, onSubmit, buttonText = "Save Employee" }) {
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     joining_date: "",
//   });

//   const resetForm = () => {
//   setFormData({
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     joining_date: "",
//   });
// };


//   // Sync state if initialData changes (e.g., when clicking Edit)
//   // useEffect(() => {
//   //   if (initialData) setFormData(initialData);
//   // }, [initialData]);

//   useEffect(() => {
//   if (initialData) {
//     setFormData(initialData);
//   } else {
//     resetForm();
//   }
// }, [initialData]);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   onSubmit(formData);
//   // };

//   const handleSubmit = (e) => {
//   e.preventDefault();
//   onSubmit(formData);

//   // Clear form ONLY when adding new employee
//   if (!initialData) {
//     resetForm();
//   }
// };


//   const inputStyle = "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm";
//   const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1";
//   const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5 p-1">
//       {/* Full Name */}
//       <div>
//         <label className={labelStyle}>Full Name</label>
//         <div className="relative">
//           <User className={iconStyle} />
//           <input
//             name="full_name"
//             value={formData.full_name}
//             onChange={handleChange}
//             placeholder="John Doe"
//             className={inputStyle}
//             required
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Email */}
//         <div>
//           <label className={labelStyle}>Email</label>
//           <div className="relative">
//             <Mail className={iconStyle} />
//             <input
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="john@company.com"
//               className={inputStyle}
//               required
//             />
//           </div>
//         </div>

//         {/* Phone */}
//         <div>
//           <label className={labelStyle}>Phone</label>
//           <div className="relative">
//             <Phone className={iconStyle} />
//             <input
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="+1 234 567 890"
//               className={inputStyle}
//               required
//             />
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Department */}
//         <div>
//           <label className={labelStyle}>Department ID</label>
//           <div className="relative">
//             <Building2 className={iconStyle} />
//             <input
//               name="department_id"
//               type="number"
//               value={formData.department_id}
//               onChange={handleChange}
//               placeholder="e.g. 1"
//               className={inputStyle}
//               required
//             />
//           </div>
//         </div>

//         {/* Role */}
//         <div>
//           <label className={labelStyle}>Role</label>
//           <div className="relative">
//             <Briefcase className={iconStyle} />
//             <input
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               placeholder="Software Engineer"
//               className={inputStyle}
//               required
//             />
//           </div>
//         </div>
//       </div>

//       {/* Joining Date */}
//       <div>
//         <label className={labelStyle}>Joining Date</label>
//         <div className="relative">
//           <Calendar className={iconStyle} />
//           <input
//             name="joining_date"
//             type="date"
//             value={formData.joining_date}
//             onChange={handleChange}
//             className={inputStyle}
//             required
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-4"
//       >
//         <Save size={18} />
//         {buttonText}
//       </button>
//     </form>
//   );
// }