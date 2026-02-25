import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Calendar, 
  IndianRupee,
  Layers, 
  FileText, 
  PlusCircle, 
  Edit3,
  ShieldCheck,
  Zap,
  Loader2,
  Lock,
  ChevronLeft,
  UserCircle
} from "lucide-react";
import toast from "react-hot-toast";

const EditVacancyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    job_description_id: "",
    department_id: "",
    number_of_openings: 1,
    location: "",
    experience_required: "",
    salary_range: "",
    status: "open",
    deadline_date: "",
    // Rich Text Content
    content: "",
    responsibilities: "",
    requirements: "",
    // NEW: Role field for Job Description API
    role: "" 
  });

  useEffect(() => {
    const hydrateRegistry = async () => {
      setLoading(true);
      try {
        const [deptRes, jdRes, vacancyRes] = await Promise.all([
          fetch("https://apihrr.goelectronix.co.in/departments"),
          fetch("https://apihrr.goelectronix.co.in/job-descriptions"),
          fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`)
        ]);

        const depts = await deptRes.json();
        const jds = await jdRes.json();
        const vacancy = await vacancyRes.json();

        setDepartments(depts || []);
        setTemplates(jds || []);

        const specificJDRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacancy.job_description_id}`);
        const specificJD = await specificJDRes.json();

        setFormData({
          ...vacancy,
          role: specificJD.role || "", // Hydrating the role from JD API
          content: specificJD.content || "",
          responsibilities: specificJD.responsibilities || "",
          requirements: specificJD.requirements || ""
        });

      } catch (err) {
        toast.error("Failed to recover registry node");
      } finally {
        setLoading(false);
      }
    };

    if (id) hydrateRegistry();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const syncToast = toast.loading("Synchronizing registry updates...");

    try {
      // Stage 1: Update Job Description Template (Including the Role)
      const jdBody = {
        title: formData.title,
        role: formData.role, // Sending updated role to JD API
        content: formData.content,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        location: formData.location,
        salary_range: formData.salary_range
      };

      await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${formData.job_description_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jdBody)
      });

      // Stage 2: Update Vacancy Metadata
      const vacancyBody = {
        title: formData.title,
        job_description_id: formData.job_description_id,
        department_id: parseInt(formData.department_id),
        number_of_openings: parseInt(formData.number_of_openings),
        location: formData.location,
        experience_required: formData.experience_required,
        salary_range: formData.salary_range,
        status: formData.status,
        deadline_date: formData.deadline_date
      };

      const response = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vacancyBody)
      });

      if (response.ok) {
        toast.success("Registry node updated successfully", { id: syncToast });
        navigate("/vacancies");
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Update failed", { id: syncToast });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-sm";
  const readOnlyClass = "w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed flex items-center justify-between";
  const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";
  
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  if (loading && !formData.title) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Decrypting Registry Node #{id}...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">
                <ChevronLeft size={16} /> Abort Edit
            </button>
            {/* <div className="flex items-center gap-2 px-4 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Buffer Active</span>
            </div> */}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              {/* <div className="flex items-center gap-2 mb-4">
                <Edit3 size={16} className="text-blue-600" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Registry Config</h3>
              </div> */}

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Job Title</label>
                  <div className={readOnlyClass}>
                    {templates.find(t => t.id === formData.job_description_id)?.title || "Loading..."}
                    <Lock size={12} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Department</label>
                  <div className={readOnlyClass}>
                    {departments.find(d => d.id === formData.department_id)?.name || "Loading..."}
                    <Lock size={12} />
                  </div>
                </div>

                {/* EDITABLE ROLE FIELD */}
                <div>
                  <label className={labelClass}>Role</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      required 
                      placeholder="e.g. Lead Consultant"
                      className={`${inputClass} pl-12`} 
                      value={formData.role} 
                      onChange={(e) => setFormData({...formData, role: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Vacancy Title</label>
                  <input required className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Openings</label>
                    <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Experience</label>
                    <input className={inputClass} value={formData.experience_required} onChange={(e) => setFormData({...formData, experience_required: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Location</label>
                    <input className={inputClass} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Salary</label>
                    <input className={inputClass} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Closing Date</label>
                  <input type="date" min={today} className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <><ShieldCheck size={18} />Update Vacancy</>}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-blue-600" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Job Template</h3>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <label className={labelClass}>01. Overview</label>
                  <div className="enterprise-editor">
                    <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} modules={quillModules} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>02. Responsibilities</label>
                  <div className="enterprise-editor">
                    <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} modules={quillModules} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>03. Requirements</label>
                  <div className="enterprise-editor">
                    <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} modules={quillModules} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
        .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
        .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
      `}} />
    </div>
  );
};

export default EditVacancyPage;
//*************************************************working code phase 1 23/02/26************************************************************ */
// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import { useNavigate, useParams } from "react-router-dom";
// import "react-quill-new/dist/quill.snow.css";
// import { 
//   Briefcase, 
//   MapPin, 
//   Users, 
//   Calendar, 
//   IndianRupee,
//   Layers, 
//   FileText, 
//   PlusCircle, 
//   Edit3,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   Lock,
//   ChevronLeft
// } from "lucide-react";
// import toast from "react-hot-toast";

// const EditVacancyPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [departments, setDepartments] = useState([]);
//   const [templates, setTemplates] = useState([]);
  
//   // Requirement: Only future dates allowed
//   const today = new Date().toISOString().split("T")[0];

//   const [formData, setFormData] = useState({
//     title: "",
//     job_description_id: "",
//     department_id: "",
//     number_of_openings: 1,
//     location: "",
//     experience_required: "",
//     salary_range: "",
//     status: "open",
//     deadline_date: "",
//     content: "",
//     responsibilities: "",
//     requirements: ""
//   });

//   useEffect(() => {
//     const hydrateRegistry = async () => {
//       setLoading(true);
//       try {
//         const [deptRes, jdRes, vacancyRes] = await Promise.all([
//           fetch("https://apihrr.goelectronix.co.in/departments"),
//           fetch("https://apihrr.goelectronix.co.in/job-descriptions"),
//           fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`)
//         ]);

//         const depts = await deptRes.json();
//         const jds = await jdRes.json();
//         const vacancy = await vacancyRes.json();

//         setDepartments(depts || []);
//         setTemplates(jds || []);

//         const specificJDRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacancy.job_description_id}`);
//         const specificJD = await specificJDRes.json();

//         setFormData({
//           ...vacancy,
//           content: specificJD.content || "",
//           responsibilities: specificJD.responsibilities || "",
//           requirements: specificJD.requirements || ""
//         });

//       } catch (err) {
//         toast.error("Failed to recover registry node");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) hydrateRegistry();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const syncToast = toast.loading("Synchronizing registry updates...");

//     try {
//       const jdBody = {
//         title: formData.title,
//         role: formData.title,
//         content: formData.content,
//         responsibilities: formData.responsibilities,
//         requirements: formData.requirements,
//         location: formData.location,
//         salary_range: formData.salary_range
//       };

//       await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${formData.job_description_id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jdBody)
//       });

//       const vacancyBody = {
//         title: formData.title,
//         job_description_id: formData.job_description_id,
//         department_id: parseInt(formData.department_id),
//         number_of_openings: parseInt(formData.number_of_openings),
//         location: formData.location,
//         experience_required: formData.experience_required,
//         salary_range: formData.salary_range,
//         status: formData.status,
//         deadline_date: formData.deadline_date
//       };

//       const response = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(vacancyBody)
//       });

//       if (response.ok) {
//         toast.success("Registry node updated successfully", { id: syncToast });
//         navigate("/vacancies");
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Update failed", { id: syncToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-sm";
//   const readOnlyClass = "w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed flex items-center justify-between";
//   const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";
  
//   const quillModules = {
//     toolbar: [
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["clean"],
//     ],
//   };

//   if (loading && !formData.title) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//       <Loader2 className="animate-spin text-blue-600" size={40} />
//       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Decrypting Registry Node #{id}...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         <div className="flex items-center justify-between">
//             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">
//                 <ChevronLeft size={16} /> Abort Edit
//             </button>
//             {/* <div className="flex items-center gap-2 px-4 py-1 bg-white border border-slate-200 rounded-full">
//                 <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
//                 <span className="text-[9px] font-black text-slate-400 uppercase">Live Registry Buffer</span>
//             </div> */}
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
//               {/* <div className="flex items-center gap-2 mb-4">
//                 <Edit3 size={16} className="text-blue-600" />
//                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Configuration</h3>
//               </div> */}

//               <div className="space-y-5">
//                 <div>
//                   <label className={labelClass}>Job Title</label>
//                   <div className={readOnlyClass}>
//                     {templates.find(t => t.id === formData.job_description_id)?.title || "Loading..."}
//                     <Lock size={12} />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Department</label>
//                   <div className={readOnlyClass}>
//                     {departments.find(d => d.id === formData.department_id)?.name || "Loading..."}
//                     <Lock size={12} />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Designation Title</label>
//                   <input required className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Openings </label>
//                     <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Experience</label>
//                     <input className={inputClass} value={formData.experience_required} onChange={(e) => setFormData({...formData, experience_required: e.target.value})} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Location</label>
//                     <input className={inputClass} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Salary</label>
//                     <input className={inputClass} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Closing Date</label>
//                   <input 
//                     type="date" 
//                     min={today} 
//                     className={inputClass} 
//                     value={formData.deadline_date} 
//                     onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} 
//                   />
//                 </div>
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={loading}
//                 className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3"
//               >
//                 {loading ? <Loader2 className="animate-spin" size={18}/> : <><ShieldCheck size={18} /> Push Updates to Registry</>}
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Protocol content</h3>
//                 </div>
//               </div>
              
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} modules={quillModules} />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} modules={quillModules} />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} modules={quillModules} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//       `}} />
//     </div>
//   );
// };

