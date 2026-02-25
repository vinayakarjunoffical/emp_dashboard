import React, { useState, useEffect ,useRef  } from "react";
import ReactQuill from "react-quill-new";
import { useNavigate } from "react-router-dom"; 
import "react-quill-new/dist/quill.snow.css";
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Calendar, 
  IndianRupee,
  Layers, 
  ArrowRight,
  FileText, 
  PlusCircle, 
  X,
  Info,
  Edit3,
  Search,
  Check,
  ShieldCheck,
  Zap,
  Loader2,
  ChevronDown,
  Plus,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

const VacanciesPage = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  // --- NEW STATE FOR LISTING & PAGINATION ---
  const [vacancies, setVacancies] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
const [deptSearch, setDeptSearch] = useState("");
const [showDeptDrop, setShowDeptDrop] = useState(false);
const dropdownRef = useRef(null);
const [cityOptions, setCityOptions] = useState([]);
const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  const [templateDetails, setTemplateDetails] = useState({}); // Stores { [jdId]: { title, content } }
const [loadingJD, setLoadingJD] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    department_id: "",
    number_of_openings: 1,
    location: "",
    experience_required: "",
    salary_range: "",
    status: "open",
    deadline_date: new Date().toISOString().split("T")[0],
    content: "",
    responsibilities: "",
    requirements: ""
  });

  // 1. Fetch Master Data & Vacancies
  useEffect(() => {
    fetchMasters();
    fetchVacancies();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDeptDrop(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const fetchMasters = async () => {
    try {
      const res = await fetch("https://apihrr.goelectronix.co.in/departments");
      const data = await res.json();
      setDepartments(data || []);
    } catch (err) {
      toast.error("Registry connection failed");
    }
  };

  const fetchVacancies = async () => {
    setLoadingList(true);
    try {
      // Fetching with high limit as per your URL example
      const res = await fetch("https://apihrr.goelectronix.co.in/vacancies?skip=0&limit=100");
      const data = await res.json();
      setVacancies(data || []);
    } catch (err) {
      console.error("Failed to load vacancies");
    } finally {
      setLoadingList(false);
    }
  };

  const fetchPincodeDetails = async (pincode) => {
  if (pincode.length !== 6) return;
  setIsFetchingPincode(true);
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    if (data[0]?.Status === "Success") {
      const offices = data[0].PostOffice;
      setCityOptions(offices);
      // Auto-fill with first option
      setFormData(prev => ({
        ...prev,
        city: offices[0].Name,
        location: offices[0].Name, // Syncing location with city
        state: offices[0].State,
        district: offices[0].District,
        country: offices[0].Country
      }));
    }
  } catch (err) { toast.error("Geo-sync failed"); }
  finally { setIsFetchingPincode(false); }
};

  const fetchJDDetails = async (jdId) => {
  // If we already have the data, don't fetch again
  if (templateDetails[jdId]) return;

  setLoadingJD(jdId);
  try {
    const res = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${jdId}`);
    const data = await res.json();
    setTemplateDetails(prev => ({
      ...prev,
      [jdId]: data
    }));
  } catch (err) {
    toast.error("Failed to fetch job protocol details");
  } finally {
    setLoadingJD(null);
  }
};

const generateExpOptions = () => {
  const options = [];
  options.push(<option key="0.5" value="0.5">6 Months</option>);
  for (let i = 1; i <= 10; i++) {
    options.push(<option key={i} value={i}>{i} Year{i > 1 ? 's' : ''}</option>);
  }
  return options;
};

  // 2. Sequential Logic: Create JD -> Get ID -> Create Vacancy
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Executing Multi-Stage Deployment...");

    try {
      const jdBody = {
        title: formData.title,
        role: formData.title,
        content: formData.content,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        location: formData.location,
        salary_range: formData.salary_range
      };

      const jdResponse = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jdBody)
      });

      if (!jdResponse.ok) throw new Error("JD Protocol Creation Failed");
      
      const jdData = await jdResponse.json();
      const newJdId = jdData.id;

      const vacancyBody = {
        title: formData.title,
        job_description_id: newJdId,
        department_id: parseInt(formData.department_id),
        number_of_openings: parseInt(formData.number_of_openings),
        location: formData.location,
        experience_required: formData.experience_required,
        salary_range: formData.salary_range,
        status: formData.status,
        deadline_date: formData.deadline_date
      };

      const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vacancyBody),
      });

      if (!vacancyRes.ok) throw new Error("Vacancy Deployment Failed");

      toast.success("Vacancy Node Active & Linked! 🚀", { id: loadingToast });
      
      // Refresh list and clear form
      fetchVacancies();
      setFormData({
        title: "", department_id: "", number_of_openings: 1, location: "",
        experience_required: "", salary_range: "", status: "open",
        deadline_date: new Date().toISOString().split("T")[0],
        content: "", responsibilities: "", requirements: ""
      });

    } catch (err) {
      toast.error(err.message || "Transmission failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (vacancy) => {
  const isOpening = openAccordionId !== vacancy.id;
  setOpenAccordionId(isOpening ? vacancy.id : null);
  
  if (isOpening && vacancy.job_description_id) {
    fetchJDDetails(vacancy.job_description_id);
  }
};

  // Pagination Calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVacancies = vacancies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vacancies.length / itemsPerPage);

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm";
  const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";
  
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER STRIP */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <ShieldCheck className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none" size={120} />
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <Zap size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Vacancy</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                <Layers size={12} className="text-blue-500" /> Recruitment System
              </p>
            </div>
          </div>
        </div>

        {/* --- EXISTING FORM LOGIC --- */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">
              
              {/* Department Multi-Select */}
              <div className="relative" ref={dropdownRef}>
                <label className={labelClass}>Department</label>
                <div 
                  onClick={() => setShowDeptDrop(!showDeptDrop)}
                  className="min-h-[48px] w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 transition-all shadow-inner"
                >
                  {formData.department_id.length > 0 ? (
                    formData.department_id.map(id => (
                      <span key={id} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95">
                        {departments.find(d => d.id.toString() === id.toString())?.name}
                        <X size={12} className="hover:text-red-400" onClick={(e) => {
                          e.stopPropagation();
                          setFormData({...formData, department_id: formData.department_id.filter(item => item !== id)});
                        }} />
                      </span>
                    ))
                  ) : <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Select department...</span>}
                </div>
                {showDeptDrop && (
                  <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-50"><input autoFocus placeholder="Filter department..." value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} className="w-full px-3 py-2 bg-slate-50 rounded-lg text-[11px] font-bold outline-none" /></div>
                    <div className="max-h-48 overflow-y-auto p-2">
                      {departments.filter(d => d.name.toLowerCase().includes(deptSearch.toLowerCase())).map(dept => (
                        <button key={dept.id} type="button" onClick={() => {
                          const isSelected = formData.department_id.includes(dept.id.toString());
                          setFormData({...formData, department_id: isSelected ? formData.department_id.filter(i => i !== dept.id.toString()) : [...formData.department_id, dept.id.toString()]});
                        }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight mb-1 ${formData.department_id.includes(dept.id.toString()) ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                          {dept.name} {formData.department_id.includes(dept.id.toString()) && <Check size={14} strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div>
                <label className={labelClass}>Job Identity</label>
                <input required placeholder="Position Title" className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
                <div>
                  <label className={labelClass}>Opening</label>
                  <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
                </div>
  
              </div>

              {/* GEOLOCATION ENGINE */}
    <div className="space-y-4 pt-2 border-t border-slate-50">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Pincode</label>
          <div className="relative">
            <input maxLength={6} placeholder="000000" className={inputClass} value={formData.pincode} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData({...formData, pincode: val});
                if(val.length === 6) fetchPincodeDetails(val);
              }} 
            />
            {isFetchingPincode && <Loader2 className="absolute right-3 top-2.5 animate-spin text-blue-500" size={16} />}
          </div>
        </div>
        <div>
          <label className={labelClass}>City</label>
          {cityOptions.length > 1 ? (
            <select className={`${inputClass} border-blue-200 bg-blue-50/30`} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value, location: e.target.value})}>
              {cityOptions.map((o, i) => <option key={i} value={o.Name}>{o.Name}</option>)}
            </select>
          ) : (
            <input readOnly placeholder="Auto-fetched" className={`${inputClass} opacity-60`} value={formData.city} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input readOnly placeholder="District" className={`${inputClass} opacity-60`} value={formData.district} />
        <input readOnly placeholder="State" className={`${inputClass} opacity-60`} value={formData.state} />
      </div>
    </div>

              {/* Experience Logic */}
              <div className="pt-2">
                <label className={labelClass}>Experience</label>
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-4">
                  {["Fresher", "Experienced"].map(type => (
                    <button key={type} type="button" onClick={() => setFormData({...formData, experience_required: type === "Fresher" ? "Fresher" : "1 - 3 Years"})} className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${ (type === "Fresher" && formData.experience_required === "Fresher") || (type === "Experienced" && formData.experience_required !== "Fresher") ? "bg-white text-blue-600 shadow-sm" : "text-slate-500" }`}>
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
                {formData.experience_required !== "Fresher" && (
                  <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
                    <select className={inputClass} value={formData.experience_required.split(" - ")[0]} onChange={(e) => setFormData({...formData, experience_required: `${e.target.value} - ${formData.experience_required.split(" - ")[1] || '1'} Years`})}>
                      {generateExpOptions()}
                    </select>
                    <select className={inputClass} value={formData.experience_required.split(" - ")[1]?.replace(" Years", "")} onChange={(e) => setFormData({...formData, experience_required: `${formData.experience_required.split(" - ")[0]} - ${e.target.value} Years`})}>
                      {generateExpOptions()}
                    </select>
                  </div>
                )}
              </div>

              {/* SALARY RANGE & GENDER GRID */}
    <div className="grid grid-cols-1 gap-4 pt-2">

      <div className="space-y-2 pt-2">
  <label className={labelClass}>Budget </label>
  <div className="grid grid-cols-2 gap-4 items-center">
    
    {/* MIN SALARY NODE */}
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
        <IndianRupee size={12} strokeWidth={3} />
      </div>
      <input
        type="number"
        step="0.1"
        placeholder="Min"
        className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        value={formData.salary_range.split(" - ")[0] || ""}
        onChange={(e) => {
          const min = e.target.value;
          const max = formData.salary_range.split(" - ")[1] || "";
          setFormData({ ...formData, salary_range: `${min} - ${max}` });
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="text-[8px] font-black text-slate-300 uppercase">Min</span>
      </div>
    </div>

    {/* MAX SALARY NODE */}
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
        <IndianRupee size={12} strokeWidth={3} />
      </div>
      <input
        type="number"
        step="0.1"
        placeholder="Max"
        className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        value={formData.salary_range.split(" - ")[1] || ""}
        onChange={(e) => {
          const min = formData.salary_range.split(" - ")[0] || "";
          const max = e.target.value;
          setFormData({ ...formData, salary_range: `${min} - ${max}` });
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="text-[8px] font-black text-slate-300 uppercase">Max</span>
      </div>
    </div>

  </div>
  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
    Range in Lakhs Per Annum
  </p>
</div>
     
    </div>

    <div className="space-y-6 pt-6 border-t border-slate-100">
      
      {/* Contact Node Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Company Name</label>
          <input required placeholder="Legal Entity Name" className={inputClass} value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} />
        </div>
        <div>
          <label className={labelClass}>Contact Person Name</label>
          <input required placeholder="Primary HR / Owner" className={inputClass} value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} />
        </div>
      </div>

      {/* Communication Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Phone Number</label>
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-600 transition-all">
            <span className="px-3 py-2.5 bg-slate-100 text-[10px] font-black text-slate-400 border-r border-slate-200">+91</span>
            <input maxLength={10} placeholder="9004949483" className="w-full px-3 bg-transparent text-[13px] font-bold outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input type="email" placeholder="hr@domain.co.in" className={inputClass} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
      </div>

      {/* Profile & Scale Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative group">
          <label className={labelClass}>Contact Person Profile</label>
          <select className={`${inputClass} appearance-none pr-10`} value={formData.contact_profile} onChange={(e) => setFormData({...formData, contact_profile: e.target.value})}>
            <option value="owner">Owner / Partner</option>
            <option value="hr">HR Manager</option>
            <option value="consultant">Third-party Consultant</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
        </div>
        <div className="relative group">
          <label className={labelClass}>Organization Size</label>
          <select className={`${inputClass} appearance-none pr-10`} value={formData.org_size} onChange={(e) => setFormData({...formData, org_size: e.target.value})}>
            <option value="1-10">1 - 10 Employees</option>
            <option value="11-50">11 - 50 Employees</option>
            <option value="51-200">51 - 200 Employees</option>
            <option value="200+">200+ Employees</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Urgency & Frequency Strategy */}
      <div className="space-y-6 pt-2">
        <div>
          <label className={labelClass}>How soon do you want to fill the position?</label>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, urgency: "immediate" })}
              className={`flex-1 py-2.5 text-[9px] font-black rounded-xl transition-all ${formData.urgency === "immediate" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
            >
              IMMEDIATELY (1-2 WEEKS)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, urgency: "wait" })}
              className={`flex-1 py-2.5 text-[9px] font-black rounded-xl transition-all ${formData.urgency === "wait" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
            >
              CAN WAIT
            </button>
          </div>
        </div>

        <div className="relative group">
          <label className={labelClass}>How often do you need to hire?</label>
          <select className={`${inputClass} appearance-none pr-10`} value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
            <option value="monthly">Every Month</option>
            <option value="quarterly">Every Quarter</option>
            <option value="occasionally">Occasionally</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
        </div>
        <div>
          <label className={labelClass}>Job Address</label>
          <input required placeholder="Job Address" className={inputClass} value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} />
        </div>
      </div>
    </div>

              <div className="grid grid-cols-2 gap-5">
              
                 <div>
        <label className={labelClass}>Gender</label>
        <select className={inputClass} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
          <option value="any">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
                <div>
                  <label className={labelClass}>Closing Date</label>
                  <input type="date" min={new Date().toISOString().split("T")[0]} className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={20}/> : <><ShieldCheck size={20} /> Save Vacancy</>}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-blue-600" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">job Vacancy Template</h3>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <label className={labelClass}>01. Overview</label>
                  <div className="enterprise-editor">
                    <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} modules={quillModules} placeholder="Describe the role summary..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>02. Responsibilities</label>
                  <div className="enterprise-editor">
                    <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} modules={quillModules} placeholder="List tactical duties..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>03. Requirements</label>
                  <div className="enterprise-editor">
                    <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} modules={quillModules} placeholder="Skills and certifications..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <hr className="border-slate-200" />

        {/* --- NEW VACANCY LIST SECTION (ACCORDION STYLE) --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Layers size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Active Vacancies </h3>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {vacancies.length} Total Records Found
            </div>
          </div>

          <div className="space-y-4">
            {loadingList ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fetching Vacancies...</p>
              </div>
            ) : currentVacancies.map((vacancy) => (
              <div key={vacancy.id} className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md">
                {/* Accordion Header */}
                <div 
                  // onClick={() => setOpenAccordionId(openAccordionId === vacancy.id ? null : vacancy.id)}
                  onClick={() => toggleAccordion(vacancy)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-slate-900 tracking-tight">{vacancy.title}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                          <MapPin size={12} className="text-blue-500" /> {vacancy.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
                          <Briefcase  className="text-blue-500" size={12} /> Experience : {vacancy.experience_required || "Not Specified"} Years
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
                          <Users size={12} className="text-blue-500" /> {vacancy.number_of_openings} Slots
                        </span>
                      </div>
                    </div>
                  </div>


                  {/* --- ACTION & ACCORDION CONTROL --- */}
<div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end pr-2">
  {/* FINANCIAL METRIC NODE */}
  <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
    <div className="flex items-center justify-end gap-1.5">
      <IndianRupee size={10} className="text-slate-900 stroke-[3]" />
      <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
        {/* Logic to handle both string ranges and numeric formatting */}
        {isNaN(vacancy.salary_range) 
          ? vacancy.salary_range 
          : `${(vacancy.salary_range / 100000).toFixed(1)} LPA`
        }
      </p>
    </div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
      Annual CTC
    </p>
  </div>
  {/* NEW: EDIT REGISTRY BUTTON */}
  <button
    onClick={(e) => {
      e.stopPropagation(); // Stop accordion from opening
      navigate(`/edit-vacancy/${vacancy.id}`); // Adjust this route to your edit page
    }}
    className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90 group"
    title="Edit Vacancy Node"
  >
    <Edit3 size={18} strokeWidth={2.5} />
  </button>

  <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

  {/* INTERACTIVE TOGGLE NODE */}
  <div 
  onClick={(e) => {
    e.stopPropagation(); 
    toggleAccordion(vacancy);
  }}
    className={`group/btn h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm cursor-pointer
      ${openAccordionId === vacancy.id 
        ? 'bg-slate-900 border-slate-900 text-white shadow-slate-200' 
        : 'bg-white border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
      }`}
  >
    {openAccordionId === vacancy.id ? (
      <X size={18} className="animate-in fade-in zoom-in duration-300 stroke-[2.5]" />
    ) : (
      <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-300 stroke-[2.5]" />
    )}
  </div>
</div>
                </div>

                {/* Accordion Body */}
{openAccordionId === vacancy.id && (
  <div className="px-8 pb-10 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-500 bg-slate-50/30">
    {loadingJD === vacancy.job_description_id ? (
      <div className="py-10 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={24} />
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Retrieving Protocol...</p>
      </div>
    ) : (
      <div className="space-y-8">
        {/* TOP INFO BAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
           <div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Role</p>
             <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
               {templateDetails[vacancy.job_description_id]?.title || vacancy.title}
             </p>
           </div>
           <div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Number</p>
             <p className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
               GOEX-V-{vacancy.id}-REF-{vacancy.job_description_id}
             </p>
           </div>
        </div>


        <div className="space-y-4">
  <div className="flex items-center gap-2">
    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
      Job Description
    </h5>
  </div>
  
  <div className="prose prose-slate max-w-full overflow-hidden">
    <div 
      
      className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer break-words [overflow-wrap:anywhere]"
      dangerouslySetInnerHTML={{ 
        __html: templateDetails[vacancy.job_description_id]?.content || "No protocol content available for this node." 
      }} 
    />
  </div>
</div>
        

        {/* ACTION STRIP */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
          
          <button 
          onClick={() => navigate(`/vacancy-details/${vacancy.id}`)}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95">
            Read full job description <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )}
  </div>
)}
              </div>
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-500'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
        .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
        .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default VacanciesPage;
//*********************************************************working code phase 1 25/06/26 ********************************************************* */
// import React, { useState, useEffect ,useRef  } from "react";
// import ReactQuill from "react-quill-new";
// import { useNavigate } from "react-router-dom"; 
// import "react-quill-new/dist/quill.snow.css";
// import { 
//   Briefcase, 
//   MapPin, 
//   Users, 
//   Calendar, 
//   IndianRupee,
//   Layers, 
//   ArrowRight,
//   FileText, 
//   PlusCircle, 
//   X,
//   Info,
//   Edit3,
//   Search,
//   Check,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   ChevronDown,
//   Plus,
//   Clock,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacanciesPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();
//   // --- NEW STATE FOR LISTING & PAGINATION ---
//   const [vacancies, setVacancies] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);
//   const [openAccordionId, setOpenAccordionId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
// const [deptSearch, setDeptSearch] = useState("");
// const [showDeptDrop, setShowDeptDrop] = useState(false);
// const dropdownRef = useRef(null);
// const [cityOptions, setCityOptions] = useState([]);
// const [isFetchingPincode, setIsFetchingPincode] = useState(false);

//   const [templateDetails, setTemplateDetails] = useState({}); // Stores { [jdId]: { title, content } }
// const [loadingJD, setLoadingJD] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
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

//   // 1. Fetch Master Data & Vacancies
//   useEffect(() => {
//     fetchMasters();
//     fetchVacancies();
//   }, []);

//   useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setShowDeptDrop(false);
//     }
//   };
//   document.addEventListener("mousedown", handleClickOutside);
//   return () => document.removeEventListener("mousedown", handleClickOutside);
// }, []);

//   const fetchMasters = async () => {
//     try {
//       const res = await fetch("https://apihrr.goelectronix.co.in/departments");
//       const data = await res.json();
//       setDepartments(data || []);
//     } catch (err) {
//       toast.error("Registry connection failed");
//     }
//   };

//   const fetchVacancies = async () => {
//     setLoadingList(true);
//     try {
//       // Fetching with high limit as per your URL example
//       const res = await fetch("https://apihrr.goelectronix.co.in/vacancies?skip=0&limit=100");
//       const data = await res.json();
//       setVacancies(data || []);
//     } catch (err) {
//       console.error("Failed to load vacancies");
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   const fetchPincodeDetails = async (pincode) => {
//   if (pincode.length !== 6) return;
//   setIsFetchingPincode(true);
//   try {
//     const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//     const data = await res.json();
//     if (data[0]?.Status === "Success") {
//       const offices = data[0].PostOffice;
//       setCityOptions(offices);
//       // Auto-fill with first option
//       setFormData(prev => ({
//         ...prev,
//         city: offices[0].Name,
//         location: offices[0].Name, // Syncing location with city
//         state: offices[0].State,
//         district: offices[0].District,
//         country: offices[0].Country
//       }));
//     }
//   } catch (err) { toast.error("Geo-sync failed"); }
//   finally { setIsFetchingPincode(false); }
// };

//   const fetchJDDetails = async (jdId) => {
//   // If we already have the data, don't fetch again
//   if (templateDetails[jdId]) return;

//   setLoadingJD(jdId);
//   try {
//     const res = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${jdId}`);
//     const data = await res.json();
//     setTemplateDetails(prev => ({
//       ...prev,
//       [jdId]: data
//     }));
//   } catch (err) {
//     toast.error("Failed to fetch job protocol details");
//   } finally {
//     setLoadingJD(null);
//   }
// };

// const generateExpOptions = () => {
//   const options = [];
//   options.push(<option key="0.5" value="0.5">6 Months</option>);
//   for (let i = 1; i <= 10; i++) {
//     options.push(<option key={i} value={i}>{i} Year{i > 1 ? 's' : ''}</option>);
//   }
//   return options;
// };

//   // 2. Sequential Logic: Create JD -> Get ID -> Create Vacancy
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const loadingToast = toast.loading("Executing Multi-Stage Deployment...");

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

//       const jdResponse = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jdBody)
//       });

//       if (!jdResponse.ok) throw new Error("JD Protocol Creation Failed");
      
//       const jdData = await jdResponse.json();
//       const newJdId = jdData.id;

//       const vacancyBody = {
//         title: formData.title,
//         job_description_id: newJdId,
//         department_id: parseInt(formData.department_id),
//         number_of_openings: parseInt(formData.number_of_openings),
//         location: formData.location,
//         experience_required: formData.experience_required,
//         salary_range: formData.salary_range,
//         status: formData.status,
//         deadline_date: formData.deadline_date
//       };

//       const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(vacancyBody),
//       });

//       if (!vacancyRes.ok) throw new Error("Vacancy Deployment Failed");

//       toast.success("Vacancy Node Active & Linked! 🚀", { id: loadingToast });
      
//       // Refresh list and clear form
//       fetchVacancies();
//       setFormData({
//         title: "", department_id: "", number_of_openings: 1, location: "",
//         experience_required: "", salary_range: "", status: "open",
//         deadline_date: new Date().toISOString().split("T")[0],
//         content: "", responsibilities: "", requirements: ""
//       });

//     } catch (err) {
//       toast.error(err.message || "Transmission failed", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAccordion = (vacancy) => {
//   const isOpening = openAccordionId !== vacancy.id;
//   setOpenAccordionId(isOpening ? vacancy.id : null);
  
//   if (isOpening && vacancy.job_description_id) {
//     fetchJDDetails(vacancy.job_description_id);
//   }
// };

//   // Pagination Calculation
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVacancies = vacancies.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(vacancies.length / itemsPerPage);

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
//       <div className="max-w-7xl mx-auto space-y-12">
        
//         {/* HEADER STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
//           <ShieldCheck className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none" size={120} />
//           <div className="flex items-center gap-6 relative z-10">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//               <Zap size={32} strokeWidth={2.5} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Vacancy</h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> Recruitment System
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* --- EXISTING FORM LOGIC --- */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
             
//               <div className="space-y-5">
                
//                 <div className="relative" ref={dropdownRef}>
//   <label className={labelClass}>Department Node Selection</label>
  

//   <div 
//     onClick={() => setShowDeptDrop(!showDeptDrop)}
//     className="min-h-[45px] w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 transition-all shadow-sm"
//   >
//     {formData.department_id.length > 0 ? (
//       formData.department_id.map(id => {
//         const dept = departments.find(d => d.id.toString() === id.toString());
//         return (
//           <span key={id} className="flex items-center gap-1.5 px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95">
//             {dept?.name}
//             <X 
//               size={12} 
//               className="hover:text-red-200 cursor-pointer" 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setFormData({
//                   ...formData,
//                   department_id: formData.department_id.filter(item => item !== id)
//                 });
//               }}
//             />
//           </span>
//         );
//       })
//     ) : (
//       <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Select Department(s)...</span>
//     )}
//     <ChevronDown size={14} className={`ml-auto text-slate-400 transition-transform ${showDeptDrop ? 'rotate-180' : ''}`} />
//   </div>

 
//   {showDeptDrop && (
//     <div className="absolute z-[100] mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
   
//       <div className="p-3 border-b border-slate-50 bg-slate-50/50">
//         <div className="relative">
//           <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input 
//             autoFocus
//             placeholder="Search departments..."
//             value={deptSearch}
//             onChange={(e) => setDeptSearch(e.target.value)}
//             className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-blue-500"
//           />
//         </div>
//       </div>

      
//       <div className="max-h-60 overflow-y-auto custom-scrollbar-professional p-2">
//         {departments
//           .filter(d => d.name.toLowerCase().includes(deptSearch.toLowerCase()))
//           .map(dept => {
//             const isSelected = formData.department_id.includes(dept.id.toString());
//             return (
//               <button
//                 key={dept.id}
//                 type="button"
//                 onClick={() => {
//                   const currentIds = formData.department_id;
//                   const newIds = isSelected 
//                     ? currentIds.filter(id => id !== dept.id.toString())
//                     : [...currentIds, dept.id.toString()];
                  
//                   setFormData({ ...formData, department_id: newIds });
//                 }}
//                 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all mb-1
//                   ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-500'}
//                 `}
//               >
//                 {dept.name}
//                 {isSelected && <Check size={14} strokeWidth={3} />}
//               </button>
//             );
//           })}
//       </div>
//     </div>
//   )}
// </div>
//                 <div>
//                   <label className={labelClass}>Job Title</label>
//                   <input required placeholder="Position Name" className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Openings</label>
//                     <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
//                   </div>
                 
//                   <div className="space-y-5">
 
//   <div>
//     <label className={labelClass}>Candidate Status</label>
//     <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full">
//       <button
//         type="button"
//         onClick={() => {
//           setFormData({ ...formData, experience_required: "Fresher" });
//         }}
//         className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${
//           formData.experience_required === "Fresher"
//             ? "bg-white text-blue-600 shadow-sm border border-slate-100"
//             : "text-slate-500"
//         }`}
//       >
//         FRESHER
//       </button>
//       <button
//         type="button"
//         onClick={() => {
//           if (formData.experience_required === "Fresher") {
//             setFormData({ ...formData, experience_required: "0.5 - 1 Years" });
//           }
//         }}
//         className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${
//           formData.experience_required !== "Fresher"
//             ? "bg-white text-blue-600 shadow-sm border border-slate-100"
//             : "text-slate-500"
//         }`}
//       >
//         EXPERIENCED
//       </button>
//     </div>
//   </div>

  
//   {formData.experience_required !== "Fresher" && (
//     <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
//       <div>
//         <label className={labelClass}>Min Experience</label>
//         <select
//           className={inputClass}
//           value={formData.experience_required.split(" - ")[0] || "0.5"}
//           onChange={(e) => {
//             const max = formData.experience_required.split(" - ")[1] || "1";
//             setFormData({ ...formData, experience_required: `${e.target.value} - ${max} Years` });
//           }}
//         >
//           {generateExpOptions()}
//         </select>
//       </div>
//       <div>
//         <label className={labelClass}>Max Experience</label>
//         <select
//           className={inputClass}
//           value={formData.experience_required.split(" - ")[1]?.replace(" Years", "") || "1"}
//           onChange={(e) => {
//             const min = formData.experience_required.split(" - ")[0] || "0.5";
//             setFormData({ ...formData, experience_required: `${min} - ${e.target.value} Years` });
//           }}
//         >
//           {generateExpOptions()}
//         </select>
//       </div>
//     </div>
//   )}
// </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Location</label>
//                     <input placeholder="City" className={inputClass} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Salary</label>
//                     <input placeholder="Enter Salary" className={inputClass} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={labelClass}>Closing Date</label>
//                   <input type="date" className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div>
//               </div>
//               <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
//                 {loading ? <Loader2 className="animate-spin" size={18}/> : <><PlusCircle size={18} /> Save Vacancy</>}
//               </button>
//             </div>
//           </div> */}

//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 space-y-6">
              
//               {/* Department Multi-Select */}
//               <div className="relative" ref={dropdownRef}>
//                 <label className={labelClass}>Department</label>
//                 <div 
//                   onClick={() => setShowDeptDrop(!showDeptDrop)}
//                   className="min-h-[48px] w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center cursor-pointer hover:border-blue-400 transition-all shadow-inner"
//                 >
//                   {formData.department_id.length > 0 ? (
//                     formData.department_id.map(id => (
//                       <span key={id} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95">
//                         {departments.find(d => d.id.toString() === id.toString())?.name}
//                         <X size={12} className="hover:text-red-400" onClick={(e) => {
//                           e.stopPropagation();
//                           setFormData({...formData, department_id: formData.department_id.filter(item => item !== id)});
//                         }} />
//                       </span>
//                     ))
//                   ) : <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Select department...</span>}
//                 </div>
//                 {showDeptDrop && (
//                   <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
//                     <div className="p-3 border-b border-slate-50"><input autoFocus placeholder="Filter department..." value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} className="w-full px-3 py-2 bg-slate-50 rounded-lg text-[11px] font-bold outline-none" /></div>
//                     <div className="max-h-48 overflow-y-auto p-2">
//                       {departments.filter(d => d.name.toLowerCase().includes(deptSearch.toLowerCase())).map(dept => (
//                         <button key={dept.id} type="button" onClick={() => {
//                           const isSelected = formData.department_id.includes(dept.id.toString());
//                           setFormData({...formData, department_id: isSelected ? formData.department_id.filter(i => i !== dept.id.toString()) : [...formData.department_id, dept.id.toString()]});
//                         }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight mb-1 ${formData.department_id.includes(dept.id.toString()) ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>
//                           {dept.name} {formData.department_id.includes(dept.id.toString()) && <Check size={14} strokeWidth={3} />}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                  <div>
//                 <label className={labelClass}>Job Identity</label>
//                 <input required placeholder="Position Title" className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//               </div>
//                 <div>
//                   <label className={labelClass}>Opening</label>
//                   <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
//                 </div>
//                 {/* <div>
//                   <label className={labelClass}>Annual CTC (LPA)</label>
//                   <input placeholder="e.g. 5.5 - 8.0" className={inputClass} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                 </div> */}
//               </div>

//               {/* GEOLOCATION ENGINE */}
//     <div className="space-y-4 pt-2 border-t border-slate-50">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className={labelClass}>Pincode</label>
//           <div className="relative">
//             <input maxLength={6} placeholder="000000" className={inputClass} value={formData.pincode} 
//               onChange={(e) => {
//                 const val = e.target.value.replace(/\D/g, "");
//                 setFormData({...formData, pincode: val});
//                 if(val.length === 6) fetchPincodeDetails(val);
//               }} 
//             />
//             {isFetchingPincode && <Loader2 className="absolute right-3 top-2.5 animate-spin text-blue-500" size={16} />}
//           </div>
//         </div>
//         <div>
//           <label className={labelClass}>City</label>
//           {cityOptions.length > 1 ? (
//             <select className={`${inputClass} border-blue-200 bg-blue-50/30`} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value, location: e.target.value})}>
//               {cityOptions.map((o, i) => <option key={i} value={o.Name}>{o.Name}</option>)}
//             </select>
//           ) : (
//             <input readOnly placeholder="Auto-fetched" className={`${inputClass} opacity-60`} value={formData.city} />
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <input readOnly placeholder="District" className={`${inputClass} opacity-60`} value={formData.district} />
//         <input readOnly placeholder="State" className={`${inputClass} opacity-60`} value={formData.state} />
//       </div>
//     </div>

//               {/* Experience Logic */}
//               <div className="pt-2">
//                 <label className={labelClass}>Experience</label>
//                 <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-4">
//                   {["Fresher", "Experienced"].map(type => (
//                     <button key={type} type="button" onClick={() => setFormData({...formData, experience_required: type === "Fresher" ? "Fresher" : "1 - 3 Years"})} className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${ (type === "Fresher" && formData.experience_required === "Fresher") || (type === "Experienced" && formData.experience_required !== "Fresher") ? "bg-white text-blue-600 shadow-sm" : "text-slate-500" }`}>
//                       {type.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//                 {formData.experience_required !== "Fresher" && (
//                   <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
//                     <select className={inputClass} value={formData.experience_required.split(" - ")[0]} onChange={(e) => setFormData({...formData, experience_required: `${e.target.value} - ${formData.experience_required.split(" - ")[1] || '1'} Years`})}>
//                       {generateExpOptions()}
//                     </select>
//                     <select className={inputClass} value={formData.experience_required.split(" - ")[1]?.replace(" Years", "")} onChange={(e) => setFormData({...formData, experience_required: `${formData.experience_required.split(" - ")[0]} - ${e.target.value} Years`})}>
//                       {generateExpOptions()}
//                     </select>
//                   </div>
//                 )}
//               </div>

//               {/* SALARY RANGE & GENDER GRID */}
//     <div className="grid grid-cols-1 gap-4 pt-2">
//       {/* <div>
//         <label className={labelClass}>Budget Range (LPA)</label>
//         <div className="flex items-center gap-2">
//           <select className={inputClass} value={formData.salary_range.split(" - ")[0]} onChange={(e) => setFormData({...formData, salary_range: `${e.target.value} - ${formData.salary_range.split(" - ")[1] || '4'} LPA`})}>
//             {[1,2,3,4,5,6,7,8,9,10,12,15].map(v => <option key={v} value={v}>{v} LPA</option>)}
//           </select>
//           <span className="text-[10px] font-black text-slate-300">TO</span>
//           <select className={inputClass} value={formData.salary_range.split(" - ")[1]?.replace(" LPA", "")} onChange={(e) => setFormData({...formData, salary_range: `${formData.salary_range.split(" - ")[0] || '3'} - ${e.target.value} LPA`})}>
//             {[2,3,4,5,6,7,8,9,10,12,15,20,25].map(v => <option key={v} value={v}>{v} LPA</option>)}
//           </select>
//         </div>
//       </div> */}
//       <div className="space-y-2 pt-2">
//   <label className={labelClass}>Budget </label>
//   <div className="grid grid-cols-2 gap-4 items-center">
    
//     {/* MIN SALARY NODE */}
//     <div className="relative group">
//       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//         <IndianRupee size={12} strokeWidth={3} />
//       </div>
//       <input
//         type="number"
//         step="0.1"
//         placeholder="Min"
//         className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//         value={formData.salary_range.split(" - ")[0] || ""}
//         onChange={(e) => {
//           const min = e.target.value;
//           const max = formData.salary_range.split(" - ")[1] || "";
//           setFormData({ ...formData, salary_range: `${min} - ${max}` });
//         }}
//       />
//       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//         <span className="text-[8px] font-black text-slate-300 uppercase">Min</span>
//       </div>
//     </div>

//     {/* MAX SALARY NODE */}
//     <div className="relative group">
//       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
//         <IndianRupee size={12} strokeWidth={3} />
//       </div>
//       <input
//         type="number"
//         step="0.1"
//         placeholder="Max"
//         className={`${inputClass} pl-9 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//         value={formData.salary_range.split(" - ")[1] || ""}
//         onChange={(e) => {
//           const min = formData.salary_range.split(" - ")[0] || "";
//           const max = e.target.value;
//           setFormData({ ...formData, salary_range: `${min} - ${max}` });
//         }}
//       />
//       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//         <span className="text-[8px] font-black text-slate-300 uppercase">Max</span>
//       </div>
//     </div>

//   </div>
//   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
//     Range in Lakhs Per Annum
//   </p>
// </div>
     
//     </div>

//     <div className="space-y-6 pt-6 border-t border-slate-100">
      
//       {/* Contact Node Identity */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div>
//           <label className={labelClass}>Company Name</label>
//           <input required placeholder="Legal Entity Name" className={inputClass} value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} />
//         </div>
//         <div>
//           <label className={labelClass}>Contact Person Name</label>
//           <input required placeholder="Primary HR / Owner" className={inputClass} value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} />
//         </div>
//       </div>

//       {/* Communication Hub */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div>
//           <label className={labelClass}>Phone Number</label>
//           <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-600 transition-all">
//             <span className="px-3 py-2.5 bg-slate-100 text-[10px] font-black text-slate-400 border-r border-slate-200">+91</span>
//             <input maxLength={10} placeholder="9004949483" className="w-full px-3 bg-transparent text-[13px] font-bold outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
//           </div>
//         </div>
//         <div>
//           <label className={labelClass}>Email Address</label>
//           <input type="email" placeholder="hr@domain.co.in" className={inputClass} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
//         </div>
//       </div>

//       {/* Profile & Scale Nodes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div className="relative group">
//           <label className={labelClass}>Contact Person Profile</label>
//           <select className={`${inputClass} appearance-none pr-10`} value={formData.contact_profile} onChange={(e) => setFormData({...formData, contact_profile: e.target.value})}>
//             <option value="owner">Owner / Partner</option>
//             <option value="hr">HR Manager</option>
//             <option value="consultant">Third-party Consultant</option>
//           </select>
//           <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
//         </div>
//         <div className="relative group">
//           <label className={labelClass}>Organization Size</label>
//           <select className={`${inputClass} appearance-none pr-10`} value={formData.org_size} onChange={(e) => setFormData({...formData, org_size: e.target.value})}>
//             <option value="1-10">1 - 10 Employees</option>
//             <option value="11-50">11 - 50 Employees</option>
//             <option value="51-200">51 - 200 Employees</option>
//             <option value="200+">200+ Employees</option>
//           </select>
//           <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
//         </div>
//       </div>

//       {/* Urgency & Frequency Strategy */}
//       <div className="space-y-6 pt-2">
//         <div>
//           <label className={labelClass}>How soon do you want to fill the position?</label>
//           <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full">
//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, urgency: "immediate" })}
//               className={`flex-1 py-2.5 text-[9px] font-black rounded-xl transition-all ${formData.urgency === "immediate" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//             >
//               IMMEDIATELY (1-2 WEEKS)
//             </button>
//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, urgency: "wait" })}
//               className={`flex-1 py-2.5 text-[9px] font-black rounded-xl transition-all ${formData.urgency === "wait" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500"}`}
//             >
//               CAN WAIT
//             </button>
//           </div>
//         </div>

//         <div className="relative group">
//           <label className={labelClass}>How often do you need to hire?</label>
//           <select className={`${inputClass} appearance-none pr-10`} value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
//             <option value="monthly">Every Month</option>
//             <option value="quarterly">Every Quarter</option>
//             <option value="occasionally">Occasionally</option>
//           </select>
//           <ChevronDown size={14} className="absolute right-4 bottom-3 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none" />
//         </div>
//         <div>
//           <label className={labelClass}>Job Address</label>
//           <input required placeholder="Job Address" className={inputClass} value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} />
//         </div>
//       </div>
//     </div>

//               <div className="grid grid-cols-2 gap-5">
//                 {/* <div>
//                   <label className={labelClass}>Location</label>
//                   <input placeholder="City Name" className={inputClass} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                 </div> */}
//                  <div>
//         <label className={labelClass}>Gender</label>
//         <select className={inputClass} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
//           <option value="any">Any</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//         </select>
//       </div>
//                 <div>
//                   <label className={labelClass}>Closing Date</label>
//                   <input type="date" min={new Date().toISOString().split("T")[0]} className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div>
//               </div>

//               <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
//                 {loading ? <Loader2 className="animate-spin" size={20}/> : <><ShieldCheck size={20} /> Save Vacancy</>}
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">job Vacancy Template</h3>
//                 </div>
//               </div>
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} modules={quillModules} placeholder="Describe the role summary..." />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} modules={quillModules} placeholder="List tactical duties..." />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} modules={quillModules} placeholder="Skills and certifications..." />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>

//         <hr className="border-slate-200" />

//         {/* --- NEW VACANCY LIST SECTION (ACCORDION STYLE) --- */}
//         <div className="space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
//                 <Layers size={18} />
//               </div>
//               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Active Vacancies </h3>
//             </div>
//             <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//               {vacancies.length} Total Records Found
//             </div>
//           </div>

//           <div className="space-y-4">
//             {loadingList ? (
//               <div className="py-20 flex flex-col items-center gap-3">
//                 <Loader2 className="animate-spin text-blue-600" size={32} />
//                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fetching Vacancies...</p>
//               </div>
//             ) : currentVacancies.map((vacancy) => (
//               <div key={vacancy.id} className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md">
//                 {/* Accordion Header */}
//                 <div 
//                   // onClick={() => setOpenAccordionId(openAccordionId === vacancy.id ? null : vacancy.id)}
//                   onClick={() => toggleAccordion(vacancy)}
//                   className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
//                 >
//                   <div className="flex items-center gap-5 w-full md:w-auto">
//                     <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                       <Briefcase size={24} />
//                     </div>
//                     <div>
//                       <h4 className="text-[15px] font-black text-slate-900 tracking-tight">{vacancy.title}</h4>
//                       <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
//                           <MapPin size={12} className="text-blue-500" /> {vacancy.location}
//                         </span>
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                           <Briefcase  className="text-blue-500" size={12} /> Experience : {vacancy.experience_required || "Not Specified"} Years
//                         </span>
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                           <Users size={12} className="text-blue-500" /> {vacancy.number_of_openings} Slots
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
//                     <div className="text-right hidden sm:block">
//                       <p className="text-[10px] font-black text-slate-900 uppercase">₹{vacancy.salary_range}</p>
//                       <p className="text-[9px] font-bold text-slate-400 uppercase">Package Range</p>
//                     </div>
//                     <div className={`h-10 w-10 rounded-full flex items-center justify-center border border-slate-100 transition-all ${openAccordionId === vacancy.id ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
//                       <ChevronDown size={18} />
//                     </div>
//                   </div> */}
//                   {/* --- ACTION & ACCORDION CONTROL --- */}
// <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end pr-2">
//   {/* FINANCIAL METRIC NODE */}
//   <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
//     <div className="flex items-center justify-end gap-1.5">
//       <IndianRupee size={10} className="text-slate-900 stroke-[3]" />
//       <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
//         {/* Logic to handle both string ranges and numeric formatting */}
//         {isNaN(vacancy.salary_range) 
//           ? vacancy.salary_range 
//           : `${(vacancy.salary_range / 100000).toFixed(1)} LPA`
//         }
//       </p>
//     </div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
//       Annual CTC
//     </p>
//   </div>
//   {/* NEW: EDIT REGISTRY BUTTON */}
//   <button
//     onClick={(e) => {
//       e.stopPropagation(); // Stop accordion from opening
//       navigate(`/edit-vacancy/${vacancy.id}`); // Adjust this route to your edit page
//     }}
//     className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90 group"
//     title="Edit Vacancy Node"
//   >
//     <Edit3 size={18} strokeWidth={2.5} />
//   </button>

//   <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

//   {/* INTERACTIVE TOGGLE NODE */}
//   <div 
//   onClick={(e) => {
//     e.stopPropagation(); // Prevent double triggering since parent has onClick
//     toggleAccordion(vacancy);
//   }}
//     className={`group/btn h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm cursor-pointer
//       ${openAccordionId === vacancy.id 
//         ? 'bg-slate-900 border-slate-900 text-white shadow-slate-200' 
//         : 'bg-white border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
//       }`}
//   >
//     {openAccordionId === vacancy.id ? (
//       <X size={18} className="animate-in fade-in zoom-in duration-300 stroke-[2.5]" />
//     ) : (
//       <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-300 stroke-[2.5]" />
//     )}
//   </div>
// </div>
//                 </div>

//                 {/* Accordion Body */}
//                 {/* {openAccordionId === vacancy.id && (
//                   <div className="px-8 pb-8 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
//                       <div className="space-y-1">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                           <Clock size={12} /> Registry ID
//                         </p>
//                         <p className="text-xs font-bold text-slate-700">#VAC-{vacancy.id}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                           <Calendar size={12} /> Deadline
//                         </p>
//                         <p className="text-xs font-bold text-rose-500">{vacancy.deadline_date}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                           <Briefcase size={12} /> Experience Required
//                         </p>
//                         <p className="text-xs font-bold text-slate-700">{vacancy.experience_required || "Not Specified"}</p>
//                       </div>
//                     </div>
                    
//                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
//                        <p className="text-[10px] font-bold text-slate-500 italic uppercase">Full Job Description Linked via Registry Node ID: {vacancy.job_description_id}</p>
//                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:border-blue-500 transition-all">
//                          <FileText size={14} /> View Document
//                        </button>
//                     </div>
//                   </div>
//                 )} */}
//                 {/* Accordion Body */}
// {openAccordionId === vacancy.id && (
//   <div className="px-8 pb-10 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-500 bg-slate-50/30">
//     {loadingJD === vacancy.job_description_id ? (
//       <div className="py-10 flex flex-col items-center justify-center gap-3">
//         <Loader2 className="animate-spin text-blue-600" size={24} />
//         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Retrieving Protocol...</p>
//       </div>
//     ) : (
//       <div className="space-y-8">
//         {/* TOP INFO BAR */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
//            <div>
//              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Role</p>
//              <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//                {templateDetails[vacancy.job_description_id]?.title || vacancy.title}
//              </p>
//            </div>
//            <div>
//              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Number</p>
//              <p className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
//                GOEX-V-{vacancy.id}-REF-{vacancy.job_description_id}
//              </p>
//            </div>
//         </div>

//         {/* JOB DESCRIPTION CONTENT (FROM TEMPLATE API) */}
//         {/* <div className="space-y-4">
//           <div className="flex items-center gap-2">
//             <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
//             <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Job Description</h5>
//           </div>
          
//           <div className="prose prose-slate max-w-none">
          
//             <div 
//               className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer"
//               dangerouslySetInnerHTML={{ 
//                 __html: templateDetails[vacancy.job_description_id]?.content || "No protocol content available for this node." 
//               }} 
//             />
//           </div>
//         </div> */}

//         <div className="space-y-4">
//   <div className="flex items-center gap-2">
//     <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
//     <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//       Job Description
//     </h5>
//   </div>
  
//   {/* Added max-w-full and overflow-hidden to protect the grid container */}
//   <div className="prose prose-slate max-w-full overflow-hidden">
//     <div 
      
//       className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer break-words [overflow-wrap:anywhere]"
//       dangerouslySetInnerHTML={{ 
//         __html: templateDetails[vacancy.job_description_id]?.content || "No protocol content available for this node." 
//       }} 
//     />
//   </div>
// </div>
        

//         {/* ACTION STRIP */}
//         <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
//           {/* <button className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase group">
//             Save Job <PlusCircle size={16} className="group-hover:text-blue-600 transition-colors" />
//           </button> */}
          
//           <button 
//           onClick={() => navigate(`/vacancy-details/${vacancy.id}`)}
//           className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95">
//             Read full job description <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     )}
//   </div>
// )}
//               </div>
//             ))}
//           </div>

//           {/* PAGINATION CONTROLS */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-4 pt-6">
//               <button 
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(p => p - 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <div className="flex items-center gap-2">
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-500'}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button 
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(p => p + 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//       `}} />
//     </div>
//   );
// };

// export default VacanciesPage;
//*****************************************************working code phase 1 23/06/26******************************************************** */
// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import { useNavigate } from "react-router-dom"; 
// import "react-quill-new/dist/quill.snow.css";
// import { 
//   Briefcase, 
//   MapPin, 
//   Users, 
//   Calendar, 
//   IndianRupee,
//   Layers, 
//   ArrowRight,
//   FileText, 
//   PlusCircle, 
//   X,
//   Info,
//   Edit3,
//   ShieldCheck,
//   Zap,
//   Loader2,
//   ChevronDown,
//   Plus,
//   Clock,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacanciesPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();
//   // --- NEW STATE FOR LISTING & PAGINATION ---
//   const [vacancies, setVacancies] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);
//   const [openAccordionId, setOpenAccordionId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const [templateDetails, setTemplateDetails] = useState({}); // Stores { [jdId]: { title, content } }
// const [loadingJD, setLoadingJD] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
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

//   // 1. Fetch Master Data & Vacancies
//   useEffect(() => {
//     fetchMasters();
//     fetchVacancies();
//   }, []);

//   const fetchMasters = async () => {
//     try {
//       const res = await fetch("https://apihrr.goelectronix.co.in/departments");
//       const data = await res.json();
//       setDepartments(data || []);
//     } catch (err) {
//       toast.error("Registry connection failed");
//     }
//   };

//   const fetchVacancies = async () => {
//     setLoadingList(true);
//     try {
//       // Fetching with high limit as per your URL example
//       const res = await fetch("https://apihrr.goelectronix.co.in/vacancies?skip=0&limit=100");
//       const data = await res.json();
//       setVacancies(data || []);
//     } catch (err) {
//       console.error("Failed to load vacancies");
//     } finally {
//       setLoadingList(false);
//     }
//   };


//   const fetchJDDetails = async (jdId) => {
//   // If we already have the data, don't fetch again
//   if (templateDetails[jdId]) return;

//   setLoadingJD(jdId);
//   try {
//     const res = await fetch(`https://apihrr.goelectronix.co.in/job-descriptions/${jdId}`);
//     const data = await res.json();
//     setTemplateDetails(prev => ({
//       ...prev,
//       [jdId]: data
//     }));
//   } catch (err) {
//     toast.error("Failed to fetch job protocol details");
//   } finally {
//     setLoadingJD(null);
//   }
// };

//   // 2. Sequential Logic: Create JD -> Get ID -> Create Vacancy
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const loadingToast = toast.loading("Executing Multi-Stage Deployment...");

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

//       const jdResponse = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jdBody)
//       });

//       if (!jdResponse.ok) throw new Error("JD Protocol Creation Failed");
      
//       const jdData = await jdResponse.json();
//       const newJdId = jdData.id;

//       const vacancyBody = {
//         title: formData.title,
//         job_description_id: newJdId,
//         department_id: parseInt(formData.department_id),
//         number_of_openings: parseInt(formData.number_of_openings),
//         location: formData.location,
//         experience_required: formData.experience_required,
//         salary_range: formData.salary_range,
//         status: formData.status,
//         deadline_date: formData.deadline_date
//       };

//       const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(vacancyBody),
//       });

//       if (!vacancyRes.ok) throw new Error("Vacancy Deployment Failed");

//       toast.success("Vacancy Node Active & Linked! 🚀", { id: loadingToast });
      
//       // Refresh list and clear form
//       fetchVacancies();
//       setFormData({
//         title: "", department_id: "", number_of_openings: 1, location: "",
//         experience_required: "", salary_range: "", status: "open",
//         deadline_date: new Date().toISOString().split("T")[0],
//         content: "", responsibilities: "", requirements: ""
//       });

//     } catch (err) {
//       toast.error(err.message || "Transmission failed", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAccordion = (vacancy) => {
//   const isOpening = openAccordionId !== vacancy.id;
//   setOpenAccordionId(isOpening ? vacancy.id : null);
  
//   if (isOpening && vacancy.job_description_id) {
//     fetchJDDetails(vacancy.job_description_id);
//   }
// };

//   // Pagination Calculation
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentVacancies = vacancies.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(vacancies.length / itemsPerPage);

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
//       <div className="max-w-7xl mx-auto space-y-12">
        
//         {/* HEADER STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
//           <ShieldCheck className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none" size={120} />
//           <div className="flex items-center gap-6 relative z-10">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//               <Zap size={32} strokeWidth={2.5} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Vacancy</h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> Recruitment System
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* --- EXISTING FORM LOGIC --- */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
//               {/* <div className="flex items-center gap-2 mb-4">
//                 <Edit3 size={16} className="text-blue-600" />
//                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Configuration</h3>
//               </div> */}
//               <div className="space-y-5">
//                 <div>
//                   <label className={labelClass}>Department</label>
//                   <select required className={inputClass} value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
//                     <option value="">Choose Department...</option>
//                     {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className={labelClass}>Job Title</label>
//                   <input required placeholder="Position Name" className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Openings</label>
//                     <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Experience</label>
//                     <input placeholder="2-5 Years" className={inputClass} value={formData.experience_required} onChange={(e) => setFormData({...formData, experience_required: e.target.value})} />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Location</label>
//                     <input placeholder="City" className={inputClass} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Salary</label>
//                     <input placeholder="Enter Salary" className={inputClass} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={labelClass}>Closing Date</label>
//                   <input type="date" className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div>
//               </div>
//               <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
//                 {loading ? <Loader2 className="animate-spin" size={18}/> : <><PlusCircle size={18} /> Save Vacancy</>}
//               </button>
//             </div>
//           </div>

//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <FileText size={18} className="text-blue-600" />
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">job Vacancy Template</h3>
//                 </div>
//               </div>
//               <div className="p-8 space-y-8">
//                 <div className="space-y-2">
//                   <label className={labelClass}>01. Overview</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} modules={quillModules} placeholder="Describe the role summary..." />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} modules={quillModules} placeholder="List tactical duties..." />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} modules={quillModules} placeholder="Skills and certifications..." />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>

//         <hr className="border-slate-200" />

//         {/* --- NEW VACANCY LIST SECTION (ACCORDION STYLE) --- */}
//         <div className="space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
//                 <Layers size={18} />
//               </div>
//               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Active Vacancies </h3>
//             </div>
//             <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
//               {vacancies.length} Total Records Found
//             </div>
//           </div>

//           <div className="space-y-4">
//             {loadingList ? (
//               <div className="py-20 flex flex-col items-center gap-3">
//                 <Loader2 className="animate-spin text-blue-600" size={32} />
//                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fetching Vacancies...</p>
//               </div>
//             ) : currentVacancies.map((vacancy) => (
//               <div key={vacancy.id} className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md">
//                 {/* Accordion Header */}
//                 <div 
//                   // onClick={() => setOpenAccordionId(openAccordionId === vacancy.id ? null : vacancy.id)}
//                   onClick={() => toggleAccordion(vacancy)}
//                   className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
//                 >
//                   <div className="flex items-center gap-5 w-full md:w-auto">
//                     <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                       <Briefcase size={24} />
//                     </div>
//                     <div>
//                       <h4 className="text-[15px] font-black text-slate-900 tracking-tight">{vacancy.title}</h4>
//                       <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
//                           <MapPin size={12} className="text-blue-500" /> {vacancy.location}
//                         </span>
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                           <Briefcase  className="text-blue-500" size={12} /> Experience : {vacancy.experience_required || "Not Specified"} Years
//                         </span>
//                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase border-l border-slate-200 pl-4">
//                           <Users size={12} className="text-blue-500" /> {vacancy.number_of_openings} Slots
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
//                     <div className="text-right hidden sm:block">
//                       <p className="text-[10px] font-black text-slate-900 uppercase">₹{vacancy.salary_range}</p>
//                       <p className="text-[9px] font-bold text-slate-400 uppercase">Package Range</p>
//                     </div>
//                     <div className={`h-10 w-10 rounded-full flex items-center justify-center border border-slate-100 transition-all ${openAccordionId === vacancy.id ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
//                       <ChevronDown size={18} />
//                     </div>
//                   </div> */}
//                   {/* --- ACTION & ACCORDION CONTROL --- */}
// <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end pr-2">
//   {/* FINANCIAL METRIC NODE */}
//   <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
//     <div className="flex items-center justify-end gap-1.5">
//       <IndianRupee size={10} className="text-slate-900 stroke-[3]" />
//       <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
//         {/* Logic to handle both string ranges and numeric formatting */}
//         {isNaN(vacancy.salary_range) 
//           ? vacancy.salary_range 
//           : `${(vacancy.salary_range / 100000).toFixed(1)} LPA`
//         }
//       </p>
//     </div>
//     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
//       Annual CTC
//     </p>
//   </div>
//   {/* NEW: EDIT REGISTRY BUTTON */}
//   <button
//     onClick={(e) => {
//       e.stopPropagation(); // Stop accordion from opening
//       navigate(`/edit-vacancy/${vacancy.id}`); // Adjust this route to your edit page
//     }}
//     className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90 group"
//     title="Edit Vacancy Node"
//   >
//     <Edit3 size={18} strokeWidth={2.5} />
//   </button>

//   <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

//   {/* INTERACTIVE TOGGLE NODE */}
//   <div 
//   onClick={(e) => {
//     e.stopPropagation(); // Prevent double triggering since parent has onClick
//     toggleAccordion(vacancy);
//   }}
//     className={`group/btn h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm cursor-pointer
//       ${openAccordionId === vacancy.id 
//         ? 'bg-slate-900 border-slate-900 text-white shadow-slate-200' 
//         : 'bg-white border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
//       }`}
//   >
//     {openAccordionId === vacancy.id ? (
//       <X size={18} className="animate-in fade-in zoom-in duration-300 stroke-[2.5]" />
//     ) : (
//       <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-300 stroke-[2.5]" />
//     )}
//   </div>
// </div>
//                 </div>

//                 {/* Accordion Body */}
//                 {/* {openAccordionId === vacancy.id && (
//                   <div className="px-8 pb-8 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
//                       <div className="space-y-1">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                           <Clock size={12} /> Registry ID
//                         </p>
//                         <p className="text-xs font-bold text-slate-700">#VAC-{vacancy.id}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                           <Calendar size={12} /> Deadline
//                         </p>
//                         <p className="text-xs font-bold text-rose-500">{vacancy.deadline_date}</p>
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                           <Briefcase size={12} /> Experience Required
//                         </p>
//                         <p className="text-xs font-bold text-slate-700">{vacancy.experience_required || "Not Specified"}</p>
//                       </div>
//                     </div>
                    
//                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
//                        <p className="text-[10px] font-bold text-slate-500 italic uppercase">Full Job Description Linked via Registry Node ID: {vacancy.job_description_id}</p>
//                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:border-blue-500 transition-all">
//                          <FileText size={14} /> View Document
//                        </button>
//                     </div>
//                   </div>
//                 )} */}
//                 {/* Accordion Body */}
// {openAccordionId === vacancy.id && (
//   <div className="px-8 pb-10 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-500 bg-slate-50/30">
//     {loadingJD === vacancy.job_description_id ? (
//       <div className="py-10 flex flex-col items-center justify-center gap-3">
//         <Loader2 className="animate-spin text-blue-600" size={24} />
//         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Retrieving Protocol...</p>
//       </div>
//     ) : (
//       <div className="space-y-8">
//         {/* TOP INFO BAR */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
//            <div>
//              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Role</p>
//              <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
//                {templateDetails[vacancy.job_description_id]?.title || vacancy.title}
//              </p>
//            </div>
//            <div>
//              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Number</p>
//              <p className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
//                GOEX-V-{vacancy.id}-REF-{vacancy.job_description_id}
//              </p>
//            </div>
//         </div>

//         {/* JOB DESCRIPTION CONTENT (FROM TEMPLATE API) */}
//         {/* <div className="space-y-4">
//           <div className="flex items-center gap-2">
//             <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
//             <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Job Description</h5>
//           </div>
          
//           <div className="prose prose-slate max-w-none">
          
//             <div 
//               className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer"
//               dangerouslySetInnerHTML={{ 
//                 __html: templateDetails[vacancy.job_description_id]?.content || "No protocol content available for this node." 
//               }} 
//             />
//           </div>
//         </div> */}

//         <div className="space-y-4">
//   <div className="flex items-center gap-2">
//     <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
//     <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
//       Job Description
//     </h5>
//   </div>
  
//   {/* Added max-w-full and overflow-hidden to protect the grid container */}
//   <div className="prose prose-slate max-w-full overflow-hidden">
//     <div 
      
//       className="text-[13px] leading-relaxed text-slate-600 font-medium space-y-4 custom-html-viewer break-words [overflow-wrap:anywhere]"
//       dangerouslySetInnerHTML={{ 
//         __html: templateDetails[vacancy.job_description_id]?.content || "No protocol content available for this node." 
//       }} 
//     />
//   </div>
// </div>
        

//         {/* ACTION STRIP */}
//         <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
//           {/* <button className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase group">
//             Save Job <PlusCircle size={16} className="group-hover:text-blue-600 transition-colors" />
//           </button> */}
          
//           <button 
//           onClick={() => navigate(`/vacancy-details/${vacancy.id}`)}
//           className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg active:scale-95">
//             Read full job description <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     )}
//   </div>
// )}
//               </div>
//             ))}
//           </div>

//           {/* PAGINATION CONTROLS */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-4 pt-6">
//               <button 
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(p => p - 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <div className="flex items-center gap-2">
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`h-8 w-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-500'}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button 
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(p => p + 1)}
//                 className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-blue-500 transition-all"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .enterprise-editor .ql-toolbar.ql-snow { border: 1px solid #E2E8F0 !important; border-top-left-radius: 1rem; border-top-right-radius: 1rem; background: #F8FAFC; }
//         .enterprise-editor .ql-container.ql-snow { border: 1px solid #E2E8F0 !important; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; min-height: 120px; }
//         .enterprise-editor .ql-editor { font-size: 13px; color: #334155; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//       `}} />
//     </div>
//   );
// };

// export default VacanciesPage;
//******************************************************************************************************************** */
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
//   Zap,
//   Loader2
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacanciesPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);

//   const [formData, setFormData] = useState({
//     title: "",
//     department_id: "",
//     number_of_openings: 1,
//     location: "",
//     experience_required: "",
//     salary_range: "",
//     status: "open",
//     deadline_date: new Date().toISOString().split("T")[0],
//     // Rich Text Content
//     content: "",
//     responsibilities: "",
//     requirements: ""
//   });

//   // 1. Fetch Departments only (Templates are now created fresh)
//   useEffect(() => {
//     const fetchMasters = async () => {
//       try {
//         const res = await fetch("https://apihrr.goelectronix.co.in/departments");
//         const data = await res.json();
//         setDepartments(data || []);
//       } catch (err) {
//         toast.error("Registry connection failed");
//       }
//     };
//     fetchMasters();
//   }, []);

//   // 2. Sequential Logic: Create JD -> Get ID -> Create Vacancy
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const loadingToast = toast.loading("Executing Multi-Stage Deployment...");

//     try {
//       // --- STAGE 1: CREATE JOB DESCRIPTION ---
//       const jdBody = {
//         title: formData.title,
//         role: formData.title, // Using title as role
//         content: formData.content,
//         responsibilities: formData.responsibilities,
//         requirements: formData.requirements,
//         location: formData.location,
//         salary_range: formData.salary_range
//       };

//       const jdResponse = await fetch("https://apihrr.goelectronix.co.in/job-descriptions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jdBody)
//       });

//       if (!jdResponse.ok) throw new Error("JD Protocol Creation Failed");
      
//       const jdData = await jdResponse.json();
//       const newJdId = jdData.id; // This is the ID we need (e.g., 4)

//       toast.success(`JD Protocol #${newJdId} Generated`, { id: loadingToast });

//       // --- STAGE 2: CREATE VACANCY ---
//       const vacancyBody = {
//         title: formData.title,
//         job_description_id: newJdId, // Link to the ID we just got
//         department_id: parseInt(formData.department_id),
//         number_of_openings: parseInt(formData.number_of_openings),
//         location: formData.location,
//         experience_required: formData.experience_required,
//         salary_range: formData.salary_range,
//         status: formData.status,
//         deadline_date: formData.deadline_date
//       };

//       const vacancyRes = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(vacancyBody),
//       });

//       if (!vacancyRes.ok) throw new Error("Vacancy Deployment Failed");

//       toast.success("Vacancy Node Active & Linked! 🚀", { id: loadingToast });
      
//       // Optional: Clear form after success
//       setFormData({
//         title: "", department_id: "", number_of_openings: 1, location: "",
//         experience_required: "", salary_range: "", status: "open",
//         deadline_date: new Date().toISOString().split("T")[0],
//         content: "", responsibilities: "", requirements: ""
//       });

//     } catch (err) {
//       toast.error(err.message || "Transmission failed", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

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
        
//         {/* HEADER STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
//           <ShieldCheck className="absolute -right-6 -bottom-6 text-slate-50 opacity-40 -rotate-12 pointer-events-none" size={120} />
//           <div className="flex items-center gap-6 relative z-10">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
//               <Zap size={32} strokeWidth={2.5} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Initialize Vacancy</h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> Multi-Stage API Protocol
//               </p>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* LEFT: METADATA */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <Edit3 size={16} className="text-blue-600" />
//                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Configuration</h3>
//               </div>

//               <div className="space-y-5">
//                 <div>
//                   <label className={labelClass}>Department Node</label>
//                   <select 
//                     required 
//                     className={inputClass} 
//                     value={formData.department_id}
//                     onChange={(e) => setFormData({...formData, department_id: e.target.value})}
//                   >
//                     <option value="">Choose Department...</option>
//                     {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//                   </select>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Job Title</label>
//                   <input required placeholder="Position Name" className={inputClass} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Openings</label>
//                     <input type="number" className={inputClass} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Experience</label>
//                     <input placeholder="2-5 Years" className={inputClass} value={formData.experience_required} onChange={(e) => setFormData({...formData, experience_required: e.target.value})} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelClass}>Location</label>
//                     <input placeholder="City" className={inputClass} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Salary</label>
//                     <input placeholder="Bracket" className={inputClass} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Deadline</label>
//                   <input type="date" className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div>
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={loading}
//                 className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {loading ? <Loader2 className="animate-spin" size={18}/> : <><PlusCircle size={18} /> Deploy Vacancy Node</>}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: RICH TEXT INPUTS */}
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
//                     <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData({...formData, content: v})} modules={quillModules} placeholder="Describe the role summary..." />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>02. Responsibilities</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.responsibilities} onChange={(v) => setFormData({...formData, responsibilities: v})} modules={quillModules} placeholder="List tactical duties..." />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className={labelClass}>03. Requirements</label>
//                   <div className="enterprise-editor">
//                     <ReactQuill theme="snow" value={formData.requirements} onChange={(v) => setFormData({...formData, requirements: v})} modules={quillModules} placeholder="Skills and certifications..." />
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

// export default VacanciesPage;
//***************************************************************************************************************** */
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

// const VacanciesPage = () => {
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

// export default VacanciesPage;
//*********************************************************working code phase 1*********************************************************** */
// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { 
//   Briefcase, 
//   MapPin, 
//   Users, 
//   Calendar, 
//   DollarSign, 
//   Layers, 
//   IndianRupee,
//   FileText, 
//   PlusCircle, 
//   CheckCircle, 
//   Info,
//   Clock,
//   ArrowRight
// } from "lucide-react";
// import toast from "react-hot-toast";

// const VacanciesPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const [templates, setTemplates] = useState([]);
//   const [selectedJD, setSelectedJD] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     job_description_id: "",
//     department_id: "",
//     number_of_openings: 1,
//     location: "",
//     experience_required: "",
//     salary_range: "",
//     status: "open",
//     deadline_date: new Date().toISOString().split("T")[0]
//   });

//   // 1. Fetch Masters
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
//         toast.error("Failed to load registry masters");
//       }
//     };
//     fetchMasters();
//   }, []);

//   // 2. Handle JD Selection & Prefill
//   const handleJDChange = (jdId) => {
//     const template = templates.find(t => t.id === parseInt(jdId));
//     if (template) {
//       setSelectedJD(template);
//       setFormData(prev => ({
//         ...prev,
//         job_description_id: template.id,
//         title: template.title,
//         location: template.location || "",
//         salary_range: template.salary_range || ""
//       }));
//       toast.success(`Template "${template.title}" loaded`);
//     } else {
//       setSelectedJD(null);
//       setFormData(prev => ({ ...prev, job_description_id: "" }));
//     }
//   };

//   // 3. Submit Data
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const loadingToast = toast.loading("Deploying new vacancy node...");

//     try {
//       const response = await fetch("https://apihrr.goelectronix.co.in/vacancies", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         toast.success("Vacancy Protocol Activated", { id: loadingToast });
//         // Reset form or navigate
//       } else {
//         throw new Error("API Refused connection");
//       }
//     } catch (err) {
//       toast.error("Deployment Failed", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all";
//   const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* HEADER SUMMARY STRIP */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="flex items-center gap-6">
//             <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
//               <Briefcase size={32} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Vacancies Entry</h2>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
//                 <Layers size={12} className="text-blue-500" /> Vacancies data send data 
//               </p>
//             </div>
//           </div>
          
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* LEFT: CONFIGURATION (FORM) */}
//           <div className="lg:col-span-7 space-y-6">
//             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className={labelClass}>Job Template (JD)</label>
//                   <select 
//                     required
//                     className={inputClass}
//                     onChange={(e) => handleJDChange(e.target.value)}
//                   >
//                     <option value="">Select JD Template</option>
//                     {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
//                   </select>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Department</label>
//                   <select 
//                     required
//                     className={inputClass}
//                     value={formData.department_id}
//                     onChange={(e) => setFormData({...formData, department_id: parseInt(e.target.value)})}
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className={labelClass}>Vacancy Title</label>
//                 <div className="relative">
//                   <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                   <input 
//                     required
//                     placeholder="e.g. Senior Backend Architect"
//                     className={`${inputClass} pl-12`}
//                     value={formData.title}
//                     onChange={(e) => setFormData({...formData, title: e.target.value})}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className={labelClass}>Openings</label>
//                   <div className="relative">
//                     <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                     <input type="number" min="1" className={`${inputClass} pl-10`} value={formData.number_of_openings} onChange={(e) => setFormData({...formData, number_of_openings: parseInt(e.target.value)})} />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={labelClass}>Experience</label>
//                   <input placeholder="e.g. 3-5 Years" className={inputClass} value={formData.experience_required} onChange={(e) => setFormData({...formData, experience_required: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Deadline</label>
//                   <input type="date" className={inputClass} value={formData.deadline_date} onChange={(e) => setFormData({...formData, deadline_date: e.target.value})} />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className={labelClass}>Location</label>
//                   <div className="relative">
//                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                     <input className={`${inputClass} pl-10`} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={labelClass}>Salary Range</label>
//                   <div className="relative">
//                     <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//                     <input className={`${inputClass} pl-10`} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} />
//                   </div>
//                 </div>
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={loading}
//                 className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {loading ? "Processing..." : <><PlusCircle size={18} /> Post Vaccancies</>}
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: JD PREVIEW (READ ONLY) */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
//               <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
//                 <Info size={16} className="text-blue-600" />
//                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Template Preview</h3>
//               </div>
              
