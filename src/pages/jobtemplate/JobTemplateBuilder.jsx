import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  MapPin,
  Banknote,
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Target,
  Zap,
  Globe,
  Loader2,
  CheckCircle2, 
  ChevronRight,
  Lock,
  ArrowUpRight,
  Filter,
  X,
  ClipboardCheck,
  Calendar,
  Hash,
} from "lucide-react";
import {
  createJobTemplate,
  getJobTemplates,
  getJobTemplateById,
} from "../../services/jobTemplateService";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const JobTemplateBuilder = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [editorKey, setEditorKey] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // State for Modal
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    content: "",
    responsibilities: "",
    requirements: "",
    location: "",
    salary_range: "",
  });

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getJobTemplates();
        setSavedTemplates(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchTemplates();
  }, []);

  // const handleSubmit = async () => {
  //   try {
  //     setLoading(true);

  //     const newTemplate = await createJobTemplate(formData);

  //     setSavedTemplates((prev) => [...prev, newTemplate]);

  //     setFormData({
  //       title: "",
  //       role: "",
  //       content: "",
  //       responsibilities: "",
  //       requirements: "",
  //       location: "",
  //       salary_range: "",
  //     });
  //   } catch (err) {
  //     console.error("Create failed:", err);
  //     alert("Failed to create template");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // --- MODAL COMPONENT ---
  
//   const handleSubmit = async () => {
//   try {
//     setLoading(true);

//     const newTemplate = await createJobTemplate(formData);

//     setSavedTemplates((prev) => [...prev, newTemplate]);

//     // ✅ Clear all fields including ReactQuill
//     setFormData({
//       title: "",
//       role: "",
//       content: "",
//       responsibilities: "",
//       requirements: "",
//       location: "",
//       salary_range: "",
//     });

//     setEditorKey((prev) => prev + 1);

//     // ✅ Success Toast
//     toast.success("Job Template Created Successfully 🚀");

//   } catch (err) {
//     console.error("Create failed:", err);
//     toast.error("Failed to create template ❌");
//   } finally {
//     setLoading(false);
//   }
// };

// const handleSubmit = async () => {
//   try {
//     setLoading(true);

//     const newTemplate = await createJobTemplate(formData);

//     setSavedTemplates((prev) => [...prev, newTemplate]);

//     // Clear form
//     setFormData({
//       title: "",
//       role: "",
//       content: "",
//       responsibilities: "",
//       requirements: "",
//       location: "",
//       salary_range: "",
//     });

//     // Force reset ReactQuill
//     setEditorKey((prev) => prev + 1);
//     toast.success("Job Template Created Successfully 🚀");
// setTimeout(() => {
//   navigate("/candidate");
// }, 1000);
//   } catch (err) {
//     console.error("Create failed:", err);
//     toast.error("Failed to create template ❌");
//   } finally {
//     setLoading(false);
//   }
// };

const handleSubmit = async () => {
  try {
    setLoading(true);

    const newTemplate = await createJobTemplate(formData);
    setSavedTemplates((prev) => [...prev, newTemplate]);

    setFormData({
      title: "",
      role: "",
      content: "",
      responsibilities: "",
      requirements: "",
      location: "",
      salary_range: "",
    });

    setEditorKey((prev) => prev + 1);

    // toast.success("Job Template Created Successfully 🚀");

    // Ask user
    // const go = window.confirm("Template created. Go to Candidate page?");
    // if (go) navigate("/candidate");

//     toast.success(
//   (t) => (
//     <div className="flex items-center gap-3">
//       <span>Template Created 🚀</span>
//       <button
//         onClick={() => {
//           navigate("/candidate");
//           toast.dismiss(t.id);
//         }}
//         className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
//       >
//         Go
//       </button>
//     </div>
//   ),
//   { duration: 4000 }
// );
setIsSuccessModalOpen(true);


  } catch (err) {
    console.error("Create failed:", err);
    toast.error("Failed to create template ❌");
  } finally {
    setLoading(false);
  }
};



const role = sessionStorage.getItem("role");

const roleLabelMap = {
  super_admin: "Super Admin",
  admin: "Administrator",
  hr_admin: "HR Admin",
  manager: "Manager",
  employee: "Employee",
};

const displayRole = roleLabelMap[role] || "User";