// export default EditVacancyPage;
//************************************************************************************************** */
// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import { useNavigate, useParams } from "react-router-dom"; // Added useParams
// import "react-quill-new/dist/quill.snow.css";
// import { 
//   Briefcase, 
//   MapPin, 
//   Users, 
//   Calendar, 
//   IndianRupee,
//   Layers, 
//   FileText, 
//   PlusCircle, 
//   Edit3,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   Lock,
//   ChevronLeft
// } from "lucide-react";
// import toast from "react-hot-toast";

// const EditVacancyPage = () => {
//   const { id } = useParams(); // Get ID from URL
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [departments, setDepartments] = useState([]);
//   const [templates, setTemplates] = useState([]);
// const today = new Date().toISOString().split("T")[0];
//   const [formData, setFormData] = useState({
//     title: "",
//     job_description_id: "",
//     department_id: "",
//     number_of_openings: 1,
//     location: "",
//     experience_required: "",
//     salary_range: "",
//     status: "open",
//     deadline_date: "",
//     content: "",
//     responsibilities: "",
//     requirements: ""
//   });

//   // 1. Hydrate Page Data
//   useEffect(() => {
//     const hydrateRegistry = async () => {
//       setLoading(true);
//       try {
//         // Fetch Masters
//         const [deptRes, jdRes, vacancyRes] = await Promise.all([
//           fetch("https://apihrr.goelectronix.co.in/departments"),
//           fetch("https://apihrr.goelectronix.co.in/job-descriptions"),
//           fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`)
//         ]);