//               <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
//                 {!selectedJD ? (
//                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
//                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
//                       <FileText size={40} />
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                       Select a template to <br/> preview metadata
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
//                     <div className="pb-6 border-b border-slate-100">
//                       <h4 className="text-lg font-black text-slate-900 mb-1">{selectedJD.title}</h4>
//                       <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded uppercase">{selectedJD.role}</span>
//                     </div>

//                     <div className="space-y-4">
//                       <label className={labelClass}>Job Overview</label>
//                       <div className="prose prose-sm max-w-none">
//                          <ReactQuill theme="snow" value={selectedJD.content} readOnly={true} modules={{toolbar: false}} className="enterprise-quill-preview"/>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <label className={labelClass}>Responsibilities</label>
//                       <div className="prose prose-sm max-w-none">
//                          <ReactQuill theme="snow" value={selectedJD.responsibilities} readOnly={true} modules={{toolbar: false}} className="enterprise-quill-preview"/>
//                       </div>
//                     </div>

//                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
//                        <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2">
//                          <Clock size={12} /> Registry Timestamp
//                        </p>
//                        <p className="text-[11px] font-bold text-slate-600">Created: {new Date(selectedJD.created_at).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .enterprise-quill-preview .ql-container.ql-snow { border: none !important; font-family: inherit; }
//         .enterprise-quill-preview .ql-editor { padding: 0 !important; color: #475569; font-weight: 500; font-size: 13px; }
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
//       `}} />
//     </div>
//   );
// };

// export default VacanciesPage;