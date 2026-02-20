import React, { useEffect, useState, useCallback } from "react";
import {
  User, Mail, Phone, Briefcase, Building2, Save, MapPin, 
  Globe, Map, Navigation, Loader2, ShieldAlert, Heart, Droplets, Zap
} from "lucide-react";
import { departmentService } from "../../services/department.service";
import toast, { Toaster } from "react-hot-toast";

export default function EmployeeDemoForm({
  initialData,
  onSubmit,
  buttonText = "Save Employee",
}) {
  const [departments, setDepartments] = useState([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department_id: "",
    role: "",
    pincode: "",

    state: "",
    district: "",
    country: "India",
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_phone: "",
    blood_group: "",
    is_fresher: false,
  });

  const resetForm = useCallback(() => {
    setFormData({
      full_name: "", email: "", phone: "", department_id: "", role: "",
      joining_date: "null", pincode: "", state: "", district: "", country: "India",
      emergency_contact_name: "", emergency_contact_relation: "",
      emergency_contact_phone: "", blood_group: "", is_fresher: false,
    });
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getAll();
        setDepartments(data);
      } catch (error) {
        toast.error("Failed to load department list");
      }
    };
    fetchDepartments();
  }, []);

  // useEffect(() => {
  //   if (initialData) {
  //     setFormData(initialData);
  //   } else {
  //     resetForm();
  //   }
  // }, [initialData, resetForm]);

  useEffect(() => {
  if (initialData) {
    setFormData({
      full_name: initialData.full_name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      department_id: initialData.department_id || "",
      role: initialData.role || "",
      pincode: initialData.pincode || "",
      state: initialData.state || "",
      district: initialData.district || "",
      country: initialData.country || "India",
      emergency_contact_name: initialData.emergency_contact_name || "",
      emergency_contact_relation: initialData.emergency_contact_relation || "",
      emergency_contact_phone: initialData.emergency_contact_phone || "",
      blood_group: initialData.blood_group || "",
      is_fresher: initialData.is_fresher || false,
    });
  } else {
    resetForm();
  }
}, [initialData, resetForm]);


  useEffect(() => {
    const fetchAddress = async () => {
      if (formData.pincode.length === 6) {
        setPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await res.json();
          if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            setFormData((prev) => ({
              ...prev,
              state: details.State,
              district: details.District,
              country: details.Country,
            }));
            toast.success(`Location: ${details.District}`);
          } else {
            toast.error("Invalid Pincode");
          }
        } catch (error) {
          toast.error("Pincode service unavailable");
        } finally {
          setPincodeLoading(false);
        }
      }
    };
    fetchAddress();
  }, [formData.pincode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(initialData ? "Updated successfully!" : "Registered successfully!");
      if (!initialData) resetForm();
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all text-[13px] font-bold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-300 shadow-sm shadow-slate-100/50";
  const labelStyle = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1";
  const iconStyle = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 group-focus-within:text-blue-500 transition-colors";

  return (
    <div className="w-full bg-[#FBFCFE] p-8 rounded-[3rem] border border-slate-100">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* MODULE 1: PRIMARY IDENTITY */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
             <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <User size={16} />
             </div>
             <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Primary Identity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Core Associate Metadata</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <FormInput label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} icon={<User className={iconStyle}/>} required disabled={isSubmitting} />
            <FormInput label="Communications Email" name="email" type="email" value={formData.email} onChange={handleChange} icon={<Mail className={iconStyle}/>} required disabled={isSubmitting} />
            <FormInput label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} required disabled={isSubmitting} />
            
            <div className="space-y-1 group">
              <label className={labelStyle}>Assigned Department</label>
              <div className="relative">
                <Building2 className={iconStyle} />
                <select name="department_id" value={formData.department_id} onChange={handleChange} className={inputStyle} required disabled={isSubmitting}>
                  <option value="">Select Domain</option>
                  {departments.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                </select>
              </div>
            </div>

            <FormInput label="Organizational Role" name="role" value={formData.role} onChange={handleChange} icon={<Briefcase className={iconStyle}/>} required disabled={isSubmitting} />
            
           <div className="space-y-1">
  {/* FORM LABEL - Matches the rest of your registry */}
  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">
    Experience Level
  </label>

  <div className="flex items-center h-[46px]"> {/* Fixed height to match Input components */}
    <label 
      className={`
        relative flex items-center justify-between w-full h-full px-4 rounded-2xl border transition-all cursor-pointer shadow-sm
        ${formData.is_fresher 
          ? "bg-amber-50/50 border-amber-200 ring-4 ring-amber-500/5" 
          : "bg-white border-slate-200 hover:border-slate-300"}
      `}
    >
      <input 
        type="checkbox" 
        name="is_fresher" 
        checked={formData.is_fresher} 
        onChange={handleChange} 
        disabled={isSubmitting} 
        className="hidden" // Hide the default browser checkbox
      />
      
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg transition-colors ${formData.is_fresher ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400"}`}>
          <Zap size={14} fill={formData.is_fresher ? "currentColor" : "none"} />
        </div>
        <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${formData.is_fresher ? "text-amber-700" : "text-slate-500"}`}>
          Fresher
        </span>
      </div>

      {/* VISUAL SWITCH - Enterprise Standard */}
      <div className={`w-8 h-4 rounded-full relative transition-colors ${formData.is_fresher ? "bg-emerald-500" : "bg-slate-200"}`}>
        <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${formData.is_fresher ? "left-5" : "left-1"}`} />
      </div>
    </label>
  </div>
</div>
          </div>
        </section>

        {/* MODULE 2: REGIONAL NODE (LOCATION) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
             <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <MapPin size={16} />
             </div>
             <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Regional Registry</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Geographic Deployment Logic</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1 group">
              <label className={labelStyle}>Pincode Index</label>
              <div className="relative">
                {pincodeLoading ? <Loader2 className={`${iconStyle} animate-spin text-blue-500`} /> : <Navigation className={iconStyle} />}
                <input name="pincode" maxLength={6} value={formData.pincode} onChange={handleChange} className={`${inputStyle} tracking-[0.2em] font-mono`} required disabled={isSubmitting} placeholder="000000" />
              </div>
            </div>
            <FormInput label="District Node" name="district" value={formData.district} readOnly icon={<MapPin className={iconStyle}/>} />
            <FormInput label="State Jurisdiction" name="state" value={formData.state} readOnly icon={<Map className={iconStyle}/>} />
            <FormInput label="Country Sovereign" name="country" value={formData.country} readOnly icon={<Globe className={iconStyle}/>} />
          </div>
        </section>

        {/* MODULE 3: EMERGENCY PROTOCOL & HEALTH */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
             <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-100">
                <ShieldAlert size={16} />
             </div>
             <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Contingency Protocol</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact & Health Registry</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormInput label="Emergency Contact Name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} icon={<User className={iconStyle}/>} disabled={isSubmitting} />
            <FormInput label="Emergency Relation" name="emergency_contact_relation" value={formData.emergency_contact_relation} onChange={handleChange} icon={<Heart className={iconStyle}/>} disabled={isSubmitting} />
            <FormInput label="Emergency Phone Contact" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} icon={<Phone className={iconStyle}/>} disabled={isSubmitting} />
            
            <div className="space-y-1 group">
              <label className={labelStyle}>Blood Group Index</label>
              <div className="relative">
                <Droplets className={iconStyle} />
                <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={inputStyle} disabled={isSubmitting}>
                  <option value="">Select Group</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* SUBMISSION ACTION */}
        <div className="flex justify-end pt-8 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting || pincodeLoading}
            className="group flex items-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-black text-[11px] uppercase tracking-[0.2em] px-12 py-4 rounded-2xl transition-all shadow-2xl shadow-slate-200 active:scale-95"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={18} /> Protocol Executing...</>
            ) : (
              <><Save size={18} className="group-hover:scale-110 transition-transform" /> {buttonText}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable Input Sub-component for clean code
const FormInput = ({ label, icon, ...props }) => {
  const labelStyle = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1";
  const inputStyle = "w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all text-[13px] font-bold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-300 shadow-sm shadow-slate-100/50";
  return (
    <div className="space-y-1 group">
      <label className={labelStyle}>{label}</label>
      <div className="relative">
        {icon}
        <input {...props} className={`${inputStyle} ${props.readOnly ? 'cursor-default' : ''}`} />
      </div>
    </div>
  );
};
//*********************************************************working code phase 1 14/02/26*************************************************************** */
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   User,
//   Mail,
//   Phone,
//   Briefcase,
//   Building2,
//   Save,
//   MapPin,
//   Globe,
//   Map,
//   Navigation,
//   Loader2,
// } from "lucide-react";
// import { departmentService } from "../../services/department.service";
// import toast, { Toaster } from "react-hot-toast";

// export default function EmployeeDemoForm({
//   initialData,
//   onSubmit,
//   buttonText = "Save Employee",
// }) {
//   const [departments, setDepartments] = useState([]);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     pincode: "",
//     joining_date: "null",
//     state: "",
//     district: "",
//     country: "India",
//   });

//   const resetForm = useCallback(() => {
//     setFormData({
//       full_name: "",
//       email: "",
//       phone: "",
//       department_id: "",
//       role: "",
//       joining_date: "null",
//       pincode: "",
//       state: "",
//       district: "",
//       country: "India",
//     });
//   }, []);

//   // Sync Departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const data = await departmentService.getAll();
//         setDepartments(data);
//       } catch (error) {
//         toast.error("Failed to load department list");
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // Sync Initial Data
//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     } else {
//       resetForm();
//     }
//   }, [initialData, resetForm]);

//   // Handle Pincode Lookups
//   useEffect(() => {
//     const fetchAddress = async () => {
//       if (formData.pincode.length === 6) {
//         setPincodeLoading(true);
//         try {
//           const res = await fetch(
//             `https://api.postalpincode.in/pincode/${formData.pincode}`,
//           );
//           const data = await res.json();
//           if (data[0].Status === "Success") {
//             const details = data[0].PostOffice[0];
//             setFormData((prev) => ({
//               ...prev,
//               state: details.State,
//               district: details.District,
//               country: details.Country,
//             }));
//             toast.success(`Location: ${details.District}`);
//           } else {
//             toast.error("Invalid Pincode");
//           }
//         } catch (error) {
//           toast.error("Pincode service unavailable");
//         } finally {
//           setPincodeLoading(false);
//         }
//       }
//     };
//     fetchAddress();
//   }, [formData.pincode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // IMPORTANT: Parent must return the promise from employeeService
//       await onSubmit(formData);

//       toast.success(
//         initialData ? "Updated successfully!" : "Registered successfully!",
//       );

//       if (!initialData) resetForm();
//     } catch (error) {
//       // This now catches the Error thrown from your service
//       console.error("Form error:", error.message);
//       toast.error(error.message || "An unexpected error occurred");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const inputStyle =
//     "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400";
//   const labelStyle =
//     "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5";
//   const iconStyle =
//     "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

//   return (
//     <div className="w-full bg-white">
//       <Toaster position="top-right" />
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
//           {/* Full Name */}
//           <div>
//             <label className={labelStyle}>Full Name</label>
//             <div className="relative">
//               <User className={iconStyle} />
//               <input
//                 name="full_name"
//                 value={formData.full_name}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className={labelStyle}>Email</label>
//             <div className="relative">
//               <Mail className={iconStyle} />
//               <input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           {/* Phone */}
//           <div>
//             <label className={labelStyle}>Phone</label>
//             <div className="relative">
//               <Phone className={iconStyle} />
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           {/* Department */}
//           <div>
//             <label className={labelStyle}>Department</label>
//             <div className="relative">
//               <Building2 className={iconStyle} />
//               <select
//                 name="department_id"
//                 value={formData.department_id}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//                 disabled={isSubmitting}
//               >
//                 <option value="">Select</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Role */}
//           <div>
//             <label className={labelStyle}>Role</label>
//             <div className="relative">
//               <Briefcase className={iconStyle} />
//               <input
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           {/* Pincode */}
//           <div>
//             <label className={labelStyle}>Pincode</label>
//             <div className="relative">
//               {pincodeLoading ? (
//                 <Loader2 className={`${iconStyle} animate-spin`} />
//               ) : (
//                 <Navigation className={iconStyle} />
//               )}
//               <input
//                 name="pincode"
//                 maxLength={6}
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           {/* District */}
//           <div>
//             <label className={labelStyle}>District</label>
//             <div className="relative">
//               <MapPin className={iconStyle} />
//               <input
//                 name="district"
//                 value={formData.district}
//                 readOnly
//                 className={inputStyle}
//                 tabIndex="-1"
//               />
//             </div>
//           </div>

//           {/* State */}
//           <div>
//             <label className={labelStyle}>State</label>
//             <div className="relative">
//               <Map className={iconStyle} />
//               <input
//                 name="state"
//                 value={formData.state}
//                 readOnly
//                 className={inputStyle}
//                 tabIndex="-1"
//               />
//             </div>
//           </div>


//            {/* Country */}
//         <div>
//           <label className={labelStyle}>Country</label>
//           <div className="relative">
//             <Globe className={iconStyle} />
//             <input
//               name="country"
//               value={formData.country}
//               readOnly
//               className={inputStyle}
//               tabIndex="-1"
//             />
//           </div>
//         </div>
//         </div>

       

//         <div className="flex justify-end pt-4 border-t border-slate-100">
//           <button
//             type="submit"
//             disabled={isSubmitting || pincodeLoading}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-10 py-2.5 rounded-lg transition-all"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="animate-spin" size={18} /> Processing...
//               </>
//             ) : (
//               <>
//                 <Save size={18} /> {buttonText}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
//*********************************************working code phase 3************************************************** */
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   User, Mail, Phone, Briefcase, Building2,
//   Save, MapPin, Globe, Map, Navigation, Loader2
// } from "lucide-react";
// import { departmentService } from "../../services/department.service";
// import toast, { Toaster } from "react-hot-toast"; // 1. Added Toaster imports

// export default function EmployeeDemoForm({ initialData, onSubmit, buttonText = "Save Employee" }) {
//   const [departments, setDepartments] = useState([]);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     pincode: "",
//     state: "",
//     district: "",
//     country: "India",
//   });

//   const resetForm = useCallback(() => {
//     setFormData({
//       full_name: "",
//       email: "",
//       phone: "",
//       department_id: "",
//       role: "",
//       pincode: "",
//       state: "",
//       district: "",
//       country: "India",
//     });
//   }, []);

//   // Fetch Departments on Mount
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const data = await departmentService.getAll();
//         setDepartments(data);
//       } catch (error) {
//         console.error("Failed to load departments", error);
//         toast.error("Failed to load department list");
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // Sync with initialData (for Editing Mode)
//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     } else {
//       resetForm();
//     }
//   }, [initialData, resetForm]);

//   // Pincode API Integration
//   useEffect(() => {
//     const fetchAddress = async () => {
//       // Only trigger when pincode is exactly 6 digits
//       if (formData.pincode.length === 6) {
//         setPincodeLoading(true);
//         try {
//           const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
//           const data = await res.json();

//           if (data[0].Status === "Success") {
//             const details = data[0].PostOffice[0];
//             setFormData(prev => ({
//               ...prev,
//               state: details.State,
//               district: details.District,
//               country: details.Country
//             }));
//             toast.success(`Location found: ${details.District}`);
//           } else {
//             toast.error("Invalid Pincode");
//           }
//         } catch (error) {
//           console.error("Pincode lookup failed", error);
//           toast.error("Network error during pincode lookup");
//         } finally {
//           setPincodeLoading(false);
//         }
//       }
//     };
//     fetchAddress();
//   }, [formData.pincode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Trigger the parent submission function
//       await onSubmit(formData);

//       // 2. Success Notification
//       const successMsg = initialData ? "Employee updated successfully!" : "Employee registered successfully!";
//       toast.success(successMsg);

//       // Clear form only on new registration
//       if (!initialData) {
//         resetForm();
//       }
//     } catch (error) {
//       console.error("Submission failed", error);
//       // 3. Error Notification
//       toast.error(error?.message || "Something went wrong while saving.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // UI Styles
//   const inputStyle = "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-300";
//   const labelStyle = "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5";
//   const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

//   return (
//     <div className="w-full bg-white">
//       {/* 4. Toaster Container for Notifications */}
//       <Toaster position="top-right" reverseOrder={false} />

//       <form onSubmit={handleSubmit} className="space-y-6">

//         {/* Responsive Grid Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">

//           {/* Full Name */}
//           <div>
//             <label className={labelStyle}>Full Name</label>
//             <div className="relative">
//               <User className={iconStyle} />
//               <input
//                 name="full_name"
//                 value={formData.full_name}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className={labelStyle}>Email Address</label>
//             <div className="relative">
//               <Mail className={iconStyle} />
//               <input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>
//           </div>

//           {/* Phone */}
//           <div>
//             <label className={labelStyle}>Phone Number</label>
//             <div className="relative">
//               <Phone className={iconStyle} />
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>
//           </div>

//           {/* Department */}
//           <div>
//             <label className={labelStyle}>Department</label>
//             <div className="relative">
//               <Building2 className={iconStyle} />
//               <select
//                 name="department_id"
//                 value={formData.department_id}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 disabled={isSubmitting}
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>{dept.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Role */}
//           <div>
//             <label className={labelStyle}>Designation / Role</label>
//             <div className="relative">
//               <Briefcase className={iconStyle} />
//               <input
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>
//           </div>

//           {/* Pincode Input */}
//           <div>
//             <label className={labelStyle}>Pincode</label>
//             <div className="relative">
//               {pincodeLoading ? (
//                 <Loader2 className={`${iconStyle} animate-spin text-blue-500`} />
//               ) : (
//                 <Navigation className={iconStyle} />
//               )}
//               <input
//                 name="pincode"
//                 maxLength={6}
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 className={`${inputStyle} font-mono tracking-widest`}
//                 placeholder="6 Digits"
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>
//           </div>

//           {/* District (ReadOnly) */}
//           <div>
//             <label className={labelStyle}>District</label>
//             <div className="relative">
//               <MapPin className={iconStyle} />
//               <input
//                 name="district"
//                 value={formData.district}
//                 readOnly
//                 className={inputStyle}
//                 tabIndex="-1"
//                 placeholder="Auto-filled"
//               />
//             </div>
//           </div>

//           {/* State (ReadOnly) */}
//           <div>
//             <label className={labelStyle}>State</label>
//             <div className="relative">
//               <Map className={iconStyle} />
//               <input
//                 name="state"
//                 value={formData.state}
//                 readOnly
//                 className={inputStyle}
//                 tabIndex="-1"
//                 placeholder="Auto-filled"
//               />
//             </div>
//           </div>

//           {/* Country (ReadOnly) */}
//           <div>
//             <label className={labelStyle}>Country</label>
//             <div className="relative">
//               <Globe className={iconStyle} />
//               <input
//                 name="country"
//                 value={formData.country}
//                 readOnly
//                 className={inputStyle}
//                 tabIndex="-1"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="flex justify-end pt-4 border-t border-slate-100">
//           <button
//             type="submit"
//             disabled={isSubmitting || pincodeLoading}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-10 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 size={18} className="animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save size={18} />
//                 {buttonText}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
//************************************************working code phase 2*********************************************************** */
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   User, Mail, Phone, Briefcase, Building2,
//   Save, MapPin, Globe, Map, Navigation, Loader2
// } from "lucide-react";
// import { departmentService } from "../../services/department.service";

// export default function EmployeeDemoForm({ initialData, onSubmit, buttonText = "Save Employee" }) {
//   const [departments, setDepartments] = useState([]);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     department_id: "",
//     role: "",
//     pincode: "",
//     state: "",
//     district: "",
//     country: "India",
//   });

//   const resetForm = useCallback(() => {
//     setFormData({
//       full_name: "",
//       email: "",
//       phone: "",
//       department_id: "",
//       role: "",
//       pincode: "",
//       state: "",
//       district: "",
//       country: "India",
//     });
//   }, []);

//   // Fetch Departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const data = await departmentService.getAll();
//         setDepartments(data);
//       } catch (error) {
//         console.error("Failed to load departments", error);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // Sync with initialData (for Editing)
//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     } else {
//       resetForm();
//     }
//   }, [initialData, resetForm]);

//   // Pincode API Integration
//   useEffect(() => {
//     const fetchAddress = async () => {
//       if (formData.pincode.length === 6) {
//         setPincodeLoading(true);
//         try {
//           const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
//           const data = await res.json();
//           if (data[0].Status === "Success") {
//             const details = data[0].PostOffice[0];
//             setFormData(prev => ({
//               ...prev,
//               state: details.State,
//               district: details.District,
//               country: details.Country
//             }));
//           }
//         } catch (error) {
//           console.error("Pincode lookup failed", error);
//         } finally {
//           setPincodeLoading(false);
//         }
//       }
//     };
//     fetchAddress();
//   }, [formData.pincode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//     if (!initialData) resetForm();
//   };

//   // Professional UI Styles
//   const inputStyle = "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500 placeholder:text-slate-300";
//   const labelStyle = "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5";
//   const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

//   return (
//     <div className="w-full bg-white">
//       <form onSubmit={handleSubmit} className="space-y-6">

//         {/* ROW 1 & 2: Main Grid Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">

//           {/* Full Name */}
//           <div>
//             <label className={labelStyle}>Full Name</label>
//             <div className="relative">
//               <User className={iconStyle} />
//               <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe" className={inputStyle} required />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className={labelStyle}>Email Address</label>
//             <div className="relative">
//               <Mail className={iconStyle} />
//               <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" className={inputStyle} required />
//             </div>
//           </div>

//           {/* Phone */}
//           <div>
//             <label className={labelStyle}>Phone Number</label>
//             <div className="relative">
//               <Phone className={iconStyle} />
//               <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" className={inputStyle} required />
//             </div>
//           </div>

//           {/* Department */}
//           <div>
//             <label className={labelStyle}>Department</label>
//             <div className="relative">
//               <Building2 className={iconStyle} />
//               <select name="department_id" value={formData.department_id} onChange={handleChange} className={inputStyle} required>
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Role */}
//           <div>
//             <label className={labelStyle}>Designation / Role</label>
//             <div className="relative">
//               <Briefcase className={iconStyle} />
//               <input name="role" value={formData.role} onChange={handleChange} placeholder="Software Engineer" className={inputStyle} required />
//             </div>
//           </div>