//         const depts = await deptRes.json();
//         const jds = await jdRes.json();
//         const vacancy = await vacancyRes.json();

//         setDepartments(depts || []);
//         setTemplates(jds || []);

//         // Fetch the specific Job Description details linked to this vacancy
//         const specificJDRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacancy.job_description_id}`);
//         const specificJD = await specificJDRes.json();

//         // Populate Form
//         setFormData({
//           ...vacancy,
//           content: specificJD.content || "",
//           responsibilities: specificJD.responsibilities || "",
//           requirements: specificJD.requirements || ""
//         });

//       } catch (err) {
//         toast.error("Failed to recover registry node");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) hydrateRegistry();
//   }, [id]);

//   // 2. Submit Updates
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const syncToast = toast.loading("Synchronizing registry updates...");

//     try {
//       // Step 1: Update the linked Job Description first
//       const jdBody = {
//         title: formData.title,
//         role: formData.title,
//         content: formData.content,
//         responsibilities: formData.responsibilities,
//         requirements: formData.requirements,
//         location: formData.location,
//         salary_range: formData.salary_range
//       };

//       await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${formData.job_description_id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jdBody)
//       });

//       // Step 2: Update Vacancy Metadata
//       const vacancyBody = {
//         title: formData.title,
//         job_description_id: formData.job_description_id,
//         department_id: parseInt(formData.department_id),
//         number_of_openings: parseInt(formData.number_of_openings),
//         location: formData.location,
//         experience_required: formData.experience_required,
//         salary_range: formData.salary_range,
//         status: formData.status,
//         deadline_date: formData.deadline_date
//       };