const MAX_LENGTH = 10000;

  
  const TemplateModal = ({ data, onClose }) => {
    if (!data) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
          {/* Header: Global Context & Control */}
          <div className="bg-white px-10 py-6 border-b border-slate-100 flex items-center justify-between z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                  <ShieldCheck size={24} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                   Email Template Preview
                  </h3>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded uppercase">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] font-mono font-bold text-slate-400 mt-0.5">
                  {/* UUID: {data.id}-ALPHA-REGISTRY */}
                   Template ID: {data?.id || "N/A"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* Split Body: Sidebar Metadata + Logic Canvas */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Key Variables */}
            <div className="w-80 bg-slate-50/50 border-r border-slate-100 p-8 space-y-8 overflow-y-auto">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Template Details
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      label: "Title",
                      value: data.title,
                      icon: <FileText size={14} />,
                    },
                    {
                      label: "Designation",
                      value: data.role,
                      icon: <Globe size={14} />,
                    },
                    {
                      label: "Interview Venue",
                      value: data.location,
                      icon: <MapPin size={14} />,
                    },
                    {
                      label: "Annual Salary",
                      value: data.salary_range,
                      icon: <Banknote size={14} />,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-1 text-slate-400">
                        {item.icon}
                        <p className="text-[9px] font-black uppercase tracking-tight">
                          {item.label}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2rem] text-white">
                <Zap size={20} className="text-blue-400 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                  Compliance Intelligence
                </p>
                <p className="text-[10px] font-medium leading-relaxed opacity-70">
                  Document matches regional labor standards for {data.location}.
                </p>
              </div> */}
            </div>

            {/* Right Panel: The Document Canvas */}
            <div className="flex-1 p-12 overflow-y-auto bg-white relative">
              <div className="max-w-2xl mx-auto space-y-12">
                <header className="border-b border-slate-100 pb-10">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
                    Official Specification
                  </span>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter mt-3 leading-tight">
                    {data.title}
                  </h2>
                </header>

                {[
                  {
                    label: "Executive Summary",
                    content: data.content,
                    icon: <Target className="text-blue-500" />,
                  },
                  {
                    label: "Primary Deliverables",
                    content: data.responsibilities,
                    icon: <Zap className="text-amber-500" />,
                  },
                  {
                    label: "Candidate Prerequisite",
                    content: data.requirements,
                    icon: <ClipboardCheck className="text-emerald-500" />,
                  },
                ].map((section, idx) => (
                  <div key={idx} className="group transition-all">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        {React.cloneElement(section.icon, { size: 16 })}
                      </div>
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">
                        {section.label}
                      </h4>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    {/* <div className="pl-12">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium italic opacity-90">
                        {section.content || "No structural content committed."}
                      </p>
                    </div> */}
                    <div className="pl-12">
                      <div
                        className="text-sm text-slate-600 leading-relaxed font-medium max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-5 [&_ol]:ml-5"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            decodeHtml(section.content || ""),
                          ),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer: Final Authorization */}
          <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            {/* <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Authentication Date
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {data.date}
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8 font-sans antialiased text-slate-900">
      {/* Modal Trigger */}
      <TemplateModal
        data={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />

      {/* --- TOP HUD --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black tracking-widest uppercase">
              Compliance Terminal
            </div>
            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
              <Lock size={10} /> End-to-End Encrypted
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {/* Job Architecture{" "}
            <span className="text-slate-400 font-light">&</span> Governance */}
            Job Email Template
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block text-right mr-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Active Session
            </p>
            <p className="text-[11px] font-bold text-slate-700">
             {displayRole}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title}
            className="group relative overflow-hidden bg-slate-950 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 disabled:opacity-20 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus
                  size={14}
                  className="group-hover:rotate-90 transition-transform"
                />
              )}
            Save Template
            </span>
          </button>
        </div>
      </div>

      {/* --- MAIN BUILDER INTERFACE (Inputs) --- */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Variable Config
              </h3>
              <Zap size={16} className="text-amber-400 fill-amber-400" />
            </div>
            <div className="space-y-6">
              {[
                {
                  label: "Title",
                  key: "title",
                  icon: <FileText size={16} />,
                  placeholder: "e.g. Lead Dev",
                },
                {
                  label: "Job Designation",
                  key: "role",
                  icon: <Globe size={16} />,
                  placeholder: "e.g. Fintech",
                },
                {
                  label: "Interview Venue",
                  key: "location",
                  icon: <MapPin size={16} />,
                  placeholder: "e.g. India / Remote",
                },
                {
                  label: "Annual Salary",
                  key: "salary_range",
                  icon: <Banknote size={16} />,
                  placeholder: "e.g. ₹90k - ₹120k",
                },
              ].map((field) => (
                <div key={field.key} className="relative group">
                  <label className="absolute -top-2 left-4 bg-white px-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter z-10 group-focus-within:text-blue-600 transition-colors">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                      {field.icon}
                    </div>
                    <input
                      type="text"
                      value={formData[field.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Static Compliance Info Card */}
          {/* <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
            <ShieldCheck
              size={120}
              className="absolute -bottom-10 -right-10 text-white/10"
            />
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">
              Compliance Protocol
            </h4>
            <p className="text-sm font-medium leading-relaxed">
              Every job description is automatically cross-referenced against
              regional labor laws.
            </p>
          </div> */}
        </div>

        {/* MAIN CANVAS (Textareas) */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-1">
          <div className="bg-slate-50/50 rounded-[2.2rem] p-8 h-full">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-4">
              <Target size={18} className="text-blue-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                Document Overview
              </h3>
            </div>
            <div className="space-y-8">
              {[
                {
                  label: "Summary Overview",
                  key: "content",
                  h: "h-32",
                  hint: "Strategic overview",
                },
                {
                  label: "Key Responsibilities",
                  key: "responsibilities",
                  h: "h-40",
                  hint: "KPIs and daily operations",
                },
                {
                  label: "Job Requirements",
                  key: "requirements",
                  h: "h-40",
                  hint: "Tech stack",
                },
              ].map((section) => (
                <div key={section.key} className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {section.label}
                    </label>
                    <span className="text-[9px] font-bold text-slate-300 italic">
                      {section.hint}
                    </span>
                  </div>
                  {/* <textarea
                      value={formData[section.key]}
                      onChange={(e) => setFormData({...formData, [section.key]: e.target.value})}
                      className={`w-full ${section.h} p-6 bg-white border border-slate-200 rounded-[1.8rem] text-sm font-medium text-slate-600 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none leading-relaxed shadow-inner`}
                      placeholder="Input content here..."
                    /> */}
                  {/* <ReactQuill
                   key={editorKey}
                    value={formData[section.key]}
                    onChange={(value) =>
                      setFormData({ ...formData, [section.key]: value })
                    }
                    className="bg-white rounded-xl"
                    placeholder="Input content here..."
                  /> */}
                  <ReactQuill
  key={`${editorKey}-${section.key}`}
  value={formData[section.key]}
  onChange={(value) =>
    setFormData({ ...formData, [section.key]: value })
  }
  className="custom-quill"
  placeholder="Input content here..."
/>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- DATA REGISTRY (Table) --- */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
             Stored Email Templates
            </h3>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                <Filter size={14} />{" "}
                <span className="text-[10px] font-black uppercase">Filter</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
                <Search size={14} />{" "}
                <span className="text-[10px] font-black uppercase">Search</span>
              </div>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 rounded-full tracking-tighter">
            {savedTemplates.length} ACTIVE RECORDS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Record ID
                </th>
                <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Designation
                </th>
                <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  System Status
                </th>
                <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {savedTemplates.length > 0 ? (
                savedTemplates.map((template, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50/30 transition-all group"
                  >
                    <td className="px-10 py-6">
                      <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        #COMP-{template.id}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 tracking-tight">
                          {template.title}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                          {template.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                          Verified
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {/* Triggering Modal with 'template' data */}
                      <button
                        onClick={async () => {
                          const fullData = await getJobTemplateById(
                            template.id,
                          );
                          setSelectedTemplate(fullData);
                        }}
                        className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-10 py-24 text-center">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">
                      No logic committed to registry
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

   

{/* ================= SUCCESS PROTOCOL MODAL ================= */}
{isSuccessModalOpen && (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
    {/* Backdrop with high-density blur */}
    <div
      className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
      onClick={() => setIsSuccessModalOpen(false)}
    />

    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200">
      
      <div className="p-10 flex flex-col items-center text-center">
        {/* SUCCESS ICON NODE */}
        <div className="relative mb-6">
          {/* Decorative Halo */}
          <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 animate-pulse" />
          <div className="relative w-20 h-20 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-200 border-4 border-white">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
        </div>

        {/* MESSAGING: Professional Tone */}
        <div className="space-y-2 mb-8">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">
            Template Staged
          </h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            Transmission manifest has been successfully written to the registry.
          </p>
        </div>

        {/* ACTION PANEL */}
        <div className="w-full space-y-3">
          <button
            onClick={() => {
              setIsSuccessModalOpen(false);
              navigate("/candidate");
            }}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            Go to Candidates
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => setIsSuccessModalOpen(false)}
            className="w-full py-3 bg-white border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
          >
            Stay on Page
          </button>
        </div>
      </div>

      {/* FOOTER METADATA */}
      <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-center items-center gap-3 opacity-40">
        <ShieldCheck size={12} className="text-slate-400" />
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">System Confirmation Verified</span>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default JobTemplateBuilder;
//**************************************************************************************************** */
// import React, { useState } from 'react';
// import {
//   ShieldCheck,
//   MapPin,
//   Banknote,
//   Plus,
//   Search,
//   MoreHorizontal,
//   FileText,
//   Target,
//   Zap,
//   Globe,
//   Loader2,
//   Lock,
//   ArrowUpRight,
//   Filter
// } from 'lucide-react';

// const JobTemplateBuilder = () => {
//   const [loading, setLoading] = useState(false);
//     const [savedTemplates, setSavedTemplates] = useState([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     role: "",
//     content: "",
//     responsibilities: "",
//     requirements: "",
//     location: "",
//     salary_range: ""
//   });

//   // ✅ Submit handler
//   const handleSubmit = async () => {
//     setLoading(true);

//     // Save data to table
//     setSavedTemplates((prev) => [...prev, formData]);

//     // Reset form
//     setFormData({
//       title: "",
//       role: "",
//       content: "",
//       responsibilities: "",
//       requirements: "",
//       location: "",
//       salary_range: ""
//     });

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8 font-sans antialiased text-slate-900">

//       {/* --- TOP HUD (Heads Up Display) --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <div className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black tracking-widest uppercase">
//               Compliance Terminal
//             </div>
//             <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
//               <Lock size={10} /> End-to-End Encrypted
//             </div>
//           </div>
//           <h1 className="text-2xl font-black tracking-tight text-slate-900">
//             Job Architecture <span className="text-slate-400 font-light">&</span> Governance
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="hidden lg:block text-right mr-4">
//             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Session</p>
//             <p className="text-[11px] font-bold text-slate-700">Root_Administrator</p>
//           </div>
//           <button
//             onClick={handleSubmit}
//             disabled={loading || !formData.title}
//             className="group relative overflow-hidden bg-slate-950 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 disabled:opacity-20 active:scale-95"
//           >
//             <span className="relative z-10 flex items-center gap-2">
//               {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} className="group-hover:rotate-90 transition-transform" />}
//               Commit Logic to Registry
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* --- MAIN BUILDER INTERFACE --- */}
//       <div className="grid grid-cols-12 gap-6">

//         {/* SIDEBAR CONFIGURATION */}
//         <div className="col-span-12 lg:col-span-4 space-y-6">
//           <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8">
//             <div className="flex items-center justify-between mb-8">
//               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Variable Config</h3>
//               <Zap size={16} className="text-amber-400 fill-amber-400" />
//             </div>

//             <div className="space-y-6">
//               {[
//                 { label: "Job Designation", key: "title", icon: <FileText size={16}/>, placeholder: "e.g. Lead Dev" },
//                 { label: "Business Unit", key: "role", icon: <Globe size={16}/>, placeholder: "e.g. Fintech" },
//                 { label: "Jurisdiction", key: "location", icon: <MapPin size={16}/>, placeholder: "e.g. London / Remote" },
//                 { label: "Annual Compensation", key: "salary_range", icon: <Banknote size={16}/>, placeholder: "e.g. £90k - £120k" },
//               ].map((field) => (
//                 <div key={field.key} className="relative group">
//                   <label className="absolute -top-2 left-4 bg-white px-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter z-10 group-focus-within:text-blue-600 transition-colors">
//                     {field.label}
//                   </label>
//                   <div className="relative">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
//                       {field.icon}
//                     </div>
//                     <input
//                       type="text"
//                       value={formData[field.key]}
//                       onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
//                       placeholder={field.placeholder}
//                       className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 transition-all placeholder:text-slate-300 placeholder:font-medium"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
//             <ShieldCheck size={120} className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
//             <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Compliance Protocol</h4>
//             <p className="text-sm font-medium leading-relaxed">
//               Every job description generated is automatically cross-referenced against regional labor laws and internal equity standards.
//             </p>
//           </div>
//         </div>

//         {/* MAIN CANVAS */}
//         <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-1">
//            <div className="bg-slate-50/50 rounded-[2.2rem] p-8 h-full">
//               <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-4">
//                 <Target size={18} className="text-blue-600" />
//                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Document Canvas</h3>
//               </div>

//               <div className="space-y-8">
//                 {[
//                   { label: "Executive Summary", key: "content", h: "h-32", hint: "Strategic overview of the role" },
//                   { label: "Key Deliverables", key: "responsibilities", h: "h-48", hint: "KPIs and daily operations" },
//                   { label: "Prerequisite Capabilities", key: "requirements", h: "h-48", hint: "Technical and soft skill stack" },
//                 ].map((section) => (
//                   <div key={section.key} className="space-y-2">
//                     <div className="flex justify-between items-center ml-1">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                         {section.label}
//                       </label>
//                       <span className="text-[9px] font-bold text-slate-300 italic">{section.hint}</span>
//                     </div>
//                     <textarea
//                       value={formData[section.key]}
//                       onChange={(e) => setFormData({...formData, [section.key]: e.target.value})}
//                       className={`w-full ${section.h} p-6 bg-white border border-slate-200 rounded-[1.8rem] text-sm font-medium text-slate-600 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none leading-relaxed shadow-inner`}
//                       placeholder="Input content here..."
//                     />
//                   </div>
//                 ))}
//               </div>
//            </div>
//         </div>
//       </div>

//       {/* --- DATA REGISTRY (Table) --- */}
//       <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
//         <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
//           <div className="flex items-center gap-6">
//             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Logic Registry</h3>
//             <div className="h-4 w-[1px] bg-slate-200" />
//             <div className="flex items-center gap-4 text-slate-400">
//                <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
//                   <Filter size={14} /> <span className="text-[10px] font-black uppercase">Filter</span>
//                </div>
//                <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
//                   <Search size={14} /> <span className="text-[10px] font-black uppercase">Search</span>
//                </div>
//             </div>
//           </div>
//           <span className="px-4 py-1.5 bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 rounded-full tracking-tighter">
//             {savedTemplates.length} ACTIVE RECORDS
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/30">
//                 <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Record ID</th>
//                 <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Designation</th>
//                 <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">System Status</th>
//                 <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Reference</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {savedTemplates.length > 0 ? savedTemplates.map((template, idx) => (
//                 <tr key={idx} className="hover:bg-blue-50/30 transition-all group cursor-pointer">
//                   <td className="px-10 py-6">
//                     <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
//                       #COMP-{2000 + idx}
//                     </span>
//                   </td>
//                   <td className="px-10 py-6">
//                     <div className="flex flex-col">
//                       <span className="text-sm font-black text-slate-800 tracking-tight">{template.title}</span>
//                       <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{template.role}</span>
//                     </div>
//                   </td>
//                   <td className="px-10 py-6">
//                     <div className="flex items-center gap-2">
//                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
//                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Verified</span>
//                     </div>
//                   </td>
//                   <td className="px-10 py-6 text-right">
//                     <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-lg border border-transparent hover:border-slate-100">
//                       <ArrowUpRight size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan="4" className="px-10 py-24 text-center">
//                     <div className="inline-flex p-6 bg-slate-50 rounded-[2rem] mb-4">
//                       <FileText size={40} className="text-slate-200" />
//                     </div>
//                     <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">No logic committed to registry</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobTemplateBuilder;
// import React, { useState } from 'react';
// import {
//   ShieldCheck,
//   MapPin,
//   Banknote,
//   Plus,
//   Search,
//   MoreHorizontal,
//   FileText,
//   Target,
//   Zap,
//   Globe,
//   Loader2,
//   ChevronRight
// } from 'lucide-react';

// const JobTemplateBuilder = ({ onPublish, savedTemplates = [] }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     role: "",
//     content: "",
//     responsibilities: "",
//     requirements: "",
//     location: "",
//     salary_range: ""
//   });

//   const handleSubmit = async () => {
//     setLoading(true);
//     await onPublish(formData);
//     setLoading(false);
//   };

//   return (
//     <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">

//       {/* --- BUILDER SECTION --- */}
//       <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
//         {/* Compliance Header */}
//         <div className="px-6 py-4 bg-slate-900 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-inner">
//               <ShieldCheck size={20} />
//             </div>
//             <div>
//               <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">
//                 JD Compliance Engine
//               </h2>
//               <p className="text-[10px] text-blue-300 font-bold uppercase mt-1 tracking-tighter">
//                 Regulatory Standard: ISO-27001 / HR-COMP
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="hidden md:flex flex-col items-end mr-4">
//               <span className="text-[9px] font-black text-slate-400 uppercase">System Status</span>
//               <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
//                 <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" /> Encrypted Connection
//               </span>
//             </div>
//             <button
//               onClick={handleSubmit}
//               disabled={loading || !formData.title}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-30"
//             >
//               {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
//               Commit Template
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-12">
//           {/* LEFT: Config Panel */}
//           <div className="col-span-12 lg:col-span-4 border-r border-slate-100 bg-slate-50/30 p-6 space-y-6">
//             <div className="space-y-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Zap size={14} className="text-blue-500" />
//                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Metadata Config</h3>
//               </div>

//               <div className="space-y-4">
//                 {[
//                   { label: "Internal Job Title", key: "title", icon: <FileText size={14}/>, placeholder: "Lead Systems Architect" },
//                   { label: "Organizational Role", key: "role", icon: <Globe size={14}/>, placeholder: "Infrastucture Dept." },
//                   { label: "Geo-Location", key: "location", icon: <MapPin size={14}/>, placeholder: "Hybrid / London" },
//                   { label: "Compensation Bracket", key: "salary_range", icon: <Banknote size={14}/>, placeholder: "£85,000 - £110,000" },
//                 ].map((field) => (
//                   <div key={field.key} className="group">
//                     <label className="text-[9px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-tighter">
//                       {field.label}
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
//                         {field.icon}
//                       </div>
//                       <input
//                         type="text"
//                         value={formData[field.key]}
//                         onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
//                         placeholder={field.placeholder}
//                         className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: Content Canvas */}
//           <div className="col-span-12 lg:col-span-8 p-6 space-y-6">
//             <div className="flex items-center gap-2 mb-2">
//               <Target size={14} className="text-blue-500" />
//               <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Drafting Canvas</h3>
//             </div>

//             <div className="space-y-6">
//               {[
//                 { label: "Executive Summary", key: "content", h: "h-24" },
//                 { label: "Primary Responsibilities", key: "responsibilities", h: "h-36" },
//                 { label: "Technical Requirements", key: "requirements", h: "h-36" },
//               ].map((section) => (
//                 <div key={section.key} className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">
//                     {section.label}
//                   </label>
//                   <textarea
//                     value={formData[section.key]}
//                     onChange={(e) => setFormData({...formData, [section.key]: e.target.value})}
//                     className={`w-full ${section.h} p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:bg-white focus:border-blue-400 transition-all resize-none leading-relaxed`}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- REPOSITORY SECTION (Where data is seen) --- */}
//       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
//         <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Template Repository</h3>
//             <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black text-slate-500 rounded-md">
//               {savedTemplates.length} Records
//             </span>
//           </div>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//             <input
//               type="text"
//               placeholder="Filter templates..."
//               className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-blue-400 w-64"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
//                 <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</th>
//                 <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</th>
//                 <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {savedTemplates.length > 0 ? savedTemplates.map((template, idx) => (
//                 <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="text-xs font-bold text-slate-700">{template.title}</span>
//                       <span className="text-[9px] font-medium text-slate-400 uppercase">ID: TMP-00{idx + 1}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-xs font-bold text-slate-500">{template.role}</td>
//                   <td className="px-6 py-4">
//                     <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-tighter">
//                       {template.location}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-right">
//                     <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
//                       <MoreHorizontal size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan="4" className="px-6 py-12 text-center text-slate-300">
//                     <FileText size={40} className="mx-auto mb-2 opacity-20" />
//                     <p className="text-[10px] font-black uppercase tracking-[0.2em]">No compliance records found</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobTemplateBuilder;
// import React, { useState } from 'react';
// import {
//   Briefcase,
//   MapPin,
//   DollarSign,
//   FileText,
//   Target,
//   CheckCircle2,
//   Send,
//   Loader2,
//   LayoutTemplate
// } from 'lucide-react';

// const JobTemplateBuilder = ({ onPublish }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     role: "",
//     content: "",
//     responsibilities: "",
//     requirements: "",
//     location: "",
//     salary_range: ""
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // Logic for API call
//     await onPublish(formData);
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
//       {/* HEADER SECTION */}
//       <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
//             <LayoutTemplate size={24} />
//           </div>
//           <div>
//             <h2 className="text-xl font-black text-slate-800 tracking-tight">Job Description Template</h2>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Define role specifications & requirements</p>
//           </div>
//         </div>
//         <button
//           onClick={handleSubmit}
//           disabled={loading || !formData.title}
//           className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
//         >
//           {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
//           Publish Template
//         </button>
//       </div>

//       <div className="p-8 grid grid-cols-12 gap-8">
//         {/* LEFT COLUMN: PRIMARY METADATA */}
//         <div className="col-span-12 lg:col-span-4 space-y-6">
//           <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl space-y-5">
//             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Core Identity</h4>

//             {/* Title */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Job Title</label>
//               <input
//                 type="text"
//                 placeholder="e.g. Senior Product Designer"
//                 className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
//                 value={formData.title}
//                 onChange={(e) => setFormData({...formData, title: e.target.value})}
//               />
//             </div>

//             {/* Role */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Department / Role</label>
//               <div className="relative">
//                 <Briefcase className="absolute left-3 top-2.5 text-slate-300" size={14} />
//                 <input
//                   type="text"
//                   placeholder="e.g. Engineering"
//                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
//                   value={formData.role}
//                   onChange={(e) => setFormData({...formData, role: e.target.value})}
//                 />
//               </div>
//             </div>

//             {/* Location */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Location</label>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-2.5 text-slate-300" size={14} />
//                 <input
//                   type="text"
//                   placeholder="Remote / Mumbai"
//                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
//                   value={formData.location}
//                   onChange={(e) => setFormData({...formData, location: e.target.value})}
//                 />
//               </div>
//             </div>

//             {/* Salary Range */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Salary Range</label>
//               <div className="relative">
//                 <DollarSign className="absolute left-3 top-2.5 text-slate-300" size={14} />
//                 <input
//                   type="text"
//                   placeholder="e.g. $80k - $120k"
//                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
//                   value={formData.salary_range}
//                   onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: LONG FORM CONTENT */}
//         <div className="col-span-12 lg:col-span-8 space-y-6">
//           {/* Main Description */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-slate-800 ml-1">
//               <FileText size={16} className="text-blue-500" />
//               <label className="text-[11px] font-black uppercase tracking-wider">About the Role (Content)</label>
//             </div>
//             <textarea
//               className="w-full h-32 p-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none leading-relaxed"
//               placeholder="Provide a high-level overview of the mission..."
//               value={formData.content}
//               onChange={(e) => setFormData({...formData, content: e.target.value})}
//             />
//           </div>

//           {/* Responsibilities */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-slate-800 ml-1">
//               <Target size={16} className="text-orange-500" />
//               <label className="text-[11px] font-black uppercase tracking-wider">Key Responsibilities</label>
//             </div>
//             <textarea
//               className="w-full h-40 p-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none leading-relaxed"
//               placeholder="• Manage end-to-end development&#10;• Collaborate with cross-functional teams..."
//               value={formData.responsibilities}
//               onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
//             />
//           </div>

//           {/* Requirements */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-slate-800 ml-1">
//               <CheckCircle2 size={16} className="text-emerald-500" />
//               <label className="text-[11px] font-black uppercase tracking-wider">Requirements & Skills</label>
//             </div>
//             <textarea
//               className="w-full h-40 p-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none leading-relaxed"
//               placeholder="• 5+ years of experience in React&#10;• Strong communication skills..."
//               value={formData.requirements}
//               onChange={(e) => setFormData({...formData, requirements: e.target.value})}
//             />
//           </div>
//         </div>
//       </div>

//       {/* FOOTER AUDIT INFO */}
//       <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Enterprise HR Module v2.4</p>
//         <div className="flex gap-4">
//           <span className="text-[9px] font-bold text-slate-300">DRAFT AUTO-SAVED</span>
//           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">UTF-8 Encoded</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobTemplateBuilder;