//           {/* Pincode (Triggers API) */}
//           <div>
//             <label className={labelStyle}>Pincode</label>
//             <div className="relative">
//               {pincodeLoading ? (
//                 <Loader2 className={`${iconStyle} animate-spin text-blue-500`} />
//               ) : (
//                 <Navigation className={iconStyle} />
//               )}
//               <input
//                 name="pincode"
//                 maxLength={6}
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 placeholder="400701"
//                 className={`${inputStyle} font-mono tracking-widest`}
//                 required
//               />
//             </div>
//           </div>

//           {/* District (ReadOnly) */}
//           <div>
//             <label className={labelStyle}>District</label>
//             <div className="relative">
//               <MapPin className={iconStyle} />
//               <input name="district" value={formData.district} readOnly className={inputStyle} placeholder="Auto-filled" />
//             </div>
//           </div>

//           {/* State (ReadOnly) */}
//           <div>
//             <label className={labelStyle}>State</label>
//             <div className="relative">
//               <Map className={iconStyle} />
//               <input name="state" value={formData.state} readOnly className={inputStyle} placeholder="Auto-filled" />
//             </div>
//           </div>

//           {/* Country (ReadOnly) */}
//           <div>
//             <label className={labelStyle}>Country</label>
//             <div className="relative">
//               <Globe className={iconStyle} />
//               <input name="country" value={formData.country} readOnly className={inputStyle} />
//             </div>
//           </div>
//         </div>