//       const response = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(vacancyBody)
//       });

//       if (response.ok) {
//         toast.success("Registry node updated successfully", { id: syncToast });
//         navigate("/vacancies");
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Update failed", { id: syncToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";
//   const readOnlyClass = "w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed flex items-center justify-between";
//   const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";
  
//   const quillModules = {
//     toolbar: [
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["clean"],
//     ],
//   };

//   if (loading && !formData.title) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//       <Loader2 className="animate-spin text-blue-600" size={40} />
//       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Decrypting Registry Node #{id}...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">
//                 <ChevronLeft size={16} /> Abort Edit
//             </button>
//             <div className="flex items-center gap-2 px-4 py-1 bg-white border border-slate-200 rounded-full">
//                 <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
//                 <span className="text-[9px] font-black text-slate-400 uppercase">Live Registry Buffer</span>
//             </div>
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* LEFT: METADATA & CONFIG (Read-only sections included) */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <Edit3 size={16} className="text-blue-600" />
//                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Configuration</h3>
//               </div>

//               <div className="space-y-5">
//                 {/* READ ONLY: TEMPLATE */}
//                 <div>
//                   <label className={labelClass}>Linked Job Template</label>
//                   <div className={readOnlyClass}>
//                     {templates.find(t => t.id === formData.job_description_id)?.title || "Loading..."}
//                     <Lock size={12} />
//                   </div>
//                 </div>

//                 {/* READ ONLY: DEPARTMENT */}
//                 <div>
//                   <label className={labelClass}>Assigned Department</label>
//                   <div className={readOnlyClass}>
//                     {departments.find(d => d.id === formData.department_id)?.name || "Loading..."}
//                     <Lock size={12} />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Designation Title</label>
//                   <input required className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Openings</label>
//                     <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Experience Protocol</label>
//                     <input className={inputClass} value={formData.experience_required} onChange={(e) => setFormData({...formData, experience_required: e.target.value})} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Location Node</label>
//                     <input className={inputClass} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Salary Bracket</label>
//                     <input className={inputClass} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                   </div>
//                 </div>

//                 {/* <div>
//                   <label className={labelClass}>Closing Deadline</label>
//                   <input type="date" className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div> */}
//                 <div>
//   <label className={labelClass}>Closing Deadline</label>
//   <input 
//     type="date" 
//     {/* This prevents selection of any date before today */}
//     min={today} 
//     className={inputClass} 
//     value={formData.deadline_date} 
//     onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} 
//   />
// </div>
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={loading}
//                 className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3"
//               >
//                 {loading ? <Loader2 className="animate-spin" size={18}/> : <><ShieldCheck size={18} /> Push Updates to Registry</>}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: RICH TEXT EDITORS */}
//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Protocol content</h3>
//                 </div>
//               </div>
              
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} modules={quillModules} />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} modules={quillModules} />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} modules={quillModules} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//       `}} />
//     </div>
//   );
// };

// export default EditVacancyPage;
//********************************************************************************************************** */
// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { 
//   Briefcase, 
//   MapPin, 
//   Users, 
//   Calendar, 
//   IndianRupee,
//   Layers, 
//   FileText, 
//   PlusCircle, 
//   Info,
//   Edit3,
//   ShieldCheck,
//   Zap
// } from "lucide-react";
// import toast from "react-hot-toast";

// const EditVacancyPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const [templates, setTemplates] = useState([]);
//   const [originalTemplate, setOriginalTemplate] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     job_description_id: "",
//     department_id: "",
//     number_of_openings: 1,
//     location: "",
//     experience_required: "",
//     salary_range: "",
//     status: "open",
//     deadline_date: new Date().toISOString().split("T")[0],
//     content: "",
//     responsibilities: "",
//     requirements: ""
//   });

//   // 1. Fetch Master Data
//   useEffect(() => {
//     const fetchMasters = async () => {
//       try {
//         const [deptRes, jdRes] = await Promise.all([
//           fetch("https://apihrr.goelectronix.co.in/departments"),
//           fetch("https://apihrr.goelectronix.co.in/job-descriptions")
//         ]);
//         const deptData = await deptRes.json();
//         const jdData = await jdRes.json();
//         setDepartments(deptData || []);
//         setTemplates(jdData || []);
//       } catch (err) {
//         toast.error("Registry connection failed");
//       }
//     };
//     fetchMasters();
//   }, []);

//   // 2. Load Template Data into Quill Editors
//   // const handleJDChange = (jdId) => {
//   //   const template = templates.find(t => t.id === parseInt(jdId));
//   //   if (template) {
//   //     setFormData(prev => ({
//   //       ...prev,
//   //       job_description_id: template.id,
//   //       title: template.title,
//   //       location: template.location || "",
//   //       salary_range: template.salary_range || "",
//   //       content: template.content || "",
//   //       responsibilities: template.responsibilities || "",
//   //       requirements: template.requirements || ""
//   //     }));
//   //     toast.success(`Protocol "${template.title}" injected into editor`);
//   //   } else {
//   //     setFormData(prev => ({ ...prev, job_description_id: "", content: "", responsibilities: "", requirements: "" }));
//   //   }
//   // };

//   const handleJDChange = (jdId) => {
//   const template = templates.find(t => t.id === parseInt(jdId));

//   if (template) {
//     setOriginalTemplate({
//       title: template.title || "",
//       content: template.content || "",
//       responsibilities: template.responsibilities || "",
//       requirements: template.requirements || "",
//       location: template.location || "",
//       salary_range: template.salary_range || ""
//     });

//     setFormData(prev => ({
//       ...prev,
//       job_description_id: template.id,
//       title: template.title,
//       location: template.location || "",
//       salary_range: template.salary_range || "",
//       content: template.content || "",
//       responsibilities: template.responsibilities || "",
//       requirements: template.requirements || ""
//     }));

//     toast.success(`Template "${template.title}" loaded`);
//   } else {
//     setOriginalTemplate(null);
//     setFormData(prev => ({
//       ...prev,
//       job_description_id: "",
//       content: "",
//       responsibilities: "",
//       requirements: ""
//     }));
//   }
// };

//   const getSelectedTemplate = () => {
//   return templates.find(t => t.id === formData.job_description_id);
// };

// // const isTemplateModified = () => {
// //   const t = getSelectedTemplate();
// //   if (!t) return false;

// //   return (
// //     t.title !== formData.title ||
// //     (t.content || "") !== (formData.content || "") ||
// //     (t.responsibilities || "") !== (formData.responsibilities || "") ||
// //     (t.requirements || "") !== (formData.requirements || "") ||
// //     (t.location || "") !== (formData.location || "") ||
// //     (t.salary_range || "") !== (formData.salary_range || "")
// //   );
// // };

// const isTemplateModified = () => {
//   if (!originalTemplate) return false;