//         {/* Action Button: Aligned to Right */}
//         <div className="flex justify-end pt-4 border-t border-slate-100">
//           <button
//             type="submit"
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-[0.98]"
//           >
//             <Save size={18} />
//             {buttonText}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
//********************************************working code phase 2 20/1/26*************************************************** */
// import React, { useEffect, useState } from "react";
// import { User, Mail, Phone, Briefcase, Calendar, Building2, Save } from "lucide-react";
// import { departmentService } from "../../services/department.service"
// export default function EmployeeForm({ initialData, onSubmit, buttonText = "Save Employee" }) {
//   const [departments, setDepartments] = useState([]);
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

// useEffect(() => {
//   const fetchDepartments = async () => {
//     try {
//       const data = await departmentService.getAll();
//       setDepartments(data);
//     } catch (error) {
//       console.error("Failed to load departments", error);
//     }
//   };

//   fetchDepartments();
// }, []);

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
//     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

//        {/* HEADER */}
//     <div className="mb-1 pb-1 border-b border-slate-100">
//       <h2 className="text-lg font-bold text-slate-800">
//         {initialData ? "Edit Employee" : "Add Employee"}
//       </h2>
//       <p className="text-sm text-slate-500 mt-1">
//         {initialData
//           ? "Update employee details"
//           : "Enter details to register a new employee"}
//       </p>
//     </div>
//       <form onSubmit={handleSubmit} className="space-y-6">
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
//         {/* <div>
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
//         </div> */}

//         <div>
//   <label className={labelStyle}>Department</label>
//   <div className="relative">
//     <Building2 className={iconStyle} />
//     <select
//       name="department_id"
//       value={formData.department_id}
//       onChange={handleChange}
//       className={inputStyle}
//       required
//     >
//       <option value="">Select Department</option>
//       {departments.map((dept) => (
//         <option key={dept.id} value={dept.id}>
//           {dept.name}
//         </option>
//       ))}
//     </select>
//   </div>
// </div>

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
//     </div>
//   );
// }