//   return (
//     originalTemplate.title !== (formData.title || "") ||
//     originalTemplate.content !== (formData.content || "") ||
//     originalTemplate.responsibilities !== (formData.responsibilities || "") ||
//     originalTemplate.requirements !== (formData.requirements || "") ||
//     originalTemplate.location !== (formData.location || "") ||
//     originalTemplate.salary_range !== (formData.salary_range || "")
//   );
// };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   const loadingToast = toast.loading("Processing Vacancy...");

//   try {
//     let updatedTemplateId = formData.job_description_id;

//     // ==============================
//     // STEP 1: UPDATE TEMPLATE IF CHANGED
//     // ==============================
//     if (updatedTemplateId && isTemplateModified()) {
//       const updateBody = {
//         title: formData.title,
//         role: formData.title,
//         content: formData.content,
//         responsibilities: formData.responsibilities,
//         requirements: formData.requirements,
//         location: formData.location,
//         salary_range: formData.salary_range
//       };

//       const updateRes = await fetch(
//         `https://apihrr.goelectronix.co.in/job-descriptions/${updatedTemplateId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updateBody),
//         }
//       );

//       if (!updateRes.ok) throw new Error("Template update failed");

//       toast.success("Template updated");
//     }

//     // ==============================
//     // STEP 2: CREATE VACANCY
//     // ==============================
//     const vacancyBody = {
//       title: formData.title,
//       job_description_id: updatedTemplateId,
//       department_id: formData.department_id,
//       number_of_openings: formData.number_of_openings,
//       location: formData.location,
//       experience_required: formData.experience_required,
//       salary_range: formData.salary_range,
//       status: formData.status,
//       deadline_date: formData.deadline_date
//     };

//     const vacancyRes = await fetch(
//       "https://apihrr.goelectronix.co.in/vacancies",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(vacancyBody),
//       }
//     );

//     if (!vacancyRes.ok) throw new Error("Vacancy create failed");

//     toast.success("Vacancy created successfully 🚀", { id: loadingToast });

//   } catch (err) {
//     toast.error("Operation failed ❌", { id: loadingToast });
//   } finally {
//     setLoading(false);
//   }
// };

//   const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";
//   const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";
  
//   const quillModules = {
//     toolbar: [
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["clean"],
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* TOP STATUS STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
//           <ShieldCheck className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none" size={120} />
          
//           <div className="flex items-center gap-6 relative z-10">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//               <Zap size={32} strokeWidth={2.5} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Vacancy Protocol</h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> System: Vacancy Registry Ingestion
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-4 relative z-10">
//             <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-3">
//               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Tunnel</span>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* LEFT COLUMN: METADATA & CONFIG */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <Edit3 size={16} className="text-blue-600" />
//                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Metadata Mapping</h3>
//               </div>

//               <div className="space-y-5">
//                 <div>
//                   <label className={labelClass}>Job Template Source</label>
//                   <select required className={inputClass} onChange={(e) => handleJDChange(e.target.value)}>
//                     <option value="">Select Protocol Template...</option>
//                     {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
//                   </select>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Department Node</label>
//                   <select 
//                     required 
//                     className={inputClass} 
//                     value={formData.department_id}
//                     onChange={(e) => setFormData({...formData, department_id: parseInt(e.target.value)})}
//                   >
//                     <option value="">Choose Department...</option>
//                     {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//                   </select>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Vacancy Designation</label>
//                   <input required className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Slots</label>
//                     <div className="relative">
//                       <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                       <input type="number" className={`${inputClass} pl-10`} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: parseInt(e.target.value)})} />
//                     </div>
//                   </div>
//                   <div>
//                     <label className={labelClass}>Exp Protocol</label>
//                     <input className={inputClass} value={formData.experience_required} onChange={(e) => setFormData({...formData, experience_required: e.target.value})} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Locality</label>
//                     <div className="relative">
//                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                       <input className={`${inputClass} pl-10`} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                     </div>
//                   </div>
//                   <div>
//                     <label className={labelClass}>Salary Bracket</label>
//                     <div className="relative">
//                       <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                       <input className={`${inputClass} pl-10`} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Expiration Date</label>
//                   <input type="date" className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div>
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={loading}
//                 className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {loading ? "Syncing..." : <><PlusCircle size={18} /> Initialize Vacancy</>}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: INTEGRATED REACT QUILL EDITORS */}
//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Protocol Content Editor</h3>
//                 </div>
//                 <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg">
//                   <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse" />
//                   <span className="text-[9px] font-black text-slate-400 uppercase">Live Buffer</span>
//                 </div>
//               </div>
              
//               <div className="p-8 space-y-8">
//                 {/* 1. CONTENT EDITOR */}
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Mission Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill 
//                       theme="snow" 
//                       value={formData.content} 
//                       onChange={(v) => setFormData({...formData, content: v})}
//                       modules={quillModules}
//                       placeholder="Input core vacancy overview..."
//                     />
//                   </div>
//                 </div>

//                 {/* 2. RESPONSIBILITIES EDITOR */}
//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Tactical Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill 
//                       theme="snow" 
//                       value={formData.responsibilities} 
//                       onChange={(v) => setFormData({...formData, responsibilities: v})}
//                       modules={quillModules}
//                       placeholder="List operational duties..."
//                     />
//                   </div>
//                 </div>

//                 {/* 3. REQUIREMENTS EDITOR */}
//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Prerequisite Stack</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill 
//                       theme="snow" 
//                       value={formData.requirements} 
//                       onChange={(v) => setFormData({...formData, requirements: v})}
//                       modules={quillModules}
//                       placeholder="Specify required skills and certifications..."
//                     />
//                   </div>
//                 </div>

//                 {!formData.job_description_id && (
//                   <div className="p-10 border border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
//                     <div className="p-4 bg-white rounded-2xl shadow-sm"><Info size={24} className="text-slate-300" /></div>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] max-w-[240px]">
//                       Select a Source Template to auto-populate high-fidelity protocol data.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .enterprise-editor .ql-toolbar.ql-snow {
//           border: 1px solid #E2E8F0 !important;
//           border-top-left-radius: 1rem;
//           border-top-right-radius: 1rem;
//           background: #F8FAFC;
//           padding: 8px 12px;
//         }
//         .enterprise-editor .ql-container.ql-snow {
//           border: 1px solid #E2E8F0 !important;
//           border-bottom-left-radius: 1rem;
//           border-bottom-right-radius: 1rem;
//           font-family: inherit;
//           min-height: 140px;
//         }
//         .enterprise-editor .ql-editor {
//           font-size: 13px;
//           color: #334155;
//           font-weight: 500;
//           line-height: 1.6;
//         }
//         .enterprise-editor .ql-editor.ql-blank::before {
//           font-style: normal;
//           color: #94A3B8;
//           font-size: 12px;
//           font-weight: 600;
//         }
//       `}} />
//     </div>
//   );
// };

// export default EditVacancyPage;
//******************************************************************************************** */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { 
//   Briefcase, 
//   MapPin, 
//   Users, 
//   Calendar, 
//   IndianRupee,
//   Layers, 
//   FileText, 
//   Save, 
//   ChevronLeft,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   History
// } from "lucide-react";
// import toast from "react-hot-toast";

// const EditVacancyPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [departments, setDepartments] = useState([]);

//   const [formData, setFormData] = useState({
//     title: "",
//     job_description_id: "",
//     department_id: "",
//     number_of_openings: 1,
//     location: "",
//     experience_required: "",
//     salary_range: "",
//     status: "open",
//     deadline_date: "",
//     content: "",
//     responsibilities: "",
//     requirements: ""
//   });

//   // 1. HYDRATION: Fetch Vacancy and Template Data
//   useEffect(() => {
//     const hydrateData = async () => {
//       setLoading(true);
//       try {
//         // Fetch Departments
//         const deptRes = await fetch("https://apihrr.goelectronix.co.in/departments");
//         const deptData = await deptRes.json();
//         setDepartments(deptData || []);

//         // Fetch Vacancy Node
//         const vacRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`);
//         if (!vacRes.ok) throw new Error("Vacancy node not found");
//         const vacData = await vacRes.json();

//         // Fetch Associated Job Description
//         const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${vacData.job_description_id}`);
//         const jdData = await jdRes.json();

//         setFormData({
//           ...vacData,
//           content: jdData.content || "",
//           responsibilities: jdData.responsibilities || "",
//           requirements: jdData.requirements || ""
//         });
//       } catch (err) {
//         toast.error("Failed to decrypt registry node");
//         navigate("/vacancies");
//       } finally {
//         setLoading(false);
//       }
//     };
//     hydrateData();
//   }, [id, navigate]);

//   // 2. SYNC LOGIC: Update JD then Update Vacancy
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     const syncToast = toast.loading("Synchronizing registry updates...");

//     try {
//       // Stage 1: Update Job Description Template
//       const jdBody = {
//         title: formData.title,
//         role: formData.title,
//         content: formData.content,
//         responsibilities: formData.responsibilities,
//         requirements: formData.requirements,
//         location: formData.location,
//         salary_range: formData.salary_range
//       };

//       const jdRes = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${formData.job_description_id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jdBody)
//       });

//       if (!jdRes.ok) throw new Error("JD Protocol Update Failed");

//       // Stage 2: Update Vacancy Metadata
//       const vacancyBody = {
//         title: formData.title,
//         job_description_id: formData.job_description_id,
//         department_id: parseInt(formData.department_id),
//         number_of_openings: parseInt(formData.number_of_openings),
//         location: formData.location,
//         experience_required: formData.experience_required,
//         salary_range: formData.salary_range,
//         status: formData.status,
//         deadline_date: formData.deadline_date
//       };

//       const vacancyRes = await fetch(`https://apihrr.goelectronix.co.in/vacancies/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(vacancyBody)
//       });

//       if (!vacancyRes.ok) throw new Error("Vacancy Registry Sync Failed");

//       toast.success("Registry Node Updated Successfully", { id: syncToast });
//       navigate("/vacancies");
//     } catch (err) {
//       toast.error(err.message, { id: syncToast });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-sm";
//   const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";
  
//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//       <Loader2 className="animate-spin text-blue-600" size={40} />
//       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching Node #{id}...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* TOP BREADCRUMB STRIP */}
//         <div className="flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">
//             <ChevronLeft size={16} /> Abort Edit
//           </button>
//           <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full">
//             <History size={14} className="text-amber-600" />
//             <span className="text-[9px] font-black text-amber-600 uppercase">Unsaved Changes in Buffer</span>
//           </div>
//         </div>

//         <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* LEFT: METADATA FORM */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
//               <ShieldCheck className="absolute -right-4 -bottom-4 text-slate-50 opacity-50 -rotate-12 pointer-events-none" size={100} />
              
//               <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
//                 <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
//                   <Zap size={24} />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-black text-slate-900 uppercase leading-none">Edit Vacancy</h2>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Node ID: VAC-{id}</p>
//                 </div>
//               </div>

//               <div className="space-y-5 relative z-10">
//                 <div>
//                   <label className={labelClass}>Department Registry</label>
//                   <select required className={inputClass} value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
//                     {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//                   </select>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Designation Title</label>
//                   <input required className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Openings</label>
//                     <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Status</label>
//                     <select className={inputClass} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
//                       <option value="open">OPEN</option>
//                       <option value="closed">CLOSED</option>
//                       <option value="on-hold">ON HOLD</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Location Node</label>
//                     <input className={inputClass} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Salary (LPA)</label>
//                     <input className={inputClass} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Registry Deadline</label>
//                   <input type="date" className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div>
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={saving}
//                 className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {saving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> Push Updates</>}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: RICH TEXT EDITORS */}
//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Protocol Content</h3>
//                 </div>
//               </div>
              
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Job Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Tactical Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//       `}} />
//     </div>
//   );
// };

// export default EditVacancyPage;